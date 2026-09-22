# CSS Structure

## Single stylesheet

The final project intentionally uses one stylesheet:

```text
css/
└── style.css
```

`index.html` loads only this file.

## Sections inside `style.css`

The stylesheet contains:

- Global variables and reset
- Background and ambient effects
- Navigation
- Hero
- Search UI
- Search filters
- Feature cards
- Cloud provider cards
- Kubernetes/container visuals
- Infrastructure as Code
- Automation and scripting
- Security
- Monitoring/observability
- Category grid
- Technology map
- Pipeline
- Learning architecture
- Footer
- GitHub repository cards
- Accessibility/focus states
- Responsive layouts

## Repository grid

GitHub results use:

```text
4 columns — large desktop
3 columns — desktop
2 columns — tablet
1 column  — mobile
```

The repository avatar is intentionally limited to 34px × 34px.

## Maintenance rule

Search for an existing selector before adding a new one. Keep one source of truth in `css/style.css` rather than recreating component rules in separate files.
