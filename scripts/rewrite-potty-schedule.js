const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const html = `
<p>A puppy potty training schedule is the fastest way to stop accidents. Puppies do not understand rules about where to go, so they learn from a predictable routine: the same trips, the same spot, and a reward every time. This guide gives you a printable-style schedule by age, an hour-by-hour sample day, a night plan and a first-week plan you can copy.</p>
<p><strong>In this guide:</strong> <a href="#why">why a schedule works</a> &middot; <a href="#hold">how long a puppy can hold it</a> &middot; <a href="#day">sample day</a> &middot; <a href="#age">schedule by age</a> &middot; <a href="#night">night schedule</a> &middot; <a href="#week">first week</a> &middot; <a href="#signals">signals</a> &middot; <a href="#accidents">accidents</a> &middot; <a href="#faq">FAQ</a></p>

<h2 id="why">Why a schedule works better than guessing</h2>
<p>A young puppy has a small bladder and very little warning. Waiting until they "ask" means you will miss many chances to reward the right behaviour. A schedule puts you in charge of the timing, so your puppy gets lots of successes outside and very few mistakes inside. Each success makes the next one more likely.</p>
<ul>
<li><strong>Pick one spot.</strong> The smell tells your puppy what this place is for.</li>
<li><strong>Go out often.</strong> Frequent trips beat long gaps every time.</li>
<li><strong>Use a cue word.</strong> Say "go potty" (or "go toilet" if you prefer) calmly while your puppy sniffs.</li>
<li><strong>Reward right away.</strong> Praise and a small treat the moment they finish, outside, not when you are back indoors.</li>
<li><strong>Supervise indoors.</strong> If you cannot watch your puppy, use a crate, pen or a closed-off area. See our <a href="/blog/crate-training-a-puppy/">crate training guide</a>.</li>
</ul>

<h2 id="hold">How long can a puppy hold it?</h2>
<p>Many trainers use a simple rule of thumb: a puppy can usually hold it for about one hour per month of age, plus one, while awake. Treat this as a starting point, not a promise. Excitement, drinking, play and small breeds all shorten the gap.</p>
<table>
<thead><tr><th>Age</th><th>Daytime trip every</th><th>Overnight</th></tr></thead>
<tbody>
<tr><td>8 to 10 weeks</td><td>30 to 60 minutes (plus after meals, naps, play)</td><td>1 to 2 quiet trips</td></tr>
<tr><td>10 to 12 weeks</td><td>1 to 1.5 hours</td><td>1 to 2 quiet trips</td></tr>
<tr><td>3 to 4 months</td><td>About 2 hours</td><td>Often 1 trip</td></tr>
<tr><td>4 to 6 months</td><td>2 to 3 hours</td><td>Many sleep through, some need 1</td></tr>
<tr><td>6 months and older</td><td>3 to 4 hours</td><td>Usually through the night</td></tr>
</tbody>
</table>
<p>Ask your vet about what is right for your individual puppy, especially for very small breeds.</p>

<h2 id="day">A sample day for an 8 to 12 week old puppy</h2>
<p>The times below are an example. Keep the order the same and move the clock times to suit your family.</p>
<table>
<thead><tr><th>Time</th><th>What to do</th></tr></thead>
<tbody>
<tr><td>6:30</td><td>Wake up: straight outside to the potty spot, reward</td></tr>
<tr><td>7:00</td><td>Breakfast, water, then outside again shortly after eating</td></tr>
<tr><td>7:30 to 8:30</td><td>Play and a short training session, outside before nap</td></tr>
<tr><td>8:30 to 10:30</td><td>Nap in the crate or pen, outside the moment they wake</td></tr>
<tr><td>10:30</td><td>Play, short walk in the garden or yard, potty trip</td></tr>
<tr><td>11:30</td><td>Lunch, potty trip after eating</td></tr>
<tr><td>12:00 to 2:00</td><td>Nap, outside on waking</td></tr>
<tr><td>2:00 to 4:00</td><td>Play, training, potty trip every hour</td></tr>
<tr><td>5:00</td><td>Dinner, then potty trip</td></tr>
<tr><td>6:00 to 8:00</td><td>Calm play, family time, potty trip every 45 to 60 minutes</td></tr>
<tr><td>8:00</td><td>Take water away about an hour before bed (if your vet agrees)</td></tr>
<tr><td>10:00</td><td>Last potty trip, then bed</td></tr>
</tbody>
</table>

<h2 id="age">Puppy potty training schedule by age</h2>
<h3>8 to 10 weeks</h3>
<p>Everything is new. Expect a trip every 30 to 60 minutes while awake, plus after every meal, nap and play session. Keep trips short and boring, and stay with your puppy until they go. Accidents are normal at this age, and a few per day is common.</p>
<h3>10 to 12 weeks</h3>
<p>Your puppy starts to hold it a little longer and may show clearer signals. Keep the same routine, start using the cue word as they go, and slowly stretch the gaps by 10 to 15 minutes only when you have had a few accident-free days.</p>
<h3>3 to 4 months</h3>
<p>Many puppies manage about 2 hours. This is also a time when owners relax too early. Keep supervising indoors and keep rewarding outside. Add short alone time in the crate or pen so your puppy learns to settle without needing a trip each time.</p>
<h3>4 to 6 months</h3>
<p>Accidents drop, and some puppies sleep through the night. A growth spurt, a new house, teething or a change in routine can bring a short setback. Go back one step in the schedule for a few days and rebuild.</p>
<h3>6 months and older</h3>
<p>Most dogs can hold it for 3 to 4 hours or more while awake. Keep a regular routine anyway: first thing in the morning, after meals, after play and before bed.</p>

<h2 id="night">The night schedule</h2>
<p>Night training is simple, but it is tiring in the first weeks. The goal is quick, quiet trips with no play.</p>
<ol>
<li><strong>Last trip before bed:</strong> go out, wait, reward, then straight to the sleeping area.</li>
<li><strong>If your puppy wakes and cries:</strong> a young puppy often needs a trip. Carry them out, keep the light low, and say nothing exciting.</li>
<li><strong>Reward quietly:</strong> a soft "good" and a small treat, then back to bed.</li>
<li><strong>No play, no chat:</strong> night trips are for business only.</li>
<li><strong>Stretch gradually:</strong> when your puppy sleeps a bit longer, move the alarm later by 15 to 30 minutes.</li>
</ol>
<p>If your puppy keeps crying even after a trip, read <a href="/blog/puppy-crying-at-night/">what to do when your puppy cries at night</a>, and see our <a href="/blog/puppy-first-night-home/">first night guide</a>.</p>

<h2 id="week">Your first week, day by day</h2>
<table>
<thead><tr><th>Day</th><th>Focus</th></tr></thead>
<tbody>
<tr><td>Day 1</td><td>Show the potty spot first. Take your puppy out every 30 to 45 minutes. Reward every success.</td></tr>
<tr><td>Day 2</td><td>Add the cue word as your puppy goes. Write down meals, naps and trips.</td></tr>
<tr><td>Day 3</td><td>Watch your log: you will see a pattern (usually after meals and naps).</td></tr>
<tr><td>Day 4</td><td>Keep supervising. Use the crate or pen when you cannot watch.</td></tr>
<tr><td>Day 5</td><td>Practise calm trips before play, not after, so your puppy learns "business first".</td></tr>
<tr><td>Day 6</td><td>Try stretching one daytime gap by 10 minutes if there have been no accidents.</td></tr>
<tr><td>Day 7</td><td>Review the log, celebrate the wins, and fix the time of day with the most accidents.</td></tr>
</tbody>
</table>

<h2 id="signals">Learn your puppy's signals</h2>
<p>Most puppies give a short warning before they go. Look for sniffing the floor, circling, whining, suddenly leaving the play, heading to a corner or the door, or standing very still. When you see one, calmly pick up your puppy or clip on a lead and go straight outside. Do not wait for the perfect signal. A trip you did not need costs nothing.</p>

<h2 id="accidents">What to do when accidents happen</h2>
<ul>
<li><strong>Stay calm.</strong> Do not scold or rub the nose in it. Puppies learn to hide, not to go outside.</li>
<li><strong>Interrupt gently</strong> if you catch them mid-way, and carry them out to finish.</li>
<li><strong>Clean properly.</strong> An enzymatic cleaner removes the smell that tells your puppy it is a toilet spot. Test it on a hidden area first.</li>
<li><strong>Find the reason.</strong> A long gap, a missed signal, too much freedom, or a big drink before the trip are the usual causes.</li>
</ul>

<h2>Common mistakes that slow everything down</h2>
<ul>
<li>Too much freedom too soon (a whole house instead of one room).</li>
<li>Rewarding indoors, after coming back, instead of right at the spot.</li>
<li>Long play sessions before a trip, so the puppy forgets why they are outside.</li>
<li>Changing the routine every day.</li>
<li>Scolding after the fact, which teaches fear and not toileting.</li>
<li>Giving up on the log. A simple record shows the pattern within days.</li>
</ul>

<h2>Apartments, bad weather and pads</h2>
<p>If you live in an apartment, plan the quickest route outside, leave early for the first morning trip, and keep a lead and treats by the door. In rain or cold, use a covered or sheltered spot and make the trip short and warm. Pads can be a useful backup for high-rise flats and storms, but they work best as a bridge. Keep them in one spot and move toward the outdoor spot as your puppy grows. Many owners find it simpler to commit to outdoors from the beginning.</p>

<h2>If you work during the day</h2>
<p>Young puppies cannot wait 8 hours. If you are out, plan a helper for midday trips: a family member, neighbour, friend or a dog walker. Keep the puppy in a safe, small area with water and a chew, and use the same cue and spot when the helper takes them out. See our guide to <a href="/blog/puppy-schedule-when-working-full-time/">a puppy schedule when you work full time</a> once your puppy is a little older, and remember that very young puppies should not be left alone for long periods.</p>
<h2>Rewards that work best</h2>
<ul>
<li><strong>Small, soft treats</strong> that your puppy can swallow in a second, so the reward arrives while they are still outside.</li>
<li><strong>Calm praise</strong> in a happy, quiet voice. Big excitement can interrupt a puppy who has not finished.</li>
<li><strong>A short, fun reward</strong> after the trip, such as a game or a sniff walk. Going potty is what earns the fun, not the other way around.</li>
</ul>
<h2>Teaching your puppy to tell you</h2>
<p>Once your puppy goes outside reliably, you can teach a simple signal. Hang a small bell by the door at nose height, touch your puppy's nose to the bell before every trip, and open the door right after the ring. After a few weeks many dogs ring on their own. Keep taking them out on a schedule anyway, because a puppy that rings once is not always reliable.</p>
<h2>New places, visitors and travel</h2>
<p>A new place can undo some of the progress. When you visit friends or family, take your puppy out as soon as you arrive, then every 30 to 60 minutes. Bring a small bag with treats, waste bags, a lead and an enzymatic cleaner. Choose one spot at the new place and use the same cue word.</p>
<h2>When to ask your vet</h2>
<p>Talk to your vet if your puppy is straining, going very often in small amounts, has blood in the urine, drinks far more than usual, or seems to be in pain. These can be signs of a health problem and not a training problem. This guide is general information and does not replace veterinary advice.</p>

<h2>Keep a simple log</h2>
<p>A written log of meals, naps and trips shows your puppy's natural rhythm in a few days. The free New Puppy Survival Guide includes printable trackers and a 14-day plan, and our <a href="/blog/puppy-potty-training-timeline/">potty training timeline</a> shows what progress to expect week by week. Getting ready to bring a puppy home? Start with the <a href="/blog/new-puppy-checklist/">new puppy checklist</a>.</p>
`;
const faq = [
  { q: 'How often should I take my puppy out to potty?', a: 'Young puppies (8 to 10 weeks) usually need a trip every 30 to 60 minutes while awake, plus after meals, naps and play. The gaps grow as your puppy gets older. Your vet can advise on your individual puppy.' },
  { q: 'How long does it take to potty train a puppy?', a: 'Many puppies show good progress in a few weeks, but full reliability often takes several months. Age, breed, consistency and your home all matter. See our <a href="/blog/puppy-potty-training-timeline/">potty training timeline</a>.' },
  { q: 'Should I wake my puppy up at night to go potty?', a: 'Very young puppies often need one or two night trips. Many owners set a quiet alarm for the first weeks and move it later as the puppy sleeps longer. If your puppy sleeps through calmly, ask your vet before skipping trips for a very young puppy.' },
  { q: 'Are puppy pads a good idea?', a: 'Pads can help in apartments or very bad weather, but they can slow outdoor training if used long term. Use them as a bridge and keep them in one spot, then move toward the outdoor area.' },
  { q: 'Why does my puppy pee right after coming inside?', a: 'The puppy was probably distracted outside. Keep trips short and calm, wait quietly until they go, reward them there, and supervise closely for a short time after you come back in.' },
  { q: 'Should I punish my puppy for accidents?', a: 'No. Punishment teaches puppies to hide when they go. Clean up calmly, review the schedule and reward the next success outside.' }
];
const orig = require(path.join(root, 'build', 'posts.js')).find(x => x.slug === 'puppy-potty-training-schedule');
const j = {
  draft: false,
  slug: 'puppy-potty-training-schedule',
  title: 'Puppy Potty Training Schedule by Age (With a Sample Day)',
  seoTitle: 'Puppy Potty Training Schedule by Age',
  description: 'A clear puppy potty training schedule by age: how often to go out, a sample day, a night plan and a first-week plan. Simple, positive and beginner friendly.',
  excerpt: 'A simple puppy potty training schedule by age, with a sample day, a night plan and a first-week plan.',
  category: orig.category,
  date: orig.date,
  updated: '2026-10-15',
  readMinutes: 11,
  image: orig.image,
  imageAlt: orig.imageAlt,
  midImage: '/assets/blog/potty-when-to-go-out.jpg',
  midImageAlt: 'Infographic: the five moments to take a puppy out to potty',
  quick: 'Take a young puppy out every 30 to 60 minutes while awake and after every meal, nap and play session, then reward right away at the same spot. Stretch the gaps slowly as your puppy grows, and plan one or two quiet night trips for the first weeks.',
  faq,
  html: html.trim()
};
const words = (html.replace(/<[^>]+>/g, ' ') + ' ' + faq.map(x => x.q + ' ' + x.a).join(' ')).split(/\s+/).filter(Boolean).length;
fs.writeFileSync(path.join(root, 'content', 'posts', 'puppy-potty-training-schedule.json'), JSON.stringify(j, null, 2) + '\n');
console.log('words', words, 'seoTitle', j.seoTitle.length);
