@echo off
echo Sincronizando cambios con GitHub... (Modo Depuracion)
echo.

echo --- PASO 1: Build ---
echo Ejecutando 'npm run build'. Si hay un error, se mostrara a continuacion.
npm run build
echo.
echo 'npm run build' ha terminado.
pause
echo.

echo --- PASO 2: Git Add ---
echo Ejecutando 'git add .'.
git add .
echo 'git add .' ha terminado.
pause
echo.

echo --- PASO 3: Commit ---
set /p commitMessage="Escribe un resumen de los cambios y pulsa Enter: "
git commit -m "%commitMessage%"
echo Commit creado.
pause
echo.

echo --- PASO 4: Push ---
echo Ejecutando 'git push'.
git push
echo 'git push' ha terminado.
pause
