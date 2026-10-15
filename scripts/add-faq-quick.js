const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const f = path.join(root, 'build', 'build.js');
let b = fs.readFileSync(f, 'utf8');
if (b.includes('function faqHtml(')) { console.log('already'); process.exit(0); }
const helpers = `
// Optional post fields: quick (short answer box), faq: [{q, a}] (rendered + FAQPage schema), updated (dateModified), author note.
function quickBox(p) {
  return p.quick ? '<aside class="quick-answer"><strong>Quick answer</strong><p>' + p.quick + '</p></aside>' : '';
}
function faqHtml(p) {
  if (!p.faq || !p.faq.length) return '';
  return '<h2 id="faq">Frequently asked questions</h2>' + p.faq.map(x => '<h3>' + esc(x.q) + '</h3><p>' + x.a + '</p>').join('');
}
function faqLd(p) {
  return { '@type': 'FAQPage', mainEntity: p.faq.map(x => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: String(x.a).replace(/<[^>]+>/g, '') } })) };
}
`;
let L = b.split('\n');
let i = L.findIndex(l => l.startsWith('function renderPost(p, all)'));
if (i < 0) { console.log('renderPost not found'); process.exit(1); }
L.splice(i, 0, ...helpers.split('\n'));
b = L.join('\n');
b = b.replace('dateModified: p.date', 'dateModified: p.updated || p.date');
L = b.split('\n');
const j = L.findIndex(l => l.startsWith('  const body = `<article class="post">'));
if (j < 0) { console.log('body not found'); process.exit(1); }
L.splice(j, 0, "  if (p.faq && p.faq.length) ld['@graph'].push(faqLd(p));");
const k = L.findIndex(l => l.startsWith('<div class="prose">${withMidAd(withMidImage(p.html, p))}</div>'));
if (k < 0) { console.log('prose not found'); process.exit(1); }
L[k] = '${quickBox(p)}<div class="prose">${withMidAd(withMidImage(p.html, p))}${faqHtml(p)}</div>';
fs.writeFileSync(f, L.join('\n'));
const css = path.join(root, 'site', 'styles.css');
let c = fs.readFileSync(css, 'utf8');
if (!c.includes('.quick-answer')) {
  c += '\n.quick-answer{background:#EAF3FF;border-left:6px solid var(--blue);border-radius:var(--r-md);padding:16px 20px;margin:0 0 26px}\n.quick-answer strong{color:var(--navy);text-transform:uppercase;letter-spacing:.08em;font-size:13px}\n.quick-answer p{margin:6px 0 0;font-size:17px}\n.prose h3{margin-top:22px}\n';
  fs.writeFileSync(css, c);
}
console.log('ok');
