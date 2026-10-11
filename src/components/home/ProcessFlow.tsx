/**
 * Operational flow. Each stage maps to a confirmed service; projects use the
 * stages they need, so this is presented as a route, not a mandatory sequence.
 */
import './ProcessFlow.css';

const stages = [
  { title: 'Receive and coordinate', text: 'Furniture and containers are received at our warehouses, unloaded and checked in.', href: '/services/warehousing' },
  { title: 'Handle and store', text: 'Stock is stored and managed until the site is ready for it.', href: '/services/warehousing' },
  { title: 'Transport', text: 'Furniture is collected and delivered by our transport team.', href: '/services/transport' },
  { title: 'Install or reconfigure', text: 'Placement, installation or reconfiguration of systems and modular furniture on site.', href: '/services/installation' },
];

export default function ProcessFlow() {
  return (
    <section className="flow section" aria-labelledby="flow-title">
      <div className="container container--wide">
        <div className="flow__head">
          <h2 id="flow-title" className="flow__title">
            How the work moves.
          </h2>
          <p className="flow__intro">
            Projects use the stages they need. Some begin at the warehouse; others go straight from collection to
            installation.
          </p>
        </div>

        <ol className="flow__route" role="list" data-reveal>
          {stages.map((stage, i) => (
            <li className="flow__stop" key={stage.title}>
              <span className="flow__marker" aria-hidden="true" />
              <p className="flow__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="flow__stage">
                <a href={stage.href}>{stage.title}</a>
              </h3>
              <p className="flow__text">{stage.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
