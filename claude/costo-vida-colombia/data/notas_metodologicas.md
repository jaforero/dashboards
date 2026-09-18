# Notas metodológicas — Dataset comparativo de costo de vida por ciudad, Colombia

**Fecha de corte:** 18 de septiembre de 2026 (v4 — serie anual 2021-2025 y mejoras del mapa)
**Unidad de análisis:** municipio (llave: `codigo_divipola`)
**Uso previsto:** mapa de símbolos georreferenciados. Color = índice de costo; tamaño = población.
**Audiencia:** público general con alfabetización de datos.

---

## 0. Estado de completitud

La v1 se construyó en un entorno cuya política de egreso bloquea la descarga programática de
`www.dane.gov.co`, y cuyo lector de páginas no parsea `.xlsx`; todo lo que el DANE publica solo
en Excel quedó como `DATO REQUERIDO`, nunca estimado. En la v2 el usuario proveyó los anexos
directamente y se procesaron con `scripts/03_rellenar_desde_anexos.py`.

| Campo | Estado v2 | Origen |
|---|---|---|
| `poblacion` (23 filas) | **Completo** | `PPED-AreaMun-2018-2042_VP.xlsx`, hoja `PobMunicipalxÁrea` |
| `var_mensual` (792 celdas) | **Completo** | `anex-IPC-CiudadesMensuales-ago2026.xlsx`, hoja `VarCiudades` |
| `var_anual` (792 celdas) | **Completo, derivado** | Encadenado de 12 variaciones mensuales; validado (ver §4) |
| `ipc_indice_base2018` (792 celdas) | **Completo, derivado** | Encadenado desde dic-2018 = 100; **no publicado por ciudad** (ver §4) |
| Índice ponderado y cobertura | **Calculado** | Ver §7 |

No queda ninguna celda en `DATO REQUERIDO` dentro de los archivos. Lo que sigue abierto son
verificaciones, no datos faltantes: ver §9.

---

## 1. Inventario de fuentes

Detalle completo y citable en `fuentes_inventario.csv`. Resumen:

| Fuente | Ciudades | Último año | ¿Comparable como NIVEL? | Veredicto |
|---|---|---|---|---|
| **Líneas de pobreza por dominio** (DANE) | 23 + resto urbano + rural | **2025** (pub. 12-jun-2026) | Sí, por diseño — con reservas | **Base del índice** |
| **Deflactor Espacial de Precios — DEP** (DANE) | 23 + resto urbano + rural | ENPH **2016-2017** | Sí, es un índice espacial de precios | **Contraste / validación** |
| Índice de Costo de Vida Comparativo (Banrep) | Principales ciudades | **2005** | Sí en su momento | Descartada: 21 años |
| ENPH (DANE) | 32 ciudades + 6 municipios | 2016-2017 | **No** — mide gasto, no precios | Descartada para nivel |
| IPVN (DANE) | Áreas urbanas y metropolitanas | II trim 2026 | **No** — número índice | Descartada para nivel |
| IPVU (Banrep) | 13 ciudades/municipios | `DATO REQUERIDO` | **No** — número índice | Descartada para nivel |
| Numbeo | Variable | Continuo | **No** con estándar publicable | Descartada |
| IPC (DANE) | 38 en muestra; **22 publicadas** | **agosto 2026** | **No** — mide variación | Solo Archivo B |

### Por qué se descartó cada una

- **ENPH.** Mide *gasto*, no precios. Una ciudad con ingresos altos gasta más aunque sus
  precios sean bajos. Usar gasto como nivel de precios confunde poder adquisitivo con
  carestía. Su valor real aquí es indirecto: es el insumo del DEP y de las ponderaciones
  del IPC. La próxima ronda está prevista hacia 2026-2027 y **cambiaría la respuesta**.
- **IPVN e IPVU.** Son números índice con base propia. Que Cali y Montería tengan ambas
  índice 130 no significa que un metro cuadrado cueste lo mismo. No publican nivel en pesos
  por m². El IPVU además se construye con avalúos de créditos hipotecarios, lo que lo sesga
  al segmento financiado formal.
  *Verificado sobre el archivo, no sobre la página:* `anex-IPVN-IItrim2026.xlsx` tiene cuatro
  hojas — variación trimestral/año corrido/anual por destinos, por áreas metropolitanas, por
  estrato según municipios, y total de obras. **Ninguna trae precio en pesos por m².** El
  descarte se confirma con el anexo en mano.
- **Numbeo.** Muestra autoseleccionada, sin marco muestral, sin control de especificación
  del bien, con tamaño de muestra por ciudad no auditable y variable en el tiempo. No es
  reproducible ni citable, y sus términos de uso restringen la redistribución. Para un mapa
  público con vocación de fuente, es un riesgo reputacional sin contrapartida.
- **ICVC del Banco de la República (2005).** Metodológicamente es el antecedente correcto
  — Julio E. Romero-Prieto construyó justamente un deflactor regional comparable — pero no
  se actualizó nunca. Se conserva un dato suyo como referencia de magnitud: reportó **~26 %
  entre la ciudad más cara y la más barata**. Esa cifra se usa más abajo como contraste.

---

## 2. Decisión metodológica

**Fuente base:** línea de pobreza monetaria por dominio geográfico, DANE, **2025**, en pesos
corrientes per cápita mensuales.

**Canasta:** la canasta de pobreza de cada dominio — alimentos (canasta normativa de ~36
artículos por ciudad urbana) escalados por un coeficiente de Orshansky específico de cada
dominio, que incorpora el gasto no alimentario.

**Base 100:** **promedio simple de las 23 ciudades cubiertas = 100**, es decir
$550.714 per cápita/mes en 2025.

**General, no desagregado por componentes.** La línea de pobreza es un escalar; el DANE no
publica su descomposición por división de gasto a nivel de ciudad. Un índice desagregado
(vivienda, alimentos, transporte) exigiría microdatos de precios que el DANE no difunde.

### Por qué el promedio simple y no Bogotá = 100 ni el promedio ponderado

- **Bogotá = 100** es la base del DEP y es defendible, pero ancla la lectura en una ciudad
  atípica y obliga a que 22 de 23 ciudades aparezcan "por debajo".
- **Promedio ponderado por población = 100** lo dominaría Bogotá (que aporta cerca de un
  tercio de la población de las 23 ciudades), así que sería casi "Bogotá = 100" con más pasos.
- **Promedio simple = 100** significa "la ciudad promedio del mapa", que es lo que un lector
  general asume al ver 100. Además deja el agregado ponderado (sección 7) como una cifra
  *informativa* y no como una tautología igual a 100.

Esto se aparta del MERIC/C2ER, cuya base es el promedio de las áreas urbanas participantes
(ver sección 3).

### Declaración de proxy

> **Este índice es un proxy, no un índice de costo de vida.** Mide cuántos pesos mensuales
> necesita una persona para superar la línea de pobreza en cada ciudad. Es una medida de
> *costo de una canasta básica para un hogar de bajos ingresos*, no del costo de vida de un
> hogar promedio ni de uno de clase media. En el mapa debe rotularse así, no como
> "costo de vida".

### En qué difiere del índice MERIC (C2ER) de Estados Unidos

| | Este índice (Colombia) | COLI de C2ER (difundido por MERIC) |
|---|---|---|
| Objeto | Umbral de pobreza monetaria | Índice de costo de vida |
| Hogar de referencia | Población de referencia de bajos ingresos | Hogares **profesionales y ejecutivos** |
| Canasta | Canasta normativa de pobreza, **diferenciada por ciudad** | **60 bienes y servicios**, especificación estandarizada idéntica en todos los lugares |
| Componentes | No desagregado públicamente | 6 categorías: alimentos, **vivienda**, servicios públicos, transporte, salud, misceláneos |
| Vivienda | Entra solo de forma implícita, vía el coeficiente de Orshansky | Categoría explícita y la de mayor peso |
| Recolección | Encuesta de hogares + IPC | Precios recolectados en sitio con especificación estándar |
| Base | Promedio simple de 23 ciudades = 100 | Promedio de las áreas urbanas participantes = 100 (`DATO REQUERIDO`: valor y ponderaciones exactas de categoría, en el manual COLI, no accesible) |
| Cobertura | Censal sobre las 23 ciudades del dominio | Solo ciudades que **eligen participar** |
| Frecuencia | Anual | Trimestral |

**La diferencia que más importa para el mapa:** el COLI prescribe el *mismo* bien en todas
las ciudades, así que su variación entre ciudades es precio puro. Aquí la canasta **cambia
de ciudad a ciudad por diseño del DANE**, de modo que parte de la diferencia entre ciudades
no es precio sino composición de consumo. Ver sección 6.

---

## 3. Archivo A — nivel de precios y población

`archivo_a_nivel_precios_poblacion.csv` — 23 filas, una por ciudad.

| Columna | Contenido | Fuente |
|---|---|---|
| `ciudad` | Nombre normalizado, sin el sufijo "A.M." | — |
| `codigo_divipola` | Código de 5 dígitos. **Llave de unión** | DIVIPOLA |
| `departamento` | Nombre del departamento | DIVIPOLA |
| `lat`, `lon` | Punto de la **cabecera municipal**, 6 decimales | DIVIPOLA geolocalizado |
| `anio` | 2025 | — |
| `valor_pesos` | Línea de pobreza monetaria, pesos corrientes per cápita/mes | DANE |
| `indice_base100` | `valor_pesos / 550714 × 100` | Calculado |
| `poblacion` | Cabecera municipal, 2025 | **`DATO REQUERIDO`** |
| `fuente_url` | `pres-PM-2025.pdf` | — |
| `fuente_poblacion_url` | `PPED-AreaMun-2018-2042_VP.xlsx` | — |

**Coordenadas.** No están escritas a mano. Salen de la consulta
`https://www.datos.gov.co/resource/gdxc-w37w.csv?$where=cod_mpio like '%001'`
sobre el conjunto *DIVIPOLA – Códigos municipios* del portal nacional de datos abiertos,
descrito como "Código de la división Político Administrativa del país, actualización a corte
30 diciembre 2024". El origen trae separador decimal coma; se convirtió a punto.

> **Salvedad cerrada (v3).** Las 23 coordenadas se contrastaron una por una contra
> `DIVIPOLA_Municipios.xlsx` del Geoportal DANE: **idénticas hasta el sexto decimal**. El
> conjunto de Datos Abiertos que se usó en la v1 traía el campo `attribution` en "Gobernación
> de Guainía" pese a ser DIVIPOLA; era un artefacto del portal, no un problema del dato.
> Los puntos corresponden al casco urbano y no al centroide del polígono municipal
> — correcto para este mapa, porque el índice mide precios urbanos. Bogotá es el caso que lo
> confirma: `4.649251` cae en el área urbana, mientras que el centroide del polígono
> municipal quedaría mucho más al sur, en Sumapaz.

**Población: cabecera, y del dominio completo (v3).** El índice mide precios urbanos, así que
el símbolo se dimensiona con población urbana: la fila *"Cabecera municipal"*, año 2025, de
`PPED-AreaMun-2018-2042_VP.xlsx`, no el total municipal.

Desde la v3, `poblacion` es la **suma de las cabeceras de todos los municipios del dominio**,
no solo la del municipio núcleo. Para los siete dominios que son área metropolitana eso corrige
la asimetría que la v2 declaraba como límite: el precio se mide en toda el área, así que la
población debe medirse igual. El efecto es grande — **+16,0 %**, de 21.777.975 a 25.265.116 —
y concentrado en Bucaramanga (de 607.060 a 1.222.019) y Medellín. `areas_metropolitanas.csv`
trae la composición municipio por municipio.

La composición de cada A.M. es la de la nota metodológica de los boletines técnicos de la
**GEIH del DANE**, verificada en dos boletines independientes (mar-may 2023 y ago-oct 2025).
No es una definición propia, y difiere de lo que suele asumirse: **Barranquilla A.M. es solo
Barranquilla + Soledad** (no Malambo, Galapa ni Puerto Colombia), y **Cúcuta A.M. incluye
Puerto Santander**.

---

## 4. Archivo B — variación de precios (IPC)

`archivo_b_ipc_mensual.csv` — formato largo, **792 filas = 22 ciudades × 36 meses**,
ordenado por ciudad y luego por `anio_mes` ascendente.

- **Ventana:** `2023-09` a `2026-08`, los últimos 36 meses completos hasta el último dato
  publicado (agosto de 2026).
- **Continuidad verificada:** cada ciudad tiene exactamente 36 filas consecutivas, sin meses
  faltantes. 792 de 792 celdas con dato en las tres columnas; no hubo nada que interpolar.

### Dos de las tres columnas son derivadas, no publicadas

El anexo `anex-IPC-CiudadesMensuales-ago2026.xlsx` (hoja `VarCiudades`, actualizado el 7 de
septiembre de 2026) contiene **únicamente la variación mensual** por ciudad, 2017-2026, más una
columna de año corrido. El DANE **no publica en sus anexos el número índice por ciudad ni la
variación anual por ciudad en serie** — la variación anual por ciudad aparece solo para el mes
de referencia, en la hoja `6` del anexo consolidado `anex-IPC-ago2026.xlsx`.

Por eso:

- `var_anual` se calculó como producto de las 12 variaciones mensuales previas.
- `ipc_indice_base2018` se reconstruyó encadenando las variaciones mensuales desde
  **diciembre de 2018 = 100**.

**Validación del encadenamiento.** Se contrastó la `var_anual` encadenada de agosto de 2026
contra la publicada por el DANE para las **22 ciudades**: desviación máxima **0,03 puntos
porcentuales**, y ninguna ciudad por encima de eso. El método es sólido; la diferencia residual
viene del redondeo a dos decimales de las variaciones publicadas.

**Consecuencia para el uso.** Para el sparkline es irrelevante: la serie se escala al mín-máx de
cada ciudad, y una deriva multiplicativa constante no cambia la forma de la línea. Pero la
columna **no debe citarse como "índice publicado por el DANE"**; es una reconstrucción a partir
de variaciones publicadas, y así debe decirlo la ficha de datos.

> **Advertencia que debe ir en el tooltip, no solo aquí.**
> `ipc_indice_base2018` tiene base **diciembre 2018 = 100 en cada ciudad por separado**. Mide
> cuánto subieron los precios *de esa ciudad* desde 2018, no qué tan cara es. Dos ciudades con
> índice 165 no tienen el mismo nivel de precios. **No combinar con `indice_base100`, no
> promediarlos, no restarlos.** Son dos objetos distintos: uno es nivel, el otro es cambio.

**Para el sparkline:** graficar `ipc_indice_base2018` escalado al mín-máx **de cada ciudad**,
de modo que la línea muestre la forma de la trayectoria y no el nivel. `var_mensual` sirve para
la etiqueta numérica, no para la línea: una serie de variaciones mensuales es ruidosa y su
lectura visual induce a error.

---

## 5. Cobertura

`cobertura_cruce.csv` — 36 filas, cruce por `codigo_divipola`. No se rellenó ningún faltante.

| Estado | Filas | Qué son |
|---|---|---|
| `ambas` | 22 | Línea de pobreza 2025 **y** serie IPC publicada |
| `solo_nivel` | 1 | **Quibdó (27001)** |
| `solo_ipc` | 13 | En la muestra del IPC, agregadas en "otras áreas urbanas" |

> **Corrección a un supuesto del encargo.** El planteamiento inicial asumía que *"el IPC cubre
> más ciudades que la fuente de nivel"*. Es cierto para la **muestra** (38 municipios frente a
> 23 dominios) y **falso para lo publicado**: el DANE difunde el IPC desagregado para **22
> capitales** más un agregado "otras áreas urbanas". La fuente de nivel cubre **23**. El
> desbalance real va en sentido contrario: hay una ciudad con nivel y sin serie — Quibdó —, y
> ninguna con serie publicada y sin nivel.

**Confirmado contra el anexo.** La hoja `VarCiudades` lista exactamente 22 ciudades más
"Otras áreas urbanas" y "Total IPC", y trae esta nota del propio DANE: *"Hasta 2018 se generaron
variaciones para las ciudades de Quibdó y San Andrés. A partir de 2019 estas se encuentran
[agregadas]"*. Es decir, Quibdó **tuvo** serie propia hasta 2018 y la perdió: el corte no es
arbitrario, es una decisión de difusión de 2019.

**Quibdó** está en la muestra del IPC pero dentro del agregado, así que no tiene serie propia:
irá en el mapa con color y sin sparkline. Los otros 13 municipios de la agregación (Yopal,
Inírida, Puerto Carreño, Arauca, Leticia, Mitú, San José del Guaviare, Tumaco, Buenaventura,
Barrancabermeja, Rionegro, San Andrés, Mocoa) **no son filas publicables**: no tienen línea de
pobreza propia ni serie IPC propia. Se incluyen en la tabla de cruce para dejar constancia de
la asimetría, no para el mapa.

**Dos discrepancias abiertas:**

1. 22 capitales + 14 municipios en "otras áreas urbanas" = 36, pero el boletín declara
   cobertura de **38 municipios**. Faltan 2 por identificar — probablemente municipios de área
   metropolitana. `DATO REQUERIDO`: la ficha metodológica del IPC base 2018 está tras
   autenticación en `dane.isolucion.co`.
2. **"Rionegro" es ambiguo en DIVIPOLA**: existe `05615` (Antioquia) y `68615` (Santander). Se
   asignó `05615` por el contexto del área metropolitana de Medellín, pero el boletín no
   desambigua. Confirmar contra el anexo antes de publicar.

---

## 6. Límite central: la brecha no es solo precio

`contraste_dep_dane.csv` compara el índice elegido contra el **Deflactor Espacial de Precios**
del DANE, que sí es un índice espacial de precios por construcción (Törnqvist con ponderaciones
democráticas, canasta común de 118 alimentos, ENPH 2016-2017, metodología Deaton-Tarozzi,
Bogotá = 1.000), reescalado a la misma base 100.

| | Dispersión máx/mín |
|---|---|
| Índice elegido (línea de pobreza 2025) | **62,1 %** |
| DEP del DANE (alimentos, 2016-2017) | **20,1 %** |
| ICVC del Banco de la República (2005) | ~26 % |

Correlación de Pearson **0,75**; de Spearman **0,78**. Coinciden en lo grueso — Bucaramanga y
Bogotá arriba, Riohacha y Sincelejo abajo — pero **el índice elegido triplica la dispersión**
que muestran las dos mediciones que sí son de precio puro.

**Interpretación.** Esa diferencia no es error: es el efecto de que el DANE construye canastas
y coeficientes de Orshansky **distintos para cada ciudad**. Una línea más alta puede significar
precios más altos o una población de referencia con otra estructura de consumo. Riohacha es el
caso extremo: su línea está **25 puntos por debajo** del promedio, pero su nivel de precios de
alimentos solo 7 puntos por debajo — una brecha de **–17,7 puntos**. Le siguen Cali (–10,8) y
Montería (–9,8). En el otro sentido, Bogotá, Bucaramanga y Tunja aparecen ~13 puntos **más
caras** de lo que su nivel de precios de alimentos sugiere.

> **Consecuencia práctica:** el mapa exagerará las diferencias entre ciudades. La escala de
> color debe reforzar el orden y no invitar a leer la magnitud como si fuera "Riohacha es 38 %
> más barata que Bogotá". Recomendación en la sección 10.

Salvedades del propio DEP: cubre **solo alimentos** — y la vivienda es el componente donde más
difieren las ciudades, así que subestima la dispersión real —; está congelado en 2016-2017; y
**Quibdó no tiene DEP propio**, se le imputó el de Riohacha por tamaño de muestra, de modo que
la brecha de +13,5 puntos de Quibdó no es evidencia de nada.

---

## 7. Agregado ponderado por población

Calculado sobre la población de cabecera 2025 de las 23 ciudades.

| | Valor |
|---|---|
| **Índice nacional ponderado por población** | **106,42** |
| Población cubierta (23 dominios, cabeceras 2025) | 25.265.116 |
| — de la cual, municipios núcleo | 21.777.975 |
| Población nacional total 2025 | 53.057.212 |
| Población nacional en cabeceras 2025 | 40.257.670 |
| **Cobertura sobre población nacional** | **47,6 %** |
| **Cobertura sobre población urbana** | **62,8 %** |

```
índice nacional ponderado = Σ(indice_base100 × poblacion) / Σ(poblacion)
```

Los tres denominadores salen del **mismo** archivo de proyecciones, así que la cobertura es
internamente consistente.

**Lectura publicable:** el habitante urbano promedio de estas 23 ciudades vive en una ciudad
**6,4 % más cara** que la ciudad promedio del mapa. (Era 6,6 % con la población de los solos
municipios núcleo; al sumar las áreas metropolitanas baja levemente, porque varios municipios
del A.M. son dormitorio de ciudades caras y entran con el índice de su dominio.) El ponderado queda por encima de 100 porque
las ciudades más pobladas son sistemáticamente las más caras — Bucaramanga 121,7; Bogotá 119,9;
Medellín 109,1.

**Dos cifras de cobertura, no una.** 41,0 % es la fracción de *toda* la población colombiana;
54,1 % es la fracción de la población *urbana*, que es la comparación pertinente porque el
índice mide precios urbanos. Publicar solo la primera subestima el alcance del mapa; publicar
solo la segunda lo infla frente a un lector que piensa en el país entero. Van las dos.

---

## 8. Supuestos declarados

1. **La línea de pobreza aproxima el nivel de precios.** Se apoya en que el DANE la construye
   para que represente el mismo nivel de vida en cada dominio. Es el supuesto más fuerte del
   trabajo y la sección 6 muestra cuánto cede.
2. **Dominio A.M. → área completa (resuelto en v3).** Siete dominios son áreas
   metropolitanas. El precio es del área, y desde la v3 la población y el territorio coloreado
   también: se suman las cabeceras de los 44 municipios involucrados y el color cubre sus
   polígonos. `codigo_divipola` y las coordenadas siguen siendo las del municipio núcleo —
   son la llave de unión y el punto que marca la capital.
3. **Punto de cabecera, no centroide del polígono.** Decidido a propósito (sección 3).
4. **Año 2025 para nivel y población**, aunque el IPC llega a agosto de 2026. El desfase es
   inevitable: la pobreza monetaria es anual y se publica con rezago.
5. **Nombres normalizados** al nombre corto de uso común, sin "A.M.". La unión es siempre por
   `codigo_divipola`, nunca por nombre: DIVIPOLA usa "SANTIAGO DE CALI", "SAN JOSÉ DE CÚCUTA",
   "CARTAGENA DE INDIAS" y "BOGOTÁ, D.C.".

---

## 9. `DATO REQUERIDO` — inventario completo

Ninguna celda de los archivos está en `DATO REQUERIDO`. Lo que queda son **verificaciones
pendientes**, ordenadas por cuánto cambian el entregable:

| # | Qué falta | Impacto si sale distinto | Cómo se obtiene |
|---|---|---|---|
| 1 | ¿Publica el DANE el número índice **por ciudad**? | Reemplazaría una columna derivada por una publicada | `anex-IPC-Indices-ago2026.xlsx` (la URL resuelve; falta abrirlo) |
| 3 | Los 2 municipios que faltan para llegar a 38 | Solo documental | Ficha metodológica del IPC (`dane.isolucion.co`, requiere autenticación) |
| 4 | Desambiguación de "Rionegro" (05615 vs 68615) | Solo la tabla de cobertura | Ficha metodológica del IPC |
| 5 | Ponderaciones por categoría del COLI y su base | Solo el cuadro comparativo de §2 | Manual COLI de C2ER |
| 6 | Último trimestre publicado del IPVU | Solo `fuentes_inventario.csv` | Portal de estadísticas económicas del Banrep |

Ninguna bloquea la publicación. La verificación de coordenadas, que sí la bloqueaba, quedó
cerrada en la v3: idénticas al DIVIPOLA oficial.

**Geometría.** Polígonos del **Marco Geoestadístico Nacional 2018** del Geoportal DANE,
simplificados con mapshaper y republicados como GeoJSON por el repositorio
`caticoa3/colombia_mapa`. Es un derivado de tercero de la fuente oficial: fiel en la
delimitación, simplificado en el detalle del contorno. Para un mapa nacional es lo adecuado;
para medir áreas o distancias, no sirve — hay que volver al MGN sin simplificar.

---

## 10. Recomendaciones para el mapa

1. **Rotular el índice por lo que es.** "Costo de una canasta básica" o "Índice de costo de
   vida básico (proxy)", nunca "costo de vida" a secas. La nota al pie debería caber en una
   línea: *"100 = ciudad promedio. Basado en la línea de pobreza monetaria del DANE 2025."*
2. **Escala de color divergente anclada en 100**, con cortes por cuantiles y no lineales, para
   no traducir visualmente una dispersión inflada (sección 6). Evitar rojo-verde: no sobrevive
   al daltonismo ni implica juicio moral sobre "caro" y "barato".
3. **Tamaño del símbolo por raíz cuadrada de la población**, no lineal. Bogotá tiene un orden
   de magnitud más de habitantes que Tunja; un radio lineal la vuelve un disco que tapa la
   Sabana.
4. **Quibdó necesita un estado vacío explícito** en el tooltip: tiene color y no tiene
   sparkline. Un espacio en blanco se lee como error de carga.
5. **Separar visualmente nivel y variación.** El color responde "¿qué tan cara es?"; el
   sparkline responde "¿qué tan rápido suben los precios?". Son preguntas distintas y el
   tooltip debe decirlo, porque un lector general las suma sin pensarlo.
6. **Poner la salvedad de la sección 6 en la interfaz**, no solo en este archivo. Un mapa
   público sin ella afirma una precisión que el dato no tiene.

---

## 10 ante. Serie anual 2021-2025

El mapa trae un filtro de año con **cinco años de líneas de pobreza**, tomados de las
presentaciones de resultados del DANE:

| Año del dato | Presentación | Contraste |
|---|---|---|
| 2021 | `pres-PM-2022.pdf` | — |
| 2022 | `pres-PM-2023.pdf` | coincide con `pres-PM-2022.pdf` |
| 2023 | `pres-PM-2025.pdf` | coincide con `pres-PM-2023.pdf` y `pres-PM-2024.pdf` |
| 2024 | `pres-PM-2025.pdf` | coincide con `pres-PM-2024.pdf` |
| 2025 | `pres-PM-2025.pdf` | — |

Cada año que aparece en dos presentaciones se contrastó y coincide. La **única** discrepancia
en los 115 valores de la serie es Florencia 2024: 514.847 en una y 514.848 en otra — un peso,
redondeo. Se usó 514.847.

**El índice se recalcula dentro de cada año.** La base 100 es el promedio simple de las 23
ciudades *de ese año*, y la población es la proyección de cabecera *de ese año*. Por eso el
filtro responde "¿cambió el orden relativo?", no "¿subieron los precios?". Para lo segundo está
la serie del IPC, que es independiente del filtro y siempre muestra los últimos 36 meses.

**Lo que muestra la serie.** El orden es notablemente estable: en cinco años ninguna ciudad se
mueve más de tres puestos (Santa Marta baja tres, Cúcuta sube tres). Bucaramanga A.M. es la más
cara y Riohacha la más barata en los cinco años, sin excepción. El índice ponderado por
población sube despacio y de forma sostenida —105,90 en 2021 a 106,42 en 2025—: las ciudades más
pobladas se encarecen algo más rápido que el promedio.

**Límite de la serie.** No es una serie deflactada ni comparable con años anteriores a 2021: la
metodología de las líneas de pobreza se actualizó en 2019-2020, así que los valores previos
pertenecen a otra medición. Tampoco cubre 2020, año atípico por la pandemia.

`archivo_a_serie_anual.csv` trae las 115 filas con su fuente por fila.

---

## 10 bis. El mapa: tres niveles de color

El mapa publica **tres niveles distintos** y la leyenda los nombra, porque mezclarlos sería
afirmar cosas que el dato no dice:

| Nivel | Qué es | Qué NO es |
|---|---|---|
| **Tono pleno** | El territorio efectivamente medido: el municipio, o los municipios del A.M. | — |
| **Tono suave** (34 % claro / 40 % oscuro sobre el gris base) | El departamento de esa ciudad, como contexto geográfico | **No es una medición departamental.** El índice de Riohacha no describe a toda La Guajira |
| **Gris** | Los nueve departamentos sin ninguna ciudad medida | — |

Los nueve en gris: **Cundinamarca, Arauca, Casanare, Putumayo, Amazonas, Guainía, Guaviare,
Vaupés y Vichada**. Cundinamarca queda en gris porque Bogotá es distrito propio, así que el
departamento que rodea a la ciudad más cara del país no tiene medición propia. Ese vacío no es
un defecto del mapa: es el estado real de la estadística de precios en Colombia, y se lee de un
golpe.

**Por qué no un coropletas departamental puro.** Habría quedado más vistoso —los departamentos
llenan el territorio, como los estados en el mapa de MERIC— pero atribuiría el índice de una
ciudad a toda su región. El tono suave da la misma energía visual sin hacer esa afirmación.

### Decisiones de color

- **No se usó la rampa verde→rojo** del mapa de referencia: es la que más falla para daltonismo
  y esta pieza es para público general.
- Rampa **divergente azul ↔ rojo** anclada en el tono exacto del azul de marca (`#0048ff`,
  matiz OKLCH 263,4°), con gris neutro en el tramo 98-102. Validada con el script de la skill
  `dataviz` en ambos temas: separación para daltonismo y separación de visión normal **pasan**
  (claro: ΔE 16,0 CVD / 17,1 normal · oscuro: 13,6 / 18,3).
- Los pasos claros de la rampa quedan por debajo de 3:1 de contraste contra la superficie. La
  regla de relevo exige compensarlo, y se compensa: etiquetas directas sobre el mapa, valor
  numérico en cada fila de la lista y **vista de tabla completa**.
- **Bins, no gradiente continuo.** Un gradiente invitaría a leer magnitud; los bins comunican
  orden, que es lo único que este índice sostiene (§6).

### Capas de marca y medición

Tipografía IgraSans incrustada en base64, paleta y componentes del sistema de marca, tema
claro/oscuro derivado de la marca y selector **ES/EN** con diccionario completo —ninguna cadena
visible está incrustada en la vista—. La preferencia se guarda con `safeStore`, que cae a
memoria donde `localStorage` está bloqueado, y comparte las llaves `jf-lang` / `iac_lang` con el
resto del portafolio.

GA4 `G-MQ3K8EVKV0` con eventos propios: `select_city`, `change_view`, `toggle_theme`,
`toggle_lang`. **Solo mide en el despliegue de GitHub Pages**: la política de contenido del
visor de artifacts bloquea `googletagmanager.com`, así que ahí el contador no dispara. La página
no depende de él para funcionar.

---

## 11. Reproducibilidad

```
scripts/01_construir_dataset.py       # esqueleto + cifras de PDF, con URL al lado de cada una
scripts/03_rellenar_desde_anexos.py   # rellena desde los .xlsx en ../raw/
scripts/04_geometria_y_areas_metropolitanas.py  # A.M., población agregada y polígonos disueltos
scripts/05_preparar_datos_mapa.py     # proyecta la geometría y emite mapa_data.json
scripts/06_construir_mapa.py          # incrusta IgraSans + datos -> HTML final
scripts/02_completar_desde_dane.py    # alternativa: descarga los .xlsx si hay red al DANE
```

**Orden obligatorio: 01 y luego 03.** El paso 01 reescribe los archivos con el esqueleto, así
que correrlo después de 03 borra lo rellenado. El paso 01 no toca la red: todas sus cifras están
en el código con la URL de origen al lado, así que es auditable línea por línea. Los pasos 02 y
03 **abortan con mensaje explícito** si no reconocen la estructura de un anexo, en vez de
adivinar posiciones de columna.

Anexos que el paso 03 espera en `../raw/`: `PPED-AreaMun-2018-2042_VP.xlsx`,
`anex-IPC-CiudadesMensuales-ago2026.xlsx` y `anex-IPC-ago2026.xlsx`.

**Validaciones que corren en cada build:** 23 filas en el archivo A; `codigo_divipola` único;
792 filas en el archivo B; exactamente 36 meses consecutivos por ciudad sin huecos; orden
ascendente; y que el promedio simple de `indice_base100` sea 100,00.

---

## 12. Cierre

**Nivel de confianza: Medio-alto en los datos, Medio en el constructo.**
Procedencia: alta. Cada cifra viene de un PDF o un anexo oficial del DANE; las líneas de pobreza
de 2023 y 2024 se contrastaron contra dos publicaciones independientes, y el encadenamiento del
IPC se validó contra la variación anual publicada con una desviación máxima de 0,03 pp en las 22
ciudades. Validez de constructo: media. La sección 6 muestra que el índice elegido dispersa el
triple que las dos mediciones colombianas que sí son de precio puro, y eso no lo arregla ningún
anexo — es una propiedad de la fuente.

**Qué cambiaría la conclusión**

- La **ENPH 2026-2027**, cuando salga. Permitiría un DEP actualizado y con canasta completa, y
  probablemente desplazaría a la línea de pobreza como fuente base.
- Que el DANE publique la **descomposición de la línea por división de gasto** a nivel de
  ciudad: habilitaría el índice desagregado por componentes.
- Que aparezca un **índice espacial con vivienda**. Es el componente ausente y el que más
  separa a las ciudades.
- Que los **coeficientes de Orshansky por ciudad** se hagan públicos: permitirían descontar
  el efecto de composición y quedarse con el precio.

**Acción recomendada**

1. Rotular `ipc_indice_base2018` como serie reconstruida, no como índice publicado (§4).
2. Confirmar si `anex-IPC-Indices-ago2026.xlsx` trae índice por ciudad; si lo trae, sustituir
   la columna derivada.
3. Si el mapa entra al portafolio `jaforero/dashboards`, falta la capa bilingüe ES/EN que los
   otros tablero ya tienen.
4. La salvedad de la sección 6 ya está en la interfaz del mapa; mantenerla en cualquier
   derivado (captura, post, presentación).
