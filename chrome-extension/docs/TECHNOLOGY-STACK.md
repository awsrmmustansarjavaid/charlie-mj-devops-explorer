# Technology Stack and How It Works

## 1. Overview

Charlie MJ DevOps Explorer is intentionally built as a lightweight browser extension using standard web technologies instead of a large application framework.

The primary stack is:

- Chrome Extension Manifest V3
- HTML
- CSS
- Modern JavaScript ES modules
- JSON data files
- Chrome Storage API
- Chrome Tabs API
- Chrome Side Panel API
- Chrome Commands API
- Chrome Declarative Net Request API
- GitHub REST APIs / raw GitHub content

## 2. Manifest V3

The extension is defined by `manifest.json`.

Manifest V3 provides:

- popup entry point
- service worker
- options/settings page
- side panel
- permissions
- host permissions
- keyboard commands
- icons

The current package uses version `3.3.4`.

## 3. JavaScript architecture

The code is split into focused modules.

### Core modules

`core/search-engine.js`

Provides common local filtering and matching behavior.

`core/github-search.js`

Builds GitHub queries and performs repository searches.

`core/taxonomy.js`

Normalizes technology/category data and supports the DevOps taxonomy.

`core/storage.js` functionality is implemented through `js/storage.js`.

`core/activity.js`

Records workspace activity.

`core/backup.js`

Creates and restores workspace backups.

`core/health.js`

Supports health-related checks.

### Application modules

`pages/dashboard/dashboard.js`

The main application controller and view renderer. It connects navigation, editors, search, Learning, Labs, Projects, Roadmaps, Goals, Technologies, documentation, settings, and workspace actions.

`popup/popup.js`

Provides the lightweight browser-action entry point.

`sidepanel/app.js`

Provides the persistent Side Panel experience.

`js/background.js`

Runs extension background behavior and command handling.

`ai/advisor.js`

Contains the AI Advisor logic and provider-oriented design.

## 4. HTML

HTML provides the extension surfaces:

- popup
- dashboard
- settings
- raw launcher
- side panel

The dashboard dynamically renders application content rather than requiring a separate page for every feature.

## 5. CSS

The UI is split into reusable CSS layers:

- `styles/tokens.css` — design tokens
- `styles/layout.css` — layout structure
- `styles/components.css` — reusable components
- `styles/dark.css` — dark theme
- `styles/light.css` — light theme
- `css/app.css` — application styling
- `css/popup.css` — popup styling

## 6. JSON data

JSON is used for repository-backed and portable data.

Important datasets include:

- `data/devops-categories.json`
- `data/devops-technologies.json`
- `data/official-documentation.json`
- `bookmark-db/bookmarks.json`
- `bookmark-db/categories.json`
- `bookmark-db/tags.json`
- `bookmark-db/metadata.json`

JSON keeps the catalog human-readable and easy to update through GitHub.

## 7. Official Documentation JSON v2

The current documentation format contains:

- version
- generatedAt
- count
- documentation array

A documentation record can contain:

- id
- technologyId
- technology
- categoryId
- category
- subcategoryId
- subcategory
- title
- url
- type
- source
- status
- health
- tags
- lastChecked
- notes
- updatedAt

This structure lets documentation participate in technology and taxonomy relationships.

## 8. Chrome Storage

Local workspace state is stored using `chrome.storage.local`.

The application has a storage abstraction in `js/storage.js` so UI code does not need to directly manage every storage key.

The current application data schema is version **5**.

Schema migrations are used when the application adds new fields.

## 9. Data ownership

The extension separates data into three broad layers.

### Remote system data

Examples:

- DevOps categories
- technology catalog
- repository bookmark database
- official documentation source

These can come from the configured GitHub repository.

### Local personal data

Examples:

- personal categories
- personal technologies
- learning cards
- labs
- projects
- goals
- roadmaps
- favorites
- collections
- activity
- settings

### Runtime state

Examples:

- current page
- active filters
- search query
- UI section
- modal state

Runtime state does not represent the permanent workspace database.

## 10. Why plain JavaScript?

The project intentionally avoids unnecessary build tooling.

Benefits:

- easy to inspect
- easy to modify
- easy to load unpacked in Chrome
- small deployment footprint
- no bundler required for normal development
- clear relationship between source files and browser behavior

## 11. External data workflow

The default repository-backed flow is:

```text
GitHub repository
      ↓
raw.githubusercontent.com
      ↓
Chrome extension fetch()
      ↓
JSON normalization
      ↓
Application state
      ↓
Search / Taxonomy / Technologies / Documentation
```

## 12. Local workspace workflow

```text
User action
    ↓
Dashboard editor
    ↓
Application state
    ↓
StorageService
    ↓
chrome.storage.local
    ↓
Reload / revisit feature
    ↓
Data restored
```

## 13. Learning relationship workflow

```text
Learning Card
   ├── Lab IDs
   ├── Project IDs
   ├── Goal IDs
   └── Roadmap IDs

Related record
   └── Learning Card IDs
```

This creates bidirectional relationships without duplicating the full Learning card inside every record.

## 14. GitHub workflow

```text
User query
   ↓
Search builder
   ↓
buildGithubQuery()
   ↓
GitHub API
   ↓
Repository result normalization
   ↓
Open / Bookmark / Favorite / Collection / Tag / Label
```

## 15. Raw GitHub application launcher

The extension can open the repository's `index.html` through the configured raw GitHub URL.

Raw GitHub normally serves HTML as text/plain. The extension therefore uses declarative network rules to correct relevant content types for supported raw resources.

## 16. Security architecture

The extension uses Manifest V3 and keeps personal workspace data in Chrome local storage.

GitHub authentication is optional rather than required for basic browsing/search workflows.

Never publish a personal GitHub token inside repository JSON files or source code.

[📖 Click here to read more about security](SECURITY.md)
