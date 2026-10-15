// Shared SEO checker. Works in Node 18+ (global fetch) and is pasted into an n8n Code node (see seo-audit-n8n.txt).
const SITE = 'https://puppyguido.com';
async function get(url) {
  const r = await fetch(url, { redirect: 'follow' });
  return { status: r.status, text: await r.text() };
}
const strip = s => String(s || '').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
function analyze(url, html) {
  const issues = [];
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '';
  const t = strip(title);
  const desc = ((html.match(/<meta[^>]+name=["']description["'][^>]*content=(["'])([\s\S]*?)\1/i) || [])[2] || '').trim();
  const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) || [])[1] || '';
  const robots = (html.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '';
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const noAlt = imgs.filter(i => !/\balt=["'][^"']+["']/i.test(i) && !/\balt=["']["']/i.test(i)).length;
  const internal = (html.match(/href=["']\/[^"'#][^"']*["']/gi) || []).length;
  const words = strip((html.match(/<main[\s\S]*<\/main>|<article[\s\S]*<\/article>/i) || [html])[0]).split(' ').filter(Boolean).length;
  const isArticle = /\/blog\/[^/]+\/$/.test(url) && !/rss\.xml/.test(url);
  if (!t) issues.push('no title'); else if (t.length > 60) issues.push('title ' + t.length + ' chars (max 60)'); else if (t.length < 25) issues.push('title short (' + t.length + ')');
  if (!desc) issues.push('no meta description'); else if (desc.length > 160) issues.push('description ' + desc.length + ' chars (max 160)'); else if (desc.length < 90) issues.push('description short (' + desc.length + ')');
  if (!canon) issues.push('no canonical');
  if (h1 !== 1) issues.push('H1 count ' + h1);
  if (noAlt > 0) issues.push(noAlt + ' image(s) without alt');
  if (/noindex/i.test(robots)) issues.push('page is noindex');
  if (isArticle) {
    if (words < 700) issues.push('thin content (' + words + ' words)');
    if (internal < 6) issues.push('few internal links (' + internal + ')');
    if (!/application\/ld\+json/i.test(html)) issues.push('no structured data');
    if (!/signup|survival guide/i.test(html)) issues.push('no link to the free guide');
  }
  return { url, title: t, issues, words };
}
async function audit() {
  const sm = await get(SITE + '/sitemap.xml');
  const urls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  const results = [];
  for (const u of urls) {
    const r = await get(u);
    if (r.status !== 200) { results.push({ url: u, title: '', issues: ['HTTP ' + r.status], words: 0 }); continue; }
    results.push(analyze(u, r.text));
  }
  // duplicate titles
  const seen = {};
  for (const r of results) { if (r.title) (seen[r.title] = seen[r.title] || []).push(r); }
  for (const k of Object.keys(seen)) if (seen[k].length > 1) seen[k].forEach(r => r.issues.push('duplicate title'));
  const robots = await get(SITE + '/robots.txt');
  const global = [];
  if (!/sitemap:/i.test(robots.text)) global.push('robots.txt has no sitemap line');
  const bad = results.filter(r => r.issues.length);
  const score = Math.round(100 * (1 - bad.length / Math.max(1, results.length)));
  return { pages: results.length, score, bad, global };
}
function report(a) {
  let s = 'SEO audit ' + new Date().toISOString().slice(0, 10) + '\nPages: ' + a.pages + ' | clean pages: ' + a.score + '%\n';
  if (!a.bad.length && !a.global.length) return s + 'No issues found.';
  for (const g of a.global) s += '- ' + g + '\n';
  for (const r of a.bad.slice(0, 8)) s += '\n' + r.url.replace(SITE, '') + '\n  ' + r.issues.join('; ');
  if (a.bad.length > 8) s += '\n... and ' + (a.bad.length - 8) + ' more pages';
  return s;
}
module.exports = { audit, report, analyze };
if (require.main === module) audit().then(a => { console.log(report(a)); console.log('\nTOTAL pages with issues:', a.bad.length); });
