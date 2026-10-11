// Post-build checks against the generated HTML in /dist.
//   node scripts/verify-build.mjs              internal checks only
//   node scripts/verify-build.mjs --external   also requests each external link
//
// Checks: required pages exist; every internal href/src/srcset resolves to a file;
// no href="#"; tel:/mailto: links are well-formed; one <h1>, a <title>, meta
// description and canonical per page; every <img> has an alt attribute; no
// duplicate ids.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const checkExternal = process.argv.includes('--external');

const required = [
  '/',
  '/about',
  '/services',
  '/services/transport',
  '/services/installation',
  '/services/warehousing',
  '/locations',
  '/quote',
  '/contact',
  '/careers',
  '/freight-terms-and-conditions',
  '/quote-terms-and-validity',
  '/404',
  '/robots.txt',
  '/sitemap-index.xml',
];

const errors = [];
const warnings = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function resolveRoute(pathname) {
  const clean = decodeURIComponent(pathname.split(/[?#]/)[0]);
  if (clean === '/' || clean === '') return join(dist, 'index.html');
  const candidates = [join(dist, clean), join(dist, `${clean}.html`), join(dist, clean, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

if (!existsSync(dist)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

for (const route of required) {
  if (!resolveRoute(route)) errors.push(`Missing required page: ${route}`);
}

const pages = walk(dist).filter((f) => f.endsWith('.html'));
const external = new Map();
let internalLinks = 0;
let telLinks = 0;
let mailLinks = 0;

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const page = '/' + relative(dist, file).split(sep).join('/');

  const attr = (name) => [...html.matchAll(new RegExp(`\\s${name}="([^"]*)"`, 'g'))].map((m) => m[1]);
  const hrefs = attr('href');
  const srcs = attr('src');
  const srcsets = attr('srcset').flatMap((s) => s.split(',').map((part) => part.trim().split(/\s+/)[0]));

  for (const url of [...hrefs, ...srcs, ...srcsets]) {
    if (url === '#') errors.push(`${page}: placeholder href="#"`);
    if (url.startsWith('tel:')) {
      telLinks++;
      if (!/^tel:\+61\d{9}$/.test(url)) errors.push(`${page}: malformed tel link ${url}`);
    } else if (url.startsWith('mailto:')) {
      mailLinks++;
      const address = url.slice(7).split('?')[0];
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(address)) errors.push(`${page}: malformed mailto link ${url}`);
    } else if (url.startsWith('/') && !url.startsWith('//')) {
      internalLinks++;
      if (!resolveRoute(url)) errors.push(`${page}: broken internal link ${url}`);
    } else if (url.startsWith('#') && url.length > 1) {
      if (!html.includes(`id="${url.slice(1)}"`)) errors.push(`${page}: anchor ${url} has no matching id`);
    } else if (/^https?:\/\//.test(url)) {
      if (!external.has(url)) external.set(url, new Set());
      external.get(url).add(page);
    }
  }

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) errors.push(`${page}: expected exactly one <h1>, found ${h1s}`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${page}: missing <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${page}: missing meta description`);
  if (!/<link rel="canonical" href="[^"]+"/.test(html)) errors.push(`${page}: missing canonical link`);

  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    // A bare `alt` (empty alt text) is valid for decorative images such as the logo inside a labelled link.
    if (!/\salt(="|[\s>])/.test(img)) errors.push(`${page}: <img> without alt attribute`);
  }

  const ids = attr('id');
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  for (const id of new Set(dupes)) errors.push(`${page}: duplicate id "${id}"`);
}

if (checkExternal) {
  for (const [url, from] of external) {
    // Canonical/OG URLs point at the future production domain; skip those.
    if (url.startsWith('https://comboynegroup.com')) continue;
    try {
      let res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      if (res.status === 405 || res.status === 403) res = await fetch(url, { method: 'GET', redirect: 'follow' });
      if (res.status >= 400) warnings.push(`External link returned ${res.status}: ${url} (from ${[...from][0]})`);
    } catch (err) {
      warnings.push(`External link failed: ${url} — ${err.message}`);
    }
  }
}

console.log(`Pages checked:        ${pages.length}`);
console.log(`Internal links/assets: ${internalLinks}`);
console.log(`tel: links:           ${telLinks}`);
console.log(`mailto: links:        ${mailLinks}`);
console.log(`Unique external URLs: ${external.size}${checkExternal ? ' (requested)' : ' (not requested — use --external)'}`);
for (const w of warnings) console.warn(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
console.log(errors.length ? `\n${errors.length} error(s).` : '\nAll checks passed.');
process.exit(errors.length ? 1 : 0);
