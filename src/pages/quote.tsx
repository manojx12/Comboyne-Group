import PageIntro from '../components/PageIntro';
import QuoteForm from '../components/QuoteForm';
import Icon from '../components/Icon';
import { company, locations, telHref, mailHref } from '../data/site';
import type { PageMeta } from '../lib/meta';
import './quote.css';

export const meta: PageMeta = {
  title: 'Request a Quote',
  description:
    'Request a quote for commercial furniture transport, installation or warehousing from Comboyne Group. Depots in Sydney, Melbourne and Brisbane.',
};

const nsw = locations[0].contacts;
const direct = ['General orders', 'Bookings'].map((d) => nsw.find((c) => c.department === d)!);

const checklist = [
  'Pickup and delivery suburbs or addresses',
  'What needs to move: furniture types and rough quantities',
  'Whether you need installation or storage as well',
  'Your preferred timeframe or date',
  'Site access: loading docks, lifts, stairs, parking',
  'Floor plans or furniture schedules, if you have them',
];

export default function QuotePage() {
  return (
    <>
      <PageIntro
        label="Request a quote"
        title="Tell us about the job."
        lead="Share the details below and we will use them to prepare a quote. The more we know about the furniture, the sites and the timing, the more accurate it can be."
        breadcrumbs={[{ label: 'Request a quote', href: '/quote' }]}
      />

      <section className="section">
        <div className="container container--wide quote-layout">
          <aside className="quote-aside" aria-label="Quote information">
            <div className="quote-aside__block">
              <h2 className="label quote-aside__title">Helpful to have ready</h2>
              <ul className="checklist" role="list">
                {checklist.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="quote-aside__block">
              <h2 className="label quote-aside__title">Prefer to talk?</h2>
              <ul className="direct" role="list">
                {direct.map((c) => (
                  <li key={c.department}>
                    <span className="direct__dept">{c.department}</span>
                    <span>{c.name}</span>
                    <a href={telHref(c.phone)}>{c.phone}</a>
                    <a href={mailHref(c.email)}>{c.email}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="quote-aside__block quote-aside__existing">
              <h2 className="label quote-aside__title">Existing customer?</h2>
              <p>Book consignments through the online booking portal instead.</p>
              <a className="link-arrow" href={company.bookingUrl} target="_blank" rel="noopener">
                Book online
                <Icon name="arrow-up-right" size={16} />
                <span className="visually-hidden">(opens in a new tab)</span>
              </a>
            </div>
          </aside>

          <div className="quote-main">
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
