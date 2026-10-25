[Español](README.md) · **English**

# Knowledge graph · your notes as a navigable network

[![Live piece](https://img.shields.io/badge/piece-live-4e00ff)](https://dashboards.javierforero.co/claude/grafo-conocimiento/?lang=en)
[![MIT License](https://img.shields.io/badge/license-MIT-041c59)](../../LICENSE)
[![d3](https://img.shields.io/badge/d3-7.9.0-0048ff)](https://d3js.org/)
[![Bilingual](https://img.shields.io/badge/ES%20%C2%B7%20EN-bilingual-7c4dff)](https://dashboards.javierforero.co/claude/grafo-conocimiento/)

The question it answers: **how are the documents in my knowledge base connected, which notes hold the others up, and where is the network broken?** It is built for researchers, teachers and teams who write in Markdown and want to see their work as a network, Obsidian-style, without installing anything.

> **Live demo with real data.** It opens with the [Health Insurance Reserving Handbook](https://github.com/jaforero/health-insurance-reserving-handbook) (58 notes). Any visitor can load their own public GitHub repository, a WordPress blog or a folder on their computer. Files from a local folder are read inside the browser and are never sent to any server.

![Knowledge graph: note list, a note with formulas, and the relationship graph](assets/og-image.png)

## What it shows
The graph is the stage: it fills the whole work area and the controls float over it.

1. **Three views, one control.** In the header, **Graph · Split · Reading** (keys `G`, `D`, `L`; `Esc` returns to the graph). The transition is animated and the graph re-frames the open note.
   - **Graph:** relationships at the centre. The selected note appears in a compact card with its description, its incoming and outgoing links, and buttons to read it, see its connections or show only its neighbours.
   - **Split:** graph and document side by side.
   - **Reading:** the document wide. The graph switches by itself to that note's local view and returns to the global view when you leave.
2. **Global graph.**
   - Every note is a node, coloured by part and sized by how many notes link to it.
   - Hub notes (in the demo, the home page and the methodology guide) are drawn as fixed diamonds above the graph so they do not collapse it; their links are faint.
   - Hovering a node shows a preview with the note's description. A click selects it and a double click opens it.
3. **Local graph.** The open note and its neighbours up to 2 hops. Hub notes appear but are not expanded.
4. **Document.**
   - A header with the part, chapter, title, description, status, language, date and tags.
   - Three tabs: **Content** (Markdown with LaTeX formulas, tables, admonitions, Mermaid diagrams and images), **Connections** (notes that link here, each with the sentence where the link appears, and notes this one links to, including broken links) and **Properties** (the frontmatter exactly as written).
   - Links to the GitHub version and, in the demo, to the published handbook page. The ◇ button pins or unpins the note as a hub.
5. **Palette search.** Searches titles and text, shows up to 8 results with the matching excerpt, is navigated with the arrow keys, and centres the graph on the chosen note. The `/` key jumps to search.
6. **Layers over the graph.**
   - **Index** (`I`): notes grouped by part.
   - **Filters:** by link type (inline, wikilink, prerequisite, related, translation), status, tag and language; the button shows how many filters are active. Every control has contextual help (tap ⓘ, or hover or focus it with the keyboard) explaining what it does and when to use it, and the panel suggests the filter action with the most effect for that vault (for example, written links only).
   - **Health:** note and connection counts, the snapshot's commit and date (in the demo), and the list of orphan notes and broken links; the button shows how many there are.
   - A legend of parts and link types, and zoom.
7. **Network diagnosis** (in Health), over written links: **dead ends** (they receive links but lead to no note), **bridge notes** (removing one splits the network; the number of notes cut off is shown), **isolated groups** and **links between sections** (the share of each section's links that go to other sections; under 15 % is flagged). **Download to-do list (CSV)** exports everything with its suggestions.
8. **Suggested connections.** For each note, the 3 notes with the most similar content that do not link to it yet (TF-IDF over title ×3, tags ×2 and text; cosine), with the similarity, the shared terms as evidence and **Copy link** in the source's format (Markdown, wikilink or HTML for WordPress). They show on the graph as dashed lines while the list is open. They are proposals: the author decides. Validation on the javierforero.co blog: of 53 hand-picked links, 48 appear among the top 3 suggestions.
9. **Guided tour** (▷ button or `?tour=1` in the link): 6 or 7 steps computed from the vault (whole network, central note, Local view, the effect of related reading on blogs, health, one suggested connection and how to try your own documents). Move with the arrow keys; leaving restores the view.

## Four sources
| Source | How it loads | What can be shared |
|---|---|---|
| **Demo** | `data/demo-vault.json`, a snapshot of the Handbook. It never calls the GitHub API, so it holds up in a full room on shared wifi. | `…/grafo-conocimiento/?note=<path>` |
| **GitHub repository** | The visitor pastes `user/repo` or its URL (a subfolder works too: `…/tree/main/docs`). If the repository has `mkdocs.yml`, its `docs_dir` is used. | `…/grafo-conocimiento/?repo=user/repo&path=docs&note=<path>` |
| **WordPress blog** | The visitor types the blog address (`myblog.com`). Published posts and pages are read through the public WordPress API (`/wp-json/wp/v2/`, or `public-api.wordpress.com` for WordPress.com sites); each post is converted from HTML to Markdown in the browser. Categories become the groups, and posts that share 2 or more tags are joined by a separate link type, “Tags”. That type starts switched on only if more than a quarter of the posts have no written links; otherwise it is turned on from Filters. Links inside a reading-list block at the end of a post (“Related posts:”, “Series ·”, “Lecturas relacionadas:”…) are typed “Related” and kept apart from in-text links. Requests carry a parameter that changes every 10 minutes so the WordPress.com cache does not serve an old copy. | `…/grafo-conocimiento/?wp=myblog.com&note=<year>/<slug>.md` |
| **Local folder** | “Choose folder”, “Choose .md files”, or drag the folder onto the page. | Not possible: the files only exist in that browser. |

The language travels in the link, as everywhere else on the site (`?lang=en`).

## Parsing rules
Everything comes from the text of the files; nothing is inferred. The same rules apply to all three sources because a single file runs them: `vault-parser.js`.

- **Notes.** Every `.md` file. `title`, `part`, `chapter`, `status`, `tags` and `language` are read from the frontmatter.
- **Links.** Each source is its own type:
  - **Inline:** Markdown `[text](path.md)`.
  - **Wikilink:** `[[note]]`, `[[note|alias]]`, `[[note#section]]`.
  - **Prerequisite:** the `prerequisites` frontmatter field.
  - **Related:** the `related_chapters` frontmatter field.
  - **Translation:** a link on a line that starts with `**Idioma:**` or `**Language:**`.
- **Path resolution.**
  - First relative to the note; if that fails, relative to the vault root (“root-relative”).
  - Wikilinks also match a unique file name, as Obsidian does.
  - Anything unresolved is a broken link.
- **Code blocks.** Links inside them are ignored.
- **Normalisation.** Only `part` and `status` are normalised, and only for colours and filters. Properties show the original value.
- **Skipped folders:** hidden ones (`.git`, `.github`, `.obsidian`…), `node_modules`, `site`, `_site` and `vendor`.

## Design decisions
- **No server.** Everything runs in the visitor's browser.
  - **Repository listing:** uses the GitHub API, with two requests per load (default branch and full tree).
  - **If the API runs out** (60 requests per hour per IP without a token), the listing comes from jsDelivr.
  - **Note contents:** come from `raw.githubusercontent.com`, which uses no API quota, with jsDelivr as backup.
- **The demo does not depend on live GitHub.** In a talk, the whole audience shares one IP and would use up those 60 requests in minutes. So the demo reads a snapshot published on this same site, and a GitHub Action regenerates it daily (see *Backend*).
- **Private repositories.** The panel accepts an optional GitHub token:
  - it stays only in the tab's memory and is sent only to `api.github.com`;
  - it is never saved and never appears in a shared link;
  - with a token, the listing uses that account's quota (5,000 requests per hour), and in a private repository each note is downloaded through the API.
- **SVG from GitHub.** `raw.githubusercontent.com` serves SVG as plain text, which browsers will not show in an `<img>` tag. So SVGs are downloaded and re-typed as `image/svg+xml` before display.
- **Stated limits.** Up to 3,000 notes and 40 MB of text per repository. If a repository exceeds them, the page says so and asks for a subfolder.
- **Content first.** The libraries (js-yaml, marked and d3) load from cdnjs, with jsDelivr as backup and pinned versions. MathJax and Mermaid arrive in the background; Mermaid only when a note has diagrams.
- **No language or theme flash.** Language and theme are resolved in the `<head>` using the site contract (`?lang=`, `jf-lang` / `iac_lang`, `jf-theme`). `i18n.js` translates the static text before first paint.
- **Safety with third-party Markdown.** Before a note is shown, `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, `<style>`, `on*` attributes and `javascript:` links are removed.
- **Analytics without personal data.** GA4 records the source type, how it loaded and a size range (`<25`, `25-99`…). It never records repository, folder or note names.

## Backend: the demo snapshot
`.github/workflows/grafo-conocimiento-demo.yml` runs daily at 05:23 (Bogotá) and can also be started by hand from *Actions → Grafo de conocimiento · demo → Run workflow*.

1. It checks out the Handbook.
2. It runs `tools/build-demo-vault.js` with the settings in `tools/demo-config.json` (name, hub notes, part names, handbook URL).
3. It writes `data/demo-vault.json`, with the notes, the images they use, the commit and its date.
4. It commits only if something changed. The file carries the Handbook's commit date, not the run date, so a day without changes produces no commit.

To rebuild it on your computer:
```bash
npm install --no-save js-yaml@4.1.0
git clone --depth 1 https://github.com/jaforero/health-insurance-reserving-handbook /tmp/handbook
node claude/grafo-conocimiento/tools/build-demo-vault.js /tmp/handbook claude/grafo-conocimiento/data/demo-vault.json
```

**Optional: immediate refresh.** The workflow also listens for a `repository_dispatch` event of type `handbook-updated`. If the Handbook sends it when it publishes, the demo refreshes within minutes. That needs a token with access to this repository, stored as a secret in the Handbook. Without it, the daily refresh is enough.

## Files
```
claude/grafo-conocimiento/
├── index.html              page: top bar, graph stage, reader, library loading
├── i18n.js                 ES/EN interface text
├── app.js                  graph, note, backlinks, filters, sources (demo, GitHub, folder)
├── vault-parser.js         note and link parser (the same for all three sources)
├── data/demo-vault.json    demo snapshot (generated by the GitHub Action)
├── tools/build-demo-vault.js
├── tools/demo-config.json
└── assets/og-image.png
```

## Limitations
- **Markdown only.** It does not read PDF or Word. A repository of PDF articles has to be converted first.
- **Branches with “/” in the name.** In a `…/tree/branch/folder` URL, the first segment is taken as the branch. If the branch name has a slash, type it under *Options → Branch or tag*.
- **WordPress blogs.**
  - Only published, public content is read, up to 1,500 posts.
  - Each post goes into the group of its first category.
  - A site that disables its REST API or blocks requests from other domains (CORS) cannot be loaded.
  - A link to the old address of a renamed post counts as broken even if the blog redirects it: from the browser, a redirect cannot be told apart from a 404. The health panel says so.
- **Needs a connection.** The libraries come from a CDN.

## License
MIT (code). The IgraSans typeface belongs to its owner and is not covered by the license. The demo content belongs to the Health Insurance Reserving Handbook and keeps its own license.
