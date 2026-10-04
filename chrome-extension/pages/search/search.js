let allResources = [];
document.addEventListener("DOMContentLoaded", async () => {
  mountSidebar("search");
  const cfg = await getConfig();
  const local = await getBookmarks();
  const builtins = getBuiltInTools().map((t,i)=>normalizeBookmark({id:`builtin-${i}`,title:t.name,url:t.url,category:t.category,tags:[t.category.toLowerCase(),"official-docs"],type:"documentation",difficulty:"beginner",source:"Built-in"}));
  let remote = [];
  if (cfg.resourceDataUrl) { try { const data = await fetchJson(cfg.resourceDataUrl); remote = (Array.isArray(data)?data:data.resources||[]).map(normalizeBookmark); } catch(e) { toast("Remote resource database unavailable","warn"); } }
  allResources = [...local,...builtins,...remote].filter((x,i,a)=>a.findIndex(y=>y.url===x.url && x.url)==i);
  qsa(".chip").forEach(x=>x.remove());
  getCategories().forEach(c => {
    const b=document.createElement("button"); b.className="chip"; b.textContent=c; b.dataset.value=c;
    b.onclick=()=>{b.classList.toggle("selected"); runSearch();}; qs("#categoryFilters").appendChild(b);
  });
  const q = new URLSearchParams(location.search).get("q") || "";
  qs("#searchInput").value=q;
  ["searchInput","tagFilter","difficulty","typeFilter","orMode"].forEach(id=>qs("#"+id).addEventListener("input",runSearch));
  qs("#searchBtn").onclick=runSearch; qs("#clearFilters").onclick=()=>{location.reload();};
  runSearch();
});
function runSearch() {
  const q=qs("#searchInput").value.trim().toLowerCase();
  const tags=qs("#tagFilter").value.toLowerCase().split(",").map(x=>x.trim()).filter(Boolean);
  const cats=qsa(".chip.selected").map(x=>x.dataset.value);
  const diff=qs("#difficulty").value, type=qs("#typeFilter").value, orMode=qs("#orMode").checked;
  const filtered=allResources.filter(r=>{
    const text=[r.title,r.description,r.category,r.type,r.source,...r.tags].join(" ").toLowerCase();
    const queryOk=!q || text.includes(q);
    const catChecks=cats.map(c=>r.category.toLowerCase()===c.toLowerCase());
    const tagChecks=tags.map(t=>r.tags.some(x=>x.toLowerCase().includes(t)));
    const group=[...catChecks,...tagChecks].filter(Boolean);
    const filterOk=!(cats.length||tags.length) || (orMode ? group.length>0 : cats.every(c=>r.category.toLowerCase()===c.toLowerCase()) && tags.every(t=>r.tags.some(x=>x.toLowerCase().includes(t))));
    return queryOk && filterOk && (!diff||r.difficulty===diff) && (!type||r.type===type);
  });
  qs("#resultCount").textContent=`${filtered.length} result${filtered.length===1?"":"s"}`;
  qs("#results").innerHTML=filtered.map(r=>`<tr><td><strong>${escapeHtml(r.title)}</strong><small>${escapeHtml(r.description||r.source||"")}</small></td><td>${escapeHtml(r.category)}</td><td>${r.tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join(" ")}</td><td><span class="difficulty ${r.difficulty}">${escapeHtml(r.difficulty)}</span></td><td class="actions"><button data-open="${escapeAttr(r.url)}">Open</button><button data-bookmark="${escapeAttr(r.url)}">☆</button></td></tr>`).join("") || `<tr><td colspan="5" class="empty">No matching resources.</td></tr>`;
  qsa("[data-open]").forEach(b=>b.onclick=()=>chrome.tabs.create({url:b.dataset.open}));
  qsa("[data-bookmark]").forEach(b=>b.onclick=()=>bookmarkUrl(b.dataset.bookmark));
}
async function bookmarkUrl(url) {
  const found=allResources.find(x=>x.url===url); if(!found)return;
  const current=await getBookmarks(); if(current.some(x=>x.url===url)){toast("Already bookmarked");return;}
  await saveBookmarks([...current,normalizeBookmark({...found,favorite:true})]); toast("Bookmark added","success");
}
function mountSidebar(active) {
  const nav=[["dashboard","⌂","Home"],["search","⌕","Search"],["bookmarks","☆","Bookmarks"],["roadmap","◎","Roadmap"],["toolbox","▦","Toolbox"],["health","◉","Health"],["settings","⚙","Settings"]];
  qs("#sidebar").innerHTML=`<div class="side-brand"><span>🚀</span><b>DevOps Explorer</b></div><nav>${nav.map(([p,i,l])=>`<a class="${active===p?"active":""}" href="../${p}/${p}.html">${i}<span>${l}</span></a>`).join("")}</nav><div class="side-footer">Explore · Organize · Learn · Grow</div>`;
}