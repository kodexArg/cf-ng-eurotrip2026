// NOTE: The Secure cookie flag won't work on http://localhost with `wrangler pages dev`.
// For local dev the browser will still store and send the cookie; just ignore the "cookie rejected" warning.
// In production on Cloudflare Pages (HTTPS) it works correctly.

import { signJwt, timingSafeEqual } from '../../lib/jwt';

interface Env {
  DB: D1Database;
  AUTH_PASSPHRASE: string;
  AUTH_SECRET: string;
  APP_URL: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: { passphrase?: string; name?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { passphrase, name } = body;

  if (!passphrase || typeof passphrase !== 'string') {
    return Response.json({ error: 'passphrase required' }, { status: 400 });
  }

  const match = await timingSafeEqual(passphrase, ctx.env.AUTH_PASSPHRASE);
  if (!match) {
    return Response.json({ error: 'Invalid passphrase' }, { status: 401 });
  }

  const resolvedName = (name && typeof name === 'string' && name.trim()) ? name.trim() : 'anon';

  // Create server-side session
  const sessionId = crypto.randomUUID();
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
  const expiresAt = new Date(exp * 1000).toISOString();

  await ctx.env.DB.prepare(
    'INSERT INTO sessions (id, name, email, role, created_at, expires_at) VALUES (?, ?, null, \'owner\', datetime(\'now\'), ?)'
  )
    .bind(sessionId, resolvedName, expiresAt)
    .run();

  // Sign JWT with session reference
  const token = await signJwt(
    { name: resolvedName, role: 'owner', session_id: sessionId, exp },
    ctx.env.AUTH_SECRET
  );

  const MAX_AGE = 60 * 60 * 24 * 30; // 2592000 seconds
  const cookie = `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`;

  return Response.json(
    { authenticated: true, name: resolvedName, role: 'owner' },
    {
      headers: {
        'Set-Cookie': cookie,
      },
    }
  );
};
