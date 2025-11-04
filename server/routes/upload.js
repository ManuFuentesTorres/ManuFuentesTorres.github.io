const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuración de Multer para almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // La ruta se basa en el tipo de archivo subido (ej. /img/profile, /assets/certs)
        // Esto es un ejemplo simple, se puede hacer más dinámico
        const uploadPath = path.join(__dirname, '..', '..', 'public', 'img'); 
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro de archivos para aceptar solo imágenes y PDFs
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Error: Tipo de archivo no soportado. Solo se permiten imágenes y PDFs.'));
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: fileFilter
});

// POST /api/upload - Ruta para subir un solo archivo
router.post('/', upload.single('file'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
    }

    // Devolver la ruta relativa para ser guardada en la base de datos JSON
    const relativePath = `/img/${req.file.filename}`;

    res.status(201).json({
        message: 'Archivo subido con éxito.',
        filePath: relativePath,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
