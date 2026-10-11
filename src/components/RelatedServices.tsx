import Icon from './Icon';
import { services, type ServiceSlug } from '../data/site';
import './RelatedServices.css';

export default function RelatedServices({ current }: { current: ServiceSlug }) {
  const others = services.filter((s) => s.slug !== current);
  return (
    <section className="related section--tight" aria-labelledby="related-title">
      <div className="container container--wide">
        <h2 className="label related__title" id="related-title">
          Related services
        </h2>
        <ul className="related__list" role="list">
          {others.map((s) => (
            <li key={s.slug}>
              <a className="related__link" href={s.href}>
                <span className="label related__num">{s.number}</span>
                <span className="related__name">{s.title}</span>
                <span className="related__benefit muted">{s.benefit}</span>
                <Icon name="arrow-right" size={22} className="related__arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
