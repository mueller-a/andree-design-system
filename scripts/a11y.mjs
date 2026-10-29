/**
 * axe-core-Prüfung der Doku-Seite, nach dem Vorbild des Portfolios. Erwartet
 * einen fertigen Build in dist/ (pnpm build), startet `astro preview` und
 * prüft jede gebaute Seite in hell UND dunkel.
 *
 * Strenger als im Portfolio: jeder Verstoß bricht, nicht nur "serious" und
 * "critical". Zusätzlich je Seite eine Reflow-Prüfung bei 320px (1.4.10):
 * Die Seite darf nicht breiter als der Viewport werden.
 */
import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const PORT = 4339;
const BASE = `http://localhost:${PORT}`;
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/** Alle Routen aus dist/, eine je index.html. */
async function collectRoutes(dir = 'dist') {
  const routes = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('_')) continue;
      routes.push(...(await collectRoutes(path)));
    } else if (entry.name === 'index.html') {
      const rel = relative('dist', dir).split(sep).join('/');
      routes.push(rel ? `/${rel}/` : '/');
    }
  }
  return routes.sort();
}

async function waitForServer() {
  for (let i = 0; i < 60; i += 1) {
    try {
      // Jede Antwort zählt, auch 404: es geht nur darum, ob der Server läuft.
      await fetch(`${BASE}/`);
      return;
    } catch {
      /* noch nicht bereit */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('astro preview nicht erreichbar');
}

let failures = 0;
let checks = 0;

async function checkRoute(page, scheme, route) {
  checks += 1;
  const resp = await page.goto(BASE + route, { waitUntil: 'networkidle' });
  if (!resp || resp.status() >= 400) {
    failures += 1;
    console.error(`✗ ${scheme.padEnd(5)} ${route}  HTTP ${resp?.status()}`);
    return;
  }
  const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  if (violations.length) {
    failures += 1;
    console.error(`✗ ${scheme.padEnd(5)} ${route}`);
    for (const v of violations) {
      console.error(`    [${v.impact}] ${v.id}: ${v.help}`);
      for (const node of v.nodes.slice(0, 5)) console.error(`      ${node.target.join(' ')}`);
    }
  } else {
    console.warn(`✓ ${scheme.padEnd(5)} ${route}`);
  }
}

async function checkReflow(page, route) {
  checks += 1;
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (scrollWidth > clientWidth) {
    failures += 1;
    console.error(`✗ 320px ${route}  ${scrollWidth}px breit bei ${clientWidth}px Viewport`);
  } else {
    console.warn(`✓ 320px ${route}`);
  }
}

async function run() {
  const routes = await collectRoutes();
  const server = spawn('node_modules/.bin/astro', ['preview', '--port', String(PORT)], {
    stdio: 'ignore',
  });

  try {
    await waitForServer();
    const browser = await chromium.launch();

    for (const scheme of ['light', 'dark']) {
      const context = await browser.newContext({ colorScheme: scheme });
      const page = await context.newPage();
      for (const route of routes) await checkRoute(page, scheme, route);
      await context.close();
    }

    const narrow = await browser.newContext({ viewport: { width: 320, height: 800 } });
    const page = await narrow.newPage();
    for (const route of routes) await checkReflow(page, route);
    await narrow.close();

    await browser.close();
  } finally {
    server.kill('SIGTERM');
  }

  console.warn(`\n${checks} Prüfungen, ${failures} fehlgeschlagen.`);
  process.exit(failures ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
