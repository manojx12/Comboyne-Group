// Pre-renders every route to static HTML after the client and server builds.
//
//   vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs
//
// Output keeps the site URLs: /about -> dist/about.html,
// /services/transport -> dist/services/transport.html, plus 404.html,
// robots.txt and the sitemap. React hydrates each page from #root[data-route].
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const { render, paths, site, allowIndexing, quoteEndpoint } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
const template = readFileSync(join(dist, 'index.html'), 'utf8');

// Preload the Latin Archivo file the CSS already references, so the large display type does not reflow.
const font = readdirSync(join(dist, 'assets')).find((f) => /^archivo-latin-wdth-normal.*\.woff2$/.test(f));
const preload = font ? `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />` : '';

const fileFor = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`);

// Hashes of every inline script the browser executes (JSON-LD data blocks are not executed).
const scriptHashes = new Set();
const inlineScript = /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g;

for (const path of paths) {
  const { html, head } = render(path);
  const page = template
    .replace('<!--app-head-->', [head, preload].filter(Boolean).join('\n    '))
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-route="${path}">${html}</div>`);
  for (const [, body] of page.matchAll(inlineScript)) {
    scriptHashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  }
  const out = join(dist, fileFor(path));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page);
}

// Content-Security-Policy for hosts that read _headers (Netlify, Cloudflare Pages).
// 'unsafe-inline' styles: React writes a few CSS custom properties as style attributes.
const connect = ["'self'", quoteEndpoint ? new URL(quoteEndpoint).origin : ''].filter(Boolean).join(' ');
const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...scriptHashes].join(' ')}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src ${connect}`,
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');
const headersFile = join(dist, '_headers');
if (existsSync(headersFile)) writeFileSync(headersFile, readFileSync(headersFile, 'utf8').replace('__CSP__', csp));

// robots.txt: indexing is opt-in (PUBLIC_ALLOW_INDEXING=true) so preview deployments are never crawled.
const sitemapUrl = new URL('/sitemap-index.xml', site).href;
writeFileSync(
  join(dist, 'robots.txt'),
  allowIndexing
    ? `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`
    : '# Preview build: indexing disabled. Set PUBLIC_ALLOW_INDEXING=true for production.\nUser-agent: *\nDisallow: /\n',
);

// Sitemap: an index file pointing at one URL list.
const urls = paths.filter((p) => p !== '/404').map((p) => `<url><loc>${new URL(p, site).href}</loc></url>`);
writeFileSync(
  join(dist, 'sitemap-0.xml'),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>\n`,
);
writeFileSync(
  join(dist, 'sitemap-index.xml'),
  `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${new URL('/sitemap-0.xml', site).href}</loc></sitemap></sitemapindex>\n`,
);

// Windows can briefly lock the folder; a failed cleanup must not fail the build.
try {
  rmSync(ssrDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
} catch (error) {
  console.warn(`prerender: could not remove dist-ssr (${error.code}); it is ignored by git and safe to delete.`);
}
console.log(`prerender: ${paths.length} pages, robots.txt, sitemap (${allowIndexing ? 'indexable' : 'noindex'})`);
