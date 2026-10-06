// Local test server that mimics the Vercel routing: npm run dev  ->  http://localhost:3000
process.env.JWT_SECRET = process.env.JWT_SECRET || 'local-development-secret-at-least-32-chars!!';
const http = require('http'); const url = require('url');
const fs = require('fs'); const path = require('path');
const h = { login: require('../api/login'), logout: require('../api/logout'), page: require('../api/page') };
http.createServer((req, res) => {
  const u = url.parse(req.url, true); let raw = '';
  req.on('data', (c) => (raw += c)).on('end', () => {
    if (u.pathname === '/') { res.statusCode = 302; res.setHeader('Location', '/app/'); return res.end(); }
    if (u.pathname === '/api/login') { try { req.body = JSON.parse(raw); } catch {} return h.login(req, res); }
    if (u.pathname === '/api/logout') return h.logout(req, res);
    if (u.pathname.startsWith('/app')) { req.query = { p: u.pathname.replace(/^\/app\/?/, '') }; return h.page(req, res); }
    const f = path.join(__dirname, '..', 'public', u.pathname);
    if (fs.existsSync(f) && fs.statSync(f).isFile()) {
      res.setHeader('Content-Type', f.endsWith('.html') ? 'text/html' : 'text/javascript'); return res.end(fs.readFileSync(f));
    }
    res.statusCode = 404; res.end('Not found');
  });
}).listen(3000, () => console.log('http://localhost:3000'));
