@echo off
echo Sincronizando cambios con GitHub...

:: 1. Re-generar el sitio estatico por si hay cambios en los datos
echo Ejecutando el build para asegurar que todo este actualizado...
npm run build
echo.

:: 2. Anadir todos los cambios al staging area
git add .
echo Archivos anadidos al staging area.
echo.

:: 3. Pedir mensaje de commit
set /p commitMessage="Escribe un resumen de los cambios y pulsa Enter: "
echo.

:: 4. Hacer commit
git commit -m "%commitMessage%"
echo Commit creado con el mensaje: "%commitMessage%"
echo.

:: 5. Subir los cambios
git push
echo Cambios subidos a GitHub.
echo.

echo --- Proceso completado ---
pause
