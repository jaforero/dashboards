#!/usr/bin/env node
/* Genera los cinco CSV del caso ilustrativo (Aurora / Northgate Supply), las plantillas y los diccionarios.
   Datos HIPOTÉTICOS. Reproducible: semilla fija, sin fecha del sistema, sin dependencias.

     node adopcion-ia/tools/generar-datos.js      → reescribe adopcion-ia/data/
     node adopcion-ia/tools/probar.js             → comprueba que los ocho indicadores coinciden

   Los totales de abajo son los del artículo. Lo que la semilla reparte es cómo se distribuyen por semana. */
'use strict';
const fs = require('fs'), path = require('path');
const C = require('../calc.js');
const OUT = path.join(__dirname, '..', 'data');

/* ---------- parámetros del caso ---------- */
const SEED = 20261113;
const CORTE = '2026-10-25';                 // domingo: las ventanas coinciden con semanas completas
const SEMANAS_HAB = 12, SEMANAS_HIST = 16;  // 4 semanas de historia anterior a la ventana de hábito
const CONCENTRACION = 0.58;                 // cifra nueva (no está en el artículo): acciones del 10 % más activo
const SERVICIOS_NO_AUTORIZADOS = 9;         // cifra nueva: servicios con tráfico en el último mes
const ACC_TOTAL = 20000;                    // acciones en la ventana de hábito
/* área: [empleados, elegibles, con acceso, activas en 28 días, con hábito (≥9 de 12), de ellas en el 10 % más activo] */
const AREAS = [
  ['Comercial', 150, 130, 90, 76, 27, 13],
  ['Operaciones', 180, 120, 60, 38, 8, 2],
  ['Finanzas', 70, 60, 40, 38, 4, 0],             // activación alta, hábito bajo
  ['Atención al cliente', 110, 100, 70, 58, 12, 4],
  ['Gestión humana', 50, 40, 25, 18, 6, 2],
  ['Analítica', 40, 30, 15, 12, 9, 9],            // pocos usuarios, muy intensivos
  /* A propósito, ningún área tiene acceso por encima del total y activación por debajo: la lectura 1
     («mucho acceso, poca activación») no coincide con Aurora, como en el artículo (80 % probó la herramienta). */
];
const AREAS_EN = { 'Comercial': 'Sales', 'Operaciones': 'Operations', 'Finanzas': 'Finance', 'Atención al cliente': 'Customer service', 'Gestión humana': 'Human resources', 'Analítica': 'Analytics' };
const EQUIPOS_EN = { 'Zona norte': 'Midwest region', 'Zona sur': 'Southeast region' };
/* procesos: [área, nombre, name, ia_aplicable, procedimiento, registros, entregables, dueño] */
const PROCESOS = [
  ['Comercial', 'Cotizaciones comerciales', 'Sales quotes', 1, 1, 1, 1, 1],
  ['Comercial', 'Propuestas para licitaciones', 'Bid proposals', 1, 0, 1, 1, 0],
  ['Comercial', 'Seguimiento de oportunidades', 'Opportunity follow-up', 1, 1, 1, 0, 0],
  ['Comercial', 'Preparación de visitas a clientes', 'Customer visit prep', 1, 0, 1, 0, 0],
  ['Comercial', 'Respuesta a solicitudes de información', 'Responses to information requests', 1, 0, 0, 0, 1],
  ['Comercial', 'Actualización de listas de precios', 'Price list updates', 1, 0, 0, 0, 0],
  ['Comercial', 'Informes de ventas por zona', 'Sales reports by region', 1, 0, 0, 0, 0],
  ['Comercial', 'Elaboración de contratos de suministro', 'Supply contract drafting', 1, 0, 0, 0, 0],
  ['Comercial', 'Atención de reclamos comerciales', 'Commercial claims handling', 1, 0, 0, 0, 0],
  ['Comercial', 'Entrega de muestras', 'Sample delivery', 0, 0, 0, 0, 0],
  ['Comercial', 'Montaje de exhibiciones', 'Trade display setup', 0, 0, 0, 0, 0],
  ['Operaciones', 'Programación de despachos', 'Shipment scheduling', 1, 1, 0, 0, 1],
  ['Operaciones', 'Reportes de novedades de entrega', 'Delivery incident reports', 1, 0, 1, 0, 0],
  ['Operaciones', 'Órdenes de compra a proveedores', 'Supplier purchase orders', 1, 0, 0, 0, 1],
  ['Operaciones', 'Planeación de inventario', 'Inventory planning', 1, 0, 0, 0, 0],
  ['Operaciones', 'Conciliación de inventario', 'Inventory reconciliation', 1, 0, 0, 0, 0],
  ['Operaciones', 'Gestión de devoluciones', 'Returns management', 1, 0, 0, 0, 0],
  ['Operaciones', 'Evaluación de transportadores', 'Carrier evaluation', 1, 0, 0, 0, 0],
  ['Operaciones', 'Instructivos de bodega', 'Warehouse work instructions', 1, 0, 0, 0, 0],
  ['Operaciones', 'Seguimiento de pedidos', 'Order tracking', 1, 0, 0, 0, 0],
  ['Operaciones', 'Reclamos a proveedores', 'Supplier claims', 1, 0, 0, 0, 0],
  ['Operaciones', 'Informes de nivel de servicio', 'Service level reports', 1, 0, 0, 0, 0],
  ['Operaciones', 'Cargue y descargue', 'Loading and unloading', 0, 0, 0, 0, 0],
  ['Operaciones', 'Alistamiento de pedidos', 'Order picking', 0, 0, 0, 0, 0],
  ['Operaciones', 'Mantenimiento de montacargas', 'Forklift maintenance', 0, 0, 0, 0, 0],
  ['Finanzas', 'Conciliaciones bancarias', 'Bank reconciliations', 1, 1, 0, 1, 0],
  ['Finanzas', 'Cierre contable mensual', 'Month-end close', 1, 0, 0, 0, 1],
  ['Finanzas', 'Análisis de cartera', 'Receivables analysis', 1, 0, 1, 0, 0],
  ['Finanzas', 'Causación de facturas de proveedores', 'Supplier invoice posting', 1, 0, 0, 0, 0],
  ['Finanzas', 'Informes para la junta', 'Board reports', 1, 0, 0, 0, 0],
  ['Finanzas', 'Presupuesto anual', 'Annual budget', 1, 0, 0, 0, 0],
  ['Finanzas', 'Respuesta a requerimientos de auditoría', 'Audit request responses', 1, 0, 0, 0, 0],
  ['Finanzas', 'Arqueo de caja', 'Cash count', 0, 0, 0, 0, 0],
  ['Finanzas', 'Custodia de títulos', 'Securities custody', 0, 0, 0, 0, 0],
  ['Atención al cliente', 'Respuesta a casos por correo', 'Email case responses', 1, 0, 1, 0, 0],
  ['Atención al cliente', 'Clasificación de casos', 'Case triage', 1, 0, 0, 0, 1],
  ['Atención al cliente', 'Base de respuestas frecuentes', 'Frequent answers knowledge base', 1, 0, 0, 0, 0],
  ['Atención al cliente', 'Seguimiento de garantías', 'Warranty follow-up', 1, 0, 0, 0, 0],
  ['Atención al cliente', 'Informes de motivos de contacto', 'Contact reason reports', 1, 0, 0, 0, 0],
  ['Atención al cliente', 'Escalamiento de reclamos', 'Complaint escalation', 1, 0, 0, 0, 0],
  ['Atención al cliente', 'Atención en mostrador', 'Counter service', 0, 0, 0, 0, 0],
  ['Gestión humana', 'Descripciones de cargo y vacantes', 'Job descriptions and requisitions', 1, 1, 0, 1, 0],
  ['Gestión humana', 'Filtro de hojas de vida', 'Resume screening', 1, 0, 0, 0, 1],
  ['Gestión humana', 'Respuesta a solicitudes de empleados', 'Employee request responses', 1, 0, 0, 0, 0],
  ['Gestión humana', 'Material de inducción', 'Onboarding materials', 1, 0, 0, 0, 0],
  ['Gestión humana', 'Exámenes médicos de ingreso', 'Pre-employment medical exams', 0, 0, 0, 0, 0],
  ['Gestión humana', 'Entrega de dotación', 'Uniform and equipment issue', 0, 0, 0, 0, 0],
  ['Analítica', 'Informes periódicos de gestión', 'Recurring management reports', 1, 0, 1, 0, 0],
  ['Analítica', 'Análisis a solicitud', 'Ad hoc analyses', 1, 0, 0, 0, 0],
  ['Analítica', 'Documentación de modelos', 'Model documentation', 1, 0, 0, 0, 0],
  ['Analítica', 'Administración de accesos a datos', 'Data access administration', 0, 0, 0, 0, 0],
  ['Analítica', 'Respaldo de bases de datos', 'Database backups', 0, 0, 0, 0, 0],
];
/* unidades del proceso de cotizaciones: 8 semanas antes y 8 después en cada zona */
const U = {
  con_ia: { equipo: 'Zona norte', cerrAntes: 2400, cerrDesp: [1200, 1200], asisDesp: [180, 300], media: [50, 41], retr: [96, 144], elab: [95, 75], rev: [12, 20] },
  comparacion: { equipo: 'Zona sur', cerrAntes: 2000, cerrDesp: [1000, 1000], media: [52, 49], retr: [80, 80] },
};
const ALERTAS = { meses: ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'],
  trafico_red: { serv: [5, 6, 6, 7, 8, SERVICIOS_NO_AUTORIZADOS], ev: [1840, 2210, 2475, 2930, 3310, 3620] },
  gasto: { serv: [1, 1, 2, 2, 3, 3], ev: [2, 3, 4, 5, 7, 8] } };

/* ---------- azar reproducible ---------- */
let s = SEED >>> 0;
const rnd = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/* n enteros en [lo, hi] que suman exactamente total */
function allot(n, total, lo, hi) {
  if (total < n * lo || total > n * hi) throw new Error(`allot imposible: ${n} valores en [${lo},${hi}] no suman ${total}`);
  const v = Array.from({ length: n }, () => int(lo, hi)); let d = total - v.reduce((a, b) => a + b, 0);
  while (d !== 0) { const i = int(0, n - 1); if (d > 0 && v[i] < hi) { v[i]++; d--; } else if (d < 0 && v[i] > lo) { v[i]--; d++; } }
  return v;
}
/* reparte total en n partes parecidas (±jit) que suman exactamente total */
const spread = (n, total, jit) => { const b = Math.floor(total / n); return allot(n, total, Math.max(0, Math.floor(b * (1 - jit))), Math.ceil(b * (1 + jit)) + 1); };

/* ---------- semanas ---------- */
const cut = C.dayNum(CORTE), lastMon = C.monday(cut);
const weeks = Array.from({ length: SEMANAS_HIST }, (_, i) => lastMon - 7 * (SEMANAS_HIST - 1 - i));   // de la más antigua a la última
const habWeeks = weeks.slice(-SEMANAS_HAB), oldWeeks = weeks.slice(0, SEMANAS_HIST - SEMANAS_HAB), last4 = weeks.slice(-4);

/* ---------- personas ---------- */
const ids = new Set(); const newId = () => { let x; do { x = 'p-' + Math.floor(rnd() * 0xffffff).toString(16).padStart(6, '0'); } while (ids.has(x)); ids.add(x); return x; };
const personas = [], grupos = { top: [], hab: [], oca: [], inact: [] };
for (const [area, emp, elig, acc, act, hab, top] of AREAS) {
  for (let i = 0; i < emp; i++) {
    const p = { id: newId(), area, elegible: i < elig ? 1 : 0, acceso: i < acc ? 1 : 0 };
    personas.push(p);
    if (i < top) grupos.top.push(p); else if (i < hab) grupos.hab.push(p); else if (i < act) grupos.oca.push(p); else if (i < acc) grupos.inact.push(p);
  }
}
shuffle(personas);

/* ---------- uso semanal ---------- */
const TOP_TOTAL = Math.round(ACC_TOTAL * CONCENTRACION), REST_TOTAL = ACC_TOTAL - TOP_TOTAL;
const HAB_TOTAL = grupos.hab.length * 100, OCA_TOTAL = REST_TOTAL - HAB_TOTAL;
const uso = [];
const put = (p, ws, total) => { const v = allot(ws.length, total, 1, Math.max(2, Math.ceil(total / ws.length * 2) + 2)); ws.forEach((w, i) => uso.push({ id: p.id, w, acciones: v[i] })); };
const pickWeeks = (pool, k) => shuffle(pool.slice()).slice(0, k).sort((a, b) => a - b);
allot(grupos.top.length, TOP_TOTAL, 280, 520).forEach((t, i) => put(grupos.top[i], pickWeeks(habWeeks, int(11, 12)), t));
allot(grupos.hab.length, HAB_TOTAL, 60, 150).forEach((t, i) => put(grupos.hab[i], pickWeeks(habWeeks, int(9, 12)), t));
{ /* ocasionales: 1 a 8 semanas activas, al menos una en los últimos 28 días; más gente con pocas semanas */
  const ks = grupos.oca.map(() => { const r = rnd(); return r < .45 ? int(1, 2) : r < .8 ? int(3, 5) : int(6, 8); });
  const lo = ks.map(k => k), tot = allot(ks.length, OCA_TOTAL - lo.reduce((a, b) => a + b, 0), 0, 70);
  grupos.oca.forEach((p, i) => {
    const one = last4[int(0, 3)], rest = pickWeeks(habWeeks.filter(w => w !== one), ks[i] - 1);
    put(p, [one, ...rest].sort((a, b) => a - b), ks[i] + tot[i]);   // máximo 78 acciones: siempre por debajo del grupo más activo
  });
}
/* historia anterior a la ventana: parte de quienes hoy no usan la herramienta sí la probó */
for (const p of shuffle(grupos.inact.slice()).slice(0, 30)) put(p, pickWeeks(oldWeeks, int(1, 3)), int(3, 12));
for (const p of shuffle([...grupos.oca, ...grupos.hab, ...grupos.top]).slice(0, 150)) put(p, pickWeeks(oldWeeks, int(1, 4)), int(4, 40));
uso.sort((a, b) => a.w - b.w || (a.id < b.id ? -1 : 1));

/* ---------- unidades ---------- */
const unidades = [];
const antesW = weeks.slice(0, 8), despW = weeks.slice(8);
function bloque(grupo, cfg, ws, periodo, cerr, asis, media, retr, elab, rev) {
  const n = ws.length;
  const res = new Array(n).fill(0);
  const tot = cerr.reduce((a, b) => a + b, 0);
  /* resultado: media semanal con ruido de ±3 % y ajuste para que la suma sea exacta */
  let target = Math.round(media * tot), acc = 0;
  cerr.forEach((c, i) => { res[i] = i < n - 1 ? Math.round(c * media * (1 + (rnd() - .5) * .06)) : 0; if (i < n - 1) acc += res[i]; });
  res[n - 1] = target - acc;
  const re = spread(n, retr, .35);
  const el = elab == null ? null : (() => { const v = cerr.map(c => Math.round(c * elab * (1 + (rnd() - .5) * .05))); v[n - 1] += Math.round(elab * tot) - v.reduce((a, b) => a + b, 0); return v; })();
  const rv = rev == null ? null : (() => { const v = cerr.map(c => Math.round(c * rev * (1 + (rnd() - .5) * .08))); v[n - 1] += Math.round(rev * tot) - v.reduce((a, b) => a + b, 0); return v; })();
  ws.forEach((w, i) => unidades.push({ id_proceso: 'PR-001', equipo: cfg.equipo, grupo, w, periodo, cerr: cerr[i], asis: asis ? asis[i] : 0, res: res[i], retr: re[i], elab: el ? el[i] : '', rev: rv ? rv[i] : '' }));
}
for (const [grupo, cfg] of Object.entries(U)) {
  const ia = grupo === 'con_ia';
  bloque(grupo, cfg, antesW, 'antes', spread(8, cfg.cerrAntes, .06), null, cfg.media[0], cfg.retr[0], ia ? cfg.elab[0] : null, ia ? cfg.rev[0] : null);
  const cerrD = [...spread(4, cfg.cerrDesp[0], .06), ...spread(4, cfg.cerrDesp[1], .06)];
  const asisD = ia ? [...[30, 40, 50, 60].map((x, i, a) => i < 3 ? x : cfg.asisDesp[0] - a.slice(0, 3).reduce((p, q) => p + q, 0)), ...spread(4, cfg.asisDesp[1], .08)] : null;
  bloque(grupo, cfg, despW, 'despues', cerrD, asisD, cfg.media[1], cfg.retr[1], ia ? cfg.elab[1] : null, ia ? cfg.rev[1] : null);
}

/* ---------- escritura ---------- */
const W = (rel, txt) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, txt); };
const cols = k => C.FILES[k].cols.map(c => c.k), colsEn = k => C.FILES[k].cols.map(c => c.en);
const DATA = {
  personas: personas.map(p => [p.id, p.area, p.elegible, p.acceso]),
  uso: uso.map(r => [r.id, C.isoOf(r.w), r.acciones]),
  procesos: PROCESOS.map((p, i) => ['PR-' + String(i + 1).padStart(3, '0'), p[0], p[1], ...p.slice(3)]),
  unidades: unidades.map(r => [r.id_proceso, r.equipo, r.grupo, C.isoOf(r.w), r.periodo, r.cerr, r.asis, r.res, r.retr, r.elab, r.rev]),
  alertas: ALERTAS.meses.flatMap((m, i) => ['trafico_red', 'gasto'].map(t => [m + '-01', t, ALERTAS[t].serv[i], ALERTAS[t].ev[i]])),
};
for (const k of C.FILE_KEYS) W('ejemplo/' + C.FILES[k].file, C.toCSV(cols(k), DATA[k]));

/* etiquetas en inglés del mismo conjunto: Northgate Supply (no es un segundo conjunto de datos) */
const nombresEn = {}; PROCESOS.forEach(p => nombresEn[p[1]] = p[2]);
W('ejemplo/etiquetas-en.js', '/* Generado por tools/generar-datos.js. Etiquetas en inglés del caso ilustrativo (Northgate Supply): mismos datos, otros nombres. */\n'
  + 'window.EJEMPLO_EN=' + JSON.stringify({ areas: AREAS_EN, equipos: EQUIPOS_EN, procesos: nombresEn }, null, 1) + ';\n'
  + 'window.EJEMPLO_CORTE=' + JSON.stringify(CORTE) + ';\n');

/* plantillas: encabezados + dos filas de ejemplo, en español y en inglés */
const EJ = {
  personas: [['p-a1b2c3', 'Comercial', 1, 1], ['p-d4e5f6', 'Operaciones', 1, 0]],
  uso: [['p-a1b2c3', '2026-10-19', 14], ['p-a1b2c3', '2026-10-12', 6]],
  procesos: [['PR-001', 'Comercial', 'Cotizaciones comerciales', 1, 1, 1, 0, 1], ['PR-002', 'Finanzas', 'Conciliaciones bancarias', 1, 0, 0, 0, 0]],
  unidades: [['PR-001', 'Zona norte', 'con_ia', '2026-10-19', 'despues', 300, 75, 12300, 18, 22500, 6000], ['PR-001', 'Zona sur', 'comparacion', '2026-10-19', 'despues', 250, 0, 12250, 10, '', '']],
  alertas: [['2026-10-01', 'trafico_red', 9, 3620], ['2026-10-01', 'gasto', 3, 8]],
};
const EN_VAL = { 'Comercial': 'Sales', 'Operaciones': 'Operations', 'Finanzas': 'Finance', 'Cotizaciones comerciales': 'Sales quotes', 'Conciliaciones bancarias': 'Bank reconciliations',
  'Zona norte': 'Midwest region', 'Zona sur': 'Southeast region', con_ia: 'with_ai', comparacion: 'comparison', despues: 'after', antes: 'before', trafico_red: 'network_traffic', gasto: 'spend' };
for (const k of C.FILE_KEYS) {
  W('plantillas/' + C.FILES[k].file, C.toCSV(cols(k), EJ[k]));
  W('plantillas/en/' + C.FILES[k].en, C.toCSV(colsEn(k), EJ[k].map(r => r.map(v => EN_VAL[v] || v))));
}
/* diccionario de columnas */
const TIPO = { text: ['texto', 'text'], bin: ['0/1', '0/1'], int: ['entero', 'integer'], num: ['número', 'number'], week: ['fecha AAAA-MM-DD (lunes)', 'date YYYY-MM-DD (Monday)'], month: ['fecha AAAA-MM-DD (día 1)', 'date YYYY-MM-DD (day 1)'], enum: ['texto', 'text'] };
const DESC = {
  'personas.id_persona': ['Identificador seudonimizado. Nunca nombre, correo ni documento', 'Pseudonymized identifier. Never a name, email or ID number'],
  'personas.area': ['Área o unidad organizativa en la fecha de corte', 'Department or organizational unit on the cutoff date'],
  'personas.elegible': ['1 si su cargo incluye tareas donde la herramienta es aplicable', '1 if the role includes tasks the tool applies to'],
  'personas.tiene_acceso': ['1 si tiene licencia o acceso habilitado en la fecha de corte', '1 if the person holds a license or enabled access on the cutoff date'],
  'uso.id_persona': ['Mismo identificador de personas.csv', 'Same identifier as in people.csv'],
  'uso.semana_inicio': ['Lunes de la semana calendario', 'Monday of the calendar week'],
  'uso.acciones': ['Acciones intencionales (instrucciones enviadas, resúmenes pedidos, sugerencias aceptadas). Abrir el panel no cuenta', 'Intentional actions (prompts sent, summaries requested, suggestions accepted). Opening the panel does not count'],
  'procesos.id_proceso': ['Código del inventario de procesos', 'Process inventory code'],
  'procesos.area': ['Área dueña del proceso', 'Department that owns the process'],
  'procesos.nombre': ['Nombre del proceso (por ejemplo, «Cotizaciones comerciales»)', 'Process name (for example, "Sales quotes")'],
  'procesos.ia_aplicable': ['1 si la IA es aplicable. Es un juicio del dueño del proceso', '1 if AI is applicable. A judgment call by the process owner'],
  'procesos.ev_procedimiento': ['1 si el procedimiento escrito menciona el paso asistido', '1 if the written procedure mentions the assisted step'],
  'procesos.ev_registros': ['1 si hay registros de uso de las últimas 4 semanas', '1 if there are usage logs from the last 4 weeks'],
  'procesos.ev_entregables': ['1 si existe una muestra de entregables producidos con el paso', '1 if a sample of deliverables produced with the step exists'],
  'procesos.ev_dueno': ['1 si el dueño del proceso lo confirma con volumen', '1 if the process owner confirms it with volumes'],
  'unidades.id_proceso': ['Código del proceso, igual al de procesos.csv', 'Process code, same as in processes.csv'],
  'unidades.equipo': ['Equipo, zona o célula', 'Team, region or cell'],
  'unidades.grupo': ['con_ia o comparacion', 'with_ai or comparison'],
  'unidades.semana_inicio': ['Lunes de la semana calendario', 'Monday of the calendar week'],
  'unidades.periodo': ['antes o despues de introducir el paso asistido', 'before or after the assisted step was introduced'],
  'unidades.unidades_cerradas': ['Cotizaciones, casos o conciliaciones cerradas en la semana', 'Quotes, cases or reconciliations closed in the week'],
  'unidades.unidades_asistidas': ['De las cerradas, cuántas llevan la marca del paso asistido', 'Of the closed units, how many carry the assisted-step flag'],
  'unidades.resultado_suma': ['Suma del indicador de resultado (por ejemplo, horas de ciclo de todas las unidades cerradas)', 'Sum of the outcome metric (for example, cycle hours across all closed units)'],
  'unidades.unidades_retrabajo': ['Unidades devueltas, corregidas o reabiertas', 'Units returned, corrected or reopened'],
  'unidades.min_elaboracion_suma': ['Suma de minutos medidos de elaboración. Opcional', 'Sum of measured drafting minutes. Optional'],
  'unidades.min_revision_suma': ['Suma de minutos medidos de revisión y corrección. Opcional', 'Sum of measured review and correction minutes. Optional'],
  'alertas.mes': ['Primer día del mes', 'First day of the month'],
  'alertas.tipo': ['trafico_red o gasto', 'network_traffic or spend'],
  'alertas.servicios_no_autorizados': ['Servicios de IA no provistos con tráfico o con pagos en el mes', 'AI services not provided by the company with traffic or payments in the month'],
  'alertas.eventos': ['Solicitudes de red agregadas o líneas de gasto. Sin identificar personas', 'Aggregate network requests or expense lines. No individuals identified'],
};
const FUENTE = { personas: ['Directorio de personal e inventario de licencias', 'HR directory and license inventory'], uso: ['Exportación del panel de administración de la herramienta', 'Export from the tool\'s admin dashboard'],
  procesos: ['Inventario de procesos y sus dueños', 'Process inventory and owners'], unidades: ['El sistema donde se ejecuta el proceso (CRM, ERP, mesa de ayuda)', 'The system the process runs in (CRM, ERP, help desk)'], alertas: ['Seguridad informática y contabilidad', 'IT security and accounting'] };
const dic = [[], []];
for (const k of C.FILE_KEYS) for (const c of C.FILES[k].cols) {
  const d = DESC[k + '.' + c.k]; if (!d) throw new Error('falta descripción de ' + k + '.' + c.k);
  dic[0].push([C.FILES[k].file, c.k, TIPO[c.t][0], c.req ? 'sí' : 'no', d[0], FUENTE[k][0]]);
  dic[1].push([C.FILES[k].en, c.en, TIPO[c.t][1], c.req ? 'yes' : 'no', d[1], FUENTE[k][1]]);
}
W('plantillas/diccionario_columnas.csv', C.toCSV(['archivo', 'columna', 'tipo', 'obligatoria', 'descripcion', 'fuente'], dic[0]));
W('plantillas/en/column_dictionary.csv', C.toCSV(['file', 'column', 'type', 'required', 'description', 'source'], dic[1]));
W('diccionario.js', '/* Generado por tools/generar-datos.js: diccionario de columnas que muestra la pestaña «Usa tus datos». */\nwindow.DICCIONARIO=' + JSON.stringify({ es: dic[0], en: dic[1] }) + ';\n');

console.log(`Caso ilustrativo generado (semilla ${SEED}, corte ${CORTE}):`);
for (const k of C.FILE_KEYS) console.log(`  ejemplo/${C.FILES[k].file.padEnd(18)} ${String(DATA[k].length).padStart(5)} filas`);
console.log('  plantillas/ (es y en) y diccionarios de columnas');
