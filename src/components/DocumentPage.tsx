/**
 * Page wrapper for legal PDFs migrated unchanged from the previous website.
 * The PDF is the authoritative document; no legal wording is reproduced or rewritten here.
 */
import type { ReactNode } from 'react';
import Icon from './Icon';
import { company, mailHref } from '../data/site';
import './DocumentPage.css';

interface Props {
  title: string;
  version: string;
  href: string;
  pages: number;
  children?: ReactNode;
}

export default function DocumentPage({ title, version, href, pages, children }: Props) {
  return (
    <section className="section">
      <div className="container container--wide doc">
        <div className="doc__card">
          <Icon name="file-text" size={40} className="doc__icon" />
          <div className="doc__meta">
            <p className="label muted">
              PDF, {pages} {pages === 1 ? 'page' : 'pages'}, version {version}
            </p>
            <h2 className="doc__title">{title}</h2>
          </div>
          <div className="doc__actions">
            <a className="btn btn--primary" href={href} target="_blank" rel="noopener">
              Open PDF
              <Icon name="arrow-up-right" />
              <span className="visually-hidden">(opens in a new tab)</span>
            </a>
            <a className="btn btn--secondary" href={href} download>
              <Icon name="download" />
              Download
            </a>
          </div>
        </div>
        <div className="doc__note prose">
          {children}
          <p className="muted">
            Questions about this document? Email <a href={mailHref(company.quoteEmail)}>{company.quoteEmail}</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
