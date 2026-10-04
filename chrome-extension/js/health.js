async function checkEndpoint(name, url) {
  if (!url) return {name, ok:false, detail:"Not configured"};
  const started = performance.now();
  try {
    const r = await fetch(url, {method:"GET", cache:"no-store"});
    return {name, ok:r.ok, status:r.status, ms:Math.round(performance.now()-started), detail:r.ok ? "Available" : `HTTP ${r.status}`};
  } catch (e) {
    return {name, ok:false, ms:Math.round(performance.now()-started), detail:e.message};
  }
}
async function runHealthCheck() {
  const cfg = await getConfig();
  const checks = [];
  checks.push(await checkEndpoint("Raw index.html", cfg.indexUrl || buildRawUrl(cfg,"index.html")));
  checks.push(await checkEndpoint("Bookmark database", buildRawUrl(cfg,cfg.bookmarkPath)));
  checks.push(await checkEndpoint("Categories database", buildRawUrl(cfg,cfg.categoriesPath)));
  checks.push(await checkEndpoint("Tags database", buildRawUrl(cfg,cfg.tagsPath)));
  if (cfg.repoUrl) checks.push(await checkEndpoint("GitHub repository", cfg.repoUrl));
  if (cfg.resourceDataUrl) checks.push(await checkEndpoint("Resource database", cfg.resourceDataUrl));
  const result = {ok:checks.length > 0 && checks.every(c=>c.ok), checkedAt:new Date().toISOString(), checks};
  await saveHealth(result);
  return result;
}