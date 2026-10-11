import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Canonical production origin. Override with SITE_URL when deploying elsewhere
// (for example a preview host) so canonical URLs, Open Graph and the sitemap match.
const site = process.env.SITE_URL ?? 'https://comboynegroup.com';

/**
 * `vite preview` serves the pre-rendered build the way the static host does:
 * /about -> about.html, unknown paths -> 404.html with a 404 status.
 */
function prettyUrls(): Plugin {
  return {
    name: 'comboyne:pretty-urls',
    configurePreviewServer(server) {
      const dist = server.config.build.outDir;
      server.middlewares.use((req, res, next) => {
        const path = decodeURIComponent((req.url ?? '/').split('?')[0]);
        const file = (p: string) => existsSync(join(dist, p)) && statSync(join(dist, p)).isFile();
        if (path === '/' || file(path)) return next();
        if (file(`${path}.html`)) {
          req.url = `${path}.html${req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`;
          return next();
        }
        res.statusCode = 404;
        req.url = '/404.html';
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), prettyUrls()],
  // Existing deployment variables keep their PUBLIC_ names (PUBLIC_QUOTE_ENDPOINT, PUBLIC_ALLOW_INDEXING).
  envPrefix: ['PUBLIC_', 'VITE_'],
  define: {
    'import.meta.env.PUBLIC_SITE_URL': JSON.stringify(site),
  },
  // CSS-only dependency: bundle it in the server build instead of importing it from node_modules.
  ssr: { noExternal: ['@fontsource-variable/archivo'] },
});
