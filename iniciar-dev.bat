@echo off
echo Iniciando el servidor de desarrollo...

:: Abrir el navegador en la página de admin
start "Panel de Administracion" "http://localhost:3000/admin"

:: Iniciar el servidor de Node.js
echo Para detener el servidor, cierra esta ventana o pulsa CTRL+C.
npm run dev
