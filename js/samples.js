/* Ejemplos incrustados para VisorMaestro EPS (PostScript en texto plano). */
window.VM_SAMPLES = [
  {
    name: 'logotipo.eps',
    data: `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 360 240
%%Title: Logotipo de ejemplo
%%Creator: VisorMaestro EPS
%%CreationDate: 2026
%%LanguageLevel: 2
%%Pages: 1
%%EndComments
% Fondo degradado simulado con bandas
/band { newpath 0 exch moveto 360 0 rlineto 0 12 rlineto -360 0 rlineto closepath fill } def
0 1 19 {
  /i exch def
  0.08 0.10 i 20 div 0.55 mul add 0.25 i 20 div 0.5 mul add setrgbcolor
  i 12 mul band
} for
% Circulos superpuestos translucidos (simulados)
0.98 0.55 0.15 setrgbcolor 120 130 62 0 360 arc fill
0.90 0.20 0.25 setrgbcolor 180 110 58 0 360 arc fill
0.20 0.65 0.90 setrgbcolor 236 138 66 0 360 arc fill
1 1 1 setrgbcolor 178 128 30 0 360 arc fill
1 1 1 setrgbcolor
/Helvetica-Bold findfont 30 scalefont setfont
64 36 moveto (VisorMaestro) show
/Helvetica findfont 14 scalefont setfont
120 16 moveto (EPS \\(muestra vectorial\\)) show
showpage
%%EOF
`,
  },
  {
    name: 'diagrama-tecnico.eps',
    data: `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 400 300
%%Title: Diagrama tecnico
%%Creator: VisorMaestro EPS
%%LanguageLevel: 2
%%Pages: 1
%%EndComments
1 1 1 setrgbcolor 0 0 400 300 rectfill
% Rejilla
0.85 0.88 0.92 setrgbcolor 0.6 setlinewidth
0 20 400 { /x exch def newpath x 0 moveto x 300 lineto stroke } for
0 20 300 { /y exch def newpath 0 y moveto 400 y lineto stroke } for
% Ejes
0.2 0.2 0.25 setrgbcolor 1.6 setlinewidth
newpath 40 40 moveto 40 270 lineto stroke
newpath 40 40 moveto 370 40 lineto stroke
% Curva de Bezier
0.90 0.25 0.20 setrgbcolor 2.4 setlinewidth
newpath 40 60 moveto 130 260 250 30 370 220 curveto stroke
% Curva secundaria punteada
0.15 0.45 0.85 setrgbcolor 1.8 setlinewidth [6 4] 0 setdash
newpath 40 100 moveto 150 90 260 220 370 130 curveto stroke
[] 0 setdash
% Puntos de control
0.15 0.45 0.85 setrgbcolor
40 100 4 0 360 arc fill 370 130 4 0 360 arc fill
0.90 0.25 0.20 setrgbcolor
40 60 4 0 360 arc fill 370 220 4 0 360 arc fill
% Etiquetas
0.1 0.1 0.15 setrgbcolor
/Helvetica-Bold findfont 16 scalefont setfont
48 278 moveto (Rendimiento vs. carga) show
/Helvetica findfont 11 scalefont setfont
310 46 moveto (carga \\(%\\)) show
/Helvetica findfont 11 scalefont setfont
gsave 30 200 translate 90 rotate 0 0 moveto (respuesta \\(ms\\)) show grestore
showpage
%%EOF
`,
  },
  {
    name: 'informe-3-paginas.ps',
    data: `%!PS-Adobe-3.0
%%Title: Informe multipagina
%%Creator: VisorMaestro EPS
%%Pages: 3
%%DocumentMedia: A5 420 595 0 () ()
%%EndComments
/pagina {
  /num exch def
  << /PageSize [420 595] >> setpagedevice
  % Cabecera
  0.18 0.32 0.65 setrgbcolor 0 545 420 50 rectfill
  1 1 1 setrgbcolor /Helvetica-Bold findfont 20 scalefont setfont
  24 562 moveto (Informe de ejemplo) show
  % Numero de pagina grande
  0.92 0.94 0.98 setrgbcolor 210 300 120 0 360 arc fill
  0.18 0.32 0.65 setrgbcolor
  /Helvetica-Bold findfont 130 scalefont setfont
  num 2 eq { 172 255 moveto } { 175 255 moveto } ifelse
  num 3 string cvs show
  % Pie
  0.4 0.4 0.45 setrgbcolor /Helvetica findfont 12 scalefont setfont
  24 24 moveto (Pagina ) show num 3 string cvs show ( de 3 - navegue con las flechas) show
  showpage
} def
%%Page: 1 1
1 pagina
%%Page: 2 2
2 pagina
%%Page: 3 3
3 pagina
%%EOF
`,
  },
];
