// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Das Repo ist Bibliothek und Website zugleich: `src/components`, `src/layouts`,
 * `src/lib` und `src/styles` werden als Paket ausgeliefert (siehe `files` in
 * package.json), `src/pages` wird die Doku-Seite. Bis dahin baut das Projekt
 * keine Seiten.
 */
export default defineConfig({
  output: 'static',
  build: {
    format: 'directory',
  },
});
