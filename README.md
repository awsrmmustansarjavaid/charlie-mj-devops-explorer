# Charlie-MJ DevOPS Explorer

> **A DevOps-focused GitHub Explorer for discovering labs, projects, tutorials, notes, technologies, learning resources, and DevOps creators.**

Charlie-MJ DevOPS Explorer is a web-based DevOps resource discovery platform designed to make it easier to find useful **GitHub repositories, DevOps projects, hands-on labs, tutorials, study notes, CI/CD projects, GitOps resources, and technology-specific learning material**.

Instead of manually searching GitHub again and again for Kubernetes, Docker, AWS, Terraform, Jenkins, GitHub Actions, Argo CD, DevSecOps, monitoring, and other DevOps technologies, this project provides a focused interface for discovering and organizing those resources.

---

# 🚀 Live Demo

## Live Website

👉 **Live Demo:** [Click here for the live website](https://awsrmmustansarjavaid.github.io/charlie-mj-devops-explorer/)

> Replace the URL above with the actual GitHub Pages URL after deploying the project.

---

# 📌 1. What Is This Project?

**Charlie-MJ DevOPS Explorer** is a frontend-based DevOps discovery and learning platform.

The main purpose of the project is to provide a dedicated interface for finding DevOps-related GitHub resources.

It combines:

* GitHub Repository Search
* DevOps Technology Knowledge Base
* DevOps Categories
* Resource Filtering
* Technology Filtering
* Programming Language Filtering
* Repository Sorting
* Search Modes
* DevOps Labs
* DevOps Projects
* Tutorials
* Study Notes
* CI/CD Resources
* GitOps Resources
* Repository Details
* Creator Profiles
* Saved Repositories
* Search History
* Recently Viewed Resources
* Learning Paths
* DevOps Architecture Concepts

The application uses the **GitHub REST API** for live repository and user searches while also maintaining a local JSON-based DevOps knowledge base.

---

# 🎯 2. Why I Developed This Project

## The Problem

While learning DevOps, there are many technologies, tools, cloud platforms, projects, tutorials, and GitHub repositories available.

For example:

* Linux
* Git
* GitHub
* Docker
* Kubernetes
* AWS
* Amazon EKS
* Terraform
* CloudFormation
* Jenkins
* GitHub Actions
* Ansible
* Helm
* Argo CD
* Prometheus
* Grafana
* Trivy
* SonarQube
* Redis
* PostgreSQL
* Python
* Bash
* and many more.

The problem is not the lack of resources.

The problem is **finding the right resources**.

A normal GitHub search can return a very large number of repositories, and it can become difficult to identify:

* Which repository is a lab?
* Which repository is a complete project?
* Which repository contains tutorials?
* Which repository contains Kubernetes notes?
* Which project uses Jenkins?
* Which project uses GitOps?
* Which repositories are related to AWS EKS?
* Which repositories are useful for beginners?
* Which repositories contain hands-on practice?
* Which DevOps technologies are related to each other?

## My Solution

I developed **Charlie-MJ DevOPS Explorer** to create a focused discovery layer specifically for DevOps.

Instead of searching GitHub randomly, users can search using DevOps-oriented categories and filters.

For example:

```text
Kubernetes Labs
AWS EKS
Terraform AWS
Jenkins CI/CD
Docker Projects
Argo CD GitOps
```

The application converts the user's search into an appropriate GitHub search query and displays the results in a structured interface.

---

# 💡 3. Benefits of This Project

## For DevOps Learners

The project can help learners quickly discover:

* DevOps projects
* Kubernetes labs
* Docker projects
* AWS projects
* Terraform repositories
* Jenkins pipelines
* GitHub Actions workflows
* GitOps projects
* DevSecOps resources
* Monitoring projects
* Infrastructure-as-Code repositories
* Study notes
* Tutorials

## For Practical Learning

Instead of only reading theoretical documentation, learners can find repositories containing:

```text
README
↓
Source Code
↓
Configuration
↓
Infrastructure
↓
Docker
↓
Kubernetes
↓
CI/CD
↓
Deployment
```

This makes it easier to study how different DevOps technologies work together.

## For Project Discovery

Users can discover real GitHub repositories based on:

* Technology
* Programming language
* Resource type
* Repository popularity
* Last update
* Creation date

## For Personal Learning

The application also provides functionality for saving repositories and maintaining search/recent history.

This can help create a personal DevOps resource collection.

---

# ✨ 4. Features

## 🔎 GitHub Repository Search

Search GitHub repositories directly from the application.

Example:

```text
kubernetes
docker
terraform aws
amazon eks
jenkins
argocd
prometheus
grafana
```

---

## 🧭 DevOps Search Modes

The project provides specialized search modes:

* Everything
* Labs
* Projects
* Tutorials
* Notes
* CI/CD
* GitOps

For example:

```text
Labs
```

can focus the search toward:

```text
lab
laboratory
hands-on
workshop
```

while:

```text
GitOps
```

can focus the search toward:

```text
gitops
argocd
argo cd
flux
```

---

## ⚡ Quick Searches

The homepage provides predefined searches such as:

```text
Kubernetes Labs
AWS EKS
Terraform AWS
Jenkins CI/CD
Docker Projects
Argo CD GitOps
```

This allows users to start exploring without writing complex search queries.

---

## 🧰 Technology Filtering

Users can filter resources by DevOps technologies.

Examples:

* Kubernetes
* Docker
* Terraform
* AWS
* Amazon EKS
* Jenkins
* GitHub Actions
* Argo CD
* Prometheus
* Grafana
* Ansible
* Helm

---

## 💻 Programming Language Filtering

Repositories can also be filtered by programming language.

Examples:

```text
Python
JavaScript
Java
Go
Shell
TypeScript
C#
```

---

## ⭐ Repository Sorting

Search results can be sorted using different GitHub search options:

* Best Match
* Most Stars
* Recently Updated
* Recently Created

---

## 📦 Repository Cards

Each repository can display information such as:

* Repository name
* Description
* Owner
* Programming language
* Stars
* Forks
* Topics
* Last update
* GitHub link
* Internal repository details
* Save/bookmark action

---

## 🔖 Save Repositories

Users can save useful repositories locally.

Saved repositories are stored using:

```text
localStorage
```

This means the application can maintain saved resources without requiring a backend database.

---

## 🕘 Search History

The application can store recent searches locally.

Example:

```text
kubernetes labs
terraform aws
jenkins cicd
amazon eks
```

---

## 👀 Recently Viewed Resources

The application can also track recently viewed resources.

This makes it easier to return to repositories or resources previously explored.

---

## 👨‍💻 Creator Profiles

The application can display GitHub creator information such as:

* Username
* Profile image
* Name
* Bio
* Public repositories
* Followers
* GitHub profile

---

## 🧠 DevOps Technology Knowledge Base

The project contains a local JSON database containing DevOps technologies.

Each technology can contain information such as:

```text
Name
Slug
Category
Subcategory
Icon
Skill Level
Description
Short Description
Aliases
Keywords
Related Technologies
```

---

## 🗂️ DevOps Categories

The project also contains a DevOps category knowledge base.

Examples:

```text
Operating Systems
Version Control
Containers
Container Orchestration
Cloud Computing
Infrastructure as Code
CI/CD
GitOps
Configuration Management
DevSecOps
Observability
Monitoring
Networking
Databases
Scripting & Programming
Kubernetes Ecosystem
Cloud Native
Secrets Management
Artifact Management
Microservices
Automation
```

---

## 🛤️ Learning Paths

The project can organize technologies and resources into learning paths.

For example:

```text
Linux
   ↓
Git
   ↓
GitHub
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
GitOps
   ↓
Observability
```

---

# 🛠️ 5. Technologies Used

This project is intentionally built primarily with frontend web technologies and public/local data sources.

## Frontend

### HTML5

Used to create the application structure and pages.

### CSS3

Used for:

* Layout
* Responsive design
* Cards
* Navigation
* Buttons
* Search interface
* Hero section
* Technology sections
* Repository cards
* Mobile layouts

### JavaScript

JavaScript provides the main application logic.

It handles:

* GitHub API communication
* Search
* Filtering
* Sorting
* Rendering
* Navigation
* Local storage
* Technology data
* Category data
* Repository cards
* Creator cards

---

# ☁️ External API

## GitHub REST API

The application communicates with the GitHub API for live data.

The main GitHub API functionality includes:

```text
Search repositories
Search users
Get repository details
Get repository languages
Get user information
Get user repositories
Get API rate-limit information
```

---

# 📄 Local JSON Data

The project also uses local JSON files.

### `devops-technologies.json`

Contains DevOps technology information.

### `devops-categories.json`

Contains DevOps category information.

This allows the application to maintain its own DevOps knowledge base independently from GitHub.

---

# 💾 Browser Local Storage

The browser's `localStorage` is used for client-side persistence.

The application can store:

```text
Saved repositories
Search history
Recently viewed resources
Saved technologies
```

---

# 🧰 Development Tools

The project can be developed using:

* Visual Studio Code
* Git
* GitHub
* GitHub Pages
* Browser Developer Tools
* Python HTTP Server
* VS Code Live Server

---

# 🏗️ 6. Architecture Design

The project follows a simple frontend architecture.

```text
                    ┌──────────────────────────┐
                    │        User / Learner    │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       HTML Interface     │
                    │                          │
                    │ Search / Filters / UI    │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     JavaScript App       │
                    │        app.js             │
                    └────────────┬─────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       ┌─────────────┐    ┌─────────────┐    ┌──────────────┐
       │ Search      │    │ Technologies│    │ Categories   │
       │ Engine      │    │ Module      │    │ Module       │
       └──────┬──────┘    └──────┬──────┘    └──────┬───────┘
              │                  │                  │
              ▼                  ▼                  ▼
       ┌─────────────┐    ┌─────────────┐    ┌──────────────┐
       │ GitHub API  │    │ JSON Data   │    │ JSON Data    │
       └──────┬──────┘    └─────────────┘    └──────────────┘
              │
              ▼
       ┌─────────────┐
       │ GitHub      │
       │ Repositories│
       └─────────────┘

                         │
                         ▼

                ┌────────────────────┐
                │ Browser Storage    │
                │                    │
                │ Saved Resources    │
                │ Search History     │
                │ Recently Viewed    │
                └────────────────────┘
```

---

# 🔄 Application Architecture

The application can be viewed as several logical layers.

```text
┌──────────────────────────────────────────────┐
│                 Presentation                 │
│                                              │
│ HTML + CSS + Repository Cards + UI           │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────▼───────────────────────┐
│               Application Logic              │
│                                              │
│ app.js                                       │
│ search.js                                    │
│ filters.js                                   │
│ technologies.js                              │
│ categories.js                                │
└──────────────────────┬───────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
┌──────────────────────┐  ┌──────────────────────┐
│ External Data        │  │ Local Data            │
│                      │  │                      │
│ GitHub REST API      │  │ JSON Knowledge Base  │
└──────────────────────┘  └──────────────────────┘
          │                         │
          └────────────┬────────────┘
                       ▼
              ┌─────────────────┐
              │ Browser Storage │
              └─────────────────┘
```

---

# 📁 7. GitHub Repository Structure

```text
devops-explorer/
│
├── index.html
├── README.md
├── .gitignore
│
├── assets/
│   ├── images/
│   │   └── devops-engineer.png
│   │
│   └── icons/
│
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── github-api.js
│   ├── search.js
│   ├── filters.js
│   ├── technologies.js
│   ├── categories.js
│   ├── repository-card.js
│   ├── creator-card.js
│   ├── storage.js
│   └── utils.js
│
├── data/
│   ├── devops-technologies.json
│   └── devops-categories.json
│
├── docs/
│   ├── devops-roadmap.md
│   ├── kubernetes.md
│   ├── docker.md
│   ├── terraform.md
│   ├── aws.md
│   ├── jenkins.md
│   ├── github-actions.md
│   └── gitops.md
│
└── pages/
    ├── explorer.html
    ├── technologies.html
    ├── technology.html
    ├── repository.html
    ├── creator.html
    ├── labs.html
    ├── learning-path.html
    └── saved.html
```

---

# 📚 Project Directory Explanation

## `index.html`

The main homepage of the application.

It contains:

* Navigation
* Hero section
* Search
* Filters
* Quick searches
* Featured repositories
* Technologies
* Categories
* Learning/architecture sections
* Footer

---

## `css/`

Contains the application's styles.

### `style.css`

Main global styles.

### `components.css`

Reusable component styles such as:

* Cards
* Buttons
* Repository cards
* Technology cards
* Category cards
* Search components

### `responsive.css`

Responsive styles for:

* Desktop
* Tablet
* Mobile

---

# JavaScript Architecture

## `app.js`

Main application controller.

It connects the different modules and initializes the correct functionality for each page.

---

## `github-api.js`

Responsible for communication with GitHub.

It provides functions such as:

```javascript
searchRepositories()
searchUsers()
getRepository()
getRepositoryLanguages()
getUser()
getUserRepositories()
getRateLimit()
```

---

## `search.js`

Responsible for the main search engine.

It:

1. Receives user input.
2. Normalizes the search term.
3. Applies aliases.
4. Applies search mode.
5. Builds a GitHub query.
6. Sends the query to GitHub.
7. Receives repositories.
8. Renders the results.

---

## `filters.js`

Handles:

* Resource type
* Technology
* Programming language
* Sorting

---

## `technologies.js`

Responsible for:

* Loading technology JSON
* Finding technologies
* Rendering technology cards
* Populating technology filters

---

## `categories.js`

Responsible for:

* Loading category JSON
* Finding categories
* Rendering category cards

---

## `repository-card.js`

Creates repository result cards.

It handles:

* Repository information
* GitHub links
* Internal repository pages
* Save/bookmark functionality
* Repository selection

---

## `creator-card.js`

Creates GitHub creator/user cards.

---

## `storage.js`

Handles browser local storage.

Example storage categories:

```text
Saved repositories
Search history
Recently viewed
Saved technologies
```

---

## `utils.js`

Contains reusable helper functions.

Examples:

```text
DOM selectors
HTML escaping
URL safety
Slug generation
Number formatting
Date formatting
Relative time
Path handling
```

---

# 📊 8. How This Project Works

The application workflow is approximately:

```text
User
  │
  ▼
Enter Search
  │
  ▼
Select Search Type
  │
  ▼
Apply Filters
  │
  ▼
Search Module
  │
  ▼
Build GitHub Query
  │
  ▼
GitHub REST API
  │
  ▼
GitHub Search Results
  │
  ▼
Repository Data
  │
  ▼
Repository Cards
  │
  ├──────────────► View Repository
  │
  ├──────────────► View Creator
  │
  └──────────────► Save Repository
```

---

# 🔍 Example Search

Suppose the user searches:

```text
Kubernetes
```

The application can transform the search into a GitHub-oriented query.

Conceptually:

```text
Kubernetes
+
DevOps search context
+
Resource filters
+
Technology filters
+
Language filters
```

Then it sends the resulting query to:

```text
GitHub REST API
```

GitHub returns repository information.

The application then converts those API results into repository cards.

---

# 🧠 9. Technical Logic

## Search Alias Logic

The project supports common DevOps abbreviations.

For example:

```text
k8s
```

can be normalized to:

```text
kubernetes
```

Similarly:

```text
tf
```

can be interpreted as:

```text
terraform
```

And:

```text
eks
```

can be interpreted as:

```text
amazon eks
```

Other examples include:

```text
cicd
    ↓
ci/cd

argocd
    ↓
argo cd

gha
    ↓
github actions
```

This allows users to search naturally without remembering exact technology names.

---

# 🧩 Resource Type Logic

Different resource types can add different search terms.

For example:

```text
Labs
```

can use search terms such as:

```text
lab
laboratory
hands-on
workshop
```

Tutorial searches can focus on:

```text
tutorial
guide
course
```

CI/CD searches can focus on:

```text
ci/cd
cicd
jenkins
github actions
gitlab ci
```

GitOps searches can focus on:

```text
gitops
argocd
argo cd
flux
```

This creates a DevOps-specific search experience on top of GitHub's repository search.

---

# 🔗 Internal + External Navigation

The project separates internal application pages from external GitHub pages.

For example:

```text
User clicks repository
        │
        ├── Internal details
        │
        ▼
pages/repository.html
```

The user can also visit the actual GitHub repository:

```text
Repository Card
      │
      ▼
GitHub Repository
```

---

# 🛡️ URL Safety

The application includes URL validation logic.

Only safe HTTP/HTTPS URLs should be accepted.

This helps prevent unsafe URLs from being inserted into generated links.

---

# 🔐 API Security

The frontend does not require a personal GitHub access token for the basic public repository search functionality.

The project uses the public GitHub API.

Important:

> A GitHub personal access token should **never be hard-coded into frontend JavaScript**.

If authentication is added in the future, the architecture should be redesigned so sensitive credentials are not exposed in the browser.

---

# 💾 Local Storage Logic

Saved repositories are stored in browser storage.

Conceptually:

```text
User clicks Save
       │
       ▼
Repository Object
       │
       ▼
storage.js
       │
       ▼
localStorage
       │
       ▼
Saved Repository
```

The same approach is used for:

```text
Search History
Recently Viewed
Saved Technologies
```

---

# 📄 Local DevOps Knowledge Base

The project does not depend entirely on GitHub.

It also contains its own DevOps knowledge data.

```text
data/
│
├── devops-technologies.json
└── devops-categories.json
```

This means the project can provide structured DevOps information even when the user is not actively searching GitHub.

---

# 🌐 10. Page Structure

The project contains multiple pages.

## Home

```text
index.html
```

Main landing page.

---

## Explorer

```text
pages/explorer.html
```

Dedicated GitHub resource exploration page.

---

## Technologies

```text
pages/technologies.html
```

Displays DevOps technologies.

---

## Technology Details

```text
pages/technology.html
```

Displays detailed information about a selected technology.

Example:

```text
Kubernetes
```

---

## Repository Details

```text
pages/repository.html
```

Displays details about a selected GitHub repository.

---

## Creator Details

```text
pages/creator.html
```

Displays information about a GitHub creator.

---

## Labs

```text
pages/labs.html
```

Focuses on DevOps hands-on labs and practical resources.

---

## Learning Path

```text
pages/learning-path.html
```

Provides structured DevOps learning progression.

---

## Saved

```text
pages/saved.html
```

Displays repositories saved by the user.

---

# 🚀 11. How to Run the Project Locally

Clone the repository:

```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/YOUR-REPOSITORY-NAME.git
```

Move into the project:

```bash
cd YOUR-REPOSITORY-NAME
```

Because the application loads JSON files using `fetch()`, it should be run through an HTTP server rather than directly opening:

```text
file://
```

---

# 🐍 Option 1 — Python HTTP Server

If Python is installed:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

---

# 💻 Option 2 — VS Code Live Server

Install the **Live Server** extension in Visual Studio Code.

Then:

```text
Right Click index.html
        ↓
Open with Live Server
```

The browser will open the project through a local HTTP server.

---

# 🌐 12. GitHub Pages Deployment

This project is suitable for GitHub Pages because it is a frontend/static application.

Typical deployment flow:

```text
Local Project
     │
     ▼
Git
     │
     ▼
GitHub Repository
     │
     ▼
GitHub Pages
     │
     ▼
Live Website
```

After deployment, the live URL can be added to the **Live Demo** section at the top of this README.

---

# 🔄 13. Development Workflow

The project development workflow is:

```text
Create Feature
     │
     ▼
Write HTML / CSS / JS
     │
     ▼
Test Locally
     │
     ▼
Git Add
     │
     ▼
Git Commit
     │
     ▼
Git Push
     │
     ▼
GitHub
     │
     ▼
GitHub Pages
```

---

# 🧪 14. Example DevOps Resources

The project is designed to help users discover resources around technologies such as:

### Operating Systems

```text
Linux
```

### Version Control

```text
Git
GitHub
```

### Containers

```text
Docker
containerd
```

### Container Orchestration

```text
Kubernetes
Amazon EKS
```

### Cloud

```text
AWS
Amazon ECR
Amazon EKS
```

### Infrastructure as Code

```text
Terraform
AWS CloudFormation
```

### CI/CD

```text
Jenkins
GitHub Actions
```

### Configuration Management

```text
Ansible
```

### Kubernetes Ecosystem

```text
Helm
Argo CD
Flux
```

### Observability

```text
Prometheus
Grafana
OpenTelemetry
```

### DevSecOps

```text
Trivy
SonarQube
OWASP Dependency-Check
```

### Databases / Supporting Technologies

```text
Redis
PostgreSQL
```

### Programming / Scripting

```text
Python
Bash
Go
JavaScript
Node.js
Java
```

---

# 🧱 15. Future Improvements

The project can be expanded with additional features in the future.

Possible improvements include:

* Advanced GitHub authentication
* More advanced GitHub search operators
* Repository quality indicators
* Trending DevOps repositories
* Technology dependency graphs
* DevOps roadmap visualization
* Kubernetes learning tracks
* AWS learning tracks
* Terraform learning tracks
* Docker learning tracks
* CI/CD pipeline examples
* GitOps architecture examples
* DevSecOps learning paths
* More detailed repository analysis
* Repository activity graphs
* GitHub issue information
* Pull request information
* Release information
* GitHub organization discovery
* Personalized learning dashboard
* Cloud provider comparison
* DevOps project recommendations
* Backend API
* Database integration
* User accounts
* Cloud deployment
* AI-assisted resource discovery

---

# 🎓 16. Learning Goal

This project is not only a web application.

It is also a practical DevOps learning project.

While building it, the project can be used to learn concepts such as:

```text
Git
GitHub
HTML
CSS
JavaScript
REST APIs
JSON
HTTP
GitHub Pages
Frontend Architecture
API Integration
Local Storage
Search Systems
Filtering
Modular JavaScript
Responsive Design
DevOps Technologies
Cloud Technologies
CI/CD Concepts
```

It also provides a foundation for gradually introducing more advanced DevOps technologies.

For example:

```text
Frontend Project
       │
       ▼
Git + GitHub
       │
       ▼
GitHub Actions
       │
       ▼
Docker
       │
       ▼
Container Registry
       │
       ▼
Kubernetes
       │
       ▼
AWS / Amazon EKS
       │
       ▼
Terraform / CloudFormation
       │
       ▼
Prometheus + Grafana
       │
       ▼
GitOps / Argo CD
```

---

# 🧑‍💻 17. Author

## Charlie MJ

**GitHub:** `YOUR-GITHUB-USERNAME`

**Profile:**
`https://github.com/YOUR-GITHUB-USERNAME`

> Replace `YOUR-GITHUB-USERNAME` with your actual GitHub username.

---

# 🖼️ Project Illustration

The project includes a DevOps Engineer illustration representing the technologies and concepts covered by the Explorer.

```text
assets/images/devops-engineer.png
```

---

# 📜 License

Add your preferred license here.

For example:

```text
MIT License
```

If using the MIT License, create:

```text
LICENSE
```

in the repository root.

---

# ⭐ Support the Project

If this project is useful for learning DevOps, GitHub, Kubernetes, Docker, AWS, Terraform, CI/CD, GitOps, and related technologies:

⭐ Star the repository
🍴 Fork the repository
📚 Explore the documentation
🐛 Report issues
💡 Suggest improvements
🤝 Contribute

---

# ❤️ Final Note

**Charlie-MJ DevOPS Explorer** was created to solve a practical problem:

> **Finding useful DevOps learning resources should not require searching through hundreds of unrelated repositories every time.**

The goal of this project is to bring DevOps-related GitHub resources, technologies, categories, projects, labs, tutorials, and learning material together into one focused exploration experience.

```text
Discover
   ↓
Explore
   ↓
Learn
   ↓
Practice
   ↓
Build
   ↓
Automate
   ↓
Deploy
   ↓
Improve
```

---

## Built for DevOps Learners 🚀

**Charlie-MJ DevOPS Explorer**

`Discover • Learn • Practice • Build • Automate • Deploy`
