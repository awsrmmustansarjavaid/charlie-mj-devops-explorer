import { DEFAULT_CONFIG, CONFIG_KEY, BOOKMARKS_KEY, HISTORY_KEY, NOTES_KEY, LEARNING_KEY } from './config.js';

export const CUSTOM_CATEGORIES_KEY = 'devopsExplorerCustomCategories';
export const CUSTOM_TECHNOLOGIES_KEY = 'devopsExplorerCustomTechnologies';
export const OFFICIAL_DOCS_KEY = 'devopsExplorerOfficialDocumentation';
export const APP_DATA_KEY = 'devopsExplorerAppData';
export const SCHEMA_VERSION = 5;

const DEFAULT_APP_DATA = {
  schemaVersion: SCHEMA_VERSION,
  collections: [], favorites: [], learning: {}, labs: [], projects: [], roadmaps: [],
  activity: [], goals: [], savedSearches: [], stack: [], notes: {}, settings: {},
  continueItems: [], achievements: [], learningCards: [], backupMeta: { lastBackupAt: null }
};

function clone(v){ return JSON.parse(JSON.stringify(v)); }
export async function getConfig(){
  const data=await chrome.storage.local.get(CONFIG_KEY); const stored=data[CONFIG_KEY]||{}; const merged={...DEFAULT_CONFIG,...stored};
  const legacy=!!(stored.resourceDbPath||stored.resourceDbUrl||String(stored.categoriesPath||'')==='bookmark-db/categories.json'||String(stored.bookmarkPath||'')==='bookmark-db/bookmarks.json'||String(stored.tagsPath||'')==='bookmark-db/tags.json'||String(stored.metadataPath||'')==='bookmark-db/metadata.json'||!stored.technologiesPath||!stored.technologiesUrl||!stored.officialDocumentationPath||!stored.officialDocumentationUrl);
  if(legacy){ Object.assign(merged,{categoriesPath:DEFAULT_CONFIG.categoriesPath,categoriesUrl:DEFAULT_CONFIG.categoriesUrl,technologiesPath:DEFAULT_CONFIG.technologiesPath,technologiesUrl:DEFAULT_CONFIG.technologiesUrl,bookmarkPath:DEFAULT_CONFIG.bookmarkPath,tagsPath:DEFAULT_CONFIG.tagsPath,metadataPath:DEFAULT_CONFIG.metadataPath,officialDocumentationPath:DEFAULT_CONFIG.officialDocumentationPath,officialDocumentationUrl:DEFAULT_CONFIG.officialDocumentationUrl}); delete merged.resourceDbPath; delete merged.resourceDbUrl; await chrome.storage.local.set({[CONFIG_KEY]:merged}); }
  return merged;
}
export async function saveConfig(config){const merged={...DEFAULT_CONFIG,...config}; await chrome.storage.local.set({[CONFIG_KEY]:merged}); return merged;}
export async function resetConfig(){return saveConfig(DEFAULT_CONFIG);}

export async function getBookmarks(){const d=await chrome.storage.local.get(BOOKMARKS_KEY);return Array.isArray(d[BOOKMARKS_KEY])?d[BOOKMARKS_KEY]:[];}
export async function saveBookmarks(v){await chrome.storage.local.set({[BOOKMARKS_KEY]:Array.isArray(v)?v:[]});return v;}
export async function getHistory(){const d=await chrome.storage.local.get(HISTORY_KEY);return Array.isArray(d[HISTORY_KEY])?d[HISTORY_KEY]:[];}
export async function addHistory(item){const h=await getHistory();const n=[{...item,viewedAt:new Date().toISOString()},...h.filter(x=>x.url!==item.url)].slice(0,50);await chrome.storage.local.set({[HISTORY_KEY]:n});return n;}
export async function getNotes(){const d=await chrome.storage.local.get(NOTES_KEY);return d[NOTES_KEY]||{};}
export async function saveNotes(v){await chrome.storage.local.set({[NOTES_KEY]:v||{}});}
export async function getLearning(){const d=await chrome.storage.local.get(LEARNING_KEY);return d[LEARNING_KEY]||{};}
export async function saveLearning(v){await chrome.storage.local.set({[LEARNING_KEY]:v||{}});}
export async function getCustomCategories(){const d=await chrome.storage.local.get(CUSTOM_CATEGORIES_KEY);return Array.isArray(d[CUSTOM_CATEGORIES_KEY])?d[CUSTOM_CATEGORIES_KEY]:[];}
export async function saveCustomCategories(v){const n=Array.isArray(v)?v:[];await chrome.storage.local.set({[CUSTOM_CATEGORIES_KEY]:n});return n;}
export async function getCustomTechnologies(){const d=await chrome.storage.local.get(CUSTOM_TECHNOLOGIES_KEY);return Array.isArray(d[CUSTOM_TECHNOLOGIES_KEY])?d[CUSTOM_TECHNOLOGIES_KEY]:[];}
export async function saveCustomTechnologies(v){const n=Array.isArray(v)?v:[];await chrome.storage.local.set({[CUSTOM_TECHNOLOGIES_KEY]:n});return n;}
export async function getOfficialDocs(){const d=await chrome.storage.local.get(OFFICIAL_DOCS_KEY);return Array.isArray(d[OFFICIAL_DOCS_KEY])?d[OFFICIAL_DOCS_KEY]:[];}
export async function saveOfficialDocs(v){const n=Array.isArray(v)?v:[];await chrome.storage.local.set({[OFFICIAL_DOCS_KEY]:n});return n;}

export async function migrateAppData(){
  const d=await chrome.storage.local.get(APP_DATA_KEY); let data={...DEFAULT_APP_DATA,...(d[APP_DATA_KEY]||{})};
  let v=Number(data.schemaVersion||1);
  if(v<2){data.savedSearches=data.savedSearches||[];data.goals=data.goals||[];v=2;}
  if(v<3){data.achievements=data.achievements||[];data.backupMeta=data.backupMeta||{lastBackupAt:null};v=3;}
  if(v<4){data.learningCards=data.learningCards||[];v=4;}
  if(v<5){data.learningCards=(data.learningCards||[]).map(x=>({...x,labIds:Array.isArray(x.labIds)?x.labIds:[],projectIds:Array.isArray(x.projectIds)?x.projectIds:[],goalIds:Array.isArray(x.goalIds)?x.goalIds:[],roadmapIds:Array.isArray(x.roadmapIds)?x.roadmapIds:[]}));for(const type of ['labs','projects','goals','roadmaps'])data[type]=(data[type]||[]).map(x=>({...x,learningCardIds:Array.isArray(x.learningCardIds)?x.learningCardIds:[]}));v=5;}
  data.schemaVersion=SCHEMA_VERSION; await chrome.storage.local.set({[APP_DATA_KEY]:data}); return data;
}
export async function getAppData(){const d=await migrateAppData();return {...clone(DEFAULT_APP_DATA),...d};}
export async function saveAppData(data){const n={...clone(DEFAULT_APP_DATA),...(data||{}),schemaVersion:SCHEMA_VERSION};await chrome.storage.local.set({[APP_DATA_KEY]:n});return n;}
export async function patchAppData(patch){const d=await getAppData();return saveAppData({...d,...patch});}
export async function updateAppCollection(key, updater){const d=await getAppData();d[key]=await updater(d[key]);return saveAppData(d);}

export const StorageService={
  settings:{get:getConfig,save:saveConfig,reset:resetConfig},
  taxonomy:{get:getCustomCategories,save:saveCustomCategories},
  technologies:{get:getCustomTechnologies,save:saveCustomTechnologies},
  bookmarks:{get:getBookmarks,save:saveBookmarks},
  history:{get:getHistory,add:addHistory},
  app:{get:getAppData,save:saveAppData,patch:patchAppData},
  documentation:{get:getOfficialDocs,save:saveOfficialDocs},
  schemaVersion:SCHEMA_VERSION
};
