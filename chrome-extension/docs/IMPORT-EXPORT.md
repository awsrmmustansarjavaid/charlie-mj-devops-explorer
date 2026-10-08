# Import, Export and Markdown Guide

## Supported workspace areas

The current extension provides data portability for:

- Learn
- Labs
- Projects
- Roadmaps

## JSON export

JSON is the structured format.

Use it when:

- backing up data
- migrating data
- editing records programmatically
- moving data between installations
- preserving IDs and relationships

## Markdown download

Markdown is designed for people and documentation systems.

Use it for:

- GitHub repositories
- personal notes
- knowledge bases
- course notes
- documentation sites
- version-controlled learning records

## Learning Markdown

A Learning export can contain:

- title
- topic
- technology
- taxonomy
- description
- difficulty
- status
- progress
- tags
- notes
- official documentation
- custom resources
- linked Labs
- linked Projects
- linked Goals
- linked Roadmaps

## Labs Markdown

Lab exports are intended to preserve the practical learning context and useful metadata.

## Projects Markdown

Project exports are useful for project documentation and Git-based project notes.

## Roadmaps Markdown

Roadmap exports are useful for publishing a learning plan or keeping a version-controlled study path.

## Importing JSON

1. Open the relevant workspace tab.
2. Select **Import JSON**.
3. Choose the exported JSON file.
4. Review the imported records.
5. Save/confirm according to the current editor.

## Importing Markdown

1. Open Learn, Labs, Projects, or Roadmaps.
2. Select the Markdown import control.
3. Choose a `.md` file.
4. Review the parsed record data.
5. Save it into the workspace.

Markdown is primarily a human-readable interchange format, so highly structured fields may depend on the headings and formatting used by the extension's exporter.

## Safe migration

Before importing a large file:

1. Export a JSON backup.
2. Keep the original backup outside the extension folder.
3. Import the new data.
4. Verify Learning relationships.
5. Verify Labs, Projects, Goals, and Roadmaps.
6. Run health checks if documentation URLs changed.

## Recommended file naming

```text
charlie-mj-learning.md
charlie-mj-labs.md
charlie-mj-projects.md
charlie-mj-roadmaps.md
charlie-mj-workspace.json
```
