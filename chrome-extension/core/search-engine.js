export function normalize(value=''){return String(value).trim().toLowerCase();}
export function tokenize(value=''){return normalize(value).split(/[^a-z0-9+#.-]+/).filter(Boolean);}
export function matches(item,filters={}){
  const hay=normalize([item.name,item.title,item.description,item.category,item.subcategory,item.type,item.language,(item.tags||[]).join(' '),(item.tools||[]).join(' ')].join(' '));
  const terms=[...(filters.query?tokenize(filters.query):[]),...(filters.technologies||[]).map(normalize),...(filters.tags||[]).map(normalize)];
  const termOk=!terms.length || (filters.operator==='OR'?terms.some(t=>hay.includes(t)):terms.every(t=>hay.includes(t)));
  const catOk=!(filters.categories||[]).length || filters.categories.some(c=>normalize(c)===normalize(item.category)||normalize(c)===normalize(item.domain)||((item.categories||[]).map(normalize).includes(normalize(c))));
  const langOk=!filters.language||normalize(item.language)===normalize(filters.language);
  const diffOk=!filters.difficulty||normalize(item.difficulty)===normalize(filters.difficulty);
  return termOk&&catOk&&langOk&&diffOk;
}
export class SearchEngine{
  constructor({local=[],githubSearch=null,resources=[]}={}){this.local=local;this.githubSearch=githubSearch;this.resources=resources;}
  localSearch(filters){return [...this.local,...this.resources].filter(x=>matches(x,filters));}
  async github(filters){if(!this.githubSearch) return [];return this.githubSearch(filters);}
  async all(filters){return {local:this.localSearch(filters),github:await this.github(filters)};}
}
