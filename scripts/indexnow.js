/**
 * Tell Bing and other IndexNow engines about new/changed URLs.
 * Run AFTER deploying:  node scripts/indexnow.js
 * (Google does not use IndexNow — submit the sitemap in Search Console.)
 */
const fs = require('fs');
const path = require('path');
const HOST = 'jamesweb.dpdns.org';
const KEY = '309de03c613eb59c6e22b68b4b03a4db';
const xml = fs.readFileSync(path.resolve(__dirname, '..', 'sitemap.xml'), 'utf8');
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList })
}).then(r => console.log('IndexNow status', r.status, '(200/202 = accepted)'))
  .catch(e => console.error('IndexNow failed:', e.message));
