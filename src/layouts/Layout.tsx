/**
 * Page shell shared by every route: skip link, header, main, footer.
 * The document head is written per page by the pre-render step (src/entry-server.tsx).
 */
import { useEffect, useState, type ReactNode } from 'react';
import '@fontsource-variable/archivo/wdth.css';
import '../styles/tokens.css';
import '../styles/global.css';
import './BaseLayout.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Layout({ path, children }: { path: string; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Reveal-on-scroll: content is visible by default; this only adds a gentle fade
  // when JavaScript runs and the visitor has not asked for reduced motion.
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-draw]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header path={path} menuOpen={menuOpen} onMenuChange={setMenuOpen} />
      <main id="main" tabIndex={-1} inert={menuOpen}>
        {children}
      </main>
      <Footer inert={menuOpen} />
    </>
  );
}
