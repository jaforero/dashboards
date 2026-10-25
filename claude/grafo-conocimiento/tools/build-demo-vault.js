#!/usr/bin/env node
/* Construye la instantánea de la demo: data/demo-vault.json
 *
 *   node tools/build-demo-vault.js <copia-local-del-handbook> <salida.json>
 *
 * Lee las notas .md de <docsDir> (ver tools/demo-config.json), incrusta las imágenes que las notas usan y anota
 * el commit y su fecha. La fecha es la del commit, no la de la ejecución: si el Handbook no cambió, el archivo
 * sale idéntico y la GitHub Action no hace commit.
 *
 * Requiere js-yaml (npm install --no-save js-yaml@4.1.0) y git.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { parseVault } = require('../vault-parser.js');

let yaml;
try { yaml = require('js-yaml'); }
catch (e) { console.error('Falta js-yaml:  npm install --no-save js-yaml@4.1.0'); process.exit(2); }

const [src, out] = process.argv.slice(2);
if (!src || !out) { console.error('Uso: node tools/build-demo-vault.js <copia-del-handbook> <salida.json>'); process.exit(2); }
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'demo-config.json'), 'utf8'));
const ROOT = path.join(src, cfg.docsDir);
if (!fs.existsSync(ROOT)) { console.error(`No existe ${ROOT}`); process.exit(2); }

const git = (...a) => execFileSync('git', ['-C', src, ...a], { encoding: 'utf8' }).trim();
const commit = git('rev-parse', 'HEAD');
const builtAt = git('log', '-1', '--format=%cI');

const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const all = walk(ROOT).map(p => path.relative(ROOT, p).split(path.sep).join('/')).sort();
const files = all.filter(p => /\.md$/i.test(p)).map(p => ({ path: p, text: fs.readFileSync(path.join(ROOT, p), 'utf8') }));
const vault = parseVault(files.concat(all.filter(p => !/\.md$/i.test(p)).map(p => ({ path: p, text: '' }))), s => yaml.load(s, { schema: yaml.JSON_SCHEMA }));

// only the images the notes reference, embedded so the demo never depends on another host
const MIME = { svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' };
const assets = {};
for (const a of vault.assets) {
  if (!a.resolved || assets[a.resolved]) continue;
  const ext = a.resolved.split('.').pop().toLowerCase();
  if (!MIME[ext]) continue;
  assets[a.resolved] = `data:${MIME[ext]};base64,${fs.readFileSync(path.join(ROOT, a.resolved)).toString('base64')}`;
}

// published page of each note (MkDocs with use_directory_urls: a/b.md -> a/b/, a/index.md -> a/)
const pageUrl = p => p.replace(/(^|\/)index\.md$/i, '$1').replace(/\.md$/i, '/');
const meta = {
  source: 'demo', name: cfg.name, repo: cfg.repo, commit, builtAt,
  hubs: cfg.hubs, defaultLang: cfg.defaultLang, groupLabels: cfg.groupLabels,
  links: {
    site: { root: cfg.site.root, label: cfg.site.label, urls: Object.fromEntries(files.map(f => [f.path, pageUrl(f.path)])) },
    github: { base: `https://github.com/${cfg.repo}/blob/${commit}/${cfg.docsDir}/` }
  }
};
for (const h of cfg.hubs) if (!files.some(f => f.path === h)) console.warn(`Aviso: la nota eje ${h} no existe en el Handbook; actualiza tools/demo-config.json`);

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ meta, files, assets }));
const s = vault.stats;
console.log(`Demo: ${s.notes} notas · ${s.linksResolved} enlaces · ${s.linksBroken} rotos · ${s.orphans.length} huérfanas · ${Object.keys(assets).length} imágenes`);
console.log(`Commit ${commit.slice(0, 7)} (${builtAt}) → ${out} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
