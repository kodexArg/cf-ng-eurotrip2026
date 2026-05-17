import { accessConfigured, verifyAccessJwt } from '../../lib/access';

interface Env {
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
}

/**
 * Identity for the Bienvenida page under Cloudflare Access.
 * Returns the Google email and whether the user is an allowlisted editor.
 * `accessActive: false` => Access not yet configured (legacy mode).
 */
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  if (!accessConfigured(ctx.env)) {
    return Response.json({ accessActive: false, email: null, editor: false });
  }
  const assertion = ctx.request.headers.get('Cf-Access-Jwt-Assertion');
  const identity = assertion
    ? await verifyAccessJwt(assertion, ctx.env.CF_ACCESS_TEAM_DOMAIN!, ctx.env.CF_ACCESS_AUD!)
    : null;
  if (!identity) {
    return Response.json({ accessActive: true, email: null, editor: false }, { status: 401 });
  }
  return Response.json({ accessActive: true, email: identity.email, editor: identity.editor });
};
