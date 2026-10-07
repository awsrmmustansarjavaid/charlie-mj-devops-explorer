# Charlie MJ DevOps Explorer v3.0.0

**Discover → Search → Learn → Practice → Build → Track → Review**

A local-first Manifest V3 Chrome extension that turns the existing DevOps Explorer GitHub repository into a personal DevOps command center.

## Main workspace

- Dashboard
- Explore / Universal DevOps Search
- Taxonomy
- Learn
- Labs
- Projects
- Roadmaps
- Collections
- Favorites
- Goals
- Activity
- AI Advisor
- Admin
- Settings

## Search

One filter state powers Local Search and GitHub Search. The Search Builder supports query, categories, technologies, tags, language, difficulty and AND/OR mode. Saved searches are stored locally.

## Taxonomy

System categories and technologies are loaded from the existing repository's live JSON catalog. Personal categories are stored separately and never modify the system taxonomy.

## Workspace

Learning progress, labs, projects, roadmaps, collections, favorites, goals, My DevOps Stack, activity and continuation points are stored in `chrome.storage.local`.

## AI Advisor

The default is offline rule-based guidance. The architecture leaves room for Ollama, LM Studio and OpenAI-compatible endpoints without making AI mandatory.

## Backup and migration

Workspace data uses schema version 3. Backups include settings, workspace data, personal categories and local bookmarks. Restore validates the backup format before applying it.

## Existing repository integration

The extension preserves the current raw GitHub launcher and uses:

- `data/devops-categories.json`
- `data/devops-technologies.json`
- `chrome-extension/bookmark-db/bookmarks.json`

No GitHub Actions workflow is required by the extension.

## Validation

Run:

```bash
node tests/search-engine.test.mjs
node tests/taxonomy.test.mjs
```

The release package is also checked for JavaScript syntax, JSON validity, required manifest files and ZIP integrity.

## v3.1.0 Interaction Update
- Delegated application event handling so dynamically rendered buttons remain functional.
- GitHub result actions: Open, Owner, Bookmark, Favorite, Collection, Tag and Label.
- Tag & Label Library with import/export.
- Editable system category overrides plus personal categories.
- Direct Learning technology picker.
- Editable structured Labs, Projects, Roadmaps, Collections and Goals with linked entities.
- Restored complete Settings configuration with editable defaults and safe config export.
