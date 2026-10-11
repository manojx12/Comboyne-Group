/**
 * Locations: three depots in three columns on the paper tone, with a small
 * schematic beside the heading on wide screens. The schematic shows relative
 * north-south order only: not to scale, not a route map and not a coverage map,
 * and its caption says so.
 */
import Icon from '../Icon';
import { locations, telHref, mailHref, directionsHref } from '../../data/site';
import './DepotSchematic.css';

// Schematic stop positions (illustrative, roughly north to south / east to west).
const stops: Record<string, { x: number; y: number }> = {
  qld: { x: 150, y: 30 },
  nsw: { x: 132, y: 150 },
  vic: { x: 52, y: 228 },
};
const order = ['qld', 'nsw', 'vic'];
const path = order.map((id, i) => `${i ? 'L' : 'M'}${stops[id].x} ${stops[id].y}`).join(' ');

export default function DepotSchematic() {
  return (
    <section className="hubs section" aria-labelledby="depots-title">
      <div className="container container--wide">
        <div className="hubs__head">
          <div>
            <h2 id="depots-title" className="hubs__title">
              Where we work from.
            </h2>
            <p className="hubs__intro">Three depots, each with a direct contact. Please call ahead before visiting.</p>
          </div>

          <figure className="hubs__map">
            <svg viewBox="0 0 260 250" role="img" aria-labelledby="schematic-title">
              <title id="schematic-title">
                Schematic showing the order of the Brisbane, Sydney and Melbourne depots. Not to scale.
              </title>
              <path className="map__line" d={path} />
              {order.map((id) => {
                const loc = locations.find((l) => l.id === id)!;
                const { x, y } = stops[id];
                return (
                  <g key={id} className={`map__stop map__stop--${id}`}>
                    <rect x={x - 4} y={y - 4} width="8" height="8" />
                    <text x={x + 14} y={y + 4}>
                      {loc.city.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
            <figcaption>Schematic only. Not to scale, and not a route or coverage map.</figcaption>
          </figure>
        </div>

        <ul className="hubs__list" role="list">
          {locations.map((loc) => {
            const primary = loc.contacts[0];
            return (
              <li key={loc.id} className={`hub hub--${loc.id}`}>
                <h3 className="hub__city">{loc.city}</h3>
                <p className="hub__suburb">
                  {loc.suburb}, {loc.state}
                </p>
                <address className="hub__address">
                  {loc.addressLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
                <p className="hub__contact">
                  <span className="hub__dept">
                    {primary.department}: {primary.name}
                  </span>
                  <a href={telHref(primary.phone)}>{primary.phone}</a>
                  <a href={mailHref(primary.email)}>{primary.email}</a>
                </p>
                <p className="hub__links">
                  <a href={directionsHref(loc.address)} target="_blank" rel="noopener">
                    Get directions
                    <Icon name="arrow-up-right" size={14} />
                    <span className="visually-hidden">to {loc.suburb} on Google Maps (opens in a new tab)</span>
                  </a>
                  {loc.contacts.length > 1 && <a href={`/locations#${loc.id}`}>All {loc.state} contacts</a>}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
