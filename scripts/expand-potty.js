const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const base = require(path.join(ROOT, 'build', 'posts.js')).find(p => p.slug === 'puppy-potty-training-schedule');
const html = `
<p>It is the third puddle of the morning, and you are wondering whether your puppy will ever get it. They will. Potty training is mostly about management and consistency, not about the puppy being "stubborn". Puppies do not understand rules about where to go. They learn from routine, supervision and rewards, and a clear schedule is the quickest way to give them all three.</p>

<h2>The basics</h2>
<ul>
<li><strong>Pick one spot.</strong> Take your puppy to the same area each time. The smell tells them what this place is for.</li>
<li><strong>Go out often.</strong> Young puppies need frequent trips, often every 1 to 2 hours during the day. Small bladders and big drinks add up fast.</li>
<li><strong>Use a cue word.</strong> Say it calmly while your puppy sniffs and goes, so the word starts to mean "now is the time".</li>
<li><strong>Reward right after.</strong> Praise and a treat the moment they finish, not when you are back inside. Timing is everything.</li>
<li><strong>Stay with them.</strong> Standing quietly outside helps your puppy focus, and lets you reward on the spot.</li>
</ul>

<h2>When to take your puppy out</h2>
<ol>
<li>First thing in the morning.</li>
<li>After meals (usually within a short time after eating).</li>
<li>After waking from naps.</li>
<li>After play sessions.</li>
<li>Before bed, and during the night if needed for very young puppies.</li>
<li>Any time you see the signals described below.</li>
</ol>

<h2>A sample day</h2>
<table>
<thead><tr><th>Time</th><th>What to do</th></tr></thead>
<tbody>
<tr><td>Wake up</td><td>Straight outside to the potty spot, reward</td></tr>
<tr><td>Breakfast</td><td>Meal, then potty break shortly after</td></tr>
<tr><td>Mid-morning</td><td>Play, short training, potty break, nap</td></tr>
<tr><td>Midday</td><td>Meal, potty, supervised time</td></tr>
<tr><td>Afternoon</td><td>Nap, potty on waking, play</td></tr>
<tr><td>Evening</td><td>Meal, potty, calm time</td></tr>
<tr><td>Bedtime</td><td>Last potty break, then sleep</td></tr>
</tbody>
</table>
<p>This is a general example. Adjust to your puppy's age and your vet's advice.</p>

<h2>How often does a puppy need to go?</h2>
<p>The honest answer is: more often than you expect, and it changes quickly as your puppy grows. Very young puppies may need a trip every hour or two while awake, plus after every nap and meal. As they get older, the gaps stretch. Use age as a rough guide only, because breed, size and diet all matter. If you are unsure what is normal for your puppy, your vet can give age-specific advice.</p>

<h2>Learn the signals</h2>
<p>Sniffing the floor, circling, whining, suddenly wandering off or heading to the door can all mean "I need to go". When you see them, calmly take your puppy out, rather than waiting to see what happens. Many accidents are simply a missed signal or a gap that was a little too long.</p>

<h2>Management makes it easier</h2>
<p>Every unsupervised moment is a chance for an accident, so it helps to set your puppy up for success.</p>
<ul>
<li><strong>Keep them in sight.</strong> Use a leash indoors or a baby gate so you can see the signals.</li>
<li><strong>Use a crate or pen</strong> when you cannot watch. Most puppies avoid soiling the space where they sleep, which helps with timing.</li>
<li><strong>Do not give the whole house at once.</strong> Open up more space as reliability grows.</li>
<li><strong>Take them straight out</strong> when they come out of the crate, every time.</li>
</ul>

<h2>The night plan</h2>
<p>Very young puppies often need one or two trips at night. Keep it boring: lights low, no play, quiet voice, potty, then straight back to bed. Over the weeks, many puppies can go longer between trips. If your puppy is crying at night and you are not sure why, see our guide to <a href="/blog/puppy-crying-at-night/">puppy crying at night</a>.</p>

<h2>Troubleshooting</h2>
<table>
<thead><tr><th>What you see</th><th>What may be happening</th><th>What to try</th></tr></thead>
<tbody>
<tr><td>Accident right after coming inside</td><td>Too distracted outside, or the trip was rushed</td><td>Stay out calmly until they go, then reward</td></tr>
<tr><td>Goes behind the sofa</td><td>Too much unsupervised freedom</td><td>Use a pen or leash, clean with an enzymatic cleaner</td></tr>
<tr><td>Will not go outside in rain or cold</td><td>Dislikes the weather</td><td>Choose a sheltered spot, keep trips short, reward warmly</td></tr>
<tr><td>Frequent small puddles</td><td>Excitement or a health issue</td><td>Calm greetings, and ask your vet if it continues</td></tr>
</tbody>
</table>

<h2>What to do about accidents</h2>
<ul>
<li>Do not scold or rub the puppy's nose in it. It teaches fear, not toileting.</li>
<li>Clean with an enzymatic cleaner so the smell does not draw them back.</li>
<li>Ask yourself what you missed: a long gap, a missed signal, too much freedom.</li>
<li>Move on calmly. Tomorrow is a new day, and puppies learn through many small repetitions.</li>
</ul>

<h2>Track progress</h2>
<p>A simple log of meals, naps and potty breaks quickly shows your puppy's natural rhythm, and makes it easy to plan the next day. The PuppyGuido workbook includes trackers for exactly this.</p>

<h2>Frequently asked questions</h2>
<h3>How long does potty training take?</h3>
<p>It varies between puppies, from a few weeks to a few months to be reliable. Consistency, supervision and your puppy's age all play a part.</p>
<h3>Are puppy pads a good idea?</h3>
<p>They can help in some homes, such as upper-floor apartments or very bad weather, but they can also slow the move outdoors. Choose one method and stay consistent.</p>
<h3>Should I wake my puppy at night to go out?</h3>
<p>Very young puppies often need a night trip. Ask your vet what is right for your puppy's age, and plan one or two quiet trips rather than waiting for crying.</p>

<h2>When to ask a professional</h2>
<p>If your puppy is struggling to hold on, is straining, has blood in the urine, or seems unwell, contact your veterinarian. If you are exhausted and stuck, a qualified trainer can build a plan with you.</p>
<p>Ready for the full plan? <a href="/#signup">Get the free New Puppy Survival Guide</a>. Not sure what to buy first? See the <a href="/blog/new-puppy-checklist/">new puppy checklist</a>.</p>
`.trim();
const post = {
  draft: false,
  slug: base.slug,
  title: base.title,
  description: 'A clear puppy potty training schedule: when to take your puppy out, what to reward, a sample day and how to handle accidents calmly.',
  excerpt: 'A simple daily potty routine, a sample day, and how to handle accidents calmly.',
  seoTitle: 'Puppy Potty Training Schedule: Daily Routine',
  category: base.category,
  tags: [],
  date: base.date,
  readMinutes: Math.max(5, Math.round(html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 200)),
  image: base.image,
  imageAlt: base.imageAlt,
  html
};
fs.writeFileSync(path.join(ROOT, 'content', 'posts', base.slug + '.json'), JSON.stringify(post, null, 2) + '\n');
console.log('potty words:', html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length, '| desc', post.description.length, '| seo', (post.seoTitle + ' | PuppyGuido').length);

// first night: shorter SEO title
const fn = path.join(ROOT, 'content', 'posts', 'puppy-first-night-home.json');
const j = JSON.parse(fs.readFileSync(fn, 'utf8'));
j.seoTitle = 'Puppy First Night: What to Expect and Do';
fs.writeFileSync(fn, JSON.stringify(j, null, 2) + '\n');
console.log('first night seo+brand:', (j.seoTitle + ' | PuppyGuido').length);

// page descriptions / contact title
const bf = path.join(ROOT, 'build', 'build.js');
let b = fs.readFileSync(bf, 'utf8');
const rep = (from, to) => { if (!b.includes(from)) throw new Error('missing: ' + from.slice(0, 50)); b = b.replace(from, () => to); };
rep("description: 'Practical puppy essentials, printable trackers and guides picked for new puppy parents.'", "description: 'Shop practical puppy essentials, printable trackers and calm, step-by-step guides chosen to help new puppy parents through the first weeks.'");
rep("title: 'Contact PuppyGuido',", "title: 'Contact PuppyGuido | Questions, Feedback, Partnerships',");
rep("description: 'Questions, feedback or partnership ideas? Contact the PuppyGuido team by email.'", "description: 'Questions, feedback or partnership ideas? Contact the PuppyGuido team by email and we will get back to you as soon as we can.'");
rep("description: 'How PuppyGuido collects, uses and protects your personal information.'", "description: 'How PuppyGuido collects, uses and protects your personal information, including the free guide sign-up, cookies and your rights.'");
rep("description: 'The terms that apply when you use the PuppyGuido website and free guide.'", "description: 'The terms that apply when you use the PuppyGuido website, free guide and printable resources, including disclaimers and affiliate links.'");
fs.writeFileSync(bf, b);
console.log('build.js patched');
