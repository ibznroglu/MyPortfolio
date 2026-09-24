import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

/**
 * Writes one HTML file per route, each carrying its own title, description,
 * canonical and hreflang tags.
 *
 * The app is a single page served through a catch-all rewrite, so every URL
 * used to return the same index.html and only corrected its metadata once
 * React had mounted. Search engines render JavaScript eventually; the crawlers
 * behind link previews — LinkedIn, Slack, WhatsApp, X — never do. Sharing a
 * case study showed the home page's title and description instead of the
 * article's.
 *
 * Vercel resolves the filesystem before rewrites, so build/about/index.html is
 * served for /about without any extra configuration, and the rewrite still
 * catches anything these files do not cover.
 */
const BUILD_DIR = 'build';

const replaceTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`Prerender could not find ${pattern}`);
  return html.replace(pattern, replacement);
};

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Matches OG_WIDTH and OG_HEIGHT in scripts/optimize-images.js.
const PROJECT_IMAGE = { width: '1200', height: '630' };

const buildHtml = (template, meta, language) => {
  const title = escape(meta.title);
  const description = escape(meta.description);

  let html = replaceTag(template, /<html lang="[^"]*"/, `<html lang="${language}"`);
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = replaceTag(
    html,
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${description}" />`,
  );
  html = replaceTag(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${meta.canonical}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${meta.canonical}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${title}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${description}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:locale"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:locale" content="${language === 'tr' ? 'tr_TR' : 'en_US'}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${description}" />`,
  );

  if (meta.image) {
    html = replaceTag(
      html,
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:image" content="${meta.image}" />`,
    );
    html = replaceTag(
      html,
      /<meta\s+property="og:image:width"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:image:width" content="${PROJECT_IMAGE.width}" />`,
    );
    html = replaceTag(
      html,
      /<meta\s+property="og:image:height"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:image:height" content="${PROJECT_IMAGE.height}" />`,
    );
    html = replaceTag(
      html,
      /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:image:alt" content="${escape(meta.imageAlt ?? '')}" />`,
    );
    // A 900x450 screenshot deserves the wide card; the square logo does not.
    html = replaceTag(
      html,
      /<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/>/,
      '<meta name="twitter:card" content="summary_large_image" />',
    );
  }

  const alternates = meta.alternates
    .map((alt) => `    <link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`)
    .join('\n');

  return html.replace('</head>', `${alternates}\n  </head>`);
};

const outputPath = (slug, language) => {
  const segments = [BUILD_DIR];
  if (language === 'tr') segments.push('tr');
  if (slug) segments.push(...slug.split('/'));
  return path.join(...segments, 'index.html');
};

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
});

try {
  const { ALL_SLUGS, pageMeta } = await server.ssrLoadModule('/src/lib/pageMeta.ts');
  const template = await readFile(path.join(BUILD_DIR, 'index.html'), 'utf8');
  let written = 0;

  for (const slug of ALL_SLUGS) {
    for (const language of ['en', 'tr']) {
      // The English home page is the template's own URL and already correct.
      if (!slug && language === 'en') continue;

      const file = outputPath(slug, language);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, buildHtml(template, pageMeta(slug, language), language));
      written += 1;
    }
  }

  // The root still needs its hreflang tags, which the template does not carry.
  await writeFile(
    path.join(BUILD_DIR, 'index.html'),
    buildHtml(template, pageMeta('', 'en'), 'en'),
  );

  console.log(`prerendered ${written + 1} html files`);
} finally {
  await server.close();
}
