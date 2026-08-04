/**
 * Image optimization pipeline.
 *
 * Source: assets-source/  full-resolution PNG originals, versioned but never bundled
 * Output: src/assets/     WebP variants, the only images imported by the app
 *
 * Each target is rendered at twice its on-screen size to stay sharp on retina displays.
 * Usage: npm run optimize:images
 */

const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const SRC_DIR = path.join(__dirname, '..', 'assets-source');
const OUT_DIR = path.join(__dirname, '..', 'src', 'assets');

// Project cards render at ~528px wide, so 1100px covers retina.
// The profile photo renders at w-64 (256px), so 512px is enough.
const TARGETS = [
  { file: 'projects/vargelogluinsaat.png', width: 1100, quality: 82 },
  { file: 'projects/rentalcar.png', width: 1100, quality: 82 },
  { file: 'isa.png', width: 512, quality: 82 },
];

// Skill icons render at w-11 (44px), so 96px is more than enough.
const ICON_WIDTH = 96;
const ICON_QUALITY = 88;

const kb = (bytes) => (bytes / 1024).toFixed(0);

async function convert(relPath, width, quality) {
  const src = path.join(SRC_DIR, relPath);
  const out = path.join(OUT_DIR, relPath).replace(/\.png$/i, '.webp');

  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(out);

  const before = fs.statSync(src).size;
  const after = fs.statSync(out).size;
  const meta = await sharp(out).metadata();

  console.log(
    `${relPath.padEnd(34)} ${kb(before).padStart(5)} KB -> ${kb(after).padStart(4)} KB  (${meta.width}x${meta.height})`
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
    const { before, after } = await convert(target.file, target.width, target.quality);
    totalBefore += before;
    totalAfter += after;
  }

  const icons = fs
    .readdirSync(SRC_DIR)
    .filter((file) => file.toLowerCase().endsWith('.png'))
    .filter((file) => !explicit.has(file));

  for (const icon of icons) {
    const { before, after } = await convert(icon, ICON_WIDTH, ICON_QUALITY);
    totalBefore += before;
    totalAfter += after;
  }

  const saved = (1 - totalAfter / totalBefore) * 100;
  console.log(
    `\nTOTAL: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${kb(totalAfter)} KB  (${saved.toFixed(0)}% smaller)`
  );
}

main().catch((error) => {
  console.error('Image optimization failed:', error.message);
  process.exit(1);
});
