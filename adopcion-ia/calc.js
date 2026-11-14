/* /adopcion-ia/ · motor de cálculo. Sin dependencias; corre igual en el navegador y en Node (tools/probar.js).
   No conoce idiomas ni pantallas: devuelve números, estados y códigos de motivo. Los textos viven en i18n.js.
   Reglas que este archivo hace cumplir:
   - sin datos, sin número: nunca imputa ni rellena con ceros;
   - ningún valor de un grupo con menos de MIN_GRUPO personas;
   - nada por persona sale de aquí: las tablas de trazabilidad son agregados por área, proceso o equipo. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AdopcionCalc = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DEFAULTS = { ventanaAct: 28, ventanaHab: 12, umbral: 9, mitad: false, minGrupo: 5, semanasMes: 4, minSemanas: 8 };

  /* ---------- modelo de datos: cinco archivos ---------- */
  const FILES = {
    personas: { file: 'personas.csv', en: 'people.csv', hint: /persona|people/, cols: [
      { k: 'id_persona', en: 'person_id', t: 'text', req: 1 },
      { k: 'area', en: 'department', t: 'text', req: 1 },
      { k: 'elegible', en: 'eligible', t: 'bin', req: 1 },
      { k: 'tiene_acceso', en: 'has_access', t: 'bin', req: 1 }] },
    uso: { file: 'uso_semanal.csv', en: 'weekly_usage.csv', hint: /uso|usage/, cols: [
      { k: 'id_persona', en: 'person_id', t: 'text', req: 1 },
      { k: 'semana_inicio', en: 'week_start', t: 'week', req: 1 },
      { k: 'acciones', en: 'actions', t: 'int', req: 1 }] },
    procesos: { file: 'procesos.csv', en: 'processes.csv', hint: /proceso|process/, cols: [
      { k: 'id_proceso', en: 'process_id', t: 'text', req: 1 },
      { k: 'area', en: 'department', t: 'text', req: 1 },
      { k: 'nombre', en: 'name', t: 'text', req: 1 },
      { k: 'ia_aplicable', en: 'ai_applicable', t: 'bin', req: 1 },
      { k: 'ev_procedimiento', en: 'ev_procedure', t: 'bin', req: 1 },
      { k: 'ev_registros', en: 'ev_logs', t: 'bin', req: 1 },
      { k: 'ev_entregables', en: 'ev_deliverables', t: 'bin', req: 1 },
      { k: 'ev_dueno', en: 'ev_owner', t: 'bin', req: 1 }] },
    unidades: { file: 'unidades.csv', en: 'units.csv', hint: /unidad|unit/, cols: [
      { k: 'id_proceso', en: 'process_id', t: 'text', req: 1 },
      { k: 'equipo', en: 'team', t: 'text', req: 1 },
      { k: 'grupo', en: 'group', t: 'enum', req: 1, vals: { con_ia: 'con_ia', with_ai: 'con_ia', comparacion: 'comparacion', comparison: 'comparacion' } },
      { k: 'semana_inicio', en: 'week_start', t: 'week', req: 1 },
      { k: 'periodo', en: 'period', t: 'enum', req: 1, vals: { antes: 'antes', before: 'antes', despues: 'despues', after: 'despues' } },
      { k: 'unidades_cerradas', en: 'units_closed', t: 'int', req: 1 },
      { k: 'unidades_asistidas', en: 'units_assisted', t: 'int', req: 1 },
      { k: 'resultado_suma', en: 'outcome_sum', t: 'num', req: 1 },
      { k: 'unidades_retrabajo', en: 'units_rework', t: 'int', req: 1 },
      { k: 'min_elaboracion_suma', en: 'drafting_min_sum', t: 'num', req: 0 },
      { k: 'min_revision_suma', en: 'review_min_sum', t: 'num', req: 0 }] },
    alertas: { file: 'alertas.csv', en: 'alerts.csv', hint: /alerta|alert/, cols: [
      { k: 'mes', en: 'month', t: 'month', req: 1 },
      { k: 'tipo', en: 'type', t: 'enum', req: 1, vals: { trafico_red: 'trafico_red', network_traffic: 'trafico_red', gasto: 'gasto', spend: 'gasto' } },
      { k: 'servicios_no_autorizados', en: 'unapproved_services', t: 'int', req: 1 },
      { k: 'eventos', en: 'events', t: 'int', req: 1 }] },
  };
  const FILE_KEYS = Object.keys(FILES);
  /* multiplicadores del proveedor: si llegan, se ignoran a propósito (y se avisa) */
  const VENDOR = /^(horas_asistidas|assisted_hours|valor_estimado|estimated_value|valor_asistido|assisted_value)$/;

  /* ---------- utilidades ---------- */
  const norm = s => String(s == null ? '' : s).replace(/^﻿/, '').trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[\s-]+/g, '_');
  const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;
  function dayNum(iso) {
    const m = ISO.exec(String(iso).trim()); if (!m) return null;
    const y = +m[1], mo = +m[2], d = +m[3];
    const t = Date.UTC(y, mo - 1, d); const dt = new Date(t);
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
    return Math.round(t / 864e5);
  }
  const isoOf = n => new Date(n * 864e5).toISOString().slice(0, 10);
  const monday = n => n - (((n + 3) % 7) + 7) % 7;         // 1970-01-01 fue jueves
  const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);

  /* ---------- CSV ---------- */
  function parseCSV(text) {
    text = String(text).replace(/^﻿/, '');
    const first = text.split(/\r?\n/, 1)[0] || '';
    const count = ch => { let n = 0, q = false; for (const c of first) { if (c === '"') q = !q; else if (c === ch && !q) n++; } return n; };
    const cands = [[',', count(',')], [';', count(';')], ['\t', count('\t')]].sort((a, b) => b[1] - a[1]);
    const delim = cands[0][1] > 0 ? cands[0][0] : ',';
    const rows = []; let row = [], cur = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
      else if (c === '"') q = true;
      else if (c === delim) { row.push(cur); cur = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cur); cur = ''; rows.push(row); row = [];
      } else cur += c;
    }
    if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
    const body = rows.filter(r => r.some(v => String(v).trim() !== ''));
    return { delim, header: (body[0] || []).map(h => String(h).trim()), rows: body.slice(1) };
  }
  const csvCell = v => { const s = v == null ? '' : String(v); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const toCSV = (cols, rows) => [cols, ...rows].map(r => r.map(csvCell).join(',')).join('\n') + '\n';

  /* ¿A cuál de los cinco archivos corresponde? Primero por columnas, después por nombre. */
  function detectFile(header, filename) {
    const h = new Set(header.map(norm));
    const full = FILE_KEYS.filter(k => FILES[k].cols.filter(c => c.req).every(c => h.has(c.k) || h.has(c.en)));
    if (full.length === 1) return full[0];
    const fn = norm(filename || '');
    const byName = FILE_KEYS.filter(k => FILES[k].hint.test(fn));
    if (full.length > 1) return full.find(k => byName.includes(k)) || full[0];
    if (byName.length) return byName[0];
    let best = null, bs = 0;
    for (const k of FILE_KEYS) { const s = FILES[k].cols.filter(c => h.has(c.k) || h.has(c.en)).length / FILES[k].cols.length; if (s > bs) { bs = s; best = k; } }
    return bs >= 0.5 ? best : null;
  }

  /* Valida y tipa un archivo. Con cualquier error el archivo NO se carga: sin datos, sin número. */
  function validate(key, parsed, filename) {
    const spec = FILES[key], errors = [], notes = [];
    const fname = filename || spec.file;
    const hn = parsed.header.map(norm);
    const idx = {};
    for (const c of spec.cols) {
      const i = hn.findIndex(h => h === c.k || h === c.en);
      if (i >= 0) idx[c.k] = i; else if (c.req) errors.push({ code: 'col_falta', file: fname, col: c.k, colEn: c.en });
    }
    const known = new Set(spec.cols.flatMap(c => [c.k, c.en]));
    const extra = parsed.header.filter((h, i) => hn[i] && !known.has(hn[i]));
    const vendor = extra.filter(h => VENDOR.test(norm(h)));
    if (vendor.length) notes.push({ code: 'col_proveedor', file: fname, cols: vendor });
    const other = extra.filter(h => !VENDOR.test(norm(h)));
    if (other.length) notes.push({ code: 'col_ignorada', file: fname, cols: other });
    if (parsed.delim !== ',') notes.push({ code: 'separador', file: fname, delim: parsed.delim === '\t' ? 'tab' : parsed.delim });
    if (errors.length) return { key, file: fname, ok: false, errors, notes, rows: [], total: 0 };
    if (!parsed.rows.length) return { key, file: fname, ok: false, errors: [{ code: 'sin_filas', file: fname }], notes, rows: [], total: 0 };

    const out = []; let nErr = 0, movedWeek = 0;
    const bad = (code, c, line, val) => { nErr++; if (errors.length < 25) errors.push({ code, file: fname, col: c.k, row: line, val: String(val).slice(0, 40) }); };
    parsed.rows.forEach((r, ri) => {
      const line = ri + 2, o = {};
      for (const c of spec.cols) {
        if (!(c.k in idx)) { o[c.k] = null; continue; }
        const raw = String(r[idx[c.k]] == null ? '' : r[idx[c.k]]).trim();
        if (raw === '') { if (c.req) bad('vacio', c, line, ''); o[c.k] = null; continue; }
        if (c.t === 'text') o[c.k] = raw;
        else if (c.t === 'bin') { if (raw === '0' || raw === '1') o[c.k] = +raw; else bad('bin', c, line, raw); }
        else if (c.t === 'int' || c.t === 'num') {
          let s = raw.replace(/\s/g, '');
          if (parsed.delim !== ',' && /^-?\d+,\d+$/.test(s)) s = s.replace(',', '.');
          if (!/^-?\d+(\.\d+)?$/.test(s)) { bad(c.t === 'int' ? 'entero' : 'numero', c, line, raw); continue; }
          const v = Number(s);
          if (v < 0) { bad('negativo', c, line, raw); continue; }
          if (c.t === 'int' && !Number.isInteger(v)) { bad('entero', c, line, raw); continue; }
          o[c.k] = v;
        } else if (c.t === 'week' || c.t === 'month') {
          const d = dayNum(raw);
          if (d == null) { bad('fecha', c, line, raw); continue; }
          if (c.t === 'week') { const m = monday(d); if (m !== d) movedWeek++; o[c.k] = m; }
          else o[c.k] = raw.slice(0, 7);
        } else if (c.t === 'enum') {
          const v = c.vals[norm(raw)];
          if (!v) bad('enum', c, line, raw); else o[c.k] = v;
        }
      }
      if (key === 'unidades' && o.unidades_cerradas != null) {
        if (o.unidades_asistidas > o.unidades_cerradas) bad('mayor_que_cerradas', spec.cols[6], line, o.unidades_asistidas);
        if (o.unidades_retrabajo > o.unidades_cerradas) bad('mayor_que_cerradas', spec.cols[8], line, o.unidades_retrabajo);
      }
      out.push(o);
    });
    if (nErr > errors.length) errors.push({ code: 'mas_errores', file: fname, n: nErr - errors.length });
    if (movedWeek) notes.push({ code: 'semana_no_lunes', file: fname, n: movedWeek });
    return { key, file: fname, ok: nErr === 0, errors, notes, rows: nErr === 0 ? out : [], total: parsed.rows.length };
  }

  /* Fecha de corte sugerida: el último día cubierto por los registros semanales */
  function defaultCorte(data) {
    let m = null;
    for (const k of ['uso', 'unidades']) for (const r of (data[k] || [])) if (r.semana_inicio != null && (m == null || r.semana_inicio > m)) m = r.semana_inicio;
    return m == null ? null : isoOf(m + 6);
  }

  /* ---------- indicadores ---------- */
  const ratio = (num, den, min, extra) => den === 0 ? Object.assign({ status: 'nodata', reason: 'den_cero' }, extra)
    : den < min ? Object.assign({ status: 'small' }, extra)
      : Object.assign({ status: 'ok', value: num / den, num, den }, extra);
  const nodata = (reason, extra) => Object.assign({ status: 'nodata', reason }, extra);

  function compute(data, params) {
    const P = Object.assign({}, DEFAULTS, params || {});
    const cut = dayNum(P.corte);
    if (cut == null) throw new Error('fecha de corte inválida');
    const NW = Math.max(1, Math.round(P.ventanaHab)), MIN = P.minGrupo;
    const umbral = P.mitad ? Math.ceil(NW / 2) : Math.max(1, Math.min(Math.round(P.umbral), NW));
    const lastMon = monday(cut), habFrom = lastMon - 7 * (NW - 1), actFrom = cut - Math.round(P.ventanaAct) + 1;
    const W = { act: { desde: isoOf(actFrom), hasta: P.corte }, hab: { desde: isoOf(habFrom), hasta: P.corte } };
    const avisos = [];

    /* personas: una fila por id (una persona cuenta una sola vez) */
    let people = null, areasP = [];
    if (data.personas) {
      const m = new Map(); let dup = 0;
      for (const r of data.personas) {
        const p = m.get(r.id_persona);
        if (p) { dup++; p.elegible = Math.max(p.elegible, r.elegible); p.acceso = Math.max(p.acceso, r.tiene_acceso); }
        else m.set(r.id_persona, { id: r.id_persona, area: r.area, elegible: r.elegible, acceso: r.tiene_acceso, act: false, sem: 0, acc: 0 });
      }
      if (dup) avisos.push({ code: 'personas_repetidas', n: dup });
      people = m; areasP = [...new Set([...m.values()].map(p => p.area))];
    }
    /* uso: semanas activas y acciones por persona dentro de las ventanas */
    let usoRows = { act: 0, hab: 0 }, hasUso = !!(data.uso && people);
    if (hasUso) {
      const weeks = new Map(); let orphan = 0;
      for (const r of data.uso) {
        const p = people.get(r.id_persona);
        if (!p) { orphan++; continue; }
        if (!(r.acciones > 0) || r.semana_inicio > cut) continue;
        if (r.semana_inicio >= actFrom) { p.act = true; usoRows.act++; }
        if (r.semana_inicio >= habFrom) {
          usoRows.hab++; p.acc += r.acciones;
          let s = weeks.get(p.id); if (!s) weeks.set(p.id, s = new Set()); s.add(r.semana_inicio);
        }
      }
      for (const [id, s] of weeks) people.get(id).sem = s.size;
      if (orphan) avisos.push({ code: 'uso_sin_persona', n: orphan });
    }
    const stats = list => {
      const o = { n: list.length, elig: 0, eligAcc: 0, acc: 0, act: 0, any: 0, hab: 0 };
      for (const p of list) {
        if (p.elegible) { o.elig++; if (p.acceso) o.eligAcc++; }
        if (p.acceso) { o.acc++; if (p.act) o.act++; if (p.sem >= 1) o.any++; if (p.sem >= umbral) o.hab++; }
      }
      return o;
    };
    const personInd = (s, tiny) => ({
      acceso: tiny ? { status: 'small' } : ratio(s.eligAcc, s.elig, MIN),
      activacion: !hasUso ? nodata('falta_uso') : tiny ? { status: 'small' } : ratio(s.act, s.acc, MIN),
      habito: !hasUso ? nodata('falta_uso') : tiny ? { status: 'small' }
        : ratio(s.hab, s.any, MIN, { umbral, semanas: NW, mitad: !!P.mitad, elegibles: s.elig >= MIN ? { num: s.hab, den: s.elig, value: s.hab / s.elig } : null }),
    });

    const ind = {};
    const byArea = new Map();
    if (people) {
      const all = [...people.values()], g = stats(all);
      Object.assign(ind, personInd(g, false));
      for (const a of areasP) { const s = stats(all.filter(p => p.area === a)); byArea.set(a, { area: a, n: s.n, s, tiny: s.n < MIN }); }
      const rowsBy = (f) => [...byArea.values()].map(x => x.tiny ? [x.area, null, null] : [x.area, ...f(x.s)]);
      ind.acceso.trace = { archivos: ['personas'], filas: data.personas.length, ventana: null, cols: ['area', 'elegibles', 'elegibles_con_acceso'], rows: rowsBy(s => [s.elig, s.eligAcc]) };
      if (hasUso) {
        ind.activacion.trace = { archivos: ['personas', 'uso'], filas: data.personas.length + usoRows.act, ventana: W.act, cols: ['area', 'con_acceso', 'con_accion_en_ventana'], rows: rowsBy(s => [s.acc, s.act]) };
        ind.habito.trace = { archivos: ['personas', 'uso'], filas: data.personas.length + usoRows.hab, ventana: W.hab, cols: ['area', 'con_semana_activa', 'con_habito', 'elegibles'], rows: [...byArea.values()].map(x => x.tiny ? [x.area, null, null, null] : [x.area, x.s.any, x.s.hab, x.s.elig]) };
      }
    } else {
      ind.acceso = nodata('falta_personas');
      ind.activacion = nodata(data.uso ? 'falta_personas' : 'falta_personas_uso');
      ind.habito = nodata(data.uso ? 'falta_personas' : 'falta_personas_uso');
    }

    /* 4 · cobertura de procesos */
    const procMap = new Map(), areaProc = new Map();
    if (data.procesos) {
      const ap = data.procesos.filter(p => p.ia_aplicable === 1);
      const nEv = p => p.ev_procedimiento + p.ev_registros + p.ev_entregables + p.ev_dueno;
      for (const p of data.procesos) {
        procMap.set(p.id_proceso, p);
        const a = areaProc.get(p.area) || { apl: 0, ver: 0 }; areaProc.set(p.area, a);
        if (p.ia_aplicable === 1) { a.apl++; if (nEv(p) >= 2) a.ver++; }
      }
      const ver = ap.filter(p => nEv(p) >= 2).length;
      ind.cobertura = ap.length ? { status: 'ok', value: ver / ap.length, num: ver, den: ap.length } : nodata('den_cero');
      ind.cobertura.trace = { archivos: ['procesos'], filas: data.procesos.length, ventana: null, cols: ['id_proceso', 'area', 'nombre', 'evidencias', 'verificado'], rows: ap.map(p => [p.id_proceso, p.area, p.nombre, nEv(p), nEv(p) >= 2 ? 1 : 0]) };
    } else ind.cobertura = nodata('falta_procesos');

    /* 5 a 8 · por proceso, desde unidades.csv */
    const procesosU = [];
    if (data.unidades) {
      const ids = [...new Set(data.unidades.map(r => r.id_proceso))];
      for (const id of ids) {
        const rows = data.unidades.filter(r => r.id_proceso === id && r.semana_inicio <= cut);
        const meta = procMap.get(id) || null;
        const pick = (g, per) => rows.filter(r => r.grupo === g && r.periodo === per);
        const agg = rs => ({
          n: rs.length, semanas: new Set(rs.map(r => r.semana_inicio)).size,
          cerr: sum(rs, r => r.unidades_cerradas), asis: sum(rs, r => r.unidades_asistidas),
          res: sum(rs, r => r.resultado_suma), ret: sum(rs, r => r.unidades_retrabajo),
        });
        const cA = pick('con_ia', 'antes'), cD = pick('con_ia', 'despues'), kA = pick('comparacion', 'antes'), kD = pick('comparacion', 'despues');
        const A = { cA: agg(cA), cD: agg(cD), kA: agg(kA), kD: agg(kD) };
        const pu = { id, nombre: meta ? meta.nombre : id, area: meta ? meta.area : null, equipos: { con_ia: [...new Set([...cA, ...cD].map(r => r.equipo))], comparacion: [...new Set([...kA, ...kD].map(r => r.equipo))] } };
        const hasCmp = A.kA.cerr > 0 && A.kD.cerr > 0;
        const semMin = Math.min(...[A.cA, A.cD].concat(hasCmp ? [A.kA, A.kD] : []).map(x => x.semanas));
        const flags = { sinComparacion: !hasCmp, periodoCorto: semMin < P.minSemanas, semanasMin: semMin };

        /* 5 · integración: últimas semanasMes semanas del periodo «después» del grupo con IA */
        const wk = [...new Set(cD.map(r => r.semana_inicio))].sort((a, b) => a - b).slice(-P.semanasMes);
        const last = cD.filter(r => wk.includes(r.semana_inicio));
        const iNum = sum(last, r => r.unidades_asistidas), iDen = sum(last, r => r.unidades_cerradas);
        pu.integracion = !cD.length ? nodata('falta_despues') : iDen === 0 ? nodata('den_cero')
          : { status: 'ok', value: iNum / iDen, num: iNum, den: iDen, semanas: wk.length, todo: { num: A.cD.asis, den: A.cD.cerr, semanas: A.cD.semanas } };
        pu.integracion.trace = { archivos: ['unidades'], filas: last.length, ventana: wk.length ? { desde: isoOf(wk[0]), hasta: isoOf(wk[wk.length - 1] + 6) } : null,
          cols: ['equipo', 'semana_inicio', 'unidades_cerradas', 'unidades_asistidas'], rows: last.map(r => [r.equipo, isoOf(r.semana_inicio), r.unidades_cerradas, r.unidades_asistidas]) };

        /* 6 y 7 · resta doble (después − antes en con IA) − (después − antes en comparación) */
        const did = (f, cols) => {
          if (!(A.cA.cerr > 0) || !(A.cD.cerr > 0)) return nodata(A.cA.cerr > 0 ? 'falta_despues' : 'falta_antes');
          const m = { cA: f(A.cA), cD: f(A.cD), kA: hasCmp ? f(A.kA) : null, kD: hasCmp ? f(A.kD) : null };
          const dCon = m.cD - m.cA, dCmp = hasCmp ? m.kD - m.kA : null;
          const efecto = hasCmp ? dCon - dCmp : dCon;
          const tr = [['con_ia', 'antes', A.cA], ['con_ia', 'despues', A.cD]].concat(hasCmp ? [['comparacion', 'antes', A.kA], ['comparacion', 'despues', A.kD]] : []);
          return Object.assign({ status: 'ok', value: efecto, medias: m, dCon, dCmp, relativo: m.cA !== 0 ? efecto / m.cA : null }, flags,
            { trace: { archivos: ['unidades'], filas: tr.reduce((s, t) => s + t[2].n, 0), ventana: null, cols, rows: tr.map(t => [t[0], t[1], t[2].semanas, t[2].cerr, ...cols.slice(4).map((c, i) => i === 0 ? (c === 'resultado_suma' ? t[2].res : t[2].ret) : f(t[2]))]) } });
        };
        pu.resultado = did(x => x.res / x.cerr, ['grupo', 'periodo', 'semanas', 'unidades_cerradas', 'resultado_suma', 'media']);
        pu.calidad = did(x => x.ret / x.cerr, ['grupo', 'periodo', 'semanas', 'unidades_cerradas', 'unidades_retrabajo', 'tasa']);
        if (pu.calidad.status === 'ok') pu.calidad.alerta = pu.calidad.value > 1e-12;

        /* 8 · tiempo neto: solo con minutos medidos en los dos periodos del grupo con IA */
        const mins = rs => { const ok = rs.filter(r => r.min_elaboracion_suma != null && r.min_revision_suma != null); const c = sum(ok, r => r.unidades_cerradas);
          return c > 0 ? { n: ok.length, cerr: c, elab: sum(ok, r => r.min_elaboracion_suma) / c, rev: sum(ok, r => r.min_revision_suma) / c } : null; };
        const mA = mins(cA), mD = mins(cD);
        if (!mA || !mD) pu.tiempo = nodata('faltan_minutos');
        else if (pu.integracion.status !== 'ok') pu.tiempo = nodata('falta_despues');
        else {
          const bajaElab = mA.elab - mD.elab, subeRev = mD.rev - mA.rev, neto = bajaElab - subeRev;
          pu.tiempo = { status: 'ok', value: neto * iNum / 60, netoMin: neto, bajaElab, subeRev, unidades: iNum, semanas: wk.length,
            trace: { archivos: ['unidades'], filas: mA.n + mD.n + last.length, ventana: null, cols: ['periodo', 'unidades_cerradas', 'min_elaboracion_por_unidad', 'min_revision_por_unidad'],
              rows: [['antes', mA.cerr, mA.elab, mA.rev], ['despues', mD.cerr, mD.elab, mD.rev]] } };
        }
        /* serie semanal por grupo para el gráfico (agregada por equipo-semana, nunca por persona) */
        pu.series = ['con_ia', 'comparacion'].map(g => {
          const m = new Map();
          for (const r of rows.filter(r => r.grupo === g)) { const o = m.get(r.semana_inicio) || { w: r.semana_inicio, periodo: r.periodo, cerr: 0, res: 0, ret: 0 }; o.cerr += r.unidades_cerradas; o.res += r.resultado_suma; o.ret += r.unidades_retrabajo; m.set(r.semana_inicio, o); }
          return { grupo: g, puntos: [...m.values()].sort((a, b) => a.w - b.w).filter(o => o.cerr > 0).map(o => ({ semana: isoOf(o.w), periodo: o.periodo, media: o.res / o.cerr, tasa: o.ret / o.cerr })) };
        }).filter(s => s.puntos.length);
        procesosU.push(pu);
      }
    }
    const noU = code => nodata(data.unidades ? 'sin_filas_corte' : code);
    for (const k of ['integracion', 'resultado', 'calidad', 'tiempo']) if (!procesosU.length) ind[k] = noU('falta_unidades');

    /* tabla por área (indicadores 1 a 5) */
    const areas = [...new Set([...areasP, ...areaProc.keys()])].map(a => {
      const x = byArea.get(a), pr = areaProc.get(a);
      const o = { area: a, personas: x ? x.n : null };
      Object.assign(o, x ? personInd(x.s, x.tiny) : { acceso: nodata('falta_personas'), activacion: nodata('falta_personas'), habito: nodata('falta_personas') });
      o.cobertura = !data.procesos ? nodata('falta_procesos') : pr && pr.apl ? { status: 'ok', value: pr.ver / pr.apl, num: pr.ver, den: pr.apl } : nodata('sin_procesos_aplicables');
      const pus = procesosU.filter(p => p.area === a && p.integracion.status === 'ok');
      const n = sum(pus, p => p.integracion.num), d = sum(pus, p => p.integracion.den);
      o.integracion = !data.unidades ? nodata('falta_unidades') : d > 0 ? { status: 'ok', value: n / d, num: n, den: d } : nodata('sin_unidades_area');
      return o;
    });

    /* alerta 1 · concentración: acciones del 10 % más activo sobre personas con acceso */
    let concentracion;
    if (!people || !hasUso) concentracion = nodata(people ? 'falta_uso' : 'falta_personas');
    else {
      const acc = [...people.values()].filter(p => p.acceso).map(p => p.acc).sort((a, b) => b - a);
      const top = Math.ceil(acc.length * 0.10), tot = sum(acc, x => x);
      concentracion = top < MIN ? { status: 'small', top } : tot === 0 ? nodata('den_cero')
        : { status: 'ok', value: sum(acc.slice(0, top), x => x) / tot, num: sum(acc.slice(0, top), x => x), den: tot, top, base: acc.length, ventana: W.hab };
    }
    /* alerta 2 · uso fuera de las herramientas provistas */
    let fuera;
    if (!data.alertas) fuera = nodata('falta_alertas');
    else {
      const lim = P.corte.slice(0, 7), m = new Map();
      for (const r of data.alertas) { if (r.mes > lim) continue; const k = r.tipo + '|' + r.mes; const o = m.get(k) || { tipo: r.tipo, mes: r.mes, servicios: 0, eventos: 0 }; o.servicios = Math.max(o.servicios, r.servicios_no_autorizados); o.eventos += r.eventos; m.set(k, o); }
      const serie = t => [...m.values()].filter(o => o.tipo === t).sort((a, b) => a.mes < b.mes ? -1 : 1);
      const tr = serie('trafico_red'), ga = serie('gasto');
      fuera = !tr.length && !ga.length ? nodata('sin_filas_corte') : { status: 'ok', trafico: tr, gasto: ga, filas: data.alertas.length };
    }

    return { params: Object.assign({}, P, { umbral }), ventanas: W, ind, procesosU, areas, concentracion, fuera, avisos,
      cargados: FILE_KEYS.reduce((o, k) => (o[k] = data[k] ? data[k].length : null, o), {}) };
  }

  /* Indicadores 5 a 8 del proceso elegido (o el motivo de «Sin datos») */
  function indProceso(res, id) {
    const p = res.procesosU.find(x => x.id === id) || res.procesosU[0];
    if (!p) return { integracion: res.ind.integracion, resultado: res.ind.resultado, calidad: res.ind.calidad, tiempo: res.ind.tiempo, proceso: null };
    return { integracion: p.integracion, resultado: p.resultado, calidad: p.calidad, tiempo: p.tiempo, proceso: p };
  }

  /* Las cinco lecturas del artículo. Sin umbrales fijos: cada señal compara un área contra el total de la
     misma empresa, o usa un hecho que no depende de una vara externa (más de la mitad, signo de un efecto). */
  function lecturas(res) {
    const g = res.ind, ok = x => x && x.status === 'ok';
    const out = [];
    const ar = res.areas;
    out.push({ id: 'acceso_sin_activacion', areas: ok(g.acceso) && ok(g.activacion) ? ar.filter(a => ok(a.acceso) && ok(a.activacion) && a.acceso.value > g.acceso.value && a.activacion.value < g.activacion.value) : [], pair: ['acceso', 'activacion'] });
    out.push({ id: 'activacion_sin_habito', areas: ok(g.activacion) && ok(g.habito) ? ar.filter(a => ok(a.activacion) && ok(a.habito) && a.activacion.value > g.activacion.value && a.habito.value < g.habito.value) : [], pair: ['activacion', 'habito'] });
    out.push({ id: 'uso_sin_integracion', areas: ok(g.habito) && ok(g.cobertura) ? ar.filter(a => ok(a.habito) && ok(a.cobertura) && a.habito.value > g.habito.value && a.cobertura.value < g.cobertura.value) : [], pair: ['habito', 'cobertura'] });
    out.push({ id: 'tiempo_sin_resultado', procesos: res.procesosU.filter(p => ok(p.tiempo) && p.tiempo.value > 0 && ok(p.calidad) && (p.calidad.alerta || p.calidad.sinComparacion)) });
    const c = res.concentracion, hs = ar.filter(a => ok(a.habito)).sort((a, b) => b.habito.value - a.habito.value);
    out.push({ id: 'equipos_desiguales', concentracion: ok(c) && c.value > 0.5 ? c : null, extremos: ok(c) && c.value > 0.5 && hs.length >= 2 ? [hs[0], hs[hs.length - 1]] : null });
    for (const o of out) o.match = !!((o.areas && o.areas.length) || (o.procesos && o.procesos.length) || o.concentracion);
    return out;
  }

  return { DEFAULTS, FILES, FILE_KEYS, parseCSV, toCSV, detectFile, validate, defaultCorte, compute, indProceso, lecturas, dayNum, isoOf, monday, norm };
});
