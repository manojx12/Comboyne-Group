// Serves the built site the way Netlify / Cloudflare Pages would, for local checks of the production build:
// headers from dist/_headers (including the generated Content-Security-Policy), dist/_redirects (301s),
// pretty URLs (/about -> about.html), trailing slashes redirected, 404.html with a 404 status, gzip for text.
// usage: npm run build && node scripts/serve-dist.mjs [port]   (default 4400)
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const port = +(process.argv[2] ?? 4400);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain' };

// _headers: blocks of "pattern" followed by indented "Name: value" lines.
const rules = [];
for (const line of readFileSync(join(dist, '_headers'), 'utf8').split('\n')) {
  if (!line.trim() || line.trim().startsWith('#')) continue;
  if (!/^\s/.test(line)) rules.push({ pattern: line.trim(), headers: [] });
  else { const i = line.indexOf(':'); rules.at(-1).headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]); }
}
const matches = (pattern, path) => (pattern.endsWith('*') ? path.startsWith(pattern.slice(0, -1)) : path === pattern);
const redirects = readFileSync(join(dist, '_redirects'), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.trim().split(/\s+/));
const isFile = (f) => f.startsWith(dist + sep) && existsSync(f) && statSync(f).isFile();

createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const path = url.pathname;
  const redirect = redirects.find(([from]) => from === path || decodeURIComponent(from) === decodeURIComponent(path));
  if (redirect) { res.writeHead(+redirect[2] || 301, { Location: redirect[1] }); return res.end(); }
  if (path.length > 1 && path.endsWith('/')) { res.writeHead(301, { Location: path.slice(0, -1) + url.search }); return res.end(); }
  const decoded = decodeURIComponent(path);
  const candidates = decoded === '/' ? ['index.html'] : [decoded.slice(1), `${decoded.slice(1)}.html`];
  let file = candidates.map((c) => resolve(dist, c)).find(isFile);
  let status = 200;
  if (!file) { file = join(dist, '404.html'); status = 404; }
  const headers = { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' };
  for (const rule of rules) if (matches(rule.pattern, path)) for (const [k, v] of rule.headers) headers[k] = v;
  // Text is gzipped when the browser accepts it, as static hosts do.
  let body = readFileSync(file);
  if (/^(text|application\/(xml|javascript))/.test(headers['Content-Type']) && /gzip/.test(req.headers['accept-encoding'] ?? '')) {
    body = gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
  }
  res.writeHead(status, headers);
  res.end(body);
}).listen(port, () => console.log(`serving dist on http://localhost:${port}`));
