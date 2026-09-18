/* Vendored logos, inlined.

   Both kinds are embedded rather than linked, for the same reason the fonts are
   outlined: an SVG rendered through <img> is in secure animated mode and cannot
   fetch a single external resource.

   Company marks keep their real colours, because the companies row only works
   if a reader recognises Microsoft or Procore before reading the label. Stack
   marks are single paths filled with the theme's ink, so eight more brand
   palettes do not turn the page into a sticker sheet.

   Run scripts/prep-logos.py to refresh either set. */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const LOGOS = join(dirname(fileURLToPath(import.meta.url)), '..', 'logos');

const cache = new Map<string, string>();

/** A company mark as a data: URI. Always square, padded by prep-logos.py. */
export function companyLogo(name: string): string {
  const hit = cache.get(name);
  if (hit) return hit;
  const uri = `data:image/png;base64,${readFileSync(join(LOGOS, `${name}.png`)).toString('base64')}`;
  cache.set(name, uri);
  return uri;
}

interface StackFile {
  viewBox: number;
  paths: Record<string, string>;
}

const stack = JSON.parse(readFileSync(join(LOGOS, 'stack.json'), 'utf8')) as StackFile;

export const STACK_VIEWBOX = stack.viewBox;

/** Raw path data for a Simple Icons mark, in a 24x24 box. */
export function stackPath(slug: string): string {
  const d = stack.paths[slug];
  if (d === undefined) {
    throw new Error(`No vendored mark for "${slug}". Add it to STACK in scripts/prep-logos.py.`);
  }
  return d;
}
