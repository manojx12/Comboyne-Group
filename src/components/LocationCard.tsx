import Icon from './Icon';
import { directionsHref, mailHref, telHref, type Location } from '../data/site';
import './LocationCard.css';

interface Props {
  location: Location;
  /** Show every department contact (true) or only the first, primary contact (false). */
  allContacts?: boolean;
  headingLevel?: 'h2' | 'h3';
}

export default function LocationCard({ location, allContacts = true, headingLevel: Heading = 'h3' }: Props) {
  const contacts = allContacts ? location.contacts : location.contacts.slice(0, 1);
  const headingId = `depot-${location.id}`;
  return (
    <article className="depot" aria-labelledby={headingId} id={location.id}>
      <header className="depot__head">
        <span className="depot__state" aria-hidden="true">
          {location.state}
        </span>
        <div>
          <Heading className="depot__title" id={headingId}>
            {location.suburb}, {location.state}
          </Heading>
          <p className="label depot__city">
            {location.city} · {location.stateName}
          </p>
        </div>
      </header>

      <address className="depot__address">
        {location.addressLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </address>

      <ul className="depot__contacts" role="list">
        {contacts.map((c) => (
          <li key={c.email + c.department}>
            <p className="depot__dept">
              <span className="label">{c.department}</span>
              <span className="depot__name">{c.name}</span>
            </p>
            <p className="depot__links">
              <a href={telHref(c.phone)}>
                <Icon name="phone" size={15} />
                <span className="visually-hidden">Call {c.name} on </span>
                {c.phone}
              </a>
              <a href={mailHref(c.email)}>
                <Icon name="mail" size={15} />
                <span className="visually-hidden">Email {c.name} at </span>
                {c.email}
              </a>
            </p>
          </li>
        ))}
      </ul>

      <a className="depot__directions link-arrow" href={directionsHref(location.address)} target="_blank" rel="noopener">
        Get directions
        <Icon name="arrow-up-right" size={16} />
        <span className="visually-hidden">to {location.suburb} on Google Maps (opens in a new tab)</span>
      </a>
    </article>
  );
}
