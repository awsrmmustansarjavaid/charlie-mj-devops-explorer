# Bookmark System

Bookmarks are local-first and stored in Chrome extension storage. The bookmark object supports title, URL, category, tags, collections, type, difficulty, description, notes and timestamps.

## Import

Use **Import JSON**. The importer accepts either an array or an object with a `bookmarks` array. Existing URLs are treated as duplicates and are not imported again.

## Export

Export produces a portable JSON file containing a version, export timestamp and bookmark list.

## Collections

A bookmark can belong to multiple collections. Enter comma-separated collection names while creating or editing a bookmark.

## Repository database

The canonical shared database can live in the parent repository at:

```text
chrome-extension/bookmark-db/bookmarks.json
```

Raw GitHub can be used to pull it. Push requires the GitHub Contents API and a user token.
