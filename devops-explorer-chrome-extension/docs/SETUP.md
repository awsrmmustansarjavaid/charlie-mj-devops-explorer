# Setup

## Load the extension

1. Open Chrome.
2. Visit `chrome://extensions`.
3. Enable Developer mode.
4. Select **Load unpacked**.
5. Select this `chrome-extension/` directory.

## Configure the repository

Open **Settings** and enter:

```text
Repository URL: https://github.com/OWNER/REPO
Branch: main
Raw base URL: https://raw.githubusercontent.com/OWNER/REPO/main
Raw index URL: https://raw.githubusercontent.com/OWNER/REPO/main/index.html
```

If raw base/index are blank, saving the repository URL and branch automatically derives them.

## Verify

Open **Health Check** and run the full check. A configured installation should report the repository and raw index as reachable when the URLs are publicly accessible.
