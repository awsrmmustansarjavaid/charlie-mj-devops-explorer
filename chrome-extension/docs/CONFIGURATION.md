# Configuration

## Default configuration

The extension ships with working defaults for:

```text
Repository:
https://github.com/awsrmmustansarjavaid/charlie-mj-devops-explorer

Branch:
main

Raw base:
https://raw.githubusercontent.com/awsrmmustansarjavaid/charlie-mj-devops-explorer/main

Raw index:
https://raw.githubusercontent.com/awsrmmustansarjavaid/charlie-mj-devops-explorer/main/index.html

Raw technologies DB:
https://raw.githubusercontent.com/awsrmmustansarjavaid/charlie-mj-devops-explorer/main/data/devops-technologies.json
```

All settings remain editable.

## Import configuration

Settings → Import Config accepts a JSON file containing either:

```json
{
  "format": "devops-explorer-config",
  "version": 1,
  "config": {
    "repositoryUrl": "...",
    "branch": "main"
  }
}
```

or a compatible configuration object.

Only recognized configuration keys are imported.

## Export configuration

Settings → Export Config creates a JSON backup.

By default the GitHub token is excluded. Enable **Include GitHub token in exported JSON** only when creating a private, protected backup.

## Reset

Reset Defaults restores the built-in repository, raw paths, theme and other defaults.


## Repository data sources

- Categories: `data/devops-categories.json`
- Technologies: `data/devops-technologies.json`
- Bookmark database: optional `chrome-extension/bookmark-db/bookmarks.json`
