# Charlie MJ DevOps Explorer — Complete User Manual

## 1. What is Charlie MJ DevOps Explorer?

Charlie MJ DevOps Explorer is a local-first Manifest V3 Chrome extension designed to turn DevOps discovery and learning into one connected workspace.

**Discover → Search → Learn → Practice → Build → Track → Review**

The extension combines repository discovery, GitHub search, technology taxonomy, official documentation, bookmarks, learning cards, labs, projects, roadmaps, goals, collections, favorites, activity tracking, AI guidance, health checks, backup/restore, and data import/export.

## 2. Main areas

- **Dashboard** — starting point and workspace overview.
- **Explore** — universal/local search and filtering.
- **Taxonomy** — categories, subcategories, and technology relationships.
- **Learn** — create learning cards from saved resources, technologies, documentation, and custom links.
- **Labs** — organize hands-on practice.
- **Projects** — organize real DevOps implementation work.
- **Roadmaps** — organize learning or delivery paths.
- **Collections** — group resources into reusable sets.
- **Favorites** — keep high-value resources close.
- **Goals** — track outcomes you want to achieve.
- **Activity** — review actions and progress.
- **AI Advisor** — receive contextual offline guidance.
- **Admin** — manage workspace data and quality controls.
- **Settings** — configure repository sources, theme, health checks, and data paths.
- **Tag & Label Library** — manage reusable tags and labels.
- **Technologies** — manage the technology catalog and official documentation.

## 3. Install the extension in Chrome

### Step 1 — Extract the ZIP

Download the release ZIP and extract it to a permanent folder. Do not delete or move that folder after installing the unpacked extension unless you intend to reload it from a new location.

### Step 2 — Open Chrome Extensions

Open:

`chrome://extensions/`

### Step 3 — Enable Developer mode

Turn on **Developer mode** in the top-right corner.

### Step 4 — Load the extension

Select **Load unpacked** and choose the extracted extension folder — the folder containing `manifest.json`.

### Step 5 — Open the extension

Use the Chrome toolbar extension icon or the extension's popup. The extension also provides a keyboard shortcut for opening the main workspace.

## 4. First-time setup

After installation:

1. Open **Settings**.
2. Review the repository URL and branch.
3. Review the raw GitHub base URL.
4. Review category and technology JSON paths.
5. Review the Official Documentation JSON URL/path.
6. Decide whether automatic health checks should run.
7. Select your theme and accent.
8. Run the health check from Settings/Admin if required.
9. Create a backup after you have configured your workspace.

The default repository is the Charlie MJ DevOps Explorer GitHub repository configured by the extension.

## 5. Search local DevOps resources

Go to **Explore**.

You can search using:

- free-text query
- categories
- technologies
- tags
- language
- difficulty
- repository/resource type
- AND/OR operator

The search system combines local catalog data and saved resources into a common result model.

## 6. Search GitHub repositories

### Basic workflow

1. Open **Explore**.
2. Enter a technology, tool, DevOps concept, or repository keyword.
3. Choose GitHub Search when you want live GitHub repository results.
4. Apply filters where available.
5. Open a repository directly from the result.

GitHub results can expose actions such as:

- Open
- Owner
- Bookmark
- Favorite
- Collection
- Tag
- Label

Topics on GitHub repository results can also be used as reusable tags in the extension.

### Example

Search for:

`kubernetes`

Then refine with topics such as:

- aws
- eks
- containers
- kubernetes
- devops

## 7. Create a Learning card

Open **Learn** and choose **Add Learning**.

A Learning card can contain:

- title
- topic
- technology
- category
- subcategory
- description
- difficulty
- tags
- thumbnail URL
- notes
- status
- progress
- Medium article
- LinkedIn article
- YouTube video
- blog
- course
- custom URLs
- official documentation
- Labs
- Projects
- Goals
- Roadmaps

### Recommended workflow

1. Give the card a clear title.
2. Add the topic you are learning.
3. Select the technology.
4. Add category/subcategory where appropriate.
5. Write a short description.
6. Set difficulty and status.
7. Add tags.
8. Add useful resources.
9. Select one or more official documentation records.
10. Choose **Add Additional Details**.
11. Link existing Labs, Projects, Goals, and Roadmaps.
12. Save the Learning card.

## 8. Why Learning cards are useful

A Learning card is more than a bookmark. It connects the learning topic to the resources and practical work around it.

For example:

**Amazon EKS Learning Card**

→ Amazon EKS documentation

→ Kubernetes Lab

→ AWS EKS Project

→ Kubernetes Learning Goal

→ Kubernetes Roadmap

This creates a connected learning workflow instead of separate lists.

## 9. Additional Details on a Learning card

The **Additional Details** feature connects a Learning card to existing records.

You can link:

- Labs
- Projects
- Goals
- Roadmaps

For each type you can search, select, remove, open, and edit the related record.

The relationship is bidirectional. A Learning card stores its linked record IDs, and the related Lab/Project/Goal/Roadmap can store the Learning card ID.

## 10. Official Documentation

Open **Technologies → Official Documentation**.

A documentation record can contain:

- technology
- category
- subcategory
- title
- URL
- type
- source
- status
- health
- tags
- last checked time
- notes

### Example

**GitHub Actions**

- Category: CI/CD
- Subcategory: GitHub
- Documentation: `https://docs.github.com/en/actions`

**AWS**

- Category: Cloud Provider

The documentation database is represented by `data/official-documentation.json` and supports the v2 structure.

## 11. Select official documentation while creating Learning

Inside the Learning editor, use the **Official Documentation** search area.

You can search by:

- documentation title
- technology
- category
- subcategory
- tags
- URL

Select one or multiple records. Only the selected documentation is associated with the Learning card.

## 12. Create a Lab

Open **Labs → New Lab**.

A Lab is for hands-on practice. Good Lab records can contain:

- name/title
- description
- technology
- difficulty
- status
- objectives
- tasks
- resources
- notes
- related Learning cards

Use Labs for things such as:

- Kubernetes cluster practice
- AWS EKS deployment
- Docker networking
- Jenkins pipeline practice
- Terraform infrastructure exercises

## 13. Create a Project

Open **Projects → New Project**.

Use Projects for larger practical outcomes such as:

- AWS DevOps platform
- CI/CD pipeline
- Kubernetes production-style environment
- Infrastructure-as-Code project
- monitoring stack

Projects can be connected to Learning cards and other workspace records.

## 14. Create a Goal

Open **Goals → New Goal**.

A Goal represents an outcome rather than a single resource.

Examples:

- Learn Kubernetes fundamentals
- Deploy an application to EKS
- Build a Jenkins CI/CD pipeline
- Become comfortable with Terraform

Goals can be linked to Learning cards.

## 15. Create a Roadmap

Open **Roadmaps → New Roadmap**.

A Roadmap can organize a sequence such as:

1. Linux
2. Git
3. Docker
4. Kubernetes
5. AWS
6. Terraform
7. CI/CD
8. Observability

Roadmaps can be linked to Learning cards, Labs, Projects, and Goals depending on your workspace structure.

## 16. Add a technology

Open **Technologies** and use the technology management controls.

A personal technology can be added without changing the remote system catalog.

Technology records can contain information such as:

- name
- category
- subcategory
- type
- difficulty
- tags
- prerequisites
- official resources

Personal overrides are stored locally.

## 17. Bookmarks, Favorites, Collections, Tags and Labels

### Bookmark

Use Bookmark when you want to save a resource for later.

### Favorite

Use Favorite when the resource is especially important and should be easy to find.

### Collection

Use Collections to group resources around a topic, course, project, or workflow.

### Tag

Use tags for flexible classification such as:

- aws
- kubernetes
- security
- ci-cd

### Label

Use labels when you need a separate organizational layer for your personal workflow.

## 18. Import and export

The extension supports data portability for important workspace areas.

Depending on the area, use:

- **Import JSON**
- **Export JSON**
- **Download Markdown**
- **Import Markdown**

Current workspace areas with Markdown/JSON data controls include:

- Learn
- Labs
- Projects
- Roadmaps

Markdown is useful for human-readable notes, GitHub repositories, documentation systems, and personal knowledge bases.

JSON is useful for backup, migration, structured editing, and programmatic processing.

## 19. Health checks

Official Documentation records can be checked for URL health.

Health states can include:

- healthy
- redirected
- broken
- timeout
- unknown

Use **Check All Documentation** to check all documentation records that have URLs.

## 20. Backup and restore

Use the backup tools before major changes.

A backup can protect workspace information such as:

- settings
- workspace data
- personal categories
- personal technologies
- bookmarks
- documentation data

Always keep an external copy of important backups.

## 21. AI Advisor

The AI Advisor is designed to work without making a paid AI service mandatory.

The default architecture uses offline rule-based guidance. The codebase is structured so additional providers such as local AI runtimes or OpenAI-compatible endpoints can be integrated later.

## 22. Settings

Settings control:

- GitHub repository URL
- branch
- raw base URL
- category data source
- technology data source
- bookmark data source
- tags/metadata paths
- Official Documentation JSON URL/path
- theme
- accent
- automatic health checks
- GitHub sync settings

## 23. Recommended learning workflow

Use this workflow for the best result:

**Discover**

Find a technology or DevOps concept.

**Search**

Search the local catalog and GitHub.

**Save**

Bookmark important resources.

**Learn**

Create a Learning card.

**Document**

Attach official documentation and articles/videos.

**Practice**

Link a Lab.

**Build**

Link a Project.

**Track**

Link a Goal.

**Plan**

Link a Roadmap.

**Review**

Update progress, status, notes, and activity.

## 24. Best practices

- Use specific Learning titles instead of generic names.
- Prefer official documentation for reference material.
- Use tags consistently.
- Keep Labs focused on practical tasks.
- Keep Projects focused on deliverable outcomes.
- Use Goals for measurable outcomes.
- Use Roadmaps for sequences and milestones.
- Export important workspace data regularly.
- Keep backups before large imports.
- Review broken or redirected documentation URLs periodically.

## 25. Troubleshooting

If something does not work:

1. Open Settings and check the configured repository paths.
2. Run the health check.
3. Reload the extension from `chrome://extensions/`.
4. Reopen the Dashboard.
5. Check the browser console for a JavaScript error.
6. Export a backup before attempting major data changes.
7. Consult the troubleshooting documentation.

[📖 Click here to read more about troubleshooting](TROUBLESHOOTING.md)
