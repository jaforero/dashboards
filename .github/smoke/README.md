# Pruebas de humo de los dashboards

`smoke.js` sirve el repositorio en local, abre cada página en Chromium (Playwright) y revisa lo que ya falló alguna vez en producción. La ejecuta `.github/workflows/smoke-dashboards.yml` en cada push a `main`, en cada pull request, los lunes y a mano desde **Actions → Dashboards · pruebas de humo → Run workflow**.

## Qué revisa

| Control | Falla si… |
|---|---|
| JavaScript | hay un error no capturado, un `console.error` o un archivo del propio sitio que no carga |
| Gráficas | el dibujo de una gráfica Plotly no cabe en su tarjeta: al cargar, en cada pestaña y después de redimensionar la ventana |
| Móvil | la página se desborda en horizontal a 375 px, en cualquier pestaña |
| Idioma | al pasar a inglés queda alguna línea en español, o al volver a español el texto no es idéntico al original |
| Enlaces e imágenes | un enlace interno apunta a una ruta que no existe en el repo, o una imagen propia no carga |
| Offline | `dashboard-offline.html` no dibuja gráficas sin red, o su título pierde `[Offline]` (también en inglés) |
| Redirecciones | `/pulso-financiero/` y `/sla-operaciones/` no llevan a su ruta en `/claude/` |
| sitemap.xml | una URL no existe en el repo (fallo); su `lastmod` es anterior al último commit de la página (solo aviso) |
| Accesibilidad | [axe-core](https://github.com/dequelabs/axe-core) encuentra una infracción de las reglas WCAG 2.0/2.1 nivel A o AA (contraste, nombres de controles, roles ARIA…): al cargar y en cada pestaña, en tema claro y, si la página lo tiene, en tema oscuro |

La analítica (GA4) siempre se bloquea: las pruebas no generan visitas. Los avisos no hacen fallar la ejecución; aparecen en el resumen.

## Agregar una página

Añade una línea al arreglo `PAGES` de `smoke.js` con su ruta. Si tiene versión offline, agrega `offline:`. Si su contenido está en español a propósito también en la versión inglesa (como las notas del Grafo), usa `en: false`.

## Correrla en local

```bash
npm install --no-save --prefix /tmp/smoke playwright@1.52.0 axe-core@4.14.0
/tmp/smoke/node_modules/.bin/playwright install chromium
NODE_PATH=/tmp/smoke/node_modules node .github/smoke/smoke.js .
```

Sin `axe-core` instalado, la prueba omite la accesibilidad con un aviso en local y falla en GitHub Actions.

Variables opcionales: `SMOKE_ONLY=sla,pulso` (solo esas páginas, por `id`), `SMOKE_NET=0` (sin red externa) y `SMOKE_ROUTES=mapa.json` (sirve librerías de CDN desde archivos locales: `{"https://cdn…/lib.js": "/ruta/lib.js"}`).
