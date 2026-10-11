/** Canonical origin for canonical URLs, Open Graph, JSON-LD and the sitemap (SITE_URL at build time). */
export const SITE = new URL(import.meta.env.PUBLIC_SITE_URL || 'https://comboynegroup.com');

/** Indexing is opt-in so preview deployments never compete with the live site. */
export const ALLOW_INDEXING = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true';

/** Quote form endpoint. Empty = preview mode (prepared email, nothing transmitted). */
export const QUOTE_ENDPOINT = import.meta.env.PUBLIC_QUOTE_ENDPOINT ?? '';
