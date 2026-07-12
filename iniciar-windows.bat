@echo off
rem Inicia VisorMaestro EPS. No requiere instalar nada:
rem si hay Python lo usa; si no, usa el PowerShell incluido en Windows.
cd /d "%~dp0"
echo Iniciando VisorMaestro EPS en http://localhost:8765 ...

where py >nul 2>nul && (
  start "" http://localhost:8765
  py -m http.server 8765
  goto :eof
)
where python >nul 2>nul && (
  start "" http://localhost:8765
  python -m http.server 8765
  goto :eof
)

echo (Python no encontrado: usando el servidor PowerShell integrado de Windows)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor.ps1"
pause
