
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Importar controladores y rutas
const portfolioRoutes = require('./routes/portfolio');
const projectsRoutes = require('./routes/projects');
const certificationsRoutes = require('./routes/certifications');
const experienceRoutes = require('./routes/experience');
const skillsRoutes = require('./routes/skills');
const uploadRoute = require('./routes/upload');
const authMiddleware = require('./middleware/auth');

const app = express();

// --- Configuración de Middleware ---

// CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'https://manuelfuentes.github.io'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos del panel de administración
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// Servir archivos públicos generados (API)
app.use('/api/public', express.static(path.join(__dirname, '..', 'public')));


// --- Rutas de la API ---

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', authMiddleware);

// Rutas de la API
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/upload', uploadRoute);


// --- Middleware de Manejo de Errores ---
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// --- Iniciar Servidor ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Panel de administración disponible en http://localhost:${PORT}/admin');
});

module.exports = app;
