# GitHub Sync

## Read

Pull uses the configured raw GitHub URL and reads the bookmark JSON file.

## Write

Push uses the GitHub Contents API. The extension first retrieves the existing file to obtain its SHA, then sends an update with the SHA so GitHub can detect stale versions.

## Required settings

- Repository URL
- Branch
- Bookmark path
- Fine-grained GitHub token

## Token principle

Never commit a token. Store it only in extension storage and remove it from Settings when it is no longer required.

## Limitations

The extension is not a Git conflict resolver. If another user changes the file between the GET and PUT operations, GitHub can reject the update; pull the newest file and reconcile locally before pushing again.
