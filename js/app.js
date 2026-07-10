/* ============================================================
 * VisorMaestro EPS — visor y conversor de EPS/PS/AI/PDF y otros
 * documentos, 100 % local (Ghostscript WASM en un Web Worker).
 * ============================================================ */
'use strict';

/* ---------------- i18n ---------------- */
const I18N = {
  es: {
    tagline: 'EPS · PS · PDF · documentos',
    open: 'Abrir', open_files: 'Abrir archivos…', open_files_t: 'Abrir archivos (EPS, PS, AI, PDF, imágenes, documentos)',
    zoom_out_t: 'Alejar (-)', zoom_in_t: 'Acercar (+)', fit_t: 'Ajustar a la ventana (0)', actual_t: 'Tamaño real 100 % (1)',
    fit_page: 'Ajustar página', fit_width: 'Ajustar ancho',
    rot_l_t: 'Rotar 90° a la izquierda', rot_r_t: 'Rotar 90° a la derecha (R)',
    prev_t: 'Página anterior (←)', next_t: 'Página siguiente (→)',
    bg_t: 'Alternar fondo blanco / transparente (EPS y PNG)',
    export: 'Exportar', export_t: 'Exportar el documento activo al formato elegido',
    batch: 'Lotes', batch_t: 'Conversión por lotes (ZIP)',
    print_t: 'Imprimir', copy_t: 'Copiar imagen al portapapeles',
    info_t: 'Panel de información', theme_t: 'Tema claro / oscuro', help_t: 'Ayuda',
    files: 'Archivos', load_samples: 'Ejemplos', load_samples_l: 'Cargar ejemplos', clear_all: 'Vaciar',
    drop_hint: 'Arrastra archivos aquí', drop_here: 'Suelta los archivos para abrirlos',
    welcome_title: 'Visor maestro de EPS y documentos',
    welcome_sub: 'Abre o arrastra archivos EPS, PS, AI, PDF, imágenes, TIFF, DOCX, XLSX, CSV, Markdown o texto.',
    welcome_note: 'Todo se procesa localmente en tu navegador con Ghostscript (WebAssembly): tus archivos no se suben a ningún servidor.',
    rendering: 'Renderizando…', converting: 'Convirtiendo…',
    doc_info: 'Información del documento', gs_log: 'Registro del motor',
    engine_loading: 'Cargando motor…', engine_ready: 'Motor listo', engine_error: 'Error del motor',
    batch_title: 'Conversión por lotes', batch_files: 'Archivos a convertir', format: 'Formato', quality: 'Calidad',
    transparent_bg: 'Fondo transparente (PNG/WebP)', cancel: 'Cancelar', convert_download: 'Convertir y descargar ZIP',
    help_title: 'Ayuda — VisorMaestro EPS', help_formats: 'Formatos compatibles',
    help_gs: 'renderizado de alta calidad hasta 600 DPI, antialiasing, multipágina, EPS con encabezado binario DOS.',
    help_imgs: 'Imágenes:', help_docs: 'Documentos:', help_export: 'Exportación',
    help_export_p: 'EPS/PS/AI/PDF → PNG, JPEG, PDF, TIFF, BMP, PS o WebP, con DPI y calidad configurables, individual o por lotes (ZIP). Las imágenes se pueden reexportar a PNG, JPEG o WebP.',
    help_keys: 'Atajos de teclado', k_zoom: 'Acercar / alejar', k_fit: 'Ajustar a la ventana', k_100: 'Tamaño real (100 %)',
    k_pages: 'Página anterior / siguiente', k_rot: 'Rotar 90°', k_wheel: 'Zoom con la rueda del ratón',
    help_privacy: 'Privacidad', help_privacy_p: 'Todo el procesamiento ocurre en tu navegador mediante WebAssembly. Ningún archivo sale de tu equipo.',
    st_zoom: 'Zoom', st_page: 'Página',
    unsupported: 'Formato no compatible: ', load_error: 'No se pudo abrir: ',
    render_error: 'Error al renderizar: ', export_ok: 'Exportación completada: ', export_err: 'Error al exportar: ',
    export_none: 'No hay documento activo para exportar.', format_not_for_kind: 'Ese formato no está disponible para este tipo de archivo. Usa PNG, JPEG o WebP.',
    export_not_doc: 'Este tipo de documento no se puede exportar como imagen.',
    copy_ok: 'Imagen copiada al portapapeles.', copy_err: 'No se pudo copiar (el portapapeles requiere HTTPS o localhost).',
    print_none: 'No hay páginas para imprimir en este documento.',
    batch_none: 'Selecciona al menos un archivo convertible.', batch_done: 'Lote completado: ',
    batch_running: 'Convirtiendo {0} de {1}: {2}', batch_skipped: ' (omitidos: {0})',
    confirm_clear: '¿Quitar todos los archivos de la lista?', samples_loaded: 'Ejemplos cargados.',
    engine_not_ready: 'El motor Ghostscript aún se está cargando; inténtalo en unos segundos.',
    dpi_warn: 'A 600 DPI el renderizado puede tardar varios segundos.',
    pages_w: 'páginas', page_w: 'página', sheet_w: 'Hoja',
    inf_name: 'Nombre', inf_type: 'Tipo', inf_size: 'Tamaño', inf_pages: 'Páginas', inf_dims: 'Dimensiones (px)',
    inf_dpi: 'DPI de render', inf_time: 'Tiempo de render', inf_title: 'Título (DSC)', inf_creator: 'Creador',
    inf_date: 'Fecha', inf_bbox: 'BoundingBox', inf_lang: 'LanguageLevel', inf_pdfver: 'Versión PDF', inf_sheets: 'Hojas',
    kind_gs: 'PostScript / PDF', kind_image: 'Imagen', kind_tiff: 'TIFF', kind_docx: 'Documento Word',
    kind_sheet: 'Hoja de cálculo', kind_md: 'Markdown', kind_text: 'Texto',
  },
  en: {
    tagline: 'EPS · PS · PDF · documents',
    open: 'Open', open_files: 'Open files…', open_files_t: 'Open files (EPS, PS, AI, PDF, images, documents)',
    zoom_out_t: 'Zoom out (-)', zoom_in_t: 'Zoom in (+)', fit_t: 'Fit to window (0)', actual_t: 'Actual size 100% (1)',
    fit_page: 'Fit page', fit_width: 'Fit width',
    rot_l_t: 'Rotate 90° left', rot_r_t: 'Rotate 90° right (R)',
    prev_t: 'Previous page (←)', next_t: 'Next page (→)',
    bg_t: 'Toggle white / transparent background (EPS & PNG)',
    export: 'Export', export_t: 'Export the active document to the chosen format',
    batch: 'Batch', batch_t: 'Batch conversion (ZIP)',
    print_t: 'Print', copy_t: 'Copy image to clipboard',
    info_t: 'Info panel', theme_t: 'Light / dark theme', help_t: 'Help',
    files: 'Files', load_samples: 'Samples', load_samples_l: 'Load samples', clear_all: 'Clear',
    drop_hint: 'Drop files here', drop_here: 'Drop files to open them',
    welcome_title: 'Master viewer for EPS and documents',
    welcome_sub: 'Open or drop EPS, PS, AI, PDF, images, TIFF, DOCX, XLSX, CSV, Markdown or text files.',
    welcome_note: 'Everything is processed locally in your browser with Ghostscript (WebAssembly): your files are never uploaded.',
    rendering: 'Rendering…', converting: 'Converting…',
    doc_info: 'Document information', gs_log: 'Engine log',
    engine_loading: 'Loading engine…', engine_ready: 'Engine ready', engine_error: 'Engine error',
    batch_title: 'Batch conversion', batch_files: 'Files to convert', format: 'Format', quality: 'Quality',
    transparent_bg: 'Transparent background (PNG/WebP)', cancel: 'Cancel', convert_download: 'Convert & download ZIP',
    help_title: 'Help — VisorMaestro EPS', help_formats: 'Supported formats',
    help_gs: 'high-quality rendering up to 600 DPI, anti-aliasing, multi-page, DOS-header EPS.',
    help_imgs: 'Images:', help_docs: 'Documents:', help_export: 'Export',
    help_export_p: 'EPS/PS/AI/PDF → PNG, JPEG, PDF, TIFF, BMP, PS or WebP with configurable DPI and quality, single or batch (ZIP). Images can be re-exported to PNG, JPEG or WebP.',
    help_keys: 'Keyboard shortcuts', k_zoom: 'Zoom in / out', k_fit: 'Fit to window', k_100: 'Actual size (100%)',
    k_pages: 'Previous / next page', k_rot: 'Rotate 90°', k_wheel: 'Zoom with mouse wheel',
    help_privacy: 'Privacy', help_privacy_p: 'All processing happens in your browser via WebAssembly. No file ever leaves your computer.',
    st_zoom: 'Zoom', st_page: 'Page',
    unsupported: 'Unsupported format: ', load_error: 'Could not open: ',
    render_error: 'Render error: ', export_ok: 'Export completed: ', export_err: 'Export error: ',
    export_none: 'There is no active document to export.', format_not_for_kind: 'That format is not available for this file type. Use PNG, JPEG or WebP.',
    export_not_doc: 'This document type cannot be exported as an image.',
    copy_ok: 'Image copied to clipboard.', copy_err: 'Copy failed (clipboard requires HTTPS or localhost).',
    print_none: 'This document has no pages to print.',
    batch_none: 'Select at least one convertible file.', batch_done: 'Batch finished: ',
    batch_running: 'Converting {0} of {1}: {2}', batch_skipped: ' (skipped: {0})',
    confirm_clear: 'Remove all files from the list?', samples_loaded: 'Samples loaded.',
    engine_not_ready: 'The Ghostscript engine is still loading; try again in a few seconds.',
    dpi_warn: 'Rendering at 600 DPI may take several seconds.',
    pages_w: 'pages', page_w: 'page', sheet_w: 'Sheet',
    inf_name: 'Name', inf_type: 'Type', inf_size: 'Size', inf_pages: 'Pages', inf_dims: 'Dimensions (px)',
    inf_dpi: 'Render DPI', inf_time: 'Render time', inf_title: 'Title (DSC)', inf_creator: 'Creator',
    inf_date: 'Date', inf_bbox: 'BoundingBox', inf_lang: 'LanguageLevel', inf_pdfver: 'PDF version', inf_sheets: 'Sheets',
    kind_gs: 'PostScript / PDF', kind_image: 'Image', kind_tiff: 'TIFF', kind_docx: 'Word document',
    kind_sheet: 'Spreadsheet', kind_md: 'Markdown', kind_text: 'Text',
  },
};
let lang = localStorage.getItem('vm-lang') || 'es';
const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.es[k] || k;
const fmt = (s, ...a) => s.replace(/\{(\d)\}/g, (_, i) => a[+i]);

function applyI18n() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); });
  $('#langLabel').textContent = lang.toUpperCase();
}

/* ---------------- utilidades ---------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function toast(msg, type = 'info', ms = 4200) {
  const el = document.createElement('div');
  el.className = 'toast ' + (type === 'error' ? 'err' : type === 'ok' ? 'ok' : '');
  el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), ms);
}

function humanSize(n) {
  if (n < 1024) return n + ' B';
  if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1048576).toFixed(2) + ' MB';
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
}

const loadedScripts = new Map();
function loadScript(src) {
  if (loadedScripts.has(src)) return loadedScripts.get(src);
  const p = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => res();
    s.onerror = () => { loadedScripts.delete(src); rej(new Error('No se pudo cargar ' + src)); };
    document.head.appendChild(s);
  });
  loadedScripts.set(src, p);
  return p;
}

function baseName(name) { return name.replace(/\.[^.]+$/, ''); }

/* ---------------- worker Ghostscript ---------------- */
const gsWorker = new Worker('js/gs-worker.js');
const gsPending = new Map();
let gsSeq = 0;
let engineReady = false;

gsWorker.onmessage = (e) => {
  const m = e.data;
  const p = gsPending.get(m.id);
  if (!p) return;
  gsPending.delete(m.id);
  if (m.ok) p.res(m); else p.rej(Object.assign(new Error(m.error || 'error'), { log: m.log }));
};
gsWorker.onerror = (e) => { console.error('worker error', e); };

function gsCall(type, payload = {}, transfers = []) {
  return new Promise((res, rej) => {
    const id = ++gsSeq;
    gsPending.set(id, { res, rej });
    gsWorker.postMessage(Object.assign({ id, type }, payload), transfers);
  });
}

async function initEngine() {
  const st = $('#engineStatus');
  try {
    const r = await gsCall('init', {
      gsJsUrl: new URL('vendor/gs.js', location.href).href,
      gsWasmUrl: new URL('vendor/gs.wasm', location.href).href,
    });
    engineReady = true;
    st.className = 'st-item ready';
    st.innerHTML = '● ' + escapeHtml(r.engine || 'Ghostscript') + ' — ' + escapeHtml(t('engine_ready'));
  } catch (e) {
    st.className = 'st-item error';
    st.innerHTML = '● ' + escapeHtml(t('engine_error')) + ': ' + escapeHtml(e.message);
    toast(t('engine_error') + ': ' + e.message, 'error', 9000);
  }
}

/* ---------------- estado ---------------- */
const docs = new Map();      // id -> doc
let activeId = null;
let docSeq = 0;
let dpiWarned = false;

const EXT_KINDS = {
  eps: 'gs', epsf: 'gs', epi: 'gs', ps: 'gs', ai: 'gs', pdf: 'gs',
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image',
  bmp: 'image', svg: 'image', ico: 'image', avif: 'image',
  tif: 'tiff', tiff: 'tiff',
  docx: 'docx', xlsx: 'sheet', xls: 'sheet', csv: 'sheet',
  md: 'md', markdown: 'md',
  txt: 'text', json: 'text', xml: 'text', log: 'text',
};
const IMG_MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', bmp: 'image/bmp', svg: 'image/svg+xml', ico: 'image/x-icon', avif: 'image/avif' };

function detectKind(name, bytes) {
  const ext = (name.match(/\.([^.]+)$/) || [])[1]?.toLowerCase() || '';
  if (EXT_KINDS[ext]) return { kind: EXT_KINDS[ext], ext };
  // Detección por contenido
  const head = new TextDecoder('latin1').decode(bytes.subarray(0, 64));
  if (head.startsWith('%PDF-')) return { kind: 'gs', ext: 'pdf' };
  if (head.startsWith('%!PS')) return { kind: 'gs', ext: 'ps' };
  if (bytes[0] === 0xC5 && bytes[1] === 0xD0 && bytes[2] === 0xD3 && bytes[3] === 0xC6) return { kind: 'gs', ext: 'eps' };
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return { kind: 'image', ext: 'png' };
  if (bytes[0] === 0xFF && bytes[1] === 0xD8) return { kind: 'image', ext: 'jpg' };
  if (head.startsWith('GIF8')) return { kind: 'image', ext: 'gif' };
  // Texto plano si es mayormente imprimible
  const sample = bytes.subarray(0, 512);
  let printable = 0;
  for (const b of sample) if (b === 9 || b === 10 || b === 13 || (b >= 32 && b < 127) || b >= 128) printable++;
  if (sample.length > 0 && printable / sample.length > 0.9) return { kind: 'text', ext: 'txt' };
  return null;
}

function curDpi() { return parseInt($('#dpiSelect').value, 10); }
let alphaBg = false;

/* ---------------- ingesta de archivos ---------------- */
async function ingestFiles(files) {
  for (const f of files) {
    let bytes;
    try {
      bytes = new Uint8Array(await f.arrayBuffer());
    } catch (e) {
      toast(t('load_error') + f.name, 'error');
      continue;
    }
    addDoc(f.name, bytes);
  }
}

function addDoc(name, bytes) {
  const det = detectKind(name, bytes);
  if (!det) { toast(t('unsupported') + name, 'error'); return; }
  const id = 'd' + (++docSeq);
  const doc = {
    id, name, bytes, size: bytes.length,
    kind: det.kind, ext: det.ext,
    pages: [], html: [], pageCount: 0,
    view: { zoom: 'fit', rotation: 0, page: 1 },
    state: 'loading', error: null, log: '', renderMs: 0,
    dpi: null, alpha: false, meta: {}, thumb: null,
  };
  docs.set(id, doc);
  renderFileList();
  setActive(id);
  processDoc(doc);
}

async function processDoc(doc) {
  doc.state = 'loading';
  if (doc.id === activeId) showSpinner(true);
  try {
    if (doc.kind === 'gs') await loadGsDoc(doc);
    else if (doc.kind === 'image') await loadImageDoc(doc);
    else if (doc.kind === 'tiff') await loadTiffDoc(doc);
    else if (doc.kind === 'docx') await loadDocxDoc(doc);
    else if (doc.kind === 'sheet') await loadSheetDoc(doc);
    else if (doc.kind === 'md') await loadMdDoc(doc);
    else if (doc.kind === 'text') await loadTextDoc(doc);
    doc.state = 'ready';
    await makeThumb(doc);
  } catch (e) {
    console.error(e);
    doc.state = 'error';
    doc.error = e.message || String(e);
    doc.log = (e.log || '') + '';
    toast(t('render_error') + doc.name + ' — ' + doc.error, 'error', 7000);
  }
  renderFileList();
  if (doc.id === activeId) { showSpinner(false); showActive(); }
}

function revokePages(doc) {
  for (const p of doc.pages) if (p.url) URL.revokeObjectURL(p.url);
  doc.pages = [];
}

/* --- EPS / PS / AI / PDF (Ghostscript) --- */
async function loadGsDoc(doc, dpi = curDpi(), alpha = alphaBg) {
  if (!engineReady) {
    // Espera a que el motor termine de cargar (hasta 30 s)
    for (let i = 0; i < 120 && !engineReady; i++) await new Promise((r) => setTimeout(r, 250));
    if (!engineReady) throw new Error(t('engine_not_ready'));
  }
  const buf = doc.bytes.slice().buffer;
  const res = await gsCall('render', { bytes: buf, name: doc.name, dpi, alpha }, [buf]);
  revokePages(doc);
  doc.pages = res.pages.map((ab) => ({ url: URL.createObjectURL(new Blob([ab], { type: res.mime })), w: 0, h: 0 }));
  await Promise.all(doc.pages.map((p) => new Promise((resolve) => {
    const im = new Image();
    im.onload = () => { p.w = im.naturalWidth; p.h = im.naturalHeight; resolve(); };
    im.onerror = () => resolve();
    im.src = p.url;
  })));
  doc.pageCount = doc.pages.length;
  doc.dpi = dpi; doc.alpha = alpha;
  doc.log = res.log || ''; doc.renderMs = res.elapsedMs || 0;
  if (doc.view.page > doc.pageCount) doc.view.page = 1;
  parseDscMeta(doc);
}

function parseDscMeta(doc) {
  const head = new TextDecoder('latin1').decode(doc.bytes.subarray(0, 8192));
  const meta = {};
  const grab = (re) => { const m = head.match(re); return m ? m[1].trim() : null; };
  if (head.startsWith('%PDF-')) {
    meta.pdfVersion = grab(/^%PDF-([\d.]+)/);
  } else {
    meta.title = grab(/%%Title:\s*(.+)/);
    meta.creator = grab(/%%Creator:\s*(.+)/);
    meta.date = grab(/%%CreationDate:\s*(.+)/);
    meta.bbox = grab(/%%BoundingBox:\s*(.+)/);
    meta.langLevel = grab(/%%LanguageLevel:\s*(.+)/);
  }
  doc.meta = meta;
}

/* --- imágenes nativas --- */
async function loadImageDoc(doc) {
  const mime = IMG_MIME[doc.ext] || 'image/png';
  const url = URL.createObjectURL(new Blob([doc.bytes], { type: mime }));
  const dims = await new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve({ w: im.naturalWidth || 800, h: im.naturalHeight || 600 });
    im.onerror = () => reject(new Error(t('unsupported') + doc.ext.toUpperCase()));
    im.src = url;
  });
  revokePages(doc);
  doc.pages = [{ url, w: dims.w, h: dims.h }];
  doc.pageCount = 1;
}

/* --- TIFF (UTIF.js) --- */
async function loadTiffDoc(doc) {
  await loadScript('vendor/UTIF.js');
  const ifds = UTIF.decode(doc.bytes.buffer.slice(doc.bytes.byteOffset, doc.bytes.byteOffset + doc.bytes.byteLength));
  if (!ifds.length) throw new Error('TIFF sin páginas');
  revokePages(doc);
  const buf = doc.bytes.buffer.slice(doc.bytes.byteOffset, doc.bytes.byteOffset + doc.bytes.byteLength);
  for (const ifd of ifds) {
    UTIF.decodeImage(buf, ifd, ifds);
    const rgba = UTIF.toRGBA8(ifd);
    const c = document.createElement('canvas');
    c.width = ifd.width; c.height = ifd.height;
    const ctx = c.getContext('2d');
    const imgData = ctx.createImageData(ifd.width, ifd.height);
    imgData.data.set(rgba);
    ctx.putImageData(imgData, 0, 0);
    const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
    doc.pages.push({ url: URL.createObjectURL(blob), w: ifd.width, h: ifd.height });
  }
  doc.pageCount = doc.pages.length;
}

/* --- DOCX (mammoth) --- */
const DOC_FRAME_CSS = `
  body { font: 15px/1.6 "Segoe UI", system-ui, sans-serif; color: #1c2330; background: #fff;
         max-width: 820px; margin: 0 auto; padding: 48px 56px; }
  img { max-width: 100%; } table { border-collapse: collapse; }
  td, th { border: 1px solid #c9d1de; padding: 4px 9px; }
  h1, h2, h3 { line-height: 1.25; } a { color: #2f6fe0; }
  pre, code { font-family: ui-monospace, Consolas, monospace; background: #f3f5f9; }
  pre { padding: 12px; overflow-x: auto; border-radius: 6px; }
  blockquote { border-left: 4px solid #c9d1de; margin-left: 0; padding-left: 14px; color: #5b6572; }`;

function wrapSrcdoc(bodyHtml, extraCss = '') {
  return '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' + DOC_FRAME_CSS + extraCss + '</style></head><body>' + bodyHtml + '</body></html>';
}

async function loadDocxDoc(doc) {
  await loadScript('vendor/mammoth.browser.min.js');
  const ab = doc.bytes.buffer.slice(doc.bytes.byteOffset, doc.bytes.byteOffset + doc.bytes.byteLength);
  const res = await window.mammoth.convertToHtml({ arrayBuffer: ab });
  doc.html = [{ title: doc.name, srcdoc: wrapSrcdoc(res.value) }];
  doc.pageCount = 1;
}

/* --- XLSX / XLS / CSV (SheetJS) --- */
async function loadSheetDoc(doc) {
  await loadScript('vendor/xlsx.full.min.js');
  let wb;
  if (doc.ext === 'csv') {
    const text = new TextDecoder().decode(doc.bytes);
    wb = XLSX.read(text, { type: 'string' });
  } else {
    wb = XLSX.read(doc.bytes, { type: 'array' });
  }
  const tableCss = ' body{padding:24px;max-width:none} table{font-size:13px} td,th{white-space:nowrap} th{background:#eef1f6}';
  doc.html = wb.SheetNames.map((sn) => {
    const full = XLSX.utils.sheet_to_html(wb.Sheets[sn]);
    const table = (full.match(/<table[\s\S]*<\/table>/i) || [full])[0];
    return {
      title: sn,
      srcdoc: wrapSrcdoc('<h2 style="margin-top:0">' + escapeHtml(sn) + '</h2>' + table, tableCss),
    };
  });
  if (!doc.html.length) throw new Error('Libro vacío');
  doc.pageCount = doc.html.length;
  doc.meta.sheets = wb.SheetNames.join(', ');
}

/* --- Markdown (marked) --- */
async function loadMdDoc(doc) {
  await loadScript('vendor/marked.min.js');
  const text = new TextDecoder().decode(doc.bytes);
  const html = window.marked.parse(text, { mangle: false, headerIds: false });
  doc.html = [{ title: doc.name, srcdoc: wrapSrcdoc(html) }];
  doc.pageCount = 1;
}

/* --- texto plano --- */
async function loadTextDoc(doc) {
  const text = new TextDecoder().decode(doc.bytes);
  const body = '<pre style="white-space:pre-wrap;word-wrap:break-word;font:13px/1.55 ui-monospace,Consolas,monospace;margin:0">' + escapeHtml(text) + '</pre>';
  doc.html = [{ title: doc.name, srcdoc: wrapSrcdoc(body, ' body{max-width:1000px;padding:28px 34px}') }];
  doc.pageCount = 1;
}

/* ---------------- miniaturas ---------------- */
async function makeThumb(doc) {
  if (doc.pages.length) {
    try {
      const p = doc.pages[0];
      const im = new Image();
      await new Promise((res, rej) => { im.onload = res; im.onerror = rej; im.src = p.url; });
      const c = document.createElement('canvas');
      const s = Math.min(88 / im.naturalWidth, 88 / im.naturalHeight, 1);
      c.width = Math.max(1, Math.round(im.naturalWidth * s));
      c.height = Math.max(1, Math.round(im.naturalHeight * s));
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      doc.thumb = c.toDataURL('image/png');
    } catch (e) { doc.thumb = null; }
  }
}

/* ---------------- lista de archivos ---------------- */
function renderFileList() {
  const ul = $('#fileList');
  ul.innerHTML = '';
  for (const doc of docs.values()) {
    const li = document.createElement('li');
    li.dataset.id = doc.id;
    if (doc.id === activeId) li.classList.add('active');
    if (doc.state === 'error') li.classList.add('error');

    const th = document.createElement('div');
    th.className = 'thumb';
    if (doc.thumb) {
      const im = document.createElement('img');
      im.src = doc.thumb; im.alt = '';
      th.appendChild(im);
    } else {
      th.textContent = doc.ext.toUpperCase().slice(0, 4);
    }

    const meta = document.createElement('div');
    meta.className = 'fitem-meta';
    const nm = document.createElement('div');
    nm.className = 'fitem-name'; nm.textContent = doc.name; nm.title = doc.name;
    const sub = document.createElement('div');
    sub.className = 'fitem-sub';
    const badge = document.createElement('span');
    badge.className = 'badge' + (doc.state === 'error' ? ' err' : '');
    badge.textContent = doc.state === 'error' ? 'ERROR' : doc.ext.toUpperCase();
    sub.appendChild(badge);
    const sz = document.createElement('span');
    sz.textContent = humanSize(doc.size) + (doc.pageCount > 1 ? ' · ' + doc.pageCount + ' ' + t('pages_w') : '');
    sub.appendChild(sz);
    meta.appendChild(nm); meta.appendChild(sub);

    const close = document.createElement('button');
    close.className = 'mini-btn fitem-close'; close.textContent = '✕';
    close.onclick = (ev) => { ev.stopPropagation(); removeDoc(doc.id); };

    li.appendChild(th); li.appendChild(meta); li.appendChild(close);
    li.onclick = () => setActive(doc.id);
    ul.appendChild(li);
  }
}

function removeDoc(id) {
  const doc = docs.get(id);
  if (!doc) return;
  revokePages(doc);
  docs.delete(id);
  if (activeId === id) {
    activeId = null;
    const first = docs.keys().next();
    if (!first.done) setActive(first.value);
    else showWelcome();
  }
  renderFileList();
}

function clearAll() {
  if (!docs.size) return;
  if (!confirm(t('confirm_clear'))) return;
  for (const d of docs.values()) revokePages(d);
  docs.clear();
  activeId = null;
  renderFileList();
  showWelcome();
}

/* ---------------- visor ---------------- */
function activeDoc() { return docs.get(activeId) || null; }

function setActive(id) {
  activeId = id;
  renderFileList();
  const doc = activeDoc();
  if (!doc) { showWelcome(); return; }
  if (doc.state === 'loading') { $('#welcome').hidden = true; $('#stageScroll').hidden = true; showSpinner(true); }
  else { showSpinner(false); showActive(); }
  updateInfoPanel();
}

function showWelcome() {
  $('#welcome').hidden = false;
  $('#stageScroll').hidden = true;
  showSpinner(false);
  $('#pageBox').innerHTML = '';
  updateToolbar(); updateStatus(); updateInfoPanel();
}

function showSpinner(on, textKey = 'rendering') {
  $('#stageSpinner').hidden = !on;
  $('#spinnerText').textContent = t(textKey);
}

function showActive() {
  const doc = activeDoc();
  if (!doc) { showWelcome(); return; }
  $('#welcome').hidden = true;
  $('#stageScroll').hidden = false;
  const box = $('#pageBox');
  box.innerHTML = '';

  if (doc.state === 'error') {
    box.innerHTML = '<div style="max-width:460px;padding:26px;background:var(--bg-2);border:1px solid var(--border);border-radius:12px">' +
      '<h3 style="margin-top:0;color:var(--danger)">⚠ ' + escapeHtml(t('render_error')) + '</h3>' +
      '<p style="word-break:break-word">' + escapeHtml(doc.name) + '</p>' +
      '<pre style="white-space:pre-wrap;font-size:11px;color:var(--fg-dim)">' + escapeHtml(doc.error || '') + '</pre></div>';
    updateToolbar(); updateStatus(); updateInfoPanel();
    return;
  }

  syncZoomSelect(doc);

  if (doc.pages.length) {
    const holder = document.createElement('div');
    holder.className = 'page-holder' + (alphaBg && (doc.kind === 'gs' || doc.kind === 'image' || doc.kind === 'tiff') ? ' checker' : '');
    holder.style.position = 'relative';
    holder.style.overflow = 'hidden';
    const img = document.createElement('img');
    img.className = 'page-img';
    img.alt = doc.name;
    holder.appendChild(img);
    box.appendChild(holder);
    updateRasterView();
  } else if (doc.html.length) {
    const iframe = document.createElement('iframe');
    iframe.className = 'doc-frame';
    iframe.setAttribute('sandbox', 'allow-same-origin');
    box.appendChild(iframe);
    updateFrameView();
  }
  updateToolbar(); updateStatus(); updateInfoPanel();
}

function syncZoomSelect(doc) {
  const sel = $('#zoomSelect');
  const z = doc.view.zoom;
  if (z === 'fit' || z === 'fitw') { sel.value = z; return; }
  sel.value = String(z);
  if (sel.selectedIndex === -1) setZoom(z); // crea la opción personalizada
}

function zoomValue(doc, w, h) {
  const stage = $('#stageScroll');
  const availW = Math.max(80, stage.clientWidth - 56);
  const availH = Math.max(80, stage.clientHeight - 56);
  const z = doc.view.zoom;
  if (z === 'fit') return Math.min(availW / w, availH / h);
  if (z === 'fitw') return availW / w;
  return z;
}

function updateRasterView() {
  const doc = activeDoc();
  if (!doc || !doc.pages.length) return;
  const page = doc.pages[Math.min(doc.view.page, doc.pageCount) - 1];
  const holder = $('#pageBox .page-holder');
  const img = $('#pageBox img.page-img');
  if (!holder || !img) return;

  const rot = ((doc.view.rotation % 360) + 360) % 360;
  const swapped = rot === 90 || rot === 270;
  const rw = swapped ? page.h : page.w;
  const rh = swapped ? page.w : page.h;
  const scale = Math.max(0.02, Math.min(32, zoomValue(doc, rw, rh)));
  doc.view.effZoom = scale;

  holder.style.width = Math.round(rw * scale) + 'px';
  holder.style.height = Math.round(rh * scale) + 'px';
  if (img.dataset.url !== page.url) { img.src = page.url; img.dataset.url = page.url; }
  img.style.width = Math.round(page.w * scale) + 'px';
  img.style.height = Math.round(page.h * scale) + 'px';
  img.style.position = 'absolute';
  img.style.left = '50%';
  img.style.top = '50%';
  img.style.transform = 'translate(-50%,-50%) rotate(' + rot + 'deg)';
  updateStatus();
}

function updateFrameView() {
  const doc = activeDoc();
  if (!doc || !doc.html.length) return;
  const iframe = $('#pageBox iframe.doc-frame');
  if (!iframe) return;
  const idx = Math.min(doc.view.page, doc.pageCount) - 1;
  const entry = doc.html[idx];
  const baseW = 880;
  const z = typeof doc.view.zoom === 'number' ? doc.view.zoom : 1;
  doc.view.effZoom = z;

  const setSize = () => {
    let h = 600;
    try { h = Math.max(240, iframe.contentDocument.documentElement.scrollHeight + 8); } catch (e) { /* ignora */ }
    iframe.style.width = baseW + 'px';
    iframe.style.height = h + 'px';
    iframe.style.transformOrigin = '0 0';
    iframe.style.transform = 'scale(' + z + ')';
    const holderW = Math.round(baseW * z), holderH = Math.round(h * z);
    iframe.parentElement.style.width = holderW + 'px';
    iframe.parentElement.style.height = holderH + 'px';
  };

  if (iframe.dataset.page !== String(idx)) {
    iframe.dataset.page = String(idx);
    iframe.onload = setSize;
    iframe.srcdoc = entry.srcdoc;
    // Contenedor auxiliar para poder escalar
    if (!iframe.parentElement.classList.contains('frame-holder')) {
      const holder = document.createElement('div');
      holder.className = 'frame-holder';
      holder.style.overflow = 'hidden';
      iframe.replaceWith(holder);
      holder.appendChild(iframe);
    }
  } else {
    setSize();
  }
  updateStatus();
}

function refreshView() {
  const doc = activeDoc();
  if (!doc) return;
  if (doc.pages.length) updateRasterView();
  else if (doc.html.length) updateFrameView();
}

/* ---------------- zoom / rotación / páginas ---------------- */
function setZoom(z) {
  const doc = activeDoc();
  if (!doc) return;
  doc.view.zoom = z;
  const sel = $('#zoomSelect');
  let custom = sel.querySelector('option[data-custom]');
  if (z === 'fit' || z === 'fitw') {
    sel.value = z;
  } else {
    sel.value = String(z);
    if (sel.selectedIndex === -1) {
      if (!custom) {
        custom = document.createElement('option');
        custom.dataset.custom = '1';
        sel.insertBefore(custom, sel.firstChild);
      }
      custom.value = String(z);
      custom.textContent = Math.round(z * 100) + '%';
      sel.value = String(z);
    }
  }
  refreshView();
}

function nudgeZoom(factor) {
  const doc = activeDoc();
  if (!doc) return;
  const cur = doc.view.effZoom || 1;
  setZoom(Math.max(0.02, Math.min(32, +(cur * factor).toFixed(4))));
}

function rotate(delta) {
  const doc = activeDoc();
  if (!doc || !doc.pages.length) return;
  doc.view.rotation = (doc.view.rotation + delta + 360) % 360;
  refreshView();
}

function goPage(delta) {
  const doc = activeDoc();
  if (!doc || doc.pageCount < 2) return;
  const n = Math.max(1, Math.min(doc.pageCount, doc.view.page + delta));
  if (n === doc.view.page) return;
  doc.view.page = n;
  refreshView();
  updateToolbar();
}

/* ---------------- barra de estado / toolbar / info ---------------- */
function updateToolbar() {
  const doc = activeDoc();
  const ready = !!doc && doc.state === 'ready';
  const isRaster = ready && doc.pages.length > 0;
  const isGs = ready && doc.kind === 'gs';
  $('#btnPrev').disabled = !ready || doc.view.page <= 1;
  $('#btnNext').disabled = !ready || doc.view.page >= doc.pageCount;
  $('#pageIndicator').textContent = ready ? doc.view.page + ' / ' + doc.pageCount : '– / –';
  $('#btnRotL').disabled = !isRaster;
  $('#btnRotR').disabled = !isRaster;
  $('#btnPrint').disabled = !isRaster;
  $('#btnCopy').disabled = !isRaster;
  $('#btnExport').disabled = !ready || (!isRaster && !isGs);
  $('#dpiSelect').disabled = !isGs;
  $('#btnBg').disabled = !isRaster;
  $('#btnZoomIn').disabled = !ready;
  $('#btnZoomOut').disabled = !ready;
  $('#btnFit').disabled = !ready;
  $('#btnActual').disabled = !ready;
  $('#zoomSelect').disabled = !ready;
}

function updateStatus() {
  const doc = activeDoc();
  if (!doc || doc.state !== 'ready') {
    $('#stZoom').textContent = '–'; $('#stPage').textContent = '–';
    $('#stDims').textContent = '–'; $('#stTime').textContent = '–';
    return;
  }
  const z = doc.view.effZoom || 1;
  $('#stZoom').textContent = t('st_zoom') + ': ' + Math.round(z * 100) + '%';
  const pgName = (doc.kind === 'sheet' && doc.html[doc.view.page - 1]) ? ' (' + doc.html[doc.view.page - 1].title + ')' : '';
  $('#stPage').textContent = t('st_page') + ': ' + doc.view.page + '/' + doc.pageCount + pgName;
  if (doc.pages.length) {
    const p = doc.pages[doc.view.page - 1];
    $('#stDims').textContent = p.w + '×' + p.h + ' px' + (doc.dpi ? ' @' + doc.dpi + ' DPI' : '');
  } else {
    $('#stDims').textContent = '–';
  }
  $('#stTime').textContent = doc.renderMs ? doc.renderMs + ' ms' : '–';
}

function updateInfoPanel() {
  const doc = activeDoc();
  const dl = $('#infoList');
  const logEl = $('#gsLog');
  dl.innerHTML = ''; logEl.textContent = '';
  if (!doc) return;
  const rows = [];
  rows.push([t('inf_name'), doc.name]);
  rows.push([t('inf_type'), t('kind_' + doc.kind) + ' (' + doc.ext.toUpperCase() + ')']);
  rows.push([t('inf_size'), humanSize(doc.size)]);
  if (doc.pageCount) rows.push([t('inf_pages'), String(doc.pageCount)]);
  if (doc.pages.length && doc.state === 'ready') {
    const p = doc.pages[doc.view.page - 1];
    rows.push([t('inf_dims'), p.w + ' × ' + p.h]);
  }
  if (doc.dpi) rows.push([t('inf_dpi'), doc.dpi + ' DPI']);
  if (doc.renderMs) rows.push([t('inf_time'), doc.renderMs + ' ms']);
  const m = doc.meta || {};
  if (m.title) rows.push([t('inf_title'), m.title]);
  if (m.creator) rows.push([t('inf_creator'), m.creator]);
  if (m.date) rows.push([t('inf_date'), m.date]);
  if (m.bbox) rows.push([t('inf_bbox'), m.bbox]);
  if (m.langLevel) rows.push([t('inf_lang'), m.langLevel]);
  if (m.pdfVersion) rows.push([t('inf_pdfver'), m.pdfVersion]);
  if (m.sheets) rows.push([t('inf_sheets'), m.sheets]);
  for (const [k, v] of rows) {
    const dt = document.createElement('dt'); dt.textContent = k;
    const dd = document.createElement('dd'); dd.textContent = v;
    dl.appendChild(dt); dl.appendChild(dd);
  }
  logEl.textContent = doc.log || '';
}

/* ---------------- exportación ---------------- */
const CANVAS_FORMATS = { png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp' };

async function canvasEncodePage(pageUrl, mime, quality, transparent) {
  const im = new Image();
  await new Promise((res, rej) => { im.onload = res; im.onerror = () => rej(new Error('img')); im.src = pageUrl; });
  const c = document.createElement('canvas');
  c.width = im.naturalWidth; c.height = im.naturalHeight;
  const ctx = c.getContext('2d');
  if (!transparent || mime === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); }
  ctx.drawImage(im, 0, 0);
  const blob = await new Promise((r) => c.toBlob(r, mime, quality / 100));
  if (!blob) throw new Error('canvas.toBlob');
  return blob;
}

async function zipAndDownload(nameNoExt, entries) {
  await loadScript('vendor/jszip.min.js');
  const zip = new JSZip();
  for (const e of entries) zip.file(e.name, e.blob);
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, nameNoExt + '.zip');
}

// Convierte un doc a un formato; devuelve [{name, blob}]
async function convertDoc(doc, format, dpi, quality, alpha) {
  const base = baseName(doc.name);
  if (doc.kind === 'gs') {
    if (CANVAS_FORMATS[format] && format === 'webp') {
      // WebP: renderiza PNG con gs y recodifica en canvas
      const buf = doc.bytes.slice().buffer;
      const res = await gsCall('render', { bytes: buf, name: doc.name, dpi, alpha }, [buf]);
      const out = [];
      for (let i = 0; i < res.pages.length; i++) {
        const url = URL.createObjectURL(new Blob([res.pages[i]], { type: 'image/png' }));
        try {
          const blob = await canvasEncodePage(url, 'image/webp', quality, alpha);
          out.push({ name: base + (res.pages.length > 1 ? '-p' + (i + 1) : '') + '.webp', blob });
        } finally { URL.revokeObjectURL(url); }
      }
      return out;
    }
    const buf = doc.bytes.slice().buffer;
    const res = await gsCall('convert', { bytes: buf, name: doc.name, format, dpi, quality, alpha }, [buf]);
    return res.pages.map((ab, i) => ({
      name: base + (res.pages.length > 1 ? '-p' + (i + 1) : '') + '.' + res.ext,
      blob: new Blob([ab], { type: res.mime }),
    }));
  }
  if (doc.pages.length) { // image / tiff
    const mime = CANVAS_FORMATS[format];
    if (!mime) throw new Error(t('format_not_for_kind'));
    const out = [];
    for (let i = 0; i < doc.pages.length; i++) {
      const blob = await canvasEncodePage(doc.pages[i].url, mime, quality, alpha);
      const ext = format === 'jpeg' ? 'jpg' : format;
      out.push({ name: base + (doc.pages.length > 1 ? '-p' + (i + 1) : '') + '.' + ext, blob });
    }
    return out;
  }
  throw new Error(t('export_not_doc'));
}

async function exportActive() {
  const doc = activeDoc();
  if (!doc || doc.state !== 'ready') { toast(t('export_none'), 'error'); return; }
  const format = $('#exportFormat').value;
  showSpinner(true, 'converting');
  try {
    const outs = await convertDoc(doc, format, curDpi(), 90, alphaBg);
    if (outs.length === 1) downloadBlob(outs[0].blob, outs[0].name);
    else await zipAndDownload(baseName(doc.name) + '-' + format, outs);
    toast(t('export_ok') + (outs.length === 1 ? outs[0].name : outs.length + ' ' + t('pages_w')), 'ok');
  } catch (e) {
    console.error(e);
    toast(t('export_err') + e.message, 'error', 7000);
  }
  showSpinner(false);
}

/* ---------------- conversión por lotes ---------------- */
function openBatchModal() {
  const list = $('#batchList');
  list.innerHTML = '';
  let any = false;
  for (const doc of docs.values()) {
    if (doc.state !== 'ready') continue;
    if (doc.kind !== 'gs' && !doc.pages.length) continue;
    any = true;
    const label = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.checked = true; cb.dataset.id = doc.id;
    const span = document.createElement('span');
    span.textContent = doc.name;
    const mut = document.createElement('span');
    mut.className = 'muted';
    mut.textContent = doc.ext.toUpperCase() + ' · ' + humanSize(doc.size);
    label.appendChild(cb); label.appendChild(span); label.appendChild(mut);
    list.appendChild(label);
  }
  if (!any) { toast(t('batch_none'), 'error'); return; }
  $('#batchProgressWrap').hidden = true;
  $('#batchModal').hidden = false;
}

async function runBatch() {
  const ids = $$('#batchList input:checked').map((c) => c.dataset.id);
  if (!ids.length) { toast(t('batch_none'), 'error'); return; }
  const format = $('#batchFormat').value;
  const dpi = parseInt($('#batchDpi').value, 10);
  const quality = Math.max(10, Math.min(100, parseInt($('#batchQuality').value, 10) || 90));
  const alpha = $('#batchAlpha').checked;

  const wrap = $('#batchProgressWrap'); wrap.hidden = false;
  const bar = $('#batchProgressBar'); const txt = $('#batchProgressText');
  const btn = $('#btnBatchRun'); btn.disabled = true;

  const entries = [];
  let skipped = 0;
  for (let i = 0; i < ids.length; i++) {
    const doc = docs.get(ids[i]);
    if (!doc) continue;
    bar.style.width = Math.round((i / ids.length) * 100) + '%';
    txt.textContent = fmt(t('batch_running'), i + 1, ids.length, doc.name);
    try {
      const outs = await convertDoc(doc, format, dpi, quality, alpha);
      const folder = outs.length > 1 ? baseName(doc.name) + '/' : '';
      for (const o of outs) entries.push({ name: folder + o.name, blob: o.blob });
    } catch (e) {
      console.error(e);
      skipped++;
    }
  }
  bar.style.width = '100%';
  btn.disabled = false;
  if (!entries.length) { txt.textContent = t('batch_none'); return; }
  await zipAndDownload('conversion-' + format, entries);
  let msg = t('batch_done') + entries.length + ' ' + (entries.length === 1 ? t('page_w') : t('pages_w'));
  if (skipped) msg += fmt(t('batch_skipped'), skipped);
  txt.textContent = msg;
  toast(msg, 'ok');
}

/* ---------------- imprimir / copiar ---------------- */
function printActive() {
  const doc = activeDoc();
  if (!doc || !doc.pages.length) { toast(t('print_none'), 'error'); return; }
  const w = window.open('', '_blank');
  if (!w) return;
  const imgs = doc.pages.map((p) => '<img src="' + p.url + '" style="max-width:100%;page-break-after:always">').join('');
  w.document.write('<!DOCTYPE html><html><head><title>' + escapeHtml(doc.name) + '</title>' +
    '<style>body{margin:0;text-align:center}@media print{img{max-width:100%}}</style></head><body>' + imgs + '</body></html>');
  w.document.close();
  const doPrint = () => { try { w.focus(); w.print(); } catch (e) { /* ventana cerrada */ } };
  if (w.document.readyState === 'complete') setTimeout(doPrint, 300);
  else w.onload = () => setTimeout(doPrint, 150);
}

async function copyActive() {
  const doc = activeDoc();
  if (!doc || !doc.pages.length) return;
  try {
    const blob = await canvasEncodePage(doc.pages[doc.view.page - 1].url, 'image/png', 100, doc.alpha);
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    toast(t('copy_ok'), 'ok');
  } catch (e) {
    console.error(e);
    toast(t('copy_err'), 'error');
  }
}

/* ---------------- re-render con nuevo DPI / fondo ---------------- */
async function reRenderActive() {
  const doc = activeDoc();
  if (!doc || doc.kind !== 'gs' || doc.state !== 'ready') return;
  doc.state = 'loading';
  renderFileList();
  showSpinner(true);
  try {
    await loadGsDoc(doc, curDpi(), alphaBg);
    doc.state = 'ready';
    await makeThumb(doc);
  } catch (e) {
    doc.state = 'error'; doc.error = e.message;
    toast(t('render_error') + e.message, 'error');
  }
  renderFileList();
  showSpinner(false);
  showActive();
}

/* ---------------- eventos ---------------- */
function bindEvents() {
  const fileInput = $('#fileInput');
  $('#btnOpen').onclick = () => fileInput.click();
  $('#btnOpen2').onclick = () => fileInput.click();
  fileInput.onchange = () => { ingestFiles(Array.from(fileInput.files)); fileInput.value = ''; };

  const loadSamples = () => {
    for (const s of (window.VM_SAMPLES || [])) addDoc(s.name, new TextEncoder().encode(s.data));
    toast(t('samples_loaded'), 'ok');
  };
  $('#btnSamples').onclick = loadSamples;
  $('#btnSamples2').onclick = loadSamples;
  $('#btnClearAll').onclick = clearAll;

  // Zoom
  $('#btnZoomIn').onclick = () => nudgeZoom(1.25);
  $('#btnZoomOut').onclick = () => nudgeZoom(1 / 1.25);
  $('#btnFit').onclick = () => setZoom('fit');
  $('#btnActual').onclick = () => setZoom(1);
  $('#zoomSelect').onchange = (e) => {
    const v = e.target.value;
    setZoom(v === 'fit' || v === 'fitw' ? v : parseFloat(v));
  };

  // Rotación y páginas
  $('#btnRotL').onclick = () => rotate(-90);
  $('#btnRotR').onclick = () => rotate(90);
  $('#btnPrev').onclick = () => goPage(-1);
  $('#btnNext').onclick = () => goPage(1);

  // DPI y fondo
  $('#dpiSelect').onchange = () => {
    if (curDpi() >= 600 && !dpiWarned) { toast(t('dpi_warn')); dpiWarned = true; }
    reRenderActive();
  };
  $('#btnBg').onclick = () => {
    alphaBg = !alphaBg;
    const doc = activeDoc();
    if (doc && doc.kind === 'gs') reRenderActive();
    else showActive();
  };

  // Exportar / lotes / imprimir / copiar
  $('#btnExport').onclick = exportActive;
  $('#btnBatch').onclick = openBatchModal;
  $('#btnBatchRun').onclick = runBatch;
  $('#btnPrint').onclick = printActive;
  $('#btnCopy').onclick = copyActive;

  // Paneles y modales
  $('#btnInfo').onclick = () => { $('#infoPanel').hidden = !$('#infoPanel').hidden; };
  $('#btnCloseInfo').onclick = () => { $('#infoPanel').hidden = true; };
  $('#btnHelp').onclick = () => { $('#helpModal').hidden = false; };
  $$('.modal [data-close]').forEach((b) => { b.onclick = () => { b.closest('.modal').hidden = true; }; });
  $$('.modal').forEach((m) => { m.addEventListener('mousedown', (e) => { if (e.target === m) m.hidden = true; }); });

  // Tema e idioma
  $('#btnTheme').onclick = () => {
    const cur = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = cur;
    localStorage.setItem('vm-theme', cur);
  };
  $('#btnLang').onclick = () => {
    lang = lang === 'es' ? 'en' : 'es';
    localStorage.setItem('vm-lang', lang);
    applyI18n(); updateStatus(); updateToolbar(); updateInfoPanel();
  };

  // Ocultar calidad cuando no aplica
  $('#batchFormat').onchange = () => {
    const f = $('#batchFormat').value;
    $('#batchQualityWrap').style.visibility = (f === 'jpeg' || f === 'webp') ? 'visible' : 'hidden';
  };

  // Arrastrar y soltar
  let dragDepth = 0;
  window.addEventListener('dragenter', (e) => {
    if (!e.dataTransfer || !Array.from(e.dataTransfer.types).includes('Files')) return;
    dragDepth++;
    $('#dropOverlay').hidden = false;
  });
  window.addEventListener('dragleave', () => {
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) $('#dropOverlay').hidden = true;
  });
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDepth = 0;
    $('#dropOverlay').hidden = true;
    if (e.dataTransfer && e.dataTransfer.files.length) ingestFiles(Array.from(e.dataTransfer.files));
  });

  // Zoom con Ctrl+rueda, anclado al cursor
  const stage = $('#stageScroll');
  stage.addEventListener('wheel', (e) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    const doc = activeDoc();
    if (!doc) return;
    const rect = stage.getBoundingClientRect();
    const px = (stage.scrollLeft + (e.clientX - rect.left)) / stage.scrollWidth;
    const py = (stage.scrollTop + (e.clientY - rect.top)) / stage.scrollHeight;
    nudgeZoom(e.deltaY < 0 ? 1.2 : 1 / 1.2);
    requestAnimationFrame(() => {
      stage.scrollLeft = px * stage.scrollWidth - (e.clientX - rect.left);
      stage.scrollTop = py * stage.scrollHeight - (e.clientY - rect.top);
    });
  }, { passive: false });

  // Arrastre para desplazarse
  let panning = null;
  stage.classList.add('grab');
  stage.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    panning = { x: e.clientX, y: e.clientY, sl: stage.scrollLeft, st: stage.scrollTop };
    stage.classList.add('grabbing');
  });
  window.addEventListener('mousemove', (e) => {
    if (!panning) return;
    stage.scrollLeft = panning.sl - (e.clientX - panning.x);
    stage.scrollTop = panning.st - (e.clientY - panning.y);
  });
  window.addEventListener('mouseup', () => { panning = null; stage.classList.remove('grabbing'); });

  // Teclado
  window.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
    if (!$('#batchModal').hidden || !$('#helpModal').hidden) {
      if (e.key === 'Escape') { $('#batchModal').hidden = true; $('#helpModal').hidden = true; }
      return;
    }
    switch (e.key) {
      case '+': case '=': nudgeZoom(1.25); break;
      case '-': case '_': nudgeZoom(1 / 1.25); break;
      case '0': setZoom('fit'); break;
      case '1': setZoom(1); break;
      case 'ArrowLeft': goPage(-1); break;
      case 'ArrowRight': goPage(1); break;
      case 'r': case 'R': rotate(90); break;
      default: return;
    }
    e.preventDefault();
  });

  // Reajustar al cambiar el tamaño de la ventana
  new ResizeObserver(() => {
    const doc = activeDoc();
    if (doc && (doc.view.zoom === 'fit' || doc.view.zoom === 'fitw')) refreshView();
  }).observe($('#stage'));
}

/* ---------------- arranque ---------------- */
(function main() {
  const savedTheme = localStorage.getItem('vm-theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  applyI18n();
  bindEvents();
  updateToolbar();
  $('#batchFormat').onchange();
  initEngine();
})();
