const ejs = require('ejs');
const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const templatesDir = path.join(__dirname, '..', 'templates');
const publicDir = path.join(__dirname, '..', 'public');

async function readJsonData(filename) {
    const filePath = path.join(dataDir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}

async function build() {
    try {
        console.log('Iniciando el proceso de build...');

        // 1. Leer todos los datos JSON
        const portfolio = await readJsonData('portfolio.json');
        const projects = await readJsonData('projects.json');
        const certifications = await readJsonData('certifications.json');
        const experience = await readJsonData('experience.json');
        const skills = await readJsonData('skills.json');
        const contact = await readJsonData('contact.json');

        const allData = { portfolio, projects, certifications, experience, skills, contact };

        // 2. Renderizar cada página con EJS
        const pagesToRender = [
            { template: 'index.ejs', output: 'index.html' },
            { template: 'about.ejs', output: 'about.html' },
            { template: 'skills.ejs', output: 'skills.html' },
            { template: 'projects.ejs', output: 'projects.html' },
            { template: 'certifications.ejs', output: 'certifications.html' },
            { template: 'experience.ejs', output: 'experience.html' },
            { template: 'contact.ejs', output: 'contact.html' },
        ];

        for (const page of pagesToRender) {
            const templatePath = path.join(templatesDir, page.template);
            const outputPath = path.join(publicDir, page.output);

            console.log(`Renderizando ${page.template} -> ${page.output}`);

            const html = await ejs.renderFile(templatePath, { portfolio: allData.portfolio, projects: allData.projects, certifications: allData.certifications, experience: allData.allData.experience, skills: allData.skills, contact: allData.contact }, { async: true });

            await fs.writeFile(outputPath, html, 'utf-8');
        }

        // 3. Copiar assets (CSS, JS, etc.) - esto se puede mejorar
        // Por ahora, los archivos ya están en public/css y public/js
        console.log('Copiando assets...');
        // (Lógica de copia si los assets estuvieran en otro lugar)

        console.log('Build completado con éxito!');

    } catch (error) {
        console.error('Error durante el proceso de build:', error);
        process.exit(1);
    }
}

// El script de build se llama generate-static.js en package.json, así que renombramos o ajustamos el script.
// Por ahora, lo dejamos como build.js y se puede llamar directamente con node.

build();
