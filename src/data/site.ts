/**
 * Central business content for the Comboyne Group website.
 *
 * Everything in this file is either verified against the previous website
 * (comboynegroup.com, reviewed October 2026) or supplied directly by the client.
 * Edit names, numbers and addresses here; components read from this file and
 * never hard-code business details.
 *
 * Do not add services, statistics, certifications, opening hours or client
 * names here until they have been confirmed by the business.
 */

export interface Contact {
  department: string;
  name: string;
  phone: string;
  email: string;
}

export interface Location {
  id: 'nsw' | 'vic' | 'qld';
  state: string;
  stateName: string;
  suburb: string;
  /** Metropolitan area the depot serves, as described on the previous website. */
  city: string;
  addressLines: string[];
  /** Full address used for display and the "Get directions" map search. */
  address: string;
  postalCode?: string;
  contacts: Contact[];
}

/** Converts an Australian mobile/landline in display form to an E.164 tel: href. */
export function telHref(display: string): string {
  const digits = display.replace(/\D/g, '');
  return `tel:+61${digits.startsWith('0') ? digits.slice(1) : digits}`;
}

export function mailHref(email: string): string {
  return `mailto:${email}`;
}

/** Google Maps search link for an address. A plain link, with no embedded map or pin. */
export function directionsHref(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export const company = {
  name: 'Comboyne Group',
  originalName: 'Comboyne Carriers',
  founded: 1989,
  founder: 'Geoff Schubert',
  description:
    'Transport, installation and warehousing for the commercial furniture industry, with depots in Sydney, Melbourne and Brisbane.',
  phone: '0429 651 255',
  address: '4 Airds Road, Minto, New South Wales 2566, Australia',
  /** Existing customer booking portal (CargoOffice). Kept separate from quote requests. */
  bookingUrl: 'https://comboyne.au1.cargooffice.com.au/',
  /**
   * Inbox used for the quote form's interim "send by email" fallback.
   * The production quote backend is not connected yet; see docs/INTEGRATIONS.md.
   */
  quoteEmail: 'orders@comboynegroup.com.au',
  careersEmail: 'matts@comboynegroup.com.au',
} as const;

export const locations: Location[] = [
  {
    id: 'nsw',
    state: 'NSW',
    stateName: 'New South Wales',
    suburb: 'Minto',
    city: 'Sydney',
    addressLines: ['4 Airds Road', 'Minto NSW 2566'],
    address: '4 Airds Road, Minto, New South Wales 2566, Australia',
    postalCode: '2566',
    contacts: [
      { department: 'General orders', name: 'Geoff', phone: '0408 543 136', email: 'orders@comboynegroup.com.au' },
      { department: 'Logistics', name: 'Josh', phone: '0437 779 317', email: 'joshs@comboynegroup.com.au' },
      { department: 'Operations', name: 'Matt', phone: '0429 651 255', email: 'matts@comboynegroup.com.au' },
      { department: 'Bookings', name: 'Paul', phone: '0459 890 633', email: 'paulc@comboynegroup.com.au' },
      { department: 'Accounts', name: 'Lynsey', phone: '0499 071 396', email: 'accounts@comboynegroup.com.au' },
    ],
  },
  {
    id: 'vic',
    state: 'VIC',
    stateName: 'Victoria',
    suburb: 'Campbellfield',
    city: 'Melbourne',
    addressLines: ['14B Randor Street', 'Campbellfield VIC'],
    address: '14B Randor Street, Campbellfield, Victoria',
    contacts: [
      { department: 'Victoria', name: 'Margaret', phone: '0429 515 491', email: 'margk@comboynegroup.com.au' },
    ],
  },
  {
    id: 'qld',
    state: 'QLD',
    stateName: 'Queensland',
    suburb: 'Eagle Farm',
    city: 'Brisbane',
    addressLines: ['Unit 3A/128 Links Avenue South', 'Eagle Farm QLD'],
    address: 'Unit 3A/128 Links Avenue South, Eagle Farm, Queensland',
    contacts: [
      { department: 'Queensland', name: 'Steve', phone: '0499 059 173', email: 'stevek@comboynegroup.com.au' },
    ],
  },
];

export type ServiceSlug = 'transport' | 'installation' | 'warehousing';

export interface Service {
  slug: ServiceSlug;
  number: string;
  title: string;
  /** Label used in the quote form and navigation. */
  shortTitle: string;
  href: string;
  summary: string;
  benefit: string;
  capabilities: string[];
}

/**
 * Service descriptions are limited to what the previous website states.
 * "Distribution" covers receiving, dispatch and delivery from the warehouses only.
 */
export const services: Service[] = [
  {
    slug: 'transport',
    number: '01',
    title: 'Commercial furniture transport',
    shortTitle: 'Transport',
    href: '/services/transport',
    summary:
      'Transport for office and commercial furniture that needs careful, professional handling. We are not a general freight carrier.',
    benefit: 'Moved by a team that specialises in commercial furniture.',
    capabilities: [
      'Specialised transport of commercial and office furniture',
      'Careful handling for complex freight movements',
      'A team selected for the skills furniture work requires',
      'Online booking for existing customers',
    ],
  },
  {
    slug: 'installation',
    number: '02',
    title: 'Furniture installation',
    shortTitle: 'Installation',
    href: '/services/installation',
    summary:
      'An experienced team trained to install systems and modular furniture, on small and large office fit-outs.',
    benefit: 'Installed by people trained in the furniture systems they work with.',
    capabilities: [
      'Commercial furniture placement and installation',
      'Systems and modular furniture installation',
      'Furniture reconfigurations',
      'Small and large office fit-outs',
    ],
  },
  {
    slug: 'warehousing',
    number: '03',
    title: 'Warehousing & distribution',
    shortTitle: 'Warehousing',
    href: '/services/warehousing',
    summary:
      'Warehouse and storage facilities in Sydney, Melbourne and Brisbane for receiving, storing and dispatching commercial furniture.',
    benefit: 'Storage and dispatch from depots in three states.',
    capabilities: [
      'Storage and asset management',
      'Receiving and delivery services',
      'Receive and dispatch',
      'Unloading of containers',
    ],
  },
];

export interface NavItem {
  label: string;
  href: string;
}

export const primaryNav: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Locations', href: '/locations' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

export const serviceNav: NavItem[] = [
  { label: 'All services', href: '/services' },
  ...services.map((s) => ({ label: s.shortTitle, href: s.href })),
];

export const legalNav: NavItem[] = [
  { label: 'Freight Terms & Conditions', href: '/freight-terms-and-conditions' },
  { label: 'Quote Terms & Validity', href: '/quote-terms-and-validity' },
];

/** Legal PDFs migrated from the previous website. Content is unchanged. */
export const documents = {
  freightTerms: {
    title: 'Terms and Conditions of Cartage',
    version: 'V3.1',
    href: '/documents/terms-and-conditions-of-cartage-v3-1.pdf',
    pages: 3,
  },
  quoteTerms: {
    title: 'Quote Terms and Validity',
    version: 'v1.0',
    href: '/documents/quote-terms-and-validity-v1-0.pdf',
    pages: 1,
  },
} as const;
