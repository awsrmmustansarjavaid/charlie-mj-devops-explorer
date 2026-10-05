import { getConfig } from '../../js/storage.js';

const message=document.querySelector('#message');
const openDirect=document.querySelector('#openDirect');
const openSettings=document.querySelector('#openSettings');

async function init(){
  const config=await getConfig();
  openSettings.onclick=()=>location.href=chrome.runtime.getURL('pages/dashboard/dashboard.html#settings');
  openDirect.onclick=()=>{if(config.rawIndexUrl)location.href=config.rawIndexUrl;};
  if(!config.rawIndexUrl){message.textContent='Configure the Raw index URL in Settings first.';openDirect.disabled=true;return;}
  message.textContent=`Raw index: ${config.rawIndexUrl}`;
  location.replace(config.rawIndexUrl);
}

init().catch(error=>{message.textContent=`Launcher failed: ${error.message}`;});
