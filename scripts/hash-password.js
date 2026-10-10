// Usage:  node scripts/hash-password.js
// Prompts for a password (hidden) and prints ADMIN_PASSWORD_HASH and a fresh SESSION_SECRET.
// Copy both values into Vercel > Project > Settings > Environment Variables yourself. Nothing is stored or sent.
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
const muted = { on: false };
rl._writeToOutput = function (s) { if (!muted.on || s === '\r\n' || s === '\n') rl.output.write(s); };
rl.question('New admin password (min 12 chars): ', pw => {
  muted.on = false;
  rl.close();
  if (pw.length < 12) { console.error('\nPassword too short.'); process.exit(1); }
  const N = 32768;
  const salt = crypto.randomBytes(16);
  crypto.scrypt(pw.normalize('NFKC'), salt, 32, { N, r: 8, p: 1, maxmem: 128 * 1024 * 1024 }, (e, key) => {
    if (e) { console.error(e.message); process.exit(1); }
    console.log('\nADMIN_PASSWORD_HASH=scrypt$' + N + '$' + salt.toString('base64') + '$' + key.toString('base64'));
    console.log('SESSION_SECRET=' + crypto.randomBytes(48).toString('base64url'));
  });
});
muted.on = true;
