---
name: InShort
slug: in-short
layer: portfolio
status: draft
since: 0.1.0
summary: A short list of up to three points under a small label, summing up a case study chapter.
import: "@andree/design-system/components/InShort.astro"
tags:
  - case-study
  - summary
  - list
props:
  - name: points
    type: string[]
    required: true
    description: The points in display order, at most three.
  - name: label
    type: string
    required: false
    default: "'In short'"
    description: Visible label above the list, to be translated on pages in other languages.
slots: []
a11y:
  keyboard: none
  wcag:
    - 1.1.1 Non-text Content
    - 1.3.1 Info and Relationships
    - 1.4.3 Contrast (Minimum)
    - 1.4.4 Resize Text
    - 1.4.10 Reflow
    - 3.1.2 Language of Parts
related:
  - callout
---

## Purpose

InShort sums up a case study chapter in at most three points, in a box on `--surface` directly under the chapter’s lead sentence. Chapter renders it from its `inShort` prop.

## Anatomy

1. **Box**: background `--surface`.
2. **Label**: “In short” unless `label` says otherwise, in mono capitals, colour `--muted`.
3. **List**: one item per point, colour `--ink`, size `--text-body-s`.
4. **Marker**: a 9px square in `--mark` before each point, decorative only.

## Rules

### Pass at most three points

`in-short.points.max-three`

A fourth point stops the build with an error. For a longer list, use a plain list inside Prose.

### Keep each point to one sentence

`in-short.points.one-sentence`

Every point in the portfolio is one sentence. [confirm: whether this is a rule or only the current practice]

### Inside a Chapter, pass the points to Chapter

`in-short.usage.through-chapter`

Chapter’s `inShort` prop renders InShort itself and places it under the lead sentence.

### Do not use it for a single note

`in-short.usage.not-for-single-notes`

A single labelled note, such as a limit or a confidentiality notice, belongs in Callout.

## Accessibility

### Keep the points a real list

The points render as a list with `role="list"`, so screen readers announce how many points there are and where each one starts.

**WCAG:** 1.3.1 Info and Relationships

### Keep the marker silent

The square before each point carries no information beyond the list itself and is hidden from assistive technology.

**WCAG:** 1.1.1 Non-text Content

### Translate the label on pages in other languages

The default label “In short” is English and carries no language attribute of its own, so on a page in another language it is read with the wrong pronunciation unless `label` replaces it.

**WCAG:** 3.1.2 Language of Parts

### Let the heading before it carry the structure

The label is a paragraph, not a heading, so InShort relies on the heading above it. In a Chapter that is the lead sentence.

**WCAG:** 1.3.1 Info and Relationships

### Use it on `--surface` only

The label in `--muted` reaches at least 6.99:1 and the points in `--ink` at least 14.35:1 on `--surface` in both themes, measured on the portfolio’s colour table.

**WCAG:** 1.4.3 Contrast (Minimum)

### Let the text grow and wrap

Text sizes are in rem, so the points scale with the browser setting and wrap at 320px without horizontal scrolling.

**WCAG:** 1.4.4 Resize Text, 1.4.10 Reflow

## Code

Minimal:

```astro
---
import InShort from '@andree/design-system/components/InShort.astro';
---

<InShort points={['One short point.', 'Another short point.']} />
```

Realistic, through Chapter, from the situation chapter of the PRINCE case study:

```astro
---
import Chapter from '@andree/design-system/components/Chapter.astro';
---

<Chapter
  id="situation"
  label="01 · Situation"
  lead="The same study, run twice, decades apart."
  inShort={[
    'Decades of studies sat in digital archives with no way to search across them.',
    'The same test for the same substance sometimes ran again, because nobody could tell it already existed.',
    'Even once a comparable study turned up, getting its data out meant printing it and retyping it by hand: many PDFs were screenshots, not real text.',
  ]}
>
  <p>Chapter text.</p>
</Chapter>
```

## Notes

- Until 0.3.0 the label was fixed to “In short” and the three-point limit was not enforced.
- InShort is still filed as `portfolio`: it is built to sit under a chapter’s lead sentence. [confirm: whether InShort moves to `primitive` now that the label is a prop]
- Marker size and the 22px marker column are set in px instead of tokens.

## Tokens

Tokens used in the styles of InShort itself. Components it renders bring their own.

- `--mark` (Colour, foundations/colour.md)
- `--surface` (Colour, foundations/colour.md)
- `--ink` (Colour, foundations/colour.md)
- `--muted` (Colour, foundations/colour.md)
- `--font-mono` (Typography, foundations/typography.md)
- `--text-body-s` (Typography, foundations/typography.md)
- `--text-label` (Typography, foundations/typography.md)
- `--tracking-case-caps` (Typography, foundations/typography.md)
- `--space-2` (Spacing, foundations/spacing.md)
- `--space-3` (Spacing, foundations/spacing.md)
- `--space-4` (Spacing, foundations/spacing.md)
- `--space-6` (Spacing, foundations/spacing.md)
- `--space-8` (Spacing, foundations/spacing.md)
