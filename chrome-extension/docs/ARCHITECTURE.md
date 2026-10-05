# Architecture

## Single repository

The extension lives inside the existing DevOps Explorer repository:

```text
devops-explorer/
├── index.html
├── css/
├── js/
├── assets/
├── data/
├── bookmark-db/
└── chrome-extension/
```

The extension does not copy the application into itself.

## Raw GitHub access

The extension uses:

```text
raw.githubusercontent.com
```

for the main HTML application and repository data.

GitHub Raw normally serves HTML/CSS/JavaScript as source-oriented content rather than a normal hosted website. The extension therefore uses Chrome's `declarativeNetRequestWithHostAccess` capability to correct the response MIME type for the **configured repository only**:

- configured `index.html` → `text/html`
- configured repository CSS → `text/css`
- configured repository JavaScript → `text/javascript`
- configured repository JSON → `application/json`

The rules are generated dynamically from Settings and stored by Chrome's extension rule engine. No proxy, GitHub Pages site, GitHub Action or second repository is used.

## Command center

The extension UI is a local extension dashboard. It manages:

- resource search
- GitHub repository search
- bookmarks
- collections
- notes
- learning progress
- health checks
- settings
- GitHub synchronization

## Data layers

### Remote

```text
GitHub repository
        ↓
raw.githubusercontent.com
        ↓
resource DB / bookmark DB / application files
```

### Local

```text
chrome.storage.local
        ↓
bookmarks / history / notes / learning / settings
```

### Optional write

```text
Chrome local bookmarks
        ↓
GitHub Contents API
        ↓
bookmark-db/bookmarks.json
```
