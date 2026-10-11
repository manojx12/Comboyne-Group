// Generates favicons and the default Open Graph image from the existing logo.
// Run once after replacing the logo:  node scripts/generate-icons.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const logo = fileURLToPath(new URL('src/assets/brand/comboyne-logo.png', root));
const out = (name) => fileURLToPath(new URL(`public/${name}`, root));

const PAPER = '#f6f4f0';
const INK = '#16181b';

// Square icons on a paper background so the black chevron reads on any tab colour.
async function icon(size, name) {
  const inner = Math.round(size * 0.92);
  const mark = await sharp(logo).resize(inner, inner).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: PAPER } })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toFile(out(name));
}

await icon(32, 'favicon-32.png');
await icon(192, 'favicon-192.png');
await icon(180, 'apple-touch-icon.png');

// favicon.ico for browsers, PDF viewers and crawlers that request /favicon.ico directly:
// an ICO container holding 16 px and 32 px PNG images.
async function ico(sizes, name) {
  const images = await Promise.all(
    sizes.map(async (size) => {
      const mark = await sharp(logo).resize(Math.round(size * 0.92), Math.round(size * 0.92)).png().toBuffer();
      return sharp({ create: { width: size, height: size, channels: 4, background: PAPER } })
        .composite([{ input: mark, gravity: 'center' }])
        .png()
        .toBuffer();
    }),
  );
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((size, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size, entry); // width
    header.writeUInt8(size, entry + 1); // height
    header.writeUInt16LE(1, entry + 4); // colour planes
    header.writeUInt16LE(32, entry + 6); // bits per pixel
    header.writeUInt32LE(images[i].length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += images[i].length;
  });
  const { writeFileSync } = await import('node:fs');
  writeFileSync(out(name), Buffer.concat([header, ...images]));
}

await ico([16, 32], 'favicon.ico');

// 1200×630 share card: ink panel, logo on a paper disc, brand line in system type.
const disc = await sharp({
  create: { width: 300, height: 300, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([
    {
      input: Buffer.from(`<svg width="300" height="300"><circle cx="150" cy="150" r="150" fill="${PAPER}"/></svg>`),
    },
    { input: await sharp(logo).resize(270, 270).png().toBuffer(), gravity: 'center' },
  ])
  .png()
  .toBuffer();

const text = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect x="96" y="470" width="64" height="4" fill="#f0973a"/>
  <text x="96" y="420" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#a9aeb4" letter-spacing="3">COMMERCIAL FURNITURE SPECIALISTS · EST. 1989</text>
  <text x="96" y="540" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="44" fill="${PAPER}">Transport · Installation · Warehousing</text>
</svg>`);

await sharp({ create: { width: 1200, height: 630, channels: 3, background: INK } })
  .composite([
    { input: disc, top: 70, left: 96 },
    { input: text, top: 0, left: 0 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(out('og-image.jpg'));

console.log('Generated favicon-32.png, favicon-192.png, apple-touch-icon.png and og-image.jpg in /public');
