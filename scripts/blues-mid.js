const fs = require('fs'), path = require('path');
const f = path.join(__dirname, '..', 'content', 'posts', 'puppy-blues-regret-getting-a-puppy.json');
const j = JSON.parse(fs.readFileSync(f, 'utf8'));
j.draft = false;
if (!j.midImage) {
  j.midImage = '/assets/blog/puppy-blues-what-helps.jpg';
  j.midImageAlt = 'Infographic: five things that usually help with the puppy blues';
}
fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
console.log('blues', j.draft, j.date, j.midImage, (j.seoTitle || '').length);
