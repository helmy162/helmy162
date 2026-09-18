/* Generates README.md.

   Written by the same build that renders the panels so the two cannot drift.
   Alt text is generated from the same strings the panels draw, and it is not an
   afterthought: it is the entire page for anyone on a screen reader, on a slow
   connection, or reading through a client that blocks images. */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CAPABILITIES, STACK } from '../src/data/capability.js';
import { CAREER } from '../src/data/career.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/* README_BRANCH lets a preview branch point its images at itself, so the page
   can be checked on GitHub before it lands on the profile. */
const BRANCH = process.env.README_BRANCH ?? 'main';
const RAW = `https://raw.githubusercontent.com/helmy162/helmy162/${BRANCH}/assets`;

/* Two files and a media query, because an image cannot see the page's theme.

   Every tag sits on its own line, and that is load-bearing rather than tidy.
   A line has to hold one complete tag and nothing else to open a CommonMark
   HTML block; write `<a href="..."><picture>` together and the line stops
   qualifying, so the whole thing is parsed as a paragraph instead. Inside a
   paragraph GitHub's sanitiser drops <picture> and <source>, keeps the fallback
   <img>, and repoints any <a> at the image file. The result still renders,
   which is what makes it easy to miss: the panel simply stops switching
   themes. */
function picture(name: string, alt: string): string {
  return [
    '<picture>',
    `  <source media="(prefers-color-scheme: dark)" srcset="${RAW}/${name}-dark.svg">`,
    `  <source media="(prefers-color-scheme: light)" srcset="${RAW}/${name}-light.svg">`,
    `  <img alt="${alt}" src="${RAW}/${name}-dark.svg">`,
    '</picture>',
  ].join('\n');
}

const careerAlt = CAREER.map((p) => `${p.company} from ${p.since}`).join(', ');
/* The four capability cards, two per row.

   No width attribute on these: at 415 wide, two plus the whitespace between
   still fit GitHub's 846px profile column, so they sit side by side on a
   desktop and wrap to full width on a phone. Pinning them to 49% would keep
   them side by side at 150px each, where the prose is unreadable. */
const cards = CAPABILITIES.map((c) =>
  picture(`card-${c.label.toLowerCase().replace(/ /g, '-')}`, `${c.label}. ${c.line}`),
);

const readme = `${picture(
  'hero',
  'Mohamed Abdelmaksoud. I build things and ship them. Software engineer at Procore Technologies.',
)}

${picture('career', `Where I have worked: ${careerAlt}. Currently at Procore.`)}

${cards[0]}
${cards[1]}

${cards[2]}
${cards[3]}

${picture('stack', `What I build with: ${STACK.map((t) => t.name).join(', ')}.`)}

Ask me about shipping a SaaS product end to end, or about making a large React
codebase pleasant to work in. I am deepening the backend side right now, mostly
NestJS and Express.

**Portfolio** [abdelmaksoud.dev](https://abdelmaksoud.dev)  
**Email** [mohamed@abdelmaksoud.dev](mailto:mohamed@abdelmaksoud.dev)  
**LinkedIn** [linkedin.com/in/helmy16](https://www.linkedin.com/in/helmy16)

<details>
<summary>How this page is built</summary>

Every panel above is an SVG this repository renders itself. There is no
third-party widget service anywhere on the page, which is deliberate: the
popular ones rate-limit, and the host behind the stats card in the old version
of this README had already stopped answering.

\`src/\` holds a small TypeScript generator. It reads the same design tokens the
portfolio at [abdelmaksoud.dev](https://abdelmaksoud.dev) uses, then draws each
panel twice, once per theme, so \`<picture>\` can switch between them.

An SVG loaded through \`<img>\` renders in the browser's secure animated mode:
no script, no interactivity, no external references, but declarative animation
still runs. That shapes everything here. It cannot fetch a webfont, so every
glyph is converted to a path outline with opentype.js at build time, which is
why the page renders in Poppins and Fira Code on your machine without
downloading either. It cannot fetch a logo either, so the company marks are
inlined as data URIs and the stack marks as raw path data. And line breaks have
to be decided at build time against the same font metrics the outlines come
from, since there is no text box left to reflow.

The motion is all SMIL: drifting gradients, a sweeping sheen, a pulse running
along the stack, and a line that types itself through three phrases. The typing
is a clip rectangle stepping through each phrase's cumulative glyph advances,
with a cursor riding the same numbers.

One rule governs every animation here. A frozen timeline snaps to an
animation's *first* value rather than to the element's static attribute, so the
first value is always the good resting state. The typing loop therefore opens
with the first phrase already typed and only types it back in at the end of the
cycle. Built the obvious way round it renders as a bare cursor anywhere the
timeline does not advance, which is exactly how an earlier version of this page
managed to hide its own logo.

\`\`\`
npm install
npm run build   # render every panel, regenerate this README
\`\`\`

</details>
`;

writeFileSync(join(ROOT, 'README.md'), readme);
console.log(`README.md: ${readme.split('\n').length} lines`);
