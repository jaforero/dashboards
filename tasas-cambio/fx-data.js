/*!
 * fx-data.js · Capa de acceso a datos del dashboard de tasas de cambio
 * Fuente: https://github.com/jaforero/fx-bancos-centrales (contrato schema_version 1.x)
 * Sin dependencias. Uso en navegador: <script src="fx-data.js"></script> → window.FxData
 * Javier Forero · javierforero.co · MIT
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.FxData = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SOURCES = [
    "https://raw.githubusercontent.com/jaforero/fx-bancos-centrales/main/data",
    "https://cdn.jsdelivr.net/gh/jaforero/fx-bancos-centrales@main/data"
  ];
  var SUPPORTED_MAJOR = "1.";
  var CACHE_KEY = "jf-fx-cache-v1";

  /* ---------- Red: timeout + respaldo entre orígenes ---------- */
  function fetchJson(url, timeoutMs) {
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, timeoutMs) : null;
    return fetch(url, { cache: "no-cache", signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status + " en " + url);
        return r.json();
      })
      .finally(function () { if (timer) clearTimeout(timer); });
  }

  function fetchWithFallback(file, opts) {
    var sources = opts.sources || SOURCES;
    var i = 0, errors = [];
    function attempt() {
      if (i >= sources.length) return Promise.reject(new Error("Sin datos: " + errors.join(" | ")));
      var url = sources[i++] + "/" + file;
      return fetchJson(url, opts.timeoutMs || 10000)
        .then(function (json) { return { json: json, source: url }; })
        .catch(function (e) { errors.push(e.message); return attempt(); });
    }
    return attempt();
  }

  /* ---------- Validación mínima del contrato ---------- */
  function assertContract(doc, name) {
    if (!doc || typeof doc.schema_version !== "string")
      throw new Error(name + ": falta schema_version");
    if (doc.schema_version.indexOf(SUPPORTED_MAJOR) !== 0)
      throw new Error(name + ": contrato " + doc.schema_version + " no soportado (se espera " + SUPPORTED_MAJOR + "x)");
    return doc;
  }

  /* ---------- Caché del último dato bueno (modo sin conexión) ---------- */
  function readCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); } catch (e) { return null; }
  }
  function writeCache(payload) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(payload)); } catch (e) { /* cuota o modo privado */ }
  }

  /**
   * Carga latest.json (KPIs). Rápido: ~3 KB comprimidos.
   * Devuelve { latest, source, fromCache, fetchedAt }.
   */
  function loadLatest(opts) {
    opts = opts || {};
    return fetchWithFallback("latest.json", opts)
      .then(function (r) {
        var out = { latest: assertContract(r.json, "latest.json"), source: r.source,
                    fromCache: false, fetchedAt: new Date().toISOString() };
        var c = readCache() || {};
        c.latest = out.latest; c.latestFetchedAt = out.fetchedAt;
        writeCache(c);
        return out;
      })
      .catch(function (err) {
        var c = readCache();
        if (c && c.latest) return { latest: c.latest, source: "cache", fromCache: true,
                                    fetchedAt: c.latestFetchedAt, error: err.message };
        throw err;
      });
  }

  /**
   * Carga el histórico diario. Lo normal es rates_daily_compact.json (series oficiales en
   * columnas, ~56 KB comprimidos): las cruzadas se recalculan aquí con la misma regla del
   * backend (ver columnOf). Si el compacto no se puede leer, el contrato no es el esperado o
   * alguna cruzada recalculada no coincide con latest.json, se carga rates_daily.json
   * (todas las tasas, ~252 KB comprimidos): una cifra nunca se muestra sin respaldo.
   * Cárgalo después de pintar los KPIs. No se guarda en localStorage (tamaño).
   *
   * opts.latest: el latest.json ya cargado, para la verificación de las cruzadas.
   * Devuelve { daily, source, layout: "compact" | "rows", fallback: null | { reason, detail } }.
   */
  function loadDaily(opts) {
    opts = opts || {};
    function full(fallback) {
      return fetchWithFallback("rates_daily.json", opts).then(function (r) {
        return { daily: assertContract(r.json, "rates_daily.json"), source: r.source,
                 layout: "rows", fallback: fallback };
      });
    }
    function why(e) { return String(e && e.message || e).slice(0, 120); }
    return fetchWithFallback("rates_daily_compact.json", opts)
      .then(function (r) {
        try {
          var daily = fromCompact(assertContract(r.json, "rates_daily_compact.json"));
          var check = verifyCrosses(daily, opts.latest);
          if (check.ok) return { daily: daily, source: r.source, layout: "compact", fallback: null };
          return { fallback: { reason: "mismatch", detail: check.detail } };
        } catch (e) {
          // Un contrato no soportado también cae al completo: si ese tampoco lo es, el error se propaga igual.
          return { fallback: { reason: "unavailable", detail: why(e) } };
        }
      }, function (e) { return { fallback: { reason: "unavailable", detail: why(e) } }; })
      .then(function (res) { return res.daily ? res : full(res.fallback); });
  }

  /* ---------- Formato en columnas (rates_daily_compact.json) ---------- */
  function fromCompact(doc) {
    if (doc.layout !== "columnar" || !Array.isArray(doc.dates) || !doc.columns)
      throw new Error("rates_daily_compact.json: formato no reconocido");
    var n = doc.dates.length, cols = {};
    Object.keys(doc.columns).forEach(function (id) {
      var c = doc.columns[id];
      if (!c || c.values.length !== n) throw new Error("rates_daily_compact.json: columna " + id + " desalineada");
      var flags = new Uint8Array(n);
      for (var k = 0; k < c.filled.length; k++) flags[c.filled[k]] = 1;
      cols[id] = { values: c.values, filled: flags };
    });
    return { schema_version: doc.schema_version, as_of: doc.as_of, series: doc.series,
             dates: doc.dates, cols: cols, derived: {} };
  }

  /**
   * Columna de una serie. Las oficiales vienen en el archivo; una cruzada (series[id].inputs =
   * [numerador, denominador]) se calcula igual que el backend, día por día: si los dos insumos
   * tienen valor y el denominador no es 0, Number((num / den).toFixed(decimals)), y es relleno
   * si cualquiera de los dos lo es; si no, no hay dato. toFixed redondea sobre el valor binario
   * exacto, como transform.round_js del backend.
   */
  function columnOf(daily, id) {
    if (daily.cols[id]) return daily.cols[id];
    if (daily.derived[id]) return daily.derived[id];
    var m = daily.series[id];
    if (!m || !m.inputs || m.inputs.length !== 2) return null;
    var a = columnOf(daily, m.inputs[0]), b = columnOf(daily, m.inputs[1]);
    if (!a || !b) return null;
    var n = daily.dates.length, vals = new Array(n), flags = new Uint8Array(n);
    for (var i = 0; i < n; i++) {
      var x = a.values[i], y = b.values[i];
      if (x === null || y === null || y === 0) { vals[i] = null; continue; }
      vals[i] = Number((x / y).toFixed(m.decimals));
      flags[i] = a.filled[i] | b.filled[i];
    }
    return (daily.derived[id] = { values: vals, filled: flags });
  }

  /**
   * Guarda de producción: el último valor oficial de cada cruzada visible recalculada debe ser
   * idéntico (valor y fecha) al de latest.json. Solo se compara si ambos son del mismo as_of.
   */
  function verifyCrosses(daily, latest) {
    if (!latest || !latest.series || latest.as_of !== daily.as_of) return { ok: true, skipped: true };
    var ids = primarySeriesIds(daily);
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i], m = daily.series[id], e = latest.series[id];
      if (!m.inputs || !e || e.value === null || e.value === undefined) continue;
      var pts = seriesPoints(daily, id, { officialOnly: true });
      var last = pts.length ? pts[pts.length - 1] : null;
      if (!last || last.date !== e.date || last.value !== e.value)
        return { ok: false, detail: id + ": " + (last ? last.date + " " + last.value : "sin dato") + " ≠ " + e.date + " " + e.value };
    }
    return { ok: true };
  }

  /** Primera fecha del histórico, sea cual sea el formato. */
  function firstDate(daily) {
    if (daily.dates) return daily.dates.length ? daily.dates[0] : daily.as_of;
    return daily.rows && daily.rows.length ? daily.rows[0].date : daily.as_of;
  }

  /* ---------- Fechas: SIEMPRE como fecha local, nunca UTC ---------- */
  // new Date("2026-10-02") es medianoche UTC → en Bogotá se muestra 1-oct. Por eso:
  function parseDay(iso) {
    var p = iso.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function addDays(iso, n) {
    var d = parseDay(iso); d.setDate(d.getDate() + n);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  /* ---------- Selección de series ---------- */
  // Series para el usuario final: las marcadas primary en el contrato.
  // Así un país nuevo aparece solo, sin cambiar el dashboard.
  function primarySeriesIds(doc) {
    var s = doc.series || {};
    return Object.keys(s).filter(function (id) { return s[id].primary === true; });
  }

  /**
   * Puntos de una serie del histórico diario (formato en columnas o en filas).
   * opts.until (default daily.as_of): recorta filas futuras (la TRM y el FIX
   *   de liquidación publican vigencias posteriores a as_of).
   * opts.from: fecha inicial (inclusive).
   * opts.officialOnly: excluye días rellenados (fines de semana/festivos).
   * Devuelve [{date, value, filled}] sin nulos.
   */
  function seriesPoints(daily, id, opts) {
    opts = opts || {};
    var until = opts.until || daily.as_of;
    var from = opts.from || "0000-00-00";
    var out = [], i;
    if (daily.dates) {
      var col = columnOf(daily, id);
      if (!col) return out;
      for (i = 0; i < daily.dates.length; i++) {
        var d = daily.dates[i];
        if (d < from || d > until) continue;
        var cv = col.values[i];
        if (cv === null || cv === undefined) continue;
        var cf = col.filled[i] === 1;
        if (opts.officialOnly && cf) continue;
        out.push({ date: d, value: cv, filled: cf });
      }
      return out;
    }
    for (i = 0; i < daily.rows.length; i++) {
      var r = daily.rows[i];
      if (r.date < from || r.date > until) continue;
      var v = r[id];
      if (v === null || v === undefined) continue;
      var filled = !!(r.filled && r.filled.indexOf(id) >= 0);
      if (opts.officialOnly && filled) continue;
      out.push({ date: r.date, value: v, filled: filled });
    }
    return out;
  }

  /** Índice base 100 en la primera fecha oficial del rango (comparar monedas). */
  function rebase(points) {
    var base = null;
    for (var i = 0; i < points.length; i++) if (!points[i].filled) { base = points[i].value; break; }
    if (!base) return [];
    return points.map(function (p) { return { date: p.date, value: p.value / base * 100, filled: p.filled }; });
  }

  /**
   * Variación entre el último valor oficial ≤ asOf y el último oficial ≤ (asOf - days).
   * days: 30 ≈ mes, 365 ≈ año. Para "en lo que va del año" usa ytdChange.
   */
  function changeOver(daily, id, days, asOf) {
    asOf = asOf || daily.as_of;
    var pts = seriesPoints(daily, id, { until: asOf, officialOnly: true });
    if (!pts.length) return null;
    var end = pts[pts.length - 1], cut = addDays(asOf, -days), start = null;
    for (var i = pts.length - 1; i >= 0; i--) if (pts[i].date <= cut) { start = pts[i]; break; }
    if (!start) return null;
    return { from: start, to: end, pct: (end.value / start.value - 1) * 100 };
  }
  function ytdChange(daily, id, asOf) {
    asOf = asOf || daily.as_of;
    var pts = seriesPoints(daily, id, { until: asOf, officialOnly: true });
    var year = asOf.slice(0, 4), start = null;
    for (var i = pts.length - 1; i >= 0; i--) if (pts[i].date.slice(0, 4) < year) { start = pts[i]; break; }
    if (!start || !pts.length) return null;
    var end = pts[pts.length - 1];
    return { from: start, to: end, pct: (end.value / start.value - 1) * 100 };
  }

  /* ---------- Estado y frescura para la UI ---------- */
  // ok · stale · error. Nunca se oculta un dato: se muestra con su advertencia.
  function freshness(entry) {
    if (!entry) return { level: "error", reason: "sin datos" };
    if (entry.status && entry.status.indexOf("error") === 0) return { level: "error", reason: entry.error || entry.status };
    if (entry.status === "stale") return { level: "stale", reason: "la fuente no publica hace " + entry.days_since_official + " días" };
    return { level: "ok", reason: "" };
  }

  /* ---------- Formato ---------- */
  function formatValue(value, decimals, lang) {
    if (value === null || value === undefined) return "—";
    return new Intl.NumberFormat(lang === "en" ? "en-US" : "es-CO",
      { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  }
  function formatDay(iso, lang) {
    return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es-CO",
      { day: "numeric", month: "short", year: "numeric" }).format(parseDay(iso));
  }

  /**
   * Conversor: monto en moneda A → moneda B usando las series del contrato.
   * Solo pares con base USD o cruzadas publicadas. Devuelve {value, via, official}.
   */
  function convert(latest, amount, from, to) {
    if (from === to) return { value: amount, via: "identidad", official: true };
    var s = latest.series, ids = Object.keys(s);
    for (var i = 0; i < ids.length; i++) {
      var e = s[ids[i]];
      if (!e.primary || e.value == null) continue;
      var pr = e.pair.split("-"), official = e.method === "official";
      if (pr[0] === from && pr[1] === to) return { value: amount * e.value, via: ids[i], official: official, date: e.date };
      if (pr[0] === to && pr[1] === from) return { value: amount / e.value, via: ids[i], official: official, date: e.date };
    }
    return null;
  }

  return {
    SOURCES: SOURCES, loadLatest: loadLatest, loadDaily: loadDaily,
    primarySeriesIds: primarySeriesIds, seriesPoints: seriesPoints, firstDate: firstDate, rebase: rebase,
    changeOver: changeOver, ytdChange: ytdChange, freshness: freshness,
    formatValue: formatValue, formatDay: formatDay, parseDay: parseDay, convert: convert
  };
});
