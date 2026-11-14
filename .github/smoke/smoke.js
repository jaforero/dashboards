#!/usr/bin/env node
/*
 * Pruebas de humo de dashboards.javierforero.co
 * --------------------------------------------
 * Sirve el repositorio en local, abre cada tablero en Chromium (Playwright) y revisa lo que ya
 * falló alguna vez en producción:
 *   1. errores de JavaScript y archivos locales que no cargan;
 *   2. gráficas Plotly cuyo dibujo no cabe en su tarjeta, al cargar, al cambiar de pestaña y al
 *      redimensionar la ventana (el fallo de SLA y Desempeño de noviembre de 2026);
 *   3. desbordamiento horizontal en móvil (375 px);
 *   4. texto que queda en español al pasar a inglés, y que el español vuelva idéntico;
 *   5. enlaces internos e imágenes rotas;
 *   6. versiones offline: deben dibujar sus gráficas sin red;
 *   7. redirecciones de las rutas antiguas;
 *   8. sitemap.xml: cada URL existe y su <lastmod> no es anterior al último cambio de la página
 *      (esto último solo avisa, no hace fallar la prueba);
 *   9. accesibilidad: axe-core (reglas WCAG 2.0/2.1 nivel A y AA) en cada pestaña, en tema claro y,
 *      si la página lo tiene, en tema oscuro. Requiere el paquete axe-core junto a Playwright.
 *
 * Uso:  node .github/smoke/smoke.js [raíz-del-repo]
 * Variables opcionales:
 *   SMOKE_ONLY=sla,pulso     revisa solo esas páginas (por id)
 *   SMOKE_NET=0              bloquea toda la red externa (por defecto se permite, como en GitHub Actions)
 *   SMOKE_ROUTES=mapa.json   {"https://cdn…/lib.js": "/ruta/local/lib.js"} para correr sin CDN
 * La analítica (Google Analytics) siempre se bloquea: las pruebas no generan visitas.
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(process.argv[2] || '.');
const SITE = 'https://dashboards.javierforero.co';
const ANALYTICS = /googletagmanager\.com|google-analytics\.com|analytics\.google\.com|doubleclick\.net/;
const ROUTES = process.env.SMOKE_ROUTES ? JSON.parse(fs.readFileSync(process.env.SMOKE_ROUTES, 'utf8')) : {};
const NET = process.env.SMOKE_NET !== '0';
const ONLY = process.env.SMOKE_ONLY ? process.env.SMOKE_ONLY.split(',').map(s => s.trim()) : null;
/* axe-core se instala junto a Playwright (ver el workflow); sin él, el control de accesibilidad falla en CI y solo avisa en local */
let AXE = null;
try { AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8'); } catch (e) { }
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/* Páginas a revisar. en:false = no buscar español en la versión inglesa (contenido propio en español). */
const PAGES = [
  { id: 'portada', path: '/' },
  { id: 'claude', path: '/claude/' },
  { id: 'sla', path: '/claude/sla-operaciones/', offline: '/claude/sla-operaciones/dashboard-offline.html' },
  { id: 'pulso', path: '/claude/pulso-financiero/', offline: '/claude/pulso-financiero/dashboard-offline.html' },
  { id: 'desempeno', path: '/claude/desempeno-comercial/', offline: '/claude/desempeno-comercial/dashboard-offline.html' },
  { id: 'costo-vida', path: '/claude/costo-vida-colombia/' },
  { id: 'grafo', path: '/claude/grafo-conocimiento/', en: false },
  { id: 'ia-compute', path: '/ia-compute/' },
  { id: 'tasas', path: '/tasas-cambio/' },
  { id: 'poblacion', path: '/poblacion-latam/' },
  { id: 'adopcion-ia', path: '/adopcion-ia/' },
  { id: 'redir-pulso', path: '/pulso-financiero/', redirect: '/claude/pulso-financiero/' },
  { id: 'redir-sla', path: '/sla-operaciones/', redirect: '/claude/sla-operaciones/' },
].filter(p => !ONLY || ONLY.includes(p.id));

/* Palabras que delatan una frase en español; los nombres de instituciones no cuentan. */
const ES_WORDS = [' de la ', ' el ', ' los ', ' las ', ' para ', ' con ', ' por ', ' que ', ' una ', ' del ', ' según ',
  ' años ', ' más ', ' entre ', ' sobre ', ' cada ', ' está ', ' están ', ' también '];
const PROPER = /El Salvador|Banco|Instituto|Central|Departamento|Comisión|CEPAL|CELADE|Naciones Unidas|Dirección|Oficina|Secretar|Consejo|Superintend|Ministerio|\bINE\b|DANE|INDEC|IBGE|INEGI|CONAPO|Estadística|Universidad|Cámara|Javier Forero/;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.csv': 'text/csv; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.otf': 'font/otf', '.webmanifest': 'application/manifest+json', '.pdf': 'application/pdf',
};
const typeOf = f => TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream';

function localFile(urlPath) {
  let rel;
  try { rel = decodeURIComponent(urlPath.split('?')[0].split('#')[0]); } catch (e) { return null; }
  const f0 = path.join(ROOT, rel);
  if (!f0.startsWith(ROOT)) return null;
  try {
    const f = fs.statSync(f0).isDirectory() ? path.join(f0, 'index.html') : f0;
    return fs.statSync(f).isFile() ? f : null;
  } catch (e) { return null; }
}

/* ---------- resultados ---------- */
const results = [];   // {page, level: 'fail'|'warn', msg}
const fail = (page, msg) => results.push({ page, level: 'fail', msg });
const warn = (page, msg) => results.push({ page, level: 'warn', msg });

/* ---------- servidor local ---------- */
function startServer() {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      const f = localFile(new URL(req.url, 'http://x').pathname);
      if (!f) { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('404'); return; }
      res.writeHead(200, { 'content-type': typeOf(f), 'cache-control': 'no-store' });
      fs.createReadStream(f).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

/* ---------- utilidades de navegador ---------- */
async function newContext(browser, base, { mobile = false, offline = false, lang = 'es', dark = false } = {}) {
  const ctx = await browser.newContext(mobile
    ? { viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-CO' }
    : { viewport: { width: 1366, height: 900 }, locale: 'es-CO', colorScheme: dark ? 'dark' : 'light' });
  ctx.__external = [];
  await ctx.route('**/*', async r => {
    const u = r.request().url();
    if (u.startsWith(base) || u.startsWith('data:') || u.startsWith('blob:')) return r.continue();
    if (ANALYTICS.test(u)) return r.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
    if (u.startsWith(SITE + '/')) {   // rutas absolutas al propio sitio: se sirven desde el repo
      const f = localFile(new URL(u).pathname);
      return f ? r.fulfill({ status: 200, contentType: typeOf(f), body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: '' });
    }
    if (offline) { ctx.__external.push(u); return r.abort(); }
    const mapped = ROUTES[u.split('?')[0]];
    if (mapped) return r.fulfill({ status: 200, contentType: typeOf(mapped), headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(mapped) });
    if (!NET) return r.abort();
    return r.continue();
  });
  // idioma inicial fijo (una sola vez por pestaña, para no pisar el selector de la propia prueba)
  await ctx.addInitScript(l => {
    try { if (!sessionStorage.getItem('__smoke')) { localStorage.clear(); localStorage.setItem('jf-lang', l); sessionStorage.setItem('__smoke', '1'); } } catch (e) { }
  }, lang);
  return ctx;
}

function watch(page, base, label, pageId) {
  page.on('pageerror', e => fail(pageId, `${label}: error de JavaScript: ${String(e.message).slice(0, 200)}`));
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const loc = (m.location() && m.location().url) || '';
    const t = m.text();
    if (/Failed to load resource/.test(t)) {
      if (loc.startsWith(base)) fail(pageId, `${label}: archivo local no encontrado: ${loc.replace(base, '')}`);
      return; // fallos de red externos se reportan aparte
    }
    fail(pageId, `${label}: console.error: ${t.slice(0, 200)}`);
  });
  page.on('requestfailed', rq => {
    const u = rq.url();
    if (u.startsWith(base) && !/favicon/.test(u)) fail(pageId, `${label}: no cargó ${u.replace(base, '')}`);
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const TAB_SEL = '[role="tab"], button.tab';
async function tabCount(page) {
  return page.evaluate(sel => [...document.querySelectorAll(sel)].filter(b => b.offsetParent !== null).length, TAB_SEL);
}
async function clickTab(page, i) {
  return page.evaluate(([sel, i]) => {
    const t = [...document.querySelectorAll(sel)].filter(b => b.offsetParent !== null)[i];
    if (!t) return null; t.click(); return t.textContent.trim().replace(/\s+/g, ' ').slice(0, 30);
  }, [TAB_SEL, i]);
}

/* Gráficas visibles cuyo dibujo no coincide con su tarjeta */
async function plotProblems(page) {
  return page.evaluate(() => [...document.querySelectorAll('.js-plotly-plot')]
    .filter(g => g.offsetParent !== null && g.getBoundingClientRect().width > 0)
    .map(g => {
      const s = g.querySelector('.main-svg'); const a = g.getBoundingClientRect(); const b = s ? s.getBoundingClientRect() : { height: 0, width: 0 };
      return { id: g.id || g.className.split(' ')[0], h: Math.round(a.height), sh: Math.round(b.height), w: Math.round(a.width), sw: Math.round(b.width) };
    })
    .filter(p => p.sh < 40 || p.sh > p.h + 14 || p.sw > p.w + 14)
    .map(p => `${p.id}: tarjeta ${p.w}×${p.h}px, dibujo ${p.sw}×${p.sh}px`));
}

/* Desbordamiento horizontal de la página y los elementos que lo causan */
async function overflow(page) {
  return page.evaluate(() => {
    const cw = document.documentElement.clientWidth, extra = document.documentElement.scrollWidth - cw;
    if (extra <= 1) return null;
    const clipped = el => { for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') return true; } return false; };
    const who = [...document.querySelectorAll('body *')].filter(el => {
      const r = el.getBoundingClientRect(); return r.width > 0 && r.right > cw + 1 && !clipped(el);
    }).filter((el, _, arr) => !arr.includes(el.parentElement)).slice(0, 3)
      .map(el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''));
    return `${extra}px de más (${who.join(', ') || 'sin culpable identificado'})`;
  });
}

async function setLang(page, to) {
  return page.evaluate(to => {
    const o = document.querySelector(`.lang-opt[data-lang="${to}"]`);
    if (o) { o.click(); return true; }
    const t = document.getElementById('langToggle');
    if (t) { if ((document.documentElement.lang || 'es').slice(0, 2) !== to) t.click(); return true; }
    return false;
  }, to);
}

async function spanishLines(page) {
  return page.evaluate(([words, proper]) => {
    const re = new RegExp(proper);
    return document.body.innerText.split('\n').map(l => l.trim())
      .filter(l => l.length > 15 && !re.test(l) && words.some(w => (' ' + l.toLowerCase() + ' ').includes(w)));
  }, [ES_WORDS, PROPER.source]);
}

async function linksAndImages(page, base, pageId) {
  const r = await page.evaluate(site => ({
    links: [...new Set([...document.querySelectorAll('a[href]')].map(a => a.href.split('#')[0]))]
      .filter(h => h.startsWith(location.origin) || h.startsWith(site)),
    broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.src).map(i => i.src),
  }), SITE);
  for (const h of r.links) {
    const p = new URL(h).pathname;
    if (!localFile(p)) fail(pageId, `enlace roto: ${p}`);
  }
  for (const src of r.broken) {
    if (src.startsWith(base) || src.startsWith(SITE)) fail(pageId, `imagen rota: ${src.replace(base, '').replace(SITE, '')}`);
    else warn(pageId, `imagen externa no cargó: ${src.slice(0, 120)}`);
  }
}

/* Infracciones de axe-core en el estado actual de la página; se acumulan por regla en `acc` */
async function axeCheck(page, acc, tag) {
  if (!AXE) return;
  if (!await page.evaluate(() => !!window.axe)) await page.addScriptTag({ content: AXE });
  const v = await page.evaluate(async tags => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] });
    return r.violations.map(x => ({ id: x.id, help: x.help, nodes: x.nodes.map(n => n.target.join(' ').slice(0, 80)) }));
  }, AXE_TAGS);
  for (const x of v) {
    const e = acc[x.id] || (acc[x.id] = { help: x.help, nodes: new Set(), where: new Set() });
    x.nodes.forEach(n => e.nodes.add(n)); e.where.add(tag);
  }
}
function axeReport(pageId, acc, theme) {
  for (const [id, e] of Object.entries(acc)) {
    const n = [...e.nodes];
    fail(pageId, `accesibilidad (${theme}): ${id} — ${e.help}: ${n.length} elemento(s), p. ej. ${n.slice(0, 2).join(' · ')} (${[...e.where].slice(0, 3).join(', ')})`);
  }
}

/* ---------- pruebas por página ---------- */
async function checkDesktop(browser, base, pg) {
  const ctx = await newContext(browser, base);
  const page = await ctx.newPage();
  watch(page, base, 'escritorio', pg.id);
  await page.goto(base + pg.path, { waitUntil: 'load' });
  await sleep(2500);
  if (pg.redirect) {
    const ok = new URL(page.url()).pathname === pg.redirect;
    if (!ok) fail(pg.id, `no redirige a ${pg.redirect} (quedó en ${new URL(page.url()).pathname})`);
    await ctx.close(); return;
  }
  await linksAndImages(page, base, pg.id);
  const a11y = {};
  const report = async tag => {
    for (const p of await plotProblems(page)) fail(pg.id, `gráfica desbordada (${tag}): ${p}`);
    const o = await overflow(page); if (o) fail(pg.id, `desborde horizontal en escritorio (${tag}): ${o}`);
  };
  await report('al cargar'); await axeCheck(page, a11y, 'al cargar');
  const n = Math.min(await tabCount(page), 12);
  for (let i = 0; i < n; i++) {
    const name = await clickTab(page, i); await sleep(450);
    await report(`pestaña «${name}»`); await axeCheck(page, a11y, `«${name}»`);
    await page.setViewportSize({ width: 1100, height: 900 }); await sleep(350);
    await page.setViewportSize({ width: 1366, height: 900 }); await sleep(450);
    await report(`pestaña «${name}» tras redimensionar`);
  }
  if (n) { await clickTab(page, 0); await sleep(400); }
  axeReport(pg.id, a11y, 'tema claro');

  // idioma: inglés sin restos de español, y vuelta exacta al español
  if (pg.en !== false && await page.evaluate(() => !!(document.querySelector('.lang-opt[data-lang="en"]') || document.getElementById('langToggle')))) {
    const esBefore = await page.evaluate(() => document.body.innerText);
    await setLang(page, 'en'); await sleep(1200);
    const leaks = new Set();
    (await spanishLines(page)).forEach(l => leaks.add(l));
    for (let i = 1; i < n; i++) { await clickTab(page, i); await sleep(350); (await spanishLines(page)).forEach(l => leaks.add(l)); }
    if (n) { await clickTab(page, 0); await sleep(350); }
    if (leaks.size) fail(pg.id, `inglés con ${leaks.size} línea(s) en español, p. ej.: «${[...leaks].slice(0, 3).map(l => l.slice(0, 90)).join('» · «')}»`);
    const enTitle = await page.title();
    await setLang(page, 'es'); await sleep(1200);
    const esAfter = await page.evaluate(() => document.body.innerText);
    if (esAfter !== esBefore) {
      const a = esBefore.split('\n'), b = esAfter.split('\n'); let k = 0; while (k < a.length && a[k] === b[k]) k++;
      fail(pg.id, `el español no vuelve idéntico tras pasar por inglés (línea ${k + 1}: «${(a[k] || '').slice(0, 70)}» → «${(b[k] || '').slice(0, 70)}»)`);
    }
    if (pg.offline === undefined && /^\[Offline\]/.test(enTitle)) warn(pg.id, 'título con [Offline] fuera de la versión offline');
  }
  for (const u of new Set(ctx.__external)) warn(pg.id, `externo bloqueado: ${u.slice(0, 120)}`);
  await ctx.close();
}

async function checkDark(browser, base, pg) {
  if (pg.redirect || !AXE) return;
  const ctx = await newContext(browser, base, { dark: true });
  const page = await ctx.newPage();
  watch(page, base, 'tema oscuro', pg.id);
  await page.goto(base + pg.path, { waitUntil: 'load' });
  await sleep(2000);
  const ok = await page.evaluate(() => {
    if (document.documentElement.getAttribute('data-theme') === 'dark') return true;
    const t = document.getElementById('themeToggle'); if (!t) return false;
    t.click(); return document.documentElement.getAttribute('data-theme') === 'dark';
  });
  if (!ok) { await ctx.close(); return; }   // página sin tema oscuro
  await sleep(400);
  const a11y = {};
  await axeCheck(page, a11y, 'al cargar');
  const n = Math.min(await tabCount(page), 12);
  for (let i = 0; i < n; i++) { const name = await clickTab(page, i); await sleep(450); await axeCheck(page, a11y, `«${name}»`); }
  axeReport(pg.id, a11y, 'tema oscuro');
  await ctx.close();
}

async function checkMobile(browser, base, pg) {
  if (pg.redirect) return;
  const ctx = await newContext(browser, base, { mobile: true });
  const page = await ctx.newPage();
  watch(page, base, 'móvil', pg.id);
  await page.goto(base + pg.path, { waitUntil: 'load' });
  await sleep(2500);
  const report = async tag => {
    const o = await overflow(page); if (o) fail(pg.id, `desborde horizontal en móvil 375px (${tag}): ${o}`);
    for (const p of await plotProblems(page)) fail(pg.id, `gráfica desbordada en móvil (${tag}): ${p}`);
  };
  await report('al cargar');
  const n = Math.min(await tabCount(page), 12);
  for (let i = 0; i < n; i++) { const name = await clickTab(page, i); await sleep(500); await report(`pestaña «${name}»`); }
  await ctx.close();
}

async function checkOffline(browser, base, pg) {
  if (!pg.offline) return;
  const ctx = await newContext(browser, base, { offline: true });
  const page = await ctx.newPage();
  watch(page, base, 'offline', pg.id);
  await page.goto(base + pg.offline, { waitUntil: 'load' });
  await sleep(2500);
  // algunas pestañas dibujan sus gráficas solo al abrirse: se recorren todas antes de contar
  const tabs = Math.min(await tabCount(page), 12);
  for (let i = 0; i < tabs; i++) { await clickTab(page, i); await sleep(400); }
  if (tabs) { await clickTab(page, 0); await sleep(300); }
  const n = await page.evaluate(() => document.querySelectorAll('.js-plotly-plot').length);
  if (!n) fail(pg.id, 'offline: no dibujó ninguna gráfica sin red');
  const t = await page.title();
  if (!/^\[Offline\]/.test(t)) fail(pg.id, `offline: el título no empieza con [Offline] («${t}»)`);
  if (await setLang(page, 'en')) {
    await sleep(1000);
    const te = await page.title();
    if (!/^\[Offline\]/.test(te)) fail(pg.id, `offline en inglés: el título pierde [Offline] («${te}»)`);
  }
  const ext = [...new Set(ctx.__external)].filter(u => !/fonts\.(googleapis|gstatic)\.com/.test(u));
  if (ext.length) warn(pg.id, `offline intentó cargar ${ext.length} recurso(s) externo(s), p. ej. ${ext[0].slice(0, 100)}`);
  await ctx.close();
}

/* ---------- sitemap ---------- */
function checkSitemap() {
  const f = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(f)) { fail('sitemap', 'no existe sitemap.xml'); return; }
  const xml = fs.readFileSync(f, 'utf8');
  const entries = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)].map(m => ({ loc: m[1], lastmod: m[2] }));
  const locs = new Set(entries.map(e => new URL(e.loc).pathname));
  for (const e of entries) {
    const p = new URL(e.loc).pathname, file = localFile(p);
    if (!file) { fail('sitemap', `URL sin página en el repo: ${p}`); continue; }
    let last = null;
    try { last = execFileSync('git', ['-C', ROOT, 'log', '-1', '--format=%cs', '--', path.relative(ROOT, file)], { encoding: 'utf8' }).trim() || null; } catch (err) { }
    if (last && e.lastmod && e.lastmod < last) warn('sitemap', `${p}: lastmod ${e.lastmod} es anterior al último cambio de la página (${last})`);
  }
  for (const pg of PAGES) if (!pg.redirect && !locs.has(pg.path)) warn('sitemap', `${pg.path} no está en sitemap.xml`);
}

/* ---------- principal ---------- */
(async () => {
  const srv = await startServer();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch(process.env.SMOKE_CHROME ? { executablePath: process.env.SMOKE_CHROME, args: ['--no-sandbox'] } : {});
  const t0 = Date.now();
  if (!AXE) (process.env.CI ? fail : warn)('accesibilidad', 'axe-core no está instalado: se omitió el control de accesibilidad (npm install axe-core junto a Playwright)');
  for (const pg of PAGES) {
    const t = Date.now();
    try {
      await checkDesktop(browser, base, pg);
      await checkDark(browser, base, pg);
      await checkMobile(browser, base, pg);
      await checkOffline(browser, base, pg);
    } catch (e) { fail(pg.id, `la prueba no pudo completarse: ${String(e.message).split('\n')[0].slice(0, 200)}`); }
    const f = results.filter(r => r.page === pg.id && r.level === 'fail').length;
    console.log(`${f ? '✗' : '✓'} ${pg.id.padEnd(12)} ${pg.path.padEnd(32)} ${((Date.now() - t) / 1000).toFixed(1)}s${f ? `  (${f} fallo${f > 1 ? 's' : ''})` : ''}`);
  }
  if (!ONLY) checkSitemap();
  await browser.close(); srv.close();

  const fails = results.filter(r => r.level === 'fail'), warns = results.filter(r => r.level === 'warn');
  console.log(`\n${fails.length} fallo(s), ${warns.length} aviso(s) · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  for (const r of fails) console.log(`::error title=${r.page}::${r.msg}`);
  for (const r of warns) console.log(`::warning title=${r.page}::${r.msg}`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const md = [`## Pruebas de humo · ${fails.length ? '❌ ' + fails.length + ' fallo(s)' : '✅ sin fallos'}${warns.length ? ` · ${warns.length} aviso(s)` : ''}`, '',
      '| Página | Nivel | Detalle |', '|---|---|---|',
      ...[...fails, ...warns].map(r => `| ${r.page} | ${r.level === 'fail' ? 'fallo' : 'aviso'} | ${r.msg.replace(/\|/g, '\\|')} |`)];
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md.join('\n') + '\n');
  }
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
