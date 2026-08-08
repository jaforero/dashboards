**Español** · [English](README.en.md)

# Casos de demostración · Pulso Financiero

Cuatro datasets listos para cargar en el tablero (pestaña **⤒ Mis datos**), cada uno con una historia distinta. Todo se procesa localmente en el navegador: ningún archivo sale de tu equipo.

| Archivo | Historia | Qué demuestra |
|---|---|---|
| `Dataset_FinanzasIA_Simple.xlsx` | **Alerta** — crecimiento que se enfría y margen que se erosiona (36 meses, 2022–2024, simulado) | Diagnóstico de deterioro y alertas de gobernanza |
| `Dataset_Finanzas_Recuperacion_Demo.xlsx` | **Turnaround** — deterioro → eficiencia + repricing → recuperación con margen 32% y liquidez 1,6× (36 meses, 2023–2026, simulado con coherencia interna) | Punto de giro, puente precio-volumen y escenarios optimistas |
| `Caso_Real_TSMC.xlsx` | **Caso real mensual** — TSMC y el superciclo de IA: +30,6% con el margen expandiéndose a 64% (jul-2023 → jun-2026) | Datos públicos reales: ventas mensuales oficiales (TWSE) + margen bruto trimestral (SEC 6-K) mensualizado con método declarado. Las capas de caja y liquidez se omiten a propósito porque no existe dato mensual público. Fuentes con URL en la hoja «Fuentes» del archivo. |
| `Caso_Real_Apple_Trimestral.xlsx` | **Caso real trimestral** — Apple, 50 trimestres (1T-2014 → 2T-2026) | Que el tablero detecta la periodicidad y **reconfigura toda la estacionalidad** (periodo 4 en vez de 12): medias móviles, Holt-Winters, armónicos de Fourier y los retardos de SARIMA. |

## Formato de carga

El contrato es mínimo: **el periodo en la primera columna** y después las métricas que quieras.

- **Mensual**: `AAAA-MM` (también acepta `dd/mm/aaaa` o fecha de Excel).
- **Trimestral**: `AAAA-QX` (también `2024-T1`, `Q1-2024`, `1T2024`).
- **Obligatorias**: periodo + ventas + (costos o margen; la que falte se deriva).
- **Opcionales**: flujo de caja, unidades, precio promedio, activos y pasivos corrientes. Cada una activa su capa.

No hacen falta columnas auxiliares de año, mes ni nombre del mes: el tablero las deriva. Al validar te dice qué columnas reconoció y cuáles ignoró.

## Guion de demo sugerido

1. **Simple** — la historia de alerta: el veredicto detecta el enfriamiento.
2. **Recuperación** — la historia de éxito: el mismo motor cuenta lo contrario.
3. **TSMC** — caso real verificable, con fuentes auditables.
4. **Apple** — cambia a trimestral y observa cómo el eje pasa a `1T…4T` y el modelo recomendado cambia.

El contraste entre veredictos es la demostración de que el tablero **interpreta**, no solo grafica.

> Los tres primeros archivos usan escalas distintas (millones, NT$ miles de millones). El tablero es consistente mientras todas las columnas monetarias de un mismo archivo usen la misma unidad.
