// One-time patch: adds optional Google AdSense slots to build/build.js (off by default).
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const file = path.join(ROOT, 'build', 'build.js');
let s = fs.readFileSync(file, 'utf8');
if (s.includes('ADS_ON')) { console.log('already patched'); process.exit(0); }
const must = (cond, msg) => { if (!cond) throw new Error('patch anchor missing: ' + msg); };

// 1) config + helpers (before PRODUCT_DIR)
const a1 = "const PRODUCT_DIR = path.join(ROOT, 'content', 'products');";
must(s.includes(a1), 'PRODUCT_DIR');
s = s.replace(a1, `// --- Google AdSense (OFF by default). Turn on by editing content/ads.json: enabled=true + publisherId + slot ids.
const ADS_FILE = path.join(ROOT, 'content', 'ads.json');
const ADS = fs.existsSync(ADS_FILE) ? JSON.parse(fs.readFileSync(ADS_FILE, 'utf8')) : { enabled: false, slots: {} };
const ADS_ON = !!(ADS.enabled && /^ca-pub-\\d{10,}$/.test(ADS.publisherId || ''));
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

` + a1);

// 2) loader in <head>
const a2 = '<meta name="theme-color" content="#0B1F44">';
must(s.includes(a2), 'theme-color');
s = s.replace(a2, a2 + '\n${adsLoader}');

// 3) article page slots
const a3 = /<div class="prose">\$\{p\.html\}<\/div>\r?\n\$\{ctaBox\}/;
must(a3.test(s), 'prose');
s = s.replace(a3, () => '${adSlot(\'articleTop\')}\n<div class="prose">${withMidAd(p.html)}</div>\n${adSlot(\'articleEnd\')}\n${ctaBox}');

// 4) blog index slot
const a4 = '<div class="cards3">${all.map(card).join(\'\')}</div>${ctaBox}</div></section>`;';
must(s.includes(a4), 'blog index');
s = s.replace(a4, '<div class="cards3">${all.map(card).join(\'\')}</div>${adSlot(\'blogIndex\')}${ctaBox}</div></section>`;');

// 5) ads.txt
const a5 = "write('robots.txt',";
must(s.includes(a5), 'robots');
s = s.replace(a5, "if (ADS_ON) write('ads.txt', 'google.com, ' + ADS.publisherId.replace('ca-', '') + ', DIRECT, f08c47fec0942fa0\\n');\n  " + a5);

fs.writeFileSync(file, s);

// 6) css
const cssFile = path.join(ROOT, 'site', 'styles.css');
let css = fs.readFileSync(cssFile, 'utf8');
if (!css.includes('.ad-slot')) {
  css += '\n/* Ads (only rendered when AdSense is enabled) */\n.ad-slot{margin:28px 0;text-align:center;min-height:90px}\n.ad-slot .ad-label{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}\n';
  fs.writeFileSync(cssFile, css);
}

// 7) config
const cfg = path.join(ROOT, 'content', 'ads.json');
if (!fs.existsSync(cfg)) fs.writeFileSync(cfg, JSON.stringify({
  _readme: 'Set enabled=true and fill publisherId (ca-pub-XXXXXXXXXXXXXXXX) and the slot ids from AdSense. Leave slots empty to skip a position. Do not enable before AdSense approval and a cookie consent banner for EU/UK visitors.',
  enabled: false,
  publisherId: '',
  slots: { articleTop: '', articleMiddle: '', articleEnd: '', blogIndex: '' }
}, null, 2) + '\n');
console.log('patched');
