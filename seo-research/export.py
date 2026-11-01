import json,re,csv,glob,collections
exec(open('analyze.py').read().split("STOP=")[0].split("P=json.load")[0])  # imports
src=open('analyze.py').read(); CATS=eval(src.split("CATS=")[1].split("\nSTOP=")[0])
ac=json.load(open('autocomplete.json')); cats=json.load(open('categories.json'))
posts=[json.load(open(f,encoding='utf-8')) for f in glob.glob('../content/posts/*.json')]
mine={p['slug']:(p['title']+' '+p.get('category','')).lower() for p in posts if not p.get('draft')}
def cat(k):
    s=k.replace(' ','-')
    for c,rx in CATS:
        if re.search(rx,s): return c
    return "Other"
bad=re.compile(r'\b(for sale|near me|price|cheap|adopt|breeder|craigslist|memes?|cartoon|movie|game|wallpaper|names?|dies|dead|death|porn|vs\b|reddit|youtube|pdf|jobs?|song|video|kare|kyu|karta|hindi|urdu|breed|vet near)\b|[^\x00-\x7f]')
rows={};
for seed,qs in ac.items():
    for q in qs:
        q=q.strip().lower()
        if len(q.split())<3 or bad.search(q) or not re.search(r'pupp',q): continue
        if q not in rows: rows[q]=(cat(q),seed)
def covered(q):
    ws=[w for w in re.findall(r'[a-z]+',q) if w not in('how','to','a','the','my','do','does','can','is','what','when','why','should','puppy','puppies','for','of','in','and','your','i','get','ago','old')]
    best=max(((sum(w in t for w in ws)/max(len(ws),1),s) for s,t in mine.items()),default=(0,''))
    return best
out=[]
for q,(c,seed) in rows.items():
    sc,sl=covered(q); st="covered" if sc>=0.75 else "partial" if sc>=0.5 else "GAP"
    qtype="question" if re.match(r'(how|why|when|what|can|should|is|are|do|does|will)\b',q) else "phrase"
    out.append(dict(category=c,keyword=q,type=qtype,status=st,closest_article=sl if sc>=0.5 else '',seed=seed))
out.sort(key=lambda r:(r['category'],r['status']!='GAP',r['keyword']))
with open('keyword_categories.csv','w',newline='',encoding='utf-8') as f:
    w=csv.DictWriter(f,fieldnames=list(out[0]));w.writeheader();w.writerows(out)
by=collections.defaultdict(list)
for r in out:by[r['category']].append(r)
md=["# PuppyGuido keyword categories (2026-11-01)\n","Sources: Google Autocomplete (US, 25 seeds x 30 modifiers) + URL slugs of competitor sitemaps (Happy Puppy Site, Puppy In Training, Spruce Pets, AKC, PDSA, Hepper). **No search volume**: these are real Google suggestions, so they show demand but not size. Re-rank with Search Console impressions.\n","Status: covered = an article already matches, partial = weak match, GAP = no article.\n"]
for c,_ in CATS+[("Other",0)]:
    rs=by.get(c,[]);
    if not rs: continue
    g=[r for r in rs if r['status']=='GAP']
    md.append(f"\n## {c}  ({len(rs)} keywords, {len(g)} gaps)")
    comp=cats.get(c if c in cats else '',{})
    if comp: md.append(f"Competitors publish {comp['n']} pages here. Top words: "+', '.join(w for w,_ in comp['top_words'][:8]))
    md.append("Top gap keywords:\n"+'\n'.join(f"- {r['keyword']}" for r in g[:15]))
open('keyword_categories.md','w',encoding='utf-8').write('\n'.join(md))
print(len(out)); 
for c in by: print(len(by[c]),sum(r['status']=='GAP' for r in by[c]),c)
