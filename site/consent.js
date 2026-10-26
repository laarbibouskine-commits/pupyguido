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
    if (/^\/starter-kit\/?$/.test(location.pathname)) fbq('track', 'ViewContent', { content_name: 'Complete Puppy Bundle', content_ids: ['1474651'], content_type: 'product', value: 59, currency: 'USD' });
    if (/^\/thank-you(\.html|\/)?$/.test(location.pathname)) fbq('track', 'Lead');
    // Lemon Squeezy checkout links: product id and price per checkout uuid
    var PRODUCTS = {
      '41f6f105': { id: '1474480', value: 17, name: 'New Puppy Starter Kit' },
      '947cce14': { id: '1474491', value: 27, name: 'Starter Kit + Puppy Health Tracker' },
      '9ef17660': { id: '1474651', value: 59, name: 'The Complete Puppy Bundle' },
      'c462fb32': { id: '1474497', value: 49, name: 'The Puppy Training Playbook' },
      '5421bad0': { id: '1474513', value: 35, name: 'The Puppy Training Playbook (Kit Buyer Offer)' }
    };
    function cookie(n) { var m = document.cookie.match('(?:^|; )' + n + '=([^;]*)'); return m ? decodeURIComponent(m[1]) : ''; }
    function fbcValue() {
      var c = cookie('_fbc'); if (c) return c;
      var m = location.search.match(/[?&]fbclid=([^&]+)/);
      return m ? 'fb.1.' + Date.now() + '.' + m[1] : '';
    }
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a[href*="lemonsqueezy.com"]');
      if (!a) return;
      var m = a.href.match(/\/checkout\/buy\/([0-9a-f]{8})/), p = m && PRODUCTS[m[1]];
      fbq('track', 'InitiateCheckout', p ? { content_ids: [p.id], content_name: p.name, content_type: 'product', value: p.value, currency: 'USD', num_items: 1 } : {});
      // pass the visitor's Meta identifiers to the order, so the server-side Purchase can be matched
      try {
        var u = new URL(a.href);
        u.searchParams.set('checkout[custom][consent]', '1');
        var fbp = cookie('_fbp'), fbc = fbcValue();
        if (fbp) u.searchParams.set('checkout[custom][fbp]', fbp);
        if (fbc) u.searchParams.set('checkout[custom][fbc]', fbc);
        u.searchParams.set('checkout[custom][ua]', navigator.userAgent.slice(0, 200));
        a.href = u.toString();
      } catch (e) {}
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
