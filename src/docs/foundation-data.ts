/**
 * Beschreibende Daten der Foundations, geteilt von den HTML-Seiten und der
 * Markdown-Fassung (docs/foundations/*.md). Werte kommen immer aus
 * tokens.css (siehe tokens.ts), hier steht nur, was nicht im CSS steht:
 * Verwendungszweck, übersetzt aus den Kommentaren in tokens.css, sowie
 * Gewicht und Zeilenhöhe der --text-Stufen aus der Spezifikation.
 */

export const colourTokens: [string, string][] = [
  ['mark', 'Yellow as a surface: call to action band, markers, dots, quotation marks. Decorative only.'],
  ['mark-ink', 'Text and icons on --mark surfaces.'],
  ['accent', 'Yellow as text, darkened in the light theme.'],
  ['bg', 'Page background.'],
  ['bg-glass', 'Sticky header background, meant for use with a backdrop blur.'],
  ['surface', 'Cards, meta cells, the InShort box.'],
  ['surface-hover', 'Hover state of --surface.'],
  ['ink', 'Headings, primary text, quotes.'],
  ['text', 'Body text.'],
  ['muted', 'Labels, secondary text, captions.'],
  ['border', 'Hairlines and borders.'],
  ['border-strong', 'Chips, theme toggle border.'],
  ['placeholder', 'Striped fill for labelled placeholders, such as missing images.'],
  ['focus', 'Own focus ring colour, separate from the accent.'],
];

/** Textfarben und Flächen der Kontrastmatrix. */
export const textTokens = ['ink', 'text', 'muted', 'accent'] as const;
export const surfaces = ['bg', 'surface'] as const;

export const families: [string, string][] = [
  ['font-display', 'Headlines'],
  ['font-body', 'Body text'],
  ['font-mono', 'Labels, chips, code'],
];

/* Verwendungszweck der --step-Stufen, übersetzt aus tokens.css. */
export const stepUse: Record<string, string> = {
  'step--2': 'Capital labels',
  'step-2': 'h2',
  'step-3': 'Card titles',
  'step-4': 'Detail page h1',
  'step-5': 'Home page h1',
};

/* Gewicht, Zeilenhöhe und Zweck je --text-Stufe, aus der Spezifikation. */
export const caseScale: [string, string, string, string][] = [
  ['display', '300', '1.02', 'Hero h1'],
  ['chapter', '300', '1.1', 'Lead sentence per chapter'],
  ['quote', '300', '1.22', 'Testimonial'],
  ['summary', '300', '1.28', 'TL;DR paragraph'],
  ['stat', '300', '1', 'Key figures'],
  ['step-num', '300', '1', 'Step numbers in a process'],
  ['learning', '300', '1.25', 'Learnings titles'],
  ['next', '300', '1.3', 'Next case study title'],
  ['lede', '400', '1.5', 'Hero subtitle'],
  ['title-l', '500', '', 'Step titles'],
  ['title-m', '400', '1.4', 'Triptych content'],
  ['title-s', '500', '1.3', 'Card and timeline titles'],
  ['body', '400', '1.7', 'Chapter body text'],
  ['body-s', '400', '1.55', 'InShort points, lists, definitions'],
  ['body-xs', '400', '1.55', 'Card text, stat labels'],
  ['label', '400', '', 'Mono labels, captions, roles'],
  ['label-l', '400', '', 'Chapter label, kicker, back link'],
  ['label-date', '400', '', 'Timeline dates'],
];

export const layoutTokens: [string, string][] = [
  ['measure', 'Narrow text column, for meta information and notes.'],
  ['measure-narrow', 'Narrow notes, such as Callout quiet.'],
  ['measure-wide', 'Body text column, for profile pages and chapters.'],
  ['wrap', 'Site-wide frame width.'],
  ['gutter', 'Side padding of the frame.'],
  ['meta-col', 'Label column in detail views.'],
  ['chapter-label-col', 'Maximum width of the label column in case study chapters.'],
  ['rail', 'Yellow marker edge under section marks.'],
  ['radius', 'Corner radius. None in this design, except circles.'],
];

export const motionTokens: [string, string][] = [
  ['motion-fast', 'Short transitions, such as link underlines and the skip link.'],
  ['motion-base', 'Default transitions, such as hover states on cards and buttons.'],
  ['ease', 'Easing curve for all transitions.'],
];
