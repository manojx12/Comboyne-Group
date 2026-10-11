import PageIntro from '../components/PageIntro';
import Icon from '../components/Icon';
import { company, mailHref } from '../data/site';
import type { PageMeta } from '../lib/meta';
import './careers.css';

export const meta: PageMeta = {
  title: 'Careers',
  description:
    'Employment opportunities at Comboyne Group, a family-run commercial furniture transport, installation and warehousing business.',
};

export default function CareersPage() {
  return (
    <>
      <PageIntro
        label="Careers"
        title="Employment opportunities."
        lead={`${company.name} is a family business working in commercial furniture transport, installation and warehousing.`}
        breadcrumbs={[{ label: 'Careers', href: '/careers' }]}
      />
      <section className="section">
        <div className="container container--wide careers">
          <div className="careers__status">
            <p className="label careers__label">Positions available</p>
            <h2 className="careers__title">There are no advertised positions at the moment.</h2>
            <p className="lead muted">You are welcome to send your résumé for future opportunities.</p>
            <a className="btn btn--primary" href={`${mailHref(company.careersEmail)}?subject=${encodeURIComponent('Résumé for Comboyne Group')}`}>
              <Icon name="mail" />
              Email your résumé
            </a>
            <p className="muted careers__email">
              Send to <a href={mailHref(company.careersEmail)}>{company.careersEmail}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
