/**
 * Image optimization pipeline.
 *
 * Source: assets-source/  full-resolution PNG originals, versioned but never bundled
 * Output: src/assets/     WebP variants, the only images imported by the app
 *
 * Each target is rendered at twice its on-screen size to stay sharp on retina displays.
 * Usage: npm run optimize:images
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC_DIR = path.join(__dirname, '..', 'assets-source');
const OUT_DIR = path.join(__dirname, '..', 'src', 'assets');

// Project cards are never wider than about 405px, in the two-column range, so
// 900px covers a 2x screen and the 560px variant covers a 1x one. ProjectCard
// names both in srcset; generating them here rather than by hand is what keeps
// the descriptors honest, since anything made outside this file gets
// overwritten the next time it runs.
// Screenshots share a 2:1 ratio so every card gets an identical box.
// `extract` picks the crop window manually when the automatic one frames badly.
const TARGETS = [
  { file: 'projects/portfolio.png', width: 900, height: 450, position: 'top', quality: 82 },
  {
    file: 'projects/vargelogluinsaat.png',
    width: 900,
    height: 450,
    position: 'left top',
    quality: 82,
  },
  { file: 'projects/gamingpromarket.png', width: 900, height: 450, position: 'top', quality: 82 },

  // The 1x variant. Higher quality because at close to 1:1 there is no
  // downscale left to hide compression behind.
  {
    file: 'projects/portfolio.png',
    suffix: '-560',
    width: 560,
    height: 280,
    position: 'top',
    quality: 88,
  },
  {
    file: 'projects/vargelogluinsaat.png',
    suffix: '-560',
    width: 560,
    height: 280,
    position: 'left top',
    quality: 88,
  },
  {
    file: 'projects/gamingpromarket.png',
    suffix: '-560',
    width: 560,
    height: 280,
    position: 'top',
    quality: 88,
  },

  { file: 'isa.png', width: 512, quality: 82 },
];

/**
 * Social preview images, written to public/ as JPEG.
 *
 * LinkedIn, Slack and X accept JPEG, PNG and GIF. They do not accept WebP —
 * pointing og:image at one produced a card with no image at all, not even a
 * fallback. These also skip the hashed asset pipeline: og:image has to be an
 * absolute URL, and a stable path in public/ is one less thing for the
 * prerender step to resolve.
 *
 * 1200x630 is the size every one of them documents. gamingpromarket's source
 * is 865px wide and gets upscaled to reach it; a slightly soft preview beats a
 * small card.
 */
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OG_DIR = path.join(PUBLIC_DIR, 'og');
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_QUALITY = 85;

/**
 * The portrait behind Person.image in the structured data.
 *
 * It used to point at logo512.png, which tells Google a mark rather than a
 * face and leaves the entity ambiguous — a person or an organisation. On a
 * name query that ambiguity is the whole game. 1200px on the longest side is
 * what Google asks for in images used by Search features.
 *
 * Squared here rather than shipped square, so the crop stays in the pipeline
 * with every other framing decision.
 */
const PORTRAIT = { file: 'portrait.jpg', name: 'portrait.jpg', size: 1200, quality: 86 };

const OG_TARGETS = [
  { file: 'projects/portfolio.png', name: 'portfolio.jpg', position: 'top' },
  { file: 'projects/vargelogluinsaat.png', name: 'vargeloglu-insaat.jpg', position: 'left top' },
  { file: 'projects/gamingpromarket.png', name: 'gaming-pro-market.jpg', position: 'top' },
];

// Skill icons render at w-11 (44px), so 96px is more than enough.
const ICON_WIDTH = 96;
const ICON_QUALITY = 88;

const kb = (bytes) => (bytes / 1024).toFixed(0);

async function convertPortrait() {
  const src = path.join(SRC_DIR, PORTRAIT.file);
  if (!fs.existsSync(src)) {
    console.warn(`\nSkipping portrait: ${PORTRAIT.file} not found in assets-source/`);
    return;
  }

  const out = path.join(PUBLIC_DIR, PORTRAIT.name);

  await sharp(src)
    .resize({ width: PORTRAIT.size, height: PORTRAIT.size, fit: 'cover', position: 'top' })
    .jpeg({ quality: PORTRAIT.quality, mozjpeg: true })
    .toFile(out);

  console.log(
    `${PORTRAIT.name.padEnd(27)} ${PORTRAIT.size}x${PORTRAIT.size}  ${kb(fs.statSync(out).size)} KB`,
  );
}

async function convertOg({ file, name, position }) {
  const src = path.join(SRC_DIR, file);
  const out = path.join(OG_DIR, name);

  fs.mkdirSync(OG_DIR, { recursive: true });

  await sharp(src)
    .resize({ width: OG_WIDTH, height: OG_HEIGHT, fit: 'cover', position })
    .jpeg({ quality: OG_QUALITY, mozjpeg: true })
    .toFile(out);

  console.log(`og/${name.padEnd(24)} ${OG_WIDTH}x${OG_HEIGHT}  ${kb(fs.statSync(out).size)} KB`);
}

async function convert(relPath, { width, height, position, quality, extract, suffix = '' }) {
  const src = path.join(SRC_DIR, relPath);
  const out = path.join(OUT_DIR, relPath).replace(/\.png$/i, `${suffix}.webp`);
  const meta = await sharp(src).metadata();

  const pipeline = sharp(src);
  if (extract) pipeline.extract(extract);

  // Never upscale: an enlarged screenshot looks worse than a slightly smaller one.
  const available = extract ? extract.width : meta.width;
  const targetWidth = Math.min(width, available);

  if (height) {
    pipeline
      .resize({
        width: targetWidth,
        height: Math.round(targetWidth * (height / width)),
        fit: 'cover',
        position: position || 'centre',
      })
      .sharpen({ sigma: 0.6 });
  } else {
    pipeline.resize({ width: targetWidth, withoutEnlargement: true });
  }

  fs.mkdirSync(path.dirname(out), { recursive: true });
  await pipeline.webp({ quality }).toFile(out);

  const before = fs.statSync(src).size;
  const after = fs.statSync(out).size;
  const outMeta = await sharp(out).metadata();

  console.log(
    `${relPath.padEnd(34)} ${kb(before).padStart(5)} KB -> ${kb(after).padStart(4)} KB  (${outMeta.width}x${outMeta.height})`,
  );

  return { before, after };
}

async function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Source directory not found: ${SRC_DIR}`);
    process.exit(1);
  }

  let totalBefore = 0;
  let totalAfter = 0;

  // Anything already listed in TARGETS must not be reprocessed as an icon.
  const explicit = new Set(TARGETS.map((target) => target.file));

  for (const target of TARGETS) {
    const { before, after } = await convert(target.file, target);
    totalBefore += before;
    totalAfter += after;
  }

  const icons = fs
    .readdirSync(SRC_DIR)
    .filter((file) => file.toLowerCase().endsWith('.png'))
    .filter((file) => !explicit.has(file));

  for (const icon of icons) {
    const { before, after } = await convert(icon, { width: ICON_WIDTH, quality: ICON_QUALITY });
    totalBefore += before;
    totalAfter += after;
  }

  console.log('');
  for (const target of OG_TARGETS) {
    await convertOg(target);
  }
  await convertPortrait();

  const saved = (1 - totalAfter / totalBefore) * 100;
  console.log(
    `\nTOTAL: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${kb(totalAfter)} KB  (${saved.toFixed(0)}% smaller)`,
  );
}

main().catch((error) => {
  console.error('Image optimization failed:', error.message);
  process.exit(1);
});
