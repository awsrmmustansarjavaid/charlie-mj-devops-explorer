# GitHub Resource System

## Goal

The project is designed to help a user go from:

```text
DevOps concept
    |
    v
Technology
    |
    v
GitHub search
    |
    v
Repository
```

## Curated vs live resources

The application uses the live GitHub repository search rather than attempting to download every repository related to a technology.

This is important because GitHub contains a very large and continuously changing repository ecosystem.

## Example

For Kubernetes, a user can search:

```text
Kubernetes
Kubernetes learning
Kubernetes labs
Kubernetes projects
Kubernetes examples
```

For Terraform:

```text
Terraform
Terraform AWS
Terraform learning
Terraform labs
Terraform DevOps
```

## Repository card

Each repository result contains:

- Repository name
- Owner
- Description
- Language
- Topics
- Stars
- Forks
- Last update
- Small creator avatar
- Repository link
- Creator repositories link
- Save/bookmark control

## Adding stronger curated resources

If a future version needs guaranteed official repositories, add a resource field to the technology data model, for example:

```json
{
  "id": "kubernetes",
  "name": "Kubernetes",
  "resources": [
    {
      "label": "Official repository",
      "url": "https://github.com/kubernetes/kubernetes"
    }
  ]
}
```

Keep live search in addition to curated resources.
