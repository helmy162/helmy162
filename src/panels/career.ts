/* Career line.

   Five stints on one rule, oldest first. Set in type rather than logos on
   purpose: the four real marks are a red, a teal, an orange and a blue, which
   would put four competing accents on a page that is allowed exactly one, and
   Siemens' teal sits close enough to the brand viridian to make the accent
   read as just another logo colour.

   Nothing animates here. The mark's draw-in on the hero is the only motion in
   the README, the same way the site plays it on boot and then stops. */

import { doc, fill, hairline, rect } from '../svg.js';
import { measure, text } from '../type.js';
import { LAYOUT, type Theme } from '../tokens.js';
import { CAREER } from '../data/career.js';

const W = LAYOUT.wide;
const H = 158;
const PAD = LAYOUT.gutter;
const RULE_Y = 92;
const TRACK = W - PAD * 2;

export function career(theme: Theme): string {
  const nameSpec = { font: 'displayMedium' as const, size: 24 };
  const dateSpec = { font: 'mono' as const, size: 19 };

  const slot = TRACK / CAREER.length;
  const stations = CAREER.map((post, i) => {
    const cx = PAD + slot * (i + 0.5);
    const nameX = cx - measure(post.company, nameSpec) / 2;
    const dateX = cx - measure(post.since, dateSpec) / 2;
    const tick = post.current
      ? `<circle cx="${cx}" cy="${RULE_Y + 0.5}" r="4.5" fill="${theme.accent}"/>`
      : `<path d="M${cx - 0.5} ${RULE_Y - 4}V${RULE_Y + 5}" stroke="${theme.line}" stroke-width="1"/>`;
    return [
      tick,
      fill(text(post.company, nameX, 70, nameSpec), post.current ? theme.ink : theme.muted),
      fill(text(post.since, dateX, 126, dateSpec), post.current ? theme.accentText : theme.dim),
    ].join('');
  }).join('');

  const body = [
    rect(0.5, 0.5, W - 1, H - 1, { fill: theme.canvas, stroke: theme.line, rx: LAYOUT.radiusPanel }),
    hairline(PAD, RULE_Y, W - PAD, theme.line),
    stations,
  ].join('');

  const spoken = CAREER.map((p) => `${p.company} from ${p.since}`).join(', ');
  return doc({ width: W, height: H, title: `Where I have worked: ${spoken}. Currently at Procore.`, body });
}
