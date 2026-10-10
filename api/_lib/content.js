// Validation + HTML sanitising for dashboard articles. No dependencies.
const CATEGORIES = ['Training', 'Potty Training', 'Sleep & Crate', 'Preparation', 'Health & Care', 'Behavior'];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMG_RE = /^\/assets\/[A-Za-z0-9._\/-]+\.(?:jpg|jpeg|png|webp)$/;

const ALLOWED = new Set(['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'a', 'br', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'figure', 'figcaption', 'hr']);
const VOID = new Set(['br', 'hr', 'img']);

function safeUrl(u, { allowMail = true } = {}) {
  const v = String(u || '').replace(/[\u0000- ]+/g, '');
  if (/^(https?:\/\/|\/|#)/i.test(v) && !/^\/\//.test(v)) return v;
  if (allowMail && /^mailto:/i.test(v)) return v;
  return null;
}
const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function sanitizeHtml(input) {
  let s = String(input || '').replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<(script|style|iframe|object|embed|form|svg|math)[\s\S]*?<\/\1\s*>/gi, '');
  return s.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (m, tag, attrs) => {
    const t = tag.toLowerCase();
    if (!ALLOWED.has(t)) return '';
    if (m.startsWith('</')) return VOID.has(t) ? '' : '</' + t + '>';
    const at = {};
    const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    let x;
    while ((x = re.exec(attrs))) at[x[1].toLowerCase()] = x[2] !== undefined ? x[2] : x[3];
    let out = '<' + t;
    if (t === 'a') {
      const h = safeUrl(at.href);
      if (h) out += ` href="${escAttr(h)}"` + (/^https?:/i.test(h) ? ' rel="noopener"' : '');
    } else if (t === 'img') {
      const src = safeUrl(at.src, { allowMail: false });
      if (!src) return '';
      out += ` src="${escAttr(src)}" alt="${escAttr(at.alt || '')}" loading="lazy"`;
    }
    return out + '>';
  });
}

const textOnly = h => String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const str = (v, max) => String(v === undefined || v === null ? '' : v).trim().slice(0, max);

// Returns { ok, errors, article }. `existing` carries fields that must be preserved (date).
function validateArticle(input, existing) {
  const errors = [];
  const a = {};
  a.slug = str(input.slug, 80).toLowerCase();
  if (!SLUG_RE.test(a.slug) || a.slug.length < 3) errors.push('Slug must be 3-80 chars: lowercase letters, numbers and single hyphens.');
  a.title = str(input.title, 200);
  if (!a.title) errors.push('Title is required.');
  else if (a.title.length > 70) errors.push('Title must be 70 characters or fewer.');
  a.excerpt = str(input.excerpt, 400);
  if (a.excerpt.length > 200) errors.push('Excerpt must be 200 characters or fewer.');
  a.seoTitle = str(input.seoTitle, 200);
  if (a.seoTitle.length > 70) errors.push('SEO title must be 70 characters or fewer.');
  a.description = str(input.metaDescription !== undefined ? input.metaDescription : input.description, 400);
  if (!a.description) errors.push('Meta description is required.');
  else if (a.description.length > 160) errors.push('Meta description must be 160 characters or fewer.');
  a.category = str(input.category, 60);
  if (!CATEGORIES.includes(a.category)) errors.push('Category must be one of: ' + CATEGORIES.join(', ') + '.');
  let tags = Array.isArray(input.tags) ? input.tags : String(input.tags || '').split(',');
  a.tags = [...new Set(tags.map(t => str(t, 30).toLowerCase()).filter(Boolean))].slice(0, 8);
  a.image = str(input.image, 200);
  if (!IMG_RE.test(a.image)) errors.push('Featured image must be an /assets/... path ending in .jpg, .jpeg, .png or .webp.');
  a.imageAlt = str(input.imageAlt, 200);
  if (!a.imageAlt) errors.push('Image alt text is required.');
  else if (a.imageAlt.length > 140) errors.push('Image alt text must be 140 characters or fewer.');
  a.html = sanitizeHtml(input.html);
  const words = textOnly(a.html).split(' ').filter(Boolean).length;
  if (words < 50) errors.push('Article body must contain at least 50 words.');
  a.readMinutes = Math.max(1, Math.round(words / 200));
  a.date = existing && existing.date ? existing.date : new Date().toISOString().slice(0, 10);
  return { ok: errors.length === 0, errors, article: a };
}

// Field order is stable so diffs in GitHub stay readable.
function toFile(a, draft) {
  const o = { draft, slug: a.slug, title: a.title, description: a.description, excerpt: a.excerpt, seoTitle: a.seoTitle, category: a.category, tags: a.tags, date: a.date, readMinutes: a.readMinutes, image: a.image, imageAlt: a.imageAlt, html: a.html };
  return JSON.stringify(o, null, 2) + '\n';
}

module.exports = { CATEGORIES, SLUG_RE, IMG_RE, sanitizeHtml, validateArticle, toFile, textOnly };
