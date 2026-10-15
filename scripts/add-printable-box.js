const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const P = {
  potty: { id: 'puppy-potty-training-schedule-by-age', title: 'Puppy Potty Training Schedule by Age', blurb: 'One-page schedule by age, a sample day and a weekly log you can stick on the fridge.' },
  crate: { id: 'crate-training-checklist', title: 'Crate Training Checklist', blurb: 'A 7-step checklist, crate time by age and a simple do and don\'t list.' },
  week: { id: 'first-week-with-your-puppy-checklist', title: 'Your Puppy First Week: Day by Day', blurb: 'A day-by-day checklist for the first 7 days, plus a night routine.' }
};
const slugs = {
  potty: ['puppy-potty-training-schedule', 'puppy-potty-training-timeline', 'puppy-wont-pee-outside', 'how-often-to-take-a-puppy-outside', 'are-puppy-pads-a-good-idea', 'puppy-training-pads-do-they-work', 'how-to-clean-puppy-accidents', 'how-to-potty-train-a-puppy-in-an-apartment', 'puppy-pees-right-after-coming-inside', 'puppy-potty-training-in-rain-or-cold'],
  crate: ['crate-training-a-puppy', 'best-crate-size-for-a-puppy', 'how-to-crate-train-a-puppy-during-the-day', 'puppy-wont-stop-barking-in-crate', 'puppy-crate-bedding-what-is-safe', 'should-i-put-a-blanket-over-the-puppy-crate', 'puppy-crying-in-crate-first-night', 'puppy-playpen-do-you-need-one'],
  week: ['puppy-first-night-home', 'puppy-crying-at-night', 'first-week-with-puppy-what-to-do', 'new-puppy-checklist', 'how-to-prepare-for-a-puppy-checklist', 'puppy-first-day-home-what-to-expect', 'puppy-first-week-gear-list', 'where-should-a-puppy-sleep-the-first-night', 'puppy-whining-at-night-what-to-do', 'what-age-do-puppies-sleep-through-the-night', 'puppy-schedule-when-working-full-time', 'puppy-blues-regret-getting-a-puppy']
};
const map = { printables: {}, slugs: {}, categories: { 'Potty Training': 'potty', 'Sleep & Crate': 'crate', 'Preparation': 'week' } };
Object.entries(P).forEach(([k, v]) => { map.printables[k] = v; });
Object.entries(slugs).forEach(([k, arr]) => arr.forEach(s => { map.slugs[s] = k; }));
fs.writeFileSync(path.join(root, 'content', 'printables.json'), JSON.stringify(map, null, 2) + '\n');

const f = path.join(root, 'build', 'build.js');
let L = fs.readFileSync(f, 'utf8').split('\n');
if (L.some(l => l.includes('function printableBox('))) { console.log('already'); process.exit(0); }
const fn = `
// "Free printable" box: PDF by email (content/printables.json maps slugs and categories to a printable).
const PRINT_FILE = path.join(ROOT, 'content', 'printables.json');
const PRINT = fs.existsSync(PRINT_FILE) ? JSON.parse(fs.readFileSync(PRINT_FILE, 'utf8')) : { printables: {}, slugs: {}, categories: {} };
function printableBox(p) {
  const key = (PRINT.slugs && PRINT.slugs[p.slug]) || (PRINT.categories && PRINT.categories[p.category]);
  const it = key && PRINT.printables[key];
  if (!it) return '';
  return '<aside class="cta-box cta-form printable-box"><div class="cta-copy"><h3>Free printable: ' + esc(it.title) + '</h3><p>' + esc(it.blurb) + ' We will email you the PDF.</p></div>' +
    '<form class="cta-signup" method="POST" enctype="multipart/form-data" action="https://n8n.satinher.com/webhook/pupyguido-printable" onsubmit="return pgSend(event)">' +
    '<input name="Full name" type="text" placeholder="Your first name" autocomplete="name" required aria-label="Your name">' +
    '<input name="Email address" type="email" placeholder="you@example.com" autocomplete="email" required aria-label="Email address">' +
    '<input type="hidden" name="printable" value="' + esc(it.id) + '">' +
    '<div aria-hidden="true" style="position:absolute;left:-9999px;height:0;overflow:hidden"><input name="website" type="text" tabindex="-1" autocomplete="off"></div>' +
    '<button class="btn btn-gold" type="submit">Email me the PDF</button>' +
    '<p class="cta-fine">No spam. By signing up you agree to our <a href="/privacy/">Privacy Policy</a>.</p><p class="cta-err" role="alert" hidden></p></form></aside>';
}
`;
const i = L.findIndex(l => l.startsWith('function renderPost(p, all)'));
L.splice(i, 0, ...fn.split('\n'));
const k = L.findIndex(l => l.startsWith('${authorBox(p)}'));
if (k < 0) { console.log('authorBox call not found'); process.exit(1); }
// place the printable box before the generic CTA box (which is above the author box)
const c = L.findIndex(l => l.startsWith('${ctaBox}'));
L.splice(c, 0, '${printableBox(p)}');
fs.writeFileSync(f, L.join('\n'));
console.log('ok');
