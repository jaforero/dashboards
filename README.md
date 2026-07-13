# Dashboards con IA · Javier Forero

Dos portafolios de **dashboards de decisión** construidos con IA bajo una misma dirección analítica: uno con **Claude**, otro con **ChatGPT Work**. No solo grafican: interpretan, diagnostican y convierten los datos en decisión.

**▶️ Home (selector de las dos IAs):** `https://dashboards.javierforero.co/`

## Estructura
```
/                         → selector: elige portafolio (Claude · ChatGPT)
/claude/                  → hub del portafolio construido con Claude
/claude/sla-operaciones/  → Cumplimiento de SLA · Operaciones B2B
/claude/pulso-financiero/ → Pulso Financiero · Finanzas Corporativas
```
El portafolio de **ChatGPT Work** vive en un sitio externo: `https://javier-dashboards.jforero.chatgpt.site/`.

> Las URLs antiguas `/(sla-operaciones|pulso-financiero)/` redirigen automáticamente a su nueva ruta bajo `/claude/`, para no romper enlaces compartidos.

## Portafolio Claude · demos
| Dashboard | Descripción | Enlace |
|---|---|---|
| **Cumplimiento de SLA · Operaciones B2B** | 8 capas, alertas, diagnóstico del quiebre, gobernanza, Q&A conversacional y brief exportable. **v2: sube tu propio SLA (CSV/XLSX)** — detección automática del quiebre, validación de continuidad mensual y recálculo completo en el navegador. | [`/claude/sla-operaciones/`](./claude/sla-operaciones/) |
| **Pulso Financiero · Finanzas Corporativas** | Crecimiento, margen, caja y liquidez; puente precio-volumen, descomposición + Holt-Winters con backtest, KPIs Inteligentes (Histórico vs IA Proyectado), gobernanza y brief exportable. **v2: sube tus propios datos (CSV/XLSX)** — validación de formato, recálculo completo de modelos e interpretación en el navegador, sin enviar nada a ningún servidor. | [`/claude/pulso-financiero/`](./claude/pulso-financiero/) |

## Cómo agregar un dashboard nuevo (portafolio Claude)
1. Crea una carpeta hermana dentro de `claude/` (p. ej. `claude/inventario/`) con su propio `index.html`.
2. Duplica una tarjeta en `claude/index.html`, cambia título, descripción y el enlace a la nueva carpeta.
3. Commit + push. Queda en `https://dashboards.javierforero.co/claude/<carpeta>/`.

## Publicar (GitHub Pages)
Settings → Pages → *Deploy from a branch* → `main` / `/ (root)`. El `.nojekyll` y el `CNAME` ya están incluidos en la raíz.

## Autor
**Javier Forero** — [javierforero.co](https://javierforero.co) · [LinkedIn](https://www.linkedin.com/in/jforero/) · [GitHub](https://github.com/jaforero)

## Licencia
MIT (código). La tipografía IgraSans es de su titular y no forma parte de la licencia.
