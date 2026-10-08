# Extension Design Principles

## Local-first

The personal workspace is stored locally in Chrome. Remote GitHub data is used primarily as a source for catalogs and live repository discovery.

## Data-driven

Categories, technologies, bookmarks, and official documentation are represented as data rather than hard-coded UI lists wherever practical.

## Modular

Search, taxonomy, GitHub access, storage, backup, activity, AI, and UI components are separated into modules.

## Progressive enhancement

The extension remains useful without optional AI services or GitHub authentication.

## Human-readable data

JSON datasets are intentionally readable and versionable.

Markdown exports make the user's knowledge portable outside the extension.

## Non-destructive personalization

Personal categories and technology overrides are kept separately from the remote system catalog.

## Relationship-first learning

Learning, Labs, Projects, Goals, and Roadmaps are connected by IDs instead of duplicated records.

## Maintainability

The project favors standard browser technologies and small focused modules over a heavy build pipeline.
