import ServiceLayout from '../../components/ServiceLayout';
import Photo from '../../components/Photo';
import { locations } from '../../data/site';
import { photos } from '../../data/images';
import type { PageMeta } from '../../lib/meta';

export const meta: PageMeta = {
  title: 'Furniture Warehousing & Distribution in Sydney, Melbourne & Brisbane',
  description:
    'Commercial furniture storage, asset management, receiving, dispatch and container unloading from Comboyne Group warehouses in Sydney, Melbourne and Brisbane.',
};

export default function WarehousingPage() {
  return (
    <ServiceLayout
      slug="warehousing"
      title="Warehousing and distribution in Sydney, Melbourne and Brisbane."
      lead="Warehouse and storage facilities for receiving, storing and dispatching commercial furniture."
      ctaTitle="Need furniture stored, received or dispatched?"
    >
      <h2>Warehouse services</h2>
      <p>We have warehouse and storage facilities in Sydney, Melbourne and Brisbane. Our warehousing services include:</p>
      <ul>
        <li>
          <strong>Storage and asset management</strong>: commercial furniture stored and managed until it is needed.
        </li>
        <li>
          <strong>Receiving and delivery services</strong>: furniture received into the warehouse and delivered on.
        </li>
        <li>
          <strong>Receive and dispatch</strong>: inbound goods checked in and outbound orders dispatched.
        </li>
        <li>
          <strong>Unloading of containers</strong>: container unloading at the warehouse.
        </li>
      </ul>

      <Photo photo={photos.officeChairsOnShelving} ratio="16 / 9" className="figure" sizes="(min-width: 64em) 55vw, 100vw" />

      <h2>Distribution from our warehouses</h2>
      <p>
        Stored furniture can be dispatched and delivered using our{' '}
        <a href="/services/transport">commercial furniture transport</a> service, and installed on site by our{' '}
        <a href="/services/installation">installation team</a>, so stock held in the warehouse can go straight into a
        project when the site is ready.
      </p>

      <h2>Warehouse locations</h2>
      <ul>
        {locations.map((loc) => (
          <li key={loc.id}>
            <strong>
              {loc.city}: {loc.suburb}, {loc.state}
            </strong>
            : {loc.addressLines.join(', ')}
          </li>
        ))}
      </ul>
      <p>
        See <a href="/locations">locations</a> for depot contacts and directions.
      </p>
    </ServiceLayout>
  );
}
