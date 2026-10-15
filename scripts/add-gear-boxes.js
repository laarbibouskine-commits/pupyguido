const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const gear = {
  slugs: {
    'crate-training-a-puppy': ['wire-puppy-crate-with-divider', 'washable-puppy-crate-bed'],
    'puppy-first-night-home': ['washable-puppy-crate-bed', 'puppy-heartbeat-comfort-toy'],
    'puppy-crying-at-night': ['puppy-heartbeat-comfort-toy', 'washable-puppy-crate-bed'],
    'how-to-stop-puppy-biting': ['rubber-puppy-teething-chews', 'soft-puppy-training-treats'],
    'puppy-potty-training-schedule': ['enzymatic-pet-stain-cleaner', 'puppy-training-pads'],
    'puppy-potty-training-timeline': ['enzymatic-pet-stain-cleaner', 'soft-puppy-training-treats'],
    'new-puppy-checklist': ['puppy-harness-and-leash-set', 'puppy-slow-feeder-bowl'],
    'how-to-prepare-for-a-puppy-checklist': ['puppy-exercise-pen-playpen', 'wire-puppy-crate-with-divider'],
    'puppy-blues-regret-getting-a-puppy': ['puppy-heartbeat-comfort-toy', 'puppy-exercise-pen-playpen']
  },
  categories: {
    'Sleep & Crate': ['wire-puppy-crate-with-divider', 'washable-puppy-crate-bed'],
    'Potty Training': ['enzymatic-pet-stain-cleaner', 'puppy-training-pads'],
    'Training': ['rubber-puppy-teething-chews', 'soft-puppy-training-treats'],
    'Preparation': ['puppy-harness-and-leash-set', 'puppy-slow-feeder-bowl']
  }
};
fs.writeFileSync(path.join(root, 'content', 'gear.json'), JSON.stringify(gear, null, 2) + '\n');

const f = path.join(root, 'build', 'build.js');
let b = fs.readFileSync(f, 'utf8');
if (!b.includes('function gearBox(')) {
  const fn = `
// "Helpful gear" box: 1-2 Amazon picks under an article (mapping in content/gear.json; falls back to the post category).
const GEAR_FILE = path.join(ROOT, 'content', 'gear.json');
const GEAR = fs.existsSync(GEAR_FILE) ? JSON.parse(fs.readFileSync(GEAR_FILE, 'utf8')) : { slugs: {}, categories: {} };
function gearBox(p) {
  const slugs = (GEAR.slugs && GEAR.slugs[p.slug]) || (GEAR.categories && GEAR.categories[p.category]) || [];
  const picks = slugs.map(s => products.find(x => x.slug === s)).filter(x => x && !x.hidden && x.url);
  if (!picks.length) return '';
  const items = picks.map(x => '<li><a href="' + esc(x.url) + '" target="_blank" rel="sponsored nofollow noopener"><strong>' + esc(x.title) + '</strong></a><span>' + esc(x.short || '') + '</span></li>').join('');
  return '<aside class="gear-box"><h3>Helpful gear</h3><ul>' + items + '</ul><p class="gear-note">As an Amazon Associate we earn from qualifying purchases. Always check that an item suits your puppy\\'s size and age.</p></aside>';
}
`;
  b = b.replace('function renderPost(p, all) {', fn + '\nfunction renderPost(p, all) {');
  b = b.replace("${adSlot('articleEnd')}\n${ctaBox}\n${disclaimer}", "${adSlot('articleEnd')}\n${gearBox(p)}\n${ctaBox}\n${disclaimer}");
  fs.writeFileSync(f, b);
}
const css = path.join(root, 'site', 'styles.css');
let c = fs.readFileSync(css, 'utf8');
if (!c.includes('.gear-box')) {
  c += '\n.gear-box{background:#FFF9E5;border:1px solid #F2E3A8;border-radius:var(--r-md);padding:20px 22px;margin:28px 0}\n.gear-box h3{margin:0 0 10px;color:var(--navy);font-size:20px}\n.gear-box ul{list-style:none;margin:0;padding:0}\n.gear-box li{margin:0 0 12px}\n.gear-box li a{color:var(--navy);text-decoration:underline}\n.gear-box li span{display:block;color:var(--muted);font-size:14.5px;margin-top:2px}\n.gear-note{font-size:13px;color:var(--muted);margin:10px 0 0}\n';
  fs.writeFileSync(css, c);
}
console.log('ok');
