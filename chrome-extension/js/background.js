import { getConfig } from './storage.js';

chrome.runtime.onInstalled.addListener(async () => {
  const config = await getConfig();
  await chrome.storage.local.set({ devopsExplorerConfig: config });
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'open-devops-explorer' || command === 'open-command-palette') {
    const url = chrome.runtime.getURL(`pages/dashboard/dashboard.html${command === 'open-command-palette' ? '#palette' : ''}`);
    await chrome.tabs.create({ url });
  }
});
