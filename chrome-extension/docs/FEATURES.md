# Features

## Dashboard

- My DevOps Workspace
- health indicator
- workspace statistics
- quick technology access
- recent resources
- raw explorer launcher

## Search

- local resource catalog
- optional parent `data/devops-technologies.json`
- GitHub repository search
- category filters
- multi-category selection
- tag filters
- type and difficulty filters
- AND/OR modes
- result table
- one-click bookmark

## Bookmarks

- create/edit/delete
- tags
- categories
- collections
- difficulty
- description
- personal notes
- JSON import/export
- duplicate-aware import

## Maintenance

- raw endpoint checks
- response time
- GitHub repository metadata check
- terminal-style diagnostic output
- optional GitHub bookmark synchronization

## Personal learning

- roadmap
- learning states
- progress statistics
- DevOps toolbox

## UI

- glassmorphism developer dashboard
- responsive layout
- dark/light/system modes
- four accent themes
- command palette
- keyboard shortcuts

## Configuration management

Settings now includes editable defaults for the repository, branch, raw index, raw technologies DB, bookmark DB paths, theme, accent and auto health checks.

Configuration can be backed up and restored as JSON. Token export is opt-in.

## Raw GitHub rendering

The extension keeps the requested raw GitHub architecture but adds a scoped response MIME correction through Chrome's Declarative Net Request API. This lets the configured raw `index.html` behave like HTML instead of being displayed as plain text, while its raw CSS and JavaScript dependencies receive the appropriate MIME types.

## Search fallback

The search engine remains useful even when the remote `data/devops-technologies.json` is unavailable. It combines the built-in technology catalog with the remote database when the remote database is reachable.


## Repository data sources

- Categories: `data/devops-categories.json`
- Technologies: `data/devops-technologies.json`
- Bookmark database: optional `chrome-extension/bookmark-db/bookmarks.json`
