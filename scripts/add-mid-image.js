// One-time patch: optional second (middle) image for articles: fields midImage, midImageAlt, midImageCaption.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const bf = path.join(ROOT, 'build', 'build.js');
let s = fs.readFileSync(bf, 'utf8');
if (s.includes('withMidImage')) { console.log('already patched'); process.exit(0); }
const must = (c, m) => { if (!c) throw new Error('anchor missing: ' + m); };

// helper before the AdSense block (which defines withMidAd)
const a1 = '// --- Google AdSense (OFF by default).';
must(s.includes(a1), 'adsense block');
s = s.replace(a1, () => `// Optional second image in the middle of an article (fields: midImage, midImageAlt, midImageCaption).
function withMidImage(html, p) {
  if (!p.midImage) return html;
  const parts = html.split(/(?=<h2[ >])/);
  const fig = '<figure class="post-img mid"><img src="' + esc(p.midImage) + '" alt="' + esc(p.midImageAlt || '') + '" width="1200" height="800" loading="lazy">' + (p.midImageCaption ? '<figcaption>' + esc(p.midImageCaption) + '</figcaption>' : '') + '</figure>';
  if (parts.length < 3) return html + fig;
  const at = Math.min(parts.length - 1, Math.max(2, Math.floor(parts.length / 3)));
  parts.splice(at, 0, fig);
  return parts.join('');
}
` + a1);

// use it in the article body
const a2 = '${withMidAd(p.html)}';
must(s.includes(a2), 'withMidAd call');
s = s.replace(a2, () => '${withMidAd(withMidImage(p.html, p))}');

// structured data: include both images
const a3 = 'image: SITE + p.image, mainEntityOfPage: SITE + url,';
must(s.includes(a3), 'ld image');
s = s.replace(a3, () => 'image: p.midImage ? [SITE + p.image, SITE + p.midImage] : SITE + p.image, mainEntityOfPage: SITE + url,');
fs.writeFileSync(bf, s);

const cf = path.join(ROOT, 'site', 'styles.css');
let css = fs.readFileSync(cf, 'utf8');
if (!css.includes('.post-img.mid')) {
  css += '\n/* Middle article image */\n.post-img.mid{margin:30px 0}\n.post-img.mid img{width:100%;height:auto;border-radius:var(--r-md,18px);display:block}\n.post-img.mid figcaption{font-size:14px;color:var(--muted);margin-top:8px;text-align:center}\n';
  fs.writeFileSync(cf, css);
}
console.log('patched');
