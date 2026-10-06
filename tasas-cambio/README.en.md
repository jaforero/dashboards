[Español](README.md) · **English**

# Official exchange rates · Mexico, Colombia, Argentina and Brazil

[![Live explainer](https://img.shields.io/badge/explainer-live-4e00ff)](https://dashboards.javierforero.co/tasas-cambio/?lang=en)
[![MIT licence](https://img.shields.io/badge/licence-MIT-041c59)](../LICENSE)
[![Plotly.js](https://img.shields.io/badge/Plotly.js-2.35.2-0048ff)](https://plotly.com/javascript/)
[![Bilingual](https://img.shields.io/badge/ES%20%C2%B7%20EN-bilingual-7c4dff)](https://dashboards.javierforero.co/tasas-cambio/?lang=en)

The question it answers: **how much is each currency worth against the others today, and how far is it from its recent behaviour?** It is built for anyone who converts money or invoices between Mexico, Colombia, Argentina and Brazil.

> **Real data.** These are official rates from the Bank of Mexico, Colombia's Banco de la República, Argentina's central bank (BCRA) and the Central Bank of Brazil, read live from [`jaforero/fx-bancos-centrales`](https://github.com/jaforero/fx-bancos-centrales). They are reference rates, not transaction rates: a bank or an exchange bureau will apply its own margin. They do not constitute financial advice.

![Official central-bank exchange rates](assets/og-image.png)

## What it shows
1. **Today.** A compact list with one row for each series flagged `primary` in the data contract, in two groups: official rates and *calculated* cross rates. Each row carries the country flag, the value with its unit (`quote_unit`), the change against the previous official record and its own date; if the source is late or down, the notice appears in the same row. Picking a row fills the panel next to it with the detail: full date, days since the figure, source status, cited source (or the cross-rate formula) and the value already published for a future day, if any. On mobile, the cross rates expand with a button.
2. **History.** Below the detail of the chosen rate: 1M · 3M · 1Y · 5Y · All ranges; a toggleable logarithmic scale. Weekends and holidays are drawn dotted, and four events are annotated with their change calculated from the data.
3. **Base 100.** The official US-dollar series start at 100 from the chosen date, so you can compare which currency depreciated most without the problem of different scales.
4. **Changes.** Against the previous record, over 30 days and year to date, always using official values only.
5. **Converter.** Between the currencies that appear in the pairs. It shows the date of the rate used and whether that rate is official or calculated.
6. **Methodology and sources.** Sources, cross-rate methodology, how to read the rates, the source of each series and the legal notice.

## Design decisions
- **No server and no copy of the data.** The page reads `latest.json` and `rates_daily.json` straight from the data repository: `raw.githubusercontent.com` is the primary origin and `cdn.jsdelivr.net` the fallback. Each visit makes two data requests against the visitor's own quota.
- **The chart on the first screen.** The list of rates sits on the left and the detail with its history on the right. On a 1440×900 screen all 10 rates and the whole chart are visible without scrolling; at 1280×800, nearly all of the chart. On mobile, the 4 official rates fit on the first screen.
- **Flags to place each rate.** An official rate carries the flag of the country that publishes it (`source.country` in the contract); a cross rate carries both, in pair order (MXN-COP: Mexico and Colombia). They are simplified inline SVGs with no downloads; the only fixed mapping is USD → United States, and a country without a drawing shows its ISO code.
- **KPIs first.** `latest.json` (about 6 KB) paints the list and `rates_daily.json` loads afterwards. Plotly (the *cartesian* bundle, a third of the full size) downloads only when the chart comes into view: immediately on desktop, on scroll on mobile. Anyone who only checks the rates never pays for the library.
- **No hand-written figures.** Values, dates, changes, events and reading notes all come from the JSON files. The only fixed lists are the bilingual names by series id (`SERIES_TR`) and the date and series of the four events.
- **A new country appears on its own.** The list, the detail, base 100, table and converter are built from `primarySeriesIds()` and the `pair` field. The default log scale is decided from the data (historical range ≥ 3×); today that matches exactly the pairs that include ARS.
- **Rates with two decimal places.** Rate figures show two decimals; in the list, the detail and the tables the decimals are smaller so the integer part reads first. The full official value appears in each figure's tooltip and is the one used by the converter and every change calculation.
- **Never hide a figure.** A series with an error shows its last value with a red notice, and the cross rates that depend on it are flagged too.

## States
| Situation | What it shows |
|---|---|
| A delayed series (`stale`) | The value with an amber notice, “No publication since {date}” |
| A series with an error (`error:*`) | The last value with a red notice, “Source unavailable” (technical detail in the tooltip); dependent cross rates are flagged too |
| Primary origin down | Loads from jsDelivr; the footer shows the origin |
| No network | The last data saved in the browser, with the notice “Showing data saved on {date}” |
| A contract other than `schema_version` 1.x | Rejected; cached data with a notice and a GA4 `fx_contract_error` event |
| `rates_daily.json` fails | The list stays visible; the charts show a message and a Retry button |

## Files
| File | Role |
|---|---|
| `index.html` | The page: HTML, CSS and JS in a single file |
| `fx-data.js` | Dependency-free data layer: network with timeout and fallback, contract validation, cache, and date and format helpers |
| `assets/og-image.png` | 1200×630 social image |

## Sources
Bank of Mexico (SIE, FIX exchange rate) · Banco de la República de Colombia (SDMX service, TRM certified by the Financial Superintendence; datos.gov.co for verification and fallback) · Central Bank of the Argentine Republic (Exchange Statistics API, Communication A 3500) · Central Bank of Brazil (PTAX API, selling rate). Data processed at [`github.com/jaforero/fx-bancos-centrales`](https://github.com/jaforero/fx-bancos-centrales).

No central bank publishes rates between currencies other than the US dollar (MXN-COP, MXN-ARS, ARS-COP and the BRL pairs): they are calculated by dividing two official US-dollar rates formed on the same market day.

## Analytics
GA4 `G-MQ3K8EVKV0` with `content_group: 'tasas-cambio'`. Events: `fx_pair_select`, `fx_range_select`, `fx_convert`, `fx_load_error`, `fx_contract_error`, `lang_switch` and `theme_switch`.

## Usage
Open `https://dashboards.javierforero.co/tasas-cambio/?lang=en`. The language (`jf-lang`) and the light or dark theme (`jf-theme`) are shared with the rest of the portfolio.
