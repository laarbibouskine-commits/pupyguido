const fs = require('fs'), path = require('path');
const f = path.join(__dirname, '..', 'build', 'build.js');
let b = fs.readFileSync(f, 'utf8');
if (b.includes('_vercel/insights')) { console.log('already'); process.exit(0); }
const re = /(\$\{adsLoader\}\r?\n)(<link rel="icon" type="image\/png" sizes="48x48")/;
if (!re.test(b)) { console.log('pattern not found'); process.exit(1); }
b = b.replace(re, '$1<script defer src="/_vercel/insights/script.js"></script>\n$2');
// privacy policy: mention cookieless analytics
b = b.replace('<li><strong>Technical data.</strong> Our hosting provider may log basic technical data such as IP address, browser type and pages requested, for security and reliability.</li>',
  '<li><strong>Technical data.</strong> Our hosting provider may log basic technical data such as IP address, browser type and pages requested, for security and reliability.</li>\n<li><strong>Anonymous analytics.</strong> We use Vercel Web Analytics to count page views. It does not use cookies and does not track you across websites.</li>');
fs.writeFileSync(f, b);
console.log('done');
