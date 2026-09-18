<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/hero-light.svg">
  <img alt="Mohamed Abdelmaksoud. I build things and ship them. Software engineer at Procore Technologies." src="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/hero-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/career-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/career-light.svg">
  <img alt="Microsoft from July 2024, Siemens from September 2024, Procore from February 2025, Cluely from September 2025, and Procore again from February 2026." src="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/career-dark.svg">
</picture>

<a href="https://stealthwriter.ai">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/work-stealthwriter-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/work-stealthwriter-light.svg">
  <img alt="StealthWriter. Every word, human. 500K+ monthly users." width="49%" src="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/work-stealthwriter-dark.svg">
</picture>
</a>
<a href="https://prop-metrics.com">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/work-prop-metrics-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/work-prop-metrics-light.svg">
  <img alt="Prop Metrics. Every ZIP code, priced. 134 metrics per ZIP." width="49%" src="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/work-prop-metrics-dark.svg">
</picture>
</a>

<a href="https://researcher.customgpt.ai">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/work-customgpt-researcher-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/work-customgpt-researcher-light.svg">
  <img alt="CustomGPT Researcher. Deep research, with receipts. 7 live pipeline steps." width="49%" src="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/work-customgpt-researcher-dark.svg">
</picture>
</a>
<a href="https://lr0parser.com">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/work-lr0-parser-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/work-lr0-parser-light.svg">
  <img alt="LR(0) Parser. Parsing, made visible. 500+ students / mo." width="49%" src="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/work-lr0-parser-dark.svg">
</picture>
</a>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/production-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/production-light.svg">
  <img alt="In production and answering requests: StealthWriter, Prop Metrics, CustomGPT Researcher, and the LR(0) Parser." src="https://raw.githubusercontent.com/helmy162/helmy162/panels-preview/assets/production-dark.svg">
</picture>

I work in TypeScript. React and Next.js on the front, Node and Postgres behind
it, Stripe when there is money involved. Most of what I ship is a whole product
rather than a feature, so the billing, the abuse handling and the deploy are
mine too.

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
panel twice, once for each theme, so `<picture>` can switch them. An image
cannot load a webfont, so every glyph is converted to a path outline with
opentype.js at build time. That is why this renders in Poppins and Fira Code on
your machine without downloading either.

The monogram draws itself in with the same choreography the site plays on boot,
in CSS, because an SVG loaded through `<img>` still runs declarative animation.
It respects `prefers-reduced-motion`.

The last panel is checked, not claimed. A scheduled workflow requests each
product daily and records what answered. A failure never marks anything down: a
product only leaves that row after two weeks of silence, so a cold start costs
nothing and a genuinely dead link stops being advertised as live.

```
npm install
npm run check   # ping the live products, write data/status.json
npm run build   # render every panel, regenerate this README
```

</details>
