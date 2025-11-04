# Portafolio de Manuel Fuentes Torres

Este es el repositorio del sitio web personal y portafolio de Manuel Fuentes Torres. El sitio está construido como una aplicación Node.js que genera un sitio estático y proporciona un panel de administración para gestionar el contenido.

## Stack Tecnológico

*   **Frontend (Público):** HTML, CSS, JavaScript (generado estáticamente)
*   **Frontend (Admin):** HTML, CSS, JavaScript (vanilla)
*   **Backend:** Node.js, Express.js
*   **Templating:** EJS (Embedded JavaScript)
*   **Base de Datos:** Archivos JSON locales
*   **Despliegue:** GitHub Pages
*   **CI/CD:** GitHub Actions

## Estructura de Carpetas

```
ManuelFuentes.github.io/
├── public/         (Sitio estático generado)
├── admin/          (Panel de administración)
├── data/           (Base de datos JSON)
├── server/         (Backend con Express)
├── scripts/        (Scripts de build, etc.)
├── templates/      (Plantillas EJS)
├── .github/        (Workflows de CI/CD)
└── ...             (Archivos de configuración)
```

## Instalación y Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/ManuelFuentes/ManuelFuentes.github.io.git
    cd ManuelFuentes.github.io
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Copia `.env.example` a `.env` y rellena las variables.
    ```bash
    cp .env.example .env
    ```
    Necesitarás establecer al menos `ADMIN_PASSWORD`.

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    El servidor se iniciará en `http://localhost:3000`.
    El panel de administración estará disponible en `http://localhost:3000/admin`.

5.  **Generar el sitio estático:**
    Para generar los archivos HTML en la carpeta `public/`, ejecuta:
    ```bash
    npm run build
    ```

## Despliegue

El despliegue se realiza automáticamente a GitHub Pages cada vez que se hace un `push` a la rama `main`. El workflow se encuentra en `.github/workflows/build-deploy.yml`.
