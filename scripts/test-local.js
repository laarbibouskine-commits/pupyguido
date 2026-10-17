// Local checks on dist/ (no network except source links)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), dist = path.join(root, 'dist');
let fail = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail++; };
const rd = p => fs.readFileSync(path.join(dist, p), 'utf8');
const pages = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'admin') walk(p); } else if (e.name.endsWith('.html')) pages.push(p); } })(dist);

// 1 internal links resolve
const missing = new Set();
for (const p of pages) {
  const h = fs.readFileSync(p, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  for (const m of h.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const u = m[1]; if (u.startsWith('/go/') || u.startsWith('/_vercel') || u === '/') continue;
    const f = path.join(dist, u);
    if (!(fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html'))))) missing.add(u);
  }
}
ok(missing.size === 0, 'internal links/assets resolve (' + pages.length + ' pages)' + (missing.size ? ' missing: ' + [...missing].slice(0, 8).join(', ') : ''));

// 2 shop: images unique, rels, labels, redirects
const shop = rd('shop/index.html');
const cards = [...shop.matchAll(/<article class="prod-card">[\s\S]*?<\/article>/g)].map(m => m[0]);
const imgs = cards.map(c => (c.match(/<img src="([^"]+)"/) || [])[1]);
const dup = imgs.filter((x, i) => imgs.indexOf(x) !== i);
ok(cards.length === 26, 'shop cards: ' + cards.length);
ok(new Set(imgs).size === imgs.length, 'shop images unique' + (dup.length ? ' (dupes: ' + [...new Set(dup)].join(', ') + ')' : ''));
const generic = imgs.filter(i => /^\/assets\/[a-z]+\.jpg$/.test(i));
ok(generic.length === 0, 'no generic site photos on shop cards' + (generic.length ? ': ' + generic.join(',') : ''));
const aff = [...shop.matchAll(/<a class="btn btn-gold" href="([^"]+)"([^>]*)>/g)].filter(m => /amazon|\/go\//.test(m[1]));
ok(aff.length === 25 && aff.every(m => m[2].includes('rel="sponsored nofollow noopener"')), 'all 25 affiliate buttons keep rel="sponsored nofollow noopener" (' + aff.length + ')');
ok(/See on Amazon/.test(shop) && /View on Temu/.test(shop) && !/See options on Amazon|>Buy here/.test(shop), 'new button labels');
ok(/As an Amazon Associate/.test(shop), 'affiliate disclosure present on shop');
const vj = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const src = new Set(vj.redirects.map(r => r.source));
const gos = [...new Set([...shop.matchAll(/href="(\/go\/[^"]+)"/g)].map(m => m[1]))];
ok(gos.every(g => src.has(g) || src.has(g.replace(/\/$/, ''))), 'every /go/ link has a redirect in vercel.json (' + gos.length + ')');

// 3 blog
const posts = fs.readdirSync(path.join(dist, 'blog')).filter(d => fs.existsSync(path.join(dist, 'blog', d, 'index.html')));
let pb = 0;
for (const d of posts) {
  const h = rd('blog/' + d + '/index.html');
  const good = /By <a href="\/how-we-write\/">the PuppyGuido editorial team<\/a>/.test(h) && /Last reviewed/.test(h) && /Sources and further reading/.test(h) && /"citation"/.test(h);
  const ld = [...h.matchAll(/ld\+json">([\s\S]*?)<\/script>/g)].every(m => { try { JSON.parse(m[1]); return true; } catch (e) { return false; } });
  if (!good || !ld) { pb++; console.log('  problem in', d, good, ld); }
}
ok(pb === 0, 'all ' + posts.length + ' posts: byline, reviewed date, sources, valid JSON-LD');

// 4 privacy/cookie alignment
const pv = rd('privacy/index.html');
for (const k of ['n8n.satinher.com', 'Supabase', 'Meta (Facebook) Pixel', 'Vercel Web Analytics', 'Google Fonts', 'OpenRouter', 'Gumroad', 'local storage', 'unsubscribe']) ok(pv.includes(k), 'privacy mentions: ' + k);
ok(!/Google Sheets|Google Drive/.test(pv), 'privacy no longer mentions Google Sheets / Drive');
const cj = rd('consent.js');
ok(/pg_consent/.test(cj) && /fbevents/.test(cj), 'consent.js loads Pixel only after consent');

// 5 signup forms
const home = rd('index.html');
ok(!/name="Full name"/.test(home) && /name="Email address"/.test(home), 'homepage form is email-only');
ok(/pupyguido-lead/.test(home), 'form posts to n8n lead webhook');

// 6 a11y / seo basics
ok(pages.every(p => /<html lang="en"/.test(fs.readFileSync(p, 'utf8'))), 'lang on all pages');
ok(/aria-current="page"/.test(shop) && /aria-current="page"/.test(rd('blog/index.html')), 'aria-current in nav');
ok(/<lastmod>/.test(rd('sitemap.xml')), 'sitemap lastmod');
process.exit(fail ? 1 : 0);
