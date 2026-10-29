import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Komponenten-Dokumentation: eine MDX-Datei pro Komponente unter
 * `content/components/`. Props und Slots stehen als Daten im Frontmatter,
 * nicht im Fließtext, damit Doku-Seite und maschinenlesbare Fassung sie als
 * Tabelle bzw. Daten ausgeben können. `scripts/docs-check.mjs` hält das
 * Frontmatter mit dem Code der Komponenten zusammen.
 *
 * Ebenen (`layer`):
 *
 * - `foundation`: Tokens, Reset, Fonts, `Base.astro`. Kein sichtbarer Baustein,
 *   sondern Grundlage.
 * - `primitive`: generischer Baustein ohne Wissen über Inhalte. Funktioniert in
 *   einem Rechner genauso wie im Portfolio. Beispiele: `Callout`, `CardGrid`,
 *   `Figure`, `Prose`, `SkipLink`, `ThemeToggle`, `DefinitionRows`, `StatRow`,
 *   `Timeline`.
 * - `pattern`: zusammengesetzt und meinungsstark, aber projektunabhängig.
 *   Beispiele: `SiteHeader`, `SiteFooter`, `ProcessSteps`, `Triptych`.
 * - `portfolio`: kennt Case Studies oder deren Datenmodell und ist außerhalb des
 *   Portfolios nicht sinnvoll. Beispiele: `CaseHero`, `Chapter`, `InShort`,
 *   `NextCase`, `OutcomeList`, `MetaGrid`, `GatedImage`, `Redacted`,
 *   `ProjectList`.
 *
 * Die Grenze zwischen `primitive` und `portfolio` ist die wichtigste Angabe der
 * ganzen Dokumentation: Sie beantwortet beim Start eines neuen Projekts, was
 * mitgenommen werden kann.
 */
const components = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './content/components' }),
  schema: z.object({
    /** Dateiname der Komponente ohne Endung, z. B. "ProjectList". */
    name: z.string(),
    /** kebab-case, zugleich Dateiname und URL. */
    slug: z.string(),
    layer: z.enum(['foundation', 'primitive', 'pattern', 'portfolio']),
    status: z.enum(['draft', 'stable', 'deprecated']).default('draft'),
    /** Paketversion der Einführung, z. B. "0.2.0". */
    since: z.string(),
    /** Ein Satz, erscheint in der Liste und in llms.txt. */
    summary: z.string().max(160),
    /** Vollständiger Importpfad, copy-paste-fähig. */
    import: z.string(),
    tags: z.array(z.string()).max(5),
    props: z
      .array(
        z.object({
          name: z.string(),
          /** Als Text, exakt wie im TypeScript-Interface. */
          type: z.string(),
          required: z.boolean().default(false),
          default: z.string().optional(),
          /** Ein Satz. */
          description: z.string(),
        }),
      )
      .default([]),
    slots: z
      .array(
        z.object({
          /** "default" oder benannter Slot. */
          name: z.string(),
          description: z.string(),
        }),
      )
      .default([]),
    a11y: z.object({
      /** "none", wenn die Komponente nie Fokus nimmt. */
      keyboard: z.string(),
      /** Ausgeschrieben: "1.3.1 Info and Relationships". */
      wcag: z.array(z.string()).default([]),
    }),
    /** Slugs. */
    related: z.array(z.string()).default([]),
  }),
});

/**
 * Nur für die Typen: `ProjectList`, `CaseStudy` und `CaseStudyV2` erwarten
 * `CollectionEntry<'work'>`. Ohne diese Collection meldet `astro check` in
 * diesem Repo Fehler, obwohl die Komponenten in der App fehlerfrei laufen.
 * Das Schema ist eine Kopie aus `content.config.ts` des Portfolios und muss
 * bei Änderungen dort nachgezogen werden. Der Ordner bleibt leer, bis die
 * Doku-Seite Beispieldaten braucht.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/work' }),
  schema: ({ image }) =>
    z.object({
      /** Was gebaut wurde, nicht der Projektname. */
      title: z.string(),
      /** Kunde oder "Vertraulich". */
      client: z.string(),
      /** z. B. "Energiewirtschaft". */
      sector: z.string(),
      /** z. B. "Lead Experience Designer". */
      role: z.string(),
      /** "09/2025 – heute". */
      period: z.string(),
      /** Teamgröße und Zusammensetzung. */
      team: z.string(),
      /** Ein Satz: Problem und Ergebnis. */
      summary: z.string().max(200),
      /** Pflichtfeld: was sich verändert hat (1–3 Punkte, je maximal 70 Zeichen, damit sie auf der Karte scanbar bleiben). */
      outcome: z.array(z.string().max(70)).min(1).max(3),
      tags: z.array(z.string()),
      /** Optionaler externer Beleg (z. B. Kunden-/Case-Page). */
      reference: z
        .object({ label: z.string(), url: z.string().url() })
        .optional(),
      cover: image(),
      /**
       * Optionale dunkle Variante desselben Covers (z. B. ein Diagramm mit
       * dunklem statt hellem Bildgrund). Wird gegenläufig zum Seiten-Theme
       * gezeigt, siehe Figure.astro/CaseStudy.astro: `coverDark` im Light
       * Mode (Kontrast zum hellen Seitengrund), `cover` im Dark Mode.
       */
      coverDark: image().optional(),
      /**
       * Pflichtfeld, kein leeres alt. Bei `gate: none` das einzige Alt für das
       * Cover. Bei `gate !== 'none'` beschreibt es bewusst den öffentlichen
       * Platzhalter (siehe `cover`), nicht das echte Bild.
       */
      coverAlt: z.string().min(1),
      /**
       * Alt-Text für das ECHTE Cover, das GatedImage nach gültigem Zugangscode
       * zeigt. Nur bei `gate !== 'none'` nötig, sonst ungenutzt.
       */
      coverRealAlt: z.string().optional(),
      /** Darf der Kundenname öffentlich stehen? Betrifft nur die Namensnennung. */
      confidential: z.boolean().default(false),
      /**
       * Was liegt hinter dem Zugangscode? `none`: nichts. `images`: nur die
       * Bilddateien, Text bleibt öffentlich. `full`: Text und Bilder.
       * Unabhängig von `confidential`, das nur die Kundennennung betrifft.
       */
      gate: z.enum(['none', 'images', 'full']).default('none'),
      /**
       * 60 bis 120 Wörter, dritte Person, für die maschinenlesbare Schicht
       * (Markdown-Zwilling, llms.txt, JSON-LD). Bleibt öffentlich, auch bei
       * `gate: full`.
       */
      abstract: z.string().min(1),
      /** 4 bis 8 Methoden/Fähigkeiten, jede im Text belegt. Für die Suche. */
      methods: z.array(z.string()).min(1),
      /** Optional: 1–3 belegbare Umfangsangaben (Stufe 2 der Zahlenleiter). */
      scale: z.array(z.string()).max(3).optional(),
      order: z.number(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { components, work };
