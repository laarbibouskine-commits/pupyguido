# Content consolidation plan (internal, not published)

## Potty training: `puppy-potty-training-schedule` vs `puppy-potty-training-timeline`

| | schedule (hand-written, live since 2026-10-02) | timeline (auto-written 2026-10-06, DRAFT) |
|---|---|---|
| Search intent | "what do I do and when": daily routine, trips out, accidents | "how long will it take": expectations by age |
| Keyword score (docs/keyword-research.md) | 33 | 31 |
| Length | about 560 words | about 1,840 words |
| Review status | written and edited by hand | unreviewed AI text; contains unsourced age and duration claims |

Recommendation:
1. Keep `/blog/puppy-potty-training-schedule/` as the main potty page. It is already live and its intent (routine) is the broader one.
2. Keep the timeline as a draft (`"draft": true`). Do not publish it as is.
3. Two options after a human review:
   - **A (preferred if the timeline stays a separate intent):** rewrite it to cover only "how long and what to expect", with no daily routine content, check every age or duration claim against a vet or trainer source, set `"draft": false`, and link the two posts to each other.
   - **B (if the review finds more than about a third overlap):** move the useful "how long does it take" section into the schedule post, then keep the timeline URL unpublished.
4. Redirect plan: the timeline URL was public for part of 2026-10-06. After this change it returns 404. If you choose B and want to keep any link equity, add to the redirect list in `build/build.js`:
   `{ source: '/blog/puppy-potty-training-timeline/', destination: '/blog/puppy-potty-training-schedule/', permanent: true }`
   Do not add it if you choose A, since the URL will be live again.

## Other overlaps to review later
- `puppy-first-night-home` and `puppy-crying-at-night` (both about the first nights). Keep both for now. Cross-link, and make sure the headings do not repeat.
- `crate-training-a-puppy` came from the auto-writer and is live. Review it too.
- `new-puppy-checklist`, `how-to-stop-puppy-biting` are short (about 480 and 550 words). Expand with real detail later, do not pad.
