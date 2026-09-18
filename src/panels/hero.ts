/* Hero.

   An aurora field behind big type, a glass pill for the current role, and one
   line that types itself through three phrases on a loop.

   The mark is drawn statically. It is the one element on the page whose
   absence would be a real failure, so it takes no part in any animation. */

import { doc, fill, rect } from '../svg.js';
import { measure, text } from '../type.js';
import { mark } from '../mark.js';
import { auroraDefs, auroraField, grain, sheen } from '../aurora.js';
import { typewriter } from '../typewriter.js';
import { LAYOUT, type Theme } from '../tokens.js';

const W = LAYOUT.wide;
const H = 304;
const PAD = LAYOUT.gutter;
const ID = 'h';

const NAME = 'Mohamed Abdelmaksoud';
const ROLE = 'Software engineer at Procore';
const PHRASES = [
  'I build things and ship them.',
  'React, Next.js and TypeScript.',
  'Whole products, not features.',
];

export function hero(theme: Theme): string {
  const nameSpec = { font: 'display' as const, size: 58, tracking: -0.028 };
  const roleSpec = { font: 'mono' as const, size: 19 };
  const lineSpec = { font: 'sans' as const, size: 23 };

  const nameW = measure(NAME, nameSpec);
  const pillW = measure(ROLE, roleSpec) + 66;
  const pillY = 52;

  const body = [
    `<defs>${auroraDefs(theme, ID)}<clipPath id="${ID}-card">` +
      `<rect width="${W}" height="${H}" rx="${LAYOUT.radiusPanel}"/></clipPath></defs>`,
    `<g clip-path="url(#${ID}-card)">`,
    rect(0, 0, W, H, { fill: theme.canvas }),
    auroraField(theme, ID, [
      { cx: 120, cy: 30, rx: 250, ry: 150, hue: 0, dx: 60, dy: 34, dur: 19 },
      { cx: 600, cy: -40, rx: 300, ry: 165, hue: 1, dx: -70, dy: 46, dur: 23 },
      { cx: 910, cy: 250, rx: 280, ry: 175, hue: 2, dx: -54, dy: -40, dur: 17 },
      { cx: 330, cy: 320, rx: 250, ry: 125, hue: 0, opacity: 0.5, dx: 80, dy: -28, dur: 26 },
    ]),
    grain(W, H, ID),
    sheen(W, H, ID),

    // Glass pill. The dot breathes rather than blinks: a hard on/off reads as
    // an alert, and this is only saying "currently".
    `<rect x="${PAD}" y="${pillY}" width="${pillW}" height="40" rx="20" fill="#fff" opacity="0.07"/>`,
    `<rect x="${PAD + 0.5}" y="${pillY + 0.5}" width="${pillW - 1}" height="39" rx="19.5"` +
      ` fill="none" stroke="#fff" stroke-opacity="0.17"/>`,
    `<circle cx="${PAD + 20}" cy="${pillY + 20}" r="4.5" fill="${theme.accent}">` +
      `<animate attributeName="opacity" values="1;0.35;1" dur="2.4s" repeatCount="indefinite"/>` +
      `</circle>`,
    fill(text(ROLE, PAD + 38, pillY + 27, roleSpec), '#cddadd'),

    mark({ x: W - PAD - 54, y: pillY - 4, size: 54, theme }),

    fill(text(NAME, PAD, 194, nameSpec), theme.ink),
    fill(text('.', PAD + nameW, 194, { font: 'display', size: 58 }), theme.accent),

    typewriter(PHRASES, `${ID}-tw`, {
      x: PAD,
      y: 244,
      spec: lineSpec,
      colour: theme.muted,
      cursorColour: theme.accent,
    }),
    `</g>`,
    rect(0.5, 0.5, W - 1, H - 1, {
      stroke: theme.edge,
      rx: LAYOUT.radiusPanel,
    }),
  ].join('');

  return doc({
    width: W,
    height: H,
    title: `${NAME}. ${ROLE}. ${PHRASES.join(' ')}`,
    body,
  });
}
