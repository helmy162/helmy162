<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/hero-light.svg">
  <img alt="Mohamed Abdelmaksoud. I build things and ship them. Software engineer at Procore Technologies." src="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/hero-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/career-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/career-light.svg">
  <img alt="Where I have worked: Microsoft from Jul 2024, Siemens from Sep 2024, Procore from Feb 2025, Cluely from Sep 2025, Procore from Feb 2026. Currently at Procore." src="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/career-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/capability-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/capability-light.svg">
  <img alt="Frontend. React and Next.js in TypeScript. Design systems, RTL Arabic, and the accessibility work that usually gets skipped. Full product. Node and Postgres behind it. Stripe billing, metered APIs with rate limits, and the abuse handling a paid product needs. Testing. Vitest and Playwright across web, desktop and API. At Cluely that cut test runs by 85 percent. Design. I design what I build, in Figma. Brand systems, not just screens. Built with TypeScript, React, Next.js, Node.js, PostgreSQL, Supabase, Stripe, Tailwind CSS." src="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/capability-dark.svg">
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
no script, no interactivity, and no external references of any kind. That last
one has consequences. It cannot fetch a webfont, so every glyph here is
converted to a path outline with opentype.js at build time, which is why the
page renders in Poppins and Fira Code on your machine without downloading
either. It cannot fetch a logo either, so the company marks are inlined as
data URIs and the stack marks as raw path data.

It also means line breaks have to be decided at build time, against the same
font metrics the outlines come from, since there is no text box left to reflow.
The panel heights are computed from the wrapped copy rather than fixed, so
editing a sentence cannot clip a line or leave a gap.

Nothing on the page moves. A draw-in on the monogram was built first and cut:
declarative animation is supposed to survive in this mode, but it never
advanced in any environment I could test, and an animation that does not run
leaves the mark at `stroke-dashoffset: 220`, which is to say invisible. Not
worth the risk for a flourish.

```
npm install
npm run build   # render every panel, regenerate this README
```

</details>
