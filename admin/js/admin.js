document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const logoutBtn = document.getElementById('logout-btn');

    const ADMIN_PASSWORD_KEY = 'admin_password';

    // --- Autenticación --- //
    function checkAuth() {
        const savedPassword = sessionStorage.getItem(ADMIN_PASSWORD_KEY);
        if (!savedPassword) {
            const password = prompt('Por favor, introduce la contraseña de administrador:');
            if (password) { // Simplificado, la validación real se hará contra el backend
                sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
            } else {
                document.body.innerHTML = '<h1>Acceso denegado</h1>';
                return false;
            }
        }
        return true;
    }

    // --- Navegación --- //
    function showSection(id) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(id).classList.add('active');

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
        
        // Cargar datos para la sección activa
        loadSectionData(id);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // --- Carga de Datos (Placeholder) --- //
    function loadSectionData(sectionId) {
        console.log(`Cargando datos para: ${sectionId}`);
        // Aquí se llamará a las funciones de api-handler.js para obtener y renderizar los datos
        switch (sectionId) {
            case 'perfil':
                loadProfileData();
                break;
            case 'proyectos':
                // loadProjectsData();
                break;
            // etc.
        }
    }

    // --- Logout --- //
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
        window.location.reload();
    });

    // --- Inicialización --- //
    if (checkAuth()) {
        showSection('perfil'); // Mostrar la sección de perfil por defecto
    }
});
