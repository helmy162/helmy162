/* Hero.

   A letterhead: mark and role on the top line, a rule under it, then the name
   and one sentence. Three text elements and the mark, nothing else. No
   call-to-action baked into the image, since an <img> cannot hold a link and
   every clickable thing lives in the Markdown underneath. */

import { doc, fill, fillAll, hairline, rect } from '../svg.js';
import { glyphs, measure, text } from '../type.js';
import { mark } from '../mark.js';
import { LAYOUT, type Theme } from '../tokens.js';

const W = LAYOUT.wide;
const H = 264;
const PAD = LAYOUT.gutter;
const RULE_Y = 126;

const NAME = 'Mohamed Abdelmaksoud.';
const LINE = 'I build things and ship them.';
const ROLE = 'Software engineer';
const AT = 'Procore Technologies';


export function hero(theme: Theme): string {
  const nameSpec = { font: 'display' as const, size: 56, tracking: -0.02 };
  const lineSpec = { font: 'sans' as const, size: 26 };
  const railSpec = { font: 'mono' as const, size: 21 };
  const railStrong = { font: 'monoMedium' as const, size: 21 };

  // Laid out as one kerned run, then split so the closing period can carry the
  // accent. Splitting the string first would lose the "d." kerning pair.
  const name = glyphs(NAME, PAD, 196, nameSpec);
  const stem = name.each.slice(0, -1);
  const period = name.each[name.each.length - 1]!;

  const right = W - PAD;

  const body = [
    rect(0.5, 0.5, W - 1, H - 1, { fill: theme.canvas, stroke: theme.line, rx: LAYOUT.radiusPanel }),
    mark({ x: PAD, y: 44, size: 56, theme }),
    fill(text(ROLE, right - measure(ROLE, railSpec), 68, railSpec), theme.muted),
    fill(text(AT, right - measure(AT, railStrong), 94, railStrong), theme.ink),
    hairline(PAD, RULE_Y, W - PAD, theme.line),
    fillAll(stem, theme.ink),
    fill(period, theme.accent),
    fill(text(LINE, PAD, 230, lineSpec), theme.muted),
  ].join('');

  return doc({
    width: W,
    height: H,
    title: `${NAME} ${LINE} ${ROLE} at ${AT}.`,
    body,
  });
}
