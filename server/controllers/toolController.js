const { exec } = require('child_process');
const path = require('path');

const executeScript = (scriptPath, res) => {
    // Asegurarse de que scriptPath es relativo al directorio root del proyecto
    const fullScriptPath = path.join(__dirname, '..', '..', scriptPath);

    exec(`node ${fullScriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al ejecutar script ${scriptPath}: ${error.message}`);
            return res.status(500).json({ success: false, message: 'Error al ejecutar el script', error: error.message });
        }
        if (stderr) {
            console.error(`Stderr del script ${scriptPath}: ${stderr}`);
            return res.status(500).json({ success: false, message: 'Error en el script', details: stderr });
        }
        console.log(`Script ${scriptPath} ejecutado con éxito: ${stdout}`);
        res.status(200).json({ success: true, message: 'Script ejecutado con éxito', output: stdout });
    });
};

const processCertifications = (req, res) => {
    executeScript('scripts/process-certs.js', res);
};

module.exports = {
    processCertifications
};
