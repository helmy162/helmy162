/* The mA. monogram.

   Geometry copied verbatim from the portfolio's components/Logo.tsx: three
   strokes plus the viridian dot at the baseline.

   The site plays a draw-in on boot and this deliberately does not. An SVG
   loaded through <img> never advanced the animation in any environment I could
   test, and a draw-in that does not run leaves the mark at stroke-dashoffset
   220, which is to say invisible. A flourish is not worth a missing logo. */

import { group } from './svg.js';
import type { Theme } from './tokens.js';

/** Native viewBox of the mark. Scale from this. */
export const MARK_UNITS = 100;

const STROKES: Array<{ d: string; width: number }> = [
  { d: 'M 20 78 L 20 42 Q 20 27 33 27 Q 46 27 46 42 L 46 78', width: 9 },
  { d: 'M 46 42 Q 46 26 59 26 Q 72 26 72 41 L 72 78', width: 9 },
  { d: 'M 49 56 L 69 56', width: 7.5 },
];

export interface MarkOptions {
  x: number;
  y: number;
  /** rendered size in panel units; the mark is square */
  size: number;
  theme: Theme;
}

export function mark({ x, y, size, theme }: MarkOptions): string {
  const strokes = STROKES.map(
    (p) =>
      `<path d="${p.d}" stroke="${theme.ink}" stroke-width="${p.width}"` +
      ' stroke-linecap="round" fill="none"/>',
  ).join('');
  const dot = `<circle cx="72" cy="78" r="6.5" fill="${theme.accent}"/>`;
  return group(`translate(${x} ${y}) scale(${size / MARK_UNITS})`, strokes + dot);
}
