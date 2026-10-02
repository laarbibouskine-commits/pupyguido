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
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t); });
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

  // email form -> n8n, then thank-you page
  var form = document.getElementById('pupyguido-form');
  var frame = document.getElementById('pupyguido-response');
  var button = document.getElementById('pupyguido-submit');
  var submitted = false;
  form.addEventListener('submit', function () {
    submitted = true;
    button.disabled = true;
    button.textContent = 'Sending…';
  });
  frame.addEventListener('load', function () {
    if (submitted) { window.location.href = '/thank-you.html'; }
  });
})();
