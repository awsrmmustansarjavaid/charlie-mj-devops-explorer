# Official Documentation

Charlie MJ DevOps Explorer keeps official documentation in a separate `official-documentation.json` dataset.

## Features

- Multiple official resources per technology
- Add, edit, delete and open documentation URLs
- Link every documentation record to a technology
- Search documentation by technology, title or URL
- URL health status: `healthy`, `redirect`, `broken`, `timeout`, `unknown`
- Check one URL or the full documentation database
- Import JSON with merge or replace behavior
- Export the complete documentation database
- Startup synchronization completes the registry for every technology loaded from the technology catalog

## Record shape

```json
{
  "id": "doc-kubernetes",
  "technologyId": "kubernetes",
  "technology": "Kubernetes",
  "title": "Kubernetes Documentation",
  "url": "https://kubernetes.io/docs/",
  "type": "official-documentation",
  "source": "official-website",
  "status": "active",
  "health": "unknown",
  "lastChecked": null
}
```
