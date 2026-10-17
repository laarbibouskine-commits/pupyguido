# PuppyGuido audit: more email signups and sales (2026-10-17)
Not published. Facts come from reading the live site source, the n8n lead workflow and our own files today. Everything under "Recommendation" is a suggestion, not a measured result. We have no conversion data yet, so no number below is a prediction.

## 1. Verified facts (what exists today)
- Homepage hero: "Your puppy's first days, made easier." + button "Get your free puppy guide" + "See the 14-day plan". Title: "Free New Puppy Survival Guide & 14-Day Plan".
- The form asks **Full name + Email**, button "Get my free guide". The signup form appears twice on the homepage (middle block and bottom block) plus a compact box in each blog post.
- The lead workflow (n8n 1mc5qQxVmzLURVKT) **rejects a lead without a name**, always stores source = "Pinterest" (even for Google or Facebook visitors), emails the PDF **as an attachment** (no download link), and greets "Hi {name}".
- Free-guide thank-you page (`/thank-you.html`): "You're in!", tells people to check the inbox, offers the $9 "Puppy Blues Rescue Plan" (Gumroad). There is **no download link** and no offer for the new products.
- Homepage sections in order: hero, "Sound familiar?", "The PuppyGuido system", "What's inside" (12 cards), "14-day plan" (14 days), checklists preview, training system, routines, who it's for, about, signup, FAQ, final CTA. The signup button appears about 6 times; "Get the free guide / Send me the guide / Get the full plan free" are 3 wordings of the same ask.
- A visual of the guide cover already exists in the hero and the signup block (CSS mockup with the mascot). There is no real page preview of the PDF.
- Trust today: FAQ says no punishment, "does not replace a vet" in FAQ, footer and a disclaimer block; /how-we-write/, author box on posts, /about/. **There are no testimonials, no named author credentials, and no vet or trainer credential anywhere.** Do not add any until real ones exist.
- Paid products (Lemon Squeezy, test mode, awaiting approval): Starter Kit $17 (11 pages), Health Tracker $7 (5 pages), Bundle $22, Playbook $37 (34 pages). Sales pages `/starter-kit/`, `/thank-you-kit/`, 3 breed pages, all noindex and not linked. Checkout links are empty until LS approves.
- Follow-up emails today: day 2, day 5, day 9 (the day-9 email sells the $9 Gumroad plan). Weekly newsletter live since 2026-10-16.
- SEO: unique titles and descriptions, canonical, sitemap, FAQ schema, 10 posts, shop pages. Sitemap has no lastmod on non-blog pages.

## 2. Priorities (do in this order)
**P1 (this week, low risk, no new tools)**
1. Email-only form + fix source tracking (workflow edit + form edit).
2. Hero rewrite around "First 14 Days".
3. Cut repetition: one signup block mid-page, one at the end, one CTA wording.
4. Thank-you page: add a "Get your guide" button and the Starter Kit offer (after LS approval; until then the free blog links).
5. Visible vet disclaimer line under the form.

**P2 (after Lemon Squeezy is live)**
6. Real PDF page previews (we have the pages as images).
7. Low-ticket offer on the thank-you page and in emails.
8. Welcome sequence email 1 and 5 (see section 6). Emails 2-4 already exist.

**P3 (when real data exists)**
9. Testimonials (only real, with permission).
10. SEO items (section 8).

## 3. Hero: exact replacement copy
- Eyebrow: `Free for new puppy parents`
- H1: `Your first 14 days with a new puppy, one clear step at a time.`
- Sub: `A free guide with a day-by-day plan, a potty schedule and simple checklists, so you always know what to do today. Gentle, positive methods only.`
- Form (email only) placeholder: `Your email`
- Button: `Send me the free guide`
- Under button: `Free PDF to your inbox. No spam, unsubscribe any time. General information, not veterinary advice.`
- Secondary link (text link, not a button): `See the 14-day plan`
- Keep the existing 4 chips (Checklists, Routines, 14-day plan, Positive training).

## 4. Form (email only)
- Fields: email + hidden honeypot. Remove "Full name".
- Workflow changes: `Validate Lead` stops requiring a name (`nameOk = true`); name saved as empty; email greeting becomes `Hi there,` when no name; add a hidden `source` field per page (home, blog slug, pinterest) and store it instead of the fixed "Pinterest"; WhatsApp alert shows the real source.
- Error text stays as is.

## 5. CTA copy (one wording, used everywhere)
| Where | Text |
|---|---|
| Nav button | `Free guide` |
| Hero + final CTA + blog boxes | `Send me the free guide` |
| 14-day plan section | `Get the 14-day plan free` |
| After "What's inside" | no button (just scroll to form) |
| Starter Kit page | `Get the Starter Kit` |
| Breed pages | `Get the Playbook` |
Remove: "Send me the guide" (middle block heading), "Get the full plan free", the second "Get my free guide" wording. Result: 3 signup moments on the homepage instead of about 6.

## 6. Page structure (homepage, recommended)
1. Hero (copy above) with email form on the first screen.
2. "Sound familiar?" (keep, 3 cards).
3. **"See inside the guide"**: real page previews (3 to 4 PDF page images in a row) + one line each. Replaces the CSS-only mockup and merges "The PuppyGuido system" and "What's inside" into one section (keep the 12 topics as a compact list).
4. 14-day plan (keep, collapse to week 1 / week 2 tabs; it already has them).
5. Who it's for (merge with "What you'll gain").
6. About + how we write (short, link to /how-we-write/).
7. FAQ.
8. Final signup block.
Remove or merge: the separate Routines section and the Training system block (their content is covered in the guide preview and the blog).

## 7. Thank-you page (free guide)
Headline: `You're in! Your guide is on its way.`
- Button: `Open the guide` (needs the PDF hosted at a public URL; today it is only in a private storage bucket and attached to the email. Decision for the owner: a public link means anyone with the link can download it. Recommended: keep the email attachment as the main delivery and add the link, since the guide is free.)
- Line: `Check Spam or Promotions if you do not see it in 2 minutes.`
- Offer card (after LS approval): `Want everything done for you? The New Puppy Starter Kit has the printable 30-day plan, potty schedule, crate checklist and first-week checklist. $12, instant PDF, 30-day money-back guarantee.` Button `Get the Starter Kit`.
- Below: 3 helpful blog links. Keep the vet disclaimer.

## 8. Paid product recommendation (one product, $7-15)
**New Puppy Starter Kit, price $12** (today $17). Reason: it is the product that matches the free guide (same audience, same moment), it is the one already built and tested (11 pages, printable), and $12 sits inside the $7-15 range while the Bundle ($17, Kit + Tracker) and the Playbook ($37, upsell $27) stay as step-ups. This is a recommendation: it changes the LS prices we set earlier ($17 / $22), and $12 vs $17 has not been tested, so run $12 for the first 2 to 4 weeks and compare. Alternatives: a new "Potty Training Bundle" would mean making a new product; the Tracker alone ($7) is too narrow as a first offer.

## 9. Welcome sequence (5 emails, plain-text style, no medical claims)
1. **Immediately: delivery.** Subject: `Your New Puppy Survival Guide`. Body: guide attached + link, 3-line "start here: read Day 1 and Day 2 tonight", reply invitation. (Exists; add the download link and make the name optional.)
2. **Day 2** (exists): `Your first week with your puppy: 3 things that help` (routine, potty moments, calm goodbyes) + blog link.
3. **Day 5** (exists): `Feeling overwhelmed? That's normal` (puppy blues) + blog link.
4. **Day 9** (exists, **change**): `A simple 30-day plan if you want more help`. Replace the $9 Gumroad plan with the Starter Kit offer once LS is live.
5. **Day 14 (new):** Subject: `How is your puppy doing?` Body: `You have been at this for two weeks. Which part is hardest right now: nights, potty, biting or being alone? Reply with one word and I will point you to the right guide.` + links to the 4 matching posts + one soft line: `If you want it all in one printable pack, the Starter Kit is here: [link]`. This email also collects real feedback; replies can become testimonials **only with explicit permission**.
Sender stays hello@puppyguido.com, unsubscribe link in every email, weekly newsletter continues after day 14.

## 10. Trust (without inventing anything)
- Testimonials: none exist, so show none. Collect them: email 5 asks for replies; ask permission to quote with first name and country. Until then show real facts instead: `Free. No credit card. 30-day money-back guarantee on paid products. Positive methods only. Sources and how we write: /how-we-write/`.
- Author credentials: none are verified. Do not claim trainer or vet credentials. Say honestly who writes: `Written by the PuppyGuido team, a puppy-parent education brand. We are not veterinarians.` (confirm the exact wording with the owner).
- Vet disclaimer (visible, under the form and in the footer): `PuppyGuido gives general educational information, not veterinary advice. Ask your vet about your puppy's health, vaccines, food and exercise.` (already in FAQ and footer; add it under the form.)
- No "vet approved", "trusted by X owners", counters or ratings.

## 11. SEO improvements
**Homepage**
- Title (about 60 chars): `Free New Puppy Guide: 14-Day Plan & Checklists | PuppyGuido`
- Meta description: `Free PDF for first-time puppy parents: a 14-day plan, potty schedule, crate and biting tips and simple checklists. Positive methods only.`
- One H1 only (the new hero H1). Add Organization and WebSite schema (FAQ schema exists).
**Blog**
- Add the "Updated" date and `lastmod` in the sitemap for every page; add 3 internal links per post to related posts plus the free-guide box (exists).
- Publish more of the long-tail topics the auto-blog is already covering (next: why a puppy won't pee outside); each post answers one question in the first 2 sentences (exists) and has FAQ schema (exists).
- Add a "Start here" hub page linking all posts by stage (week 1, potty, biting, sleep) and link it from the nav.
**Product pages**
- Keep the sales pages noindex until checkout is live. Then index `/starter-kit/` only, with Product schema (name, price, availability, no fake ratings) and a plain-text FAQ.
- Breed pages stay noindex (ad landing pages, thin on purpose).
**Measure**
- Search Console: add the property, submit the sitemap, check in 2 to 4 weeks. Track: signups per page (needs the hidden `source` field above), signup rate, Playbook/Kit clicks.

## 12. What not to do
No fake testimonials, no fake urgency or counters, no medical or behaviour-guarantee claims ("stops biting in 7 days"), no "vet approved". Ads: wait for live checkout.
