# Troubleshooting

## Raw index opens as text instead of an application

This is a limitation of using raw GitHub as a web-hosting path. Raw content delivery is not a guaranteed replacement for GitHub Pages. Check the parent application's MIME behavior and make CSS, JavaScript, JSON and asset URLs explicitly raw-accessible.

The extension intentionally keeps the raw launcher because that is the architecture requested for this project.

## Health check fails

Verify:

- repository is public or otherwise reachable by the configured URL
- raw base URL points to the correct branch
- `index.html` exists at the configured path
- branch name is correct
- optional data files actually exist

## GitHub push fails

Check:

- token is present
- token is valid and not expired/revoked
- token has access to the target repository
- repository contents permission is sufficient
- branch exists
- bookmark path is correct

## GitHub search rate limit

GitHub public API requests are rate limited. Configure a suitable fine-grained token if your usage requires authenticated API requests.

## Extension does not load

Open `chrome://extensions`, inspect the extension's Errors section, and reload the unpacked extension after code changes.
