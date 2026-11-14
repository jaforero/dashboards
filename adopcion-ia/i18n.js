/* /adopcion-ia/ · textos en español e inglés: clave → [es, en]. Las {llaves} se reemplazan en T() de app.js.
   Las cinco lecturas de «Qué decidir» y los nombres en inglés (Northgate Supply, Midwest, quotes) vienen del artículo.
   Al cambiar un texto, sube el ?v= del <script> en index.html. */
window.STR = {
  '__title': ['Tablero de adopción de IA: cuatro preguntas, ocho indicadores · Javier Forero', 'AI adoption scorecard: four questions, eight metrics · Javier Forero'],
  'top.tag': ['Tablero y plantilla · registros, no encuestas', 'Scorecard and template · records, not surveys'],
  'hd.eyebrow': ['Inteligencia artificial · Adopción y medición', 'Artificial intelligence · Adoption and measurement'],
  'hd.title': ['Adopción de IA: cuatro preguntas, ocho indicadores', 'AI adoption: four questions, eight metrics'],
  'hd.deck': ['Un tablero mínimo para saber si tu empresa tiene inteligencia artificial (IA), la usa, la integró en sus procesos y obtiene resultados. Cada número sale de registros de sistemas, no de encuestas. Recorre el caso de ejemplo o carga los registros de tu empresa. El porqué de cada indicador está en el artículo <a href="{url}">«Medir la adopción de IA: no es un porcentaje, son cuatro preguntas»</a>.',
    'A minimum scorecard to find out whether your company has artificial intelligence (AI), uses it, has built it into its processes and gets results. Every number comes from system records, not surveys. Walk through the sample case or load the records from your own company. The reasoning behind each metric is in the article <a href="{url}">"Measuring AI adoption: it is not one percentage, it is four questions"</a>.'],
  'flag.ej': ['<span><b>Caso ilustrativo con datos hipotéticos.</b> {emp} es una distribuidora que no existe. Sus cifras son las del artículo.</span>', '<span><b>Illustrative case with hypothetical data.</b> {emp} is a distributor that does not exist. Its numbers are the ones in the article.</span>'],
  'flag.mis': ['<span><b>Mis datos.</b> Tus archivos se procesan en tu navegador. No se envían a ningún servidor ni se guardan.{extra}</span>', '<span><b>My data.</b> Your files are processed in your browser. They are not sent to any server and they are not stored.{extra}</span>'],
  'flag.vacio': [' Todavía no hay archivos cargados: ábrelos en «Usa tus datos».', ' No files loaded yet: add them under "Use your data".'],
  'emp': ['Aurora', 'Northgate Supply'],
  'ct.mode': ['Datos', 'Data'], 'ct.ej': ['Datos de ejemplo', 'Sample data'], 'ct.mis': ['Mis datos', 'My data'],
  'ct.corte': ['Fecha de corte', 'Cutoff date'], 'ct.vact': ['Ventana de activación (días)', 'Activation window (days)'],
  'ct.vhab': ['Ventana de hábito (semanas)', 'Habit window (weeks)'], 'ct.umb': ['Umbral de hábito (semanas activas)', 'Habit threshold (active weeks)'],
  'ct.mitad': ['Usar «al menos la mitad de las semanas»', 'Use "at least half the weeks"'],
  'tab.resumen': ['Las cuatro preguntas', 'The four questions'], 'tab.area': ['Por área', 'By department'], 'tab.proceso': ['Por proceso', 'By process'],
  'tab.alertas': ['Alertas', 'Alerts'], 'tab.decidir': ['Qué decidir', 'What to decide'], 'tab.datos': ['Usa tus datos', 'Use your data'], 'tab.metodo': ['Método', 'Method'],
  'theme.dark': ['Cambiar a tema oscuro', 'Switch to dark theme'], 'theme.light': ['Cambiar a tema claro', 'Switch to light theme'],
  'foot.note': ['Marco y tablero de elaboración propia. No es un estándar ni está validado comparativamente. Los datos de ejemplo son hipotéticos.', 'Framework and scorecard are my own work. This is not a standard and it has not been comparatively validated. The sample data is hypothetical.'],
  'foot.art': ['Leer el artículo', 'Read the article'],
  'loading': ['Cargando el caso ilustrativo…', 'Loading the illustrative case…'],

  /* parámetros plegables, resumen y siguientes pasos */
  'pm.sum': ['Corte: {c} · activación: {a} días · hábito: {u} de {n} semanas', 'Cutoff: {c} · activation: {a} days · habit: {u} of {n} weeks'],
  'pm.edit': ['Cambiar', 'Change'],
  'pm.aria': ['Parámetros del cálculo', 'Calculation settings'],
  'dc.count': ['Coinciden <b>{k} de {n}</b> señales con los datos cargados.', '<b>{k} of {n}</b> signals match the loaded data.'],
  'dc.countNo': ['{m} no se pueden evaluar: faltan datos.', '{m} cannot be evaluated: data is missing.'],
  'nx.title': ['Qué hacer con estos números', 'What to do with these numbers'],
  'nx.decidir': ['Ver qué decidir', 'See what to decide'], 'nx.decidir.d': ['Cinco señales, con la hipótesis que debes investigar y la acción que te corresponde.', 'Five signals, with the hypothesis to investigate and the action that falls to you.'],
  'nx.datos': ['Calcularlo con tus datos', 'Run it on your data'], 'nx.datos.d': ['Cinco plantillas CSV. Se procesan en tu navegador y no se envían ni se guardan.', 'Five CSV templates. They are processed in your browser and never sent or stored.'],
  'nx.art': ['Leer el artículo', 'Read the article'], 'nx.art.d': ['Por qué cuatro preguntas y no un porcentaje, y dónde la evidencia es floja.', 'Why four questions rather than one percentage, and where the evidence is thin.'],

  /* capas */
  'ly.1': ['Actividad', 'Activity'], 'ly.2': ['Adopción', 'Adoption'], 'ly.3': ['Transformación', 'Transformation'], 'ly.4': ['Impacto', 'Impact'],
  'ly.1.q': ['¿Quién puede usarla y quién la probó? No demuestra que exista un hábito.', 'Who can use it, and who has tried it? It does not prove that a habit exists.'],
  'ly.2.q': ['¿Quién la usa de forma habitual en su trabajo? No demuestra en qué proceso ni con qué efecto.', 'Who uses it routinely in their work? It does not prove in which process, or to what effect.'],
  'ly.3.q': ['¿Qué procesos se ejecutan hoy de otra manera? No demuestra que el proceso haya mejorado.', 'Which processes now run differently? It does not prove that the process improved.'],
  'ly.4.q': ['¿Qué resultado cambió y cuánto se debe a la IA?', 'Which outcome changed, and how much of it is due to AI?'],
  'ly.proc': ['Proceso', 'Process'],

  /* indicadores */
  'in.acceso': ['Acceso', 'Access'], 'in.activacion': ['Activación', 'Activation'], 'in.habito': ['Uso habitual', 'Habitual use'],
  'in.cobertura': ['Cobertura de procesos', 'Process coverage'], 'in.integracion': ['Integración en el flujo', 'Workflow integration'],
  'in.resultado': ['Resultado operativo con comparación', 'Operating outcome against a comparison'], 'in.calidad': ['Calidad y retrabajo', 'Quality and rework'],
  'in.tiempo': ['Tiempo neto recuperado', 'Net time recovered'],
  'f.acceso': ['personas elegibles con acceso ÷ personas elegibles', 'eligible people with access ÷ eligible people'],
  'f.activacion': ['personas con acceso y al menos 1 acción en la ventana de activación ÷ personas con acceso', 'people with access and at least 1 action in the activation window ÷ people with access'],
  'f.habito': ['personas activas en al menos {u} de {n} semanas ÷ personas con al menos 1 semana activa en la ventana de hábito', 'people active in at least {u} of {n} weeks ÷ people with at least 1 active week in the habit window'],
  'f.cobertura': ['procesos con caso de uso verificado (2 o más evidencias) ÷ procesos donde la IA es aplicable', 'processes with a verified use case (2 or more pieces of evidence) ÷ processes where AI is applicable'],
  'f.integracion': ['total de unidades asistidas ÷ total de unidades cerradas, en las últimas {s} semanas del periodo «después» del grupo con IA', 'total assisted units ÷ total closed units, over the last {s} weeks of the "after" period for the group with AI'],
  'f.resultado': ['(promedio después − promedio antes en el grupo con IA) − (promedio después − promedio antes en el grupo de comparación); promedio = suma del resultado ÷ unidades cerradas', '(after average − before average in the group with AI) − (after average − before average in the comparison group); average = outcome total ÷ closed units'],
  'f.calidad': ['tasa = unidades con retrabajo ÷ unidades cerradas; efecto = (después − antes con IA) − (después − antes en comparación), en puntos porcentuales', 'rate = reworked units ÷ closed units; effect = (after − before with AI) − (after − before in comparison), in percentage points'],
  'f.tiempo': ['(minutos de elaboración por unidad antes − después − aumento de minutos de revisión por unidad) × unidades asistidas de las últimas {s} semanas, en horas', '(drafting minutes per unit before − after − increase in review minutes per unit) × assisted units in the last {s} weeks, in hours'],
  'n.acceso': ['Personas elegibles con acceso', 'Eligible people with access'], 'd.acceso': ['Personas elegibles', 'Eligible people'],
  'n.activacion': ['Personas con acceso y al menos 1 acción en la ventana', 'People with access and at least 1 action in the window'], 'd.activacion': ['Personas con acceso', 'People with access'],
  'n.habito': ['Personas activas en al menos {u} de {n} semanas', 'People active in at least {u} of {n} weeks'], 'd.habito': ['Personas con al menos 1 semana activa en la ventana', 'People with at least 1 active week in the window'],
  'n.cobertura': ['Procesos con caso de uso verificado', 'Processes with a verified use case'], 'd.cobertura': ['Procesos donde la IA es aplicable', 'Processes where AI is applicable'],
  'n.integracion': ['Unidades cerradas con el paso asistido', 'Units closed with the assisted step'], 'd.integracion': ['Unidades cerradas', 'Closed units'],
  'n.resultado': ['Cambio en el grupo con IA: {v}', 'Change in the group with AI: {v}'], 'd.resultado': ['Cambio en el grupo de comparación: {v}', 'Change in the comparison group: {v}'],
  'd.sincmp': ['No hay grupo de comparación', 'There is no comparison group'],
  'n.tiempo': ['Minutos netos por unidad: {v}', 'Net minutes per unit: {v}'], 'd.tiempo': ['Unidades asistidas: {v}', 'Assisted units: {v}'],
  'of': ['{a} de {b}', '{a} of {b}'],
  'nodata': ['Sin datos', 'No data'], 'small': ['Grupo demasiado pequeño', 'Group too small'],
  'small.note': ['Menos de {n} personas: no se reporta ningún valor.', 'Fewer than {n} people: no value is reported.'],

  /* notas de las tarjetas */
  'nt.act': ['Basta 1 acción en los últimos {d} días para contar.', 'A single action in the last {d} days is enough to count.'],
  'tabs.aria': ['Secciones del tablero', 'Scorecard sections'],
  'nt.umb': ['Umbral: {u} de {n} semanas activas.', 'Threshold: {u} of {n} active weeks.'],
  'nt.mitad': ['Umbral: al menos la mitad de las semanas ({u} de {n}).', 'Threshold: at least half the weeks ({u} of {n}).'],
  'nt.elig': ['Sobre los elegibles: {p} ({f}).', 'Over eligible people: {p} ({f}).'],
  'nt.integ': ['Últimas {s} semanas del periodo «después».', 'Last {s} weeks of the "after" period.'],
  'nt.integTodo': ['En todo el periodo «después» ({s} semanas): {p} ({f}).', 'Over the whole "after" period ({s} weeks): {p} ({f}).'],
  'nt.rel': ['{p} frente al promedio «antes» del grupo con IA.', '{p} against the "before" average of the group with AI.'],
  'nt.calc': ['Con IA: {a} → {b} ({x}). Comparación: {c} → {d} ({y}). El efecto es la diferencia entre esos dos cambios.', 'With AI: {a} → {b} ({x}). Comparison: {c} → {d} ({y}). The effect is the difference between those two changes.'],
  'nt.calcSolo': ['Con IA: {a} → {b} ({x}).', 'With AI: {a} → {b} ({x}).'],
  'nt.tiempo': ['({a} − {b}) minutos × {u} unidades asistidas ÷ 60. Es capacidad, no dinero.', '({a} − {b}) minutes × {u} assisted units ÷ 60. This is capacity, not money.'],
  'nt.sinsigno': ['El signo no dice si es bueno o malo: depende de tu indicador.', 'The sign does not say whether this is good or bad: it depends on your metric.'],
  'w.sincmp': ['Sin grupo de comparación: esto no demuestra que la IA causó el cambio.', 'No comparison group: this does not prove that AI caused the change.'],
  'w.corto': ['Periodo corto: el lado con menos datos tiene {n} semanas. Con menos de {m} a cada lado, el resultado puede ser ruido.', 'Short period: the side with the least data has {n} weeks. With fewer than {m} on each side, the result may be noise.'],
  'w.calidad': ['La calidad empeoró: el retrabajo subió {v} más que en el grupo de comparación. Mira esto antes de leer el resultado.', 'Quality got worse: rework rose {v} more than in the comparison group. Look at this before reading the outcome.'],
  'w.calidadSolo': ['La calidad empeoró: el retrabajo subió {v} entre antes y después. Mira esto antes de leer el resultado.', 'Quality got worse: rework rose by {v} from before to after. Look at this before reading the outcome.'],
  'u.h': ['horas', 'hours'], 'u.hmes': ['{v} horas al mes', '{v} hours a month'], 'u.hsem': ['{v} horas en {s} semanas', '{v} hours in {s} weeks'],
  'u.pp': ['{v} puntos porcentuales', '{v} percentage points'], 'u.min': ['{v} min', '{v} min'],
  'ej.unidad': ['cotizaciones', 'quotes'], 'gen.unidad': ['unidades', 'units'],
  'ej.resName': ['tiempo de ciclo', 'cycle time'], 'gen.resName': ['indicador de resultado', 'outcome metric'],

  /* trazabilidad */
  'tr.sum': ['Ver de dónde sale', 'See where it comes from'],
  'tr.formula': ['Fórmula', 'Formula'], 'tr.num': ['Numerador', 'Numerator'], 'tr.den': ['Denominador', 'Denominator'],
  'tr.win': ['Ventana de tiempo', 'Time window'], 'tr.files': ['Archivo de origen', 'Source file'], 'tr.rows': ['Filas que entraron al cálculo', 'Rows that went into the calculation'],
  'tr.range': ['Del {a} al {b}', '{a} to {b}'], 'tr.corte': ['Estado en la fecha de corte ({d})', 'Status on the cutoff date ({d})'], 'tr.hasta': ['Todas las semanas hasta la fecha de corte ({d})', 'All weeks up to the cutoff date ({d})'],
  'tr.dl': ['Descargar estas filas (CSV)', 'Download these rows (CSV)'],
  'tr.cap': ['Subconjunto agregado que entró al cálculo. Nunca por persona.', 'Aggregated subset that went into the calculation. Never per person.'],
  'tr.t1': ['Primer término', 'First term'], 'tr.t2': ['Segundo término', 'Second term'],

  /* motivos de «Sin datos» */
  'rs.falta_personas': ['Falta {personas}: el directorio de personal con el inventario de licencias.', 'Missing {personas}: the HR directory with the license inventory.'],
  'rs.falta_uso': ['Falta {uso}: la exportación semanal del panel de administración de la herramienta.', 'Missing {uso}: the weekly export from the tool\'s admin dashboard.'],
  'rs.falta_personas_uso': ['Faltan {personas} y {uso}.', 'Missing {personas} and {uso}.'],
  'rs.falta_procesos': ['Falta {procesos}: el inventario de procesos y sus dueños.', 'Missing {procesos}: the process inventory and its owners.'],
  'rs.falta_unidades': ['Falta {unidades}: las unidades cerradas por semana en el sistema donde se ejecuta el proceso.', 'Missing {unidades}: units closed per week in the system the process runs in.'],
  'rs.falta_alertas': ['Falta {alertas}: el registro mensual de seguridad informática y contabilidad.', 'Missing {alertas}: the monthly record from IT security and accounting.'],
  'rs.den_cero': ['El denominador es cero con los datos cargados.', 'The denominator is zero with the loaded data.'],
  'rs.sin_filas_corte': ['Ninguna fila es anterior a la fecha de corte.', 'No row falls before the cutoff date.'],
  'rs.falta_antes': ['No hay filas del periodo «antes» para el grupo con IA.', 'There are no "before" rows for the group with AI.'],
  'rs.falta_despues': ['No hay filas del periodo «después» para el grupo con IA.', 'There are no "after" rows for the group with AI.'],
  'rs.faltan_minutos': ['Faltan los minutos medidos (columnas opcionales {c1} y {c2}) en los dos periodos del grupo con IA.', 'Measured minutes are missing (optional columns {c1} and {c2}) in both periods for the group with AI.'],
  'rs.sin_procesos_aplicables': ['El área no tiene procesos con IA aplicable.', 'The department has no processes where AI is applicable.'],
  'rs.sin_unidades_area': ['Ningún proceso del área tiene unidades cargadas.', 'No process in the department has units loaded.'],

  /* lectura */
  'rd.title': ['Lectura de arriba abajo', 'Reading from top to bottom'],
  'rd.sub': ['El caso en una frase, armada con los valores de las tarjetas de abajo. Describe; no califica.', 'The case in one sentence, built from the values in the cards below. It describes; it does not grade.'],
  'rd.act': ['<span>{v}</span> probó la herramienta', '<span>{v}</span> tried the tool'],
  'rd.hab': ['<span>{v}</span> de los elegibles la usa con hábito', '<span>{v}</span> of eligible people use it habitually'],
  'rd.cob': ['<span>{v}</span> de los procesos tiene uso verificado', '<span>{v}</span> of processes have verified use'],
  'rd.int': ['<span>{v}</span> de las {u} pasa por el paso asistido', '<span>{v}</span> of {u} go through the assisted step'],
  'rd.res': ['el {r} cambió <span>{v}</span> frente a la comparación', '{r} changed by <span>{v}</span> against the comparison'],
  'rd.resSolo': ['el {r} cambió <span>{v}</span> entre antes y después, sin grupo de comparación', '{r} changed by <span>{v}</span> from before to after, with no comparison group'],
  'rd.cal': ['el retrabajo cambió <span>{v}</span>', 'rework changed by <span>{v}</span>'],
  'rd.tie': ['quedan <span>{v}</span> de capacidad', 'that leaves <span>{v}</span> of capacity'],
  'rd.falta': ['Sin datos para: {l}.', 'No data for: {l}.'],
  'rd.none': ['Todavía no hay datos para armar la lectura.', 'There is no data yet to build the reading.'],

  /* por área */
  'ar.title': ['Indicadores 1 a 5 por área', 'Metrics 1 to 5 by department'],
  'ar.sub': ['Compara las áreas entre sí y contra tu medición anterior. No hay un valor «bueno» que sirva para todas: un área con pocos usos muy integrados puede estar donde debe. Toca un encabezado para ordenar.', 'Compare departments with each other and with your previous measurement. No single "good" value fits all of them: a department with a few deeply integrated uses may be exactly where it should be. Tap a header to sort.'],
  'ar.area': ['Área', 'Department'], 'ar.n': ['Personas', 'People'],
  'ar.cap': ['Total de la empresa en la última fila. Las áreas con menos de {n} personas no muestran valores.', 'Company total in the last row. Departments with fewer than {n} people show no values.'],
  'ar.total': ['Total', 'Total'], 'ar.none': ['No hay áreas: carga {personas} o {procesos}.', 'There are no departments: load {personas} or {procesos}.'],

  /* por proceso */
  'pr.title': ['Procesos con unidades cargadas', 'Processes with units loaded'],
  'pr.sub': ['Para cada proceso: cuánto del trabajo pasa por el paso asistido y qué cambió frente a un equipo comparable que no lo usa.', 'For each process: how much of the work goes through the assisted step, and what changed against a comparable team that does not use it.'],
  'pr.none': ['Ningún proceso tiene unidades cargadas. {r}', 'No process has units loaded. {r}'],
  'pr.meta': ['Área: {a}. Con IA: {x}. Comparación: {y}.', 'Department: {a}. With AI: {x}. Comparison: {y}.'],
  'pr.sin': ['ninguno', 'none'],
  'pr.unidad': ['Unidad del indicador de resultado (por ejemplo, horas)', 'Unit of the outcome metric (for example, hours)'],
  'ch.res': ['Promedio del indicador de resultado por unidad cerrada', 'Average of the outcome metric per closed unit'],
  'ch.cal': ['Unidades con retrabajo sobre unidades cerradas', 'Reworked units over closed units'],
  'ch.alt': ['Gráfico de pendientes entre antes y después.', 'Slope chart from before to after.'],
  'ch.altG': ['{g}: de {a} a {b}.', '{g}: from {a} to {b}.'],
  'ch.data': ['Ver los datos del gráfico', 'See the chart data'],
  'g.con_ia': ['Con IA', 'With AI'], 'g.comparacion': ['Comparación', 'Comparison'], 'p.antes': ['Antes', 'Before'], 'p.despues': ['Después', 'After'],
  'ch.grupo': ['Grupo', 'Group'], 'ch.cambio': ['Cambio', 'Change'],

  /* alertas */
  'al.intro': ['Dos alertas que no son indicadores, pero cambian cómo lees los otros ocho.', 'Two alerts that are not metrics, but change how you read the other eight.'],
  'al.c.title': ['Concentración', 'Concentration'],
  'al.c.text': ['<b>{p}</b> de las acciones viene del 10 % más activo: {a} de {b} personas con acceso.', '<b>{p}</b> of actions come from the most active 10%: {a} of {b} people with access.'],
  'al.c.sub': ['Si es muy alta, la adopción depende de pocas personas. Ventana de hábito: {w}.', 'If it is very high, adoption depends on a few people. Habit window: {w}.'],
  'al.c.small': ['Grupo demasiado pequeño: el 10 % más activo serían {n} personas y el mínimo para reportar es {m}.', 'Group too small: the most active 10% would be {n} people, and the minimum to report is {m}.'],
  'al.c.top': ['10 % más activo', 'Most active 10%'], 'al.c.rest': ['90 % restante', 'Remaining 90%'],
  'al.c.g': ['Grupo', 'Group'], 'al.c.p': ['Personas con acceso', 'People with access'], 'al.c.a': ['Acciones', 'Actions'], 'al.c.s': ['Parte de las acciones', 'Share of actions'],
  'al.c.alt': ['Barra dividida en dos: el 10 % más activo hace {p} de las acciones y el 90 % restante, {q}.', 'Bar split in two: the most active 10% account for {p} of actions and the remaining 90% for {q}.'],
  'al.f.title': ['Uso fuera de las herramientas provistas', 'Use outside the tools you provide'],
  'al.f.sub': ['Datos agregados de seguridad informática y de contabilidad. No identifican personas.', 'Aggregate data from IT security and accounting. No individuals are identified.'],
  'al.f.traf': ['<b>{s}</b> servicios de IA no autorizados con tráfico en {m}', '<b>{s}</b> unapproved AI services with traffic in {m}'],
  'al.f.trafE': ['{e} solicitudes de red agregadas', '{e} aggregate network requests'],
  'al.f.gasto': ['<b>{s}</b> servicios de IA no autorizados con pagos en {m}', '<b>{s}</b> unapproved AI services with payments in {m}'],
  'al.f.gastoE': ['{e} líneas de gasto', '{e} expense lines'],
  'al.f.note': ['El tráfico de red muestra un mínimo, no el total: solo ve la red corporativa. El uso en dispositivos personales queda fuera, así que la cifra real puede ser mayor.', 'Network traffic shows a minimum, not the total: it only sees the corporate network. Use on personal devices is out of view, so the real figure may be higher.'],
  'al.f.mes': ['Mes', 'Month'], 'al.f.c1': ['Servicios con tráfico', 'Services with traffic'], 'al.f.c2': ['Solicitudes de red', 'Network requests'], 'al.f.c3': ['Servicios con pagos', 'Services with payments'], 'al.f.c4': ['Líneas de gasto', 'Expense lines'],
  'al.f.ch': ['Servicios de IA no autorizados con tráfico, por mes', 'Unapproved AI services with traffic, by month'],
  'al.f.alt': ['Gráfico de columnas por mes. Valores: {l}.', 'Column chart by month. Values: {l}.'],
  'al.f.cap': ['Los mismos datos del gráfico, más los pagos.', 'The same data as the chart, plus payments.'],

  /* qué decidir (texto del artículo) */
  'dc.title': ['Del tablero a la decisión', 'From scorecard to decision'],
  'dc.sub': ['Cinco señales, con sus hipótesis y acciones, tomadas de la sección «Del tablero a la decisión» del <a href="{url}">artículo</a>. Las resaltadas coinciden con los datos cargados, y dicen con qué números. <b>Es orientación, no veredicto:</b> cada hipótesis se confirma hablando con quien hace el trabajo, no con el tablero.', 'Five signals, with their hypotheses and actions, taken from the "From scorecard to decision" section of the <a href="{url}">article</a>. The highlighted ones match the loaded data, and they say with which numbers. <b>This is guidance, not a verdict:</b> each hypothesis is confirmed by talking to the people who do the work, not by the scorecard.'],
  'dc.c1': ['Señal', 'Signal'], 'dc.c2': ['Hipótesis por investigar', 'Hypotheses to investigate'], 'dc.c3': ['Acción de la dirección', 'What leadership does'], 'dc.c4': ['En los datos cargados', 'In the loaded data'],
  'dc.on': ['Coincide', 'Matches'], 'dc.off': ['No aparece', 'Not present'],
  'dc.1.s': ['Mucho acceso, poca activación', 'Lots of access, little activation'],
  'dc.1.h': ['La herramienta no aplica al trabajo del área; hay dudas de seguridad; nadie mostró para qué sirve', 'The tool does not fit the team\'s work; there are security concerns; nobody showed what it is for'],
  'dc.1.a': ['No compres más licencias. Revisa con el dueño del proceso las tareas reales del área, envía recordatorios con casos concretos y reasigna las licencias dormidas', 'Do not buy more licenses. Walk through the team\'s actual tasks with the process owner, send reminders with concrete cases and reassign idle seats'],
  'dc.1.r': ['Regla: áreas con acceso por encima del total de la empresa y activación por debajo.', 'Rule: departments with access above the company total and activation below it.'],
  'dc.2.s': ['Activación alta, hábito bajo', 'High activation, low habit'],
  'dc.2.h': ['Efecto novedad; usos genéricos; formación general', 'Novelty effect; generic uses; one-size-fits-all training'],
  'dc.2.a': ['Elige uno o dos procesos de alto volumen y forma por rol sobre ese proceso', 'Pick one or two high-volume processes and train by role on that process'],
  'dc.2.r': ['Regla: áreas con activación por encima del total de la empresa y uso habitual por debajo.', 'Rule: departments with activation above the company total and habitual use below it.'],
  'dc.3.s': ['Uso frecuente, poca integración', 'Frequent use, little integration'],
  'dc.3.h': ['La IA vive en una ventana aparte y no en el paso donde se hace el trabajo', 'AI lives in a separate window rather than in the step where the work gets done'],
  'dc.3.a': ['Rediseña un paso del procedimiento y pon la marca en el sistema', 'Redesign one step of the procedure and put the flag in the system'],
  'dc.3.r': ['Regla: áreas con uso habitual por encima del total de la empresa y cobertura de procesos por debajo.', 'Rule: departments with habitual use above the company total and process coverage below it.'],
  'dc.4.s': ['Adopción declarada sin productividad; o tiempo ahorrado sin resultado', 'Claimed adoption without productivity; or time saved without results'],
  'dc.4.h': ['El ahorro es percepción; la revisión se lo come; el cuello de botella está en otro paso; el tiempo no tiene destino', 'The saving is perception; review eats it up; the bottleneck is elsewhere; the time has no destination'],
  'dc.4.a': ['Mide con comparación (indicadores 6 y 7) y decide antes qué harás con el tiempo', 'Measure against a comparison (metrics 6 and 7) and decide in advance what you will do with the time'],
  'dc.4.r': ['Regla: procesos con tiempo neto recuperado y, a la vez, más retrabajo o sin grupo de comparación.', 'Rule: processes with net time recovered and, at the same time, more rework or no comparison group.'],
  'dc.5.s': ['Unos equipos muy bien, el resto no', 'Some teams doing very well, the rest not'],
  'dc.5.h': ['Práctica no documentada; licencias mal repartidas; dependencia de personas clave', 'Undocumented practice; licenses poorly distributed; key-person dependency'],
  'dc.5.a': ['Verifica primero la calidad del núcleo, documenta su práctica y extiéndela a pares con las mismas tareas', 'First verify the quality of the core group\'s work, document its practice and extend it to peers with the same tasks'],
  'dc.5.r': ['Regla: el 10 % más activo hace más de la mitad de las acciones.', 'Rule: the most active 10% account for more than half of all actions.'],
  'ev.area2': ['{area}: {n1} {a} (total {A}) y {n2} {b} (total {B}).', '{area}: {n1} {a} (total {A}) and {n2} {b} (total {B}).'],
  'ev.tiempo': ['{proc}: {t} de tiempo neto y retrabajo {c}.', '{proc}: {t} of net time and rework {c}.'],
  'ev.tiempoSolo': ['{proc}: {t} de tiempo neto, sin grupo de comparación.', '{proc}: {t} of net time, with no comparison group.'],
  'ev.conc': ['El 10 % más activo hace {p} de las acciones.', 'The most active 10% account for {p} of actions.'],
  'ev.ext': ['Uso habitual: {a1}, {v1}; {a2}, {v2}.', 'Habitual use: {a1}, {v1}; {a2}, {v2}.'],

  /* usa tus datos */
  'da.priv': ['Tus archivos se procesan en tu navegador. No se envían a ningún servidor ni se guardan.', 'Your files are processed in your browser. They are not sent to any server and they are not stored.'],
  'da.priv2': ['Puedes comprobarlo en la pestaña de red de tu navegador. Al pasar a «Mis datos» también se apaga la analítica de visitas de esta página. Si recargas la página, los datos desaparecen.', 'You can check this in your browser\'s network tab. Switching to "My data" also turns off this page\'s visit analytics. If you reload the page, the data is gone.'],
  'da.s1': ['1 · Descarga las plantillas', '1 · Download the templates'],
  'da.s1sub': ['Cinco archivos CSV (valores separados por comas), en codificación UTF-8 y con fechas AAAA-MM-DD. Cada uno trae los encabezados y dos filas de ejemplo: reemplázalas por tus registros. Nunca pongas nombres, correos ni documentos: usa un identificador seudonimizado, es decir, un código que no permita saber quién es la persona.', 'Five CSV (comma-separated values) files, UTF-8 encoded, with YYYY-MM-DD dates. Each has the headers and two sample rows: replace them with your records. Never include names, emails or ID numbers: use a pseudonymized identifier, meaning a code that does not reveal who the person is.'],
  'da.dic': ['Diccionario de columnas (CSV)', 'Column dictionary (CSV)'],
  'da.dicSee': ['Ver las columnas de {f}', 'See the columns in {f}'],
  'da.fuente': ['Fuente: {f}.', 'Source: {f}.'],
  'da.no': ['Este tablero no usa encuestas ni datos declarados por las personas. Tampoco las «horas asistidas» ni el «valor estimado» del panel del proveedor: son multiplicadores sobre conteos y, si vienen en tus archivos, se ignoran.', 'This scorecard uses no surveys and no self-reported data. Nor does it use the vendor dashboard\'s "assisted hours" or "estimated value": they are multipliers applied to counts and, if your files include them, they are ignored.'],
  'da.s2': ['2 · Carga tus archivos', '2 · Load your files'],
  'da.drop': ['Arrastra aquí tus archivos CSV o elígelos. Puedes cargar los cinco o solo algunos: los indicadores que dependan de un archivo ausente dirán «Sin datos».', 'Drag your CSV files here or choose them. You can load all five or only some: metrics that depend on a missing file will say "No data".'],
  'da.pick': ['Elegir archivos', 'Choose files'],
  'da.s3': ['3 · Estado de cada archivo', '3 · Status of each file'],
  'da.exNote': ['Ahora ves el caso ilustrativo. Al cargar un archivo pasas a «Mis datos».', 'You are looking at the illustrative case. Loading a file switches to "My data".'],
  'da.ex': ['Volver a los datos de ejemplo', 'Back to the sample data'],
  'da.remove': ['Quitar', 'Remove'], 'da.removeA': ['Quitar {f}', 'Remove {f}'],
  'da.dlEj': ['Datos del caso ilustrativo', 'Illustrative case data'],
  'da.cc': ['Columna', 'Column'], 'da.ct': ['Tipo', 'Type'], 'da.cr': ['Obligatoria', 'Required'], 'da.cd': ['Descripción', 'Description'],
  'st.ok': ['{n} filas cargadas.', '{n} rows loaded.'], 'st.ej': ['{n} filas del caso ilustrativo.', '{n} rows from the illustrative case.'],
  'st.miss': ['Sin cargar. {r}', 'Not loaded. {r}'], 'st.bad': ['No se cargó: corrige el archivo y vuelve a subirlo.', 'Not loaded: fix the file and upload it again.'],
  'st.live': ['{n} archivo(s) procesado(s).', '{n} file(s) processed.'],
  'er.col_falta': ['Falta la columna «{col}» en {file}.', 'Column "{colEn}" (or "{col}") is missing from {file}.'],
  'er.sin_filas': ['{file} no tiene filas de datos.', '{file} has no data rows.'],
  'er.vacio': ['{file}, fila {row}, columna «{col}»: está vacía.', '{file}, row {row}, column "{col}": it is empty.'],
  'er.bin': ['{file}, fila {row}, columna «{col}»: debe ser 0 o 1 y llegó «{val}».', '{file}, row {row}, column "{col}": it must be 0 or 1, and "{val}" was found.'],
  'er.entero': ['{file}, fila {row}, columna «{col}»: debe ser un número entero y llegó «{val}».', '{file}, row {row}, column "{col}": it must be a whole number, and "{val}" was found.'],
  'er.numero': ['{file}, fila {row}, columna «{col}»: debe ser un número y llegó «{val}».', '{file}, row {row}, column "{col}": it must be a number, and "{val}" was found.'],
  'er.negativo': ['{file}, fila {row}, columna «{col}»: no puede ser negativo y llegó «{val}».', '{file}, row {row}, column "{col}": it cannot be negative, and "{val}" was found.'],
  'er.fecha': ['{file}, fila {row}, columna «{col}»: debe ser una fecha AAAA-MM-DD y llegó «{val}».', '{file}, row {row}, column "{col}": it must be a YYYY-MM-DD date, and "{val}" was found.'],
  'er.enum': ['{file}, fila {row}, columna «{col}»: el valor «{val}» no es uno de los permitidos ({vals}).', '{file}, row {row}, column "{col}": the value "{val}" is not one of the allowed ones ({vals}).'],
  'er.mayor_que_cerradas': ['{file}, fila {row}, columna «{col}»: no puede ser mayor que las unidades cerradas ({val}).', '{file}, row {row}, column "{col}": it cannot be greater than closed units ({val}).'],
  'er.mas_errores': ['…y {n} errores más en {file}.', '…and {n} more errors in {file}.'],
  'er.no_reconocido': ['No reconozco {file}: sus columnas no corresponden a ninguna de las cinco plantillas.', '{file} was not recognized: its columns do not match any of the five templates.'],
  'er.lectura': ['No se pudo leer {file}.', '{file} could not be read.'],
  'no.col_proveedor': ['Se ignoraron las columnas {cols}: son estimaciones del proveedor (multiplicadores sobre conteos), no registros.', 'Columns {cols} were ignored: they are vendor estimates (multipliers applied to counts), not records.'],
  'no.col_ignorada': ['Columnas que el tablero no usa: {cols}.', 'Columns the scorecard does not use: {cols}.'],
  'no.separador': ['Separador detectado: «{delim}».', 'Separator detected: "{delim}".'],
  'no.semana_no_lunes': ['{n} filas traían una fecha que no era lunes: se asignaron al lunes de su semana.', '{n} rows had a date that was not a Monday: they were assigned to the Monday of their week.'],
  'av.personas_repetidas': ['{n} filas de {personas} repetían un identificador: cada persona se contó una sola vez.', '{n} rows in {personas} repeated an identifier: each person was counted only once.'],
  'av.uso_sin_persona': ['{n} filas de {uso} tienen un identificador que no está en {personas}: no entraron al cálculo.', '{n} rows in {uso} have an identifier that is not in {personas}: they were left out of the calculation.'],

  /* columnas derivadas de las tablas de trazabilidad */
  'col.elegibles': ['elegibles', 'eligible'], 'col.elegibles_con_acceso': ['elegibles con acceso', 'eligible with access'],
  'col.con_acceso': ['con acceso', 'with access'], 'col.con_accion_en_ventana': ['con acción en la ventana', 'with an action in the window'],
  'col.con_semana_activa': ['con al menos 1 semana activa', 'with at least 1 active week'], 'col.con_habito': ['con hábito', 'habitual'],
  'col.evidencias': ['evidencias', 'evidence count'], 'col.verificado': ['verificado', 'verified'], 'col.semanas': ['semanas', 'weeks'],
  'col.media': ['promedio', 'average'], 'col.tasa': ['tasa', 'rate'],
  'col.min_elaboracion_por_unidad': ['min de elaboración por unidad', 'drafting min per unit'], 'col.min_revision_por_unidad': ['min de revisión por unidad', 'review min per unit'],

  /* método */
  'me.html': [`
<section class="card prose"><p class="sub" style="margin:0">Esta pestaña resume las reglas con las que calcula el tablero. El razonamiento, las fuentes y los límites de la evidencia están en el artículo <a href="{url}">«Medir la adopción de IA: no es un porcentaje, son cuatro preguntas»</a>.</p></section>
<section class="card prose"><h2>Tres definiciones antes de las fórmulas</h2>
<p class="sub">Un indicador sirve si dos personas distintas lo calculan y llegan al mismo número. Fija esto por escrito antes de medir.</p>
<ul>
<li><b>Población elegible:</b> personas cuyo cargo incluye tareas donde la herramienta es aplicable. No son todos los empleados.</li>
<li><b>Acción intencional:</b> algo que la persona pidió, como una instrucción, un resumen o aceptar una sugerencia. Abrir el panel no cuenta.</li>
<li><b>Ventanas y fecha de corte:</b> 28 días para activación y 12 semanas para hábito, contadas hacia atrás desde una fecha de corte fija. Puedes cambiarlas arriba; las tarjetas siempre dicen con cuál se calcularon.</li>
</ul>
<p>Los registros de uso llegan por semana calendario (de lunes a domingo). Por eso las ventanas se arman con semanas completas: la de activación toma las semanas cuyo lunes cae en los últimos 28 días; la de hábito, las últimas 12 semanas hasta la fecha de corte. Conviene que la fecha de corte sea un domingo.</p></section>
<section class="card"><h2>Fórmulas y límites</h2><p class="sub">Los ocho indicadores, el archivo del que sale cada uno y el cuidado que pide.</p>{tabla}</section>
<section class="card prose"><h2>Reglas de cálculo</h2><ul>
<li><b>Sin datos, sin número.</b> Si falta un archivo o una columna, la tarjeta dice «Sin datos» y explica qué registro falta. Nada se imputa, se estima ni se rellena con ceros.</li>
<li><b>Una persona cuenta una sola vez,</b> aunque aparezca con varias herramientas o en varias filas.</li>
<li><b>Grupo mínimo de 5 personas.</b> Ningún valor se reporta para un grupo más pequeño: la celda dice «Grupo demasiado pequeño». La concentración tampoco se muestra si el 10 % más activo tiene menos de 5 personas.</li>
<li><b>Caso de uso verificado:</b> el proceso suma dos o más evidencias entre procedimiento escrito, registros de uso recientes, muestra de entregables y confirmación del dueño con volumen.</li>
<li><b>Integración y tiempo neto</b> usan las últimas 4 semanas del periodo «después»: describen el estado actual y no el promedio desde el arranque.</li>
<li><b>Sin grupo de comparación,</b> los indicadores 6 y 7 muestran solo el antes y después, con la advertencia de que eso no demuestra que la IA causó el cambio. Con menos de 8 semanas a cada lado, advierten que el periodo es corto.</li>
<li><b>Sin estimaciones del proveedor.</b> Las «horas asistidas» y el «valor estimado» son multiplicadores sobre conteos. Si vienen en un archivo, se ignoran.</li>
<li><b>Solo agregados.</b> Ni la pantalla ni las descargas muestran datos por persona: solo por área, proceso o equipo.</li>
</ul></section>
<section class="card prose"><h2>Lo que este tablero no demuestra</h2><ul>
<li><b>Que la IA causó un cambio,</b> si no hay grupo de comparación o si los dos equipos no eran parecidos antes. La resta doble descuenta lo que también le pasó al equipo sin IA; no corrige una mala comparación.</li>
<li><b>Que el tiempo recuperado sea dinero.</b> Son horas de capacidad. Se vuelven valor solo en la parte que tiene un destino verificable: más unidades atendidas, horas extra que dejaron de pagarse. El artículo llama al indicador 8 «Tiempo neto recuperado y valor realizado»; el tablero calcula solo el tiempo, porque el destino de esas horas no está en los cinco archivos.</li>
<li><b>Por qué pasa lo que pasa.</b> Los registros dicen qué ocurrió, no por qué. Cuando un área no usa la herramienta, la razón se averigua hablando con quien hace el trabajo.</li>
<li><b>El uso en dispositivos y cuentas personales.</b> El tráfico de red solo ve la red corporativa: muestra un mínimo, no el total.</li>
<li><b>Que más uso sea mejor.</b> Hay tareas donde la IA es la herramienta equivocada. Por eso no hay semáforos ni metas.</li>
<li><b>Un nivel de madurez.</b> No hay índice compuesto ni puntaje único: ninguna ponderación tiene evidencia que la respalde. Tampoco hay cifras externas presentadas como meta; cada indicador se compara entre áreas y contra la medición anterior de la misma empresa.</li>
</ul>
<p>El umbral de «9 de 12 semanas» es la regla que publica un proveedor y nadie la ha validado. La cobertura de procesos, la integración, la regla de dos evidencias y las cuatro capas son síntesis y diseño de Javier Forero: no están probados comparativamente en una cartera real.</p></section>`, `
<section class="card prose"><p class="sub" style="margin:0">This tab summarizes the rules the scorecard computes with. The reasoning, the sources and the limits of the evidence are in the article <a href="{url}">"Measuring AI adoption: it is not one percentage, it is four questions"</a>.</p></section>
<section class="card prose"><h2>Three definitions before the formulas</h2>
<p class="sub">A metric is useful if two different people compute it and land on the same number. Put this in writing before you measure.</p>
<ul>
<li><b>Eligible population:</b> people whose role includes tasks the tool applies to. Not the whole headcount.</li>
<li><b>Intentional action:</b> something the person asked for, such as a prompt, a summary or accepting a suggestion. Opening the panel does not count.</li>
<li><b>Windows and cutoff date:</b> 28 days for activation and 12 weeks for habit, counted back from a fixed cutoff date. You can change them above; the cards always state which one they were computed with.</li>
</ul>
<p>Usage records arrive by calendar week (Monday to Sunday). That is why windows are built from whole weeks: the activation window takes the weeks whose Monday falls in the last 28 days; the habit window takes the last 12 weeks up to the cutoff date. A Sunday works best as the cutoff date.</p></section>
<section class="card"><h2>Formulas and limits</h2><p class="sub">The eight metrics, the file each one comes from and the caution each one calls for.</p>{tabla}</section>
<section class="card prose"><h2>Calculation rules</h2><ul>
<li><b>No data, no number.</b> If a file or a column is missing, the card says "No data" and explains which record is missing. Nothing is imputed, estimated or filled with zeros.</li>
<li><b>Each person counts once,</b> even if they show up under several tools or in several rows.</li>
<li><b>Minimum group of 5 people.</b> No value is reported for a smaller group: the cell says "Group too small". Concentration is not shown either if the most active 10% has fewer than 5 people.</li>
<li><b>Verified use case:</b> the process has two or more pieces of evidence among a written procedure, recent usage logs, a sample of deliverables and the owner's confirmation with volumes.</li>
<li><b>Integration and net time</b> use the last 4 weeks of the "after" period: they describe the current state, not the average since launch.</li>
<li><b>Without a comparison group,</b> metrics 6 and 7 show only the before and after, with a warning that this does not prove that AI caused the change. With fewer than 8 weeks on each side, they warn that the period is short.</li>
<li><b>No vendor estimates.</b> "Assisted hours" and "estimated value" are multipliers applied to counts. If a file includes them, they are ignored.</li>
<li><b>Aggregates only.</b> Neither the screen nor the downloads show per-person data: only by department, process or team.</li>
</ul></section>
<section class="card prose"><h2>What this scorecard does not prove</h2><ul>
<li><b>That AI caused a change,</b> if there is no comparison group or if the two teams were not alike beforehand. The double subtraction removes what also happened to the team without AI; it does not fix a bad comparison.</li>
<li><b>That recovered time is money.</b> These are hours of capacity. They become value only for the part with a verifiable destination: more units handled, overtime no longer paid. The article calls metric 8 "Net time recovered and realized value"; the scorecard computes only the time, because where those hours went is not in the five files.</li>
<li><b>Why things happen.</b> Records say what happened, not why. When a department does not use the tool, you find the reason by talking to the people who do the work.</li>
<li><b>Use on personal devices and accounts.</b> Network traffic only sees the corporate network: it shows a minimum, not the total.</li>
<li><b>That more usage is better.</b> There are tasks where AI is the wrong tool. That is why there are no traffic lights and no targets.</li>
<li><b>A maturity level.</b> There is no composite index and no single score: no weighting has evidence behind it. There are no outside figures presented as targets either; each metric is compared across departments and against the same company's previous measurement.</li>
</ul>
<p>The "9 of 12 weeks" threshold is a rule published by one vendor and nobody has validated it. Process coverage, integration, the two-evidence rule and the four layers are Javier Forero's own synthesis and design: they have not been comparatively tested on a real portfolio.</p></section>`],
  'me.c1': ['Indicador', 'Metric'], 'me.c2': ['Fórmula', 'Formula'], 'me.c3': ['Archivos', 'Files'], 'me.c4': ['Cuidado', 'Caution'],
  'lim.acceso': ['Mide lo que pagaste, no lo que pasa.', 'It measures what you paid for, not what is happening.'],
  'lim.activacion': ['Una sola acción basta para contar.', 'A single action is enough to count.'],
  'lim.habito': ['«9 de 12» es la regla de un proveedor y nadie la ha validado. Mira también «al menos la mitad de las semanas».', '"9 of 12" is one vendor\'s rule and nobody has validated it. Also look at "at least half the weeks".'],
  'lim.cobertura': ['La elegibilidad es un juicio, y todos los procesos pesan igual aunque no importen igual.', 'Eligibility is a judgment call, and every process weighs the same even though they do not matter the same.'],
  'lim.integracion': ['Una marca manual se infla o se olvida: audita una muestra.', 'A manual flag gets inflated or forgotten: audit a sample.'],
  'lim.resultado': ['Si los equipos no eran parecidos antes, la resta no significa nada.', 'If the teams were not alike beforehand, the subtraction means nothing.'],
  'lim.calidad': ['Las tasas bajas necesitan mucho volumen para dejar de ser ruido.', 'Low rates need a lot of volume before they stop being noise.'],
  'lim.tiempo': ['Los minutos deben ser medidos, no declarados, y se dividen entre todas las unidades cerradas de cada periodo. El resultado es capacidad, no dinero.', 'Minutes must be measured, not self-reported, and they are divided by all closed units in each period. The result is capacity, not money.'],
};
