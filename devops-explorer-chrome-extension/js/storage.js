import { DEFAULT_CONFIG, CONFIG_KEY, BOOKMARKS_KEY, HISTORY_KEY, NOTES_KEY, LEARNING_KEY } from './config.js';

export async function getConfig() {
  const data = await chrome.storage.local.get(CONFIG_KEY);
  return { ...DEFAULT_CONFIG, ...(data[CONFIG_KEY] || {}) };
}

export async function saveConfig(config) {
  const merged = { ...DEFAULT_CONFIG, ...config };
  await chrome.storage.local.set({ [CONFIG_KEY]: merged });
  return merged;
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
