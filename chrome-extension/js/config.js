export const DEFAULT_CONFIG = {
  repositoryUrl: "https://github.com/awsrmmustansarjavaid/charlie-mj-devops-explorer",
  branch: "main",
  rawBaseUrl: "https://raw.githubusercontent.com/awsrmmustansarjavaid/charlie-mj-devops-explorer/main",
  rawIndexUrl: "https://raw.githubusercontent.com/awsrmmustansarjavaid/charlie-mj-devops-explorer/main/index.html",
  categoriesPath: "data/devops-categories.json",
  categoriesUrl: "https://raw.githubusercontent.com/awsrmmustansarjavaid/charlie-mj-devops-explorer/main/data/devops-categories.json",
  technologiesPath: "data/devops-technologies.json",
  technologiesUrl: "https://raw.githubusercontent.com/awsrmmustansarjavaid/charlie-mj-devops-explorer/main/data/devops-technologies.json",
  bookmarkPath: "chrome-extension/bookmark-db/bookmarks.json",
  tagsPath: "chrome-extension/bookmark-db/tags.json",
  metadataPath: "chrome-extension/bookmark-db/metadata.json",
  officialDocumentationPath: "data/official-documentation.json",
  officialDocumentationUrl: "https://raw.githubusercontent.com/awsrmmustansarjavaid/charlie-mj-devops-explorer/main/data/official-documentation.json",
  versionPath: "chrome-extension/version.json",
  token: "",
  theme: "dark",
  accent: "blue",
  autoHealth: true,
  githubSyncEnabled: false
};

export const APP_VERSION = "3.2.1";
export const CONFIG_KEY = "devopsExplorerConfig";
export const BOOKMARKS_KEY = "devopsExplorerBookmarks";
export const HISTORY_KEY = "devopsExplorerHistory";
export const NOTES_KEY = "devopsExplorerNotes";
export const LEARNING_KEY = "devopsExplorerLearning";

export function normalizeUrl(value = "") {
  return String(value).trim().replace(/\/+$/, "");
}

export function deriveRawBase(repositoryUrl, branch = "main") {
  const match = String(repositoryUrl).trim().match(/^https?:\/\/github\.com\/([^/]+)\/([^/#]+?)(?:\.git)?(?:[/?#].*)?$/i);
  if (!match) return "";
  return `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${encodeURIComponent(branch || "main")}`;
}

export function deriveRawIndex(repositoryUrl, branch = "main") {
  const base = deriveRawBase(repositoryUrl, branch);
  return base ? `${base}/index.html` : "";
}

export function deriveRawFile(repositoryUrl, branch = "main", path = "") {
  const base = deriveRawBase(repositoryUrl, branch);
  return base && path ? `${base}/${String(path).replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/")}` : "";
}

// Backward-compatible alias for older configs/code.
export function deriveRawResourceDb(repositoryUrl, branch = "main", path = "data/devops-technologies.json") {
  return deriveRawFile(repositoryUrl, branch, path);
}
