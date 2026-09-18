/* Brand tokens, lifted verbatim from the portfolio at abdelmaksoud.dev
   (app/globals.css + app/ThemeProvider.tsx). The README and the site must
   never drift: if a value changes there, change it here and rebuild.

   One accent, locked across every panel. Do not introduce a second. */

export type ThemeName = 'dark' | 'light';

export interface Theme {
  name: ThemeName;
  /** page canvas, --background */
  canvas: string;
  /** raised surface, --mae-panel */
  panel: string;
  /** structural hairline, --mae-line */
  line: string;
  /** primary text, --foreground / --mae-ink */
  ink: string;
  /** secondary text, --mae-mut */
  muted: string;
  /** tertiary text, --mae-dim */
  dim: string;
  /** viridian. The only accent. --mae-acc */
  accent: string;
  /** viridian for small text, which needs more contrast on light. */
  accentText: string;
}

export const THEMES: Record<ThemeName, Theme> = {
  dark: {
    name: 'dark',
    canvas: '#050607',
    panel: '#101314',
    line: '#24292d',
    ink: '#eef1f0',
    muted: '#98a2a6',
    dim: '#5e686e',
    accent: '#00c4c4',
    accentText: '#00c4c4',
  },
  light: {
    name: 'light',
    canvas: '#f4f6f5',
    panel: '#fbfcfc',
    line: '#dce3e1',
    ink: '#16211f',
    muted: '#5a6b66',
    dim: '#5d6f69',
    accent: '#009999',
    // #007a7a per the brand small-text contrast rule in globals.css
    accentText: '#007a7a',
  },
};

export const THEME_LIST: Theme[] = [THEMES.dark, THEMES.light];

/** Panel geometry. Widths are chosen against GitHub's README column. */
export const LAYOUT = {
  /** Full-bleed panel width. GitHub's profile column is ~880px on desktop. */
  wide: 880,
  /** Half-width card, for the 2-up work grid. */
  card: 431,
  /** Horizontal padding inside a full-bleed panel. */
  gutter: 52,
  /** Corner radius. One scale, held everywhere: 14 panels, 10 cards. */
  radiusPanel: 14,
  radiusCard: 10,
  /** Minimum on-canvas font size.
      An 880-wide panel renders at ~350px on GitHub mobile web, a 0.4x scale,
      so anything below this stops being readable on a phone. Text that cannot
      meet this bar does not belong in an image. */
  minFontSize: 19,
} as const;
