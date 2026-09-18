<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/hero-light.svg">
  <img alt="Mohamed Abdelmaksoud. I build things and ship them. Software engineer at Procore Technologies." src="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/hero-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/career-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/career-light.svg">
  <img alt="Where I have worked: Microsoft from Jul 2024, Siemens from Sep 2024, Procore from Feb 2025, Cluely from Sep 2025, Procore from Feb 2026. Currently at Procore." src="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/career-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/card-frontend-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/card-frontend-light.svg">
  <img alt="Frontend. React and Next.js in TypeScript. Design systems, RTL Arabic, and the accessibility work that usually gets skipped." src="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/card-frontend-dark.svg">
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/card-full-product-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/card-full-product-light.svg">
  <img alt="Full product. Node and Postgres behind it. Stripe billing, metered APIs with rate limits, and the abuse handling a paid product needs." src="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/card-full-product-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/card-testing-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/card-testing-light.svg">
  <img alt="Testing. Vitest and Playwright across web, desktop and API. At Cluely that cut test runs by 85 percent." src="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/card-testing-dark.svg">
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/card-design-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/card-design-light.svg">
  <img alt="Design. I design what I build, in Figma. Brand systems, not just screens." src="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/card-design-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/stack-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/stack-light.svg">
  <img alt="What I build with: TypeScript, React, Next.js, Node.js, PostgreSQL, Supabase, Stripe, Tailwind CSS." src="https://raw.githubusercontent.com/helmy162/helmy162/main/assets/stack-dark.svg">
</picture>

Ask me about shipping a SaaS product end to end, or about making a large React
codebase pleasant to work in. I am deepening the backend side right now, mostly
NestJS and Express.

**Portfolio** [abdelmaksoud.dev](https://abdelmaksoud.dev)  
**Email** [mohamed@abdelmaksoud.dev](mailto:mohamed@abdelmaksoud.dev)  
**LinkedIn** [linkedin.com/in/helmy16](https://www.linkedin.com/in/helmy16)

<details>
<summary>How this page is built</summary>

Every panel above is an SVG this repository renders itself. There is no
third-party widget service anywhere on the page, which is deliberate: the
popular ones rate-limit, and the host behind the stats card in the old version
of this README had already stopped answering.

`src/` holds a small TypeScript generator. It reads the same design tokens the
portfolio at [abdelmaksoud.dev](https://abdelmaksoud.dev) uses, then draws each
panel twice, once per theme, so `<picture>` can switch between them.

An SVG loaded through `<img>` renders in the browser's secure animated mode:
no script, no interactivity, no external references, but declarative animation
still runs. That shapes everything here. It cannot fetch a webfont, so every
glyph is converted to a path outline with opentype.js at build time, which is
why the page renders in Poppins and Fira Code on your machine without
downloading either. It cannot fetch a logo either, so the company marks are
inlined as data URIs and the stack marks as raw path data. And line breaks have
to be decided at build time against the same font metrics the outlines come
from, since there is no text box left to reflow.

The motion is all SMIL: drifting gradients, a sweeping sheen, a pulse running
along the stack, and a line that types itself through three phrases. The typing
is a clip rectangle stepping through each phrase's cumulative glyph advances,
with a cursor riding the same numbers.

One rule governs every animation here. A frozen timeline snaps to an
animation's *first* value rather than to the element's static attribute, so the
first value is always the good resting state. The typing loop therefore opens
with the first phrase already typed and only types it back in at the end of the
cycle. Built the obvious way round it renders as a bare cursor anywhere the
timeline does not advance, which is exactly how an earlier version of this page
managed to hide its own logo.

```
npm install
npm run build   # render every panel, regenerate this README
```

</details>
