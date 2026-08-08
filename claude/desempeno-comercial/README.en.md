[Español](README.md) · **English**

# Sales Performance · B2B Leadership Dashboard

[![Live demo](https://img.shields.io/badge/demo-live-4e00ff)](https://dashboards.javierforero.co/claude/desempeno-comercial/?lang=en)
[![MIT licence](https://img.shields.io/badge/licence-MIT-041c59)](../../LICENSE)
[![Plotly.js](https://img.shields.io/badge/Plotly.js-2.35.2-0048ff)](https://plotly.com/javascript/)
[![Bilingual](https://img.shields.io/badge/ES%20%C2%B7%20EN-bilingual-7c4dff)](https://dashboards.javierforero.co/claude/desempeno-comercial/)

The question this answers isn't *“how much did we sell?”* but **“why did we miss target and where do I intervene?”** It turns sales, funnel and CRM into a prioritised portfolio of actions.

> **Note:** the data is for demonstration (simulated sales, funnel and CRM). It does not represent real clients or operations.

![View of the Sales Performance dashboard](docs/screenshot.png)

## The finding it monitors
June 2026 is the worst month on record: **$381.1K in revenue, 80.1% attainment, −13.2% against May** and **0 of 8 reps** above 90% of quota. It isn't an isolated stumble: aggregate attainment fell from 96.3% to 90.9% between half-years. The dashboard doesn't stop at the number — it points to where the leak is.

## The diagnosis that adds value
The open pipeline looks comfortable (**$1.62M, 3.4× the monthly target**), but weighted by the **empirical close probability of each stage** it is worth only **$308.5K — 0.6× one target**. That difference changes the decision: with a 6.2% win rate, the reflex to “pump in more leads” is expensive and ineffective.

The bottleneck is localised: **Proposal** is the only stage that deteriorates (−5.4 pp between the first and last half-year). Recovering 5 pp there multiplies closings without touching the top of the funnel.

**Consistency across systems.** The funnel's compound conversion (0.45 × 0.55 × 0.46 × 0.55 ≈ 6.3%) matches the win rate observed in the CRM (6.2%). Two independent sources telling the same story: out of every 100 prospects, roughly 6 close.

## Design decisions (my judgement, made explicit)
Because *analytics doesn't fail for lack of models, it fails for lack of judgement*:
- **Pipeline weighted by the funnel's own empirical probabilities**, not by arbitrary weights. It is more conservative and defensible before a committee that will ask where each percentage comes from.
- **The funnel isn't filtered by region.** The monthly funnel series has no such dimension, so the filter is hidden on that tab rather than offering a control that would lie.
- **The pipeline isn't filtered by date.** It is a snapshot of the current state of open opportunities, not a time series.
- **Forecasting with an honest backtest.** Holt with parameters tuned by validation; the MAPE is stated against the naïve model, with the caveat that 18 months don't cover two annual cycles, so **seasonality is not modelled**.
- **Deterministic Q&A.** Answers are computed over the data, with no free text generation: zero hallucination risk.
- **Governance with a rigour filter.** Before taking this to committee, the dashboard lists what to validate: calendar effects, the CRM's real definition of “opportunity”, and the opportunity cost of the account plan.

## Dashboard structure
Seven tabs: **Summary · Sales & Reps · Funnel · Pipeline & Risk · Forecasting · Governance · Q&A · AI**, with contextual filters that only appear where the data supports them.

## Usage
- **Web:** `index.html` (Plotly via CDN, with multi-CDN fallback).
- **Offline:** open `dashboard-offline.html` by double-clicking, no internet needed. It carries Plotly embedded and excludes analytics on purpose.
- **Data:** in `data/`. It is embedded in the HTML; the CSVs are published for transparency and auditability.

| File | Contents |
|---|---|
| `ventas_vendedor_mensual.csv` | 144 rows · 8 reps × 18 months: target, revenue, attainment and opportunities won |
| `funnel_conversion_mensual.csv` | 89 rows · 5 stages × 18 months: opportunities, advanced and conversion rate |
| `pipeline_crm_demo.csv` | 721 opportunities: customer, industry, region, lead source, rep, stage, value, status and cycle days |
| `diccionario_datos_comercial.csv` | Definition of every field |

## Technology
Vanilla HTML + CSS + JavaScript, no build step. [Plotly.js](https://plotly.com/javascript/) 2.35.2. The forecasting engine (Holt with parameter search and backtest) and the deterministic Q&A are implemented from scratch, so the dashboard remains a single self-contained file.

The bilingual system uses a single ES→EN map with Spanish as the key. The switcher writes `jf-lang` to `localStorage` and reflects the language in the URL (`?lang=en`).

---
**Javier Forero** · [javierforero.co](https://javierforero.co) · [LinkedIn](https://www.linkedin.com/in/jforero/)
