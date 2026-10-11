/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical origin, set from SITE_URL in vite.config.ts. */
  readonly PUBLIC_SITE_URL: string;
  /** Quote form endpoint. Unset = preview (mailto) mode; see docs/INTEGRATIONS.md. */
  readonly PUBLIC_QUOTE_ENDPOINT?: string;
  /** "true" on the production build only; every other build is noindex. */
  readonly PUBLIC_ALLOW_INDEXING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
