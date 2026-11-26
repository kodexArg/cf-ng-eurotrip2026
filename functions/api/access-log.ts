import type { AccessIdentity } from '../lib/access';

interface Env {
  DB: D1Database;
}

/** Visit log, newest 500 rows. Editor-only: enforced by `_middleware.ts` and re-checked here. */
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const identity = (ctx.data as { identity?: AccessIdentity }).identity;
  if (!identity) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!identity.editor) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { results } = await ctx.env.DB.prepare(
    `SELECT email, editor, ip, country, city, colo, method, path, user_agent, created_at
     FROM access_log ORDER BY created_at DESC LIMIT 500`,
  ).all();
  return Response.json(results);
};
