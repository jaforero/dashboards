**Español** · [English](README.en.md)

# Dashboards con IA · Javier Forero

Dos portafolios de **dashboards de decisión** construidos con IA bajo una misma dirección analítica: uno con **Claude**, otro con **ChatGPT Work**. No solo grafican: interpretan, diagnostican y convierten los datos en decisión.

**▶️ Home (selector de las dos IAs):** `https://dashboards.javierforero.co/`

Todo el sitio es **bilingüe ES/EN** con un selector único en la barra superior. El idioma elegido persiste entre tableros (`localStorage`) y se refleja en la URL (`?lang=en`), de modo que un enlace compartido conserva el idioma.

## Estructura
```
/                            → selector: elige portafolio (Claude · ChatGPT)
/claude/                     → hub del portafolio construido con Claude
/claude/sla-operaciones/     → Cumplimiento de SLA · Operaciones B2B
/claude/pulso-financiero/    → Pulso Financiero · Finanzas Corporativas
/claude/desempeno-comercial/ → Desempeño Comercial · Dirección B2B
/ia-compute/                 → Divulgación · La aceleración del cómputo en IA (1958–2026)
```
El portafolio de **ChatGPT Work** vive en un sitio externo: `https://javier-dashboards.jforero.chatgpt.site/` (su versión inglesa, en `/en`).

> Las URLs antiguas `/(sla-operaciones|pulso-financiero)/` redirigen automáticamente a su nueva ruta bajo `/claude/`, para no romper enlaces compartidos.

## Dos tipos de contenido — no confundirlos

Este repositorio aloja dos cosas con propósitos, datos y criterios de calidad distintos. La distinción es deliberada y debe permanecer visible para el visitante.

| | **Demo de consultoría** | **Pieza de divulgación** |
|---|---|---|
| **Ubicación** | `/claude/<caso>/` | raíz: `/<pieza>/` |
| **Datos** | Ficticios o anonimizados, construidos para el caso | Públicos, reales, con fuente citada y verificable |
| **Propósito** | Demostrar capacidad analítica y de producto ante un cliente potencial | Explicar un fenómeno y circular en abierto (LinkedIn, POVs) |
| **Interacción** | Filtros, carga de datos propios, Q&A, gobernanza de la decisión | Exploración de una sola narrativa; sin carga de datos |
| **Criterio de calidad** | Que la mecánica del tablero sea creíble y la decisión, accionable | Que **cada cifra sea trazable** a su fuente y su incertidumbre esté declarada |
| **Riesgo si se confunden** | Que un lector tome los datos ficticios por reales | Que un cliente la juzgue como demo incompleta por no tener filtros |

## Portafolio Claude · demos de consultoría
Datos de demostración, salvo donde se declara lo contrario. Ninguna cifra corresponde a un cliente real.

| Dashboard | Descripción | Enlace |
|---|---|---|
| **Cumplimiento de SLA · Operaciones B2B** | 8 capas, alertas, diagnóstico del quiebre, gobernanza, Q&A conversacional y brief exportable. **Sube tu propio SLA (CSV/XLSX)**: detección automática del quiebre, validación de continuidad mensual y recálculo completo en el navegador. | [`/claude/sla-operaciones/`](./claude/sla-operaciones/) |
| **Pulso Financiero · Finanzas Corporativas** | Crecimiento, margen, caja y liquidez con puente precio-volumen. **Cuatro modelos predictivos comparados a ciegas** (descomposición, Holt-Winters, regresión de Fourier y SARIMA) con validación de origen móvil y benchmark ingenuo. KPIs Inteligentes, gobernanza y brief exportable. **Tres orígenes de datos** (demo simulado · empresa real · tus propios datos), soporte **mensual y trimestral**, y exportación de resultados a Excel/CSV. | [`/claude/pulso-financiero/`](./claude/pulso-financiero/) |
| **Desempeño Comercial · Dirección B2B** | Ventas vs. meta por vendedor y región, diagnóstico del embudo que aísla el cuello de botella en Propuesta, pipeline ponderado por probabilidad empírica de cierre, predicción con backtest y Q&A conversacional determinista, con gobernanza de la decisión. | [`/claude/desempeno-comercial/`](./claude/desempeno-comercial/) |

## Divulgación · datos públicos verificables
Datos reales de fuentes citadas. Cada cifra declara su nivel de evidencia.

| Pieza | Descripción | Fuente | Enlace |
|---|---|---|---|
| **La aceleración del cómputo en IA · 1958–2026** | 68 años de cómputo de entrenamiento, de la neurona artificial de Rosenblatt a los modelos frontera de 2026. 72 modelos, cada uno con su **nivel de evidencia declarado** (publicado · confirmado · probable · especulativo · tendencia). Escala logarítmica, umbral de riesgo sistémico de la EU AI Act (10²⁶ FLOP) y contraste explícito con la Ley de Moore. | [Epoch AI](https://epoch.ai/data/ai-models) · CC BY | [`/ia-compute/`](./ia-compute/) |

## Metodología predictiva (Pulso Financiero)

No existe un modelo bueno para todas las series: existe el que menos se equivoca con la tuya. Por eso el tablero **compara cuatro modelos en cada serie** en vez de fijar uno:

| Modelo | Qué asume | Cuándo gana |
|---|---|---|
| **Descomposición** | Tendencia lineal + índice estacional estable | Series con tendencia limpia y estacionalidad regular |
| **Holt-Winters** | Nivel, tendencia y estacionalidad que se adaptan | Cuando el negocio cambia de ritmo |
| **Regresión estacional (Fourier)** | Ciclo anual como suma de armónicos; K elegido por AICc | Historia corta o ruidosa; pocos parámetros |
| **SARIMA (p,1,q)(P,1,Q)ₘ** | Memoria en los errores tras diferenciar | Series con inercia y arrastre |

**Protocolo de validación.** Cada modelo se re-entrena en varios cortes del tiempo (origen móvil) y predice a ciegas los periodos siguientes; los errores (MAPE, MAE, RMSE) se promedian y se contrastan con un **método ingenuo estacional**. Un modelo que no supera esa referencia no aporta valor, y el tablero lo dice.

**Limitación declarada.** Con historias cortas todos los criterios de selección son ruidosos: si dos modelos quedan a menos de ~0,5 puntos de MAPE, la diferencia puede no ser real. El rango mínimo-máximo entre cortes hace visible esa fragilidad.

## Cómo agregar contenido nuevo

**Demo de consultoría** (caso de negocio explorable):
1. Crea una carpeta hermana dentro de `claude/` (p. ej. `claude/inventario/`) con su propio `index.html`.
2. Duplica una tarjeta en `claude/index.html`; cambia título, descripción, chips y enlace.
3. Agrega la URL a `sitemap.xml` y una fila a la tabla de demos.
4. Marca los textos traducibles con `data-i18n` y añade sus pares al diccionario `TR`.
5. Commit + push. Queda en `https://dashboards.javierforero.co/claude/<carpeta>/`.

**Pieza de divulgación** (un argumento, datos públicos):
1. Crea la carpeta en la **raíz** (p. ej. `ia-compute/`) con su propio `index.html`.
2. Enlázala desde `claude/index.html` en su propia sección, **visualmente separada de las demos**, para que nadie confunda datos reales con datos de demostración.
3. Agrega la URL a `sitemap.xml` y una fila a la tabla de divulgación.
4. Verifica que `canonical`, `og:url`, `hreflang` y el `content_group` de GA4 apunten a la ruta de raíz.
5. Cada cifra publicada debe llevar fuente citada **en la propia página**, no solo en el README.

## Convenciones técnicas
- **Bilingüe**: un mapa único ES→EN por página, donde el español es la clave. El selector escribe `jf-lang` e `iac_lang` en `localStorage` para que el idioma persista en todo el portafolio. Cada página declara `hreflang` es/en/x-default.
- **Tipografía**: la única fuente disponible en el repo es `IgraSans.otf`, duplicada en `assets/fonts/` y `fonts/`. No existen versiones `.woff` ni `.woff2`. Las páginas nuevas deben declarar `@font-face` con `format('opentype')` y las cuatro rutas, o embeber la fuente en base64.
- **Nada de `rel=preload` para fuentes**: no admite lista de alternativas y produce un 404 en consola si la ruta cambia.
- **Imagen social**: `og-image.png` (1200×630) vive en la raíz y es genérica del sitio.
- **Analítica**: GA4 `G-MQ3K8EVKV0` en todas las páginas publicadas, con `content_group` propio para separarlas en los informes. Las versiones offline lo excluyen a propósito.
- **Cero alucinación en métricas**: toda cifra publicada debe ser trazable a una fuente citada. Un objetivo nunca se presenta como logro.

## Publicar (GitHub Pages)
Settings → Pages → *Deploy from a branch* → `main` / `/ (root)`. El `.nojekyll` y el `CNAME` ya están incluidos en la raíz.

## Autor
**Javier Forero** — [javierforero.co](https://javierforero.co) · [LinkedIn](https://www.linkedin.com/in/jforero/) · [GitHub](https://github.com/jaforero)

## Licencia
MIT (código). La tipografía IgraSans es de su titular y no forma parte de la licencia. Los datos de Epoch AI usados en `/ia-compute/` se distribuyen bajo Creative Commons BY.
