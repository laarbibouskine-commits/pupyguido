# PuppyGuido - project state (saved 2026-10-15)

Brand: PuppyGuido, "Happy Puppy. Happy Life." Site https://puppyguido.com (static, Vercel, GitHub laarbibouskine-commits/pupyguido, main).
Audience: first-time puppy parents in US, UK, Australia, New Zealand. Owner has NO registered business.

## Live
- Site + blog + RSS (/blog/rss.xml) + shop (8 affiliate picks + ebook "Puppy Blues Rescue Plan" $9, Gumroad bouskine5.gumroad.com/l/ucvyei).
- Lead workflow n8n 1mc5qQxVmzLURVKT (active; WhatsApp alert +212616721591 via Evolution instance bouskine).
- Auto Blog n8n IONrEmueIdUQc1qF: ACTIVE Tue+Fri 09:00, writer anthropic/claude-haiku-5.5 via OpenRouter (Gemini fallback), quality gate (else draft), WhatsApp alert.
- Make (eu1, org 1906730, free plan, 2 active): 7893968 RSS -> Pinterest pin (board by category); 7897206 RSS -> LinkedIn company post (page PuppyGuido).
- Pinterest account pupyguido, Facebook Page PuppyGuido (id 61594997983915), LinkedIn page PuppyGuido (id 146716258, logo+cover+About), Instagram @puppyguido (1 post).

## Built but INACTIVE (owner must run/activate in n8n UI)
- n8n lqpq4OaPeIuqwqCw "Instagram daily post" (17:00 UTC, posts 2-6, WhatsApp OK/FAILED) - credential "puppyguido instagram".
- n8n Hc1P36jBSPnHmXne "Instagram reels" (18:00 UTC, odd days, 4 reels).
- n8n kzX43R0vkQWzAbLH LinkedIn autopost to PERSONAL profile (token Header Auth) - keep inactive, Make handles the page.
- Instagram token expires ~60 days; LinkedIn Make connection ~2 months.

## Impact.com
- Account "bouskine" (6229393), signed in with Google. Only application: Namecheap = Declined. Brand-sized account.
- Was adding Website property puppyguido.com under Settings > Media Properties (Promotional Channels > Website); needs a verification method (owner clicks).
- Next: apply to pet brands, then add tracking links to content/picks with disclosure.

## Rules the owner set
- Never publish/activate/delete without explicit approval (owner has since delegated most of the above).
- Never ask for passwords/OAuth: owner signs in and clicks Allow.
- Reply in simple English + Moroccan Darija.

## Files
- Social assets: C:\Users\user\Downloads\PuppyGuido_Instagram (posts, reels, avatar, linkedin/facebook banners, CAPTIONS.txt).
- Ebook: C:\Users\user\Downloads\PuppyGuido_Ebook. Pinterest pins: C:\Users\user\Downloads\PuppyGuido_Pinterest.
- Memory notes: C:\Users\user\.claude\projects\C--Users-user\memory\pupyguido-content-system.md

## Update 2026-10-15 (evening)
- Reels: 20 reels (12 designed + 8 Pexels-clip reels pxreel01-08, all with original synth background music) in site/assets/social; n8n Hc1P36jBSPnHmXne posts every other day 18:00 UTC.
- Facebook cross-post: n8n F2T5cPuGVCYwRSKl (called by the IG image + reels workflows via Execute Workflow). Credential "PuppyGuido Facebook" (facebookGraphApi, long-lived USER token, expires ~2026-12-14; renew ~Dec 10 via Graph API Explorer app "PuppyGuido Poster" 1086480780806274, Page id 1337844736084804). Page token is fetched at runtime from /{pageId}?fields=access_token. First test reel 2026-10-15 posted OK.
- Lead follow-up emails: n8n VhItVIA5DTYm7qjG ACTIVE, daily 09:30 UTC, day 2/5/9, skips Gmail replies containing "unsubscribe", credential Gmail "n8n Gmailpuppy".
- Analytics: Vercel Web Analytics enabled (cookieless), script in build.js layout + site/index.html; privacy page mentions it.
- Amazon Associates US: tag bouskine-20 (tax info still to be submitted by user). 10 Amazon picks in content/picks (search links with tag), "Helpful gear" boxes under articles (content/gear.json, gearBox() in build.js), disclosure in shop note.
- Pinterest: batch 5 (pin56-84) added; Make scenario 7980682 now 83 pins, ends ~2027-01-05. Local: C:\Users\user\Downloads\PuppyGuido_Pinterest (make-batch5.js, make-blueprint-all.js).
- Pexels clips + reels scripts: C:\Users\user\Downloads\PuppyGuido_Pexels (make-px-reels.js, make-music.js, mix-music.js).
- Reminders: FB token ~Dec 10, IG token early Dec, Make ops reset ~Nov 10, Amazon 3 sales in 180 days, Instagram bio link done.

## Update 2026-10-15 (late)
- Printables: 3 PDFs in site/assets/printables/, content/printables.json, printableBox() in build.js, n8n 20bHvl1woCWY7EX2 (webhook /webhook/pupyguido-printable).
- One compact signup box per article (printableBox || ctaBox); smaller gear/quick/author boxes.
- Editorial: /how-we-write/ page, author box, post fields quick / faq / updated.
- Auto blog IONrEmueIdUQc1qF: 1,500-2,200 words, quick answer, FAQ, gate checks, gear topics interleaved. Next topic puppy-wont-pee-outside.
- Chatbot: n8n brzcKL4IXCOD97z0 (webhook /webhook/pupyguido-chat), widget site/chat.js (small round icon button). Uses credential "lapland content ai" (TaWMcLmDpL9GgfXU); "OpenRouter account" expired. TODO: user creates new OpenRouter key "PuppyGuido" ($5 limit) in n8n, then switch workflow to it.
- Amazon: US tag bouskine-20, UK puppyguido201-21 (amz.js rewrites for UK visitors); AU TAGS.au empty (user later).
- Impact application declined; CJ ignored (do not bring up). AdSense on hold (ads.json enabled=false) until 20-30 articles.
- Reminders: Facebook token renew ~Dec 10, Instagram token early Dec, Make ops reset ~Nov 10, Pinterest pins end ~Jan 5, check Search Console/Analytics in 7-10 days.

## Update 2026-10-16
- Email sending moved from Gmail OAuth to SMTP credential "SMTP account" (w4aiSB6lu6V7aZ3E): lead 1mc5qQxVmzLURVKT, printable 20bHvl1woCWY7EX2, follow-up VhItVIA5DTYm7qjG. Unsubscribe link -> n8n 0OWa8JC1FGExNNNr, column pupyguido_leads.unsubscribed.
- Chatbot now uses credential "PuppyGuido OpenRouter" (WmyiekPONXm5bWLD). Chat button is a small round icon.
- Offer: Lemon Squeezy (test mode, approval pending): Kit $17, Tracker $7, Bundle $22, Playbook $37 (KITBUYER -$10). Pages /starter-kit/ and /thank-you-kit/ (noindex). content/offers.json holds checkout URLs (empty until live).
- Products PDFs: C:\Users\user\Downloads\PuppyGuido_Products (made by PuppyGuido_Pexels/make-kit.js, make-playbook.js).
- 26 shop picks incl. 7 premium/budget Amazon (US tag bouskine-20; UK rewrite in amz.js).
- Reports: Facebook-competitor-report.md, Marketplace-listing-pack.md (ClickBank/Digistore24: user creates vendor account).

## Update 2026-10-16 (evening)
- Breed ad landing pages (noindex): /labrador-puppy-guide/, /french-bulldog-puppy-guide/, /golden-retriever-puppy-guide/ (content/breeds.json, breedPage() in build/build.js). Ads-copy-breeds.md has copy/targeting.
- Ad creatives: C:\Users\user\Downloads\PuppyGuido_Ads (9 videos, 9 images, 15 carousel slides); generator PuppyGuido_Pexels\ads\make-ads.js. Do not run ads before live LS checkout.
- Meta Pixel ID 1092514180372785 via site/consent.js (cookie banner, loads after Accept; PageView/ViewContent/InitiateCheckout). Purchase event TODO after LS live.
- Weekly newsletter n8n kYRz6Aod7cUrRP1i ACTIVE (Thu 10:00 UTC; tip + newest + rotating post; SMTP; skips unsubscribed).
- vercel.json: /go/ redirects for the 7 new shop picks (were uncommitted, 404 live until pushed).
- Waiting on Lemon Squeezy approval (demo video sent). Then: live products, offers.json checkout URLs, KITBUYER, 34-page Playbook upload, Purchase event, ads.
