import { parseCookies, verifyJwt } from './lib/jwt';
import { accessConfigured, verifyAccessJwt, type AccessIdentity } from './lib/access';

interface Env {
  DB: D1Database;
  AUTH_PASSPHRASE: string;
  AUTH_SECRET: string;
  SITE_GATE_PASSWORD: string;
  APP_URL: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
}

const ALLOWLISTED: Set<string> = new Set([
  'POST /api/auth/login',
  'POST /api/auth/logout',
  'GET /api/auth/me',
  'GET /api/auth/whoami',
  'POST /api/access-requests',
  'GET /api/auth/magic-link',
  'POST /api/site-gate/login',
  'GET /api/site-gate/me',
]);

const PUBLIC_GET = true;

/** Should this request be recorded in access_log? Page navigations + api, not assets. */
function isTrackable(url: URL, req: Request): boolean {
  if (url.pathname.startsWith('/api/')) return true;
  const accept = req.headers.get('Accept') ?? '';
  const dest = req.headers.get('Sec-Fetch-Dest') ?? '';
  return dest === 'document' || accept.includes('text/html');
}

function logVisit(
  ctx: Parameters<PagesFunction<Env>>[0],
  url: URL,
  identity: AccessIdentity | null,
): void {
  const cf = (ctx.request as Request & { cf?: IncomingRequestCfProperties }).cf;
  const ip = ctx.request.headers.get('CF-Connecting-IP');
  const ua = ctx.request.headers.get('User-Agent');
  ctx.waitUntil(
    ctx.env.DB.prepare(
      `INSERT INTO access_log (email, editor, ip, country, city, colo, method, path, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        identity?.email ?? null,
        identity?.editor ? 1 : 0,
        ip,
        cf?.country ?? null,
        cf?.city ?? null,
        cf?.colo ?? null,
        ctx.request.method,
        url.pathname,
        ua,
      )
      .run()
      .catch(() => undefined),
  );
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url);
  const method = ctx.request.method.toUpperCase();

  // ===== Cloudflare Access mode (active only once Access is configured) =====
  if (accessConfigured(ctx.env)) {
    const assertion = ctx.request.headers.get('Cf-Access-Jwt-Assertion');
    const identity = assertion
      ? await verifyAccessJwt(assertion, ctx.env.CF_ACCESS_TEAM_DOMAIN!, ctx.env.CF_ACCESS_AUD!)
      : null;

    // Track who/where for every page view and api call (view-only included).
    if (isTrackable(url, ctx.request)) logVisit(ctx, url, identity);

    // Non-API: Cloudflare Access already enforced Google login. Pass through.
    if (!url.pathname.startsWith('/api/')) return ctx.next();

    if (ALLOWLISTED.has(`${method} ${url.pathname}`)) return ctx.next();

    // GET api is view-only and open to any authenticated visitor.
    if (method === 'GET') return ctx.next();

    // Mutations require an allowlisted editor email.
    if (!identity) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (!identity.editor) return Response.json({ error: 'Forbidden' }, { status: 403 });

    (ctx.data as Record<string, unknown>).user = {
      email: identity.email,
      role: 'owner',
    };
    return ctx.next();
  }

  // ===== Legacy mode (passphrase / site-gate) — until Access cutover =====

  if (!url.pathname.startsWith('/api/')) {
    return ctx.next();
  }

  if (ALLOWLISTED.has(`${method} ${url.pathname}`)) {
    return ctx.next();
  }

  if (PUBLIC_GET && method === 'GET') {
    return ctx.next();
  }

  const cookies = parseCookies(ctx.request.headers.get('Cookie'));
  const token = cookies['auth_token'];

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyJwt(token, ctx.env.AUTH_SECRET);
  if (!payload) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const session = await ctx.env.DB.prepare(
    'SELECT id, role, revoked_at, expires_at FROM sessions WHERE id = ?'
  )
    .bind(payload.session_id)
    .first<{ id: string; role: string; revoked_at: string | null; expires_at: string }>();

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.revoked_at !== null) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (new Date(session.expires_at) < new Date()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const MUTATING_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);
  if (MUTATING_METHODS.has(method) && session.role !== 'owner') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  (ctx.data as Record<string, unknown>).user = {
    name: payload.name,
    role: session.role,
    session_id: session.id,
  };

  return ctx.next();
};
