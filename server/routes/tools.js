const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');

// POST /api/tools/process-certs - Ejecutar script para procesar certificaciones
router.post('/process-certs', toolController.processCertifications);

module.exports = router;
