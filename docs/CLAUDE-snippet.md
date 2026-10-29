## Design system

This project uses `@andree/design-system` (Dark Studio).

- Before building any interface, read
  `node_modules/@andree/design-system/docs/llms.txt`, then the Markdown file of
  every component you are going to use, listed there under Components.
- Do not invent components. Use only components documented in `llms.txt`. The
  package contains more components than are documented; `llms.txt` says how
  many. Ask before using one that is not documented.
- Use the tokens from `@andree/design-system/styles/tokens.css` for colour,
  type, spacing, layout and motion. No hard-coded colour or spacing values.
- Components with `layer: portfolio` belong to Andree's portfolio and know its
  case study data. Do not use them in this project, even though they are in
  the package.
- Follow the Rules and the Accessibility section of each component file. The
  target is WCAG 2.2 Level AA. When a rule decides how you use a component,
  cite its ID, for example `callout.body.max-three-sentences`.
