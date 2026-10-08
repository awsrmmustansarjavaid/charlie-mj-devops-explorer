# Charlie MJ DevOps Explorer v3.3.4

**Discover → Search → Learn → Practice → Build → Track → Review**

Charlie MJ DevOps Explorer is a **local-first Manifest V3 Chrome extension** that turns DevOps discovery, learning, practice, projects, goals, and roadmaps into one connected workspace.

It is designed for people who want to move from:

> **“I found a DevOps resource.”**
>
> to
>
> **“I understand it, practiced it, built something with it, and can track my progress.”**

---

## 🚀 What is Charlie MJ DevOps Explorer?

The extension combines a DevOps resource explorer with a personal learning/work management system.

It connects:

**Technology → Search → Resources → Official Documentation → Learning → Labs → Projects → Goals → Roadmaps → Activity → Review**

The project uses standard browser technologies and a data-driven architecture so it remains lightweight, inspectable, and easy to customize.

---

# ⭐ Complete Feature List

## 🏠 1. Dashboard

The Dashboard is the main command center for the extension.

### Key points

- Central navigation
- Workspace overview
- Quick access to major features
- Command palette access
- Side Panel access
- Current application/version information
- System health indicator

[📖 **Click here to read more → Dashboard and feature architecture**](docs/FEATURES-V3.md)

---

## 🔎 2. Universal Search

Search across the local DevOps catalog and saved resources.

### Key points

- Free-text search
- Category filtering
- Technology filtering
- Tag filtering
- Language filtering
- Difficulty filtering
- Repository/resource type filtering
- AND/OR operators
- Shared search state
- GitHub repository search
- Saved searches

[📖 **Click here to read more → Search Guide**](docs/SEARCH.md)

---

## 🐙 3. GitHub Repository Search

Search GitHub repositories directly from the extension.

### Key points

- GitHub repository search
- Repository metadata
- Repository owner access
- Open repository
- Bookmark repository
- Favorite repository
- Add to Collection
- Add Tags
- Add Labels
- GitHub topic integration
- GitHub API support

Example topics can include:

`aws` · `containers` · `ecr` · `ecs` · `eks` · `fargate` · `kubernetes`

[📖 **Click here to read more → GitHub integration**](docs/GITHUB-SYNC.md)

---

## 🧭 4. DevOps Taxonomy

The extension uses a data-driven hierarchy for organizing DevOps technologies.

### Key points

- Domains/categories
- Subcategories
- Technologies
- Technology metadata
- System categories
- Personal categories
- System category overrides
- Technology relationships
- Technology search

[📖 **Click here to read more → Architecture and taxonomy**](docs/ARCHITECTURE-V3.md)

---

## 🧩 5. Technology Catalog

The Technology workspace provides a central catalog for DevOps tools and technologies.

### Key points

- Search technology catalog
- Technology details
- Categories
- Subcategories
- Tags
- Difficulty
- Prerequisites
- Personal technology records
- Technology overrides
- Technology export
- Official documentation relationships

[📖 **Click here to read more → Technology and data architecture**](docs/TECHNOLOGY-STACK.md)

---

## 📖 6. Official Documentation System

Official Documentation is a dedicated technology-linked documentation database.

### Key points

- Documentation title
- URL
- Technology
- Category
- Subcategory
- Type
- Source
- Tags
- Notes
- Health status
- Last checked timestamp
- Add documentation
- Edit documentation
- Delete documentation
- Search documentation
- Health check
- Check all documentation
- Import JSON
- Export JSON

### Documentation JSON v2

The recommended structure contains:

- `version`
- `generatedAt`
- `count`
- `documentation[]`
- `technologyId`
- `technology`
- `categoryId`
- `category`
- `subcategoryId`
- `subcategory`
- `title`
- `url`
- `type`
- `source`
- `status`
- `health`
- `tags`
- `lastChecked`
- `notes`
- `updatedAt`

Example categories:

- GitHub Actions → **CI/CD**
- Jenkins → **CI/CD**
- AWS → **Cloud Provider**

[📖 **Click here to read more → Official Documentation Guide**](docs/OFFICIAL-DOCUMENTATION.md)

---

## 📚 7. Learning Cards

Learning cards are the central knowledge objects of the extension.

### Key points

- Create Learning cards
- Open Learning details
- Edit Learning cards
- Delete Learning cards
- Search Learning resources
- Select technologies
- Add categories/subcategories
- Add descriptions
- Add difficulty
- Add tags
- Add thumbnail URL
- Add notes
- Track status
- Track progress
- Add Medium resources
- Add LinkedIn resources
- Add YouTube resources
- Add blogs
- Add courses
- Add custom URLs
- Select official documentation
- Link Labs
- Link Projects
- Link Goals
- Link Roadmaps
- Export JSON
- Import JSON
- Download Markdown
- Import Markdown

[📖 **Click here to read more → Complete User Manual**](docs/USER-MANUAL.md)

---

## ➕ 8. Learning Additional Details

A Learning card can be connected to existing practical and planning records.

### Key points

- Link existing Labs
- Link existing Projects
- Link existing Goals
- Link existing Roadmaps
- Search records
- Select records
- Remove relationships
- Edit linked records
- Open linked records
- See selected counts
- Preserve relationships while creating a new Learning card
- Bidirectional Learning relationships

The relationship model is:

```text
Learning Card
 ├── Labs
 ├── Projects
 ├── Goals
 └── Roadmaps
```

[📖 **Click here to read more → Learning Workspace Design**](docs/LEARNING-WORKSPACE.md)

---

## 🧪 9. Labs

Labs represent hands-on DevOps practice.

### Key points

- Create Labs
- Edit Labs
- Open Labs
- Delete Labs
- Link Learning cards
- Practical learning structure
- Markdown download
- JSON export
- JSON import
- Markdown import

Examples:

- Kubernetes Lab
- AWS EKS Lab
- Docker Lab
- Jenkins Pipeline Lab
- Terraform Lab

[📖 **Click here to read more → User Manual**](docs/USER-MANUAL.md)

---

## 🏗️ 10. Projects

Projects represent larger DevOps implementation outcomes.

### Key points

- Create Projects
- Edit Projects
- Open Projects
- Delete Projects
- Link Learning cards
- Organize project resources
- Markdown download
- JSON export
- JSON import
- Markdown import

Examples:

- AWS DevOps Platform
- Kubernetes Platform
- CI/CD Pipeline
- Infrastructure-as-Code project
- Monitoring platform

[📖 **Click here to read more → User Manual**](docs/USER-MANUAL.md)

---

## 🎯 11. Goals

Goals represent measurable learning or delivery outcomes.

### Key points

- Create goals
- Track goals
- Connect goals to Learning cards
- Use goals as outcome-level planning
- Review progress

[📖 **Click here to read more → User Manual**](docs/USER-MANUAL.md)

---

## 🗺️ 12. Roadmaps

Roadmaps organize DevOps learning or delivery sequences.

### Key points

- Create Roadmaps
- Edit Roadmaps
- Open Roadmaps
- Delete Roadmaps
- Link Learning cards
- Organize milestones
- Markdown download
- JSON export
- JSON import
- Markdown import

Example:

```text
Linux
  ↓
Git
  ↓
Docker
  ↓
Kubernetes
  ↓
AWS
  ↓
Terraform
  ↓
CI/CD
  ↓
Observability
```

[📖 **Click here to read more → Roadmap documentation**](docs/ROADMAP.md)

---

## 🔖 13. Bookmarks

Save important DevOps resources for later.

### Key points

- Save repositories/resources
- Import bookmarks
- Export bookmarks
- Categories
- Tags
- Metadata
- Collections
- GitHub repository bookmarks

[📖 **Click here to read more → Bookmark System**](docs/BOOKMARKS.md)

---

## ⭐ 14. Favorites

Favorites provide a fast personal shortlist of high-value resources.

### Key points

- Favorite resources
- Favorite GitHub repositories
- Review favorite items
- Connect favorites with Learning resources

[📖 **Click here to read more → Feature Guide**](docs/FEATURES.md)

---

## 📦 15. Collections

Collections group resources around a topic, project, course, or workflow.

### Key points

- Create collections
- Add resources
- Add GitHub repositories
- Organize related resources
- Connect saved resources with learning workflows

[📖 **Click here to read more → Bookmark System**](docs/BOOKMARKS.md)

---

## 🏷️ 16. Tag & Label Library

A reusable library for organizing resources.

### Key points

- Create tags
- Create labels
- Delete tags/labels
- Import library data
- Export library data
- Use GitHub topics as tag sources
- Search resources by tags

[📖 **Click here to read more → Features and customization**](docs/FEATURES.md)

---

## 📊 17. Activity Tracking

The extension can record workspace activity to help users understand what they are doing and continue learning.

### Key points

- Activity history
- Learning actions
- Resource actions
- Continuation-oriented workflow
- Reviewable activity

[📖 **Click here to read more → Architecture**](docs/ARCHITECTURE-V3.md)

---

## 🤖 18. AI Advisor

The AI Advisor provides contextual guidance without making an external AI provider mandatory.

### Key points

- Offline rule-based guidance
- Modular provider architecture
- Future local AI support
- Future Ollama support
- Future LM Studio support
- OpenAI-compatible provider design

[📖 **Click here to read more → Technology Stack and Architecture**](docs/TECHNOLOGY-STACK.md)

---

## 🩺 19. Health Checks

Health checking helps identify problems in configured resources and documentation URLs.

### Key points

- Documentation health
- Healthy status
- Redirected status
- Broken status
- Timeout status
- Unknown status
- Check individual documentation
- Check all documentation

[📖 **Click here to read more → Health Checks**](docs/HEALTH-CHECKS.md)

---

## ⚙️ 20. Settings

Settings provide control over data sources and application behavior.

### Key points

- Repository URL
- Branch
- Raw base URL
- Categories path
- Categories URL
- Technologies path
- Technologies URL
- Bookmark path
- Tags path
- Metadata path
- Official Documentation path
- Official Documentation URL
- Theme
- Accent
- Automatic health checks
- GitHub sync settings
- Configuration import/export
- Reset configuration

[📖 **Click here to read more → Configuration Guide**](docs/CONFIGURATION.md)

---

## 💾 21. Backup and Restore

Workspace data can be backed up and restored through the application's backup system.

### Key points

- Workspace backup
- Restore
- Schema versioning
- Migration support
- Local data preservation

[📖 **Click here to read more → Architecture and configuration**](docs/ARCHITECTURE-V3.md)

---

## 🌗 22. Themes and Customization

The UI supports configurable presentation options.

### Key points

- Dark theme
- Light theme
- Accent selection
- Repository source configuration
- Personal taxonomy customization

[📖 **Click here to read more → Customization Guide**](docs/CUSTOMIZATION.md)

---

## ⌨️ 23. Command Palette and Shortcuts

The extension provides keyboard-oriented navigation.

### Key points

- Command palette
- Dashboard shortcut
- Search-oriented navigation
- Fast access to actions

The configured default shortcuts include:

- `Ctrl+Shift+D` — open DevOps Explorer dashboard
- `Ctrl+K` — open command palette

macOS equivalents are configured in the manifest where supported.

[📖 **Click here to read more → File Map and Architecture**](docs/FILE-MAP.md)

---

# 🏗️ Architecture Overview

```text
┌───────────────────────────────────────────────┐
│              Chrome Extension UI              │
│ Popup │ Dashboard │ Side Panel │ Settings     │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│             Application Controller            │
│ pages/dashboard/dashboard.js                 │
└───────────────┬───────────────┬───────────────┘
                │               │
        ┌───────▼──────┐ ┌──────▼────────┐
        │ Core Modules │ │ AI / Activity │
        │ Search       │ │ Advisor       │
        │ GitHub       │ │ Activity      │
        │ Taxonomy     │ │ Backup        │
        │ Health       │ │               │
        └───────┬──────┘ └──────┬────────┘
                │               │
                └───────┬───────┘
                        ▼
              ┌───────────────────┐
              │ Storage / Config  │
              │ js/storage.js     │
              │ chrome.storage    │
              └─────────┬─────────┘
                        │
           ┌────────────┴────────────┐
           ▼                         ▼
   Remote GitHub JSON          Local Workspace
   Categories                  Learning
   Technologies               Labs
   Documentation              Projects
   Bookmarks                   Goals
                               Roadmaps
                               Favorites
                               Collections
```

[📖 **Click here to read more → Complete Technology Stack and Architecture**](docs/TECHNOLOGY-STACK.md)

---

# 🔄 Main Data Workflow

```text
GitHub / Local Data
        ↓
Normalization
        ↓
Taxonomy + Search
        ↓
Resource Discovery
        ↓
Bookmark / Favorite / Collection
        ↓
Learning Card
        ↓
Official Documentation
        ↓
Lab + Project
        ↓
Goal + Roadmap
        ↓
Activity / Progress
        ↓
Export Markdown / JSON
```

[📖 **Click here to read more → Feature Workflows**](docs/WORKFLOWS.md)

---

# 🧑‍💻 User Manual

For new users, the recommended starting point is the complete user manual.

It explains:

- how to install the extension
- how to configure it
- how to search DevOps resources
- how to search GitHub
- how to bookmark resources
- how to create Learning cards
- how to attach official documentation
- how to create Labs
- how to create Projects
- how to create Goals
- how to create Roadmaps
- how to connect Learning cards to Labs/Projects/Goals/Roadmaps
- how to add technologies
- how to add official documentation
- how to use import/export
- how to use Markdown downloads
- how to use health checks
- how to use backups

[📖 **Click here to read the complete User Manual →**](docs/USER-MANUAL.md)

---

# 🧰 Technology and Development Documentation

## Technologies used

- HTML5
- CSS3
- Modern JavaScript ES modules
- JSON
- Chrome Manifest V3
- Chrome Storage API
- Chrome Tabs API
- Chrome Side Panel API
- Chrome Commands API
- Chrome Declarative Net Request API
- GitHub API / raw GitHub content

## Architecture topics

- modular JavaScript
- data-driven taxonomy
- local-first storage
- JSON data sources
- schema migrations
- bidirectional Learning relationships
- Markdown/JSON portability
- optional AI providers

[📖 **Click here to read more → Technology Stack**](docs/TECHNOLOGY-STACK.md)

---

# 📂 Repository Structure

```text
charlie-mj-devops-explorer/
│
├── manifest.json
├── README.md
├── version.json
│
├── ai/
│   └── advisor.js
│
├── components/
│   ├── command-palette.js
│   └── empty-state.js
│
├── core/
│   ├── activity.js
│   ├── backup.js
│   ├── github-search.js
│   ├── health.js
│   ├── search-engine.js
│   └── taxonomy.js
│
├── data/
│   └── official-documentation.json
│
├── docs/
│   ├── architecture and feature documentation
│   ├── user documentation
│   ├── development documentation
│   └── configuration/troubleshooting documentation
│
├── js/
│   ├── background.js
│   ├── config.js
│   ├── data.js
│   ├── github.js
│   ├── settings-redirect.js
│   └── storage.js
│
├── pages/
│   ├── dashboard/
│   └── settings/
│
├── popup/
├── sidepanel/
├── styles/
├── css/
├── tests/
└── bookmark-db/
```

[📖 **Click here to read more → File Map**](docs/FILE-MAP.md)

---

# 📚 Complete Markdown Documentation Map

Every Markdown document included with the extension is listed below.

## ⭐ Primary documentation

### User Manual

Installation, daily usage, Learning cards, Labs, Projects, Goals, Roadmaps, technologies, official documentation, GitHub search, import/export, backups, and practical workflows.

[📖 **Click here to read more → USER-MANUAL.md**](docs/USER-MANUAL.md)

### Technology Stack

Explains HTML, CSS, JavaScript, JSON, Chrome APIs, modules, storage, data sources, architecture, and application workflows.

[📖 **Click here to read more → TECHNOLOGY-STACK.md**](docs/TECHNOLOGY-STACK.md)

### Feature Workflows

Explains how Discover → Search → Learn → Practice → Build → Track → Review works across the extension.

[📖 **Click here to read more → WORKFLOWS.md**](docs/WORKFLOWS.md)

### Learning Workspace

Explains Learning cards and their relationships with Labs, Projects, Goals, Roadmaps, and documentation.

[📖 **Click here to read more → LEARNING-WORKSPACE.md**](docs/LEARNING-WORKSPACE.md)

### Import / Export

Explains JSON and Markdown portability and safe migration.

[📖 **Click here to read more → IMPORT-EXPORT.md**](docs/IMPORT-EXPORT.md)

### Extension Design

Explains the main engineering and product design principles.

[📖 **Click here to read more → EXTENSION-DESIGN.md**](docs/EXTENSION-DESIGN.md)

### Documentation Index

Central map of all documentation files.

[📖 **Click here to read more → DOCUMENTATION-INDEX.md**](docs/DOCUMENTATION-INDEX.md)

### Release Notes v3.3.4

Documents the current release focus and validation expectations.

[📖 **Click here to read more → RELEASE-NOTES-V3.3.4.md**](docs/RELEASE-NOTES-V3.3.4.md)

### Release Notes v3.3.3

Documents the previous application release and its Learning/relationship feature work.

[📖 **Click here to read more → RELEASE-NOTES-V3.3.3.md**](docs/RELEASE-NOTES-V3.3.3.md)

## 🏗️ Architecture

- **ARCHITECTURE-V3.md** — v3 application architecture.
  - [📖 **Click here to read more**](docs/ARCHITECTURE-V3.md)
- **ARCHITECTURE.md** — repository/runtime architecture.
  - [📖 **Click here to read more**](docs/ARCHITECTURE.md)
- **DATA_MODEL.md** — workspace data model.
  - [📖 **Click here to read more**](docs/DATA_MODEL.md)
- **FILE-MAP.md** — source file responsibilities.
  - [📖 **Click here to read more**](docs/FILE-MAP.md)

## 🔎 Search and resources

- **SEARCH.md** — local/GitHub search.
  - [📖 **Click here to read more**](docs/SEARCH.md)
- **BOOKMARKS.md** — bookmarks and collections.
  - [📖 **Click here to read more**](docs/BOOKMARKS.md)
- **GITHUB-SYNC.md** — GitHub integration.
  - [📖 **Click here to read more**](docs/GITHUB-SYNC.md)
- **OFFICIAL-DOCUMENTATION.md** — documentation database.
  - [📖 **Click here to read more**](docs/OFFICIAL-DOCUMENTATION.md)
- **HEALTH-CHECKS.md** — health checks.
  - [📖 **Click here to read more**](docs/HEALTH-CHECKS.md)

## ⚙️ Configuration and customization

- **SETUP.md** — installation and initial setup.
  - [📖 **Click here to read more**](docs/SETUP.md)
- **CONFIGURATION.md** — configuration reference.
  - [📖 **Click here to read more**](docs/CONFIGURATION.md)
- **CUSTOMIZATION.md** — themes and customization.
  - [📖 **Click here to read more**](docs/CUSTOMIZATION.md)
- **SECURITY.md** — permissions and security guidance.
  - [📖 **Click here to read more**](docs/SECURITY.md)

## 🧑‍💻 Development and maintenance

- **DEVELOPMENT.md** — development practices.
  - [📖 **Click here to read more**](docs/DEVELOPMENT.md)
- **VALIDATION.md** — validation/testing.
  - [📖 **Click here to read more**](docs/VALIDATION.md)
- **TROUBLESHOOTING.md** — common problems.
  - [📖 **Click here to read more**](docs/TROUBLESHOOTING.md)
- **ROADMAP.md** — product roadmap.
  - [📖 **Click here to read more**](docs/ROADMAP.md)
- **FEATURES.md** — feature reference.
  - [📖 **Click here to read more**](docs/FEATURES.md)
- **FEATURES-V3.md** — v3 feature reference.
  - [📖 **Click here to read more**](docs/FEATURES-V3.md)

## 📦 Bookmark database documentation

- **bookmark-db/README.md** — bookmark database structure and usage.
  - [📖 **Click here to read more**](bookmark-db/README.md)

---

# 🧩 Workspace-Specific Markdown Guides

The extension also ships a Markdown README beside each major workspace. These are short, feature-focused entry points.

- **Explore** — search and GitHub discovery.
  - [📖 **Click here to read more**](pages/explore/README.md)
- **Taxonomy** — categories, subcategories, and technologies.
  - [📖 **Click here to read more**](pages/taxonomy/README.md)
- **Learning** — Learning cards and relationships.
  - [📖 **Click here to read more**](pages/learning/README.md)
- **Labs** — practical DevOps exercises.
  - [📖 **Click here to read more**](pages/labs/README.md)
- **Projects** — implementation projects.
  - [📖 **Click here to read more**](pages/projects/README.md)
- **Roadmaps** — structured learning/delivery paths.
  - [📖 **Click here to read more**](pages/roadmaps/README.md)
- **Goals** — measurable outcomes.
  - [📖 **Click here to read more**](pages/goals/README.md)
- **Collections** — grouped saved resources.
  - [📖 **Click here to read more**](pages/collections/README.md)
- **Favorites** — high-value resources.
  - [📖 **Click here to read more**](pages/favorites/README.md)
- **Activity** — workspace history.
  - [📖 **Click here to read more**](pages/activity/README.md)
- **AI Advisor** — contextual guidance.
  - [📖 **Click here to read more**](pages/ai/README.md)
- **Admin** — maintenance and administration.
  - [📖 **Click here to read more**](pages/admin/README.md)
- **Settings** — configuration and sources.
  - [📖 **Click here to read more**](pages/settings/README.md)

---

# 🛠️ Development

The project intentionally uses plain browser technologies.

### Validate search

```bash
node tests/search-engine.test.mjs
```

### Validate taxonomy

```bash
node tests/taxonomy.test.mjs
```

Additional release validation should include:

- JavaScript syntax checks
- JSON parsing
- manifest/version consistency
- required-file checks
- ZIP integrity

[📖 **Click here to read more → Development Guide**](docs/DEVELOPMENT.md)

---

# 🔐 Permissions

The extension currently requests permissions for:

- `storage`
- `tabs`
- `clipboardWrite`
- `declarativeNetRequestWithHostAccess`
- `sidePanel`

Host permissions include configured GitHub/raw GitHub access and HTTP/HTTPS web resources used by the application.

Permissions should be reviewed whenever new functionality is added.

[📖 **Click here to read more → Security Guide**](docs/SECURITY.md)

---

# 📈 Version and Data Schema

Current extension version:

**3.3.4**

Current application workspace schema:

**5**

Official Documentation JSON schema:

**2**

The storage layer uses migrations so new fields can be added without intentionally replacing the user's existing workspace.

---

# 💡 Recommended Use Case

Charlie MJ DevOps Explorer is especially useful if you are learning or building around technologies such as:

- AWS
- Azure
- Google Cloud
- Kubernetes
- Docker
- Terraform
- Ansible
- Jenkins
- GitHub Actions
- GitLab CI/CD
- Argo CD
- Prometheus
- Grafana
- Linux
- Git
- CI/CD
- DevSecOps
- Infrastructure as Code
- Observability

The extension is designed so a technology is not just a name in a catalog. It can become the center of a connected learning workflow.

---

# 🎯 Example End-to-End Scenario

Suppose you want to learn **Amazon EKS**.

### Step 1 — Search

Search `Amazon EKS` locally and on GitHub.

### Step 2 — Save

Bookmark useful repositories and favorite the best resources.

### Step 3 — Documentation

Select the Amazon EKS official documentation.

### Step 4 — Learning

Create:

**Learning: Amazon EKS Fundamentals**

### Step 5 — Lab

Create:

**Lab: Deploy an application to Amazon EKS**

### Step 6 — Project

Create:

**Project: AWS Kubernetes DevOps Platform**

### Step 7 — Goal

Create:

**Goal: Deploy workloads confidently on EKS**

### Step 8 — Roadmap

Attach the Learning card to your Kubernetes/AWS Roadmap.

### Step 9 — Track

Update progress and status.

### Step 10 — Export

Download the Learning card or workspace information as Markdown for your external knowledge base.

---

# 🤝 Contribution

Contributions should preserve the project's main principles:

- lightweight
- modular
- local-first
- data-driven
- maintainable
- non-destructive personalization
- clear documentation

Before submitting a change, validate JavaScript, JSON, tests, manifest consistency, and relevant user workflows.

---

# 📄 License

Add the project's chosen license file here when the repository adopts one. This README does not invent a license that is not present in the current package.

---

# 📚 Documentation Home

For the complete documentation map, open:

[📖 **Click here to open the Documentation Index →**](docs/DOCUMENTATION-INDEX.md)

---

## Charlie MJ DevOps Explorer

**Discover → Search → Learn → Practice → Build → Track → Review**
