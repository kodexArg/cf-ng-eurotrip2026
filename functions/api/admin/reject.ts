interface Env {
  DB: D1Database;
  AUTH_SECRET: string;
}

// POST: reject an access request (owner-only)
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

  await ctx.env.DB.prepare(
    "UPDATE access_requests SET status = 'rejected', resolved_at = datetime('now') WHERE id = ?"
  ).bind(request_id).run();

  return Response.json({ success: true });
};
