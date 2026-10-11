/**
 * Company figures in the LODISNA big-numeral style. Every figure is derived from
 * the verified site data (founding year, depot list, service list); nothing is
 * a counter, total or estimate.
 */
import { company, locations, services } from '../data/site';
import './FactStrip.css';

const pad = (n: number) => String(n).padStart(2, '0');

const facts = [
  { value: String(company.founded), key: 'Established', note: `Founded as ${company.originalName}, still family-run` },
  { value: pad(locations.length), key: 'Depots', note: locations.map((l) => `${l.suburb} ${l.state}`).join(', ') },
  { value: pad(services.length), key: 'Core services', note: services.map((s) => s.shortTitle).join(', ') },
];

/** `inline`: no section padding or rule, for use inside another section (the homepage reveal). */
export default function FactStrip({ variant }: { variant?: 'inline' }) {
  return (
    <section className={variant ? `figures figures--${variant}` : 'figures'} aria-label="Company facts">
      <div className="container container--wide">
        <dl className="figures__list">
          {facts.map((fact) => (
            <div className="figures__item" key={fact.key}>
              <dt className="label figures__key">{fact.key}</dt>
              <dd className="figures__value">{fact.value}</dd>
              <dd className="figures__note">{fact.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
