/* The things that are actually running.

   This is the README's answer to a contribution graph. A commit count measures
   activity on GitHub; this measures software that is up and serving people
   right now, which is the part of the work that a private-repo career hides. */

export interface Site {
  label: string;
  url: string;
  host: string;
}

export const SITES: Site[] = [
  { label: 'StealthWriter', url: 'https://stealthwriter.ai', host: 'stealthwriter.ai' },
  { label: 'Prop Metrics', url: 'https://prop-metrics.com', host: 'prop-metrics.com' },
  { label: 'CustomGPT Researcher', url: 'https://researcher.customgpt.ai', host: 'researcher.customgpt.ai' },
  { label: 'Leadly', url: 'https://leadly.sa', host: 'leadly.sa' },
  { label: 'LR(0) Parser', url: 'https://lr0parser.com', host: 'lr0parser.com' },
];

export interface SiteStatus {
  /** ISO date of the last successful check */
  lastSeen: string;
}

export interface Status {
  checkedAt: string;
  sites: Record<string, SiteStatus>;
}

/** A site drops off the panel after this long unseen, rather than turning red.
    A blip should never cost him anything; a genuinely dead product should not
    be advertised as live. */
export const STALE_AFTER_DAYS = 14;
