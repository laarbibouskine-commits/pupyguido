// node build/build.js  ->  generates /blog/*, /about, /contact, /privacy, /terms, sitemap.xml, robots.txt
// The render functions are reused by the n8n auto-blog workflow (it commits the same files).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = process.env.SITE_URL || 'https://pupyguido.com';
const EMAIL = 'hello@pupyguido.com';
const CONTENT_DIR = path.join(ROOT, 'content', 'posts');
const jsonPosts = fs.existsSync(CONTENT_DIR)
  ? fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8')))
  : [];
const bySlug = new Map();
for (const p of [...require('./posts.js'), ...jsonPosts]) bySlug.set(p.slug, p);
const posts = [...bySlug.values()].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

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

function layout({ title, description, urlPath, body, extraHead = '', ogImage = '/assets/hero.jpg', ogType = 'website', noindex = false }) {
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
<link rel="icon" type="image/png" href="/assets/mascot.png">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="PupyGuido">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
${extraHead}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${SPRITE}
<header class="site-header">
  <div class="wrap nav">
    <a class="brand" href="/" aria-label="PupyGuido home"><img src="/assets/mascot.png" alt="" width="44" height="46"><span>Pupy<b>Guido</b><span class="reg">&reg;</span></span></a>
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
        <div class="brand"><img src="/assets/mascot.png" alt="" width="44" height="46"><span>Pupy<b>Guido</b><span class="reg">&reg;</span></span></div>
        <p>Happy Puppy. Happy Life.<br>A practical system for new puppy parents.</p>
        <p class="tl" style="margin-top:16px">TRAIN &bull; CARE &bull; LOVE</p>
      </div>
      <div><h4>Explore</h4><ul><li><a href="/#inside">What's inside</a></li><li><a href="/#plan">14-day plan</a></li><li><a href="/shop/">Shop</a></li><li><a href="/blog/">Blog</a></li><li><a href="/#faq">FAQ</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="/about/">About us</a></li><li><a href="/contact/">Contact</a></li><li><a href="/privacy/">Privacy policy</a></li><li><a href="/terms/">Terms of use</a></li></ul></div>
    </div>
    <div class="legal"><span>&copy; ${new Date().getFullYear()} PupyGuido. All rights reserved.</span><span>For educational purposes only. Not veterinary advice. Some links may be affiliate links. Photos via Unsplash.</span></div>
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

const ctaBox = `<aside class="cta-box"><div><h3>Get the free New Puppy Survival Guide</h3><p>Checklists, routines and a 14-day plan for your puppy's first days at home.</p></div><a class="btn btn-gold" href="/#signup">Get it free <svg class="ico"><use href="#i-arrow"/></svg></a></aside>`;
const disclaimer = `<p class="disc"><b>Disclaimer.</b> PupyGuido provides general educational information and does not replace advice from a qualified veterinarian or professional trainer.</p>`;

function renderPost(p, all) {
  const url = `/blog/${p.slug}/`;
  const related = all.filter(x => x.slug !== p.slug).slice(0, 3);
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date,
        image: SITE + p.image, mainEntityOfPage: SITE + url,
        author: { '@type': 'Organization', name: 'PupyGuido' },
        publisher: { '@type': 'Organization', name: 'PupyGuido', logo: { '@type': 'ImageObject', url: SITE + '/assets/mascot.png' } } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog/' },
        { '@type': 'ListItem', position: 3, name: p.title, item: SITE + url } ] }
    ]
  };
  const body = `<article class="post">
<div class="post-head"><div class="paws" aria-hidden="true"></div><div class="wrap narrow">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>${esc(p.category)}</span></nav>
<h1>${esc(p.title)}</h1>
<p class="meta"><span class="tag">${esc(p.category)}</span> <time datetime="${p.date}">${fmtDate(p.date)}</time> &middot; ${p.readMinutes} min read</p>
</div></div>
<div class="wrap narrow">
<figure class="post-img"><img src="${p.image}" alt="${esc(p.imageAlt)}" width="900" height="560" loading="eager"></figure>
<div class="prose">${p.html}</div>
${ctaBox}
${disclaimer}
</div>
${related.length ? `<section class="sec tint"><div class="wrap"><h2 class="rel-h">Keep reading</h2><div class="cards3">${related.map(card).join('')}</div></div></section>` : ''}
</article>`;
  return layout({ title: `${p.title} | PupyGuido`, description: p.description, urlPath: url, body, ogImage: p.image, ogType: 'article',
    extraHead: `<script type="application/ld+json">${JSON.stringify(ld)}</script>` });
}

function card(p) {
  return `<a class="post-card" href="/blog/${p.slug}/"><div class="pc-img"><img src="${p.image}" alt="${esc(p.imageAlt)}" width="600" height="380" loading="lazy"></div><div class="pc-body"><span class="tag">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><span class="more">Read article <svg class="ico"><use href="#i-arrow"/></svg></span></div></a>`;
}

function renderBlogIndex(all) {
  const body = `${pageHero('PupyGuido blog', 'Puppy tips, <span class="hl white">made simple.</span>', 'Practical, positive answers to the questions new puppy parents ask most.')}
<section class="sec"><div class="wrap"><div class="cards3">${all.map(card).join('')}</div>${ctaBox}</div></section>`;
  return layout({ title: 'Puppy Blog: Training, Potty, Sleep & New Puppy Tips | PupyGuido', description: 'Practical new puppy tips: potty training, crate and sleep, biting, checklists and routines. Positive, beginner-friendly advice from PupyGuido.', urlPath: '/blog/', body });
}

const GUMROAD_JS = '<script src="https://gumroad.com/js/gumroad.js" async></script>';
const isAffiliate = p => !!p.url && !p.gumroadUrl;
const arrow = '<svg class="ico"><use href="#i-arrow"/></svg>';
const buyBtn = (p, label) => isAffiliate(p)
  ? `<a class="btn btn-gold" href="/go/${p.slug}/" target="_blank" rel="sponsored nofollow noopener">${esc(p.cta || label || 'Buy here')} ${arrow}</a>`
  : `<a class="btn btn-gold" href="${esc(p.gumroadUrl || '#')}" data-gumroad-overlay-checkout="true" target="_blank" rel="noopener">${esc(label || 'Buy now')} ${arrow}</a>`;
const productImg = p => p.image ? `<img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}" width="600" height="600" loading="lazy">` : '<div class="ph">Photo coming soon</div>';

function productCard(p) {
  return `<article class="prod-card"><a class="prod-img" href="/shop/${p.slug}/">${productImg(p)}${p.badge ? `<span class="badge-tag">${esc(p.badge)}</span>` : ''}</a><div class="prod-body"><span class="tag">${esc(p.category || 'Puppy essentials')}</span><h3><a href="/shop/${p.slug}/">${esc(p.title)}</a></h3><p>${esc(p.short || '')}</p><div class="prod-foot">${p.price ? `<strong class="price">${esc(p.price)}</strong>` : '<span></span>'}${buyBtn(p, 'Buy here')}</div></div></article>`;
}

const SHOP_NOTE = '<b>Heads up.</b> Some links on this page are affiliate links: if you buy through them we may earn a commission at no extra cost to you. Items from partner stores are sold and shipped by the seller, and prices and availability can change. Always check that a product suits your puppy\'s size and age, and supervise play. PupyGuido provides general educational information and does not replace advice from a qualified veterinarian or professional trainer.';

function renderShop() {
  const cats = [...new Set(products.map(p => p.category || 'Puppy essentials'))];
  const list = products.length
    ? cats.map(c => `<h2 class="pick-cat">${esc(c)}</h2><div class="cards3">${products.filter(p => (p.category || 'Puppy essentials') === c).map(productCard).join('')}</div>`).join('')
    : `<div class="contact-card"><span class="ic"><svg class="ico fill"><use href="#i-paw"/></svg></span><h2>Our shop is opening soon</h2><p class="muted">We are choosing practical puppy essentials, printables and guides. Get the free guide now and we will let you know when the first products are ready.</p><p style="margin-top:22px"><a class="btn btn-gold" href="/#signup">Get the free guide ${arrow}</a></p></div>`;
  const ld = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + '/shop/' + p.slug + '/', name: p.title })) };
  return layout({
    title: 'Puppy Shop: Essentials, Printables & Guides | PupyGuido',
    description: 'Practical puppy essentials, printable trackers and guides picked for new puppy parents.',
    urlPath: '/shop/',
    extraHead: products.length ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` + GUMROAD_JS : '',
    body: pageHero('Shop', 'Puppy <span class="hl white">essentials.</span>', 'Practical things for the first weeks, chosen for new puppy parents.') + `<section class="sec"><div class="wrap">${list}<p class="disc" style="margin-top:44px">${SHOP_NOTE}</p></div></section>`
  });
}

function renderProduct(p) {
  const ld = { '@context': 'https://schema.org', '@type': 'Product', name: p.title, description: p.short || p.title, image: p.image ? SITE + p.image : undefined, brand: { '@type': 'Brand', name: 'PupyGuido' },
    offers: p.priceValue ? { '@type': 'Offer', price: String(p.priceValue), priceCurrency: p.currency || 'USD', availability: 'https://schema.org/InStock', url: SITE + '/shop/' + p.slug + '/' } : undefined };
  const others = products.filter(x => x.slug !== p.slug && (x.category === p.category)).concat(products.filter(x => x.slug !== p.slug && x.category !== p.category)).slice(0, 3);
  const note = isAffiliate(p) ? "You'll complete your purchase on the seller's website." : 'Secure checkout by Gumroad.';
  const body = `<section class="post-head"><div class="paws" aria-hidden="true"></div><div class="wrap narrow"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/shop/">Shop</a> / <span>${esc(p.category || 'Puppy essentials')}</span></nav><h1>${esc(p.title)}</h1></div></section>
<section class="sec"><div class="wrap prod-page"><div class="prod-media">${productImg(p)}</div><div class="prod-info"><span class="tag">${esc(p.category || 'Puppy essentials')}</span>${p.price ? `<p class="price big">${esc(p.price)}</p>` : ''}<p class="lead-s">${esc(p.short || '')}</p>${buyBtn(p, 'Buy here')}${p.why ? `<div class="why-box"><strong>Why we like it</strong><p>${esc(p.why)}</p></div>` : ''}<ul class="ticks" style="margin-top:26px">${(p.bullets || []).map(x => `<li><svg class="ico"><use href="#i-check"/></svg> ${esc(x)}</li>`).join('')}</ul><p class="muted">${note}${p.shipping ? ' ' + esc(p.shipping) : ''}</p></div></div>
${p.description ? `<div class="wrap narrow"><div class="prose" style="margin-top:44px">${p.description}</div></div>` : ''}
<div class="wrap narrow"><p class="disc" style="margin-top:36px">${SHOP_NOTE}</p></div></section>
${others.length ? `<section class="sec tint"><div class="wrap"><h2 class="rel-h">More from the shop</h2><div class="cards3">${others.map(productCard).join('')}</div></div></section>` : ''}`;
  return layout({ title: `${p.title} | PupyGuido Shop`, description: p.short || p.title, urlPath: '/shop/' + p.slug + '/', body, ogImage: p.image || '/assets/hero.jpg',
    extraHead: `<script type="application/ld+json">${JSON.stringify(ld)}</script>` + GUMROAD_JS });
}

const pages = {
  about: () => layout({
    title: 'About PupyGuido | A Practical System for New Puppy Parents',
    description: 'PupyGuido helps first-time puppy parents know what to do, what to prepare and what to focus on next, with friendly, positive, step-by-step guidance.',
    urlPath: '/about/',
    body: `${pageHero('About us', 'Happy puppy. <span class="hl white">Happy life.</span>', 'A friendly, practical system for the first days, weeks and months with a new puppy.')}
<section class="sec"><div class="wrap narrow"><div class="prose">
<h2>Why PupyGuido exists</h2>
<p>Bringing home a puppy is exciting, and overwhelming. Advice is scattered across videos and forums, and it often contradicts itself. New puppy parents keep asking the same questions: <em>What do I need? What should I do today? Is this normal?</em></p>
<p>PupyGuido turns those first weeks into clear steps: visual checklists, simple daily routines and a 14-day plan you can actually follow.</p>
<h2>What we believe</h2>
<ul>
<li><strong>Positive first.</strong> We teach with patience, consistency and rewards. No punishment-based advice.</li>
<li><strong>Practical beats perfect.</strong> Small daily steps build calm, confident puppies and owners.</li>
<li><strong>Beginner-friendly.</strong> No jargon, no judgment.</li>
<li><strong>Honest about limits.</strong> We share general educational information. We do not replace your veterinarian or a professional trainer.</li>
</ul>
<h2>What we offer</h2>
<p>We start with the free <strong>New Puppy Survival Guide</strong>. Printable workbooks, planners and more guides are on the way, along with Guido AI, a puppy-parent assistant in development.</p>
<p><a class="btn btn-gold" href="/#signup">Get the free guide <svg class="ico"><use href="#i-arrow"/></svg></a></p>
</div></div></section>` }),

  contact: () => layout({
    title: 'Contact PupyGuido',
    description: 'Questions, feedback or partnership ideas? Contact the PupyGuido team by email.',
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
    title: 'Privacy Policy | PupyGuido',
    description: 'How PupyGuido collects, uses and protects your personal information.',
    urlPath: '/privacy/',
    body: `${pageHero('Legal', 'Privacy <span class="hl white">policy</span>', 'Last updated: October 2, 2026')}
<section class="sec"><div class="wrap narrow"><div class="prose">
<p>PupyGuido ("we", "us") respects your privacy. This policy explains what we collect when you visit ${SITE.replace('https://', '')} and how we use it.</p>
<h2>Information we collect</h2>
<ul>
<li><strong>Information you give us.</strong> When you request the free guide we collect your name and email address.</li>
<li><strong>Messages.</strong> If you email us, we keep your message and address so we can reply.</li>
<li><strong>Technical data.</strong> Our hosting provider may log basic technical data such as IP address, browser type and pages requested, for security and reliability.</li>
</ul>
<h2>How we use it</h2>
<ul>
<li>To deliver the free guide you requested.</li>
<li>To send helpful puppy tips and updates about PupyGuido. You can unsubscribe at any time.</li>
<li>To answer your questions and improve the site.</li>
</ul>
<p>We do not sell your personal information.</p>
<h2>Who processes your data</h2>
<p>We use service providers to run the site, process sign-up forms and send email. They process data on our behalf and only for those purposes.</p>
<h2>Cookies and analytics</h2>
<p>At the time of writing the site does not use advertising cookies. If we add analytics or advertising tools, such as a Pinterest tag, we will update this policy and, where required, ask for your consent.</p>
<h2>Affiliate links</h2>
<p>Some pages may contain affiliate links. If you buy through them we may earn a commission at no extra cost to you. Third-party sites have their own privacy policies.</p>
<h2>Your rights</h2>
<p>Depending on where you live, you may have the right to access, correct, delete or export your personal data, and to object to or restrict certain processing. Email <a href="mailto:${EMAIL}">${EMAIL}</a> to make a request.</p>
<h2>Data retention and security</h2>
<p>We keep your information only as long as needed for the purposes above. We take reasonable steps to protect it, but no online service is completely secure.</p>
<h2>Children</h2>
<p>PupyGuido is intended for adults. We do not knowingly collect information from children under 13.</p>
<h2>Changes</h2>
<p>We may update this policy and will change the date above when we do.</p>
<h2>Contact</h2>
<p>Questions? <a href="mailto:${EMAIL}">${EMAIL}</a></p>
</div></div></section>` }),

  terms: () => layout({
    title: 'Terms of Use | PupyGuido',
    description: 'The terms that apply when you use the PupyGuido website and free guide.',
    urlPath: '/terms/',
    body: `${pageHero('Legal', 'Terms of <span class="hl white">use</span>', 'Last updated: October 2, 2026')}
<section class="sec"><div class="wrap narrow"><div class="prose">
<p>By using this website and our free guide you agree to these terms. If you do not agree, please do not use the site.</p>
<h2>Educational purpose only</h2>
<p>PupyGuido provides general educational information about puppy care and training. It is <strong>not</strong> veterinary, medical or professional training advice and does not replace a qualified veterinarian or professional trainer. Always consult a professional about your puppy's health or behavior, especially in an emergency.</p>
<h2>Use of the site and guide</h2>
<p>The free guide is for your personal, non-commercial use. You may not resell, redistribute, or republish our guides, checklists or other content without written permission.</p>
<h2>Intellectual property</h2>
<p>The PupyGuido name, logo, text, graphics and other content are owned by PupyGuido or its licensors and are protected by applicable law.</p>
<h2>Affiliate disclosure</h2>
<p>Some links on this site or in our content may be affiliate links. If you purchase through them we may earn a commission at no additional cost to you. We aim to recommend products that are genuinely useful for puppy parents.</p>
<h2>Third-party sites</h2>
<p>We are not responsible for the content, prices or practices of third-party websites we link to.</p>
<h2>No warranties; limitation of liability</h2>
<p>The site and guide are provided "as is" without warranties of any kind. To the fullest extent permitted by law, PupyGuido is not liable for any loss or damage arising from your use of the site or reliance on its content.</p>
<h2>Changes</h2>
<p>We may update these terms and will change the date above when we do. Continued use means you accept the updated terms.</p>
<h2>Contact</h2>
<p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
</div></div></section>` })
};

function write(rel, content) {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
}

function sitemap(all) {
  const urls = [['/', '1.0'], ['/blog/', '0.8'], ['/shop/', '0.8'], ['/about/', '0.5'], ['/contact/', '0.4'], ['/privacy/', '0.2'], ['/terms/', '0.2'],
    ...all.map(p => [`/blog/${p.slug}/`, '0.7']), ...products.map(p => [`/shop/${p.slug}/`, '0.6'])];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, pr]) => `  <url><loc>${SITE}${u}</loc><priority>${pr}</priority></url>`).join('\n')}\n</urlset>\n`;
}

module.exports = { layout, renderPost, renderBlogIndex, sitemap, esc };

if (require.main === module) {
  for (const [name, fn] of Object.entries(pages)) write(`${name}/index.html`, fn());
  write('blog/index.html', renderBlogIndex(posts));
  for (const p of posts) write(`blog/${p.slug}/index.html`, renderPost(p, posts));
  write('shop/index.html', renderShop());
  for (const p of products) write(`shop/${p.slug}/index.html`, renderProduct(p));
  const vercel = {
    buildCommand: 'node build/build.js',
    outputDirectory: '.',
    cleanUrls: false,
    trailingSlash: true,
    redirects: [
      { source: '/picks', destination: '/shop/', permanent: true },
      { source: '/picks/', destination: '/shop/', permanent: true },
      ...products.filter(isAffiliate).flatMap(p => [
        { source: '/go/' + p.slug, destination: p.url, permanent: false },
        { source: '/go/' + p.slug + '/', destination: p.url, permanent: false }
      ])
    ],
    headers: [{ source: '/go/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
  };
  fs.writeFileSync(path.join(ROOT, 'vercel.json'), JSON.stringify(vercel, null, 2) + '\n');
  write('sitemap.xml', sitemap(posts));
  write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  fs.writeFileSync(path.join(ROOT, 'blog', 'posts.json'), JSON.stringify(posts.map(({ html, ...m }) => m), null, 2));
  console.log('Built', posts.length, 'posts,', products.length, 'products (', picks.length, 'affiliate) +', Object.keys(pages).length, 'pages for', SITE);
}
