import Icon from '../components/Icon';
import { serviceNav } from '../data/site';
import type { PageMeta } from '../lib/meta';
import './404.css';

export const meta: PageMeta = {
  title: 'Page not found',
  description: 'The page you were looking for could not be found.',
  noindex: true,
};

const links = [
  { label: 'Home', href: '/' },
  ...serviceNav,
  { label: 'Locations', href: '/locations' },
  { label: 'Contact', href: '/contact' },
  { label: 'Request a quote', href: '/quote' },
];

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container container--wide notfound">
        <p className="label notfound__code">Error 404</p>
        <h1>We couldn&apos;t find that page.</h1>
        <p className="lead muted">The page may have moved when our website was updated. Try one of these instead:</p>
        <ul className="notfound__links" role="list">
          {links.map((l) => (
            <li key={l.href}>
              <a className="link-arrow" href={l.href}>
                {l.label}
                <Icon name="arrow-right" size={16} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
