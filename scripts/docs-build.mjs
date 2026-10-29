/**
 * Schreibt die maschinenlesbare Fassung nach docs/. Das Ergebnis wird
 * committet: Das Paket wird per Git-Tag installiert, ein Build beim Install
 * ist nicht verlässlich (pnpm blockiert Lebenszyklus-Skripte standardmäßig).
 * docs-check.mjs prüft, dass docs/ zum aktuellen Stand passt.
 *
 * Von Hand gepflegte Dateien in docs/ (z. B. CLAUDE-snippet.md) bleiben
 * unberührt; nur die generierten Pfade werden ersetzt.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { generateDocs, GENERATED_DIRS, GENERATED_FILES } from './docs-generate.mjs';

const ROOT = 'docs';
const files = await generateDocs();

for (const dir of GENERATED_DIRS) await rm(join(ROOT, dir), { recursive: true, force: true });
for (const name of GENERATED_FILES) await rm(join(ROOT, name), { force: true });

for (const [path, content] of files) {
  const target = join(ROOT, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content);
}
console.warn(`docs/: ${files.size} Dateien geschrieben.`);
