# Comboyne Group website

A static, multi-page website for Comboyne Group — commercial furniture transport,
installation and warehousing. Built with **React 19 + Vite 8 + TypeScript + plain CSS**.
Every route is pre-rendered to static HTML at build time (React server rendering), then
React hydrates it in the browser, so content, meta tags and structured data are in the
HTML without JavaScript. No animation library: the one scroll effect uses Canvas 2D.

## Design system: "The Art of Moving Workspaces", in LODISNA's language

The typography and composition follow lodisna.com (reference only: none of its logo, graphics, wording or imagery is used). Comboyne keeps its own logo, copy, photography and ink/paper/orange palette, with ink standing in for LODISNA's navy and orange for its red.


- **Palette** (`src/styles/tokens.css`): ink `#191A18`, warm white `#F5F3EE` (page), paper `#EAE7DF` (alternate surface), steel `#626761`, hairline `#D6D2C9`, orange `#E58A32` (primary actions and small route details only), rust `#984D1D` (accent text). Contrast ratios are noted in the token file.
- **Type:** one family, Archivo variable (SIL OFL, self-hosted via Fontsource, width axis 62–125%). LODISNA uses Tomato Grotesk, a commercial font that is not licensed here. Headings are sentence case, light (300) and normal width, as on the reference: H1 `--text-h1`, H2 `--text-h2`, H3 at weight 450. The wide uppercase style (width 125%, weight 150) is kept only for the COMBOYNE wordmark and the big thin figures. Labels: bold uppercase, width 112%. Full scale and rules: `docs/DESIGN-AUDIT.md` §4.
- **Geometry:** square crops and thin rules; actions are pills (LODISNA), fields keep a 2px radius; no shadows.
- **Openings:** inner pages open on the light page surface: breadcrumbs, the H1, a long ink rule, then label, lead and actions in three columns, with thin orange chevrons (`ChevronMark`, from the logo) at the right edge. No photographs in openings. The dark surface is reserved for the homepage opening, the closing call to action and the footer.
- **Homepage opening (`GlyphPortal`):** an ink field with the H1, the genuine Comboyne truck photograph as a framed plate (never scaled past its 800 px source), and the word COMBOYNE in thin wide Archivo. Scrolling zooms through the counter of its second O, which opens onto a light section with one statement and the company figures. Original implementation (React, Canvas 2D, CSS); the 21st.dev "Glyph Portal" source was not available, so none of its code is used. Without JavaScript, with reduced motion, or on screens too short to fit the content, the same content renders as a static stack. Keyboard focus jumps to the matching end of the zoom so focused links are never hidden. The header is ink only while the dark opening is under it.
- **Motif:** the route line (`.route` in `global.css`): a 1.5px line with a square start node and the logo's chevron as its terminal, ink on light and steel on dark, never orange. Used in the process flow and the closing block.
- **Accent discipline:** one orange action per viewport. The header quote button is ink (paper on dark); the opening button is the orange primary.
- **Photography:** one shared grade applied by `scripts/grade-images.mjs`; see `docs/IMAGE-GRADING.md`.
- **Motion:** the GlyphPortal zoom, inner-page title rise, route lines drawing in, small directional hovers. All disabled under `prefers-reduced-motion`.
- **Homepage components:** `src/components/GlyphPortal.tsx` and `src/components/home/` (ServicesIndex, typography-led with no photographs; ProcessFlow; AboutBand; DepotSchematic) plus the shared `FactStrip` figures (year, depot count and service count, all derived from `src/data/site.ts`) and `QuoteCTA` closing block.

## Requirements

- Node.js **20.19+ or 22.12+** (Vite 8 requirement; tested with Node 24.13)
- npm

## Commands

```bash
npm install          # install dependencies
npm run dev          # Vite dev server at http://localhost:5173 (pages render on the client)
npm run build        # images + type check + client build + server build + pre-render to ./dist
npm run preview      # serve ./dist like the static host (/about -> about.html, unknown -> 404)
npm run check        # TypeScript check
npm run verify       # build + post-build link/SEO/accessibility checks
npm run images       # regenerate responsive image variants (dev and build run this first)
node scripts/verify-build.mjs --external   # also request every external link
node scripts/serve-dist.mjs                # serve ./dist like the host: _headers (CSP), _redirects, 404 status, gzip (port 4400)
node scripts/generate-icons.mjs            # regenerate favicons + OG image from the logo
npm run grade:images                       # regrade photos from originals (see docs/IMAGE-GRADING.md)
```

## Project structure

```
index.html            ← HTML template (head and body placeholders filled by the pre-render)
vite.config.ts        ← React plugin, PUBLIC_* env names, SITE_URL, preview URL handling
src/
  main.tsx            ← client entry: hydrates pre-rendered pages (renders in dev)
  entry-server.tsx    ← build-time entry: renders a route + its head tags
  routes.ts           ← path → page component + meta
  App.tsx             ← layout + current page
  config.ts           ← SITE, ALLOW_INDEXING, QUOTE_ENDPOINT from env
  data/site.ts        ← ALL business content: company, depots, contacts, services, nav, documents
  data/images.ts      ← photo manifest: alt text, photographer credit, "illustrative" flag
  data/schema.ts      ← JSON-LD (Organization + LocalBusiness), verified facts only
  layouts/Layout.tsx  ← skip link, header, main, footer, reveal-on-scroll
  components/         ← Header, Footer, GlyphPortal, PageIntro, ServiceLayout, QuoteForm, … (each with its .css)
  pages/              ← one .tsx per route, exporting the component and its `meta`
  styles/tokens.css   ← colour, type, spacing, motion tokens
  styles/global.css   ← base styles, buttons, utilities
  assets/             ← logo and photographs (sources for the image script)
  generated/          ← image manifest written by scripts/build-images.mjs (not edited by hand)
public/
  documents/          ← legal PDFs migrated from the old site
  img/                ← generated AVIF/WebP/JPEG variants (not edited by hand)
  _redirects, _headers  ← Netlify / Cloudflare Pages config
docs/                 ← integrations, asset sources, content status
scripts/              ← image variants, pre-render, icon generator, photo grading, post-build verifier
legacy-assets/        ← files that were in this folder originally (not used)
```

To change a phone number, email, address or service description, edit
`src/data/site.ts` — every page reads from it.

## Pages

| Route | File |
|---|---|
| `/` | `src/pages/index.tsx` |
| `/about` | `src/pages/about.tsx` |
| `/services` | `src/pages/services/index.tsx` |
| `/services/transport` | `src/pages/services/transport.tsx` |
| `/services/installation` | `src/pages/services/installation.tsx` |
| `/services/warehousing` | `src/pages/services/warehousing.tsx` |
| `/locations` | `src/pages/locations.tsx` |
| `/quote` | `src/pages/quote.tsx` |
| `/contact` | `src/pages/contact.tsx` |
| `/careers` | `src/pages/careers.tsx` |
| `/freight-terms-and-conditions` | `src/pages/freight-terms-and-conditions.tsx` |
| `/quote-terms-and-validity` | `src/pages/quote-terms-and-validity.tsx` |
| `/404` | `src/pages/404.tsx` |
| `/robots.txt`, `/sitemap-index.xml` | generated by `scripts/prerender.mjs` |

Output files match the previous build: `/about` → `dist/about.html`, `/services/transport` → `dist/services/transport.html`. To add a page, create `src/pages/name.tsx` (component + `meta`) and add it to `src/routes.ts`.

## Environment variables

See `.env.example`. None are secrets.

| Variable | Default | Purpose |
|---|---|---|
| `SITE_URL` | `https://comboynegroup.com` | Canonical URLs, Open Graph, sitemap |
| `PUBLIC_ALLOW_INDEXING` | off | Must be `true` on the **production** build, otherwise pages are `noindex` and robots.txt disallows crawling |
| `PUBLIC_QUOTE_ENDPOINT` | empty | Quote form backend. Empty = preview mode (no submission). See `docs/INTEGRATIONS.md` |

## Deployment (static hosting)

The build output in `dist/` is plain static files and works on Cloudflare Pages,
Netlify or Vercel free tiers (check each provider's current terms).

- **Build command:** `npm run build` · **Output directory:** `dist` · **Node:** 22.12+
- Set `PUBLIC_ALLOW_INDEXING=true` only on the production environment.
- Security headers live in `public/_headers` (Netlify and Cloudflare Pages). The build writes the
  Content-Security-Policy into `dist/_headers`: it hashes the page's one inline script and adds the
  origin of `PUBLIC_QUOTE_ENDPOINT` to `connect-src` when that is set. Vercel ignores `_headers`; copy
  the headers from the built `dist/_headers` into a `headers` block in `vercel.json` if deploying there.
- `public/_redirects` maps old GoDaddy URLs (`/our-services`, `/contact-details`,
  `/history`, `/freight-terms-%26-condition`) to the new routes on Netlify and
  Cloudflare Pages. For **Vercel**, add a `vercel.json`:

  ```json
  {
    "redirects": [
      { "source": "/our-services", "destination": "/services", "permanent": true },
      { "source": "/contact-details", "destination": "/contact", "permanent": true },
      { "source": "/history", "destination": "/about", "permanent": true },
      { "source": "/freight-terms-&-condition", "destination": "/freight-terms-and-conditions", "permanent": true }
    ]
  }
  ```

**Do not change DNS or replace the live GoDaddy site without the business owner's
approval.** Deploy to a preview URL first and review it with them.

## Before launch — checklist

- [ ] Replace illustrative stock photos with genuine company photography (`docs/ASSET-SOURCES.md`)
- [ ] Supply a vector logo
- [ ] Resolve the open questions in `docs/CONTENT-STATUS.md` (hours, careers email, postcodes, service area)
- [ ] Build and test the quote backend, then set `PUBLIC_QUOTE_ENDPOINT` (`docs/INTEGRATIONS.md`)
- [ ] Approve and publish a privacy policy
- [ ] Set `PUBLIC_ALLOW_INDEXING=true` on production; confirm robots.txt and sitemap
- [ ] Run Lighthouse on the deployed preview. Local measurements of the production build (gzip, simulated
      mobile): performance 88 to 98, accessibility 100, best practices 100, SEO 100 with indexing on
