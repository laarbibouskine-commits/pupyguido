const fs = require('fs'), path = require('path');
const f = path.join(__dirname, '..', 'build', 'build.js');
let b = fs.readFileSync(f, 'utf8');
const a = b.indexOf('<h2>Information we collect</h2>');
const z = b.indexOf('<h2>Affiliate links</h2>', a);
if (a < 0 || z < 0 || z < a) { console.log('markers not found'); process.exit(1); }
const mid = `<h2>Information we collect</h2>
<ul>
<li><strong>Sign-up details.</strong> When you request the free guide we collect your email address (and a name, if a form asks for one). We also record which page of the site you signed up from.</li>
<li><strong>Messages.</strong> If you email us, we keep your message and address so we can reply. If you use the chat assistant, your messages are processed to produce a reply (see below). Please do not type sensitive personal information into the chat.</li>
<li><strong>Technical data.</strong> Our hosting provider may log basic technical data such as IP address, browser type and pages requested, for security and reliability.</li>
<li><strong>Analytics.</strong> We use Vercel Web Analytics to count page views. According to Vercel it does not use cookies and does not track you across websites.</li>
<li><strong>Your cookie choice.</strong> The cookie banner saves your choice (accept or decline) in your browser's local storage on your device, so we do not ask you again on every page.</li>
</ul>
<h2>How we use it</h2>
<ul>
<li>To deliver the free guide you requested.</li>
<li>To send you our welcome emails and a weekly newsletter with puppy tips, new articles and, from time to time, our own products. Every email has an unsubscribe link.</li>
<li>To answer your questions and improve the site.</li>
<li>If you accept cookies: to measure how our ads perform and to show our ads to people who may be interested.</li>
</ul>
<p>We do not sell your personal information.</p>
<h2>Where your sign-up data goes</h2>
<p>When you submit the sign-up form, your browser sends the details directly to our own automation server at <strong>n8n.satinher.com</strong> (a self-hosted n8n instance that we run). From there the details are:</p>
<ul>
<li>saved in our own database (a self-hosted Supabase database) as your entry on our email list;</li>
<li>used to send you the guide and later emails from hello@puppyguido.com, through Gmail's email service (Google);</li>
<li>shared in a private notification to the site owner (your email address and the page you signed up from).</li>
</ul>
<p>The unsubscribe link in our emails also goes to the same server and marks your address so that you receive no more emails.</p>
<h2>Who else processes data</h2>
<ul>
<li><strong>Vercel</strong> hosts the site and provides the anonymous analytics.</li>
<li><strong>Chat assistant.</strong> Messages you type are sent to our server and then to an AI language-model provider (OpenRouter and the model companies behind it) to generate a reply.</li>
<li><strong>Google Fonts.</strong> Your browser loads fonts from Google, which means Google receives your IP address when a page loads.</li>
<li><strong>Meta (Facebook).</strong> Only if you accept cookies: the Meta Pixel, described below.</li>
<li><strong>Gumroad</strong> handles checkout and payment if you buy our paid guide. We do not see your card details.</li>
</ul>
<p>These providers may process data in countries outside your own, including the United States. They act on our behalf or under their own privacy policies.</p>
<h2>Cookies and tracking</h2>
<p>When you first visit, a banner asks whether you accept optional cookies. If you press <strong>Accept</strong>, we load the Meta (Facebook) Pixel. It sets cookies and sends information about your visit (for example the pages you view and button clicks) to Meta, to measure and improve our ads. If you press <strong>Decline</strong> or ignore the banner, the Pixel is not loaded. You can change your mind at any time by clearing this site's data in your browser; the banner will then appear again. We do not use other advertising cookies.</p>
`;
b = b.slice(0, a) + mid + b.slice(z);
b = b.replace("'Last updated: October 6, 2026'", "'Last updated: October 17, 2026'");
b = b.replace("<p>Some pages may contain affiliate links. If you buy through them we may earn a commission at no extra cost to you. Third-party sites have their own privacy policies.</p>", "<p>Some pages contain affiliate links (for example to Amazon and Temu). If you buy through them we may earn a commission at no extra cost to you. When you click one you leave our site, and the store has its own privacy policy and cookies.</p>");
b = b.replace("<p>We keep your name and email address until you unsubscribe or ask us to delete them.", "<p>We keep your email address (and name, if given) until you unsubscribe or ask us to delete them, and we then stop emailing you.");
b = b.replace("to object to or restrict certain processing. Email", "to object to or restrict certain processing, and to withdraw your consent (for example to cookies or emails). Email");
fs.writeFileSync(f, b);
console.log('privacy updated');
