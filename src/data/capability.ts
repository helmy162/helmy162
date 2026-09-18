/* What he actually does.

   Drawn from the role entries in the portfolio's assets/Details.ts and from the
   case studies under assets/projects. The 85 percent is the only figure on the
   page and it comes from his own Cluely entry, so it can be defended in an
   interview. */

export interface Capability {
  label: string;
  line: string;
  /** which of the three aurora hues tints this card */
  hue: 0 | 1 | 2;
}

export const CAPABILITIES: Capability[] = [
  {
    hue: 0,
    label: 'Frontend',
    line: 'React and Next.js in TypeScript. Design systems, RTL Arabic, and the accessibility work that usually gets skipped.',
  },
  {
    hue: 1,
    label: 'Full product',
    line: 'Node and Postgres behind it. Stripe billing, metered APIs with rate limits, and the abuse handling a paid product needs.',
  },
  {
    hue: 2,
    label: 'Testing',
    line: 'Vitest and Playwright across web, desktop and API. At Cluely that cut test runs by 85 percent.',
  },
  {
    hue: 0,
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
  /** the tool's own brand colour. Next.js ships black, which is invisible on a
      dark card, so it wears white here. */
  hex: string;
  /** optical size trim, same idea as the company marks: a solid glyph reads
      heavier than an outline one at identical dimensions. */
  scale?: number;
}

export const STACK: Tool[] = [
  { hex: '#3178C6', slug: 'typescript', name: 'TypeScript', scale: 0.88 },
  { hex: '#61DAFB', slug: 'react', name: 'React' },
  { hex: '#FFFFFF', slug: 'nextdotjs', name: 'Next.js', scale: 0.96 },
  { hex: '#5FA04E', slug: 'nodedotjs', name: 'Node.js' },
  { hex: '#5C9BE8', slug: 'postgresql', name: 'PostgreSQL' },
  { hex: '#3FCF8E', slug: 'supabase', name: 'Supabase', scale: 0.94 },
  { hex: '#8A83FF', slug: 'stripe', name: 'Stripe', scale: 0.92 },
  { hex: '#38BDF8', slug: 'tailwindcss', name: 'Tailwind CSS', scale: 1.08 },
];
