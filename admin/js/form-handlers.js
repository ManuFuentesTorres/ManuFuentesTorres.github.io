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

    // --- Lógica para el formulario de Proyectos ---
    const projectsList = document.getElementById('projects-list');
    const newProjectBtn = document.getElementById('new-project-btn');
    const projectForm = document.getElementById('project-form');
    const cancelProjectBtn = document.getElementById('cancel-project-btn');
    const projectFormTitle = document.getElementById('project-form-title');

    async function loadProjectsData() {
        try {
            const { data: projects } = await apiCall('GET', '/projects');
            projectsList.innerHTML = ''; // Limpiar lista
            if (projects && projects.length > 0) {
                projects.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'data-card';
                    projectCard.innerHTML = `
                        <h4>${project.title}</h4>
                        <p>${project.description.substring(0, 100)}...</p>
                        <div class="data-card-actions">
                            <button class="btn btn-primary btn-sm edit-project-btn" data-id="${project.id}">Editar</button>
                            <button class="btn btn-danger btn-sm delete-project-btn" data-id="${project.id}">Eliminar</button>
                        </div>
                    `;
                    projectsList.appendChild(projectCard);
                });
            } else {
                projectsList.innerHTML = '<p>No hay proyectos aún. ¡Añade uno!</p>';
            }
        } catch (error) {
            console.error('Error al cargar proyectos:', error);
            alert('No se pudieron cargar los proyectos.');
        }
    }

    function showProjectForm(project = null) {
        projectForm.style.display = 'block';
        projectsList.style.display = 'none';
        newProjectBtn.style.display = 'none';

        if (project) {
            projectFormTitle.textContent = 'Editar Proyecto';
            document.getElementById('project-id').value = project.id;
            document.getElementById('project-title').value = project.title || '';
            document.getElementById('project-description').value = project.description || '';
            document.getElementById('project-technologies').value = project.technologies ? project.technologies.join(', ') : '';
            document.getElementById('project-role').value = project.role || '';
            document.getElementById('project-context').value = project.context || '';
            document.getElementById('project-process').value = project.process || '';
            document.getElementById('project-results').value = project.results || '';
            document.getElementById('project-learnings').value = project.learnings || '';
            document.getElementById('project-date').value = project.date || '';
            
            const imgPreview = document.getElementById('project-image-preview');
            if (project.image) {
                imgPreview.src = `../api/public${project.image}`;
                imgPreview.style.display = 'block';
            } else {
                imgPreview.style.display = 'none';
            }
        } else {
            projectFormTitle.textContent = 'Añadir Nuevo Proyecto';
            projectForm.reset();
            document.getElementById('project-id').value = '';
            document.getElementById('project-image-preview').style.display = 'none';
        }
    }

    function hideProjectForm() {
        projectForm.style.display = 'none';
        projectsList.style.display = 'block';
        newProjectBtn.style.display = 'block';
        projectForm.reset();
        document.getElementById('project-id').value = '';
        document.getElementById('project-image-preview').style.display = 'none';
    }

    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', () => showProjectForm());
    }

    if (cancelProjectBtn) {
        cancelProjectBtn.addEventListener('click', hideProjectForm);
    }

    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(projectForm);
            const projectId = formData.get('id');
            const projectData = {
                title: formData.get('title'),
                description: formData.get('description'),
                technologies: formData.get('technologies').split(',').map(tech => tech.trim()).filter(tech => tech !== ''),
                role: formData.get('role'),
                context: formData.get('context'),
                process: formData.get('process'),
                results: formData.get('results'),
                learnings: formData.get('learnings'),
                date: formData.get('date'),
            };

            try {
                const imageFile = formData.get('image');
                let imagePath = projectId ? (await apiCall('GET', `/projects/${projectId}`)).data.image : '';

                if (imageFile && imageFile.size > 0) {
                    imagePath = await window.uploadFile(imageFile);
                }
                projectData.image = imagePath;

                if (projectId) {
                    await apiCall('PUT', `/projects/${projectId}`, projectData);
                    alert('Proyecto actualizado con éxito');
                } else {
                    await apiCall('POST', '/projects', projectData);
                    alert('Proyecto añadido con éxito');
                }
                hideProjectForm();
                loadProjectsData();
            } catch (error) {
                console.error('Error al guardar proyecto:', error);
                alert('Error al guardar el proyecto.');
            }
        });
    }

    if (projectsList) {
        projectsList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('edit-project-btn')) {
                const projectId = e.target.dataset.id;
                try {
                    const { data: project } = await apiCall('GET', `/projects/${projectId}`);
                    showProjectForm(project);
                } catch (error) {
                    console.error('Error al cargar proyecto para edición:', error);
                    alert('No se pudo cargar el proyecto para edición.');
                }
            } else if (e.target.classList.contains('delete-project-btn')) {
                const projectId = e.target.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
                    try {
                        await apiCall('DELETE', `/projects/${projectId}`);
                        alert('Proyecto eliminado con éxito');
                        loadProjectsData();
                    } catch (error) {
                        console.error('Error al eliminar proyecto:', error);
                        alert('Error al eliminar el proyecto.');
                    }
                }
            }
        });
    }

    // Exponer la función para que admin.js pueda llamarla
    window.loadProjectsData = loadProjectsData;

    // Aquí se añadirán los manejadores para otros formularios (certificaciones, etc.)
});
