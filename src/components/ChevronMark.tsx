/**
 * Large decorative chevrons for dark openings. They repeat the logo chevron
 * and the route motif terminal as thin orange outlines. Decorative only.
 */
import { cx } from '../lib/cx';
import './ChevronMark.css';

const steps = [0, 180, 360];

export default function ChevronMark({ className }: { className?: string }) {
  return (
    <svg
      className={cx('chevron-mark', className)}
      viewBox="0 0 900 1000"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {steps.map((x, i) => (
        <polyline
          key={x}
          points={`${x},0 ${x + 500},500 ${x},1000`}
          fill="none"
          stroke="var(--orange)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          opacity={0.25 + i * 0.3}
        />
      ))}
    </svg>
  );
}
