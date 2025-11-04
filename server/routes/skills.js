const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../controllers/dataController');

const SKILLS_FILE = 'skills.json';

// GET /api/skills - Listar habilidades
router.get('/', async (req, res, next) => {
  try {
    const skillsData = await readData(SKILLS_FILE);
    res.status(200).json({ data: skillsData, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// POST /api/skills - Crear o actualizar habilidad (ejemplo simple, puede requerir lógica más compleja)
router.post('/', async (req, res, next) => {
    try {
        const { category, skill } = req.body; // Espera { category: 'technical', skill: { name: 'Python', level: 4 } }
        const skillsData = await readData(SKILLS_FILE);

        if (!skillsData.skills[category]) {
            return res.status(400).json({ error: 'Categoría no válida' });
        }

        // Evitar duplicados
        const skillIndex = skillsData.skills[category].findIndex(s => s.name.toLowerCase() === skill.name.toLowerCase());

        if (skillIndex > -1) {
            // Actualizar si ya existe
            skillsData.skills[category][skillIndex] = { ...skillsData.skills[category][skillIndex], ...skill };
        } else {
            // Añadir si es nueva
            skillsData.skills[category].push(skill);
        }

        await writeData(SKILLS_FILE, skillsData);
        res.status(201).json({ message: 'Habilidad añadida/actualizada', data: skillsData, timestamp: new Date().toISOString() });
    } catch (error) {
        next(error);
    }
});

// PUT /api/skills - Actualizar una habilidad específica (alternativa a POST)
router.put('/', async (req, res, next) => {
    try {
        const { category, name, updates } = req.body; // Espera { category: 'technical', name: 'Python', updates: { level: 5 } }
        const skillsData = await readData(SKILLS_FILE);

        if (!skillsData.skills[category]) {
            return res.status(400).json({ error: 'Categoría no válida' });
        }

        const skillIndex = skillsData.skills[category].findIndex(s => s.name.toLowerCase() === name.toLowerCase());

        if (skillIndex === -1) {
            return res.status(404).json({ error: 'Habilidad no encontrada' });
        }

        skillsData.skills[category][skillIndex] = { ...skillsData.skills[category][skillIndex], ...updates };

        await writeData(SKILLS_FILE, skillsData);
        res.status(200).json({ message: 'Habilidad actualizada', data: skillsData.skills[category][skillIndex], timestamp: new Date().toISOString() });
    } catch (error) {
        next(error);
    }
});


// DELETE /api/skills - Eliminar habilidad
router.delete('/', async (req, res, next) => {
    try {
        const { category, name } = req.body; // Espera { category: 'technical', name: 'Python' }
        const skillsData = await readData(SKILLS_FILE);

        if (!skillsData.skills[category]) {
            return res.status(400).json({ error: 'Categoría no válida' });
        }

        const initialLength = skillsData.skills[category].length;
        skillsData.skills[category] = skillsData.skills[category].filter(s => s.name.toLowerCase() !== name.toLowerCase());

        if (skillsData.skills[category].length === initialLength) {
            return res.status(404).json({ error: 'Habilidad no encontrada' });
        }

        await writeData(SKILLS_FILE, skillsData);
        res.status(200).json({ message: 'Habilidad eliminada', timestamp: new Date().toISOString() });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
