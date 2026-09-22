# Repository Structure

```text
charlie-mj-devops-explorer/
├── index.html
├── README.md
├── .gitignore
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── categories.js
│   ├── devops-data.js
│   ├── filters.js
│   ├── github-api.js
│   ├── repository-card.js
│   ├── search.js
│   ├── storage.js
│   ├── technologies.js
│   └── utils.js
├── data/
│   ├── devops-technologies.json
│   └── devops-categories.json
├── assets/
│   └── images/
│       ├── devops-engineer.png
│       └── frontend_mockup.png
└── doc/
    ├── architecture.md
    ├── css-guide.md
    ├── github-resources.md
    ├── maintenance.md
    ├── search-flow.md
    ├── testing-checklist.md
    ├── repo structure.md
    └── css structure.md
```

All browser JavaScript is loaded through `js/app.js`, which imports the other modules as needed.

The project does not require separate technology or repository HTML pages for the current GitHub-search workflow.
