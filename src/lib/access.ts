import type { AstroCookies } from 'astro';

/**
 * Gemeinsame Zugangscode-Logik, genutzt von middleware.ts (Seiten-Gate bei
 * `gate: full`), dem Bild-Endpunkt (`gate: images`/`full`) und GatedImage.astro
 * (Entscheidung Platzhalter vs. echtes Bild beim Seiten-Rendern). Ein Cookie,
 * eine Prüfung, drei Verwendungsstellen.
 */
export const ACCESS_COOKIE = 'aw_access';
export const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 Tage

/** Gültige Codes aus der Umgebung. Beispiel in .env: ACCESS_CODES="code-a,code-b" */
export function validAccessCodes(): string[] {
  const raw =
    (typeof process !== 'undefined' && process.env.ACCESS_CODES) ||
    import.meta.env.ACCESS_CODES ||
    '';
  return raw
    .split(/[,\n]/)
    .map((s) => s.trim().replace(/^["']|["']$/g, '').trim())
    .filter(Boolean);
}

/** Prüft das Zugangs-Cookie gegen die gültigen Codes. */
export function isAuthorized(cookies: AstroCookies): boolean {
  const rawToken = cookies.get(ACCESS_COOKIE)?.value ?? '';
  const token = decodeURIComponent(rawToken);
  return Boolean(token) && validAccessCodes().includes(token);
}
