# Search Flow

## Purpose

Charlie MJ DevOps Explorer uses one GitHub repository-search controller for the main search box, technology cards, category cards, technology pills, pipeline nodes, quick searches, and filters.

## Main search flow

```text
User enters query
        ↓
#searchInput
        ↓
searchController.search()
        ↓
buildGitHubQuery()
        ↓
GitHub REST API
        ↓
renderRepositories()
        ↓
#repositoryGrid
        ↓
Pagination controls
```

## Card and tag flow

All interactive technology elements use the same delegated listener.

```text
Card / tag clicked
        ↓
Resolve search context
        ↓
Write query into #searchInput
        ↓
Automatically execute main search
        ↓
Scroll to GitHub results
```

## Context-aware queries

The UI intentionally combines a parent context with a child technology when that produces a more useful GitHub search.

Examples:

- `Amazon Web Services` → `Amazon Web Services`
- AWS + `DevOps` → `Amazon Web Services DevOps`
- `Version Control` + `Git` → `Version Control Git`
- `CI/CD` + `Jenkins` → `CI/CD Jenkins`
- `Infrastructure as Code` + `Terraform` → `Infrastructure as Code Terraform`
- `Managed Kubernetes` + `Amazon EKS` → `Managed Kubernetes Amazon EKS`

Technology cards rendered inside a selected category also retain the category context.

## Pagination

The GitHub API is requested 12 repositories at a time.

The result area provides:

- A result count.
- `See more` to append the next page without removing existing cards.
- Numbered pages to replace the visible page with a specific GitHub page.
- Responsive repository cards: 4 columns on large screens, 3 on smaller desktop screens, 2 on tablets, and 1 on mobile.

GitHub repository search has a practical 1,000-result search window, so pagination is capped accordingly.

## Error handling

GitHub API errors are displayed inside the repository grid and through the application's notification system. The search controller no longer relies on an undefined result-update function after rendering results.

## Rate limits

The site uses GitHub's unauthenticated public REST API from the browser. GitHub applies rate limits to unauthenticated requests. A production deployment requiring higher limits should use a server-side or serverless proxy rather than exposing a personal access token in frontend JavaScript.
