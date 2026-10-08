# Learning Workspace Design

## Purpose

The Learning workspace is the bridge between DevOps discovery and practical work.

## Learning card

A Learning card stores the subject being studied and connects it to resources and workspace records.

## Relationships

```text
                    Official Documentation
                            ↑
                            │
GitHub / Bookmarks → Learning Card ← Articles / Videos / Courses
                            │
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
            Lab          Project          Goal
             │              │              │
             └──────────────┴──────┬───────┘
                                    ↓
                                 Roadmap
```

## Stable IDs

Relationships use IDs rather than copying complete records into every Learning card.

This keeps the workspace normalized and makes edits easier to manage.

## Bidirectional links

A Learning card can contain:

- `labIds`
- `projectIds`
- `goalIds`
- `roadmapIds`

The related records can contain:

- `learningCardIds`

## New Learning card flow

The editor creates a stable draft identity before Additional Details are selected. This allows associations to survive while the user is still creating the Learning card.

## Editing associations

The Additional Details interface supports:

- search
- selection
- deselection
- open
- edit
- remove
- save

## Why this design matters

Without relationships, a DevOps learning system becomes a collection of unrelated lists.

With relationships:

```text
Technology
   ↓
Learning
   ↓
Lab
   ↓
Project
   ↓
Goal
   ↓
Roadmap
```

The user can move from knowledge to practice to outcome.
