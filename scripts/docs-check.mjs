/**
 * Hält Code und Doku zusammen. Prüft jede Datei unter content/components/
 * gegen src/components/:
 *
 * 1. Jede Komponente hat eine Doku-Datei mit passendem `name`.
 * 2. Jede Doku-Datei verweist auf eine existierende Komponente.
 * 3. Jeder `slug` ist eindeutig und entspricht dem Dateinamen, jede
 *    Komponente hat höchstens eine Doku-Datei.
 * 4. Jeder Eintrag in `related` zeigt auf einen existierenden `slug`.
 * 5. Jedes `props[].name` steht im `interface Props` der Komponente.
 * 6. Warnung: `status: draft` bei einer Komponente, die älter ist als die
 *    aktuelle Paketversion.
 *
 * Punkt 1 gilt schrittweise: Komponenten in UNDOCUMENTED erzeugen nur eine
 * Warnung. Die Liste darf nur schrumpfen. Wer eine Komponente dokumentiert,
 * streicht sie hier, sonst schlägt die Prüfung fehl. Neue Komponenten kommen
 * nicht auf die Liste, sie brauchen von Anfang an eine Doku.
 *
 * Exit-Code 1 bei Fehlern, Warnungen allein brechen nichts.
 */
import { readFile, readdir } from 'node:fs/promises';
import { parse } from 'yaml';

const COMPONENTS_DIR = 'src/components';
const DOCS_DIR = 'content/components';

const UNDOCUMENTED = new Set([
  'CardGrid',
  'CaseHeader',
  'CaseHero',
  'Chapter',
  'ChapterLabel',
  'DefinitionRows',
  'FacetDiagram',
  'Figure',
  'FlowChips',
  'GatedImage',
  'InitiativeList',
  'JourneyStrip',
  'JsonLd',
  'KnowledgeBaseChips',
  'LeadSentence',
  'Learnings',
  'MetaGrid',
  'NextCase',
  'OutcomeList',
  'PillarGrid',
  'ProcessSteps',
  'ProjectList',
  'Prose',
  'Redacted',
  'ReferenceLink',
  'SiteFooter',
  'SkipLink',
  'StatRow',
  'SubSection',
  'Testimonial',
  'ThemePreview',
  'ThemeScript',
  'ThemeToggle',
  'Timeline',
  'Triptych',
]);

const errors = [];
const warnings = [];

/** Frontmatter zwischen den ersten beiden `---`-Zeilen. */
function frontmatter(source) {
  const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

/**
 * Rumpf von `interface Props { ... }` per Klammerzählung. Fehlt das
 * Interface, gilt der ganze Frontmatter-Block als Suchraum.
 */
function propsBlock(fm) {
  const start = fm.search(/interface\s+Props\b[^{]*\{/);
  if (start === -1) return fm;
  let depth = 0;
  for (let i = fm.indexOf('{', start); i < fm.length; i += 1) {
    if (fm[i] === '{') depth += 1;
    if (fm[i] === '}') {
      depth -= 1;
      if (depth === 0) return fm.slice(start, i + 1);
    }
  }
  return fm.slice(start);
}

/** "0.10.0" > "0.9.0", ohne Abhängigkeit. */
function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const { version } = JSON.parse(await readFile('package.json', 'utf8'));

const componentNames = (await readdir(COMPONENTS_DIR))
  .filter((f) => f.endsWith('.astro'))
  .map((f) => f.replace(/\.astro$/, ''));
const componentSet = new Set(componentNames);

const docFiles = (await readdir(DOCS_DIR)).filter((f) => f.endsWith('.mdx'));
const docs = [];
for (const file of docFiles) {
  const raw = await readFile(`${DOCS_DIR}/${file}`, 'utf8');
  let data;
  try {
    data = parse(frontmatter(raw)) ?? {};
  } catch (err) {
    errors.push(`${file}: Frontmatter ist kein gültiges YAML (${err.message})`);
    continue;
  }
  docs.push({ file, data });
}

// 2 + 3: Verweis auf die Komponente, Slug eindeutig und gleich Dateiname.
// Zusätzlich: höchstens eine Doku-Datei pro Komponente.
const slugs = new Map();
const names = new Map();
for (const { file, data } of docs) {
  const expectedSlug = file.replace(/\.mdx$/, '');
  if (!data.name) {
    errors.push(`${file}: Feld "name" fehlt`);
  } else if (!componentSet.has(data.name)) {
    errors.push(`${file}: name "${data.name}" hat keine Komponente ${COMPONENTS_DIR}/${data.name}.astro`);
  }
  if (data.name && names.has(data.name)) {
    errors.push(`${file}: ${data.name} ist schon in ${names.get(data.name)} dokumentiert`);
  } else if (data.name) {
    names.set(data.name, file);
  }
  if (data.slug !== expectedSlug) {
    errors.push(`${file}: slug "${data.slug}" entspricht nicht dem Dateinamen "${expectedSlug}"`);
  }
  if (slugs.has(data.slug)) {
    errors.push(`${file}: slug "${data.slug}" ist schon vergeben (${slugs.get(data.slug)})`);
  } else {
    slugs.set(data.slug, file);
  }
}

// 1: Jede Komponente hat eine Doku-Datei.
const documented = new Set(docs.map((d) => d.data.name));
for (const name of componentNames) {
  if (documented.has(name)) {
    if (UNDOCUMENTED.has(name)) {
      errors.push(`${name}: ist dokumentiert, steht aber noch in UNDOCUMENTED (scripts/docs-check.mjs), bitte streichen`);
    }
  } else if (UNDOCUMENTED.has(name)) {
    warnings.push(`${name}: noch keine Doku-Datei`);
  } else {
    errors.push(`${name}: keine Doku-Datei in ${DOCS_DIR}/ (${COMPONENTS_DIR}/${name}.astro)`);
  }
}
for (const name of UNDOCUMENTED) {
  if (!componentSet.has(name)) {
    errors.push(`${name}: steht in UNDOCUMENTED, die Komponente existiert aber nicht`);
  }
}

// 4 + 5 + 6
for (const { file, data } of docs) {
  for (const rel of data.related ?? []) {
    if (!slugs.has(rel)) errors.push(`${file}: related "${rel}" ist kein existierender slug`);
  }

  if (componentSet.has(data.name)) {
    const source = await readFile(`${COMPONENTS_DIR}/${data.name}.astro`, 'utf8');
    const block = propsBlock(frontmatter(source));
    for (const prop of data.props ?? []) {
      const re = new RegExp(`(^|[\\s{;,])${escapeRe(prop.name)}\\??\\s*:`, 'm');
      if (!re.test(block)) {
        errors.push(`${file}: prop "${prop.name}" steht nicht im interface Props von ${data.name}.astro`);
      }
    }
  }

  if (data.status === undefined || data.status === 'draft') {
    if (typeof data.since === 'string' && compareVersions(data.since, version) < 0) {
      warnings.push(`${file}: status draft seit ${data.since}, aktuelle Version ${version}`);
    }
  }
}

for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✗ ${e}`);
console.warn(
  `\n${docs.length} Doku-Dateien, ${componentNames.length} Komponenten, ` +
    `${errors.length} Fehler, ${warnings.length} Warnungen.`,
);
process.exit(errors.length > 0 ? 1 : 0);
