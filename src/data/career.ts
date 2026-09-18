/* Career, from the portfolio's assets/Details.ts. Start dates only: the panel
   is a trajectory, not a duration chart, and evenly spaced stations would be a
   lie if they claimed to be a scaled time axis.

   Procore appears twice because it happened twice. */

export interface Post {
  company: string;
  since: string;
  current?: boolean;
}

export const CAREER: Post[] = [
  { company: 'Microsoft', since: 'Jul 2024' },
  { company: 'Siemens', since: 'Sep 2024' },
  { company: 'Procore', since: 'Feb 2025' },
  { company: 'Cluely', since: 'Sep 2025' },
  { company: 'Procore', since: 'Feb 2026', current: true },
];
