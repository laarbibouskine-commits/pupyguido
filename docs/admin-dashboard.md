# PuppyGuido Admin Dashboard

Browser tool to list, write, preview and publish blog articles without editing JSON. URL: `/admin/` (not indexed, strict CSP, no-store).

## Data flow
```
Browser (/admin/, static page + admin.js)
   |  fetch /api/admin?action=...  (HttpOnly session cookie, same-origin only)
   v
Vercel function api/admin.js  --(GITHUB_TOKEN, server-side only)-->  GitHub repo
   content/posts/<slug>.json        articles ("draft": true by default)
   site/assets/uploads/<file>       uploaded images
   |
   v  every commit to main triggers the normal Vercel build (build/build.js) -> dist/
```
- Articles stay as `content/posts/*.json`; `build/build.js` still only publishes files with `"draft": false` (default-deny).
- Saving a draft never changes the live site (the commit triggers a rebuild, but drafts are excluded).
- Publishing writes `"draft": false`, so it changes the live site after the rebuild (about a minute).
- Built-in (legacy) articles from `build/posts.js` are listed read-only; editing one saves a hidden draft copy that overrides the original only after you publish it.
- No Supabase involvement: no database write access is exposed to the browser.

## Security
- Login: scrypt password hash in `ADMIN_PASSWORD_HASH`; signed HMAC cookie (`HttpOnly; Secure; SameSite=Strict`, 8 h); 5 failed attempts lock the address for 15 min (per warm instance, best effort).
- Every write is a POST that must carry `X-Requested-With: pg-admin` and a same-origin `Origin` (CSRF).
- Publish / update live / unpublish require: typing the slug AND re-entering the admin password. Save cannot modify a live article.
- Body HTML is sanitised on the server (allow-list of tags/attributes; scripts, event handlers, `javascript:` removed).
- Images: JPG/PNG/WebP only (magic-byte check), max 2 MB, random-suffixed names under `site/assets/uploads/`.
- The GitHub token never reaches the browser. Use a fine-grained token limited to this one repository with "Contents: read & write" only.

## Setup (once, by the site owner)
Simple setup (two values):
1. Create a fine-grained GitHub token (repo `laarbibouskine-commits/pupyguido` only, permission Contents: Read and write).
2. In Vercel > project `pupyguido` > Settings > Environment Variables add: `ADMIN_PASSWORD` (a long password you choose, 12+ chars) and `GITHUB_TOKEN`. The session key is derived from the token.
   Advanced alternative: `node scripts/hash-password.js` and use `ADMIN_PASSWORD_HASH` + `SESSION_SECRET` instead of `ADMIN_PASSWORD`. Optional: `GITHUB_REPO`, `GITHUB_BRANCH` (default `main`).
4. Deploy (merge this change), then open `/admin/`.

Cost: none beyond the existing free tiers (Vercel function invocations are tiny; GitHub API is free).

## Tests
`node scripts/test-admin.js` (offline, GitHub mocked): auth, lockout, CSRF, validation, draft-by-default, slug uniqueness, publish confirmation + password, sanitising, upload checks, preview.

## Known limits
- Preview opens the real site layout in a new tab from the unsaved form content.
- Concurrent edits are guarded by the file sha (a second editor gets a conflict message).
- Uploaded images become public after the next build because they live in `site/assets/uploads/`.
- No delete action by design.
