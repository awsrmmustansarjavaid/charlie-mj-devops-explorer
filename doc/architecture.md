# Charlie MJ DevOps Explorer — Architecture

## Purpose

Charlie MJ DevOps Explorer is a static GitHub Pages web application for discovering DevOps technologies and finding related GitHub repositories.

## Main flow

```text
index.html
   |
   v
js/app.js
   |
   +--> data/devops-technologies.json
   +--> data/devops-categories.json
   |
   +--> js/search.js
   |       |
   |       +--> js/github-api.js
   |       |
   |       +--> js/repository-card.js
   |
   +--> js/categories.js
   +--> js/technologies.js
   +--> js/filters.js
   +--> js/storage.js
   +--> js/utils.js
```

## Single CSS source

Only `css/style.css` is loaded by `index.html`.

The stylesheet contains the base styles, current visual theme, responsive layouts, interaction states and GitHub result cards.

## Data-driven design

Technologies are stored in `data/devops-technologies.json`.

Categories are stored in `data/devops-categories.json`.

Cards should use a technology ID rather than hard-coded JavaScript handlers:

```html
<div data-technology="kubernetes">
    Kubernetes
</div>
```

## Interaction design

All technology-related interactions are delegated through `initializeCardAndTagSearch()` in `js/search.js`.

This prevents duplicate listeners and makes dynamically rendered technology cards work automatically.

## Repository results

GitHub search results are rendered into `#repositoryGrid`, never into the surrounding `#repositoryResults` section.

This preserves the CSS grid wrapper and prevents results from collapsing into a single vertical list.
