const fs = require('fs'), path = require('path');
const f = path.join(__dirname, '..', 'content', 'posts', 'puppy-crying-at-night.json');
const j = JSON.parse(fs.readFileSync(f, 'utf8'));
let h = j.html;
const a = h.indexOf('<h2>Frequently asked questions</h2>');
const b = h.indexOf('<h2>When to ask a professional</h2>');
if (a < 0 || b < 0) { console.log('markers missing (already upgraded?)'); process.exit(0); }
h = h.slice(0, a) + h.slice(b);
const extra = `
<h2 id="ignore">Should you ignore it or comfort your puppy?</h2>
<p>This is the question every new owner asks, and the honest answer is: it depends on why your puppy is crying. Ignoring a real need (a full bladder, fear, cold) does not teach independence. It teaches your puppy that calling does not work when they really need help. On the other hand, answering every single whimper with play and cuddles can turn night into a social hour.</p>
<ul>
<li><strong>Respond to needs:</strong> potty trip, comfort, safety. Keep it quiet and short.</li>
<li><strong>Wait a few minutes</strong> if your puppy is just protesting and settling. Many puppies quieten on their own.</li>
<li><strong>Stay boring:</strong> low light, soft voice, no play, no treats other than a small reward after a potty trip.</li>
<li><strong>Do not punish.</strong> A scared puppy cannot learn to be calm.</li>
</ul>

<h2 id="age">What to expect by age</h2>
<table>
<thead><tr><th>Age</th><th>Night trips</th><th>What is normal</th></tr></thead>
<tbody>
<tr><td>8 to 10 weeks</td><td>Often 1 to 2</td><td>Crying, restlessness, short sleep stretches</td></tr>
<tr><td>10 to 12 weeks</td><td>Often 1</td><td>Gradually longer stretches, still some crying</td></tr>
<tr><td>3 to 4 months</td><td>0 to 1</td><td>Many settle faster, some regress when routines change</td></tr>
<tr><td>4 to 6 months</td><td>Often none</td><td>Most sleep much longer, occasional setbacks</td></tr>
</tbody>
</table>
<p>These are common patterns, not rules. Every puppy is different, and your vet can advise on your puppy's needs.</p>

<h2 id="three">The first three nights</h2>
<ol>
<li><strong>Night 1:</strong> keep the sleeping spot close, plan a quiet potty trip once or twice, and expect a short, noisy night. Rest in the daytime if you can.</li>
<li><strong>Night 2:</strong> repeat the exact same routine. Small improvements, like a shorter crying spell, count as progress.</li>
<li><strong>Night 3:</strong> keep the routine, stretch the gap between trips by 15 to 30 minutes if the night went well, and celebrate the small wins.</li>
</ol>
<p>Our guide to the <a href="/blog/puppy-first-night-home/">first night at home</a> has a full setup checklist.</p>

<h2 id="comfort">Comfort items that can help</h2>
<p>Some puppies settle faster with a soft blanket that smells of home, a safe chew toy, or a plush toy with a gentle heartbeat or warmth. These can help, but they are not a replacement for a routine and a potty trip. Choose items without small parts, supervise at first, and remove anything your puppy tears apart. Keep the crate comfortable with washable bedding. For crate basics see <a href="/blog/crate-training-a-puppy/">crate training a puppy</a>.</p>

<h2 id="when">How long does the night crying last?</h2>
<p>Many puppies improve in a few days, and most are much calmer within two to four weeks. Progress is rarely a straight line. A new routine, teething, a trip or an illness can bring a short setback. If you keep the routine and the calm responses, the nights become quieter. If your puppy is still distressed after several weeks, or the crying seems to be panic, speak to your vet or a qualified trainer.</p>
`;
const idx = h.indexOf('<h2>When to ask a professional</h2>');
h = h.slice(0, idx) + extra + h.slice(idx);
j.html = h.trim();
j.quick = 'Most puppies cry at night because they need a potty trip, feel lonely, or are not used to the crate yet. Take your puppy out quietly, keep the sleeping spot close and cozy, stay calm and boring, and keep the same routine every night. Most puppies improve within days to a few weeks.';
j.faq = [
  { q: 'How long will my puppy cry at night?', a: 'It varies. Many puppies settle noticeably within the first week, and most are much calmer within two to four weeks. If the crying is not improving or is getting worse, speak to your vet or a qualified trainer.' },
  { q: 'Should I ignore my puppy crying at night?', a: 'Not if there is a real need such as the potty, comfort or safety. A short, calm check helps. Avoid turning the night into play or attention that rewards crying. Respond to needs, stay boring and keep the routine.' },
  { q: 'Is it okay for my puppy to sleep in my room?', a: 'Yes. Many families keep the crate or bed in their bedroom for the first weeks and move it gradually later. Choose what suits your home and keep it consistent.' },
  { q: 'How many times will my puppy need to go out at night?', a: 'Very young puppies often need one or two quiet trips. This usually drops to one and then none as they grow. Your vet can advise on your puppy\'s age and size.' },
  { q: 'Do heartbeat toys help a crying puppy?', a: 'Some puppies find them comforting, but they work best together with a routine and a potty trip. Supervise at first and remove any toy your puppy chews apart.' }
];
j.updated = '2026-10-15';
j.readMinutes = 9;
fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
const words = (j.html.replace(/<[^>]+>/g, ' ') + ' ' + j.faq.map(x => x.q + ' ' + x.a).join(' ')).split(/\s+/).filter(Boolean).length;
console.log('words', words);
