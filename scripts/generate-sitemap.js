/**
 * Simple Sitemap Generator for Node.js
 * Run this command to generate sitemap: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Base configuration
const BASE_URL = 'https://jamesweb.dpdns.org'; // Change to your actual domain
const ROOT_DIR = path.resolve(__dirname, '..');

// Files to exclude
const EXCLUDE = ['node_modules', '.git', 'assets', 'scripts', '403.html', '404.html'];

function walkDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (!EXCLUDE.includes(file)) walkDir(filePath, fileList);
        } else {
            if (file.endsWith('.html') && !EXCLUDE.includes(file)) {
                let relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
                if (relativePath === 'index.html') relativePath = '';
                fileList.push(relativePath);
            }
        }
    });
    return fileList;
}

const pages = walkDir(ROOT_DIR);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${BASE_URL}/${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemap);
console.log('Sitemap.xml generated successfully!');
