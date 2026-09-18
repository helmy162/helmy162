/* Generates README.md.

   Written by the same build that renders the panels so the two can never drift:
   a product added to src/data/products.ts shows up as a card and as a link in
   one step, and the alt text is generated from the same strings the panel draws.

   Alt text is not an afterthought here. It is the whole README for anyone on a
   screen reader, on a slow connection, or reading through a client that blocks
   images, so each one is a sentence rather than a filename. */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PRODUCTS } from '../src/data/products.js';

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
   <img>, and repoints the <a> at the image file. The result still renders, which
   is what makes it easy to miss: the card simply stops switching themes and
   stops linking to the product. */
function picture(name: string, alt: string, width?: string): string {
  const w = width ? ` width="${width}"` : '';
  return [
    '<picture>',
    `  <source media="(prefers-color-scheme: dark)" srcset="${RAW}/${name}-dark.svg">`,
    `  <source media="(prefers-color-scheme: light)" srcset="${RAW}/${name}-light.svg">`,
    `  <img alt="${alt}"${w} src="${RAW}/${name}-dark.svg">`,
    '</picture>',
  ].join('\n');
}

const cards = PRODUCTS.map(
  (p) =>
    `<a href="${p.url}">\n${picture(
      `work-${p.id}`,
      `${p.title}. ${p.tagline} ${p.figure} ${p.figureLabel}.`,
    )}\n</a>`,
);

const readme = `${picture(
  'hero',
  'Mohamed Abdelmaksoud. I build things and ship them. Software engineer at Procore Technologies.',
)}

${picture(
  'career',
  'Microsoft from July 2024, Siemens from September 2024, Procore from February 2025, Cluely from September 2025, and Procore again from February 2026.',
)}

${cards[0]}
${cards[1]}

${cards[2]}
${cards[3]}

${picture(
  'production',
  'In production and answering requests: StealthWriter, Prop Metrics, CustomGPT Researcher, and the LR(0) Parser.',
)}

I work in TypeScript. React and Next.js on the front, Node and Postgres behind
it, Stripe when there is money involved. Most of what I ship is a whole product
rather than a feature, so the billing, the abuse handling and the deploy are
mine too.

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
panel twice, once for each theme, so \`<picture>\` can switch them. An image
cannot load a webfont, so every glyph is converted to a path outline with
opentype.js at build time. That is why this renders in Poppins and Fira Code on
your machine without downloading either.

The monogram draws itself in with the same choreography the site plays on boot,
in CSS, because an SVG loaded through \`<img>\` still runs declarative animation.
It respects \`prefers-reduced-motion\`.

The last panel is checked, not claimed. A scheduled workflow requests each
product daily and records what answered. A failure never marks anything down: a
product only leaves that row after two weeks of silence, so a cold start costs
nothing and a genuinely dead link stops being advertised as live.

\`\`\`
npm install
npm run check   # ping the live products, write data/status.json
npm run build   # render every panel, regenerate this README
\`\`\`

</details>
`;

writeFileSync(join(ROOT, 'README.md'), readme);
console.log(`README.md: ${readme.split('\n').length} lines`);
