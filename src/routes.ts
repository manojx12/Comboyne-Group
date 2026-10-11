/**
 * Route table. Each page module exports a default component and its head `meta`.
 * Every path here is pre-rendered to static HTML by scripts/prerender.mjs.
 */
import type { ComponentType } from 'react';
import type { PageMeta } from './lib/meta';
import * as home from './pages/index';
import * as about from './pages/about';
import * as servicesIndex from './pages/services/index';
import * as transport from './pages/services/transport';
import * as installation from './pages/services/installation';
import * as warehousing from './pages/services/warehousing';
import * as locations from './pages/locations';
import * as quote from './pages/quote';
import * as contact from './pages/contact';
import * as careers from './pages/careers';
import * as freightTerms from './pages/freight-terms-and-conditions';
import * as quoteTerms from './pages/quote-terms-and-validity';
import * as notFound from './pages/404';

export interface Route {
  Page: ComponentType;
  meta: PageMeta;
}

const route = (mod: { default: ComponentType; meta: PageMeta }): Route => ({ Page: mod.default, meta: mod.meta });

export const routes: Record<string, Route> = {
  '/': route(home),
  '/about': route(about),
  '/services': route(servicesIndex),
  '/services/transport': route(transport),
  '/services/installation': route(installation),
  '/services/warehousing': route(warehousing),
  '/locations': route(locations),
  '/quote': route(quote),
  '/contact': route(contact),
  '/careers': route(careers),
  '/freight-terms-and-conditions': route(freightTerms),
  '/quote-terms-and-validity': route(quoteTerms),
  '/404': route(notFound),
};

/** "/about.html", "/about/" and "/about" all map to "/about". */
export function normalizePath(pathname: string): string {
  const path = pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1');
  return path || '/';
}
