# Security

## Permissions

The extension uses:

- `storage` for local settings, bookmarks, history, notes and learning state
- `tabs` to open the explorer and resources
- `clipboardWrite` for future resource-copy workflows
- `declarativeNetRequestWithHostAccess` to correct raw GitHub MIME types for the configured repository

## Host permissions

- `raw.githubusercontent.com` for raw repository files
- `github.com` for repository links
- `api.github.com` for optional GitHub search, metadata and bookmark synchronization

## Raw MIME correction

The MIME correction rules are dynamically generated from the user's configured repository and raw base. They are not a generic rule for every GitHub repository.

## GitHub token

The token is optional and is only needed for authenticated GitHub operations such as bookmark push synchronization.

Use a fine-grained token with the smallest possible repository permission.

The token is stored in Chrome extension storage and is not committed to source code.

Configuration exports **exclude the token by default**. The Settings page provides an explicit opt-in checkbox for including it in a private JSON backup.

## Important

A browser extension that can use a GitHub write token is sensitive software. Keep the token private, use a dedicated fine-grained token, and revoke/rotate it if it is exposed.
