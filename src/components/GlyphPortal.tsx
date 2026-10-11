/**
 * GlyphPortal: an oversized word whose chosen letter becomes a window. Scrolling
 * zooms through the counter (the enclosed space) of that letter until the window
 * fills the screen and reveals the section behind it.
 *
 * Original implementation for Comboyne Group (React, Canvas 2D and CSS, no
 * animation library). It is inspired by the 21st.dev "Glyph Portal" idea; that
 * component source was not available, so none of its code is used here.
 *
 * How it works
 * 1. Analysis (once per font): the focus letter is drawn on a hidden canvas and
 *    rays are cast from its centre to find, at each angle, where the stroke starts
 *    and ends. The midpoints form a polygon that sits inside the stroke.
 * 2. Drawing (per scroll frame): an ink layer is painted, that polygon is cut out
 *    (the window onto the light section behind), and the word is drawn on top, so
 *    the cut edge is hidden under the stroke. The layer is scaled around the counter.
 *    The opening's own content (heading, photograph, actions) stays in the DOM above
 *    the canvas, so the photograph is never scaled beyond its own resolution.
 * 3. Fallback: without JavaScript, with reduced motion, or if the canvas or the
 *    font cannot be used, or the screen is too short, the section renders as a
 *    static stack: the dark opening, then the light revealed content. Nothing is hidden.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import './GlyphPortal.css';

interface Props {
  /** Display word; set in the page font, uppercase by CSS. */
  word: string;
  /** Index of the letter to zoom through. It must enclose a counter (O, D, B...). */
  focusIndex: number;
  /** Opening frame content, above the word: heading, lead, photograph, actions. */
  front: ReactNode;
  /** Content revealed at the end of the zoom, on a light field. Always rendered and readable. */
  children: ReactNode;
  /** Extra scroll distance, in viewport heights, used by the zoom. */
  scrollLength?: number;
  /** Font family used for analysis; must match the CSS of .portal__word. */
  fontFamily?: string;
  /** Font weight and stretch keyword used for analysis; must match the CSS. */
  fontWeight?: number;
  fontStretch?: string;
}

interface Glyph {
  /** Counter centre relative to the letter origin (left edge of its advance, baseline), in em. */
  cx: number;
  cy: number;
  /** Polygon inside the stroke, relative to the counter centre, in em. */
  points: Array<[number, number]>;
  /** Smallest distance from the centre to the inner edge of the stroke, in em. */
  inner: number;
}

interface Layout {
  width: number;
  height: number;
  font: string;
  size: number;
  x: number;
  baseline: number;
  /** Counter centre in stage pixels. */
  cx: number;
  cy: number;
  maxScale: number;
}

const ANALYSIS_SIZE = 400;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

function fontString(weight: number, stretch: string, size: number, family: string) {
  return `${weight} ${stretch} ${size}px ${family}`;
}

/** Ray-casts the counter of one letter. Returns null if the letter has no enclosed counter. */
function analyseGlyph(letter: string, font: (size: number) => string): Glyph | null {
  const pad = ANALYSIS_SIZE * 0.25;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.font = font(ANALYSIS_SIZE);
  const m = ctx.measureText(letter);
  canvas.width = Math.ceil(m.actualBoundingBoxLeft + m.actualBoundingBoxRight + pad * 2);
  canvas.height = Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent + pad * 2);
  ctx.font = font(ANALYSIS_SIZE);
  const originX = pad + m.actualBoundingBoxLeft;
  const baseline = pad + m.actualBoundingBoxAscent;
  ctx.fillText(letter, originX, baseline);

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const inked = (x: number, y: number) => {
    const xi = Math.round(x);
    const yi = Math.round(y);
    return xi >= 0 && yi >= 0 && xi < width && yi < height && data[(yi * width + xi) * 4 + 3] > 128;
  };

  const centreX = originX + (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
  const centreY = baseline - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
  if (inked(centreX, centreY)) return null;

  const limit = Math.max(width, height);
  const points: Array<[number, number]> = [];
  let inner = Infinity;
  for (let deg = 0; deg < 360; deg += 2) {
    const a = (deg * Math.PI) / 180;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    let r = 0;
    while (r < limit && !inked(centreX + dx * r, centreY + dy * r)) r += 0.5;
    if (r >= limit) return null; // the ray escaped: no enclosed counter
    const rIn = r;
    while (r < limit && inked(centreX + dx * r, centreY + dy * r)) r += 0.5;
    const mid = (rIn + r) / 2;
    inner = Math.min(inner, rIn);
    points.push([(dx * mid) / ANALYSIS_SIZE, (dy * mid) / ANALYSIS_SIZE]);
  }

  return {
    cx: (centreX - originX) / ANALYSIS_SIZE,
    cy: (centreY - baseline) / ANALYSIS_SIZE,
    points,
    inner: inner / ANALYSIS_SIZE,
  };
}

export default function GlyphPortal({
  word,
  focusIndex,
  front,
  children,
  scrollLength = 140,
  fontFamily = '"Archivo Variable", Archivo, sans-serif',
  fontWeight = 150,
  fontStretch = 'expanded',
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const glyphRef = useRef<Glyph | null>(null);
  const [live, setLive] = useState(false);

  // Decide whether the effect runs: motion allowed, canvas available, font ready, letter has a counter.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    const font = (size: number) => fontString(fontWeight, fontStretch, size, fontFamily);
    const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
    Promise.race([document.fonts?.load(font(100), word), timeout])
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        const glyph = analyseGlyph(word[focusIndex], font);
        if (glyph) {
          glyphRef.current = glyph;
          setLive(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [word, focusIndex, fontFamily, fontWeight, fontStretch]);

  // Layout, drawing and scroll handling. Runs only in live mode.
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const wordEl = wordRef.current;
    const glyph = glyphRef.current;
    const ctx = canvas?.getContext('2d');
    if (!live || !section || !stage || !canvas || !wordEl || !glyph || !ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const ink = styles.getPropertyValue('--ink').trim() || '#191a18';
    const paper = styles.getPropertyValue('--paper').trim() || '#f5f3ee';
    let layout: Layout | null = null;
    let frame = 0;
    let lastProgress = -1;

    /** Height a block needs: its children from first top to last bottom, plus padding. */
    const needed = (el: Element | null | undefined) => {
      if (!el?.firstElementChild || !el.lastElementChild) return 0;
      const style = getComputedStyle(el);
      return (
        el.lastElementChild.getBoundingClientRect().bottom -
        el.firstElementChild.getBoundingClientRect().top +
        parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom)
      );
    };

    const measure = () => {
      const stageBox = stage.getBoundingClientRect();
      // Short screens: if the opening or the revealed content cannot fit the pinned stage,
      // use the static layout instead of clipping text.
      // ponytail: not re-enabled if the window later grows; a reload restores the effect.
      if (needed(frontRef.current) > stageBox.height || needed(revealRef.current) > stageBox.height) {
        setLive(false);
        return false;
      }
      const wordBox = wordEl.getBoundingClientRect();
      const size = parseFloat(getComputedStyle(wordEl).fontSize);
      const font = fontString(fontWeight, fontStretch, size, fontFamily);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(stageBox.width * dpr);
      canvas.height = Math.round(stageBox.height * dpr);
      ctx.font = font;
      const metrics = ctx.measureText(word);
      const ascent = metrics.fontBoundingBoxAscent;
      const descent = metrics.fontBoundingBoxDescent;
      // Same baseline as the DOM line box: half-leading above the font ascent.
      const baseline = wordBox.top - stageBox.top + (wordBox.height - (ascent + descent)) / 2 + ascent;
      const x = wordBox.left - stageBox.left;
      // Pen position of the focus letter, including kerning with the letter before it.
      const letterX = x + ctx.measureText(word.slice(0, focusIndex + 1)).width - ctx.measureText(word[focusIndex]).width;
      const cxPx = letterX + glyph.cx * size;
      const cyPx = baseline + glyph.cy * size;
      const reach = Math.hypot(stageBox.width / 2, stageBox.height / 2);
      layout = {
        width: stageBox.width,
        height: stageBox.height,
        font,
        size,
        x,
        baseline,
        cx: cxPx,
        cy: cyPx,
        maxScale: (reach / (glyph.inner * size)) * 1.1,
      };
      lastProgress = -1;
      return true;
    };

    const draw = (zoom: number) => {
      if (!layout) return;
      const dpr = canvas.width / layout.width;
      const s = Math.pow(layout.maxScale, zoom);
      const travel = smooth(zoom);
      // The counter drifts to the centre of the stage while it grows.
      const px = layout.cx + (layout.width / 2 - layout.cx) * travel;
      const py = layout.cy + (layout.height / 2 - layout.cy) * travel;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * (px - s * layout.cx), dpr * (py - s * layout.cy));
      // At rest the letter is closed; the window opens as soon as the zoom starts.
      if (zoom > 0) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        glyph.points.forEach(([gx, gy], i) => {
          const vx = layout!.cx + gx * layout!.size;
          const vy = layout!.cy + gy * layout!.size;
          if (i) ctx.lineTo(vx, vy);
          else ctx.moveTo(vx, vy);
        });
        ctx.closePath();
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = paper;
      ctx.font = layout.font;
      ctx.fillText(word, layout.x, layout.baseline);
    };

    const progress = () => {
      const box = section.getBoundingClientRect();
      const travel = box.height - stage.offsetHeight;
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      return travel > 0 ? clamp((top - box.top) / travel) : 0;
    };

    const update = () => {
      frame = 0;
      const p = progress();
      if (Math.abs(p - lastProgress) < 0.0005) return;
      lastProgress = p;
      const zoom = smooth(clamp((p - 0.04) / 0.8));
      draw(zoom);
      const frontOpacity = 1 - clamp(p / 0.18);
      // The revealed text arrives while the window grows, so the letter frames the next statement.
      const revealOpacity = clamp((p - 0.2) / 0.35);
      if (frontRef.current) {
        frontRef.current.style.opacity = String(frontOpacity);
        frontRef.current.style.pointerEvents = frontOpacity > 0.5 ? '' : 'none';
      }
      if (hintRef.current) hintRef.current.style.opacity = String(frontOpacity);
      if (revealRef.current) {
        revealRef.current.style.opacity = String(revealOpacity);
        revealRef.current.style.transform = `translateY(${(1 - revealOpacity) * 16}px)`;
        revealRef.current.style.pointerEvents = revealOpacity > 0.5 ? '' : 'none';
      }
      canvas.style.visibility = zoom >= 1 ? 'hidden' : '';
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Keyboard users must never land on invisible content: jump to the matching end of the zoom.
    const scrollToProgress = (p: number) => {
      const box = section.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      window.scrollTo({ top: window.scrollY + box.top - top + p * (box.height - stage.offsetHeight), behavior: 'instant' });
    };
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as Node;
      const p = progress();
      if (revealRef.current?.contains(target) && p < 0.95) scrollToProgress(1);
      else if (frontRef.current?.contains(target) && p > 0.05) scrollToProgress(0);
    };

    if (!measure()) return;
    update();
    const resize = new ResizeObserver(() => {
      if (measure()) schedule();
    });
    resize.observe(stage);
    window.addEventListener('scroll', schedule, { passive: true });
    section.addEventListener('focusin', onFocusIn);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      section.removeEventListener('focusin', onFocusIn);
      if (frontRef.current) frontRef.current.style.cssText = '';
      if (revealRef.current) revealRef.current.style.cssText = '';
      if (hintRef.current) hintRef.current.style.cssText = '';
    };
  }, [live, word, focusIndex, fontFamily, fontWeight, fontStretch]);

  return (
    <section
      ref={sectionRef}
      className={cx('portal', live && 'portal--live')}
      style={{ '--portal-scroll': `${scrollLength}vh` } as CSSProperties}
      aria-labelledby="hero-title"
    >
      <div ref={stageRef} className="portal__stage">
        <div className="portal__front on-dark">
          <div className="container container--wide portal__front-inner" ref={frontRef}>
            {front}
            <p ref={wordRef} className="portal__word" aria-hidden="true">
              {word}
            </p>
          </div>
          {/* Static layout: the header is dark while this dark opening is under it. */}
          <span className="portal__end portal__end--static" data-hero-end aria-hidden="true" />
        </div>

        <div className="portal__reveal">
          <div className="container container--wide portal__content" ref={revealRef}>
            {children}
          </div>
        </div>

        <canvas ref={canvasRef} className="portal__canvas" aria-hidden="true" />
        <p ref={hintRef} className="portal__hint" aria-hidden="true">
          Scroll
        </p>
      </div>
      {/* Live layout: dark header until the window has opened over most of the screen. */}
      <span className="portal__end portal__end--live" data-hero-end aria-hidden="true" />
    </section>
  );
}
