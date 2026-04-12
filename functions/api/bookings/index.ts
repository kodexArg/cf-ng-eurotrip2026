interface Env { DB: D1Database; }

// GET: return all bookings ordered chronologically
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { results } = await ctx.env.DB.prepare(`
    SELECT id, type, sort_date AS sortDate, time, description,
           origin, destination, mode, carrier,
           checkout_date AS checkoutDate, accommodation,
           cost_usd AS costUsd, confirmed, notes, created_at AS createdAt
    FROM bookings
    ORDER BY sort_date ASC, time ASC
  `).all();

  return Response.json(results.map(r => ({ ...r, confirmed: !!r.confirmed })));
};

// POST: create new booking
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const body = await ctx.request.json() as Record<string, unknown>;

  if (!body.type || !body.sort_date || !body.description) {
    return Response.json({ error: 'type, sort_date, description required' }, { status: 400 });
  }

  const id = 'bk-' + crypto.randomUUID().slice(0, 8);

  const cols = ['id', 'type', 'sort_date', 'time', 'description', 'origin', 'destination', 'mode', 'carrier', 'checkout_date', 'accommodation', 'cost_usd', 'confirmed', 'notes'];
  const vals: unknown[] = [id];
  const placeholders = ['?'];

  for (const col of cols.slice(1)) {
    placeholders.push('?');
    vals.push(body[col] ?? null);
  }

  await ctx.env.DB.prepare(
    `INSERT INTO bookings (${cols.join(', ')}) VALUES (${placeholders.join(', ')})`
  ).bind(...vals).run();

  const row = await ctx.env.DB.prepare(
    `SELECT id, type, sort_date AS sortDate, time, description, origin, destination, mode, carrier, checkout_date AS checkoutDate, accommodation, cost_usd AS costUsd, confirmed, notes, created_at AS createdAt FROM bookings WHERE id = ?`
  ).bind(id).first();

  return Response.json({ ...row, confirmed: !!row!.confirmed }, { status: 201 });
};
