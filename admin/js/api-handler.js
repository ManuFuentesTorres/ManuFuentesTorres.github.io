let API_BASE_URL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Entorno de desarrollo local
  API_BASE_URL = '/api';
} else {
  // Entorno de producción: ¡IMPORTANTE! Reemplaza esta URL con la de tu backend desplegado.
  API_BASE_URL = 'https://manufuentestorres-github-io.onrender.com/api';
}
const ADMIN_PASSWORD_KEY = 'admin_password';

/**
 * Realiza una llamada a la API del backend.
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE).
 * @param {string} endpoint - El endpoint de la API (e.g., '/portfolio').
 * @param {object} [data=null] - El cuerpo de la petición para POST o PUT.
 * @returns {Promise<object>} - La respuesta JSON del servidor.
 * @throws {Error} - Si la respuesta de la red no es ok.
 */
async function apiCall(method, endpoint, data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const password = sessionStorage.getItem(ADMIN_PASSWORD_KEY);

    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if (password) {
        headers.append('Authorization', `Bearer ${password}`);
    }

    const config = {
        method: method.toUpperCase(),
        headers: headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
            throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
        }

        // Si la respuesta no tiene contenido (ej. DELETE exitoso)
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return { success: true, message: 'Operación exitosa sin contenido de respuesta.' };
        }

        return await response.json();

    } catch (error) {
        console.error('Error en la llamada a la API:', error);
        // Aquí se podría mostrar una notificación al usuario
        throw error;
    }
}
