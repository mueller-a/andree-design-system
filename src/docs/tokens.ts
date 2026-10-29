/**
 * Liest tokens.css und global.css zur Build-Zeit. Die Foundations-Seiten
 * zeigen damit immer die echten Werte, sie können nicht mehr von den Tokens
 * abweichen wie die früher fest eingetragenen Tabellen im Portfolio.
 */
import tokensCss from '../styles/tokens.css?raw';
import globalCss from '../styles/global.css?raw';

export type Theme = 'dark' | 'light';

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Inhalt des ersten Blocks, dessen Selektor exakt `selector` ist. */
function block(css: string, selector: string): string {
  const clean = stripComments(css);
  const start = clean.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`tokens: Block "${selector}" nicht gefunden`);
  let depth = 0;
  for (let i = clean.indexOf('{', start); i < clean.length; i += 1) {
    if (clean[i] === '{') depth += 1;
    if (clean[i] === '}') {
      depth -= 1;
      if (depth === 0) return clean.slice(clean.indexOf('{', start) + 1, i);
    }
  }
  throw new Error(`tokens: Block "${selector}" nicht geschlossen`);
}

function declarations(body: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const m of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    out.set(m[1], m[2].replace(/\s+/g, ' ').trim());
  }
  return out;
}

/** :root ist der dunkle Default, [data-theme="light"] überschreibt Farben. */
const root = declarations(block(tokensCss, ':root'));
const light = declarations(block(tokensCss, '[data-theme="light"]'));

export const tokenNames = [...root.keys()];

/** Wert eines Tokens im Theme, ohne `--`. */
export function token(name: string, theme: Theme = 'dark'): string {
  const value = theme === 'light' ? (light.get(name) ?? root.get(name)) : root.get(name);
  if (value === undefined) throw new Error(`tokens: --${name} existiert nicht`);
  return value;
}

/** Ob das Token im hellen Theme einen eigenen Wert hat. */
export const hasLightValue = (name: string) => light.has(name);

/** Alle Tokens mit Präfix, in der Reihenfolge von tokens.css. */
export const tokensWithPrefix = (prefix: string) =>
  tokenNames.filter((n) => n.startsWith(prefix));

/** "2.75rem" -> 44, "12px" -> 12, sonst null. Basis 16px. */
export function toPx(value: string): number | null {
  const m = value.trim().match(/^(-?[\d.]+)(rem|px)$/);
  if (!m) return null;
  return m[2] === 'rem' ? Number(m[1]) * 16 : Number(m[1]);
}

/** Untere und obere Grenze eines clamp() oder eines festen Werts, in px. */
export function pxRange(value: string): { min: number | null; max: number | null } {
  const m = value.match(/^clamp\(\s*([^,]+),[^,]+,\s*([^)]+)\)$/);
  if (m) return { min: toPx(m[1]), max: toPx(m[2]) };
  const px = toPx(value);
  return { min: px, max: px };
}

/** Responsive Überschreibungen eines Tokens in global.css (z. B. --gutter). */
export function mediaOverrides(name: string): { query: string; value: string }[] {
  const clean = stripComments(globalCss);
  const out: { query: string; value: string }[] = [];
  const re = new RegExp(`@media\\s*\\(([^)]+)\\)\\s*\\{\\s*:root\\s*\\{([^}]*)\\}`, 'g');
  for (const m of clean.matchAll(re)) {
    const decl = declarations(m[2]).get(name);
    if (decl) out.push({ query: m[1].trim(), value: decl });
  }
  return out;
}

/* Verwendung: in welchen Dateien des Pakets ein Token per var() vorkommt. */
export const sources = import.meta.glob(
  ['../components/*.astro', '../layouts/*.astro', '../styles/*.css'],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;

export function usedIn(name: string): string[] {
  const re = new RegExp(`var\\(--${name.replace(/[-]/g, '\\-')}[,)\\s]`);
  return Object.entries(sources)
    .filter(([path, src]) => !path.endsWith('/tokens.css') && re.test(src))
    .map(([path]) => path.split('/').pop() as string)
    .sort();
}

/**
 * CSS-Regeln aus Komponenten und Layouts, die eine Schriftgröße per Token
 * setzen, mit ihrem font-weight und line-height (falls in derselben Regel).
 * Für den Abgleich der --text-Skala mit dem, was die Komponenten tun.
 */
export function fontSizeRules(): {
  file: string;
  size: string;
  weight: string | null;
  lineHeight: string | null;
}[] {
  const out = [];
  for (const [path, src] of Object.entries(sources)) {
    if (path.endsWith('/tokens.css')) continue;
    const file = path.split('/').pop() as string;
    for (const m of stripComments(src).matchAll(/[^{}]+\{([^{}]*)\}/g)) {
      const body = m[1];
      const size = body.match(/font-size:\s*var\(--([\w-]+)\)/);
      if (!size) continue;
      const weight = body.match(/font-weight:\s*([^;]+);/);
      const lh = body.match(/line-height:\s*([^;]+);/);
      out.push({
        file,
        size: size[1],
        weight: weight ? weight[1].trim() : null,
        lineHeight: lh ? lh[1].trim() : null,
      });
    }
  }
  return out;
}
