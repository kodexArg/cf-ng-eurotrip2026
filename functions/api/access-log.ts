import { accessConfigured, verifyAccessJwt } from '../lib/access';

interface Env {
  DB: D1Database;
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
}

/**
 * Visit log — who and from where viewed the site. Editor-only.
 * Returns the most recent 500 access_log rows, newest first.
 */
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  if (!accessConfigured(ctx.env)) {
    return Response.json({ error: 'Access not configured' }, { status: 503 });
  }
  const assertion = ctx.request.headers.get('Cf-Access-Jwt-Assertion');
  const identity = assertion
    ? await verifyAccessJwt(assertion, ctx.env.CF_ACCESS_TEAM_DOMAIN!, ctx.env.CF_ACCESS_AUD!)
    : null;
  if (!identity) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!identity.editor) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { results } = await ctx.env.DB.prepare(
    `SELECT email, editor, ip, country, city, colo, method, path, user_agent, created_at
     FROM access_log ORDER BY created_at DESC LIMIT 500`,
  ).all();
  return Response.json(results);
};
