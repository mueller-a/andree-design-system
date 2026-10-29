/**
 * Beispiel-Eintrag der Collection `work` für Live-Vorschauen (ProjectList,
 * Case-Study-Layouts). Erfunden und erkennbar neutral: kein echter Kunde,
 * kein echtes Zitat, keine echten Zahlen. Füllt jedes Feld des Schemas, auch
 * die optionalen, damit die Vorschau den Vollausbau zeigt.
 *
 * src/fixtures steht nicht in `files` der package.json und wird nicht
 * ausgeliefert.
 */
import type { CollectionEntry } from 'astro:content';
import cover from './cover.png';
import coverDark from './cover-dark.png';

type WorkData = CollectionEntry<'work'>['data'];

const data: WorkData = {
  title: 'Scheduling rebuilt for a fictional clinic network',
  client: 'Example Health',
  sector: 'Healthcare (fictional)',
  role: 'Lead Experience Designer',
  period: '01/2024 – 06/2025',
  team: 'Example team: one designer, four developers, one product owner.',
  summary:
    'Placeholder case study for this documentation: a fictional scheduling tool, used to show every field of a work entry.',
  outcome: [
    'Example outcome one, shown on the card and the detail page',
    'Example outcome two, kept under seventy characters',
    'Example outcome three, the maximum the schema allows',
  ],
  tags: ['Example', 'Discovery', 'Design System'],
  reference: { label: 'Example reference', url: 'https://example.com/case' },
  cover,
  coverDark,
  coverAlt: 'Abstract placeholder layout: a header bar, a sidebar and four content panels in grey.',
  coverRealAlt: 'Placeholder for the real cover, which would sit behind an access code.',
  confidential: false,
  gate: 'none',
  abstract:
    'A fictional entry used by the documentation site to preview components that expect a work entry. It describes no real project, client or result.',
  methods: ['Example method', 'Interviews', 'Prototyping'],
  scale: ['Example scale: three fictional sites'],
  order: 1,
  draft: false,
};

export const workEntry: CollectionEntry<'work'> = {
  id: 'example-scheduling',
  collection: 'work',
  data,
};

/**
 * Dieselben Daten mit `gate: 'images'` und `confidential: true`: zeigt den
 * gesperrten Zustand (beschriftetes Raster statt Cover).
 */
export const gatedWorkEntry: CollectionEntry<'work'> = {
  id: 'example-scheduling-gated',
  collection: 'work',
  data: {
    ...data,
    title: 'The same fictional project, with its images behind an access code',
    client: 'Confidential',
    confidential: true,
    gate: 'images',
    order: 2,
  },
};
