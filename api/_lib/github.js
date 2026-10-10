// Minimal GitHub Contents API client. The token stays server-side (env GITHUB_TOKEN), never sent to the browser.
const REPO = () => process.env.GITHUB_REPO || 'laarbibouskine-commits/pupyguido';
const BRANCH = () => process.env.GITHUB_BRANCH || 'main';

async function gh(method, path, body) {
  const res = await fetch('https://api.github.com/repos/' + REPO() + path, {
    method,
    headers: {
      Authorization: 'Bearer ' + process.env.GITHUB_TOKEN,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'puppyguido-admin',
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  let data = null;
  try { data = await res.json(); } catch (e) { /* empty body */ }
  return { status: res.status, ok: res.ok, data };
}

const enc = p => p.split('/').map(encodeURIComponent).join('/');

async function listDir(dir) {
  const r = await gh('GET', `/contents/${enc(dir)}?ref=${encodeURIComponent(BRANCH())}`);
  if (r.status === 404) return [];
  if (!r.ok) throw new Error('GitHub list failed (' + r.status + ')');
  return Array.isArray(r.data) ? r.data : [];
}
async function getFile(path) {
  const r = await gh('GET', `/contents/${enc(path)}?ref=${encodeURIComponent(BRANCH())}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('GitHub read failed (' + r.status + ')');
  const d = r.data;
  return { sha: d.sha, text: Buffer.from(d.content || '', 'base64').toString('utf8') };
}
// sha omitted => create (fails if the file exists); sha given => update (fails if changed meanwhile).
async function putFile(path, contentBuf, message, sha) {
  const r = await gh('PUT', `/contents/${enc(path)}`, { message, content: Buffer.from(contentBuf).toString('base64'), branch: BRANCH(), ...(sha ? { sha } : {}) });
  if (r.status === 409 || r.status === 422) { const e = new Error('conflict'); e.conflict = true; throw e; }
  if (!r.ok) throw new Error('GitHub write failed (' + r.status + ')');
  return { sha: r.data && r.data.content && r.data.content.sha };
}

module.exports = { listDir, getFile, putFile };
