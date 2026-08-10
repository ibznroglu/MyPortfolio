/**
 * Generates build/sitemap.xml after every production build.
 *
 * Every route is emitted in both languages, and each entry carries hreflang
 * alternates so Google treats /about and /tr/about as one page in two
 * languages rather than as duplicates.
 *
 * `lastmod` is taken from the last commit that touched src/ or public/, so that
 * config-only or docs-only commits do not falsely mark the page as updated.
 * Falls back to the build date when git history is unavailable.
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://isabezeniroglu.com';
const OUT_DIR = path.join(__dirname, '..', 'build');
const OUT_FILE = path.join(OUT_DIR, 'sitemap.xml');

// Same table the router and the navbar use, so the sitemap can never drift.
const routes = JSON.parse(
  readFileSync(path.join(__dirname, '..', 'src', 'lib', 'routes.json'), 'utf8'),
);

// Case studies are addressable pages but not navigation items, so they are read
// straight out of the module that defines them rather than duplicated here.
const caseStudySource = readFileSync(
  path.join(__dirname, '..', 'src', 'lib', 'caseStudies.ts'),
  'utf8',
);
const caseStudyMatch = caseStudySource.match(/CASE_STUDY_SLUGS = \[([^\]]*)\]/);
const caseStudySlugs = caseStudyMatch
  ? [...caseStudyMatch[1].matchAll(/'([^']+)'/g)].map((match) => match[1])
  : [];

if (caseStudySlugs.length === 0) {
  console.warn('WARNING: no case study slugs found; the sitemap will omit them.');
}

const allSlugs = [
  ...routes.map((route) => route.slug),
  ...caseStudySlugs.map((slug) => `projects/${slug}`),
];

const urlFor = (slug, language) => {
  const prefix = language === 'tr' ? '/tr' : '';
  if (!slug) return `${BASE_URL}${prefix || '/'}`;
  return `${BASE_URL}${prefix}/${slug}`;
};

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

const entries = allSlugs.flatMap((slug) =>
  ['en', 'tr'].map((language) => {
    const alternates = [
      `      <xhtml:link rel="alternate" hreflang="en" href="${urlFor(slug, 'en')}" />`,
      `      <xhtml:link rel="alternate" hreflang="tr" href="${urlFor(slug, 'tr')}" />`,
      `      <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(slug, 'en')}" />`,
    ].join('\n');

    return [
      '  <url>',
      `    <loc>${urlFor(slug, language)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      alternates,
      '  </url>',
    ].join('\n');
  }),
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

writeFileSync(OUT_FILE, xml, 'utf8');

console.log(
  `sitemap.xml written - ${entries.length} urls, lastmod: ${lastmod} (source: ${source})`,
);

if (source === 'fallback') {
  console.warn(
    'WARNING: git history unavailable, lastmod fell back to the build date. ' +
      'This is expected when the CI provider uses a shallow clone.',
  );
}
