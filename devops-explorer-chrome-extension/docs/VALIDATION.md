# Validation

This package was statically validated before delivery.

## Checks performed

- Manifest JSON parses successfully.
- JavaScript modules pass `node --check` syntax validation.
- Required popup/dashboard/settings files exist.
- PNG extension icons exist at 16, 32, 48 and 128 pixels.
- Product thumbnail exists at `assets/images/25656fce-6771-45f7-ba28-2b26f7e9d7c8.png`.
- Bookmark seed files exist.
- Markdown documentation files exist.
- No `.github/workflows` directory is included.

## Runtime testing

Chrome runtime behavior must be verified by loading the unpacked extension in Chrome because Chrome's extension APIs are not available to Node/static validation. Use `chrome://extensions` and the Errors/Inspect views if a runtime issue appears.
