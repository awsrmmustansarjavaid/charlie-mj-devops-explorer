import { APP_VERSION, DEFAULT_CONFIG, deriveRawBase, deriveRawIndex, deriveRawFile } from '../../js/config.js';
import { getConfig, saveConfig, resetConfig, getBookmarks, saveBookmarks, getHistory, addHistory, getNotes, getLearning, saveLearning } from '../../js/storage.js';
import { CATEGORIES, TYPES, DIFFICULTIES, ROADMAP, inferCategory, makeId } from '../../js/data.js';
import { checkEndpoint, fetchRawFile, githubGetFile, githubPutFile, getRepoMetadata } from '../../js/github.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let config, bookmarks = [], notes = {}, learning = {}, resources = [];
let selectedCategories = new Set();
let remoteCategories = [];
let remoteTechnologies = [];

const builtInResources = [
  {title:'Kubernetes Documentation',url:'https://kubernetes.io/docs/',category:'Kubernetes',tags:['kubernetes','docs','containers'],type:'documentation',difficulty:'beginner'},
  {title:'Docker Documentation',url:'https://docs.docker.com/',category:'Containers',tags:['docker','containers'],type:'documentation',difficulty:'beginner'},
  {title:'Jenkins Documentation',url:'https://www.jenkins.io/doc/',category:'CI/CD',tags:['jenkins','pipeline','cicd'],type:'documentation',difficulty:'beginner'},
  {title:'Terraform Documentation',url:'https://developer.hashicorp.com/terraform/docs',category:'Infrastructure as Code',tags:['terraform','iac'],type:'documentation',difficulty:'intermediate'},
  {title:'AWS EKS Documentation',url:'https://docs.aws.amazon.com/eks/',category:'Cloud',tags:['aws','eks','kubernetes'],type:'documentation',difficulty:'intermediate'},
  {title:'GitHub Actions Documentation',url:'https://docs.github.com/actions',category:'CI/CD',tags:['github','actions','cicd'],type:'documentation',difficulty:'beginner'},
  {title:'Prometheus Documentation',url:'https://prometheus.io/docs/',category:'Observability',tags:['prometheus','monitoring'],type:'documentation',difficulty:'intermediate'},
  {title:'Grafana Documentation',url:'https://grafana.com/docs/',category:'Observability',tags:['grafana','monitoring'],type:'documentation',difficulty:'beginner'},
  {title:'Argo CD Documentation',url:'https://argo-cd.readthedocs.io/',category:'GitOps',tags:['argocd','gitops','kubernetes'],type:'documentation',difficulty:'advanced'},
  {title:'Trivy Documentation',url:'https://trivy.dev/',category:'Security',tags:['trivy','security','containers'],type:'documentation',difficulty:'intermediate'},
  {title:'Ansible Documentation',url:'https://docs.ansible.com/',category:'Infrastructure as Code',tags:['ansible','automation'],type:'documentation',difficulty:'intermediate'},
  {title:'Helm Documentation',url:'https://helm.sh/docs/',category:'Kubernetes',tags:['helm','kubernetes','package'],type:'documentation',difficulty:'intermediate'},
  {title:'Git Documentation',url:'https://git-scm.com/doc',category:'Fundamentals',tags:['git','version-control'],type:'documentation',difficulty:'beginner'},
  {title:'Linux Documentation',url:'https://docs.kernel.org/',category:'Fundamentals',tags:['linux','kernel'],type:'documentation',difficulty:'beginner'},
  {title:'OpenTelemetry Documentation',url:'https://opentelemetry.io/docs/',category:'Observability',tags:['opentelemetry','tracing','metrics'],type:'documentation',difficulty:'intermediate'},
  {title:'Flux Documentation',url:'https://fluxcd.io/docs/',category:'GitOps',tags:['flux','gitops','kubernetes'],type:'documentation',difficulty:'advanced'}
];

const toast = msg => { const el=$('#toast'); if(!el) return; el.textContent=msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2600); };
const escapeHtml = s => String(s ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const openUrl = url => { if(url) { chrome.tabs.create({url}); addHistory({title:url, url}); } };
const pct = (a,b)=>b?Math.round(a/b*100):0;

function normalizeResource(x) {
  const title=x.title||x.name||x.label||'Untitled resource';
  const tags=Array.isArray(x.tags)?x.tags:String(x.tags||'').split(',').map(t=>t.trim()).filter(Boolean);
  return {
    title, url:x.url||x.link||x.html_url||'',
    category:x.category||inferCategory(title,tags.join(' ')),
    tags, type:x.type||x.resourceType||'github-repository',
    difficulty:String(x.difficulty||x.skillLevel||'intermediate').toLowerCase(), description:x.description||x.summary||'',
    source:x.source||'DevOps Explorer data'
  };
}

function jsonArray(data, keys=[]) {
  if (Array.isArray(data)) return data;
  for (const key of keys) if (Array.isArray(data?.[key])) return data[key];
  return [];
}

function technologyUrl(technology) {
  const name=technology?.name||technology?.title||'';
  const slug=technology?.slug||technology?.id||'';
  const exact=TOOL_LINKS[name] || TOOL_LINKS[slug];
  return technology?.url || technology?.website || technology?.documentation || technology?.documentationUrl || exact || `https://github.com/search?q=${encodeURIComponent(name||slug)}&type=repositories`;
}

function normalizeTechnology(technology) {
  const name=technology?.name||technology?.title||technology?.slug||technology?.id||'Untitled technology';
  const category=technology?.category||'Other';
  const tags=[
    name, technology?.slug, technology?.subcategory, category,
    ...(Array.isArray(technology?.aliases)?technology.aliases:[]),
    ...(Array.isArray(technology?.keywords)?technology.keywords:[]),
    ...(Array.isArray(technology?.relatedTechnologies)?technology.relatedTechnologies:[])
  ].filter(Boolean).map(String);
  return {
    id:technology?.id||technology?.slug||name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),
    title:name, url:technologyUrl(technology), category, tags:[...new Set(tags)],
    type:'tool', difficulty:String(technology?.skillLevel||'intermediate').toLowerCase(),
    description:technology?.description||technology?.shortDescription||'',
    source:'GitHub devops-technologies.json'
  };
}

function applyRemoteCategories(categoryData, technologyData) {
  const categories=jsonArray(categoryData);
  const technologies=jsonArray(technologyData);
  if (!categories.length) return;
  const techById=new Map(technologies.map(t=>[String(t.id||t.slug||'').toLowerCase(),t]));
  const normalized=categories.map((c,index)=>{
    const tools=(Array.isArray(c.technologies)?c.technologies:[]).map(id=>techById.get(String(id).toLowerCase())?.name||String(id));
    return {
      id:c.id||c.slug||`category-${index+1}`, name:c.name||c.title||'Other', icon:c.icon||'◈',
      tools, description:c.description||'', skillLevel:c.skillLevel||'Intermediate'
    };
  }).filter(c=>c.name);
  if (normalized.length) {
    CATEGORIES.splice(0,CATEGORIES.length,...normalized);
    remoteCategories=normalized;
  }
}

const TOOL_LINKS={
  'Linux':'https://docs.kernel.org/',
  'Networking':'https://www.cloudflare.com/learning/network-layer/what-is-a-computer-network/',
  'Git':'https://git-scm.com/doc',
  'GitHub':'https://docs.github.com/',
  'GitLab':'https://docs.gitlab.com/',
  'Shell Scripting':'https://www.gnu.org/software/bash/manual/bash.html',
  'Docker':'https://docs.docker.com/',
  'Docker Compose':'https://docs.docker.com/compose/',
  'Podman':'https://docs.podman.io/',
  'Containerd':'https://containerd.io/docs/',
  'Docker Swarm':'https://docs.docker.com/engine/swarm/',
  'Kubernetes':'https://kubernetes.io/docs/',
  'kubectl':'https://kubernetes.io/docs/reference/kubectl/',
  'Helm':'https://helm.sh/docs/',
  'Kustomize':'https://kubectl.docs.kubernetes.io/guides/introduction/kustomize/',
  'Ingress':'https://kubernetes.io/docs/concepts/services-networking/ingress/',
  'Services':'https://kubernetes.io/docs/concepts/services-networking/service/',
  'Operators':'https://kubernetes.io/docs/concepts/extend-kubernetes/operator/',
  'Istio':'https://istio.io/latest/docs/',
  'Argo CD':'https://argo-cd.readthedocs.io/en/stable/',
  'Jenkins':'https://www.jenkins.io/doc/',
  'GitHub Actions':'https://docs.github.com/actions',
  'GitLab CI/CD':'https://docs.gitlab.com/ee/ci/',
  'CircleCI':'https://circleci.com/docs/',
  'Tekton':'https://tekton.dev/docs/',
  'TeamCity':'https://www.jetbrains.com/help/teamcity/',
  'Terraform':'https://developer.hashicorp.com/terraform/docs',
  'OpenTofu':'https://opentofu.org/docs/',
  'CloudFormation':'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html',
  'Pulumi':'https://www.pulumi.com/docs/',
  'Ansible':'https://docs.ansible.com/',
  'AWS':'https://docs.aws.amazon.com/',
  'Azure':'https://learn.microsoft.com/azure/',
  'Google Cloud':'https://cloud.google.com/docs',
  'EKS':'https://docs.aws.amazon.com/eks/',
  'ECS':'https://docs.aws.amazon.com/ecs/',
  'ECR':'https://docs.aws.amazon.com/ecr/',
  'GKE':'https://cloud.google.com/kubernetes-engine/docs',
  'AKS':'https://learn.microsoft.com/azure/aks/',
  'Prometheus':'https://prometheus.io/docs/',
  'Grafana':'https://grafana.com/docs/',
  'Loki':'https://grafana.com/docs/loki/',
  'OpenTelemetry':'https://opentelemetry.io/docs/',
  'Jaeger':'https://www.jaegertracing.io/docs/',
  'Elasticsearch':'https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html',
  'Trivy':'https://trivy.dev/latest/',
  'SonarQube':'https://docs.sonarsource.com/sonarqube-server/',
  'OWASP':'https://owasp.org/',
  'Snyk':'https://docs.snyk.io/',
  'Vault':'https://developer.hashicorp.com/vault/docs',
  'Flux':'https://fluxcd.io/flux/',
  'NGINX':'https://docs.nginx.com/',
  'HAProxy':'https://www.haproxy.org/documentation/',
  'Traefik':'https://doc.traefik.io/traefik/',
  'Envoy':'https://www.envoyproxy.io/docs/envoy/latest/',
  'PostgreSQL':'https://www.postgresql.org/docs/',
  'MySQL':'https://dev.mysql.com/doc/',
  'Redis':'https://redis.io/docs/latest/',
  'MongoDB':'https://www.mongodb.com/docs/'
};

function buildTechnologyCatalog(){
  return CATEGORIES.flatMap(category=>category.tools.map(tool=>({
    title:`${tool} — DevOps Resource`,
    url:TOOL_LINKS[tool]||`https://github.com/search?q=${encodeURIComponent(tool)}&type=repositories`,
    category:category.name,
    tags:[tool.toLowerCase().replace(/\s+/g,'-'),category.name.toLowerCase().replace(/\s+/g,'-'),'devops'],
    type:TOOL_LINKS[tool]?'documentation':'github-repository',
    difficulty:['Linux','Git','GitHub','Docker'].includes(tool)?'beginner':'intermediate',
    description:`${tool} resources, documentation and GitHub projects.`
  })));
}

async function loadResources(showNotice=false){
  // Always keep the extension usable offline/when GitHub is temporarily unavailable.
  resources=[...builtInResources,...buildTechnologyCatalog()];
  remoteCategories=[];
  remoteTechnologies=[];

  const base=config.rawBaseUrl ? config.rawBaseUrl.replace(/\/+$/,'') : '';
  const categoriesUrl=config.categoriesUrl || (base && config.categoriesPath ? `${base}/${String(config.categoriesPath).replace(/^\/+/, '')}` : '');
  const technologiesUrl=config.technologiesUrl || (base && config.technologiesPath ? `${base}/${String(config.technologiesPath).replace(/^\/+/, '')}` : '');

  try {
    const [categoriesResponse, technologiesResponse] = await Promise.all([
      categoriesUrl ? fetch(categoriesUrl,{cache:'no-store'}) : Promise.resolve(null),
      technologiesUrl ? fetch(technologiesUrl,{cache:'no-store'}) : Promise.resolve(null)
    ]);
    if (categoriesResponse && !categoriesResponse.ok) throw new Error(`Categories ${categoriesResponse.status} ${categoriesResponse.statusText}`);
    if (technologiesResponse && !technologiesResponse.ok) throw new Error(`Technologies ${technologiesResponse.status} ${technologiesResponse.statusText}`);

    const categoriesData=categoriesResponse ? await categoriesResponse.json() : [];
    const technologiesData=technologiesResponse ? await technologiesResponse.json() : [];
    const categoryArray=jsonArray(categoriesData);
    const technologyArray=jsonArray(technologiesData);

    if (!categoryArray.length) throw new Error('devops-categories.json did not contain a category array.');
    if (!technologyArray.length) throw new Error('devops-technologies.json did not contain a technology array.');

    remoteTechnologies=technologyArray;
    applyRemoteCategories(categoriesData, technologyArray);
    const remote=technologyArray.map(normalizeTechnology).filter(x=>x.url);
    if(remote.length) resources=[...builtInResources,...remote];

    if(showNotice) toast(`Loaded ${remote.length} technologies and ${categoryArray.length} categories from GitHub.`);
  } catch(error) {
    // Restore built-in categories if remote data could not be loaded.
    if (remoteCategories.length === 0) {
      // CATEGORIES was not mutated unless applyRemoteCategories completed.
    }
    if(showNotice) toast(`GitHub data unavailable; using built-in catalog. ${error.message}`);
  }

  fillCategories();
  renderQuick();
}

function renderQuick(){
  $('#quickAccess').innerHTML=CATEGORIES.map(c=>`<button class="tech" data-tool="${escapeHtml(c.name)}">${c.icon}<br><span class="small">${escapeHtml(c.name)}</span></button>`).join('');
  $$('#quickAccess [data-tool]').forEach(b=>b.onclick=()=>{showSection('search');$('#searchQuery').value=b.dataset.tool;runSearch();});
}

function fillCategories(){
  $('#searchCategory').innerHTML=CATEGORIES.map(c=>`<option value="${escapeHtml(c.name)}">${c.icon} ${escapeHtml(c.name)}</option>`).join('');
  $('#bookmarkCategory').innerHTML='<option value="">All categories</option>'+CATEGORIES.map(c=>`<option>${escapeHtml(c.name)}</option>`).join('');
  $('#categoryChips').innerHTML=CATEGORIES.map(c=>`<button class="chip" data-cat="${escapeHtml(c.name)}">${c.icon} ${escapeHtml(c.name)}</button>`).join('');
  $$('#categoryChips [data-cat]').forEach(btn=>btn.onclick=()=>{
    const v=btn.dataset.cat;
    selectedCategories.has(v)?(selectedCategories.delete(v),btn.classList.remove('selected')):(selectedCategories.add(v),btn.classList.add('selected'));
    [...$('#searchCategory').options].forEach(o=>o.selected=selectedCategories.has(o.value));
  });
}

async function renderStats(){
  const collections=new Set(bookmarks.flatMap(b=>b.collections||[]));
  const learningDone=ROADMAP.filter(([name,status])=>(learning[name]||status)==='Completed').length;
  $('#statBookmarks').textContent=bookmarks.length;$('#statCollections').textContent=collections.size;$('#statNotes').textContent=Object.keys(notes).length;$('#statProgress').textContent=`${pct(learningDone,ROADMAP.length)}%`;
  $('#homeBookmarks').textContent=bookmarks.length;$('#statProgress').title=`${learningDone}/${ROADMAP.length} completed`;
}

async function renderRecent(){
  const list=await getHistory();
  $('#recentList').innerHTML=list.length?list.slice(0,8).map(x=>`<div class="health-row"><span><strong>${escapeHtml(x.title)}</strong><br><span class="muted small">${escapeHtml(x.url)}</span></span><button class="btn" data-open="${encodeURIComponent(x.url)}">Open</button></div>`).join(''):'<div class="empty">No recently opened resources yet.</div>';
  $$('#recentList [data-open]').forEach(b=>b.onclick=()=>openUrl(decodeURIComponent(b.dataset.open)));
}

function renderBookmarks(){
  const q=($('#bookmarkSearch').value||'').toLowerCase(); const cat=$('#bookmarkCategory').value;
  const list=bookmarks.filter(b=>(!cat||b.category===cat)&&(!q||JSON.stringify(b).toLowerCase().includes(q)));
  $('#bookmarkBody').innerHTML=list.length?list.map(b=>`<tr><td><strong>${escapeHtml(b.title)}</strong><br><span class="muted small">${escapeHtml(b.url)}</span></td><td>${escapeHtml(b.category||'Other')}</td><td>${(b.tags||[]).map(t=>`<span class="pill">#${escapeHtml(t)}</span> `).join('')}</td><td>${escapeHtml(b.difficulty||'—')}</td><td>${(b.collections||[]).map(c=>`<span class="pill">${escapeHtml(c)}</span> `).join('')}</td><td><div class="toolbar"><button class="btn" data-open="${encodeURIComponent(b.url)}">Open</button><button class="btn" data-edit="${b.id}">Edit</button><button class="btn danger" data-delete="${b.id}">Delete</button></div></td></tr>`).join(''):'<tr><td colspan="6"><div class="empty">No bookmarks match your filters.</div></td></tr>';
  $$('#bookmarkBody [data-open]').forEach(b=>b.onclick=()=>openUrl(decodeURIComponent(b.dataset.open)));
  $$('#bookmarkBody [data-edit]').forEach(b=>b.onclick=()=>openBookmarkModal(bookmarks.find(x=>x.id===b.dataset.edit)));
  $$('#bookmarkBody [data-delete]').forEach(b=>b.onclick=async()=>{bookmarks=bookmarks.filter(x=>x.id!==b.dataset.delete);await saveBookmarks(bookmarks);renderBookmarks();renderStats();toast('Bookmark deleted.');});
}

function openBookmarkModal(item={}){
  $('#modalContent').innerHTML=`<div class="section-title"><h2>${item.id?'Edit':'Add'} Bookmark</h2><button class="btn" id="closeModal">✕</button></div><div class="form-grid"><div class="field full"><label>Title</label><input id="mTitle" class="input" value="${escapeHtml(item.title||'')}"></div><div class="field full"><label>URL</label><input id="mUrl" class="input" value="${escapeHtml(item.url||'')}"></div><div class="field"><label>Category</label><select id="mCategory" class="select">${CATEGORIES.map(c=>`<option ${c.name===(item.category||'')?'selected':''}>${escapeHtml(c.name)}</option>`).join('')}<option ${item.category==='Other'?'selected':''}>Other</option></select></div><div class="field"><label>Difficulty</label><select id="mDifficulty" class="select">${DIFFICULTIES.map(x=>`<option ${x===(item.difficulty||'beginner')?'selected':''}>${x}</option>`).join('')}</select></div><div class="field full"><label>Tags (comma separated)</label><input id="mTags" class="input" value="${escapeHtml((item.tags||[]).join(', '))}"></div><div class="field full"><label>Collections (comma separated)</label><input id="mCollections" class="input" value="${escapeHtml((item.collections||[]).join(', '))}"></div><div class="field full"><label>Description</label><textarea id="mDescription" class="textarea" rows="4">${escapeHtml(item.description||'')}</textarea></div><div class="field full"><label>Personal notes</label><textarea id="mNotes" class="textarea" rows="4">${escapeHtml(item.notes||'')}</textarea></div></div><div class="toolbar modal-actions"><button class="btn primary" id="saveBookmark">Save Bookmark</button></div>`;
  $('#modal').classList.add('open');$('#closeModal').onclick=()=>$('#modal').classList.remove('open');
  $('#saveBookmark').onclick=async()=>{
    const b={id:item.id||makeId(),title:$('#mTitle').value.trim(),url:$('#mUrl').value.trim(),category:$('#mCategory').value,tags:$('#mTags').value.split(',').map(x=>x.trim()).filter(Boolean),collections:$('#mCollections').value.split(',').map(x=>x.trim()).filter(Boolean),difficulty:$('#mDifficulty').value,type:item.type||'documentation',description:$('#mDescription').value.trim(),notes:$('#mNotes').value.trim(),createdAt:item.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};
    if(!b.title||!b.url){toast('Title and URL are required.');return}
    const i=bookmarks.findIndex(x=>x.id===b.id);if(i>=0)bookmarks[i]=b;else bookmarks.unshift(b);await saveBookmarks(bookmarks);$('#modal').classList.remove('open');renderBookmarks();renderStats();renderCollections();toast('Bookmark saved.');
  };
}

function renderCollections(){
  const map={};bookmarks.forEach(b=>(b.collections||[]).forEach(c=>(map[c]??=[]).push(b)));const names=Object.keys(map);
  $('#collectionGrid').innerHTML=names.length?names.map(c=>`<div class="card"><h3>📚 ${escapeHtml(c)}</h3><div class="stat">${map[c].length}</div><div class="muted small">resources</div><button class="btn collection-open" data-collection="${escapeHtml(c)}">Open Collection</button></div>`).join(''):'<div class="empty">No collections yet. Add a collection name while editing a bookmark.</div>';
  $$('#collectionGrid [data-collection]').forEach(b=>b.onclick=()=>{showSection('bookmarks');$('#bookmarkSearch').value=b.dataset.collection;renderBookmarks();});
}

function renderRoadmap(){
  const done=ROADMAP.filter(([n,s])=>(learning[n]||s)==='Completed').length;const progress=pct(done,ROADMAP.length);$('#roadmapProgress').textContent=`${progress}%`;
  $('#roadmapList').innerHTML=ROADMAP.map(([name,defaultStatus],i)=>{const status=learning[name]||defaultStatus;return `<div class="health-row"><span><strong>${String(i+1).padStart(2,'0')}</strong> · ${escapeHtml(name)}</span><select class="select roadmap-select" data-learn="${escapeHtml(name)}"><option ${status==='Not Started'?'selected':''}>Not Started</option><option ${status==='Learning'?'selected':''}>Learning</option><option ${status==='Completed'?'selected':''}>Completed</option></select></div>`}).join('');
  $$('#roadmapList [data-learn]').forEach(s=>s.onchange=async()=>{learning[s.dataset.learn]=s.value;await saveLearning(learning);renderRoadmap();renderLearning();renderStats();});
}

function renderLearning(){
  $('#learningList').innerHTML=ROADMAP.map(([name,status])=>{const v=learning[name]||status;return `<div class="health-row"><span>${escapeHtml(name)}</span><span class="pill">${escapeHtml(v)}</span></div>`}).join('');
  const done=ROADMAP.filter(([n,s])=>(learning[n]||s)==='Completed').length;
  $('#learningStats').innerHTML=`<div class="stat">${pct(done,ROADMAP.length)}%</div><p class="muted">${done} of ${ROADMAP.length} roadmap stages completed.</p><div class="health-row"><span>Bookmarks</span><strong>${bookmarks.length}</strong></div><div class="health-row"><span>Notes</span><strong>${Object.keys(notes).length}</strong></div><div class="health-row"><span>Technologies</span><strong>${new Set(bookmarks.map(b=>b.category).filter(Boolean)).size}</strong></div>`;
}

function renderToolbox(){
  const q=($('#toolboxSearch').value||'').toLowerCase();const tools=CATEGORIES.flatMap(c=>c.tools.map(t=>({tool:t,category:c.name,icon:c.icon}))).filter(x=>x.tool.toLowerCase().includes(q)||x.category.toLowerCase().includes(q));
  $('#toolboxGrid').innerHTML=tools.map(x=>`<button class="tech" data-toolbox="${escapeHtml(x.tool)}">${x.icon}<br><strong>${escapeHtml(x.tool)}</strong><br><span class="small muted">${escapeHtml(x.category)}</span></button>`).join('');
  $$('#toolboxGrid [data-toolbox]').forEach(b=>b.onclick=()=>{showSection('search');$('#searchQuery').value=b.dataset.toolbox;runSearch();});
}

function currentSearchFilters(){
  const cats=[...$('#searchCategory').selectedOptions].map(o=>o.value);
  const tags=$('#searchTags').value.split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
  return {q:$('#searchQuery').value.trim().toLowerCase(),cats,tags,type:$('#searchType').value,diff:$('#searchDifficulty').value,mode:$('#filterMode').value};
}

function textTokens(q){return q.split(/\s+/).map(x=>x.trim()).filter(Boolean);}
function matchesQuery(resource,q){if(!q)return true;const text=JSON.stringify(resource).toLowerCase();return textTokens(q).every(token=>text.includes(token));}

async function runSearch(){
  const f=currentSearchFilters();
  const list=resources.filter(r=>{
    const qOk=matchesQuery(r,f.q);
    const catOk=!f.cats.length||f.cats.includes(r.category);
    const resourceTags=(r.tags||[]).map(x=>String(x).toLowerCase());
    const tagMatches=f.tags.filter(t=>resourceTags.includes(t));
    const tagOk=!f.tags.length||tagMatches.length===(f.mode==='AND'?f.tags.length:Math.min(1,f.tags.length));
    const typeOk=!f.type||r.type===f.type;
    const diffOk=!f.diff||r.difficulty===f.diff;
    if(f.mode==='OR' && (f.cats.length||f.tags.length||f.type||f.diff)) return qOk && (catOk&&f.cats.length || tagMatches.length>0&&f.tags.length || typeOk&&f.type || diffOk&&f.diff);
    return qOk&&catOk&&tagOk&&typeOk&&diffOk;
  });
  $('#resultCount').textContent=`${list.length} results`;
  $('#resultsBody').innerHTML=list.length?list.map(r=>`<tr><td><strong>${escapeHtml(r.title)}</strong><br><span class="muted small">${escapeHtml(r.description||r.url)}</span></td><td>${escapeHtml(r.category)}</td><td>${(r.tags||[]).map(t=>`<span class="pill">#${escapeHtml(t)}</span> `).join('')}</td><td>${escapeHtml(r.type)}</td><td>${escapeHtml(r.difficulty)}</td><td><div class="toolbar"><button class="btn" data-result-open="${encodeURIComponent(r.url)}">Open</button><button class="btn" data-result-bookmark="${encodeURIComponent(JSON.stringify(r))}">⭐</button></div></td></tr>`).join(''):'<tr><td colspan="6"><div class="empty">No resources matched. Try fewer filters, a shorter query, or GitHub Search.</div></td></tr>';
  $$('#resultsBody [data-result-open]').forEach(b=>b.onclick=()=>openUrl(decodeURIComponent(b.dataset.resultOpen)));
  $$('#resultsBody [data-result-bookmark]').forEach(b=>b.onclick=async()=>{const r=JSON.parse(decodeURIComponent(b.dataset.resultBookmark));if(!bookmarks.some(x=>x.url===r.url)){bookmarks.unshift({...r,id:makeId(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),collections:[]});await saveBookmarks(bookmarks);renderBookmarks();renderStats();toast('Added to bookmarks.')}else toast('Already bookmarked.');});
}

async function githubSearch(){
  const q=$('#searchQuery').value.trim();if(!q){toast('Enter a GitHub search query.');return}
  $('#resultsBody').innerHTML='<tr><td colspan="6"><div class="empty">Searching GitHub…</div></td></tr>';
  try{
    const c=await getConfig();const headers=c.token?{Authorization:`Bearer ${c.token}`,Accept:'application/vnd.github+json'}:{Accept:'application/vnd.github+json'};
    const res=await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&per_page=30&sort=stars&order=desc`,{headers,cache:'no-store'});
    if(!res.ok)throw new Error(`${res.status} ${res.statusText}`);
    const data=await res.json();const list=data.items||[];
    $('#resultCount').textContent=`${list.length} GitHub repositories`;
    $('#resultsBody').innerHTML=list.length?list.map(r=>`<tr><td><strong>${escapeHtml(r.full_name)}</strong><br><span class="muted small">${escapeHtml(r.description||'No description')}</span></td><td>GitHub</td><td>${(r.topics||[]).map(t=>`<span class="pill">#${escapeHtml(t)}</span> `).join('')}</td><td>github-repository</td><td>${r.stargazers_count>5000?'advanced':'intermediate'}</td><td><div class="toolbar"><button class="btn" data-result-open="${encodeURIComponent(r.html_url)}">Open</button><button class="btn" data-github-bookmark="${encodeURIComponent(JSON.stringify(r))}">⭐</button></div></td></tr>`).join(''):'<tr><td colspan="6"><div class="empty">No GitHub repositories found.</div></td></tr>';
    $$('[data-result-open]').forEach(b=>b.onclick=()=>openUrl(decodeURIComponent(b.dataset.resultOpen)));
    $$('[data-github-bookmark]').forEach(b=>b.onclick=async()=>{const r=JSON.parse(decodeURIComponent(b.dataset.githubBookmark));if(bookmarks.some(x=>x.url===r.html_url)){toast('Already bookmarked.');return}bookmarks.unshift({id:makeId(),title:r.full_name,url:r.html_url,category:inferCategory(r.name,(r.topics||[]).join(' ')),tags:r.topics||[],type:'github-repository',difficulty:'intermediate',description:r.description||'',collections:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});await saveBookmarks(bookmarks);renderBookmarks();renderStats();toast('GitHub repository bookmarked.');});
  }catch(e){$('#resultsBody').innerHTML='<tr><td colspan="6"><div class="empty">GitHub Search failed. Check network/API access and try again.</div></td></tr>';toast(`GitHub search failed: ${e.message}`);}
}

async function runHealth(){
  $('#healthRows').innerHTML='<div class="empty">Running checks…</div>';
  const c=config;
  const base=c.rawBaseUrl ? c.rawBaseUrl.replace(/\/+$/,'') : '';
  const categoryUrl=c.categoriesUrl || (base && c.categoriesPath ? `${base}/${String(c.categoriesPath).replace(/^\/+/, '')}` : '');
  const technologyUrlValue=c.technologiesUrl || (base && c.technologiesPath ? `${base}/${String(c.technologiesPath).replace(/^\/+/, '')}` : '');
  const bookmarkUrl=base && c.bookmarkPath ? `${base}/${String(c.bookmarkPath).replace(/^\/+/, '')}` : '';
  const urls=[
    ['Repository URL',c.repositoryUrl,true],
    ['Raw index.html',c.rawIndexUrl,true],
    ['Raw categories DB',categoryUrl,true],
    ['Raw technologies DB',technologyUrlValue,true],
    ['Raw bookmark DB',bookmarkUrl,false]
  ];
  const checks=[];
  for(const [name,url,required] of urls){
    checks.push(url?{name,required,...await checkEndpoint(url)}:{name,required,url:'',ok:false,status:0,ms:0,error:'Not configured'});
  }
  if(c.repositoryUrl){
    try{const repoMeta=await getRepoMetadata();checks.push({name:'GitHub API / repository',required:false,url:c.repositoryUrl,ok:true,status:200,ms:0,details:`${repoMeta.full_name} · ${repoMeta.default_branch}`});}
    catch(error){checks.push({name:'GitHub API / repository',required:false,url:c.repositoryUrl,ok:false,status:0,ms:0,error:error.message});}
  }
  $('#healthRows').innerHTML=checks.map(x=>`<div class="health-row"><span>${escapeHtml(x.name)}${x.required?'':' <span class="pill">optional</span>'}<br><span class="muted small">${escapeHtml(x.url||x.error||x.details||'')}</span></span><span class="${x.ok?'healthy':x.required?'bad':'warning'}">${x.ok?'● Healthy':x.required?'● Failed':'● Not available'} ${x.status||''} ${x.ms?`· ${x.ms}ms`:''}</span></div>`).join('');
  const requiredOk=checks.filter(x=>x.required).every(x=>x.ok);
  $('#terminal').textContent=['$ devops-explorer health',...checks.map(x=>`[${x.ok?'OK':x.required?'FAIL':'SKIP'}] ${x.name}${x.ms?` (${x.ms}ms)`:''}`),'',`SYSTEM: ${requiredOk?'HEALTHY':'CHECK REQUIRED'}`].join('\n');
  $('#githubStatus').innerHTML=requiredOk?'<span class="dot"></span>Healthy':'<span class="dot warning-dot"></span>Check required';
  $('#homeRepo').innerHTML=c.repositoryUrl?'<span class="healthy">● Configured</span>':'<span class="warning">● Configure</span>';
  $('#homeRaw').innerHTML=c.rawIndexUrl?'<span class="healthy">● Configured</span>':'<span class="warning">● Configure</span>';
}

async function pullBookmarks(){try{const c=await getConfig();const raw=await fetchRawFile(c.bookmarkPath);const data=JSON.parse(raw);const remote=Array.isArray(data)?data:(data.bookmarks||[]);bookmarks=remote;await saveBookmarks(bookmarks);renderBookmarks();renderStats();renderCollections();logSync(`Pulled ${remote.length} bookmarks from ${c.bookmarkPath}.`);toast('Bookmarks pulled from GitHub.')}catch(e){logSync(`Pull failed: ${e.message}`);toast(e.message)}}
async function pushBookmarks(){try{const c=await getConfig();if(!c.token)throw new Error('Add a GitHub token in Settings before pushing.');const current=await githubGetFile(c.bookmarkPath);const payload={version:1,updatedAt:new Date().toISOString(),bookmarks};const result=await githubPutFile(c.bookmarkPath,JSON.stringify(payload,null,2),`Update DevOps Explorer bookmarks (${bookmarks.length})`,current.sha);logSync(`Pushed ${bookmarks.length} bookmarks. Commit: ${result.commit?.sha?.slice(0,8)||'done'}`);toast('Bookmarks pushed to GitHub.')}catch(e){logSync(`Push failed: ${e.message}`);toast(e.message)}}
function logSync(msg){$('#syncLog').textContent=`${new Date().toLocaleString()} — ${msg}`;$('#homeSync').textContent='Last sync updated';}

function exportBookmarks(){const blob=new Blob([JSON.stringify({format:'devops-explorer-bookmarks',version:1,exportedAt:new Date().toISOString(),bookmarks},null,2)],{type:'application/json'});downloadBlob(blob,`DevOps-Bookmarks-${new Date().toISOString().slice(0,10)}.json`);toast('Bookmarks exported.');}
function importBookmarks(){ $('#importFile').click(); }

async function handleBookmarkImport(e){const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());const incoming=Array.isArray(data)?data:(data.bookmarks||[]);if(!Array.isArray(incoming))throw new Error('The JSON file does not contain a bookmarks array.');const existing=new Map(bookmarks.map(x=>[x.url,x]));let added=0;for(const b of incoming){if(!b.url)continue;if(!existing.has(b.url)){existing.set(b.url,{...b,id:b.id||makeId(),createdAt:b.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()});added++;}}bookmarks=[...existing.values()];await saveBookmarks(bookmarks);renderBookmarks();renderStats();toast(`Imported ${added} new bookmarks.`)}catch(err){toast(`Import failed: ${err.message}`)}e.target.value='';}

function downloadBlob(blob,filename){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}

function exportConfig(){
  const includeToken=$('#includeTokenInConfigExport')?.checked===true;
  const exported={...config};if(!includeToken)delete exported.token;
  const payload={format:'devops-explorer-config',version:1,exportedAt:new Date().toISOString(),tokenIncluded:includeToken,config:exported};
  downloadBlob(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),`DevOps-Explorer-Config-${new Date().toISOString().slice(0,10)}.json`);
  toast(includeToken?'Configuration exported with token. Keep this file private.':'Configuration exported without token.');
}

function importConfig(){ $('#importConfigFile').click(); }
async function handleConfigImport(e){
  const file=e.target.files?.[0];if(!file)return;
  try{
    const data=JSON.parse(await file.text());const incoming=data?.config&&typeof data.config==='object'?data.config:data;
    if(!incoming||typeof incoming!=='object'||Array.isArray(incoming))throw new Error('Invalid configuration JSON.');
    const allowed=['repositoryUrl','branch','rawBaseUrl','rawIndexUrl','categoriesPath','categoriesUrl','technologiesPath','technologiesUrl','bookmarkPath','tagsPath','metadataPath','versionPath','token','theme','accent','autoHealth','githubSyncEnabled'];
    const next={...config};for(const key of allowed)if(Object.prototype.hasOwnProperty.call(incoming,key))next[key]=incoming[key];
    config=await saveConfig(next);loadSettings();await loadResources(true);await runHealth();toast('Configuration imported successfully.');
  }catch(err){toast(`Configuration import failed: ${err.message}`)}e.target.value='';
}

async function resetSettings(){
  if(!confirm('Reset all DevOps Explorer configuration to the built-in defaults?'))return;
  config=await resetConfig();loadSettings();await loadResources(true);await runHealth();toast('Settings reset to defaults.');
}

function applyTheme(){
  const root=document.documentElement;const accents={blue:['#168cff','#00d8ff'],purple:['#9b6cff','#e16cff'],green:['#19c987','#72f5ae'],orange:['#ff8b2c','#ffd166']};const [a,b]=accents[config.accent]||accents.blue;root.style.setProperty('--accent',a);root.style.setProperty('--accent2',b);
  const light=config.theme==='light'||(config.theme==='system'&&window.matchMedia?.('(prefers-color-scheme: light)').matches);
  root.classList.toggle('light-theme',light);
}

function loadSettings(){
  config={...DEFAULT_CONFIG,...config};
  for(const id of ['repositoryUrl','rawBaseUrl','rawIndexUrl','categoriesUrl','technologiesUrl','branch','categoriesPath','technologiesPath','bookmarkPath','tagsPath','metadataPath','token','theme','accent'])if($('#'+id))$('#'+id).value=config[id]??'';
  $('#autoHealth').checked=!!config.autoHealth;
  $('#settingsDiagnostics').textContent=`Extension ${APP_VERSION}. Data sources: categories + technologies JSON. GitHub write sync: ${config.token?'configured':'not configured'}.`;
  applyTheme();
}

async function saveSettingsForm(){
  const repo=$('#repositoryUrl').value.trim();const branch=$('#branch').value.trim()||'main';
  const suppliedBase=$('#rawBaseUrl').value.trim();const suppliedIndex=$('#rawIndexUrl').value.trim();const categoriesPath=$('#categoriesPath').value.trim()||'data/devops-categories.json';const technologiesPath=$('#technologiesPath').value.trim()||'data/devops-technologies.json';
  const next={...config,repositoryUrl:repo,branch,rawBaseUrl:suppliedBase||deriveRawBase(repo,branch),rawIndexUrl:suppliedIndex||deriveRawIndex(repo,branch),categoriesPath,technologiesPath,categoriesUrl:$('#categoriesUrl').value.trim()||deriveRawFile(repo,branch,categoriesPath),technologiesUrl:$('#technologiesUrl').value.trim()||deriveRawFile(repo,branch,technologiesPath),bookmarkPath:$('#bookmarkPath').value.trim()||'bookmark-db/bookmarks.json',tagsPath:$('#tagsPath').value.trim()||'bookmark-db/tags.json',metadataPath:$('#metadataPath').value.trim()||'bookmark-db/metadata.json',token:$('#token').value.trim(),theme:$('#theme').value,accent:$('#accent').value,autoHealth:$('#autoHealth').checked};
  config=await saveConfig(next);loadSettings();await loadResources(true);await renderStats();await runHealth();toast('Settings saved.');
}

const commands=[['🔎','Search DevOps resources',()=>showSection('search')],['⭐','Open Bookmarks',()=>showSection('bookmarks')],['📚','Open Collections',()=>showSection('collections')],['🩺','Run Health Check',()=>{showSection('health');runHealth()}],['🔄','Sync Bookmarks',()=>showSection('sync')],['📥','Import Bookmarks',importBookmarks],['📤','Export Bookmarks',exportBookmarks],['⚙️','Settings',()=>showSection('settings')],['🚀','Open Raw Explorer',openRaw]];
function openPalette(){$('#palette').classList.add('open');$('#paletteInput').focus();renderCommands('');}
function closePalette(){$('#palette').classList.remove('open');}
function renderCommands(q){const list=commands.filter(x=>x[1].toLowerCase().includes(q.toLowerCase()));$('#commands').innerHTML=list.map((x,i)=>`<div class="command" data-command="${i}"><span>${x[0]} ${x[1]}</span><span class="muted">↵</span></div>`).join('');$$('#commands [data-command]').forEach(el=>el.onclick=()=>{closePalette();list[Number(el.dataset.command)][2]()});}

function showSection(id){
  $$('.section').forEach(s=>s.classList.toggle('active',s.id===id));$$('.nav button[data-section]').forEach(b=>b.classList.toggle('active',b.dataset.section===id));
  const title=document.querySelector(`.nav button[data-section="${id}"]`)?.textContent?.replace(/^\S+\s*/,'')||'My DevOps Workspace';$('#pageTitle').textContent=title;
  if(id==='bookmarks')renderBookmarks();if(id==='collections')renderCollections();if(id==='roadmap')renderRoadmap();if(id==='learning')renderLearning();if(id==='toolbox')renderToolbox();if(id==='health')runHealth();if(id==='settings')loadSettings();
}

function openRaw(){
  if(!config.rawIndexUrl){toast('Configure the raw index URL first.');showSection('settings');return;}
  chrome.tabs.create({url:config.rawIndexUrl});
}

function bind(){
  $$('.nav button[data-section]').forEach(b=>b.onclick=()=>showSection(b.dataset.section));$$('[data-section-jump]').forEach(b=>b.onclick=()=>showSection(b.dataset.sectionJump));
  $('#globalSearchBtn').onclick=()=>{showSection('search');$('#searchQuery').value=$('#globalSearch').value;runSearch()};$('#globalSearch').onkeydown=e=>{if(e.key==='Enter')$('#globalSearchBtn').click()};
  $('#runSearch').onclick=runSearch;$('#githubSearchBtn').onclick=githubSearch;$('#clearSearch').onclick=()=>{['searchQuery','searchTags'].forEach(id=>$('#'+id).value='');$('#searchType').value='';$('#searchDifficulty').value='';selectedCategories.clear();$$('#categoryChips .chip').forEach(x=>x.classList.remove('selected'));[...$('#searchCategory').options].forEach(o=>o.selected=false);runSearch()};
  $('#bookmarkSearch').oninput=renderBookmarks;$('#bookmarkCategory').onchange=renderBookmarks;$('#addBookmark').onclick=()=>openBookmarkModal();$('#exportBookmarks').onclick=exportBookmarks;$('#importBookmarks').onclick=importBookmarks;$('#importFile').addEventListener('change',handleBookmarkImport);
  $('#newCollection').onclick=()=>openBookmarkModal({collections:['New Collection']});$('#toolboxSearch').oninput=renderToolbox;$('#runFullHealth').onclick=runHealth;$('#healthHome').onclick=()=>showSection('health');$('#pullBookmarks').onclick=pullBookmarks;$('#pushBookmarks').onclick=pushBookmarks;$('#compareBookmarks').onclick=()=>toast('Compare view: pull the remote database first, then review local/remote counts.');
  $('#saveSettings').onclick=saveSettingsForm;$('#exportConfig').onclick=exportConfig;$('#importConfig').onclick=importConfig;$('#importConfigFile').addEventListener('change',handleConfigImport);$('#resetSettings').onclick=resetSettings;
  $('#openRaw').onclick=openRaw;$('#openRepo').onclick=()=>{if(config.repositoryUrl)openUrl(config.repositoryUrl);else toast('Configure repository URL first.')};
  $('#paletteBtn').onclick=openPalette;$('#palette').onclick=e=>{if(e.target.id==='palette')closePalette()};$('#paletteInput').oninput=e=>renderCommands(e.target.value);$('#paletteInput').onkeydown=e=>{if(e.key==='Escape')closePalette();if(e.key==='Enter')document.querySelector('#commands .command')?.click()};
  window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPalette()}});
}

async function init(){
  config=await getConfig();bookmarks=await getBookmarks();notes=await getNotes();learning=await getLearning();bind();renderBookmarks();renderStats();renderRecent();renderRoadmap();renderLearning();renderToolbox();await loadResources();
  if(config.autoHealth)runHealth();
  const hash=location.hash;if(hash==='#palette')openPalette();if(hash==='#settings')showSection('settings');if(hash.startsWith('#search=')){showSection('search');$('#searchQuery').value=decodeURIComponent(hash.slice(8));runSearch();}
  applyTheme();
}

init().catch(error=>{console.error(error);toast(`Dashboard initialization failed: ${error.message}`);});
