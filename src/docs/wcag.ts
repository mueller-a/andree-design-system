/**
 * Link auf die Understanding-Seite eines Kriteriums, aus dem ausgeschriebenen
 * Namen gebaut: "1.4.3 Contrast (Minimum)" -> .../contrast-minimum.html.
 */
export function understandingUrl(criterion: string): string {
  const name = criterion.replace(/^\d+\.\d+\.\d+\s+/, '');
  const slug = name
    .toLowerCase()
    .replace(/[(),]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `https://www.w3.org/WAI/WCAG22/Understanding/${slug}.html`;
}
