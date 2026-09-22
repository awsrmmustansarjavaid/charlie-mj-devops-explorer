# Testing Checklist

## Main search

- [ ] Enter `Kubernetes` and press Enter.
- [ ] Click `Search GitHub` with `Kubernetes` entered.
- [ ] Confirm the grid renders multiple cards.
- [ ] Confirm cards appear in 4/3/2/1 responsive columns.
- [ ] Confirm GitHub avatars are small and contained.

## Cloud cards

- [ ] Click Amazon Web Services.
- [ ] Confirm `Amazon Web Services` is written into the main search box.
- [ ] Confirm the search starts automatically.
- [ ] Click AWS `DevOps`.
- [ ] Confirm the query becomes `Amazon Web Services DevOps`.
- [ ] Repeat for Azure and Google Cloud.

## Category cards

- [ ] Click `Version Control`.
- [ ] Confirm its search starts automatically.
- [ ] Confirm its technologies are displayed.
- [ ] Click `Git` from the category technology list.
- [ ] Confirm the query contains `Version Control Git`.

## Technology pills

- [ ] Click Jenkins under CI/CD.
- [ ] Confirm the query contains `CI/CD Jenkins`.
- [ ] Click Terraform under Infrastructure as Code.
- [ ] Confirm the query contains `Infrastructure as Code Terraform`.
- [ ] Click Docker under Container Technologies.
- [ ] Confirm the query contains the container context and Docker.

## Pagination

- [ ] Search a broad term such as `Kubernetes`.
- [ ] Confirm page numbers appear when more than one page exists.
- [ ] Click page 2.
- [ ] Confirm the visible cards change to page 2.
- [ ] Click `See more`.
- [ ] Confirm the next page is appended instead of replacing existing cards.
- [ ] Confirm the summary updates.

## Accessibility

- [ ] Tab to interactive cards.
- [ ] Press Enter on a technology card.
- [ ] Press Space on a technology card.
- [ ] Confirm visible focus outlines.

## Static checks

- [ ] Run `node --check` on every JavaScript file.
- [ ] Parse every JSON file.
- [ ] Confirm only `css/style.css` is loaded.
- [ ] Confirm there are no inline event handlers.
- [ ] Confirm there are no inline `style="..."` attributes in `index.html`.
