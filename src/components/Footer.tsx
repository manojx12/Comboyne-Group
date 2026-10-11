/**
 * Site footer: identity, essential navigation, the three depots and a link to
 * the full department directory on the Contact page.
 */
import Logo from './Logo';
import Icon from './Icon';
import { company, locations, services, legalNav, telHref } from '../data/site';
import './Footer.css';

export default function Footer({ inert = false }: { inert?: boolean }) {
  return (
    <footer className="site-footer on-dark" inert={inert}>
      <div className="container container--wide">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <a className="site-footer__logo" href="/" aria-label={`${company.name}, home`}>
              <Logo size={56} badge eager={false} />
            </a>
            <p className="site-footer__statement">
              Commercial furniture transport, installation and warehousing. A family business since {company.founded}.
            </p>
            <p className="site-footer__phone">
              <a href={telHref(company.phone)}>{company.phone}</a>
            </p>
            <a className="btn btn--secondary btn--small" href={company.bookingUrl} target="_blank" rel="noopener">
              Book online <Icon name="arrow-up-right" size={16} />
              <span className="visually-hidden"> (existing customers, opens in a new tab)</span>
            </a>
          </div>

          <nav className="site-footer__col" aria-labelledby="footer-services">
            <h2 className="site-footer__heading" id="footer-services">Services</h2>
            <ul role="list">
              <li><a href="/services">All services</a></li>
              {services.map((s) => (
                <li key={s.slug}><a href={s.href}>{s.shortTitle}</a></li>
              ))}
            </ul>
          </nav>

          <nav className="site-footer__col" aria-labelledby="footer-company">
            <h2 className="site-footer__heading" id="footer-company">Company</h2>
            <ul role="list">
              <li><a href="/about">About</a></li>
              <li><a href="/locations">Locations</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/quote">Request a quote</a></li>
            </ul>
          </nav>

          <div className="site-footer__col site-footer__depots">
            <h2 className="site-footer__heading">Depots</h2>
            <ul role="list">
              {locations.map((loc) => (
                <li key={loc.id}>
                  <a className="site-footer__city" href={`/locations#${loc.id}`}>{loc.city}</a>
                  <address>
                    {loc.addressLines.map((line) => <span key={line}>{line}</span>)}
                  </address>
                </li>
              ))}
            </ul>
            <a className="site-footer__all" href="/contact">
              All department contacts
              <Icon name="arrow-right" size={15} />
            </a>
          </div>
        </div>

        {/* Sign-off: the opening word again, above the legal line. Decorative. */}
        <p className="site-footer__wordmark" aria-hidden="true">
          Comboyne
        </p>

        <div className="site-footer__bottom">
          {/* Build year and visit year can differ around New Year; not worth a hydration warning. */}
          <p suppressHydrationWarning>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <ul role="list" className="site-footer__legal">
            {legalNav.map((item) => (
              <li key={item.href}><a href={item.href}>{item.label}</a></li>
            ))}
          </ul>
          <p className="site-footer__note">
            Photographs captioned &ldquo;Illustrative image&rdquo; are Unsplash stock, credited beside each one, and do
            not show Comboyne Group work. The truck photograph is from Comboyne Group&apos;s previous website.
          </p>
        </div>
      </div>
    </footer>
  );
}
