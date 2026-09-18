/* The stack.

   One row of marks, monochrome, no names underneath. The companies row is where
   being recognised instantly earns its keep; eight more brand palettes next to
   it would turn the page into a sticker sheet, and these shapes are well enough
   known to carry themselves.

   This panel holds no text on purpose. Everything above it that is made of
   words now lives in the README as Markdown, because an 880-wide panel renders
   at 309px on GitHub mobile, and 19px type inside it arrives as 6.7px. Logos
   survive that scale. Sentences do not. */

import { doc, rect } from '../svg.js';
import { LAYOUT, type Theme } from '../tokens.js';
import { STACK } from '../data/capability.js';
import { STACK_VIEWBOX, stackPath } from '../logos.js';

const W = LAYOUT.wide;
const H = 128;
const PAD = LAYOUT.gutter;
const MARK = 44;

export function stack(theme: Theme): string {
  const track = W - PAD * 2;
  const step = (track - MARK) / (STACK.length - 1);
  const top = (H - MARK) / 2;

  const marks = STACK.map((tool, i) => {
    const size = MARK * (tool.scale ?? 1);
    const x = PAD + step * i + (MARK - size) / 2;
    const y = top + (MARK - size) / 2;
    const s = (size / STACK_VIEWBOX).toFixed(4);
    return (
      `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s})">` +
      `<path d="${stackPath(tool.slug)}" fill="${theme.muted}"/></g>`
    );
  }).join('');

  const body = [
    rect(0.5, 0.5, W - 1, H - 1, { fill: theme.canvas, stroke: theme.line, rx: LAYOUT.radiusPanel }),
    marks,
  ].join('');

  return doc({
    width: W,
    height: H,
    title: `What I build with: ${STACK.map((t) => t.name).join(', ')}.`,
    body,
  });
}
