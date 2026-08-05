/**
 * Generates build/sitemap.xml after every production build.
 *
 * `lastmod` is taken from the last commit that touched src/ or public/, so that
 * config-only or docs-only commits do not falsely mark the page as updated.
 * Falls back to the build date when git history is unavailable.
 */

const { writeFileSync, mkdirSync, existsSync } = require('node:fs');
const { execSync } = require('node:child_process');
const path = require('node:path');

const BASE_URL = 'https://isabezeniroglu.com';
const OUT_DIR = path.join(__dirname, '..', 'build');
const OUT_FILE = path.join(OUT_DIR, 'sitemap.xml');

function lastModified() {
  try {
    const out = execSync('git log -1 --format=%cs -- src public', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'], // keep git's stderr out of the build log
    }).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) {
      return { date: out, source: 'git' };
    }
  } catch {
    // git missing, shallow clone without history, or command failed - fall through
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

console.log(`sitemap.xml written - lastmod: ${lastmod} (source: ${source})`);

if (source === 'fallback') {
  console.warn(
    'WARNING: git history unavailable, lastmod fell back to the build date. ' +
      'This is expected when the CI provider uses a shallow clone.',
  );
}
