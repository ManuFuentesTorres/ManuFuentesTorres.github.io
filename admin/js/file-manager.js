document.addEventListener('DOMContentLoaded', () => {

    /**
     * Sube un archivo al servidor y devuelve la ruta del archivo.
     * @param {File} file - El archivo a subir.
     * @returns {Promise<string>} - La ruta relativa del archivo en el servidor.
     */
    async function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('admin_password')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al subir el archivo.');
            }

            const result = await response.json();
            return result.filePath; // Devuelve la ruta relativa del archivo

        } catch (error) {
            console.error('Error en la subida de archivo:', error);
            alert(`Error al subir: ${error.message}`);
            throw error;
        }
    }

    // Exponer la función para que otros scripts la puedan usar
    window.uploadFile = uploadFile;

    // Ejemplo de cómo se podría usar en un formulario (ej. en form-handlers.js)
    /*
    const photoInput = document.getElementById('photo');
    const profilePreview = document.getElementById('profile-preview');

    photoInput.addEventListener('change', () => {
        const file = photoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePreview.src = e.target.result;
                profilePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    */

});
