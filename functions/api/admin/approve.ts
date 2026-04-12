import { signJwt } from '../../lib/jwt';

interface Env {
  DB: D1Database;
  AUTH_SECRET: string;
  APP_URL: string;
}

// POST: approve an access request and generate a magic link (owner-only)
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const user = (ctx.data as { user?: { name: string; role: string; session_id: string } }).user;
  if (!user || user.role !== 'owner') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { request_id?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { request_id } = body;
  if (!request_id || typeof request_id !== 'string') {
    return Response.json({ error: 'request_id is required' }, { status: 400 });
  }

  // Verify request exists and is pending
  const request = await ctx.env.DB.prepare(
    "SELECT * FROM access_requests WHERE id = ? AND status = 'pending'"
  ).bind(request_id).first();

  if (!request) {
    return Response.json({ error: 'Request not found or not pending' }, { status: 404 });
  }

  // Mark as approved
  await ctx.env.DB.prepare(
    "UPDATE access_requests SET status = 'approved', resolved_at = datetime('now') WHERE id = ?"
  ).bind(request_id).run();

  // Generate magic-link token (24h expiry)
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  const magicToken = await signJwt(
    { type: 'magic-link', request_id, email: request.email, exp },
    ctx.env.AUTH_SECRET
  );

  const magicLink = `${ctx.env.APP_URL}/api/auth/magic-link?token=${magicToken}`;

  return Response.json({ success: true, magic_link: magicLink });
};
