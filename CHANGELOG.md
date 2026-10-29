# Changelog

## 0.3.0

Entkopplung vom Portfolio und Fehlerbehebung. Keine neuen Features.

### Breaking Changes

- **Callout:** `variant` heißt `'default' | 'quiet'` statt `'limit' | 'confidential'`.
  `variant="limit"` wird `variant="default"` oder entfällt, `variant="confidential"`
  wird `variant="quiet"`. Die Bedeutung trägt künftig das `label` im Aufruf.
- **Timeline:** `Phase.before` heißt `Phase.context`, die CSS-Klasse
  `timeline__item--context` statt `timeline__item--before`. Darstellung unverändert.
- **SiteHeader:** `/` gilt nur noch auf `/` als aktuelle Seite, nicht mehr auf allen
  Pfaden unter `/work`. Das alte Verhalten über die neue Prop
  `aliases={{ '/': ['/work'] }}`, auf `Base`, `TextPage`, `CaseStudy` und
  `CaseStudyV2` über `navAliases`.
- **global.css:** Die Fokus-Inversion auf gelbem Grund hängt an der Hilfsklasse
  `.on-mark` statt an `.home__cta`. Container mit `--mark`-Fläche brauchen
  `class="on-mark"`.

### Behoben

- **ThemeToggle:** kein `aria-pressed` mehr. Im hellen Modus hieß es „Light, nicht
  gedrückt“, obwohl Hell aktiv war (4.1.2 Name, Role, Value). Der Button ist jetzt
  ein gewöhnlicher Button, der zugängliche Name nennt sichtbaren Text und Aktion,
  „Dark theme, switch to light“ (2.5.3 Label in Name).
- **InShort, StatRow:** Die Obergrenzen (3 Punkte, 4 Kennzahlen) brechen den Build,
  statt nur im Kommentar zu stehen.
- **CaseHero, CaseHeader:** Der Pfeil im Zurück-Link wird nicht mehr vorgelesen.
  `backLabel` enthält nur noch den Text, Standard „All work“.

### Neu, aus der Entkopplung

- **ThemeToggle:** optionale Prop `labels` für anderssprachige Projekte.
- **InShort:** optionale Prop `label`, Standard „In short“ (3.1.2 Language of Parts).
- **SiteHeader:** optionale Prop `aliases`; `Base` und die darauf aufbauenden Layouts
  reichen sie als `navAliases` durch.

### Tokens

- Neu: `--measure-narrow` (32.5rem, 520px) für schmale Hinweise, genutzt von
  `Callout` `quiet`.

### Dokumentation

- `docs:check` vergleicht Props jetzt auch nach Typ und Pflicht und meldet Props im
  Code ohne Doku-Eintrag als Fehler.

## 0.2.0

Erste eigenständige Version, aus dem Portfolio-Repo herausgelöst.
