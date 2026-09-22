# GitHub Search Flow

## 1. Normal search

```text
Search input
    |
    v
initializeSearch()
    |
    v
performSearch()
    |
    v
buildGitHubQuery()
    |
    v
GitHub API
    |
    v
repositoryGrid
    |
    v
Repository cards
```

## 2. Technology card search

When a user clicks a technology card:

```text
Technology card
    |
    v
data-technology / visible label
    |
    v
initializeCardAndTagSearch()
    |
    v
Search input receives query
    |
    v
Existing search controller
    |
    v
GitHub API
```

## 3. Generic cloud pills

Cloud cards contain generic pills such as:

- Cloud
- Infrastructure
- DevOps
- AKS
- GKE

A generic pill combines its own label with the parent card.

Examples:

```text
AWS + Cloud
AWS + Infrastructure
AWS + DevOps

Azure + Cloud
Azure + AKS
Azure + DevOps

Google Cloud + Cloud
Google Cloud + GKE
Google Cloud + DevOps
```

This gives the GitHub API a useful context instead of searching for a generic word such as `Cloud`.

## 4. Category search

A category card does not immediately perform a repository search.

It first displays the technologies belonging to that category.

```text
DevSecOps
    |
    v
Trivy
SonarQube
Snyk
Gitleaks
...
    |
    v
Click Trivy
    |
    v
GitHub search for Trivy
```

This makes category navigation useful for learning.

## 5. Learning cards

The Discover, Understand and Build cards use `data-search-query`.

They therefore become GitHub learning entry points without requiring separate page files.

## Search result design

Results are rendered into:

```html
<div id="repositoryGrid" class="repository-grid"></div>
```

The outer results section remains intact.

## GitHub rate limits

The GitHub REST API has rate limits. The application should treat API errors and rate-limit responses as normal runtime conditions and show a useful error state rather than breaking the page.
