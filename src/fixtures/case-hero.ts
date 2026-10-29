/**
 * Kopfdaten für CaseHero, aus dem Beispiel-Eintrag abgeleitet. Füllt auch
 * die optionalen Props (backHref, backLabel, confidentialNote). Nicht
 * ausgeliefert (src/fixtures steht nicht in `files`).
 */
import { workEntry } from './work-entry';

const d = workEntry.data;

export const caseHero = {
  backHref: '/',
  backLabel: 'All work',
  kicker: `${d.client} · ${d.sector}`,
  title: d.title,
  lead: d.summary,
  meta: [
    ['Role', d.role],
    ['Period', d.period],
    ['Team', d.team],
  ] as Array<[string, string]>,
  confidentialNote: 'Example note: client work under NDA, some surfaces are abstracted.',
};
