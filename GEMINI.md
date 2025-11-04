# Instrucciones para Gemini CLI

Este documento proporciona prompts y guías para interactuar con este proyecto usando Gemini CLI.

## Tareas Comunes

### Iniciar el entorno de desarrollo

**Prompt:**
```
npm run dev
```

### Generar el sitio estático

**Prompt:**
```
npm run build
```

### Añadir un nuevo proyecto

**Prompt:**
"Añade un nuevo proyecto a `data/projects.json`. El título es 'Nuevo Proyecto de Prueba', la descripción es 'Esta es una descripción de prueba', y las tecnologías son ['Node.js', 'EJS']."

### Actualizar el perfil

**Prompt:**
"Actualiza mi biografía en `data/portfolio.json` para que diga: 'Esta es mi nueva biografía actualizada.'"

## Troubleshooting

*   **Error de `npm install`:** Asegúrate de que Node.js y npm están instalados y en el PATH. Si hay problemas de permisos, prueba a ejecutar el terminal como administrador.
*   **Error de `npm run build`:** Verifica que todos los archivos JSON en la carpeta `data/` tienen un formato correcto. Un JSON mal formado puede romper el proceso de build.
*   **El panel de admin no carga:** Revisa la consola del navegador en busca de errores de JavaScript. Asegúrate de que el servidor (`npm run dev`) se está ejecutando.
