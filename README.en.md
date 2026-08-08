[Español](README.md) · **English**

# AI Dashboards · Javier Forero

Two portfolios of **decision dashboards** built with AI under a single analytical direction: one with **Claude**, the other with **ChatGPT Work**. They don't just plot: they interpret, diagnose and turn data into decisions.

**▶️ Home (pick one of the two AIs):** `https://dashboards.javierforero.co/`

The whole site is **bilingual ES/EN** with a single switcher in the top bar. The chosen language persists across dashboards (`localStorage`) and is reflected in the URL (`?lang=en`), so a shared link keeps its language.

## Structure
```
/                            → selector: choose a portfolio (Claude · ChatGPT)
/claude/                     → hub for the portfolio built with Claude
/claude/sla-operaciones/     → SLA Compliance · B2B Operations
/claude/pulso-financiero/    → Financial Pulse · Corporate Finance
/claude/desempeno-comercial/ → Sales Performance · B2B Leadership
/ia-compute/                 → Explainer · The acceleration of AI compute (1958–2026)
```
The **ChatGPT Work** portfolio lives on an external site: `https://javier-dashboards.jforero.chatgpt.site/` (its English version at `/en`).

> The old URLs `/(sla-operaciones|pulso-financiero)/` redirect automatically to their new path under `/claude/`, so shared links don't break.

## Two kinds of content — don't conflate them

This repository hosts two things with different purposes, data and quality bars. The distinction is deliberate and must stay visible to the visitor.

| | **Consulting demo** | **Public explainer** |
|---|---|---|
| **Location** | `/claude/<case>/` | root: `/<piece>/` |
| **Data** | Fictional or anonymised, built for the case | Public, real, with a cited and verifiable source |
| **Purpose** | Demonstrate analytical and product capability to a prospective client | Explain a phenomenon and circulate openly (LinkedIn, POVs) |
| **Interaction** | Filters, bring-your-own-data, Q&A, decision governance | Exploring a single narrative; no data upload |
| **Quality bar** | That the dashboard's mechanics are credible and the decision actionable | That **every figure is traceable** to its source and its uncertainty is stated |
| **Risk if conflated** | A reader takes fictional data for real | A client judges it an incomplete demo because it has no filters |

## Claude portfolio · consulting demos
Demonstration data, except where stated otherwise. No figure corresponds to a real client.

| Dashboard | Description | Link |
|---|---|---|
| **SLA Compliance · B2B Operations** | 8 layers, alerts, breakpoint diagnosis, governance, conversational Q&A and an exportable brief. **Upload your own SLA data (CSV/XLSX)**: automatic breakpoint detection, monthly continuity validation and a full recalculation in the browser. | [`/claude/sla-operaciones/`](./claude/sla-operaciones/) |
| **Financial Pulse · Corporate Finance** | Growth, margin, cash and liquidity with a price-volume bridge. **Four forecasting models compared blind** (decomposition, Holt-Winters, Fourier regression and SARIMA) with rolling-origin validation and a naïve benchmark. Smart KPIs, governance and an exportable brief. **Three data sources** (simulated demo · real company · your own data), **monthly and quarterly** support, and results export to Excel/CSV. | [`/claude/pulso-financiero/`](./claude/pulso-financiero/) |
| **Sales Performance · B2B Leadership** | Revenue vs. target by rep and region, a funnel diagnosis that isolates the bottleneck at Proposal, a pipeline weighted by empirical close probability, backtested forecasting and deterministic conversational Q&A, with decision governance. | [`/claude/desempeno-comercial/`](./claude/desempeno-comercial/) |

## Explainers · verifiable public data
Real data from cited sources. Every figure states its level of evidence.

| Piece | Description | Source | Link |
|---|---|---|---|
| **The acceleration of AI compute · 1958–2026** | 68 years of training compute, from Rosenblatt's artificial neuron to the frontier models of 2026. 72 models, each with its **stated level of evidence** (published · confirmed · likely · speculative · trend). Logarithmic scale, the EU AI Act systemic-risk threshold (10²⁶ FLOP) and an explicit contrast with Moore's Law. | [Epoch AI](https://epoch.ai/data/ai-models) · CC BY | [`/ia-compute/`](./ia-compute/) |

## Forecasting methodology (Financial Pulse)

There is no model that is good for every series: there is the one that gets it least wrong on *yours*. That is why the dashboard **compares four models on each series** instead of fixing one:

| Model | What it assumes | When it wins |
|---|---|---|
| **Decomposition** | Linear trend + a stable seasonal index | Series with a clean trend and regular seasonality |
| **Holt-Winters** | Level, trend and seasonality that adapt | When the business changes pace |
| **Seasonal regression (Fourier)** | The annual cycle as a sum of harmonics; K chosen by AICc | Short or noisy history; few parameters |
| **SARIMA (p,1,q)(P,1,Q)ₘ** | Memory left in the errors after differencing | Series with inertia and carry-over |

**Validation protocol.** Each model is retrained at several splits in time (rolling origin) and forecasts the following periods blind; the errors (MAPE, MAE, RMSE) are averaged and contrasted against a **seasonal naïve method**. A model that cannot beat that benchmark adds no value, and the dashboard says so.

**Stated limitation.** With short histories every selection criterion is noisy: if two models sit within ~0.5 MAPE points, the difference may not be real. The min-max range across splits makes that fragility visible.

## How to add new content

**Consulting demo** (an explorable business case):
1. Create a sibling folder inside `claude/` (e.g. `claude/inventory/`) with its own `index.html`.
2. Duplicate a card in `claude/index.html`; change the title, description, chips and link.
3. Add the URL to `sitemap.xml` and a row to the demos table.
4. Mark translatable text with `data-i18n` and add its pairs to the `TR` dictionary.
5. Commit + push. It goes live at `https://dashboards.javierforero.co/claude/<folder>/`.

**Explainer** (one argument, public data):
1. Create the folder at the **root** (e.g. `ia-compute/`) with its own `index.html`.
2. Link it from `claude/index.html` in its own section, **visually separated from the demos**, so nobody mistakes real data for demonstration data.
3. Add the URL to `sitemap.xml` and a row to the explainers table.
4. Check that `canonical`, `og:url`, `hreflang` and the GA4 `content_group` point to the root path.
5. Every published figure must carry a cited source **on the page itself**, not only in the README.

## Technical conventions
- **Bilingual**: one ES→EN map per page, with Spanish as the key. The switcher writes `jf-lang` and `iac_lang` to `localStorage` so the language persists across the whole portfolio. Every page declares `hreflang` es/en/x-default.
- **Typography**: the only font available in the repo is `IgraSans.otf`, duplicated in `assets/fonts/` and `fonts/`. There are no `.woff` or `.woff2` versions. New pages must declare `@font-face` with `format('opentype')` and all four paths, or embed the font as base64.
- **No `rel=preload` for fonts**: it doesn't accept a fallback list and produces a 404 in the console if the path changes.
- **Social image**: `og-image.png` (1200×630) lives at the root and is generic to the site.
- **Analytics**: GA4 `G-MQ3K8EVKV0` on every published page, each with its own `content_group` so they can be separated in reports. Offline versions exclude it on purpose.
- **Zero metric hallucination**: every published figure must be traceable to a cited source. A target is never presented as an achievement.

## Publishing (GitHub Pages)
Settings → Pages → *Deploy from a branch* → `main` / `/ (root)`. The `.nojekyll` and `CNAME` files are already at the root.

## Author
**Javier Forero** — [javierforero.co](https://javierforero.co) · [LinkedIn](https://www.linkedin.com/in/jforero/) · [GitHub](https://github.com/jaforero)

## Licence
MIT (code). The IgraSans typeface belongs to its owner and is not covered by the licence. The Epoch AI data used in `/ia-compute/` is distributed under Creative Commons BY.
