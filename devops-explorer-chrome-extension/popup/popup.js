import { getConfig, getBookmarks, getNotes, getLearning } from '../js/storage.js';
import { CATEGORIES, ROADMAP } from '../js/data.js';
import { checkEndpoint } from '../js/github.js';

const $=s=>document.querySelector(s); const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)};
async function init(){
  const c=await getConfig(); const b=await getBookmarks(); const n=await getNotes(); const l=await getLearning();
  $('#bookmarks').textContent=b.length; $('#collections').textContent=new Set(b.flatMap(x=>x.collections||[])).size; $('#notes').textContent=Object.keys(n).length; $('#progress').textContent=`${Math.round(ROADMAP.filter(x=>(l[x[0]]||x[1])==='Completed').length/ROADMAP.length*100)}%`;
  $('#quick').innerHTML=CATEGORIES.slice(0,9).map(x=>`<button class="tech" data-tool="${x.name}">${x.icon}<br><span class="small">${x.name}</span></button>`).join('');
  document.querySelectorAll('[data-tool]').forEach(btn=>btn.onclick=()=>chrome.tabs.create({url:chrome.runtime.getURL(`pages/dashboard/dashboard.html#search=${encodeURIComponent(btn.dataset.tool)}`)}));
  $('#cfgHealth').innerHTML=c.rawIndexUrl?'<span class="healthy">● Configured</span>':'<span class="warning">● Configure</span>';
}
$('#openExplorer').onclick=async()=>{const c=await getConfig(); if(!c.rawIndexUrl){toast('Configure the raw index URL in Settings first.');chrome.runtime.openOptionsPage();return} chrome.tabs.create({url:c.rawIndexUrl})};
$('#openDashboard').onclick=()=>chrome.tabs.create({url:chrome.runtime.getURL('pages/dashboard/dashboard.html')});
$('#openSettings').onclick=()=>chrome.runtime.openOptionsPage();
$('#openRepo').onclick=async()=>{const c=await getConfig(); if(c.repositoryUrl) chrome.tabs.create({url:c.repositoryUrl}); else toast('Configure repository URL first.')};
$('#runHealth').onclick=async()=>{const c=await getConfig(); if(!c.rawIndexUrl){toast('Configure raw index URL first.');return} $('#rawHealth').textContent='Checking…';const r=await checkEndpoint(c.rawIndexUrl);$('#rawHealth').innerHTML=r.ok?`<span class="healthy">● ${r.status} · ${r.ms}ms</span>`:`<span class="bad">● Failed</span>`};
$('#export').onclick=async()=>{const b=await getBookmarks(); const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),bookmarks:b},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='devops-bookmarks.json';a.click();URL.revokeObjectURL(url);toast('Bookmarks exported.');};
init();
