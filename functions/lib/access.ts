/**
 * Cloudflare Access (Zero Trust) identity for every request.
 *
 * Access fronts the site with Google login and signs each request with a
 * `Cf-Access-Jwt-Assertion` header. The middleware verifies it against the
 * team JWKS, `aud`, `iss`, `exp` and `nbf`; requests without a valid
 * assertion are rejected, so a host that bypasses Access (for example
 * `*.pages.dev`) serves nothing.
 */

/** Emails granted edit and configuration access. Every other Google identity is view-only. */
export const EDITOR_EMAILS: ReadonlySet<string> = new Set([
  'gcavedal@gmail.com',
  'vanybou@gmail.com',
]);

/** GET endpoints that expose private data and are editor-only. */
export const PRIVATE_READ_PATHS: ReadonlySet<string> = new Set(['/api/access-log']);

const SAFE_METHODS: ReadonlySet<string> = new Set(['GET', 'HEAD', 'OPTIONS']);

export interface AccessIdentity {
  email: string;
  editor: boolean;
}

export interface AccessEnv {
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
}

export type Decision = 'allow' | 'unauthenticated' | 'forbidden';

export function isEditorEmail(email: string): boolean {
  return EDITOR_EMAILS.has(email.trim().toLowerCase());
}

/** True when the request needs an editor: any mutating method, or a private read. */
export function requiresEditor(method: string, pathname: string): boolean {
  return !SAFE_METHODS.has(method.toUpperCase()) || PRIVATE_READ_PATHS.has(pathname.replace(/\/+$/, ''));
}

export function authorize(method: string, pathname: string, identity: AccessIdentity | null): Decision {
  if (!identity) return 'unauthenticated';
  if (requiresEditor(method, pathname) && !identity.editor) return 'forbidden';
  return 'allow';
}

interface Jwk {
  kid: string;
  kty: string;
  n: string;
  e: string;
}

const certsCache = new Map<string, { keys: Jwk[]; fetchedAt: number }>();
const CERTS_TTL_MS = 60 * 60 * 1000;

async function getKeys(teamDomain: string, forceRefresh: boolean): Promise<Jwk[]> {
  const cached = certsCache.get(teamDomain);
  if (!forceRefresh && cached && Date.now() - cached.fetchedAt < CERTS_TTL_MS) return cached.keys;
  const res = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error(`certs fetch failed: ${res.status}`);
  const json = (await res.json()) as { keys: Jwk[] };
  certsCache.set(teamDomain, { keys: json.keys, fetchedAt: Date.now() });
  return json.keys;
}

async function findKey(teamDomain: string, kid: string): Promise<Jwk | undefined> {
  const key = (await getKeys(teamDomain, false)).find((k) => k.kid === kid);
  return key ?? (await getKeys(teamDomain, true)).find((k) => k.kid === kid);
}

function b64urlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
  const bin = atob((s + '='.repeat(pad)).replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function decodeJson<T>(segment: string): T {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(segment))) as T;
}

/**
 * Verify a Cloudflare Access JWT assertion and return the identity, or null.
 * Checks the RS256 signature against the team JWKS plus `aud`, `iss`, `exp` and `nbf`.
 */
export async function verifyAccessJwt(
  assertion: string,
  teamDomain: string,
  expectedAud: string,
): Promise<AccessIdentity | null> {
  try {
    const [h, p, s] = assertion.split('.');
    if (!h || !p || !s) return null;
    const header = decodeJson<{ kid?: string; alg?: string }>(h);
    const payload = decodeJson<{ email?: string; aud?: string | string[]; iss?: string; exp?: number; nbf?: number }>(p);

    if (header.alg !== 'RS256' || !header.kid) return null;
    const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!auds.includes(expectedAud)) return null;
    if (payload.iss !== `https://${teamDomain}`) return null;
    const now = Date.now() / 1000;
    if (!payload.exp || payload.exp < now) return null;
    if (payload.nbf && payload.nbf > now + 60) return null;
    if (!payload.email) return null;

    const jwk = await findKey(teamDomain, header.kid);
    if (!jwk) return null;

    const key = await crypto.subtle.importKey(
      'jwk',
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const ok = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      b64urlToBytes(s),
      new TextEncoder().encode(`${h}.${p}`),
    );
    if (!ok) return null;

    const email = payload.email.trim().toLowerCase();
    return { email, editor: isEditorEmail(email) };
  } catch {
    return null;
  }
}

/** Identity for the request, or null when Access is not configured or the assertion is missing or invalid. */
export async function identify(request: Request, env: AccessEnv): Promise<AccessIdentity | null> {
  if (!env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) return null;
  const assertion = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!assertion) return null;
  return verifyAccessJwt(assertion, env.CF_ACCESS_TEAM_DOMAIN, env.CF_ACCESS_AUD);
}
