document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para el formulario de Perfil ---
    const profileForm = document.getElementById('profile-form');

    async function loadProfileData() {
        try {
            const { data } = await apiCall('GET', '/portfolio');
            if (data) {
                document.getElementById('name').value = data.name || '';
                document.getElementById('title').value = data.title || '';
                document.getElementById('bio').value = data.bio || '';
                document.getElementById('email').value = data.email || '';
                document.getElementById('phone').value = data.phone || '';
                document.getElementById('location').value = data.location || '';
                document.getElementById('linkedin').value = data.links?.linkedin || '';
                document.getElementById('github').value = data.links?.github || '';
                
                const preview = document.getElementById('profile-preview');
                if (data.photo) {
                    preview.src = `../api/public${data.photo}`;
                } else {
                    preview.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error al cargar el perfil:', error);
            alert('No se pudo cargar la información del perfil.');
        }
    }

    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(profileForm);
            const data = {
                name: formData.get('name'),
                title: formData.get('title'),
                bio: formData.get('bio'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                location: formData.get('location'),
                links: {
                    linkedin: formData.get('linkedin'),
                    github: formData.get('github'),
                }
            };

            try {
                const photoFile = formData.get('photo');
                let photoPath = (await apiCall('GET', '/portfolio')).data.photo;

                if (photoFile && photoFile.size > 0) {
                    photoPath = await window.uploadFile(photoFile);
                }

                data.photo = photoPath;

                await apiCall('PUT', '/portfolio', data);
                alert('Perfil actualizado con éxito');
                loadProfileData(); // Recargar datos
            } catch (error) {
                console.error('Error al actualizar el perfil:', error);
                alert('Error al guardar los cambios.');
            }
        });
    }

    // Exponer la función para que admin.js pueda llamarla
    window.loadProfileData = loadProfileData;

    // Aquí se añadirán los manejadores para otros formularios (proyectos, etc.)
});
