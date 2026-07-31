const { writeFileSync, mkdirSync, existsSync } = require('node:fs');
const { execSync } = require('node:child_process');
const path = require('node:path');

const BASE_URL = 'https://isabezeniroglu.vercel.app';
const OUT_DIR = path.join(__dirname, '..', 'build');
const OUT_FILE = path.join(OUT_DIR, 'sitemap.xml');

/**
 * Sayfayı gerçekten etkileyen dosyalara (src/, public/) dokunan
 * son commit'in tarihini döndürür. Git okunamazsa build tarihine düşer.
 */
function lastModified() {
  try {
    const out = execSync('git log -1 --format=%cs -- src public', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'], // git'in hata çıktısı log'u kirletmesin
    }).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) {
      return { date: out, source: 'git' };
    }
  } catch {
    // git yok, .git klonlanmamış ya da komut başarısız — aşağıya düş
  }

  return { date: new Date().toISOString().slice(0, 10), source: 'fallback' };
}

const { date: lastmod, source } = lastModified();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>
`;

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

writeFileSync(OUT_FILE, xml, 'utf8');

console.log(`sitemap.xml yazildi - lastmod: ${lastmod} (kaynak: ${source})`);

if (source === 'fallback') {
  console.warn(
    'UYARI: git gecmisi okunamadi, lastmod build tarihine dusuruldu. ' +
      'Vercel sig klonlama yaptiysa beklenen bir durumdur.'
  );
}