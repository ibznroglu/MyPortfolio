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

// Project cards render at ~530px wide, so ~1100px covers retina.
// Screenshots share a 2:1 ratio so every card gets an identical box.
// `extract` picks the crop window manually when the automatic one frames badly.
const TARGETS = [
  { file: 'projects/portfolio.png', width: 1100, height: 550, position: 'top', quality: 82 },
  {
    file: 'projects/vargelogluinsaat.png',
    width: 1100,
    height: 550,
    position: 'left top',
    quality: 82,
  },

  { file: 'isa.png', width: 512, quality: 82 },
];

// Skill icons render at w-11 (44px), so 96px is more than enough.
const ICON_WIDTH = 96;
const ICON_QUALITY = 88;

const kb = (bytes) => (bytes / 1024).toFixed(0);

async function convert(relPath, { width, height, position, quality, extract }) {
  const src = path.join(SRC_DIR, relPath);
  const out = path.join(OUT_DIR, relPath).replace(/\.png$/i, '.webp');
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

  const saved = (1 - totalAfter / totalBefore) * 100;
  console.log(
    `\nTOTAL: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${kb(totalAfter)} KB  (${saved.toFixed(0)}% smaller)`,
  );
}

main().catch((error) => {
  console.error('Image optimization failed:', error.message);
  process.exit(1);
});
