# Cost of Living in Colombia

Interactive map of the cost of a basic basket across **23 cities and metropolitan areas**
in Colombia. Color = cost index (100 = average city). Circle size = the domain's urban
population. Color covers the full territory of the metro area; the dot marks the capital.

**Cut-off date:** 17 September 2026 · single file, no external dependencies beyond the
embedded typeface.

## What it measures

DANE's monetary poverty line by geographic domain (2025), in current pesos per capita per
month. It is a **proxy**: the cost of a basic basket for a low-income household, not the
cost of living of an average household. Between extremes there is 62 % in this index;
DANE's Spatial Price Deflator, which compares pure prices, finds 20 %. **Read the ranking,
not the magnitude.**

## Data

| File | Contents |
|---|---|
| `data/archivo_a_nivel_precios_poblacion.csv` | 23 rows: index, pesos, population, coordinates |
| `data/archivo_b_ipc_mensual.csv` | 792 rows: monthly CPI by city, 36 months |
| `data/areas_metropolitanas.csv` | Municipal composition of the 7 metro domains |
| `data/cobertura_cruce.csv` | Price-level ↔ CPI crosswalk by `codigo_divipola` |
| `data/contraste_dep_dane.csv` | Contrast against the Spatial Price Deflator |
| `data/fuentes_inventario.csv` | Source inventory with verdict and URL |
| `data/notas_metodologicas.md` | Assumptions, limits and cut-off date (Spanish) |

## Sources

DANE — Monetary poverty 2025 · Municipal population projections by area (2018 census) ·
CPI city annex, August 2026 · DIVIPOLA · National Geostatistical Framework 2018 ·
GEIH methodological note for metro-area composition.
