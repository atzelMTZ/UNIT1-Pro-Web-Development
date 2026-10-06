const crypto = require('crypto');
function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error('JWT_SECRET missing or shorter than 32 chars');
  return s;
}
const hmac = (data) => crypto.createHmac('sha256', secret()).update(data).digest();
const b64 = (v) => Buffer.from(v).toString('base64url');

function sign(payload, ttlSeconds = 3600) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64(JSON.stringify({ ...payload, iat: now, exp: now + ttlSeconds }));
  return `${head}.${body}.${hmac(`${head}.${body}`).toString('base64url')}`;
}

function verify(token) {
  try {
    const [head, body, sig] = String(token).split('.');
    if (!head || !body || !sig) return null;
    if (JSON.parse(Buffer.from(head, 'base64url')).alg !== 'HS256') return null; // pin algorithm
    const expected = hmac(`${head}.${body}`);
    const given = Buffer.from(sig, 'base64url');
    if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url'));
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch { return null; }
}

function getToken(req) {
  const m = (req.headers.cookie || '').match(/(?:^|;\s*)token=([^;]+)/);
  return m ? m[1] : null;
}
module.exports = { sign, verify, getToken };
