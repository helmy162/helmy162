/* SVG document assembly.

   Everything here targets one specific renderer: a standalone .svg served over
   HTTP and referenced from Markdown as <img>. That means no <script>, no
   external refs, no interactivity, and no hover. A <style> block *is* allowed,
   because the file is its own document rather than markup inlined into the
   README (GitHub strips inline <svg> from Markdown entirely). */

export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface DocOptions {
  width: number;
  height: number;
  /** read aloud by screen readers, and the fallback when images are blocked */
  title: string;
  /** CSS, emitted inside the document's own <style> block */
  css?: string;
  body: string;
}

export function doc({ width, height, title, css, body }: DocOptions): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"`,
    ` viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t">`,
    `<title id="t">${esc(title)}</title>`,
    css ? `<style>${css}</style>` : '',
    body,
    `</svg>`,
    '',
  ].join('');
}

/** A filled path. Used for every glyph, since all text is outlined. */
export function fill(d: string, color: string, opacity?: number): string {
  const o = opacity !== undefined && opacity < 1 ? ` opacity="${opacity}"` : '';
  return `<path d="${d}" fill="${color}"${o}/>`;
}

/** Joins a run of glyph paths into a single filled element. */
export function fillAll(ds: string[], color: string, opacity?: number): string {
  return fill(ds.join(''), color, opacity);
}

export function rect(
  x: number,
  y: number,
  w: number,
  h: number,
  attrs: { fill?: string; stroke?: string; rx?: number; opacity?: number } = {},
): string {
  const parts = [`x="${x}"`, `y="${y}"`, `width="${w}"`, `height="${h}"`];
  if (attrs.rx !== undefined) parts.push(`rx="${attrs.rx}"`);
  parts.push(`fill="${attrs.fill ?? 'none'}"`);
  if (attrs.stroke) parts.push(`stroke="${attrs.stroke}"`, 'stroke-width="1"');
  if (attrs.opacity !== undefined) parts.push(`opacity="${attrs.opacity}"`);
  return `<rect ${parts.join(' ')}/>`;
}

/** A 1px hairline. Offset by .5 so it lands on the pixel grid, not across it. */
export function hairline(
  x1: number,
  y: number,
  x2: number,
  color: string,
  opts: { opacity?: number; cls?: string } = {},
): string {
  const o = opts.opacity !== undefined && opts.opacity < 1 ? ` opacity="${opts.opacity}"` : '';
  const c = opts.cls ? ` class="${opts.cls}"` : '';
  return `<path${c} d="M${x1} ${y + 0.5}H${x2}" stroke="${color}" stroke-width="1"${o}/>`;
}

export function group(transform: string, body: string): string {
  return `<g transform="${transform}">${body}</g>`;
}
