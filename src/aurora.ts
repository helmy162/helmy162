/* The aurora field.

   Three heavily blurred colour blobs drifting behind the content, plus a film
   grain overlay. Everything here is declarative so it survives inside an
   <img>-mode SVG, where script is off but SMIL and CSS animation are not.

   One rule governs every animation on this page: the *static* attribute is
   always the good resting state, and the animation only overrides it while it
   runs. A previous version animated the brand mark in from
   stroke-dashoffset: 220, so anywhere the timeline did not advance the mark was
   simply invisible. Written this way, a frozen timeline is indistinguishable
   from a still design. */

import type { Theme } from './tokens.js';

export interface Blob {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** index into theme.aura */
  hue: 0 | 1 | 2;
  opacity?: number;
  /** drift, in panel units */
  dx?: number;
  dy?: number;
  /** seconds for one round trip */
  dur?: number;
}

export function auroraDefs(theme: Theme, id: string): string {
  const stops = theme.aura
    .map(
      (c, i) =>
        `<radialGradient id="${id}-a${i}"><stop offset="0%" stop-color="${c}" stop-opacity="0.9"/>` +
        `<stop offset="100%" stop-color="${c}" stop-opacity="0"/></radialGradient>`,
    )
    .join('');
  return (
    stops +
    `<filter id="${id}-soft" x="-60%" y="-60%" width="220%" height="220%">` +
    `<feGaussianBlur stdDeviation="74"/></filter>` +
    `<filter id="${id}-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85"` +
    ` numOctaves="3"/><feColorMatrix type="saturate" values="0"/></filter>`
  );
}

/** The blurred colour field. Blobs drift on a slow loop that never lands. */
export function auroraField(theme: Theme, id: string, blobs: Blob[]): string {
  const shapes = blobs
    .map((b) => {
      const dx = b.dx ?? 0;
      const dy = b.dy ?? 0;
      const dur = b.dur ?? 18;
      const drift =
        dx || dy
          ? `<animateTransform attributeName="transform" type="translate"` +
            ` values="0 0;${dx} ${dy};0 0" dur="${dur}s" repeatCount="indefinite"` +
            ` calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>`
          : '';
      return (
        `<g><ellipse cx="${b.cx}" cy="${b.cy}" rx="${b.rx}" ry="${b.ry}"` +
        ` fill="url(#${id}-a${b.hue})" opacity="${b.opacity ?? 1}"/>${drift}</g>`
      );
    })
    .join('');
  return `<g filter="url(#${id}-soft)" opacity="0.8">${shapes}</g>`;
}

export function grain(w: number, h: number, id: string, opacity = 0.055): string {
  return `<rect width="${w}" height="${h}" filter="url(#${id}-grain)" opacity="${opacity}"/>`;
}

/** A slow highlight sweeping across the card, the way light moves over glass. */
export function sheen(w: number, h: number, id: string, dur = 9): string {
  return (
    `<linearGradient id="${id}-sheen" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0%" stop-color="#fff" stop-opacity="0"/>` +
    `<stop offset="50%" stop-color="#fff" stop-opacity="0.07"/>` +
    `<stop offset="100%" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `<rect x="${-w}" y="0" width="${w}" height="${h}" fill="url(#${id}-sheen)">` +
    `<animate attributeName="x" values="${-w};${w * 2}" dur="${dur}s"` +
    ` repeatCount="indefinite"/></rect>`
  );
}
