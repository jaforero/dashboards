**Español** · [English](README.en.md)

# Tasas de cambio oficiales · México, Colombia, Argentina y Brasil

[![Pieza en vivo](https://img.shields.io/badge/pieza-en%20vivo-4e00ff)](https://dashboards.javierforero.co/tasas-cambio/)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-041c59)](../LICENSE)
[![Plotly.js](https://img.shields.io/badge/Plotly.js-2.35.2-0048ff)](https://plotly.com/javascript/)
[![Bilingüe](https://img.shields.io/badge/ES%20%C2%B7%20EN-biling%C3%BCe-7c4dff)](https://dashboards.javierforero.co/tasas-cambio/?lang=en)

La pregunta que responde: **¿cuánto vale hoy cada moneda frente a las otras y qué tan lejos está de su comportamiento reciente?** Está pensada para quien convierte o factura entre México, Colombia, Argentina y Brasil.

> **Datos reales.** Son tasas oficiales de Banco de México, el Banco de la República de Colombia, el BCRA y el Banco Central do Brasil, leídas en vivo desde [`jaforero/fx-bancos-centrales`](https://github.com/jaforero/fx-bancos-centrales). Son tasas de referencia, no de transacción: un banco o una casa de cambio aplicará su propio margen. No constituyen asesoría financiera.

![Tasas de cambio oficiales de bancos centrales](assets/og-image.png)

## Qué muestra
1. **Hoy.** Una lista compacta con una fila por cada serie marcada `primary` en el contrato de datos, en dos grupos: tasas oficiales y cruzadas *calculadas*. Cada fila trae la bandera del país, el valor con su unidad (`quote_unit`), la variación frente al registro oficial anterior y su propia fecha; si la fuente está atrasada o caída, el aviso aparece en la misma fila. Al elegir una fila, el panel de al lado muestra el detalle: fecha completa, días desde el dato, estado de la fuente, fuente citada (o fórmula de la cruzada) y el valor ya publicado para un día futuro, si existe. En móvil, las cruzadas se despliegan con un botón.
2. **Histórico.** Debajo del detalle de la tasa elegida: rangos 1M · 3M · 1A · 5A · Todo; escala logarítmica activable. Los fines de semana y festivos se dibujan punteados y cuatro eventos aparecen anotados con su variación calculada sobre los datos.
3. **Base 100.** Las series oficiales contra el dólar parten de 100 desde la fecha elegida, para comparar cuál moneda se depreció más sin el problema de escalas distintas.
4. **Variaciones.** Frente al registro anterior, a 30 días y en lo que va del año, siempre solo con valores oficiales.
5. **Conversor.** Entre las monedas que aparecen en los pares. Indica la fecha de la tasa usada y si es oficial o calculada.
6. **Metodología y fuentes.** Fuentes, metodología de las cruzadas, cómo leer las tasas, la fuente de cada serie y el aviso legal.

## Decisiones de diseño
- **Sin servidor y sin copia de los datos.** La página lee `latest.json` y `rates_daily.json` directamente del repositorio de datos: `raw.githubusercontent.com` es el origen principal y `cdn.jsdelivr.net` el respaldo. Cada visita hace dos peticiones de datos con la cuota de cada visitante.
- **El gráfico en el primer pantallazo.** La lista de tasas va a la izquierda y el detalle con su histórico a la derecha. En una pantalla de 1440×900 se ven las 10 tasas y el gráfico completo sin desplazarse; en 1280×800, casi todo el gráfico. En móvil, las 4 tasas oficiales caben en la primera pantalla.
- **Banderas para ubicar cada tasa.** Una tasa oficial lleva la bandera del país que la publica (`source.country` del contrato); una cruzada lleva las dos, en el orden del par (MXN-COP: México y Colombia). Son SVG simplificados en línea, sin descargas; la única equivalencia fija es USD → Estados Unidos, y un país sin dibujo se muestra con su código ISO.
- **Primero los KPIs.** `latest.json` (unos 6 KB) pinta la lista y `rates_daily.json` carga después. Plotly (paquete *cartesian*, un tercio del tamaño del completo) se descarga solo cuando el gráfico entra en pantalla: en escritorio, de inmediato; en móvil, al bajar. Quien solo consulta las tasas no paga la librería.
- **Ninguna cifra escrita a mano.** Valores, fechas, variaciones, eventos y textos de lectura salen de los JSON. Las únicas listas fijas son los nombres bilingües por id de serie (`SERIES_TR`) y la fecha y la serie de los cuatro eventos.
- **Un país nuevo aparece solo.** La lista, el detalle, la base 100, la tabla y el conversor se construyen con `primarySeriesIds()` y el campo `pair`. La escala log por defecto se decide con los datos (rango histórico ≥ 3×); hoy coincide exactamente con los pares que incluyen ARS.
- **Tasas con dos decimales.** Las cifras de tasas se muestran con dos decimales; en la lista, el detalle y las tablas los decimales van en tamaño menor para leer primero la parte entera. El valor oficial con todos sus decimales aparece en el tooltip de cada cifra y es el que usan el conversor y todas las variaciones.
- **Nunca ocultar un dato.** Una serie con error muestra su último valor con un aviso rojo, y las cruzadas que dependen de ella también quedan marcadas.

## Estados
| Situación | Qué muestra |
|---|---|
| Una serie atrasada (`stale`) | Valor con aviso ámbar «Sin publicación desde {fecha}» |
| Una serie con error (`error:*`) | Último valor con aviso rojo «Fuente no disponible» (detalle técnico en el tooltip); las cruzadas dependientes también se marcan |
| Origen principal caído | Carga desde jsDelivr; el pie indica el origen |
| Sin red | Último dato guardado en el navegador con el aviso «Mostrando datos guardados del {fecha}» |
| Contrato distinto de `schema_version` 1.x | Se rechaza; caché con aviso y evento GA4 `fx_contract_error` |
| `rates_daily.json` falla | La lista sigue visible; los gráficos muestran un mensaje y un botón Reintentar |

## Archivos
| Archivo | Rol |
|---|---|
| `index.html` | La página: HTML, CSS y JS en un solo archivo |
| `fx-data.js` | Capa de datos sin dependencias: red con timeout y respaldo, validación del contrato, caché y utilidades de fechas y formato |
| `assets/og-image.png` | Imagen social 1200×630 |

## Fuentes
Banco de México (SIE, tipo de cambio FIX) · Banco de la República de Colombia (servicio SDMX, TRM certificada por la Superintendencia Financiera; datos.gov.co como verificación y respaldo) · Banco Central de la República Argentina (API Estadísticas Cambiarias, Comunicación A 3500) · Banco Central do Brasil (API PTAX, tasa de venta). Datos procesados en [`github.com/jaforero/fx-bancos-centrales`](https://github.com/jaforero/fx-bancos-centrales).

Las tasas entre monedas distintas del dólar (MXN-COP, MXN-ARS, ARS-COP y las de BRL) no las publica ningún banco central: se calculan dividiendo dos tasas oficiales contra el dólar formadas el mismo día de mercado.

## Analítica
GA4 `G-MQ3K8EVKV0` con `content_group: 'tasas-cambio'`. Eventos: `fx_pair_select`, `fx_range_select`, `fx_convert`, `fx_load_error`, `fx_contract_error`, `lang_switch` y `theme_switch`.

## Uso
Abre `https://dashboards.javierforero.co/tasas-cambio/` (`?lang=en` para inglés). El idioma (`jf-lang`) y el tema claro u oscuro (`jf-theme`) se comparten con el resto del portafolio.
