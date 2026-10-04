# Health Checks

The health center checks:

- repository URL
- raw `index.html`
- raw resource database
- raw bookmark database
- GitHub API repository metadata

Each HTTP check reports:

- success/failure
- HTTP status
- response time in milliseconds

The terminal-style panel provides a compact diagnostic summary.

A failed optional resource database check does not mean the extension itself is broken; the parent repository may simply not contain that optional file.
