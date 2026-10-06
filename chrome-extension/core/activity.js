import {getAppData,saveAppData} from '../js/storage.js';
export async function logActivity(type,payload={}){const d=await getAppData();d.activity=[{id:`act-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,type,...payload,at:new Date().toISOString()},...d.activity].slice(0,500);await saveAppData(d);return d.activity[0];}
