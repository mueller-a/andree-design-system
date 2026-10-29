/**
 * Hält Code und Doku zusammen. Prüft jede Datei unter content/components/
 * gegen src/components/:
 *
 * 1. Jede Komponente hat eine Doku-Datei mit passendem `name`.
 * 2. Jede Doku-Datei verweist auf eine existierende Komponente.
 * 3. Jeder `slug` ist eindeutig und entspricht dem Dateinamen, jede
 *    Komponente hat höchstens eine Doku-Datei.
 * 4. Jeder Eintrag in `related` zeigt auf einen existierenden `slug`.
 * 5. Jedes `props[].name` steht im `interface Props` der Komponente, mit
 *    gleichem `type` (als Text) und gleicher Pflicht/Optionalität. Und
 *    umgekehrt: jede Prop im Code steht in der Doku.
 * 6. Warnung: `status: draft` bei einer Komponente, die älter ist als die
 *    aktuelle Paketversion.
 * 7. docs/ (llms.txt, Markdown je Komponente und Foundation) entspricht dem,
 *    was `pnpm docs:build` jetzt erzeugen würde. Sonst driften Quelle und
 *    ausgelieferte Fassung auseinander.
 * 8. Jede ###-Regel unter `## Rules` hat genau eine Kennung (eine Zeile nur
 *    aus `<slug>.<bereich>.<kurzname>` direkt unter der Überschrift), sie
 *    beginnt mit dem slug, und keine Kennung kommt im Repo zweimal vor.
 * 9. Nur die Abschnitte Purpose, Anatomy, Rules, Accessibility, Code, Notes,
 *    in dieser Reihenfolge; Purpose, Anatomy, Accessibility und Code Pflicht.
 *    Die Komponentenseiten teilen den Inhalt nach diesen Namen auf.
 *
 * Punkt 1 gilt schrittweise: Komponenten in content/undocumented.json erzeugen
 * nur eine Warnung. Die Liste darf nur schrumpfen. Wer eine Komponente
 * dokumentiert, streicht sie dort, sonst schlägt die Prüfung fehl. Dieselbe
 * Datei speist die Komponentenliste der Doku-Seite. Neue Komponenten kommen
 * nicht auf die Liste, sie brauchen von Anfang an eine Doku.
 *
 * Exit-Code 1 bei Fehlern, Warnungen allein brechen nichts.
 */
import { readFile, readdir } from 'node:fs/promises';
import { parse } from 'yaml';
import { generateDocs, readCommittedDocs } from './docs-generate.mjs';

const COMPONENTS_DIR = 'src/components';
const DOCS_DIR = 'content/components';
/** Gemeinsame Quelle mit der Komponentenliste der Doku-Seite. */
const UNDOCUMENTED_FILE = 'content/undocumented.json';

const UNDOCUMENTED = new Set(JSON.parse(await readFile(UNDOCUMENTED_FILE, 'utf8')));

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

/**
 * Member von `interface Props` als Map name -> { type, optional }. Trennt am
 * `;` auf oberster Klammerebene, damit Objekt-, Generic- und Tupel-Typen
 * zusammenbleiben. Kommentare werden vorher entfernt. Reicht für die
 * Schreibweise in diesem Repo, ist aber kein TypeScript-Parser.
 */
function propsMembers(block) {
  const open = block.indexOf('{');
  const close = block.lastIndexOf('}');
  if (open === -1 || close <= open) return new Map();
  const body = block
    .slice(open + 1, close)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
  const segments = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < body.length; i += 1) {
    const ch = body[i];
    if (ch === '=' && body[i + 1] === '>') {
      current += '=>';
      i += 1;
      continue;
    }
    if ('{[(<'.includes(ch)) depth += 1;
    if ('}])>'.includes(ch)) depth -= 1;
    if (ch === ';' && depth === 0) {
      segments.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  segments.push(current);
  const members = new Map();
  for (const seg of segments) {
    const m = seg.trim().match(/^(\w+)(\?)?\s*:\s*([\s\S]+)$/);
    if (m) members.set(m[1], { type: m[3].replace(/\s+/g, ' ').trim(), optional: Boolean(m[2]) });
  }
  return members;
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
  docs.push({ file, data, raw });
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
      errors.push(`${name}: ist dokumentiert, steht aber noch in content/undocumented.json, bitte streichen`);
    }
  } else if (UNDOCUMENTED.has(name)) {
    warnings.push(`${name}: noch keine Doku-Datei`);
  } else {
    errors.push(`${name}: keine Doku-Datei in ${DOCS_DIR}/ (${COMPONENTS_DIR}/${name}.astro)`);
  }
}
for (const name of UNDOCUMENTED) {
  if (!componentSet.has(name)) {
    errors.push(`${name}: steht in content/undocumented.json, die Komponente existiert aber nicht`);
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
    const members = propsMembers(block);
    const docProps = data.props ?? [];
    for (const prop of docProps) {
      const re = new RegExp(`(^|[\\s{;,])${escapeRe(prop.name)}\\??\\s*:`, 'm');
      if (!re.test(block)) {
        errors.push(`${file}: prop "${prop.name}" steht nicht im interface Props von ${data.name}.astro`);
        continue;
      }
      const member = members.get(prop.name);
      if (!member) continue;
      const docType = String(prop.type ?? '').replace(/\s+/g, ' ').trim();
      if (docType !== member.type) {
        errors.push(`${file}: prop "${prop.name}" hat type "${docType}", im Code "${member.type}"`);
      }
      const docRequired = prop.required === true;
      if (docRequired === member.optional) {
        errors.push(
          `${file}: prop "${prop.name}" ist im Code ${member.optional ? 'optional' : 'Pflicht'}, ` +
            `in der Doku required: ${docRequired}`,
        );
      }
    }
    // 5, Gegenrichtung: jede Prop im Code steht in der Doku.
    const docNames = new Set(docProps.map((p) => p.name));
    for (const name of members.keys()) {
      if (!docNames.has(name)) {
        errors.push(`${file}: prop "${name}" steht im interface Props von ${data.name}.astro, fehlt aber in der Doku`);
      }
    }
  }

  if (data.status === undefined || data.status === 'draft') {
    if (typeof data.since === 'string' && compareVersions(data.since, version) < 0) {
      warnings.push(`${file}: status draft seit ${data.since}, aktuelle Version ${version}`);
    }
  }
}

// 8 + 9: Abschnitte und Regel-Kennungen im MDX-Körper.
const SECTIONS = ['Purpose', 'Anatomy', 'Rules', 'Accessibility', 'Code', 'Notes'];
const REQUIRED = ['Purpose', 'Anatomy', 'Accessibility', 'Code'];
const ruleIds = new Map();
for (const { file, data, raw } of docs) {
  // Codeblöcke entfernen, damit Beispiele nicht als Überschriften zählen.
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').replace(/^```[\s\S]*?^```/gm, '');
  const parts = body.split(/^## (.+)$/m);
  const names = [];
  const sections = new Map();
  for (let i = 1; i < parts.length; i += 2) {
    names.push(parts[i].trim());
    sections.set(parts[i].trim(), parts[i + 1]);
  }
  const unknown = names.filter((n) => !SECTIONS.includes(n));
  if (unknown.length) errors.push(`${file}: unbekannte Abschnitte ${unknown.map((n) => `"## ${n}"`).join(', ')}`);
  for (const r of REQUIRED) if (!names.includes(r)) errors.push(`${file}: Pflichtabschnitt "## ${r}" fehlt`);
  const known = names.filter((n) => SECTIONS.includes(n));
  const ordered = [...known].sort((a, b) => SECTIONS.indexOf(a) - SECTIONS.indexOf(b));
  if (known.join() !== ordered.join()) errors.push(`${file}: Abschnitte nicht in der Reihenfolge ${SECTIONS.join(', ')}`);

  const rules = sections.get('Rules');
  if (rules === undefined) continue;
  const idRe = new RegExp(`^${escapeRe(data.slug)}\\.[a-z0-9]+(-[a-z0-9]+)*\\.[a-z0-9]+(-[a-z0-9]+)*$`);
  const blocks = rules.split(/^### (.+)$/m);
  if (blocks.length < 3) errors.push(`${file}: "## Rules" enthält keine ###-Regel`);
  for (let i = 1; i < blocks.length; i += 2) {
    const title = blocks[i].trim();
    const lines = blocks[i + 1].split('\n').map((l) => l.trim()).filter(Boolean);
    const idLines = lines.filter((l) => /^`[^`]+`$/.test(l));
    if (!lines.length || !/^`[^`]+`$/.test(lines[0]) || idLines.length !== 1) {
      errors.push(`${file}: Regel "${title}" braucht genau eine Kennung direkt unter der Überschrift`);
      continue;
    }
    const id = idLines[0].slice(1, -1);
    if (!idRe.test(id)) {
      errors.push(`${file}: Kennung "${id}" hat nicht die Form ${data.slug}.<bereich>.<kurzname>`);
    }
    if (ruleIds.has(id)) errors.push(`${file}: Kennung "${id}" gibt es schon in ${ruleIds.get(id)}`);
    else ruleIds.set(id, file);
  }
}

// 7: committete Fassung gegen frisch erzeugte.
// Scheitert der Build, die übrigen Befunde trotzdem melden: gerade bei
// kaputtem MDX sind sie die hilfreichen.
let fresh = null;
try {
  fresh = await generateDocs();
} catch (err) {
  errors.push(`docs/ konnte nicht erzeugt werden (${err.message}), Abgleich übersprungen`);
}
if (fresh) {
  const committed = await readCommittedDocs();
  const stale = [];
  for (const [path, content] of fresh) {
    if (!committed.has(path)) stale.push(`${path} fehlt`);
    else if (committed.get(path) !== content) stale.push(`${path} veraltet`);
  }
  for (const path of committed.keys()) {
    if (!fresh.has(path)) stale.push(`${path} gehört zu keiner Quelle mehr`);
  }
  if (stale.length) {
    errors.push(`docs/ passt nicht zur Quelle (${stale.join(', ')}). \`pnpm docs:build\` ausführen und committen.`);
  }
}

for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✗ ${e}`);
console.warn(
  `\n${docs.length} Doku-Dateien, ${componentNames.length} Komponenten, ${ruleIds.size} Regeln, ` +
    `${errors.length} Fehler, ${warnings.length} Warnungen.`,
);
process.exit(errors.length > 0 ? 1 : 0);
