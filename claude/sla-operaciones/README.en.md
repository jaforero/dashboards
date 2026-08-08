[Español](README.md) · **English**

# SLA Compliance · Operations Dashboard

[![Live demo](https://img.shields.io/badge/demo-live-4e00ff)](https://dashboards.javierforero.co/claude/sla-operaciones/?lang=en)
[![MIT licence](https://img.shields.io/badge/licence-MIT-041c59)](../../LICENSE)
[![Plotly.js](https://img.shields.io/badge/Plotly.js-2.35.2-0048ff)](https://plotly.com/javascript/)
[![Bilingual](https://img.shields.io/badge/ES%20%C2%B7%20EN-bilingual-7c4dff)](https://dashboards.javierforero.co/claude/sla-operaciones/)

I built this dashboard to answer a question I keep seeing in operations: **SLA dropped — so what do I actually do about it?** Most dashboards stop at the chart. This one goes all the way to the decision.

It is the practical piece of the *“Operational metrics and efficiency”* exercise in my method, and it demonstrates my [5 levels of analytics](https://javierforero.co/2026/01/26/analitica-datos-5-niveles/) framework in action: it describes, diagnoses, predicts, prescribes and converses.

> **Note:** the demo data is synthetic (a teaching example). It does not represent real clients or operations.

![View of the SLA compliance dashboard](docs/screenshot.png)

## The finding it monitors
Portfolio compliance falls from **~91% (2025) to ~84% in Q1 2026 (−7 pp)**, with an **abrupt breakpoint in January 2026** (−9 pp from one month to the next) that hits all 8 regions and all 4 customer types almost equally. That uniformity points to a **systemic** cause —or a change in measurement— rather than one stray route. The dashboard doesn't rediscover that figure: it watches it, defends it and turns it into a decision.

## What makes this dashboard different
- **It interprets, it doesn't just plot** (Smart Narratives generated from the data).
- **It diagnoses the breakpoint** with cause hypotheses and a verdict that **blocks escalation** until the cause is closed (my Consequences filter).
- **It governs the decision:** every indicator carries a **threshold · owner · decision**. A KPI with no owner doesn't make it into the dashboard.
- **It converses with the data** (Q&A tab): plain language, answers anchored to the figures, no hallucination.
- **It accepts your own data** (⤒ My data tab): upload a CSV or Excel with your route×month history and everything recalculates in your browser. The breakpoint is detected automatically.
- **It closes with a brief** DATA → IDEA → DECISION, exportable only after human validation.
- **Bilingual ES/EN** with a switcher in the top bar; the language persists across dashboards.
- **Own brand** (IgraSans, palette, light/dark theme) and it **works offline**.

## Design decisions (my judgement, made explicit)
Because *analytics doesn't fail for lack of models, it fails for lack of judgement*:
- **Breach metric = gap < −5 pp**, not < 0. With < 0 the KPI reads 100% (everything below target): a flat, useless signal. The −5 pp line is what is actionable.
- **No invented metrics.** Anything the dataset doesn't support is flagged as pending; it is not fabricated.
- **The projection is fragile on purpose.** There are only 3 post-breakpoint points; I frame it as a trend, not a promise.
- **Staleness is visible.** The demo data runs to Mar 2026: the dashboard warns when a “daily” alert is running on old data.
- **Automatic breakpoint detection.** With your own data, the threshold is a drop of ≥3 pp from one month to the next in the portfolio average. It is a declared convention, not a universal truth.

## Bring your own data
One row per **route × month**. The validator checks format and continuity before recalculating anything.

| Column | Format | Use |
|---|---|---|
| `Fecha` (or `Anio` + `Mes`) | YYYY-MM, dd/mm/yyyy or an Excel date | Required |
| `Ruta` | text | Required |
| `Cumplimiento_pct` | 0–100 (it accepts 0–1 and converts) | Required — alternative: `Entregas_Totales` + `Entregas_A_Tiempo` |
| `SLA_Objetivo_pct` | number | Optional (if missing, 95% is assumed) |
| `Region` · `Ciudad_Origen` · `Tipo_Cliente` | text | Optional — they enable filters and segmentation |

Rules: at least **6 continuous months** with no gaps at portfolio level and no duplicate route+month. It accepts `,` or `;` separators and comma decimals. **Everything is processed in your browser**: no data leaves your machine.

## Usage
- **Web:** `index.html` (Plotly via CDN, with multi-CDN fallback).
- **Offline:** open `dashboard-offline.html` by double-clicking, no internet needed. It carries Plotly embedded and excludes analytics on purpose.
- **Data:** `data/cumplimiento_sla_tidy.csv` (570 rows: 38 routes × 15 months). It is embedded in the HTML; the CSV is published purely for transparency and auditability.

## Technology
Vanilla HTML + CSS + JavaScript, no build step. [Plotly.js](https://plotly.com/javascript/) 2.35.2. The Q&A uses a deterministic local engine; the generative upgrade needs a backend, so on GitHub Pages the local engine answers.

The bilingual system uses a single ES→EN map with Spanish as the key. The switcher writes `jf-lang` to `localStorage` and reflects the language in the URL (`?lang=en`), so a shared link keeps its language.

---
**Javier Forero** · [javierforero.co](https://javierforero.co) · [LinkedIn](https://www.linkedin.com/in/jforero/)
