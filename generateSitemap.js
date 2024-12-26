const fs = require('fs');
const path = require('path');

const htmlFilePath = path.join(__dirname, 'index.html');
const outputFilePath = path.join(__dirname, 'deploy', 'sitemap.xml');

function generateSitemap() {
    const html = fs.readFileSync(htmlFilePath, 'utf-8');
    const urls = new Set();

    // Simple regex to extract href attributes from <a> tags
    const regex = /<a[^>]+href="([^"]+)"[^>]*>/g;
    let match;

    while ((match = regex.exec(html)) !== null) {
        const href = match[1];
        if (href && !href.includes('#') && (href.startsWith('https://example.com') || !href.startsWith('http'))) {
            urls.add(href);
        }
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        Array.from(urls).map(url => `<url><loc>${url}</loc><changefreq>${url === 'https://example.com/' ? 'daily' : 'weekly'}</changefreq></url>`).join('\n') + `\n</urlset>`;

    const deployDir = path.join(__dirname, 'deploy');
    if (!fs.existsSync(deployDir)) fs.mkdirSync(deployDir);
    fs.writeFileSync(outputFilePath, sitemap);
    console.log('Sitemap generated successfully!');
}

generateSitemap();
