/**
 * Shared JWT utilities extracted from _middleware.ts and api/auth/login.ts.
 * Import from this module instead of duplicating across function files.
 */

export function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((part) => {
      const [key, ...rest] = part.trim().split('=');
      return [key.trim(), rest.join('=').trim()];
    })
  );
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

  const signingInput = `${header}.${payload}`;
  const sigBytes = Uint8Array.from(
    atob(
      signature
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(signature.length + ((4 - (signature.length % 4)) % 4), '=')
    ),
    (c) => c.charCodeAt(0)
  );

  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    sigBytes,
    new TextEncoder().encode(signingInput)
  );

  if (!valid) return null;

  let parsed: { name: string; role?: string; session_id?: string; exp: number };
  try {
    parsed = JSON.parse(
      atob(
        payload
          .replace(/-/g, '+')
          .replace(/_/g, '/')
          .padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=')
      )
    );
  } catch {
    return null;
  }

  if (!parsed.exp || Date.now() / 1000 > parsed.exp) return null;

  // Require role and session_id — old tokens without these fields are treated as invalid.
  if (!parsed.role || !parsed.session_id) return null;

  return { name: parsed.name, role: parsed.role, session_id: parsed.session_id };
}

export function base64urlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function signJwt(payload: object, secret: string): Promise<string> {
  const header = base64urlEncode(
    new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  );
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

export async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);

  // Use a constant-time comparison that avoids early exit.
  // Even on length mismatch we do a full pass to avoid timing leaks.
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
