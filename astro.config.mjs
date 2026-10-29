// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

/**
 * Das Repo ist Bibliothek und Website zugleich: `src/components`, `src/layouts`,
 * `src/lib` und `src/styles` werden als Paket ausgeliefert (siehe `files` in
 * package.json), `src/pages` wird die Doku-Seite. Bis dahin baut das Projekt
 * keine Seiten.
 *
 * MDX, damit die Doku-Dateien unter `content/components/` echte Komponenten
 * als Live-Beispiel einbetten können.
 */
export default defineConfig({
  output: 'static',
  integrations: [mdx()],
  build: {
    format: 'directory',
  },
});
