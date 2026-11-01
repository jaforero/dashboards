[Español](README.md) · **English**

# Official population of Latin America

An explainer built on real public data: [dashboards.javierforero.co/poblacion-latam/](https://dashboards.javierforero.co/poblacion-latam/?lang=en).

The question it answers: **how many people live in the region, according to those mandated to count them?** It shows official annual series and projections in tabs: the regional total of the 20 countries, a map, a country series, population pyramids, a base-100 index, growth, peak-population year and sources. The region is the reference in every comparison. Each tab has a direct link: `#region`, `#mapa`, `#pais`, `#piramides`, `#indice`, `#crecimiento`, `#maximo` and `#fuentes`.

## Data
There is no server or build step. It reads the JSON files of [`jaforero/latam-population-official`](https://github.com/jaforero/latam-population-official) live from raw.githubusercontent.com, with a jsDelivr backup. Updating the data requires no commits here.

- **Source rule:** national institution first; ECLAC/CELADE only as a declared fallback; no aggregators. What cannot be verified stays pending, never filled in.
- **Breaks:** joins between sources or vintages are not spliced. Growth, CAGR and the base-100 index do not cross them.
- **Traceability:** every figure links to its institution and to its file in `data/raw/`.
- **Region:** `region.json` arrives calculated from the data repository; here it is only drawn. There is a total only in years with all 20 countries and a regional pyramid only if all 20 publish. If the file is missing or empty, the page keeps working without the region.
- **Licences:** the page shows each source's terms and citation from `data/processed/licenses.json`. Each figure keeps its source's conditions.

## Files
| File | Role |
|---|---|
| `index.html` | Structure and styles |
| `app.js` | Logic and charts (Plotly 2.35.2 for series; custom SVG for the map and small multiples) |
| `pop-data.js` | Data access, backup and cache; `PUBLISHED_DATA_DATE` is the date shown if nothing loads |
| `i18n-en.js` | ES→EN dictionary (Spanish is the key) |
| `latam-map.js` | [Natural Earth](https://www.naturalearthdata.com/) geometry (public domain) |

To review the error message without a real outage, open the piece with `?datos=prueba-error` in a window with no saved data.

Javier Forero · [javierforero.co](https://javierforero.co)
