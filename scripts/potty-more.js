const fs = require('fs'), path = require('path');
const f = path.join(__dirname, '..', 'content', 'posts', 'puppy-potty-training-schedule.json');
const j = JSON.parse(fs.readFileSync(f, 'utf8'));
const add = `<h2>If you live in an apartment or work during the day</h2>
<p>A schedule still works, you just have to plan the gaps. In an apartment, keep shoes, leash and treats by the door so trips are quick, and choose a spot you can reach fast, ideally the same one every time. If you work during the day, ask a family member, neighbor or dog walker to cover the midday trip, because young puppies cannot wait as long as adult dogs. Use a pen or a pad area as a back-up for the times you cannot be there, and be patient: reliability comes from many small, consistent days.</p>
<p>Remember that every home is different, and small adjustments are normal. What matters is that your puppy gets a predictable rhythm and a calm, rewarding response every time they get it right.</p>
`;
if (!j.html.includes('apartment or work during the day')) {
  j.html = j.html.replace('<h2>Frequently asked questions</h2>', add + '\n<h2>Frequently asked questions</h2>');
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
}
console.log('potty words now:', j.html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length);
