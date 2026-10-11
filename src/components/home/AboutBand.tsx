/**
 * About band: wide photograph with a narrow text panel stepping up over its
 * lower edge. (The founding year is shown large once, in the homepage opening figures.)
 */
import Photo from '../Photo';
import Icon from '../Icon';
import { company } from '../../data/site';
import { photos } from '../../data/images';
import './AboutBand.css';

export default function AboutBand() {
  return (
    <section className="about" aria-labelledby="about-title">
      <div className="about__band">
        <Photo photo={photos.rowsOfChairs} ratio="21 / 9" position="50% 55%" sizes="100vw" className="about__photo" />
      </div>
      <div className="container container--wide about__grid">
        <div className="about__panel" data-reveal>
          <h2 id="about-title" className="about__title">
            A family business that started with office chairs.
          </h2>
          <p>
            Comboyne began in {company.founded} as {company.originalName}, founded by {company.founder}. The work was
            specialised from the start: moving office chairs, partition screens and whiteboards for clients who needed
            them handled properly.
          </p>
          <p>
            It is still a family business, and it is still focused on commercial furniture. Transport, installation and
            warehousing have grown around that same work.
          </p>
          <a className="link-arrow" href="/about">
            Read our story
            <Icon name="arrow-right" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
