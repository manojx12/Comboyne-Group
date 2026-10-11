import PageIntro from '../components/PageIntro';
import DocumentPage from '../components/DocumentPage';
import { documents } from '../data/site';
import type { PageMeta } from '../lib/meta';

export const meta: PageMeta = {
  title: 'Quote Terms & Validity',
  description: 'Comboyne Group Quote Terms and Validity (PDF).',
};

const doc = documents.quoteTerms;

export default function QuoteTermsPage() {
  return (
    <>
      <PageIntro
        label="Legal"
        title="Quote Terms & Validity"
        lead="The terms that apply to quotes provided by Comboyne Group are published as a PDF."
        breadcrumbs={[{ label: 'Quote Terms & Validity', href: '/quote-terms-and-validity' }]}
      />
      <DocumentPage title={doc.title} version={doc.version} href={doc.href} pages={doc.pages}>
        <p>The PDF is the authoritative version of these terms.</p>
      </DocumentPage>
    </>
  );
}
