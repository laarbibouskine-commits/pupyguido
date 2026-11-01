// Cookie-less Buy-click counter for /starter-kit/. No cookies, no IDs, no personal data.
(function () {
  if (!/^\/starter-kit\/?$/.test(location.pathname)) return;
  var U = 'https://n8n.satinher.com/webhook/pupyguido-click';
  var w = window.innerWidth, dev = w < 700 ? 'mobile' : w < 1100 ? 'tablet' : 'desktop';
  var u = (new URLSearchParams(location.search).get('utm_content') || '').slice(0, 40);
  function ping(e, c, s) {
    var q = '?e=' + e + '&p=' + encodeURIComponent('/starter-kit/') + '&d=' + dev +
      (u ? '&u=' + encodeURIComponent(u) : '') + (c ? '&c=' + c : '') + (s ? '&s=' + s : '');
    try { fetch(U + q, { method: 'GET', mode: 'no-cors', keepalive: true, credentials: 'omit' }); }
    catch (x) { new Image().src = U + q; }
  }
  ping('lp_view');
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href*="lemonsqueezy.com/checkout"]');
    if (!a) return;
    var m = a.href.match(/\/checkout\/buy\/([0-9a-f]{8})/);
    var s = a.closest('.lp-sticky') ? 'sticky' : a.closest('.lp-hero') ? 'hero' : a.closest('#plans') ? 'plans' : 'other';
    ping('buy_click', m && m[1], s);
  }, true);
})();
