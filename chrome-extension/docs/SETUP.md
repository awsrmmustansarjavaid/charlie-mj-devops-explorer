# Setup

## Load the extension

1. Open Chrome.
2. Visit `chrome://extensions`.
3. Enable Developer mode.
4. Select **Load unpacked**.
5. Select the `chrome-extension/` directory.

## Default configuration

The extension is already configured for:

```text
https://github.com/awsrmmustansarjavaid/charlie-mj-devops-explorer
```

with branch `main` and the matching raw paths.

## Configure manually

Open:

```text
DevOps Explorer → Settings
```

Edit any value and choose **Save Settings**.

## Configuration backup

Use:

```text
Settings → Export Config
Settings → Import Config
```

to move configuration between Chrome installations.

## Verify

Open **Health Check** and run the full check.

The raw technologies database is:

```text
https://raw.githubusercontent.com/awsrmmustansarjavaid/charlie-mj-devops-explorer/main/data/devops-technologies.json
```

If the remote database is unavailable, local search still works using the built-in catalog.


## Repository data sources

- Categories: `data/devops-categories.json`
- Technologies: `data/devops-technologies.json`
- Bookmark database: optional `bookmark-db/bookmarks.json`
