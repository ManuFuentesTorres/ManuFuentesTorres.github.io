const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
// const pdfParse = require('pdf-parse'); // Se usará para el parseo real más adelante

const projectRoot = path.join(__dirname, '..', '..');
const titulacionesDir = path.join(projectRoot, '..', 'TITULACIONES'); // Ruta a la carpeta TITULACIONES original del usuario
const certificationsDataPath = path.join(projectRoot, 'data', 'certifications.json');
const publicCertThumbnailsDir = path.join(projectRoot, 'public', 'img', 'certifications');
const publicAssetsCertsDir = path.join(projectRoot, 'public', 'assets', 'certs');

async function processCertificationsScript() {
    console.log('Iniciando procesamiento de certificaciones...');

    try {
        // Asegurarse de que los directorios públicos existan
        await fs.mkdir(publicCertThumbnailsDir, { recursive: true });
        await fs.mkdir(publicAssetsCertsDir, { recursive: true });

        const files = await fs.readdir(titulacionesDir);
        const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

        let { certifications } = JSON.parse(await fs.readFile(certificationsDataPath, 'utf8'));
        const existingCertIds = new Set(certifications.map(cert => cert.originalFileName)); // Rastrear nombres de archivo originales para evitar duplicados

        for (const pdfFile of pdfFiles) {
            if (existingCertIds.has(pdfFile)) {
                console.log(`Certificación ${pdfFile} ya procesada. Saltando.`);
                continue;
            }

            const originalPdfPath = path.join(titulacionesDir, pdfFile);
            const newPdfFileName = `${uuidv4()}-${pdfFile}`;
            const destinationPdfPath = path.join(publicAssetsCertsDir, newPdfFileName);
            const thumbnailFileName = `${uuidv4()}-thumbnail.png`;
            const thumbnailPath = path.join(publicCertThumbnailsDir, thumbnailFileName);

            // Copiar PDF a los activos públicos
            await fs.copyFile(originalPdfPath, destinationPdfPath);

            // Crear una miniatura ficticia (ej. un cuadrado de color)
            await sharp({
                create: {
                    width: 200,
                    height: 280, // Relación de aspecto A4
                    channels: 4,
                    background: { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255), alpha: 1 }
                }
            })
            .png()
            .toFile(thumbnailPath);

            // Marcador de posición para el análisis real de PDF (complejo, se añadirá más adelante si es necesario)
            // const pdfDataBuffer = await fs.readFile(originalPdfPath);
            // const pdfText = await pdfParse(pdfDataBuffer);
            // console.log(`Texto extraído de ${pdfFile}:`, pdfText.text.substring(0, 200)); // Registrar los primeros 200 caracteres

            const newCertification = {
                id: uuidv4(),
                name: pdfFile.replace('.pdf', '').replace(/_/g, ' '), // Nombre básico del nombre de archivo
                institution: 'Desconocida', // Marcador de posición
                date: new Date().toISOString().split('T')[0], // Fecha actual
                duration: 'N/A',
                credits: 'N/A',
                description: 'Certificación procesada automáticamente. Detalles a rellenar.',
                certificate: `/assets/certs/${newPdfFileName}`,
                thumbnail: `/img/certifications/${thumbnailFileName}`,
                originalFileName: pdfFile // Para rastrear archivos ya procesados
            };
            certifications.push(newCertification);
            console.log(`Añadida certificación: ${newCertification.name}`);
        }

        await fs.writeFile(certificationsDataPath, JSON.stringify({ certifications }, null, 2), 'utf8');
        console.log('certifications.json actualizado con nuevas certificaciones.');
        console.log('Procesamiento de certificaciones completado.');

    } catch (error) {
        console.error('Error durante el procesamiento de certificaciones:', error);
        throw error;
    }
}

processCertificationsScript();
