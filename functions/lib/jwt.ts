export function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((part) => {
      const [key, ...rest] = part.trim().split('=');
      return [key.trim(), rest.join('=').trim()];
    })
  );
}

export function base64urlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function signJwt(payload: object, secret: string): Promise<string> {
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

export async function verifyJwt(
  token: string,
  secret: string
): Promise<{ name: string; role: string; session_id: string } | null> {
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

  let parsed: { name: string; role: string; session_id: string; exp: number };
  try {
    parsed = JSON.parse(b64decode(payload));
  } catch {
    return null;
  }

  if (!parsed.exp || Date.now() / 1000 > parsed.exp) return null;

  return { name: parsed.name, role: parsed.role, session_id: parsed.session_id };
}

export async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);

  if (aBytes.length !== bBytes.length) {
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
