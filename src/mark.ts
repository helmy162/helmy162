/* The mA. monogram.

   Geometry copied verbatim from the portfolio's components/Logo.tsx, and the
   draw-in choreography from the .ma-seg rules in app/globals.css: left stem and
   arch, then the right arch at 0.45s, the crossbar at 0.95s, and the dot popping
   at 1.3s on a slight overshoot. Roughly 1.8s, once, no loop.

   The repetition is deliberate. Someone who has seen abdelmaksoud.dev boot
   should recognise this mark drawing itself the same way. Do not restyle it. */

import { group } from './svg.js';
import { STATIC } from './motion.js';
import type { Theme } from './tokens.js';

/** Native viewBox of the mark. Scale from this. */
export const MARK_UNITS = 100;

const STROKES: Array<{ d: string; width: number; cls: string }> = [
  { d: 'M 20 78 L 20 42 Q 20 27 33 27 Q 46 27 46 42 L 46 78', width: 9, cls: 'ma-seg' },
  { d: 'M 46 42 Q 46 26 59 26 Q 72 26 72 41 L 72 78', width: 9, cls: 'ma-seg ma-s2' },
  { d: 'M 49 56 L 69 56', width: 7.5, cls: 'ma-seg ma-s3' },
];

/* Guarded on prefers-reduced-motion exactly as the site is: with motion
   reduced, the mark is simply present and static, never a half-drawn glyph. */
export const MARK_CSS = `
@keyframes ma-draw { to { stroke-dashoffset: 0; } }
@keyframes ma-pop { to { transform: scale(1); } }
@media (prefers-reduced-motion: no-preference) {
  .ma-seg {
    stroke-dasharray: 220;
    stroke-dashoffset: 220;
    animation: ma-draw 0.7s ease-out forwards;
  }
  .ma-s2 { animation-delay: 0.45s; }
  .ma-s3 { animation-delay: 0.95s; animation-duration: 0.35s; }
  .ma-dot-pop {
    transform-origin: 72px 78px;
    transform: scale(0);
    animation: ma-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1.3s forwards;
  }
}`.trim();

export interface MarkOptions {
  x: number;
  y: number;
  /** rendered size in panel units; the mark is square */
  size: number;
  theme: Theme;
  animated?: boolean;
}

export function mark({ x, y, size, theme, animated = false }: MarkOptions): string {
  const move = animated && !STATIC;
  const s = size / MARK_UNITS;
  const strokes = STROKES.map(
    (p) =>
      `<path${move ? ` class="${p.cls}"` : ''} d="${p.d}" stroke="${theme.ink}"` +
      ` stroke-width="${p.width}" stroke-linecap="round" fill="none"/>`,
  ).join('');
  const dot =
    `<circle${move ? ' class="ma-dot-pop"' : ''} cx="72" cy="78" r="6.5"` +
    ` fill="${theme.accent}"/>`;
  return group(`translate(${x} ${y}) scale(${s})`, strokes + dot);
}
