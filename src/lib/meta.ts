/** Per-page head data, rendered into static HTML by scripts/prerender.mjs. */
export interface PageMeta {
  /** Page title without the brand suffix. */
  title?: string;
  /** Overrides the composed "<title> | Comboyne Group" pattern. */
  fullTitle?: string;
  description: string;
  /** Path of the Open Graph image inside /public. */
  ogImage?: string;
  /** JSON-LD objects for the page head. */
  schema?: Record<string, unknown>[];
  /** Forces noindex for utility pages such as 404. */
  noindex?: boolean;
}

const BRAND = 'Comboyne Group';

/** "<title> | Comboyne Group", or the full title override. */
export function pageTitle(meta: PageMeta): string {
  return meta.fullTitle ?? (meta.title ? `${meta.title} | ${BRAND}` : BRAND);
}
