const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const f = path.join(root, 'build', 'build.js');
let L = fs.readFileSync(f, 'utf8').split('\n');
const i = L.findIndex(l => l.startsWith('const ctaBox = `<aside class="cta-box">'));
if (i < 0) { console.log('ctaBox not found'); process.exit(1); }
if (L[i].includes('cta-form')) { console.log('already'); process.exit(0); }
const box = "const ctaBox = `<aside class=\"cta-box cta-form\"><div class=\"cta-copy\"><h3>Get the free New Puppy Survival Guide</h3><p>Checklists, routines and a 14-day plan for your puppy's first days at home. Free, no spam.</p></div>" +
  "<form class=\"cta-signup\" method=\"POST\" enctype=\"multipart/form-data\" action=\"https://n8n.satinher.com/webhook/pupyguido-lead\" onsubmit=\"return pgSend(event)\">" +
  "<input name=\"Full name\" type=\"text\" placeholder=\"Your first name\" autocomplete=\"name\" required aria-label=\"Your name\">" +
  "<input name=\"Email address\" type=\"email\" placeholder=\"you@example.com\" autocomplete=\"email\" required aria-label=\"Email address\">" +
  "<div aria-hidden=\"true\" style=\"position:absolute;left:-9999px;height:0;overflow:hidden\"><input name=\"website\" type=\"text\" tabindex=\"-1\" autocomplete=\"off\"></div>" +
  "<button class=\"btn btn-gold\" type=\"submit\">Send me the guide</button>" +
  "<p class=\"cta-fine\">No spam. By signing up you agree to our <a href=\"/privacy/\">Privacy Policy</a>.</p><p class=\"cta-err\" role=\"alert\" hidden></p></form>" +
  "<script>function pgSend(e){e.preventDefault();var f=e.target,b=f.querySelector('button'),er=f.querySelector('.cta-err');er.hidden=true;var d=new FormData(f);if(d.get('website')){location.href='/thank-you.html';return false}d.delete('website');b.disabled=true;var t=b.textContent;b.textContent='Sending...';fetch(f.action,{method:'POST',body:d}).then(function(r){if(!r.ok)throw 0;location.href='/thank-you.html'}).catch(function(){b.disabled=false;b.textContent=t;er.textContent='Sorry, something went wrong. Please try again or email hello@puppyguido.com.';er.hidden=false});return false}</script></aside>`;";
L[i] = box;
fs.writeFileSync(f, L.join('\n'));
const css = path.join(root, 'site', 'styles.css');
let c = fs.readFileSync(css, 'utf8');
if (!c.includes('.cta-signup')) {
  c += '\n.cta-form{display:block}\n.cta-form .cta-copy{margin-bottom:16px}\n.cta-signup{display:grid;grid-template-columns:1fr 1fr auto;gap:12px;align-items:start;position:relative}\n.cta-signup input{width:100%;font:inherit;font-size:16px;padding:13px 14px;border:2px solid transparent;border-radius:12px;background:#fff;color:var(--ink)}\n.cta-signup .btn{white-space:nowrap}\n.cta-fine,.cta-err{grid-column:1/-1;font-size:13px;color:#c8d6ee;margin:2px 0 0}\n.cta-fine a{color:#F6C431}\n.cta-err{color:#ffd6d6;font-weight:700}\n@media (max-width:760px){.cta-signup{grid-template-columns:1fr}}\n';
  fs.writeFileSync(css, c);
}
console.log('ok');
