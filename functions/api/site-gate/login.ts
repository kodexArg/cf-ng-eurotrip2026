import { signJwt, timingSafeEqual } from '../../lib/jwt';

interface Env {
  AUTH_SECRET: string;
  SITE_GATE_PASSWORD: string;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: { password?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { password } = body;
  if (!password || typeof password !== 'string') {
    return Response.json({ error: 'password required' }, { status: 400 });
  }

  const expected = ctx.env.SITE_GATE_PASSWORD ?? '';
  const ok = await timingSafeEqual(password, expected);
  if (!ok) {
    return Response.json({ passed: false }, { status: 401 });
  }

  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
  const token = await signJwt({ gate: 'site', exp }, ctx.env.AUTH_SECRET);
  const cookie = `site_gate=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * 365}`;

  return Response.json({ passed: true }, { headers: { 'Set-Cookie': cookie } });
};
