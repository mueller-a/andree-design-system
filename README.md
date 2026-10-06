# @andree/design-system

Dark Studio: Tokens, Astro-Komponenten und Layouts, geteilt zwischen Andrees Projekten (aktuell: das Portfolio). Kein eigenständiges Astro-Projekt — keine Pages, kein `astro.config.mjs`, nur `src/styles/`, `src/components/`, `src/layouts/`, `src/lib/`, importiert von einer konsumierenden App.

## Nutzung

Als pnpm-Workspace-Paket einbinden (`"@andree/design-system": "workspace:*"` in der konsumierenden `package.json`), dann:

```astro
---
import Base from '@andree/design-system/layouts/Base.astro';
import Chapter from '@andree/design-system/components/Chapter.astro';
import '@andree/design-system/styles/tokens.css';
---
```

`Base`, `CaseStudy`, `CaseStudyV2` und `TextPage` erwarten `site`/`nav`/`footerNav` als Props (keine App-Konfiguration ist im Package selbst fest verdrahtet — das bleibt bei der konsumierenden App).

## Tokens

- `src/styles/tokens.css` — Farben, allgemeine Typografie-Skala (`--step-*`), Case-Study-spezifische Typografie (`--text-*`), Spacing (`--space-*`)
- `src/styles/global.css`, `reset.css`, `fonts.css`

Siehe `/design-system` in der Portfolio-App für die lebende Dokumentation jeder Komponente in beiden Themes.

## Bekannte Kopplungen (noch nicht aufgelöst)

Das Package ist noch nicht vollständig app-agnostisch:

- `CaseStudy.astro`, `CaseStudyV2.astro`, `ProjectList.astro` erwarten eine Astro-Content-Collection namens `work` mit einem bestimmten Datenschema (siehe der konsumierenden App's `content.config.ts`). Eine andere App, die diese Layouts nutzen will, bräuchte dieselbe Collection-Struktur.
- `GatedImage.astro` und `src/lib/access.ts` implementieren ein Cookie-basiertes Zugangsgate, das mechanisch generisch ist, aber inhaltlich für den Zugangscode-Workflow der Portfolio-App entstanden ist.

Eine künftige Version könnte diese drei Komponenten so umbauen, dass sie Daten/Callbacks statt konkreter Collection-Typen annehmen.

## Rules & Guidelines

*(Noch zu schreiben: Must-Regeln, Should-not-Regeln, Accessibility-Guidelines.)*
