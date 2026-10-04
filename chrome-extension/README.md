# DevOps Explorer Chrome Extension

A modern Manifest V3 Chrome extension that turns the existing **DevOps Explorer** GitHub repository into a personal **DevOps Resource Command Center**.

The extension is intentionally located inside the same repository under `chrome-extension/`. It does **not** copy or duplicate the main DevOps Explorer application. The main explorer remains in the parent repository and is opened through its configured **raw GitHub URL**.

![DevOps Explorer Chrome Extension](./assets/images/25656fce-6771-45f7-ba28-2b26f7e9d7c8.png)

## What this extension provides

### Core access

- 🚀 Raw GitHub `index.html` launcher
- 📦 GitHub repository launcher
- 🧭 Full extension command-center dashboard
- ⌨️ Keyboard shortcuts and command palette
- 🌙 Dark, light and system themes
- 🎨 DevOps Blue, Cyber Purple, Terminal Green and Cloud Orange accents

### Discovery and search

- 🔎 Local DevOps resource search
- 🔎 GitHub repository search
- 🏷️ Built-in DevOps categories
- 🏷️ Multiple category selection
- #️⃣ Multiple tag filtering
- AND / OR filter modes
- Resource type filtering
- Difficulty filtering
- Sortable/searchable resource table
- Quick access technology toolbox

### Bookmark and knowledge management

- ⭐ Bookmark manager
- 📚 Collections
- 📝 Personal notes per bookmark
- 🕘 Recently opened resources
- 📥 JSON import
- 📤 JSON export
- Duplicate-aware import
- Local-first bookmark storage
- GitHub bookmark database support

### GitHub synchronization

- 📥 Pull bookmark database from raw GitHub
- 📤 Push bookmark database through the GitHub Contents API
- 🔐 Optional fine-grained GitHub token
- Conflict-safe API update using the current file SHA
- Configurable repository, branch and bookmark path

### DevOps learning

- 🧭 DevOps roadmap
- 🎓 Not Started / Learning / Completed states
- 📈 Personal progress statistics
- 🧰 DevOps technology toolbox
- Technology/category shortcuts

### Diagnostics

- 🩺 Full health and diagnostics center
- 📡 Raw GitHub endpoint checks
- 📊 Response-time checks
- GitHub repository metadata check
- Resource database check
- Bookmark database check
- Terminal-style health output
- Developer-friendly settings diagnostics

## Repository placement

Place the directory inside your existing repository:

```text
devops-explorer/
├── index.html
├── css/
├── js/
├── assets/
├── data/
├── bookmark-db/
│
└── chrome-extension/
    ├── manifest.json
    ├── README.md
    ├── popup/
    ├── pages/
    ├── js/
    ├── css/
    ├── icons/
    ├── assets/images/
    ├── bookmark-db/
    └── docs/
```

There is **no second repository** and no duplicated copy of the main explorer application.

## Raw GitHub architecture

The extension uses raw GitHub as the read source:

```text
Chrome Extension
      │
      ├── repository URL ───────► github.com/OWNER/REPO
      │
      └── raw base/index ───────► raw.githubusercontent.com/OWNER/REPO/main/...
```

The extension does not depend on GitHub Pages and does not contain a GitHub Actions workflow.

### Important browser behavior

The **Open Raw Explorer** action intentionally opens the exact configured raw `index.html` URL. This preserves the raw-path architecture you requested. Whether the parent application's HTML executes correctly from a raw host depends on the parent application's resource URLs, MIME handling, CORS policy and browser behavior. The extension therefore does not pretend that raw GitHub is equivalent to GitHub Pages; it gives you a direct raw launcher and diagnostics so you can verify your repository's current behavior.

For a parent application to be raw-friendly, its HTML should use absolute raw URLs or correctly resolvable resource paths for CSS, JavaScript, JSON and assets.

## First-time setup

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `chrome-extension/` directory.
6. Open **DevOps Explorer → Settings**.
7. Enter your repository URL.
8. Enter or allow the extension to derive the raw base and raw `index.html` URLs.
9. Save settings.
10. Run **Health Check**.

Example:

```text
Repository:
https://github.com/YOUR-OWNER/YOUR-REPO

Raw base:
https://raw.githubusercontent.com/YOUR-OWNER/YOUR-REPO/main

Raw index:
https://raw.githubusercontent.com/YOUR-OWNER/YOUR-REPO/main/index.html
```

## Bookmark database

The parent repository can contain the canonical database:

```text
bookmark-db/
├── bookmarks.json
├── categories.json
├── tags.json
└── metadata.json
```

The extension also contains a small seed copy under `chrome-extension/bookmark-db/` for development and documentation. Your configured `bookmarkPath` determines which parent-repository file is used for raw pull/push operations.

## GitHub write synchronization

Raw GitHub is read-only. Updating the repository requires the GitHub Contents API.

For a personal repository:

1. Create a GitHub fine-grained personal access token.
2. Give it only the minimum repository contents permission required for the bookmark file.
3. Enter it in **Settings**.
4. Use **Pull from GitHub** and **Push to GitHub** from the Sync screen.

The token is stored in Chrome extension storage and is not written into this repository. Never put it into `config.js`, JavaScript source, JSON files or documentation.

## Local bookmark model

A bookmark may contain:

```json
{
  "id": "devops-0001",
  "title": "Kubernetes Ingress",
  "url": "https://example.com",
  "category": "Kubernetes",
  "tags": ["kubernetes", "ingress", "networking"],
  "collections": ["Kubernetes Learning"],
  "type": "documentation",
  "difficulty": "beginner",
  "description": "Kubernetes networking resource",
  "notes": "My personal study notes",
  "createdAt": "2026-10-04T00:00:00.000Z",
  "updatedAt": "2026-10-04T00:00:00.000Z"
}
```

## No GitHub workflow

This extension intentionally contains no:

- `.github/workflows/`
- GitHub Actions
- deployment pipeline
- GitHub Pages dependency
- second repository
- duplicated main application

It can be loaded locally from Chrome's **Load unpacked** feature and can communicate directly with GitHub raw files and the GitHub API.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Features](docs/FEATURES.md)
- [Setup](docs/SETUP.md)
- [Bookmark System](docs/BOOKMARKS.md)
- [GitHub Sync](docs/GITHUB-SYNC.md)
- [Search](docs/SEARCH.md)
- [Health Checks](docs/HEALTH-CHECKS.md)
- [Customization](docs/CUSTOMIZATION.md)
- [Security](docs/SECURITY.md)
- [Development](docs/DEVELOPMENT.md)
- [Roadmap](docs/ROADMAP.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [File Map](docs/FILE-MAP.md)

## License

Use the same license as the parent DevOps Explorer repository unless your project has a different licensing policy.
