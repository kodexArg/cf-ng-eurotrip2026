import { parseCookies, verifyJwt } from '../../lib/jwt';

interface Env {
  AUTH_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const cookies = parseCookies(ctx.request.headers.get('Cookie'));
  const token = cookies['site_gate'];
  if (!token) return Response.json({ passed: false });

  const payload = await verifyJwt<{ gate: string }>(token, ctx.env.AUTH_SECRET);
  if (!payload || payload.gate !== 'site') {
    return Response.json({ passed: false });
  }
  return Response.json({ passed: true });
};
