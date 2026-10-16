const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');

const breeds = [
  {
    slug: 'labrador-puppy-guide', name: 'Labrador', plural: 'Labrador puppies',
    lead: 'Friendly, food-loving and full of energy. Labrador puppies are a joy, and they chew, pull and jump a lot. Here is a calm 12-week plan.',
    expect: [
      'Very mouthy and chewy, especially while teething',
      'Food-motivated, so treat training works very well',
      'Strong and bouncy: jumping and pulling on the lead are common',
      'Grow big, so good habits matter early',
      'Love people and play, and dislike being left alone for long'
    ],
    notes: 'Labradors love food and love to chew. Use small treats and part of daily meals as rewards, keep an eye on portions (ask your vet how much to feed), and give plenty of approved chews. They can be strong pullers, so start loose lead practice early and keep it fun. Ask your vet how much exercise is right while your puppy is growing.'
  },
  {
    slug: 'french-bulldog-puppy-guide', name: 'French Bulldog', plural: 'French Bulldog puppies',
    lead: 'Charming, clownish and a little stubborn. French Bulldog puppies need patience, short sessions and extra care with heat and exercise. Here is a calm 12-week plan.',
    expect: [
      'Potty training can take patience and a steady routine',
      'Smart but can be stubborn: short, happy sessions work best',
      'Flat-faced breed: keep play and walks gentle, and avoid heat',
      'Love company and can struggle when left alone',
      'Often best with a harness rather than a collar on the neck'
    ],
    notes: 'French Bulldogs have short noses, so they can tire or overheat more easily than other breeds. Keep walks and play gentle, avoid hot weather and ask your vet what is normal for your puppy and when to worry. Use short training sessions with tasty rewards, a harness for walks, and a steady potty routine. They love company, so build alone time slowly.'
  },
  {
    slug: 'golden-retriever-puppy-guide', name: 'Golden Retriever', plural: 'Golden Retriever puppies',
    lead: 'Gentle, eager to please and very social. Golden Retriever puppies love to learn, and they also mouth, chew and carry everything. Here is a calm 12-week plan.',
    expect: [
      'Eager to please, so positive training works very well',
      'Mouthy: they love to carry and chew things',
      'Very social and can get anxious when left alone',
      'Sensitive to harsh handling: gentle methods are best',
      'Stay playful and puppy-like for a long time'
    ],
    notes: 'Golden Retrievers are gentle and eager to please, so reward-based training suits them well. They love to carry and chew, so keep toys handy and swap, never snatch. They are very social, so build short alone times early and keep greetings calm. Ask your vet how much exercise is right while your puppy is growing.'
  }
];
fs.writeFileSync(path.join(root, 'content', 'breeds.json'), JSON.stringify(breeds, null, 2) + '\n');

// offers.json: make sure the playbook entry has a full-price checkout slot
const op = path.join(root, 'content', 'offers.json');
const offers = JSON.parse(fs.readFileSync(op, 'utf8'));
offers.playbook = Object.assign({ price: '37', salePrice: '27', checkoutUrl: '', saleCheckoutUrl: '' }, offers.playbook || {});
fs.writeFileSync(op, JSON.stringify(offers, null, 2) + '\n');

const f = path.join(root, 'build', 'build.js');
let b = fs.readFileSync(f, 'utf8');
if (b.includes('function breedPage(')) { console.log('already'); process.exit(0); }

const fn = `
// Ad landing pages per breed (content/breeds.json). Noindex: used only for ads.
const BREEDS = fs.existsSync(path.join(ROOT, 'content', 'breeds.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'breeds.json'), 'utf8')) : [];
function breedPage(br) {
  const PB = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'offers.json'), 'utf8')).playbook;
  const buy = PB.checkoutUrl ? '<a class="btn btn-gold" href="' + PB.checkoutUrl + '">Get the Playbook - $' + PB.price + ' ' + arrow + '</a>' : '<a class="btn btn-gold" href="/#signup">Notify me when it opens ' + arrow + '</a>';
  const li = br.expect.map(x => '<li>' + esc(x) + '</li>').join('');
  return layout({
    title: br.name + ' Puppy Training Playbook | PuppyGuido',
    description: 'A calm, positive 12-week plan for ' + br.name + ' puppy parents: potty training, crate and alone time, biting, sleep, socialization and 8 first cues.',
    urlPath: '/' + br.slug + '/', noindex: true,
    body: '<section class="lp-hero"><div class="wrap lp-grid"><div>' +
      '<span class="eyebrow"><svg class="ico fill"><use href="#i-paw"/></svg> For ' + esc(br.name) + ' puppy parents</span>' +
      '<h1>Raising a ' + esc(br.name) + ' puppy? <span class="hl">Your 12-week plan</span></h1>' +
      '<p class="lead">' + esc(br.lead) + '</p>' +
      '<p class="lp-cta">' + buy + '</p>' +
      '<p class="lp-fine">Instant PDF download &middot; positive methods only &middot; 30-day money-back guarantee</p></div>' +
      '<div class="lp-card" aria-hidden="true"><img src="/assets/mascot.png" alt="" width="120" height="120"><div class="lp-card-k">The Puppy Training Playbook</div><div class="lp-card-t">+ ' + esc(br.name) + ' notes</div><div class="lp-card-p">$' + PB.price + '</div></div></div></section>' +
      '<section class="sec"><div class="wrap narrow"><div class="prose">' +
      '<h2>What to expect from ' + esc(br.plural) + '</h2><ul>' + li + '</ul>' +
      '<h2>The 3 things new owners ask about most</h2><ul><li><strong>Crying at night.</strong> A simple night routine and what to do when your puppy wakes.</li><li><strong>Potty accidents.</strong> A schedule by age, with a plan for slip-ups.</li><li><strong>Biting and chewing.</strong> Why it happens and how to redirect it kindly.</li></ul>' +
      '<p class="lp-cta">' + buy + '</p>' +
      '<h2>What is inside the Playbook</h2><ul>' +
      '<li>How puppies learn, and a daily routine that works</li><li>Potty training, crate and alone time, biting, sleep</li><li>Socialization and 8 first cues, step by step</li><li>A 12-week roadmap, 20 brain games, cue cards and trackers</li><li>A gear guide with budget, best value and premium picks</li><li><strong>Breed notes for ' + esc(br.plural) + '</strong></li></ul>' +
      '<h2>Breed notes: ' + esc(br.name) + '</h2><p>' + esc(br.notes) + '</p>' +
      '<h2>30-day money-back guarantee</h2><p>If the Playbook is not useful to you, email <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> within 30 days and we will refund you.</p>' +
      '<h2>Questions</h2>' +
      '<h3>Is it only for ' + esc(br.plural) + '?</h3><p>No. The 12-week plan works for any puppy. The breed notes cover Labrador, French Bulldog and Golden Retriever puppies.</p>' +
      '<h3>Do you use punishment or shouting?</h3><p>Never. Every method is positive and reward-based.</p>' +
      '<h3>Is this veterinary advice?</h3><p>No. It is general educational information. Please ask your vet about health, vaccines, food and exercise for your puppy.</p>' +
      '<h3>How do I get it?</h3><p>It is a PDF. You get a download link right after payment, by email.</p>' +
      '<p class="lp-cta">' + buy + '</p>' +
      '<p class="lp-fine">Prefer to try first? <a href="/#signup">Get the free New Puppy Survival Guide</a>.</p>' +
      '</div></div></section>'
  });
}
`;
const i = b.indexOf('function renderPost(p, all)');
b = b.slice(0, i) + fn + '\n' + b.slice(i);
b = b.replace("for (const [name, fn] of Object.entries(pages)) write(`${name}/index.html`, fn());", "for (const [name, fn] of Object.entries(pages)) write(`${name}/index.html`, fn());\n  for (const br of BREEDS) write(`${br.slug}/index.html`, breedPage(br));");
fs.writeFileSync(f, b);
console.log('ok');
