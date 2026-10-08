# Release Notes — v3.3.3

## Release focus

v3.3.3 focuses on the Learning workspace relationship workflow and data portability.

## Learning relationships

Learning cards can be connected with:

- Labs
- Projects
- Goals
- Roadmaps

The Additional Details editor supports selecting existing records and maintaining their relationships.

## Data portability

The workspace provides Markdown and JSON controls for:

- Learn
- Labs
- Projects
- Roadmaps

## Official Documentation

Official documentation records support category/subcategory metadata and a v2 JSON structure.

## Validation

The release is intended to be validated with:

```bash
node tests/search-engine.test.mjs
node tests/taxonomy.test.mjs
```

Additional package validation should include JavaScript syntax checks, JSON parsing, manifest/version consistency, and ZIP integrity.
