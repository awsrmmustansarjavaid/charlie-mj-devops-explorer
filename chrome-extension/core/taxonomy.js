export function normalizeTechnologyRecords(raw){
 const out=[]; const seen=new Set();
 function walk(node,parentCategory='',parentSubcategory=''){
  if(!node) return;
  if(Array.isArray(node)){node.forEach(x=>walk(x,parentCategory,parentSubcategory));return;}
  if(typeof node==='string'){const name=node.trim();if(name && !seen.has(name.toLowerCase())){seen.add(name.toLowerCase());out.push({id:name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),name,category:parentCategory,subcategory:parentSubcategory,type:'technology',tags:[],difficulty:'beginner'});}return;}
  if(typeof node!=='object') return;
  const name=node.name||node.title||node.technology||node.tool||node.label;
  const category=node.category||node.domain||parentCategory||''; const subcategory=node.subcategory||node.subCategory||parentSubcategory||'';
  if(name && typeof name==='string' && name.length<160){const key=name.trim().toLowerCase();if(!seen.has(key)){seen.add(key);out.push({...node,id:node.id||key.replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),name:name.trim(),category,subcategory,type:node.type||'technology',tags:Array.isArray(node.tags)?node.tags:[],difficulty:node.difficulty||'beginner'});}}
  for(const [k,v] of Object.entries(node)){if(['name','title','technology','tool','label','description','id','category','domain','subcategory','subCategory','tags','difficulty','type'].includes(k)) continue; if(typeof v==='object') walk(v,category,subcategory);}
 }
 walk(raw); return out;
}
export function categoryTools(category){return Array.isArray(category?.tools)?category.tools:[];}
