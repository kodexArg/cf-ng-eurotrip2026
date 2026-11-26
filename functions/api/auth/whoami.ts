import type { AccessIdentity } from '../../lib/access';

/** Google email of the current visitor and whether it may edit. Auth is enforced by `_middleware.ts`. */
export const onRequestGet: PagesFunction = (ctx) => {
  const identity = (ctx.data as { identity?: AccessIdentity }).identity;
  if (!identity) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  return Response.json({ email: identity.email, editor: identity.editor });
};
