import { verifyJwt, signJwt } from '../../lib/jwt';

interface Env {
  DB: D1Database;
  AUTH_SECRET: string;
  APP_URL: string;
}

interface MagicLinkPayload {
  type: string;
  request_id: string;
  email: string;
  exp: number;
}

// GET: redeem a magic-link token (unauthenticated — token in query string)
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return errorPage('Missing token', 400);
  }

  // Verify the magic-link JWT
  const payload = await verifyJwt<MagicLinkPayload>(token, ctx.env.AUTH_SECRET);

  if (!payload || payload.type !== 'magic-link' || !payload.request_id || !payload.email) {
    return errorPage('Invalid or expired link', 401);
  }

  // Look up the access request
  const request = await ctx.env.DB.prepare(
    "SELECT * FROM access_requests WHERE id = ? AND status = 'approved'"
  ).bind(payload.request_id).first<{ id: string; name: string; email: string }>();

  if (!request) {
    return errorPage('This link is no longer valid. The request may have been revoked.', 404);
  }

  // Create a new session
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await ctx.env.DB.prepare(
    'INSERT INTO sessions (id, name, email, role, expires_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(sessionId, request.name, request.email, 'visitor', expiresAt).run();

  // Sign session JWT
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
  const sessionToken = await signJwt(
    { name: request.name, role: 'visitor', session_id: sessionId, exp },
    ctx.env.AUTH_SECRET
  );

  // Set cookie and redirect to home
  const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
  const cookie = `auth_token=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
      'Set-Cookie': cookie,
    },
  });
};

function errorPage(message: string, status: number): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Error</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: #e2e8f0; }
    .card { text-align: center; padding: 2rem; max-width: 400px; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #94a3b8; }
    a { color: #60a5fa; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Access Error</h1>
    <p>${escapeHtml(message)}</p>
    <p><a href="/">Go to homepage</a></p>
  </div>
</body>
</html>`;

  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
