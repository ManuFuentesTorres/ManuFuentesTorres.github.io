const express = require('express');
const router = express.Router();
const { readData, writeData, uuidv4 } = require('../controllers/dataController');

const PROJECTS_FILE = 'projects.json';

// GET /api/projects - Listar proyectos
router.get('/', async (req, res, next) => {
  try {
    const { projects } = await readData(PROJECTS_FILE);
    res.status(200).json({ data: projects, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects - Crear proyecto
router.post('/', async (req, res, next) => {
  try {
    const { projects } = await readData(PROJECTS_FILE);
    const newProject = { id: uuidv4(), ...req.body };
    projects.push(newProject);
    await writeData(PROJECTS_FILE, { projects });
    res.status(201).json({ message: 'Proyecto creado', data: newProject, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id - Actualizar proyecto
router.put('/:id', async (req, res, next) => {
  try {
    const { projects } = await readData(PROJECTS_FILE);
    const projectIndex = projects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) return res.status(404).json({ error: 'Proyecto no encontrado' });

    const updatedProject = { ...projects[projectIndex], ...req.body };
    projects[projectIndex] = updatedProject;
    await writeData(PROJECTS_FILE, { projects });
    res.status(200).json({ message: 'Proyecto actualizado', data: updatedProject, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id - Eliminar proyecto
router.delete('/:id', async (req, res, next) => {
  try {
    let { projects } = await readData(PROJECTS_FILE);
    const initialLength = projects.length;
    projects = projects.filter(p => p.id !== req.params.id);

    if (projects.length === initialLength) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    await writeData(PROJECTS_FILE, { projects });
    res.status(200).json({ message: 'Proyecto eliminado', timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
