/**
 * Konfiguration der Doku-Seite. Liegt unter src/docs/ und damit außerhalb von
 * `files`: wird nicht mit dem Paket ausgeliefert.
 */

export interface NavItem {
  href: string;
  label: string;
}

/** Öffentliche Domain, muss mit `site` in astro.config.mjs übereinstimmen. */
export const SITE_URL = 'https://andree-design-system.vercel.app';
export const PORTFOLIO_URL = 'https://andreemueller.vercel.app';
export const REPO_URL = 'https://github.com/mueller-a/andree-design-system';

export const site = {
  name: 'Dark Studio',
  role: 'Design system',
  url: SITE_URL,
  email: 'andreejoachim.mueller@gmail.com',
  linkedin: 'https://www.linkedin.com/in/andreemueller/',
  lang: 'en',
  locale: 'en_US',
  description:
    'Dark Studio, the design system behind Andree Joachim Müller’s sites: tokens, Astro components and layouts, documented with accessibility guidance.',
  // Noch kein eigenes Vorschaubild: das des Portfolios, absolut verlinkt.
  ogDefault: `${PORTFOLIO_URL}/og/default.png`,
};

export const nav: NavItem[] = [
  { href: '/', label: 'Overview' },
  { href: '/foundations/colour', label: 'Foundations' },
  { href: REPO_URL, label: 'GitHub' },
];

/** Komponentenseiten gehören zur Übersicht, alle Foundations zu "Foundations". */
export const navAliases: Record<string, string[]> = {
  '/': ['/components'],
  '/foundations/colour': ['/foundations'],
};

/** Rechtliches liegt beim Portfolio, die Erklärung zur Barrierefreiheit hier. */
export const footerNav: NavItem[] = [
  { href: `${PORTFOLIO_URL}/imprint`, label: 'Imprint' },
  { href: `${PORTFOLIO_URL}/privacy`, label: 'Privacy' },
  { href: '/accessibility', label: 'Accessibility' },
];

/** Foundations in Navigationsreihenfolge, zugleich Kacheln auf der Startseite. */
export const foundations = [
  { slug: 'colour', title: 'Colour', summary: 'Colour tokens in both themes and the contrast of every text colour on every surface.' },
  { slug: 'typography', title: 'Typography', summary: 'Font families, weights, the general step scale and the 18 case study sizes, with specimens.' },
  { slug: 'spacing', title: 'Spacing', summary: 'The 4px-based space scale, from 4 to 128px.' },
  { slug: 'layout', title: 'Layout', summary: 'Measures, frame width, gutter, columns, the rail and the radius.' },
  { slug: 'motion', title: 'Motion', summary: 'Durations and easing, and how reduced motion overrides them.' },
] as const;
