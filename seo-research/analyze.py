import json,re,collections,os
P=json.load(open('puppy_urls.json'))
CATS=[ # (category, regex on slug words) first match wins
("Potty training & housebreaking",r"potty|housebreak|house-train|house train|pee|poop|toilet|accident|crate-train.*(night|potty)|bell|pad"),
("Crate training & sleep",r"crate|kennel|sleep|night|bed\b|bedtime|nap|cry|whin"),
("Biting, chewing & teething",r"bit(e|ing)|nip|mouth|chew|teeth|teething|destruct"),
("Basic obedience & commands",r"command|sit\b|stay|recall|come-when|leave-it|heel|leash|walk|obedien|trick|cue|clicker|train-a-puppy|training"),
("Behavior problems",r"bark|howl|jump|zoom|aggress|growl|anxiety|separation|fear|dig|counter-surf|hyper|calm|behavio"),
("Socialization & first experiences",r"social|meet|vaccin.*play|exposure|other-dogs|kids|children|cat|new-people|puppy-class|puppy-kinder|playdate"),
("Feeding & nutrition",r"food|feed|diet|nutrition|kibble|treat|meal|water|eat|raw|grain|formula|weigh"),
("Health, vets & vaccinations",r"vaccin|vet\b|worm|flea|tick|parvo|sick|vomit|diarrh|health|neuter|spay|insur|microchip|deworm|symptom|poison|toxic|safe"),
("New puppy prep & checklists",r"checklist|prepare|first-(day|night|week)|bringing|essential|supplies|what-to-buy|need|home|new-puppy|guide|tips|first-time|blues|adopt|choose|buy|choosing|breeder|name"),
("Gear & products (reviews)",r"best-|review|toy|collar|harness|bed|crate-pad|leash|bowl|brush|shampoo|pen|gate|stroller|camera|monitor"),
("Age & development stages",r"week|month|year-old|age|stage|growth|grow|how-big|size|weigh|adolescen|teen|sleep-through"),
("Exercise, play & enrichment",r"exercise|play|game|enrich|energy|walk|run|swim|fetch|boredom|mental"),
("Grooming & care",r"groom|bath|nail|ear|brush|clean|coat|shed|teeth-brush|dental"),
("Breeds (puppy-specific)",r"golden|labrador|lab\b|german-shepherd|beagle|poodle|bulldog|husky|corgi|dachshund|rottweiler|doodle|chihuahua|pug|boxer|collie|shih|yorkie|terrier|spaniel|retriever|breed"),
("Travel, home & safety",r"car|travel|puppy-proof|proof|alone|home-alone|daycare|board|holiday|apartment|work|stairs|fence|garden"),
]
STOP=set("the a an of to and for in on is are how what why when do does your you my with from at by or it be can best top guide complete ultimate puppy puppies dog dogs".split())
res=collections.OrderedDict((c,{"urls":[],"sites":collections.Counter(),"words":collections.Counter()}) for c,_ in CATS); res["Other / uncategorised"]={"urls":[],"sites":collections.Counter(),"words":collections.Counter()}
seen=set()
for site,urls in P.items():
    for u in urls:
        slug=re.sub(r'-\d{4,}$','',u.rstrip('/').split('/')[-1]).lower()
        if len(slug)<8 or slug in seen or not re.search(r'pupp|train|potty|crate|bit|sleep|first|new|week|month|feed',slug): continue
        seen.add(slug); phrase=slug.replace('-',' ')
        for c,rx in CATS:
            if re.search(rx,slug): break
        else: c="Other / uncategorised"
        res[c]["urls"].append((site,phrase)); res[c]["sites"][site]+=1
        for w in phrase.split():
            if w not in STOP and len(w)>2: res[c]["words"][w]+=1
json.dump({c:{"n":len(v["urls"]),"sites":dict(v["sites"]),"top_words":v["words"].most_common(15),"examples":[p for _,p in v["urls"][:40]]} for c,v in res.items()},open('categories.json','w'),indent=1)
for c,v in res.items(): print(f'{len(v["urls"]):4} {c} | '+', '.join(w for w,_ in v["words"].most_common(8)))
