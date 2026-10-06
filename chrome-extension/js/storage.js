import { DEFAULT_CONFIG, CONFIG_KEY, BOOKMARKS_KEY, HISTORY_KEY, NOTES_KEY, LEARNING_KEY } from './config.js';

export const CUSTOM_CATEGORIES_KEY = 'devopsExplorerCustomCategories';

export async function getConfig() {
  const data = await chrome.storage.local.get(CONFIG_KEY);
  const stored = data[CONFIG_KEY] || {};
  const merged = { ...DEFAULT_CONFIG, ...stored };

  // Migrate configurations from versions that incorrectly expected data/resources.json.
  const legacyResourcePath = String(stored.resourceDbPath || '').trim();
  const legacyResourceUrl = String(stored.resourceDbUrl || '').trim();
  const legacyBookmarkCategories = String(stored.categoriesPath || '').trim() === 'bookmark-db/categories.json';
  const legacyBookmarkPath = String(stored.bookmarkPath || '').trim() === 'bookmark-db/bookmarks.json';
  const legacyTagsPath = String(stored.tagsPath || '').trim() === 'bookmark-db/tags.json';
  const legacyMetadataPath = String(stored.metadataPath || '').trim() === 'bookmark-db/metadata.json';
  const needsMigration = !!(legacyResourcePath || legacyResourceUrl || legacyBookmarkCategories || legacyBookmarkPath || legacyTagsPath || legacyMetadataPath || !stored.technologiesPath || !stored.technologiesUrl);

  if (needsMigration) {
    merged.categoriesPath = DEFAULT_CONFIG.categoriesPath;
    merged.categoriesUrl = DEFAULT_CONFIG.categoriesUrl;
    merged.technologiesPath = DEFAULT_CONFIG.technologiesPath;
    merged.technologiesUrl = DEFAULT_CONFIG.technologiesUrl;
    merged.bookmarkPath = DEFAULT_CONFIG.bookmarkPath;
    merged.tagsPath = DEFAULT_CONFIG.tagsPath;
    merged.metadataPath = DEFAULT_CONFIG.metadataPath;
    delete merged.resourceDbPath;
    delete merged.resourceDbUrl;
    await chrome.storage.local.set({ [CONFIG_KEY]: merged });
  }
  return merged;
}

export async function saveConfig(config) {
  const merged = { ...DEFAULT_CONFIG, ...config };
  await chrome.storage.local.set({ [CONFIG_KEY]: merged });
  return merged;
}

export async function resetConfig() {
  await chrome.storage.local.set({ [CONFIG_KEY]: { ...DEFAULT_CONFIG } });
  return { ...DEFAULT_CONFIG };
}

export async function getBookmarks() {
  const data = await chrome.storage.local.get(BOOKMARKS_KEY);
  return Array.isArray(data[BOOKMARKS_KEY]) ? data[BOOKMARKS_KEY] : [];
}

export async function saveBookmarks(bookmarks) {
  await chrome.storage.local.set({ [BOOKMARKS_KEY]: bookmarks });
  return bookmarks;
}

export async function getHistory() {
  const data = await chrome.storage.local.get(HISTORY_KEY);
  return Array.isArray(data[HISTORY_KEY]) ? data[HISTORY_KEY] : [];
}

export async function addHistory(item) {
  const history = await getHistory();
  const next = [{ ...item, viewedAt: new Date().toISOString() }, ...history.filter(x => x.url !== item.url)].slice(0, 25);
  await chrome.storage.local.set({ [HISTORY_KEY]: next });
  return next;
}

export async function getNotes() {
  const data = await chrome.storage.local.get(NOTES_KEY);
  return data[NOTES_KEY] || {};
}

export async function saveNotes(notes) {
  await chrome.storage.local.set({ [NOTES_KEY]: notes });
}

export async function getLearning() {
  const data = await chrome.storage.local.get(LEARNING_KEY);
  return data[LEARNING_KEY] || {};
}

export async function saveLearning(value) {
  await chrome.storage.local.set({ [LEARNING_KEY]: value });
}


export async function getCustomCategories() {
  const data = await chrome.storage.local.get(CUSTOM_CATEGORIES_KEY);
  return Array.isArray(data[CUSTOM_CATEGORIES_KEY]) ? data[CUSTOM_CATEGORIES_KEY] : [];
}

export async function saveCustomCategories(categories) {
  const normalized = Array.isArray(categories) ? categories : [];
  await chrome.storage.local.set({ [CUSTOM_CATEGORIES_KEY]: normalized });
  return normalized;
}
