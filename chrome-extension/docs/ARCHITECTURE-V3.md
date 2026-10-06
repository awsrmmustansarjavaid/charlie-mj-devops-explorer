# Charlie MJ DevOps Explorer v3 Architecture

## Product flow
Discover → Search → Learn → Practice → Build → Track → Review

## Core layers
- UI: dashboard, side panel, popup, responsive pages
- Core: search engine, GitHub adapter, taxonomy normalization, activity, backup, health
- Features: categories, collections, learning, labs, projects, roadmaps, favorites, goals, stack
- Intelligence: offline rule-based advisor plus optional local/compatible providers
- Storage: one app data object with schema version and migrations
- Remote catalog: live categories and technologies from the existing GitHub repository

## Data ownership
System taxonomy is remote/read-only. Personal categories and workspace data live in `chrome.storage.local`.

## Search
A single filter state is shared by Local Search and GitHub Search. GitHub query generation is centralized in `core/github-search.js` and capped to a controlled query length.

## MV3
No remotely hosted executable code. The extension keeps application JavaScript bundled locally. Raw GitHub is used only for the user's DevOps catalog/HTML preview and data fetching.
