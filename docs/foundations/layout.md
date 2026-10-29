# Layout

> Measures, frame width, gutter, columns, the rail and the radius.

Values are read from `styles/tokens.css` of @andree/design-system 0.3.0.

## Measures and frame

| Token | Value | Use |
| --- | --- | --- |
| `--measure` | `40ch` | Narrow text column, for meta information and notes. |
| `--measure-narrow` | `32.5rem` (520px) | Narrow notes, such as Callout quiet. |
| `--measure-wide` | `66ch` | Body text column, for profile pages and chapters. |
| `--wrap` | `105rem` (1680px) | Site-wide frame width. |
| `--gutter` | `3.75rem` (60px); `2.5rem` at `max-width: 64rem`; `1.5rem` at `max-width: 40rem` | Side padding of the frame. |
| `--meta-col` | `12.5rem` (200px) | Label column in detail views. |
| `--chapter-label-col` | `260px` | Maximum width of the label column in case study chapters. |
| `--rail` | `3px` | Yellow marker edge under section marks. |
| `--radius` | `0` | Corner radius. None in this design, except circles. |

The rail is a `--rail` wide edge in `--mark`. It is decorative only and never carries meaning on its own.
