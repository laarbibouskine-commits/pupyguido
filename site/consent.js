// Cookie consent banner + Meta Pixel (loads only after the visitor accepts)
(function () {
  var PIXEL_ID = '1092514180372785', KEY = 'pg_consent';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadPixel() {
    if (window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
    if (/-puppy-guide\/?$/.test(location.pathname)) fbq('track', 'ViewContent', { content_name: location.pathname.replace(/\//g, '') });
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a[href*="lemonsqueezy.com"]');
      if (a) fbq('track', 'InitiateCheckout');
    }, true);
  }

  function banner() {
    var st = document.createElement('style');
    st.textContent = '.pg-cc{position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;max-width:560px;margin:0 auto;background:#0B1F44;color:#fff;border-radius:14px;padding:14px 16px;box-shadow:0 10px 40px rgba(0,0,0,.35);font:14px/1.4 Nunito,Arial,sans-serif}.pg-cc p{margin:0 0 10px}.pg-cc a{color:#F6C431}.pg-cc button{font:inherit;font-weight:800;border:0;border-radius:999px;padding:9px 18px;margin-right:8px;cursor:pointer}.pg-cc .y{background:#F6C431;color:#0B1F44}.pg-cc .n{background:transparent;color:#fff;border:1px solid #9fb3d6}';
    document.head.appendChild(st);
    var d = document.createElement('div');
    d.className = 'pg-cc'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Cookie consent');
    d.innerHTML = '<p>We use optional cookies (Meta Pixel) to measure our ads and show them to the right people. Essential site features work without them. <a href="/privacy/">Privacy</a></p><button class="y" type="button">Accept</button><button class="n" type="button">Decline</button>';
    d.querySelector('.y').onclick = function () { set('yes'); d.remove(); loadPixel(); };
    d.querySelector('.n').onclick = function () { set('no'); d.remove(); };
    document.body.appendChild(d);
  }

  var c = get();
  if (c === 'yes') loadPixel();
  else if (c !== 'no') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner); else banner();
  }
})();
