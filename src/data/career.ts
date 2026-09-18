/* Career, from the portfolio's assets/Details.ts. Start dates only: the panel
   is a trajectory, not a duration chart, and evenly spaced stations would be a
   lie if they claimed to be a scaled time axis.

   Procore appears twice because it happened twice. */

export interface Post {
  company: string;
  since: string;
  /** basename under logos/, produced by scripts/prep-logos.py */
  logo: string;
  /** optical size trim. A mark whose artwork fills its bounding box reads
      larger than one that floats in padding, so a few are pulled back by hand
      until the row looks evenly weighted. */
  logoScale?: number;
  current?: boolean;
}

export const CAREER: Post[] = [
  { company: 'Microsoft', since: 'Jul 2024', logo: 'microsoft', logoScale: 0.82 },
  { company: 'Siemens', since: 'Sep 2024', logo: 'siemens', logoScale: 0.86 },
  { company: 'Procore', since: 'Feb 2025', logo: 'procore' },
  { company: 'Cluely', since: 'Sep 2025', logo: 'cluely', logoScale: 0.9 },
  { company: 'Procore', since: 'Feb 2026', logo: 'procore', current: true },
];
