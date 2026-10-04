import { getConfig } from './storage.js';

export function joinRaw(base, path) {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/')}`;
}

export async function fetchText(url, options = {}) {
  const response = await fetch(url, { cache: 'no-store', ...options });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return await response.text();
}

export async function fetchJson(url, options = {}) {
  const text = await fetchText(url, options);
  try { return JSON.parse(text); }
  catch { throw new Error(`Invalid JSON returned by ${url}`); }
}

export async function fetchRawFile(path) {
  const config = await getConfig();
  if (!config.rawBaseUrl) throw new Error('Raw GitHub base URL is not configured.');
  return fetchText(joinRaw(config.rawBaseUrl, path));
}

export async function checkEndpoint(url) {
  const started = performance.now();
  try {
    const response = await fetch(url, { method: 'GET', cache: 'no-store' });
    const ms = Math.round(performance.now() - started);
    return { ok: response.ok, status: response.status, ms, url };
  } catch (error) {
    return { ok: false, status: 0, ms: Math.round(performance.now() - started), url, error: error.message };
  }
}

export function parseGithubRepository(repositoryUrl = '') {
  const match = repositoryUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#]+?)(?:\.git)?\/?$/i);
  return match ? { owner: match[1], repo: match[2] } : null;
}

async function githubRequest(path, options = {}) {
  const config = await getConfig();
  if (!config.token) throw new Error('GitHub token is not configured.');
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${config.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {})
    }
  });
  const body = await response.text();
  let data;
  try { data = JSON.parse(body); } catch { data = body; }
  if (!response.ok) throw new Error(`${response.status}: ${data?.message || body}`);
  return data;
}

export async function githubGetFile(path) {
  const config = await getConfig();
  const repo = parseGithubRepository(config.repositoryUrl);
  if (!repo) throw new Error('Valid GitHub repository URL is required.');
  return githubRequest(`/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(config.branch)}`);
}

export async function githubPutFile(path, content, message, sha = undefined) {
  const config = await getConfig();
  const repo = parseGithubRepository(config.repositoryUrl);
  if (!repo) throw new Error('Valid GitHub repository URL is required.');
  const payload = { message, content: btoa(unescape(encodeURIComponent(content))), branch: config.branch };
  if (sha) payload.sha = sha;
  return githubRequest(`/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`, { method: 'PUT', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
}

export async function getRepoMetadata() {
  const config = await getConfig();
  const repo = parseGithubRepository(config.repositoryUrl);
  if (!repo) throw new Error('Repository URL is not configured.');
  const response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`, { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}
