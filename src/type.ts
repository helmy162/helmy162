/* Text as path outlines.

   An SVG referenced by <img> renders in the browser's "secure animated mode":
   declarative animation runs, but script, interactivity and *external
   references* are all off. A webfont is an external reference, so @font-face
   cannot work and a plain <text> element would fall back to whatever system
   font the viewer happens to have.

   So every glyph is converted to a path at build time. Poppins and Fira Code
   are both SIL OFL, which permits embedding outlines. The upside is that the
   README renders in the portfolio's actual typefaces, pixel-identical on every
   machine, with no network request and no layout shift. */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import opentype, { type Font, type RenderOptions } from 'opentype.js';
import { LAYOUT } from './tokens.js';

const FONT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'fonts');

export type FontId =
  | 'display' // Poppins SemiBold, headlines
  | 'displayMedium' // Poppins Medium, subheads
  | 'sans' // Poppins Regular, body
  | 'mono' // Fira Code Regular, metadata
  | 'monoMedium'; // Fira Code Medium, emphasised metadata

const FILES: Record<FontId, string> = {
  display: 'Poppins-SemiBold.ttf',
  displayMedium: 'Poppins-Medium.ttf',
  sans: 'Poppins-Regular.ttf',
  mono: 'FiraCode-Regular.ttf',
  monoMedium: 'FiraCode-Medium.ttf',
};

const cache = new Map<FontId, Font>();

function load(id: FontId): Font {
  const hit = cache.get(id);
  if (hit) return hit;
  const buf = readFileSync(join(FONT_DIR, FILES[id]));
  // Slice to a standalone ArrayBuffer: Node pools Buffers, so buf.buffer is
  // usually a larger shared block and parsing it whole reads the wrong bytes.
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const font = opentype.parse(ab);
  cache.set(id, font);
  return font;
}

export interface TypeSpec {
  font: FontId;
  /** on-canvas px, in the panel's own viewBox units */
  size: number;
  /** letter-spacing in em, matching the CSS values used on the site */
  tracking?: number;
}

function options(spec: TypeSpec): RenderOptions {
  return {
    kerning: true,
    letterSpacing: spec.tracking ?? 0,
    // Ligatures off so one character maps to exactly one glyph, which keeps
    // per-character colouring (the teal period) honest. Fira Code's coding
    // ligatures would otherwise fuse pairs like "->".
    features: { liga: false, rlig: false },
  };
}

/** Guards LAYOUT.minFontSize at build time rather than by good intentions. */
function assertLegible(spec: TypeSpec, sample: string): void {
  if (spec.size < LAYOUT.minFontSize) {
    throw new Error(
      `Type too small to survive GitHub mobile: ${spec.size}px < ${LAYOUT.minFontSize}px minimum ` +
        `(text: ${JSON.stringify(sample.slice(0, 40))}). Raise the size or cut the text.`,
    );
  }
}

export interface Glyphs {
  /** one path-data string per character */
  each: string[];
  /** advance width of the run, excluding the trailing letter-space */
  width: number;
}

/** Lays out a string and returns one path per character, kerned as a single run. */
export function glyphs(text: string, x: number, y: number, spec: TypeSpec): Glyphs {
  assertLegible(spec, text);
  const font = load(spec.font);
  const opts = options(spec);
  const each: string[] = [];
  font.forEachGlyph(text, x, y, spec.size, opts, (glyph, gx, gy, gsize) => {
    each.push(glyph.getPath(gx, gy, gsize, opts, font).toPathData(2));
  });
  return { each, width: measure(text, spec) };
}

/** Whole string as one path-data string. */
export function text(t: string, x: number, y: number, spec: TypeSpec): string {
  assertLegible(spec, t);
  const font = load(spec.font);
  return font.getPath(t, x, y, spec.size, options(spec)).toPathData(2);
}

/** Advance width, with the trailing letter-space removed so right-alignment
    and centring land where the ink actually ends. */
export function measure(t: string, spec: TypeSpec): number {
  const font = load(spec.font);
  const raw = font.getAdvanceWidth(t, spec.size, options(spec));
  return t.length > 0 ? raw - (spec.tracking ?? 0) * spec.size : 0;
}
