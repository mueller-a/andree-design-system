/// <reference path="../.astro/types.d.ts" />

/**
 * Nur für `astro check` in diesem Repo. Die konsumierende App deklariert
 * ACCESS_CODES selbst; die Datei liegt außerhalb von `files` und wird nicht
 * mit ausgeliefert.
 */
interface ImportMetaEnv {
  /** Kommagetrennte Liste gültiger Zugangscodes für GatedImage und lib/access.ts. */
  readonly ACCESS_CODES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
