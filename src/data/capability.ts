/* What he actually does.

   Drawn from the role entries in the portfolio's assets/Details.ts and from the
   case studies under assets/projects. The 85 percent is the only figure on the
   page and it comes from his own Cluely entry, so it can be defended in an
   interview. */

export interface Capability {
  label: string;
  line: string;
}

export const CAPABILITIES: Capability[] = [
  {
    label: 'Frontend',
    line: 'React and Next.js in TypeScript. Design systems, RTL Arabic, and the accessibility work that usually gets skipped.',
  },
  {
    label: 'Full product',
    line: 'Node and Postgres behind it. Stripe billing, metered APIs with rate limits, and the abuse handling a paid product needs.',
  },
  {
    label: 'Testing',
    line: 'Vitest and Playwright across web, desktop and API. At Cluely that cut test runs by 85 percent.',
  },
  {
    label: 'Design',
    line: 'I design what I build, in Figma. Brand systems, not just screens.',
  },
];

/* The stack, as Simple Icons slugs. Deliberately eight, not twenty-five: the
   old README listed Photoshop, Illustrator, XD, Bootstrap and JUnit, which read
   as an inventory rather than a specialism. */
export interface Tool {
  slug: string;
  name: string;
  /** optical size trim, same idea as the company marks: a solid glyph reads
      heavier than an outline one at identical dimensions. */
  scale?: number;
}

export const STACK: Tool[] = [
  { slug: 'typescript', name: 'TypeScript', scale: 0.88 },
  { slug: 'react', name: 'React' },
  { slug: 'nextdotjs', name: 'Next.js', scale: 0.96 },
  { slug: 'nodedotjs', name: 'Node.js' },
  { slug: 'postgresql', name: 'PostgreSQL' },
  { slug: 'supabase', name: 'Supabase', scale: 0.94 },
  { slug: 'stripe', name: 'Stripe', scale: 0.92 },
  { slug: 'tailwindcss', name: 'Tailwind CSS', scale: 1.08 },
];
