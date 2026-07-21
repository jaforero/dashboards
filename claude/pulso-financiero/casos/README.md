# Casos de demostración · Pulso Financiero

Tres datasets listos para cargar en el tablero (pestaña **⤒ Mis datos**), cada uno con una historia distinta. Todo se procesa localmente en el navegador.

| Archivo | Historia | Qué demuestra |
|---|---|---|
| `Dataset_FinanzasIA_Simple.xlsx` | **Alerta** — crecimiento que se enfría y margen que se erosiona (36m, 2022–2024, simulado) | Diagnóstico de deterioro, alertas de gobernanza |
| `Dataset_Finanzas_Recuperacion_Demo.xlsx` | **Turnaround** — deterioro → eficiencia + repricing → recuperación con margen 32% y liquidez 1.6× (36m, 2023–2026, simulado con coherencia interna) | Punto de giro, puente precio-volumen, escenarios optimistas |
| `Caso_Real_TSMC.xlsx` | **Caso real** — TSMC y el superciclo de IA: +30.6% con margen expandiéndose a 64% (jul-2023 → jun-2026) | Datos públicos reales: ventas mensuales oficiales (TWSE) + margen bruto trimestral (SEC 6-K) mensualizado con método declarado. Capas de caja/liquidez omitidas a propósito (no hay dato mensual público). Fuentes con URL en la hoja «Fuentes» del archivo. |

**Guion de demo sugerido:** carga *Simple* (historia de alerta) → carga *Recuperación* (historia de éxito) → cierra con *TSMC* (caso real verificable). El contraste entre veredictos es la demostración de que el tablero interpreta, no solo grafica.
