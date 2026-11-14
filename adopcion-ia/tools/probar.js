#!/usr/bin/env node
/* Pruebas de aceptación de /adopcion-ia/. Recalcula los ocho indicadores desde los CSV del caso ilustrativo
   con el mismo motor que usa la página (calc.js) y falla (código 1) si alguno no coincide.

     node adopcion-ia/tools/probar.js

   Además de los ocho valores, cubre las reglas: sin datos → sin número, grupo mínimo de 5 personas,
   sin grupo de comparación, periodo corto, columnas mal nombradas, multiplicadores del proveedor y
   que ninguna tabla de trazabilidad lleve datos por persona. */
'use strict';
const fs = require('fs'), path = require('path');
const C = require('../calc.js');
const DIR = path.join(__dirname, '..', 'data');
const CORTE = '2026-10-25';

let fails = 0, n = 0;
const check = (name, got, want) => {
  n++; const ok = typeof want === 'function' ? want(got) : (typeof want === 'number' ? Math.abs(got - want) < 1e-9 : got === want);
  console.log(`${ok ? '  ✓' : '  ✗'} ${name}${ok ? '' : `  → obtuvo ${JSON.stringify(got)}${typeof want === 'function' ? '' : ', esperaba ' + JSON.stringify(want)}`}`);
  if (!ok) fails++;
};
const load = (dir, en) => { const d = {}, rep = {};
  for (const k of C.FILE_KEYS) { const f = path.join(DIR, dir, en ? C.FILES[k].en : C.FILES[k].file); if (!fs.existsSync(f)) continue;
    const v = C.validate(k, C.parseCSV(fs.readFileSync(f, 'utf8')), path.basename(f)); rep[k] = v; if (v.ok) d[k] = v.rows; }
  return { d, rep }; };
const clone = d => JSON.parse(JSON.stringify(d));

const { d: D, rep } = load('ejemplo');
console.log('Archivos del caso ilustrativo');
for (const k of C.FILE_KEYS) check(`${C.FILES[k].file} se valida sin errores`, rep[k] && rep[k].ok, true);
check('fecha de corte sugerida por los datos', C.defaultCorte(D), CORTE);

const R = C.compute(D, { corte: CORTE });
const P = C.indProceso(R, 'PR-001');
console.log('\nLos ocho indicadores (sección 9 del encargo)');
check('1 · Acceso = 62,5 %', R.ind.acceso.value, 0.625);
check('1 · Acceso: 300 de 480', [R.ind.acceso.num, R.ind.acceso.den].join('/'), '300/480');
check('2 · Activación = 80 %', R.ind.activacion.value, 0.8);
check('2 · Activación: 240 de 300', [R.ind.activacion.num, R.ind.activacion.den].join('/'), '240/300');
check('3 · Uso habitual = 27,5 %', R.ind.habito.value, 0.275);
check('3 · Uso habitual: 66 de 240', [R.ind.habito.num, R.ind.habito.den].join('/'), '66/240');
check('3 · Uso habitual sobre elegibles = 13,75 % (66 de 480)', R.ind.habito.elegibles.value, 0.1375);
check('4 · Cobertura de procesos = 15 %', R.ind.cobertura.value, 0.15);
check('4 · Cobertura: 6 de 40', [R.ind.cobertura.num, R.ind.cobertura.den].join('/'), '6/40');
check('5 · Integración en el flujo, cotizaciones = 25 %', P.integracion.value, 0.25);
check('5 · Integración: 300 de 1.200', [P.integracion.num, P.integracion.den].join('/'), '300/1200');
check('6 · Resultado operativo = −6 horas', P.resultado.value, -6);
check('6 · Resultado operativo relativo = −12 %', P.resultado.relativo, -0.12);
check('6 · medias 50 → 41 (con IA) y 52 → 49 (comparación)', Object.values(P.resultado.medias).map(x => +x.toFixed(9)).join(','), '50,41,52,49');
check('7 · Calidad y retrabajo = +2 puntos porcentuales', P.calidad.value * 100, 2);
check('7 · tasas 4 % → 6 % y 4 % → 4 %', Object.values(P.calidad.medias).map(x => +(x * 100).toFixed(9)).join(','), '4,6,4,4');
check('7 · con alerta', P.calidad.alerta, true);
check('8 · Tiempo neto recuperado = 60 horas al mes', P.tiempo.value, 60);
check('8 · elaboración baja 20 min, revisión sube 8 min', [P.tiempo.bajaElab, P.tiempo.subeRev].map(x => +x.toFixed(9)).join(','), '20,8');
check('6 y 7 · con grupo de comparación y 8 semanas por lado', [P.resultado.sinComparacion, P.resultado.periodoCorto, P.resultado.semanasMin].join(','), 'false,false,8');

console.log('\nAlertas y totales del caso');
check('600 empleados', D.personas.length, 600);
check('Concentración = 58 % (30 personas más activas de 300)', [+(R.concentracion.value * 100).toFixed(9), R.concentracion.top, R.concentracion.base].join(','), '58,30,300');
check('Servicios no autorizados con tráfico en el último mes = 9', R.fuera.trafico[R.fuera.trafico.length - 1].servicios, 9);
check('Un área con activación alta y hábito bajo (Finanzas)', (() => { const a = R.areas.find(x => x.area === 'Finanzas'); return a.activacion.value > R.ind.activacion.value && a.habito.value < R.ind.habito.value; })(), true);
check('Un área con pocos usuarios muy intensivos (Analítica)', (() => { const a = R.areas.find(x => x.area === 'Analítica'); return a.habito.den <= 15 && a.habito.value === 1; })(), true);
check('Las áreas suman el total en cada indicador', ['acceso', 'activacion', 'habito'].map(k => R.areas.reduce((s, a) => s + a[k].num, 0)).join(','), '300,240,66');
check('Lecturas: las cinco coinciden con algún dato del caso', C.lecturas(R).map(l => +l.match).join(''), '11111');

console.log('\nReglas');
{ const d = clone(D); delete d.unidades; const r = C.compute(d, { corte: CORTE }), p = C.indProceso(r);
  check('Sin unidades.csv: 5 a 8 quedan «Sin datos»', ['integracion', 'resultado', 'calidad', 'tiempo'].map(k => p[k].status + ':' + p[k].reason).join(' '), 'nodata:falta_unidades nodata:falta_unidades nodata:falta_unidades nodata:falta_unidades');
  check('Sin unidades.csv: 1 a 4 siguen funcionando', ['acceso', 'activacion', 'habito', 'cobertura'].map(k => r.ind[k].value).join(','), '0.625,0.8,0.275,0.15'); }
{ const d = clone(D); delete d.uso; const r = C.compute(d, { corte: CORTE });
  check('Sin uso_semanal.csv: activación y hábito «Sin datos», acceso sigue', [r.ind.acceso.status, r.ind.activacion.status, r.ind.habito.status, r.concentracion.status].join(','), 'ok,nodata,nodata,nodata'); }
{ const r = C.compute({}, { corte: CORTE });
  check('Sin ningún archivo: nada se rellena con ceros', Object.values(r.ind).every(x => x.status === 'nodata' && x.value === undefined), true); }
{ const txt = fs.readFileSync(path.join(DIR, 'ejemplo', 'unidades.csv'), 'utf8').replace('unidades_cerradas', 'cerradas');
  const p = C.parseCSV(txt), k = C.detectFile(p.header, 'unidades.csv'), v = C.validate(k, p, 'unidades.csv');
  check('Columna mal nombrada: el archivo no se carga', v.ok, false);
  check('…y el mensaje dice qué columna falta y en qué archivo', v.errors.map(e => [e.code, e.col, e.file].join('|')).join(), 'col_falta|unidades_cerradas|unidades.csv'); }
{ const d = clone(D); for (let i = 0; i < 3; i++) d.personas.push({ id_persona: 'x' + i, area: 'Jurídica', elegible: 1, tiene_acceso: 1 });
  const a = C.compute(d, { corte: CORTE }).areas.find(x => x.area === 'Jurídica');
  check('Área de 3 personas: «Grupo demasiado pequeño» en sus celdas', [a.acceso.status, a.activacion.status, a.habito.status].join(','), 'small,small,small');
  check('…y sin ningún valor', [a.acceso, a.activacion, a.habito].every(x => x.value === undefined && x.num === undefined), true); }
{ const d = clone(D); d.personas = d.personas.filter(p => p.tiene_acceso).slice(0, 40); const r = C.compute(d, { corte: CORTE });
  check('Concentración oculta si el 10 % superior tiene menos de 5 personas', [r.concentracion.status, r.concentracion.top].join(','), 'small,4'); }
{ const d = clone(D); d.unidades = d.unidades.filter(u => u.grupo === 'con_ia'); const p = C.indProceso(C.compute(d, { corte: CORTE }));
  check('Sin grupo de comparación: solo antes y después (−9 h), con advertencia', [p.resultado.value, p.resultado.sinComparacion, p.resultado.dCmp].join(','), '-9,true,'); }
{ const d = clone(D); const ws = [...new Set(d.unidades.map(u => u.semana_inicio))].sort((a, b) => a - b); d.unidades = d.unidades.filter(u => u.semana_inicio >= ws[4]);
  const p = C.indProceso(C.compute(d, { corte: CORTE }));
  check('Menos de 8 semanas a un lado: advierte periodo corto', [p.resultado.periodoCorto, p.resultado.semanasMin].join(','), 'true,4'); }
{ const d = clone(D); d.unidades.forEach(u => { u.min_elaboracion_suma = null; u.min_revision_suma = null; }); const p = C.indProceso(C.compute(d, { corte: CORTE }));
  check('Sin minutos medidos: tiempo neto «Sin datos», el resto sigue', [p.tiempo.status, p.tiempo.reason, p.resultado.value].join(','), 'nodata,faltan_minutos,-6'); }
{ const r = C.compute(D, { corte: CORTE, mitad: true });
  const cnt = new Map(), cut = C.dayNum(CORTE), from = C.monday(cut) - 77, acc = new Set(D.personas.filter(p => p.tiene_acceso).map(p => p.id_persona));
  for (const u of D.uso) if (acc.has(u.id_persona) && u.acciones > 0 && u.semana_inicio >= from && u.semana_inicio <= cut) cnt.set(u.id_persona, (cnt.get(u.id_persona) || 0) + 1);
  const want = [...cnt.values()].filter(x => x >= 6).length;
  check(`Umbral «mitad de las semanas» (6 de 12) recalcula el indicador 3: ${r.ind.habito.num} de ${r.ind.habito.den}`, [r.ind.habito.num, r.ind.habito.umbral, r.ind.habito.mitad].join(','), [want, 6, true].join(','));
  check('…y cambia frente a 9 de 12', r.ind.habito.num > 66, true); }
{ const d = clone(D); const p0 = d.personas.find(p => p.tiene_acceso && p.elegible); d.personas.push(Object.assign({}, p0));
  d.uso.push({ id_persona: d.uso[d.uso.length - 1].id_persona, semana_inicio: d.uso[d.uso.length - 1].semana_inicio, acciones: 5 });
  const r = C.compute(d, { corte: CORTE });
  check('Una persona con dos filas (dos herramientas) cuenta una sola vez', [r.ind.acceso.num, r.ind.acceso.den, r.ind.activacion.num, r.ind.habito.num].join(','), '300,480,240,66'); }
{ const p = C.parseCSV('id_persona;semana_inicio;acciones;horas_asistidas;valor_estimado\np-1;2026-10-19;4;0,4;28,8\n'), v = C.validate(C.detectFile(p.header, 'x.csv'), p, 'x.csv');
  check('Multiplicadores del proveedor: se ignoran y se avisa', [v.ok, v.key, Object.keys(v.rows[0]).join('+'), v.notes.find(n => n.code === 'col_proveedor').cols.join('+')].join(' '), 'true uso id_persona+semana_inicio+acciones horas_asistidas+valor_estimado');
  check('Separador punto y coma (Excel en español): se detecta', p.delim, ';'); }
{ const bad = []; const scan = t => { if (t && t.cols.some(c => /persona/.test(c) && c !== 'con_semana_activa')) bad.push(t.cols.join()); };
  Object.values(R.ind).forEach(x => scan(x.trace)); R.procesosU.forEach(p => ['integracion', 'resultado', 'calidad', 'tiempo'].forEach(k => scan(p[k].trace)));
  check('Ninguna tabla de trazabilidad lleva identificadores de persona', bad.join(' | '), '');
  check('Todas las tarjetas con valor traen su trazabilidad', Object.values(R.ind).every(x => x.trace && x.trace.filas > 0) && ['integracion', 'resultado', 'calidad', 'tiempo'].every(k => P[k].trace && P[k].trace.filas > 0), true); }
{ const { d, rep } = load('plantillas'), { d: e, rep: repE } = load('plantillas/en', true);
  check('Las cinco plantillas en español se validan', C.FILE_KEYS.every(k => rep[k] && rep[k].ok), true);
  check('Las cinco plantillas en inglés se validan y dan las mismas filas', C.FILE_KEYS.every(k => repE[k] && repE[k].ok) && ['uso', 'unidades', 'alertas'].every(k => JSON.stringify(d[k].map(r => Object.values(r).filter(v => typeof v !== 'string'))) === JSON.stringify(e[k].map(r => Object.values(r).filter(v => typeof v !== 'string')))), true); }

console.log(`\n${n - fails} de ${n} comprobaciones pasaron.`);
if (fails) { console.error(`${fails} fallo(s).`); process.exit(1); }
