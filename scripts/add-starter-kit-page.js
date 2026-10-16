const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
fs.writeFileSync(path.join(root, 'content', 'offers.json'), JSON.stringify({
  starterKit: { price: '17', checkoutUrl: '' }
}, null, 2) + '\n');

const f = path.join(root, 'build', 'build.js');
let L = fs.readFileSync(f, 'utf8').split('\n');
if (L.some(l => l.includes("'starter-kit'"))) { console.log('already'); process.exit(0); }

const page = [
"  'starter-kit': () => { const OFF = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'offers.json'), 'utf8')).starterKit; const buy = OFF.checkoutUrl ? `<a class=\"btn btn-gold\" href=\"${OFF.checkoutUrl}\">Get the Starter Kit - $${OFF.price} ${arrow}</a>` : `<a class=\"btn btn-gold\" href=\"/#signup\">Opening very soon - get the free guide ${arrow}</a>`; return layout({",
"    title: 'New Puppy Starter Kit: Your Puppy\\'s First 30 Days | PuppyGuido',",
"    description: 'A printable 30-day plan, potty schedule, crate checklist, first-week checklist and shopping list for first-time puppy parents. Instant download.',",
"    urlPath: '/starter-kit/', noindex: true,",
"    body: `<section class=\"lp-hero\"><div class=\"wrap lp-grid\"><div>",
"<span class=\"eyebrow\"><svg class=\"ico fill\"><use href=\"#i-paw\"/></svg> For first-time puppy parents</span>",
"<h1>Your puppy's first 30 days, <span class=\"hl\">planned day by day</span></h1>",
"<p class=\"lead\">A printable plan with potty schedule, crate checklist, first-week checklist and shopping list. Stop guessing. Know what to do today, tomorrow and next week.</p>",
"<p class=\"lp-cta\">${buy}</p>",
"<p class=\"lp-fine\">Instant PDF download &middot; US Letter and A4 friendly &middot; 30-day money-back guarantee</p></div>",
"<div class=\"lp-card\" aria-hidden=\"true\"><img src=\"/assets/mascot.png\" alt=\"\" width=\"120\" height=\"120\"><div class=\"lp-card-k\">New Puppy Starter Kit</div><div class=\"lp-card-t\">Your puppy's first 30 days</div><div class=\"lp-card-p\">$${OFF.price}</div></div></div></section>",
"<section class=\"sec\"><div class=\"wrap narrow\"><div class=\"prose\">",
"<h2>Sound familiar?</h2><ul><li>Your puppy cries at night and you do not know what to do.</li><li>Accidents in the house, again.</li><li>You read 20 articles and now you are more confused.</li><li>You want a clear plan you can stick on the fridge.</li></ul>",
"<h2>What you get</h2><ul>",
"<li><strong>30-day plan.</strong> One simple focus for every day, in four weekly pages with check boxes.</li>",
"<li><strong>Potty schedule by age</strong> with a sample day and a weekly log.</li>",
"<li><strong>Crate training checklist</strong> with 7 calm steps and crate time by age.</li>",
"<li><strong>First week day-by-day checklist</strong> plus a night routine.</li>",
"<li><strong>Shopping list and puppy-proofing walk-through.</strong> Must-have and nice-to-have.</li>",
"<li><strong>First vet visit checklist</strong> with space for your questions.</li></ul>",
"<p class=\"lp-cta\">${buy}</p>",
"<h2>How it works</h2><ol><li>Download the PDF right after checkout.</li><li>Print the pages you need, or use it on a tablet.</li><li>Follow one small step a day. Tick it off.</li></ol>",
"<h2>Who it is for</h2><p>First-time puppy parents with a puppy of about 8 weeks to 6 months, in the US, UK, Australia and New Zealand. All methods are positive and reward-based.</p>",
"<h2>30-day money-back guarantee</h2><p>If the kit is not useful to you, email <a href=\"mailto:${EMAIL}\">${EMAIL}</a> within 30 days and we will refund you.</p>",
"<h2>Questions</h2>",
"<h3>Is this a physical product?</h3><p>No. It is a digital PDF you download and print yourself.</p>",
"<h3>Does it work for any breed?</h3><p>Yes. The plan is general. Every puppy learns at their own speed, so adjust the days to your puppy.</p>",
"<h3>Is this veterinary advice?</h3><p>No. It is general educational information. Please ask your vet about health, vaccines and food.</p>",
"<h3>How do I get it?</h3><p>You get a download link on the thank-you page and by email right after payment.</p>",
"<p class=\"lp-cta\">${buy}</p>",
"<p class=\"lp-fine\">Prefer to try first? <a href=\"/#signup\">Get the free New Puppy Survival Guide</a>.</p>",
"</div></div></section>` }); },",
""
];
const i = L.findIndex(l => l.startsWith('  contact: () => layout({'));
if (i < 0) { console.log('contact not found'); process.exit(1); }
L.splice(i, 0, ...page);
fs.writeFileSync(f, L.join('\n'));

const css = path.join(root, 'site', 'styles.css');
let c = fs.readFileSync(css, 'utf8');
if (!c.includes('.lp-hero')) {
  c += `
.lp-hero{background:var(--navy);color:#fff;padding:64px 0}
.lp-grid{display:grid;grid-template-columns:1.3fr .8fr;gap:40px;align-items:center}
.lp-hero h1{font-size:clamp(32px,4.6vw,54px);line-height:1.08;margin:12px 0 14px;color:#fff}
.lp-hero .lead{color:#dbe5f5;font-size:19px}
.lp-cta{margin:22px 0 8px}
.lp-fine{font-size:14px;color:var(--muted)}
.lp-hero .lp-fine{color:#b8c7e0}
.lp-card{background:#fff;color:var(--navy);border-radius:22px;padding:26px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.3);transform:rotate(2deg)}
.lp-card img{border-radius:50%;background:#fff}
.lp-card-k{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#C58A00;margin-top:10px}
.lp-card-t{font-size:22px;font-weight:800;margin:6px 0}
.lp-card-p{font-size:34px;font-weight:900}
@media(max-width:760px){.lp-grid{grid-template-columns:1fr}.lp-card{transform:none;max-width:320px;margin:auto}.lp-hero{padding:40px 0}}
`;
  fs.writeFileSync(css, c);
}
console.log('ok');
