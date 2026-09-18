/* Builds a self-contained preview page.

   Each panel is embedded as a data: URI inside an <img>, which puts the browser
   in the same "secure animated mode" GitHub's camo proxy does. So what this page
   shows is what the README will show, including which animations survive. */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'assets');

const uri = (f: string): string =>
  `data:image/svg+xml;base64,${readFileSync(join(ASSETS, f)).toString('base64')}`;

const names = [
  ...new Set(
    readdirSync(ASSETS)
      .filter((f) => f.endsWith('.svg'))
      .map((f) => f.replace(/-(dark|light)\.svg$/, '')),
  ),
];

// Card panels sit two-up in the README, so preview them that way.
const isCard = (n: string): boolean => n.startsWith('work-');
const cards = names.filter(isCard);
const full = names.filter((n) => !isCard(n));

function column(theme: 'dark' | 'light'): string {
  const wide = full.map((n) => `<img src="${uri(`${n}-${theme}.svg`)}" alt="${n}">`).join('');
  const grid = cards.length
    ? `<div class="grid">${cards
        .map((n) => `<img src="${uri(`${n}-${theme}.svg`)}" alt="${n}">`)
        .join('')}</div>`
    : '';
  return wide + grid;
}

const html = `<!doctype html><meta charset="utf-8"><title>README panels</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;font:13px ui-monospace,SFMono-Regular,monospace}
  .pane{padding:32px 24px 44px}
  .d{background:#0d1117;color:#7d8590}
  .l{background:#fff;color:#59636e}
  h2{font:600 11px ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;margin:0 0 16px;opacity:.65}
  .col{max-width:880px}
  .mob{width:350px;margin-top:36px;outline:1px dashed rgba(127,127,127,.35);padding:6px}
  img{display:block;width:100%;margin-bottom:14px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .grid img{margin-bottom:0}
  .reload{position:fixed;right:14px;top:12px;z-index:9;background:#00c4c4;color:#04121a;border:0;
    border-radius:6px;padding:7px 12px;font:600 11px ui-monospace,monospace;cursor:pointer}
</style>
<button class="reload" onclick="location.reload()">replay</button>
<div class="pane d"><h2>dark &middot; 880px desktop</h2><div class="col">${column('dark')}</div>
  <h2>dark &middot; 350px mobile</h2><div class="mob">${column('dark')}</div></div>
<div class="pane l"><h2>light &middot; 880px desktop</h2><div class="col">${column('light')}</div>
  <h2>light &middot; 350px mobile</h2><div class="mob">${column('light')}</div></div>
`;

writeFileSync(join(ROOT, 'preview.html'), html);
console.log(`preview.html: ${names.length} panels, ${(html.length / 1024).toFixed(0)} KB`);
