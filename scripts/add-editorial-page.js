const fs = require('fs'), path = require('path');
const f = path.join(__dirname, '..', 'build', 'build.js');
let L = fs.readFileSync(f, 'utf8').split('\n');
if (L.some(l => l.includes("'how-we-write'"))) { console.log('already'); process.exit(0); }

const page = [
"  'how-we-write': () => layout({",
"    title: 'How We Write and Update Our Puppy Guides | PuppyGuido',",
"    description: 'How PuppyGuido researches, writes, checks and updates its puppy guides: positive methods, honest limits, clear sources and regular updates.',",
"    urlPath: '/how-we-write/',",
"    body: `${pageHero('Editorial standards', 'How we <span class=\"hl white\">write</span> our guides', 'What you can expect from every PuppyGuido article.')}",
"<section class=\"sec\"><div class=\"wrap narrow\"><div class=\"prose\">",
"<h2>Our promise</h2>",
"<p>PuppyGuido is written for first-time puppy parents in the US, UK, Australia and New Zealand. Every guide aims to be practical, kind to puppies and honest about what is normal and what needs a professional.</p>",
"<h2>How an article is made</h2>",
"<ol>",
"<li><strong>We start with real questions.</strong> We look at what new puppy owners actually ask: potty training, crying at night, biting, crates, routines.</li>",
"<li><strong>We draft with clear structure.</strong> A quick answer first, then step-by-step help, tables by age or time, and common mistakes. Some drafting is supported by software tools.</li>",
"<li><strong>We run an editorial checklist.</strong> Every guide is checked for positive, reward-based methods only, no punishment advice, no invented statistics or medical claims, and clear limits.</li>",
"<li><strong>We update.</strong> When we improve a guide, we show the update date at the top of the page.</li>",
"</ol>",
"<h2>What we do not do</h2>",
"<ul>",
"<li>We do not give veterinary diagnoses or medication advice. For health concerns, please contact your veterinarian.</li>",
"<li>We do not recommend punishment, scolding or aversive tools.</li>",
"<li>We do not accept payment to say a product is good.</li>",
"</ul>",
"<h2>Affiliate links</h2>",
"<p>Some pages include links to products on other stores, such as Amazon. If you buy through them we may earn a small commission at no extra cost to you. Products are chosen because they fit a real need in the guide. Always check that a product suits your puppy's size and age.</p>",
"<h2>Corrections and feedback</h2>",
"<p>If you spot a mistake or have a suggestion, write to <a href=\"mailto:${EMAIL}\">${EMAIL}</a>. We read every message.</p>",
"<p>General information only: our guides do not replace advice from a qualified veterinarian or professional trainer.</p>",
"<p><a class=\"btn btn-gold\" href=\"/#signup\">Get the free guide <svg class=\"ico\"><use href=\"#i-arrow\"/></svg></a></p>",
"</div></div></section>` }),",
""
];
const i = L.findIndex(l => l.startsWith('  contact: () => layout({'));
if (i < 0) { console.log('contact not found'); process.exit(1); }
L.splice(i, 0, ...page);
let b = L.join('\n');
// sitemap
b = b.replace("['/about/'], ['/contact/']", "['/about/'], ['/how-we-write/'], ['/contact/']");
// footer links (two footers)
b = b.split('<li><a href="/about/">About us</a></li>').join('<li><a href="/about/">About us</a></li><li><a href="/how-we-write/">How we write</a></li>');
// about page: link to editorial standards
b = b.replace('<li><strong>Honest about limits.</strong> We share general educational information. We do not replace your veterinarian or a professional trainer.</li>',
  '<li><strong>Honest about limits.</strong> We share general educational information. We do not replace your veterinarian or a professional trainer. Read <a href="/how-we-write/">how we write and update our guides</a>.</li>');
// author box in posts
b = b.replace('const disclaimer = `', "const authorBox = (p) => '<aside class=\"author-box\"><strong>Written by the PuppyGuido editorial team</strong><span>' + (p.updated ? 'Last updated ' + fmtDate(p.updated) : 'Published ' + fmtDate(p.date)) + ' &middot; <a href=\"/how-we-write/\">How we write and update our guides</a></span></aside>';\nconst disclaimer = `");
L = b.split('\n');
const k = L.findIndex(l => l.startsWith('${disclaimer}'));
if (k < 0) { console.log('disclaimer line not found'); process.exit(1); }
L.splice(k, 0, '${authorBox(p)}');
fs.writeFileSync(f, L.join('\n'));
const css = path.join(__dirname, '..', 'site', 'styles.css');
let c = fs.readFileSync(css, 'utf8');
if (!c.includes('.author-box')) {
  c += '\n.author-box{display:flex;flex-direction:column;gap:4px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:14px 2px;margin:26px 0;color:var(--muted);font-size:15px}\n.author-box strong{color:var(--navy)}\n.author-box a{color:var(--navy);text-decoration:underline}\n';
  fs.writeFileSync(css, c);
}
console.log('ok');
