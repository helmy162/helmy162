/* What I do.

   Four capabilities, each a short label against a sentence, then the stack
   underneath the same hairline. Labels left, prose right: a third layout
   family, so no two panels on the page share a shape.

   No border between rows. A hairline under every row of a list is the fastest
   way to make four items look like a spreadsheet; spacing separates them
   perfectly well.

   Height is computed from the wrapped copy rather than fixed, so editing a
   sentence in src/data/capability.ts cannot leave a gap or clip a line. */

import { doc, fill, hairline, rect } from '../svg.js';
import { measure, text, wrap } from '../type.js';
import { LAYOUT, type Theme } from '../tokens.js';
import { CAPABILITIES, STACK } from '../data/capability.js';
import { STACK_VIEWBOX, stackPath } from '../logos.js';

const W = LAYOUT.wide;
const PAD = LAYOUT.gutter;

const LABEL_W = 176;
const PROSE_X = PAD + LABEL_W;
const PROSE_W = W - PAD - PROSE_X;

const TOP = 62;
const LINE_H = 29;
const ROW_GAP = 34;

const MARK = 42;
/** below the last sentence's baseline, and below the rule */
const RULE_GAP = 46;
const MARK_GAP = 34;

export function capability(theme: Theme): string {
  const labelSpec = { font: 'displayMedium' as const, size: 21 };
  const proseSpec = { font: 'sans' as const, size: 19 };

  const rows: string[] = [];
  let y = TOP;
  let lastBaseline = TOP;
  for (const item of CAPABILITIES) {
    const lines = wrap(item.line, proseSpec, PROSE_W);
    rows.push(fill(text(item.label, PAD, y, labelSpec), theme.ink));
    lines.forEach((line, i) => {
      rows.push(fill(text(line, PROSE_X, y + i * LINE_H, proseSpec), theme.muted));
    });
    lastBaseline = y + (lines.length - 1) * LINE_H;
    y += lines.length * LINE_H + ROW_GAP;
  }

  const ruleY = lastBaseline + RULE_GAP;
  const markY = ruleY + MARK_GAP;

  // Monochrome, and no names underneath. The companies row is where being
  // recognised instantly earns its keep; eight more brand palettes next to it
  // would turn the page into a sticker sheet.
  const track = W - PAD * 2;
  const step = (track - MARK) / (STACK.length - 1);
  const marks = STACK.map((tool, i) => {
    const size = MARK * (tool.scale ?? 1);
    const x = PAD + step * i + (MARK - size) / 2;
    const y0 = markY + (MARK - size) / 2;
    const s = (size / STACK_VIEWBOX).toFixed(4);
    return (
      `<g transform="translate(${x.toFixed(2)} ${y0.toFixed(2)}) scale(${s})">` +
      `<path d="${stackPath(tool.slug)}" fill="${theme.muted}"/></g>`
    );
  }).join('');

  const H = markY + MARK + 44;
  const body = [
    rect(0.5, 0.5, W - 1, H - 1, { fill: theme.canvas, stroke: theme.line, rx: LAYOUT.radiusPanel }),
    rows.join(''),
    hairline(PAD, ruleY, W - PAD, theme.line),
    marks,
  ].join('');

  const spoken = CAPABILITIES.map((c) => `${c.label}. ${c.line}`).join(' ');
  return doc({
    width: W,
    height: H,
    title: `${spoken} Built with ${STACK.map((t) => t.name).join(', ')}.`,
    body,
  });
}
