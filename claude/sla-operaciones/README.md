**Español** · [English](README.en.md)

# Cumplimiento de SLA · Dashboard de Operaciones

[![Demo en vivo](https://img.shields.io/badge/demo-en%20vivo-4e00ff)](https://dashboards.javierforero.co/claude/sla-operaciones/)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-041c59)](../../LICENSE)
[![Plotly.js](https://img.shields.io/badge/Plotly.js-2.35.2-0048ff)](https://plotly.com/javascript/)
[![Bilingüe](https://img.shields.io/badge/ES%20%C2%B7%20EN-biling%C3%BCe-7c4dff)](https://dashboards.javierforero.co/claude/sla-operaciones/?lang=en)

Construí este tablero para responder una pregunta que veo repetirse en operaciones: **el SLA cayó — ¿y ahora qué hago con eso?** La mayoría de los dashboards se quedan en el gráfico. Este llega hasta la decisión.

Es la pieza práctica del ejercicio *“Métricas y eficiencia operativa”* de mi método, y demuestra en vivo mi marco de los [5 niveles de la analítica](https://javierforero.co/2026/01/26/analitica-datos-5-niveles/): describe, diagnostica, predice, prescribe y conversa.

> **Nota:** los datos del demo son sintéticos (ejemplo de clase). No representan clientes ni operaciones reales.

![Vista del dashboard de cumplimiento de SLA](docs/screenshot.png)

## El hallazgo que monitorea
El cumplimiento del portafolio cae de **~91% (2025) a ~84% en Q1 2026 (−7 pp)**, con un **quiebre abrupto en enero 2026** (−9 pp de un mes a otro) que golpea a las 8 regiones y a los 4 tipos de cliente casi por igual. Esa uniformidad apunta a una causa **sistémica** —o a un cambio de medición—, no a una ruta suelta. El tablero no re-descubre esa cifra: la vigila, la defiende y la convierte en decisión.

## Qué hace distinto a este dashboard
- **Interpreta, no solo grafica** (Smart Narratives generadas desde los datos).
- **Diagnostica el quiebre** con hipótesis de causa y un veredicto que **bloquea el escalamiento** hasta cerrar la causa (mi filtro de Consecuencias).
- **Gobierna la decisión:** cada indicador lleva **umbral · dueño · decisión**. Un KPI sin dueño no entra al tablero.
- **Conversa con los datos** (pestaña Q&A): lenguaje natural, respuesta anclada a las cifras, sin alucinación.
- **Acepta tus propios datos** (pestaña ⤒ Mis datos): sube un CSV o Excel con tu histórico ruta×mes y todo se recalcula en tu navegador. El quiebre se detecta solo.
- **Cierra en un brief** DATA → IDEA → DECISIÓN, exportable solo tras la validación humana.
- **Bilingüe ES/EN** con selector en la barra superior; el idioma persiste entre tableros.
- **Marca propia** (IgraSans, paleta, tema claro/oscuro) y **funciona offline**.

## Decisiones de diseño (mi criterio, explícito)
Porque *la analítica no falla por falta de modelos, falla por falta de criterio*:
- **Métrica de breach = brecha < −5 pp**, no < 0. Con < 0 el KPI marca 100% (todo bajo meta): una señal plana e inútil. El −5 pp es lo accionable.
- **Sin métricas inventadas.** Lo que el dataset no soporta se marca como pendiente; no se fabrica.
- **La proyección es frágil a propósito.** Solo hay 3 puntos post-quiebre; la marco como tendencia, no como promesa.
- **Frescura visible.** El dato del demo llega a Mar 2026: el tablero avisa cuándo una alerta “diaria” corre sobre dato viejo.
- **Detección automática del quiebre.** Con datos propios, el umbral es una caída ≥3 pp de un mes al siguiente en el promedio del portafolio. Es una convención declarada, no una verdad universal.

## Trae tus propios datos
Una fila por **ruta × mes**. El validador revisa formato y continuidad antes de recalcular nada.

| Columna | Formato | Uso |
|---|---|---|
| `Fecha` (o `Anio` + `Mes`) | AAAA-MM, dd/mm/aaaa o fecha de Excel | Requerida |
| `Ruta` | texto | Requerida |
| `Cumplimiento_pct` | 0–100 (acepta 0–1 y convierte) | Requerida — alternativa: `Entregas_Totales` + `Entregas_A_Tiempo` |
| `SLA_Objetivo_pct` | número | Opcional (si falta, se asume 95%) |
| `Region` · `Ciudad_Origen` · `Tipo_Cliente` | texto | Opcionales — habilitan filtros y segmentación |

Reglas: mínimo **6 meses continuos** sin huecos a nivel portafolio y sin duplicados ruta+mes. Acepta separador `,` o `;` y decimales con coma. **Todo se procesa en tu navegador**: ningún dato sale de tu equipo.

## Uso
- **Web:** `index.html` (Plotly vía CDN, con respaldo multi-CDN).
- **Offline:** abre `dashboard-offline.html` con doble clic, sin internet. Lleva Plotly embebido y excluye la analítica a propósito.
- **Datos:** `data/cumplimiento_sla_tidy.csv` (570 filas: 38 rutas × 15 meses). Van embebidos en el HTML; el CSV se publica solo para transparencia y auditoría.

## Tecnología
HTML + CSS + JavaScript vanilla, sin build. [Plotly.js](https://plotly.com/javascript/) 2.35.2. El Q&A usa un motor local determinista; el *upgrade* generativo requiere backend, así que en GitHub Pages responde el motor local.

El sistema bilingüe usa un mapa único ES→EN donde el español es la clave. El selector escribe `jf-lang` en `localStorage` y refleja el idioma en la URL (`?lang=en`), de modo que un enlace compartido conserva el idioma.

---
**Javier Forero** · [javierforero.co](https://javierforero.co) · [LinkedIn](https://www.linkedin.com/in/jforero/)
