/**
 * Client entry. Production pages are pre-rendered HTML with data-route on #root,
 * so React hydrates them. In development Vite serves index.html for every path
 * and the page is rendered on the client.
 */
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { normalizePath, routes } from './routes';
import { pageTitle } from './lib/meta';

const root = document.getElementById('root')!;
const prerendered = root.dataset.route;
const path = prerendered ?? normalizePath(window.location.pathname);
const app = (
  <StrictMode>
    <App path={path} />
  </StrictMode>
);

if (prerendered) {
  hydrateRoot(root, app);
} else {
  document.title = pageTitle((routes[path] ?? routes['/404']).meta);
  createRoot(root).render(app);
}
