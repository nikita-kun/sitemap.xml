const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const htmlFilePath = path.join(__dirname, 'index.html');
const outputFilePath = path.join(__dirname, 'deploy', 'sitemap.xml');

function generateSitemap() {
    const html = fs.readFileSync(htmlFilePath, 'utf-8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const urls = new Set();

    urls.add('https://nikita-kun.github.io/order/');
    document.querySelectorAll('a').forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (href.startsWith('/') && !href.includes('#')) {
            urls.add(`https://nikita-kun.github.io${href}`);
        }
    });
    document.querySelectorAll('summary').forEach(anchor => {
        const href = anchor.textContent;
        urls.add(`https://nikita-kun.github.io/?${href}`);
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        Array.from(urls).map(url => `<url><loc>${url}</loc><changefreq>${url === 'https://nikita-kun.github.io/' ? 'daily' : 'weekly'}</changefreq></url>`).join('\n') + `\n</urlset>`;

    const deployDir = path.join(__dirname, 'deploy');
    if (!fs.existsSync(deployDir)) fs.mkdirSync(deployDir);
    fs.writeFileSync(outputFilePath, sitemap);
    console.log('Sitemap generated successfully!');
}

generateSitemap();
