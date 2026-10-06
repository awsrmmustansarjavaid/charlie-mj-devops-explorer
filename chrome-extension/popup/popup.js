import {getAppData,getHistory} from '../js/storage.js';
const $=s=>document.querySelector(s); function open(page='dashboard'){chrome.tabs.create({url:chrome.runtime.getURL(`pages/dashboard/dashboard.html#${page}`)});window.close();}
for(const b of document.querySelectorAll('[data-page]')) b.onclick=()=>open(b.dataset.page);
$('#open').onclick=()=>open('dashboard'); $('#side').onclick=()=>chrome.sidePanel?.open({windowId:chrome.windows.WINDOW_ID_CURRENT});
$('#github').onclick=()=>open('explore'); $('#q').onkeydown=e=>{if(e.key==='Enter')open('explore?q='+encodeURIComponent(e.target.value));};
const d=await getAppData();const h=await getHistory();$('#stats').innerHTML=`<div><b>${d.learning?Object.keys(d.learning).length:0}</b><small>Learning</small></div><div><b>${d.labs.length}</b><small>Labs</small></div><div><b>${d.projects.length}</b><small>Projects</small></div>`;$('#recentList').innerHTML=h.slice(0,4).map(x=>`<button data-url="${x.url}">${x.title||x.name||x.url}</button>`).join('')||'<span class="muted">No recent items</span>';for(const b of document.querySelectorAll('#recentList button'))b.onclick=()=>chrome.tabs.create({url:b.dataset.url});
