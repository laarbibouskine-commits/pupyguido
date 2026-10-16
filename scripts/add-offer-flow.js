const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
fs.writeFileSync(path.join(root, 'content', 'offers.json'), JSON.stringify({
  starterKit: { price: '17', checkoutUrl: '' },
  bundle: { price: '22', checkoutUrl: '' },
  playbook: { price: '37', salePrice: '27', checkoutUrl: '', saleCheckoutUrl: '' }
}, null, 2) + '\n');

const f = path.join(root, 'build', 'build.js');
let b = fs.readFileSync(f, 'utf8');
if (b.includes("'thank-you-kit'")) { console.log('already'); process.exit(0); }

// 1) landing page: two offer cards instead of one button
const oldHead = "const OFF = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'offers.json'), 'utf8')).starterKit; const buy = OFF.checkoutUrl";
if (!b.includes(oldHead)) { console.log('landing head not found'); process.exit(1); }
b = b.replace(oldHead, "const ALL = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'offers.json'), 'utf8')); const OFF = ALL.starterKit; const BUN = ALL.bundle; const btn = (o, label) => o.checkoutUrl ? `<a class=\"btn btn-gold\" href=\"${o.checkoutUrl}\">${label} ${arrow}</a>` : `<a class=\"btn btn-gold\" href=\"/#signup\">Opening very soon - get the free guide ${arrow}</a>`; const cards = `<div class=\"lp-offers\"><div class=\"lp-offer\"><div class=\"lp-offer-t\">Starter Kit</div><div class=\"lp-offer-p\">$${OFF.price}</div><p>30-day plan, potty schedule, crate checklist, first week checklist, shopping list, vet checklist.</p>${btn(OFF, 'Get the Kit')}</div><div class=\"lp-offer best\"><div class=\"lp-badge\">Most popular</div><div class=\"lp-offer-t\">Kit + Health Tracker</div><div class=\"lp-offer-p\">$${BUN.price}</div><p>Everything in the Kit plus the Puppy Health Tracker: vaccine log, weight log, vet visit notes.</p>${btn(BUN, 'Get the bundle')}</div></div>`; const buy = OFF.checkoutUrl");
b = b.replace('<p class="lp-cta">${buy}</p>\n<p class="lp-fine">Instant PDF download', '${cards}\n<p class="lp-fine">Instant PDF download');

// 2) thank-you page with the Playbook offer
const ty = [
"  'thank-you-kit': () => { const PB = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'offers.json'), 'utf8')).playbook; const pbBtn = PB.saleCheckoutUrl ? `<a class=\"btn btn-gold\" href=\"${PB.saleCheckoutUrl}\">Yes, add the Playbook for $${PB.salePrice} ${arrow}</a>` : `<a class=\"btn btn-gold\" href=\"/blog/\">Read our free guides ${arrow}</a>`; return layout({",
"    title: 'Thank you | PuppyGuido', description: 'Thank you for your order.', urlPath: '/thank-you-kit/', noindex: true,",
"    body: `${pageHero('Thank you', 'Your kit is <span class=\"hl white\">on its way</span>', 'Check your email for the download link. It can take a minute.')}",
"<section class=\"sec\"><div class=\"wrap narrow\"><div class=\"prose\">",
"<h2>Before you go: one special offer</h2>",
"<p>New customers can add <strong>The Puppy Training Playbook</strong> for <strong>$${PB.salePrice}</strong> instead of $${PB.price}. This price is only for people who just ordered the kit.</p>",
"<ul><li>How puppies learn, and a daily routine that works</li><li>Potty training, crate and alone time, biting, sleep</li><li>Socialization and 8 first cues, step by step</li><li>A 12-week roadmap, 20 brain games, cue cards and trackers</li><li>A gear guide: budget, best value and premium picks</li></ul>",
"<p class=\"lp-cta\">${pbBtn}</p>",
"<p class=\"lp-fine\">32-page PDF &middot; instant download &middot; 30-day money-back guarantee. Not now? No problem, your kit is already yours.</p>",
"<h2>Helpful gear for week one</h2>",
"<ul><li><a href=\"/shop/\">See our recommended puppy gear</a></li><li><a href=\"/blog/puppy-first-night-home/\">Read: your puppy's first night home</a></li><li><a href=\"/blog/puppy-potty-training-schedule/\">Read: potty training schedule by age</a></li></ul>",
"</div></div></section>` }); },",
""
];
const i = b.split('\n').findIndex(l => l.startsWith('  contact: () => layout({'));
const L = b.split('\n');
L.splice(i, 0, ...ty);
fs.writeFileSync(f, L.join('\n'));

// 3) css
const css = path.join(root, 'site', 'styles.css');
let c = fs.readFileSync(css, 'utf8');
if (!c.includes('.lp-offers')) {
  c += `
.lp-offers{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:22px 0 10px}
.lp-offer{position:relative;background:#fff;color:var(--navy);border-radius:18px;padding:18px;box-shadow:0 10px 30px rgba(0,0,0,.18)}
.lp-offer.best{outline:3px solid var(--gold)}
.lp-badge{position:absolute;top:-12px;right:14px;background:var(--gold);color:var(--navy);font-weight:800;font-size:12px;border-radius:999px;padding:4px 10px}
.lp-offer-t{font-weight:800;font-size:18px}
.lp-offer-p{font-size:34px;font-weight:900;margin:2px 0 6px}
.lp-offer p{font-size:14px;color:var(--muted);margin:0 0 12px}
.lp-offer .btn{width:100%;justify-content:center;font-size:15px;padding:12px 14px}
@media(max-width:760px){.lp-offers{grid-template-columns:minmax(0,1fr)}}
`;
  fs.writeFileSync(css, c);
}
console.log('ok');
