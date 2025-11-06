@echo off
echo Iniciando el servidor de desarrollo...

:: Iniciar el servidor de Node.js en una nueva ventana
start "Servidor Node.js" cmd /k "npm run dev"
echo Esperando a que el servidor se inicie (unos segundos)...
timeout /t 5 /nobreak > NUL

:: Abrir el navegador en la página de admin
start "Panel de Administracion" "http://localhost:3000/admin"

echo Servidor iniciado y navegador abierto.
pause
