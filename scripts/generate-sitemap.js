const { writeFileSync } = require('node:fs');
const { execSync } = require('node:child_process');
const path = require('node:path');

const BASE_URL = 'https://isabezeniroglu.vercel.app';
const OUT = path.join(__dirname, '..', 'build', 'sitemap.xml');

function lastModified() {
  try {
    const d = execSync('git log -1 --format=%cs -- src public', { encoding: 'utf8' }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  } catch { /* git yoksa aşağıya düş */ }
  return new Date().toISOString().slice(0, 10);
}

const lastmod = lastModified();
writeFileSync(OUT, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>
`);
console.log(`sitemap.xml yazildi - lastmod: ${lastmod}`);