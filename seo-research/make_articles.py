# Writes 5 new articles (gap keywords from keyword_categories.csv) to content/posts/*.json.
# Facts only from the cited sources (AKC, PDSA, Kennel Club, ASPCA); see "sources" per article.
import json, os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'content', 'posts')
DATE = '2026-11-01'
SIGNUP = '<p>If you want a calm, practical list to carry you through the first weeks, grab the <a href="/#signup">Get the free New Puppy Survival Guide</a>.</p>'

def post(slug, title, seoTitle, desc, cat, tags, image, imageAlt, cover, coverAlt, mid, midAlt, quick, faq, html, sources, mins):
    p = dict(draft=False, slug=slug, title=title, description=desc, excerpt=desc, seoTitle=seoTitle, category=cat, tags=tags, date=DATE,
             readMinutes=mins, image=image, imageAlt=imageAlt, coverPhoto=cover, coverAlt=coverAlt, midImage=mid, midImageAlt=midAlt,
             quick=quick, faq=[dict(q=q, a=a) for q, a in faq], html=html + '\n' + SIGNUP, sources=sources)
    json.dump(p, open(os.path.join(OUT, slug + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

# ---------------------------------------------------------------- 1 teething
post('puppy-teething-timeline-and-safe-chews',
 'Puppy Teething: Timeline, Signs and Safe Things to Chew',
 'Puppy Teething Timeline and Safe Chews',
 'When puppies lose baby teeth, what teething looks like, and which chews are safe. A clear timeline for new owners.',
 'Biting & Teething', ['puppy teething', 'chew toys', 'teething timeline', 'puppy biting', 'new puppy'],
 '/assets/bite.jpg', 'Golden retriever puppy lying down and looking at the camera',
 '/assets/bite.jpg', 'Golden retriever puppy lying down and looking at the camera', '/assets/play.jpg', 'Golden retriever puppy sitting on a carpet licking its nose',
 'Puppies have about 28 baby teeth. They start losing them at roughly 12 to 16 weeks, and by about 6 months most have their adult set of about 42 teeth. During that time, offer safe chew toys and soft chews. Avoid bones, rawhide and anything too hard to dent with a fingernail, and ask your vet to check your puppy\'s mouth.',
 [('When do puppies start teething?', 'Baby teeth start to come in at around 2 to 4 weeks, while the puppy is still with the breeder. The second round, when baby teeth fall out and adult teeth push through, usually starts at around 12 to 16 weeks, according to the American Kennel Club.'),
  ('How long does puppy teething last?', 'Most puppies have lost all their baby teeth and grown their adult teeth by about 6 months. The exact timing varies, so ask your vet to check your puppy\'s mouth if baby teeth are still in place after that.'),
  ('Are bones, antlers or rawhide safe for teething puppies?', 'PDSA says bones are not a good chew because they can break teeth or splinter and pierce the gut, and it does not recommend rawhide because it can splinter. Its test for chew treats is that they should be soft enough to dent with your fingernail. If you are unsure about a specific chew, ask your vet.'),
  ('Why is my puppy biting so much while teething?', 'Sore gums make firm things attractive, and your hands and clothes are within reach. Redirect to a suitable chew toy and read our guide to <a href="/blog/how-to-stop-puppy-biting/">how to stop puppy biting</a>.')],
 '''<p>One morning you find a tiny, rice-sized tooth on the carpet. Your puppy is gnawing the table leg, and your hands look like they have been through a rose bush. Welcome to teething. It is a normal stage, it does not last forever, and you can make it a lot easier on everyone.</p>
<h2>Puppy teething timeline</h2>
<p>Puppies, like human babies, grow two sets of teeth. This timeline follows the American Kennel Club's guide. Your puppy may be a little earlier or later, and your vet can check how things are going.</p>
<table>
<thead><tr><th>Age</th><th>What is happening</th><th>What helps</th></tr></thead>
<tbody>
<tr><td>2 to 4 weeks</td><td>Baby teeth begin to come in, while the puppy is still with the mother and breeder</td><td>Nothing for you to do yet</td></tr>
<tr><td>5 to 6 weeks</td><td>All the baby teeth should be in, about 28 in total</td><td>Breeder is weaning onto soft food</td></tr>
<tr><td>12 to 16 weeks</td><td>Baby teeth start to fall out and adult teeth emerge. You may find tiny teeth around the house</td><td>Safe chew toys, a vet check of the mouth, gentle touching of the mouth</td></tr>
<tr><td>About 6 months</td><td>Baby teeth should all be gone, and adult dogs have about 42 teeth</td><td>Tell your vet if any baby teeth remain</td></tr>
</tbody>
</table>
<h2>Signs your puppy is teething</h2>
<p>Teething does not look the same in every puppy, but these are common. Your puppy chews on more things than usual, including your hands. The gums look a little red. You may spot small teeth on the floor or in toys. Some puppies are a bit fussier than normal, and some eat less comfortably for a few days.</p>
<p>If your puppy refuses food for more than a day, has bleeding that does not stop, a swollen face, or very bad breath, call your vet instead of assuming it is teething.</p>
<h2>What can a teething puppy safely chew?</h2>
<p>The AKC says to offer safe chew toys from around 12 to 16 weeks. PDSA gives a very practical test for chew treats and toys: they should be soft enough that you can dent them with your fingernail, because if they are too hard they can damage teeth and gums. PDSA also says to rotate toys so your puppy does not get bored.</p>
<ul>
<li><strong>Rubber toys</strong> with some give, sized so they cannot be swallowed.</li>
<li><strong>Soft textured toys</strong> made for puppies, checked often for damage.</li>
<li><strong>Chews recommended by your vet</strong> for your puppy's age and size.</li>
</ul>
<h2>Are bones, antlers and rawhide safe?</h2>
<p>This is one of the most searched questions, and the cautious answer is to skip them. PDSA says bones are not a good chew treat, because they can break teeth, or splinter in the stomach and pierce the gut. They can also cause constipation, or a blockage if large pieces are swallowed. PDSA also does not recommend rawhide, as it can splinter and potentially hurt your dog. Antlers and other very hard chews fail the fingernail test, so they carry the same risk to teeth that are still growing. Whatever you choose, check with your vet, and supervise.</p>
<h2>How to ease teething at home</h2>
<ol>
<li><strong>Keep several toys within reach</strong> and swap them every day or two.</li>
<li><strong>Redirect, do not scold.</strong> When teeth touch skin, calmly pause, then offer a toy and praise when it is chewed. Our <a href="/blog/how-to-stop-puppy-biting/">pause, redirect, reward method</a> shows how.</li>
<li><strong>Puppy-proof</strong> cables, shoes and table legs, or block access with a pen or gate.</li>
<li><strong>Handle the mouth gently</strong> for a few seconds a day with a treat, so a later vet check or tooth brushing is easier.</li>
<li><strong>Plan chew time</strong> when your puppy is tired and cranky. Overtired puppies bite more.</li>
</ol>
<h2>When to ask the vet</h2>
<p>Ask your vet to look at your puppy's mouth around the time the baby teeth start to fall, and tell your vet if any baby teeth are still there at around 6 months, as the AKC advises. Also call the vet if your puppy has a broken tooth, bleeding gums, drools heavily, cries when eating, or seems unwell. Teething is not usually a medical problem, but a vet can tell the difference.</p>
<p>The biting that comes with teething usually settles as the adult teeth arrive. For the longer picture, read <a href="/blog/when-does-puppy-biting-stop/">when does puppy biting stop</a>.</p>''',
 [dict(org='American Kennel Club', title='Puppy teething timeline: how long does puppy teething last?', url='https://www.akc.org/expert-advice/health/timeline-of-puppy-teething/'),
  dict(org='American Kennel Club', title='Puppy teething and nipping: a survival guide', url='https://www.akc.org/learn/family-dog/puppy-teething-and-nipping/'),
  dict(org='PDSA', title='Training dogs not to chew', url='https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/training-dogs-not-to-chew'),
  dict(org='PDSA', title='Wobbly teeth in dogs', url='https://www.pdsa.org.uk/pet-help-and-advice/pet-health-hub/symptoms/wobbly-teeth-in-dogs')], 7)

# ---------------------------------------------------------------- 2 vaccination
post('puppy-vaccination-schedule',
 'Puppy Vaccination Schedule: What to Expect in the First Year',
 'Puppy Vaccination Schedule: First Year',
 'When puppies get their first vaccines, what each visit covers in the US and UK, and what to do before the course is finished.',
 'Health & Development', ['puppy vaccinations', 'puppy health', 'vet visit', 'new puppy', 'puppy care'],
 '/assets/checklist.jpg', 'Small golden retriever puppy standing on a dark floor',
 '/assets/checklist.jpg', 'Small golden retriever puppy standing on a dark floor', '/assets/hero.jpg', 'Golden retriever puppy with a collar and tag, lying down',
 'Puppy vaccines usually start at 6 to 8 weeks, with more doses every few weeks until about 16 to 18 weeks, then boosters. In the UK, PDSA says most puppies have 2 injections 2 to 4 weeks apart and are fully protected 2 to 4 weeks after the last one. Your vet sets the exact schedule, because it depends on where you live and your puppy\'s risks.',
 [('When should a puppy get its first vaccine?', 'The American Kennel Club lists distemper and parvovirus at 6 to 8 weeks as a general guideline, and PDSA says puppies should ideally start at around 6 to 8 weeks. The Kennel Club says most puppies receive their first set at around 8 weeks, depending on the vet\'s advice and whether the mother was fully vaccinated.'),
  ('Can I take my puppy outside before the vaccines are finished?', 'PDSA advises that a puppy who has not finished the primary course should not be put on the ground in public places. You can carry them out, but do not let them meet unvaccinated dogs. Your garden is fine if no unvaccinated dogs have visited recently and it is secure. Ask your vet when it is safe to start walks.'),
  ('How many puppy vaccines are there?', 'It depends on the country and the vet. The AKC lists several visits in the first year, including DHPP and rabies, plus optional vaccines for lifestyle. In the UK, PDSA says 2 injections are common and some puppies need a third.'),
  ('How much do puppy vaccines cost?', 'Prices vary by country, clinic and package, and the AKC says that location is a big factor. Ask your vet for a written estimate for the whole puppy course so there are no surprises.')],
 '''<p>You bring your puppy home and, within days, the vet asks which vaccine visits to book. It can feel like a lot of acronyms. The idea is simple, though: young puppies get a short series of vaccines, because protection from their mother fades while their own immunity is still building. Your vet will set the exact timing for your puppy, and this guide explains the usual pattern.</p>
<p>This article is general information, not veterinary advice. Rules for rabies and other vaccines differ by country and even by region, so use it to prepare your questions.</p>
<h2>A general puppy vaccination timeline</h2>
<p>The American Kennel Club is clear that there is not one schedule for every dog. Where you live and your puppy's risk factors matter, and some dogs do not need every vaccine. With that in mind, this is its general guideline for the first year in the US.</p>
<table>
<thead><tr><th>Puppy age</th><th>Usually recommended</th><th>Optional, by lifestyle</th></tr></thead>
<tbody>
<tr><td>6 to 8 weeks</td><td>Distemper, parvovirus</td><td>Bordetella</td></tr>
<tr><td>10 to 12 weeks</td><td>DHPP (distemper, adenovirus or hepatitis, parainfluenza, parvovirus)</td><td>Influenza, leptospirosis, bordetella, Lyme disease</td></tr>
<tr><td>16 to 18 weeks</td><td>DHPP, rabies</td><td>Influenza, Lyme disease, leptospirosis, bordetella</td></tr>
<tr><td>12 to 16 months</td><td>DHPP, rabies</td><td>Coronavirus, leptospirosis, bordetella, Lyme disease</td></tr>
</tbody>
</table>
<p>After the first year, the AKC lists DHPP boosters every 1 to 2 years and rabies every 1 to 3 years, as required by law. It also notes that heartworm has no vaccine, and that around 12 to 16 weeks it is worth talking to your vet about preventive medication.</p>
<h2>What it looks like in the UK</h2>
<p>PDSA says all dogs in the UK should be vaccinated against parvovirus, distemper, leptospirosis and infectious hepatitis, and that, depending on lifestyle, a dog may also need kennel cough and rabies vaccines. Puppies should ideally start at around 6 to 8 weeks old, with 2 injections 2 to 4 weeks apart, and they are fully protected 2 to 4 weeks after the final injection. Some puppies need a third injection as part of the primary course. Boosters follow, with leptospirosis every year and the others usually every three years.</p>
<p>The Kennel Club adds that puppies often get the first jabs from the breeder and the second with the new owner, and that breeders should pass on vaccination certificates. Take any paperwork to your first vet visit.</p>
<h2>Before the course is finished</h2>
<p>This is the part new owners worry about, because socialisation is time sensitive. PDSA advises that if your puppy has not finished the primary course, you should not put them on the ground in public places, although you can take them out if you carry them. They should not mix with unvaccinated dogs from outside your household, and you should not bring unknown dogs into your home. The garden is fine if no unvaccinated dogs have visited recently and it is secure.</p>
<p>That does not mean waiting. You can still introduce sights, sounds and gentle handling at home, and your vet can tell you how to do it safely. Our <a href="/blog/puppy-socialization-checklist/">puppy socialization checklist</a> has ideas that work before the first walks.</p>
<h2>What to bring and ask at the appointment</h2>
<ul>
<li>Any vaccination certificates and health records from the breeder or rescue.</li>
<li>A list of questions: which vaccines your puppy needs where you live, what is optional, when to start walks, and when to start parasite prevention.</li>
<li>A towel or blanket, treats, and a carrier or a leash and harness, so the visit is calm and positive.</li>
</ul>
<p>If you notice anything that worries you after a vaccine, such as swelling, vomiting or breathing problems, contact your vet or an emergency clinic straight away.</p>
<h2>Keep a simple record</h2>
<p>Write down each date, vaccine and the due date for the next visit, and put it in your phone calendar with a reminder. A missed dose can leave gaps, and PDSA warns that dogs who do not get all their vaccinations are at risk of catching infectious diseases. Also add these dates to your <a href="/blog/first-week-with-puppy-what-to-do/">first week plan</a> so the vet visit does not get lost.</p>''',
 [dict(org='American Kennel Club', title='Your complete guide to first-year puppy vaccinations', url='https://www.akc.org/expert-advice/health/puppy-shots-complete-guide/'),
  dict(org='PDSA', title='Dog vaccines', url='https://www.pdsa.org.uk/pet-help-and-advice/pet-health-hub/other-veterinary-advice/dog-vaccines'),
  dict(org='The Kennel Club (UK)', title='Dog and puppy vaccinations', url='https://thekennelclub.org.uk/health-and-dog-care/health/health-and-care/a-z-of-health-and-care-issues/dog-and-puppy-vaccinations/')], 7)

# ---------------------------------------------------------------- 3 development stages
post('puppy-development-stages-8-weeks-to-6-months',
 'Puppy Development Stages: What to Expect From 8 Weeks to 6 Months',
 'Puppy Development Stages by Age',
 'A month-by-month look at what is normal for your puppy from 8 weeks to 6 months, with what to focus on at each age.',
 'Health & Development', ['puppy development', 'puppy age', 'new puppy', 'puppy training', 'puppy socialization'],
 '/assets/garden.jpg', 'Small golden retriever puppy sitting among yellow flowers',
 '/assets/garden.jpg', 'Small golden retriever puppy sitting among yellow flowers', '/assets/collar.jpg', 'Golden retriever puppy wearing a blue collar and looking to the side',
 'From 8 weeks to 6 months, puppies change fast. The socialisation window runs from about 4 to 12 weeks, vaccines are given in the first 4 months, baby teeth fall out from about 12 to 16 weeks, and by about 6 months the adult teeth are in. Every puppy moves at its own pace, so use age as a guide, not a deadline.',
 [('What is the most important stage in a puppy\'s development?', 'PDSA says that between about 4 and 12 weeks a puppy has a socialisation period, when the brain learns what is normal and how to cope. Because many puppies come home at around 8 weeks, you have a short window to introduce everyday things gently, so start from day one.'),
  ('At what age do puppies calm down?', 'There is no fixed age, and breed, exercise and routine all play a part. Many owners notice big changes between 4 and 6 months as sleep patterns settle and biting eases, but this is an observation, not a rule. See <a href="/blog/puppy-zoomies/">puppy zoomies</a> for the evening wild spells.'),
  ('When does a puppy become an adult?', 'Puppy teeth are replaced by adult teeth by about 6 months, but puppies are not fully grown or mature at that age, and small and large breeds develop at different speeds. Ask your vet about your puppy\'s breed and size.'),
  ('Is it normal for my puppy to regress?', 'Yes, setbacks are common, particularly after a change of routine. Our guide to <a href="/blog/puppy-potty-training-regression/">potty training regression</a> explains what to do.')],
 '''<p>One day your puppy is a tiny, sleepy bundle. A few weeks later it is racing round the garden, chewing everything, and learning your name. People often ask what is normal at each age. The honest answer is that every puppy is different, and breed, size and early life all matter. Use the stages below as a map, and check with your vet if something worries you.</p>
<h2>The stages at a glance</h2>
<table>
<thead><tr><th>Age</th><th>What is going on</th><th>Your focus</th></tr></thead>
<tbody>
<tr><td>8 to 12 weeks</td><td>Socialisation window, first vaccines, short sleep stretches, lots of naps</td><td>Gentle new experiences, toilet routine, crate and sleep routine</td></tr>
<tr><td>12 to 16 weeks</td><td>Baby teeth start to fall out, vaccines finish, curiosity grows</td><td>Safe chews, basic cues, keep socialising</td></tr>
<tr><td>4 to 6 months</td><td>Adult teeth coming in, more energy and independence</td><td>Consistency, exercise suited to age, manners</td></tr>
<tr><td>About 6 months</td><td>Adult teeth in place, about 42, and a growing teenager</td><td>Keep the routine, vet check, ask about next steps</td></tr>
</tbody>
</table>
<h2>8 to 12 weeks: learning about the world</h2>
<p>PDSA says that between 4 and 12 weeks, a puppy has a socialisation period when the brain learns about new things and becomes resilient and flexible. Dogs that are not socialised young tend to be more anxious and unsure, which can lead to behaviour problems and fears. Because most puppies arrive at around 8 weeks, you have just a few weeks to get it right, so start slowly and keep everything positive.</p>
<p>It is also when you set routines. Expect lots of naps, with <a href="/blog/puppy-nap-and-sleep-schedule/">short sleep stretches</a> through the night and frequent toilet trips, which you can plan using our <a href="/blog/puppy-potty-training-schedule/">potty training schedule by age</a>. The first vaccines are usually given around 6 to 8 weeks, with the next round a few weeks later, so see our <a href="/blog/puppy-vaccination-schedule/">puppy vaccination schedule</a> and ask your vet how to socialise safely before the course is complete.</p>
<h2>12 to 16 weeks: teeth and testing boundaries</h2>
<p>According to the American Kennel Club, this is when baby teeth begin to shed and adult teeth come in, and when you may find tiny teeth around your home. Your puppy needs safe chew toys, and the AKC suggests starting to touch the mouth gently so later brushing is easier. The vet may also bring up heartworm prevention at 12 to 16 weeks if that is relevant where you live. Our <a href="/blog/puppy-teething-timeline-and-safe-chews/">puppy teething guide</a> covers what to offer.</p>
<p>This is also the age when biting, grabbing and zoomies can feel intense. The tools are the same as before: a predictable day, short training bursts, and lots of rest. Review our <a href="/blog/first-commands-to-teach-a-puppy/">first commands</a> and the <a href="/blog/how-to-stop-puppy-biting/">biting method</a>.</p>
<h2>4 to 6 months: the teenager appears</h2>
<p>By about six months, the AKC says that all the baby teeth should have fallen out and the adult teeth grown in. If any baby teeth remain, tell your vet. Many owners find that their puppy seems more independent, may test what it learned, and may have a few setbacks. That is common, and it is a good reason to stay consistent with the routine rather than starting over. If accidents start again, read about <a href="/blog/puppy-potty-training-regression/">potty training regression</a>.</p>
<h2>Home alone and growing up</h2>
<p>As puppies grow, they can manage longer spells alone, but slowly. PDSA says that four hours is the longest dogs should routinely be left alone, and that this is too long for a very active, young puppy. Build up time apart gradually, using our guide to <a href="/blog/puppy-separation-anxiety-normal-or-a-problem/">puppy separation anxiety</a> and our <a href="/blog/can-you-leave-a-puppy-alone-for-8-hours/">longest-alone guide</a>.</p>
<h2>How to use these stages</h2>
<ul>
<li>Use age ranges as a guide, not a test your puppy can fail.</li>
<li>Write down what changes each week, such as sleep, teething and new fears, so you can tell your vet.</li>
<li>Keep experiences short, positive and repeated.</li>
<li>Ask your vet about growth and exercise for your breed and size.</li>
</ul>''',
 [dict(org='PDSA', title='Puppy socialisation', url='https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/puppy-socialisation'),
  dict(org='American Kennel Club', title='Puppy teething timeline', url='https://www.akc.org/expert-advice/health/timeline-of-puppy-teething/'),
  dict(org='American Kennel Club', title='Your complete guide to first-year puppy vaccinations', url='https://www.akc.org/expert-advice/health/puppy-shots-complete-guide/'),
  dict(org='PDSA', title='Home alone: preventing separation anxiety', url='https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/home-alone-preventing-separation-anxiety')], 7)

# ---------------------------------------------------------------- 4 separation anxiety
post('puppy-separation-anxiety-normal-or-a-problem',
 'Puppy Separation Anxiety: Normal Protest or a Real Problem?',
 'Puppy Separation Anxiety: Signs and Steps',
 'How to tell normal puppy protest from real separation anxiety, plus calm step-by-step practice for leaving your puppy alone.',
 'Behavior', ['separation anxiety', 'puppy alone', 'puppy behavior', 'new puppy', 'puppy training'],
 '/assets/night.jpg', 'Golden retriever puppy lying on a dark floor and looking at the camera',
 '/assets/night.jpg', 'Golden retriever puppy lying on a dark floor and looking at the camera', '/assets/hero.jpg', 'Golden retriever puppy with a collar and tag, lying down',
 'Some fuss when you leave is normal for a new puppy. Separation anxiety is extreme stress from the moment you leave until you return, for example constant barking, destruction, accidents, pacing or escape attempts. Teach alone time in small steps, reward calm, keep goodbyes quiet, and see your vet or a qualified behaviourist if it is more than mild.',
 [('Is it normal for a puppy to cry when I leave?', 'Yes, a little protest is common when a puppy is new and not yet used to being alone. It becomes a concern when the distress is extreme, lasts the whole time you are away, or comes with destruction, accidents or escape attempts.'),
  ('How long can I leave my puppy alone?', 'PDSA says four hours is the longest dogs should routinely be left alone, and that it is too long for a very active, young puppy. Build up gradually from seconds and minutes.'),
  ('What are the signs of separation anxiety in puppies?', 'PDSA lists barking and whining, destructive chewing, escape attempts, toileting in the house, and pacing. ASPCA also notes drooling and getting upset when you get ready to leave.'),
  ('Should I punish my puppy for chewing or accidents when I get home?', 'No. The American Kennel Club says punishing a dog after accidents or damage adds to the anxiety and makes the problem worse. Stay calm and clean up.')],
 '''<p>You pick up your keys, and your puppy's whole body changes. Whining, pacing, maybe a frantic bark at the door. It is heartbreaking to hear, and many new owners wonder if they have a puppy with separation anxiety. In most cases, a young puppy is simply not yet used to being alone. Here is how to tell the difference, and how to teach alone time kindly.</p>
<h2>Normal protest vs separation anxiety</h2>
<p>Separation anxiety is different from a puppy who dislikes being left. According to the American Kennel Club, it means extreme stress from the time you leave until you come home, and the dog acts as if it is terrified to be in the house alone. A behaviourist quoted by the AKC compares it to a panic attack.</p>
<table>
<thead><tr><th>Usually normal for a new puppy</th><th>Possible separation anxiety</th></tr></thead>
<tbody>
<tr><td>Whining for a few minutes, then settling</td><td>Constant distress for the whole time you are away</td></tr>
<tr><td>Excited greeting when you return</td><td>Frantic behaviour as you prepare to leave</td></tr>
<tr><td>Chewing a toy you left</td><td>Chewing doors and windows, escape attempts</td></tr>
<tr><td>An accident now and then, as with any puppy</td><td>Toileting in the house only when left alone</td></tr>
</tbody>
</table>
<p>PDSA lists these signs: barking and whining, destructive behaviour like chewing, attempts to escape, peeing and pooing in the house, and pacing. ASPCA adds drooling, and notes that these are not signs a dog is not house trained or is naughty. They are signs of distress.</p>
<h2>Why does it happen?</h2>
<p>PDSA gives several reasons: the dog is not used to being left alone, there has been a change in the household, something has scared them, they are bored, or a routine has changed. Genetics, personality and past experiences play a part, and pain or medical problems can also make a dog worried about being alone, so a vet check is a good first step if your puppy struggles.</p>
<h2>How to teach your puppy to be alone</h2>
<p>PDSA's approach is gradual and rewards calm. Here it is in practical steps.</p>
<ol>
<li><strong>Start with a few steps away.</strong> Walk a short distance from your puppy. If they stay calm, return and reward them.</li>
<li><strong>Leave the room briefly.</strong> Come back, and if the puppy is still calm and quiet, reward again.</li>
<li><strong>Increase time slowly.</strong> Make each absence only a little longer than the last.</li>
<li><strong>Then try leaving the house</strong> for short moments, and build up.</li>
<li><strong>Keep comings and goings calm.</strong> The AKC says that a big, emotional greeting can make your puppy treat your departures and returns as a big event.</li>
</ol>
<p>If your puppy cries during a step, you went too fast. Go back to the last duration that worked and stay there for a few days.</p>
<h2>Make departures less stressful</h2>
<p>The AKC suggests desensitising your puppy to the signs that you are about to leave. Pick up your keys or put on your coat, then go and make dinner instead of leaving, or toss a high-value treat right before touching your keys. Over time, your puppy learns that these signs predict good things, not panic.</p>
<h2>Exercise, rest and routine</h2>
<p>The AKC says exercise cannot cure separation anxiety but can help treat and prevent it, so give age-appropriate exercise and play before a planned absence, followed by a toilet break and a nap. Rest matters too. Our <a href="/blog/puppy-nap-and-sleep-schedule/">nap and sleep schedule</a> shows a realistic day, and <a href="/blog/puppy-schedule-when-working-full-time/">a schedule for people who work full time</a> covers breaks and help.</p>
<h2>What not to do</h2>
<ul>
<li>Do not punish a puppy for accidents or damage when you return. The AKC says this adds to anxiety.</li>
<li>Do not leave a puppy alone for long stretches before they are ready. PDSA says a very active, young puppy cannot manage four hours.</li>
<li>Do not ignore signs of extreme distress. Ask your vet for help early.</li>
</ul>
<h2>When to get help</h2>
<p>Talk to your vet or an accredited behaviourist if your puppy shows serious signs, such as self-injury, constant panic, or damage around doors and windows, as PDSA advises. The AKC notes that some vets recommend medication when training alone is not enough, which is a decision to make with your vet. For the longer view, see our guide on <a href="/blog/can-you-leave-a-puppy-alone-for-8-hours/">leaving a puppy alone</a>.</p>''',
 [dict(org='PDSA', title='Home alone: preventing separation anxiety', url='https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/home-alone-preventing-separation-anxiety'),
  dict(org='American Kennel Club', title='Separation anxiety in dogs: signs, causes and prevention', url='https://www.akc.org/expert-advice/training/puppy-separation-anxiety/'),
  dict(org='ASPCA', title='Separation anxiety', url='https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/separation-anxiety')], 7)

# ---------------------------------------------------------------- 5 barking
post('puppy-barking-why-it-happens-and-what-to-do',
 'Puppy Barking: Why It Happens and What to Do',
 'Puppy Barking: Why and What to Do',
 'Why puppies bark, how to work out the reason, and calm ways to reduce it without scolding. Practical steps for new owners.',
 'Behavior', ['puppy barking', 'puppy behavior', 'puppy training', 'new puppy', 'positive reinforcement'],
 '/assets/play.jpg', 'Golden retriever puppy sitting on a carpet licking its nose',
 '/assets/play.jpg', 'Golden retriever puppy sitting on a carpet licking its nose', '/assets/collar.jpg', 'Golden retriever puppy wearing a blue collar and looking to the side',
 'Barking is normal communication, and puppies bark for many reasons: play, alerting, fear, boredom, attention or being alone. Work out why your puppy is barking, meet the need, and reward quiet. ASPCA warns that a puppy who is rewarded for barking learns to bark more, and there is no quick fix, so be consistent.',
 [('Why does my puppy bark so much?', 'Common reasons are excitement or play, alerting to sounds, fear of new things, boredom, wanting attention, or distress when alone. Pain or illness can also be a cause, so see your vet if the barking is new or unusual.'),
  ('Should I ignore a barking puppy?', 'It depends on the reason. ASPCA says that if a dog gets what he wants by barking, he learns to bark for it, so do not hand over attention at the moment of barking. But never ignore a puppy who needs the toilet, is scared, or is in distress.'),
  ('Will shouting stop my puppy barking?', 'Usually not. PDSA advises not getting angry at a dog that barks, because it can upset them more. Work on the cause and reward calm behaviour.'),
  ('Will my puppy grow out of barking?', 'Barking is a normal dog behaviour, so it will not go away completely. ASPCA says that it takes time to teach a dog to bark less, and that expecting a quick fix or total silence is unrealistic.')],
 '''<p>The doorbell rings and your puppy launches into a squeaky, wobbly, very determined bark. It is cute for a day, then you start to worry about the neighbours. The good news is that barking is normal, and you can shape it with a few consistent habits.</p>
<h2>Why puppies bark</h2>
<p>ASPCA explains that barking is a natural part of how dogs communicate, and many owners can tell the reason from the sound. A bark that means "play with me" sounds different from one that means "let me in". Common causes in puppies are:</p>
<ul>
<li><strong>Excitement and play,</strong> especially in the evening when puppies get the zoomies. See <a href="/blog/puppy-zoomies/">puppy zoomies</a>.</li>
<li><strong>Alerting,</strong> to the doorbell, footsteps or noises outside.</li>
<li><strong>Fear or uncertainty,</strong> about new people, objects or sounds. PDSA says that a well-socialised puppy is less likely to be afraid or unsure of everything when older.</li>
<li><strong>Wanting attention, food or a walk.</strong></li>
<li><strong>Boredom or too little exercise.</strong></li>
<li><strong>Being alone,</strong> which can come with whining and pacing. Read our guide to <a href="/blog/puppy-separation-anxiety-normal-or-a-problem/">puppy separation anxiety</a>.</li>
<li><strong>Pain or illness,</strong> which is why sudden barking is worth a vet check.</li>
</ul>
<h2>Step 1: Work out why</h2>
<p>ASPCA says that to reduce barking it is crucial to determine why the dog is barking. Keep a note for three days: when it happens, what came just before, and what your puppy got afterwards. You will often see a pattern, such as barking when you are on a call, or when your puppy has been in the crate too long.</p>
<h2>Step 2: Meet the need</h2>
<table>
<thead><tr><th>Reason</th><th>What helps</th></tr></thead>
<tbody>
<tr><td>Needs the toilet</td><td>Take your puppy out. See our <a href="/blog/puppy-potty-training-schedule/">potty schedule</a></td></tr>
<tr><td>Bored or full of energy</td><td>Age-appropriate play, a chew or food toy, short training games</td></tr>
<tr><td>Fear of new sounds</td><td>Gentle, positive exposure at a distance your puppy can handle</td></tr>
<tr><td>Barking at night</td><td>Check the basics in <a href="/blog/puppy-crying-at-night/">puppy crying at night</a></td></tr>
<tr><td>Tired and overstimulated</td><td>A calm break and a nap in a quiet place</td></tr>
</tbody>
</table>
<h2>Step 3: Do not reward the barking</h2>
<p>ASPCA says that barking is rewarded when it gets the dog what it wants, and dogs who successfully bark for attention often go on to bark for food, play and walks. So wait for a pause in the barking, then give attention, a treat or the door opening. If your puppy learns that quiet gets things, quiet becomes the better option.</p>
<p>The ASPCA also recommends teaching a quiet cue, so you can ask for another behaviour such as sit instead. Start with an easy moment, say "quiet" when the puppy pauses for a second, and reward straight away. Make it longer as your puppy gets the idea.</p>
<h2>Step 4: Prevent practice</h2>
<p>Every time a puppy barks and gets a result, the habit gets stronger. Block the view of the street with a gate or curtains, keep the puppy away from the window during peak times, and offer a chew or food toy in busy moments. Use a <a href="/blog/crate-training-a-puppy/">calm crate or pen routine</a> for rest.</p>
<h2>What not to do</h2>
<ul>
<li>Do not shout. PDSA says that getting angry at a dog that barks will upset them even more.</li>
<li>Do not scold a fearful puppy. Fear needs distance and gentle exposure, not a telling off.</li>
<li>Do not expect silence. ASPCA says the aim is less barking, not none.</li>
</ul>
<h2>When to ask for help</h2>
<p>If barking comes with signs of panic, destruction, or hurting themselves, or if it starts suddenly, talk to your vet or an accredited behaviourist. The cause may be medical or a bigger anxiety issue. Otherwise, with patience, most puppies learn that quiet works.</p>''',
 [dict(org='ASPCA', title='Barking', url='https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/barking'),
  dict(org='PDSA', title='Vet Q&A: why does my dog keep barking?', url='https://www.pdsa.org.uk/what-we-do/blog/vet-qa-why-does-my-dog-keep-barking'),
  dict(org='PDSA', title='Home alone: preventing separation anxiety', url='https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/home-alone-preventing-separation-anxiety')], 6)
print('written')
