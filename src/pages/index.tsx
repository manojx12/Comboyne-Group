import GlyphPortal from '../components/GlyphPortal';
import Photo from '../components/Photo';
import Icon from '../components/Icon';
import FactStrip from '../components/FactStrip';
import ServicesIndex from '../components/home/ServicesIndex';
import ProcessFlow from '../components/home/ProcessFlow';
import AboutBand from '../components/home/AboutBand';
import DepotSchematic from '../components/home/DepotSchematic';
import QuoteCTA from '../components/QuoteCTA';
import { company, locations } from '../data/site';
import { photos } from '../data/images';
import { organizationSchema } from '../data/schema';
import { SITE } from '../config';
import type { PageMeta } from '../lib/meta';
import './index.css';

export const meta: PageMeta = {
  fullTitle: 'Comboyne Group | Commercial Furniture Transport, Installation & Warehousing',
  description:
    'Commercial furniture transport, installation and warehousing from depots in Sydney, Melbourne and Brisbane. A family business specialising in commercial furniture since 1989.',
  schema: [organizationSchema(SITE)],
};

const truck = photos.ivecoTruck;
const cities = locations.map((l) => l.city).join(' · ');

export default function HomePage() {
  return (
    <>
      <GlyphPortal
        word="COMBOYNE"
        focusIndex={4}
        front={
          <div className="opening">
            <p className="label opening__label">{cities}</p>
            <h1 id="hero-title" className="opening__title">
              Commercial furniture logistics, handled by specialists.
            </h1>
            <div className="opening__body">
              <p className="opening__lead">
                Transport, installation and warehousing for the commercial furniture industry, from a family business
                that has done this work since {company.founded}.
              </p>
              <div className="opening__actions">
                <a className="btn btn--primary" href="/quote">
                  Request a quote
                  <Icon name="arrow-right" />
                </a>
                <a className="btn btn--secondary" href="#services">
                  Our services
                </a>
              </div>
              <a className="opening__booking" href={company.bookingUrl} target="_blank" rel="noopener">
                Existing customer? Book online
                <Icon name="arrow-up-right" size={14} />
                <span className="visually-hidden">(opens in a new tab)</span>
              </a>
            </div>
            {/* The genuine photograph is 800 px wide, so it is framed, never stretched full-bleed. */}
            <Photo
              photo={truck}
              ratio="5 / 3"
              position="50% 50%"
              sizes="(min-width: 64em) 40vw, 100vw"
              widths={[480, 800]}
              priority
              caption={false}
              className="opening__plate"
            />
          </div>
        }
      >
        <div className="revealed">
          <h2 className="revealed__title">Specialists in commercial furniture, not general freight.</h2>
          <div className="revealed__side">
            <p className="lead revealed__lead">
              A family business that has worked in one industry since it began. Transport, storage and installation all
              sit with the same business, so a job is not passed between providers.
            </p>
            <a className="link-arrow" href="/about">
              Read our story
              <Icon name="arrow-right" size={16} />
            </a>
          </div>
          <FactStrip variant="inline" />
        </div>
      </GlyphPortal>
      <ServicesIndex />
      <ProcessFlow />
      <AboutBand />
      <DepotSchematic />
      <QuoteCTA />
    </>
  );
}
