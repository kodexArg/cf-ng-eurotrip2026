interface Env {
  DB: D1Database;
  AUTH_SECRET: string;
}

// GET: list active sessions (owner-only)
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const user = (ctx.data as { user?: { name: string; role: string; session_id: string } }).user;
  if (!user || user.role !== 'owner') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { results } = await ctx.env.DB.prepare(
    "SELECT id, name, email, role, created_at, expires_at FROM sessions WHERE revoked_at IS NULL AND expires_at > datetime('now') ORDER BY created_at DESC"
  ).all();

  return Response.json({ sessions: results });
};

// DELETE: revoke a session (owner-only)
export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  const user = (ctx.data as { user?: { name: string; role: string; session_id: string } }).user;
  if (!user || user.role !== 'owner') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { session_id?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { session_id } = body;
  if (!session_id || typeof session_id !== 'string') {
    return Response.json({ error: 'session_id is required' }, { status: 400 });
  }

  await ctx.env.DB.prepare(
    "UPDATE sessions SET revoked_at = datetime('now') WHERE id = ?"
  ).bind(session_id).run();

  return Response.json({ success: true });
};
