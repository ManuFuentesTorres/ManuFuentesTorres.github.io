const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../controllers/dataController');

const PORTFOLIO_FILE = 'portfolio.json';

// GET /api/portfolio - Leer perfil
router.get('/', async (req, res, next) => {
  try {
    const portfolioData = await readData(PORTFOLIO_FILE);
    res.status(200).json({
      data: portfolioData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

const { validatePortfolio } = require('../middleware/validation');

// PUT /api/portfolio - Actualizar perfil
router.post('/', validatePortfolio, async (req, res, next) => {
  try {
    const existingData = await readData(PORTFOLIO_FILE);
    const updatedData = { ...existingData, ...req.body };
    updatedData.lastUpdated = new Date().toISOString();
    
    await writeData(PORTFOLIO_FILE, updatedData);
    
    res.status(200).json({
      message: 'Perfil actualizado correctamente.',
      data: updatedData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
