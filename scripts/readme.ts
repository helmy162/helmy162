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
/* Rendered as Markdown, not as a panel. These are sentences, and a panel puts
   them in an image that GitHub scales to 309px on a phone, where 19px type
   arrives as 6.7px. As text they reflow, stay selectable and searchable, and
   are read properly by a screen reader. */
const capabilities = CAPABILITIES.map((c) => `**${c.label}** ${c.line}`).join('\n\n');

const readme = `${picture(
  'hero',
  'Mohamed Abdelmaksoud. I build things and ship them. Software engineer at Procore Technologies.',
)}

${picture('career', `Where I have worked: ${careerAlt}. Currently at Procore.`)}

${capabilities}

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
no script, no interactivity, and no external references of any kind. That last
one has consequences. It cannot fetch a webfont, so every glyph here is
converted to a path outline with opentype.js at build time, which is why the
page renders in Poppins and Fira Code on your machine without downloading
either. It cannot fetch a logo either, so the company marks are inlined as
data URIs and the stack marks as raw path data.

It also means line breaks have to be decided at build time, against the same
font metrics the outlines come from, since there is no text box left to reflow.
The panel heights are computed from the wrapped copy rather than fixed, so
editing a sentence cannot clip a line or leave a gap.

Nothing on the page moves. A draw-in on the monogram was built first and cut:
declarative animation is supposed to survive in this mode, but it never
advanced in any environment I could test, and an animation that does not run
leaves the mark at \`stroke-dashoffset: 220\`, which is to say invisible. Not
worth the risk for a flourish.

\`\`\`
npm install
npm run build   # render every panel, regenerate this README
\`\`\`

</details>
`;

writeFileSync(join(ROOT, 'README.md'), readme);
console.log(`README.md: ${readme.split('\n').length} lines`);
