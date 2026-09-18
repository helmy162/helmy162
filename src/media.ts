/* Screenshots, inlined.

   An <img>-mode SVG cannot fetch anything, so a <image href="./shot.jpg"> would
   render as nothing. A data: URI is not an external reference, though, so the
   bytes travel inside the SVG and render fine. Verified against Chrome's secure
   animated mode, which is the same mode GitHub renders these in. */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const MEDIA = join(dirname(fileURLToPath(import.meta.url)), '..', 'media');
const cache = new Map<string, string>();

export function dataUri(id: string): string {
  const hit = cache.get(id);
  if (hit) return hit;
  const b64 = readFileSync(join(MEDIA, `${id}.jpg`)).toString('base64');
  const uri = `data:image/jpeg;base64,${b64}`;
  cache.set(id, uri);
  return uri;
}
