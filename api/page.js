// Gatekeeper: every file under /app/* is served from /content ONLY if the JWT cookie is valid.
const fs = require('fs');
const path = require('path');
const { verify, getToken } = require('./_lib/auth');
const ROOT = path.join(process.cwd(), 'content');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
function redirect(res, to) {
  res.statusCode = 302; res.setHeader('Location', to); res.setHeader('Cache-Control', 'no-store'); res.end();
}
module.exports = (req, res) => {
  let p = (req.query && req.query.p) || new URL(req.url, 'http://x').searchParams.get('p') || '';
  if (Array.isArray(p)) p = p.join('/');
  if (!verify(getToken(req))) return redirect(res, '/login.html?next=' + encodeURIComponent('/app/' + p));

  let file = path.resolve(ROOT, p);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) { res.statusCode = 403; return res.end('Forbidden'); }
  let isIndex = false;
  try { if (fs.statSync(file).isDirectory()) { file = path.join(file, 'index.html'); isIndex = true; } }
  catch { res.statusCode = 404; return res.end('Not found'); }
  const type = TYPES[path.extname(file)];
  if (!type || !fs.existsSync(file)) { res.statusCode = 404; return res.end('Not found'); }

  let data = fs.readFileSync(file);
  if (isIndex) { // make relative links work whether or not the URL ends in "/"
    const dir = p.replace(/\/+$/, '');
    data = Buffer.from(data.toString().replace('<head>', `<head><base href="/app/${dir ? dir + '/' : ''}">`));
  }
  res.setHeader('Content-Type', type);
  res.setHeader('Cache-Control', 'private, no-store');
  res.end(data);
};
