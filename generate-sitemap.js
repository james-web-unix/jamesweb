/**
 * Simple Sitemap Generator Logic
 * Run this with Node.js to update your sitemap.xml
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://jamesweb.dpdns.org'; // Primary Domain
const DIST_PATH = './'; // Path to your static files

function generateSitemap() {
    const files = ['index.html', 'logical/index.html', 'reader/index.html'];
    const now = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files.map(file => `
  <url>
    <loc>${DOMAIN}/${file}</loc>
    <lastmod>${now}</lastmod>
    <priority>${file === 'index.html' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

    fs.writeFileSync(path.join(DIST_PATH, 'sitemap.xml'), xml);
    console.log('Sitemap generated successfully!');
}

// Auto-run if executed directly
generateSitemap();
