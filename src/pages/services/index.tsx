import { Fragment } from 'react';
import PageIntro from '../../components/PageIntro';
import SectionHeader from '../../components/SectionHeader';
import QuoteCTA from '../../components/QuoteCTA';
import Icon from '../../components/Icon';
import { services } from '../../data/site';
import type { PageMeta } from '../../lib/meta';
import './index.css';

export const meta: PageMeta = {
  title: 'Services',
  description:
    'Commercial furniture transport, installation, and warehousing and distribution from Comboyne Group, specialists in commercial furniture since 1989.',
};

const combinations = [
  { title: 'Deliver and install', steps: ['Transport', 'Installation'], text: 'Furniture collected, delivered to site and installed by the same business.' },
  { title: 'Store, then deliver', steps: ['Warehousing', 'Transport'], text: 'Furniture received and stored until the site is ready, then dispatched and delivered.' },
  {
    title: 'Receive, store, deliver and install',
    steps: ['Warehousing', 'Transport', 'Installation'],
    text: 'Containers unloaded, stock held, then delivered and installed when the project calls for it.',
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        label="Services"
        title="Transport, installation and warehousing for commercial furniture."
        lead="Use one service on its own or combine them across a project. All three are for commercial furniture."
        breadcrumbs={[{ label: 'Services', href: '/services' }]}
      />

      <section className="section" aria-labelledby="overview-title">
        <div className="container container--wide">
          <SectionHeader id="overview-title" title="What each service covers." />
          <ol className="cards" role="list">
            {services.map((s) => (
              <li className="card" data-reveal key={s.slug}>
                <p className="label card__num">{s.number}</p>
                <h3 className="card__title">
                  <a href={s.href}>{s.title}</a>
                </h3>
                <p className="card__summary muted">{s.summary}</p>
                <ul className="card__caps" role="list">
                  {s.capabilities.map((cap) => (
                    <li key={cap}>{cap}</li>
                  ))}
                </ul>
                <span className="link-arrow card__more" aria-hidden="true">
                  Learn more
                  <Icon name="arrow-right" size={16} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section combos" aria-labelledby="combos-title">
        <div className="container container--wide">
          <SectionHeader
            id="combos-title"
            title="Many projects use more than one."
            intro="Because all three services sit with one business, they can be combined across a project. Some common combinations:"
          />
          <ul className="combos__list" role="list">
            {combinations.map((c) => (
              <li className="combo" data-reveal key={c.title}>
                <p className="combo__steps label">
                  {c.steps.map((step, i) => (
                    <Fragment key={step}>
                      {i > 0 && <Icon name="arrow-right" size={14} />}
                      <span>{step}</span>
                    </Fragment>
                  ))}
                </p>
                <h3 className="combo__title">{c.title}</h3>
                <p className="muted">{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <QuoteCTA />
    </>
  );
}
