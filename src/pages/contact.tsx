import PageIntro from '../components/PageIntro';
import SectionHeader from '../components/SectionHeader';
import ContactDirectory from '../components/ContactDirectory';
import Icon from '../components/Icon';
import { company, locations, telHref, mailHref } from '../data/site';
import { organizationSchema } from '../data/schema';
import { SITE } from '../config';
import type { PageMeta } from '../lib/meta';
import './contact.css';

export const meta: PageMeta = {
  title: 'Contact Us',
  description:
    'Contact Comboyne Group: department contacts for orders, logistics, operations, bookings and accounts, plus our Sydney, Melbourne and Brisbane depots.',
  schema: [organizationSchema(SITE)],
};

const nsw = locations[0].contacts;
const find = (dept: string) => nsw.find((c) => c.department === dept)!;
const bookings = find('Bookings');
const accounts = find('Accounts');

const routes = [
  { label: 'New enquiry or quote', text: 'Tell us about the job and we will come back to you with a quote.', href: '/quote', cta: 'Request a quote', external: false },
  {
    label: 'Existing customer booking',
    text: `Book through the online portal, or call ${bookings.name} on ${bookings.phone}.`,
    href: company.bookingUrl,
    cta: 'Book online',
    external: true,
  },
  { label: 'Accounts', text: `Invoices and account questions go to ${accounts.name}.`, href: mailHref(accounts.email), cta: accounts.email, external: false },
];

export default function ContactPage() {
  return (
    <>
      <PageIntro
        label="Contact"
        title="Talk to the right person."
        lead="Orders, logistics, operations, bookings and accounts each have a direct contact, as do our Victorian and Queensland depots."
        breadcrumbs={[{ label: 'Contact', href: '/contact' }]}
        actions={
          <>
            <a className="btn btn--primary" href="/quote">
              Request a quote <Icon name="arrow-right" />
            </a>
            <a className="btn btn--secondary" href={telHref(company.phone)}>
              <Icon name="phone" /> {company.phone}
            </a>
          </>
        }
      />

      <section className="section--tight routes-wrap" aria-label="Quick contact routes">
        <div className="container container--wide">
          <ul className="channels" role="list">
            {routes.map((r, i) => (
              <li className="channel" key={r.label}>
                <p className="label channel__num">{String(i + 1).padStart(2, '0')}</p>
                <h2 className="channel__title">{r.label}</h2>
                <p className="muted">{r.text}</p>
                <a className="link-arrow channel__link" href={r.href} {...(r.external ? { target: '_blank', rel: 'noopener' } : {})}>
                  {r.cta}
                  <Icon name={r.external ? 'arrow-up-right' : 'arrow-right'} size={16} />
                  {r.external && <span className="visually-hidden">(opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="directory-title">
        <div className="container container--wide">
          <SectionHeader id="directory-title" title="Department contacts." />
          <div className="directory-wrap">
            <ContactDirectory />
          </div>
        </div>
      </section>

      {/* Addresses live on the Locations page (and in the footer); one pointer instead of a third copy. */}
      <section className="section--tight addresses" aria-label="Depot addresses">
        <div className="container container--wide addresses__inner">
          <p className="addresses__text">
            Depot addresses, directions and per-depot contacts are on the Locations page. Please call ahead before
            visiting a depot.
          </p>
          <a className="link-arrow" href="/locations">
            Depots in {locations.map((l) => l.city).join(', ').replace(/, ([^,]*)$/, ' and $1')}
            <Icon name="arrow-right" size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
