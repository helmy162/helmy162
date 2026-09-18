/* Product cards, two up.

   Each card carries a real screenshot of the thing, not a drawn approximation
   of one. The product logos are deliberately absent: four brand marks would put
   four competing accents on a page that gets exactly one, and the screenshots
   already supply all the visual variation the grid needs.

   One highlighted figure per card, the same one the portfolio highlights. */

import { doc, esc, fill, hairline, rect } from '../svg.js';
import { measure, text } from '../type.js';
import { LAYOUT, type Theme } from '../tokens.js';
import { dataUri } from '../media.js';
import type { Product } from '../data/products.js';

const W = LAYOUT.card;
const H = 272;
const PAD = 22;
const R = LAYOUT.radiusCard;
const SHOT_H = 150;

/* Screenshots arrive at wildly different keys: two of these products have light
   UIs and two are near-black, which makes an untreated grid read as noise. A
   slight desaturation plus a scrim in the panel's own canvas colour pulls each
   shot toward the page without muddying it. Barely perceptible per card, and it
   is what makes the four read as one set. */
const SCRIM = { dark: 0.14, light: 0.06 } as const;

/** The image band, square at the bottom so it meets the hairline flush. */
const CLIP = `M1 ${SHOT_H} V${1 + R} A${R} ${R} 0 0 1 ${1 + R} 1 H${W - 1 - R} A${R} ${R} 0 0 1 ${W - 1} ${1 + R} V${SHOT_H} Z`;

export function card(product: Product, theme: Theme): string {
  const titleSpec = { font: 'display' as const, size: 23, tracking: -0.01 };
  const taglineSpec = { font: 'sans' as const, size: 19 };
  const figureSpec = { font: 'monoMedium' as const, size: 20 };
  const labelSpec = { font: 'mono' as const, size: 20 };

  const figureW = measure(product.figure, figureSpec);

  const body = [
    rect(0.5, 0.5, W - 1, H - 1, { fill: theme.panel, stroke: theme.line, rx: R }),
    `<clipPath id="shot"><path d="${CLIP}"/></clipPath>`,
    `<filter id="fx"><feColorMatrix type="saturate" values="0.9"/></filter>`,
    `<g clip-path="url(#shot)">` +
      `<image filter="url(#fx)" x="1" y="1" width="${W - 2}" height="${SHOT_H - 1}"` +
      ` preserveAspectRatio="xMidYMid slice" href="${dataUri(product.id)}"/>` +
      `<rect x="1" y="1" width="${W - 2}" height="${SHOT_H - 1}" fill="${theme.canvas}"` +
      ` opacity="${SCRIM[theme.name]}"/>` +
      `</g>`,
    hairline(1, SHOT_H, W - 1, theme.line),
    fill(text(product.title, PAD, 192, titleSpec), theme.ink),
    fill(text(product.tagline, PAD, 220, taglineSpec), theme.muted),
    fill(text(product.figure, PAD, 252, figureSpec), theme.accentText),
    fill(text(product.figureLabel, PAD + figureW + 9, 252, labelSpec), theme.muted),
  ].join('');

  return doc({
    width: W,
    height: H,
    title: esc(
      `${product.title}. ${product.tagline} ${product.figure} ${product.figureLabel}. Live at ${product.host}.`,
    ),
    body,
  });
}
