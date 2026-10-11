/**
 * Shared structure for the individual service pages:
 * intro, then an "at a glance" docket beside page-specific prose, related services and the quote CTA.
 */
import type { ReactNode } from 'react';
import PageIntro from './PageIntro';
import RelatedServices from './RelatedServices';
import QuoteCTA from './QuoteCTA';
import Icon from './Icon';
import { company, services, type ServiceSlug } from '../data/site';
import './ServiceLayout.css';

interface Props {
  slug: ServiceSlug;
  title: string;
  lead: string;
  ctaTitle?: string;
  children: ReactNode;
}

export default function ServiceLayout({ slug, title, lead, ctaTitle, children }: Props) {
  const service = services.find((s) => s.slug === slug)!;
  return (
    <>
      <PageIntro
        label={`${service.shortTitle} services`}
        title={title}
        lead={lead}
        breadcrumbs={[
          { label: 'Services', href: '/services' },
          { label: service.shortTitle, href: service.href },
        ]}
        actions={
          <>
            <a className="btn btn--primary" href={`/quote?service=${slug}`}>
              Request a quote
              <Icon name="arrow-right" />
            </a>
            <a className="btn btn--secondary" href={company.bookingUrl} target="_blank" rel="noopener">
              Book online
              <Icon name="arrow-up-right" />
              <span className="visually-hidden">(existing customers, opens in a new tab)</span>
            </a>
          </>
        }
      />

      <section className="section">
        <div className="container container--wide service-body">
          <aside className="service-body__aside" aria-labelledby="glance-title">
            <div className="glance">
              <h2 className="label glance__title" id="glance-title">
                At a glance
              </h2>
              <p className="glance__name">{service.title}</p>
              <ul className="glance__list" role="list">
                {service.capabilities.map((cap, i) => (
                  <li key={cap}>
                    <span className="label">{String(i + 1).padStart(2, '0')}</span>
                    {cap}
                  </li>
                ))}
              </ul>
              <p className="glance__benefit">{service.benefit}</p>
              <a className="btn btn--secondary glance__cta" href={`/quote?service=${slug}`}>
                Request a quote
                <Icon name="arrow-right" />
              </a>
            </div>
          </aside>
          <div className="service-body__content prose">{children}</div>
        </div>
      </section>

      <RelatedServices current={slug} />
      <QuoteCTA service={slug} title={ctaTitle} />
    </>
  );
}
