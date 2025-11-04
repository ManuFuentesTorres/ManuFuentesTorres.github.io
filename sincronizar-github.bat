@echo off
echo Sincronizando cambios con GitHub...

:: 1. Re-generar el sitio estatico por si hay cambios en los datos
echo Ejecutando el build para asegurar que todo este actualizado...
npm run build

:: 2. Anadir todos los cambios al staging area
git add .

:: 3. Pedir al usuario un mensaje para el commit
echo.
set /p commitMessage="Escribe un resumen de los cambios y pulsa Enter: "

:: 4. Hacer el commit
echo.
echo Creando commit...
git commit -m "%commitMessage%"

:: 5. Subir los cambios a GitHub
echo.
echo Subiendo cambios a GitHub...
git push

echo.
echo --- Proceso completado --- 
pause
