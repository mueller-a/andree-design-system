---
name: Callout
slug: callout
layer: primitive
status: draft
since: 0.1.0
summary: A labelled note with a yellow rail that sets one short passage apart from the text around it.
import: "@andree/design-system/components/Callout.astro"
tags:
  - content
  - emphasis
  - note
props:
  - name: label
    type: string
    required: true
    description: Visible label above the body, set in mono capitals.
  - name: variant
    type: "'default' | 'quiet'"
    required: false
    default: "'default'"
    description: "`default` runs full width at body size, `quiet` caps the width at `--measure-narrow` and sets the body one size smaller."
slots:
  - name: default
    description: The body of the note, usually one or more paragraphs.
a11y:
  keyboard: none
  wcag:
    - 1.3.1 Info and Relationships
    - 1.4.1 Use of Color
    - 1.4.3 Contrast (Minimum)
    - 1.4.4 Resize Text
    - 1.4.10 Reflow
    - 2.4.7 Focus Visible
related:
  - in-short
---

## Purpose

Callout sets one short passage apart from the text around it and names what kind of passage it is. The variants only change width, size and colour, the meaning comes from the label. In the portfolio, `default` carries what a validation did not solve, at the end of a chapter, and `quiet` carries the confidentiality notice in the case study hero.

## Anatomy

1. **Label**: a paragraph in mono capitals, colour `--muted`.
2. **Body**: the default slot. Paragraphs inside it have no outer margin.
3. **Rail**: a left border, `--rail` wide, in `--mark`. Decorative only.

| Variant | Width | Body size | Body colour |
| --- | --- | --- | --- |
| `default` | full width of the container | `--text-body` | `--ink` |
| `quiet` | at most `--measure-narrow` (520px) | `--text-body-xs` | `--text` |

## Rules

### Name the kind of note in one to three words

`callout.label.one-to-three-words`

The label is what tells the reader what kind of note follows. The portfolio uses “The limit” and “Confidential”.

### Write the label in sentence case

`callout.label.sentence-case`

The capitals come from CSS, so the label stays readable as words when styles are off.

### Keep the body to three sentences

`callout.body.max-three-sentences`

Longer passages stop being an aside and compete with the chapter text.

### Do not use it to sum up a chapter

`callout.usage.not-for-summaries`

The key points of a chapter belong in InShort.

### Do not use it for quotes

`callout.usage.not-for-quotes`

A verbatim quote belongs in Testimonial.

### Do not use it for messages the reader has to notice

`callout.usage.not-for-status-messages`

Callout is static text and is not announced as a status message. [confirm: whether the design system needs a component for status messages]

## Accessibility

### Let the label, not the rail, say what the note is

The yellow rail is a border without a text equivalent, so a reader who cannot see it or tell its colour learns the kind of note only from the label.

**WCAG:** 1.4.1 Use of Color

### Place the callout under the heading of the section it qualifies

The label is a paragraph, not a heading, so the callout does not appear in a list of headings and is found by reading the section it belongs to.

**WCAG:** 1.3.1 Info and Relationships

### Pass real paragraphs and lists into the body

The body passes its content through unchanged, so any structure a reader needs has to be in the markup that goes into the slot.

**WCAG:** 1.3.1 Info and Relationships

### Use the callout on `--bg` or `--surface` only

Label and body text reach at least 6.30:1 on both backgrounds in both themes, measured on the portfolio’s colour table. Other backgrounds are not verified.

**WCAG:** 1.4.3 Contrast (Minimum)

### Let the text grow and wrap

All text sizes are in rem and the `quiet` variant only caps the width, so text scales with the browser setting and wraps at 320px without horizontal scrolling.

**WCAG:** 1.4.4 Resize Text, 1.4.10 Reflow

### Keep links in the body visibly focused

The callout itself never takes focus. Links passed into the body get the global focus style from `global.css`, which has to be loaded on the page.

**WCAG:** 2.4.7 Focus Visible

## Code

Minimal:

```astro
---
import Callout from '@andree/design-system/components/Callout.astro';
---

<Callout label="Note">
  <p>One short passage that qualifies the section above.</p>
</Callout>
```

Realistic, at the end of a chapter in a case study:

```astro
---
import Callout from '@andree/design-system/components/Callout.astro';
---

<Callout label="The limit">
  <p>
    Access restrictions meant parts of the underlying data were not
    visible to developers on the team. That slowed feature development
    in places we couldn't fully see ourselves, and it stayed unresolved
    when I moved on in December 2023.
  </p>
</Callout>
```

## Notes

- Until 0.3.0 the variants were called `limit` and `confidential`, after their portfolio uses. `limit` became `default`, `confidential` became `quiet`.
- CaseHero renders a `quiet` Callout labelled “Confidential” itself when it receives a confidentiality note.
