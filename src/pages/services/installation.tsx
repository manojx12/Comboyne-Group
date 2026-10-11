import ServiceLayout from '../../components/ServiceLayout';
import Photo from '../../components/Photo';
import { photos } from '../../data/images';
import type { PageMeta } from '../../lib/meta';

export const meta: PageMeta = {
  title: 'Commercial Furniture Installation',
  description:
    'Commercial furniture placement, installation and reconfiguration by an experienced team trained in systems and modular furniture. Small and large office fit-outs.',
};

export default function InstallationPage() {
  return (
    <ServiceLayout
      slug="installation"
      title="Commercial furniture installation for small and large fit-outs."
      lead="An experienced team trained to install systems and modular furniture."
      ctaTitle="Planning an office fit-out or reconfiguration?"
    >
      <h2>What our installation team does</h2>
      <p>
        Our team is trained to install a range of systems and modular furniture, and works on both small and large
        office fit-outs.
      </p>
      <ul>
        <li>
          <strong>Placement and installation</strong>: commercial furniture positioned and installed on site.
        </li>
        <li>
          <strong>Systems and modular furniture</strong>: installation by people trained in the systems being installed.
        </li>
        <li>
          <strong>Reconfigurations</strong>: existing furniture re-arranged or re-configured to suit a changing workplace.
        </li>
      </ul>

      <Photo photo={photos.officeDeskRows} ratio="16 / 9" className="figure" sizes="(min-width: 64em) 55vw, 100vw" />

      <h2>One team from delivery to installation</h2>
      <p>
        Because we also provide <a href="/services/transport">commercial furniture transport</a> and{' '}
        <a href="/services/warehousing">warehousing</a>, furniture can be collected, stored if needed, delivered and
        installed without being handed between unrelated providers.
      </p>

      <h2>Telling us about your fit-out</h2>
      <p>
        The more we know up front, the easier it is to plan. When you request a quote, include the type and quantity of
        furniture, the site address, access details such as loading docks, lifts and stairs, any working-hours
        restrictions, and furniture plans or schedules if you have them.
      </p>
    </ServiceLayout>
  );
}
