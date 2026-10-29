# Colour

> Colour tokens in both themes and the contrast of every text colour on every surface.

Values are read from `styles/tokens.css` of @andree/design-system 0.3.0.

## Colour tokens

Dark is the default theme. The light theme overrides the colour tokens only, and applies through the system setting or the theme toggle.

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `--mark` | `#f5c518` | `#e0b000` | Yellow as a surface: call to action band, markers, dots, quotation marks. Decorative only. |
| `--mark-ink` | `#1b1e1f` | same as dark | Text and icons on --mark surfaces. |
| `--accent` | `#f5c518` | `#7a5f00` | Yellow as text, darkened in the light theme. |
| `--bg` | `#14232d` | `#f4f3ef` | Page background. |
| `--bg-glass` | `rgba(20, 35, 45, 0.94)` | `rgba(244, 243, 239, 0.94)` | Sticky header background, meant for use with a backdrop blur. |
| `--surface` | `#1c2c36` | `#ffffff` | Cards, meta cells, the InShort box. |
| `--surface-hover` | `#22333d` | `#f4f5f8` | Hover state of --surface. |
| `--ink` | `#ffffff` | `#14232d` | Headings, primary text, quotes. |
| `--text` | `#dfe5e8` | `#24333d` | Body text. |
| `--muted` | `#c9d1d6` | `#4e5b64` | Labels, secondary text, captions. |
| `--border` | `rgba(183, 191, 204, 0.22)` | `#d9d6cf` | Hairlines and borders. |
| `--border-strong` | `#3a4b56` | `#bdb9b0` | Chips, theme toggle border. |
| `--placeholder` | `repeating-linear-gradient(135deg, rgba(183, 191, 204, 0.14) 0 8px, rgba(183, 191, 204, 0.05) 8px 16px)` | `repeating-linear-gradient(135deg, #edeef1 0 8px, #f6f7f9 8px 16px)` | Striped fill for labelled placeholders, such as missing images. |
| `--focus` | `#6faaff` | `#0a5fcc` | Own focus ring colour, separate from the accent. |

## Contrast

Every text colour against both surfaces in both themes, WCAG relative luminance. Level AA asks for at least 4.5:1 for normal text.

| Theme | Text colour | On --bg | On --surface |
| --- | --- | --- | --- |
| dark | `--ink` | 16.05:1, passes AA | 14.35:1, passes AA |
| dark | `--text` | 12.62:1, passes AA | 11.29:1, passes AA |
| dark | `--muted` | 10.38:1, passes AA | 9.28:1, passes AA |
| dark | `--accent` | 9.85:1, passes AA | 8.81:1, passes AA |
| light | `--ink` | 14.46:1, passes AA | 16.05:1, passes AA |
| light | `--text` | 11.70:1, passes AA | 13.00:1, passes AA |
| light | `--muted` | 6.30:1, passes AA | 6.99:1, passes AA |
| light | `--accent` | 5.46:1, passes AA | 6.06:1, passes AA |

`--mark` is decorative only and never used as text. Text on a `--mark` surface uses `--mark-ink`:

| Theme | --mark-ink on --mark |
| --- | --- |
| dark | 10.29:1, passes AA |
| light | 8.29:1, passes AA |
