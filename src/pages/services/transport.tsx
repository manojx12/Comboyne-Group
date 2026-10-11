import ServiceLayout from '../../components/ServiceLayout';
import Photo from '../../components/Photo';
import { company, locations } from '../../data/site';
import { photos } from '../../data/images';
import type { PageMeta } from '../../lib/meta';

export const meta: PageMeta = {
  title: 'Commercial Furniture Transport',
  description:
    'Specialised commercial and office furniture transport from Comboyne Group, furniture specialists since 1989, not a general freight carrier. Depots in Sydney, Melbourne and Brisbane.',
};

const depots = locations.map((l) => `${l.suburb} (${l.state})`).join(', ').replace(/, ([^,]*)$/, ' and $1');

export default function TransportPage() {
  return (
    <ServiceLayout
      slug="transport"
      title="Commercial furniture transport, not general freight."
      lead="Transport for office and commercial furniture that needs careful, professional handling."
      ctaTitle="Have furniture that needs to move?"
    >
      <h2>Transport built around furniture</h2>
      <p>
        {company.name} moves commercial furniture for clients who need it handled with care. We are not a general
        freight carrier. Commercial furniture is the work we do, and our transport service is set up around it.
      </p>
      <p>
        The business began in {company.founded} moving office chairs, partition screens and whiteboards for clients who
        needed them handled expertly. Today that same focus extends across commercial and office furniture, including
        the systems and modular furniture our installation team works with.
      </p>

      <h2>Why it matters for complex moves</h2>
      <p>
        Complex moves need careful management, and that starts with the right team: people with the skills commercial
        furniture work requires.
      </p>

      <Photo photo={photos.ivecoTruck} ratio="5 / 3" className="figure" sizes="(min-width: 64em) 40rem, 100vw" widths={[480, 800]} caption={false} />

      <h2>Connected to installation and warehousing</h2>
      <p>
        Transport can be booked on its own or combined with our other services. Furniture can be delivered straight to
        site for <a href="/services/installation">installation</a>, or received into one of our{' '}
        <a href="/services/warehousing">warehouses</a> and dispatched when the site is ready.
      </p>

      <h2>Where we operate from</h2>
      <p>
        Our depots are in {depots}. Tell us your pickup and delivery locations when you request a quote and we will
        confirm what we can do for your job.
      </p>

      <h2>Existing customers</h2>
      <p>
        If you already have an account with us, book consignments through the{' '}
        <a href={company.bookingUrl} target="_blank" rel="noopener">
          online booking portal<span className="visually-hidden"> (opens in a new tab)</span>
        </a>
        . New enquiries should use the <a href="/quote?service=transport">quote request form</a>.
      </p>
    </ServiceLayout>
  );
}
