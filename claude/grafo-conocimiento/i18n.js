/* Grafo de conocimiento · textos de la interfaz (ES/EN).
   Se carga justo después del marcado para traducir el texto fijo antes del primer pintado (sin parpadeo ES→EN).
   El contenido de las notas nunca se traduce automáticamente. */
window.KB_T = {
  es: {
    appName: 'Grafo de conocimiento', searchLabel: 'Buscar', searchPh: 'Buscar en títulos y texto', openFolder: 'Abrir tu carpeta',
    tabNotes: 'Notas', tabNote: 'Nota', tabGraph: 'Grafo', notesHead: 'Notas', back: 'Atrás', fwd: 'Adelante',
    graphHead: 'Grafo', global: 'Global', local: 'Local', expand: 'Ampliar grafo', shrink: 'Volver a tres paneles', fit: 'Encuadrar',
    filters: 'Filtros', fLinks: 'Enlaces', fStatus: 'Estado', fTag: 'Etiqueta', fLang: 'Idioma', allTags: 'Todas las etiquetas',
    allLangs: 'Todos los idiomas', linksHead: 'Enlaces de esta nota', incoming: 'Entrantes', outgoing: 'Salientes', qualityHead: 'Salud de la bóveda',
    sheetTitle: 'Explora tu propia carpeta', sheetLead: 'Elige una carpeta con tus artículos o notas en Markdown. El explorador la lee, encuentra los enlaces entre documentos y arma el grafo con las mismas reglas que usa para el Handbook.',
    dropHere: 'Arrastra una carpeta aquí, o', pickFolder: 'Elegir carpeta', pickFiles: 'Elegir archivos .md',
    privacy: 'Tus archivos se leen dentro de este navegador. No se suben a ningún servidor y desaparecen al cerrar la página.',
    folderLead: 'Elige una carpeta con tus artículos o notas en Markdown. Funciona sin conexión a GitHub.',
    backSample: 'Volver al Handbook de ejemplo', close: 'Cerrar', dropFull: 'Suelta la carpeta para explorarla',
    rules: [
      'Notas: cada archivo <code>.md</code>; título, parte, estado, etiquetas e idioma salen del frontmatter.',
      'Enlaces: Markdown <code>[texto](ruta.md)</code>, wikilinks <code>[[nota]]</code>, <code>[[nota|alias]]</code>, <code>[[nota#sección]]</code> y los campos <code>prerequisites</code> y <code>related_chapters</code>.',
      'Cada ruta se resuelve primero desde la nota, luego desde la raíz de la carpeta; los wikilinks también por nombre de archivo único. Lo que no resuelve queda marcado como roto.',
      'Se ignoran los enlaces dentro de bloques de código.'
    ],
    hubs: 'Notas eje', hub: 'Nota eje', makeHub: 'Fijar como nota eje', unHub: 'Quitar de notas eje',
    notes: n => `${n} ${n === 1 ? 'nota' : 'notas'}`, conns: n => `${n} ${n === 1 ? 'conexión' : 'conexiones'}`,
    broken: n => `${n} ${n === 1 ? 'roto' : 'rotos'}`, matches: n => `${n}`,
    showing: (n, e) => `Mostrando ${n} notas · ${e} conexiones`,
    backlinkCount: n => `${n} ${n === 1 ? 'nota enlaza aquí' : 'notas enlazan aquí'}`,
    noIn: 'Ninguna nota enlaza aquí todavía.', noOut: 'Esta nota no enlaza a otras.',
    orphans: 'Huérfanas', brokenH: 'Enlaces rotos', noOrphans: 'Ninguna nota huérfana: todas tienen al menos un enlace.',
    noBroken: 'Ningún enlace roto.', orphanHint: 'Sin enlaces de entrada ni de salida.',
    props: 'Propiedades', readIn: 'Leer en', fmField: f => `frontmatter · ${f}`, inSection: s => `en § ${s}`,
    hintGlobal: 'Arrastra para mover · rueda para acercar · clic abre la nota', hintLocal: n => `Vecinos de «${n}» hasta 2 saltos · las notas eje no se expanden`,
    loaded: (n, l) => `Bóveda cargada: ${n} notas · ${l} enlaces`, reading: n => `Leyendo ${n} archivos…`,
    noMd: 'No encontré archivos .md en esa selección. Elige la carpeta que contiene tus notas.',
    filesMode: 'Abriste archivos sueltos: se pierde la estructura de carpetas, así que los enlaces entre subcarpetas pueden aparecer rotos. Para un resultado completo, elige la carpeta.',
    noDir: 'Este navegador no permite elegir carpetas. Usa «Elegir archivos .md» o arrastra la carpeta.',
    sample: 'Ejemplo', yours: 'Tu carpeta', mathFail: 'No se pudo cargar el motor de fórmulas; se muestran en LaTeX.',
    mermaidFail: 'No se pudo dibujar este diagrama; se muestra su código.', embedded: 'Nota incrustada',
    brokenTitle: r => `Enlace roto: ${r}`, missingImg: r => `Imagen no encontrada: ${r}`, empty: 'Sin coincidencias.',
    root: '(raíz)', noteMissing: 'Esta nota está oculta por el filtro de idioma.',
    type: { markdown: 'Texto', wikilink: 'Wikilink', prerequisite: 'Prerrequisito', related: 'Relacionado', translation: 'Traducción', tag: 'Etiquetas' },
    typeLong: { markdown: 'Enlace en el texto', wikilink: 'Wikilink', prerequisite: 'Prerrequisito (frontmatter)', related: 'Capítulo relacionado (frontmatter)', translation: 'Par de traducción', tag: 'Comparten 2 o más etiquetas' },
    hubEdges: 'Enlaces de notas eje',
    status: { draft: 'Borrador', review: 'En revisión', proposal: 'Propuesta', published: 'Publicado', final: 'Final', publish: 'Publicado', page: 'Página' },
    noStatus: 'Sin estado', lang: { es: 'Español', en: 'English', pt: 'Português', fr: 'Français' },
    legendBody: 'en el texto', legendFm: 'frontmatter', legendTr: 'traducción',
    loadingVault: 'Cargando las notas del manual…', vaultFail: 'No se pudieron cargar las notas (vault.json). Abre esta página desde el sitio publicado o con «mkdocs serve»; abierta como archivo local, el navegador bloquea la lectura.',
    onSite: 'Ver en el sitio', toSite: 'Ir al manual',
    tabWp: 'Blog en WordPress', wpUrlLabel: 'Dirección del blog', wpUrlPh: 'miblog.com o https://miblog.wordpress.com',
    wpHelp: 'Lee los artículos y páginas publicados mediante la API pública de WordPress (también en WordPress.com). Las categorías se vuelven grupos, los enlaces entre artículos se vuelven conexiones y los artículos que comparten 2 o más etiquetas se unen con un tipo de enlace aparte que puedes apagar en Filtros.',
    wpLoad: 'Cargar blog', wpBadUrl: 'Escribe la dirección del blog, por ejemplo miblog.com.',
    wpFinding: h => `Buscando la API de ${h}…`, wpDownloading: (n, tot) => `Descargando artículos: ${n} de ${tot}`, wpConverting: 'Convirtiendo los artículos a Markdown…',
    wpNoApi: 'No encontré la API pública de WordPress en esa dirección. Revisa que sea un sitio WordPress y que su API REST no esté desactivada.',
    wpForbidden: 'El sitio no permite leer su API pública.', wpNetwork: 'No hubo conexión con el sitio o bloquea las consultas desde otras páginas.',
    wpRate: 'El blog está limitando las consultas en este momento. Espera un minuto y vuelve a intentarlo.',
    wpLib: 'No se pudo cargar el conversor de HTML. Revisa tu conexión y recarga.', wpGeneric: 'No se pudo cargar el blog. Inténtalo de nuevo.',
    wpTruncated: n => `Se cargaron los primeros ${n} artículos.`, wpPagesGroup: 'Páginas', wpNoCategory: 'Sin categoría',
    wpSharedTags: n => `Comparten ${n} etiquetas`, wpTagPairs: n => `${n} pares por etiquetas compartidas`, legendTag: 'etiquetas compartidas',
    publishedOn: d => `Publicado ${d}`, wpBrokenNote: 'Enlaces a direcciones del blog que no coinciden con ningún artículo publicado. Algunos pueden redirigir a un artículo renombrado; ábrelos en el blog para confirmar.',
    index: 'Índice', health: 'Salud', viewLabel: 'Vista', viewGraph: 'Grafo', viewSplit: 'Dividido', viewRead: 'Lectura',
    viewGraphTip: 'Grafo al centro (G)', viewSplitTip: 'Grafo y lectura lado a lado (D)', viewReadTip: 'Lectura amplia (L)',
    expandReader: 'Expandir lectura (L)', reduceReader: 'Reducir lectura (D)', closeReader: 'Volver al grafo (Esc)',
    tabContent: 'Contenido', tabLinks: 'Conexiones', tabProps: 'Propiedades', noProps: 'Esta nota no tiene frontmatter.',
    zoomIn: 'Acercar', zoomOut: 'Alejar', peekRead: 'Leer', peekLinks: 'Conexiones', peekLocal: 'Ver vecinos', peekGlobal: 'Ver todo',
    inLabel: 'entrantes', outLabel: 'salientes', inShort: n => `${n} entrantes`, nbShort: n => `${n} vecinas`,
    chapterN: c => `Capítulo ${c}`, updatedOn: d => `Actualizado ${d}`, issues: n => `${n} por revisar`, noIssues: 'Sin problemas',
    tagFiltered: x => `Filtrando por #${x}`,
    pageTitle: 'Grafo de conocimiento · Javier Forero', topTag: 'Demos interactivos · tus propias notas', toDark: 'Cambiar a tema oscuro', toLight: 'Cambiar a tema claro',
    openSource: 'Cargar otra bóveda', share: 'Copiar enlace', copied: 'Enlace copiado: abre esta misma bóveda y nota.', copyManual: 'Copia el enlace seleccionado.',
    demoPill: 'Demo en vivo', folderPill: 'Carpeta local', snapshot: (c, d) => `instantánea ${c}${d ? ' · ' + d : ''}`, mkdocsRoot: 'carpeta tomada de mkdocs.yml',
    sourcesTitle: 'Cargar otra bóveda', sourcesLead: 'Explora las notas Markdown de un repositorio de GitHub o de una carpeta de tu computador. El grafo se arma con las mismas reglas que la demo.',
    tabGithub: 'Repositorio de GitHub', tabFolder: 'Carpeta local',
    ghUrlLabel: 'Repositorio', ghUrlPh: 'usuario/repositorio o https://github.com/usuario/repositorio',
    ghHelp: 'Funciona con repositorios públicos. Si el repositorio tiene <code>mkdocs.yml</code>, se usa su carpeta de documentos; también puedes pegar la URL de una subcarpeta (…/tree/main/docs).',
    ghOptions: 'Opciones', ghRefLabel: 'Rama o etiqueta', ghRefPh: 'la principal del repositorio', ghPathLabel: 'Subcarpeta', ghPathPh: 'detectar automáticamente',
    ghTokenLabel: 'Token de GitHub (opcional)', ghTokenHelp: 'Solo para repositorios privados o si se agota el límite de consultas. Queda en la memoria de esta pestaña, se envía únicamente a api.github.com y no se guarda ni aparece en el enlace.',
    ghLoad: 'Cargar repositorio', example: 'Ejemplo:', backDemo: 'Volver a la demo',
    ghBadUrl: 'No reconozco esa dirección. Escribe usuario/repositorio o pega la URL del repositorio en GitHub.',
    ghListing: r => `Leyendo la estructura de ${r}…`, ghDownloading: (d, n) => `Descargando notas: ${d} de ${n}`,
    ghNotFound: 'No encontré ese repositorio, o es privado. Revisa el nombre; si es privado, agrega un token en Opciones.',
    ghNotFoundToken: 'No encontré ese repositorio con este token. Revisa el nombre y que el token tenga acceso de lectura a él.',
    ghBadToken: 'GitHub rechazó el token. Revisa que esté completo y vigente.', ghForbidden: 'GitHub no permite leer ese repositorio con este token.',
    ghRate: h => `Se agotó el límite de consultas a GitHub desde tu conexión. Se restablece hacia las ${h}. Mientras tanto, agrega un token en Opciones.`,
    ghNetwork: 'No hubo conexión con GitHub. Revisa tu red e inténtalo de nuevo.',
    ghNoMd: p => `No hay archivos .md en «${p}». Revisa la subcarpeta en Opciones.`,
    ghTooBig: (n, max) => `El repositorio tiene ${n} notas; el límite es ${max}. Elige una subcarpeta en Opciones.`,
    ghFile: p => `No se pudo descargar ${p}. Inténtalo de nuevo en un momento.`, ghGeneric: 'No se pudo cargar el repositorio. Inténtalo de nuevo.',
    ghTruncated: 'GitHub devolvió la estructura incompleta: es un repositorio muy grande. Elige una subcarpeta para verlo completo.'
  },
  en: {
    appName: 'Knowledge graph', searchLabel: 'Search', searchPh: 'Search titles and text', openFolder: 'Open your folder',
    tabNotes: 'Notes', tabNote: 'Note', tabGraph: 'Graph', notesHead: 'Notes', back: 'Back', fwd: 'Forward',
    graphHead: 'Graph', global: 'Global', local: 'Local', expand: 'Expand graph', shrink: 'Back to three panes', fit: 'Fit to view',
    filters: 'Filters', fLinks: 'Links', fStatus: 'Status', fTag: 'Tag', fLang: 'Language', allTags: 'All tags',
    allLangs: 'All languages', linksHead: 'Links of this note', incoming: 'Incoming', outgoing: 'Outgoing', qualityHead: 'Vault health',
    sheetTitle: 'Explore your own folder', sheetLead: 'Pick a folder with your Markdown articles or notes. The explorer reads it, finds the links between documents and builds the graph with the same rules it uses for the Handbook.',
    dropHere: 'Drag a folder here, or', pickFolder: 'Choose folder', pickFiles: 'Choose .md files',
    privacy: 'Your files are read inside this browser. Nothing is uploaded to any server, and it is gone when you close the page.',
    folderLead: 'Pick a folder with your Markdown articles or notes. It works without any connection to GitHub.',
    backSample: 'Back to the sample Handbook', close: 'Close', dropFull: 'Drop the folder to explore it',
    rules: [
      'Notes: every <code>.md</code> file; title, part, status, tags and language come from the frontmatter.',
      'Links: Markdown <code>[text](path.md)</code>, wikilinks <code>[[note]]</code>, <code>[[note|alias]]</code>, <code>[[note#section]]</code>, and the <code>prerequisites</code> and <code>related_chapters</code> fields.',
      'Each path is resolved from the note first, then from the folder root; wikilinks also by unique file name. Anything unresolved is marked broken.',
      'Links inside code blocks are ignored.'
    ],
    hubs: 'Hub notes', hub: 'Hub note', makeHub: 'Pin as hub note', unHub: 'Remove from hub notes',
    notes: n => `${n} ${n === 1 ? 'note' : 'notes'}`, conns: n => `${n} ${n === 1 ? 'connection' : 'connections'}`,
    broken: n => `${n} broken`, matches: n => `${n}`,
    showing: (n, e) => `Showing ${n} notes · ${e} connections`,
    backlinkCount: n => `${n} ${n === 1 ? 'note links here' : 'notes link here'}`,
    noIn: 'No note links here yet.', noOut: 'This note links to no other note.',
    orphans: 'Orphans', brokenH: 'Broken links', noOrphans: 'No orphan notes: every note has at least one link.',
    noBroken: 'No broken links.', orphanHint: 'No incoming or outgoing links.',
    props: 'Properties', readIn: 'Read in', fmField: f => `frontmatter · ${f}`, inSection: s => `in § ${s}`,
    hintGlobal: 'Drag to move · scroll to zoom · click opens the note', hintLocal: n => `Neighbours of “${n}” up to 2 hops · hub notes are not expanded`,
    loaded: (n, l) => `Vault loaded: ${n} notes · ${l} links`, reading: n => `Reading ${n} files…`,
    noMd: 'No .md files found in that selection. Choose the folder that holds your notes.',
    filesMode: 'You opened loose files: the folder structure is lost, so links between subfolders may show as broken. For a complete result, choose the folder.',
    noDir: 'This browser cannot pick folders. Use “Choose .md files” or drag the folder in.',
    sample: 'Sample', yours: 'Your folder', mathFail: 'The formula engine could not load; formulas are shown as LaTeX.',
    mermaidFail: 'This diagram could not be drawn; its code is shown instead.', embedded: 'Embedded note',
    brokenTitle: r => `Broken link: ${r}`, missingImg: r => `Image not found: ${r}`, empty: 'No matches.',
    root: '(root)', noteMissing: 'This note is hidden by the language filter.',
    type: { markdown: 'Text', wikilink: 'Wikilink', prerequisite: 'Prerequisite', related: 'Related', translation: 'Translation', tag: 'Tags' },
    typeLong: { markdown: 'Inline link', wikilink: 'Wikilink', prerequisite: 'Prerequisite (frontmatter)', related: 'Related chapter (frontmatter)', translation: 'Translation pair', tag: 'Share 2 or more tags' },
    hubEdges: 'Hub-note links',
    status: { draft: 'Draft', review: 'In review', proposal: 'Proposal', published: 'Published', final: 'Final', publish: 'Published', page: 'Page' },
    noStatus: 'No status', lang: { es: 'Español', en: 'English', pt: 'Português', fr: 'Français' },
    legendBody: 'in text', legendFm: 'frontmatter', legendTr: 'translation',
    loadingVault: 'Loading the handbook notes…', vaultFail: 'The notes (vault.json) could not be loaded. Open this page from the published site or with “mkdocs serve”; opened as a local file, the browser blocks the read.',
    onSite: 'View on the site', toSite: 'Go to the handbook',
    tabWp: 'WordPress blog', wpUrlLabel: 'Blog address', wpUrlPh: 'myblog.com or https://myblog.wordpress.com',
    wpHelp: 'Reads the published posts and pages through the public WordPress API (WordPress.com included). Categories become groups, links between posts become connections, and posts that share 2 or more tags are joined by a separate link type you can switch off under Filters.',
    wpLoad: 'Load blog', wpBadUrl: 'Type the blog address, for example myblog.com.',
    wpFinding: h => `Looking for the API of ${h}…`, wpDownloading: (n, tot) => `Downloading posts: ${n} of ${tot}`, wpConverting: 'Converting the posts to Markdown…',
    wpNoApi: 'No public WordPress API was found at that address. Check that it is a WordPress site and that its REST API is not disabled.',
    wpForbidden: 'The site does not allow reading its public API.', wpNetwork: 'Could not reach the site, or it blocks requests from other pages.',
    wpRate: 'The blog is throttling requests right now. Wait a minute and try again.',
    wpLib: 'The HTML converter could not be loaded. Check your connection and reload.', wpGeneric: 'The blog could not be loaded. Try again.',
    wpTruncated: n => `The first ${n} posts were loaded.`, wpPagesGroup: 'Pages', wpNoCategory: 'Uncategorised',
    wpSharedTags: n => `Share ${n} tags`, wpTagPairs: n => `${n} pairs by shared tags`, legendTag: 'shared tags',
    publishedOn: d => `Published ${d}`, wpBrokenNote: 'Links to blog addresses that match no published post. Some may redirect to a renamed post; open them on the blog to confirm.',
    index: 'Index', health: 'Health', viewLabel: 'View', viewGraph: 'Graph', viewSplit: 'Split', viewRead: 'Reading',
    viewGraphTip: 'Graph in the centre (G)', viewSplitTip: 'Graph and reading side by side (D)', viewReadTip: 'Wide reading (L)',
    expandReader: 'Expand reading (L)', reduceReader: 'Reduce reading (D)', closeReader: 'Back to the graph (Esc)',
    tabContent: 'Content', tabLinks: 'Connections', tabProps: 'Properties', noProps: 'This note has no frontmatter.',
    zoomIn: 'Zoom in', zoomOut: 'Zoom out', peekRead: 'Read', peekLinks: 'Connections', peekLocal: 'Show neighbours', peekGlobal: 'Show all',
    inLabel: 'incoming', outLabel: 'outgoing', inShort: n => `${n} incoming`, nbShort: n => `${n} neighbours`,
    chapterN: c => `Chapter ${c}`, updatedOn: d => `Updated ${d}`, issues: n => `${n} to review`, noIssues: 'No issues',
    tagFiltered: x => `Filtering by #${x}`,
    pageTitle: 'Knowledge graph · Javier Forero', topTag: 'Interactive demos · your own notes', toDark: 'Switch to dark theme', toLight: 'Switch to light theme',
    openSource: 'Load another vault', share: 'Copy link', copied: 'Link copied: it opens this same vault and note.', copyManual: 'Copy the selected link.',
    demoPill: 'Live demo', folderPill: 'Local folder', snapshot: (c, d) => `snapshot ${c}${d ? ' · ' + d : ''}`, mkdocsRoot: 'folder taken from mkdocs.yml',
    sourcesTitle: 'Load another vault', sourcesLead: 'Explore the Markdown notes of a GitHub repository or of a folder on your computer. The graph is built with the same rules as the demo.',
    tabGithub: 'GitHub repository', tabFolder: 'Local folder',
    ghUrlLabel: 'Repository', ghUrlPh: 'user/repository or https://github.com/user/repository',
    ghHelp: 'Works with public repositories. If the repository has <code>mkdocs.yml</code>, its docs folder is used; you can also paste the URL of a subfolder (…/tree/main/docs).',
    ghOptions: 'Options', ghRefLabel: 'Branch or tag', ghRefPh: 'the repository default', ghPathLabel: 'Subfolder', ghPathPh: 'detect automatically',
    ghTokenLabel: 'GitHub token (optional)', ghTokenHelp: 'Only for private repositories or when the request limit runs out. It stays in this tab’s memory, is sent only to api.github.com, and is never saved or put in the link.',
    ghLoad: 'Load repository', example: 'Example:', backDemo: 'Back to the demo',
    ghBadUrl: 'That address is not recognised. Type user/repository or paste the repository URL from GitHub.',
    ghListing: r => `Reading the structure of ${r}…`, ghDownloading: (d, n) => `Downloading notes: ${d} of ${n}`,
    ghNotFound: 'That repository was not found, or it is private. Check the name; if it is private, add a token under Options.',
    ghNotFoundToken: 'That repository was not found with this token. Check the name and that the token can read it.',
    ghBadToken: 'GitHub rejected the token. Check that it is complete and still valid.', ghForbidden: 'GitHub does not allow reading that repository with this token.',
    ghRate: h => `The GitHub request limit for your connection ran out. It resets around ${h}. Meanwhile, add a token under Options.`,
    ghNetwork: 'Could not reach GitHub. Check your connection and try again.',
    ghNoMd: p => `There are no .md files in “${p}”. Check the subfolder under Options.`,
    ghTooBig: (n, max) => `The repository has ${n} notes; the limit is ${max}. Choose a subfolder under Options.`,
    ghFile: p => `Could not download ${p}. Try again in a moment.`, ghGeneric: 'The repository could not be loaded. Try again.',
    ghTruncated: 'GitHub returned an incomplete structure because the repository is very large. Choose a subfolder to see all of it.'
  }
};
/* Ayuda contextual de los controles del grafo (tooltips enriquecidos). h = título, b = qué hace, tip = recomendación. */
window.KB_T.es.help = {
  global: { h: 'Global · toda la red', b: 'Muestra todas las notas a la vez. Cada punto es una nota y crece con los enlaces que recibe. Sirve para ver grupos temáticos, notas centrales y notas aisladas.', tip: 'Pasa el cursor por un punto para resaltar sus vecinas; haz clic para abrirla.' },
  local: { h: 'Local · el vecindario de una nota', b: 'Deja la nota abierta en el centro, sus vecinas directas en el primer anillo (1 salto) y las vecinas de estas en el segundo (2 saltos). Las notas eje aparecen, pero no se expanden, para que no arrastren toda la red.', tip: 'Con «Etiquetas» activo el vecindario crece mucho, porque compartir etiquetas también cuenta como vecindad. Apágalo para ver solo lo que el texto enlaza.' },
  fLinks: { h: 'Enlaces · qué líneas se dibujan', b: 'Cada botón enciende o apaga un tipo de conexión. Al apagarlo se quitan sus líneas, se recalcula el tamaño de los puntos y se reduce el vecindario local. Las notas siguen visibles. El número indica cuántos enlaces hay de ese tipo.' },
  'type-markdown': { h: 'Texto', b: 'Enlace escrito dentro del cuerpo de la nota. Es el que el lector puede seguir con un clic: la red de lectura real.' },
  'type-wikilink': { h: 'Wikilink', b: 'Enlace al estilo Obsidian: [[nota]], [[nota|alias]] o [[nota#sección]]. Se navega igual que un enlace en el texto.' },
  'type-prerequisite': { h: 'Prerrequisito', b: 'Declarado en el frontmatter (prerequisites): qué conviene leer antes. Dibuja rutas de aprendizaje con línea punteada.' },
  'type-related': { h: 'Relacionado', b: 'Declarado en el frontmatter (related_chapters): capítulos afines elegidos por el autor. Se dibuja con línea punteada.' },
  'type-translation': { h: 'Traducción', b: 'Une las versiones de una misma nota en distintos idiomas.', tip: 'Apágalo si solo te interesa la estructura del contenido.' },
  'type-tag': { h: 'Etiquetas compartidas', b: 'No es un enlace escrito: el explorador lo deduce cuando dos entradas comparten 2 o más etiquetas. Sirve para descubrir afinidades temáticas, pero el lector no puede seguirlo.', tip: 'Apágalo para auditar el enlazado interno: lo que quede aislado es lo que tus lectores no pueden alcanzar navegando.' },
  'type-related-wp': { h: 'Lectura relacionada', b: 'Enlaces dentro de un bloque de lecturas al final del artículo («Lecturas relacionadas:», «Serie ·», «Related posts:»…). Son navegables, pero editoriales: los eligió el autor para guiar la lectura, no forman parte del argumento.', tip: 'Apágalo para ver solo los enlaces dentro del texto y medir cuánto aporta la curaduría.' },
  hubEdges: { h: 'Enlaces de notas eje', b: 'Las notas eje (índices y guías) enlazan casi todo y tapan la estructura. Al apagarlo verás cómo se conectan los capítulos entre sí; las notas eje siguen en el grafo.' },
  fStatus: { h: 'Estado', b: 'Atenúa las notas cuyo estado apagues (borrador, en revisión, publicado…). No las quita ni cambia las líneas: sirve para ver qué parte de la red está terminada.' },
  fTag: { h: 'Etiqueta', b: 'Resalta las notas con esa etiqueta y atenúa el resto sin mover el grafo. Muestra si un tema está concentrado en un grupo o disperso.', tip: 'También puedes hacer clic en una etiqueta dentro de una nota.' },
  fLang: { h: 'Idioma', b: 'Muestra solo las notas de un idioma. «Todos los idiomas» las junta y deja ver los pares de traducción.' },
  health: { h: 'Salud · lista de tareas editorial', b: 'Huérfanas: notas sin ningún enlace escrito, ni entrante ni saliente (las etiquetas no cuentan). Rotos: enlaces cuyo destino no existe. Haz clic en una para abrirla.', tip: 'Enlazar las huérfanas más valiosas es la forma más rápida de mejorar la navegación interna.' },
  index: { h: 'Índice', b: 'Todas las notas agrupadas por sección, con sus enlaces entrantes.', k: 'I' },
  'view-graph': { h: 'Vista Grafo', b: 'El grafo ocupa todo el espacio. Al hacer clic en un punto ves una vista previa de la nota.', k: 'G' },
  'view-split': { h: 'Vista Dividida', b: 'Grafo y lectura lado a lado: lees una nota y ves cómo cambia su vecindario.', k: 'D' },
  'view-read': { h: 'Vista Lectura', b: 'La nota a pantalla completa. Sus conexiones están en la pestaña Conexiones.', k: 'L' }
};
Object.assign(window.KB_T.es, {
  helpAria: x => `Ayuda: ${x}`, helpTipLabel: 'Consejo', helpKey: 'Atajo', helpFoot: 'Pasa el cursor sobre un control o toca ⓘ para ver qué hace.',
  recTagOn: 'Las líneas por etiquetas son deducidas, no escritas. Para ver la red que tus lectores pueden recorrer, apágalas.', recTagOnBtn: 'Ver solo enlaces escritos',
  recTagOff: 'Estás viendo solo enlaces escritos: las notas aisladas son las que conviene enlazar. Activa las etiquetas para descubrir artículos afines que aún no se enlazan.', recTagOffBtn: 'Mostrar etiquetas compartidas',
  wpRelatedLong: 'Lectura relacionada (bloque al final del artículo)', legendCurated: 'lecturas relacionadas',
  wpPagesNote: 'Las páginas suelen enlazarse desde el menú del sitio, que el explorador no lee: que aparezcan aquí no siempre es un problema.',
  recHub: 'Las notas eje enlazan casi todo. Oculta sus líneas para ver la estructura entre capítulos.', recHubBtn: 'Ocultar enlaces de notas eje'
});
window.KB_T.en.help = {
  global: { h: 'Global · the whole network', b: 'Shows every note at once. Each dot is a note and grows with the links it receives. Use it to spot topic clusters, central notes and isolated notes.', tip: 'Hover a dot to highlight its neighbours; click to open it.' },
  local: { h: 'Local · one note’s neighbourhood', b: 'Keeps the open note in the centre, its direct neighbours on the first ring (1 hop) and their neighbours on the second (2 hops). Hub notes appear but are not expanded, so they do not pull in the whole network.', tip: 'With “Tags” on, the neighbourhood grows a lot because sharing tags also counts as being neighbours. Turn it off to see only what the text links to.' },
  fLinks: { h: 'Links · which lines are drawn', b: 'Each button turns one kind of connection on or off. Turning one off removes its lines, recomputes dot sizes and shrinks the local neighbourhood. Notes stay visible. The number is how many links of that kind exist.' },
  'type-markdown': { h: 'Text', b: 'A link written in the body of the note. Readers can follow it with a click: the real reading network.' },
  'type-wikilink': { h: 'Wikilink', b: 'An Obsidian-style link: [[note]], [[note|alias]] or [[note#section]]. Navigable like a text link.' },
  'type-prerequisite': { h: 'Prerequisite', b: 'Declared in the frontmatter (prerequisites): what to read first. Draws learning paths as dashed lines.' },
  'type-related': { h: 'Related', b: 'Declared in the frontmatter (related_chapters): related chapters chosen by the author. Drawn as dashed lines.' },
  'type-translation': { h: 'Translation', b: 'Joins the versions of the same note in different languages.', tip: 'Turn it off if you only care about the content structure.' },
  'type-tag': { h: 'Shared tags', b: 'Not a written link: the explorer infers it when two posts share 2 or more tags. Good for discovering topical affinity, but readers cannot follow it.', tip: 'Turn it off to audit internal linking: whatever is left isolated is what your readers cannot reach by navigating.' },
  'type-related-wp': { h: 'Related reading', b: 'Links inside a reading-list block at the end of the post (“Related posts:”, “Series ·”, “Lecturas relacionadas:”…). Readers can follow them, but they are editorial: the author chose them to guide reading, they are not part of the argument.', tip: 'Turn it off to see in-text links only and measure how much the curation adds.' },
  hubEdges: { h: 'Hub note links', b: 'Hub notes (indexes and guides) link to almost everything and hide the structure. Turn this off to see how chapters connect to each other; hub notes stay in the graph.' },
  fStatus: { h: 'Status', b: 'Dims the notes whose status you switch off (draft, in review, published…). It neither removes them nor changes the lines: it shows which part of the network is finished.' },
  fTag: { h: 'Tag', b: 'Highlights the notes with that tag and dims the rest without moving the graph. Shows whether a topic is concentrated in one cluster or spread out.', tip: 'You can also click a tag inside a note.' },
  fLang: { h: 'Language', b: 'Shows only the notes in one language. “All languages” puts them together and reveals translation pairs.' },
  health: { h: 'Health · an editorial to-do list', b: 'Orphans: notes with no written link at all, in or out (tags do not count). Broken: links whose target does not exist. Click one to open it.', tip: 'Linking the most valuable orphans is the quickest way to improve internal navigation.' },
  index: { h: 'Index', b: 'Every note grouped by section, with its incoming links.', k: 'I' },
  'view-graph': { h: 'Graph view', b: 'The graph takes the whole space. Clicking a dot shows a preview of the note.', k: 'G' },
  'view-split': { h: 'Split view', b: 'Graph and reader side by side: read a note and watch its neighbourhood change.', k: 'D' },
  'view-read': { h: 'Reading view', b: 'The note full screen. Its connections are in the Connections tab.', k: 'L' }
};
Object.assign(window.KB_T.en, {
  helpAria: x => `Help: ${x}`, helpTipLabel: 'Tip', helpKey: 'Shortcut', helpFoot: 'Hover a control or tap ⓘ to see what it does.',
  recTagOn: 'Tag lines are inferred, not written. To see the network your readers can actually walk, turn them off.', recTagOnBtn: 'Show written links only',
  recTagOff: 'You are seeing written links only: isolated notes are the ones worth linking. Turn tags on to discover related posts that do not link to each other yet.', recTagOffBtn: 'Show shared tags',
  wpRelatedLong: 'Related reading (block at the end of the post)', legendCurated: 'related reading',
  wpPagesNote: 'Pages are usually linked from the site menu, which the explorer does not read: seeing them here is not always a problem.',
  recHub: 'Hub notes link to almost everything. Hide their lines to see the structure between chapters.', recHubBtn: 'Hide hub note links'
});

/* Sugerencias, diagnóstico de red y recorrido guiado. Los textos con <b> se insertan como HTML: todo valor externo pasa por E(). */
(function () {
  var E = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  Object.assign(window.KB_T.es, {
    tour: 'Recorrido', tourStep: function (i, n) { return 'Paso ' + i + ' de ' + n; }, tourPrev: 'Anterior', tourNext: 'Siguiente', tourExit: 'Salir del recorrido', tourMine: 'Probar con tus documentos',
    tour1: function (n, c, g) { return 'Esta es la red completa: <b>' + n + ' notas</b> unidas por <b>' + c + ' conexiones escritas</b>. Cada color es una de las ' + g + ' secciones y cada punto crece con los enlaces que recibe.'; },
    tour2: function (x, k) { return 'La nota más enlazada es <b>' + E(x) + '</b>: ' + k + ' notas apuntan a ella. Es el centro de gravedad de este conocimiento.'; },
    tour3: function (x) { return 'Vista Local: solo <b>' + E(x) + '</b> y su vecindario a dos saltos. Así se ve qué conocimiento se apoya en ella.'; },
    tour4: function (b, n) { return 'Apagamos las <b>lecturas relacionadas</b> agregadas al final de los artículos: sin ellas, <b>' + b + ' notas quedan aisladas</b>; con ellas, solo ' + n + '. Así se mide lo que aporta enlazar.'; },
    tour5: function (o, d, b) { return 'Salud convierte el grafo en una lista de tareas: <b>' + o + ' huérfanas</b>, <b>' + d + ' callejones sin salida</b> (reciben enlaces, pero no llevan a ningún lado) y <b>' + b + ' notas puente</b> que sostienen la red.'; },
    tour5ok: function (g, p) { return 'Salud lo confirma: <b>ninguna huérfana</b>, ningún enlace roto ni callejón sin salida, y ninguna nota sostiene sola la red.' + (g ? ' La sección menos conectada con las demás es <b>' + E(g) + '</b> (' + p + ' % de sus enlaces salen de ella).' : ''); },
    tour6: function (a, b, w) { return 'El grafo también propone: <b>' + E(a) + '</b> podría enlazar a <b>' + E(b) + '</b>, porque comparten ' + E(w) + '. La línea punteada es la conexión sugerida; el autor decide.'; },
    tour7: 'Lo mismo funciona con un repositorio de GitHub, un blog de WordPress o una carpeta de notas en tu computador.',
    sugHead: 'Conexiones sugeridas', sugNone: 'Sin sugerencias claras: ninguna otra nota comparte suficiente contenido con esta.', sugShare: 'Comparten:', sugCopy: 'Copiar enlace', sugCopied: 'Copiado ✓',
    sugScoreTip: 'Similitud de contenido (coseno TF-IDF)', sugLevel_hi: 'Alta', sugLevel_mid: 'Media', sugLevel_lo: 'Baja', peekSug: function (n) { return n === 1 ? '1 conexión sugerida' : n + ' conexiones sugeridas'; },
    deadH: 'Callejones sin salida', bridgeH: 'Notas puente', islandH: 'Grupos aislados', secH: 'Conexión entre secciones',
    noDead: 'Toda nota que recibe enlaces lleva a otra.', noBridge: 'Ninguna nota sostiene sola una parte de la red.', noIsland: 'Todas las notas enlazadas forman una sola red.',
    deadIn: function (n) { return n + ' entrantes · 0 salientes'; }, bridgeCut: function (n) { return 'separa ' + n + (n === 1 ? ' nota' : ' notas'); },
    islandSize: function (n, g) { return n + ' notas · ' + g; }, andMore: function (n) { return 'y ' + n + ' más (en el CSV)'; }, exportTasks: 'Descargar lista de tareas (CSV)',
    csvCat: 'Categoría', csvNote: 'Nota', csvWhere: 'Dirección', csvDetail: 'Detalle', csvSug: 'Sugerencia', csvOrphan: 'Sin enlaces escritos',
    csvDead: function (n) { return 'Recibe ' + n + ' enlaces y no enlaza a ninguna nota'; }, csvBridge: function (n) { return 'Si se quita, ' + n + ' notas quedan desconectadas'; },
    csvIsland: function (n, g) { return 'Grupo de ' + n + ' notas (' + g + ') sin camino a la red principal'; }
  });
  Object.assign(window.KB_T.es.help, {
    sug: { h: 'Conexiones sugeridas', b: 'Notas con contenido parecido que todavía no se enlazan con esta. Se calculan comparando las palabras de títulos, etiquetas y texto (TF-IDF): el porcentaje es la similitud y «Comparten» muestra la evidencia.', tip: 'Son propuestas, no enlaces: revisa que la relación tenga sentido para el lector antes de agregarla. «Copiar enlace» lo deja listo para pegar.' },
    deadEnds: { h: 'Callejones sin salida', b: 'Notas que reciben enlaces pero no enlazan a ninguna otra: el lector llega y no tiene a dónde seguir.', tip: 'Agrega al final un «para seguir leyendo» con 2 o 3 notas; las sugerencias ayudan a elegirlas.' },
    bridges: { h: 'Notas puente', b: 'Notas que unen partes de la red que, sin ellas, quedarían separadas. El número dice cuántas notas perderían contacto con el resto.', tip: 'Cuídalas: si cambias su dirección o las borras, la red se parte. Un enlace alternativo reduce el riesgo.' },
    islands: { h: 'Grupos aislados', b: 'Conjuntos de notas enlazadas entre sí, pero sin ningún camino hacia la red principal.', tip: 'Un solo enlace hacia o desde la red principal los integra.' },
    sections: { h: 'Conexión entre secciones', b: 'Qué parte de los enlaces de cada sección va hacia otras secciones. Una barra corta (en ocre, bajo 15 %) indica un tema que solo habla consigo mismo.' },
    tour: { h: 'Recorrido guiado', b: 'Presenta esta red paso a paso: su centro, su vecindario, su salud y las conexiones que propone. Pensado para un demo en vivo; avanza con las flechas del teclado.', tip: 'Para abrirlo directamente, agrega ?tour=1 al enlace.' }
  });
  Object.assign(window.KB_T.en, {
    tour: 'Tour', tourStep: function (i, n) { return 'Step ' + i + ' of ' + n; }, tourPrev: 'Back', tourNext: 'Next', tourExit: 'Leave the tour', tourMine: 'Try your own documents',
    tour1: function (n, c, g) { return 'This is the whole network: <b>' + n + ' notes</b> joined by <b>' + c + ' written connections</b>. Each colour is one of the ' + g + ' sections and each dot grows with the links it receives.'; },
    tour2: function (x, k) { return 'The most linked note is <b>' + E(x) + '</b>: ' + k + ' notes point to it. It is the centre of gravity of this knowledge.'; },
    tour3: function (x) { return 'Local view: only <b>' + E(x) + '</b> and its two-hop neighbourhood. This shows which knowledge rests on it.'; },
    tour4: function (b, n) { return 'We switch off the <b>related reading</b> added at the end of the posts: without it, <b>' + b + ' notes are isolated</b>; with it, only ' + n + '. That is what linking adds.'; },
    tour5: function (o, d, b) { return 'Health turns the graph into a to-do list: <b>' + o + ' orphans</b>, <b>' + d + ' dead ends</b> (they receive links but lead nowhere) and <b>' + b + ' bridge notes</b> holding the network together.'; },
    tour5ok: function (g, p) { return 'Health confirms it: <b>no orphans</b>, no broken links or dead ends, and no single note holds the network up.' + (g ? ' The section least connected to the others is <b>' + E(g) + '</b> (' + p + ' % of its links leave it).' : ''); },
    tour6: function (a, b, w) { return 'The graph also suggests: <b>' + E(a) + '</b> could link to <b>' + E(b) + '</b>, because they share ' + E(w) + '. The dashed line is the suggested connection; the author decides.'; },
    tour7: 'The same works with a GitHub repository, a WordPress blog or a folder of notes on your computer.',
    sugHead: 'Suggested connections', sugNone: 'No clear suggestions: no other note shares enough content with this one.', sugShare: 'They share:', sugCopy: 'Copy link', sugCopied: 'Copied ✓',
    sugScoreTip: 'Content similarity (TF-IDF cosine)', sugLevel_hi: 'High', sugLevel_mid: 'Medium', sugLevel_lo: 'Low', peekSug: function (n) { return n === 1 ? '1 suggested connection' : n + ' suggested connections'; },
    deadH: 'Dead ends', bridgeH: 'Bridge notes', islandH: 'Isolated groups', secH: 'Links between sections',
    noDead: 'Every note that receives links leads to another one.', noBridge: 'No single note holds a part of the network on its own.', noIsland: 'All linked notes form a single network.',
    deadIn: function (n) { return n + ' incoming · 0 outgoing'; }, bridgeCut: function (n) { return 'cuts off ' + n + (n === 1 ? ' note' : ' notes'); },
    islandSize: function (n, g) { return n + ' notes · ' + g; }, andMore: function (n) { return 'and ' + n + ' more (in the CSV)'; }, exportTasks: 'Download to-do list (CSV)',
    csvCat: 'Category', csvNote: 'Note', csvWhere: 'Address', csvDetail: 'Detail', csvSug: 'Suggestion', csvOrphan: 'No written links',
    csvDead: function (n) { return 'Receives ' + n + ' links and links to no note'; }, csvBridge: function (n) { return 'If removed, ' + n + ' notes become disconnected'; },
    csvIsland: function (n, g) { return 'Group of ' + n + ' notes (' + g + ') with no path to the main network'; }
  });
  Object.assign(window.KB_T.en.help, {
    sug: { h: 'Suggested connections', b: 'Notes with similar content that do not link to this one yet. They come from comparing the words in titles, tags and text (TF-IDF): the percentage is the similarity and “They share” shows the evidence.', tip: 'They are proposals, not links: check the relation makes sense to a reader before adding it. “Copy link” makes it ready to paste.' },
    deadEnds: { h: 'Dead ends', b: 'Notes that receive links but link to no other note: readers arrive and have nowhere to go next.', tip: 'Add a short “keep reading” with 2 or 3 notes at the end; the suggestions help pick them.' },
    bridges: { h: 'Bridge notes', b: 'Notes joining parts of the network that would otherwise be split. The number is how many notes would lose contact with the rest.', tip: 'Look after them: renaming or deleting one splits the network. An alternative link lowers the risk.' },
    islands: { h: 'Isolated groups', b: 'Sets of notes linked to each other but with no path to the main network.', tip: 'A single link to or from the main network brings them in.' },
    sections: { h: 'Links between sections', b: 'The share of each section’s links that go to other sections. A short bar (ochre, under 15 %) marks a topic that only talks to itself.' },
    tour: { h: 'Guided tour', b: 'Presents this network step by step: its centre, its neighbourhood, its health and the connections it suggests. Made for a live demo; move with the arrow keys.', tip: 'To open it directly, add ?tour=1 to the link.' }
  });
})();
/* Relaciones del autor: la capa que solo el autor puede declarar. */
(function () {
  var E = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var es = window.KB_T.es, en = window.KB_T.en;
  es.type.author = 'Del autor'; en.type.author = 'Author';
  es.typeLong.author = 'Relación declarada por el autor (con dirección y verbo)'; en.typeLong.author = 'Relation declared by the author (with direction and verb)';
  es.verbs = { evolves: ['evoluciona en', 'evoluciona de'], founds: ['fundamenta', 'se fundamenta en'], applies: ['aplica', 'se aplica en'], updates: ['actualiza a', 'es actualizado por'] };
  en.verbs = { evolves: ['evolves into', 'evolved from'], founds: ['underpins', 'builds on'], applies: ['applies', 'is applied in'], updates: ['updates', 'is updated by'] };
  Object.assign(es, {
    authHead: 'Relaciones del autor', legendAuthor: 'relación del autor', pillar: 'Pilar del autor', pillarIs: 'Pilar del pensamiento del autor', authNoneYet: 'Es un pilar, pero aún no tiene relaciones declaradas. Decláralas en Salud → Decisiones del autor.',
    authSrc_blog: 'en el blog', authSrc_site: 'publicada', authSrc_local: 'borrador (este navegador)',
    authTasks: 'Decisiones del autor', authDeclaredN: function (n) { return n === 1 ? '1 relación declarada' : n + ' relaciones declaradas'; },
    pillarsN: function (n) { return n === 1 ? '1 pilar' : n + ' pilares'; },
    authPendingN: function (n) { return n ? 'Por declarar · ' + n + (n === 1 ? ' par que solo tú puedes calificar' : ' pares que solo tú puedes calificar') : 'Por declarar'; },
    authWhyLink: '1 enlace', authWhyLinks: function (n) { return n + ' enlaces entre ellas'; }, authWhyBoth: 'se citan mutuamente', authWhyPillar: 'incluye un pilar', authWhySim: function (p) { return p + ' % de similitud'; },
    authChoose: 'Elige la relación…', authDeclare: 'Declarar', authDel: 'Quitar este borrador', authNoPending: 'No hay pares fuertes sin calificar.',
    authCopyBlocks: 'Copiar bloques para el blog', authExport: 'Exportar relaciones (JSON)', authCopied: 'Bloques copiados: pégalos al final de cada artículo.',
    authSaved: 'Relación declarada como borrador en este navegador. Para publicarla, pega el bloque en el artículo o exporta el JSON.',
    authLocalNote: 'Los borradores solo se ven en este navegador. Se publican al agregar el bloque «Evoluciona en: …» al artículo, o al subir el JSON a data/author-relations.json.',
    makePillar: 'Marcar como pilar del autor', unPillar: 'Quitar de los pilares del autor',
    tourAuthor: function (a, v, b) { return 'Hay relaciones que el grafo no puede inferir y solo el autor puede declarar: <b>' + E(a) + '</b> <b>' + E(v) + '</b> <b>' + E(b) + '</b>. La flecha gruesa es esa decisión: dirección y significado, no solo una línea.'; }
  });
  Object.assign(en, {
    authHead: 'Author relations', legendAuthor: 'author relation', pillar: 'Author pillar', pillarIs: 'Pillar of the author’s thinking', authNoneYet: 'It is a pillar but has no declared relations yet. Declare them in Health → Author decisions.',
    authSrc_blog: 'on the blog', authSrc_site: 'published', authSrc_local: 'draft (this browser)',
    authTasks: 'Author decisions', authDeclaredN: function (n) { return n === 1 ? '1 declared relation' : n + ' declared relations'; },
    pillarsN: function (n) { return n === 1 ? '1 pillar' : n + ' pillars'; },
    authPendingN: function (n) { return n ? 'To declare · ' + n + (n === 1 ? ' pair only you can qualify' : ' pairs only you can qualify') : 'To declare'; },
    authWhyLink: '1 link', authWhyLinks: function (n) { return n + ' links between them'; }, authWhyBoth: 'they cite each other', authWhyPillar: 'includes a pillar', authWhySim: function (p) { return p + ' % similarity'; },
    authChoose: 'Choose the relation…', authDeclare: 'Declare', authDel: 'Remove this draft', authNoPending: 'No strong pairs left to qualify.',
    authCopyBlocks: 'Copy blocks for the blog', authExport: 'Export relations (JSON)', authCopied: 'Blocks copied: paste them at the end of each post.',
    authSaved: 'Relation declared as a draft in this browser. To publish it, paste the block into the post or export the JSON.',
    authLocalNote: 'Drafts are only visible in this browser. They are published by adding the “Evolves into: …” block to the post, or by uploading the JSON to data/author-relations.json.',
    makePillar: 'Mark as an author pillar', unPillar: 'Remove from author pillars',
    tourAuthor: function (a, v, b) { return 'Some relations cannot be inferred by the graph and only the author can declare them: <b>' + E(a) + '</b> <b>' + E(v) + '</b> <b>' + E(b) + '</b>. The thick arrow is that decision: direction and meaning, not just a line.'; }
  });
  Object.assign(es.help, {
    'type-author': { h: 'Relaciones del autor', b: 'Relaciones que el grafo no puede deducir: el autor las declara con dirección y verbo (evoluciona en, fundamenta, aplica, actualiza a). Se dibujan como flechas gruesas y tienen prioridad sobre cualquier enlace.', tip: 'Se declaran con un bloque al final del artículo («Evoluciona en: …») o en Salud → Decisiones del autor.' },
    author: { h: 'Relaciones del autor', b: 'Lo que el autor afirma sobre esta nota: de qué evoluciona, qué fundamenta, qué aplica. No es similitud ni una cita: es su interpretación de cómo se conecta su pensamiento.' },
    authorTasks: { h: 'Decisiones del autor', b: 'Pares de notas con una conexión fuerte (varios enlaces, citas mutuas, un pilar o mucha similitud) que el grafo no puede calificar. Solo el autor sabe si una evoluciona de la otra, la fundamenta o la aplica.', tip: 'Cada declaración queda como borrador en este navegador; «Copiar bloques» y «Exportar» la convierten en algo publicado.' },
    pillar: { h: 'Pilar del autor', b: 'Marca las piezas que son eje del pensamiento del autor. Se destacan con anillo y nombre siempre visible, aunque todavía tengan pocos enlaces: su lugar no lo da el número de conexiones, lo decide el autor.' }
  });
  Object.assign(en.help, {
    'type-author': { h: 'Author relations', b: 'Relations the graph cannot infer: the author declares them with direction and verb (evolves into, underpins, applies, updates). They are drawn as thick arrows and take priority over any link.', tip: 'Declare them with a block at the end of the post (“Evolves into: …”) or in Health → Author decisions.' },
    author: { h: 'Author relations', b: 'What the author states about this note: what it evolved from, what it underpins, what it applies. Not similarity, not a citation: the author’s reading of how their thinking connects.' },
    authorTasks: { h: 'Author decisions', b: 'Pairs of notes with a strong connection (several links, mutual citations, a pillar or high similarity) that the graph cannot qualify. Only the author knows whether one evolved from the other, underpins it or applies it.', tip: 'Each declaration stays as a draft in this browser; “Copy blocks” and “Export” turn it into something published.' },
    pillar: { h: 'Author pillar', b: 'Marks the pieces at the core of the author’s thinking. They are highlighted with a ring and an always-visible name even if they still have few links: their place is decided by the author, not by the number of connections.' }
  });
})();
/* Declarar relaciones del autor desde cualquier nota, en cualquier fuente. */
(function () {
  var es = window.KB_T.es, en = window.KB_T.en;
  es.rules.splice(2, 0, 'Relaciones del autor (con dirección y verbo): una línea <code>**Evoluciona en:** [[nota]]</code>, el campo <code>evoluciona_en: [nota.md]</code> o <code>fundamenta</code>, <code>aplica</code>, <code>actualiza_a</code>; <code>pilar: true</code> marca un pilar. También un archivo <code>relaciones-autor.json</code> en la raíz.');
  en.rules.splice(2, 0, 'Author relations (with direction and verb): a line <code>**Evolves into:** [[note]]</code>, the field <code>evolves_into: [note.md]</code> or <code>underpins</code>, <code>applies</code>, <code>updates</code>; <code>pillar: true</code> marks a pillar. Also a <code>relaciones-autor.json</code> file at the root.');
  Object.assign(es, {
    relTitle: 'Declarar una relación del autor', relLead: 'El grafo deduce parecidos y lee enlaces, pero no sabe cómo evoluciona tu pensamiento. Eso solo lo decides tú.',
    relVerb: 'Relación', relCopy: 'Copiar', relSearch: 'Busca la otra nota…', relPickTo: 'Elige la otra nota para ver la relación.', relSave: 'Agregar al grafo', relCancel: 'Cancelar', relNoMatch: 'Ninguna nota coincide.',
    relSaved: 'Agregada al grafo como borrador en este navegador.', relPerm: 'Hazla permanente en tu fuente',
    relWhereWp: function (x) { return 'Pega este bloque al final de «' + x + '» en WordPress:'; },
    relWhereLine: function (x) { return 'Agrega esta línea en «' + x + '»:'; }, relWhereFm: 'O este campo en su frontmatter:', relWhereFile: 'O súmala a relaciones-autor.json en la raíz del repositorio:',
    relAddShort: 'Declarar relación del autor', relAddLong: 'Declarar una relación del autor: ¿de qué evoluciona esta nota, qué fundamenta o qué aplica?',
    authEmpty: 'El grafo no puede saber qué idea evoluciona de cuál ni cuáles son tus pilares. Esa capa es del autor: declárala para que el grafo muestre tu pensamiento, no solo tus enlaces.',
    authFirst: 'Declarar la primera relación', authSrc_note: 'en la nota', authSrc_file: 'en el repositorio',
    tourAuthorEmpty: 'Falta una capa que el grafo no puede inferir: <b>cómo evoluciona el pensamiento del autor</b>. Desde cualquier nota, el botón <b>＋ Relación del autor</b> declara que una idea evoluciona de otra, la fundamenta o la aplica, y entrega el fragmento para guardarla en la propia fuente.'
  });
  Object.assign(en, {
    relTitle: 'Declare an author relation', relLead: 'The graph infers similarity and reads links, but it cannot know how your thinking evolves. Only you decide that.',
    relVerb: 'Relation', relCopy: 'Copy', relSearch: 'Search the other note…', relPickTo: 'Pick the other note to see the relation.', relSave: 'Add to the graph', relCancel: 'Cancel', relNoMatch: 'No note matches.',
    relSaved: 'Added to the graph as a draft in this browser.', relPerm: 'Make it permanent in your source',
    relWhereWp: function (x) { return 'Paste this block at the end of “' + x + '” in WordPress:'; },
    relWhereLine: function (x) { return 'Add this line to “' + x + '”:'; }, relWhereFm: 'Or this field in its frontmatter:', relWhereFile: 'Or add it to relaciones-autor.json at the repository root:',
    relAddShort: 'Declare an author relation', relAddLong: 'Declare an author relation: what does this note evolve from, underpin or apply?',
    authEmpty: 'The graph cannot know which idea evolved from which, or which pieces are your pillars. That layer belongs to the author: declare it so the graph shows your thinking, not just your links.',
    authFirst: 'Declare the first relation', authSrc_note: 'in the note', authSrc_file: 'in the repository',
    tourAuthorEmpty: 'One layer cannot be inferred by the graph: <b>how the author’s thinking evolves</b>. From any note, the <b>＋ Author relation</b> button declares that one idea evolved from another, underpins it or applies it, and hands over the snippet to keep it in the source itself.'
  });
  es.help.relAdd = { h: 'Relación del autor', b: 'Declara cómo se conecta esta nota con otra en tu pensamiento: evoluciona en, fundamenta, aplica o actualiza. Aparece como flecha gruesa y el panel te da el fragmento para guardarla en el blog, en la nota o en el repositorio.', tip: 'Lo que el grafo deduce puede cambiar con cada lectura; lo que declaras tú es una decisión.' };
  en.help.relAdd = { h: 'Author relation', b: 'Declare how this note connects to another in your thinking: evolves into, underpins, applies or updates. It shows as a thick arrow, and the panel gives you the snippet to keep it on the blog, in the note or in the repository.', tip: 'What the graph infers may change with every reading; what you declare is a decision.' };
})();
(function () {
  var L = window.__lang0 === 'en' ? 'en' : 'es', T = window.KB_T[L];
  document.documentElement.lang = L;
  document.querySelectorAll('[data-i18n]').forEach(function (el) { var v = T[el.getAttribute('data-i18n')]; if (typeof v === 'string') el.textContent = v; });
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) { var v = T[el.getAttribute('data-i18n-html')]; if (typeof v === 'string') el.innerHTML = v; });
  document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.placeholder = T[el.getAttribute('data-i18n-ph')]; });
  document.querySelectorAll('[data-i18n-title]').forEach(function (el) { el.title = T[el.getAttribute('data-i18n-title')]; el.setAttribute('aria-label', el.title); });
  document.querySelectorAll('#langToggle .lang-opt').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === L); });
  if (L === 'en') document.title = T.pageTitle;
})();
