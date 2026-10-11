/**
 * Server entry, used only at build time by scripts/prerender.mjs.
 * Renders each route to HTML and builds its head tags (title, meta, canonical,
 * Open Graph, robots and JSON-LD).
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { routes } from './routes';
import { ALLOW_INDEXING, QUOTE_ENDPOINT, SITE } from './config';
import { pageTitle, type PageMeta } from './lib/meta';
import { jsonLd } from './lib/jsonLd';

export const paths = Object.keys(routes);
export const site = SITE.href;
export const allowIndexing = ALLOW_INDEXING;
/** Used by scripts/prerender.mjs to allow the quote endpoint in the Content-Security-Policy. */
export const quoteEndpoint = QUOTE_ENDPOINT;

const attr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function renderHead(meta: PageMeta, path: string): string {
  const title = pageTitle(meta);
  const canonical = new URL(path, SITE).href;
  const image = new URL(meta.ogImage ?? '/og-image.jpg', SITE).href;
  const indexable = ALLOW_INDEXING && !meta.noindex;
  return [
    `<title>${attr(title)}</title>`,
    `<meta name="description" content="${attr(meta.description)}" />`,
    `<link rel="canonical" href="${attr(canonical)}" />`,
    `<meta name="robots" content="${indexable ? 'index, follow' : 'noindex, nofollow'}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="en_AU" />',
    '<meta property="og:site_name" content="Comboyne Group" />',
    `<meta property="og:title" content="${attr(title)}" />`,
    `<meta property="og:description" content="${attr(meta.description)}" />`,
    `<meta property="og:url" content="${attr(canonical)}" />`,
    `<meta property="og:image" content="${attr(image)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    ...(meta.schema ?? []).map((item) => `<script type="application/ld+json">${jsonLd(item)}</script>`),
  ].join('\n    ');
}

export function render(path: string): { html: string; head: string } {
  const route = routes[path];
  const html = renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
  return { html, head: renderHead(route.meta, path) };
}
