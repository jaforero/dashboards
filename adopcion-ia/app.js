/* /adopcion-ia/ · pantallas. El cálculo vive en calc.js y los textos en i18n.js.
   Privacidad: los archivos que carga el usuario se leen con File.text() y se quedan en memoria (ST.mis).
   Este archivo no hace ninguna llamada de red con esos datos ni los escribe en localStorage, sessionStorage,
   cookies o IndexedDB. Lo único que se guarda son las preferencias de idioma y tema del sitio. */
(function () {
  'use strict';
  const C = window.AdopcionCalc, STR = window.STR, EN = window.EJEMPLO_EN || { areas: {}, equipos: {}, procesos: {} };
  const $ = id => document.getElementById(id);
  /* URL pública del artículo (publicado el 14-nov-2026). Si cambia, cámbiala aquí y en index.html. */
  const ARTICLE_URL = 'https://javierforero.co/2026/11/14/medir-adopcion-ia-kpis/';
  const GA_OFF = 'ga-disable-G-MQ3K8EVKV0';
  const TABS = ['resumen', 'area', 'proceso', 'alertas', 'decidir', 'datos', 'metodo'];
  const KEYS = C.FILE_KEYS, MIN = C.DEFAULTS.minGrupo;
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } } };

  let LANG = window.__lang0 === 'en' ? 'en' : 'es';
  const today = new Date().toISOString().slice(0, 10);
  const ST = {
    mode: 'ejemplo', tab: 'resumen', ready: false,
    ej: { data: {}, rep: {} }, mis: { data: {}, rep: {}, extra: [] },
    corte: { ejemplo: window.EJEMPLO_CORTE || today, mis: today }, corteManual: false,
    P: { ventanaAct: C.DEFAULTS.ventanaAct, ventanaHab: C.DEFAULTS.ventanaHab, umbral: C.DEFAULTS.umbral, mitad: false },
    proc: null, sort: { k: 'area', dir: 1 }, open: new Set(), unidad: '', traces: {}, R: null, L: null,
  };
  const cur = () => ST.mode === 'ejemplo' ? ST.ej : ST.mis;
  const isEj = () => ST.mode === 'ejemplo';

  /* ---------- texto y formato ---------- */
  function T(k, p) { const s = STR[k]; if (!s) return k; return s[LANG === 'en' ? 1 : 0].replace(/\{(\w+)\}/g, (m, a) => p && p[a] != null ? p[a] : ''); }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const loc = () => LANG === 'en' ? 'en-US' : 'es-CO';
  const num = (v, d) => new Intl.NumberFormat(loc(), { maximumFractionDigits: d == null ? 2 : d, useGrouping: true }).format(Math.abs(v) < 5e-10 ? 0 : v);
  const pct = (v, d) => num(v * 100, d == null ? 2 : d) + (LANG === 'en' ? '%' : ' %');
  const sgn = v => Math.abs(v) < 5e-10 ? '' : v > 0 ? '+' : '−';
  const signed = (v, d) => sgn(v) + num(Math.abs(v), d);
  const spct = (v, d) => sgn(v) + pct(Math.abs(v), d);
  const frac = (a, b) => T('of', { a: num(a, 0), b: num(b, 0) });
  const fdate = iso => new Intl.DateTimeFormat(loc(), { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T00:00:00Z'));
  const fmonth = (ym, short) => new Intl.DateTimeFormat(loc(), short ? { month: 'short', timeZone: 'UTC' } : { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(ym + '-01T00:00:00Z'));
  const fileName = k => LANG === 'en' ? C.FILES[k].en : C.FILES[k].file;
  const fileNames = () => KEYS.reduce((o, k) => (o[k] = '<span class="mono">' + fileName(k) + '</span>', o), {});
  const COL_EN = {}; KEYS.forEach(k => C.FILES[k].cols.forEach(c => COL_EN[c.k] = c.en));
  const colName = c => STR['col.' + c] ? T('col.' + c) : (LANG === 'en' && COL_EN[c] ? COL_EN[c] : c);
  const lab = (kind, v) => isEj() && LANG === 'en' && EN[kind] && EN[kind][v] ? EN[kind][v] : v;
  const resUnit = () => isEj() ? T('u.h') : ST.unidad.trim();
  const withUnit = s => resUnit() ? s + ' ' + esc(resUnit()) : s;
  const reason = x => T('rs.' + x.reason, Object.assign(fileNames(), { c1: '<span class="mono">' + colName('min_elaboracion_suma') + '</span>', c2: '<span class="mono">' + colName('min_revision_suma') + '</span>' }));
  const ok = x => x && x.status === 'ok';

  /* ---------- celdas de las tablas de trazabilidad ---------- */
  function cell(col, v, csv) {
    if (v == null) return T('small');
    if (col === 'area') return lab('areas', v);
    if (col === 'equipo') return lab('equipos', v);
    if (col === 'nombre') return lab('procesos', v);
    if (col === 'grupo') return csv && LANG !== 'en' ? v : T('g.' + v);
    if (col === 'periodo') return csv && LANG !== 'en' ? v : T('p.' + v);
    if (col === 'semana_inicio' || col === 'id_proceso') return v;
    if (csv) return typeof v === 'number' ? String(+v.toFixed(6)) : v;
    if (col === 'tasa') return pct(v);
    if (col === 'verificado') return v ? '✓' : '—';
    return typeof v === 'number' ? num(v, 2) : v;
  }
  const isNum = col => !/^(area|equipo|nombre|grupo|periodo|semana_inicio|id_proceso)$/.test(col);
  function table(cols, rows, o) {
    o = o || {};
    const numCol = (c, i) => o.raw ? (o.text ? false : i > 0) : isNum(c);
    return `<div class="tbl-wrap" tabindex="0" role="region" aria-label="${esc(o.label || o.caption || '')}"><table>${o.caption ? `<caption>${esc(o.caption)}</caption>` : ''}<thead><tr>${cols.map((c, i) => `<th scope="col"${numCol(c, i) ? ' class="num"' : ''}>${esc(o.raw ? c : colName(c))}</th>`).join('')}</tr></thead><tbody>${rows.map(r => '<tr>' + r.map((v, i) => `<td${numCol(cols[i], i) && v != null ? ' class="num"' : v == null ? ' class="muted"' : ''}>${esc(o.raw ? v : cell(cols[i], v))}</td>`).join('') + '</tr>').join('')}</tbody></table></div>`;
  }

  /* ---------- tarjeta de indicador con «Ver de dónde sale» ---------- */
  const NUMS = { acceso: 1, activacion: 2, habito: 3, cobertura: 4, integracion: 5, resultado: 6, calidad: 7, tiempo: 8 };
  function describe(key, x) {
    const R = ST.R, o = { notes: [], warns: [], top: [] };
    const fp = { u: x.umbral, n: x.semanas, s: x.semanas };
    o.formula = T('f.' + key, key === 'habito' ? fp : { s: key === 'tiempo' || key === 'integracion' ? x.semanas : '' });
    if (key === 'resultado' || key === 'calidad') {
      const f = key === 'calidad' ? v => pct(v) : v => num(v, 2), m = x.medias;
      const d = key === 'calidad' ? v => T('u.pp', { v: signed(v * 100, 2) }) : v => withUnit(signed(v, 2));
      o.val = d(x.value);
      if (key === 'resultado' && x.relativo != null) o.notes.push(T('nt.rel', { p: spct(x.relativo) }));
      o.notes.push(x.sinComparacion ? T('nt.calcSolo', { a: f(m.cA), b: f(m.cD) }) : T('nt.calc', { a: f(m.cA), b: f(m.cD), c: f(m.kA), d: f(m.kD) }));
      if (key === 'resultado') o.notes.push(T('nt.sinsigno'));
      if (key === 'calidad' && x.alerta) o.top.push(T('w.calidad', { v: T('u.pp', { v: num(x.value * 100, 2) }) }));
      if (x.sinComparacion) o.warns.push(T('w.sincmp'));
      if (x.periodoCorto) o.warns.push(T('w.corto', { n: x.semanasMin, m: R.params.minSemanas }));
      o.t1 = T('n.resultado', { v: d(x.dCon) }); o.t2 = x.sinComparacion ? T('d.sincmp') : T('d.resultado', { v: d(x.dCmp) });
    } else if (key === 'tiempo') {
      o.val = x.semanas === 4 ? T('u.hmes', { v: num(x.value, 1) }) : T('u.hsem', { v: num(x.value, 1), s: x.semanas });
      o.notes.push(T('nt.tiempo', { a: num(x.bajaElab, 1), b: num(x.subeRev, 1), u: num(x.unidades, 0) }));
      o.t1 = T('n.tiempo', { v: T('u.min', { v: signed(x.netoMin, 1) }) }); o.t2 = T('d.tiempo', { v: num(x.unidades, 0) });
    } else {
      o.val = pct(x.value); o.frac = frac(x.num, x.den);
      o.num = T('n.' + key, fp) + ': ' + num(x.num, 0); o.den = T('d.' + key) + ': ' + num(x.den, 0);
      if (key === 'activacion') o.notes.push(T('nt.act', { d: R.params.ventanaAct }));
      if (key === 'habito') {
        o.notes.push(T(x.mitad ? 'nt.mitad' : 'nt.umb', fp));
        if (x.elegibles) o.notes.push(T('nt.elig', { p: pct(x.elegibles.value), f: frac(x.elegibles.num, x.elegibles.den) }));
      }
      if (key === 'integracion') {
        o.notes.push(T('nt.integ', { s: x.semanas }));
        if (x.todo && x.todo.semanas > x.semanas) o.notes.push(T('nt.integTodo', { s: x.todo.semanas, p: pct(x.todo.num / x.todo.den), f: frac(x.todo.num, x.todo.den) }));
      }
    }
    return o;
  }
  function traceHtml(id, key, x, o) {
    const tr = x.trace, R = ST.R; if (!tr) return '';
    ST.traces[id] = { key, cols: tr.cols, rows: tr.rows };
    const win = tr.ventana ? T('tr.range', { a: fdate(tr.ventana.desde), b: fdate(tr.ventana.hasta) })
      : T(/acceso|cobertura/.test(key) ? 'tr.corte' : 'tr.hasta', { d: fdate(R.params.corte) });
    const pair = o.num ? `<dt>${T('tr.num')}</dt><dd>${o.num}</dd><dt>${T('tr.den')}</dt><dd>${o.den}</dd>` : `<dt>${T('tr.t1')}</dt><dd>${o.t1}</dd><dt>${T('tr.t2')}</dt><dd>${o.t2}</dd>`;
    return `<details class="trace" data-k="${esc(id)}"${ST.open.has(id) ? ' open' : ''}><summary>${T('tr.sum')}<span class="sr-only">: ${NUMS[key]} · ${T('in.' + key)}</span></summary>
      <dl class="tr"><dt>${T('tr.formula')}</dt><dd>${o.formula}</dd>${pair}<dt>${T('tr.win')}</dt><dd>${win}</dd>
      <dt>${T('tr.files')}</dt><dd class="mono">${tr.archivos.map(fileName).join(', ')}</dd><dt>${T('tr.rows')}</dt><dd>${num(tr.filas, 0)}</dd></dl>
      ${table(tr.cols, tr.rows, { caption: T('tr.cap'), label: T('tr.sum') + ': ' + T('in.' + key) })}
      <p class="dl"><button type="button" class="btn" data-dl="${esc(id)}">${T('tr.dl')}</button></p></details>`;
  }
  function card(ctx, key, x, noTop) {
    const H = 'h3', head = `<article class="kpi"><${H} class="kpi-name">${NUMS[key]} · ${T('in.' + key)}</${H}>`;
    if (x.status === 'small') return head + `<p class="kpi-val none">${T('small')}</p><p class="kpi-note">${T('small.note', { n: MIN })}</p></article>`;
    if (x.status !== 'ok') return head + `<p class="kpi-val none">${T('nodata')}</p><p class="kpi-note">${reason(x)}</p></article>`;
    const o = describe(key, x);
    return head + (noTop ? [] : o.top).map(w => `<p class="warn top">${w}</p>`).join('') + `<p class="kpi-val">${o.val}</p>${o.frac ? `<p class="kpi-frac">${o.frac}</p>` : ''}`
      + o.notes.map(n => `<p class="kpi-note">${n}</p>`).join('') + o.warns.map(w => `<p class="warn">${w}</p>`).join('') + traceHtml(ctx + ':' + key, key, x, o) + '</article>';
  }

  /* ---------- 2 · las cuatro preguntas y 3 · lectura ---------- */
  function renderResumen() {
    const R = ST.R, I = R.ind, P = C.indProceso(R, ST.proc);
    const layer = (n, cards, extra) => `<section class="layer l${n}" aria-labelledby="ly${n}"><div class="layer-head"><span class="layer-n" aria-hidden="true">0${n}</span><h2 id="ly${n}">${T('ly.' + n)}</h2><p class="layer-q">${T('ly.' + n + '.q')}</p></div>${extra || ''}<div class="kpis c${cards.length}">${cards.join('')}</div></section>`;
    const sel = R.procesosU.length > 1 ? `<label class="field" style="margin-bottom:10px"><span>${T('ly.proc')}</span><select id="procSel">${R.procesosU.map(p => `<option value="${esc(p.id)}"${P.proceso && p.id === P.proceso.id ? ' selected' : ''}>${esc(lab('procesos', p.nombre))}</option>`).join('')}</select></label>`
      : P.proceso ? `<p class="kpi-note" style="margin:0 0 10px">${T('ly.proc')}: <b>${esc(lab('procesos', P.proceso.nombre))}</b></p>` : '';
    const pid = P.proceso ? P.proceso.id : '-';
    $('p-resumen').innerHTML = `<div class="funnel">
      ${layer(1, [card('g', 'acceso', I.acceso), card('g', 'activacion', I.activacion)])}
      ${layer(2, [card('g', 'habito', I.habito)])}
      ${layer(3, [card('g', 'cobertura', I.cobertura), card('g:' + pid, 'integracion', P.integracion)], sel)}
      ${layer(4, [card('g:' + pid, 'resultado', P.resultado), card('g:' + pid, 'calidad', P.calidad), card('g:' + pid, 'tiempo', P.tiempo)])}
    </div><section class="card"><h2>${T('rd.title')}</h2><p class="sub">${T('rd.sub')}</p>${reading(I, P)}</section>`;
  }
  function reading(I, P) {
    const parts = [], miss = [], unit = isEj() ? T('ej.unidad') : T('gen.unidad'), rn = isEj() ? T('ej.resName') : T('gen.resName');
    const add = (x, key, txt) => { if (ok(x)) parts.push(txt()); else miss.push(T('in.' + key).toLowerCase()); };
    add(I.activacion, 'activacion', () => T('rd.act', { v: pct(I.activacion.value) }));
    if (ok(I.habito) && I.habito.elegibles) parts.push(T('rd.hab', { v: pct(I.habito.elegibles.value) })); else miss.push(T('in.habito').toLowerCase());
    add(I.cobertura, 'cobertura', () => T('rd.cob', { v: pct(I.cobertura.value) }));
    add(P.integracion, 'integracion', () => T('rd.int', { v: pct(P.integracion.value), u: unit }));
    add(P.resultado, 'resultado', () => { const r = P.resultado, v = r.relativo != null ? spct(r.relativo) : withUnit(signed(r.value, 2)); return T(r.sinComparacion ? 'rd.resSolo' : 'rd.res', { r: rn, v }); });
    add(P.calidad, 'calidad', () => T('rd.cal', { v: T('u.pp', { v: signed(P.calidad.value * 100, 2) }) }));
    add(P.tiempo, 'tiempo', () => T('rd.tie', { v: P.tiempo.semanas === 4 ? T('u.hmes', { v: num(P.tiempo.value, 1) }) : T('u.hsem', { v: num(P.tiempo.value, 1), s: P.tiempo.semanas }) }));
    if (!parts.length) return `<p class="reading">${T('rd.none')}</p><p class="note">${T('rd.falta', { l: miss.join(', ') })}</p>`;
    let s = parts.join('; ') + '.'; s = s.charAt(0) === '<' ? s : s.charAt(0).toUpperCase() + s.slice(1);
    return `<p class="reading">${s}</p>` + (miss.length ? `<p class="note">${T('rd.falta', { l: miss.join(', ') })}</p>` : '');
  }

  /* ---------- 4 · por área ---------- */
  const AREA_COLS = ['acceso', 'activacion', 'habito', 'cobertura', 'integracion'];
  function renderArea() {
    const R = ST.R, s = ST.sort;
    if (!R.areas.length) { $('p-area').innerHTML = `<section class="card"><h2>${T('ar.title')}</h2><p class="sub">${T('ar.none', fileNames())}</p></section>`; return; }
    const val = (a, k) => k === 'area' ? lab('areas', a.area) : k === 'n' ? a.personas : ok(a[k]) ? a[k].value : null;
    const rows = R.areas.slice().sort((a, b) => {
      const x = val(a, s.k), y = val(b, s.k);
      if (x == null || y == null) return (x == null) - (y == null);
      return (typeof x === 'string' ? x.localeCompare(y, loc()) : x - y) * s.dir;
    });
    const td = x => ok(x) ? `<td class="num">${pct(x.value)}<small>${frac(x.num, x.den)}</small></td>`
      : x.status === 'small' ? `<td class="muted">${T('small')}</td>` : `<td class="muted">${T('nodata')}<small>${reason(x)}</small></td>`;
    const th = (k, label) => `<th scope="col"${k !== 'area' ? ' class="num"' : ''} aria-sort="${s.k === k ? (s.dir > 0 ? 'ascending' : 'descending') : 'none'}"><button type="button" class="sort" data-sort="${k}">${label}</button></th>`;
    const P = C.indProceso(R, ST.proc), I = R.ind;
    const tot = { acceso: I.acceso, activacion: I.activacion, habito: I.habito, cobertura: I.cobertura,
      integracion: (() => { const p = R.procesosU.filter(x => ok(x.integracion)); const n = p.reduce((t, x) => t + x.integracion.num, 0), d = p.reduce((t, x) => t + x.integracion.den, 0); return d ? { status: 'ok', value: n / d, num: n, den: d } : P.integracion; })() };
    $('p-area').innerHTML = `<section class="card"><h2>${T('ar.title')}</h2><p class="sub">${T('ar.sub')}</p>
      <div class="tbl-wrap" tabindex="0" role="region" aria-label="${T('ar.title')}"><table><caption>${T('ar.cap', { n: MIN })}</caption><thead><tr>${th('area', T('ar.area'))}${th('n', T('ar.n'))}${AREA_COLS.map(k => th(k, NUMS[k] + ' · ' + T('in.' + k))).join('')}</tr></thead>
      <tbody>${rows.map(a => `<tr><th scope="row">${esc(lab('areas', a.area))}</th><td class="num">${a.personas == null ? '—' : num(a.personas, 0)}</td>${AREA_COLS.map(k => td(a[k])).join('')}</tr>`).join('')}</tbody>
      <tfoot><tr><th scope="row">${T('ar.total')}</th><td class="num">${R.cargados.personas == null ? '—' : num(R.areas.reduce((t, a) => t + (a.personas || 0), 0), 0)}</td>${AREA_COLS.map(k => td(tot[k])).join('')}</tr></tfoot></table></div></section>`;
  }

  /* ---------- gráficos SVG propios ---------- */
  function slope(groups, fmt) {
    const W = 380, H = 214, xl = 62, xr = 180, top = 40, bot = H - 26;
    const vals = groups.flatMap(g => [g.a, g.b]); let mn = Math.min(...vals), mx = Math.max(...vals);
    if (mx - mn < 1e-9) { mx += Math.abs(mx) * .1 || 1; mn -= Math.abs(mn) * .1 || 1; }
    const pad = (mx - mn) * .1; mn -= pad; mx += pad;
    const y = v => bot - (v - mn) / (mx - mn) * (bot - top);
    const nudge = (ys, gap) => { const s = ys.map((v, i) => ({ i, v })).sort((p, q) => p.v - q.v);
      for (let k = 1; k < s.length; k++) if (s[k].v - s[k - 1].v < gap) { const m = (s[k].v + s[k - 1].v) / 2; s[k - 1].v = m - gap / 2; s[k].v = m + gap / 2; }
      const o = []; s.forEach(p => o[p.i] = p.v); return o; };
    const ly = nudge(groups.map(g => y(g.a)), 15), ry = nudge(groups.map(g => y(g.b)), 30);
    const alt = T('ch.alt') + ' ' + groups.map(g => T('ch.altG', { g: g.label, a: fmt(g.a), b: fmt(g.b) })).join(' ');
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(alt)}">
      <line class="gl" x1="${xl}" y1="${top - 8}" x2="${xl}" y2="${bot + 6}"/><line class="gl" x1="${xr}" y1="${top - 8}" x2="${xr}" y2="${bot + 6}"/>
      <text class="ax" x="${xl}" y="18" text-anchor="middle">${T('p.antes')}</text><text class="ax" x="${xr}" y="18" text-anchor="middle">${T('p.despues')}</text>
      ${groups.map((g, i) => `<line class="${g.cls}" x1="${xl}" y1="${y(g.a).toFixed(1)}" x2="${xr}" y2="${y(g.b).toFixed(1)}" stroke-width="3" stroke-linecap="round"${g.cls === 's-cmp' ? ' stroke-dasharray="6 5"' : ''}/>
        <circle class="${g.cls}" cx="${xl}" cy="${y(g.a).toFixed(1)}" r="4.5"/><circle class="${g.cls}" cx="${xr}" cy="${y(g.b).toFixed(1)}" r="4.5"/>
        <text class="lab ${g.cls}" x="${xl - 10}" y="${(ly[i] + 4).toFixed(1)}" text-anchor="end">${esc(fmt(g.a))}</text>
        <text class="lab ${g.cls}" x="${xr + 10}" y="${(ry[i] - 2).toFixed(1)}">${esc(fmt(g.b))}</text><text class="ax" x="${xr + 10}" y="${(ry[i] + 12).toFixed(1)}">${esc(g.label)}</text>`).join('')}</svg>`;
  }
  function columns(items, title) {
    const W = 380, H = 180, l = 14, bw = (W - 2 * l) / items.length, base = H - 26, mx = Math.max(1, ...items.map(i => i.v));
    const alt = title + '. ' + T('al.f.alt', { l: items.map(i => i.full + ': ' + num(i.v, 0)).join('; ') });
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(alt)}"><line class="gl" x1="${l}" y1="${base}" x2="${W - l}" y2="${base}"/>
      ${items.map((it, i) => { const h = it.v / mx * (base - 30), x = l + i * bw + bw * .18; return `<rect class="s-ia" x="${x.toFixed(1)}" y="${(base - h).toFixed(1)}" width="${(bw * .64).toFixed(1)}" height="${h.toFixed(1)}" rx="3"/>
        <text class="lab" x="${(x + bw * .32).toFixed(1)}" y="${(base - h - 6).toFixed(1)}" text-anchor="middle">${num(it.v, 0)}</text><text class="ax" x="${(x + bw * .32).toFixed(1)}" y="${H - 8}" text-anchor="middle">${esc(it.label)}</text>`; }).join('')}</svg>`;
  }

  /* ---------- 5 · por proceso ---------- */
  function renderProceso() {
    const R = ST.R;
    if (!R.procesosU.length) { $('p-proceso').innerHTML = `<section class="card"><h2>${T('pr.title')}</h2><p class="sub">${T('pr.none', { r: reason(R.ind.integracion) })}</p></section>`; return; }
    const unitField = isEj() ? '' : `<label class="field" style="max-width:340px;margin-top:10px"><span>${T('pr.unidad')}</span><input type="text" id="unidadRes" maxlength="20" value="${esc(ST.unidad)}"></label>`;
    $('p-proceso').innerHTML = `<section class="card"><h2>${T('pr.title')}</h2><p class="sub">${T('pr.sub')}</p>${unitField}</section>` + R.procesosU.map(p => {
      const eq = g => p.equipos[g].length ? p.equipos[g].map(e => esc(lab('equipos', e))).join(', ') : T('pr.sin');
      const gl = g => T('g.' + g) + (p.equipos[g].length === 1 && lab('equipos', p.equipos[g][0]).length <= 18 ? ' · ' + lab('equipos', p.equipos[g][0]) : '');
      const fig = (x, cap, fmt, chg) => {
        if (!ok(x)) return '';
        const m = x.medias, gs = [{ label: gl('con_ia'), cls: 's-ia', a: m.cA, b: m.cD }].concat(x.sinComparacion ? [] : [{ label: gl('comparacion'), cls: 's-cmp', a: m.kA, b: m.kD }]);
        return `<figure class="chart"><figcaption>${cap}</figcaption><div class="chart-scroll">${slope(gs, fmt)}</div>
          <details class="data"><summary>${T('ch.data')}</summary>${table([T('ch.grupo'), T('p.antes'), T('p.despues'), T('ch.cambio')], gs.map(g => [g.label, fmt(g.a), fmt(g.b), chg(g.b - g.a)]), { raw: true, label: cap })}</details></figure>`;
      };
      const u = resUnit(), ctx = 'p:' + p.id;
      return `<section class="card" aria-labelledby="pr-${esc(p.id)}">
        ${ok(p.calidad) && p.calidad.alerta ? `<p class="warn top" role="note">${T('w.calidad', { v: T('u.pp', { v: num(p.calidad.value * 100, 2) }) })}</p>` : ''}
        <h2 id="pr-${esc(p.id)}">${esc(lab('procesos', p.nombre))}</h2>
        <p class="sub">${T('pr.meta', { a: p.area ? esc(lab('areas', p.area)) : '—', x: eq('con_ia'), y: eq('comparacion') })}</p>
        <div class="kpis c2">${['integracion', 'resultado', 'calidad', 'tiempo'].map(k => card(ctx, k, p[k], true)).join('')}</div>
        <div class="charts">${fig(p.resultado, T('ch.res') + (u ? ' (' + esc(u) + ')' : ''), v => num(v, 1), v => signed(v, 1))}${fig(p.calidad, T('ch.cal'), v => pct(v, 1), v => T('u.pp', { v: signed(v * 100, 1) }))}</div></section>`;
    }).join('');
  }

  /* ---------- 6 · alertas ---------- */
  function renderAlertas() {
    const R = ST.R, c = R.concentracion, f = R.fuera;
    let h = `<section class="card"><p class="sub" style="margin:0">${T('al.intro')}</p></section><section class="card"><h2>${T('al.c.title')}</h2>`;
    if (ok(c)) {
      const p = pct(c.value), q = pct(1 - c.value), w = T('tr.range', { a: fdate(c.ventana.desde), b: fdate(c.ventana.hasta) });
      h += `<p class="reading" style="font-weight:400;margin-top:8px">${T('al.c.text', { p, a: num(c.top, 0), b: num(c.base, 0) })}</p><p class="sub">${T('al.c.sub', { w })}</p>
        <div class="bar" role="img" aria-label="${esc(T('al.c.alt', { p, q }))}"><i class="top" style="width:${(c.value * 100).toFixed(2)}%"></i><i class="rest" style="width:${((1 - c.value) * 100).toFixed(2)}%"></i></div>
        <p class="legend"><span><b style="background:var(--primary)"></b>${T('al.c.top')}: ${p}</span><span><b style="background:var(--bg2)"></b>${T('al.c.rest')}: ${q}</span></p>
        <div style="margin-top:12px">${table([T('al.c.g'), T('al.c.p'), T('al.c.a'), T('al.c.s')], [[T('al.c.top'), num(c.top, 0), num(c.num, 0), p], [T('al.c.rest'), num(c.base - c.top, 0), num(c.den - c.num, 0), q]], { raw: true, label: T('al.c.title') })}</div>`;
    } else h += `<p class="kpi-val none">${c.status === 'small' ? T('small') : T('nodata')}</p><p class="kpi-note">${c.status === 'small' ? T('al.c.small', { n: c.top, m: MIN }) : reason(c)}</p>`;
    h += `</section><section class="card"><h2>${T('al.f.title')}</h2><p class="sub">${T('al.f.sub')}</p>`;
    if (ok(f)) {
      const lt = f.trafico[f.trafico.length - 1], lg = f.gasto[f.gasto.length - 1];
      const fact = (o, a, b) => o ? `<div class="kpi"><p class="kpi-frac" style="font-size:1.05rem">${T(a, { s: num(o.servicios, 0), m: fmonth(o.mes) })}</p><p class="kpi-note">${T(b, { e: num(o.eventos, 0) })}</p></div>` : '';
      const meses = [...new Set([...f.trafico, ...f.gasto].map(o => o.mes))].sort();
      const get = (arr, m, k) => { const o = arr.find(x => x.mes === m); return o ? num(o[k], 0) : '—'; };
      h += `<div class="kpis c2">${fact(lt, 'al.f.traf', 'al.f.trafE')}${fact(lg, 'al.f.gasto', 'al.f.gastoE')}</div>
        <p class="warn" role="note">${T('al.f.note')}</p>
        ${f.trafico.length ? `<div class="charts"><figure class="chart"><figcaption>${T('al.f.ch')}</figcaption><div class="chart-scroll">${columns(f.trafico.slice(-8).map(o => ({ v: o.servicios, label: fmonth(o.mes, true), full: fmonth(o.mes) })), T('al.f.ch'))}</div></figure></div>` : ''}
        <div style="margin-top:12px">${table([T('al.f.mes'), T('al.f.c1'), T('al.f.c2'), T('al.f.c3'), T('al.f.c4')], meses.map(m => [fmonth(m), get(f.trafico, m, 'servicios'), get(f.trafico, m, 'eventos'), get(f.gasto, m, 'servicios'), get(f.gasto, m, 'eventos')]), { raw: true, caption: T('al.f.cap') })}</div>`;
    } else h += `<p class="kpi-val none">${T('nodata')}</p><p class="kpi-note">${reason(f)}</p>`;
    $('p-alertas').innerHTML = h + '</section>';
  }

  /* ---------- 7 · qué decidir ---------- */
  function renderDecidir() {
    const R = ST.R, I = R.ind, low = k => T('in.' + k).toLowerCase();
    const rows = ST.L.map((l, i) => {
      const n = i + 1; let ev = [], evaluable = true;
      if (l.pair) {
        evaluable = ok(I[l.pair[0]]) && ok(I[l.pair[1]]);
        ev = l.areas.map(a => T('ev.area2', { area: '<b>' + esc(lab('areas', a.area)) + '</b>', n1: low(l.pair[0]), a: pct(a[l.pair[0]].value), A: pct(I[l.pair[0]].value), n2: low(l.pair[1]), b: pct(a[l.pair[1]].value), B: pct(I[l.pair[1]].value) }));
      } else if (l.id === 'tiempo_sin_resultado') {
        evaluable = R.procesosU.some(p => ok(p.tiempo) && ok(p.calidad));
        ev = l.procesos.map(p => { const t = T('u.hmes', { v: num(p.tiempo.value, 1) }), pn = '<b>' + esc(lab('procesos', p.nombre)) + '</b>';
          return p.calidad.alerta ? T('ev.tiempo', { proc: pn, t, c: T('u.pp', { v: signed(p.calidad.value * 100, 2) }) }) : T('ev.tiempoSolo', { proc: pn, t }); });
      } else {
        evaluable = ok(R.concentracion);
        if (l.concentracion) { ev.push(T('ev.conc', { p: pct(l.concentracion.value) }));
          if (l.extremos) ev.push(T('ev.ext', { a1: esc(lab('areas', l.extremos[0].area)), v1: pct(l.extremos[0].habito.value), a2: esc(lab('areas', l.extremos[1].area)), v2: pct(l.extremos[1].habito.value) })); }
      }
      const tag = !evaluable ? `<span class="tag">${T('nodata')}</span>` : l.match ? `<span class="tag on">${T('dc.on')}</span>` : `<span class="tag">${T('dc.off')}</span>`;
      return `<tr${l.match ? ' class="hit"' : ''}><th scope="row">${T('dc.' + n + '.s')}</th><td>${T('dc.' + n + '.h')}</td><td>${T('dc.' + n + '.a')}</td><td>${tag}${ev.map(e => `<div>${e}</div>`).join('')}<small>${T('dc.' + n + '.r')}</small></td></tr>`;
    });
    $('p-decidir').innerHTML = `<section class="card"><h2>${T('dc.title')}</h2><p class="sub">${T('dc.sub')}</p>
      <div class="tbl-wrap" tabindex="0" role="region" aria-label="${T('dc.title')}"><table style="min-width:760px"><thead><tr><th scope="col">${T('dc.c1')}</th><th scope="col">${T('dc.c2')}</th><th scope="col">${T('dc.c3')}</th><th scope="col">${T('dc.c4')}</th></tr></thead><tbody>${rows.join('')}</tbody></table></div></section>`;
  }

  /* ---------- 8 · usa tus datos ---------- */
  function errText(e) {
    const spec = Object.values(C.FILES).flatMap(f => f.cols).find(c => c.k === e.col);
    const p = Object.assign({}, e, { file: esc(e.file), val: esc(e.val), col: esc(LANG === 'en' && e.code !== 'col_falta' ? colName(e.col || '') : e.col), cols: (e.cols || []).map(esc).join(', '), delim: esc(e.delim),
      vals: spec && spec.vals ? Object.keys(spec.vals).filter(v => (spec.vals[v] === v) === (LANG !== 'en')).join(', ') : '' });
    return T((STR['er.' + e.code] ? 'er.' : 'no.') + e.code, p);
  }
  function renderDatos() {
    const R = ST.R, D = cur(), dic = (window.DICCIONARIO || {})[LANG] || [], base = 'data/plantillas/' + (LANG === 'en' ? 'en/' : '');
    const files = KEYS.map(k => {
      const rep = D.rep[k], fn = fileName(k), src = dic.find(r => r[0] === fn);
      let st, cls = '', list = '';
      if (rep && !rep.ok) { cls = ' class="bad"'; st = T('st.bad'); list = '<ul>' + rep.errors.map(e => `<li>${errText(e)}</li>`).join('') + '</ul>'; }
      else if (D.data[k]) st = T(isEj() ? 'st.ej' : 'st.ok', { n: num(D.data[k].length, 0) });
      else st = T('st.miss', { r: src ? T('da.fuente', { f: esc(src[5]) }) : '' });
      if (rep && rep.notes.length) list += '<ul>' + rep.notes.map(e => `<li>${errText(e)}</li>`).join('') + '</ul>';
      const rm = !isEj() && (D.data[k] || rep) ? `<button type="button" class="btn quiet" data-rm="${k}" aria-label="${esc(T('da.removeA', { f: fn }))}">${T('da.remove')}</button>` : '';
      return `<li${cls}><span class="fn mono">${fn}</span>${rm}<span class="st">${st}</span>${list}</li>`;
    }).join('');
    const extra = isEj() ? '' : ST.mis.extra.map(e => `<li class="bad"><span class="st">${errText(e)}</span></li>`).join('');
    const avisos = R.avisos.length ? '<ul class="note" style="padding-left:20px">' + R.avisos.map(a => `<li>${T('av.' + a.code, Object.assign({ n: num(a.n, 0) }, fileNames()))}</li>`).join('') + '</ul>' : '';
    const dicts = KEYS.map(k => { const fn = fileName(k), rs = dic.filter(r => r[0] === fn);
      return `<details class="data"><summary>${T('da.dicSee', { f: '<span class="mono">&nbsp;' + fn + '</span>' })}</summary><p class="note" style="margin:0 0 8px">${T('da.fuente', { f: esc(rs[0] ? rs[0][5] : '') })}</p>${table([T('da.cc'), T('da.ct'), T('da.cr'), T('da.cd')], rs.map(r => r.slice(1, 5)), { raw: true, text: true, label: fn })}</details>`; }).join('');
    $('p-datos').innerHTML = `<div class="flag priv" role="note"><span><b>${T('da.priv')}</b> ${T('da.priv2')}</span></div>
      <section class="card"><h2>${T('da.s1')}</h2><p class="sub">${T('da.s1sub')}</p>
        <p class="dl">${KEYS.map(k => `<a class="btn" href="${base}${fileName(k)}" download>${fileName(k)}</a>`).join('')}<a class="btn quiet" href="${base}${LANG === 'en' ? 'column_dictionary.csv' : 'diccionario_columnas.csv'}" download>${T('da.dic')}</a></p>
        <p class="note">${T('da.no')}</p>${dicts}
        <h3 style="margin-top:14px">${T('da.dlEj')}</h3><p class="dl">${KEYS.map(k => `<a class="btn quiet" href="data/ejemplo/${C.FILES[k].file}" download>${C.FILES[k].file}</a>`).join('')}</p></section>
      <section class="card"><h2>${T('da.s2')}</h2>
        <div class="drop" id="drop"><p>${T('da.drop')}</p><button type="button" class="btn solid" id="pick">${T('da.pick')}</button></div></section>
      <section class="card"><h2>${T('da.s3')}</h2>${isEj() ? `<p class="sub">${T('da.exNote')}</p>` : ''}
        <ul class="files">${files}${extra}</ul>${avisos}
        ${isEj() ? '' : `<p class="dl"><button type="button" class="btn" id="backEj">${T('da.ex')}</button></p>`}</section>`;
  }

  /* ---------- 9 · método ---------- */
  function renderMetodo() {
    const P = ST.R.params, need = { acceso: ['personas'], activacion: ['personas', 'uso'], habito: ['personas', 'uso'], cobertura: ['procesos'], integracion: ['unidades'], resultado: ['unidades'], calidad: ['unidades'], tiempo: ['unidades'] };
    const rows = Object.keys(NUMS).map(k => [NUMS[k] + ' · ' + T('in.' + k), T('f.' + k, { u: P.umbral, n: P.ventanaHab, s: P.semanasMes }), need[k].map(fileName).join(', '), T('lim.' + k)]);
    $('p-metodo').innerHTML = T('me.html', { tabla: table([T('me.c1'), T('me.c2'), T('me.c3'), T('me.c4')], rows, { raw: true, text: true, label: T('tab.metodo') }) });
  }

  /* ---------- estado, parámetros y render general ---------- */
  function recompute() {
    const p = Object.assign({ corte: ST.corte[ST.mode] }, ST.P);
    ST.R = C.compute(cur().data, p); ST.L = C.lecturas(ST.R);
    if (!ST.R.procesosU.some(x => x.id === ST.proc)) ST.proc = ST.R.procesosU[0] ? ST.R.procesosU[0].id : null;
  }
  function renderChrome() {
    const D = cur();
    $('flag').className = 'flag' + (isEj() ? '' : ' priv');
    $('flag').innerHTML = isEj() ? T('flag.ej', { emp: T('emp') }) : T('flag.mis', { extra: Object.keys(D.data).length ? '' : T('flag.vacio') });
    $('modeEj').setAttribute('aria-pressed', String(isEj())); $('modeMis').setAttribute('aria-pressed', String(!isEj()));
    $('pCorte').value = ST.corte[ST.mode]; $('pAct').value = ST.P.ventanaAct; $('pHab').value = ST.P.ventanaHab;
    $('pUmb').value = ST.R.params.umbral; $('pUmb').max = ST.P.ventanaHab; $('pUmb').disabled = ST.P.mitad; $('pMitad').checked = ST.P.mitad;
  }
  function renderAll() {
    if (!ST.ready) return;
    const f = document.activeElement, keep = f && (f.dataset.sort ? `[data-sort="${f.dataset.sort}"]` : f.id && /^(procSel|unidadRes|pick)$/.test(f.id) ? '#' + f.id : null);
    recompute(); ST.traces = {}; renderChrome();
    renderResumen(); renderArea(); renderProceso(); renderAlertas(); renderDecidir(); renderDatos(); renderMetodo();
    if (keep) { const el = document.querySelector(keep); if (el) el.focus(); }
  }
  function i18nStatic() {
    document.documentElement.lang = LANG; document.title = T('__title');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
    $('deck').innerHTML = T('hd.deck', { url: ARTICLE_URL });
    $('footNote').textContent = T('foot.note'); $('footArt').textContent = T('foot.art'); $('footArt').href = ARTICLE_URL;
    $('tabs').setAttribute('aria-label', T('tabs.aria'));
    document.querySelectorAll('.lang-opt').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === LANG)));
  }
  function applyTheme(t, silent) {
    document.documentElement.setAttribute('data-theme', t);
    const b = $('themeToggle'); b.textContent = t === 'dark' ? '☀️' : '🌙'; b.setAttribute('aria-pressed', String(t === 'dark')); b.setAttribute('aria-label', T(t === 'dark' ? 'theme.light' : 'theme.dark'));
    if (!silent) { store.set('jf-theme', t); window.track && window.track('theme_switch', { theme: t }); }
  }
  function applyLang(l, silent) {
    LANG = l === 'en' ? 'en' : 'es'; i18nStatic(); applyTheme(document.documentElement.getAttribute('data-theme') || 'light', true);
    if (!silent) {
      store.set('jf-lang', LANG); store.set('iac_lang', LANG);
      try { const u = new URL(location.href); if (LANG === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang'); history.replaceState(null, '', u.pathname + u.search + u.hash); } catch (e) { }
      window.track && window.track('lang_switch', { lang: LANG });
    }
    if (ST.ready) renderAll(); else $('p-resumen').innerHTML = `<section class="card"><p class="sub" style="margin:0">${T('loading')}</p></section>`;
  }
  function setTab(id, o) {
    if (!TABS.includes(id)) id = 'resumen';
    ST.tab = id;
    TABS.forEach(t => { const on = t === id, b = $('t-' + t); b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; $('p-' + t).hidden = !on; });
    const bar = $('tabs'), b = $('t-' + id); bar.scrollLeft = Math.max(0, b.offsetLeft - (bar.clientWidth - b.offsetWidth) / 2);
    if (!o || !o.silent) { try { history.replaceState(null, '', location.pathname + location.search + (id === 'resumen' ? '' : '#' + id)); } catch (e) { } }
    if (o && o.focus) b.focus();
  }

  /* ---------- datos: ejemplo y archivos del usuario ---------- */
  function ingest(target, text, filename) {
    const parsed = C.parseCSV(text), key = C.detectFile(parsed.header, filename);
    if (!key) return { key: null, error: { code: 'no_reconocido', file: filename } };
    const rep = C.validate(key, parsed, filename);
    target.rep[key] = rep; if (rep.ok) target.data[key] = rep.rows; else delete target.data[key];
    return { key, rep };
  }
  async function loadEjemplo() {
    await Promise.all(KEYS.map(async k => {
      try { const r = await fetch('data/ejemplo/' + C.FILES[k].file + '?v=1'); if (!r.ok) return; ingest(ST.ej, await r.text(), C.FILES[k].file); } catch (e) { /* archivo ausente: sus indicadores dirán «Sin datos» */ }
    }));
    ST.ready = true; renderAll();
  }
  /* Pasar a «Mis datos»: primero se apaga la analítica; después, y solo en memoria, se leen los archivos. */
  function usarMisDatos() { window[GA_OFF] = true; ST.mode = 'mis'; }
  async function readFiles(list) {
    usarMisDatos(); ST.mis.extra = [];
    for (const f of [...list]) {
      try { const r = ingest(ST.mis, await f.text(), f.name); if (r.error) ST.mis.extra.push(r.error); }
      catch (e) { ST.mis.extra.push({ code: 'lectura', file: f.name }); }
    }
    if (!ST.corteManual) ST.corte.mis = C.defaultCorte(ST.mis.data) || today;
    renderAll(); $('live').textContent = T('st.live', { n: list.length });
  }
  function download(id) {
    const t = ST.traces[id]; if (!t) return;
    const csv = '﻿' + C.toCSV(t.cols.map(colName), t.rows.map(r => r.map((v, i) => cell(t.cols[i], v, true))));
    const a = document.createElement('a'), url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.href = url; a.download = (LANG === 'en' ? 'metric_' : 'indicador_') + NUMS[t.key] + '_' + C.norm(T('in.' + t.key)) + '.csv';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ---------- eventos ---------- */
  function bind() {
    $('langToggle').addEventListener('click', e => { const o = e.target.closest('.lang-opt'); if (o) applyLang(o.dataset.lang, false); });
    $('themeToggle').addEventListener('click', () => applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
    $('tabs').addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) setTab(b.dataset.tab); });
    $('tabs').addEventListener('keydown', e => {
      const i = TABS.indexOf(ST.tab); let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % TABS.length; else if (e.key === 'ArrowLeft') j = (i + TABS.length - 1) % TABS.length; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = TABS.length - 1;
      if (j != null) { e.preventDefault(); setTab(TABS[j], { focus: true }); }
    });
    window.addEventListener('hashchange', () => setTab(location.hash.slice(1), { silent: true }));
    $('modeEj').addEventListener('click', () => { ST.mode = 'ejemplo'; renderAll(); });
    $('modeMis').addEventListener('click', () => { usarMisDatos(); renderAll(); if (!Object.keys(ST.mis.data).length) setTab('datos'); });
    const clamp = (el, lo, hi, def) => { const v = Math.round(Number(el.value)); return Number.isFinite(v) && el.value !== '' ? Math.min(hi, Math.max(lo, v)) : def; };
    $('pCorte').addEventListener('change', e => { if (C.dayNum(e.target.value) != null) { ST.corte[ST.mode] = e.target.value; if (!isEj()) ST.corteManual = true; } renderAll(); });
    $('pAct').addEventListener('change', e => { ST.P.ventanaAct = clamp(e.target, 7, 120, C.DEFAULTS.ventanaAct); renderAll(); });
    $('pHab').addEventListener('change', e => { ST.P.ventanaHab = clamp(e.target, 2, 52, C.DEFAULTS.ventanaHab); ST.P.umbral = Math.min(ST.P.umbral, ST.P.ventanaHab); renderAll(); });
    $('pUmb').addEventListener('change', e => { ST.P.umbral = clamp(e.target, 1, ST.P.ventanaHab, C.DEFAULTS.umbral); renderAll(); });
    $('pMitad').addEventListener('change', e => { ST.P.mitad = e.target.checked; renderAll(); });
    $('fileInput').addEventListener('change', e => { if (e.target.files.length) readFiles(e.target.files).then(() => { e.target.value = ''; }); });
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-dl],[data-sort],[data-rm],#pick,#backEj'); if (!t) return;
      if (t.dataset.dl) download(t.dataset.dl);
      else if (t.dataset.sort) { const k = t.dataset.sort; ST.sort = { k, dir: ST.sort.k === k ? -ST.sort.dir : (k === 'area' ? 1 : -1) }; renderAll(); }
      else if (t.dataset.rm) { delete ST.mis.data[t.dataset.rm]; delete ST.mis.rep[t.dataset.rm]; if (!ST.corteManual) ST.corte.mis = C.defaultCorte(ST.mis.data) || today; renderAll(); }
      else if (t.id === 'pick') $('fileInput').click();
      else if (t.id === 'backEj') { ST.mode = 'ejemplo'; renderAll(); }
    });
    document.addEventListener('change', e => {
      if (e.target.id === 'procSel') { ST.proc = e.target.value; renderAll(); }
      else if (e.target.id === 'unidadRes') { ST.unidad = e.target.value; renderAll(); }
    });
    document.addEventListener('toggle', e => { const d = e.target; if (d.classList && d.classList.contains('trace')) { if (d.open) ST.open.add(d.dataset.k); else ST.open.delete(d.dataset.k); } }, true);
    const inDrop = e => e.target.closest && e.target.closest('#drop');
    document.addEventListener('dragover', e => { const d = inDrop(e); if (d) { e.preventDefault(); d.classList.add('over'); } });
    document.addEventListener('dragleave', e => { const d = inDrop(e); if (d) d.classList.remove('over'); });
    document.addEventListener('drop', e => { const d = inDrop(e); if (d) { e.preventDefault(); d.classList.remove('over'); if (e.dataTransfer.files.length) readFiles(e.dataTransfer.files); } });
  }

  bind(); applyLang(LANG, true); setTab(location.hash.slice(1), { silent: true }); loadEjemplo();
})();
