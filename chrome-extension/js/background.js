import { getConfig } from './storage.js';

const RAW_RULE_IDS = [1001, 1002, 1003, 1004];

function escapeRegex(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function rawRuleFor(id, regexFilter, resourceTypes, contentType) {
  return {
    id,
    priority: 10,
    action: {
      type: 'modifyHeaders',
      responseHeaders: [{ header: 'content-type', operation: 'set', value: contentType }]
    },
    condition: { regexFilter, resourceTypes }
  };
}

async function syncRawPreviewRules(config) {
  if (!chrome.declarativeNetRequest?.updateDynamicRules) return;

  const rules = [];
  const base = String(config.rawBaseUrl || '').replace(/\/+$/, '');
  const index = String(config.rawIndexUrl || '').trim();
  if (index) {
    rules.push(rawRuleFor(1001, `^${escapeRegex(index)}(?:\\?.*)?$`, ['main_frame'], 'text/html; charset=utf-8'));
  }
  if (base) {
    const prefix = escapeRegex(base);
    rules.push(rawRuleFor(1002, `^${prefix}/.*\\.css(?:\\?.*)?$`, ['stylesheet'], 'text/css; charset=utf-8'));
    rules.push(rawRuleFor(1003, `^${prefix}/.*\\.(?:js|mjs)(?:\\?.*)?$`, ['script'], 'text/javascript; charset=utf-8'));
    rules.push(rawRuleFor(1004, `^${prefix}/.*\\.json(?:\\?.*)?$`, ['xmlhttprequest'], 'application/json; charset=utf-8'));
  }

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: RAW_RULE_IDS, addRules: rules });
  } catch (error) {
    console.warn('Raw preview rules could not be updated:', error);
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const config = await getConfig();
  await chrome.storage.local.set({ devopsExplorerConfig: config });
  await syncRawPreviewRules(config);
});

chrome.runtime.onStartup.addListener(async () => {
  await getConfig().then(syncRawPreviewRules).catch(error => console.warn('Initial raw preview rule setup failed:', error));
});

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === 'local' && changes.devopsExplorerConfig?.newValue) {
    await syncRawPreviewRules(changes.devopsExplorerConfig.newValue);
  }
});

if (chrome.sidePanel?.setPanelBehavior) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'open-devops-explorer' || command === 'open-command-palette') {
    const url = chrome.runtime.getURL(`pages/dashboard/dashboard.html${command === 'open-command-palette' ? '#palette' : ''}`);
    await chrome.tabs.create({ url });
  }
});

getConfig().then(syncRawPreviewRules).catch(error => console.warn('Initial raw preview rule setup failed:', error));
