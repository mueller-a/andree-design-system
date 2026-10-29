// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkDocSections } from './src/docs/remark/doc-sections.mjs';

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
  // Muss mit SITE_URL in src/docs/site.ts übereinstimmen.
  site: 'https://andree-design-system.vercel.app',
  output: 'static',
  integrations: [mdx({ remarkPlugins: [remarkDocSections] })],
  // Keine Syntaxhervorhebung: Shiki bringt eigene, fest eingebaute Farben mit,
  // die die Tokens umgehen und deren Kontrast in beiden Themes ungeprüft ist.
  markdown: {
    syntaxHighlight: false,
  },
  build: {
    format: 'directory',
  },
});
