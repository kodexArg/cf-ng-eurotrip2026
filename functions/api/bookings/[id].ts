interface Env { DB: D1Database; }

const ALLOWED = ['type', 'sort_date', 'time', 'description', 'origin', 'destination', 'mode', 'carrier', 'checkout_date', 'accommodation', 'cost_usd', 'confirmed', 'notes'];

// PATCH: update booking
export const onRequestPatch: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params.id as string;
  const body = await ctx.request.json() as Record<string, unknown>;

  const sets: string[] = [];
  const vals: unknown[] = [];

  for (const [key, val] of Object.entries(body)) {
    if (ALLOWED.includes(key)) {
      sets.push(`${key} = ?`);
      vals.push(val);
    }
  }

  if (!sets.length) return Response.json({ error: 'No valid fields' }, { status: 400 });

  vals.push(id);
  const result = await ctx.env.DB.prepare(
    `UPDATE bookings SET ${sets.join(', ')} WHERE id = ?`
  ).bind(...vals).run();

  if (!result.meta.changes) return Response.json({ error: 'Not found' }, { status: 404 });

  const row = await ctx.env.DB.prepare(
    `SELECT id, type, sort_date AS sortDate, time, description, origin, destination, mode, carrier, checkout_date AS checkoutDate, accommodation, cost_usd AS costUsd, confirmed, notes, created_at AS createdAt FROM bookings WHERE id = ?`
  ).bind(id).first();

  return Response.json({ ...row, confirmed: !!row!.confirmed });
};

// DELETE: remove booking
export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params.id as string;
  const result = await ctx.env.DB.prepare('DELETE FROM bookings WHERE id = ?').bind(id).run();

  if (!result.meta.changes) return Response.json({ error: 'Not found' }, { status: 404 });

  return new Response(null, { status: 204 });
};
