import assert from 'node:assert/strict';
import { normalizeTechnologyRecords } from '../core/taxonomy.js';
const data={categories:[{name:'Containers',tools:['Docker','Podman']},{name:'Kubernetes',tools:['Helm']}]};
const out=normalizeTechnologyRecords(data);
assert.ok(out.some(x=>x.name==='Docker'));
assert.ok(out.some(x=>x.name==='Helm'));
console.log('taxonomy tests passed');
