/* Renders every panel as a dark/light pair into assets/.

   Two files per panel, not one adaptive file: an image cannot see the theme of
   the page it lands on, and prefers-color-scheme inside an SVG is unreliable
   once it has been through GitHub's camo proxy. The README's <picture> elements
   do the switching instead. */

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { THEME_LIST, type Theme } from './tokens.js';
import { hero } from './panels/hero.js';
import { career } from './panels/career.js';
import { stack } from './panels/stack.js';
import { bento } from './panels/bento.js';
import { CAPABILITIES } from './data/capability.js';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');

const PANELS: Record<string, (theme: Theme) => string> = {
  hero,
  career,
  ...Object.fromEntries(
    CAPABILITIES.map((c, i) => [`card-${c.label.toLowerCase().replace(/ /g, '-')}`, bento(c, i)]),
  ),
  stack,
};

function main(): void {
  mkdirSync(OUT, { recursive: true });
  let bytes = 0;
  for (const [name, render] of Object.entries(PANELS)) {
    for (const theme of THEME_LIST) {
      const file = `${name}-${theme.name}.svg`;
      const svg = render(theme);
      writeFileSync(join(OUT, file), svg);
      bytes += svg.length;
      console.log(`  ${file.padEnd(28)} ${(svg.length / 1024).toFixed(1)} KB`);
    }
  }
  console.log(`\n${Object.keys(PANELS).length} panels, ${(bytes / 1024).toFixed(1)} KB total`);
}

main();
