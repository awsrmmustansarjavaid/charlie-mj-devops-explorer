import assert from 'node:assert/strict';
import { matches } from '../core/search-engine.js';
import { buildGithubQuery } from '../core/github-search.js';
assert.equal(matches({name:'Docker',category:'Containers',tags:['networking']},{query:'docker',categories:['Containers']}),true);
assert.equal(matches({name:'Docker',category:'Containers'},{query:'kubernetes'}),false);
const q=buildGithubQuery({query:'monitoring',categories:['Kubernetes'],technologies:['Prometheus'],tags:['observability'],language:'Go',operator:'AND'});
assert.ok(q.includes('monitoring') && q.includes('Kubernetes') && q.includes('Prometheus') && q.includes('topic:observability') && q.includes('language:Go'));
assert.ok(q.length<=250);
console.log('search-engine tests passed');
