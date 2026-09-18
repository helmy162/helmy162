/* A typewriter that runs without script.

   The text is already outlined, so there is nothing to "type" in the usual
   sense. Instead each phrase is clipped by a rectangle whose width steps
   through that phrase's cumulative glyph advances, which reveals it one
   character at a time. A single cursor rides the same numbers.

   The loop starts with the first phrase already typed, holding, and only types
   it back in at the very end of the cycle. That ordering is the whole trick:
   a frozen timeline snaps to an animation's *first* value, not to the element's
   static attribute, so the first value has to be the state you want when
   nothing is running. Built the obvious way round, with the cycle opening on an
   empty clip, this line renders as a bare cursor anywhere the timeline does not
   advance. */

import { glyphs, measure, type TypeSpec } from './type.js';

export interface TypewriterOptions {
  x: number;
  y: number;
  spec: TypeSpec;
  colour: string;
  cursorColour: string;
  /** seconds spent typing a phrase in, holding it, and deleting it */
  typeIn?: number;
  hold?: number;
  typeOut?: number;
}

interface Track {
  values: number[];
  keyTimes: number[];
}

/** Cumulative ink width after each character, starting at 0. */
function steps(phrase: string, spec: TypeSpec): number[] {
  const out = [0];
  for (let i = 1; i <= phrase.length; i += 1) {
    out.push(measure(phrase.slice(0, i), spec));
  }
  return out;
}

/** Builds one phrase's reveal over the whole loop.

    Phrase 0 opens the cycle already typed: it holds, deletes, waits out the
    others, and types back in at the end. Every other phrase is hidden, types
    in at its turn, holds, deletes, and stays hidden. */
function track(widths: number[], slot: number, i: number, total: number, t: number[]): Track {
  const [typeIn, hold, typeOut] = t as [number, number, number];
  const n = widths.length - 1;
  const full = widths[n]!;
  const pts: Array<[number, number]> = [];

  if (i === 0) {
    pts.push([0, full], [hold, full]);
    for (let k = n; k >= 0; k -= 1) pts.push([hold + ((n - k) / n) * typeOut, widths[k]!]);
    pts.push([total - typeIn, 0]);
    for (let k = 0; k <= n; k += 1) pts.push([total - typeIn + (k / n) * typeIn, widths[k]!]);
  } else {
    const start = hold + typeOut + (i - 1) * slot;
    pts.push([0, 0], [start, 0]);
    for (let k = 0; k <= n; k += 1) pts.push([start + (k / n) * typeIn, widths[k]!]);
    pts.push([start + typeIn + hold, full]);
    for (let k = n; k >= 0; k -= 1) {
      pts.push([start + typeIn + hold + ((n - k) / n) * typeOut, widths[k]!]);
    }
    pts.push([total, 0]);
  }

  // Strictly non-decreasing keyTimes, first 0 and last 1, as SMIL requires.
  const values: number[] = [];
  const keyTimes: number[] = [];
  let last = -1;
  for (const [time, value] of pts) {
    const kt = Math.min(1, Math.max(0, time / total));
    if (kt < last) continue;
    if (kt === last && values.length) values[values.length - 1] = value;
    else {
      values.push(value);
      keyTimes.push(kt);
      last = kt;
    }
  }
  keyTimes[0] = 0;
  keyTimes[keyTimes.length - 1] = 1;
  return { values, keyTimes };
}

const fmt = (n: number[], dp = 1): string => n.map((v) => v.toFixed(dp)).join(';');

export function typewriter(phrases: string[], id: string, o: TypewriterOptions): string {
  const typeIn = o.typeIn ?? 1.7;
  const hold = o.hold ?? 2.4;
  const typeOut = o.typeOut ?? 0.7;
  const slot = typeIn + hold + typeOut;
  const total = slot * phrases.length;
  const times: [number, number, number] = [typeIn, hold, typeOut];

  const size = o.spec.size;
  const clips: string[] = [];
  const texts: string[] = [];
  const cursor: Array<[number, number]> = [];

  phrases.forEach((phrase, i) => {
    const widths = steps(phrase, o.spec);
    const tr = track(widths, slot, i, total, times);
    const clipId = `${id}-c${i}`;
    // Phrase 0 is born fully revealed, the rest hidden, so a frozen timeline
    // shows one finished sentence.
    clips.push(
      `<clipPath id="${clipId}"><rect x="${o.x}" y="${o.y - size}" height="${size * 1.4}"` +
        ` width="${i === 0 ? widths[widths.length - 1]!.toFixed(1) : 0}">` +
        `<animate attributeName="width" values="${fmt(tr.values)}"` +
        ` keyTimes="${fmt(tr.keyTimes, 4)}" dur="${total}s" calcMode="discrete"` +
        ` repeatCount="indefinite"/></rect></clipPath>`,
    );
    texts.push(
      `<g clip-path="url(#${clipId})"><path d="${glyphs(phrase, o.x, o.y, o.spec).each.join('')}"` +
        ` fill="${o.colour}"/></g>`,
    );
    tr.values.forEach((v, k) => cursor.push([tr.keyTimes[k]!, v]));
  });

  // One cursor across the whole loop, riding the union of every phrase's track.
  cursor.sort((a, b) => a[0] - b[0]);
  const ct: number[] = [];
  const cv: number[] = [];
  for (const [t, v] of cursor) {
    if (ct.length && t === ct[ct.length - 1]) cv[cv.length - 1] = Math.max(cv[cv.length - 1]!, v);
    else {
      ct.push(t);
      cv.push(v);
    }
  }
  const rest = measure(phrases[0]!, o.spec);

  return (
    `<defs>${clips.join('')}</defs>${texts.join('')}` +
    `<g transform="translate(${rest.toFixed(1)} 0)">` +
    `<animateTransform attributeName="transform" type="translate"` +
    ` values="${cv.map((v) => `${v.toFixed(1)} 0`).join(';')}" keyTimes="${fmt(ct, 4)}"` +
    ` dur="${total}s" calcMode="discrete" repeatCount="indefinite"/>` +
    `<rect x="${o.x + 5}" y="${o.y - size * 0.82}" width="${(size * 0.5).toFixed(0)}"` +
    ` height="${(size * 0.95).toFixed(0)}" rx="2" fill="${o.cursorColour}">` +
    `<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.5;1"` +
    ` dur="1.05s" repeatCount="indefinite"/></rect></g>`
  );
}
