const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'content', 'posts');
const rd = s => JSON.parse(fs.readFileSync(path.join(dir, s + '.json'), 'utf8'));
const wr = (s, j) => fs.writeFileSync(path.join(dir, s + '.json'), JSON.stringify(j, null, 2) + '\n');

// 1) Puppy blues: publish with a shorter SEO title
let b = rd('puppy-blues-regret-getting-a-puppy');
b.draft = false;
b.seoTitle = 'Puppy Blues: What Helps When Overwhelmed';
b.date = new Date().toISOString().slice(0, 10);
wr('puppy-blues-regret-getting-a-puppy', b);

// 2) Potty timeline: publish with seoTitle, excerpt, a mid image and a link to the schedule article
let t = rd('puppy-potty-training-timeline');
t.draft = false;
t.seoTitle = 'Puppy Potty Training Timeline: How Long?';
t.excerpt = 'A realistic week-by-week timeline for puppy potty training and what affects it.';
t.date = new Date().toISOString().slice(0, 10);
t.midImage = '/assets/garden.jpg';
t.midImageAlt = 'Golden retriever puppy among yellow flowers in a garden';
const more = '<p>Want a day-by-day routine you can copy? See our <a href="/blog/puppy-potty-training-schedule/">puppy potty training schedule</a>, and if accidents keep happening, our guide to <a href="/blog/puppy-crying-at-night/">night-time routines</a> may help too.</p>';
if (!t.html.includes('puppy-potty-training-schedule')) t.html = t.html.replace('<h2>When to Ask a Professional</h2>', more + '\n<h2>When to Ask a Professional</h2>');
wr('puppy-potty-training-timeline', t);

// 3) test drafts
for (const s of ['test-draft', 'eck-android-command-line-tools']) {
  const f = path.join(dir, s + '.json');
  if (fs.existsSync(f)) { fs.unlinkSync(f); console.log('deleted', s); }
}
console.log('done');
