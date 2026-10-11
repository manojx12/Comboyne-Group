/**
 * JSON-LD builders. Only verified facts are included: no opening hours,
 * coordinates, ratings or service areas until the business confirms them.
 */
import { company, locations, type Location } from './site';

const e164 = (display: string) => {
  const digits = display.replace(/\D/g, '').replace(/^0/, '');
  return `+61 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};

export function localBusinessSchema(location: Location, site: URL) {
  return {
    '@type': 'LocalBusiness',
    '@id': new URL(`/locations#${location.id}`, site).href,
    name: `${company.name}, ${location.suburb}, ${location.state}`,
    telephone: e164(location.contacts[0].phone),
    email: location.contacts[0].email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.addressLines[0],
      addressLocality: location.suburb,
      addressRegion: location.state,
      ...(location.postalCode ? { postalCode: location.postalCode } : {}),
      addressCountry: 'AU',
    },
    parentOrganization: { '@id': new URL('/#organization', site).href },
  };
}

export function organizationSchema(site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': new URL('/#organization', site).href,
    name: company.name,
    alternateName: company.originalName,
    url: site.href,
    logo: new URL('/favicon-192.png', site).href,
    description: company.description,
    telephone: e164(company.phone),
    foundingDate: String(company.founded),
    founder: { '@type': 'Person', name: company.founder },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4 Airds Road',
      addressLocality: 'Minto',
      addressRegion: 'NSW',
      postalCode: '2566',
      addressCountry: 'AU',
    },
    department: locations.map((loc) => localBusinessSchema(loc, site)),
  };
}
