document.getElementById('f').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('msg'); msg.textContent = '';
  try {
    const r = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value }) });
    if (!r.ok) { msg.textContent = r.status === 401 ? 'Invalid username or password.' : 'Could not sign in.'; return; }
    const next = new URLSearchParams(location.search).get('next') || '/app/';
    location.href = /^\/app(\/|$)/.test(next) ? next : '/app/'; // only allow internal redirects
  } catch { msg.textContent = 'Network error. Try again.'; }
});
