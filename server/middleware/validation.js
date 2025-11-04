const { body, validationResult } = require('express-validator');

// Middleware para manejar los errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Reglas de validación para el perfil
const validatePortfolio = [
    body('name').notEmpty().withMessage('El nombre es requerido.'),
    body('title').notEmpty().withMessage('El título es requerido.'),
    body('email').isEmail().withMessage('Debe ser un email válido.'),
    body('links.linkedin').optional({ checkFalsy: true }).isURL().withMessage('El link de LinkedIn debe ser una URL válida.'),
    body('links.github').optional({ checkFalsy: true }).isURL().withMessage('El link de GitHub debe ser una URL válida.'),
    handleValidationErrors
];

// Aquí se pueden añadir más reglas para proyectos, certificaciones, etc.

module.exports = {
    validatePortfolio
};
