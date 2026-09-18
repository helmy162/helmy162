/* Throwaway: three bold hero directions, rendered so they can be compared
   side by side rather than described. Not wired into the build. */

import { mkdirSync, writeFileSync } from 'node:fs';
import { measure, text } from '../src/type.js';

const OUT = '/private/tmp/explore';
const W = 880;
const p = (d: string, f: string, o = '') => `<path d="${d}" fill="${f}"${o}/>`;

/* ---------- A. Aurora ---------- */
function aurora(): string {
  const H = 300;
  const blob = (id: string, c: string) =>
    `<radialGradient id="${id}"><stop offset="0%" stop-color="${c}" stop-opacity="0.85"/>` +
    `<stop offset="100%" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  const name = text('Mohamed Abdelmaksoud', 56, 196, { font: 'display', size: 60, tracking: -0.025 });
  const dot = text('.', 56 + measure('Mohamed Abdelmaksoud', { font: 'display', size: 60, tracking: -0.025 }), 196, { font: 'display', size: 60 });
  const sub = text('I build things and ship them.', 56, 238, { font: 'sans', size: 23 });
  const pill = text('Software engineer at Procore', 78, 74, { font: 'mono', size: 19 });
  const pillW = measure('Software engineer at Procore', { font: 'mono', size: 19 }) + 62;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>${blob('a', '#00e0d0')}${blob('b', '#6d5cff')}${blob('c', '#1f8bff')}
<filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="72"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/><feColorMatrix type="saturate" values="0"/></filter>
<clipPath id="card"><rect width="${W}" height="${H}" rx="18"/></clipPath></defs>
<g clip-path="url(#card)">
<rect width="${W}" height="${H}" fill="#04070a"/>
<g filter="url(#soft)" opacity="0.78">
<ellipse cx="150" cy="40" rx="250" ry="150" fill="url(#a)"/>
<ellipse cx="600" cy="-30" rx="300" ry="160" fill="url(#b)"/>
<ellipse cx="900" cy="250" rx="280" ry="170" fill="url(#c)"/>
<ellipse cx="330" cy="300" rx="240" ry="120" fill="url(#a)" opacity="0.5"/></g>
<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.055"/>
<rect x="56" y="48" width="${pillW}" height="38" rx="19" fill="#ffffff" opacity="0.07"/>
<rect x="56.5" y="48.5" width="${pillW - 1}" height="37" rx="18.5" fill="none" stroke="#ffffff" stroke-opacity="0.16"/>
<circle cx="74" cy="67" r="4" fill="#00e0d0"/>
${p(pill, '#c8d3d6')}
${p(name, '#ffffff')}${p(dot, '#00e0d0')}
${p(sub, '#9fb0b4')}
</g></svg>`;
}

/* ---------- B. Terminal ---------- */
function terminal(): string {
  const H = 300;
  const mono = (s: number) => ({ font: 'mono' as const, size: s });
  const M = mono(20);
  const L = 34;
  let y = 96;
  const out: string[] = [];
  const row = (parts: Array<[string, string]>) => {
    let x = 44;
    for (const [t, c] of parts) {
      out.push(p(text(t, x, y, M), c));
      x += measure(t, M);
    }
    y += L;
  };
  row([['helmy162@procore', '#00e0d0'], [' ~ ', '#5e686e'], ['% ', '#6d5cff'], ['whoami', '#eef1f0']]);
  row([['Mohamed Abdelmaksoud', '#ffffff'], ['  ', ''], ['Software engineer', '#98a2a6']]);
  y += 6;
  row([['helmy162@procore', '#00e0d0'], [' ~ ', '#5e686e'], ['% ', '#6d5cff'], ['cat stack.json', '#eef1f0']]);
  row([['["', '#5e686e'], ['typescript', '#ffcc66'], ['", "', '#5e686e'], ['react', '#ffcc66'], ['", "', '#5e686e'], ['next', '#ffcc66'], ['", "', '#5e686e'], ['node', '#ffcc66'], ['", "', '#5e686e'], ['postgres', '#ffcc66'], ['"]', '#5e686e']]);
  y += 6;
  row([['helmy162@procore', '#00e0d0'], [' ~ ', '#5e686e'], ['% ', '#6d5cff'], ['', '#eef1f0']]);
  const cursorY = y - L - 16;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#ffffff" stop-opacity="0.05"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16" fill="#07090b" stroke="#1d262a"/>
<rect x="0.5" y="0.5" width="${W - 1}" height="120" rx="16" fill="url(#sheen)"/>
<circle cx="32" cy="34" r="6" fill="#2b3338"/><circle cx="54" cy="34" r="6" fill="#2b3338"/><circle cx="76" cy="34" r="6" fill="#2b3338"/>
${p(text('abdelmaksoud.dev', W - 44 - measure('abdelmaksoud.dev', mono(19)), 40, mono(19)), '#3f4a50')}
<path d="M24 60H${W - 24}" stroke="#141c1f"/>
${out.join('')}
<rect x="${44 + measure('helmy162@procore ~ % ', M)}" y="${cursorY}" width="12" height="24" fill="#00e0d0"/>
</svg>`;
}

/* ---------- C. Colour field ---------- */
function field(): string {
  const H = 300;
  const big = { font: 'display' as const, size: 74, tracking: -0.035 };
  const n1 = text('Mohamed', 56, 150, big);
  const n2 = text('Abdelmaksoud', 56, 232, big);
  const role = text('SOFTWARE ENGINEER', 56, 78, { font: 'monoMedium', size: 19, tracking: 0.18 });
  const at = text('PROCORE', W - 56 - measure('PROCORE', { font: 'monoMedium', size: 19, tracking: 0.18 }), 78, { font: 'monoMedium', size: 19, tracking: 0.18 });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="#00d5c8"/><stop offset="52%" stop-color="#0a8fd6"/><stop offset="100%" stop-color="#5b46e8"/></linearGradient>
<filter id="g2"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3"/><feColorMatrix type="saturate" values="0"/></filter>
<clipPath id="c2"><rect width="${W}" height="${H}" rx="18"/></clipPath></defs>
<g clip-path="url(#c2)">
<rect width="${W}" height="${H}" fill="url(#f)"/>
<rect width="${W}" height="${H}" filter="url(#g2)" opacity="0.09"/>
<path d="M0 ${H}L${W} ${H}L${W} ${H - 70}Q${W * 0.6} ${H - 10} 0 ${H - 46}Z" fill="#ffffff" opacity="0.08"/>
${p(role, '#062b32', ' opacity="0.72"')}${p(at, '#062b32', ' opacity="0.72"')}
${p(n1, '#ffffff')}${p(n2, '#ffffff')}
<circle cx="${56 + measure('Abdelmaksoud', big) + 22}" cy="224" r="11" fill="#04262c"/>
</g></svg>`;
}

mkdirSync(OUT, { recursive: true });
for (const [n, svg] of [['a-aurora', aurora()], ['b-terminal', terminal()], ['c-field', field()]] as const) {
  writeFileSync(`${OUT}/${n}.svg`, svg);
  console.log(`  ${n}  ${(svg.length / 1024).toFixed(0)} KB`);
}
