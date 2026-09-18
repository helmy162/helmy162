/* In production.

   Every product on this row answered a request recently. Anything that stops
   answering falls off after STALE_AFTER_DAYS rather than turning red, so a cold
   start or a flaky runner never marks him down, and a genuinely dead product
   stops being advertised as live.

   The row is justified rather than slotted, because the labels are very
   different lengths and fixed slots would leave visible holes. */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { doc, fill, hairline, rect } from '../svg.js';
import { measure, text } from '../type.js';
import { LAYOUT, type Theme } from '../tokens.js';
import { SITES, STALE_AFTER_DAYS, type Status } from '../data/sites.js';

const W = LAYOUT.wide;
const H = 166;
const PAD = LAYOUT.gutter;
const TRACK = W - PAD * 2;
const RULE_Y = 70;
const ROW_Y = 122;
const DOT_R = 4.5;
const DOT_GAP = 13;

const STATUS_FILE = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'data', 'status.json');

function status(): Status {
  try {
    return JSON.parse(readFileSync(STATUS_FILE, 'utf8')) as Status;
  } catch {
    throw new Error('data/status.json is missing. Run `npm run check` before building.');
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function human(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function daysSince(iso: string, from: string): number {
  return Math.round((Date.parse(from) - Date.parse(iso)) / 86_400_000);
}

export function production(theme: Theme): string {
  const s = status();
  const live = SITES.filter((site) => {
    const seen = s.sites[site.host]?.lastSeen;
    return seen !== undefined && daysSince(seen, s.checkedAt) <= STALE_AFTER_DAYS;
  });

  const headSpec = { font: 'displayMedium' as const, size: 22 };
  const stampSpec = { font: 'mono' as const, size: 19 };
  const itemSpec = { font: 'sans' as const, size: 19 };

  const widths = live.map((site) => measure(site.label, itemSpec) + DOT_R * 2 + DOT_GAP);
  const ink = widths.reduce((a, b) => a + b, 0);
  const gap = live.length > 1 ? (TRACK - ink) / (live.length - 1) : 0;

  let x = PAD;
  const row = live
    .map((site, i) => {
      const cx = x + DOT_R;
      const labelX = x + DOT_R * 2 + DOT_GAP;
      const piece =
        `<circle cx="${cx}" cy="${ROW_Y - 6}" r="${DOT_R}" fill="${theme.accent}"/>` +
        fill(text(site.label, labelX, ROW_Y, itemSpec), theme.ink);
      x += widths[i]! + gap;
      return piece;
    })
    .join('');

  const stamp = `checked ${human(s.checkedAt)}`;
  const body = [
    rect(0.5, 0.5, W - 1, H - 1, { fill: theme.canvas, stroke: theme.line, rx: LAYOUT.radiusPanel }),
    fill(text('In production', PAD, 48, headSpec), theme.ink),
    fill(text(stamp, W - PAD - measure(stamp, stampSpec), 48, stampSpec), theme.dim),
    hairline(PAD, RULE_Y, W - PAD, theme.line),
    row,
  ].join('');

  return doc({
    width: W,
    height: H,
    title: `In production, ${stamp}: ${live.map((l) => l.label).join(', ')} all answering requests.`,
    body,
  });
}
