import PageIntro from '../components/PageIntro';
import SectionHeader from '../components/SectionHeader';
import FactStrip from '../components/FactStrip';
import QuoteCTA from '../components/QuoteCTA';
import Photo from '../components/Photo';
import { company, locations } from '../data/site';
import { photos } from '../data/images';
import type { PageMeta } from '../lib/meta';
import './about.css';

export const meta: PageMeta = {
  title: 'About Us: A Family Business Since 1989',
  description:
    'Comboyne Group began in 1989 as Comboyne Carriers, founded by Geoff Schubert. Still family-run, we specialise in commercial furniture transport, installation and warehousing.',
};

const depots = locations.map((l) => `${l.suburb} ${l.state}`).join(', ').replace(/, ([^,]*)$/, ' and $1');

const timeline = [
  {
    when: String(company.founded),
    title: `${company.originalName} is established`,
    text: `${company.founder} starts the business, handling office chairs, partition screens and whiteboards for a select group of clients.`,
  },
  {
    when: 'Growth',
    title: 'A wider range of services',
    text: 'Still family-run, the business adds more services for the commercial furniture industry.',
  },
  {
    when: 'Today',
    title: company.name,
    text: `Transport, installation and warehousing for commercial furniture, from depots in ${depots}.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        label="About"
        title="A family business, built on commercial furniture since 1989."
        lead={`${company.name} started as ${company.originalName} in ${company.founded}. More than three decades later it is still a family business, and still focused on commercial furniture.`}
        breadcrumbs={[{ label: 'About', href: '/about' }]}
      />

      <section className="section" aria-labelledby="story-title">
        <div className="container container--wide story">
          <div className="story__head">
            <SectionHeader id="story-title" title="It began with office chairs, screens and whiteboards." />
          </div>
          <div className="story__body prose">
            <p className="lead">
              {company.founder} founded {company.originalName} in {company.founded} to give a select group of clients a
              service they needed: careful, expert handling of office chairs, partition screens and whiteboards from
              Sydney, Melbourne and Canberra.
            </p>
            <p>
              The company has since grown to offer transport, installation, and warehousing and distribution, all within
              the commercial furniture industry.
            </p>
            <h2>Specialists, not general freight</h2>
            <p>
              {company.name} specialises in commercial furniture. We are not a general freight company. A number of our
              customers have worked with us for many years, and we are proud of that.
            </p>
            <h2>How we approach the work</h2>
            <p>
              We take ownership of each client&apos;s project and care about the quality of the work and the service.
              Complex moves need careful management, and that starts with a team that has the right skills.
            </p>
          </div>
        </div>
      </section>

      <FactStrip />

      <section className="section" aria-labelledby="timeline-title">
        <div className="container container--wide timeline-wrap">
          <div>
            <SectionHeader id="timeline-title" title="From Comboyne Carriers to Comboyne Group." />
            <Photo photo={photos.rowsOfChairs} ratio="3 / 2" className="timeline-photo" sizes="(min-width: 64em) 40vw, 100vw" />
          </div>
          <ol className="timeline" role="list">
            {timeline.map((item) => (
              <li className="timeline__item" data-reveal key={item.when}>
                <p className="timeline__when">{item.when}</p>
                <div>
                  <h3 className="timeline__title">{item.title}</h3>
                  <p className="muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <QuoteCTA title="Work with a commercial furniture specialist." />
    </>
  );
}
