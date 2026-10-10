// node scripts/test-admin.js  -> offline tests for api/admin.js (GitHub is mocked; no network, no secrets).
const crypto = require('crypto');
const assert = require('assert');

const PW = 'correct horse battery staple 42';
const salt = crypto.randomBytes(16);
const key = crypto.scryptSync(PW, salt, 32, { N: 16384, r: 8, p: 1 });
process.env.ADMIN_PASSWORD_HASH = 'scrypt$16384$' + salt.toString('base64') + '$' + key.toString('base64');
process.env.SESSION_SECRET = crypto.randomBytes(40).toString('base64url');
process.env.GITHUB_TOKEN = 'test-token';
process.env.GITHUB_REPO = 'o/r';

// ---- in-memory GitHub ----
const files = new Map();
let shaN = 0;
const commits = [];
const put = (p, text) => files.set(p, { text, sha: 'sha' + (++shaN) });
put('content/posts/draft-one.json', JSON.stringify({ draft: true, slug: 'draft-one', title: 'Draft one', description: 'd', category: 'Training', date: '2026-10-01', image: '/assets/night.jpg', imageAlt: 'x', html: '<p>x</p>' }));
put('content/posts/live-one.json', JSON.stringify({ draft: false, slug: 'live-one', title: 'Live one', description: 'd', category: 'Training', date: '2026-10-02', image: '/assets/night.jpg', imageAlt: 'x', html: '<p>x</p>' }));
files.set('site/assets/night.jpg', { text: '', sha: 'a' });
global.fetch = async (url, init = {}) => {
  const m = String(url).match(/api\.github\.com\/repos\/o\/r\/contents\/([^?]*)/);
  const p = decodeURIComponent(m[1]);
  const json = (status, data) => ({ status, ok: status < 300, json: async () => data });
  if ((init.method || 'GET') === 'GET') {
    if (files.has(p)) return json(200, { sha: files.get(p).sha, content: Buffer.from(files.get(p).text).toString('base64') });
    const kids = [...files.keys()].filter(k => k.startsWith(p + '/') && !k.slice(p.length + 1).includes('/'));
    if (kids.length) return json(200, kids.map(k => ({ type: 'file', name: k.split('/').pop(), path: k })));
    return json(404, { message: 'Not Found' });
  }
  const b = JSON.parse(init.body);
  const cur = files.get(p);
  if (cur && b.sha !== cur.sha) return json(409, { message: 'sha mismatch' });
  if (!cur && b.sha) return json(422, {});
  if (cur && !b.sha) return json(422, { message: 'exists' });
  const text = Buffer.from(b.content, 'base64').toString('utf8');
  put(p, text);
  commits.push({ p, msg: b.message, branch: b.branch, token: init.headers.Authorization });
  return json(200, { content: { sha: files.get(p).sha } });
};

const handler = require('../api/admin.js');
let ip = 0;
async function call(action, { method = 'GET', body, headers = {}, cookie, q = '' } = {}) {
  const req = { method, url: '/api/admin?action=' + action + q, query: Object.fromEntries(new URLSearchParams('action=' + action + q)), body, socket: { remoteAddress: '10.0.0.' + ip },
    headers: { host: 'admin.test', ...(method === 'POST' ? { origin: 'https://admin.test', 'x-requested-with': 'pg-admin' } : {}), ...(cookie ? { cookie } : {}), ...headers } };
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(t) { this.text = t; } };
  await handler(req, res);
  let data; try { data = JSON.parse(res.text); } catch (e) { data = res.text; }
  return { status: res.statusCode, data, headers: res.headers };
}
const longBody = '<h2>Heading</h2><p>' + 'puppy training words '.repeat(30) + '</p>';
const art = (o = {}) => ({ slug: 'new-article', title: 'New article', excerpt: 'Short.', seoTitle: 'New article SEO', metaDescription: 'A meta description.', category: 'Training', tags: ['puppy', 'Crate'], image: '/assets/night.jpg', imageAlt: 'A puppy', html: longBody, ...o });
let passed = 0;
const t = async (name, fn) => { await fn(); passed++; console.log('  ok  ' + name); };

(async () => {
  let cookie;
  await t('unauthenticated list is 401', async () => assert.strictEqual((await call('list')).status, 401));
  await t('session reports configured + unauthenticated', async () => { const r = await call('session'); assert.deepStrictEqual([r.data.configured, r.data.authenticated], [true, false]); });
  await t('login with wrong password fails', async () => assert.strictEqual((await call('login', { method: 'POST', body: { password: 'nope' } })).status, 401));
  await t('login without CSRF header is blocked', async () => assert.strictEqual((await call('login', { method: 'POST', body: { password: PW }, headers: { 'x-requested-with': '' } })).status, 403));
  await t('login from another origin is blocked', async () => assert.strictEqual((await call('login', { method: 'POST', body: { password: PW }, headers: { origin: 'https://evil.test' } })).status, 403));
  await t('lockout after 5 wrong attempts', async () => {
    ip = 7; let last;
    for (let i = 0; i < 6; i++) last = await call('login', { method: 'POST', body: { password: 'bad' + i } });
    assert.strictEqual(last.status, 429);
    ip = 0;
  });
  await t('login succeeds and sets a hardened cookie', async () => {
    const r = await call('login', { method: 'POST', body: { password: PW } });
    assert.strictEqual(r.status, 200);
    const c = r.headers['Set-Cookie'];
    assert.ok(/HttpOnly/.test(c) && /Secure/.test(c) && /SameSite=Strict/.test(c) && /Path=\/api\/admin/.test(c));
    cookie = c.split(';')[0];
  });
  await t('forged cookie is rejected', async () => assert.strictEqual((await call('list', { cookie: 'pg_admin=abc.def' })).status, 401));
  await t('list shows drafts, live and legacy articles', async () => {
    const r = await call('list', { cookie });
    const st = Object.fromEntries(r.data.articles.map(a => [a.slug, a.state]));
    assert.strictEqual(st['draft-one'], 'draft'); assert.strictEqual(st['live-one'], 'published'); assert.strictEqual(st['new-puppy-checklist'], 'legacy');
  });
  await t('validation: bad slug/title/image/body are rejected with messages', async () => {
    const r = await call('save', { method: 'POST', cookie, body: { article: art({ slug: 'bad-article', title: '', image: 'http://x/y.gif', html: '<p>short</p>', category: 'Nope' }) } });
    assert.strictEqual(r.status, 422);
    assert.ok(r.data.errors.length >= 4);
  });
  let sha;
  await t('save creates a DRAFT (draft:true), tags normalised, commit on configured branch', async () => {
    const r = await call('save', { method: 'POST', cookie, body: { article: art() } });
    assert.strictEqual(r.status, 200); assert.strictEqual(r.data.state, 'draft'); sha = r.data.sha;
    const f = JSON.parse(files.get('content/posts/new-article.json').text);
    assert.strictEqual(f.draft, true); assert.deepStrictEqual(f.tags, ['puppy', 'crate']); assert.ok(f.readMinutes >= 1);
    const c = commits[commits.length - 1]; assert.strictEqual(c.branch, 'main'); assert.ok(/Bearer test-token/.test(c.token));
  });
  await t('duplicate slug on create is refused', async () => assert.strictEqual((await call('save', { method: 'POST', cookie, body: { article: art() } })).status, 409));
  await t('legacy slug cannot be overwritten without copy flag', async () => assert.strictEqual((await call('save', { method: 'POST', cookie, body: { article: art({ slug: 'new-puppy-checklist' }) } })).status, 409));
  await t('legacy copy is saved as a hidden draft', async () => {
    const r = await call('save', { method: 'POST', cookie, body: { fromLegacy: true, article: art({ slug: 'new-puppy-checklist' }) } });
    assert.strictEqual(r.status, 200); assert.strictEqual(JSON.parse(files.get('content/posts/new-puppy-checklist.json').text).draft, true);
  });
  await t('update with stale sha is refused', async () => assert.strictEqual((await call('save', { method: 'POST', cookie, body: { sha: 'stale', article: art() } })).status, 409));
  await t('save cannot touch a live article', async () => assert.strictEqual((await call('save', { method: 'POST', cookie, body: { sha: files.get('content/posts/live-one.json').sha, article: art({ slug: 'live-one' }) } })).status, 409));
  await t('publish without confirmation is refused', async () => assert.strictEqual((await call('publish', { method: 'POST', cookie, body: { article: art(), sha, password: PW } })).status, 400));
  await t('publish with wrong password is refused and writes nothing', async () => {
    const before = commits.length;
    const r = await call('publish', { method: 'POST', cookie, body: { article: art(), sha, confirm: 'new-article', password: 'wrong' } });
    assert.strictEqual(r.status, 401); assert.strictEqual(commits.length, before);
    assert.strictEqual(JSON.parse(files.get('content/posts/new-article.json').text).draft, true);
  });
  await t('publish with confirmation + password sets draft:false', async () => {
    const r = await call('publish', { method: 'POST', cookie, body: { article: art(), sha, confirm: 'new-article', password: PW } });
    assert.strictEqual(r.status, 200); assert.strictEqual(r.data.state, 'published');
    assert.strictEqual(JSON.parse(files.get('content/posts/new-article.json').text).draft, false);
    sha = r.data.sha;
  });
  await t('unpublish needs confirmation + password and sets draft:true', async () => {
    assert.strictEqual((await call('unpublish', { method: 'POST', cookie, body: { slug: 'new-article', confirm: 'x', password: PW } })).status, 400);
    const r = await call('unpublish', { method: 'POST', cookie, body: { slug: 'new-article', confirm: 'new-article', password: PW, sha } });
    assert.strictEqual(r.status, 200); assert.strictEqual(JSON.parse(files.get('content/posts/new-article.json').text).draft, true);
  });
  await t('HTML is sanitised (script, handlers, javascript: links)', async () => {
    const r = await call('save', { method: 'POST', cookie, body: { article: art({ slug: 'xss-test', html: longBody + '<script>alert(1)</script><img src="/assets/a.jpg" onerror="alert(1)"><a href="javascript:alert(1)" onclick="x()">bad</a><iframe src="//e"></iframe><p onmouseover="x">ok</p>' }) } });
    assert.strictEqual(r.status, 200);
    const h = JSON.parse(files.get('content/posts/xss-test.json').text).html;
    assert.ok(!/script|onerror|onclick|onmouseover|javascript:|iframe/i.test(h), h);
  });
  await t('upload rejects non-images and oversize files', async () => {
    assert.strictEqual((await call('upload', { method: 'POST', cookie, body: { filename: 'a.jpg', data: Buffer.from('<?php echo 1;').toString('base64') } })).status, 415);
    assert.strictEqual((await call('upload', { method: 'POST', cookie, body: { filename: 'big.jpg', data: Buffer.alloc(3 * 1024 * 1024, 1).toString('base64') } })).status, 413);
  });
  await t('upload stores a real JPEG under site/assets/uploads', async () => {
    const jpg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(200, 1)]);
    const r = await call('upload', { method: 'POST', cookie, body: { filename: 'My Puppy Photo.PNG', data: jpg.toString('base64') } });
    assert.strictEqual(r.status, 200); assert.ok(/^\/assets\/uploads\/my-puppy-photo-[a-z0-9]+\.jpg$/.test(r.data.path), r.data.path);
    assert.ok(files.has('site' + r.data.path));
  });
  await t('images list includes uploaded and existing assets', async () => {
    const r = await call('images', { cookie });
    assert.ok(r.data.images.includes('/assets/night.jpg') && r.data.images.some(p => p.startsWith('/assets/uploads/')));
  });
  await t('preview renders the real article layout with noindex + banner', async () => {
    const r = await call('preview', { method: 'POST', cookie, body: { article: JSON.stringify(art({ title: 'Preview Title' })) } });
    assert.strictEqual(r.status, 200); assert.ok(typeof r.data === 'string' && /Preview Title/.test(r.data) && /noindex/.test(r.data) && /PREVIEW/.test(r.data));
  });
  await t('preview form post from another origin is blocked', async () => assert.strictEqual((await call('preview', { method: 'POST', cookie, headers: { origin: 'https://evil.test' }, body: { article: '{}' } })).status, 403));
  console.log('\n' + passed + ' tests passed');
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
