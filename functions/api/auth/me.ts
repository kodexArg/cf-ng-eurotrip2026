import { parseCookies, verifyJwt } from '../../lib/jwt';

interface Env {
  DB: D1Database;
  AUTH_PASSPHRASE: string;
  AUTH_SECRET: string;
  APP_URL: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const cookies = parseCookies(ctx.request.headers.get('Cookie'));
  const token = cookies['auth_token'];

  if (!token) {
    return Response.json({ authenticated: false });
  }

  const payload = await verifyJwt(token, ctx.env.AUTH_SECRET);
  if (!payload) {
    return Response.json({ authenticated: false });
  }

  // Validate session is still active in D1
  const session = await ctx.env.DB.prepare(
    'SELECT id, role, revoked_at, expires_at FROM sessions WHERE id = ?'
  )
    .bind(payload.session_id)
    .first<{ id: string; role: string; revoked_at: string | null; expires_at: string }>();

  if (!session || session.revoked_at !== null || new Date(session.expires_at) < new Date()) {
    // Session revoked or expired — clear the stale cookie
    const clearCookie = 'auth_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0';
    return Response.json(
      { authenticated: false },
      { headers: { 'Set-Cookie': clearCookie } }
    );
  }

  return Response.json({
    authenticated: true,
    name: payload.name,
    role: session.role,
  });
};
