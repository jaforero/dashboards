/*!
 * pop-data.js · Capa de datos de /poblacion-latam/
 * Fuente: https://github.com/jaforero/latam-population-official (contrato schema_version 1.x)
 * Lee en vivo de raw.githubusercontent.com, con respaldo en jsDelivr. Sin dependencias.
 * Javier Forero · javierforero.co · MIT
 */
(function (root) {
  "use strict";
  var SOURCES = [
    "https://raw.githubusercontent.com/jaforero/latam-population-official/main/data",
    "https://cdn.jsdelivr.net/gh/jaforero/latam-population-official@main/data"
  ];
  var ISO3 = ["ARG","BOL","BRA","CHL","COL","CRI","CUB","DOM","ECU","GTM","HND","HTI","MEX","NIC","PAN","PER","PRY","SLV","URY","VEN"];
  var SUPPORTED_MAJORS = ["1.", "2."];
  var CACHE_KEY = "jf-pop-cache-v2";
  var REPO_BLOB = "https://github.com/jaforero/latam-population-official/blob/main/";
  /* Fecha del último dato conocido al publicar la pieza: se muestra si no llega nada y no hay caché. */
  var PUBLISHED_DATA_DATE = "2026-11-01";

  function fetchJson(url, timeoutMs) {
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, timeoutMs) : null;
    return fetch(url, { cache: "no-cache", signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status + " en " + url); return r.json(); })
      .finally(function () { if (timer) clearTimeout(timer); });
  }

  function fetchWithFallback(file, sources) {
    var i = 0, errors = [];
    function attempt() {
      if (i >= sources.length) return Promise.reject(new Error("Sin datos: " + errors.join(" | ")));
      var base = sources[i++];
      return fetchJson(base + "/" + file, 15000)
        .then(function (json) { return { json: json, base: base }; })
        .catch(function (e) { errors.push(e.message); return attempt(); });
    }
    return attempt();
  }

  function assertContract(doc, name) {
    if (!doc || typeof doc.schema_version !== "string") throw new Error(name + ": falta schema_version");
    if (!SUPPORTED_MAJORS.some(function (m) { return doc.schema_version.indexOf(m) === 0; }))
      throw new Error(name + ": contrato " + doc.schema_version + " no soportado");
    return doc;
  }

  function slim(doc) {
    var c = {};
    Object.keys(doc).forEach(function (k) { c[k] = doc[k]; });
    c.records = doc.records.map(function (r) {
      return { iso3: r.iso3, year: r.year, population: r.population, series_type: r.series_type, source_id: r.source_id,
        source_tier: r.source_tier, vintage: r.vintage, growth: r.growth, raw_file: r.raw_file, retrieved_at: r.retrieved_at,
        reference_date: r.reference_date, scenario: r.scenario, interpolated: r.interpolated };
    });
    return c;
  }

  function readCache() { try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); } catch (e) { return null; } }
  function writeCache(p) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(p)); } catch (e) { /* cuota o modo privado */ } }

  /**
   * Devuelve { status, region, countries, failed, fromCache, origin }. region es null si su archivo no carga.
   * Rechaza solo si no hay status.json ni datos en caché.
   */
  function loadAll(opts) {
    var sources = (opts && opts.sources) || SOURCES;
    var statusP = fetchWithFallback("status.json", sources).then(function (r) { assertContract(r.json, "status.json"); return r; });
    var countryPs = ISO3.map(function (iso) {
      return fetchWithFallback("processed/" + iso + ".json", sources)
        .then(function (r) { return assertContract(r.json, iso); });
    });
    var regionP = fetchWithFallback("processed/region.json", sources)
      .then(function (r) { return assertContract(r.json, "región"); })
      .catch(function () { return null; });
    return Promise.all([statusP.catch(function (e) { return { error: e }; }), regionP].concat(countryPs.map(function (p) {
      return p.catch(function (e) { return { error: e }; });
    }))).then(function (res) {
      var st = res[0], region = res[1], countries = {}, failed = [];
      ISO3.forEach(function (iso, i) {
        var d = res[i + 2];
        if (d && !d.error) countries[iso] = d; else failed.push(iso);
      });
      if (st.error || failed.length === ISO3.length) {
        var cache = readCache();
        if (cache && cache.status) return { status: cache.status, region: cache.region || null, countries: cache.countries, failed: [], fromCache: true, origin: null, error: st.error };
        throw st.error || new Error("No cargó ningún país");
      }
      if (!failed.length) writeCache({ status: st.json, region: region, countries: Object.keys(countries).reduce(function (a, k) { a[k] = slim(countries[k]); return a; }, {}) });
      return { status: st.json, region: region, countries: countries, failed: failed, fromCache: false, origin: st.base };
    });
  }

  /* Las pirámides se piden solo al elegir el país: son el archivo más pesado por país. */
  function loadPyramid(iso) {
    return fetchWithFallback("processed/pyramids/" + iso + ".json", SOURCES)
      .then(function (r) { return assertContract(r.json, "pirámide " + iso); });
  }

  /* Revisión de términos por institución. La página funciona aunque este archivo no llegue. */
  function loadLicenses() {
    return fetchWithFallback("processed/licenses.json", SOURCES)
      .then(function (r) { return assertContract(r.json, "licencias"); });
  }

  root.PopData = { ISO3: ISO3, loadAll: loadAll, loadPyramid: loadPyramid, loadLicenses: loadLicenses, REPO_BLOB: REPO_BLOB, PUBLISHED_DATA_DATE: PUBLISHED_DATA_DATE, SOURCES: SOURCES };
})(typeof self !== "undefined" ? self : this);
