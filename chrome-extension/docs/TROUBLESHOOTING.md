# Troubleshooting

## MV3 inline script CSP error

If Chrome reports:

```text
Executing inline script violates the following Content Security Policy directive
```

Reload the updated extension. All extension HTML pages in this package use external JavaScript files.

## Raw `index.html` opens as text

GitHub Raw normally serves HTML with a source-oriented MIME type. This extension dynamically adds a scoped Chrome response-header rule for the configured repository so the configured `index.html`, CSS and JavaScript can render from the raw path.

After changing repository URLs in Settings, reload the extension if Chrome has not refreshed the service worker yet.

## Search shows no remote resources

The configured default technologies database is:

```text
https://raw.githubusercontent.com/awsrmmustansarjavaid/charlie-mj-devops-explorer/main/data/devops-technologies.json
```

If that file is missing or returns 404, the extension automatically uses its built-in DevOps technology catalog. Search should still work.

If you want the full repository dataset, create/restore `data/devops-technologies.json` in the parent DevOps Explorer repository or change the Raw Technologies DB URL in Settings.

## GitHub Search fails

GitHub repository search uses `api.github.com`. Check:

- internet connection
- GitHub API availability
- configured token, if one is used
- API rate limits

A token is not required for basic public search, but authenticated requests can provide better rate-limit availability.

## Bookmark push fails

Verify:

- repository URL
- branch
- bookmark path
- fine-grained token
- repository Contents permission

Raw GitHub is read-only. Push uses the GitHub Contents API.

## Configuration import fails

The JSON must contain either a `config` object or recognized configuration keys. Unknown keys are ignored.

## Token disappeared after export/import

This is intentional. Configuration exports exclude the token by default. Enable **Include GitHub token in exported JSON** only for a private backup.


## Repository data sources

- Categories: `data/devops-categories.json`
- Technologies: `data/devops-technologies.json`
- Bookmark database: optional `bookmark-db/bookmarks.json`
