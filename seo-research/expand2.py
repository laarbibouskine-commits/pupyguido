import json,os,re
P=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','content','posts')
M='<p>If you want a calm, practical list'
def add(slug,html):
    f=os.path.join(P,slug+'.json'); p=json.load(open(f,encoding='utf-8'))
    if '<!--x2-->' in p['html']: return print('skip',slug)
    assert M in p['html']; p['html']=p['html'].replace(M,'<!--x2-->'+html+M,1); json.dump(p,open(f,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
    print(slug,len(re.sub(r'<[^>]+>',' ',p['html']).split()))
add('puppy-teething-timeline-and-safe-chews','''<h2>Quick teething checklist</h2>
<ul>
<li>Three or four chew toys within reach, rotated every few days.</li>
<li>Every toy passes the fingernail test and is bigger than your puppy's throat.</li>
<li>No bones and no rawhide, and chew treats only now and then.</li>
<li>A vet check of the mouth around 12 to 16 weeks, and another look at about 6 months.</li>
<li>Calm redirection when teeth touch skin, and plenty of naps.</li>
</ul>
''')
add('puppy-vaccination-schedule','''<h2>Boosters and the second year</h2>
<p>Vaccines do not end with the puppy course. PDSA explains that dogs need regular boosters throughout life: leptospirosis every year, and parvovirus, distemper and hepatitis usually every three years after the initial course. The AKC's general guideline lists a DHPP booster every 1 to 2 years and rabies every 1 to 3 years where the law requires it. Your vet will decide what is right, based on the vaccine used and your dog's lifestyle.</p>
<p>Lifestyle matters. PDSA says a kennel cough vaccine is usually needed if a dog spends time in kennels or doggy day care, has a dog walker, or attends dog events and shows, and that rabies vaccination is necessary for dogs that travel in and out of the UK. If you plan boarding, daycare or travel, tell your vet early so the timing works.</p>
<h2>What about the cost?</h2>
<p>The AKC notes that cost depends on several factors, with location a big one, and that urban vets often charge more than rural ones. It also says some municipal governments sponsor low-cost clinics for rabies vaccines. Ask your vet for a written estimate for the whole puppy course, including boosters and any optional vaccines, so you can plan ahead.</p>
''')
add('puppy-development-stages-8-weeks-to-6-months','''<h2>Questions to ask your vet at each stage</h2>
<ul>
<li><strong>6 to 8 weeks:</strong> Which vaccines does my puppy need, and when is the second visit?</li>
<li><strong>10 to 12 weeks:</strong> When will my puppy be protected enough to meet other dogs and walk in public places?</li>
<li><strong>12 to 16 weeks:</strong> Should we start parasite prevention such as heartworm medication where I live? Are the baby teeth shedding normally?</li>
<li><strong>16 to 18 weeks:</strong> Is it time for the final puppy vaccines, and what boosters come next?</li>
<li><strong>About 6 months:</strong> Are all the adult teeth in? What exercise and food suit my puppy's breed and size now?</li>
</ul>
<h2>What stays the same at every age</h2>
<p>Whatever the month, three things make life easier: a predictable day, rewards for what you want to see, and plenty of rest. Young puppies need a lot of sleep, and a tired puppy tends to bite, bark and get the zoomies. If you are not sure whether something is a phase or a problem, write it down, give it a week or two, and ask your vet if it continues or gets worse. Setbacks do happen, and they are not a sign that you did anything wrong.</p>
''')
add('puppy-separation-anxiety-normal-or-a-problem','''<h2>A simple 7-day practice plan</h2>
<p>This example follows PDSA's gradual method. Adjust it to your puppy, and go back a step if you see distress.</p>
<table>
<thead><tr><th>Days</th><th>Practice</th></tr></thead>
<tbody>
<tr><td>1 to 2</td><td>Walk a few steps away while your puppy settles, then return and reward calm</td></tr>
<tr><td>3 to 4</td><td>Leave the room for a short moment, come back, reward calm</td></tr>
<tr><td>5 to 6</td><td>Stay out of the room a little longer, with a safe toy or feeder</td></tr>
<tr><td>7</td><td>Step outside for a very short time, return calmly, and reward</td></tr>
</tbody>
</table>
<p>Some puppies need a week at each step, and that is fine. Quality matters more than speed. Repeat short sessions through the day, and skip a session if your puppy is tired or unwell.</p>
''')
add('puppy-barking-why-it-happens-and-what-to-do','''<h2>Teach quiet: step by step</h2>
<ol>
<li><strong>Pick a calm moment</strong> with few distractions and a handful of small treats.</li>
<li><strong>Wait for a pause</strong> in the barking, even one second.</li>
<li><strong>Say your quiet cue and reward</strong> immediately, while the puppy is still quiet.</li>
<li><strong>Add time slowly.</strong> Reward after two seconds, then five, then longer.</li>
<li><strong>Ask for another behaviour,</strong> such as sit, as ASPCA suggests, so your puppy has something to do instead of barking.</li>
<li><strong>Practice in real life,</strong> at the door, at the window or when you get ready for a walk.</li>
</ol>
<h2>When barking points to something else</h2>
<p>PDSA says the real issue is often not the sound itself, but whether the dog is distressed. If your puppy barks with panic, pacing or destruction while alone, read about <a href="/blog/puppy-separation-anxiety-normal-or-a-problem/">separation anxiety</a>. If barking starts suddenly, is very different from normal, or comes with other changes in behaviour, mention it to your vet, since pain or illness can change how a dog acts.</p>
''')
