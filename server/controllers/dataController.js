const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataFilePath = path.join(__dirname, '..', '..', 'data');

/**
 * Lee datos de un archivo JSON.
 * @param {string} fileName - Nombre del archivo (e.g., 'portfolio.json').
 * @returns {Promise<object>} - Los datos parseados del archivo.
 */
const readData = async (fileName) => {
  try {
    const filePath = path.join(dataFilePath, fileName);
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error al leer el archivo ${fileName}:`, error);
    throw new Error('Error interno del servidor al leer los datos.');
  }
};

/**
 * Escribe datos en un archivo JSON.
 * @param {string} fileName - Nombre del archivo (e.g., 'portfolio.json').
 * @param {object} data - Los datos a escribir en el archivo.
 * @returns {Promise<void>}
 */
const writeData = async (fileName, data) => {
  try {
    const filePath = path.join(dataFilePath, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error al escribir en el archivo ${fileName}:`, error);
    throw new Error('Error interno del servidor al guardar los datos.');
  }
};

module.exports = {
  readData,
  writeData,
  uuidv4
};
