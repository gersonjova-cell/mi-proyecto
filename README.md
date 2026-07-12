# VisorMaestro EPS

**Visor y conversor profesional de archivos EPS, PostScript, AI y PDF — más imágenes y documentos — que funciona 100 % en tu navegador.**

Aplicación web creada desde cero que recrea (y amplía) todas las funciones de *EPS Master View*: motor de renderizado **Ghostscript** de alta calidad compilado a WebAssembly, resolución de hasta **600 DPI**, antialiasing, navegación multipágina con contador, exportación a múltiples formatos y conversión por lotes. Ningún archivo sale de tu equipo: todo el procesamiento es local.

## ✨ Funciones

### Motor profesional (EPS · EPSF · PS · AI · PDF)
- Renderizado con **Ghostscript 9.56 (WASM)** — el mismo motor de la industria de preimpresión.
- Resolución configurable: **72, 96, 150, 300 y 600 DPI**.
- **Antialiasing** de texto y gráficos (`TextAlphaBits/GraphicsAlphaBits 4`).
- **Degradación inteligente**: recorte al `%%BoundingBox` (`EPSCrop`), reintento sin recorte y ajuste a página (`EPSFitPage`); admite EPS con **encabezado binario DOS** (vista previa TIFF/WMF incrustada).
- **Multipágina** con contador y navegación (◀ ▶, flechas del teclado).
- Panel de información con metadatos **DSC** (Título, Creador, Fecha, BoundingBox, LanguageLevel) y registro del motor.

### Visor
- Zoom 2 %–3200 %, **ajustar a página / ancho / tamaño real**, zoom con `Ctrl + rueda` anclado al cursor.
- **Rotación** 90°/180°/270°, desplazamiento arrastrando, fondo **blanco o transparente** (tablero de ajedrez).
- Lista de archivos con **miniaturas**, apertura múltiple y **arrastrar y soltar**.
- Tema **oscuro / claro**, interfaz en **español e inglés**, atajos de teclado.

### Exportación y conversión
- EPS/PS/AI/PDF → **PNG, JPEG, PDF, TIFF, BMP, PS y WebP** (DPI y calidad configurables, PNG/WebP con transparencia).
- **Conversión por lotes** de varios archivos a ZIP con barra de progreso.
- **Imprimir** y **copiar al portapapeles** la página visible.

### Otros documentos
- **Imágenes**: PNG, JPEG, GIF, WebP, BMP, SVG, ICO, AVIF y **TIFF multipágina**.
- **Documentos**: **DOCX** (Word), **XLSX/XLS/CSV** (hojas como páginas), **Markdown**, TXT, JSON, XML y LOG.

## 🚀 Cómo usarla

> La aplicación es 100 % estática: solo necesita servirse por HTTP (los navegadores no permiten cargar WebAssembly desde `file://`).

**Opción A — Windows:** doble clic en `iniciar-windows.bat`. No requiere instalar nada: si no encuentra Python, usa automáticamente el servidor PowerShell integrado de Windows (`servidor.ps1`).

**Opción B — macOS / Linux:**
```sh
./iniciar-mac-linux.sh
```

**Opción C — cualquier sistema con Python:**
```sh
python3 -m http.server 8765
# luego abre http://localhost:8765
```

**Opción D — GitHub Pages (en línea):** el workflow incluido (`.github/workflows/pages.yml`) publica la aplicación automáticamente en cada push a `main` e intenta activar Pages por sí solo. Si el primer despliegue fallara, actívalo una vez en *Settings → Pages → Source: GitHub Actions* y vuelve a lanzar el workflow.

Después: pulsa **Abrir** (o arrastra archivos a la ventana) y usa **Ejemplos** para probar con los EPS/PS incluidos. En `samples/` hay archivos de muestra.

## 🗂 Estructura

```
index.html            Interfaz principal
css/app.css           Estilos (tema oscuro/claro)
js/app.js             Lógica de la aplicación (visor, exportación, lotes, i18n)
js/gs-worker.js       Web Worker que ejecuta Ghostscript WASM
js/samples.js         Ejemplos EPS/PS incrustados
vendor/               Motor y librerías (sin CDN, todo local)
samples/              Archivos de ejemplo (EPS, PS, PDF)
```

## ⚙️ Tecnología

| Componente | Uso | Licencia |
|---|---|---|
| [Ghostscript](https://ghostscript.com) 9.56 (WASM, paquete `@jspawn/ghostscript-wasm`) | Render y conversión EPS/PS/PDF | AGPL-3.0 (`vendor/GHOSTSCRIPT-LICENSE.txt`) |
| [JSZip](https://stuk.github.io/jszip/) | ZIP de lotes | MIT/GPLv3 |
| [mammoth.js](https://github.com/mwilliamson/mammoth.js) | DOCX → HTML | BSD-2 |
| [SheetJS CE](https://sheetjs.com) | XLSX/XLS/CSV | Apache-2.0 |
| [marked](https://marked.js.org) | Markdown | MIT |
| [UTIF.js](https://github.com/photopea/UTIF.js) | Decodificación TIFF | MIT |

Sin frameworks, sin compilación, sin dependencias en línea: JavaScript puro.

## 🔒 Privacidad

Todo el procesamiento (render, conversión, lectura de documentos) ocurre **dentro de tu navegador** mediante WebAssembly y Web Workers. Ningún archivo se sube a ningún servidor.

## 📄 Licencia

El código de la aplicación se publica bajo licencia MIT. El motor Ghostscript incluido en `vendor/` se distribuye bajo **AGPL-3.0**; consulta `vendor/GHOSTSCRIPT-LICENSE.txt`.
