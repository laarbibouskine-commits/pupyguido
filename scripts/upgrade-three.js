const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'content', 'posts');

function upgrade(slug, opts) {
  const f = path.join(dir, slug + '.json');
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (j.faq) { console.log(slug, 'already upgraded'); return; }
  let h = j.html;
  // pull the FAQ section out of the html and turn it into structured faq
  const m = h.match(/<h2[^>]*>(Frequently [Aa]sked [Qq]uestions|[A-Za-z' ]*FAQ)<\/h2>([\s\S]*?)(?=<h2|$)/);
  const faq = [];
  if (m) {
    const re = /<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g;
    let x;
    while ((x = re.exec(m[2])) !== null) faq.push({ q: x[1].trim(), a: x[2].trim() });
    h = h.replace(m[0], '');
  }
  opts.faqExtra.forEach(e => faq.push(e));
  // insert the extra sections before "When to ask a professional"
  const re2 = /<h2[^>]*>When to [Aa]sk a [Pp]rofessional<\/h2>/;
  const mm = h.match(re2);
  if (mm) h = h.replace(re2, opts.extra + '\n' + mm[0]);
  else h += opts.extra;
  j.html = h.trim();
  j.quick = opts.quick;
  j.faq = faq;
  j.updated = '2026-10-15';
  j.readMinutes = opts.readMinutes;
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
  const words = (j.html.replace(/<[^>]+>/g, ' ') + ' ' + faq.map(z => z.q + ' ' + z.a).join(' ')).split(/\s+/).filter(Boolean).length;
  console.log(slug, 'words', words, 'faq', faq.length);
}

upgrade('crate-training-a-puppy', {
  readMinutes: 10,
  quick: 'Choose a crate just big enough for your puppy to stand, turn around and lie down. Make it cozy, add treats, start with short stays while you are nearby, and build the time slowly. Never use the crate as punishment.',
  extra: `
<h2 id="size">What size crate does a puppy need?</h2>
<p>The crate should be big enough for your puppy to stand up, turn around and lie down comfortably, and no bigger. A crate that is too large can become a toilet corner, which makes potty training harder. For a growing puppy, buy a crate with a divider so you can make the space bigger over time.</p>
<table>
<thead><tr><th>Type</th><th>Good for</th><th>Watch out for</th></tr></thead>
<tbody>
<tr><td>Wire crate with divider</td><td>Most puppies, easy to clean, good airflow</td><td>Can be noisy; add a cover or soft pad</td></tr>
<tr><td>Plastic travel crate</td><td>Car travel, flights, a den-like feel</td><td>Less airflow; check size rules for travel</td></tr>
<tr><td>Soft-sided crate</td><td>Calm, older dogs and short trips</td><td>Easy for puppies to chew, scratch or escape</td></tr>
</tbody>
</table>

<h2 id="time">How long can a puppy stay in the crate?</h2>
<p>Crate time should match your puppy's age and bladder. As a general guide, young puppies can stay for about one to three hours in the day, and the time grows slowly as they get older. Overnight is different because they are asleep, but young puppies still need a potty trip. Always take your puppy out right after crate time, and never leave a young puppy for a long period.</p>
<table>
<thead><tr><th>Age</th><th>Daytime crate stretch (awake time)</th></tr></thead>
<tbody>
<tr><td>8 to 10 weeks</td><td>Up to about 1 hour, between potty trips</td></tr>
<tr><td>10 to 12 weeks</td><td>About 1 to 2 hours</td></tr>
<tr><td>3 to 4 months</td><td>About 2 to 3 hours</td></tr>
<tr><td>4 to 6 months</td><td>About 3 to 4 hours</td></tr>
</tbody>
</table>
<p>These are common guidelines, not rules. Ask your vet about your puppy.</p>

<h2 id="night">Crate training at night versus during the day</h2>
<p>At night the crate is mostly a place to sleep. Keep it close to your bed in the first weeks so your puppy feels safe, and plan one or two quiet potty trips. During the day the crate is a rest place. Use it for naps and short stays, and mix it with play, training and time with the family so it never feels like a punishment. Our guide to a <a href="/blog/puppy-potty-training-schedule/">potty training schedule by age</a> shows how crate time fits around trips.</p>

<h2 id="problems">If your puppy whines or barks in the crate</h2>
<ul>
<li><strong>Check needs first:</strong> potty, thirst, temperature, and tiredness.</li>
<li><strong>Go back a step:</strong> shorter stays, door open, treats and a toy inside.</li>
<li><strong>Wait for a quiet moment</strong> before opening the door, so quiet earns the exit.</li>
<li><strong>Do not punish.</strong> A scared puppy learns to fear the crate.</li>
<li><strong>Ask for help</strong> if your puppy is panicking, and read <a href="/blog/puppy-crying-at-night/">puppy crying at night</a>.</li>
</ul>

<h2 id="inside">What to put in the crate</h2>
<p>Keep it simple: a washable pad or bed, a safe chew or a stuffed food toy, and nothing with loose threads or small parts. Remove anything your puppy chews up. A cover over part of a wire crate can make it feel like a den. Leave airflow on at least two sides. Always take collars with tags off in the crate if your vet or trainer advises it, because tags can snag.</p>
`,
  faqExtra: [
    { q: 'What size crate do I need for my puppy?', a: 'Choose one big enough for your puppy to stand, turn around and lie down, and use a divider to make it bigger as they grow. Check the manufacturer size chart for the breed and expected adult size.' },
    { q: 'Should I crate my puppy overnight?', a: 'Many families do, with the crate close to their bed in the first weeks. Plan one or two quiet potty trips for young puppies and keep the routine calm and the same each night.' }
  ]
});

upgrade('puppy-first-night-home', {
  readMinutes: 8,
  quick: 'On the first night, take your puppy out right before bed, keep the sleeping spot close and cozy, stay calm and boring if they cry, and plan one or two quiet potty trips. Expect a noisy night and a better second night.',
  extra: `
<h2 id="evening">A simple first evening, hour by hour</h2>
<table>
<thead><tr><th>Time</th><th>What to do</th></tr></thead>
<tbody>
<tr><td>Early evening</td><td>Quiet time at home. Short, calm play. No visitors if you can.</td></tr>
<tr><td>Dinner</td><td>Feed a small meal about two to three hours before bedtime, as your vet advises</td></tr>
<tr><td>1 hour before bed</td><td>Calm play, then quiet time. Take water away if your vet agrees</td></tr>
<tr><td>Bedtime</td><td>Last potty trip, then straight to the crate or bed</td></tr>
<tr><td>Night</td><td>Quiet potty trip if they wake and cry. No play. Back to bed</td></tr>
</tbody>
</table>

<h2 id="pack">What to have ready before bedtime</h2>
<ul>
<li>A crate or pen set up in a quiet spot near you, with washable bedding.</li>
<li>A safe chew or a soft comfort toy.</li>
<li>A lead, a torch or phone light, and treats near the door for night trips.</li>
<li>An enzymatic cleaner and paper towels in case of accidents.</li>
<li>Your vet's number, and a plan to rest during the day.</li>
</ul>

<h2 id="better">When will it get better?</h2>
<p>Most puppies are noisy on night one, a bit better on night two or three, and much calmer after a week or two. Progress is not a straight line. Keep the routine, keep your voice calm, and remember that crying is communication, not a sign that you are doing it wrong. If you are tired and worried, read our guide to <a href="/blog/puppy-crying-at-night/">what to do when your puppy cries at night</a>, and plan your first week with the <a href="/blog/new-puppy-checklist/">new puppy checklist</a>.</p>
`,
  faqExtra: [
    { q: 'Where should my puppy sleep on the first night?', a: 'In a safe crate or pen close to your bed so they feel less alone and you can hear them. You can move it further away gradually over the next weeks.' },
    { q: 'Should I take water away before bed?', a: 'Many owners remove water about an hour before bedtime to reduce night trips, but ask your vet what is right for your puppy\'s age and size.' }
  ]
});

upgrade('how-to-stop-puppy-biting', {
  readMinutes: 8,
  quick: 'Puppy biting is normal. Pause when teeth touch skin, redirect to a toy, and reward gentle chewing. Keep sessions calm, make sure your puppy is not overtired, and stay consistent. Most puppies become much gentler over the first months.',
  extra: `
<h2 id="age">Puppy biting by age: what to expect</h2>
<table>
<thead><tr><th>Age</th><th>What you may see</th><th>What helps</th></tr></thead>
<tbody>
<tr><td>8 to 12 weeks</td><td>Mouthing everything, sharp little teeth, nipping during play</td><td>Pause, redirect, lots of naps, safe chews</td></tr>
<tr><td>3 to 4 months</td><td>Teething starts, more chewing, still nippy when overtired</td><td>Cold chews, short play, calm quiet time</td></tr>
<tr><td>4 to 6 months</td><td>Teething peak, testing manners, zoomies</td><td>Keep the routine, exercise, training games</td></tr>
<tr><td>6 months and older</td><td>Mouthing usually settles, but adolescent energy can bring setbacks</td><td>Consistency and more structure</td></tr>
</tbody>
</table>

<h2 id="kids">Biting around children and visitors</h2>
<p>Puppies often nip more with excited children. Teach kids to stay calm, stand still and "be a tree", and give them a toy to hold for fetch or tug. Always supervise children and puppies together, and give the puppy breaks in a quiet area. Ask visitors to greet your puppy calmly, and have a chew ready for the greeting.</p>

<h2 id="tug">Is tug a good game?</h2>
<p>Gentle tug can be a good way to teach "take" and "drop" and to use up energy, as long as you control the game. Stop if the puppy grabs your hands, let go and start again calmly, and finish with a reward. If tug makes your puppy very wild, choose calmer games like fetch, scent games and short training sessions instead.</p>

<h2 id="concern">When is biting a concern?</h2>
<p>Ordinary mouthing is not aggression. Talk to your vet or a qualified trainer if your puppy bites hard with stiff body language, growls over food or toys, or bites out of fear. They can look at the whole picture and help you early. See also our guide to <a href="/blog/puppy-crying-at-night/">puppy sleep and nights</a>, because overtired puppies bite more.</p>
`,
  faqExtra: [
    { q: 'Why does my puppy bite more in the evening?', a: 'Overtired puppies often get nippy and wild in the evening. Offer a calm chew, quiet time in the crate or pen, and keep the last hour before bed gentle.' },
    { q: 'Do puppies grow out of biting?', a: 'Most puppies become much gentler as they mature and as teething finishes, especially with steady training, enough rest and safe chews. Keep the routine going through the teething months.' }
  ]
});
