/**
 * The existing Comboyne Group logo (raster, from the previous website).
 * A vector master should replace it when the business supplies one.
 * `badge` places the mark on a paper disc so the black chevron stays visible on dark backgrounds.
 */
import type { CSSProperties } from 'react';
import { cx } from '../lib/cx';
import './Logo.css';

interface Props {
  size?: 40 | 56;
  badge?: boolean;
  /** Load immediately (header) or lazily (footer). */
  eager?: boolean;
  className?: string;
}

export default function Logo({ size = 56, badge = false, eager = true, className }: Props) {
  const src = (w: number, ext: string) => `/img/logo-${w}.${ext}`;
  return (
    <span className={cx('logo', badge && 'logo--badge', className)} style={{ '--logo-size': `${size}px` } as CSSProperties}>
      <picture>
        <source type="image/webp" srcSet={`${src(size, 'webp')} 1x, ${src(size * 2, 'webp')} 2x`} />
        <img
          src={src(size * 2, 'png')}
          alt=""
          width={size * 2}
          height={size * 2}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </picture>
    </span>
  );
}
