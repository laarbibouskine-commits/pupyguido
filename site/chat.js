/* PuppyGuido chat assistant: floating button + small panel. Talks to the n8n webhook. No cookies. */
(function () {
  if (window.__pgChat) return;
  window.__pgChat = true;
  var URL = 'https://n8n.satinher.com/webhook/pupyguido-chat';
  var history = [];
  try { history = JSON.parse(sessionStorage.getItem('pgChat') || '[]'); } catch (e) {}
  var css = '' +
    '#pgc-btn{position:fixed;right:14px;bottom:14px;z-index:9998;display:flex;align-items:center;justify-content:center;width:46px;height:46px;background:#F6C431;color:#0B1F44;border:0;border-radius:50%;padding:0;cursor:pointer;box-shadow:0 4px 14px rgba(11,31,68,.28)}' +
    '#pgc-btn svg{width:22px;height:22px}#pgc-btn span{display:none}' +
    '#pgc-panel{position:fixed;right:14px;bottom:68px;z-index:9999;width:320px;max-width:calc(100vw - 32px);height:420px;max-height:calc(100vh - 90px);background:#fff;border-radius:16px;box-shadow:0 18px 50px rgba(11,31,68,.35);display:none;flex-direction:column;overflow:hidden;font:15px/1.45 "Segoe UI",Arial,sans-serif;color:#172033}' +
    '#pgc-panel.open{display:flex}' +
    '#pgc-head{background:#0B1F44;color:#fff;padding:12px 14px;display:flex;align-items:center;justify-content:space-between}' +
    '#pgc-head b{font-size:15px}#pgc-head span{display:block;font-size:12px;color:#F6C431}' +
    '#pgc-x{background:none;border:0;color:#fff;font-size:22px;cursor:pointer;line-height:1}' +
    '#pgc-log{flex:1;overflow:auto;padding:12px;background:#F4F7FB}' +
    '.pgc-m{max-width:88%;margin:0 0 8px;padding:9px 12px;border-radius:14px;white-space:pre-wrap;word-wrap:break-word}' +
    '.pgc-b{background:#fff;border:1px solid #E3E9F2}.pgc-u{background:#0B1F44;color:#fff;margin-left:auto}' +
    '.pgc-m a{color:#1B5FA8;text-decoration:underline}.pgc-u a{color:#F6C431}' +
    '#pgc-chips{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 8px}' +
    '.pgc-chip{background:#fff;border:1px solid #CFD9E8;border-radius:999px;padding:6px 10px;font-size:13px;cursor:pointer;color:#0B1F44}' +
    '#pgc-form{display:flex;gap:6px;padding:8px;border-top:1px solid #E3E9F2;background:#fff}' +
    '#pgc-in{flex:1;border:1px solid #CFD9E8;border-radius:10px;padding:9px 10px;font:inherit;min-width:0}' +
    '#pgc-send{background:#F6C431;color:#0B1F44;border:0;border-radius:10px;padding:0 14px;font-weight:800;cursor:pointer}' +
    '#pgc-note{font-size:11px;color:#5D6878;padding:0 10px 8px;background:#fff}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var btn = document.createElement('button');
  btn.id = 'pgc-btn'; btn.type = 'button'; btn.setAttribute('aria-label', 'Ask PuppyGuido a puppy question'); btn.title = 'Ask a puppy question';
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg><span>Ask a puppy question</span>';
  var panel = document.createElement('div');
  panel.id = 'pgc-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'PuppyGuido assistant');
  panel.innerHTML = '<div id="pgc-head"><div><b>PuppyGuido assistant</b><span>General puppy advice</span></div><button id="pgc-x" type="button" aria-label="Close chat">&times;</button></div>' +
    '<div id="pgc-log"></div>' +
    '<form id="pgc-form"><input id="pgc-in" type="text" maxlength="500" placeholder="Ask about potty, sleep, biting..." autocomplete="off"><button id="pgc-send" type="submit">Send</button></form>' +
    '<div id="pgc-note">Automated assistant. General information only, not veterinary advice.</div>';
  document.body.appendChild(panel); document.body.appendChild(btn);
  var log = panel.querySelector('#pgc-log'), form = panel.querySelector('#pgc-form'), input = panel.querySelector('#pgc-in');

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function linkify(s) {
    return esc(s).replace(/(^|[\s(])(\/(?:blog|shop)\/[a-z0-9\-\/]*|\/#signup)/gi, function (m, p, u) { return p + '<a href="' + u + '">' + u + '</a>'; });
  }
  function add(role, text) {
    var d = document.createElement('div');
    d.className = 'pgc-m ' + (role === 'user' ? 'pgc-u' : 'pgc-b');
    d.innerHTML = role === 'user' ? esc(text) : linkify(text);
    log.appendChild(d); log.scrollTop = log.scrollHeight; return d;
  }
  function save() { try { sessionStorage.setItem('pgChat', JSON.stringify(history.slice(-12))); } catch (e) {} }
  function welcome() {
    add('assistant', 'Hi! I am the PuppyGuido assistant. Ask me about potty training, sleep, crate, biting or getting ready for a puppy.');
    var chips = document.createElement('div'); chips.id = 'pgc-chips';
    ['My puppy cries at night', 'How often should my puppy pee?', 'My puppy bites a lot'].forEach(function (t) {
      var c = document.createElement('button'); c.type = 'button'; c.className = 'pgc-chip'; c.textContent = t;
      c.onclick = function () { chips.remove(); ask(t); }; chips.appendChild(c);
    });
    log.appendChild(chips);
  }
  var busy = false;
  function ask(text) {
    if (busy || !text) return;
    busy = true; add('user', text);
    var wait = add('assistant', 'Thinking...');
    fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, history: history.slice(-6) }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var reply = (d && d.reply) || 'Sorry, something went wrong. Please try again.';
        wait.innerHTML = linkify(reply);
        history.push({ role: 'user', content: text }, { role: 'assistant', content: reply }); save();
      })
      .catch(function () { wait.textContent = 'Sorry, I could not connect. Please try again in a moment.'; })
      .then(function () { busy = false; log.scrollTop = log.scrollHeight; });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim(); input.value = '';
    var chips = document.getElementById('pgc-chips'); if (chips) chips.remove();
    ask(v);
  });
  var started = false;
  function open() {
    panel.classList.add('open');
    if (!started) {
      started = true;
      if (history.length) history.forEach(function (h) { add(h.role, h.content); }); else welcome();
    }
    setTimeout(function () { input.focus(); }, 50);
  }
  btn.addEventListener('click', function () { panel.classList.contains('open') ? panel.classList.remove('open') : open(); });
  panel.querySelector('#pgc-x').addEventListener('click', function () { panel.classList.remove('open'); });
})();
