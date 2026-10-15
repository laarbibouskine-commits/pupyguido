const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
let code = fs.readFileSync(path.join(root, 'pick-topic-current.js'), 'utf8');
if (code.includes('baseTopics')) { console.log('already'); process.exit(0); }
const gear = `
const gearTopics = [
  t(\`best-crate-size-for-a-puppy\`, \`How to Choose the Right Crate Size for Your Puppy\`, \`best crate size for puppy\`, [\`what size crate for a puppy\`, \`crate size for puppy\`], \`Room to stand, turn around and lie down; use a divider as the puppy grows; not so big that one end becomes a toilet. Mention that some links on the site are Amazon affiliate links; no prices.\`, \`night\`),
  t(\`best-chew-toys-for-teething-puppies\`, \`Best Chew Toys for Teething Puppies: What to Look For\`, \`puppy teething toys\`, [\`best chew toys for puppies\`, \`chew toys for teething puppies\`], \`Size and firmness, safe materials, supervision, replace worn toys, rotate toys, redirect biting. General guidance, no brand claims.\`, \`bite\`),
  t(\`puppy-playpen-do-you-need-one\`, \`Puppy Playpen: Do You Need One and How to Use It\`, \`puppy playpen\`, [\`puppy exercise pen\`, \`puppy playpen indoors\`], \`Safe play area, supervised use, short sessions, toys and water, never as a long-term confinement; when it helps and when it does not.\`, \`play\`),
  t(\`puppy-harness-or-collar-which-is-better\`, \`Harness or Collar for a New Puppy? A Simple Guide\`, \`puppy harness vs collar\`, [\`best harness for puppy\`, \`should a puppy wear a harness\`], \`Comfort and fit, ID tag on a collar, harness for walks and training, check size as the puppy grows, safety and supervision.\`, \`collar\`),
  t(\`puppy-slow-feeder-bowl-worth-it\`, \`Slow Feeder Bowls for Puppies: Are They Worth It?\`, \`puppy slow feeder bowl\`, [\`slow feeder for puppy\`, \`do puppies need slow feeder bowls\`], \`Who might benefit, how to introduce it, cleaning, portion guidance from the vet, alternatives like scatter feeding.\`, \`checklist\`),
  t(\`puppy-training-pads-do-they-work\`, \`Puppy Training Pads: Do They Work and When to Use Them\`, \`puppy training pads\`, [\`do puppy pads work\`, \`how to use puppy pads\`], \`Pros and cons, apartments and bad weather, transition to the outdoor spot, consistent placement, cleaning with enzymatic cleaner.\`, \`potty\`),
  t(\`best-treats-for-puppy-training\`, \`Puppy Training Treats: What to Choose and How Much\`, \`best treats for puppy training\`, [\`puppy training treats\`, \`how many treats can a puppy have\`], \`Small, soft, quick to eat; count treats in the daily food; variety; ask the vet about amounts and allergies.\`, \`collar\`),
  t(\`puppy-heartbeat-toy-does-it-help\`, \`Comfort Toys for Puppies at Night: Do They Help?\`, \`puppy heartbeat toy\`, [\`puppy comfort toy for night\`, \`toy for crying puppy at night\`], \`What they are, who might find them soothing, safety and supervision, no guaranteed results; combine with routine and a potty trip.\`, \`night\`),
  t(\`puppy-crate-bedding-what-is-safe\`, \`Puppy Crate Bedding: What Is Safe and Washable\`, \`puppy crate bedding\`, [\`best bed for puppy crate\`, \`crate bed for puppy\`], \`Washable covers, chew risk, fit, accidents, when to avoid bedding if the puppy chews, check fabrics for loose threads.\`, \`night\`),
  t(\`puppy-first-week-gear-list\`, \`The First-Week Gear List: What You Really Need for a Puppy\`, \`puppy starter kit\`, [\`puppy first week supplies\`, \`new puppy supplies list\`], \`Short list of must-haves for week one versus things that can wait; link to the full essentials checklist.\`, \`checklist\`)
];
const mixed = [];
let bi = 0, gi = 0;
for (; bi < Math.min(4, baseTopics.length); bi++) mixed.push(baseTopics[bi]);
while (bi < baseTopics.length || gi < gearTopics.length) {
  for (let k = 0; k < 2 && bi < baseTopics.length; k++) mixed.push(baseTopics[bi++]);
  if (gi < gearTopics.length) mixed.push(gearTopics[gi++]);
}
const topics = mixed;
`;
code = code.replace('const topics = [', 'const baseTopics = [');
code = code.replace('const next = topics.find', gear + 'const next = topics.find');
fs.writeFileSync(path.join(root, 'pick-topic-new.js'), code);
fs.writeFileSync(path.join(root, 'pick-topic-new.json'), JSON.stringify(code));
// gear boxes mapping for the new slugs
const gf = path.join(root, 'content', 'gear.json');
const g = JSON.parse(fs.readFileSync(gf, 'utf8'));
Object.assign(g.slugs, {
  'best-crate-size-for-a-puppy': ['wire-puppy-crate-with-divider', 'washable-puppy-crate-bed'],
  'best-chew-toys-for-teething-puppies': ['rubber-puppy-teething-chews', 'soft-puppy-training-treats'],
  'puppy-playpen-do-you-need-one': ['puppy-exercise-pen-playpen', 'wire-puppy-crate-with-divider'],
  'puppy-harness-or-collar-which-is-better': ['puppy-harness-and-leash-set'],
  'puppy-slow-feeder-bowl-worth-it': ['puppy-slow-feeder-bowl', 'soft-puppy-training-treats'],
  'puppy-training-pads-do-they-work': ['puppy-training-pads', 'enzymatic-pet-stain-cleaner'],
  'best-treats-for-puppy-training': ['soft-puppy-training-treats', 'rubber-puppy-teething-chews'],
  'puppy-heartbeat-toy-does-it-help': ['puppy-heartbeat-comfort-toy', 'washable-puppy-crate-bed'],
  'puppy-crate-bedding-what-is-safe': ['washable-puppy-crate-bed', 'wire-puppy-crate-with-divider'],
  'puppy-first-week-gear-list': ['puppy-harness-and-leash-set', 'puppy-slow-feeder-bowl', 'wire-puppy-crate-with-divider'],
  'how-to-clean-puppy-accidents': ['enzymatic-pet-stain-cleaner', 'puppy-training-pads'],
  'how-to-crate-train-a-puppy-during-the-day': ['wire-puppy-crate-with-divider', 'soft-puppy-training-treats'],
  'puppy-essentials-list': ['puppy-harness-and-leash-set', 'puppy-slow-feeder-bowl']
});
fs.writeFileSync(gf, JSON.stringify(g, null, 2) + '\n');
// sanity: evaluate order
const run = new Function('$input', code.replace(/^const published[\s\S]*?\n(?=const t = )/m, 'const published = new Set();\n').replace(/const next = topics\.find[\s\S]*$/, 'return topics.map(x=>x.slug);'));
const order = run({ all: () => [] });
console.log(order.length, order.slice(0, 16).join('\n'));
