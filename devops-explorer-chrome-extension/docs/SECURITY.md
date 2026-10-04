# Security

## Permissions

The extension uses only the permissions needed for its local dashboard, storage, tab opening and clipboard-related functionality.

## Host permissions

- `raw.githubusercontent.com` for raw repository data
- `github.com` for repository links
- `api.github.com` for optional GitHub search, metadata and bookmark write sync

## GitHub token

A token is optional. It is only required for repository write synchronization. Use a fine-grained token with the smallest scope possible.

The token is stored with Chrome extension storage and is not included in source files, exported bookmark JSON, or the repository.

## Important

Treat any browser extension with access to a GitHub token as sensitive. Use a dedicated token with limited repository permissions and rotate/revoke it when necessary.
