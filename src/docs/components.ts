/**
 * Die vollständige Komponentenliste: jede Datei in src/components, mit Doku
 * aus der Collection `components` oder als "noch nicht dokumentiert" aus
 * content/undocumented.json. Dieselbe Datei nutzt docs:check, die Liste wird
 * nicht doppelt gepflegt.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import undocumented from '../../content/undocumented.json';

export type Layer = CollectionEntry<'components'>['data']['layer'];

export interface ListEntry {
  name: string;
  doc: CollectionEntry<'components'> | null;
}

const componentFiles = Object.keys(import.meta.glob('../components/*.astro'));
const componentNames = componentFiles
  .map((p) => p.split('/').pop()!.replace(/\.astro$/, ''))
  .sort((a, b) => a.localeCompare(b, 'en'));

export async function componentList(): Promise<ListEntry[]> {
  const docs = await getCollection('components');
  const byName = new Map(docs.map((d) => [d.data.name, d]));
  const pending = new Set<string>(undocumented);
  return componentNames.map((name) => {
    const doc = byName.get(name) ?? null;
    if (!doc && !pending.has(name)) {
      throw new Error(`components: ${name} hat weder Doku noch einen Eintrag in content/undocumented.json`);
    }
    return { name, doc };
  });
}

/** Dokumentierte Komponenten alphabetisch, für Seiten und Blättern. */
export async function documentedComponents() {
  const docs = await getCollection('components');
  return docs.sort((a, b) => a.data.name.localeCompare(b.data.name, 'en'));
}

export const layers: { value: Layer; label: string }[] = [
  { value: 'foundation', label: 'Foundation' },
  { value: 'primitive', label: 'Primitive' },
  { value: 'pattern', label: 'Pattern' },
  { value: 'portfolio', label: 'Portfolio' },
];
