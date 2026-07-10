/*
 * gs-worker.js — Web Worker que ejecuta Ghostscript (WASM) para renderizar y
 * convertir archivos EPS / PS / AI / PDF sin bloquear la interfaz.
 *
 * Protocolo de mensajes (main -> worker):
 *   { id, type: 'init',    gsJsUrl, gsWasmUrl }
 *   { id, type: 'render',  bytes, name, dpi, alpha }
 *   { id, type: 'convert', bytes, name, format, dpi, quality, alpha }
 * Respuestas (worker -> main):
 *   { id, ok: true,  pages: [ArrayBuffer], mime, ext, log, elapsedMs, engine }
 *   { id, ok: false, error, log }
 */

'use strict';

let gsFactory = null;   // fábrica del módulo Emscripten
let gsModule = null;    // instancia reutilizable
let gsWasmUrl = null;
let engineVersion = '';
let logBuffer = [];
let jobCounter = 0;

function log(line) { logBuffer.push(line); }

async function ensureModule() {
  if (gsModule) return gsModule;
  const cfg = {
    noInitialRun: true,
    locateFile: () => gsWasmUrl,
    print: (s) => log(s),
    printErr: (s) => log(s),
  };
  gsModule = await gsFactory(cfg);
  return gsModule;
}

function destroyModule() { gsModule = null; }

// Los EPS con encabezado binario DOS (vista previa TIFF/WMF incrustada)
// comienzan con C5 D0 D3 C6; el bloque PostScript real se ubica con los
// offsets little-endian de los bytes 4-7 (inicio) y 8-11 (longitud).
function stripDosEpsHeader(bytes) {
  if (bytes.length > 30 && bytes[0] === 0xC5 && bytes[1] === 0xD0 && bytes[2] === 0xD3 && bytes[3] === 0xC6) {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const start = dv.getUint32(4, true);
    const len = dv.getUint32(8, true);
    if (start + len <= bytes.length && len > 0) {
      return bytes.subarray(start, start + len);
    }
  }
  return bytes;
}

function looksLikeEps(bytes, name) {
  if (/\.(eps|epsf|epi)$/i.test(name)) return true;
  const head = new TextDecoder('latin1').decode(bytes.subarray(0, 100));
  return /%!PS-Adobe-[\d.]+\s+EPSF/i.test(head);
}

function looksLikePdf(bytes) {
  const head = new TextDecoder('latin1').decode(bytes.subarray(0, 8));
  return head.startsWith('%PDF-');
}

const DEVICES = {
  png:  { device: 'png16m',   ext: 'png',  mime: 'image/png' },
  pnga: { device: 'pngalpha', ext: 'png',  mime: 'image/png' },
  jpeg: { device: 'jpeg',     ext: 'jpg',  mime: 'image/jpeg' },
  tiff: { device: 'tiff24nc', ext: 'tiff', mime: 'image/tiff' },
  bmp:  { device: 'bmp16m',   ext: 'bmp',  mime: 'image/bmp' },
  pdf:  { device: 'pdfwrite', ext: 'pdf',  mime: 'application/pdf' },
  ps:   { device: 'ps2write', ext: 'ps',   mime: 'application/postscript' },
};

// Ejecuta gs una vez sobre una instancia fresca del FS y devuelve los archivos
// de salida ordenados por número de página.
async function runGs(inputBytes, inputName, gsArgs, outPattern) {
  const mod = await ensureModule();
  const jobDir = '/job' + (++jobCounter);
  const FS = mod.FS;
  FS.mkdir(jobDir);
  const inPath = jobDir + '/' + inputName;
  FS.writeFile(inPath, inputBytes);

  const outPath = jobDir + '/' + outPattern;
  const args = gsArgs.concat(['-o', outPath, inPath]);
  let exitCode = -1;
  let threw = null;
  try {
    exitCode = mod.callMain(args);
  } catch (e) {
    threw = e;
  }

  const outputs = [];
  try {
    const entries = FS.readdir(jobDir).filter((f) => f !== '.' && f !== '..' && f !== inputName);
    entries.sort((a, b) => {
      const na = parseInt((a.match(/(\d+)\./) || [])[1] || '0', 10);
      const nb = parseInt((b.match(/(\d+)\./) || [])[1] || '0', 10);
      return na - nb;
    });
    for (const f of entries) {
      const data = FS.readFile(jobDir + '/' + f);
      outputs.push(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
      FS.unlink(jobDir + '/' + f);
    }
    FS.unlink(inPath);
    FS.rmdir(jobDir);
  } catch (e) {
    log('FS cleanup: ' + e.message);
  }

  if (threw && outputs.length === 0) {
    // La instancia pudo quedar en mal estado: se recrea en el siguiente uso.
    destroyModule();
    throw new Error('Ghostscript abortó: ' + (threw.message || String(threw)));
  }
  return { outputs, exitCode };
}

function baseArgs(dpi, vector) {
  const args = ['-dSAFER', '-dBATCH', '-dNOPAUSE', '-dQUIET', '-r' + dpi];
  // Los dispositivos vectoriales (pdfwrite/ps2write) no admiten AlphaBits.
  if (!vector) args.push('-dTextAlphaBits=4', '-dGraphicsAlphaBits=4');
  return args;
}

// Cadena de degradación inteligente: EPSCrop -> sin recorte -> EPSFitPage.
function argAttempts(bytes, name, dpi, extraDeviceArgs, vector) {
  const attempts = [];
  const isEps = looksLikeEps(bytes, name);
  const isPdf = looksLikePdf(bytes);
  if (isEps && !isPdf) {
    attempts.push(baseArgs(dpi, vector).concat(['-dEPSCrop'], extraDeviceArgs));
  }
  attempts.push(baseArgs(dpi, vector).concat(extraDeviceArgs));
  if (isEps && !isPdf) {
    attempts.push(baseArgs(dpi, vector).concat(['-dEPSFitPage'], extraDeviceArgs));
  }
  return attempts;
}

async function handleRender(msg) {
  const bytes = stripDosEpsHeader(new Uint8Array(msg.bytes));
  const dev = msg.alpha ? DEVICES.pnga : DEVICES.png;
  const deviceArgs = ['-sDEVICE=' + dev.device];
  const attempts = argAttempts(bytes, msg.name, msg.dpi, deviceArgs, false);
  const safeName = 'input' + (looksLikePdf(bytes) ? '.pdf' : '.ps');

  let lastErr = 'sin salida';
  for (const args of attempts) {
    logBuffer = [];
    try {
      const { outputs, exitCode } = await runGs(bytes, safeName, args, 'page-%d.png');
      if (outputs.length > 0) {
        return { pages: outputs, mime: dev.mime, ext: dev.ext, exitCode };
      }
      lastErr = 'Ghostscript terminó con código ' + exitCode;
    } catch (e) {
      lastErr = e.message;
    }
  }
  throw new Error(lastErr);
}

async function handleConvert(msg) {
  const bytes = stripDosEpsHeader(new Uint8Array(msg.bytes));
  let devKey = msg.format;
  if (msg.format === 'png' && msg.alpha) devKey = 'pnga';
  const dev = DEVICES[devKey];
  if (!dev) throw new Error('Formato no soportado: ' + msg.format);

  const vector = dev.device === 'pdfwrite' || dev.device === 'ps2write';
  const deviceArgs = ['-sDEVICE=' + dev.device];
  if (dev.device === 'jpeg') deviceArgs.push('-dJPEGQ=' + (msg.quality || 90));
  if (dev.device === 'pdfwrite') deviceArgs.push('-dCompatibilityLevel=1.7');

  const attempts = argAttempts(bytes, msg.name, msg.dpi, deviceArgs, vector);
  const safeName = 'input' + (looksLikePdf(bytes) ? '.pdf' : '.ps');
  const multiPage = !(dev.device === 'pdfwrite' || dev.device === 'ps2write');
  const pattern = multiPage ? 'out-%d.' + dev.ext : 'out.' + dev.ext;

  let lastErr = 'sin salida';
  for (const args of attempts) {
    logBuffer = [];
    try {
      const { outputs, exitCode } = await runGs(bytes, safeName, args, pattern);
      if (outputs.length > 0) {
        return { pages: outputs, mime: dev.mime, ext: dev.ext, exitCode };
      }
      lastErr = 'Ghostscript terminó con código ' + exitCode;
    } catch (e) {
      lastErr = e.message;
    }
  }
  throw new Error(lastErr);
}

async function detectVersion() {
  logBuffer = [];
  try {
    const mod = await ensureModule();
    try { mod.callMain(['-v']); } catch (e) { /* -v sale con código != 0 */ }
    const joined = logBuffer.join('\n');
    const m = joined.match(/Ghostscript\s+([\d.]+)/i);
    engineVersion = m ? 'Ghostscript ' + m[1] : 'Ghostscript (WASM)';
  } catch (e) {
    engineVersion = 'Ghostscript (WASM)';
  }
}

self.onmessage = async (ev) => {
  const msg = ev.data;
  const started = Date.now();
  try {
    if (msg.type === 'init') {
      gsWasmUrl = msg.gsWasmUrl;
      importScripts(msg.gsJsUrl);
      // gs.js (build MODULARIZE) expone la fábrica en globalThis.exports.Module
      gsFactory = (self.exports && self.exports.Module) || self.Module;
      if (typeof gsFactory !== 'function') throw new Error('No se pudo cargar gs.js');
      await detectVersion();
      self.postMessage({ id: msg.id, ok: true, engine: engineVersion, elapsedMs: Date.now() - started });
      return;
    }
    if (msg.type === 'render') {
      const res = await handleRender(msg);
      self.postMessage(
        { id: msg.id, ok: true, pages: res.pages, mime: res.mime, ext: res.ext, log: logBuffer.join('\n'), elapsedMs: Date.now() - started },
        res.pages
      );
      return;
    }
    if (msg.type === 'convert') {
      const res = await handleConvert(msg);
      self.postMessage(
        { id: msg.id, ok: true, pages: res.pages, mime: res.mime, ext: res.ext, log: logBuffer.join('\n'), elapsedMs: Date.now() - started },
        res.pages
      );
      return;
    }
    throw new Error('Mensaje desconocido: ' + msg.type);
  } catch (e) {
    self.postMessage({ id: msg.id, ok: false, error: e.message || String(e), log: logBuffer.join('\n') });
  }
};
