const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const arrow = '<svg class="ico"><use href="#i-arrow"/></svg>';
function edit(file, pairs) {
  const p = path.join(root, file);
  let s = fs.readFileSync(p, 'utf8');
  for (const [a, b] of pairs) {
    if (!s.includes(a)) { console.log('MISSING in ' + file + ': ' + a.slice(0, 70)); continue; }
    s = s.split(a).join(b);
  }
  fs.writeFileSync(p, s);
}

edit('site/index.html', [
  ['<title>PuppyGuido | Free New Puppy Survival Guide &amp; 14-Day Plan</title>', '<title>Free New Puppy Guide: 14-Day Plan &amp; Checklists | PuppyGuido</title>'],
  ['content="Get the FREE New Puppy Survival Guide: practical checklists, daily routines, potty and crate training tips and a 14-day plan for first-time puppy parents."', 'content="Free PDF for first-time puppy parents: a 14-day plan, potty schedule, crate and biting tips and simple checklists. Positive methods only."'],
  ['<h1>Your puppy\'s first days, <span class="hl">made easier.</span></h1>', '<h1>Your first 14 days with a new puppy, <span class="hl">one clear step at a time.</span></h1>'],
  ['<p class="lead">Simple tips, practical checklists, daily routines and a 14-day plan, so you always know what to do <em>today</em>.</p>', '<p class="lead">A free guide with a day-by-day plan, a potty schedule and simple checklists, so you always know what to do <em>today</em>. Gentle, positive methods only.</p>'],
  ['<a class="btn btn-gold" href="#signup">Get your free puppy guide ' + arrow + '</a>\n        <a class="btn btn-ghost" href="#plan">See the 14-day plan</a>', '<a class="btn btn-gold" href="#signup">Send me the free guide ' + arrow + '</a>\n        <a class="btn btn-ghost" href="#plan">See the 14-day plan</a>'],
  ['\n      <a class="btn btn-gold" href="#signup">Get the free guide</a>\n    </div>\n  </div>', '\n    </div>\n  </div>'],
  ['\n      <a class="btn btn-navy" href="#signup">Send me the guide ' + arrow + '</a>\n    </div>\n    <div class="stage reveal">', '\n    </div>\n    <div class="stage reveal">'],
  ['<a class="btn btn-gold" href="#signup">Get the full plan free</a>', '<a class="btn btn-gold" href="#signup">Get the 14-day plan free</a>'],
  ['<a class="btn btn-navy" href="#signup">Get your free puppy guide ' + arrow + '</a>\n  </div>\n</section>', '<a class="btn btn-navy" href="#signup">Send me the free guide ' + arrow + '</a>\n  </div>\n</section>'],
  ['<h3>Send me the guide</h3>', '<h3>Where should we send it?</h3>'],
  ['<p class="sub">Free. We email the guide to the address you enter.</p>', '<p class="sub">Free PDF to your inbox. Just your email.</p>'],
  ['        <label for="name">Full name</label>\n        <input id="name" name="Full name" type="text" placeholder="Your full name" autocomplete="name" required>\n', ''],
  ['<label for="email">Email address</label>', '<label for="email">Your email</label>'],
  ['placeholder="you@example.com" autocomplete="email" required>', 'placeholder="Your email" autocomplete="email" required>'],
  ['type="submit">Get my free guide <svg class="ico"><use href="#i-gift"/></svg></button>', 'type="submit">Send me the free guide <svg class="ico"><use href="#i-gift"/></svg></button>'],
  ['By signing up you agree to our <a href="/privacy/">Privacy Policy</a>.</p>\n        <p class="fine" id="pupyguido-error"', 'By signing up you agree to our <a href="/privacy/">Privacy Policy</a>. Unsubscribe any time.</p>\n        <p class="fine">General information, not veterinary advice. Ask your vet about your puppy\'s health, vaccines, food and exercise.</p>\n        <p class="fine" id="pupyguido-error"'],
  ['Yes. Enter your name and email and the guide', 'Yes. Enter your email and the guide']
]);

edit('site/main.js', [
  ["data.delete('website');", "data.delete('website');\n    data.set('source', location.pathname === '/' ? 'home' : location.pathname);"]
]);

edit('build/build.js', [
  ['<input name="Full name" type="text" placeholder="Your first name" autocomplete="name" required aria-label="Your name"><input name="Email address" type="email" placeholder="you@example.com" autocomplete="email" required aria-label="Email address"><div aria-hidden="true" style="position:absolute;left:-9999px;height:0;overflow:hidden"><input name="website" type="text" tabindex="-1" autocomplete="off"></div><button class="btn btn-gold" type="submit">Send me the guide</button>', '<input name="Email address" type="email" placeholder="Your email" autocomplete="email" required aria-label="Email address"><div aria-hidden="true" style="position:absolute;left:-9999px;height:0;overflow:hidden"><input name="website" type="text" tabindex="-1" autocomplete="off"></div><button class="btn btn-gold" type="submit">Send me the free guide</button>'],
  ["d.delete('website');b.disabled=true;", "d.delete('website');d.set('source',location.pathname);b.disabled=true;"]
]);
console.log('done');
