/* A 1:1 review sheet: every panel at its native width on a GitHub-coloured
   canvas, so spacing and type size can be judged at the size people see. */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'assets');

const uri = (f: string): string =>
  `data:image/svg+xml;base64,${readFileSync(join(ASSETS, f)).toString('base64')}`;

const ORDER = ['hero', 'career', 'work-', 'production'];
const names = [
  ...new Set(
    readdirSync(ASSETS)
      .filter((f) => f.endsWith('.svg'))
      .map((f) => f.replace(/-(dark|light)\.svg$/, '')),
  ),
].sort((a, b) => {
  const rank = (n: string): number => ORDER.findIndex((p) => n.startsWith(p));
  return rank(a) - rank(b) || a.localeCompare(b);
});

const isCard = (n: string): boolean => n.startsWith('work-');

function stack(theme: 'dark' | 'light'): string {
  const out: string[] = [];
  let pending: string[] = [];
  const flush = (): void => {
    if (!pending.length) return;
    out.push(`<div class="grid">${pending.join('')}</div>`);
    pending = [];
  };
  for (const n of names) {
    const img = `<img src="${uri(`${n}-${theme}.svg`)}" alt="${n}">`;
    if (isCard(n)) pending.push(img);
    else {
      flush();
      out.push(img);
    }
  }
  flush();
  return out.join('');
}

const html = `<!doctype html><meta charset="utf-8"><title>sheet</title>
<style>
  *{box-sizing:border-box}
  html,body{margin:0}
  body{padding:28px 48px;font:12px ui-monospace,monospace}
  body.dark{background:#0d1117}
  body.light{background:#fff}
  img{display:block;margin-bottom:18px}
  .grid{display:grid;grid-template-columns:${'repeat(2, 431px)'};gap:18px;margin-bottom:18px}
  .grid img{margin-bottom:0}
</style>
<div id="s"></div>
<script>
  const theme = new URLSearchParams(location.search).get('theme') === 'light' ? 'light' : 'dark';
  document.body.className = theme;
  document.getElementById('s').innerHTML = theme === 'light'
    ? ${JSON.stringify(stack('light'))}
    : ${JSON.stringify(stack('dark'))};
</script>
`;
writeFileSync(join(ROOT, 'sheet.html'), html);
console.log(`sheet.html: ${names.length} panels`);
