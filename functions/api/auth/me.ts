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

  const pad = (s: string) => s.padEnd(s.length + ((4 - (s.length % 4)) % 4), '=');
  const b64decode = (s: string) => atob(pad(s.replace(/-/g, '+').replace(/_/g, '/')));

  const sigBytes = Uint8Array.from(b64decode(signature), (c) => c.charCodeAt(0));
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    sigBytes,
    new TextEncoder().encode(`${header}.${payload}`)
  );

  if (!valid) return null;

  let parsed: { name: string; exp: number };
  try {
    parsed = JSON.parse(b64decode(payload));
  } catch {
    return null;
  }

  if (!parsed.exp || Date.now() / 1000 > parsed.exp) return null;

  return { name: parsed.name };
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const cookies = parseCookies(ctx.request.headers.get('Cookie'));
  const token = cookies['auth_token'];

  if (!token) {
    return Response.json({ authenticated: false });
  }

  const payload = await verifyJwt(token, ctx.env.AUTH_SECRET);
  if (!payload) {
    return Response.json({ authenticated: false });
  }

  return Response.json({ authenticated: true, name: payload.name });
};
