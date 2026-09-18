/* Capability cards.

   Four glass cards, two up on a desktop and stacked at full width on a phone,
   which is why they are 415 wide rather than pinned to a percentage: at 49%
   each they would arrive on a phone at 150px and the prose would be illegible.
   Stacked they render at 309px, a 0.74 scale, so 20px type lands at about 15px.

   Every card is the same height so the grid reads as a grid. The height comes
   from whichever card wraps to the most lines. */

import { doc, fill, rect } from '../svg.js';
import { text, wrap } from '../type.js';
import { LAYOUT, type Theme } from '../tokens.js';
import { CAPABILITIES, type Capability } from '../data/capability.js';

const W = LAYOUT.card;
const PAD = 30;
const PROSE_W = W - PAD * 2;
const LABEL_Y = 60;
const PROSE_Y = 102;
const LINE_H = 29;
const BOTTOM = 34;

const labelSpec = { font: 'display' as const, size: 25, tracking: -0.015 };
const proseSpec = { font: 'sans' as const, size: 20 };

const lineCount = (c: Capability): number => wrap(c.line, proseSpec, PROSE_W).length;
/** One height for all four, set by the wordiest card. */
const H = PROSE_Y + (Math.max(...CAPABILITIES.map(lineCount)) - 1) * LINE_H + BOTTOM;

export function bento(item: Capability, index: number): (theme: Theme) => string {
  return (theme: Theme): string => {
    const id = `b${index}`;
    const hue = theme.aura[item.hue];
    const lines = wrap(item.line, proseSpec, PROSE_W);

    const body = [
      `<defs><radialGradient id="${id}-g" cx="0.12" cy="0" r="0.95">` +
        `<stop offset="0%" stop-color="${hue}" stop-opacity="0.42"/>` +
        `<stop offset="100%" stop-color="${hue}" stop-opacity="0"/></radialGradient>` +
        `<clipPath id="${id}-c"><rect width="${W}" height="${H}" rx="${LAYOUT.radiusCard}"/></clipPath>` +
        `<filter id="${id}-grain"><feTurbulence type="fractalNoise" baseFrequency="0.9"` +
        ` numOctaves="3"/><feColorMatrix type="saturate" values="0"/></filter></defs>`,
      `<g clip-path="url(#${id}-c)">`,
      rect(0, 0, W, H, { fill: theme.panel }),
      rect(0, 0, W, H, { fill: `url(#${id}-g)` }),
      `<rect width="${W}" height="${H}" filter="url(#${id}-grain)" opacity="0.05"/>`,
      // A soft pulse on the tint, so a still grid still feels alive.
      `<rect width="${W}" height="${H}" fill="${hue}" opacity="0.05">` +
        `<animate attributeName="opacity" values="0.05;0.11;0.05" dur="${7 + index}s"` +
        ` repeatCount="indefinite"/></rect>`,
      `</g>`,
      fill(text(item.label, PAD, LABEL_Y, labelSpec), theme.ink),
      ...lines.map((line, i) =>
        fill(text(line, PAD, PROSE_Y + i * LINE_H, proseSpec), theme.muted),
      ),
      rect(0.5, 0.5, W - 1, H - 1, { stroke: theme.edge, rx: LAYOUT.radiusCard }),
    ].join('');

    return doc({ width: W, height: H, title: `${item.label}. ${item.line}`, body });
  };
}
