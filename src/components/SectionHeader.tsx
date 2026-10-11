/**
 * Section heading block: headline with an optional short introduction, stacked.
 * An eyebrow label is available but intended for rare use (not every section).
 */
import type { ReactNode } from 'react';
import { cx } from '../lib/cx';
import './SectionHeader.css';

interface Props {
  title: string;
  intro?: string;
  /** Optional small label above the heading. Use sparingly. */
  label?: string;
  as?: 'h1' | 'h2';
  /** id for the heading, so a parent section can reference it with aria-labelledby. */
  id?: string;
  className?: string;
  children?: ReactNode;
}

export default function SectionHeader({ title, intro, label, as: Heading = 'h2', id, className, children }: Props) {
  return (
    <header className={cx('section-header', className)}>
      {label && <p className="label section-header__label">{label}</p>}
      <Heading className="section-header__title" id={id}>
        {title}
      </Heading>
      {intro && <p className="section-header__intro">{intro}</p>}
      {children}
    </header>
  );
}
