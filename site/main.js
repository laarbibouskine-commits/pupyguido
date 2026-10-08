(function () {
  // mobile menu
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');
  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  });

  // 14-day plan tabs
  var tabs = document.querySelectorAll('.plan-tabs button');
  var days = document.querySelectorAll('#days .day');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-pressed', x === t); });
      days.forEach(function (d) {
        d.classList.toggle('hidden', t.dataset.week !== 'all' && d.dataset.w !== t.dataset.week);
      });
    });
  });

  // scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  document.getElementById('yr').textContent = new Date().getFullYear();

  // email form -> n8n webhook; thank-you page only on a successful response
  var form = document.getElementById('pupyguido-form');
  var button = document.getElementById('pupyguido-submit');
  var errBox = document.getElementById('pupyguido-error');
  var label = button.innerHTML;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errBox.hidden = true;
    var data = new FormData(form);
    if (data.get('website')) { window.location.href = '/thank-you.html'; return; } // honeypot: bots
    data.delete('website');
    button.disabled = true;
    button.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: data })
      .then(function (r) { if (!r.ok) throw new Error('bad status'); window.location.href = '/thank-you.html'; })
      .catch(function () {
        button.disabled = false;
        button.innerHTML = label;
        errBox.textContent = 'Sorry, something went wrong and we could not send your guide. Please try again in a moment or email hello@puppyguido.com.';
        errBox.hidden = false;
      });
  });
})();
