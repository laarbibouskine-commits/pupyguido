# Cover photos

Each article has its own cover photo (`coverPhoto` in `content/posts/<slug>.json`, file `site/assets/blog/cover-<slug>.jpg`). Never reuse a photo for two articles.

Photos from Pexels (free to use under the Pexels license, attribution not required). The page is `https://www.pexels.com/photo/<id>/`.

| Article | Pexels id |
|---|---|
| puppy-crying-at-night | 21782909 |
| crate-training-a-puppy | 5047575 |
| how-to-prepare-for-a-puppy-checklist | 28990269 |
| puppy-schedule-when-working-full-time | 1750378 |
| can-you-leave-a-puppy-alone-for-8-hours | 8339246 |
| puppy-blues-regret-getting-a-puppy | 20144428 |
| how-to-stop-puppy-biting | 28667156 |
| when-does-puppy-biting-stop | 1750380 |
| puppy-potty-training-regression | 16420806 |
| puppy-potty-training-timeline | 1346086 |
| puppy-socialization-checklist | 12951463 |

The other eight covers use the site's own puppy photos (`site/assets/*.jpg`).

To add a new article cover: save the photo, add it to the PHOTOS table in the cover script, set `coverPhoto` and `coverAlt` in the post JSON, rebuild.
| puppy-feeding-schedule | 8434725 |
