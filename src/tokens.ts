/* Design tokens.

   The viridian and the mA. mark still come from the portfolio at
   abdelmaksoud.dev, but the palette is deliberately wider than the site's
   single accent: teal alone on black reads as restrained, and restrained is
   not what this page is for.

   Panels stay dark in both GitHub themes. The aurora treatment depends on a
   dark field, so rather than inventing a washed-out light twin, the card keeps
   its own surface and only its outer edge adapts. */

export type ThemeName = 'dark' | 'light';

export interface Theme {
  name: ThemeName;
  /** the card's own surface, dark in both themes */
  canvas: string;
  /** raised surface inside a card */
  panel: string;
  /** outer edge, the only thing that adapts to the host page */
  edge: string;
  line: string;
  ink: string;
  muted: string;
  dim: string;
  /** primary accent, the portfolio's viridian, brightened for a glowing field */
  accent: string;
  /** the aurora, in order of appearance */
  aura: [string, string, string];
  /** strings and highlights */
  warm: string;
}

const SHARED = {
  canvas: '#04070a',
  panel: '#0c1116',
  line: '#1b242a',
  ink: '#ffffff',
  muted: '#9fb0b4',
  dim: '#5d6b72',
  accent: '#00e0d0',
  aura: ['#00e0d0', '#6d5cff', '#1f8bff'] as [string, string, string],
  warm: '#ffcc66',
};

export const THEMES: Record<ThemeName, Theme> = {
  dark: { name: 'dark', ...SHARED, edge: '#1d272c' },
  // On a white page the same card needs a softer, lighter rim or it reads as a
  // hole punched in the page.
  light: { name: 'light', ...SHARED, edge: '#2c3a41' },
};

export const THEME_LIST: Theme[] = [THEMES.dark, THEMES.light];

export const LAYOUT = {
  /** GitHub's profile README column measures 846px; panels render near 1:1. */
  wide: 880,
  /** half-width card. Two of these plus the whitespace still fit the column,
      which is what lets them wrap to full width on a phone instead of being
      pinned side by side at 150px each. */
  card: 415,
  gutter: 56,
  radiusPanel: 18,
  radiusCard: 16,
  /** An 880 panel renders at 309px on GitHub mobile, a 0.35 scale. Anything
      below this stops being readable on a phone. */
  minFontSize: 19,
} as const;
