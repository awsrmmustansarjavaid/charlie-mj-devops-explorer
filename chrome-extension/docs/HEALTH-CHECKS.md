# Health Checks

The Health Center checks the real data sources used by the current DevOps Explorer repository:

- GitHub repository URL
- raw `index.html`
- raw `data/devops-categories.json` — required
- raw `data/devops-technologies.json` — required
- raw `chrome-extension/bookmark-db/bookmarks.json` — optional
- GitHub repository API metadata — optional

Each endpoint check reports:

- success/failure
- HTTP status
- response time in milliseconds

A repository without a bookmark database can still be **Healthy** because bookmarks are optional. The categories and technologies JSON files are the authoritative application data sources.

Example terminal output:

```text
$ devops-explorer health
[OK] Repository URL
[OK] Raw index.html
[OK] Raw categories DB
[OK] Raw technologies DB
[SKIP] Raw bookmark DB
[OK] GitHub API / repository

SYSTEM: HEALTHY
```

Auto health checks can be enabled from Settings.
