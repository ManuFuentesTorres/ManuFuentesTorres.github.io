const express = require('express');
const router = express.Router();
const { readData, writeData, uuidv4 } = require('../controllers/dataController');

const CERTIFICATIONS_FILE = 'certifications.json';

// GET /api/certifications - Listar certificaciones
router.get('/', async (req, res, next) => {
  try {
    const { certifications } = await readData(CERTIFICATIONS_FILE);
    res.status(200).json({ data: certifications, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// POST /api/certifications - Crear certificación
router.post('/', async (req, res, next) => {
  try {
    const { certifications } = await readData(CERTIFICATIONS_FILE);
    const newCertification = { id: uuidv4(), ...req.body };
    certifications.push(newCertification);
    await writeData(CERTIFICATIONS_FILE, { certifications });
    res.status(201).json({ message: 'Certificación creada', data: newCertification, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// PUT /api/certifications/:id - Actualizar
router.put('/:id', async (req, res, next) => {
  try {
    const { certifications } = await readData(CERTIFICATIONS_FILE);
    const certIndex = certifications.findIndex(c => c.id === req.params.id);
    if (certIndex === -1) return res.status(404).json({ error: 'Certificación no encontrada' });

    const updatedCert = { ...certifications[certIndex], ...req.body };
    certifications[certIndex] = updatedCert;
    await writeData(CERTIFICATIONS_FILE, { certifications });
    res.status(200).json({ message: 'Certificación actualizada', data: updatedCert, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/certifications/:id - Eliminar
router.delete('/:id', async (req, res, next) => {
  try {
    let { certifications } = await readData(CERTIFICATIONS_FILE);
    const initialLength = certifications.length;
    certifications = certifications.filter(c => c.id !== req.params.id);

    if (certifications.length === initialLength) {
      return res.status(404).json({ error: 'Certificación no encontrada' });
    }

    await writeData(CERTIFICATIONS_FILE, { certifications });
    res.status(200).json({ message: 'Certificación eliminada', timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
