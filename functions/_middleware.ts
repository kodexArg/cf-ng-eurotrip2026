import { authorize, identify, type AccessEnv, type AccessIdentity } from './lib/access';

interface Env extends AccessEnv {
  DB: D1Database;
}

function isTrackable(url: URL, req: Request): boolean {
  if (url.pathname.startsWith('/api/')) return true;
  const accept = req.headers.get('Accept') ?? '';
  const dest = req.headers.get('Sec-Fetch-Dest') ?? '';
  return dest === 'document' || accept.includes('text/html');
}

function logVisit(ctx: Parameters<PagesFunction<Env>>[0], url: URL, identity: AccessIdentity): void {
  const cf = (ctx.request as Request & { cf?: IncomingRequestCfProperties }).cf;
  ctx.waitUntil(
    ctx.env.DB.prepare(
      `INSERT INTO access_log (email, editor, ip, country, city, colo, method, path, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        identity.email,
        identity.editor ? 1 : 0,
        ctx.request.headers.get('CF-Connecting-IP'),
        cf?.country ?? null,
        cf?.city ?? null,
        cf?.colo ?? null,
        ctx.request.method,
        url.pathname,
        ctx.request.headers.get('User-Agent'),
      )
      .run()
      .catch(() => undefined),
  );
}

/**
 * Every request needs a valid Cloudflare Access assertion (any Google identity).
 * Mutations and private reads additionally need an allowlisted editor email.
 */
export const onRequest: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url);
  const identity = await identify(ctx.request, ctx.env);

  const decision = authorize(ctx.request.method, url.pathname, identity);
  if (decision === 'unauthenticated') return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (decision === 'forbidden') return Response.json({ error: 'Forbidden' }, { status: 403 });

  if (isTrackable(url, ctx.request)) logVisit(ctx, url, identity!);
  (ctx.data as { identity?: AccessIdentity }).identity = identity!;
  return ctx.next();
};
