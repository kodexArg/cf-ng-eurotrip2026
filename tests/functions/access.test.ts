import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { authorize, requiresEditor, verifyAccessJwt } from '../../functions/lib/access';
import { onRequest } from '../../functions/_middleware';

const TEAM = 'kodexarg.cloudflareaccess.com';
const AUD = 'test-aud';
const KID = 'test-kid';

let privateKey: CryptoKey;
let foreignKey: CryptoKey;
let publicJwk: JsonWebKey;

function b64url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64url');
}

async function sign(payload: Record<string, unknown>, key = privateKey, header: Record<string, unknown> = { alg: 'RS256', kid: KID }): Promise<string> {
  const h = b64url(new TextEncoder().encode(JSON.stringify(header)));
  const p = b64url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${h}.${p}`));
  return `${h}.${p}.${b64url(new Uint8Array(sig))}`;
}

function claims(email: string, extra: Record<string, unknown> = {}): Record<string, unknown> {
  const now = Math.floor(Date.now() / 1000);
  return { email, aud: [AUD], iss: `https://${TEAM}`, iat: now, nbf: now, exp: now + 600, ...extra };
}

async function genKey(): Promise<CryptoKeyPair> {
  return (await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify'],
  )) as CryptoKeyPair;
}

beforeAll(async () => {
  const pair = await genKey();
  privateKey = pair.privateKey;
  publicJwk = await crypto.subtle.exportKey('jwk', pair.publicKey);
  foreignKey = (await genKey()).privateKey;
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    expect(url).toBe(`https://${TEAM}/cdn-cgi/access/certs`);
    return Response.json({ keys: [{ ...publicJwk, kid: KID }] });
  }));
});

afterEach(() => vi.clearAllMocks());

describe('verifyAccessJwt', () => {
  it('accepts a valid assertion and marks allowlisted editors', async () => {
    expect(await verifyAccessJwt(await sign(claims('GCavedal@gmail.com')), TEAM, AUD)).toEqual({ email: 'gcavedal@gmail.com', editor: true });
    expect(await verifyAccessJwt(await sign(claims('vanybou@gmail.com')), TEAM, AUD)).toEqual({ email: 'vanybou@gmail.com', editor: true });
    expect(await verifyAccessJwt(await sign(claims('someone@gmail.com')), TEAM, AUD)).toEqual({ email: 'someone@gmail.com', editor: false });
  });

  it('rejects forged, foreign, expired and mis-addressed assertions', async () => {
    const now = Math.floor(Date.now() / 1000);
    const valid = await sign(claims('someone@gmail.com'));
    const [h, , s] = valid.split('.');
    const tampered = `${h}.${b64url(new TextEncoder().encode(JSON.stringify(claims('gcavedal@gmail.com'))))}.${s}`;
    const cases = [
      'not-a-jwt',
      tampered,
      await sign(claims('gcavedal@gmail.com'), foreignKey),
      await sign(claims('gcavedal@gmail.com', { exp: now - 1 })),
      await sign(claims('gcavedal@gmail.com', { nbf: now + 3600 })),
      await sign(claims('gcavedal@gmail.com', { aud: ['other-app'] })),
      await sign(claims('gcavedal@gmail.com', { iss: 'https://evil.cloudflareaccess.com' })),
      await sign(claims('gcavedal@gmail.com', { email: undefined })),
      await sign(claims('gcavedal@gmail.com'), privateKey, { alg: 'HS256', kid: KID }),
      await sign(claims('gcavedal@gmail.com'), privateKey, { alg: 'RS256', kid: 'unknown' }),
    ];
    for (const token of cases) expect(await verifyAccessJwt(token, TEAM, AUD)).toBeNull();
  });
});

describe('authorize', () => {
  const viewer = { email: 'someone@gmail.com', editor: false };
  const editor = { email: 'vanybou@gmail.com', editor: true };

  it('requires an identity for everything', () => {
    expect(authorize('GET', '/', null)).toBe('unauthenticated');
    expect(authorize('GET', '/api/itinerary', null)).toBe('unauthenticated');
  });

  it('lets any Google identity read the trip', () => {
    for (const path of ['/', '/calendario', '/api/itinerary', '/api/photos', '/api/auth/whoami', '/media/mad/x.jpg']) {
      expect(authorize('GET', path, viewer)).toBe('allow');
    }
  });

  it('reserves mutations and private reads for editors', () => {
    const privateOps: [string, string][] = [
      ['POST', '/api/photos'],
      ['POST', '/api/events'],
      ['PATCH', '/api/events/x'],
      ['DELETE', '/api/events/x'],
      ['PATCH', '/api/cards/x'],
      ['PUT', '/api/anything'],
      ['GET', '/api/access-log'],
      ['GET', '/api/access-log/'],
    ];
    for (const [method, path] of privateOps) {
      expect(requiresEditor(method, path)).toBe(true);
      expect(authorize(method, path, viewer)).toBe('forbidden');
      expect(authorize(method, path, editor)).toBe('allow');
    }
  });
});

describe('middleware', () => {
  const env = {
    CF_ACCESS_TEAM_DOMAIN: TEAM,
    CF_ACCESS_AUD: AUD,
    DB: { prepare: () => ({ bind: () => ({ run: async () => undefined }) }) },
  };

  async function call(method: string, path: string, assertion?: string, envOverride: Record<string, unknown> = env) {
    const headers = new Headers({ Accept: 'application/json' });
    if (assertion) headers.set('Cf-Access-Jwt-Assertion', assertion);
    const data: Record<string, unknown> = {};
    const next = vi.fn(async () => new Response('ok'));
    const ctx = {
      request: new Request(`https://eurotrip2026.kodexarg.com${path}`, { method, headers }),
      env: envOverride,
      data,
      next,
      waitUntil: () => undefined,
    };
    const res = await (onRequest as unknown as (c: typeof ctx) => Promise<Response>)(ctx);
    return { status: res.status, next, data };
  }

  it('returns 401 without or with a forged assertion and never reaches the handler', async () => {
    for (const assertion of [undefined, 'forged.jwt.value', await sign(claims('gcavedal@gmail.com'), foreignKey)]) {
      for (const [method, path] of [['GET', '/'], ['GET', '/api/itinerary'], ['POST', '/api/photos'], ['GET', '/api/access-log']]) {
        const r = await call(method, path, assertion);
        expect(r.status).toBe(401);
        expect(r.next).not.toHaveBeenCalled();
      }
    }
  });

  it('fails closed when Access is not configured', async () => {
    const r = await call('GET', '/api/itinerary', await sign(claims('gcavedal@gmail.com')), { DB: env.DB });
    expect(r.status).toBe(401);
  });

  it('returns 403 to a non-allowlisted Google identity on private endpoints', async () => {
    const token = await sign(claims('someone@gmail.com'));
    for (const [method, path] of [['POST', '/api/photos'], ['PATCH', '/api/cards/x'], ['DELETE', '/api/events/x'], ['GET', '/api/access-log']]) {
      const r = await call(method, path, token);
      expect(r.status).toBe(403);
      expect(r.next).not.toHaveBeenCalled();
    }
    const read = await call('GET', '/api/itinerary', token);
    expect(read.status).toBe(200);
    expect(read.data['identity']).toEqual({ email: 'someone@gmail.com', editor: false });
  });

  it('lets an allowlisted editor through private endpoints', async () => {
    const token = await sign(claims('vanybou@gmail.com'));
    for (const [method, path] of [['POST', '/api/photos'], ['GET', '/api/access-log']]) {
      const r = await call(method, path, token);
      expect(r.status).toBe(200);
      expect(r.next).toHaveBeenCalledOnce();
    }
  });
});
