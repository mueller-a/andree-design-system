/**
 * Gemeinsame Logik der vier Unterseiten einer Komponente: Pfade, welche
 * Unterseiten es gibt, welche ##-Abschnitte auf welche Unterseite gehören und
 * das Inhaltsverzeichnis der geöffneten Unterseite.
 */
import type { CollectionEntry } from 'astro:content';
import type { MarkdownHeading } from 'astro';
import { documentedComponents } from './components';

type Doc = CollectionEntry<'components'>;
export type Subpage = 'overview' | 'rules' | 'properties' | 'accessibility';

/** ##-Abschnitte je Unterseite. Properties kommt ganz aus dem Frontmatter. */
export const SECTIONS_FOR: Record<Subpage, string[]> = {
  overview: ['purpose', 'anatomy', 'code', 'notes'],
  rules: ['rules'],
  properties: [],
  accessibility: ['accessibility'],
};

export const LABELS: Record<Subpage, string> = {
  overview: 'Overview',
  rules: 'Rules',
  properties: 'Properties',
  accessibility: 'Accessibility',
};

export const hasRules = (doc: Doc) => /^## Rules\s*$/m.test(doc.body ?? '');

/** Unterseiten einer Komponente in Navigationsreihenfolge; Rules nur, wenn vorhanden. */
export function subpagesOf(doc: Doc): { key: Subpage; label: string; href: string }[] {
  const base = `/components/${doc.data.slug}`;
  const keys: Subpage[] = ['overview', ...(hasRules(doc) ? (['rules'] as const) : []), 'properties', 'accessibility'];
  return keys.map((key) => ({
    key,
    label: LABELS[key],
    href: key === 'overview' ? base : `${base}/${key}`,
  }));
}

/** getStaticPaths für eine Unterseite; Blättern springt immer zur Komponente. */
export async function componentPaths(filter: (doc: Doc) => boolean = () => true) {
  const docs = await documentedComponents();
  return docs.filter(filter).map((doc) => {
    const i = docs.indexOf(doc);
    return {
      params: { slug: doc.data.slug },
      props: { doc, prev: docs[i - 1] ?? null, next: docs[i + 1] ?? null, all: docs },
    };
  });
}

/**
 * Überschriften eines ##-Abschnitts aus render().headings: die ##-Überschrift
 * selbst und die ### darunter, bis zum nächsten ##.
 */
export function headingsOf(headings: MarkdownHeading[], section: string) {
  const out: MarkdownHeading[] = [];
  let inside = false;
  for (const h of headings) {
    if (h.depth === 2) inside = h.text.trim().toLowerCase() === section;
    if (inside) out.push(h);
  }
  return out;
}
