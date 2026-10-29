# Motion

> Durations and easing, and how reduced motion overrides them.

Values are read from `styles/tokens.css` of @andree/design-system 0.3.0.

## Motion tokens

| Token | Value | Use |
| --- | --- | --- |
| `--motion-fast` | `120ms` | Short transitions, such as link underlines and the skip link. |
| `--motion-base` | `200ms` | Default transitions, such as hover states on cards and buttons. |
| `--ease` | `cubic-bezier(0.2, 0, 0, 1)` | Easing curve for all transitions. |

## Reduced motion

When the system asks for reduced motion, `reset.css` cuts every transition and animation to 0.01ms, runs animations only once and turns off smooth scrolling. Components do not need their own media query for this.
