@echo off
rem Inicia VisorMaestro EPS en un servidor local y abre el navegador.
cd /d "%~dp0"
echo Iniciando VisorMaestro EPS en http://localhost:8765 ...
start "" http://localhost:8765
where py >nul 2>nul && (py -m http.server 8765 & goto :eof)
where python >nul 2>nul && (python -m http.server 8765 & goto :eof)
echo.
echo No se encontro Python. Instalalo desde https://www.python.org/downloads/
echo o sirve esta carpeta con cualquier servidor web estatico.
pause
