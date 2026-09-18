/* Companies.

   Five stints on one rule, oldest first, each station stacking its mark, the
   company name and the start date.

   Stacked rather than laid out side by side because of arithmetic: mark beside
   name for five stations needs roughly 692px of ink in a 776px track, which
   leaves 21px between stations and reads as a crowd. Stacked, a station is only
   as wide as its widest part, the ink drops to about 430px, and the gaps open
   up to something that looks deliberate.

   Marks keep their real colours. This row is the one place on the page where
   being recognised instantly matters more than palette discipline. */

import { doc, fill, hairline, rect } from '../svg.js';
import { measure, text } from '../type.js';
import { LAYOUT, type Theme } from '../tokens.js';
import { CAREER } from '../data/career.js';
import { companyLogo } from '../logos.js';

const W = LAYOUT.wide;
const H = 218;
const PAD = LAYOUT.gutter;
const TRACK = W - PAD * 2;
const TILE = 56;
const TILE_Y = 28;
const LOGO = 38;
const RULE_Y = 138;

export function career(theme: Theme): string {
  const nameSpec = { font: 'displayMedium' as const, size: 21 };
  const dateSpec = { font: 'mono' as const, size: 19 };

  const slot = TRACK / CAREER.length;
  const stations = CAREER.map((post, i) => {
    const cx = PAD + slot * (i + 0.5);
    const tick = post.current
      ? `<circle cx="${cx}" cy="${RULE_Y + 0.5}" r="4.5" fill="${theme.accent}"/>`
      : `<path d="M${cx - 0.5} ${RULE_Y - 4}V${RULE_Y + 5}" stroke="${theme.line}" stroke-width="1"/>`;
    return [
      // Every mark here was drawn for a light background, so each sits on a
      // tile rather than straight on the canvas. Without it Procore's near
      // black container disappears into the dark theme entirely.
      rect(cx - TILE / 2, TILE_Y, TILE, TILE, { fill: theme.tile, rx: 13 }),
      ((size) =>
        `<image x="${cx - size / 2}" y="${TILE_Y + (TILE - size) / 2}" width="${size}"` +
        ` height="${size}" preserveAspectRatio="xMidYMid meet"` +
        ` href="${companyLogo(post.logo)}"/>`)(LOGO * (post.logoScale ?? 1)),
      fill(
        text(post.company, cx - measure(post.company, nameSpec) / 2, 116, nameSpec),
        post.current ? theme.ink : theme.muted,
      ),
      tick,
      fill(
        text(post.since, cx - measure(post.since, dateSpec) / 2, 176, dateSpec),
        post.current ? theme.accentText : theme.dim,
      ),
    ].join('');
  }).join('');

  const body = [
    rect(0.5, 0.5, W - 1, H - 1, { fill: theme.canvas, stroke: theme.line, rx: LAYOUT.radiusPanel }),
    hairline(PAD, RULE_Y, W - PAD, theme.line),
    stations,
  ].join('');

  const spoken = CAREER.map((p) => `${p.company} from ${p.since}`).join(', ');
  return doc({
    width: W,
    height: H,
    title: `Where I have worked: ${spoken}. Currently at Procore.`,
    body,
  });
}
