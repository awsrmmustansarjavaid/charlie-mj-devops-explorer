# Architecture

## Principle

One repository contains both the original DevOps Explorer application and this extension. The extension is an access, organization and learning layer; it does not duplicate the main explorer.

## Runtime layers

```text
Existing DevOps Explorer
├── index.html
├── css/
├── js/
├── assets/
└── data/

chrome-extension/
├── popup/                 Chrome action popup
├── pages/dashboard/       Main command center
├── js/                    Shared extension logic
├── css/                   Visual system
├── icons/                 Extension icons
├── bookmark-db/           Seed/sample data
└── docs/                  Documentation
```

## Data sources

- Local state: `chrome.storage.local`
- Parent repository read source: `raw.githubusercontent.com`
- Optional repository write source: `api.github.com`
- GitHub repository metadata/search: GitHub REST API

## Design rule

The extension should never require GitHub Pages or a GitHub Actions workflow.
