/* Sends UK and Australian readers to their own Amazon store (with the matching Associates tag). Others stay on amazon.com. */
(function () {
  var TAGS = { uk: 'puppyguido201-21', au: '' };
  var HOSTS = { uk: 'www.amazon.co.uk', au: 'www.amazon.com.au' };
  var tz = '', lang = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  lang = (navigator.language || '').toLowerCase();
  var region = 'us';
  if (lang === 'en-gb' || tz === 'Europe/London') region = 'uk';
  else if (lang === 'en-au' || tz.indexOf('Australia/') === 0) region = 'au';
  if (region === 'us' || !TAGS[region]) return;
  var links = document.querySelectorAll('a[href*="amazon.com/"]');
  for (var i = 0; i < links.length; i++) {
    try {
      var u = new URL(links[i].href);
      if (u.hostname !== 'www.amazon.com') continue;
      u.hostname = HOSTS[region];
      u.searchParams.set('tag', TAGS[region]);
      links[i].href = u.toString();
    } catch (e) {}
  }
})();
