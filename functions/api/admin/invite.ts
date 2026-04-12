import { signJwt } from '../../lib/jwt';

interface Env {
  DB: D1Database;
  AUTH_SECRET: string;
  APP_URL: string;
}

// POST: generate a direct magic link for a named person (owner-only)
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const user = (ctx.data as { user?: { name: string; role: string; session_id: string } }).user;
  if (!user || user.role !== 'owner') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { name?: string; email?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email } = body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return Response.json({ error: 'name is required' }, { status: 400 });
  }

  const requestId = crypto.randomUUID();
  const resolvedEmail = (email && typeof email === 'string') ? email.trim() : '';

  // Insert as already-approved — no pending step needed for direct invites
  await ctx.env.DB.prepare(
    `INSERT INTO access_requests (id, name, email, note, status, created_at, resolved_at)
     VALUES (?, ?, ?, 'direct-invite', 'approved', datetime('now'), datetime('now'))`
  ).bind(requestId, name.trim(), resolvedEmail).run();

  // 7-day expiry (owner decides when to share the link)
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const magicToken = await signJwt(
    { type: 'magic-link', request_id: requestId, email: resolvedEmail, exp },
    ctx.env.AUTH_SECRET
  );

  const magicLink = `${ctx.env.APP_URL}/api/auth/magic-link?token=${magicToken}`;

  return Response.json({ success: true, magic_link: magicLink });
};
