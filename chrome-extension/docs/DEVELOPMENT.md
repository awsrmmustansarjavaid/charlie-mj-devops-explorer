# Development

## Principles

- Keep the parent DevOps Explorer application outside `chrome-extension/`.
- Keep extension code modular.
- Avoid build systems unless the project later needs one.
- Do not add GitHub Actions or workflow files for this extension.
- Keep repository-specific URLs configurable.

## Validation

Use Chrome's **Load unpacked** to test the extension. Use the extension service worker inspector for background errors and the dashboard DevTools console for page errors.

For source validation, JavaScript modules can be checked with Node's `node --check` command.

## Adding a feature

1. Add UI to the relevant page/section.
2. Put reusable logic in `js/`.
3. Put visual rules in `css/`.
4. Update the relevant documentation.
5. Test the feature with both configured and unconfigured repository settings.
