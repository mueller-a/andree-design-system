/**
 * Kopfdaten für CaseHeader, aus dem Beispiel-Eintrag abgeleitet. Nicht
 * ausgeliefert (src/fixtures steht nicht in `files`).
 */
import { workEntry } from './work-entry';

export const caseHeader = {
  title: workEntry.data.title,
  client: workEntry.data.client,
  summary: workEntry.data.summary,
  index: workEntry.data.order,
  confidential: workEntry.data.confidential,
  backHref: '/',
  backLabel: 'All work',
};
