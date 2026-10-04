export const DEFAULT_CONFIG = {
  repositoryUrl: "",
  rawBaseUrl: "",
  rawIndexUrl: "",
  branch: "main",
  bookmarkPath: "chrome-extension/bookmark-db/bookmarks.json",
  categoriesPath: "chrome-extension/bookmark-db/categories.json",
  tagsPath: "chrome-extension/bookmark-db/tags.json",
  metadataPath: "chrome-extension/bookmark-db/metadata.json",
  versionPath: "chrome-extension/version.json",
  token: "",
  theme: "dark",
  accent: "blue",
  autoHealth: true,
  githubSyncEnabled: false
};

export const APP_VERSION = "1.0.0";
export const CONFIG_KEY = "devopsExplorerConfig";
export const BOOKMARKS_KEY = "devopsExplorerBookmarks";
export const HISTORY_KEY = "devopsExplorerHistory";
export const NOTES_KEY = "devopsExplorerNotes";
export const LEARNING_KEY = "devopsExplorerLearning";

export function normalizeUrl(value = "") {
  return value.trim().replace(/\/+$/, "");
}

export function deriveRawBase(repositoryUrl, branch = "main") {
  const match = repositoryUrl.trim().match(/^https?:\/\/github\.com\/([^/]+)\/([^/#]+?)(?:\.git)?(?:[/?#].*)?$/i);
  if (!match) return "";
  return `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${encodeURIComponent(branch || "main")}`;
}

export function deriveRawIndex(repositoryUrl, branch = "main") {
  const base = deriveRawBase(repositoryUrl, branch);
  return base ? `${base}/index.html` : "";
}
