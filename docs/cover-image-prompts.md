# Cover photos still needed (one unique photo per article)

The cover template (`coverHtml` in `build/build.js`, styles at the end of `site/styles.css`) shows a photo on top and a navy band with the title underneath. Articles without a `coverPhoto` show the branded paw pattern until a photo exists.

How to add a photo for an article:
1. Save a 16:9 image, at least 1600x900, as `site/assets/blog/cover-<slug>.jpg`.
2. In `content/posts/<slug>.json` add `"coverPhoto": "/assets/blog/cover-<slug>.jpg"` and `"coverAlt": "<describe the photo>"` after `imageAlt`.
3. Run `node build/build.js`. The social card (`og-<slug>.jpg`) is generated separately and still uses the paw pattern until the photo is also added to the PHOTOS table in the cover script.

Style for every prompt: realistic editorial pet photography, natural light, golden retriever or similar puppy (8 to 16 weeks), face clearly visible, natural proportions, no text, no people's faces, no watermark, 16:9, space in the lower third.

| Slug | Prompt (subject and scene) |
|---|---|
| puppy-crying-at-night | A puppy awake in a dark room beside a night light, looking toward the camera with a worried, sleepy face |
| crate-training-a-puppy | A puppy calmly stepping into an open, appropriately sized wire crate with a soft blanket and a chew toy inside |
| how-to-prepare-for-a-puppy-checklist | A tidy puppy-proofed living room corner with a playpen, bed and bowls ready, an empty space waiting for the puppy |
| puppy-schedule-when-working-full-time | A puppy resting in a safe playpen with a chew toy, a laptop and coffee cup blurred in the background |
| can-you-leave-a-puppy-alone-for-8-hours | A puppy in a playpen looking up toward a front door, a leash and keys on a hook in the background |
| puppy-blues-regret-getting-a-puppy | A puppy and a person's tired hand resting on a sofa, soft morning light, calm and reassuring mood |
| how-to-stop-puppy-biting | A puppy gently mouthing a rubber chew toy on a rug, toy clearly visible |
| when-does-puppy-biting-stop | A slightly older puppy (4 to 5 months) calmly holding a chew toy, relaxed expression |
| puppy-potty-training-regression | A puppy on a leash outdoors on grass, looking up at the camera, a treat in a hand at the edge of the frame |
| puppy-potty-training-timeline | A puppy on grass in a garden, sniffing the lawn, bright daylight |
| puppy-socialization-checklist (when published) | A puppy sitting on a path while a calm adult dog stands at a distance, sunny park, both relaxed |
