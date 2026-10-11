// Comboyne Group photo grade.
//
// Reads the untouched originals in src/assets/images/ and writes graded copies to
// src/assets/graded/ (same filenames). Every run starts from the originals, so it
// can be repeated safely without the images degrading. The site imports only the
// graded files; scripts/build-images.mjs then writes responsive AVIF/WebP/JPEG sizes from them.
//
//   node scripts/grade-images.mjs                 grade all images
//   node scripts/grade-images.mjs --sheet out.jpg also write a before/after contact sheet
//
// The grade is done on raw pixels in one pass (no intermediate JPEG compression):
//   1. optional crop
//   2. partial grey-world white balance  -> removes strong yellow/orange casts
//   3. partial tonal match                -> pulls brightness and contrast toward a shared target
//   4. shadow lift / highlight roll-off   -> no crushed blacks, no clipped whites
//   5. desaturation                       -> calmer colour, never fully monochrome
//   6. warm-neutral balance               -> a slight, consistent warmth (not orange)
// See docs/IMAGE-GRADING.md for the reasoning and how to grade new photography.
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = join(root, 'src/assets/images');
const OUTPUT = join(root, 'src/assets/graded');

/** Shared grade. Change these to adjust every photograph at once. */
export const GRADE = {
  castStrength: 0.65, // 0 = keep original colour cast, 1 = full grey-world neutral
  targetMean: 132, // target mean luminance (0-255)
  targetStdev: 58, // target luminance spread (contrast)
  toneStrength: 0.5, // 0 = keep original tone, 1 = force exactly to target
  blackPoint: 10, // darkest output value (lifts shadows)
  whitePoint: 247, // brightest output value (keeps highlights off pure white)
  saturation: 0.8, // 1 = original saturation, 0 = monochrome
  warmth: [1.018, 1.0, 0.972], // final R, G, B multipliers: subtle warm-neutral
  jpegQuality: 86,
};

/** Per-image adjustments. Keep these rare; the shared grade should do the work. */
export const IMAGES = {
  // Portrait original: crop to a landscape band below the pink ceiling panels.
  'hero-office-workstations.jpg': { crop: { left: 0, top: 1590, width: 2000, height: 1250 } },
  // Strong yellow/orange casts from tungsten light and cardboard: neutralise a little harder.
  'chair-base-detail.jpg': { castStrength: 0.75 },
  // Saturated red shelving, blue racking and yellow steel: calm it further than the rest.
  'warehouse-racking.jpg': { castStrength: 0.8, saturation: 0.66 },
};

const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

async function grade(file) {
  const opts = { ...GRADE, ...(IMAGES[file] ?? {}) };
  let pipeline = sharp(join(SOURCE, file)).rotate().removeAlpha().toColourspace('srgb');
  if (opts.crop) pipeline = pipeline.extract(opts.crop);
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;

  // Measure channel and luminance statistics.
  let sr = 0, sg = 0, sb = 0, sl = 0, sl2 = 0;
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sr += r; sg += g; sb += b; sl += l; sl2 += l * l;
  }
  const mr = sr / n, mg = sg / n, mb = sb / n, ml = sl / n;
  const sd = Math.sqrt(Math.max(sl2 / n - ml * ml, 1));

  // 2. Partial grey-world gains.
  const gain = (m) => 1 + opts.castStrength * (ml / m - 1);
  const gr = gain(mr), gg = gain(mg), gb = gain(mb);

  // 3. Partial tonal match (same linear map on every channel).
  const contrast = 1 + opts.toneStrength * (opts.targetStdev / sd - 1);
  const mean = ml + opts.toneStrength * (opts.targetMean - ml);

  // 4. Output range.
  const range = (opts.whitePoint - opts.blackPoint) / 255;

  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 3) {
    let r = data[i] * gr, g = data[i + 1] * gg, b = data[i + 2] * gb;
    r = (r - ml) * contrast + mean;
    g = (g - ml) * contrast + mean;
    b = (b - ml) * contrast + mean;
    // 5. Desaturate around luminance.
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = l + opts.saturation * (r - l);
    g = l + opts.saturation * (g - l);
    b = l + opts.saturation * (b - l);
    // 4 + 6. Compress into the output range, then warm-neutral balance.
    out[i] = clamp((clamp(r) * range + opts.blackPoint) * opts.warmth[0]);
    out[i + 1] = clamp((clamp(g) * range + opts.blackPoint) * opts.warmth[1]);
    out[i + 2] = clamp((clamp(b) * range + opts.blackPoint) * opts.warmth[2]);
  }

  await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
    .jpeg({ quality: opts.jpegQuality, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(join(OUTPUT, file));

  return { file, before: { mean: ml, sd, cast: mr - mb }, size: `${info.width}x${info.height}` };
}

async function contactSheet(files, outPath) {
  const w = 360, h = 240, pad = 8, label = 22;
  const tiles = [];
  for (const [col, src] of [SOURCE, OUTPUT].entries()) {
    for (const [row, file] of files.entries()) {
      const opts = IMAGES[file] ?? {};
      let img = sharp(join(src, file));
      if (src === SOURCE && opts.crop) img = img.extract(opts.crop);
      tiles.push({
        input: await img.resize(w, h, { fit: 'cover' }).jpeg().toBuffer(),
        left: pad + col * (w + pad),
        top: label + pad + row * (h + pad),
      });
    }
  }
  const height = label + pad + files.length * (h + pad);
  const header = Buffer.from(
    `<svg width="${w * 2 + pad * 3}" height="${label}"><text x="${pad}" y="16" font-family="Arial" font-size="14">Original</text><text x="${w + pad * 2}" y="16" font-family="Arial" font-size="14">Graded</text></svg>`,
  );
  await sharp({ create: { width: w * 2 + pad * 3, height, channels: 3, background: '#f5f3ee' } })
    .composite([{ input: header, left: 0, top: 0 }, ...tiles])
    .jpeg({ quality: 80 })
    .toFile(outPath);
}

mkdirSync(OUTPUT, { recursive: true });
const files = readdirSync(SOURCE).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
for (const file of files) {
  const r = await grade(file);
  const after = await sharp(join(OUTPUT, file)).stats();
  const [ar, , ab] = after.channels;
  const al = await sharp(join(OUTPUT, file)).greyscale().stats();
  console.log(
    `${r.file.padEnd(32)} ${r.size.padEnd(10)} luminance ${r.before.mean.toFixed(0)}->${al.channels[0].mean.toFixed(0)}  ` +
      `contrast ${r.before.sd.toFixed(0)}->${al.channels[0].stdev.toFixed(0)}  cast(R-B) ${r.before.cast.toFixed(0)}->${(ar.mean - ab.mean).toFixed(0)}`,
  );
}

const sheetIndex = process.argv.indexOf('--sheet');
if (sheetIndex > -1 && process.argv[sheetIndex + 1]) {
  await contactSheet(files, process.argv[sheetIndex + 1]);
  console.log(`Contact sheet written to ${process.argv[sheetIndex + 1]}`);
}
