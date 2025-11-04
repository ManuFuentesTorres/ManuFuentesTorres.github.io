const express = require('express');
const router = express.Router();
const { readData, writeData, uuidv4 } = require('../controllers/dataController');

const EXPERIENCE_FILE = 'experience.json';

// GET /api/experience - Listar experiencia
router.get('/', async (req, res, next) => {
  try {
    const { experience } = await readData(EXPERIENCE_FILE);
    res.status(200).json({ data: experience, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// POST /api/experience - Crear entrada
router.post('/', async (req, res, next) => {
  try {
    const { experience } = await readData(EXPERIENCE_FILE);
    const newExperience = { id: uuidv4(), ...req.body };
    experience.push(newExperience);
    await writeData(EXPERIENCE_FILE, { experience });
    res.status(201).json({ message: 'Experiencia creada', data: newExperience, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// PUT /api/experience/:id - Actualizar
router.put('/:id', async (req, res, next) => {
  try {
    const { experience } = await readData(EXPERIENCE_FILE);
    const expIndex = experience.findIndex(e => e.id === req.params.id);
    if (expIndex === -1) return res.status(404).json({ error: 'Experiencia no encontrada' });

    const updatedExperience = { ...experience[expIndex], ...req.body };
    experience[expIndex] = updatedExperience;
    await writeData(EXPERIENCE_FILE, { experience });
    res.status(200).json({ message: 'Experiencia actualizada', data: updatedExperience, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/experience/:id - Eliminar
router.delete('/:id', async (req, res, next) => {
  try {
    let { experience } = await readData(EXPERIENCE_FILE);
    const initialLength = experience.length;
    experience = experience.filter(e => e.id !== req.params.id);

    if (experience.length === initialLength) {
      return res.status(404).json({ error: 'Experiencia no encontrada' });
    }

    await writeData(EXPERIENCE_FILE, { experience });
    res.status(200).json({ message: 'Experiencia eliminada', timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
