const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const authMiddleware = (req, res, next) => {
    // Permitir acceso a rutas GET sin autenticación
    if (req.method === 'GET') {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso no autorizado: Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Acceso no autorizado: Token inválido.' });
    }

    next();
};

module.exports = authMiddleware;
