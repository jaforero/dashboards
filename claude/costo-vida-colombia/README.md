# Costo de Vida en Colombia

Mapa interactivo del costo de una canasta básica en **23 ciudades y áreas metropolitanas**
colombianas. Color = índice de costo (base 100 = ciudad promedio). Tamaño del círculo =
población urbana del dominio. El color cubre el territorio completo del área metropolitana;
el punto marca la capital.

**Fecha de corte:** 17 de septiembre de 2026 · archivo único, sin dependencias externas salvo
la tipografía.

## Qué mide

La línea de pobreza monetaria por dominio geográfico del DANE (2025), en pesos corrientes per
cápita/mes. Es un **proxy**: el costo de una canasta básica para un hogar de bajos ingresos, no
el costo de vida de un hogar promedio. Entre extremos hay 62 % en este índice; el Deflactor
Espacial de Precios del DANE, que compara precios puros, encuentra 20 %. **Lea el orden, no la
magnitud.**

## Datos

| Archivo | Contenido |
|---|---|
| `data/archivo_a_nivel_precios_poblacion.csv` | 23 filas: índice, pesos, población, coordenadas |
| `data/archivo_b_ipc_mensual.csv` | 792 filas: IPC mensual por ciudad, 36 meses |
| `data/areas_metropolitanas.csv` | Composición municipal de los 7 dominios A.M. |
| `data/cobertura_cruce.csv` | Cruce nivel ↔ IPC por `codigo_divipola` |
| `data/contraste_dep_dane.csv` | Contraste contra el Deflactor Espacial de Precios |
| `data/fuentes_inventario.csv` | Inventario de fuentes con veredicto y URL |
| `data/notas_metodologicas.md` | Supuestos, límites y fecha de corte |

## Fuentes

DANE — Pobreza monetaria 2025 · Proyecciones de población municipal por área (CNPV 2018) ·
IPC anexo de ciudades, agosto 2026 · DIVIPOLA · Marco Geoestadístico Nacional 2018 ·
nota metodológica de la GEIH para la composición de las áreas metropolitanas.

## Pendiente

Capa bilingüe ES/EN, para alinearse con el resto del portafolio.
