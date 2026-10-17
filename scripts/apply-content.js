const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');

// ---- 1) sources (all URLs were opened and returned HTTP 200 on 2026-10-17)
const S = {
  pdsaCrate: { org: 'PDSA', title: 'Crate training your dog', url: 'https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/crate-training' },
  rspcaCrate: { org: 'RSPCA', title: 'How to crate train a puppy', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/dogs/environment/crates' },
  dtCrate: { org: 'Dogs Trust', title: 'Playpen and crate training a puppy', url: 'https://www.dogstrust.org.uk/dog-advice/training/home/crate-training' },
  hsCrate: { org: 'Humane Society of the United States', title: 'How to crate train your dog or puppy', url: 'https://www.humanesociety.org/resources/crate-training-101' },
  pdsaChecklist: { org: 'PDSA', title: 'New puppy checklist', url: 'https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/new-puppy-checklist' },
  hsNewHome: { org: 'Humane Society of the United States', title: 'How to bring your new dog home and make them feel welcome', url: 'https://www.humanesociety.org/resources/bringing-your-new-dog-home' },
  rspcaPuppy: { org: 'RSPCA', title: 'Caring for your puppy, 6 weeks to 12 months', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/dogs/health/puppycare' },
  dtMouthing: { org: 'Dogs Trust', title: 'Mouthing, nipping and puppy biting', url: 'https://www.dogstrust.org.uk/dog-advice/training/unwanted-behaviours/mouthing-nipping-and-biting' },
  aspcaMouthing: { org: 'ASPCA', title: 'Mouthing, nipping and biting in puppies', url: 'https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/mouthing-nipping-and-biting-puppies' },
  dtFirstDay: { org: 'Dogs Trust', title: 'Day one with a new puppy', url: 'https://www.dogstrust.org.uk/dog-advice/puppy/first-day' },
  dtNewHome: { org: 'Dogs Trust', title: 'How to help your puppy get settled into your home', url: 'https://www.dogstrust.org.uk/dog-advice/puppy/new-home' },
  pdsaFirstNight: { org: 'PDSA', title: 'Your first day (and night) with a new puppy', url: 'https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/first-day-and-night-with-puppy' },
  pdsaCry: { org: 'PDSA', title: 'Vet Q&A: why do puppies cry at night?', url: 'https://www.pdsa.org.uk/what-we-do/blog/vet-qa-why-do-puppies-cry-at-night' },
  hsPotty: { org: 'Humane Society of the United States', title: 'How to potty train a puppy', url: 'https://www.humanesociety.org/resources/how-potty-train-your-dog-or-puppy' },
  pdsaToilet: { org: 'PDSA', title: 'Toilet training your puppy', url: 'https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/toilet-training-your-puppy' },
  rspcaToilet: { org: 'RSPCA', title: 'How to toilet train your puppy or dog', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/dogs/training/toilettraining' },
  dtToilet: { org: 'Dogs Trust', title: 'How to toilet train your puppy', url: 'https://www.dogstrust.org.uk/dog-advice/training/basics/house-or-toilet-training' },
  rspcaAlone: { org: 'RSPCA', title: 'How to train your dog to stay home alone', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/dogs/training/leftalone' },
  dtAlone: { org: 'Dogs Trust', title: 'How to help your dog get used to spending time alone', url: 'https://www.dogstrust.org.uk/dog-advice/training/home/time-alone' },
  blues: { org: 'PubMed', title: 'Ståhl et al. (2024), Development and validation of the puppy blues scale, npj Mental Health Research', url: 'https://pubmed.ncbi.nlm.nih.gov/38849543/' },
  bluesDoi: { org: 'npj Mental Health Research', title: 'The same study, full text (DOI 10.1038/s44184-024-00072-z)', url: 'https://doi.org/10.1038/s44184-024-00072-z' }
};
const map = {
  'crate-training-a-puppy': ['pdsaCrate', 'rspcaCrate', 'dtCrate'],
  'how-to-prepare-for-a-puppy-checklist': ['pdsaChecklist', 'hsNewHome', 'rspcaPuppy'],
  'how-to-stop-puppy-biting': ['dtMouthing', 'aspcaMouthing'],
  'new-puppy-checklist': ['pdsaChecklist', 'rspcaPuppy', 'dtFirstDay'],
  'puppy-blues-regret-getting-a-puppy': ['blues', 'bluesDoi'],
  'puppy-crying-at-night': ['pdsaCry', 'pdsaFirstNight', 'dtNewHome'],
  'puppy-first-night-home': ['pdsaFirstNight', 'dtFirstDay', 'dtNewHome'],
  'puppy-potty-training-schedule': ['hsPotty', 'pdsaToilet', 'rspcaToilet', 'dtToilet'],
  'puppy-potty-training-timeline': ['hsPotty', 'dtToilet', 'rspcaToilet'],
  'puppy-schedule-when-working-full-time': ['rspcaAlone', 'dtAlone', 'pdsaCrate']
};
for (const [slug, keys] of Object.entries(map)) {
  const f = path.join(root, 'content', 'posts', slug + '.json');
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (j.draft) { console.log('skip draft', slug); continue; }
  j.sources = keys.map(k => S[k]);
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
}

// ---- 2) shop picks: "best for" lines
const best = {
  'all-season-washable-dog-bed': 'puppies who need a washable, non-slip bed as they grow',
  'bissell-little-green-pet-carpet-cleaner': 'homes with carpet or sofas that see potty accidents',
  'dental-chew-toy-set-for-puppies': 'small puppies who want something to chew on',
  'disposable-puppy-training-pads': 'indoor potty spots, balconies and bad-weather days',
  'dog-car-seat-belt': 'car rides with a harness-wearing puppy',
  'double-sided-flannel-pet-bed-small-dogs': 'small puppies and cozy crate corners',
  'durable-rubber-chewing-toy-set-6-pieces': 'puppies who chew a lot during teething',
  'enzymatic-pet-stain-cleaner': 'cleaning accidents so the smell does not linger',
  'furbo-360-dog-camera': 'practicing short alone times and checking in',
  'knot-braided-rubber-chew-toy-set': 'small puppies who like rope and rubber chews',
  'midwest-icrate-folding-dog-crate': 'a crate that grows with your puppy and folds flat',
  'orthopedic-memory-foam-dog-bed-washable': 'puppies who will grow into medium or large dogs',
  'petmate-sky-kennel-travel-crate': 'car trips, vet visits and travel',
  'puppy-exercise-pen-playpen': 'a safe play area when you cannot supervise closely',
  'puppy-harness-and-leash-set': 'first walks for small to medium puppies',
  'puppy-heartbeat-comfort-toy': 'settling a puppy at bedtime',
  'puppy-plush-teething-toy-set': 'gentle play for small puppies',
  'puppy-slow-feeder-bowl': 'puppies who gulp their food',
  'puppy-training-pads': 'indoor potty spots while your puppy learns',
  'rubber-puppy-teething-chews': 'sore gums during teething',
  'silicone-slow-feeder-dog-bowl': 'slower, calmer mealtimes',
  'soft-puppy-training-treats': 'short training sessions with quick rewards',
  'tractive-gps-dog-tracker': 'owners who want to know where their dog is',
  'washable-puppy-crate-bed': 'lining a crate with something easy to wash',
  'wire-puppy-crate-with-divider': 'crate training with room that grows'
};
for (const [slug, text] of Object.entries(best)) {
  const f = path.join(root, 'content', 'picks', slug + '.json');
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  j.bestFor = text;
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
}

// ---- 3) css
const css = path.join(root, 'site', 'styles.css');
let c = fs.readFileSync(css, 'utf8');
if (!c.includes('.sources{')) {
  c += `
.sources{margin:26px 0;padding:16px 18px;border:1px solid var(--line);border-radius:14px;background:#fff}
.sources h2{font-size:20px;margin:0 0 6px}
.sources p{margin:0 0 8px;color:var(--muted);font-size:15px}
.sources ul{margin:0;padding-left:20px;font-size:15px}
.sources li{margin:4px 0}
.sources a{color:var(--navy);text-decoration:underline}
.prod-card .best{font-size:14px;color:var(--muted);margin:6px 0 0}
.meta a{color:inherit;text-decoration:underline}
`;
  fs.writeFileSync(css, c);
}

// ---- 4) homepage: lazy-load images below the fold
const ip = path.join(root, 'site', 'index.html');
let h = fs.readFileSync(ip, 'utf8');
h = h.split('<div class="b-img"><img src="/assets/hero.jpg" alt=""></div>').join('<div class="b-img"><img src="/assets/hero.jpg" alt="" loading="lazy" decoding="async"></div>');
h = h.replace('<img src="/assets/mascot.png" alt="PuppyGuido mascot, a friendly puppy face" width="100" height="105">', '<img src="/assets/mascot.png" alt="PuppyGuido mascot, a friendly puppy face" width="100" height="105" loading="lazy" decoding="async">');
fs.writeFileSync(ip, h);

// ---- 5) sitemap lastmod for posts (updated date) and privacy
const bp = path.join(root, 'build', 'build.js');
let b = fs.readFileSync(bp, 'utf8');
b = b.replace("all.map(p => [`/blog/${p.slug}/`, p.date])", "all.map(p => [`/blog/${p.slug}/`, p.updated || p.date])");
b = b.replace("['/privacy/'], ['/terms/']", "['/privacy/', '2026-10-17'], ['/terms/']");
fs.writeFileSync(bp, b);
console.log('content applied');
