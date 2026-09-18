/* Selected work.

   Titles, taglines and figures are copied from the portfolio's
   assets/projects/<id>/data.ts, where each project marks one figure `hl: true`.
   That highlighted figure is the one the card shows. Nothing here is rounded up
   or invented: if a number changes there, change it here.

   `media` points at a committed crop under media/, produced by
   scripts/prep-media.py from the same screenshot the portfolio uses. */

export interface Product {
  id: string;
  title: string;
  tagline: string;
  /** the highlighted figure, split so the number can carry the accent */
  figure: string;
  figureLabel: string;
  url: string;
  host: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'stealthwriter',
    title: 'StealthWriter',
    tagline: 'Every word, human.',
    figure: '500K+',
    figureLabel: 'monthly users',
    url: 'https://stealthwriter.ai',
    host: 'stealthwriter.ai',
  },
  {
    id: 'prop-metrics',
    title: 'Prop Metrics',
    tagline: 'Every ZIP code, priced.',
    figure: '134',
    figureLabel: 'metrics per ZIP',
    url: 'https://prop-metrics.com',
    host: 'prop-metrics.com',
  },
  {
    id: 'customgpt-researcher',
    title: 'CustomGPT Researcher',
    tagline: 'Deep research, with receipts.',
    figure: '7',
    figureLabel: 'live pipeline steps',
    url: 'https://researcher.customgpt.ai',
    host: 'researcher.customgpt.ai',
  },
  {
    id: 'lr0-parser',
    title: 'LR(0) Parser',
    tagline: 'Parsing, made visible.',
    figure: '500+',
    figureLabel: 'students / mo',
    url: 'https://lr0parser.com',
    host: 'lr0parser.com',
  },
];
