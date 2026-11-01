**Español** · [English](README.en.md)

# Población oficial de América Latina

Pieza de divulgación con datos públicos reales: [dashboards.javierforero.co/poblacion-latam/](https://dashboards.javierforero.co/poblacion-latam/).

La pregunta que responde: **¿cuánta gente vive en la región, según quién tiene el mandato de contarla?** Muestra series anuales y proyecciones oficiales con mapa, serie por país, comparador base 100, crecimiento anual, año de máxima población y un panel de transparencia.

## Datos
No tiene servidor ni paso de build. Lee en vivo los JSON de [`jaforero/latam-population-official`](https://github.com/jaforero/latam-population-official) desde raw.githubusercontent.com, con respaldo en jsDelivr. Actualizar los datos no requiere commits aquí.

- **Regla de fuentes:** institución nacional primero; CEPAL/CELADE solo como respaldo declarado; ningún agregador. Lo que no se puede verificar queda pendiente, nunca rellenado.
- **Rupturas:** las uniones entre fuentes o vintages no se empalman. El crecimiento, el CAGR y el índice base 100 no las cruzan.
- **Trazabilidad:** cada cifra enlaza a su institución y a su archivo en `data/raw/`.

## Archivos
| Archivo | Papel |
|---|---|
| `index.html` | Estructura y estilos |
| `app.js` | Lógica y gráficos (Plotly 2.35.2 para series; SVG propio para mapa y gráficos pequeños) |
| `pop-data.js` | Acceso a datos, respaldo y caché; `PUBLISHED_DATA_DATE` es la fecha que se muestra si nada carga |
| `i18n-en.js` | Diccionario ES→EN (el español es la clave) |
| `latam-map.js` | Geometría de [Natural Earth](https://www.naturalearthdata.com/) (dominio público) |

Para revisar el mensaje de error sin caída real, abre la pieza con `?datos=prueba-error` en una ventana sin datos guardados.

Javier Forero · [javierforero.co](https://javierforero.co)
