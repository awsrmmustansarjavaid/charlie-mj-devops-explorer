# Maintenance Guide

## Adding a technology

1. Add the technology to `data/devops-technologies.json`.
2. Give it a unique `id`.
3. Add its category.
4. Add a description.
5. Add aliases and keywords.
6. If it belongs to a category, add its ID to `data/devops-categories.json`.

No new click handler is required.

## Adding a category

Add a category object to:

```text
data/devops-categories.json
```

Include:

- `id`
- `name`
- `slug`
- `description`
- `technologyCount`
- `technologies`

## Adding a homepage card

Use one of:

```html
data-technology="technology-id"
```

or:

```html
data-search-query="your GitHub search"
```

Do not create a new JavaScript listener for the card.

## Before committing

Run:

```text
node --check js/app.js
node --check js/search.js
node --check js/repository-card.js
node --check js/technologies.js
node --check js/categories.js
```

Also check:

- Browser console for errors
- GitHub search works
- Technology cards search
- Category cards show their technologies
- Technology cards inside categories search
- Cloud pills search contextual queries
- Repository results display as a grid
- Avatar images remain small
- Mobile layout remains usable
- Keyboard Enter/Space activates interactive cards

## GitHub Pages

After pushing changes:

1. Confirm the commit contains the updated files.
2. Open GitHub Pages.
3. Hard-refresh the browser.
4. If the old version remains, use a private/incognito window to rule out browser cache.
