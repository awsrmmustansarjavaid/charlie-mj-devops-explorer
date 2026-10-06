import { makeId } from './data.js';

export const WORKSPACE_KEY = 'devopsExplorerWorkspaceV2';
export const defaultWorkspace = () => ({
  collections: [], roadmap: [], learning: { currentGoal:'', tasks:[], items:[] }, labs: [], projects: [],
  activity: [], favorites: [], pinned: [], stack: {}, settings: {
    startup:'home', defaultSearch:'local', theme:'dark', accent:'blue', density:'comfortable',
    animations:true, newTab:true, rememberSession:true, maxResults:50, sorting:'relevance',
    autoSave:true, autoBookmark:false, confirmDelete:true, rememberFilters:true, privacy:'local-only',
    aiProvider:'builtin', aiEndpoint:'http://localhost:11434', aiModel:'llama3.2', smartNotifications:false, categoryOverrides:{}, categoryOrder:[], hiddenCategories:[]
  }, savedSearches:[], searchHistory:[], notifications:[], notes:[], lastSession:{}
});

export async function getWorkspace(){
  const raw=(await chrome.storage.local.get(WORKSPACE_KEY))[WORKSPACE_KEY];
  const d=defaultWorkspace();
  const w=raw&&typeof raw==='object'?raw:{};
  return {
    ...d,...w,
    collections:Array.isArray(w.collections)?w.collections:[], roadmap:Array.isArray(w.roadmap)?w.roadmap:[],
    learning:{...d.learning,...(w.learning||{}),tasks:Array.isArray(w.learning?.tasks)?w.learning.tasks:[],items:Array.isArray(w.learning?.items)?w.learning.items:[]},
    labs:Array.isArray(w.labs)?w.labs:[],projects:Array.isArray(w.projects)?w.projects:[],activity:Array.isArray(w.activity)?w.activity:[],
    favorites:Array.isArray(w.favorites)?w.favorites:[],pinned:Array.isArray(w.pinned)?w.pinned:[],stack:w.stack||{},settings:{...d.settings,...(w.settings||{})},
    savedSearches:Array.isArray(w.savedSearches)?w.savedSearches:[],searchHistory:Array.isArray(w.searchHistory)?w.searchHistory:[],
    notifications:Array.isArray(w.notifications)?w.notifications:[],notes:Array.isArray(w.notes)?w.notes:[],lastSession:w.lastSession||{}
  };
}
export async function saveWorkspace(w){ await chrome.storage.local.set({[WORKSPACE_KEY]:w}); return w; }
export async function updateWorkspace(mutator){ const w=await getWorkspace(); await mutator(w); await saveWorkspace(w); return w; }
export function uid(prefix='item'){return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;}
export async function trackActivity(type, data={}){
  return updateWorkspace(w=>{w.activity.unshift({id:uid('act'),type,...data,at:new Date().toISOString()});w.activity=w.activity.slice(0,1000);});
}
export async function toggleFavorite(id){
  return updateWorkspace(w=>{w.favorites=w.favorites.includes(id)?w.favorites.filter(x=>x!==id):[...w.favorites,id];});
}
export function csvEscape(v){return `"${String(v??'').replaceAll('"','""')}"`;}
export function downloadFile(name,content,type='application/json'){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800);}
export function workspaceFilename(){return `charlie-mj-devops-backup-${new Date().toISOString().slice(0,10)}.json`;}
export { makeId };
