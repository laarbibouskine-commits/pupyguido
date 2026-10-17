const fs = require('fs'), path = require('path');
const f = path.join(__dirname, '..', 'build', 'build.js');
let b = fs.readFileSync(f, 'utf8');
if (b.includes('function withInlineGear')) { console.log('already'); process.exit(0); }
const fn = [
"// Inline affiliate links: first occurrence of an agreed phrase in running text (p/li only, never headings or existing links). Phrases come from content/gear.json -> inline.",
"function withInlineGear(html, p) {",
"  const rules = (GEAR.inline && GEAR.inline[p.slug]) || [];",
"  if (!rules.length) return { html, count: 0 };",
"  const todo = rules.map(([phrase, slug]) => ({ phrase, pick: products.find(x => x.slug === slug && !x.hidden && x.url), done: false })).filter(r => r.pick);",
"  const parts = html.split(/(<[^>]+>)/);",
"  let inA = 0, inH = 0, inBlock = 0, count = 0;",
"  for (let i = 0; i < parts.length; i++) {",
"    const t = parts[i];",
"    if (t.startsWith('<')) {",
"      if (/^<a[\s>]/i.test(t)) inA++; else if (/^<\/a>/i.test(t)) inA--;",
"      else if (/^<h[1-6][\s>]/i.test(t)) inH++; else if (/^<\/h[1-6]>/i.test(t)) inH--;",
"      else if (/^<(p|li)[\s>]/i.test(t)) inBlock++; else if (/^<\/(p|li)>/i.test(t)) inBlock--;",
"      continue;",
"    }",
"    if (inA > 0 || inH > 0 || inBlock <= 0 || !t.trim()) continue;",
"    for (const r of todo) {",
"      if (r.done) continue;",
"      const re = new RegExp('\\b' + r.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');",
"      const m = parts[i].match(re);",
"      if (!m) continue;",
"      const link = '<a href=\"' + esc(r.pick.url) + '\" target=\"_blank\" rel=\"sponsored nofollow noopener\">' + m[0] + '</a>';",
"      parts[i] = parts[i].slice(0, m.index) + link + parts[i].slice(m.index + m[0].length);",
"      r.done = true; count++;",
"      break;",
"    }",
"  }",
"  return { html: parts.join(''), count };",
"}",
""
].join('\n');
b = b.replace('function renderPost(p, all) {', fn + '\nfunction renderPost(p, all) {');
b = b.replace('${quickBox(p)}<div class="prose">${withMidAd(withMidImage(p.html, p))}${faqHtml(p)}</div>',
  '${quickBox(p)}${(() => { const g = withInlineGear(p.html, p); p._inline = g.count; p._html = g.html; return \'\'; })()}${p._inline ? \'<p class="aff-note"><b>Heads up.</b> Some links in this article are affiliate links. If you buy through them we may earn a commission at no extra cost to you. As an Amazon Associate we earn from qualifying purchases.</p>\' : \'\'}<div class="prose">${withMidAd(withMidImage(p._html, p))}${faqHtml(p)}</div>');
fs.writeFileSync(f, b);
console.log('patched');
