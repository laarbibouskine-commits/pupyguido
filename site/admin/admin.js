(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var state = { articles: [], cur: null, sha: null, art: null, isNew: true, fromLegacy: false, images: [], dirty: false };
  var FIELDS = ['title', 'slug', 'category', 'tags', 'excerpt', 'seoTitle', 'metaDescription', 'image', 'imageAlt', 'html'];

  function api(action, opts) {
    opts = opts || {};
    var init = { method: opts.body ? 'POST' : 'GET', credentials: 'same-origin', headers: {} };
    if (opts.body) { init.headers['Content-Type'] = 'application/json'; init.headers['X-Requested-With'] = 'pg-admin'; init.body = JSON.stringify(opts.body); }
    var qs = '?action=' + encodeURIComponent(action) + (opts.q ? '&' + opts.q : '');
    return fetch('/api/admin/' + qs, init).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.error || (j.errors && j.errors.join(' ')) || 'Request failed'); e.status = r.status; e.data = j; throw e; } return j; });
    });
  }
  function msg(text, kind) {
    var m = $('msg');
    if (!text) { m.hidden = true; return; }
    m.textContent = text; m.className = 'msg ' + (kind || 'ok'); m.hidden = false;
    window.scrollTo(0, 0);
  }
  function err(e) {
    if (e.status === 401 && e.data && e.data.error === 'Not signed in.') { show('login'); msg('Session expired. Please sign in again.', 'err'); return; }
    msg((e.data && e.data.errors) ? e.data.errors.join(' ') : e.message, 'err');
  }
  function show(v) {
    ['login', 'list', 'edit'].forEach(function (n) { $('v-' + n).hidden = n !== v; });
    $('nav').hidden = v === 'login';
  }
  function slugify(s) { return s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  // ---------- list ----------
  function renderRows() {
    var q = $('search').value.trim().toLowerCase();
    var rows = state.articles.filter(function (a) { return !q || (a.title + ' ' + a.slug + ' ' + a.category).toLowerCase().indexOf(q) >= 0; });
    $('rows').innerHTML = rows.length ? rows.map(function (a) {
      return '<tr data-slug="' + esc(a.slug) + '"><td><b>' + esc(a.title) + '</b><br><small>' + esc(a.slug) + '</small></td><td>' + esc(a.category) + '</td><td>' + esc(a.date) + '</td><td><span class="badge b-' + a.state + '">' + a.state + '</span></td></tr>';
    }).join('') : '<tr><td colspan="4">No articles found.</td></tr>';
  }
  function loadList() {
    msg('');
    return api('list').then(function (j) { state.articles = j.articles; renderRows(); show('list'); }).catch(err);
  }

  // ---------- editor ----------
  function loadImages(selected) {
    return api('images').then(function (j) {
      state.images = j.images;
      var sel = $('image');
      var list = j.images.slice();
      if (selected && list.indexOf(selected) < 0) list.unshift(selected);
      sel.innerHTML = '<option value="">- choose an image -</option>' + list.map(function (p) { return '<option value="' + esc(p) + '"' + (p === selected ? ' selected' : '') + '>' + esc(p) + '</option>'; }).join('');
      updateThumb();
    });
  }
  function updateThumb() { var v = $('image').value; $('thumb').src = v || 'data:image/gif;base64,R0lGODlhAQABAAAAACw='; }
  function counters() {
    document.querySelectorAll('.cnt').forEach(function (c) {
      var el = $(c.getAttribute('data-for')); var max = +c.getAttribute('data-max'); var n = el.value.length;
      c.textContent = n + '/' + max; c.className = 'cnt' + (n > max ? ' bad' : '');
    });
    var words = $('html').value.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    $('wc').textContent = words + ' words (minimum 50)';
  }
  function fill(a) {
    FIELDS.forEach(function (f) { var v = a[f]; if (f === 'tags') v = (a.tags || []).join(', '); $(f).value = v || ''; });
    counters();
  }
  function collect() {
    var a = {};
    FIELDS.forEach(function (f) { a[f] = $(f).value; });
    a.tags = a.tags.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    return a;
  }
  function setStateUi() {
    var st = state.art ? state.art.state : 'new';
    var live = st === 'published';
    $('state-line').textContent = st === 'new' ? 'New article (not saved yet).' : st === 'published' ? 'This article is LIVE on the website.' : st === 'legacy' ? 'Built-in published article. Saving creates a hidden draft copy.' : 'Draft (not visible on the website).';
    $('btn-save').hidden = live;
    $('btn-publish').textContent = live ? 'Update live article...' : 'Publish...';
    $('btn-unpublish').hidden = !live;
    $('slug').readOnly = !state.isNew;
  }
  function openEditor(slug) {
    msg('');
    if (!slug) {
      state.art = null; state.sha = null; state.isNew = true; state.fromLegacy = false;
      $('edit-h').textContent = 'New article';
      fill({ category: '', tags: [] });
      return loadImages('').then(function () { setStateUi(); show('edit'); }).catch(err);
    }
    return api('get', { q: 'slug=' + encodeURIComponent(slug) }).then(function (j) {
      state.art = j.article; state.sha = j.article.sha; state.isNew = j.article.state === 'legacy'; state.fromLegacy = j.article.state === 'legacy';
      $('edit-h').textContent = 'Edit: ' + j.article.title;
      fill(j.article);
      return loadImages(j.article.image).then(function () { setStateUi(); show('edit'); });
    }).catch(err);
  }
  // slug is writable for new and legacy copies; keep same slug for legacy so the copy overrides it when published
  function payload() { var a = collect(); return a; }

  function saveDraft(ev) {
    if (ev) ev.preventDefault();
    msg('');
    $('btn-save').disabled = true;
    api('save', { body: { article: payload(), sha: state.isNew ? undefined : state.sha, fromLegacy: state.fromLegacy } }).then(function (j) {
      msg('Saved as draft. ' + j.note, 'ok');
      state.sha = j.sha; state.isNew = false; state.fromLegacy = false;
      state.art = Object.assign(state.art || {}, { state: 'draft', slug: j.slug, title: $('title').value });
      setStateUi();
    }).catch(err).then(function () { $('btn-save').disabled = false; });
  }
  function preview() {
    $('preview-article').value = JSON.stringify(payload());
    $('preview-form').submit();
  }

  // ---------- confirm dialog (publish / update / unpublish) ----------
  var pending = null;
  function openDialog(kind) {
    var slug = $('slug').value.trim().toLowerCase();
    if (!slug) { msg('Enter a slug first.', 'err'); return; }
    pending = kind;
    $('dlg-h').textContent = kind === 'unpublish' ? 'Unpublish article' : (state.art && state.art.state === 'published' ? 'Update live article' : 'Publish article');
    $('dlg-p').textContent = kind === 'unpublish'
      ? 'This removes the article from the website at the next build.'
      : 'This makes the article visible to everyone on puppyguido.com after the next build (about a minute).';
    $('dlg-slug').textContent = slug; $('dlg-confirm').value = ''; $('dlg-pw').value = '';
    $('dlg').showModal();
  }
  function doConfirm(ev) {
    ev.preventDefault();
    var slug = $('dlg-slug').textContent;
    var body = { confirm: $('dlg-confirm').value.trim(), password: $('dlg-pw').value, sha: state.isNew ? undefined : state.sha };
    $('dlg-ok').disabled = true;
    var call;
    if (pending === 'unpublish') { body.slug = slug; call = api('unpublish', { body: body }); }
    else { body.article = payload(); body.fromLegacy = state.fromLegacy; call = api('publish', { body: body }); }
    call.then(function (j) {
      $('dlg').close();
      $('dlg-pw').value = '';
      msg((j.state === 'published' ? 'Published. ' : 'Unpublished. ') + (j.note || 'The site rebuilds in about a minute.'), 'ok');
      state.sha = j.sha; state.isNew = false; state.fromLegacy = false;
      state.art = Object.assign(state.art || {}, { state: j.state, slug: slug });
      setStateUi();
    }).catch(function (e) { $('dlg-pw').value = ''; msg(e.message, 'err'); $('dlg').close(); }).then(function () { $('dlg-ok').disabled = false; });
  }

  // ---------- upload ----------
  function upload() {
    var f = $('upload').files[0];
    if (!f) return;
    if (['image/jpeg', 'image/png', 'image/webp'].indexOf(f.type) < 0) { msg('Only JPG, PNG or WebP images.', 'err'); $('upload').value = ''; return; }
    if (f.size > 2 * 1024 * 1024) { msg('Image is larger than 2 MB.', 'err'); $('upload').value = ''; return; }
    var rd = new FileReader();
    rd.onload = function () {
      api('upload', { body: { filename: f.name, data: String(rd.result) } }).then(function (j) {
        msg('Image uploaded: ' + j.path + '. ' + j.note, 'ok');
        return loadImages(j.path).then(function () { $('image').value = j.path; updateThumb(); });
      }).catch(err).then(function () { $('upload').value = ''; });
    };
    rd.readAsDataURL(f);
  }

  // ---------- toolbar ----------
  function insertTag(tag) {
    var ta = $('html'), s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e) || 'text';
    var out;
    if (tag === 'ul') out = '<ul>\n<li>' + sel + '</li>\n</ul>';
    else if (tag === 'a') { var u = prompt('Link address (https://... or /path):'); if (!u) return; out = '<a href="' + u.replace(/"/g, '') + '">' + sel + '</a>'; }
    else out = '<' + tag + '>' + sel + '</' + tag + '>';
    ta.value = ta.value.slice(0, s) + out + ta.value.slice(e);
    counters();
  }

  // ---------- wiring ----------
  $('login-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    api('login', { body: { password: $('login-pw').value } }).then(function () { $('login-pw').value = ''; msg(''); return api('session').then(function (s) { fillCategories(s.categories); return loadList(); }); }).catch(function (e) { $('login-pw').value = ''; err(e); });
  });
  $('btn-logout').addEventListener('click', function () { api('logout', { body: {} }).then(function () { show('login'); msg('Signed out.', 'ok'); }); });
  $('btn-list').addEventListener('click', loadList);
  $('btn-new').addEventListener('click', function () { openEditor(null); });
  $('search').addEventListener('input', renderRows);
  $('rows').addEventListener('click', function (ev) { var tr = ev.target.closest('tr[data-slug]'); if (tr) openEditor(tr.getAttribute('data-slug')); });
  $('edit-form').addEventListener('submit', saveDraft);
  $('btn-preview').addEventListener('click', preview);
  $('btn-publish').addEventListener('click', function () { openDialog('publish'); });
  $('btn-unpublish').addEventListener('click', function () { openDialog('unpublish'); });
  $('dlg-form').addEventListener('submit', doConfirm);
  $('dlg-cancel').addEventListener('click', function () { $('dlg-pw').value = ''; $('dlg').close(); });
  $('image').addEventListener('change', updateThumb);
  $('upload').addEventListener('change', upload);
  document.querySelectorAll('[data-ins]').forEach(function (b) { b.addEventListener('click', function () { insertTag(b.getAttribute('data-ins')); }); });
  $('edit-form').addEventListener('input', function (ev) {
    if (ev.target.id === 'title' && state.isNew && !state.fromLegacy && !$('slug').dataset.touched) $('slug').value = slugify($('title').value);
    if (ev.target.id === 'slug') $('slug').dataset.touched = '1';
    counters();
  });
  window.addEventListener('beforeunload', function () { /* drafts are explicit-save only */ });

  function fillCategories(cats) {
    $('category').innerHTML = '<option value="">- choose -</option>' + (cats || []).map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('');
  }
  api('session').then(function (s) {
    fillCategories(s.categories);
    if (!s.configured) { show('login'); $('login-form').hidden = true; msg('Admin is not configured yet (environment variables missing). See docs/admin-dashboard.md.', 'err'); return; }
    if (s.authenticated) loadList(); else show('login');
  }).catch(function () { show('login'); msg('Could not reach the admin API.', 'err'); });
})();
