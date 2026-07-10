#!/bin/sh
# Inicia VisorMaestro EPS en un servidor local y abre el navegador.
cd "$(dirname "$0")"
URL="http://localhost:8765"
echo "Iniciando VisorMaestro EPS en $URL ..."
( sleep 1; open "$URL" 2>/dev/null || xdg-open "$URL" 2>/dev/null ) &
exec python3 -m http.server 8765
