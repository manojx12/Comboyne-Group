/**
 * Services index, typography-led: a sticky heading beside the three service groups,
 * each opened by a very large thin numeral and listing the confirmed services.
 * No photographs: the stock images that stood here could be mistaken for Comboyne's own.
 */
import Icon from '../Icon';
import './ServicesIndex.css';

const groups = [
  {
    id: 'transport',
    title: 'Transport',
    href: '/services/transport',
    items: [
      { name: 'Commercial furniture transportation', text: 'Office and commercial furniture, moved by a specialist team.' },
    ],
  },
  {
    id: 'installation',
    title: 'Installation',
    href: '/services/installation',
    items: [
      { name: 'Furniture installation', text: 'Placement and installation of systems and modular furniture.' },
      { name: 'Reconfigurations and fit-outs', text: 'Existing furniture reconfigured; small and large office fit-outs.' },
    ],
  },
  {
    id: 'warehousing',
    title: 'Warehousing',
    href: '/services/warehousing',
    items: [
      { name: 'Warehousing and storage', text: 'Facilities in Sydney, Melbourne and Brisbane.' },
      { name: 'Asset management', text: 'Stored furniture managed until it is needed.' },
      { name: 'Receiving and dispatch', text: 'Inbound furniture received; outbound orders dispatched.' },
      { name: 'Container unloading', text: 'Containers unloaded at the warehouse.' },
    ],
  },
];

export default function ServicesIndex() {
  return (
    <section className="svc section" id="services" aria-labelledby="services-title">
      <div className="container container--wide svc__grid">
        <div className="svc__head">
          <h2 id="services-title" className="svc__title">
            Built around commercial furniture.
          </h2>
          <p className="svc__intro">
            Three services. Use one on its own, or combine them across a project from container to finished floor.
          </p>
        </div>

        <div className="svc__index">
          {groups.map((g, i) => (
            <div key={g.id} className={`svc__group svc__group--${g.id}`}>
              <div className="svc__group-head">
                <span className="svc__group-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="svc__group-title">
                  <a href={g.href}>
                    {g.title}
                    <Icon name="arrow-right" size={20} />
                  </a>
                </h3>
              </div>
              <ul className="svc__list" role="list">
                {g.items.map((item) => (
                  <li key={item.name}>
                    <a className="svc__item" href={g.href}>
                      <span className="svc__name">{item.name}</span>
                      <span className="svc__text">{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
