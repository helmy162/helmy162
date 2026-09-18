/* The stack.

   Eight marks in their own brand colours on a dark glass strip, each with a
   soft glow behind it, lighting up one after another on a loop.

   No labels underneath. These shapes are well enough known to carry themselves,
   and at 0.35 scale on a phone a caption would be unreadable anyway. */

import { doc, rect } from '../svg.js';
import { auroraDefs, auroraField, grain } from '../aurora.js';
import { LAYOUT, type Theme } from '../tokens.js';
import { STACK } from '../data/capability.js';
import { STACK_VIEWBOX, stackPath } from '../logos.js';

const W = LAYOUT.wide;
const H = 132;
const PAD = LAYOUT.gutter;
const MARK = 46;
const ID = 's';

export function stack(theme: Theme): string {
  const track = W - PAD * 2;
  const step = (track - MARK) / (STACK.length - 1);
  const top = (H - MARK) / 2;
  const cycle = STACK.length * 1.15;

  const marks = STACK.map((tool, i) => {
    const size = MARK * (tool.scale ?? 1);
    const x = PAD + step * i + (MARK - size) / 2;
    const y = top + (MARK - size) / 2;
    const s = (size / STACK_VIEWBOX).toFixed(4);
    // Each mark's glow swells as the pulse passes it, so the row reads left to
    // right. Opacity starts at its resting value, which is what a frozen
    // timeline will show.
    const at = i / STACK.length;
    const glow =
      `<circle cx="${(x + size / 2).toFixed(1)}" cy="${(y + size / 2).toFixed(1)}" r="${(size * 0.9).toFixed(1)}"` +
      ` fill="${tool.hex}" opacity="0.16" filter="url(#${ID}-soft)">` +
      `<animate attributeName="opacity" values="0.16;0.16;0.5;0.16;0.16"` +
      ` keyTimes="0;${Math.max(0.001, at - 0.06).toFixed(3)};${at.toFixed(3)};${Math.min(0.999, at + 0.06).toFixed(3)};1"` +
      ` dur="${cycle}s" repeatCount="indefinite"/></circle>`;
    return (
      glow +
      `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s})">` +
      `<path d="${stackPath(tool.slug)}" fill="${tool.hex}"/></g>`
    );
  }).join('');

  const body = [
    `<defs>${auroraDefs(theme, ID)}<clipPath id="${ID}-c">` +
      `<rect width="${W}" height="${H}" rx="${LAYOUT.radiusPanel}"/></clipPath></defs>`,
    `<g clip-path="url(#${ID}-c)">`,
    rect(0, 0, W, H, { fill: theme.canvas }),
    auroraField(theme, ID, [
      { cx: 180, cy: 140, rx: 240, ry: 110, hue: 0, opacity: 0.45, dx: 90, dy: -20, dur: 21 },
      { cx: 700, cy: -20, rx: 260, ry: 120, hue: 1, opacity: 0.45, dx: -80, dy: 30, dur: 25 },
    ]),
    grain(W, H, ID, 0.05),
    marks,
    `</g>`,
    rect(0.5, 0.5, W - 1, H - 1, { stroke: theme.edge, rx: LAYOUT.radiusPanel }),
  ].join('');

  return doc({
    width: W,
    height: H,
    title: `What I build with: ${STACK.map((t) => t.name).join(', ')}.`,
    body,
  });
}
