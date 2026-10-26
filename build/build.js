// node build/build.js  ->  writes the public website into dist/ (only dist/ is published, see vercel.json outputDirectory):
//   site/ (homepage, thank-you, css, js, assets) + generated /blog, /shop, /about, /contact, /privacy, /terms, 404.html, sitemap.xml, robots.txt
// Also regenerates vercel.json (redirects + headers) at the repo root, because Vercel reads it before the build.
// Site URL: set SITE_URL (e.g. https://puppyguido.com) in Vercel to switch domains. Default: https://pupyguido.vercel.app
// Posts in content/posts/*.json are published only when they contain "draft": false (auto-written posts are drafts until reviewed).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = (process.env.SITE_URL || 'https://pupyguido.vercel.app').replace(/\/+$/, '');
const DIST = path.join(ROOT, 'dist');
const SRC = path.join(ROOT, 'site');
const EMAIL = 'hello@puppyguido.com';
const CONTENT_DIR = path.join(ROOT, 'content', 'posts');
const jsonAll = fs.existsSync(CONTENT_DIR)
  ? fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8')))
  : [];
// Default-deny: a JSON post is public only with an explicit "draft": false (set by a human after review).
const jsonPosts = jsonAll.filter(p => p.draft === false);
const draftPosts = jsonAll.filter(p => p.draft !== false);
const bySlug = new Map();
for (const p of require('./posts.js').filter(p => p.draft !== true)) bySlug.set(p.slug, p);
for (const p of jsonPosts) bySlug.set(p.slug, p);
const posts = [...bySlug.values()].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

// Optional second image in the middle of an article (fields: midImage, midImageAlt, midImageCaption).
function withMidImage(html, p) {
  if (!p.midImage) return html;
  const parts = html.split(/(?=<h2[ >])/);
  const fig = '<figure class="post-img mid"><img src="' + esc(p.midImage) + '" alt="' + esc(p.midImageAlt || '') + '" width="1200" height="800" loading="lazy">' + (p.midImageCaption ? '<figcaption>' + esc(p.midImageCaption) + '</figcaption>' : '') + '</figure>';
  if (parts.length < 3) return html + fig;
  const at = Math.min(parts.length - 1, Math.max(2, Math.floor(parts.length / 3)));
  parts.splice(at, 0, fig);
  return parts.join('');
}
// --- Google AdSense (OFF by default). Turn on by editing content/ads.json: enabled=true + publisherId + slot ids.
const ADS_FILE = path.join(ROOT, 'content', 'ads.json');
const ADS = fs.existsSync(ADS_FILE) ? JSON.parse(fs.readFileSync(ADS_FILE, 'utf8')) : { enabled: false, slots: {} };
const ADS_ON = !!(ADS.enabled && /^ca-pub-\d{10,}$/.test(ADS.publisherId || ''));
const adsLoader = ADS_ON ? '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADS.publisherId + '" crossorigin="anonymous"></script>' : '';
function adSlot(name) {
  const id = (ADS.slots || {})[name];
  if (!ADS_ON || !id) return '';
  return '<aside class="ad-slot ad-' + name + '" aria-label="Advertisement"><span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block" data-ad-client="' + ADS.publisherId + '" data-ad-slot="' + id + '" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></aside>';
}
function withMidAd(html) {
  const ad = adSlot('articleMiddle');
  if (!ad) return html;
  const parts = html.split(/(?=<h2[ >])/);
  if (parts.length < 5) return html;
  const at = Math.floor(parts.length / 2);
  parts.splice(at, 0, ad);
  return parts.join('');
}

const PRODUCT_DIR = path.join(ROOT, 'content', 'products');
const ownProducts = fs.existsSync(PRODUCT_DIR)
  ? fs.readdirSync(PRODUCT_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_')).map(f => JSON.parse(fs.readFileSync(path.join(PRODUCT_DIR, f), 'utf8'))).filter(p => !p.hidden).sort((a, b) => (a.order || 99) - (b.order || 99))
  : [];

const PICKS_DIR = path.join(ROOT, 'content', 'picks');
const picks = fs.existsSync(PICKS_DIR)
  ? fs.readdirSync(PICKS_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_')).map(f => JSON.parse(fs.readFileSync(path.join(PICKS_DIR, f), 'utf8'))).filter(p => !p.hidden).sort((a, b) => (a.order || 99) - (b.order || 99))
  : [];

const products = [...ownProducts, ...picks];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = d => new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
<symbol id="i-paw" viewBox="0 0 24 24"><ellipse cx="6.5" cy="9.5" rx="2" ry="2.7" fill="currentColor" stroke="none"/><ellipse cx="12" cy="6" rx="2" ry="2.7" fill="currentColor" stroke="none"/><ellipse cx="17.5" cy="9.5" rx="2" ry="2.7" fill="currentColor" stroke="none"/><path fill="currentColor" stroke="none" d="M12 12c-3.2 0-5.5 2.4-5.5 4.9 0 1.8 1.4 2.6 2.8 2.6 1.100 0 1.8-.6 2.7-.6s1.6.6 2.7.6c1.4 0 2.8-.8 2.8-2.6C17.500 14.400 15.200 12 12 12z"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
</svg>`;

const addCurrent = (html, urlPath) => {
  const m = ['/shop/', '/blog/', '/about/', '/contact/'].find(h => urlPath.startsWith(h));
  return m ? html.replace('<a href="' + m + '">', '<a href="' + m + '" aria-current="page">') : html;
};
function layout(o) { return addCurrent(layoutRaw(o), o.urlPath); }
function layoutRaw({ title, description, urlPath, body, extraHead = '', ogImage = '/assets/og-default.jpg', ogImageAlt = '', ogType = 'website', noindex = false }) {
  const url = SITE + urlPath;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
${noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow,max-image-preview:large">'}
<meta name="theme-color" content="#0B1F44">
${adsLoader}
<script defer src="/_vercel/insights/script.js"></script>
<meta name="impact-site-verification" value="e4d04c44-ca0f-45e3-8818-d25fcf41c141">
<meta name="impact-site-verification" value="4f01f581-f1da-4e9f-9366-ce099aaa906e">
<script defer src="/amz.js"></script>
<script defer src="/chat.js"></script>
<script defer src="/consent.js"></script>
<link rel="icon" type="image/png" sizes="48x48" href="/assets/icon-48.png">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="PuppyGuido">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="en_US">
<meta property="og:image" content="${SITE}${ogImage}">
${ogImage === '/assets/og-default.jpg' ? '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n' : ''}<meta property="og:image:alt" content="${esc(ogImageAlt || title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}${ogImage}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800&display=swap"></noscript>
<link rel="stylesheet" href="/styles.css">
${extraHead}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${SPRITE}
<header class="site-header">
  <div class="wrap nav">
    <a class="brand" href="/" aria-label="PuppyGuido home"><img src="/assets/mascot.png" alt="" width="44" height="46"><span>Puppy<b>Guido</b><span class="reg">&trade;</span></span></a>
    <nav class="nav-links" id="menu" aria-label="Main">
      <a href="/#inside">What's inside</a>
      <a href="/shop/">Shop</a>
      <a href="/blog/">Blog</a>
      <a href="/about/">About</a>
      <a href="/contact/">Contact</a>
    </nav>
    <a class="btn btn-gold" href="/#signup">Free guide</a>
    <button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="menu" id="menuBtn"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-menu"/></svg></button>
  </div>
</header>
<main id="main">
${body}
</main>
<footer>
  <div class="wrap">
    <div class="foot">
      <div>
        <div class="brand"><img src="/assets/mascot.png" alt="" width="44" height="46"><span>Puppy<b>Guido</b><span class="reg">&trade;</span></span></div>
        <p>Happy Puppy. Happy Life.<br>A practical system for new puppy parents.</p>
        <p class="tl" style="margin-top:16px">TRAIN &bull; CARE &bull; LOVE</p>
      </div>
      <div><h4>Explore</h4><ul><li><a href="/#inside">What's inside</a></li><li><a href="/#plan">14-day plan</a></li><li><a href="/shop/">Shop</a></li><li><a href="/blog/">Blog</a></li><li><a href="/#faq">FAQ</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="/about/">About us</a></li><li><a href="/how-we-write/">How we write</a></li><li><a href="/contact/">Contact</a></li><li><a href="/privacy/">Privacy policy</a></li><li><a href="/terms/">Terms of use</a></li></ul></div>
    </div>
    <div class="legal"><span>&copy; ${new Date().getFullYear()} PuppyGuido. All rights reserved.</span><span>For educational purposes only. Not veterinary advice. Some links may be affiliate links. Photos via Unsplash.</span></div>
  </div>
</footer>
<script>
(function(){var b=document.getElementById('menuBtn'),m=document.getElementById('menu');b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});m.addEventListener('click',function(e){if(e.target.tagName==='A'){m.classList.remove('open')}});})();
</script>
</body>
</html>`;
}

const pageHero = (kicker, h1, sub) => `<section class="page-hero"><div class="paws" aria-hidden="true"></div><div class="wrap">
<span class="eyebrow"><svg class="ico fill"><use href="#i-paw"/></svg> ${kicker}</span>
<h1>${h1}</h1>${sub ? `<p class="lead">${sub}</p>` : ''}</div></section>`;

const ctaBox = `<aside class="cta-box cta-form"><div class="cta-copy"><h3>Get the free New Puppy Survival Guide</h3><p>Checklists, routines and a 14-day plan for your puppy's first days at home. Free, no spam.</p></div><form class="cta-signup" method="POST" enctype="multipart/form-data" action="https://n8n.satinher.com/webhook/pupyguido-lead" onsubmit="return pgSend(event)"><input name="Email address" type="email" placeholder="Your email" autocomplete="email" required aria-label="Email address"><div aria-hidden="true" style="position:absolute;left:-9999px;height:0;overflow:hidden"><input name="website" type="text" tabindex="-1" autocomplete="off"></div><button class="btn btn-gold" type="submit">Send me the free guide</button><p class="cta-fine">No spam. By signing up you agree to our <a href="/privacy/">Privacy Policy</a>.</p><p class="cta-err" role="alert" hidden></p></form><script>function pgSend(e){e.preventDefault();var f=e.target,b=f.querySelector('button'),er=f.querySelector('.cta-err');er.hidden=true;var d=new FormData(f);if(d.get('website')){location.href='/thank-you.html';return false}d.delete('website');d.set('source',location.pathname);b.disabled=true;var t=b.textContent;b.textContent='Sending...';fetch(f.action,{method:'POST',body:d}).then(function(r){if(!r.ok)throw 0;location.href='/thank-you.html'}).catch(function(){b.disabled=false;b.textContent=t;er.textContent='Sorry, something went wrong. Please try again or email hello@puppyguido.com.';er.hidden=false});return false}</script></aside>`;
const authorBox = (p) => '<aside class="author-box"><strong>By the PuppyGuido editorial team</strong><span>Last reviewed ' + fmtDate(p.updated || p.date) + ' &middot; <a href="/how-we-write/">How we write, check and update our guides</a></span><span>We are not veterinarians. This article is general educational information.</span></aside>';
const sourcesBox = (p) => (p.sources && p.sources.length)
  ? '<aside class="sources" aria-labelledby="sources-h"><h2 id="sources-h">Sources and further reading</h2><p>Reputable animal-welfare organisations and published research on the same topic. Use them to double-check advice and for more detail.</p><ul>' + p.sources.map(s => '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.org) + ': ' + esc(s.title) + '</a></li>').join('') + '</ul></aside>'
  : '';
const disclaimer = `<p class="disc"><b>Disclaimer.</b> PuppyGuido provides general educational information and does not replace advice from a qualified veterinarian or professional trainer.</p>`;


// "Helpful gear" box: 1-2 Amazon picks under an article (mapping in content/gear.json; falls back to the post category).
const GEAR_FILE = path.join(ROOT, 'content', 'gear.json');
const GEAR = fs.existsSync(GEAR_FILE) ? JSON.parse(fs.readFileSync(GEAR_FILE, 'utf8')) : { slugs: {}, categories: {} };
function gearBox(p) {
  const slugs = (GEAR.slugs && GEAR.slugs[p.slug]) || (GEAR.categories && GEAR.categories[p.category]) || [];
  const picks = slugs.map(s => products.find(x => x.slug === s)).filter(x => x && !x.hidden && x.url);
  if (!picks.length) return '';
  const items = picks.map(x => '<li><a href="' + esc(x.url) + '" target="_blank" rel="sponsored nofollow noopener"><strong>' + esc(x.title) + '</strong></a><span>' + esc(x.short || '') + '</span></li>').join('');
  return '<aside class="gear-box"><h3>Helpful gear</h3><ul>' + items + '</ul><p class="gear-note">As an Amazon Associate we earn from qualifying purchases. Always check that an item suits your puppy\'s size and age.</p></aside>';
}


// Optional post fields: quick (short answer box), faq: [{q, a}] (rendered + FAQPage schema), updated (dateModified), author note.
function quickBox(p) {
  return p.quick ? '<aside class="quick-answer"><strong>Quick answer</strong><p>' + p.quick + '</p></aside>' : '';
}
function faqHtml(p) {
  if (!p.faq || !p.faq.length) return '';
  return '<h2 id="faq">Frequently asked questions</h2>' + p.faq.map(x => '<h3>' + esc(x.q) + '</h3><p>' + x.a + '</p>').join('');
}
function faqLd(p) {
  return { '@type': 'FAQPage', mainEntity: p.faq.map(x => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: String(x.a).replace(/<[^>]+>/g, '') } })) };
}


// "Free printable" box: PDF by email (content/printables.json maps slugs and categories to a printable).
const PRINT_FILE = path.join(ROOT, 'content', 'printables.json');
const PRINT = fs.existsSync(PRINT_FILE) ? JSON.parse(fs.readFileSync(PRINT_FILE, 'utf8')) : { printables: {}, slugs: {}, categories: {} };
function printableBox(p) {
  const key = (PRINT.slugs && PRINT.slugs[p.slug]) || (PRINT.categories && PRINT.categories[p.category]);
  const it = key && PRINT.printables[key];
  if (!it) return '';
  return '<aside class="cta-box cta-form printable-box"><div class="cta-copy"><h3>Free printable: ' + esc(it.title) + '</h3><p>' + esc(it.blurb) + ' We will email you the PDF.</p></div>' +
    '<form class="cta-signup" method="POST" enctype="multipart/form-data" action="https://n8n.satinher.com/webhook/pupyguido-printable" onsubmit="return pgSend(event)">' +
    '<input name="Full name" type="text" placeholder="Your first name" autocomplete="name" required aria-label="Your name">' +
    '<input name="Email address" type="email" placeholder="you@example.com" autocomplete="email" required aria-label="Email address">' +
    '<input type="hidden" name="printable" value="' + esc(it.id) + '">' +
    '<div aria-hidden="true" style="position:absolute;left:-9999px;height:0;overflow:hidden"><input name="website" type="text" tabindex="-1" autocomplete="off"></div>' +
    '<button class="btn btn-gold" type="submit">Email me the PDF</button>' +
    '<p class="cta-fine">No spam. By signing up you agree to our <a href="/privacy/">Privacy Policy</a>.</p><p class="cta-err" role="alert" hidden></p></form>' + ctaBox.slice(ctaBox.indexOf('<script>'), ctaBox.indexOf('</script>') + 9) + '</aside>';
}


// Ad landing pages per breed (content/breeds.json). Noindex: used only for ads.
const BREEDS = fs.existsSync(path.join(ROOT, 'content', 'breeds.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'breeds.json'), 'utf8')) : [];
function breedPage(br) {
  const PB = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'offers.json'), 'utf8')).playbook;
  const buy = PB.checkoutUrl ? '<a class="btn btn-gold" href="' + PB.checkoutUrl + '">Get the Playbook - $' + PB.price + ' ' + arrow + '</a>' : '<a class="btn btn-gold" href="/#signup">Notify me when it opens ' + arrow + '</a>';
  const li = br.expect.map(x => '<li>' + esc(x) + '</li>').join('');
  return layout({
    title: br.name + ' Puppy Training Playbook | PuppyGuido',
    description: 'A calm, positive 12-week plan for ' + br.name + ' puppy parents: potty training, crate and alone time, biting, sleep, socialization and 8 first cues.',
    urlPath: '/' + br.slug + '/', noindex: true,
    body: '<section class="lp-hero"><div class="wrap lp-grid"><div>' +
      '<span class="eyebrow"><svg class="ico fill"><use href="#i-paw"/></svg> For ' + esc(br.name) + ' puppy parents</span>' +
      '<h1>Raising a ' + esc(br.name) + ' puppy? <span class="hl">Your 12-week plan</span></h1>' +
      '<p class="lead">' + esc(br.lead) + '</p>' +
      '<p class="lp-cta">' + buy + '</p>' +
      '<p class="lp-fine">Instant PDF download &middot; positive methods only &middot; 30-day money-back guarantee</p></div>' +
      '<div class="lp-card" aria-hidden="true"><img src="/assets/mascot.png" alt="" width="120" height="120"><div class="lp-card-k">The Puppy Training Playbook</div><div class="lp-card-t">+ ' + esc(br.name) + ' notes</div><div class="lp-card-p">$' + PB.price + '</div></div></div></section>' +
      '<section class="sec"><div class="wrap narrow"><div class="prose">' +
      '<h2>What to expect from ' + esc(br.plural) + '</h2><ul>' + li + '</ul>' +
      '<h2>The 3 things new owners ask about most</h2><ul><li><strong>Crying at night.</strong> A simple night routine and what to do when your puppy wakes.</li><li><strong>Potty accidents.</strong> A schedule by age, with a plan for slip-ups.</li><li><strong>Biting and chewing.</strong> Why it happens and how to redirect it kindly.</li></ul>' +
      '<p class="lp-cta">' + buy + '</p>' +
      '<h2>What is inside the Playbook</h2><ul>' +
      '<li>How puppies learn, and a daily routine that works</li><li>Potty training, crate and alone time, biting, sleep</li><li>Socialization and 8 first cues, step by step</li><li>A 12-week roadmap, 20 brain games, cue cards and trackers</li><li>A gear guide with budget, best value and premium picks</li><li><strong>Breed notes for ' + esc(br.plural) + '</strong></li></ul>' +
      '<h2>Breed notes: ' + esc(br.name) + '</h2><p>' + esc(br.notes) + '</p>' +
      '<h2>30-day money-back guarantee</h2><p>If the Playbook is not useful to you, email <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> within 30 days and we will refund you.</p>' +
      '<h2>Questions</h2>' +
      '<h3>Is it only for ' + esc(br.plural) + '?</h3><p>No. The 12-week plan works for any puppy. The breed notes cover Labrador, French Bulldog and Golden Retriever puppies.</p>' +
      '<h3>Do you use punishment or shouting?</h3><p>Never. Every method is positive and reward-based.</p>' +
      '<h3>Is this veterinary advice?</h3><p>No. It is general educational information. Please ask your vet about health, vaccines, food and exercise for your puppy.</p>' +
      '<h3>How do I get it?</h3><p>It is a PDF. You get a download link right after payment, by email.</p>' +
      '<p class="lp-cta">' + buy + '</p>' +
      '<p class="lp-fine">Prefer to try first? <a href="/#signup">Get the free New Puppy Survival Guide</a>.</p>' +
      '</div></div></section>'
  });
}

// Inline affiliate links: first occurrence of an agreed phrase in running text (p/li only, never headings or existing links). Phrases come from content/gear.json -> inline.
function withInlineGear(html, p) {
  const rules = (GEAR.inline && GEAR.inline[p.slug]) || [];
  if (!rules.length) return { html, count: 0 };
  const todo = rules.map(([phrase, slug]) => ({ phrase, pick: products.find(x => x.slug === slug && !x.hidden && x.url), done: false })).filter(r => r.pick);
  const parts = html.split(/(<[^>]+>)/);
  let inA = 0, inH = 0, inBlock = 0, count = 0;
  for (let i = 0; i < parts.length; i++) {
    const t = parts[i];
    if (t.startsWith('<')) {
      const tag = t.toLowerCase().replace(/[^a-z0-9/]/g, ' ').trim().split(' ')[0];
      if (tag === 'a') inA++; else if (tag === '/a') inA--;
      else if (/^h[1-6]$/.test(tag)) inH++; else if (/^\/h[1-6]$/.test(tag)) inH--;
      else if (tag === 'p' || tag === 'li') inBlock++; else if (tag === '/p' || tag === '/li') inBlock--;
      continue;
    }
    if (inA > 0 || inH > 0 || inBlock <= 0 || !t.trim()) continue;
    for (const r of todo) {
      if (r.done) continue;
      const re = new RegExp('\\b' + r.phrase + '\\b', 'i');
      const m = parts[i].match(re);
      if (!m) continue;
      const link = '<a href="' + esc(r.pick.url) + '" target="_blank" rel="sponsored nofollow noopener">' + m[0] + '</a>';
      parts[i] = parts[i].slice(0, m.index) + link + parts[i].slice(m.index + m[0].length);
      r.done = true; count++;
      break;
    }
  }
  return { html: parts.join(''), count };
}

function renderPost(p, all) {
  const url = `/blog/${p.slug}/`;
  const related = all.filter(x => x.slug !== p.slug)
    .map((x, i) => ({ x, i, s: (x.category === p.category ? 0 : 1) }))
    .sort((a, b) => a.s - b.s || a.i - b.i).map(o => o.x).slice(0, 3);
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: p.title, description: p.description, datePublished: p.date, dateModified: p.updated || p.date,
        image: p.midImage ? [SITE + p.image, SITE + p.midImage] : SITE + p.image, mainEntityOfPage: SITE + url,
        author: { '@type': 'Organization', name: 'PuppyGuido', url: SITE + '/how-we-write/' },
        ...(p.sources && p.sources.length ? { citation: p.sources.map(s => s.url) } : {}),
        publisher: { '@type': 'Organization', name: 'PuppyGuido', logo: { '@type': 'ImageObject', url: SITE + '/assets/icon-512.png' } } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog/' },
        { '@type': 'ListItem', position: 3, name: p.title, item: SITE + url } ] }
    ]
  };
  if (p.faq && p.faq.length) ld['@graph'].push(faqLd(p));
  const body = `<article class="post">
<div class="post-head"><div class="paws" aria-hidden="true"></div><div class="wrap narrow">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>${esc(p.category)}</span></nav>
<h1>${esc(p.title)}</h1>
<p class="meta"><span class="tag">${esc(p.category)}</span> By <a href="/how-we-write/">the PuppyGuido editorial team</a> &middot; <time datetime="${p.date}">${fmtDate(p.date)}</time>${p.updated ? ` &middot; Updated <time datetime="${p.updated}">${fmtDate(p.updated)}</time>` : ''} &middot; ${p.readMinutes} min read</p>
</div></div>
<div class="wrap narrow">
<figure class="post-img"><img src="${p.image}" alt="${esc(p.imageAlt)}" width="900" height="560" loading="eager"></figure>
${adSlot('articleTop')}
${quickBox(p)}${(() => { const g = withInlineGear(p.html, p); p._inline = g.count; p._html = g.html; return ''; })()}${p._inline ? '<p class="aff-note"><b>Heads up.</b> Some links in this article are affiliate links. If you buy through them we may earn a commission at no extra cost to you. As an Amazon Associate we earn from qualifying purchases.</p>' : ''}<div class="prose">${withMidAd(withMidImage(p._html, p))}${faqHtml(p)}</div>
${adSlot('articleEnd')}
${gearBox(p)}
${printableBox(p) || ctaBox}
${sourcesBox(p)}
${authorBox(p)}
${disclaimer}
</div>
${related.length ? `<section class="sec tint"><div class="wrap"><h2 class="rel-h">Keep reading</h2><div class="cards3">${related.map(card).join('')}</div></div></section>` : ''}
</article>`;
  return layout({ title: `${p.seoTitle || p.title} | PuppyGuido`, description: p.description, urlPath: url, body, ogImage: p.image, ogImageAlt: p.imageAlt, ogType: 'article',
    extraHead: `<script type="application/ld+json">${JSON.stringify(ld)}</script>` });
}

function card(p) {
  return `<a class="post-card" href="/blog/${p.slug}/"><div class="pc-img"><img src="${p.image}" alt="${esc(p.imageAlt)}" width="600" height="380" loading="lazy"></div><div class="pc-body"><span class="tag">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.excerpt || p.description)}</p><span class="more">Read article <svg class="ico"><use href="#i-arrow"/></svg></span></div></a>`;
}

function renderBlogIndex(all) {
  const body = `${pageHero('PuppyGuido blog', 'Puppy tips, <span class="hl white">made simple.</span>', 'Practical, positive answers to the questions new puppy parents ask most.')}
<section class="sec"><div class="wrap"><h2 class="rel-h">Latest articles</h2><div class="cards3">${all.map(card).join('')}</div>${adSlot('blogIndex')}${ctaBox}</div></section>`;
  return layout({ title: 'Puppy Blog: Training, Potty & Sleep Tips | PuppyGuido', description: 'Practical new puppy tips: potty training, crate and sleep, biting, checklists and routines. Positive, beginner-friendly advice from PuppyGuido.', urlPath: '/blog/', body });
}

const GUMROAD_JS = '<script src="https://gumroad.com/js/gumroad.js" async></script>';
const isAffiliate = p => !!p.url && !p.gumroadUrl;
const arrow = '<svg class="ico"><use href="#i-arrow"/></svg>';
const buyBtn = (p, label) => {
  if (isAffiliate(p)) {
    const l = p.merchant === 'Amazon' ? 'See on Amazon' : p.merchant === 'Temu' ? 'View on Temu' : (p.cta || label || 'View product');
    return `<a class="btn btn-gold" href="${p.merchant === 'Amazon' ? esc(p.url) : '/go/' + p.slug + '/'}" target="_blank" rel="sponsored nofollow noopener" aria-label="${esc(l)}: ${esc(p.title)} (affiliate link, opens in a new tab)">${esc(l)} ${arrow}</a>`;
  }
  const l = label || 'Buy now';
  return `<a class="btn btn-gold" href="${esc(p.gumroadUrl || '#')}" data-gumroad-overlay-checkout="true" target="_blank" rel="noopener" aria-label="${esc(l)}: ${esc(p.title)} (opens secure checkout)">${esc(l)} ${arrow}</a>`;
};
const productImg = p => p.image ? `<img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}" width="600" height="600" loading="lazy">` : '<div class="ph">Photo coming soon</div>';

function productCard(p) {
  return `<article class="prod-card"><a class="prod-img" href="/shop/${p.slug}/">${productImg(p)}${p.badge ? `<span class="badge-tag">${esc(p.badge)}</span>` : ''}</a><div class="prod-body"><span class="tag">${esc(p.category || 'Puppy essentials')}</span><h3><a href="/shop/${p.slug}/">${esc(p.title)}</a></h3><p>${esc(p.short || '')}</p>${p.bestFor ? `<p class="best"><b>Best for:</b> ${esc(p.bestFor)}</p>` : ''}<div class="prod-foot">${p.price ? `<strong class="price">${esc(p.price)}</strong>` : '<span></span>'}${buyBtn(p, p.price ? 'Get the plan, ' + p.price : 'Get it now')}</div></div></article>`;
}

const SHOP_NOTE = '<b>Heads up.</b> As an Amazon Associate we earn from qualifying purchases. Some links on this page are affiliate links: if you buy through them we may earn a commission at no extra cost to you. Items from partner stores are sold and shipped by the seller, and prices and availability can change. Always check that a product suits your puppy\'s size and age, and supervise play. PuppyGuido provides general educational information and does not replace advice from a qualified veterinarian or professional trainer.';

function renderShop() {
  const cats = [...new Set(products.map(p => p.category || 'Puppy essentials'))];
  const list = products.length
    ? cats.map(c => `<h2 class="pick-cat">${esc(c)}</h2><div class="cards3">${products.filter(p => (p.category || 'Puppy essentials') === c).map(productCard).join('')}</div>`).join('')
    : `<div class="contact-card"><span class="ic"><svg class="ico fill"><use href="#i-paw"/></svg></span><h2>Our shop is opening soon</h2><p class="muted">We are choosing practical puppy essentials, printables and guides. Get the free guide now and we will let you know when the first products are ready.</p><p style="margin-top:22px"><a class="btn btn-gold" href="/#signup">Get the free guide ${arrow}</a></p></div>`;
  const ld = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + '/shop/' + p.slug + '/', name: p.title })) };
  return layout({
    title: 'Puppy Shop: Essentials, Printables & Guides | PuppyGuido',
    description: 'Shop practical puppy essentials, printable trackers and calm, step-by-step guides chosen to help new puppy parents through the first weeks.',
    urlPath: '/shop/',
    extraHead: products.length ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` + (products.some(p => !isAffiliate(p)) ? GUMROAD_JS : '') : '',
    body: pageHero('Shop', 'Puppy <span class="hl white">essentials.</span>', 'Practical things for the first weeks, chosen for new puppy parents.') + `<section class="sec"><div class="wrap">${list}<p class="disc" style="margin-top:44px">${SHOP_NOTE}</p></div></section>`
  });
}

function renderProduct(p) {
  // Affiliate picks are third-party items: no Product markup (no brand/offer we can truthfully claim). Own products keep Product + Offer.
  const crumbs = { '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: SITE + '/shop/' },
    { '@type': 'ListItem', position: 3, name: p.title, item: SITE + '/shop/' + p.slug + '/' } ] };
  const graph = [crumbs];
  if (!isAffiliate(p)) graph.push({ '@type': 'Product', name: p.title, description: p.short || p.title, image: p.image ? SITE + p.image : undefined, brand: { '@type': 'Brand', name: 'PuppyGuido' },
    offers: p.priceValue ? { '@type': 'Offer', price: String(p.priceValue), priceCurrency: p.currency || 'USD', availability: 'https://schema.org/InStock', url: SITE + '/shop/' + p.slug + '/' } : undefined });
  const ld = { '@context': 'https://schema.org', '@graph': graph };
  const others = products.filter(x => x.slug !== p.slug && (x.category === p.category)).concat(products.filter(x => x.slug !== p.slug && x.category !== p.category)).slice(0, 3);
  const note = isAffiliate(p) ? "You'll complete your purchase on the seller's website." : 'Secure checkout by Gumroad.';
  const body = `<section class="post-head"><div class="paws" aria-hidden="true"></div><div class="wrap narrow"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/shop/">Shop</a> / <span>${esc(p.category || 'Puppy essentials')}</span></nav><h1>${esc(p.title)}</h1></div></section>
<section class="sec"><div class="wrap prod-page"><div class="prod-media">${productImg(p)}</div><div class="prod-info"><span class="tag">${esc(p.category || 'Puppy essentials')}</span>${p.price ? `<p class="price big">${esc(p.price)}</p>` : ''}<p class="lead-s">${esc(p.short || '')}</p>${buyBtn(p, 'Buy here')}${p.why ? `<div class="why-box"><strong>Why we like it</strong><p>${esc(p.why)}</p></div>` : ''}<ul class="ticks" style="margin-top:26px">${(p.bullets || []).map(x => `<li><svg class="ico"><use href="#i-check"/></svg> ${esc(x)}</li>`).join('')}</ul><p class="muted">${note}${p.shipping ? ' ' + esc(p.shipping) : ''}</p></div></div>
${p.description ? `<div class="wrap narrow"><div class="prose" style="margin-top:44px">${p.description}</div></div>` : ''}
<div class="wrap narrow"><p class="disc" style="margin-top:36px">${SHOP_NOTE}</p></div></section>
${others.length ? `<section class="sec tint"><div class="wrap"><h2 class="rel-h">More from the shop</h2><div class="cards3">${others.map(productCard).join('')}</div></div></section>` : ''}`;
  return layout({ title: `${p.seoTitle || p.title} | PuppyGuido Shop`, description: p.short || p.title, urlPath: '/shop/' + p.slug + '/', body, ogImage: p.image || '/assets/og-default.jpg', ogImageAlt: p.imageAlt || p.title, noindex: isAffiliate(p),
    extraHead: `<script type="application/ld+json">${JSON.stringify(ld)}</script>` + (isAffiliate(p) ? '' : GUMROAD_JS) });
}

const pages = {
  about: () => layout({
    title: 'About PuppyGuido | A Practical System for New Puppy Parents',
    description: 'PuppyGuido helps first-time puppy parents know what to do, what to prepare and what to focus on next, with friendly, positive, step-by-step guidance.',
    urlPath: '/about/',
    body: `${pageHero('About us', 'Happy puppy. <span class="hl white">Happy life.</span>', 'A friendly, practical system for the first days, weeks and months with a new puppy.')}
<section class="sec"><div class="wrap narrow"><div class="prose">
<h2>Why PuppyGuido exists</h2>
<p>Bringing home a puppy is exciting, and overwhelming. Advice is scattered across videos and forums, and it often contradicts itself. New puppy parents keep asking the same questions: <em>What do I need? What should I do today? Is this normal?</em></p>
<p>PuppyGuido turns those first weeks into clear steps: visual checklists, simple daily routines and a 14-day plan you can actually follow.</p>
<h2>What we believe</h2>
<ul>
<li><strong>Positive first.</strong> We teach with patience, consistency and rewards. No punishment-based advice.</li>
<li><strong>Practical beats perfect.</strong> Small daily steps build calm, confident puppies and owners.</li>
<li><strong>Beginner-friendly.</strong> No jargon, no judgment.</li>
<li><strong>Honest about limits.</strong> We share general educational information. We do not replace your veterinarian or a professional trainer. Read <a href="/how-we-write/">how we write and update our guides</a>.</li>
</ul>
<h2>What we offer</h2>
<p>Right now that is the free <strong>New Puppy Survival Guide</strong>, plus the articles on this blog and a short list of puppy essentials in the shop.</p>
<p><a class="btn btn-gold" href="/#signup">Get the free guide <svg class="ico"><use href="#i-arrow"/></svg></a></p>
</div></div></section>` }),

  'how-we-write': () => layout({
    title: 'How We Write and Update Our Puppy Guides | PuppyGuido',
    description: 'How PuppyGuido researches, writes, checks and updates its puppy guides: positive methods, honest limits, clear sources and regular updates.',
    urlPath: '/how-we-write/',
    body: `${pageHero('Editorial standards', 'How we <span class="hl white">write</span> our guides', 'What you can expect from every PuppyGuido article.')}
<section class="sec"><div class="wrap narrow"><div class="prose">
<h2>Our promise</h2>
<p>PuppyGuido is written for first-time puppy parents in the US, UK, Australia and New Zealand. Every guide aims to be practical, kind to puppies and honest about what is normal and what needs a professional.</p>
<h2>How an article is made</h2>
<ol>
<li><strong>We start with real questions.</strong> We look at what new puppy owners actually ask: potty training, crying at night, biting, crates, routines.</li>
<li><strong>We draft with clear structure.</strong> A quick answer first, then step-by-step help, tables by age or time, and common mistakes. Some drafting is supported by software tools.</li>
<li><strong>We run an editorial checklist.</strong> Every guide is checked for positive, reward-based methods only, no punishment advice, no invented statistics or medical claims, and clear limits.</li>
<li><strong>We update.</strong> When we improve a guide, we show the update date at the top of the page.</li>
</ol>
<h2>What we do not do</h2>
<ul>
<li>We do not give veterinary diagnoses or medication advice. For health concerns, please contact your veterinarian.</li>
<li>We do not recommend punishment, scolding or aversive tools.</li>
<li>We do not accept payment to say a product is good.</li>
</ul>
<h2>Affiliate links</h2>
<p>Some pages include links to products on other stores, such as Amazon. If you buy through them we may earn a small commission at no extra cost to you. Products are chosen because they fit a real need in the guide. Always check that a product suits your puppy's size and age.</p>
<h2>Corrections and feedback</h2>
<p>If you spot a mistake or have a suggestion, write to <a href="mailto:${EMAIL}">${EMAIL}</a>. We read every message.</p>
<p>General information only: our guides do not replace advice from a qualified veterinarian or professional trainer.</p>
<p><a class="btn btn-gold" href="/#signup">Get the free guide <svg class="ico"><use href="#i-arrow"/></svg></a></p>
</div></div></section>` }),

  'starter-kit': () => { const ALL = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'offers.json'), 'utf8')); const OFF = ALL.starterKit; const BUN = ALL.bundle; const btn = (o, label) => o.checkoutUrl ? `<a class="btn btn-gold" href="${o.checkoutUrl}">${label} ${arrow}</a>` : `<a class="btn btn-gold" href="/#signup">Notify me when it opens ${arrow}</a>`; const cards = `<div class="lp-offers"><div class="lp-offer"><div class="lp-offer-t">Starter Kit</div><div class="lp-offer-p">$${OFF.price}</div><p>30-day plan, potty schedule, crate checklist, first week checklist, shopping list, vet checklist.</p>${btn(OFF, 'Get the Kit')}</div><div class="lp-offer best"><div class="lp-badge">Most popular</div><div class="lp-offer-t">Kit + Health Tracker</div><div class="lp-offer-p">$${BUN.price}</div><p>Everything in the Kit plus the Puppy Health Tracker: vaccine log, weight log, vet visit notes.</p>${btn(BUN, 'Get the bundle')}</div></div>`; const buy = OFF.checkoutUrl ? `<a class="btn btn-gold" href="${OFF.checkoutUrl}">Get the Starter Kit - $${OFF.price} ${arrow}</a>` : `<a class="btn btn-gold" href="/#signup">Notify me when it opens ${arrow}</a>`; return layout({
    title: 'New Puppy Starter Kit: Your Puppy\'s First 30 Days | PuppyGuido',
    description: 'A printable 30-day plan, potty schedule, crate checklist, first-week checklist and shopping list for first-time puppy parents. Instant download.',
    urlPath: '/starter-kit/', noindex: true,
    body: `<section class="lp-hero"><div class="wrap lp-grid"><div>
<span class="eyebrow"><svg class="ico fill"><use href="#i-paw"/></svg> For first-time puppy parents</span>
<h1>Your puppy's first 30 days, <span class="hl">planned day by day</span></h1>
<p class="lead">A printable plan with potty schedule, crate checklist, first-week checklist and shopping list. Stop guessing. Know what to do today, tomorrow and next week.</p>
${cards}
<p class="lp-fine">Instant PDF download &middot; US Letter and A4 friendly &middot; 30-day money-back guarantee</p></div>
<div class="lp-card" aria-hidden="true"><img src="/assets/mascot.png" alt="" width="120" height="120"><div class="lp-card-k">New Puppy Starter Kit</div><div class="lp-card-t">Your puppy's first 30 days</div><div class="lp-card-p">30-day plan</div></div></div></section>
<section class="sec"><div class="wrap narrow"><div class="prose">
<h2>Sound familiar?</h2><ul><li>Your puppy cries at night and you do not know what to do.</li><li>Accidents in the house, again.</li><li>The first week is a blur and you are not sure you are doing it right.</li><li>You read 20 articles and now you are more confused.</li><li>You want a clear plan you can stick on the fridge.</li></ul>
<h2>What you get</h2><ul>
<li><strong>30-day plan.</strong> One simple focus for every day, in four weekly pages with check boxes.</li>
<li><strong>Potty schedule by age</strong> with a sample day and a weekly log.</li>
<li><strong>Crate training checklist</strong> with 7 calm steps and crate time by age.</li>
<li><strong>First week day-by-day checklist</strong> plus a night routine.</li>
<li><strong>Shopping list and puppy-proofing walk-through.</strong> Must-have and nice-to-have.</li>
<li><strong>First vet visit checklist</strong> with space for your questions.</li></ul>
<p class="lp-cta">${buy}</p>
<h2>How it works</h2><ol><li>Download the PDF right after checkout.</li><li>Print the pages you need, or use it on a tablet.</li><li>Follow one small step a day. Tick it off.</li></ol>
<h2>Who it is for</h2><p>First-time puppy parents with a puppy of about 8 weeks to 6 months, in the US, UK, Australia and New Zealand. All methods are positive and reward-based.</p>
<h2>30-day money-back guarantee</h2><p>If the kit is not useful to you, email <a href="mailto:${EMAIL}">${EMAIL}</a> within 30 days and we will refund you.</p>
<h2>Questions</h2>
<h3>Is this a physical product?</h3><p>No. It is a digital PDF you download and print yourself.</p>
<h3>Does it work for any breed?</h3><p>Yes. The plan is general. Every puppy learns at their own speed, so adjust the days to your puppy.</p>
<h3>Does it cover biting and the puppy blues?</h3><p>The kit focuses on the daily plan, potty, crate and the first week. For biting and for the feelings of overwhelm, read our free guides: <a href="/blog/how-to-stop-puppy-biting/">how to stop puppy biting</a> and <a href="/blog/puppy-blues-regret-getting-a-puppy/">puppy blues</a>.</p>
<h3>Is this veterinary advice?</h3><p>No. It is general educational information. Please ask your vet about health, vaccines and food.</p>
<h3>How do I get it?</h3><p>You get a download link on the thank-you page and by email right after payment.</p>
<p class="lp-cta">${buy}</p>
<p class="lp-fine">Prefer to try first? <a href="/#signup">Get the free New Puppy Survival Guide</a>.</p>
</div></div></section>` }); },

  'thank-you-kit': () => { const PB = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'offers.json'), 'utf8')).playbook; const pbBtn = PB.saleCheckoutUrl ? `<a class="btn btn-gold" href="${PB.saleCheckoutUrl}">Yes, add the Playbook for $${PB.salePrice} ${arrow}</a>` : `<a class="btn btn-gold" href="/blog/">Read our free guides ${arrow}</a>`; return layout({
    title: 'Thank you | PuppyGuido', description: 'Thank you for your order.', urlPath: '/thank-you-kit/', noindex: true,
    body: `${pageHero('Thank you', 'Your kit is <span class="hl white">on its way</span>', 'Check your email for the download link. It can take a minute.')}
<section class="sec"><div class="wrap narrow"><div class="prose">
<h2>Before you go: one special offer</h2>
<p>New customers can add <strong>The Puppy Training Playbook</strong> for <strong>$${PB.salePrice}</strong> instead of $${PB.price}. This price is only for people who just ordered the kit.</p>
<ul><li>How puppies learn, and a daily routine that works</li><li>Potty training, crate and alone time, biting, sleep</li><li>Socialization and 8 first cues, step by step</li><li>A 12-week roadmap, 20 brain games, cue cards and trackers</li><li>A gear guide: budget, best value and premium picks</li></ul>
<p class="lp-cta">${pbBtn}</p>
<p class="lp-fine">34-page PDF &middot; instant download &middot; 30-day money-back guarantee. Not now? No problem, your kit is already yours.</p>
<h2>Helpful gear for week one</h2>
<ul><li><a href="/shop/">See our recommended puppy gear</a></li><li><a href="/blog/puppy-first-night-home/">Read: your puppy's first night home</a></li><li><a href="/blog/puppy-potty-training-schedule/">Read: potty training schedule by age</a></li></ul>
</div></div></section>` }); },

  contact: () => layout({
    title: 'Contact PuppyGuido | Questions, Feedback, Partnerships',
    description: 'Questions, feedback or partnership ideas? Contact the PuppyGuido team by email and we will get back to you as soon as we can.',
    urlPath: '/contact/',
    body: `${pageHero('Contact', 'Say <span class="hl white">hello.</span>', 'Questions about the free guide, feedback, or a partnership idea? We would love to hear from you.')}
<section class="sec"><div class="wrap narrow"><div class="contact-card">
<span class="ic"><svg class="ico"><use href="#i-mail"/></svg></span>
<h2>Email us</h2>
<p><a class="mail" href="mailto:${EMAIL}">${EMAIL}</a></p>
<p class="muted">We aim to reply within 2 to 3 business days. For health emergencies, please contact your veterinarian right away. We cannot give medical advice.</p>
</div>
<div class="prose" style="margin-top:36px">
<h2>Common questions</h2>
<ul>
<li><strong>I did not receive my free guide.</strong> Check your Spam or Promotions folder, then email us the address you used.</li>
<li><strong>Remove my email.</strong> Email us and we will delete it. You can also unsubscribe from any message.</li>
</ul></div></div></section>` }),

  privacy: () => layout({
    title: 'Privacy Policy | PuppyGuido',
    description: 'How PuppyGuido collects, uses and protects your personal information, including the free guide sign-up, cookies and your rights.',
    urlPath: '/privacy/',
    body: `${pageHero('Legal', 'Privacy <span class="hl white">policy</span>', 'Last updated: October 26, 2026')}
<section class="sec"><div class="wrap narrow"><div class="prose">
<p>PuppyGuido ("we", "us") respects your privacy. This policy explains what we collect when you visit ${SITE.replace('https://', '')} and how we use it.</p>
<h2>Information we collect</h2>
<ul>
<li><strong>Sign-up details.</strong> When you request the free guide we collect your email address (and a name, if a form asks for one). We also record which page of the site you signed up from.</li>
<li><strong>Messages.</strong> If you email us, we keep your message and address so we can reply. If you use the chat assistant, your messages are processed to produce a reply (see below). Please do not type sensitive personal information into the chat.</li>
<li><strong>Technical data.</strong> Our hosting provider may log basic technical data such as IP address, browser type and pages requested, for security and reliability.</li>
<li><strong>Analytics.</strong> We use Vercel Web Analytics to count page views. According to Vercel it does not use cookies and does not track you across websites.</li>
<li><strong>Your cookie choice.</strong> The cookie banner saves your choice (accept or decline) in your browser's local storage on your device, so we do not ask you again on every page.</li>
</ul>
<h2>How we use it</h2>
<ul>
<li>To deliver the free guide you requested.</li>
<li>To send you our welcome emails and a weekly newsletter with puppy tips, new articles and, from time to time, our own products. Every email has an unsubscribe link.</li>
<li>To answer your questions and improve the site.</li>
<li>If you accept cookies: to measure how our ads perform and to show our ads to people who may be interested.</li>
</ul>
<p>We do not sell your personal information.</p>
<h2>Where your sign-up data goes</h2>
<p>When you submit the sign-up form, your browser sends the details directly to our own automation server at <strong>n8n.satinher.com</strong> (a self-hosted n8n instance that we run). From there the details are:</p>
<ul>
<li>saved in our own database (a self-hosted Supabase database) as your entry on our email list;</li>
<li>used to send you the guide and later emails from hello@puppyguido.com, through the email service Brevo;</li>
<li>shared in a private notification to the site owner (your email address and the page you signed up from).</li>
</ul>
<p>The unsubscribe link in our emails also goes to the same server and marks your address so that you receive no more emails.</p>
<h2>Who else processes data</h2>
<ul>
<li><strong>Vercel</strong> hosts the site and provides the anonymous analytics.</li>
<li><strong>Brevo</strong> sends our emails. It receives your email address, your first name and the message content, and it may record whether an email was delivered, opened or clicked.</li>
<li><strong>Chat assistant.</strong> Messages you type are sent to our server and then to an AI language-model provider (OpenRouter and the model companies behind it) to generate a reply.</li>
<li><strong>Google Fonts.</strong> Your browser loads fonts from Google, which means Google receives your IP address when a page loads.</li>
<li><strong>Meta (Facebook).</strong> Only if you accept cookies: the Meta Pixel, described below.</li>
<li><strong>Lemon Squeezy</strong> is the seller of record and handles checkout, payment and sales tax when you buy the Starter Kit, the bundle or the Playbook. It receives your name, email address, billing country and payment details. We do not see your card details.</li>
<li><strong>Gumroad</strong> handles checkout and payment if you buy our paid guide. We do not see your card details.</li>
</ul>
<p>These providers may process data in countries outside your own, including the United States. They act on our behalf or under their own privacy policies.</p>
<h2>Cookies and tracking</h2>
<p>When you first visit, a banner asks whether you accept optional cookies. If you press <strong>Accept</strong>, we load the Meta (Facebook) Pixel. It sets cookies and sends information about your visit (for example the pages you view and button clicks) to Meta, to measure and improve our ads. If you press <strong>Decline</strong> or ignore the banner, the Pixel is not loaded. You can change your mind at any time by clearing this site's data in your browser; the banner will then appear again. We do not use other advertising cookies.</p>
<h2>Affiliate links</h2>
<p>Some pages contain affiliate links (for example to Amazon and Temu). If you buy through them we may earn a commission at no extra cost to you. When you click one you leave our site, and the store has its own privacy policy and cookies.</p>
<h2>Your rights</h2>
<p>Depending on where you live, you may have the right to access, correct, delete or export your personal data, and to object to or restrict certain processing, and to withdraw your consent (for example to cookies or emails). Email <a href="mailto:${EMAIL}">${EMAIL}</a> to make a request.</p>
<h2>Data retention and security</h2>
<p>We keep your email address (and name, if given) until you unsubscribe or ask us to delete them, and we then stop emailing you. We keep other information only as long as needed for the purposes above. We take reasonable steps to protect it, but no online service is completely secure.</p>
<h2>Children</h2>
<p>PuppyGuido is intended for adults. We do not knowingly collect information from children under 13.</p>
<h2>Changes</h2>
<p>We may update this policy and will change the date above when we do.</p>
<h2>Contact</h2>
<p>Questions? <a href="mailto:${EMAIL}">${EMAIL}</a></p>
</div></div></section>` }),

  terms: () => layout({
    title: 'Terms of Use | PuppyGuido',
    description: 'The terms that apply when you use the PuppyGuido website, free guide and printable resources, including disclaimers and affiliate links.',
    urlPath: '/terms/',
    body: `${pageHero('Legal', 'Terms of <span class="hl white">use</span>', 'Last updated: October 2, 2026')}
<section class="sec"><div class="wrap narrow"><div class="prose">
<p>By using this website and our free guide you agree to these terms. If you do not agree, please do not use the site.</p>
<h2>Educational purpose only</h2>
<p>PuppyGuido provides general educational information about puppy care and training. It is <strong>not</strong> veterinary, medical or professional training advice and does not replace a qualified veterinarian or professional trainer. Always consult a professional about your puppy's health or behavior, especially in an emergency.</p>
<h2>Use of the site and guide</h2>
<p>The free guide is for your personal, non-commercial use. You may not resell, redistribute, or republish our guides, checklists or other content without written permission.</p>
<h2>Intellectual property</h2>
<p>The PuppyGuido name, logo, text, graphics and other content are owned by PuppyGuido or its licensors and are protected by applicable law.</p>
<h2>Affiliate disclosure</h2>
<p>Some links on this site or in our content may be affiliate links. If you purchase through them we may earn a commission at no additional cost to you. We aim to recommend products that are genuinely useful for puppy parents.</p>
<h2>Third-party sites</h2>
<p>We are not responsible for the content, prices or practices of third-party websites we link to.</p>
<h2>No warranties; limitation of liability</h2>
<p>The site and guide are provided "as is" without warranties of any kind. To the fullest extent permitted by law, PuppyGuido is not liable for any loss or damage arising from your use of the site or reliance on its content.</p>
<h2>Changes</h2>
<p>We may update these terms and will change the date above when we do. Continued use means you accept the updated terms.</p>
<h2>Contact</h2>
<p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
</div></div></section>` })
};

// RSS feed of published posts, for automation tools (e.g. Make) that turn new articles into pins or social posts.
function rssFeed(all) {
  const x = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const items = all.slice(0, 30).map(p => {
    const url = SITE + '/blog/' + p.slug + '/';
    const type = /\.png$/i.test(p.image) ? 'image/png' : /\.webp$/i.test(p.image) ? 'image/webp' : 'image/jpeg';
    return [
      '  <item>',
      '    <title>' + x(p.title) + '</title>',
      '    <link>' + url + '</link>',
      '    <guid isPermaLink="true">' + url + '</guid>',
      '    <pubDate>' + new Date(p.date + 'T12:00:00Z').toUTCString() + '</pubDate>',
      '    <description>' + x(p.excerpt || p.description) + '</description>',
      '    <category>' + x(p.category) + '</category>',
      '    <enclosure url="' + SITE + p.image + '" type="' + type + '" length="0"/>',
      '  </item>'
    ].join('\n');
  }).join('\n');
  return '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>PuppyGuido blog</title>\n  <link>' + SITE + '/blog/</link>\n  <description>Practical puppy tips, routines and checklists for new puppy parents.</description>\n  <language>en-us</language>\n' + items + '\n</channel>\n</rss>\n';
}

function write(rel, content) {
  const f = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
}

function sitemap(all) {
  const urls = [['/'], ['/blog/'], ['/shop/'], ['/about/'], ['/how-we-write/'], ['/contact/'], ['/privacy/', '2026-10-17'], ['/terms/'],
    ...all.map(p => [`/blog/${p.slug}/`, p.updated || p.date]), ...products.filter(p => !isAffiliate(p)).map(p => [`/shop/${p.slug}/`])];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `  <url><loc>${SITE}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
}

module.exports = { layout, renderPost, renderBlogIndex, sitemap, esc };

function copyDir(from, to, skip = () => false) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    if (e.name.startsWith('.') || skip(path.join(from, e.name))) continue;
    const a = path.join(from, e.name), b = path.join(to, e.name);
    e.isDirectory() ? copyDir(a, b, skip) : fs.copyFileSync(a, b);
  }
}

// Fails the build if anything that must stay private ends up in dist/.
function verifyDist() {
  const forbidden = ['docs', 'build', 'content', 'node_modules', 'site', '.git', '.env', 'package.json', 'vercel.json'];
  const problems = forbidden.filter(n => fs.existsSync(path.join(DIST, n)));
  const files = [];
  (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : files.push(p); } })(DIST);
  for (const f of files) {
    if (/\.(md|map|env)$/.test(f) || /posts\.json$/.test(f)) problems.push('unexpected file: ' + path.relative(DIST, f));
    if (/\.(html|xml|txt)$/.test(f)) {
      const t = fs.readFileSync(f, 'utf8');
      if (t.includes('{{SITE}}')) problems.push('unreplaced {{SITE}} in ' + path.relative(DIST, f));
      if (!SITE.includes('pupyguido.com') && /https:\/\/pupyguido\.com/.test(t)) problems.push('hardcoded pupyguido.com in ' + path.relative(DIST, f));
    }
  }
  if (problems.length) { console.error('dist verification FAILED:\n - ' + problems.join('\n - ')); process.exit(1); }
  console.log('dist verified:', files.length, 'files, no private folders, no hardcoded domain');
}

if (require.main === module) {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  copyDir(SRC, DIST, p => p.replace(/\\/g, '/').endsWith('/assets/photos'));
  for (const f of ['index.html', 'thank-you.html']) {
    const p = path.join(DIST, f);
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').split('{{SITE}}').join(SITE));
  }
  for (const [name, fn] of Object.entries(pages)) write(`${name}/index.html`, fn());
  for (const br of BREEDS) write(`${br.slug}/index.html`, breedPage(br));
  write('blog/index.html', renderBlogIndex(posts));
  write('blog/rss.xml', rssFeed(posts));
  for (const p of posts) write(`blog/${p.slug}/index.html`, renderPost(p, posts));
  write('shop/index.html', renderShop());
  for (const p of products) write(`shop/${p.slug}/index.html`, renderProduct(p));
  write('404.html', layout({ title: 'Page not found | PuppyGuido', description: 'This page could not be found.', urlPath: '/404.html', noindex: true,
    body: pageHero('404', 'Page not <span class="hl white">found.</span>', 'The page you are looking for has moved or does not exist.') + `<section class="sec"><div class="wrap narrow"><div class="contact-card"><h2>Try one of these</h2><p style="margin-top:18px"><a class="btn btn-gold" href="/#signup">Get the free guide ${arrow}</a></p><p style="margin-top:14px"><a href="/blog/">Read the blog</a> &middot; <a href="/shop/">Browse the shop</a> &middot; <a href="/">Home</a></p></div></div></section>` }));
  const vercel = {
    buildCommand: 'node build/build.js',
    outputDirectory: 'dist',
    cleanUrls: false,
    trailingSlash: true,
    redirects: [
      // Enable only once SITE_URL's domain is attached to this Vercel project: set PRIMARY_REDIRECT_FROM=pupyguido.store
      ...(process.env.PRIMARY_REDIRECT_FROM ? [{ source: '/:path*', has: [{ type: 'host', value: process.env.PRIMARY_REDIRECT_FROM }], destination: SITE + '/:path*', permanent: true }] : []),
      { source: '/picks', destination: '/shop/', permanent: true },
      { source: '/picks/', destination: '/shop/', permanent: true },
      ...products.filter(isAffiliate).flatMap(p => [
        { source: '/go/' + p.slug, destination: p.url, permanent: false },
        { source: '/go/' + p.slug + '/', destination: p.url, permanent: false }
      ])
    ],
    headers: [
      { source: '/(.*)', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' } ] },
      { source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/go/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      // Admin dashboard shell: never indexed, never cached, strict CSP (all its JS/CSS are same-origin files).
      { source: '/admin/(.*)', headers: [
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        { key: 'Cache-Control', value: 'no-store' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'" } ] }
    ]
  };
  fs.writeFileSync(path.join(ROOT, 'vercel.json'), JSON.stringify(vercel, null, 2) + '\n');
  write('sitemap.xml', sitemap(posts));
  if (ADS_ON) write('ads.txt', 'google.com, ' + ADS.publisherId.replace('ca-', '') + ', DIRECT, f08c47fec0942fa0\n');
  if (ADS_ON) { const hp = path.join(DIST, 'index.html'); if (fs.existsSync(hp)) fs.writeFileSync(hp, fs.readFileSync(hp, 'utf8').replace('</head>', adsLoader + '\n</head>')); }
  write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  verifyDist();
  if (draftPosts.length) console.log('Drafts NOT published:', draftPosts.map(p => p.slug).join(', '));
  console.log('Built', posts.length, 'posts,', products.length, 'products (', picks.length, 'affiliate) +', Object.keys(pages).length, 'pages for', SITE);
}
