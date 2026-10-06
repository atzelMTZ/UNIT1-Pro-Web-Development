const { sign } = require('./_lib/auth');
const { checkPassword } = require('./_lib/users');
const send = (res, code, obj, headers = {}) => {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(obj));
};
module.exports = (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' }, { Allow: 'POST' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  const { username, password } = body || {};
  if (typeof username !== 'string' || typeof password !== 'string' || username.length > 64 || password.length > 128)
    return send(res, 400, { error: 'Invalid request' });
  if (!checkPassword(username, password)) return send(res, 401, { error: 'Invalid username or password' });
  const token = sign({ sub: username });
  send(res, 200, { ok: true }, {
    'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
  });
};
