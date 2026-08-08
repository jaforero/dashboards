[Español](README.md) · **English**

# Demonstration cases · Financial Pulse

Four datasets ready to load into the dashboard (the **⤒ My data** tab), each telling a different story. Everything is processed locally in your browser: no file leaves your machine.

| File | Story | What it demonstrates |
|---|---|---|
| `Dataset_FinanzasIA_Simple.xlsx` | **Warning** — growth cooling off and margin eroding (36 months, 2022–2024, simulated) | Deterioration diagnosis and governance alerts |
| `Dataset_Finanzas_Recuperacion_Demo.xlsx` | **Turnaround** — decline → efficiency + repricing → recovery with a 32% margin and 1.6× liquidity (36 months, 2023–2026, simulated with internal consistency) | The inflection point, the price-volume bridge and optimistic scenarios |
| `Caso_Real_TSMC.xlsx` | **Real monthly case** — TSMC and the AI supercycle: +30.6% with margin expanding to 64% (Jul-2023 → Jun-2026) | Real public data: official monthly revenue (TWSE) + quarterly gross margin (SEC 6-K) monthlyised with a declared method. The cash and liquidity layers are deliberately left off because no public monthly figure exists. Sources with URLs on the file's “Fuentes” sheet. |
| `Caso_Real_Apple_Trimestral.xlsx` | **Real quarterly case** — Apple, 50 quarters (Q1-2014 → Q2-2026) | That the dashboard detects the frequency and **reconfigures the whole seasonal machinery** (period 4 instead of 12): moving averages, Holt-Winters, Fourier harmonics and the SARIMA lags. |

## Upload format

The contract is minimal: **the period in the first column**, then whatever metrics you like.

- **Monthly**: `YYYY-MM` (it also accepts `dd/mm/yyyy` or an Excel date).
- **Quarterly**: `YYYY-QX` (also `2024-T1`, `Q1-2024`, `1T2024`).
- **Required**: period + revenue + (costs or margin; whichever is missing is derived).
- **Optional**: cash flow, units, average price, current assets and current liabilities. Each one enables its layer.

You don't need helper columns for year, month or month name — the dashboard derives them. On validation it tells you which columns it recognised and which it ignored.

## Suggested demo script

1. **Simple** — the warning story: the verdict picks up the cooling.
2. **Recovery** — the success story: the same engine tells the opposite tale.
3. **TSMC** — a verifiable real case, with auditable sources.
4. **Apple** — switch to quarterly and watch the axis change to `Q1…Q4` and the recommended model change with it.

The contrast between verdicts is the proof that the dashboard **interprets** rather than merely plotting.

> The first three files use different scales (millions, NT$ billions). The dashboard stays consistent as long as every monetary column within a single file uses the same unit.
