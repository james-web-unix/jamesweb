/**
 * Sitemap generator — the ONLY sitemap script (the old root generate-sitemap.js was removed).
 * Run:  node scripts/generate-sitemap.js            (uses today's date)
 *       LASTMOD=2026-10-03 node scripts/generate-sitemap.js
 * Edit PAGES below when you add a page, then re-run and redeploy.
 */
const fs = require('fs');
const path = require('path');

const BASE = 'https://jamesweb.dpdns.org';
const LASTMOD = process.env.LASTMOD || new Date().toISOString().slice(0, 10);

const PAGES = [
  { path: '/' },
  { path: '/logical/', images: [
    '/assets/images/og-james-web-logical.jpg',
    '/assets/images/james-web-logical-book.jpg',
    '/assets/images/james-web-logical-banner.jpg' ] },
  { path: '/learning/' },
  { path: '/reader/' },
  { path: '/about/' },
  { path: '/ethics/' },
  { path: '/contact/' },
  { path: '/privacy/' },
  { path: '/disclaimer/' },
  { path: '/corrections/' }
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${PAGES.map(p => `  <url>
    <loc>${BASE}${p.path}</loc>
    <lastmod>${LASTMOD}</lastmod>${(p.images || []).map(i => `
    <image:image><image:loc>${BASE}${i}</image:loc></image:image>`).join('')}
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.resolve(__dirname, '..', 'sitemap.xml'), xml);
console.log('sitemap.xml written for ' + PAGES.length + ' pages, lastmod ' + LASTMOD);
