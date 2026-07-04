# Jerarquía Volátil — Tema Shopify (Home)

Este paquete convierte el prototipo del Home en secciones Shopify reales, editables desde el **Personalizador de temas** (Online Store → Temas → Personalizar). No es un tema completo: se instala sobre un tema base existente (recomendado: **Dawn**, el tema gratuito de Shopify), aportando el Home y las piezas de marca. El resto del sitio (ficha de producto, carrito, checkout, cuenta) sigue funcionando con las plantillas del tema base.

## Qué resuelve esto que el Artifact anterior no podía

- **Edición real y compartida**: los cambios se guardan en Shopify, no en el navegador de una sola persona. Cualquiera con acceso al admin edita desde el Personalizador.
- **Productos reales**: "Selección JV" jala productos de una colección de Shopify de verdad (imagen, precio, variantes) — nada inventado.
- **Newsletter real**: usa el formulario nativo `{% form 'customer' %}` de Shopify. El correo se guarda como Cliente etiquetado `newsletter` en tu admin — sin backend propio, sin mailto.
- **Imágenes optimizadas**: se usa `image_url` con anchos explícitos; el CDN de Shopify sirve automáticamente WebP/AVIF según el navegador del visitante.

## Instalación

1. **Descarga tu tema Dawn** (o usa el que ya tengas) vía Shopify CLI (`shopify theme pull`) o desde el admin → Temas → Editar código.
2. Copia estas carpetas dentro del tema, respetando la estructura:
   - `assets/*` → `assets/`
   - `sections/*` → `sections/`
   - `snippets/*` → `snippets/`
   - `templates/index.json` → reemplaza (o fusiona) el `templates/index.json` existente.
3. **Sube el tema** con `shopify theme push` o pegando cada archivo en el editor de código del admin.

## Después de instalar

1. **Menú de navegación**: crea en *Online Store → Navigation* un menú `main-menu` con los enlaces: Tienda, Core, Heavyweight, Oversize, Novedades, Guía de tallas, Nuestra calidad, Nosotros, Contacto. El header (`jv-header.liquid`) lo toma automáticamente.
2. **Header y WhatsApp flotante globales**: la mayoría de temas 2.0 controlan el header desde `sections/header-group.json`. Agrega ahí el section `jv-header`, y añade `{% render 'jv-whatsapp-float' %}` justo antes de `</body>` en `layout/theme.liquid`.
3. **Footer global**: agrega el section `jv-footer` en `sections/footer-group.json` (o en el layout, según tu tema).
4. **Colección para "Selección JV"**: en el Personalizador, entra a la sección *JV — Selección destacada* y elige la colección real que quieres destacar.
5. **Imágenes**: sube tus fotografías editoriales en cada sección (Hero tiene campos separados para escritorio y móvil — usa un recorte vertical para móvil donde la prenda no se corte).
6. **GSM / Metafield opcional**: si quieres mostrar el gramaje en las tarjetas de producto automáticamente, crea un metafield `product.jv.gsm` (tipo número) y complétalo por producto; la tarjeta lo muestra solo si existe.

## Estructura de archivos

```
assets/
  jv-theme.css.liquid     — sistema de diseño completo (tokens, tipografía, componentes)
  jv-theme.js              — menú móvil, acordeón de footer, animación de entrada
  jv-bigshoulders.woff2    — tipografía de títulos (condensada, industrial)
  jv-archivo.woff2         — tipografía de texto
  jv-plexmono-400/500.woff2 — tipografía mono para specs, GSM y precios
sections/
  jv-announcement-bar.liquid
  jv-header.liquid
  jv-hero.liquid
  jv-manifesto.liquid
  jv-featured-selection.liquid   (usa una colección real)
  jv-collections-editorial.liquid (bloques: Core / Heavyweight / Oversize)
  jv-gsm-scale.liquid             (bloques: niveles de gramaje)
  jv-material-feature.liquid      (algodón peinado)
  jv-pillars.liquid               (bloques: Tela / Peso / Caída / Construcción)
  jv-fit-guide.liquid             (bloques: 5 siluetas de corte)
  jv-detail-banner.liquid         (mira más cerca)
  jv-local-delivery.liquid        (Monterrey / entrega local)
  jv-trust.liquid                 (bloques de confianza)
  jv-newsletter.liquid            (captura real de clientes)
  jv-footer.liquid
snippets/
  jv-product-card.liquid
  jv-whatsapp-float.liquid
templates/
  index.json               — orden de secciones del Home
```

## Nota sobre el header/footer globales

Cada tema de Shopify estructura el header y el footer de forma distinta (algunos usan `header-group.json`/`footer-group.json`, otros los tienen fijos en `layout/theme.liquid`). Los archivos `jv-header.liquid` y `jv-footer.liquid` están listos para insertarse, pero la forma exacta de "engancharlos" a todas las páginas depende del tema base que uses. Si me dices qué tema estás usando (Dawn, Refresh, u otro comprado), te doy los pasos exactos.
