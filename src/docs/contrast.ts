/**
 * Relative Luminanz und Kontrastverhältnis nach WCAG, übernommen aus der
 * Portfolio-Seite /design-system. Nur sechsstellige Hex-Werte.
 */
function lin(c: number) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string) {
  const h = hex.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`contrast: "${hex}" ist kein sechsstelliger Hex-Wert`);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function ratio(fg: string, bg: string) {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

export const fmt = (n: number) => `${n.toFixed(2)}:1`;
