# Expands the 5 new articles to 1,200+ words (facts from PDSA, AKC, ASPCA, Kennel Club pages already cited)
# and adds internal "backlinks" from older articles. Run once; guarded by marker comments.
import json, os, re
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'content', 'posts')
def load(s): return json.load(open(os.path.join(P, s + '.json'), encoding='utf-8'))
def save(p): json.dump(p, open(os.path.join(P, p['slug'] + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
SIGN = '<p>If you want a calm, practical list'
def add(slug, marker, html, faq=()):
    p = load(slug)
    if '<!--x1-->' in p['html']: return print('skip', slug)
    assert marker in p['html'], (slug, marker)
    p['html'] = p['html'].replace(marker, '<!--x1-->' + html + marker, 1)
    p['faq'] += [dict(q=q, a=a) for q, a in faq]
    save(p)

add('puppy-teething-timeline-and-safe-chews', '<h2>How to ease teething at home</h2>', '''<h2>How to choose a safe chew toy</h2>
<p>With so many toys on the shelf, it helps to have a checklist. PDSA's vets say safe chew toys are:</p>
<ul>
<li><strong>Designed for chewing.</strong> Most soft toys, tug ropes, tennis balls and frisbees are only meant for supervised play and should not be left for chewing, because they do not last under a puppy's jaws and can be dangerous.</li>
<li><strong>Soft enough to dent with your fingernail.</strong> PDSA says anything harder can cause fractured teeth or bleeding gums, especially for strong chewers.</li>
<li><strong>Bigger than your puppy's throat.</strong> The whole toy should not fit completely in the mouth, so check the size guide and move up as your puppy grows.</li>
</ul>
<p>Rotate toys every few days, because a "new" toy is more interesting than the same old one. Look over each toy daily, and throw away anything cracked, chewed into pieces or coming apart.</p>
<h2>Chew treats: what to check first</h2>
<p>Chew treats are different from toys, and PDSA is cautious about them. It says to choose treats that are safe for dogs, come from a source you trust, and contain nothing dangerous. It also says they should be given only now and then, because they can add a lot of calories, so reduce your puppy's food a little on the days you give one. Pick ones your puppy actually chews. If your puppy gulps it down, they get all the calories and none of the benefit. And, as above, PDSA recommends steering clear of rawhide, which can break into large pieces that cause a blockage and may contain dangerous bacteria or unsafe chemicals, particularly if imported.</p>
<h2>Why is my puppy biting more while teething?</h2>
<p>Biting and mouthing are normal in puppies, and teething can make them more intense for a while. Sore gums make firm things attractive, and hands, sleeves and ankles are right there. The fix is the same as at any other age: keep a toy within reach, calmly stop the game when teeth touch skin, offer something suitable to chew, and praise when your puppy uses it. A tired puppy bites more, so make sure naps happen, using our <a href="/blog/puppy-nap-and-sleep-schedule/">nap and sleep schedule</a>. For a full routine, read <a href="/blog/how-to-stop-puppy-biting/">how to stop puppy biting</a>.</p>
<h2>Start gentle mouth handling now</h2>
<p>The American Kennel Club suggests that around 12 to 16 weeks is a good time to start touching your puppy's mouth, outside and in, so that tooth brushing and vet checks are easier later. Be careful, as the remaining baby teeth are razor sharp. Keep it to a few seconds, give a treat, and stop before your puppy gets fed up. A relaxed mouth check at home also means you will spot a loose tooth, red gums or a baby tooth that stays put, which is worth mentioning to your vet.</p>
''', [('How often can I give my puppy chew treats?', 'PDSA says to give chew treats only now and then, because they can add a lot of calories, and to cut your puppy\'s food a little on those days. Choose ones your puppy really chews and that come from a source you trust.'),
      ('What is the best thing for a teething puppy to chew?', 'A toy made for chewing, sized so it cannot fit completely in the mouth, and soft enough to dent with a fingernail. Rotate a few toys and ask your vet if you are unsure about a particular product.')])

add('puppy-vaccination-schedule', '<h2>Before the course is finished</h2>', '''<h2>What do puppy vaccines protect against?</h2>
<p>It helps to know what the acronyms stand for. According to PDSA, the core UK vaccines protect against four diseases. <strong>Parvovirus</strong> is highly contagious and potentially deadly, causing severe vomiting and diarrhoea. <strong>Distemper</strong> is very serious and often fatal, affecting the gut, heart, immune system, lungs, brain and nerves. <strong>Infectious hepatitis</strong> attacks the liver, kidneys, eyes and blood vessels, and the virus can survive in the environment for up to a year. The fourth is leptospirosis. The AKC's list also includes <strong>bordetella</strong>, the main cause of kennel cough, which is given as an injection or a nasal spray and is worth discussing if you plan to board your puppy.</p>
<h2>Are puppy vaccine side effects common?</h2>
<p>PDSA says side effects are rare and most dogs have none. If they happen they are likely to be mild, such as a high temperature, low energy or reduced appetite, and they pass within 24 to 48 hours. Serious side effects are extremely rare, but if you see any, speak to your vet. PDSA also points out that the risk from a vaccine is much lower than the risk of staying unvaccinated.</p>
<h2>What if a vaccine is late or missed?</h2>
<p>Do not wait for the next convenient date. PDSA explains that a dog who has been vaccinated before but missed a booster might have protection for 2 to 3 months after the booster was due, and after that is at risk again. If your puppy has only had part of the primary course, PDSA treats them as unvaccinated for safety purposes, so follow the same precautions and call your vet to rebook.</p>
<h2>How do I socialise my puppy while waiting for full protection?</h2>
<p>PDSA recommends asking your vet when your puppy will be protected, and not to take them to certain places or let them mix with unvaccinated dogs until then. It also says that puppies still need new experiences as soon as possible, so you can start in a garden that unvaccinated dogs do not use, carry your puppy when you are out so they can meet people and see new places, and let them meet fully vaccinated older dogs. Your vet can tell you what is safe in your area. Our <a href="/blog/puppy-socialization-checklist/">socialization checklist</a> shows how to do it in small, positive steps.</p>
''', [('Are there side effects after puppy vaccines?', 'PDSA says side effects are rare and usually mild, for example a high temperature, low energy or reduced appetite, passing within 24 to 48 hours. Contact your vet if you see anything more serious.'),
      ('What happens if my puppy misses a vaccine?', 'PDSA says dogs that have missed a booster may stay protected for 2 to 3 months after the due date and then are at risk again. Call your vet as soon as you realise, and ask what to do for a puppy that has not finished the primary course.')])

add('puppy-development-stages-8-weeks-to-6-months', '<h2>Home alone and growing up</h2>', '''<h2>How to socialise your puppy at each stage</h2>
<p>PDSA's vets give a simple recipe that works at every age. Keep experiences good, using treats, toys and praise, because negative experiences during the socialisation period can make a puppy nervous of the same thing later, or lead to wider fears. If your puppy seems anxious or afraid, take them somewhere they feel calm, then try again later or another day, staying further away until they are comfortable.</p>
<ul>
<li><strong>Aim for variety.</strong> Different people, sounds, smells and places.</li>
<li><strong>Build up gradually.</strong> Start with a quiet row of shops before a busy town centre, and a quiet road before a busy one.</li>
<li><strong>Do not pack too much into one day.</strong> Spread new things over several days, and keep each one short and positive.</li>
<li><strong>Know when to stop.</strong> If your puppy is tired, stressed or over-excited, go home and let them rest.</li>
</ul>
<p>PDSA adds that the benefits of good socialisation stay with your puppy, but you should keep teaching new experiences and keep up training after 12 weeks. Use our <a href="/blog/puppy-socialization-checklist/">puppy socialization checklist</a> for a list, and check your vaccine dates in our <a href="/blog/puppy-vaccination-schedule/">vaccination guide</a> before meeting other dogs.</p>
<h2>A simple weekly check-in</h2>
<p>Once a week, take two minutes to note how your puppy is doing: sleep, appetite, toilet routine, biting, new fears, and anything that has changed. It makes vet visits more useful, and it shows you progress that is easy to miss day by day. If you see a new fear, step back to an easier version and rebuild slowly.</p>
''', [('How do I socialise a puppy before it has had all its vaccines?', 'PDSA suggests asking your vet when your puppy will be protected, carrying them outside so they can meet people and see new places, using a garden that unvaccinated dogs do not use, and letting them meet fully vaccinated older dogs.'),
      ('How much new stuff should my puppy see each day?', 'PDSA advises not to introduce too many new experiences in one day. Spread them over several days, keep them short and positive, and go home for a rest if your puppy gets tired, stressed or over-excited.')])

add('puppy-separation-anxiety-normal-or-a-problem', '<h2>What not to do</h2>', '''<h2>A daily routine that makes alone time easier</h2>
<p>Practice works best when the rest of the day is predictable. Here is a simple pattern, combining the advice from PDSA and the AKC.</p>
<ol>
<li><strong>Exercise and play first.</strong> The AKC says age-appropriate exercise helps treat and prevent separation anxiety, although it cannot cure it.</li>
<li><strong>Toilet break, then rest.</strong> A puppy who has been out and is sleepy is more likely to settle.</li>
<li><strong>Leave something safe to do.</strong> PDSA suggests plenty of interactive toys or feeders to keep your dog entertained, and says to make sure they are safe.</li>
<li><strong>Leave calmly.</strong> No long goodbye. The AKC says to keep things calm and without fanfare when you leave and return.</li>
<li><strong>Return calmly.</strong> Greet your puppy with love, but do not get over-the-top emotional.</li>
</ol>
<h2>How long should a puppy be left alone?</h2>
<p>There is no magic number, and it depends on your puppy's age and what they are used to. PDSA says four hours is the longest dogs should routinely be left, and that four hours would generally be too long for a very active young puppy. It adds that there may be the occasional time when you must be away longer, so have toys or feeders ready. If you work full time, plan help such as a family member, a trusted friend or a dog walker, and read our <a href="/blog/puppy-schedule-when-working-full-time/">full-time work schedule</a>.</p>
<h2>Does a puppy outgrow separation anxiety?</h2>
<p>Do not count on it. Mild protest often fades as a puppy learns that you always come back, which is why gradual practice matters. But the AKC describes true separation anxiety as an extreme stress response, and PDSA recommends speaking to your vet or a professional behaviourist if you think your dog might have it. Early help is easier than late help.</p>
''', [('Can exercise cure separation anxiety?', 'The American Kennel Club says exercise cannot cure separation anxiety, but it can help treat and prevent it. Give age-appropriate exercise and play, together with gradual practice at being alone.'),
      ('Does my puppy need a behaviourist?', 'PDSA recommends speaking to your vet or a professional behaviourist if you think your dog could be suffering from separation anxiety. A vet can also check for pain or medical causes.')])

add('puppy-barking-why-it-happens-and-what-to-do', '<h2>Step 1: Work out why</h2>', '''<h2>The main types of barking</h2>
<p>ASPCA describes several patterns, and knowing which one you have makes the fix much easier.</p>
<table>
<thead><tr><th>Type</th><th>What it looks like</th></tr></thead>
<tbody>
<tr><td>Territorial</td><td>Barking at people, dogs or animals within or approaching the dog's territory</td></tr>
<tr><td>Alarm</td><td>Barking at any noise or sight, with stiffer body language, often moving forward an inch or two with each bark</td></tr>
<tr><td>Attention-seeking</td><td>Barking at people or animals to get attention, food, toys or play</td></tr>
<tr><td>Greeting</td><td>Barking at people or dogs with a relaxed body, excitement and a wagging tail, sometimes with whining</td></tr>
<tr><td>Compulsive</td><td>Repetitive, like a broken record, often with repetitive movement such as pacing</td></tr>
</tbody>
</table>
<p>PDSA's vets add that barking is a normal behaviour used for greeting, as part of play, as a warning and for many other reasons. It becomes a problem when owners feel the dog is barking too much, or when the dog is becoming distressed while barking. That second case is a reason to look at fear, loneliness or health, not just volume.</p>
<h2>Barking and socialisation</h2>
<p>PDSA says that a dog that has been well socialised as a puppy, with a range of new things experienced positively, is less likely to be afraid or unsure of everything when older. So gentle, early exposure to sights, sounds and smells is one of the best long-term ways to cut fear barking. Use the <a href="/blog/puppy-socialization-checklist/">socialization checklist</a> and see where your puppy is in our <a href="/blog/puppy-development-stages-8-weeks-to-6-months/">development stages guide</a>.</p>
<h2>A simple daily plan to reduce barking</h2>
<ol>
<li><strong>Morning:</strong> a walk or play session suited to your puppy's age, then a chew or food toy.</li>
<li><strong>Peak barking times:</strong> block the view, give a task, and reward a quiet moment right away.</li>
<li><strong>Visitors:</strong> reward your puppy for sitting or staying calm before you open the door.</li>
<li><strong>Evening:</strong> a calm routine, a toilet break, and a quiet place to sleep, as in our guide to <a href="/blog/puppy-crying-at-night/">puppy crying at night</a>.</li>
</ol>
<p>Keep notes on how often barking happens each day. Progress is slow, and a log shows it. ASPCA is clear that it takes time to teach a dog to bark less, so aim for steady improvement.</p>
''', [('What is alarm barking in puppies?', 'ASPCA describes alarm barking as barking at any and every noise or sight regardless of context, usually with stiffer body language than a greeting bark. Reward calm behaviour and avoid scolding.'),
      ('Is it normal for puppies to bark when they greet people?', 'Yes. ASPCA says a dog that barks at people or dogs with a relaxed body, excitement and a wagging tail may be greeting. Teach an alternative such as sitting before the greeting.')])

# ---- internal links from older articles (backlinks within the site); marker = signup paragraph or end
links = {
 'puppy-crying-at-night': ('Related reading: if the crying also happens when you leave the room, read about <a href="/blog/puppy-separation-anxiety-normal-or-a-problem/">puppy separation anxiety</a>, and for noisy evenings see <a href="/blog/puppy-barking-why-it-happens-and-what-to-do/">puppy barking</a>.'),
 'how-to-stop-puppy-biting': ('Related reading: sore gums can make biting worse, so see our <a href="/blog/puppy-teething-timeline-and-safe-chews/">puppy teething timeline and safe chews</a>.'),
 'when-does-puppy-biting-stop': ('Related reading: for what teeth are doing and what to chew, see the <a href="/blog/puppy-teething-timeline-and-safe-chews/">teething timeline and safe chews</a>, and the <a href="/blog/puppy-development-stages-8-weeks-to-6-months/">development stages guide</a>.'),
 'puppy-socialization-checklist': ('Related reading: before meeting other dogs, check the <a href="/blog/puppy-vaccination-schedule/">puppy vaccination schedule</a> and the <a href="/blog/puppy-development-stages-8-weeks-to-6-months/">development stages</a>.'),
 'first-week-with-puppy-what-to-do': ('Related reading: book the first vet visit using our <a href="/blog/puppy-vaccination-schedule/">puppy vaccination schedule</a>, and see what to expect next in <a href="/blog/puppy-development-stages-8-weeks-to-6-months/">puppy development stages</a>.'),
 'can-you-leave-a-puppy-alone-for-8-hours': ('Related reading: if your puppy is very upset when left, read <a href="/blog/puppy-separation-anxiety-normal-or-a-problem/">puppy separation anxiety: normal or a problem?</a>'),
 'puppy-zoomies': ('Related reading: evening energy often comes with noise, so see <a href="/blog/puppy-barking-why-it-happens-and-what-to-do/">puppy barking</a>.'),
 'new-puppy-checklist': ('Related reading: add vet dates from the <a href="/blog/puppy-vaccination-schedule/">puppy vaccination schedule</a> to your plan, and chew toys from the <a href="/blog/puppy-teething-timeline-and-safe-chews/">teething guide</a>.'),
}
for slug, txt in links.items():
    p = load(slug)
    if 'class="rel-read"' in p['html']: print('skip', slug); continue
    p['html'] += f'\n<p class="rel-read">{txt}</p>'; p['updated'] = '2026-11-01'; save(p)

# ---- report
for s in ['puppy-teething-timeline-and-safe-chews', 'puppy-vaccination-schedule', 'puppy-development-stages-8-weeks-to-6-months', 'puppy-separation-anxiety-normal-or-a-problem', 'puppy-barking-why-it-happens-and-what-to-do']:
    p = load(s); print(s, len(re.sub(r'<[^>]+>', ' ', p['html']).split()), 'words;', len(p['faq']), 'faq')
