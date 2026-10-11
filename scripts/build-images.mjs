// Responsive image variants for the React/Vite build.
//
//   node scripts/build-images.mjs
//
// Reads the graded photographs in src/assets/graded/ and the logo, writes
// AVIF/WebP/JPEG widths to public/img/ and a manifest (dimensions + widths) to
// src/generated/images.json. Existing up-to-date outputs are skipped, so the
// script is cheap to run before every dev/build.
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const photosDir = join(root, 'src/assets/graded');
const logoFile = join(root, 'src/assets/brand/comboyne-logo.png');
const outDir = join(root, 'public/img');
const manifestFile = join(root, 'src/generated/images.json');

const WIDTHS = [480, 800, 1200, 1600, 2000, 2400];
const LOGO_WIDTHS = [40, 56, 80, 112];
const encoders = {
  avif: (img) => img.avif({ quality: 55, effort: 4 }),
  webp: (img) => img.webp({ quality: 74 }),
  jpg: (img) => img.jpeg({ quality: 78, mozjpeg: true }),
};

mkdirSync(outDir, { recursive: true });
mkdirSync(join(root, 'src/generated'), { recursive: true });

const fresh = (out, src) => existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs;
let written = 0;

async function variant(src, width, format, out) {
  if (fresh(out, src)) return;
  await encoders[format](sharp(src).resize({ width, withoutEnlargement: true })).toFile(out);
  written++;
}

const manifest = {};
for (const file of readdirSync(photosDir).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort()) {
  const src = join(photosDir, file);
  const name = basename(file, extname(file));
  const { width, height } = await sharp(src).metadata();
  const widths = WIDTHS.filter((w) => w <= width);
  await Promise.all(
    widths.flatMap((w) => Object.keys(encoders).map((f) => variant(src, w, f, join(outDir, `${name}-${w}.${f}`)))),
  );
  manifest[name] = { width, height, widths };
}

for (const w of LOGO_WIDTHS) {
  await variant(logoFile, w, 'webp', join(outDir, `logo-${w}.webp`));
  if (!fresh(join(outDir, `logo-${w}.png`), logoFile)) {
    await sharp(logoFile).resize({ width: w }).png({ compressionLevel: 9 }).toFile(join(outDir, `logo-${w}.png`));
    written++;
  }
}

writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`images: ${Object.keys(manifest).length} photos, ${written} files written`);
