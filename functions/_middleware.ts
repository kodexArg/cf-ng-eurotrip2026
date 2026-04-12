interface Env {
  DB: D1Database;
  AUTH_PASSPHRASE: string;
  AUTH_SECRET: string;
}

function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((part) => {
      const [key, ...rest] = part.trim().split('=');
      return [key.trim(), rest.join('=').trim()];
    })
  );
}

async function verifyJwt(token: string, secret: string): Promise<{ name: string } | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const signingInput = `${header}.${payload}`;
  const sigBytes = Uint8Array.from(
    atob(signature.replace(/-/g, '+').replace(/_/g, '/').padEnd(signature.length + ((4 - (signature.length % 4)) % 4), '=')),
    (c) => c.charCodeAt(0)
  );

  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    sigBytes,
    new TextEncoder().encode(signingInput)
  );

  if (!valid) return null;

  let parsed: { name: string; exp: number };
  try {
    parsed = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=')));
  } catch {
    return null;
  }

  if (!parsed.exp || Date.now() / 1000 > parsed.exp) return null;

  return { name: parsed.name };
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url);
  const method = ctx.request.method.toUpperCase();

  // Non-API requests pass through
  if (!url.pathname.startsWith('/api/')) {
    return ctx.next();
  }

  // GET requests always pass through
  if (method === 'GET') {
    return ctx.next();
  }

  // Login endpoint passes through (handles its own auth)
  if (url.pathname === '/api/auth/login') {
    return ctx.next();
  }

  // Logout endpoint passes through (no auth required to clear a cookie)
  if (url.pathname === '/api/auth/logout') {
    return ctx.next();
  }

  // All other mutating requests require a valid JWT
  const cookies = parseCookies(ctx.request.headers.get('Cookie'));
  const token = cookies['auth_token'];

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyJwt(token, ctx.env.AUTH_SECRET);
  if (!payload) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return ctx.next();
};
