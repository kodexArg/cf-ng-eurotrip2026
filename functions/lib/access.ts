/**
 * Cloudflare Access (Zero Trust) + Google IdP integration.
 *
 * When Access fronts the site, every request carries a signed
 * `Cf-Access-Jwt-Assertion` header (and `Cf-Access-Authenticated-User-Email`).
 * We verify the assertion against the team's public keys and derive identity.
 *
 * Access mode is considered ACTIVE only when both `CF_ACCESS_TEAM_DOMAIN`
 * and `CF_ACCESS_AUD` env vars are present. Until then the legacy
 * passphrase / site-gate path stays in effect so production is never broken.
 */

/** Emails granted write (editor) access. Everyone else authenticated = view-only. */
export const EDITOR_EMAILS: ReadonlySet<string> = new Set([
  'gcavedal@gmail.com',
  'vanybou@gmail.com',
]);

export interface AccessIdentity {
  email: string;
  /** true => allowlisted editor (write); false => authenticated visitor (view-only). */
  editor: boolean;
}

export function isEditorEmail(email: string): boolean {
  return EDITOR_EMAILS.has(email.trim().toLowerCase());
}

export function accessConfigured(env: {
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
}): boolean {
  return Boolean(env.CF_ACCESS_TEAM_DOMAIN && env.CF_ACCESS_AUD);
}

interface Jwk {
  kid: string;
  kty: string;
  n: string;
  e: string;
  alg?: string;
}

const certsCache = new Map<string, { keys: Jwk[]; fetchedAt: number }>();
const CERTS_TTL_MS = 60 * 60 * 1000; // 1h

async function getKeys(teamDomain: string): Promise<Jwk[]> {
  const cached = certsCache.get(teamDomain);
  if (cached && Date.now() - cached.fetchedAt < CERTS_TTL_MS) return cached.keys;
  const url = `https://${teamDomain}/cdn-cgi/access/certs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`certs fetch failed: ${res.status}`);
  const json = (await res.json()) as { keys: Jwk[] };
  certsCache.set(teamDomain, { keys: json.keys, fetchedAt: Date.now() });
  return json.keys;
}

function b64urlToUint8(s: string): Uint8Array {
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
  const b64 = (s + '='.repeat(pad)).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * Verify a Cloudflare Access JWT assertion and return the identity, or null.
 * Checks RS256 signature against the team JWKS, `aud`, and `exp`.
 */
export async function verifyAccessJwt(
  assertion: string,
  teamDomain: string,
  expectedAud: string,
): Promise<AccessIdentity | null> {
  try {
    const [h, p, s] = assertion.split('.');
    if (!h || !p || !s) return null;
    const header = JSON.parse(new TextDecoder().decode(b64urlToUint8(h))) as { kid: string; alg: string };
    const payload = JSON.parse(new TextDecoder().decode(b64urlToUint8(p))) as {
      email?: string;
      aud?: string | string[];
      exp?: number;
    };

    if (header.alg !== 'RS256') return null;
    const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!auds.includes(expectedAud)) return null;
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
    if (!payload.email) return null;

    const jwk = (await getKeys(teamDomain)).find((k) => k.kid === header.kid);
    if (!jwk) return null;

    const key = await crypto.subtle.importKey(
      'jwk',
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const data = new TextEncoder().encode(`${h}.${p}`);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToUint8(s), data);
    if (!ok) return null;

    const email = payload.email.trim().toLowerCase();
    return { email, editor: isEditorEmail(email) };
  } catch {
    return null;
  }
}
