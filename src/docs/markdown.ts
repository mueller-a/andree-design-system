/**
 * Maschinenlesbare Fassung der Doku: Markdown je Komponente und Foundation,
 * dazu llms.txt und llms-full.txt. Dieselben Texte liefern die Routen der
 * Website und, über `pnpm docs:build`, die committeten Dateien unter docs/.
 *
 * Komponenten zweigleisig, nicht aus der gerenderten Seite:
 * - Frontmatter direkt aus der Collection als YAML, alle Felder unverändert.
 * - Fließtext: der MDX-Körper, per Container API zu HTML gerendert, ohne die
 *   Knoten mit data-doc-skip (Live-Vorschauen), dann per turndown zu
 *   Markdown. Codeblöcke bleiben Fences.
 *
 * Links sind relativ (components/<slug>.md), damit sie im Paket unter
 * node_modules ebenso funktionieren wie auf der Website.
 */
import { render, type CollectionEntry } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx';
import TurndownService from 'turndown';
// @ts-expect-error turndown-plugin-gfm bringt keine Typen mit
import { gfm } from 'turndown-plugin-gfm';
import { stringify } from 'yaml';
import pkg from '../../package.json';
import { componentList, documentedComponents } from './components';
import { foundations, SITE_URL } from './site';
import { token, hasLightValue, tokensWithPrefix, toPx, mediaOverrides, type Theme } from './tokens';
import { ratio, fmt } from './contrast';
import {
  colourTokens,
  textTokens,
  surfaces,
  families,
  stepUse,
  caseScale,
  layoutTokens,
  motionTokens,
  sizeRange,
  specDeviations,
} from './foundation-data';

type Doc = CollectionEntry<'components'>;

/* ---------- HTML zu Markdown ---------- */

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  fence: '```',
  bulletListMarker: '-',
  emDelimiter: '_',
});
turndown.use(gfm);
turndown.remove(['style', 'script']);
turndown.remove(
  (node) => node.nodeType === 1 && (node as HTMLElement).hasAttribute('data-doc-skip'),
);
// Listenpunkte mit einem Leerzeichen statt turndowns "-   ".
turndown.addRule('listItem', {
  filter: 'li',
  replacement(content, node) {
    const parent = node.parentNode as HTMLElement | null;
    let prefix = '- ';
    if (parent?.nodeName === 'OL') {
      const start = Number(parent.getAttribute('start') ?? 1);
      prefix = `${start + Array.prototype.indexOf.call(parent.children, node)}. `;
    }
    const body = content
      .replace(/^\n+/, '')
      .replace(/\n+$/, '\n')
      .replace(/\n/gm, `\n${' '.repeat(prefix.length)}`);
    return prefix + body + (node.nextSibling && !body.endsWith('\n') ? '\n' : '');
  },
});

function htmlToMarkdown(html: string): string {
  return (
    turndown
      .turndown(html)
      // Eckige Klammern ohne Link dahinter brauchen keine Maskierung, sie
      // machen nur [confirm: …]-Stellen schwerer lesbar.
      .replace(/\\([[\]])/g, '$1')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

let container: AstroContainer | undefined;
async function mdxToHtml(doc: Doc): Promise<string> {
  if (!container) {
    const renderers = await loadRenderers([getMDXRenderer()]);
    container = await AstroContainer.create({ renderers });
  }
  const { Content } = await render(doc);
  return container.renderToString(Content);
}

/** Bricht ab, wenn die Ausgabe Reste enthält, die dort nichts zu suchen haben. */
function assertClean(name: string, md: string): string {
  const problems: string[] = [];
  if (/^#{1,6}\s*$/m.test(md)) problems.push('leere Überschrift');
  if (/data-doc-|<figure|<\/?div|Live preview/i.test(md)) problems.push('Reste einer Vorschau');
  if (/!\[[^\]]*\]\(/.test(md)) problems.push('Bildverweis');
  if (/(\/Users\/|\/home\/|[A-Z]:\\)/.test(md)) problems.push('lokaler absoluter Pfad');
  if (problems.length) throw new Error(`markdown: ${name}: ${problems.join(', ')}`);
  return md;
}

/* ---------- Komponenten ---------- */

const frontmatter = (data: Record<string, unknown>) =>
  `---\n${stringify(data, { lineWidth: 0 }).trimEnd()}\n---`;

async function componentBody(doc: Doc): Promise<string> {
  return htmlToMarkdown(await mdxToHtml(doc));
}

/** docs/components/<slug>.md: Frontmatter aus der Collection plus Fließtext. */
export async function componentMarkdown(doc: Doc): Promise<string> {
  const md = `${frontmatter(doc.data)}\n\n${await componentBody(doc)}\n`;
  return assertClean(`components/${doc.data.slug}.md`, md);
}

/* ---------- Foundations ---------- */

const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
function table(head: string[], rows: string[][]): string {
  return [
    `| ${head.map(cell).join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`),
  ].join('\n');
}
const code = (s: string) => `\`${s}\``;
const themes: Theme[] = ['dark', 'light'];

function colourMd(): string {
  const verdict = (v: number) => `${fmt(v)}, ${v >= 4.5 ? 'passes AA' : 'fails AA'}`;
  return [
    '## Colour tokens',
    '',
    'Dark is the default theme. The light theme overrides the colour tokens only, and applies through the system setting or the theme toggle.',
    '',
    table(
      ['Token', 'Dark', 'Light', 'Use'],
      colourTokens.map(([name, use]) => [
        code(`--${name}`),
        code(token(name, 'dark')),
        hasLightValue(name) ? code(token(name, 'light')) : 'same as dark',
        use,
      ]),
    ),
    '',
    '## Contrast',
    '',
    'Every text colour against both surfaces in both themes, WCAG relative luminance. Level AA asks for at least 4.5:1 for normal text.',
    '',
    table(
      ['Theme', 'Text colour', 'On --bg', 'On --surface'],
      themes.flatMap((theme) =>
        textTokens.map((t) => [
          theme,
          code(`--${t}`),
          ...surfaces.map((s) => verdict(ratio(token(t, theme), token(s, theme)))),
        ]),
      ),
    ),
    '',
    '`--mark` is decorative only and never used as text. Text on a `--mark` surface uses `--mark-ink`:',
    '',
    table(
      ['Theme', '--mark-ink on --mark'],
      themes.map((theme) => [theme, verdict(ratio(token('mark-ink', theme), token('mark', theme)))]),
    ),
  ].join('\n');
}

function typographyMd(): string {
  const deviations = specDeviations();
  return [
    '## Font families',
    '',
    table(['Token', 'Stack', 'Use'], families.map(([n, use]) => [code(`--${n}`), code(token(n)), use])),
    '',
    '## Weights',
    '',
    table(['Token', 'Value'], tokensWithPrefix('weight-').map((n) => [code(`--${n}`), token(n)])),
    '',
    '## General scale',
    '',
    'The site-wide fluid scale, used by the header, the footer and the page templates.',
    '',
    table(
      ['Token', 'Value', 'Size', 'Use'],
      tokensWithPrefix('step-').map((n) => [code(`--${n}`), code(token(n)), sizeRange(token(n)), stepUse[n] ?? '']),
    ),
    '',
    '## Case study scale',
    '',
    'Eighteen sizes named after their use. Size comes from the token. Weight and line height are not tokens: this table gives the values from the original specification, and each component sets them itself.',
    '',
    table(
      ['Token', 'Value', 'Size', 'Weight', 'Line height', 'Use'],
      caseScale.map(([n, w, lh, use]) => [
        code(`--text-${n}`),
        code(token(`text-${n}`)),
        sizeRange(token(`text-${n}`)),
        w,
        lh || 'not set',
        use,
      ]),
    ),
    ...(deviations.length
      ? [
          '',
          'Components that set a different weight or line height for a size:',
          '',
          table(
            ['Component', 'Size', 'Property', 'Specification', 'Actual'],
            deviations.map((d) => [d.file.replace(/\.(astro|css)$/, ''), code(`--text-${d.token}`), d.what, d.spec, d.actual]),
          ),
        ]
      : []),
    '',
    '## Leading and tracking',
    '',
    table(
      ['Token', 'Value'],
      [...tokensWithPrefix('leading-'), ...tokensWithPrefix('tracking-')].map((n) => [code(`--${n}`), code(token(n))]),
    ),
  ].join('\n');
}

function spacingMd(): string {
  return [
    '## Space scale',
    '',
    'One site-wide scale on a 4px grid. There is no second numbered scale.',
    '',
    table(
      ['Token', 'Value', 'Pixels'],
      tokensWithPrefix('space-').map((n) => [code(`--${n}`), code(token(n)), `${toPx(token(n))}px`]),
    ),
  ].join('\n');
}

function layoutMd(): string {
  return [
    '## Measures and frame',
    '',
    table(
      ['Token', 'Value', 'Use'],
      layoutTokens.map(([n, use]) => {
        const v = token(n);
        const px = toPx(v);
        const extra = mediaOverrides(n).map((o) => `; ${code(o.value)} at ${code(o.query)}`).join('');
        return [code(`--${n}`), `${code(v)}${px !== null && v.endsWith('rem') ? ` (${px}px)` : ''}${extra}`, use];
      }),
    ),
    '',
    'The rail is a `--rail` wide edge in `--mark`. It is decorative only and never carries meaning on its own.',
  ].join('\n');
}

function motionMd(): string {
  return [
    '## Motion tokens',
    '',
    table(['Token', 'Value', 'Use'], motionTokens.map(([n, use]) => [code(`--${n}`), code(token(n)), use])),
    '',
    '## Reduced motion',
    '',
    'When the system asks for reduced motion, `reset.css` cuts every transition and animation to 0.01ms, runs animations only once and turns off smooth scrolling. Components do not need their own media query for this.',
  ].join('\n');
}

const foundationBodies: Record<string, () => string> = {
  colour: colourMd,
  typography: typographyMd,
  spacing: spacingMd,
  layout: layoutMd,
  motion: motionMd,
};

/** docs/foundations/<slug>.md */
export function foundationMarkdown(slug: string): string {
  const f = foundations.find((x) => x.slug === slug);
  const body = foundationBodies[slug];
  if (!f || !body) throw new Error(`markdown: unbekannte Foundation "${slug}"`);
  const md = [
    `# ${f.title}`,
    '',
    `> ${f.summary}`,
    '',
    `Values are read from \`styles/tokens.css\` of @andree/design-system ${pkg.version}.`,
    '',
    body(),
    '',
  ].join('\n');
  return assertClean(`foundations/${slug}.md`, md);
}

/* ---------- llms.txt ---------- */

const layerLines = [
  '- `foundation`: tokens, reset, fonts, `Base.astro`. Not a visible building block but the base everything sits on.',
  '- `primitive`: a generic building block with no knowledge of content. Works in a calculator as well as in a portfolio.',
  '- `pattern`: composed and opinionated, but independent of any project.',
  '- `portfolio`: knows case studies or their data model. Not meaningful outside the portfolio, do not use it in other projects.',
];

/** Kopf von llms.txt, auch Anfang von llms-full.txt. */
async function llmsIndex(withOptional: boolean): Promise<string> {
  const entries = await componentList();
  const docs = await documentedComponents();
  const pending = entries.length - docs.length;
  const tag = `v${pkg.version}`;

  return [
    '# Dark Studio design system',
    '',
    `> Design tokens, Astro components and layouts by Andree Joachim Müller, published as @andree/design-system ${pkg.version}.`,
    '',
    'The package is not on npm. Install it from a Git tag:',
    '',
    '```sh',
    `pnpm add github:mueller-a/andree-design-system#${tag}`,
    '```',
    '',
    'Import paths: `@andree/design-system/styles/*.css`, `@andree/design-system/components/*.astro`, `@andree/design-system/layouts/*.astro`, `@andree/design-system/lib/*`. Pages built on `layouts/Base.astro` load the tokens, the reset and the global styles. The app provides the fonts and `theme-init.js` in its `public` folder. Use tokens from `styles/tokens.css`, never hard-coded colour or spacing values.',
    '',
    `Human-readable documentation: ${SITE_URL}`,
    '',
    '## Layers',
    '',
    'Every component has a layer. It says whether the component can be used outside the portfolio.',
    '',
    ...layerLines,
    '',
    '## Foundations',
    '',
    ...foundations.map((f) => `- [${f.title}](foundations/${f.slug}.md): ${f.summary}`),
    '',
    '## Components',
    '',
    ...docs.map(
      (d) =>
        `- [${d.data.name}](components/${d.data.slug}.md): ${d.data.summary} Layer: ${d.data.layer}. Status: ${d.data.status}. Import: \`${d.data.import}\`.`,
    ),
    '',
    `${pending} more components are in the package but not documented yet, so this list is not the full package content. They are not listed here. Do not use one without asking first.`,
    ...(withOptional
      ? [
          '',
          '## Optional',
          '',
          '- [llms-full.txt](llms-full.txt): this index, every foundation and every component file in one document.',
        ]
      : []),
    '',
  ].join('\n');
}

export async function llmsTxt(): Promise<string> {
  return assertClean('llms.txt', await llmsIndex(true));
}

/** Alles in einer Datei: Index, Foundations, Komponenten (Frontmatter als YAML-Block). */
export async function llmsFullTxt(): Promise<string> {
  const parts = [await llmsIndex(false)];
  for (const f of foundations) parts.push(foundationMarkdown(f.slug).replace(/^# /, '# Foundation: '));
  for (const doc of await documentedComponents()) {
    parts.push(
      [
        `# Component: ${doc.data.name}`,
        '',
        '```yaml',
        stringify(doc.data, { lineWidth: 0 }).trimEnd(),
        '```',
        '',
        await componentBody(doc),
        '',
      ].join('\n'),
    );
  }
  return assertClean('llms-full.txt', parts.join('\n'));
}
