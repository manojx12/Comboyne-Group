import PageIntro from '../components/PageIntro';
import DocumentPage from '../components/DocumentPage';
import { documents } from '../data/site';
import type { PageMeta } from '../lib/meta';

export const meta: PageMeta = {
  title: 'Freight Terms & Conditions',
  description: 'Comboyne Group Terms and Conditions of Cartage (PDF).',
};

const doc = documents.freightTerms;

export default function FreightTermsPage() {
  return (
    <>
      <PageIntro
        label="Legal"
        title="Freight Terms & Conditions"
        lead={"Comboyne Group\u0027s Terms and Conditions of Cartage are published as a PDF."}
        breadcrumbs={[{ label: 'Freight Terms & Conditions', href: '/freight-terms-and-conditions' }]}
      />
      <DocumentPage title={doc.title} version={doc.version} href={doc.href} pages={doc.pages}>
        <p>The PDF is the authoritative version of these terms.</p>
      </DocumentPage>
    </>
  );
}
