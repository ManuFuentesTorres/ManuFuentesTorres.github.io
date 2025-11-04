const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const rootDir = path.join(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const publicImgDir = path.join(rootDir, 'public', 'img', 'profile');

async function processLocalData() {
    console.log('Iniciando procesamiento de datos locales...');

    try {
        // 1. Leer y parsear Datos de contacto.txt
        const contactFilePath = path.join(rootDir, '..', 'Datos de contacto.txt');
        const contactFileContent = await fs.readFile(contactFilePath, 'utf-8');

        const emailMatch = contactFileContent.match(/Email: (.*)/);
        const phoneMatch = contactFileContent.match(/Teléfono: (.*)/);
        const linkedinMatch = contactFileContent.match(/LinkedIn: (.*)/);

        const email = emailMatch ? emailMatch[1].trim() : '';
        const phone = phoneMatch ? phoneMatch[1].trim() : '';
        const linkedin = linkedinMatch ? linkedinMatch[1].trim() : '';

        // 2. Actualizar data/contact.json
        const contactJsonPath = path.join(dataDir, 'contact.json');
        const contactJson = JSON.parse(await fs.readFile(contactJsonPath, 'utf-8'));
        contactJson.email = email;
        contactJson.phone = phone;
        contactJson.linkedin = linkedin;
        await fs.writeFile(contactJsonPath, JSON.stringify(contactJson, null, 2));
        console.log('contact.json actualizado.');

        // 3. Actualizar data/portfolio.json
        const portfolioJsonPath = path.join(dataDir, 'portfolio.json');
        const portfolioJson = JSON.parse(await fs.readFile(portfolioJsonPath, 'utf-8'));
        portfolioJson.email = email;
        portfolioJson.phone = phone;
        portfolioJson.links.linkedin = linkedin;
        await fs.writeFile(portfolioJsonPath, JSON.stringify(portfolioJson, null, 2));
        console.log('portfolio.json actualizado.');

        // 4. Procesar y copiar foto-carnet.jpg
        const sourceImagePath = path.join(rootDir, '..', 'foto-carnet.jpg');
        const outputImagePath = path.join(publicImgDir, 'profile-photo.jpg');

        await sharp(sourceImagePath)
            .resize(400, 400) // Redimensionar a 400x400 px
            .jpeg({ quality: 80 }) // Comprimir a 80% de calidad
            .toFile(outputImagePath);
        console.log('Imagen de perfil procesada y guardada en public/img/profile/profile-photo.jpg');

        console.log('Procesamiento de datos locales completado con éxito!');

    } catch (error) {
        console.error('Error durante el procesamiento de datos locales:', error);
        process.exit(1);
    }
}

processLocalData();
