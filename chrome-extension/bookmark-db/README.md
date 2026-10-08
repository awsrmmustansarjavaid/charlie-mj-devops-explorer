# DevOps Explorer Bookmark Database

This directory contains the repository-backed bookmark database used by Charlie MJ DevOps Explorer.

## Files

- `bookmarks.json` — bookmark/resource records.
- `categories.json` — bookmark category data.
- `tags.json` — reusable tag data.
- `metadata.json` — database metadata.

## How the extension uses it

The configured GitHub raw path is used as a default remote source. The extension loads the data and combines it with local personal workspace data.

The browser extension does not require the user to edit these JSON files manually for normal bookmark usage. The application provides bookmark and library controls through its UI.

## Relationship to Learning

Bookmarks and favorites can become Learning resources. A saved repository can therefore move through the workflow:

```text
Bookmark
   ↓
Favorite / Collection / Tag
   ↓
Learning Card
   ↓
Lab / Project / Goal / Roadmap
```

## Updating repository data

When the JSON files are changed in the repository, the extension can read the configured raw GitHub source after reload/refresh according to its current configuration.

[📖 **Click here to read the complete extension documentation →**](../README.md)
