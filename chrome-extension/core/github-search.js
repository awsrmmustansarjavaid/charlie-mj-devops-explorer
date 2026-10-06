export function buildGithubQuery(filters={}){
 const groups=[]; const cats=(filters.categories||[]).filter(Boolean); const tech=(filters.technologies||[]).filter(Boolean); const tags=(filters.tags||[]).filter(Boolean);
 if(filters.query) groups.push(filters.query.trim());
 if(cats.length) groups.push(cats.slice(0,4).map(x=>`"${String(x).replace(/"/g,'') }"`).join(filters.operator==='OR'?' OR ':' '));
 if(tech.length) groups.push(tech.slice(0,5).map(x=>`"${String(x).replace(/"/g,'') }"`).join(filters.operator==='OR'?' OR ':' '));
 if(tags.length) groups.push(tags.slice(0,8).map(x=>`topic:${String(x).toLowerCase().replace(/[^a-z0-9-]/g,'-')}`).join(' '));
 if(filters.language) groups.push(`language:${filters.language}`);
 if(filters.repositoryType) groups.push(`in:name,description ${filters.repositoryType}`);
 if(filters.difficulty==='beginner') groups.push('stars:>5');
 if(filters.difficulty==='intermediate') groups.push('stars:>20');
 if(filters.difficulty==='advanced') groups.push('stars:>100');
 return groups.join(filters.operator==='OR'?' OR ':' ').slice(0,250);
}
export async function githubRepositorySearch(filters={}){
 const q=buildGithubQuery(filters)||'devops'; const url=`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=30`;
 const res=await fetch(url,{headers:{Accept:'application/vnd.github+json'}}); if(!res.ok) throw new Error(`GitHub Search ${res.status}: ${await res.text()}`); const data=await res.json();
 return (data.items||[]).map(r=>({id:`github:${r.id}`,name:r.name,title:r.full_name,description:r.description||'',url:r.html_url,category:'GitHub',owner:r.owner?.login||'',createdAt:r.created_at,updatedAt:r.updated_at,language:r.language||'—',stars:r.stargazers_count||0,forks:r.forks_count||0,issues:r.open_issues_count||0,license:r.license?.spdx_id||r.license?.name||'—',topics:r.topics||[],type:'github-repository'}));
}
