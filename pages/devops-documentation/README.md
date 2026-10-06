# 🚀 Charlie MJ DevOps Explorer

> **Explore DevOps technologies, tools, resources, documentation, labs, bookmarks, and learning materials — all from one developer-focused platform.**

**Charlie MJ DevOps Explorer** is an open-source DevOps learning and discovery platform designed to bring DevOps technologies, tools, documentation, GitHub resources, bookmarks, labs, collections, and learning resources into one organized interface.

The project is designed for **DevOps learners, cloud engineers, developers, system administrators, platform engineers, SREs, and technology enthusiasts** who want a centralized place to discover and organize DevOps knowledge.

---

## 🌐 Live Website

**Charlie MJ DevOps Explorer**

https://awsrmmustansarjavaid.github.io/charlie-mj-devops-explorer/

### 📚 DevOps Documentation

https://awsrmmustansarjavaid.github.io/charlie-mj-devops-explorer/pages/devops-documentation/

The Documentation module provides a dedicated searchable knowledge database for DevOps tools and technologies.

---

# 🎯 Project Vision

The goal of Charlie MJ DevOps Explorer is to create a **single DevOps discovery and learning hub** instead of requiring users to search through many different websites, GitHub repositories, documentation portals, bookmarks, and learning resources separately.

The platform follows this idea:

```text
Discover
   ↓
Search
   ↓
Explore
   ↓
Understand
   ↓
Learn
   ↓
Save
   ↓
Organize
   ↓
Practice
   ↓
Review
```

The long-term vision is to build a connected DevOps knowledge platform where technologies, documentation, repositories, labs, bookmarks, collections, and learning paths work together.

---

# ✨ Core Features

## 🔎 DevOps Explorer

The main Explorer interface helps users discover DevOps technologies and resources.

Features include:

* DevOps technology discovery
* GitHub resource search
* Technology-based exploration
* Category-based discovery
* Search and filtering
* DevOps resource organization
* Repository/resource discovery
* Quick access to learning resources

---

# 📚 DevOps Documentation

The project now includes a dedicated:

```text
pages/devops-documentation/
```

module.

The Documentation page is designed as a centralized **DevOps Knowledge Database**.

It can contain documentation and structured information for hundreds of DevOps tools, platforms, technologies, and services.

### Documentation features

* 🔍 Search DevOps tools
* 🗂️ Category filtering
* 🏷️ Tag filtering
* ☁️ Provider filtering
* 📁 Subcategory filtering
* 🎓 Learning-level filtering
* 🧩 Tool-type filtering
* ⭐ Favorites
* 🕘 Recently viewed tools
* 🔤 Sorting
* ▦ Grid view
* ☰ List view
* 📖 Tool details
* 🌐 Official website links
* 📚 Official documentation links
* 💻 GitHub repository links
* 🔗 Related technologies
* 🏷️ Tool tags
* 📋 Copy documentation URL
* 📊 Result counters
* 🔄 Reset filters
* 📱 Responsive interface
* 🌙 Developer-focused dark UI

---

# 🗃️ Shared DevOps Tool Database

One of the most important architectural decisions in this project is the use of a **single shared JSON database**.

The main database is:

```text
data/devops-tools.json
```

This file acts as the **single source of truth** for DevOps tool information.

The same database can be consumed by:

```text
                    devops-tools.json
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
   DevOps Documentation          Chrome Extension
          Website                 DevOps Explorer
```

This prevents duplicate tool databases and makes the project easier to maintain.

---

# 🔄 Automatic Documentation Updates

The Documentation page loads its tools dynamically from:

```text
../../data/devops-tools.json
```

The page JavaScript reads the JSON database and generates the documentation interface.

Therefore, when you add a new tool to:

```text
data/devops-tools.json
```

the Documentation page can automatically display the new tool after the page is refreshed.

### Example

```text
You update:

data/devops-tools.json

        ↓

Add a new DevOps tool

        ↓

Push changes to GitHub

        ↓

GitHub Pages updates

        ↓

Documentation JavaScript loads JSON

        ↓

New tool appears automatically
```

### Important

You normally **do not need to modify `index.html`** every time you add a new tool.

You only need to make sure the new JSON record follows the project's expected structure.

---

# 🧩 Documentation Database Structure

A typical tool record can contain information such as:

```json
{
  "id": "docker",
  "name": "Docker",
  "shortName": "Docker",
  "category": "Containerization",
  "subcategory": "Containers",
  "provider": "Docker",
  "type": "Container Platform",
  "description": "Platform for building, running, and managing containers.",
  "officialWebsite": "https://www.docker.com/",
  "officialDocumentation": "https://docs.docker.com/",
  "github": "https://github.com/docker",
  "learningLevel": "Beginner",
  "tags": [
    "containers",
    "docker",
    "devops"
  ],
  "relatedTools": [
    "kubernetes",
    "podman"
  ]
}
```

The exact fields should remain consistent with the schema expected by the Documentation JavaScript.

---

# 🏗️ Recommended Repository Architecture

```text
charlie-mj-devops-explorer/
│
├── index.html
│
├── README.md
│
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── icons/
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   └── devops-documentation.js
│
├── data/
│   └── devops-tools.json
│
├── pages/
│   │
│   └── devops-documentation/
│       │
│       ├── index.html
│       │
│       ├── css/
│       │   └── devops-documentation.css
│       │
│       └── js/
│           └── devops-documentation.js
│
└── chrome-extension/
    │
    ├── manifest.json
    ├── popup.html
    ├── popup.css
    ├── popup.js
    └── ...
```

---

# 📂 Important Directories

## `index.html`

The main Charlie MJ DevOps Explorer homepage.

It provides the primary DevOps exploration interface.

---

## `data/`

Contains shared application data.

Current primary database:

```text
data/devops-tools.json
```

This database is intended to be shared between the website and Chrome extension.

---

## `pages/devops-documentation/`

Contains the independent DevOps Documentation module.

```text
pages/devops-documentation/
├── index.html
├── css/
│   └── devops-documentation.css
└── js/
    └── devops-documentation.js
```

### `index.html`

Documentation page interface.

### `css/devops-documentation.css`

Documentation-specific styling.

### `js/devops-documentation.js`

Documentation functionality, including:

* JSON loading
* Search
* Filters
* Sorting
* Favorites
* Recently viewed
* Grid/list switching
* Tool cards
* Tool details
* Related tools
* Modal interface

---

# 🌐 Documentation Data Flow

The Documentation page uses this architecture:

```text
pages/devops-documentation/index.html
                  │
                  ▼
pages/devops-documentation/js/
devops-documentation.js
                  │
                  ▼
../../data/devops-tools.json
                  │
                  ▼
       Tool Database
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
      Search    Filter    Sort
        │         │         │
        └─────────┼─────────┘
                  ▼
          Documentation UI
```

---

# 🧠 Documentation vs Bookmarks

The project intentionally keeps **official DevOps documentation** separate from **personal bookmarks**.

## DevOps Documentation

Answers:

> **What is this tool and where can I learn about it?**

Examples:

```text
Docker
Kubernetes
Jenkins
Terraform
Ansible
Prometheus
Grafana
AWS
Azure
Google Cloud
GitHub
GitLab
```

The database can contain:

* Tool information
* Official website
* Official documentation
* GitHub repository
* Categories
* Subcategories
* Tags
* Learning level
* Related tools
* Tool type
* Provider

---

## Bookmarks

Answers:

> **What resources did I personally save?**

Examples:

```text
Kubernetes Course
Docker Tutorial
Terraform Lab
AWS Documentation
Jenkins Pipeline Tutorial
GitHub Repository
DevOps Article
YouTube Course
```

This separation keeps the architecture clean.

---

# ☁️ DevOps Categories

The Documentation database can organize tools across categories such as:

### Cloud

* AWS
* Microsoft Azure
* Google Cloud
* Oracle Cloud
* IBM Cloud
* DigitalOcean
* Cloudflare
* Multi-cloud

### CI/CD

* Jenkins
* GitHub Actions
* GitLab CI/CD
* CircleCI
* TeamCity
* Bamboo
* Travis CI
* Argo Workflows

### Containers

* Docker
* Podman
* containerd
* CRI-O
* Buildah

### Container Orchestration

* Kubernetes
* Amazon EKS
* Azure AKS
* Google GKE
* OpenShift
* Rancher
* Nomad

### Infrastructure as Code

* Terraform
* OpenTofu
* Pulumi
* AWS CloudFormation
* AWS CDK
* Azure Bicep
* ARM Templates
* Crossplane

### Configuration Management

* Ansible
* Puppet
* Chef
* Salt

### Monitoring

* Prometheus
* Grafana
* Zabbix
* Nagios

### Observability

* OpenTelemetry
* Grafana
* Jaeger
* Elastic Observability

### Logging

* Elasticsearch
* Logstash
* Fluent Bit
* Fluentd
* Loki

### Security / DevSecOps

* Trivy
* SonarQube
* OWASP Dependency-Check
* Snyk
* Semgrep

### Version Control

* Git
* GitHub
* GitLab
* Bitbucket

### GitOps

* Argo CD
* Flux

### Artifact Management

* JFrog Artifactory
* Sonatype Nexus
* GitHub Packages
* GitLab Package Registry

### Networking

* NGINX
* HAProxy
* Traefik
* Envoy

### Service Mesh

* Istio
* Linkerd
* Consul

### Automation

* Ansible
* Terraform
* Pulumi
* Jenkins

This taxonomy can continue expanding as the database grows.

---

# 🔍 Search System

The Documentation search is designed to search across multiple tool properties.

Depending on the database fields, users can search:

```text
Tool Name
Short Name
Description
Category
Subcategory
Provider
Tags
Tool Type
```

For example:

```text
docker
```

can find Docker.

Searching:

```text
container
```

can find tools associated with containerization.

Searching:

```text
aws
```

can find AWS-related technologies.

---

# 🎓 Learning Levels

Tools can be categorized by learning difficulty:

```text
Beginner
Intermediate
Advanced
```

This allows learners to discover tools appropriate for their current level.

Example:

```text
Beginner
    ↓
Docker
Git
GitHub
Jenkins

Intermediate
    ↓
Terraform
Kubernetes
Ansible

Advanced
    ↓
Service Mesh
Advanced Kubernetes
Multi-cloud Infrastructure
Platform Engineering
```

---

# ⭐ Favorites

Users can mark important DevOps tools as favorites.

This makes it easier to create a personal shortlist of technologies they want to study or use regularly.

---

# 🕘 Recently Viewed

The Documentation module can maintain a recently viewed list so users can quickly return to tools they recently explored.

Example:

```text
Recently Viewed

1. Kubernetes
2. Terraform
3. Docker
4. Jenkins
5. Prometheus
```

---

# ▦ Grid and List Views

The Documentation page supports different viewing styles.

### Grid View

Useful for visual exploration of many DevOps tools.

### List View

Useful for quickly scanning a large documentation database.

---

# 🔗 Official Resources

Each tool can provide direct links to its official resources.

Typical resources include:

```text
🌐 Official Website
📚 Official Documentation
💻 GitHub Repository
```

Only real, verified official URLs should be added to the database.

The project should **not fabricate documentation URLs simply to reach a particular tool count**.

---

# 🧩 Related Technologies

Tools can reference related technologies.

Example:

```text
Docker
│
├── Kubernetes
├── Podman
├── containerd
└── Buildah
```

Another example:

```text
Terraform
│
├── OpenTofu
├── Pulumi
├── CloudFormation
└── AWS CDK
```

This creates a connected DevOps learning experience.

---

# 🏷️ Tags

Tools can contain multiple tags.

Example:

```json
"tags": [
  "docker",
  "containers",
  "containerization",
  "devops"
]
```

Tags improve:

* Search
* Filtering
* Discovery
* Categorization
* Related-tool discovery

---

# 🧩 Chrome Extension

The project can also contain a Chrome extension under:

```text
chrome-extension/
```

The extension is designed to complement the main DevOps Explorer.

It can provide features such as:

* DevOps resource search
* Documentation access
* Technology search
* Categories
* Tags
* Bookmarks
* Collections
* Favorites
* Recently viewed resources
* Quick access to the main Explorer
* Shared DevOps database
* GitHub resource discovery

---

# 🔄 Shared Database Between Website and Extension

The long-term architecture is:

```text
                  GitHub Repository
                         │
                         ▼
                 devops-tools.json
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
     GitHub Pages              Chrome Extension
     Documentation             DevOps Explorer
             │                       │
             └───────────┬───────────┘
                         ▼
                 Same Tool Database
```

This means the website and extension do not need separate copies of the same tool information.

---

# 📌 Documentation URL

The Documentation module is available at:

```text
/pages/devops-documentation/
```

On GitHub Pages:

```text
https://awsrmmustansarjavaid.github.io/charlie-mj-devops-explorer/pages/devops-documentation/
```

The preferred URL does not need to explicitly include `index.html`.

---

# 🖥️ Design Philosophy

The project follows a technical developer-dashboard visual style.

The interface uses:

* Dark navy background
* Developer/terminal aesthetic
* Subtle grid
* Circuit-inspired visual elements
* Green accent color
* Technical typography
* Dashboard-style cards
* Responsive layouts
* Clean information hierarchy

The Documentation page intentionally follows the same visual language as the main DevOps Explorer.

---

# ♿ Accessibility and Responsive Design

The interface is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The UI also includes keyboard focus states and reduced-motion support where applicable.

The goal is to keep the application usable while maintaining the technical dashboard aesthetic.

---

# 🚀 GitHub Pages

The project is designed to work as a static GitHub Pages application.

There is no requirement for a traditional backend server for the Documentation module.

The basic architecture is:

```text
HTML
  +
CSS
  +
JavaScript
  +
JSON
  ↓
GitHub Pages
```

---

# 🛠️ Local Development

Because this is a static web application, you can clone the repository and run it locally.

Clone the repository:

```bash
git clone https://github.com/awsrmmustansarjavaid/charlie-mj-devops-explorer.git
```

Enter the project:

```bash
cd charlie-mj-devops-explorer
```

Then serve the project using a local HTTP server.

For example, with Python:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/
```

Documentation:

```text
http://localhost:8000/pages/devops-documentation/
```

Using a local HTTP server is recommended because the application loads JSON using `fetch()`.

---

# 📦 Data Management

The primary DevOps database is:

```text
data/devops-tools.json
```

When modifying the database:

1. Add the new tool.
2. Use the existing JSON structure.
3. Give the tool a unique `id`.
4. Add the correct category.
5. Add the correct subcategory where applicable.
6. Add provider information where applicable.
7. Add the official website.
8. Add official documentation.
9. Add GitHub repository when available.
10. Add learning level.
11. Add useful tags.
12. Add related tools where appropriate.
13. Validate the JSON.
14. Commit the change.
15. Push to GitHub.

---

# ➕ Adding a New Tool

Example:

```json
{
  "id": "example-tool",
  "name": "Example Tool",
  "shortName": "Example",
  "category": "Automation",
  "subcategory": "DevOps Automation",
  "provider": "Example Provider",
  "type": "DevOps Tool",
  "description": "Example description.",
  "officialWebsite": "https://example.com/",
  "officialDocumentation": "https://example.com/docs/",
  "github": null,
  "learningLevel": "Beginner",
  "tags": [
    "automation",
    "devops"
  ],
  "relatedTools": []
}
```

After updating:

```text
data/devops-tools.json
```

the Documentation page will load the new record dynamically when the page is refreshed.

---

# ⚠️ Data Quality Principle

The DevOps database should prioritize **quality and accuracy over simply reaching a specific number of tools**.

Official URLs should be:

* Real
* Current
* Relevant
* Associated with the actual vendor/project

Avoid:

```text
Fake documentation URLs
Guessed URLs
Broken URLs
Unofficial URLs presented as official
```

A smaller verified database is better than a larger database containing incorrect information.

---

# 🧪 Validation Checklist

Before committing changes to the JSON database, verify:

```text
[ ] JSON is valid
[ ] id is unique
[ ] name is correct
[ ] category is correct
[ ] subcategory is correct
[ ] provider is correct
[ ] description is accurate
[ ] official website is valid
[ ] documentation URL is valid
[ ] GitHub URL is valid where applicable
[ ] learning level is appropriate
[ ] tags are relevant
[ ] related tools use valid IDs
```

---

# 🔐 No Duplicate Databases

Do not create separate copies such as:

```text
documentation-tools.json
extension-tools.json
devops-database.json
chrome-tools.json
```

when they contain the same information.

Prefer:

```text
data/devops-tools.json
```

as the central source.

---

# 📈 Future Data Architecture

As the project grows, the `data/` directory can eventually contain:

```text
data/
├── devops-tools.json
├── categories.json
├── tags.json
└── bookmarks.json
```

However, these additional datasets should only be introduced when they are actually required.

The current primary shared database remains:

```text
data/devops-tools.json
```

---

# 🗺️ Future Roadmap

The project can eventually expand into a complete DevOps learning platform.

## Phase 1 — Explorer

* DevOps technology discovery
* GitHub resource search
* Categories
* Search
* Filters

## Phase 2 — Documentation

* DevOps tool database
* Official documentation
* Official websites
* GitHub repositories
* Tags
* Related tools
* Learning levels
* Favorites
* Recently viewed

## Phase 3 — Organization

* Bookmarks
* Collections
* Tags
* Favorites
* Import/export
* Personal resource management

## Phase 4 — Learning

Potential future modules:

```text
DevOps Roadmap
Learning Paths
Beginner → Intermediate → Advanced
Technology Prerequisites
Labs
Projects
Practice Resources
Learning Progress
```

## Phase 5 — DevOps Knowledge Graph

Long-term, the project can connect:

```text
Technology
    ↓
Tool
    ↓
Category
    ↓
Related Tools
    ↓
Documentation
    ↓
GitHub Repository
    ↓
Lab
    ↓
Project
    ↓
Learning Path
```

This would transform the project from a simple resource explorer into a connected DevOps knowledge platform.

---

# 🧭 Possible Future Modules

The architecture allows additional pages to be added later.

For example:

```text
pages/
├── devops-documentation/
├── roadmap/
├── learning/
├── labs/
├── projects/
└── architecture/
```

Each module can remain independent while sharing common data where appropriate.

---

# 📚 Suggested Learning Workflow

A learner could eventually use the platform like this:

```text
1. Discover a technology
        ↓
2. Open its documentation
        ↓
3. Read about the tool
        ↓
4. Explore related technologies
        ↓
5. Find GitHub repositories
        ↓
6. Save useful resources
        ↓
7. Add resources to a collection
        ↓
8. Practice through a lab
        ↓
9. Build a project
        ↓
10. Continue to the next technology
```

---

# 🧰 Technology Stack

The project is intentionally lightweight.

### Frontend

```text
HTML5
CSS3
JavaScript
```

### Data

```text
JSON
```

### Hosting

```text
GitHub Pages
```

### Source Control

```text
Git
GitHub
```

### Browser Extension

```text
Chrome Extension
Manifest-based architecture
JavaScript
HTML
CSS
```

The project aims to minimize unnecessary dependencies.

---

# 💡 Why a Shared JSON Architecture?

The shared JSON architecture provides several advantages.

### Single source of truth

Tool information exists in one central location.

### Easier maintenance

Update one record instead of editing multiple applications.

### Reusable data

The same database can power:

* Website
* Documentation page
* Chrome extension
* Future learning modules
* Future APIs or applications

### Scalable architecture

New tools can be added without changing the Documentation HTML.

### Separation of concerns

```text
HTML
→ Structure

CSS
→ Presentation

JavaScript
→ Application logic

JSON
→ DevOps data
```

This makes the project easier to understand and maintain.

---

# 🤝 Contributing

Contributions are welcome.

You can contribute by:

* Adding DevOps tools
* Improving tool information
* Verifying official documentation links
* Improving categories
* Adding related tools
* Improving UI/UX
* Fixing bugs
* Improving accessibility
* Improving responsive design
* Adding learning resources
* Improving documentation
* Suggesting new features

When adding a tool, prioritize accurate official information.

---

# 📝 Contribution Guidelines

Before submitting changes:

```text
1. Keep the existing project structure.
2. Follow the existing naming conventions.
3. Keep the JSON schema consistent.
4. Do not duplicate existing tools.
5. Use verified official URLs.
6. Keep descriptions concise and accurate.
7. Test the Documentation page locally.
8. Test search and filters.
9. Validate JSON syntax.
10. Keep the interface responsive.
```

---

# 🐛 Issues and Feature Requests

If you discover a problem or have an idea for improving the project, open an issue in the GitHub repository.

Useful issue categories include:

```text
Bug
Feature Request
Documentation
Data Quality
UI/UX
Performance
Accessibility
Chrome Extension
DevOps Tool Request
```

---

# 🔄 Development Philosophy

Charlie MJ DevOps Explorer is intended to evolve gradually.

The project should favor:

```text
Simple
    ↓
Useful
    ↓
Organized
    ↓
Reusable
    ↓
Scalable
```

rather than adding unnecessary complexity.

---

# 📌 Important Architecture Rule

The most important data architecture rule is:

> **`data/devops-tools.json` is the shared source of truth for DevOps tool information.**

The Documentation page should read from the JSON database instead of hard-coding hundreds of tools into HTML or JavaScript.

This means:

```text
Add tool to JSON
        ↓
Refresh Documentation
        ↓
New tool appears
```

No individual HTML card needs to be manually created for every new tool.

---

# 🔮 Long-Term Vision

The long-term goal is to make Charlie MJ DevOps Explorer more than a search interface.

The platform can become a personal **DevOps Knowledge & Learning Hub** combining:

```text
                    Charlie MJ
                DevOps Explorer
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    Explorer     Documentation    Bookmarks
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
                 Collections
                       │
                       ▼
                    Labs
                       │
                       ▼
                   Projects
                       │
                       ▼
                Learning Paths
                       │
                       ▼
                DevOps Knowledge
```

The ultimate goal is:

> **Discover → Understand → Learn → Save → Organize → Practice → Build**

---

# 📜 License

Add the project's chosen open-source license here.

For example:

```text
MIT License
```

if the repository is intended to use the MIT License.

---

# 👨‍💻 Project

**Charlie MJ DevOps Explorer**

Built as an open-source project for discovering, learning, organizing, and exploring DevOps technologies and resources.

---

## ⭐ Support the Project

If you find the project useful:

* ⭐ Star the repository
* 🍴 Fork the project
* 🐛 Report issues
* 💡 Suggest features
* 🔧 Contribute improvements
* 📚 Help improve the DevOps knowledge database

---

## 🚀 Charlie MJ DevOps Explorer

**Discover DevOps. Learn DevOps. Build DevOps.**

```text
Explore → Understand → Learn → Organize → Practice → Build
```
