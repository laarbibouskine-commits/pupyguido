// Password check (scrypt) + signed session cookie (HMAC-SHA256). No dependencies.
// Env: ADMIN_PASSWORD_HASH = "scrypt$<N>$<saltB64>$<hashB64>" (made by scripts/hash-password.js), SESSION_SECRET (>= 32 chars).
const crypto = require('crypto');

const COOKIE = 'pg_admin';
const MAX_AGE = 8 * 3600; // seconds
const attempts = new Map(); // best-effort, per warm instance

function b64u(buf) { return Buffer.from(buf).toString('base64url'); }
// Simple setup: ADMIN_PASSWORD (plain, stored encrypted by Vercel) + GITHUB_TOKEN; the session key is derived from the token.
// Advanced setup: ADMIN_PASSWORD_HASH + SESSION_SECRET.
function sessionKey() {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.length >= 20) return crypto.createHmac('sha256', process.env.GITHUB_TOKEN).update('pg-admin-session-v1').digest('base64url');
  return '';
}
const plainPassword = () => (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 12 ? process.env.ADMIN_PASSWORD : '');
function configured() {
  return !!((process.env.ADMIN_PASSWORD_HASH || plainPassword()) && sessionKey());
}
function scrypt(pw, salt, n) {
  return new Promise((resolve, reject) => crypto.scrypt(pw, salt, 32, { N: n, r: 8, p: 1, maxmem: 128 * 1024 * 1024 }, (e, k) => (e ? reject(e) : resolve(k))));
}
async function verifyPassword(pw) {
  if (!process.env.ADMIN_PASSWORD_HASH && plainPassword()) {
    const h = s => crypto.createHash('sha256').update(String(s || '').normalize('NFKC')).digest();
    return crypto.timingSafeEqual(h(pw), h(plainPassword()));
  }
  const parts = String(process.env.ADMIN_PASSWORD_HASH || '').split('$');
  if (parts.length !== 4 || parts[0] !== 'scrypt') return false;
  const n = parseInt(parts[1], 10);
  if (!(n >= 16384 && n <= 1048576)) return false;
  const salt = Buffer.from(parts[2], 'base64');
  const want = Buffer.from(parts[3], 'base64');
  const got = await scrypt(String(pw || '').normalize('NFKC'), salt, n);
  return want.length === got.length && crypto.timingSafeEqual(want, got);
}
function sign(payload) {
  const body = b64u(JSON.stringify(payload));
  const mac = crypto.createHmac('sha256', sessionKey()).update(body).digest('base64url');
  return body + '.' + mac;
}
function readSession(req) {
  if (!configured()) return null;
  const raw = String(req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE + '='));
  if (!raw) return null;
  const tok = raw.slice(COOKIE.length + 1);
  const [body, mac] = tok.split('.');
  if (!body || !mac) return null;
  const want = crypto.createHmac('sha256', sessionKey()).update(body).digest('base64url');
  const a = Buffer.from(mac), b = Buffer.from(want);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return p && p.exp > Math.floor(Date.now() / 1000) ? p : null;
  } catch (e) { return null; }
}
function sessionCookie() {
  const now = Math.floor(Date.now() / 1000);
  const tok = sign({ iat: now, exp: now + MAX_AGE, n: crypto.randomBytes(8).toString('hex') });
  return `${COOKIE}=${tok}; Path=/api/admin; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Strict`;
}
function clearCookie() { return `${COOKIE}=; Path=/api/admin; Max-Age=0; HttpOnly; Secure; SameSite=Strict`; }

function clientKey(req) { return String((req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket && req.socket.remoteAddress || 'x').trim(); }
function locked(req) {
  const a = attempts.get(clientKey(req));
  return !!(a && a.count >= 5 && Date.now() - a.last < 15 * 60 * 1000);
}
function recordFailure(req) {
  const k = clientKey(req);
  const a = attempts.get(k);
  if (!a || Date.now() - a.last > 15 * 60 * 1000) attempts.set(k, { count: 1, last: Date.now() });
  else { a.count++; a.last = Date.now(); }
}
function clearFailures(req) { attempts.delete(clientKey(req)); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = { configured, verifyPassword, readSession, sessionCookie, clearCookie, locked, recordFailure, clearFailures, sleep };
