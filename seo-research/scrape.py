# Collects URL slugs/titles from competitor sitemaps + Google Autocomplete for puppy seeds. Output: raw_urls.json, autocomplete.json
import re, json, sys, urllib.request, urllib.parse, gzip, time
UA={"User-Agent":"Mozilla/5.0 (compatible; PuppyGuidoResearch/1.0)"}
def get(u,t=25):
    try:
        r=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=t); b=r.read()
        if b[:2]==b'\x1f\x8b': b=gzip.decompress(b)
        return b.decode('utf-8','ignore')
    except Exception as e: return ''
SITES={
 "puppyintraining.com":["https://puppyintraining.com/sitemap_index.xml","https://puppyintraining.com/sitemap.xml"],
 "thehappypuppysite.com":["https://www.thehappypuppysite.com/sitemap_index.xml","https://www.thehappypuppysite.com/wp-sitemap.xml","https://www.thehappypuppysite.com/post-sitemap.xml"],
 "petful.com":["https://www.petful.com/sitemap_index.xml","https://www.petful.com/wp-sitemap.xml"],
 "thesprucepets.com":["https://www.thesprucepets.com/sitemap.xml"],
 "akc.org":["https://www.akc.org/sitemap.xml","https://www.akc.org/sitemap_index.xml"],
 "pdsa.org.uk":["https://www.pdsa.org.uk/sitemap.xml"],
 "rover.com":["https://www.rover.com/blog/sitemap.xml","https://www.rover.com/blog/sitemap_index.xml"],
 "hepper.com":["https://www.hepper.com/sitemap_index.xml","https://www.hepper.com/sitemap.xml"],
 "dogstrust.org.uk":["https://www.dogstrust.org.uk/sitemap.xml"],
 "wagwalking.com":["https://wagwalking.com/sitemap.xml"],
 "puppyspot.com":["https://puppyspot.com/sitemap.xml"],
 "puppyhq.com":["https://puppyhq.com/sitemap_index.xml","https://puppyhq.com/sitemap.xml"],
}
out={}
for site,starts in SITES.items():
    seen=set(); urls=set(); q=list(starts)
    while q and len(seen)<14:
        s=q.pop(0)
        if s in seen: continue
        seen.add(s); x=get(s)
        locs=re.findall(r'<loc>\s*([^<\s]+)\s*</loc>',x)
        for l in locs:
            if re.search(r'sitemap.*\.xml(\.gz)?$',l) and ('post' in l or 'blog' in l or 'article' in l or 'page' in l or 'category' in l or 'tag' in l or 'sitemap' in l): q.append(l)
            else: urls.add(l)
    out[site]=sorted(urls); print(site,len(urls),flush=True)
json.dump(out,open("raw_urls.json","w"))
# autocomplete
seeds=["puppy","new puppy","puppy training","how to train a puppy","puppy potty","puppy crate","puppy biting","puppy sleep","puppy feeding","puppy socialization","puppy vaccination","puppy teething","puppy leash","puppy schedule","puppy checklist","puppy chewing","puppy barking","puppy separation anxiety","puppy health","puppy supplies","puppy first week","puppy age 8 weeks","puppy 12 weeks","puppy 4 months","puppy 6 months"]
ac={}
mods=[""]+list("abcdefghijklmnopqrstuvw")+["how","why","when","what","can","should","is my"]
for s in seeds:
    r=set()
    for m in mods:
        q=(s+" "+m).strip() if m not in("how","why","when","what","can","should","is my") else m+" "+s
        try:
            t=get("https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q="+urllib.parse.quote(q),10)
            for k in json.loads(t)[1]: r.add(k)
        except Exception: pass
        time.sleep(0.15)
    ac[s]=sorted(r); print(s,len(r),flush=True)
json.dump(ac,open("autocomplete.json","w"),indent=0)
