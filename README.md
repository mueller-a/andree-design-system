# @andree/design-system

Dark Studio: Design-Tokens, Astro-Komponenten und Layouts, geteilt zwischen Andrees
Projekten. Entstanden im Portfolio, seit v0.2.0 ein eigenes Repository.

Das Repo ist Bibliothek und Website zugleich. Ausgeliefert werden nur
`src/components`, `src/layouts`, `src/lib`, `src/styles`, `docs` und diese README
(siehe `files` in `package.json`). Alles andere, später auch die Doku-Seite unter
`src/pages`, bleibt im Repo und landet nicht in konsumierenden Projekten.

## Installation

Das Paket liegt nicht auf npm, sondern wird über einen Git-Tag installiert:

```bash
pnpm add github:mueller-a/andree-design-system#v0.2.0
```

oder direkt in der `package.json`:

```json
"@andree/design-system": "github:mueller-a/andree-design-system#v0.2.0"
```

Astro bringt das konsumierende Projekt selbst mit (`peerDependencies`: `astro ^5.14.1`).

## Export-Pfade

| Pfad | Inhalt |
| --- | --- |
| `@andree/design-system/styles/*.css` | `tokens.css`, `reset.css`, `global.css`, `fonts.css` |
| `@andree/design-system/components/*.astro` | Einzelkomponenten, z. B. `Chapter.astro`, `Figure.astro` |
| `@andree/design-system/layouts/*.astro` | `Base`, `TextPage`, `CaseStudy`, `CaseStudyV2` |
| `@andree/design-system/lib/*` | TypeScript-Hilfen, aktuell `access` (Zugangscode-Gate) |

## Minimalbeispiel

```astro
---
import Base from '@andree/design-system/layouts/Base.astro';
import '@andree/design-system/styles/tokens.css';

const site = {
  name: 'Beispiel',
  role: 'Designer',
  url: 'https://example.com',
  lang: 'en',
  locale: 'en_GB',
  description: 'Eine Seite auf dem Design System.',
  ogDefault: '/og.png',
  email: 'hallo@example.com',
  linkedin: 'https://www.linkedin.com/in/example',
};
const nav = [{ href: '/', label: 'Home' }];
---

<Base site={site} nav={nav} footerNav={nav} title="Hallo">
  <h1>Hallo</h1>
</Base>
```

`Base.astro` lädt `fonts.css`, `tokens.css`, `reset.css` und `global.css` bereits
selbst. Der explizite Import von `tokens.css` ist nur nötig, wenn eine Seite die
Tokens ohne `Base` nutzt.

`Base`, `TextPage`, `CaseStudy` und `CaseStudyV2` erwarten `site`, `nav` und
`footerNav` als Props. Keine App-Konfiguration ist im Paket fest verdrahtet.

## Voraussetzungen in der konsumierenden App

- **Schriften:** `fonts.css` lädt Archivo und IBM Plex Mono von `/fonts/...`. Die
  Dateien `Archivo-Variable.woff2`, `Archivo-Variable-ext.woff2`,
  `IBMPlexMono-Regular.woff2` und `IBMPlexMono-Regular-ext.woff2` müssen in der App
  unter `public/fonts/` liegen.
- **Analytics:** `Base.astro` bindet `@vercel/analytics` ein. Außerhalb von Vercel
  bleibt das wirkungslos.

## Bekannte Kopplungen (noch nicht aufgelöst)

Das Paket ist noch nicht vollständig app-agnostisch:

- `CaseStudy.astro`, `CaseStudyV2.astro` und `ProjectList.astro` erwarten eine
  Astro-Content-Collection namens `work` mit dem Schema aus der
  `content.config.ts` des Portfolios. Deshalb meldet `pnpm check` in diesem Repo
  für genau diese drei Dateien Typfehler: Hier gibt es keine Collection `work`.
  In einer App mit dieser Collection laufen sie fehlerfrei.
- `GatedImage.astro` und `src/lib/access.ts` implementieren ein Cookie-basiertes
  Zugangsgate. Mechanisch generisch, inhaltlich für den Zugangscode-Ablauf des
  Portfolios entstanden. Gültige Codes kommen aus `ACCESS_CODES` in der Umgebung
  der App.

Eine künftige Version könnte diese Komponenten so umbauen, dass sie Daten oder
Callbacks statt konkreter Collection-Typen annehmen.

## Entwicklung

```bash
pnpm install
pnpm dev     # Doku-Seite (sobald src/pages existiert)
pnpm build
pnpm check
pnpm lint
```

## Versionen

Neue Versionen als Git-Tag (`v0.3.0` usw.) setzen und im konsumierenden Projekt
den Tag in der Abhängigkeit hochziehen.

## Historie

Die Commits vor v0.2.0 stammen aus dem Portfolio-Repo. Sie enthalten die
Entstehung jeder Komponente, auch aus der Zeit, bevor das Design System unter
`packages/design-system` lag.
