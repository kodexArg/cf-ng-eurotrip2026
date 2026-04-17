import { parseCookies, verifyJwt } from './lib/jwt';

interface Env {
  DB: D1Database;
  AUTH_PASSPHRASE: string;
  AUTH_SECRET: string;
  SITE_GATE_PASSWORD: string;
  APP_URL: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

// Auth is disabled — all GET requests are public
// Only mutating endpoints on admin/sessions remain protected
const ALLOWLISTED: Set<string> = new Set([
  'POST /api/auth/login',
  'POST /api/auth/logout',
  'GET /api/auth/me',
  'POST /api/access-requests',
  'GET /api/auth/magic-link',
  'POST /api/site-gate/login',
  'GET /api/site-gate/me',
]);

const PUBLIC_GET = true; // disable auth on all GET requests

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url);
  const method = ctx.request.method.toUpperCase();

  // Non-API requests pass through (static assets, Angular routes)
  if (!url.pathname.startsWith('/api/')) {
    return ctx.next();
  }

  // Allowlisted endpoints pass through
  if (ALLOWLISTED.has(`${method} ${url.pathname}`)) {
    return ctx.next();
  }

  // All GET requests are public (auth disabled)
  if (PUBLIC_GET && method === 'GET') {
    return ctx.next();
  }

  // --- Mutating /api/* requests require a valid JWT + active session ---

  const cookies = parseCookies(ctx.request.headers.get('Cookie'));
  const token = cookies['auth_token'];

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyJwt(token, ctx.env.AUTH_SECRET);
  if (!payload) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate session in D1
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

  // Mutating requests on protected endpoints require owner role
  const MUTATING_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);
  if (MUTATING_METHODS.has(method) && session.role !== 'owner') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Attach user info for downstream handlers
  (ctx.data as Record<string, unknown>).user = {
    name: payload.name,
    role: session.role,
    session_id: session.id,
  };

  return ctx.next();
};
