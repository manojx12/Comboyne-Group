import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Logo from './Logo';
import Icon from './Icon';
import { company, primaryNav, serviceNav, services, telHref } from '../data/site';
import { cx } from '../lib/cx';
import './Header.css';

interface Props {
  /** Current route, e.g. "/services/transport". */
  path: string;
  menuOpen: boolean;
  onMenuChange: (open: boolean) => void;
}

export default function Header({ path, menuOpen, onMenuChange }: Props) {
  const current = (href: string) => (path === href ? ('page' as const) : undefined);
  const inServices = path === '/services' || path.startsWith('/services/');

  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const disclosureRef = useRef<HTMLLIElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  // Undefined until measured: the :has() rule in Header.css picks the right look before hydration.
  const [theme, setTheme] = useState<'dark' | 'light'>();

  // Theme follows the dark page opening: dark while any [data-hero-end] marker is still below the
  // header bar. Markers hidden with display: none never intersect (GlyphPortal has one per layout).
  useEffect(() => {
    const header = headerRef.current;
    const markers = document.querySelectorAll('[data-hero-end]');
    if (!header || !markers.length || !('IntersectionObserver' in window)) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
        setTheme(visible.size ? 'dark' : 'light');
      },
      { rootMargin: `-${header.offsetHeight}px 0px 0px 0px` },
    );
    markers.forEach((marker) => observer.observe(marker));
    return () => observer.disconnect();
  }, []);

  // Services disclosure closes on outside clicks.
  useEffect(() => {
    if (!servicesOpen) return;
    const onClick = (event: MouseEvent) => {
      if (!disclosureRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [servicesOpen]);

  // Mobile menu: lock page scroll and move focus into the panel when it opens.
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', menuOpen);
    if (menuOpen) menuRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
  }, [menuOpen]);

  // Close the panel if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 68em)');
    const onChange = (event: MediaQueryListEvent) => event.matches && onMenuChange(false);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [onMenuChange]);

  const closeMenu = () => {
    onMenuChange(false);
    toggleRef.current?.focus();
  };

  // Escape closes the menu; Tab and Shift+Tab stay inside the toggle and the panel.
  const onHeaderKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!menuOpen) return;
    if (event.key === 'Escape') return closeMenu();
    if (event.key !== 'Tab' || !toggleRef.current || !menuRef.current) return;
    const items = [toggleRef.current, ...menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <header
      ref={headerRef}
      className={cx('site-header', menuOpen && 'is-menu-open')}
      data-site-header
      data-theme={theme}
      onKeyDown={onHeaderKeyDown}
    >
      <div className="container container--wide site-header__inner">
        <a className="brand" href="/" aria-label={`${company.name}, home`}>
          <Logo size={40} badge />
          <span className="brand__text" aria-hidden="true">
            <span className="brand__name">Comboyne Group</span>
            <span className="label brand__meta">Est. {company.founded}</span>
          </span>
        </a>

        <nav className="nav-desktop" aria-label="Main">
          <ul className="nav-desktop__list" role="list">
            <li
              ref={disclosureRef}
              className="nav-desktop__item nav-desktop__item--has-menu"
              onKeyDown={(event) => {
                if (event.key === 'Escape' && servicesOpen) {
                  setServicesOpen(false);
                  servicesButtonRef.current?.focus();
                }
              }}
              onBlur={(event) => {
                const next = event.relatedTarget as Node | null;
                if (next && !event.currentTarget.contains(next)) setServicesOpen(false);
              }}
            >
              <button
                ref={servicesButtonRef}
                className="nav-link nav-link--toggle"
                type="button"
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
                data-active={inServices ? '' : undefined}
                onClick={() => setServicesOpen((open) => !open)}
              >
                Services
                <Icon name="chevron-down" size={16} className="nav-link__chevron" />
              </button>
              <div className="services-menu" id="services-menu" hidden={!servicesOpen}>
                <ul role="list">
                  <li>
                    <a className="services-menu__link" href="/services" aria-current={current('/services')}>
                      <span className="label services-menu__num">00</span>
                      <span>
                        <span className="services-menu__title">All services</span>
                        <span className="services-menu__desc">Overview of what we do</span>
                      </span>
                    </a>
                  </li>
                  {services.map((s) => (
                    <li key={s.slug}>
                      <a className="services-menu__link" href={s.href} aria-current={current(s.href)}>
                        <span className="label services-menu__num">{s.number}</span>
                        <span>
                          <span className="services-menu__title">{s.shortTitle}</span>
                          <span className="services-menu__desc">{s.title}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            {primaryNav.map((item) => (
              <li className="nav-desktop__item" key={item.href}>
                <a className="nav-link" href={item.href} aria-current={current(item.href)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <a className="book-link" href={company.bookingUrl} target="_blank" rel="noopener">
            Book online
            <Icon name="arrow-up-right" size={16} />
            <span className="visually-hidden">(existing customers, opens in a new tab)</span>
          </a>
          <a className="btn btn--ink btn--small site-header__quote" href="/quote">
            <span className="quote-label-long">Request a quote</span>
            {/* Only one label is displayed at a time (CSS), so the visible text is always the accessible name. */}
            <span className="quote-label-short">Quote</span>
          </a>
          <button
            ref={toggleRef}
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => onMenuChange(!menuOpen)}
          >
            <Icon name="menu" size={22} className="menu-toggle__open" />
            <Icon name="close" size={22} className="menu-toggle__close" />
            <span className="menu-toggle__text">Menu</span>
          </button>
        </div>
      </div>

      <div ref={menuRef} className="mobile-menu" id="mobile-menu" hidden={!menuOpen}>
        <nav className="container mobile-menu__inner" aria-label="Main (mobile)">
          <p className="label mobile-menu__heading">Services</p>
          <ul className="mobile-menu__list" role="list">
            {serviceNav.map((item) => (
              <li key={item.href}>
                <a className="mobile-menu__link" href={item.href} aria-current={current(item.href)}>
                  {item.label}
                  <Icon name="arrow-right" size={18} />
                </a>
              </li>
            ))}
          </ul>
          <p className="label mobile-menu__heading">Company</p>
          <ul className="mobile-menu__list" role="list">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <a className="mobile-menu__link" href={item.href} aria-current={current(item.href)}>
                  {item.label}
                  <Icon name="arrow-right" size={18} />
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-menu__actions">
            <a className="btn btn--primary" href="/quote">
              Request a quote
              <Icon name="arrow-right" />
            </a>
            <a className="btn btn--secondary" href={company.bookingUrl} target="_blank" rel="noopener">
              Book online (existing customers)
              <Icon name="arrow-up-right" />
              <span className="visually-hidden">(opens in a new tab)</span>
            </a>
            <a className="mobile-menu__phone" href={telHref(company.phone)}>
              <Icon name="phone" size={18} />
              {company.phone}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
