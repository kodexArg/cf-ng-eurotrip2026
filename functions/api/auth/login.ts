// NOTE: The Secure cookie flag won't work on http://localhost with `wrangler pages dev`.
// For local dev the browser will still store and send the cookie; just ignore the "cookie rejected" warning.
// In production on Cloudflare Pages (HTTPS) it works correctly.

interface Env {
  DB: D1Database;
  AUTH_PASSPHRASE: string;
  AUTH_SECRET: string;
}

function base64urlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function signJwt(payload: object, secret: string): Promise<string> {
  const header = base64urlEncode(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = base64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const signingInput = `${header}.${body}`;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput));
  return `${signingInput}.${base64urlEncode(signature)}`;
}

async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);

  // Use subtle.timingSafeEqual if available (Cloudflare Workers runtime exposes it)
  // Fallback: constant-time manual comparison (same length, XOR all bytes)
  if (aBytes.length !== bBytes.length) {
    // Still do a full pass to avoid timing leaks on length difference
    let diff = aBytes.length ^ bBytes.length;
    for (let i = 0; i < Math.max(aBytes.length, bBytes.length); i++) {
      diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
    }
    return false;
  }

  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) {
    diff |= aBytes[i] ^ bBytes[i];
  }
  return diff === 0;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: { passphrase?: string; name?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { passphrase, name } = body;

  if (!passphrase || typeof passphrase !== 'string') {
    return Response.json({ error: 'passphrase required' }, { status: 400 });
  }

  const match = await timingSafeEqual(passphrase, ctx.env.AUTH_PASSPHRASE);
  if (!match) {
    return Response.json({ error: 'Invalid passphrase' }, { status: 401 });
  }

  const resolvedName = (name && typeof name === 'string' && name.trim()) ? name.trim() : 'anon';
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days

  const token = await signJwt({ name: resolvedName, exp }, ctx.env.AUTH_SECRET);

  const MAX_AGE = 60 * 60 * 24 * 30; // 2592000 seconds
  const cookie = `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`;

  return Response.json(
    { authenticated: true, name: resolvedName },
    {
      headers: {
        'Set-Cookie': cookie,
      },
    }
  );
};
