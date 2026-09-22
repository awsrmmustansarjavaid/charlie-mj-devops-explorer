# CSS Guide

## Single source of truth

The project now loads only:

```text
css/style.css
```

The previous files were removed from the final project:

```text
css/components.css
css/responsive.css
css/theme-redesign.css
```

## Repository grid

The GitHub result grid uses:

```text
Large desktop: 4 columns
Desktop:       3 columns
Tablet:        2 columns
Mobile:        1 column
```

The breakpoints are:

```text
> 1240px  = 4
<=1240px  = 3
<=900px   = 2
<=560px   = 1
```

## Repository avatar

GitHub avatars are intentionally constrained to:

```css
width: 34px;
height: 34px;
```

This prevents profile pictures from dominating the repository card.

## CSS maintenance rule

Do not add a second stylesheet for a small visual change.

Add the rule to `css/style.css` under the appropriate section.

Before adding a selector, search the file for the selector first. Reuse or update the existing rule instead of creating a duplicate.

## Interactive elements

Technology and search entry points use:

```text
data-technology
data-search-query
technology-pill
```

Interactive cards also receive visible keyboard focus states.
