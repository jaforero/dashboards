(function () {
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const slug = s => fold(s).replace(/<[^>]+>/g, '').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-');
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ======================= i18n (interface only; note content is never machine-translated) =======================
const T = window.KB_T;
let UI = window.__lang0 === 'en' ? 'en' : 'es';
const track = (n, p) => { try { if (typeof window.track === 'function') window.track(n, p || {}); } catch (e) {} };
const t = (k, ...a) => { const v = T[UI][k]; return typeof v === 'function' ? v(...a) : v; };

// ======================= state =======================
const TYPES = ['markdown', 'wikilink', 'prerequisite', 'related', 'translation'];
const S = {
  source: 'demo', meta: null, vault: null, notes: new Map(), assets: new Map(), objectUrls: [],
  groups: [], groupIdx: new Map(), hubs: new Set(), search: new Map(),
  cur: null, hist: [], hpos: -1,
  f: { types: new Set(['markdown', 'wikilink', 'prerequisite', 'related']), hubEdges: true, statuses: null, tag: '', lang: 'es' },
  q: '', matches: null, mode: 'global', wide: false, linkTab: 'in', filesMode: false
};

// ======================= vault loading =======================
function loadVault(files, assets, meta, opts = {}) {
  if (S.objectUrls !== meta.objectUrls) S.objectUrls.forEach(u => URL.revokeObjectURL(u));
  S.objectUrls = meta.objectUrls || [];
  const all = files.concat([...assets.keys()].map(p => ({ path: p, text: '' })));
  const v = VaultParser.parseVault(all, s => jsyaml.load(s, { schema: jsyaml.JSON_SCHEMA }));
  S.vault = v; S.meta = meta; S.assets = assets; S.source = meta.source;
  S.notes = new Map(v.notes.map(n => [n.id, n]));
  // repeated titles (three "Homework", several "README") get their folder appended so they can be told apart
  const byTitle = new Map(); v.notes.forEach(n => byTitle.set(n.title, (byTitle.get(n.title) || []).concat(n)));
  for (const group of byTitle.values()) {
    if (group.length < 2) continue;
    for (const depth of [1, 2, 3]) {
      const tag = n => n.id.split('/').slice(0, -1).slice(-depth).join('/') || t('root');
      if (new Set(group.map(tag)).size === group.length || depth === 3) { group.forEach(n => { n.baseTitle = n.title; n.title = `${n.title} · ${tag(n)}`; }); break; }
    }
  }
  // groups (parts) in stable order; colour slot by order
  S.groups = [...new Set(v.notes.map(n => n.part))].sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
  S.groupIdx = new Map(S.groups.map((g, i) => [g, i]));
  // hubs
  S.hubs = new Set((meta.hubs || []).filter(h => S.notes.has(h)));
  if (!meta.hubs) for (const n of v.notes) if (/^(index|readme|home|_index|inicio)\.md$/i.test(n.id)) S.hubs.add(n.id);
  // search text
  S.search = new Map(v.notes.map(n => [n.id, fold(n.title + ' ' + n.tags.join(' ') + ' ' + n.body)]));
  // filters reset
  const langs = [...new Set(v.notes.map(n => n.language).filter(Boolean))];
  S.f.lang = langs.length > 1 ? (langs.includes(meta.defaultLang || 'es') ? (meta.defaultLang || 'es') : 'all') : 'all';
  S.f.statuses = new Set(v.notes.map(n => n.status));
  S.f.tag = '';
  if (!v.links.some(l => l.type === 'wikilink')) S.f.types.add('wikilink');
  S.hist = []; S.hpos = -1; S.q = ''; $('#q').value = ''; S.matches = null;
  posCache.clear();
  buildFilters(); renderList(); renderQuality(); renderMeta();
  // outside the demo, open on the repository's own entry point (its root README/index) when there is one
  const hubStart = meta.source !== 'demo' ? [...S.hubs].sort()[0] : null;
  const start = (opts.startNote && S.notes.has(opts.startNote)) ? opts.startNote : (meta.start && S.notes.has(meta.start)) ? meta.start : hubStart ? hubStart
    : [...v.notes].filter(visibleNote).sort((a, b) => b.backlinkNotes - a.backlinkNotes)[0]?.id || v.notes[0]?.id;
  rebuildGraph();
  if (start) openNote(start, { push: true, noScroll: true });
}

function groupColor(g) { const i = S.groupIdx.get(g); return `var(--g${i == null ? 8 : (i < 10 ? i : 8)})`; }
function groupLabel(g) {
  const lab = S.meta.groupLabels && S.meta.groupLabels[g];
  if (lab) return lab[UI] || lab.es;
  if (g === '(root)') return t('root');
  return g.replace(/^part-0?(\d+)-/, (m, d) => (UI === 'es' ? 'Parte ' : 'Part ') + d + ' · ').replace(/[-_]+/g, ' ').replace(/^\w/, c => c.toUpperCase());
}
function statusLabel(s) { return s ? (T[UI].status[s] || s) : t('noStatus'); }
function langLabel(l) { return T[UI].lang[l] || l.toUpperCase(); }
function chapterTag(n) { const c = n.chapter; return /^\d{1,3}$/.test(c) ? c : ''; }
function visibleNote(n) { return S.f.lang === 'all' || !n.language || n.language === S.f.lang; }
function noteActive(n) { return S.f.statuses.has(n.status) && (!S.f.tag || n.tags.includes(S.f.tag)); }

// visible graph model: notes after language filter; undirected edges of the enabled link types
function model() {
  const nodes = S.vault.notes.filter(visibleNote);
  const ids = new Set(nodes.map(n => n.id));
  const pairs = new Map();
  for (const l of S.vault.links) {
    if (!l.target || !S.f.types.has(l.type) || !ids.has(l.source) || !ids.has(l.target)) continue;
    const hubl = S.hubs.has(l.source) || S.hubs.has(l.target);
    if (hubl && !S.f.hubEdges) continue;
    const [a, b] = l.source < l.target ? [l.source, l.target] : [l.target, l.source];
    const k = a + '\u0000' + b;
    if (!pairs.has(k)) pairs.set(k, { source: a, target: b, types: new Set(), hubl });
    pairs.get(k).types.add(l.type);
  }
  // backlinks per note (distinct visible sources, enabled types, hub edges included)
  const bl = new Map();
  for (const l of S.vault.links) {
    if (!l.target || !S.f.types.has(l.type) || !ids.has(l.source) || !ids.has(l.target)) continue;
    if (!bl.has(l.target)) bl.set(l.target, new Set());
    bl.get(l.target).add(l.source);
  }
  const edges = [...pairs.values()];
  const adj = new Map(nodes.map(n => [n.id, new Set()]));
  for (const e of edges) { adj.get(e.source).add(e.target); adj.get(e.target).add(e.source); }
  return { nodes, edges, adj, bl: id => (bl.get(id) || new Set()).size };
}

// ======================= header / list =======================
function renderMeta() {
  const v = S.vault, m = S.meta;
  const brokenN = v.stats.linksBroken;
  const pairs = new Set(v.links.filter(l => l.target).map(l => l.source < l.target ? l.source + '\u0000' + l.target : l.target + '\u0000' + l.source)).size;
  const stats = `${esc(t('notes', v.stats.notes))} · ${esc(t('conns', pairs))}${brokenN ? ' · ' + esc(t('broken', brokenN)) : ''}`;
  let h = '', sum = `<span class="stat">${stats}</span>`;
  if (S.source === 'demo') {
    const d = m.builtAt ? new Date(m.builtAt).toLocaleDateString(UI === 'en' ? 'en-US' : 'es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    h = `<span class="src-pill demo">${esc(t('demoPill'))}</span><b>${esc(m.name)}</b>`;
    if (m.commit) sum += `<a class="snap" href="https://github.com/${esc(m.repo)}/tree/${esc(m.commit)}" target="_blank" rel="noopener">${esc(t('snapshot', m.commit.slice(0, 7), d))} ↗</a>`;
  } else if (S.source === 'github') {
    h = `<span class="src-pill">GitHub</span><a class="repo" href="https://github.com/${esc(m.repo)}" target="_blank" rel="noopener"><b>${esc(m.repo)}</b></a><span class="stat">@${esc(m.ref)}${m.root ? ' · ' + esc(m.root) + '/' : ''}</span>`;
    if (m.rootWhy === 'mkdocs') sum += `<span class="snap">${esc(t('mkdocsRoot'))}</span>`;
  } else {
    h = `<span class="src-pill">${esc(t('folderPill'))}</span><b>${esc(m.name)}</b>`;
  }
  $('#vault-summary').innerHTML = sum;
  $('#vault-meta').innerHTML = h;
  $('#back-demo').hidden = S.source === 'demo';
  $('#share').hidden = S.source === 'folder';
}

function renderList() {
  const box = $('#list');
  const notes = S.vault.notes.filter(visibleNote);
  const m = model();
  const hit = n => !S.matches || S.matches.has(n.id);
  const shown = notes.filter(hit);
  $('#list-count').textContent = S.matches ? `${shown.length}/${notes.length}` : String(notes.length);
  const item = n => {
    const ch = chapterTag(n);
    const title = S.q ? markText(n.title, S.q) : esc(n.title);
    return `<button type="button" class="item${n.id === S.cur ? ' cur' : ''}${noteActive(n) ? '' : ' miss'}" data-note="${esc(n.id)}" title="${esc(n.id)}">` +
      `<span class="ch">${S.hubs.has(n.id) ? `<span class="dia" style="--c:${groupColor(n.part)}"></span>` : esc(ch)}</span><span class="t">${title}</span><span class="bl">${m.bl(n.id) || ''}</span></button>`;
  };
  const sortN = (a, b) => (parseInt(a.chapter, 10) || 999) - (parseInt(b.chapter, 10) || 999) || a.title.localeCompare(b.title, 'es');
  let html = '';
  const hubs = shown.filter(n => S.hubs.has(n.id));
  if (hubs.length) html += `<div class="grp hubs-sec"><div class="grp-h">${esc(t('hubs'))}<span class="n">${hubs.length}</span></div>${hubs.map(item).join('')}</div>`;
  for (const g of S.groups) {
    const ns = shown.filter(n => n.part === g && !S.hubs.has(n.id)).sort(sortN);
    if (!ns.length) continue;
    html += `<div class="grp"><div class="grp-h"><span class="dot" style="--c:${groupColor(g)}"></span>${esc(groupLabel(g))}<span class="n">${ns.length}</span></div>${ns.map(item).join('')}</div>`;
  }
  box.innerHTML = html || `<div class="list-empty">${esc(t('empty'))}</div>`;
}
function markText(text, q) {
  const f = fold(text), fq = fold(q).trim(); const i = fq ? f.indexOf(fq) : -1;
  if (i < 0) return esc(text);
  return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + fq.length)) + '</mark>' + esc(text.slice(i + fq.length));
}

// ======================= filters / legend =======================
function buildFilters() {
  const v = S.vault;
  const tc = {}; v.links.filter(l => l.target).forEach(l => tc[l.type] = (tc[l.type] || 0) + 1);
  const types = TYPES.filter(k => tc[k]);
  let h = types.map(k => `<button type="button" class="tog" data-type="${k}" aria-pressed="${S.f.types.has(k)}" title="${esc(T[UI].typeLong[k])}">${esc(T[UI].type[k])} <span class="n">${tc[k]}</span></button>`).join('');
  if (S.hubs.size) h += `<button type="button" class="tog" data-hubedges aria-pressed="${S.f.hubEdges}">${esc(t('hubEdges'))}</button>`;
  $('#f-types').innerHTML = h;
  const sc = {}; v.notes.forEach(n => sc[n.status] = (sc[n.status] || 0) + 1);
  $('#f-status').innerHTML = Object.keys(sc).sort().map(s => `<button type="button" class="tog" data-status="${esc(s)}" aria-pressed="${S.f.statuses.has(s)}">${esc(statusLabel(s))} <span class="n">${sc[s]}</span></button>`).join('');
  const tg = {}; v.notes.forEach(n => n.tags.forEach(x => tg[x] = (tg[x] || 0) + 1));
  const tags = Object.keys(tg).sort((a, b) => tg[b] - tg[a] || a.localeCompare(b));
  $('#f-tag').innerHTML = `<option value="">${esc(t('allTags'))} (${tags.length})</option>` + tags.map(x => `<option value="${esc(x)}"${x === S.f.tag ? ' selected' : ''}>${esc(x)} · ${tg[x]}</option>`).join('');
  $('#f-tag').disabled = !tags.length;
  const lc = {}; v.notes.forEach(n => n.language && (lc[n.language] = (lc[n.language] || 0) + 1));
  const langs = Object.keys(lc);
  $('#f-lang-row').hidden = langs.length < 2;
  $('#f-lang').innerHTML = langs.map(l => `<option value="${l}"${S.f.lang === l ? ' selected' : ''}>${esc(langLabel(l))} · ${lc[l]}</option>`).join('') + `<option value="all"${S.f.lang === 'all' ? ' selected' : ''}>${esc(t('allLangs'))}</option>`;
}
function renderLegend(m) {
  const present = new Set(m.nodes.map(n => n.part));
  let h = S.groups.filter(g => present.has(g)).map(g => `<button type="button" data-group="${esc(g)}" class="${focusGroup === g ? 'on' : ''}"><span class="dot" style="--c:${groupColor(g)}"></span>${esc(groupLabel(g))}</button>`).join('');
  h += `<span class="key"><span class="line"></span>${esc(t('legendBody'))}</span><span class="key"><span class="line fm"></span>${esc(t('legendFm'))}</span>`;
  if (S.f.types.has('translation')) h += `<span class="key"><span class="line tr"></span>${esc(t('legendTr'))}</span>`;
  if (S.hubs.size) h += `<span class="key"><span class="dia" style="--c:var(--panel)"></span>${esc(t('hubs'))}</span>`;
  $('#legend').innerHTML = h;
}

// ======================= graph =======================
const svg = d3.select('#graph');
const gRoot = svg.append('g');
const gLinks = gRoot.append('g'), gNodes = gRoot.append('g'), gLabels = gRoot.append('g');
const posCache = new Map();
let sim = null, zoomK = 1, hoverId = null, focusGroup = null, G = { nodes: [], edges: [], adj: new Map(), m: null };
const zoom = d3.zoom().scaleExtent([0.15, 8]).on('zoom', e => { gRoot.attr('transform', e.transform); zoomK = e.transform.k; styleLabels(); });
svg.call(zoom).on('dblclick.zoom', null);

function size() { const r = $('#graph-wrap').getBoundingClientRect(); return { w: Math.max(200, r.width), h: Math.max(200, r.height) }; }

function rebuildGraph() {
  const m = model(); G.m = m;
  renderLegend(m);
  if (sim) sim.stop();
  let nodes, edges;
  if (S.mode === 'local' && S.cur && m.adj.has(S.cur)) {
    // BFS up to 2 hops; hubs appear but are not expanded (unless the open note is the hub: then 1 hop)
    const depth = new Map([[S.cur, 0]]); const maxD = S.hubs.has(S.cur) ? 1 : 2; let frontier = [S.cur];
    for (let d = 1; d <= maxD; d++) {
      const next = [];
      for (const id of frontier) { if (d > 1 && S.hubs.has(id)) continue; for (const nb of m.adj.get(id)) if (!depth.has(nb)) { depth.set(nb, d); next.push(nb); } }
      frontier = next;
    }
    nodes = m.nodes.filter(n => depth.has(n.id)).map(n => ({ id: n.id, note: n, depth: depth.get(n.id), hub: S.hubs.has(n.id) }));
    edges = m.edges.filter(e => depth.has(e.source) && depth.has(e.target)).map(e => ({ ...e }));
  } else {
    nodes = m.nodes.map(n => ({ id: n.id, note: n, hub: S.hubs.has(n.id) }));
    edges = m.edges.map(e => ({ ...e }));
  }
  nodes.forEach(n => { n.bl = m.bl(n.id); n.r = (n.hub ? 7 : 4) + 2.3 * Math.sqrt(n.bl); });
  G.nodes = nodes; G.edges = edges; G.adj = m.adj;

  const R = 34 * Math.sqrt(Math.max(nodes.length, 4)) + 40;
  const local = S.mode === 'local';
  if (local) {
    nodes.forEach(n => { if (n.id === S.cur) { n.fx = 0; n.fy = 0; } else { const p = posCache.get('L' + n.id); if (p) { n.x = p.x; n.y = p.y; } } });
  } else {
    nodes.filter(n => n.hub).forEach(n => { n.fx = 0; n.fy = -R * 2; }); // parked until the cluster settles
    nodes.forEach(n => { const p = posCache.get(n.id); if (p && !n.hub) { n.x = p.x; n.y = p.y; } });
  }
  const byId = new Map(nodes.map(n => [n.id, n]));
  const simEdges = edges.filter(e => local || !e.hubl).map(e => ({ source: byId.get(e.source), target: byId.get(e.target), fm: !e.types.has('markdown') && !e.types.has('wikilink') }));
  sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(simEdges).distance(e => local ? 70 : (e.fm ? 62 : 48)).strength(local ? 0.15 : 0.25))
    .force('charge', d3.forceManyBody().strength(local ? -220 : -190).distanceMax(local ? 600 : 520))
    .force('collide', d3.forceCollide(d => d.r + (local ? 14 : 4)))
    .stop();
  if (local) sim.force('radial', d3.forceRadial(d => d.depth * 110, 0, 0).strength(0.9));
  else sim.force('x', d3.forceX(0).strength(0.05)).force('y', d3.forceY(0).strength(0.06));

  // draw
  const ls = gLinks.selectAll('line').data(edges, e => e.source + '|' + e.target);
  ls.exit().remove();
  const lsAll = ls.enter().append('line').merge(ls)
    .attr('class', e => 'g-link' + (!e.types.has('markdown') && !e.types.has('wikilink') ? (e.types.has('translation') && e.types.size === 1 ? ' tr' : ' fm') : '') + (e.hubl && !local ? ' hubl' : ''));
  const ns = gNodes.selectAll('g.g-node').data(nodes, d => d.id);
  ns.exit().remove();
  const nEnter = ns.enter().append('g').attr('class', 'g-node').attr('tabindex', -1);
  nEnter.append('circle').attr('class', 'ring');
  nEnter.append('path').attr('class', 'body');
  const nAll = nEnter.merge(ns);
  nAll.classed('hub', d => d.hub).classed('far', d => local && d.depth === 2);
  nAll.select('.ring').attr('r', d => d.r + 4);
  nAll.select('.body').attr('d', d => d.hub ? diamond(d.r + 1.5) : circle(d.r)).style('fill', d => groupColor(d.note.part));
  nAll.on('click', (e, d) => { e.stopPropagation(); openNote(d.id, { push: true, fromGraph: true }); })
    .on('mouseenter', (e, d) => { hoverId = d.id; showTip(e, d); styleGraph(); })
    .on('mousemove', (e, d) => showTip(e, d))
    .on('mouseleave', () => { hoverId = null; $('#tip').hidden = true; styleGraph(); })
    .call(d3.drag()
      .on('start', (e, d) => { if (!e.active && !reduced) sim.alphaTarget(0.2).restart(); d._fx = d.fx; d._fy = d.fy; d.fx = d.x; d.fy = d.y; })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; if (reduced) tick(); })
      .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); if (!d.hub && !(local && d.id === S.cur)) { d.fx = d._fx ?? null; d.fy = d._fy ?? null; } }));
  const lb = gLabels.selectAll('text').data(nodes, d => d.id);
  lb.exit().remove();
  lb.enter().append('text').attr('class', 'g-label').attr('text-anchor', 'middle').merge(lb)
    .classed('hubt', d => d.hub).text(d => short(d.note.title));

  G.sel = { links: lsAll, nodes: nAll, labels: gLabels.selectAll('text') };
  // labels shown by default: hubs + top backlinked
  const sorted = [...nodes].sort((a, b) => b.bl - a.bl);
  G.topIds = new Set(sorted.slice(0, local ? nodes.length : Math.min(10, Math.ceil(nodes.length * 0.18))).map(n => n.id));

  const warm = local ? 400 : (posCache.size ? 120 : 280);
  for (let i = 0; i < warm; i++) sim.tick();
  if (!local) placeHubs(nodes);
  tick(); styleLabels(); fit(false);
  sim.on('tick', tick).on('end', styleLabels);
  if (!reduced) sim.alpha(local ? 0.04 : 0.12).restart();
  styleGraph();
  $('#g-count').textContent = t('showing', nodes.length, edges.length);
  $('#g-hint').textContent = local ? t('hintLocal', short(S.notes.get(S.cur).title, 40)) : t('hintGlobal');
}
// Hubs sit just above the settled cluster, spread across its width, outside the force layout
function placeHubs(nodes) {
  const hubs = nodes.filter(n => n.hub).sort((a, b) => a.id.localeCompare(b.id)); if (!hubs.length) return;
  const rest = nodes.filter(n => !n.hub); if (!rest.length) { hubs.forEach((n, i) => { n.fx = n.x = i * 120; n.fy = n.y = 0; }); return; }
  const xs = rest.map(n => n.x), ys = rest.map(n => n.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys);
  const inset = (x1 - x0) * 0.12;
  hubs.forEach((n, i) => { n.fx = n.x = hubs.length === 1 ? (x0 + x1) / 2 : (x0 + inset) + i * ((x1 - x0 - 2 * inset) / (hubs.length - 1)); n.fy = n.y = y0 - 70; });
}
function circle(r) { return `M${-r},0a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0`; }
function diamond(r) { const s = r * 1.25; return `M0,${-s}L${s},0L0,${s}L${-s},0Z`; }
function short(s, n = 30) { s = String(s); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; }
function tick() {
  const key = S.mode === 'local' ? 'L' : '';
  G.sel.links.attr('x1', e => node(e.source).x).attr('y1', e => node(e.source).y).attr('x2', e => node(e.target).x).attr('y2', e => node(e.target).y);
  G.sel.nodes.attr('transform', d => { posCache.set(key + d.id, { x: d.x, y: d.y }); return `translate(${d.x},${d.y})`; });
  G.sel.labels.attr('x', d => d.x).attr('y', d => d.y + d.r + 11.5 / Math.sqrt(zoomK) + 2);
  if (++labelTick % 12 === 0) styleLabels();
}
const nodeIdx = () => G._idx && G._idx.n === G.nodes ? G._idx.m : (G._idx = { n: G.nodes, m: new Map(G.nodes.map(n => [n.id, n])) }).m;
function node(x) { return typeof x === 'object' ? x : nodeIdx().get(x); }
function fit(animate) {
  if (!G.nodes.length) return;
  const { w, h } = size();
  const lw = n => (G.shown && G.shown.has(n.id) ? Math.min(short(n.note.title).length, 30) * 3.6 : 0) + n.r;
  let x0 = Math.min(...G.nodes.map(n => n.x - lw(n))) - 12, x1 = Math.max(...G.nodes.map(n => n.x + lw(n))) + 12;
  let y0 = Math.min(...G.nodes.map(n => n.y - n.r)) - 16, y1 = Math.max(...G.nodes.map(n => n.y + n.r)) + 30;
  if (S.mode === 'local') { const ex = Math.max(-x0, x1), ey = Math.max(-y0, y1); x0 = -ex; x1 = ex; y0 = -ey; y1 = ey; } // open note at the centre
  const k = Math.min(2.2, 0.94 * Math.min(w / (x1 - x0), h / (y1 - y0)));
  const tr = d3.zoomIdentity.translate(w / 2 - k * (x0 + x1) / 2, h / 2 - k * (y0 + y1) / 2).scale(k);
  (animate && !reduced ? svg.transition().duration(450) : svg).call(zoom.transform, tr);
}
function styleGraph() {
  if (!G.sel) return;
  const nb = hoverId ? G.adj.get(hoverId) || new Set() : null;
  const local = S.mode === 'local';
  G.sel.nodes
    .classed('sel', d => d.id === S.cur)
    .classed('match', d => !!S.matches && S.matches.has(d.id))
    .classed('dim', d => !noteActive(d.note) || (S.matches && !S.matches.has(d.id)) || (focusGroup && d.note.part !== focusGroup) || (nb && d.id !== hoverId && !nb.has(d.id)));
  G.sel.links
    .classed('hot', e => (hoverId && (e.source.id === hoverId || e.target.id === hoverId || e.source === hoverId || e.target === hoverId)) || (!hoverId && !local && S.cur && (node(e.source).id === S.cur || node(e.target).id === S.cur)))
    .classed('dim', e => { const a = node(e.source), b = node(e.target); return !noteActive(a.note) || !noteActive(b.note) || (S.matches && !(S.matches.has(a.id) || S.matches.has(b.id))) || (focusGroup && a.note.part !== focusGroup && b.note.part !== focusGroup) || (hoverId && a.id !== hoverId && b.id !== hoverId); });
  styleLabels();
}
// Labels: candidates by priority, then greedy placement so no two labels overlap (graph units)
function placeLabels() {
  const nb = hoverId ? G.adj.get(hoverId) || new Set() : null;
  const fs = 11.5 / Math.sqrt(zoomK);
  const prio = d => d.id === S.cur ? 0 : d.id === hoverId ? 1 : d.hub ? 2 : (nb && nb.has(d.id)) ? 3 : (S.matches && S.matches.has(d.id)) ? 4 : (S.mode === 'local' && d.depth === 1) ? 5 : G.topIds.has(d.id) && !S.matches && !hoverId ? 6 : (S.mode === 'local' || zoomK > 1.6) && !S.matches ? 7 : 99;
  const cands = G.nodes.filter(d => prio(d) < 99 && noteActive(d.note) && !(focusGroup && d.note.part !== focusGroup)).sort((a, b) => prio(a) - prio(b) || b.bl - a.bl).slice(0, 80);
  const boxes = [], shown = new Set();
  for (const d of cands) {
    const f = d.hub ? fs * 1.12 : fs, w = Math.min(short(d.note.title).length, 30) * f * 0.56, h = f * 1.25;
    const y = d.y + d.r + f + 2;
    const b = [d.x - w / 2 - 2, y - h, d.x + w / 2 + 2, y + 3];
    if (prio(d) > 2 && boxes.some(o => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1])) continue;
    boxes.push(b); shown.add(d.id);
  }
  G.shown = shown;
}
let labelTick = 0;
function styleLabels() {
  if (!G.sel) return;
  const fs = 11.5 / Math.sqrt(zoomK);
  placeLabels();
  G.sel.labels.style('font-size', d => (d.hub ? fs * 1.12 : fs) + 'px')
    .classed('on', d => G.shown.has(d.id))
    .classed('dim', d => !noteActive(d.note) || (S.matches && !S.matches.has(d.id)) || (focusGroup && d.note.part !== focusGroup));
  G.sel.labels.attr('y', d => d.y + d.r + fs + 2);
}
function showTip(e, d) {
  const tip = $('#tip'); const wrap = $('#graph-wrap').getBoundingClientRect();
  tip.innerHTML = `<b>${esc(d.note.title)}</b><span>${esc(S.hubs.has(d.id) ? t('hub') + ' · ' : '')}${esc(groupLabel(d.note.part))} · ${esc(t('backlinkCount', d.bl))}</span>`;
  tip.hidden = false;
  const x = e.clientX - wrap.left + 14, y = e.clientY - wrap.top + 14;
  tip.style.left = Math.min(x, wrap.width - tip.offsetWidth - 8) + 'px';
  tip.style.top = Math.min(y, wrap.height - tip.offsetHeight - 8) + 'px';
}
new ResizeObserver(() => { if (G.nodes.length) fit(false); }).observe($('#graph-wrap'));

// ======================= markdown renderer =======================
let CUR_SRC = null;
const mdr = new marked.Marked({ gfm: true });
mdr.use({
  extensions: [
    { name: 'admonition', level: 'block',
      start(src) { const m = src.match(/(^|\n)(?:!!!|\?\?\?\+?)[ \t]/); return m ? m.index + m[1].length : undefined; },
      tokenizer(src) {
        const m = src.match(/^(!!!|\?\?\?\+?)[ \t]+([\w-]+)(?:[ \t]+"([^"]*)")?[^\n]*(?:\n|$)((?:(?: {4}|\t)[^\n]*(?:\n|$)|[ \t]*\n(?= {4}|\t))*)/);
        if (!m) return;
        const tok = { type: 'admonition', raw: m[0], kind: m[2].toLowerCase(), title: m[3] != null ? m[3] : m[2].replace(/^\w/, c => c.toUpperCase()), tokens: [] };
        this.lexer.blockTokens(m[4].replace(/^(?: {4}|\t)/gm, ''), tok.tokens);
        return tok;
      },
      renderer(tk) { return `<aside class="adm ${esc(tk.kind)}">${tk.title ? `<p class="adm-t">${esc(tk.title)}</p>` : ''}${this.parser.parse(tk.tokens)}</aside>`; } },
    { name: 'mathBlock', level: 'block',
      start(src) { const m = src.match(/(^|\n) {0,3}(?:\$\$|\\\[)/); return m ? m.index + m[1].length : undefined; },
      tokenizer(src) {
        const m = src.match(/^ {0,3}\$\$([\s\S]+?)\$\$[ \t]*(?:\n|$)/) || src.match(/^ {0,3}\\\[([\s\S]+?)\\\][ \t]*(?:\n|$)/);
        if (m) return { type: 'mathBlock', raw: m[0], text: m[1].trim() };
      },
      renderer(tk) { return `<div class="kb-math mblock">\\[${esc(tk.text)}\\]</div>`; } },
    { name: 'mathInline', level: 'inline',
      start(src) { const i = src.search(/\$|\\\(|\\\[/); return i < 0 ? undefined : i; },
      tokenizer(src) {
        let m;
        if ((m = src.match(/^\$\$([\s\S]+?)\$\$/))) return { type: 'mathInline', raw: m[0], text: m[1], display: true };
        if ((m = src.match(/^\\\[([\s\S]+?)\\\]/))) return { type: 'mathInline', raw: m[0], text: m[1], display: true };
        if ((m = src.match(/^\\\(([\s\S]+?)\\\)/))) return { type: 'mathInline', raw: m[0], text: m[1], display: false };
        if ((m = src.match(/^\$(?=[^\s$])((?:\\\$|[^$\n])+?)(?<=[^\s\\])\$(?!\d)/))) return { type: 'mathInline', raw: m[0], text: m[1], display: false };
      },
      renderer(tk) { return tk.display ? `<span class="kb-math mdisp">\\[${esc(tk.text)}\\]</span>` : `<span class="kb-math">\\(${esc(tk.text)}\\)</span>`; } },
    { name: 'wikilink', level: 'inline',
      start(src) { const i = src.indexOf('[['); if (i < 0) return undefined; return i > 0 && src[i - 1] === '!' ? i - 1 : i; },
      tokenizer(src) {
        const m = src.match(/^(!?)\[\[([^\[\]|#\n]*)(#[^\[\]|\n]*)?(?:\|([^\[\]\n]*))?\]\]/);
        if (m) return { type: 'wikilink', raw: m[0], embed: !!m[1], target: m[2].trim(), heading: m[3] ? m[3].slice(1) : '', alias: m[4] };
      },
      renderer(tk) {
        const isFile = /\.[a-z0-9]{1,6}$/i.test(tk.target) && !/\.md$/i.test(tk.target);
        if (tk.embed && isFile) return imageHtml(tk.target, tk.alias || '');
        if (!tk.target) return `<a class="int" data-anchor="${esc(slug(tk.heading))}">${esc(tk.alias || tk.heading)}</a>`;
        const r = S.vault.resolve(CUR_SRC, tk.target, 'wikilink');
        const label = tk.alias || (tk.target.split('/').pop() + (tk.heading ? ' › ' + tk.heading : ''));
        if (!r.to) return `<a class="int broken" title="${esc(t('brokenTitle', tk.raw))}">${esc(label)}</a>`;
        const n = S.notes.get(r.to);
        if (tk.embed) return `<p><a class="int" data-note="${esc(r.to)}">↳ ${esc(t('embedded'))}: ${esc(n.title)}</a></p>`;
        return `<a class="int" data-note="${esc(r.to)}" data-anchor="${esc(slug(tk.heading))}">${esc(label)}</a>`;
      } }
  ],
  renderer: {
    heading(text, level, raw) { return `<h${level} id="${esc(slug(raw))}">${text}</h${level}>\n`; },
    link(href, title, text) {
      if (!href) return text;
      let raw = href; try { raw = decodeURI(href); } catch (e) {}
      if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('//')) return `<a class="ext" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      if (raw.startsWith('#')) return `<a class="int" data-anchor="${esc(slug(raw.slice(1)))}">${text}</a>`;
      const path = raw.split(/[?#]/)[0], anchor = raw.includes('#') ? raw.slice(raw.indexOf('#') + 1) : '';
      const r = S.vault.resolve(CUR_SRC, path, 'markdown');
      if (r.status === 'asset') {
        const a = S.vault.resolveAsset(CUR_SRC, path); const gh = S.meta.links && S.meta.links.github;
        if (a && gh) return `<a class="ext" href="${esc(gh.base + encPath(a))}" target="_blank" rel="noopener">${text}</a>`;
        const u = a && S.assets.has(a) && typeof S.assets.get(a) === 'string' ? S.assets.get(a) : null;
        return u ? `<a class="ext" href="${esc(u)}" target="_blank" rel="noopener">${text}</a>` : `<span title="${esc(path)}">${text}</span>`;
      }
      if (!r.to) return `<a class="int broken" title="${esc(t('brokenTitle', raw))}">${text}</a>`;
      if (r.to === CUR_SRC) return `<a class="int" data-anchor="${esc(slug(anchor))}">${text}</a>`;
      return `<a class="int" data-note="${esc(r.to)}" data-anchor="${esc(slug(anchor))}" title="${esc(S.notes.get(r.to).title)}">${text}</a>`;
    },
    image(href, title, text) { let raw = href || ''; try { raw = decodeURI(raw); } catch (e) {} return imageHtml(raw, text); },
    code(code, info) {
      const lang = (info || '').trim().split(/\s+/)[0].toLowerCase();
      if (lang === 'mermaid') return `<div class="mermaid-box" data-mermaid="${esc(code)}"><pre><code>${esc(code)}</code></pre></div>`;
      return `<pre${lang ? ` data-lang="${esc(lang)}"` : ''}><code>${esc(code.replace(/\n$/, ''))}</code></pre>`;
    },
    table(header, body) { return `<div class="tbl"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`; }
  }
});
// An asset is a URL string, or a function returning a URL or a Promise of one (GitHub files are fetched on demand)
function assetUrl(p) { const a = S.assets.get(p); return typeof a === 'function' ? a() : a; }
function imageHtml(raw, alt) {
  if (/^(https?:|data:)/i.test(raw)) return `<figure class="img"><img src="${esc(raw)}" alt="${esc(alt)}" loading="lazy" referrerpolicy="no-referrer"></figure>`;
  const p = S.vault.resolveAsset(CUR_SRC, raw.split(/[?#]/)[0]);
  if (!p || !S.assets.has(p)) return `<span class="img-missing">${esc(t('missingImg', raw))}</span>`;
  return `<figure class="img"><img data-asset="${esc(p)}" alt="${esc(alt)}">${alt ? `<figcaption>${esc(alt)}</figcaption>` : ''}</figure>`;
}
function hydrateImages(root) {
  root.querySelectorAll('img[data-asset]').forEach(img => {
    const p = img.getAttribute('data-asset'); img.removeAttribute('data-asset');
    Promise.resolve(assetUrl(p)).then(u => { if (u) img.src = u; else throw 0; })
      .catch(() => img.closest('figure').outerHTML = `<span class="img-missing">${esc(t('missingImg', p))}</span>`);
  });
}
function preprocess(body) {
  return body
    .replace(/(\]\([^)\n]*\))\{[^}\n]*\}/g, '$1')                 // attr_list on links/buttons
    .replace(/^(#{1,6}\s.*?)\s*\{[#.][^}\n]*\}\s*$/gm, '$1')        // attr_list on headings
    .replace(/:(?:material|fontawesome|octicons|simple)-[a-z0-9-]+:/g, '') // icon shortcodes
    .replace(/<div([^>]*?)\smarkdown(?:="[^"]*")?([^>]*)>/g, '<div$1$2>');
}
function sanitize(root) {
  root.querySelectorAll('script, iframe, object, embed, link, meta, style, base, form').forEach(el => el.remove());
  root.querySelectorAll('*').forEach(el => {
    for (const a of [...el.attributes]) {
      if (/^on/i.test(a.name)) el.removeAttribute(a.name);
      else if ((a.name === 'href' || a.name === 'src') && /^\s*javascript:/i.test(a.value)) el.removeAttribute(a.name);
    }
  });
}

// ======================= note pane =======================
function openNote(id, o = {}) {
  const n = S.notes.get(id); if (!n) return;
  if (!visibleNote(n)) { S.f.lang = 'all'; buildFilters(); rebuildGraph(); renderList(); }
  if (o.push !== false && S.hist[S.hpos] !== id) { S.hist = S.hist.slice(0, S.hpos + 1); S.hist.push(id); S.hpos = S.hist.length - 1; }
  const changed = S.cur !== id; S.cur = id;
  renderNote(n, o.anchor);
  renderLinks();
  renderList();
  const li = document.querySelector(`#list .item[data-note="${CSS.escape(id)}"]`); if (li && !o.fromList) li.scrollIntoView({ block: 'nearest' });
  if (S.mode === 'local' && changed) rebuildGraph(); else styleGraph();
  if (S.mode === 'local') $('#g-hint').textContent = t('hintLocal', short(n.title, 40));
  $('#nav-back').disabled = S.hpos <= 0; $('#nav-fwd').disabled = S.hpos >= S.hist.length - 1;
  syncUrl();
  if ((o.fromList || o.fromGraph) && matchMedia('(max-width: 900px)').matches && !o.stay) setPane('center');
}

function renderNote(n, anchor, keepScroll) {
  const prevScroll = $('#note-scroll').scrollTop;
  CUR_SRC = n.id;
  const art = $('#note');
  const isHub = S.hubs.has(n.id);
  const L = S.meta.links || {};
  const siteUrl = L.site && L.site.urls && L.site.urls[n.id];
  $('#crumb').innerHTML = `<span class="dot" style="--c:${groupColor(n.part)}"></span><span>${esc(groupLabel(n.part))}</span><span class="path">${esc(n.id)}</span>` +
    `<span class="ext-links">${siteUrl != null ? `<a class="site-link" href="${esc(L.site.root + siteUrl)}" target="_blank" rel="noopener">${esc(L.site.label ? L.site.label[UI] || L.site.label.es : t('onSite'))} ↗</a>` : ''}` +
    `${L.github ? `<a class="site-link" href="${esc(L.github.base + encPath(n.id))}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}</span>`;
  const hb = $('#hub-toggle'); hb.setAttribute('aria-pressed', S.hubs.has(n.id)); hb.title = t(S.hubs.has(n.id) ? 'unHub' : 'makeHub'); hb.setAttribute('aria-label', hb.title);
  let head = '';
  // properties = frontmatter as written
  const fm = n.frontmatter || {};
  const keys = Object.keys(fm);
  const val = (k, v) => {
    const arr = Array.isArray(v) ? v : [v];
    if (k === 'prerequisites' || k === 'related_chapters') return arr.map(x => { const r = S.vault.resolve(n.id, String(x).split('#')[0], 'prerequisite'); return r.to ? `<button type="button" class="chip" data-note="${esc(r.to)}"><span class="dot" style="--c:${groupColor(S.notes.get(r.to).part)}"></span>${esc(short(S.notes.get(r.to).title, 42))}</button>` : `<span class="chip" style="color:var(--bad)" title="${esc(t('brokenTitle', x))}">${esc(x)}</span>`; }).join('');
    if (k === 'tags') return arr.map(x => `<button type="button" class="chip" data-tag="${esc(x)}">#${esc(x)}</button>`).join('');
    if (k === 'status') return `<span class="pill ${esc(n.status)}">${esc(String(v))}</span>`;
    if (Array.isArray(v)) return arr.map(x => `<span class="chip">${esc(typeof x === 'object' ? JSON.stringify(x) : x)}</span>`).join('');
    if (v && typeof v === 'object') return `<code>${esc(JSON.stringify(v))}</code>`;
    return null;
  };
  if (keys.length || isHub) {
    const rows = keys.map(k => { const h = val(k, fm[k]); return `<dt>${esc(k)}</dt>` + (h != null ? `<dd>${h}</dd>` : `<dd class="text">${esc(fm[k])}</dd>`); }).join('');
    head += `<details class="props"${matchMedia('(max-width: 900px)').matches ? '' : ' open'}><summary>${esc(t('props'))} <span class="stat">${keys.length}</span>${isHub ? ` <span class="pill hub">${esc(t('hub'))}</span>` : ''}</summary><dl>${rows}</dl></details>`;
  }
  if (n.translations && n.translations.length) {
    head += `<div class="lang-switch">${esc(t('readIn'))} ${n.translations.map(tid => { const tn = S.notes.get(tid); return `<button type="button" class="chip" data-note="${esc(tid)}" data-lang-jump="${esc(tn.language)}">${esc(langLabel(tn.language || '?'))}</button>`; }).join(' ')}</div>`;
  }
  let html;
  try { html = mdr.parse(preprocess(n.body)); } catch (e) { html = `<pre>${esc(n.body)}</pre>`; }
  if (!/^\s*<h1[\s>]/.test(html) && !/<h1[\s>]/.test(html.slice(0, 600))) html = `<h1>${esc(n.title)}</h1>` + html;
  art.innerHTML = head + html;
  sanitize(art);
  // put properties after the first h1, like a document header
  const h1 = art.querySelector('h1'), props = art.querySelector('.props');
  if (h1 && props && h1.parentNode === art) { art.prepend(h1); }
  const sc = $('#note-scroll');
  if (anchor) { const el = art.querySelector('#' + CSS.escape(anchor)); if (el) { el.scrollIntoView({ block: 'start' }); el.classList.add('flash'); } else sc.scrollTop = 0; }
  else sc.scrollTop = keepScroll ? prevScroll : 0;
  hydrateImages(art);
  typesetMath(art);
  drawMermaid(art);
}

let mjWarned = false;
function typesetMath(el, tries = 0) {
  if (!el.querySelector('.kb-math')) return;
  const MJ = window.MathJax;
  if (MJ && MJ.typesetPromise && MJ.startup && MJ.startup.promise) { MJ.startup.promise.then(() => { if (el.isConnected) MJ.typesetPromise([el]).catch(() => {}); }); return; }
  if (window.KB_MATHJAX_FAILED || tries > 60) { if (!mjWarned) { mjWarned = true; toast(t('mathFail'), 5000); } return; }
  setTimeout(() => { if (el.isConnected) typesetMath(el, tries + 1); }, 250);
}
let mermaidP = null;
function isDark() { const a = document.documentElement.getAttribute('data-theme'); return a ? a === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }
function drawMermaid(el) {
  const boxes = [...el.querySelectorAll('.mermaid-box[data-mermaid]')];
  if (!boxes.length) return;
  if (!mermaidP) mermaidP = new Promise((res, rej) => {
    const urls = (window.KB_LIBS && window.KB_LIBS.mermaid) || ['https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js'];
    const next = i => { if (i >= urls.length) return rej(); const sc = document.createElement('script'); sc.src = urls[i]; sc.onload = () => res(window.mermaid); sc.onerror = () => { sc.remove(); next(i + 1); }; document.head.appendChild(sc); };
    next(0);
  });
  mermaidP.then(async mm => {
    mm.initialize({ startOnLoad: false, securityLevel: 'strict', theme: isDark() ? 'dark' : 'neutral', fontFamily: "'Igra Sans', IgraSans, system-ui, sans-serif" });
    for (const [i, b] of boxes.entries()) {
      if (!b.isConnected) return;
      try { const { svg } = await mm.render('mmd-' + Date.now() + '-' + i, b.getAttribute('data-mermaid')); b.innerHTML = svg; }
      catch (e) { b.insertAdjacentHTML('afterbegin', `<div class="empty">${esc(t('mermaidFail'))}</div>`); }
      b.removeAttribute('data-mermaid');
      document.querySelectorAll('body > [id^="dmmd-"], body > div[id^="mmd-"]').forEach(x => x.remove());
    }
  }).catch(() => boxes.forEach(b => { b.insertAdjacentHTML('afterbegin', `<div class="empty">${esc(t('mermaidFail'))}</div>`); b.removeAttribute('data-mermaid'); }));
}

// ======================= backlinks / outgoing =======================
function renderLinks() {
  const id = S.cur; const box = $('#backlinks');
  const inL = S.vault.links.filter(l => l.target === id && l.source !== id);
  const outL = S.vault.links.filter(l => l.source === id && l.target);
  const brokenOut = S.vault.links.filter(l => l.source === id && !l.target);
  const nIn = new Set(inL.map(l => l.source)).size, nOut = new Set(outL.map(l => l.target)).size;
  $('#n-in').textContent = nIn; $('#n-out').textContent = nOut + (brokenOut.length ? ` +${brokenOut.length}` : '');
  $('#tab-in').setAttribute('aria-selected', S.linkTab === 'in'); $('#tab-out').setAttribute('aria-selected', S.linkTab === 'out');
  const list = S.linkTab === 'in' ? inL : outL;
  const keyOf = l => S.linkTab === 'in' ? l.source : l.target;
  const by = new Map();
  for (const l of list) { const k = keyOf(l); if (!by.has(k)) by.set(k, []); by.get(k).push(l); }
  const order = [...by.keys()].sort((a, b) => by.get(b).length - by.get(a).length || S.notes.get(a).title.localeCompare(S.notes.get(b).title, 'es'));
  let h = '';
  if (S.linkTab === 'in') h += `<div class="empty" style="padding-top:2px">${esc(t('backlinkCount', nIn))}</div>`;
  h += order.map(k => {
    const other = S.notes.get(k);
    const refs = by.get(k).map(l => {
      const fmT = l.type === 'prerequisite' || l.type === 'related';
      const ctx = l.context ? highlight(l.context, l.display) : `<span style="color:var(--muted)">${esc(t('fmField', l.section))}</span>`;
      const sec = l.context && l.section ? `<small>${esc(t('inSection', l.section))}</small>` : '';
      return `<div class="bk-ref"><span class="bk-type${fmT ? ' fm' : ''}" title="${esc(T[UI].typeLong[l.type])}">${esc(T[UI].type[l.type])}</span><div class="bk-ctx">${ctx}${sec}</div></div>`;
    }).join('');
    return `<div class="bk-note"><button type="button" class="bk-title" data-note="${esc(k)}">${S.hubs.has(k) ? `<span class="dia" style="--c:${groupColor(other.part)}"></span>` : `<span class="dot" style="--c:${groupColor(other.part)}"></span>`}${esc(other.title)}</button>${refs}</div>`;
  }).join('');
  if (S.linkTab === 'out' && brokenOut.length) h += brokenOut.map(l => `<div class="bk-note"><div class="q-item" style="border:0"><code>${esc(l.raw)}</code><span class="src">${esc(T[UI].typeLong[l.type])}</span></div></div>`).join('');
  if (!list.length && !(S.linkTab === 'out' && brokenOut.length)) h += `<div class="empty">${esc(t(S.linkTab === 'in' ? 'noIn' : 'noOut'))}</div>`;
  box.innerHTML = h;
}
function highlight(ctx, display) {
  if (!display) return esc(ctx);
  const plainD = display.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').replace(/:[a-z0-9-]+:\s*/g, '').trim();
  const i = plainD ? ctx.indexOf(plainD) : -1;
  if (i < 0) return esc(ctx);
  return esc(ctx.slice(0, i)) + '<mark>' + esc(plainD) + '</mark>' + esc(ctx.slice(i + plainD.length));
}

// ======================= vault health =======================
function renderQuality() {
  const v = S.vault;
  const orphans = v.notes.filter(n => n.orphan);
  const broken = v.links.filter(l => !l.target);
  let h = `<div class="f-row" style="grid-template-columns:1fr;padding-top:4px"><span>${esc(t('orphans'))} · ${orphans.length}</span></div>`;
  h += orphans.length ? orphans.map(n => `<button type="button" class="q-item" data-note="${esc(n.id)}"><span class="dot" style="--c:${groupColor(n.part)}"></span>${esc(n.title)}</button>`).join('')
    : `<div class="ok-line">✓ <span>${esc(t('noOrphans'))}</span></div>`;
  h += `<div class="f-row" style="grid-template-columns:1fr;padding-top:12px"><span>${esc(t('brokenH'))} · ${broken.length}</span></div>`;
  h += broken.length ? broken.map(l => `<button type="button" class="q-item" data-note="${esc(l.source)}" title="${esc(l.reason || '')}"><code>${esc(l.raw)}</code><span class="src">← ${esc(S.notes.get(l.source).title)}</span></button>`).join('')
    : `<div class="ok-line">✓ <span>${esc(t('noBroken'))}</span></div>`;
  $('#quality').innerHTML = h;
}

// ======================= search =======================
let qTimer = null;
function runSearch() {
  const q = fold($('#q').value).trim(); S.q = $('#q').value.trim();
  if (q.length < 2) { S.matches = null; $('#q-count').textContent = ''; }
  else {
    S.matches = new Set(S.vault.notes.filter(n => visibleNote(n) && S.search.get(n.id).includes(q)).map(n => n.id));
    $('#q-count').textContent = t('matches', S.matches.size);
  }
  renderList(); styleGraph();
}

// ======================= interactions =======================
function setPane(p) { $('#app').dataset.pane = p; document.querySelectorAll('.mtabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.pane === p)); if (p === 'right') requestAnimationFrame(() => fit(false)); }
document.querySelectorAll('.mtabs button').forEach(b => b.addEventListener('click', () => setPane(b.dataset.pane)));
document.addEventListener('click', e => {
  const tagB = e.target.closest('[data-tag]');
  if (tagB) { S.f.tag = tagB.dataset.tag; $('#f-tag').value = S.f.tag; renderList(); styleGraph(); toast('#' + S.f.tag); return; }
  const a = e.target.closest('[data-note], a[data-anchor]');
  if (!a) return;
  if (a.dataset.note) {
    e.preventDefault();
    if (a.dataset.langJump && S.f.lang !== 'all' && S.f.lang !== a.dataset.langJump) { S.f.lang = a.dataset.langJump; buildFilters(); rebuildGraph(); }
    openNote(a.dataset.note, { push: true, anchor: a.dataset.anchor || '', fromList: !!a.closest('#list') });
  } else if (a.dataset.anchor != null) {
    e.preventDefault();
    const el = $('#note').querySelector('#' + CSS.escape(a.dataset.anchor)); if (el) { el.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' }); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
  }
});
$('#hub-toggle').addEventListener('click', () => {
  const id = S.cur; if (!id) return;
  S.hubs.has(id) ? S.hubs.delete(id) : S.hubs.add(id);
  buildFilters(); rebuildGraph(); renderList(); renderNote(S.notes.get(id), null, true);
});
$('#nav-back').addEventListener('click', () => { if (S.hpos > 0) { S.hpos--; openNote(S.hist[S.hpos], { push: false }); } });
$('#nav-fwd').addEventListener('click', () => { if (S.hpos < S.hist.length - 1) { S.hpos++; openNote(S.hist[S.hpos], { push: false }); } });
$('#q').addEventListener('input', () => { clearTimeout(qTimer); qTimer = setTimeout(runSearch, 120); });
$('#q').addEventListener('keydown', e => {
  if (e.key === 'Enter' && S.matches && S.matches.size) { const first = [...S.matches][0]; openNote(first, { push: true, fromList: true }); }
  if (e.key === 'Escape') { $('#q').value = ''; runSearch(); }
});
document.addEventListener('keydown', e => {
  if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && document.activeElement !== $('#q') && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); $('#q').focus(); }
  if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet();
});
$('#f-types').addEventListener('click', e => {
  const b = e.target.closest('.tog'); if (!b) return;
  if (b.hasAttribute('data-hubedges')) S.f.hubEdges = !S.f.hubEdges;
  else { const k = b.dataset.type; S.f.types.has(k) ? S.f.types.delete(k) : S.f.types.add(k); }
  buildFilters(); rebuildGraph(); renderList();
});
$('#f-status').addEventListener('click', e => {
  const b = e.target.closest('.tog'); if (!b) return; const s = b.dataset.status;
  S.f.statuses.has(s) ? S.f.statuses.delete(s) : S.f.statuses.add(s);
  b.setAttribute('aria-pressed', S.f.statuses.has(s)); renderList(); styleGraph();
});
$('#f-tag').addEventListener('change', e => { S.f.tag = e.target.value; renderList(); styleGraph(); });
$('#f-lang').addEventListener('change', e => { S.f.lang = e.target.value; rebuildGraph(); renderList(); if (S.q) runSearch(); });
$('#legend').addEventListener('mouseover', e => { const b = e.target.closest('[data-group]'); if (b && focusGroup !== b.dataset.group) { focusGroup = b.dataset.group; styleGraph(); } });
$('#legend').addEventListener('mouseleave', () => { if (!pinnedGroup) { focusGroup = null; styleGraph(); } else { focusGroup = pinnedGroup; styleGraph(); } });
let pinnedGroup = null;
$('#legend').addEventListener('click', e => { const b = e.target.closest('[data-group]'); if (!b) return; pinnedGroup = pinnedGroup === b.dataset.group ? null : b.dataset.group; focusGroup = pinnedGroup; renderLegend(G.m); styleGraph(); });
function setMode(m) { S.mode = m; $('#tab-global').setAttribute('aria-selected', m === 'global'); $('#tab-local').setAttribute('aria-selected', m === 'local'); rebuildGraph(); }
$('#tab-global').addEventListener('click', () => setMode('global'));
$('#tab-local').addEventListener('click', () => setMode('local'));
$('#tab-in').addEventListener('click', () => { S.linkTab = 'in'; renderLinks(); });
$('#tab-out').addEventListener('click', () => { S.linkTab = 'out'; renderLinks(); });
$('#g-fit').addEventListener('click', () => fit(true));
$('#g-wide').addEventListener('click', () => {
  S.wide = !S.wide; $('#app').classList.toggle('wide', S.wide);
  $('#g-wide').title = t(S.wide ? 'shrink' : 'expand');
  if (matchMedia('(max-width: 900px)').matches) setPane('right');
  requestAnimationFrame(() => fit(true));
});
svg.on('click', () => { if (pinnedGroup) { pinnedGroup = null; focusGroup = null; renderLegend(G.m); styleGraph(); } });

// ======================= interface language (site contract: ?lang=, jf-lang / iac_lang) =======================
function applyUI() {
  document.documentElement.lang = UI;
  document.querySelectorAll('[data-i18n]').forEach(el => { const v = T[UI][el.dataset.i18n]; if (typeof v === 'string') el.textContent = v; });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { const v = T[UI][el.dataset.i18nHtml]; if (typeof v === 'string') el.innerHTML = v; });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => el.placeholder = T[UI][el.dataset.i18nPh]);
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = T[UI][el.dataset.i18nTitle]; el.setAttribute('aria-label', el.title); });
  document.querySelectorAll('#langToggle .lang-opt').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === UI));
  $('#rules').innerHTML = T[UI].rules.map(r => `<li>${r}</li>`).join('');
  $('#graph').setAttribute('aria-label', UI === 'es' ? 'Grafo de notas' : 'Note graph');
  document.title = t('pageTitle');
  updateThemeBtn();
  if (S.vault) { renderMeta(); buildFilters(); renderList(); renderLegend(G.m); renderLinks(); renderQuality(); const n = S.notes.get(S.cur); if (n) { renderNote(n, null, true); } $('#g-count').textContent = t('showing', G.nodes.length, G.edges.length); $('#g-hint').textContent = S.mode === 'local' && n ? t('hintLocal', short(n.title, 40)) : t('hintGlobal'); }
}
function setLang(l) {
  UI = l === 'en' ? 'en' : 'es';
  store.set('jf-lang', UI); store.set('iac_lang', UI);
  setParams({ lang: UI === 'en' ? 'en' : null });
  applyUI(); track('lang_switch', { lang: UI });
}
document.querySelectorAll('#langToggle .lang-opt').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

// ======================= theme (site contract: jf-theme, data-theme on <html>) =======================
function currentTheme() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
function updateThemeBtn() {
  const b = $('#themeToggle'); if (!b) return; const dark = currentTheme() === 'dark';
  b.textContent = dark ? '☀️' : '🌙'; b.setAttribute('aria-pressed', dark);
  b.setAttribute('aria-label', t(dark ? 'toLight' : 'toDark')); b.title = b.getAttribute('aria-label');
}
$('#themeToggle')?.addEventListener('click', () => {
  const n = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', n); store.set('jf-theme', n); updateThemeBtn();
  const cur = S.notes.get(S.cur); if (cur && $('#note .mermaid-box')) renderNote(cur, null, true); // redraw diagrams in the new theme
  track('theme_switch', { theme: n });
});

// ======================= URL state (shareable links) =======================
function setParams(kv) {
  try {
    const u = new URL(location.href);
    for (const [k, v] of Object.entries(kv)) { if (v == null || v === '') u.searchParams.delete(k); else u.searchParams.set(k, v); }
    history.replaceState(null, '', u.pathname + (u.search || '') + u.hash);
  } catch (e) {}
}
function syncUrl() {
  if (!S.meta) return;
  if (S.source === 'github') setParams({ repo: S.meta.repo, ref: S.meta.refParam || null, path: S.meta.pathParam || null, note: S.cur });
  else if (S.source === 'demo') setParams({ repo: null, ref: null, path: null, note: S.cur });
  else setParams({ repo: null, ref: null, path: null, note: null });
}
$('#share').addEventListener('click', async () => {
  syncUrl();
  const url = location.href;
  try { await navigator.clipboard.writeText(url); toast(t('copied')); }
  catch (e) { const i = $('#share-url'); i.hidden = false; i.value = url; i.select(); toast(t('copyManual'), 5000); }
  track('share_link', { source: S.source });
});

// ======================= sources sheet =======================
const toastEl = $('#toast'); let toastT = null;
function toast(msg, ms = 3200) { toastEl.textContent = msg; toastEl.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => toastEl.hidden = true, ms); }
function setSheetTab(tab) {
  ['github', 'folder'].forEach(k => { $('#stab-' + k).setAttribute('aria-selected', k === tab); $('#spanel-' + k).hidden = k !== tab; });
}
function openSheet(tab) { $('#sheet').hidden = false; setSheetTab(tab || 'github'); (tab === 'folder' ? $('#pick-dir-btn') : $('#gh-url')).focus(); }
function closeSheet() { $('#sheet').hidden = true; $('#open-source').focus(); }
$('#open-source').addEventListener('click', () => openSheet());
$('#stab-github').addEventListener('click', () => setSheetTab('github'));
$('#stab-folder').addEventListener('click', () => setSheetTab('folder'));
$('#sheet-close').addEventListener('click', closeSheet);
$('#sheet').addEventListener('click', e => { if (e.target === $('#sheet')) closeSheet(); });
$('#back-demo').addEventListener('click', () => { closeSheet(); loadDemo(); });
document.querySelectorAll('[data-example]').forEach(b => b.addEventListener('click', () => { $('#gh-url').value = b.dataset.example; $('#gh-path').value = ''; $('#gh-ref').value = ''; }));

// ----- local folder -----
const dirSupported = 'webkitdirectory' in document.createElement('input');
$('#pick-dir-btn').addEventListener('click', () => { if (!dirSupported) { toast(t('noDir'), 5000); return; } $('#pick-dir').click(); });
$('#pick-files-btn').addEventListener('click', () => $('#pick-files').click());
$('#pick-dir').addEventListener('change', e => { ingest([...e.target.files].map(f => ({ file: f, path: f.webkitRelativePath || f.name })), true); e.target.value = ''; });
$('#pick-files').addEventListener('change', e => { ingest([...e.target.files].map(f => ({ file: f, path: f.name })), false); e.target.value = ''; });

const IMG = /\.(svg|png|jpe?g|gif|webp|avif)$/i;
const SKIP = /(^|\/)(\.[^/]*|node_modules|__pycache__|site|_site|vendor)(\/|$)/;
async function ingest(entries, fromDir) {
  // drop the picked folder's own name so paths are relative to the vault root
  let root = '';
  if (fromDir) {
    const firsts = new Set(entries.map(x => x.path.split('/')[0]));
    if (firsts.size === 1 && entries.every(x => x.path.includes('/'))) root = [...firsts][0];
  }
  const rel = x => (root ? x.path.slice(root.length + 1) : x.path).replace(/^\/+/, '');
  const keep = entries.filter(x => !SKIP.test(rel(x)));
  const md = keep.filter(x => /\.(md|markdown)$/i.test(x.path));
  if (!md.length) { toast(t('noMd'), 5000); return; }
  toast(t('reading', md.length), 10000);
  const files = await Promise.all(md.map(async x => ({ path: rel(x).replace(/\.markdown$/i, '.md'), text: await x.file.text() })));
  const assets = new Map(); const urls = [];
  for (const x of keep.filter(x => IMG.test(x.path))) { let u = null; assets.set(rel(x), () => { if (!u) { u = URL.createObjectURL(x.file); urls.push(u); } return u; }); }
  closeSheet();
  S.filesMode = !fromDir;
  loadVault(files, assets, { source: 'folder', name: root || t('yours'), hubs: null, objectUrls: urls });
  syncUrl();
  toast(t('loaded', S.vault.stats.notes, S.vault.stats.linksResolved), 4200);
  track('vault_load', { source: 'folder', notes_bucket: bucket(S.vault.stats.notes) });
  if (S.filesMode) setTimeout(() => toast(t('filesMode'), 7000), 4300);
}
// drag & drop a folder anywhere
let dragDepth = 0;
window.addEventListener('dragenter', e => { if ([...(e.dataTransfer?.types || [])].includes('Files')) { dragDepth++; $('#dropzone').hidden = false; } });
window.addEventListener('dragleave', () => { dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) $('#dropzone').hidden = true; });
window.addEventListener('dragover', e => e.preventDefault());
window.addEventListener('drop', async e => {
  e.preventDefault(); dragDepth = 0; $('#dropzone').hidden = true;
  const items = [...(e.dataTransfer?.items || [])].map(i => i.webkitGetAsEntry && i.webkitGetAsEntry()).filter(Boolean);
  if (!items.length) return;
  const out = [];
  const walk = (entry, prefix) => new Promise(res => {
    if (entry.isFile) entry.file(f => { out.push({ file: f, path: prefix + f.name }); res(); }, () => res());
    else if (entry.isDirectory) {
      const reader = entry.createReader(); const all = [];
      const readAll = () => reader.readEntries(async batch => { if (batch.length) { all.push(...batch); readAll(); } else { for (const c of all) await walk(c, prefix + entry.name + '/'); res(); } }, () => res());
      readAll();
    } else res();
  });
  for (const it of items) await walk(it, '');
  ingest(out, items.length === 1 && items[0].isDirectory);
});
function bucket(n) { return n < 25 ? '<25' : n < 100 ? '25-99' : n < 500 ? '100-499' : '500+'; }

// ======================= GitHub repositories =======================
// Listing: GitHub API (1 call for the default branch + 1 for the whole tree). If the API is rate-limited or unreachable,
// the jsDelivr listing is used instead. File contents come from raw.githubusercontent.com (no API quota), jsDelivr as backup.
// A token, if given, is kept only in this tab's memory and sent only to api.github.com (needed for private repositories).
const GH_LIMITS = { notes: 3000, bytes: 40 * 1024 * 1024 };
const GHError = (code, extra) => Object.assign(new Error(code), { code, extra });
function parseRepoInput(s) {
  s = String(s || '').trim().replace(/\.git$/, '').replace(/\/+$/, '');
  let m = s.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)(?:\/(tree|blob)\/([^/]+)(?:\/(.*))?)?$/i);
  if (m) {
    let path = m[5] ? decodeURIComponent(m[5]) : '';
    if (m[3] === 'blob' && path) path = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
    return { owner: m[1], repo: m[2], ref: m[4] ? decodeURIComponent(m[4]) : '', path };
  }
  m = s.match(/^([\w.-]+)\/([\w.-]+)$/);
  if (m) return { owner: m[1], repo: m[2], ref: '', path: '' };
  return null;
}
const encPath = p => p.split('/').map(encodeURIComponent).join('/');
async function ghApi(url, token) {
  const h = { Accept: 'application/vnd.github+json' }; if (token) h.Authorization = 'Bearer ' + token;
  let r;
  try { r = await fetch(url, { headers: h }); } catch (e) { throw GHError('network'); }
  if (r.status === 404) throw GHError(token ? 'notFoundToken' : 'notFound');
  if (r.status === 401) throw GHError('badToken');
  if (r.status === 403 || r.status === 429) {
    // the counter is only readable if GitHub exposes it to this origin; an unreadable 403 is treated as a rate limit too
    const rem = r.headers.get('x-ratelimit-remaining');
    if (rem === '0' || rem === null) throw GHError('rateLimit', r.headers.get('x-ratelimit-reset'));
    throw GHError(token ? 'forbidden' : 'notFound');
  }
  if (!r.ok) throw GHError('http', r.status);
  return r.json();
}
async function listViaApi(o, token) {
  const base = `https://api.github.com/repos/${o.owner}/${o.repo}`;
  let ref = o.ref, isPrivate = false;
  if (!ref) { const info = await ghApi(base, token); ref = info.default_branch; isPrivate = info.private; }
  const tree = await ghApi(`${base}/git/trees/${encodeURIComponent(ref)}?recursive=1`, token);
  return { ref, via: 'api', isPrivate, truncated: !!tree.truncated, files: tree.tree.filter(x => x.type === 'blob').map(x => ({ path: x.path, size: x.size || 0 })) };
}
async function listViaJsdelivr(o) {
  const refs = o.ref ? [o.ref] : ['main', 'master'];
  for (const ref of refs) {
    let r; try { r = await fetch(`https://data.jsdelivr.com/v1/packages/gh/${o.owner}/${o.repo}@${encodeURIComponent(ref)}?structure=flat`); } catch (e) { continue; }
    if (!r.ok) continue;
    const j = await r.json();
    return { ref, via: 'jsdelivr', isPrivate: false, truncated: false, files: (j.files || []).map(f => ({ path: f.name.replace(/^\//, ''), size: f.size || 0 })) };
  }
  throw GHError('notFound');
}
async function fetchText(o, ref, path, token, isPrivate) {
  if (token && isPrivate) {
    const r = await fetch(`https://api.github.com/repos/${o.owner}/${o.repo}/contents/${encPath(path)}?ref=${encodeURIComponent(ref)}`, { headers: { Accept: 'application/vnd.github.raw', Authorization: 'Bearer ' + token } });
    if (!r.ok) throw GHError('file', path); return r.text();
  }
  const urls = [`https://raw.githubusercontent.com/${o.owner}/${o.repo}/${encodeURIComponent(ref)}/${encPath(path)}`, `https://cdn.jsdelivr.net/gh/${o.owner}/${o.repo}@${encodeURIComponent(ref)}/${encPath(path)}`];
  for (const u of urls) { try { const r = await fetch(u); if (r.ok) return await r.text(); } catch (e) {} }
  throw GHError('file', path);
}
function ghAssetGetter(o, ref, path, token, isPrivate) {
  let p = null;
  return () => p || (p = (async () => {
    let blob = null;
    if (token && isPrivate) {
      const r = await fetch(`https://api.github.com/repos/${o.owner}/${o.repo}/contents/${encPath(path)}?ref=${encodeURIComponent(ref)}`, { headers: { Accept: 'application/vnd.github.raw', Authorization: 'Bearer ' + token } });
      if (r.ok) blob = await r.blob();
    } else {
      try { const r = await fetch(`https://raw.githubusercontent.com/${o.owner}/${o.repo}/${encodeURIComponent(ref)}/${encPath(path)}`); if (r.ok) blob = await r.blob(); } catch (e) {}
    }
    if (!blob) return `https://cdn.jsdelivr.net/gh/${o.owner}/${o.repo}@${encodeURIComponent(ref)}/${encPath(path)}`;
    // raw.githubusercontent serves SVG as text/plain, which <img> refuses: re-type it
    if (/\.svg$/i.test(path)) blob = new Blob([await blob.text()], { type: 'image/svg+xml' });
    const u = URL.createObjectURL(blob); S.objectUrls.push(u); return u;
  })());
}
function mkdocsDocsDir(text) {
  const m = String(text).match(/^docs_dir:\s*["']?([^"'\n#]+?)["']?\s*(?:#.*)?$/m);
  return (m ? m[1].trim() : 'docs').replace(/^\.\/|\/$/g, '');
}
let ghBusy = false;
async function loadGithub(input, opts = {}) {
  if (ghBusy) return; ghBusy = true;
  const progress = (txt, frac) => { $('#gh-status').hidden = false; $('#gh-status-text').textContent = txt; $('#gh-bar').style.width = frac == null ? '0%' : Math.round(frac * 100) + '%'; };
  const fail = (msg) => { $('#gh-status').hidden = false; $('#gh-status-text').textContent = msg; $('#gh-status').classList.add('err'); $('#gh-bar').style.width = '0%'; ghBusy = false; if (opts.fromUrl && !S.vault) loadDemo(); };
  $('#gh-status').classList.remove('err');
  const o = parseRepoInput(input);
  if (!o) return fail(t('ghBadUrl'));
  if (opts.ref) o.ref = opts.ref;
  const token = (opts.token || '').trim();
  const pathOverride = opts.path != null && opts.path !== '' ? String(opts.path).replace(/^\/+|\/+$/g, '') : null;
  try {
    progress(t('ghListing', `${o.owner}/${o.repo}`), null);
    let list;
    try { list = await listViaApi(o, token); }
    catch (e) { if (token || !['rateLimit', 'network', 'http'].includes(e.code)) throw e; list = await listViaJsdelivr(o); }
    // vault root: explicit subfolder > tree/ URL path > docs_dir from mkdocs.yml > repository root
    let root = pathOverride != null ? pathOverride : o.path, rootWhy = root ? 'given' : 'repo';
    if (!root && list.files.some(f => f.path === 'mkdocs.yml')) {
      try { const y = await fetchText(o, list.ref, 'mkdocs.yml', token, list.isPrivate); const d = mkdocsDocsDir(y); if (list.files.some(f => f.path.startsWith(d + '/'))) { root = d; rootWhy = 'mkdocs'; } } catch (e) {}
    }
    const pre = root ? root + '/' : '';
    const inRoot = list.files.filter(f => f.path.startsWith(pre)).map(f => ({ ...f, rel: f.path.slice(pre.length) })).filter(f => !SKIP.test(f.rel));
    const md = inRoot.filter(f => /\.(md|markdown)$/i.test(f.rel));
    if (!md.length) throw GHError('noMdRepo', root || '/');
    const bytes = md.reduce((a, f) => a + f.size, 0);
    if (md.length > GH_LIMITS.notes || bytes > GH_LIMITS.bytes) throw GHError('tooBig', md.length);
    // download notes, 8 at a time
    const files = new Array(md.length); let done = 0, idx = 0;
    const worker = async () => { while (idx < md.length) { const i = idx++; files[i] = { path: md[i].rel.replace(/\.markdown$/i, '.md'), text: await fetchText(o, list.ref, md[i].path, token, list.isPrivate) }; progress(t('ghDownloading', ++done, md.length), done / md.length); } };
    await Promise.all(Array.from({ length: Math.min(8, md.length) }, worker));
    const assets = new Map();
    inRoot.filter(f => IMG.test(f.rel)).forEach(f => assets.set(f.rel, ghAssetGetter(o, list.ref, f.path, token, list.isPrivate)));
    const repoLabel = `${o.owner}/${o.repo}`;
    S.filesMode = false;
    loadVault(files, assets, {
      source: 'github', name: repoLabel, repo: repoLabel, ref: list.ref, root, rootWhy, via: list.via, truncated: list.truncated,
      refParam: o.ref || null, pathParam: pathOverride != null ? pathOverride : (o.path || null), hubs: null,
      links: { github: { base: `https://github.com/${o.owner}/${o.repo}/blob/${encodeURIComponent(list.ref)}/${pre}` } }
    }, { startNote: opts.note });
    syncUrl(); closeSheet(); $('#gh-status').hidden = true;
    toast(t('loaded', S.vault.stats.notes, S.vault.stats.linksResolved), 4200);
    if (list.truncated) setTimeout(() => toast(t('ghTruncated'), 7000), 4300);
    track('vault_load', { source: 'github', via: list.via, notes_bucket: bucket(S.vault.stats.notes) });
  } catch (e) {
    const msg = {
      notFound: t('ghNotFound'), notFoundToken: t('ghNotFoundToken'), badToken: t('ghBadToken'), forbidden: t('ghForbidden'),
      rateLimit: t('ghRate', e.extra ? new Date(Number(e.extra) * 1000).toLocaleTimeString(UI === 'en' ? 'en-US' : 'es-CO', { hour: '2-digit', minute: '2-digit' }) : '—'),
      network: t('ghNetwork'), noMdRepo: t('ghNoMd', e.extra), tooBig: t('ghTooBig', e.extra, GH_LIMITS.notes), file: t('ghFile', e.extra)
    }[e.code] || t('ghGeneric');
    track('vault_load_error', { source: 'github', code: e.code || 'error' });
    return fail(msg);
  }
  ghBusy = false;
}
$('#spanel-github').addEventListener('submit', e => {
  e.preventDefault();
  loadGithub($('#gh-url').value, { ref: $('#gh-ref').value.trim(), path: $('#gh-path').value.trim(), token: $('#gh-token').value });
});

// ======================= demo =======================
let demoData = null;
async function loadDemo(startNote) {
  if (!demoData) {
    $('#note').innerHTML = `<p class="empty">${esc(t('loadingVault'))}</p>`;
    try { const r = await fetch('data/demo-vault.json', { cache: 'no-cache' }); if (!r.ok) throw new Error(r.status); demoData = await r.json(); }
    catch (e) { $('#note').innerHTML = `<h1>${esc(t('pageTitle'))}</h1><p>${esc(t('vaultFail'))}</p>`; return; }
  }
  S.filesMode = false;
  loadVault(demoData.files, new Map(Object.entries(demoData.assets)), demoData.meta, { startNote });
  syncUrl();
}

// ======================= boot =======================
applyUI();
setPane('center');
(() => {
  let p = null; try { p = new URLSearchParams(location.search); } catch (e) {}
  const repo = p && p.get('repo'), note = p && p.get('note');
  if (repo) {
    // shared link: show what is being loaded, in the same panel a visitor would use
    $('#gh-url').value = repo; $('#gh-ref').value = p.get('ref') || ''; $('#gh-path').value = p.get('path') || '';
    if ($('#gh-ref').value || $('#gh-path').value) $('#gh-opts').open = true;
    openSheet('github');
    $('#note').innerHTML = `<p class="empty">${esc(t('ghListing', repo))}</p>`;
    loadGithub(repo, { ref: p.get('ref') || '', path: p.get('path') || '', note, fromUrl: true });
  }
  else loadDemo(note);
})();
})();
