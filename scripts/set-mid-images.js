const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const info = JSON.parse(fs.readFileSync('C:/Users/user/Downloads/PuppyGuido_Pinterest/infographics.json', 'utf8'));
const alt = f => info.find(i => i.file === f).alt;
const map = {
  'crate-training-a-puppy': 'crate-training-steps',
  'puppy-first-night-home': 'first-night-setup',
  'puppy-crying-at-night': 'crying-at-night-checks',
  'how-to-stop-puppy-biting': 'biting-three-steps',
  'puppy-potty-training-schedule': 'potty-when-to-go-out',
  'new-puppy-checklist': 'new-puppy-10-essentials',
  'how-to-prepare-for-a-puppy-checklist': 'prepare-before-puppy-day',
  'puppy-blues-regret-getting-a-puppy': 'puppy-blues-what-helps'
};
for (const [slug, file] of Object.entries(map)) {
  const f = path.join(ROOT, 'content', 'posts', slug + '.json');
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  j.midImage = '/assets/blog/' + file + '.jpg';
  j.midImageAlt = alt(file);
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
  console.log(slug, '->', j.midImage);
}
