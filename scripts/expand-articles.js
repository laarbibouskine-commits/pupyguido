// Writes expanded versions of 3 early articles into content/posts/*.json (JSON overrides build/posts.js).
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const base = require(path.join(ROOT, 'build', 'posts.js'));
const out = {};

out['puppy-crying-at-night'] = {
  seoTitle: 'Puppy Crying at Night? 7 Things to Check',
  description: 'A new puppy crying at night is normal. Check these 7 common reasons, then follow a calm bedtime routine that helps most puppies settle.',
  excerpt: 'Crying on the first nights is very common. Here are 7 things to check and a calm routine that helps.',
  html: `
<p>It is 2 a.m., the house is dark, and your new puppy is crying. Your heart sinks, and a small voice in your head asks whether you made a mistake. You did not. Crying on the first nights is one of the most common things new puppy parents go through, and it almost always gets better.</p>
<p>Your puppy has just left their mother and littermates. Every smell, sound and surface is new, and for the first time in their life they may be sleeping alone. The goal is not to stop the crying at all costs. It is to work out why your puppy is crying and respond calmly. Here are seven things to check, in the order that most often solves it.</p>

<h2>1. Do they need to go potty?</h2>
<p>Young puppies cannot hold their bladder all night. If the crying sounds urgent or restless, or your puppy is circling or sniffing the floor, take them out quietly. Keep the lights low, use the same spot and the same calm word each time, and skip the play. Back to bed straight after.</p>
<p>It helps to take them out right before bed and to think of one or two planned night trips for the first weeks. A planned trip is calmer than a rushed one, and you stay in charge of the routine rather than reacting to every sound.</p>

<h2>2. Are they lonely?</h2>
<p>Puppies are social animals, and a silent room can feel very big. A sleeping spot near your bed for the first few nights can help a lot. Some owners place the crate in the bedroom, then move it a little further each week as the puppy gets more confident.</p>
<p>A calm hand through the crate door, or simply hearing your voice say "settle", is often enough. You are not creating a bad habit by being close during the first nights. You are building trust.</p>

<h2>3. Is the temperature comfortable?</h2>
<p>Check that the sleeping area is not too hot or too cold, away from drafts and direct heat. Make sure the bedding is safe and cannot be chewed up and swallowed. If your puppy keeps pushing the blanket away, they may simply be warm.</p>

<h2>4. Are they overtired or overstimulated?</h2>
<p>An overtired puppy often cries and bites more, just like an overtired toddler. If the evening was busy with visitors, play or car rides, settling can be hard. Keep the last hour before bed calm: quiet cuddles, no wild play, a last potty break, then lights down.</p>
<p>Daytime naps matter just as much. Puppies need a lot of sleep, and a puppy who missed their naps will often have a harder night.</p>

<h2>5. Is the crate a happy place?</h2>
<p>If the crate was introduced suddenly, it can feel scary. Feed meals near or inside it, toss in a treat, and keep early sessions short and positive. Never use the crate as punishment. If your puppy is truly panicking in the crate, go back a step and make it a pleasant place before expecting a full night.</p>

<h2>6. Are they hungry or thirsty?</h2>
<p>Follow the feeding schedule recommended by your vet or breeder. Fresh water should be available during the day, and your vet can advise on evening water and night feeding for your puppy's age and size. A very small puppy may have different needs from a larger one, so check rather than guess.</p>

<h2>7. Could something be wrong?</h2>
<p>If the crying is unusual, constant, high-pitched, or comes with vomiting, diarrhea, limping, a swollen belly or other signs of illness, contact your veterinarian. Trust your instincts: you know when something feels different.</p>

<h2>What different sounds can mean</h2>
<table>
<thead><tr><th>What you hear</th><th>What it often means</th><th>What to try</th></tr></thead>
<tbody>
<tr><td>Short whimpers when you leave the room</td><td>Mild loneliness</td><td>Stay calm, wait a moment, then reassure quietly</td></tr>
<tr><td>Restless, pacing, sniffing</td><td>Needs a potty trip</td><td>Quiet trip outside, no play</td></tr>
<tr><td>Loud, building crying at bedtime</td><td>Not used to the crate or being alone</td><td>Move the crate closer, add a treat, go slower</td></tr>
<tr><td>Sudden, sharp cry or panic</td><td>Discomfort or fear</td><td>Check safety and comfort, call the vet if unusual</td></tr>
</tbody>
</table>

<h2>A simple calm bedtime routine</h2>
<ol>
<li>Dinner at the same time each evening.</li>
<li>A short, gentle play session, then quiet time.</li>
<li>Last potty break right before bed.</li>
<li>Lights down, same bed, same cozy spot every night.</li>
<li>If they wake and need to go out, keep it boring: potty, then back to bed.</li>
</ol>
<p>Repeating the same steps in the same order helps your puppy learn that bedtime is predictable and safe. In a few days many puppies start to settle faster.</p>

<h2>What not to do</h2>
<p>Avoid scolding or punishing a crying puppy. Fear makes settling harder, and a frightened puppy is not a learning puppy. Try not to turn every cry into a play session either, since late-night games teach the wrong lesson. Consistency and patience work better, and most puppies improve within days to a few weeks.</p>

<h2>Frequently asked questions</h2>
<h3>How long will my puppy cry at night?</h3>
<p>It varies. Many puppies settle noticeably within the first week, and most are much calmer within a few weeks. If the crying is not improving, or it is getting worse, speak to your vet or a qualified trainer.</p>
<h3>Should I ignore the crying?</h3>
<p>Not if there is a real need such as the potty, comfort or safety. A short, calm check can help. What you want to avoid is turning the night into play or attention that rewards the crying. Respond to needs, stay boring, and keep the routine.</p>
<h3>Is it okay to have my puppy sleep in my room?</h3>
<p>Yes. Many families do this for the first weeks and move the crate gradually later. Choose what suits your home, and keep it consistent.</p>

<h2>When to ask a professional</h2>
<p>If your puppy is distressed for long periods, will not eat, seems unwell, or you are worn out and worried, talk to your veterinarian or a qualified trainer. Asking for help early is a good sign, not a failure.</p>
<p>Want the full first-week plan, with a night routine and checklists? <a href="/#signup">Get the free New Puppy Survival Guide</a>. If the hard nights are wearing you down, our calm 30-day plan may help too: <a href="/shop/puppy-blues-rescue-plan/">The Puppy Blues Rescue Plan</a>.</p>
`
};

out['how-to-stop-puppy-biting'] = {
  seoTitle: 'How to Stop Puppy Biting: 3-Step Method',
  description: 'Puppy biting is normal but painful. Learn why puppies bite and a simple three-step method (pause, redirect, reward) that works without punishment.',
  excerpt: 'Sharp little teeth are normal. A gentle three-step method that works without punishment.',
  html: `
<p>Sharp little teeth on your hands, ankles and trouser legs can make a new puppy feel like a tiny shark. It hurts, it is frustrating, and it can make you wonder whether something is wrong with your puppy. Nothing is. Mouthing is a normal part of how puppies explore and a normal part of teething, and it is very trainable with a calm, consistent approach.</p>

<h2>Why do puppies bite?</h2>
<p>Understanding the reason helps you pick the right response. Most puppy biting comes from a few simple causes:</p>
<ul>
<li><strong>Exploring.</strong> Puppies use their mouths to learn about the world, much like toddlers use their hands.</li>
<li><strong>Teething.</strong> Chewing can feel good on sore gums while baby teeth are coming out and adult teeth are coming in.</li>
<li><strong>Play.</strong> Puppies play with each other using their mouths, and your hands can look like a toy.</li>
<li><strong>Overtired or overexcited.</strong> Biting often spikes late in the day, especially when a puppy has missed naps.</li>
<li><strong>Attention.</strong> If biting makes you squeal, move or chase, some puppies learn that it works.</li>
</ul>

<h2>What is normal, and how long does it last?</h2>
<p>Mouthy behavior is very common in the first months. Many puppies start losing their baby teeth at around four to six months, and chewing often continues for a while after that, though it differs from puppy to puppy. With consistent training, most puppies learn to be much gentler over weeks, not days. If you are unsure whether your puppy's biting is within the normal range, your vet or a qualified trainer can help.</p>

<h2>The method: Pause, Redirect, Reward</h2>
<h3>Step 1: Pause</h3>
<p>The moment teeth touch skin, stay calm and stop the game. Go still, or stand up and step away for a few seconds. No shouting, no hitting, no pinning the puppy down. The message is simple: teeth on skin makes the fun stop.</p>
<h3>Step 2: Redirect</h3>
<p>Offer an appropriate chew toy or tug toy. This shows your puppy what they <em>can</em> bite. Keep toys within reach in every room so you are never caught empty-handed.</p>
<h3>Step 3: Reward</h3>
<p>When your puppy chews the toy, praise warmly and give a treat when appropriate. Puppies repeat what pays off, so make the right choice the most rewarding one.</p>
<p>You will repeat this many times, and that is fine. Each calm repetition teaches the same lesson.</p>

<h2>What to do in common situations</h2>
<table>
<thead><tr><th>Situation</th><th>Try this</th></tr></thead>
<tbody>
<tr><td>Puppy bites your hands during play</td><td>Pause, hand a toy, restart the game when they chew the toy</td></tr>
<tr><td>Puppy grabs your trousers or socks</td><td>Stand still like a tree, then redirect to a toy</td></tr>
<tr><td>Puppy gets wild in the evening</td><td>Calm quiet time, a chew in the pen or crate, early bedtime</td></tr>
<tr><td>Puppy bites the leash</td><td>Stop, offer a treat, reward walking calmly beside you</td></tr>
<tr><td>Children get nipped</td><td>Adults supervise, kids stay calm, give toys instead of hands</td></tr>
</tbody>
</table>

<h2>Make it easier</h2>
<ul>
<li>Keep several chew toys within reach in every room.</li>
<li>Plan naps. A well-rested puppy bites less.</li>
<li>Keep play sessions short and end them before your puppy gets wild.</li>
<li>Give frozen or safe chew options for teething, chosen to suit your puppy's size and age.</li>
<li>Use calm voices and slow movements around a mouthy puppy.</li>
<li>Give daily mental exercise such as sniffing walks and simple puzzle games, since a tired mind bites less.</li>
</ul>

<h2>Common mistakes that make biting worse</h2>
<ol>
<li>Rough play that winds the puppy up.</li>
<li>Waving hands or feet in front of the puppy's face.</li>
<li>Punishing, which can create fear and mistrust.</li>
<li>Inconsistency: allowing biting sometimes and not other times.</li>
<li>Skipping rest and mental exercise.</li>
<li>Letting children play unsupervised with a mouthy puppy.</li>
</ol>

<h2>Frequently asked questions</h2>
<h3>Should I hold my puppy's mouth closed?</h3>
<p>No. Holding the mouth or pushing a hand down the throat can frighten a puppy and damage trust. Pause, redirect and reward instead.</p>
<h3>Is yelping like another puppy a good idea?</h3>
<p>A sharp sound can startle some puppies and excite others, so it does not work for every puppy. A calm pause and a toy is usually more reliable.</p>
<h3>When does biting stop?</h3>
<p>Most puppies become much gentler over the first months with steady training and plenty of rest. Teething and adolescence can bring phases of more chewing, so keep your routine going.</p>

<h2>When to ask a professional</h2>
<p>If biting is intense, comes with growling or stiff body language, or you are worried about safety, ask a qualified trainer or your veterinarian for help. Getting support early makes everything easier.</p>
<p>The full 7-day bite plan is part of the PuppyGuido system. <a href="/#signup">Start with the free guide</a>. If you also need help with sleepless nights, see our guide to <a href="/blog/puppy-crying-at-night/">puppy crying at night</a>.</p>
`
};

out['new-puppy-checklist'] = {
  seoTitle: 'New Puppy Checklist: 10 Essentials to Buy',
  description: 'Your new puppy checklist: the 10 essentials to have ready before day one, what you can skip for now, and how to puppy-proof your home.',
  excerpt: 'The 10 essentials to have ready before day one, and what can wait.',
  html: `
<p>Preparing before your puppy arrives makes the first days calmer for everyone, including the puppy. The pet store can feel overwhelming, with aisles of gadgets promising to solve every problem. You really only need a handful of simple, safe items to start. Use this list as a starting point, then adjust for your puppy's size, age and your home.</p>

<h2>The 10 essentials</h2>
<ol>
<li><strong>A crate or safe space.</strong> Size it for your puppy's adult size with a divider if needed, so it is cozy now and fits later. This is where your puppy will rest and learn to settle.</li>
<li><strong>Bed and blanket.</strong> Washable and safe, with nothing that can be swallowed. Expect the first bed to get chewed, so keep it simple.</li>
<li><strong>Food and water bowls.</strong> Stainless steel or ceramic are easy to clean and harder to chew than plastic.</li>
<li><strong>Puppy food.</strong> Ask your breeder, shelter or vet which food to start with, and keep it the same for the first weeks. Change food slowly, not overnight.</li>
<li><strong>Collar and ID tag.</strong> A light adjustable collar with your phone number. Check the fit often, because puppies grow fast.</li>
<li><strong>Leash.</strong> A simple, light leash is enough to start.</li>
<li><strong>Chew toys.</strong> A mix of textures for teething, chosen to suit your puppy's size, with no small parts that can break off.</li>
<li><strong>Treats.</strong> Small, soft treats for training, so you can reward often without overfeeding.</li>
<li><strong>Grooming basics.</strong> A soft brush and puppy-safe shampoo, plus nail clippers when you are ready.</li>
<li><strong>Cleaning supplies.</strong> Enzymatic cleaner, paper towels, waste bags, and pads if you use them. Accidents are part of learning.</li>
</ol>

<h2>Puppy-proof first</h2>
<p>Before your puppy arrives, get down to puppy height and look around. Check cords, cleaning products, medicines, small objects, toxic plants, trash, stairs and any gaps in the fence. Move anything valuable or dangerous out of reach, and set up one safe area, such as a pen or a small room, for when you cannot supervise. Safe home, calmer puppy, easier routine.</p>

<h2>A first-night kit</h2>
<p>The first night goes better when everything is within reach. Put these in one spot before you collect your puppy:</p>
<ul>
<li>A towel and spare bedding, in case of car sickness or accidents.</li>
<li>A few treats and a chew toy.</li>
<li>Water and a clean bowl.</li>
<li>Waste bags and cleaner.</li>
<li>Your vet's phone number and your breeder's or shelter's paperwork.</li>
</ul>

<h2>What to ask your breeder, shelter or vet</h2>
<ul>
<li>What food and feeding times has the puppy been on?</li>
<li>What vaccinations and treatments have been done, and what is next?</li>
<li>Has the puppy been crate or pen trained, or used pads?</li>
<li>When should we book the first vet visit?</li>
</ul>
<p>Write the answers down. They make the first weeks much smoother.</p>

<h2>What can wait</h2>
<p>You do not need everything on day one. Special gear, extra toys, outfits and fancy beds can wait until you know your puppy's habits. Many things you buy in a rush turn out to be unused. Start with the basics, watch what your puppy actually needs, then add.</p>

<h2>Plan the first week</h2>
<p>Know your vet, book the first visit, and have your daily routine written down: feeding times, potty trips, naps and bedtime. Agree the house rules with everyone who lives with you, so the puppy gets the same messages from every person. A simple routine does more for a new puppy than any gadget.</p>

<h2>Frequently asked questions</h2>
<h3>How much should I spend before my puppy comes home?</h3>
<p>Prices vary a lot between countries and stores, so set a budget first, buy the essentials, and add items over time. Reliable, simple and safe is better than expensive.</p>
<h3>Do I need a crate?</h3>
<p>Many families find a crate or pen useful for rest, safety and potty training, but you can choose a method that suits your home. If you use one, make it a positive place.</p>
<h3>Which toys are safest?</h3>
<p>Choose toys that suit your puppy's size, have no small detachable parts, and supervise play. Replace anything that is damaged.</p>

<p>The free PuppyGuido guide includes printable checklists and a 14-day plan. <a href="/#signup">Get your free copy</a>. Ready to go deeper? See <a href="/blog/how-to-prepare-for-a-puppy-checklist/">how to prepare for a puppy</a> and our <a href="/blog/puppy-first-night-home/">first night guide</a>.</p>
`
};

const extras = {};
extras['how-to-stop-puppy-biting'] = `
<h2>A day that makes biting easier</h2>
<p>Biting is much easier to manage when the day has a rhythm. A sample day for a young puppy might look like this:</p>
<ol>
<li><strong>Morning:</strong> potty, breakfast, a short play session, then a nap.</li>
<li><strong>Midday:</strong> potty, a sniffing walk or simple puzzle, a chew, then rest.</li>
<li><strong>Afternoon:</strong> short training games with treats, then another nap.</li>
<li><strong>Evening:</strong> gentle play, a chew in a calm spot, potty and bedtime.</li>
</ol>
<p>Puppies often need many more hours of sleep than owners expect. If biting is getting worse in the evening, an earlier, calmer wind-down is often the fix, not more play.</p>

<h2>Games that teach gentle mouths</h2>
<ul>
<li><strong>Trade.</strong> Offer a treat in exchange for what is in the mouth, then give the item back when appropriate. Your puppy learns that giving things up is rewarding.</li>
<li><strong>Hand feeding.</strong> Feed a few meals from your hand so your puppy practices taking food gently.</li>
<li><strong>Tug with rules.</strong> Short games with a toy, and a calm pause whenever teeth touch your hand. Start again when the puppy lets go.</li>
<li><strong>Name and treat.</strong> Say your puppy's name, reward eye contact, and build a habit of checking in with you.</li>
</ul>

<h2>Teething relief ideas</h2>
<p>If your puppy is chewing everything, soothe their gums safely. Many owners use chilled, not frozen-solid, chew toys, a damp knotted cloth under supervision, or a rubber chew designed for puppies. Avoid anything that can splinter or break into pieces, and ask your vet before offering frozen items to very small puppies. Supervise chewing, and replace worn toys.</p>
`;
extras['new-puppy-checklist'] = `
<h2>Shop in three steps</h2>
<table>
<thead><tr><th>When</th><th>What to buy</th></tr></thead>
<tbody>
<tr><td>Before day one</td><td>Crate or pen, bed, bowls, food, collar and tag, leash, a few chew toys, cleaning supplies</td></tr>
<tr><td>First week</td><td>Treats for training, grooming brush, a second set of bedding, baby gates if you need them</td></tr>
<tr><td>First month</td><td>Training extras, a harness if you prefer one, more toys once you know what your puppy likes</td></tr>
</tbody>
</table>

<h2>A sample first day</h2>
<p>A calm first day helps your puppy settle. A simple plan might be: a quiet arrival and a potty trip, a small meal and water, a short look around one room, a long nap in the crate or pen, another potty trip, quiet time with the family, a last potty break, and bed. Keep visitors to a minimum for the first few days. Every puppy is different, so adjust to what your puppy shows you.</p>

<h2>Foods and plants to keep away</h2>
<p>Some common household items are harmful to dogs. Keep chocolate, grapes and raisins, onions, garlic, xylitol sweeteners and alcohol well out of reach, and check that houseplants and garden plants are safe for dogs before your puppy explores them. If your puppy eats something you are unsure about, call your veterinarian or a local animal poison helpline straight away.</p>

<h2>Plan the budget</h2>
<p>Besides the shopping list, think about regular costs: food, vet visits, vaccinations, parasite prevention, training classes, insurance if you choose it, and boarding or pet sitting for travel. Setting a simple monthly budget and a small emergency fund makes the first year less stressful.</p>

<h2>The day before your puppy comes home</h2>
<ul>
<li>Set up the crate or pen in a quiet, central spot, away from drafts and direct heat.</li>
<li>Put bowls, bedding and a few toys in place so the space feels ready.</li>
<li>Do a final puppy-proof walk-through at puppy height.</li>
<li>Charge your phone, save your vet's number and plan the car trip home, ideally with a second adult to comfort the puppy.</li>
<li>Rest. A calm, rested owner makes a calmer first night.</li>
</ul>
`;
for (const [slug, add] of Object.entries(extras)) {
  out[slug].html = out[slug].html.replace('<h2>Frequently asked questions</h2>', add + '\n<h2>Frequently asked questions</h2>');
}

for (const [slug, over] of Object.entries(out)) {
  const b = base.find(p => p.slug === slug);
  if (!b) throw new Error('missing base ' + slug);
  const post = {
    draft: false,
    slug,
    title: b.title,
    description: over.description,
    excerpt: over.excerpt,
    seoTitle: over.seoTitle,
    category: b.category,
    tags: [],
    date: b.date,
    readMinutes: Math.max(5, Math.round(over.html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 200)),
    image: b.image,
    imageAlt: b.imageAlt,
    html: over.html.trim()
  };
  fs.writeFileSync(path.join(ROOT, 'content', 'posts', slug + '.json'), JSON.stringify(post, null, 2) + '\n');
  console.log(slug, 'words:', post.html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length, '| desc', post.description.length, '| seo', post.seoTitle.length);
}
