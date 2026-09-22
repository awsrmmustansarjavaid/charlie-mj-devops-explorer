# Charlie MJ DevOps Explorer

Charlie MJ DevOps Explorer is a static GitHub Pages application for discovering DevOps technologies, categories, projects, labs and learning repositories through GitHub's public repository API.

## Main features

- Main GitHub repository search.
- Context-aware technology and tag searches.
- Cloud provider discovery for AWS, Azure, Google Cloud and additional providers.
- DevOps category discovery.
- Technology map with searchable technologies.
- CI/CD and Kubernetes workflow sections.
- GitHub repository cards with repository statistics and creator information.
- Responsive 4/3/2/1 repository grid.
- Small repository avatars for a compact card design.
- `See more` pagination and numbered pages.
- Keyboard-accessible interactive cards and pills.
- Local JSON technology/category databases.

## Search behavior

The main search input is the central search engine. Clicking a supported card or tag writes its context-aware query into that input and automatically starts the same search flow.

Examples:

```text
AWS + DevOps
→ Amazon Web Services DevOps

Version Control + Git
→ Version Control Git

CI/CD + Jenkins
→ CI/CD Jenkins

Infrastructure as Code + Terraform
→ Infrastructure as Code Terraform
```

See `doc/search-flow.md` for the complete search architecture.

## Project structure

```text
charlie-mj-devops-explorer/
├── index.html
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
│   ├── devops-categories.json
│   └── devops-technologies.json
└── doc/
```

## GitHub API

The frontend uses the unauthenticated public GitHub REST API. Do not place a personal GitHub token in frontend JavaScript. Unauthenticated API usage has rate limits.

## Local testing

Because the application uses ES modules and JSON fetches, run it through a local HTTP server rather than opening `index.html` directly with `file://`.

For example:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Documentation

- `doc/architecture.md` — application architecture.
- `doc/search-flow.md` — search, context and pagination flow.
- `doc/github-resources.md` — GitHub API/resource behavior.
- `doc/css-guide.md` — stylesheet organization.
- `doc/maintenance.md` — maintenance guidance.
- `doc/testing-checklist.md` — functional testing checklist.
