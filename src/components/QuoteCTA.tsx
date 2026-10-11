/**
 * Closing call to action. Sits directly above the footer on the same ink
 * surface, so the page makes one deliberate tonal change at its end.
 */
import Icon from './Icon';
import { company, telHref, type ServiceSlug } from '../data/site';
import './QuoteCTA.css';

interface Props {
  title?: string;
  text?: string;
  /** Pre-selects a service on the quote form. */
  service?: ServiceSlug;
}

export default function QuoteCTA({
  title = 'Planning a commercial furniture move?',
  text = 'Tell us what needs to be moved, stored or installed, and when. We will come back to you with a quote.',
  service,
}: Props) {
  const quoteHref = service ? `/quote?service=${service}` : '/quote';
  return (
    <section className="cta on-dark" aria-labelledby="cta-title">
      <div className="container container--wide cta__inner">
        <span className="route cta__route" aria-hidden="true" data-draw />
        <div className="cta__text" data-reveal>
          <h2 id="cta-title" className="cta__title">
            {title}
          </h2>
          <p className="cta__lead">{text}</p>
        </div>
        <div className="cta__side" data-reveal>
          <div className="cta__actions">
            <a className="btn btn--primary" href={quoteHref}>
              Request a quote
              <Icon name="arrow-right" />
            </a>
            <a className="btn btn--secondary" href="/contact">
              Contact the team
            </a>
          </div>
          <p className="cta__phone">
            Or call <a href={telHref(company.phone)}>{company.phone}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
