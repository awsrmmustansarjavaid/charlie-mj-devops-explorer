# Data Model v5

Workspace storage key: `devopsExplorerAppData`

Schema version: `3`

Collections: collections, favorites, learning, labs, projects, roadmaps, activity, goals, savedSearches, stack, notes, continueItems, achievements, backupMeta.

Personal categories are stored separately under `devopsExplorerCustomCategories` so remote system taxonomy updates cannot overwrite them.

Backups use the format identifier `charlie-mj-devops-explorer-backup` and include config, workspace data, personal categories and local bookmarks.
