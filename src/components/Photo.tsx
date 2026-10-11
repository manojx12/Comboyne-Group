/**
 * Responsive photograph with an honest credit line.
 * Illustrative stock images are always captioned as such so they are never
 * mistaken for Comboyne Group facilities, vehicles, staff or projects.
 */
import type { CSSProperties } from 'react';
import Picture from './Picture';
import type { Photo as PhotoData } from '../data/images';
import { cx } from '../lib/cx';
import './Photo.css';

interface Props {
  photo: PhotoData;
  /** CSS aspect-ratio for the frame, e.g. "4 / 5". */
  ratio?: string;
  /** CSS object-position for the crop. */
  position?: string;
  sizes?: string;
  widths?: number[];
  priority?: boolean;
  caption?: boolean;
  className?: string;
}

/** Honest source line: Unsplash credit for stock images, a source note otherwise. */
export function PhotoCredit({ photo, className = 'photo__credit' }: { photo: PhotoData; className?: string }) {
  return (
    <figcaption className={className}>
      {photo.illustrative && <span>Illustrative image. </span>}
      {photo.credit ? (
        <>
          Photo:{' '}
          <a href={photo.credit.photoUrl} rel="noopener" target="_blank">
            {photo.credit.name} / Unsplash<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </>
      ) : (
        photo.sourceNote
      )}
    </figcaption>
  );
}

export default function Photo({
  photo,
  ratio = '3 / 2',
  position = '50% 50%',
  sizes = '(min-width: 64em) 50vw, 100vw',
  widths = [480, 800, 1200, 1600, 2000],
  priority = false,
  caption = true,
  className,
}: Props) {
  return (
    <figure className={cx('photo', className)} style={{ '--ratio': ratio, '--position': position } as CSSProperties}>
      <div className="photo__frame">
        <Picture image={photo.src} alt={photo.alt} sizes={sizes} widths={widths} priority={priority} />
      </div>
      {caption && <PhotoCredit photo={photo} />}
    </figure>
  );
}
