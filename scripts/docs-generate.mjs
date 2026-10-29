/**
 * Erzeugt die maschinenlesbare Fassung (llms.txt, llms-full.txt,
 * components/*.md, foundations/*.md) in ein temporäres Verzeichnis. Quelle
 * ist ein `astro build` in ein eigenes outDir: Die Dateien entstehen so aus
 * denselben Routen wie auf der Website, nicht aus einer zweiten Logik.
 *
 * Geteilt von docs-build.mjs (schreibt nach docs/) und docs-check.mjs
 * (vergleicht mit docs/).
 */
import { spawnSync } from 'node:child_process';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** Pfade relativ zu docs/, die der Generator verantwortet. */
export const GENERATED_DIRS = ['components', 'foundations'];
export const GENERATED_FILES = ['llms.txt', 'llms-full.txt'];

/** Map relativer Pfad -> Inhalt, frisch aus einem Build. */
export async function generateDocs() {
  const out = await mkdtemp(join(tmpdir(), 'ds-docs-'));
  try {
    const result = spawnSync('node_modules/.bin/astro', ['build', '--outDir', out, '--silent'], {
      stdio: ['ignore', 'ignore', 'inherit'],
    });
    if (result.status !== 0) throw new Error('astro build für docs/ fehlgeschlagen');

    const files = new Map();
    for (const name of GENERATED_FILES) files.set(name, await readFile(join(out, name), 'utf8'));
    for (const dir of GENERATED_DIRS) {
      for (const f of await readdir(join(out, dir))) {
        if (f.endsWith('.md')) files.set(`${dir}/${f}`, await readFile(join(out, dir, f), 'utf8'));
      }
    }
    return files;
  } finally {
    await rm(out, { recursive: true, force: true });
  }
}

/** Map relativer Pfad -> Inhalt der generierten Dateien, die heute in docs/ liegen. */
export async function readCommittedDocs(root = 'docs') {
  const files = new Map();
  for (const name of GENERATED_FILES) {
    try {
      files.set(name, await readFile(join(root, name), 'utf8'));
    } catch {
      /* fehlt */
    }
  }
  for (const dir of GENERATED_DIRS) {
    let entries = [];
    try {
      entries = await readdir(join(root, dir));
    } catch {
      /* fehlt */
    }
    for (const f of entries) {
      if (f.endsWith('.md')) files.set(`${dir}/${f}`, await readFile(join(root, dir, f), 'utf8'));
    }
  }
  return files;
}
