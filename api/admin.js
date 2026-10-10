// PuppyGuido admin API (single Vercel function). Articles live in GitHub (content/posts/*.json); this function
// reads/writes them server-side with GITHUB_TOKEN. Drafts are the default; publishing needs a typed confirmation
// AND the admin password again. Required env: ADMIN_PASSWORD_HASH, SESSION_SECRET, GITHUB_TOKEN
// (optional: GITHUB_REPO, GITHUB_BRANCH). See docs/admin-dashboard.md.
const auth = require('./_lib/auth');
const gh = require('./_lib/github');
const { validateArticle, toFile, sanitizeHtml, CATEGORIES, SLUG_RE } = require('./_lib/content');

const POSTS_DIR = 'content/posts';
const UPLOAD_DIR = 'site/assets/uploads';
const MAX_IMG = 2 * 1024 * 1024;

function send(res, status, obj, extraHeaders) {
  res.statusCode = status;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  for (const [k, v] of Object.entries(extraHeaders || {})) res.setHeader(k, v);
  if (typeof obj === 'string') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(obj); return; }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(obj));
}
const legacyPosts = () => { try { return require('../build/posts.js'); } catch (e) { return []; } };
const pathFor = slug => `${POSTS_DIR}/${slug}.json`;

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  try { return new URL(origin).host === host; } catch (e) { return false; }
}
function articleView(p, extra) {
  return { slug: p.slug, title: p.title || '', excerpt: p.excerpt || '', seoTitle: p.seoTitle || '', metaDescription: p.description || '', category: p.category || '', tags: p.tags || [], image: p.image || '', imageAlt: p.imageAlt || '', html: p.html || '', date: p.date || '', ...extra };
}
function magicExt(buf) {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return '.jpg';
  if (buf.length > 8 && buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return '.png';
  if (buf.length > 12 && buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return '.webp';
  return null;
}
async function recheckPassword(body) {
  return !!(body && typeof body.password === 'string' && await auth.verifyPassword(body.password));
}

async function listArticles() {
  const files = (await gh.listDir(POSTS_DIR)).filter(f => f.type === 'file' && f.name.endsWith('.json'));
  const loaded = await Promise.all(files.map(async f => {
    try { const x = await gh.getFile(f.path); return { name: f.name, sha: x.sha, data: JSON.parse(x.text) }; } catch (e) { return null; }
  }));
  const out = [];
  const bySlug = new Set();
  for (const x of loaded) {
    if (!x || !x.data || !x.data.slug) continue;
    bySlug.add(x.data.slug);
    out.push({ slug: x.data.slug, title: x.data.title || '', category: x.data.category || '', date: x.data.date || '', state: x.data.draft === false ? 'published' : 'draft', sha: x.sha });
  }
  for (const p of legacyPosts()) if (!bySlug.has(p.slug) && p.draft !== true) out.push({ slug: p.slug, title: p.title, category: p.category, date: p.date, state: 'legacy', sha: null });
  return out.sort((a, b) => String(b.date).localeCompare(String(a.date)) || a.slug.localeCompare(b.slug));
}

async function saveArticle(body, { publish }) {
  const input = body.article || {};
  const slug = String(input.slug || '').toLowerCase();
  if (!SLUG_RE.test(slug)) return [422, { errors: ['Invalid slug.'] }];
  const existing = await gh.getFile(pathFor(slug));
  let prev = null;
  if (existing) { try { prev = JSON.parse(existing.text); } catch (e) { return [500, { error: 'Existing file is not valid JSON.' }]; } }
  const isLegacy = legacyPosts().some(p => p.slug === slug);
  if (!existing && isLegacy && body.fromLegacy !== true) return [409, { error: 'This slug belongs to an existing published article. Open it from the list to edit a copy.' }];
  if (prev && prev.draft === false && !publish) return [409, { error: 'This article is live. Use "Update live article" (needs confirmation).' }];
  if (existing && body.sha && body.sha !== existing.sha) return [409, { error: 'The article changed elsewhere. Reload it and try again.' }];
  if (existing && !body.sha) return [409, { error: 'Slug already exists. Open the existing article to edit it.' }];
  const v = validateArticle({ ...input, slug }, prev);
  if (!v.ok) return [422, { errors: v.errors }];
  const msg = publish ? `Dashboard: PUBLISH ${slug}` : `Dashboard: save draft ${slug}`;
  const r = await gh.putFile(pathFor(slug), Buffer.from(toFile(v.article, !publish)), msg, existing ? existing.sha : undefined);
  return [200, { ok: true, slug, sha: r.sha, state: publish ? 'published' : 'draft', note: publish ? 'Committed to the live branch; the site rebuilds in about a minute.' : 'Draft saved. It is not visible on the website.' }];
}

module.exports = async function handler(req, res) {
  try {
    const q = req.query || Object.fromEntries(new URL(req.url, 'http://x').searchParams);
    const action = String(q.action || '');
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const post = req.method === 'POST';

    if (action === 'session') return send(res, 200, { configured: auth.configured(), authenticated: !!auth.readSession(req), categories: CATEGORIES });
    if (!auth.configured()) return send(res, 503, { error: 'Admin is not configured (missing environment variables).' });

    if (post) {
      // Preview is a plain form POST (opens in a new tab); everything else must be a fetch with our custom header.
      const headerOk = action === 'preview' || req.headers['x-requested-with'] === 'pg-admin';
      if (!headerOk || !sameOrigin(req)) return send(res, 403, { error: 'Blocked (origin check).' });
    }
    if (action === 'login') {
      if (!post) return send(res, 405, { error: 'POST only' });
      if (auth.locked(req)) return send(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' });
      const ok = await auth.verifyPassword(body.password);
      if (!ok) { auth.recordFailure(req); await auth.sleep(800); return send(res, 401, { error: 'Wrong password.' }); }
      auth.clearFailures(req);
      return send(res, 200, { ok: true }, { 'Set-Cookie': auth.sessionCookie() });
    }
    if (action === 'logout') return send(res, 200, { ok: true }, { 'Set-Cookie': auth.clearCookie() });

    if (!auth.readSession(req)) return send(res, 401, { error: 'Not signed in.' });
    if (!process.env.GITHUB_TOKEN) return send(res, 503, { error: 'GITHUB_TOKEN is not configured.' });

    if (action === 'list' && !post) return send(res, 200, { articles: await listArticles() });

    if (action === 'get' && !post) {
      const slug = String(q.slug || '').toLowerCase();
      if (!SLUG_RE.test(slug)) return send(res, 400, { error: 'Invalid slug.' });
      const f = await gh.getFile(pathFor(slug));
      if (f) { const d = JSON.parse(f.text); return send(res, 200, { article: articleView(d, { state: d.draft === false ? 'published' : 'draft', sha: f.sha }) }); }
      const l = legacyPosts().find(p => p.slug === slug);
      if (l) return send(res, 200, { article: articleView(l, { state: 'legacy', sha: null }) });
      return send(res, 404, { error: 'Not found.' });
    }

    if (action === 'images' && !post) {
      const isImg = n => /\.(jpe?g|png|webp)$/i.test(n);
      const [top, up] = await Promise.all([gh.listDir('site/assets'), gh.listDir(UPLOAD_DIR)]);
      const imgs = [...top.filter(f => f.type === 'file' && isImg(f.name) && !/^(icon|apple|og-|mascot)/.test(f.name)).map(f => '/assets/' + f.name),
        ...up.filter(f => f.type === 'file' && isImg(f.name)).map(f => '/assets/uploads/' + f.name)];
      return send(res, 200, { images: imgs });
    }

    if (action === 'save' && post) { const [s, o] = await saveArticle(body, { publish: false }); return send(res, s, o); }

    if (action === 'publish' && post) {
      const slug = String((body.article && body.article.slug) || '').toLowerCase();
      if (body.confirm !== slug || !slug) return send(res, 400, { error: 'Type the article slug exactly to confirm.' });
      if (!await recheckPassword(body)) { await auth.sleep(800); return send(res, 401, { error: 'Password check failed.' }); }
      const [s, o] = await saveArticle(body, { publish: true });
      return send(res, s, o);
    }

    if (action === 'unpublish' && post) {
      const slug = String(body.slug || '').toLowerCase();
      if (!SLUG_RE.test(slug) || body.confirm !== slug) return send(res, 400, { error: 'Type the article slug exactly to confirm.' });
      if (!await recheckPassword(body)) { await auth.sleep(800); return send(res, 401, { error: 'Password check failed.' }); }
      const f = await gh.getFile(pathFor(slug));
      if (!f) return send(res, 404, { error: 'Only dashboard-managed articles can be unpublished.' });
      if (body.sha && body.sha !== f.sha) return send(res, 409, { error: 'The article changed elsewhere. Reload and try again.' });
      const d = JSON.parse(f.text);
      d.draft = true;
      const r = await gh.putFile(pathFor(slug), Buffer.from(JSON.stringify(d, null, 2) + '\n'), `Dashboard: unpublish ${slug}`, f.sha);
      return send(res, 200, { ok: true, slug, sha: r.sha, state: 'draft' });
    }

    if (action === 'upload' && post) {
      const b64 = String(body.data || '').replace(/^data:[^,]*,/, '');
      if (!b64 || b64.length > Math.ceil(MAX_IMG * 4 / 3) + 16) return send(res, 413, { error: 'Image is too large (max 2 MB).' });
      const buf = Buffer.from(b64, 'base64');
      if (buf.length === 0 || buf.length > MAX_IMG) return send(res, 413, { error: 'Image is too large (max 2 MB).' });
      const ext = magicExt(buf);
      if (!ext) return send(res, 415, { error: 'Only real JPG, PNG or WebP images are allowed.' });
      const base = String(body.filename || 'image').toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'image';
      const name = `${base}-${Date.now().toString(36)}${ext}`;
      await gh.putFile(`${UPLOAD_DIR}/${name}`, buf, `Dashboard: upload image ${name}`);
      return send(res, 200, { ok: true, path: '/assets/uploads/' + name, note: 'Available on the website after the next site build (about a minute).' });
    }

    if (action === 'preview' && post) {
      let a = body.article || {};
      if (typeof a === 'string') { try { a = JSON.parse(a); } catch (e) { a = {}; } }
      const p = {
        slug: String(a.slug || 'preview'), title: String(a.title || 'Untitled'), description: String(a.metaDescription || a.excerpt || ''),
        category: CATEGORIES.includes(a.category) ? a.category : 'Training', date: new Date().toISOString().slice(0, 10),
        readMinutes: 5, image: /^\/assets\/[A-Za-z0-9._\/-]+$/.test(String(a.image || '')) ? a.image : '/assets/hero.jpg',
        imageAlt: String(a.imageAlt || ''), html: sanitizeHtml(a.html)
      };
      const { renderPost } = require('../build/build.js');
      let html = renderPost(p, []);
      html = html.replace('<head>', '<head><meta name="robots" content="noindex,nofollow">').replace(/<body[^>]*>/, m => m + '<div style="background:#E3AA0C;color:#0B1F44;font:700 14px system-ui;padding:8px 14px;text-align:center">PREVIEW - not published</div>');
      return send(res, 200, html);
    }

    return send(res, 404, { error: 'Unknown action.' });
  } catch (e) {
    if (e && e.conflict) return send(res, 409, { error: 'Conflict: the file already exists or changed elsewhere. Reload and try again.' });
    return send(res, 500, { error: 'Server error.' });
  }
};
