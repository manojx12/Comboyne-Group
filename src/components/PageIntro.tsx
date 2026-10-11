/**
 * Opening section for inner pages: breadcrumbs, one sentence-case H1, a long rule,
 * then the label and lead side by side and the page's actions. Light, like the rest
 * of the page, so the content starts within the first screen; the dark surface is
 * kept for the homepage opening, the closing call to action and the footer.
 * Also emits BreadcrumbList structured data that mirrors the visible breadcrumbs.
 */
import type { ReactNode } from 'react';
import ChevronMark from './ChevronMark';
import { SITE } from '../config';
import { jsonLd } from '../lib/jsonLd';
import './PageIntro.css';

interface Crumb {
  label: string;
  href: string;
}

interface Props {
  label: string;
  title: string;
  lead?: string;
  breadcrumbs: Crumb[];
  /** Buttons shown beside the lead. */
  actions?: ReactNode;
}

export default function PageIntro({ label, title, lead, breadcrumbs, actions }: Props) {
  const trail = [{ label: 'Home', href: '/' }, ...breadcrumbs];
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: new URL(crumb.href, SITE).href,
    })),
  };

  return (
    <section className="page-intro">
      <ChevronMark className="page-intro__mark" />
      <div className="container container--wide">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol role="list">
            {trail.map((crumb, i) => (
              <li key={crumb.href}>
                {i < trail.length - 1 ? <a href={crumb.href}>{crumb.label}</a> : <span aria-current="page">{crumb.label}</span>}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="page-intro__title">{title}</h1>

        <div className="page-intro__meta">
          <p className="label page-intro__label">{label}</p>
          {lead && <p className="lead page-intro__lead">{lead}</p>}
          {actions && <div className="page-intro__actions">{actions}</div>}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
    </section>
  );
}
