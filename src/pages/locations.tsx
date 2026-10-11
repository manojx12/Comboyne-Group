import PageIntro from '../components/PageIntro';
import LocationCard from '../components/LocationCard';
import QuoteCTA from '../components/QuoteCTA';
import Icon from '../components/Icon';
import { company, locations, telHref } from '../data/site';
import { localBusinessSchema } from '../data/schema';
import { SITE } from '../config';
import type { PageMeta } from '../lib/meta';
import './locations.css';

export const meta: PageMeta = {
  title: 'Locations: Sydney, Melbourne & Brisbane Depots',
  description:
    'Comboyne Group depots in Minto NSW (Sydney), Campbellfield VIC (Melbourne) and Eagle Farm QLD (Brisbane), with direct department contacts for each.',
  schema: locations.map((loc) => ({ '@context': 'https://schema.org', ...localBusinessSchema(loc, SITE) })),
};

export default function LocationsPage() {
  return (
    <>
      <PageIntro
        label="Locations"
        title="Depots in Sydney, Melbourne and Brisbane."
        lead="Each depot has a direct contact. Our warehouse and storage facilities operate from all three locations."
        breadcrumbs={[{ label: 'Locations', href: '/locations' }]}
      />

      <section className="section locations-body">
        <div className="container container--wide">
          <div className="depots">
            {locations.map((loc) => (
              <LocationCard key={loc.id} location={loc} headingLevel="h2" />
            ))}
          </div>

          <div className="notes">
            <div className="note">
              <Icon name="phone" size={20} />
              <p>
                <strong>Visiting a depot?</strong> Please call ahead on{' '}
                <a href={telHref(company.phone)}>{company.phone}</a> or the depot contact above.
              </p>
            </div>
            <div className="note">
              <Icon name="map-pin" size={20} />
              <p>
                <strong>Jobs outside these areas?</strong> Include your pickup and delivery locations in a{' '}
                <a href="/quote">quote request</a> and we will confirm what we can do.
              </p>
            </div>
          </div>
        </div>
      </section>

      <QuoteCTA />
    </>
  );
}
