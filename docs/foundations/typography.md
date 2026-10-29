# Typography

> Font families, weights, the general step scale and the 18 case study sizes.

Values are read from `styles/tokens.css` of @andree/design-system 0.3.0.

## Font families

| Token | Stack | Use |
| --- | --- | --- |
| `--font-display` | `"Archivo", "Helvetica Neue", Helvetica, system-ui, sans-serif` | Headlines |
| `--font-body` | `"Archivo", "Helvetica Neue", Helvetica, system-ui, sans-serif` | Body text |
| `--font-mono` | `"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace` | Labels, chips, code |

## Weights

| Token | Value |
| --- | --- |
| `--weight-display` | 200 |
| `--weight-subhead` | 300 |
| `--weight-body` | 400 |
| `--weight-strong` | 600 |
| `--weight-medium` | 500 |

## General scale

The site-wide fluid scale, used by the header, the footer and the page templates.

| Token | Value | Size | Use |
| --- | --- | --- | --- |
| `--step--2` | `clamp(0.63rem, 0.61rem + 0.1vw, 0.69rem)` | 10.08px to 11.04px | Capital labels |
| `--step--1` | `clamp(0.81rem, 0.78rem + 0.15vw, 0.88rem)` | 12.96px to 14.08px |  |
| `--step-0` | `clamp(1rem, 0.96rem + 0.2vw, 1.06rem)` | 16px to 16.96px |  |
| `--step-1` | `clamp(1.13rem, 1.06rem + 0.3vw, 1.25rem)` | 18.08px to 20px |  |
| `--step-2` | `clamp(1.38rem, 1.25rem + 0.6vw, 1.75rem)` | 22.08px to 28px | h2 |
| `--step-3` | `clamp(1.75rem, 1.5rem + 1.2vw, 2.5rem)` | 28px to 40px | Card titles |
| `--step-4` | `clamp(2.25rem, 1.8rem + 2.4vw, 4.13rem)` | 36px to 66.08px | Detail page h1 |
| `--step-5` | `clamp(2.75rem, 1.9rem + 4.4vw, 6.5rem)` | 44px to 104px | Home page h1 |

## Case study scale

Eighteen sizes named after their use. Size comes from the token. Weight and line height are not tokens: this table gives the values from the original specification, and each component sets them itself.

| Token | Value | Size | Weight | Line height | Use |
| --- | --- | --- | --- | --- | --- |
| `--text-display` | `clamp(2.75rem, 6.4vw, 5.5rem)` | 44px to 88px | 300 | 1.02 | Hero h1 |
| `--text-chapter` | `clamp(2.125rem, 4vw, 3.375rem)` | 34px to 54px | 300 | 1.1 | Lead sentence per chapter |
| `--text-quote` | `clamp(1.75rem, 2.8vw, 2.5rem)` | 28px to 40px | 300 | 1.22 | Testimonial |
| `--text-summary` | `clamp(1.625rem, 2.8vw, 2.375rem)` | 26px to 38px | 300 | 1.28 | TL;DR paragraph |
| `--text-stat` | `3.25rem` | 52px | 300 | 1 | Key figures |
| `--text-step-num` | `2.25rem` | 36px | 300 | 1 | Step numbers in a process |
| `--text-learning` | `1.625rem` | 26px | 300 | 1.25 | Learnings titles |
| `--text-next` | `clamp(1.25rem, 2vw, 1.625rem)` | 20px to 26px | 300 | 1.3 | Next case study title |
| `--text-lede` | `clamp(1.1875rem, 1.8vw, 1.5rem)` | 19px to 24px | 400 | 1.5 | Hero subtitle |
| `--text-title-l` | `1.375rem` | 22px | 500 | not set | Step titles |
| `--text-title-m` | `1.25rem` | 20px | 400 | 1.4 | Triptych content |
| `--text-title-s` | `1.1875rem` | 19px | 500 | 1.3 | Card and timeline titles |
| `--text-body` | `1.125rem` | 18px | 400 | 1.7 | Chapter body text |
| `--text-body-s` | `1.0625rem` | 17px | 400 | 1.55 | InShort points, lists, definitions |
| `--text-body-xs` | `1rem` | 16px | 400 | 1.55 | Card text, stat labels |
| `--text-label` | `0.75rem` | 12px | 400 | not set | Mono labels, captions, roles |
| `--text-label-l` | `0.8125rem` | 13px | 400 | not set | Chapter label, kicker, back link |
| `--text-label-date` | `0.75rem` | 12px | 400 | not set | Timeline dates |

Components that set a different weight or line height for a size:

| Component | Size | Property | Specification | Actual |
| --- | --- | --- | --- | --- |
| DefinitionRows | `--text-body-s` | line height | 1.55 | 1.6 |
| GatedImage | `--text-body` | line height | 1.7 | 1.6 |
| InShort | `--text-body-s` | line height | 1.55 | 1.5 |
| InitiativeList | `--text-body` | line height | 1.7 | 1.45 |
| JourneyStrip | `--text-label` | weight | 400 | 500 |
| Learnings | `--text-body` | line height | 1.7 | 1.6 |
| PillarGrid | `--text-body-xs` | weight | 400 | 500 |
| ProcessSteps | `--text-body-s` | line height | 1.55 | 1.6 |

## Leading and tracking

| Token | Value |
| --- | --- |
| `--leading-body` | `1.65` |
| `--leading-tight` | `0.98` |
| `--tracking-display` | `-0.04em` |
| `--tracking-tight` | `-0.02em` |
| `--tracking-caps` | `0.18em` |
| `--tracking-caps-wide` | `0.22em` |
| `--tracking-case-display` | `-0.035em` |
| `--tracking-case-chapter` | `-0.03em` |
| `--tracking-case-quote` | `-0.02em` |
| `--tracking-case-caps` | `0.2em` |
| `--tracking-case-caps-date` | `0.16em` |
