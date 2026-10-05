# Search

The Search screen uses the repository's two real JSON data sources plus the built-in fallback catalog.

## Categories database

```text
https://raw.githubusercontent.com/awsrmmustansarjavaid/charlie-mj-devops-explorer/main/data/devops-categories.json
```

This file supplies the category names, category metadata and technology membership.

## Technologies database

```text
https://raw.githubusercontent.com/awsrmmustansarjavaid/charlie-mj-devops-explorer/main/data/devops-technologies.json
```

This file supplies the searchable technology catalog, including names, aliases, keywords, category, skill level, descriptions and related technologies. The extension converts each technology into a searchable resource entry.

If GitHub is temporarily unavailable, the extension keeps its built-in catalog so search remains usable.

## Filters

- Free-text query
- Multiple categories
- Multiple tags
- Type
- Difficulty
- AND mode
- OR mode

Multi-word queries are tokenized, so:

```text
kubernetes ingress
```

matches resources containing both terms rather than requiring the exact phrase.

## GitHub search

**Search GitHub** uses the GitHub repository search API and returns repository results in the same table. An optional configured token can be used for authenticated API requests and rate-limit availability.

## Repository data sources

- Categories: `data/devops-categories.json`
- Technologies: `data/devops-technologies.json`
- Bookmark database: optional `chrome-extension/bookmark-db/bookmarks.json`
