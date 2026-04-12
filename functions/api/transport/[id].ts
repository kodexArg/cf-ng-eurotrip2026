interface Env {
  DB: D1Database;
}

const FIELD_MAP: Record<string, string> = {
  label: 'label',
  duration: 'duration',
  cost_hint: 'cost_hint',
  costHint: 'cost_hint',
  confirmed: 'confirmed',
  fare: 'fare',
  company: 'company',
  departure_time: 'departure_time',
  departureTime: 'departure_time',
  arrival_time: 'arrival_time',
  arrivalTime: 'arrival_time',
};

export const onRequestPatch: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params.id as string;
  const body = await ctx.request.json() as Record<string, unknown>;

  const sets: string[] = [];
  const vals: unknown[] = [];

  for (const [key, val] of Object.entries(body)) {
    const col = FIELD_MAP[key];
    if (col) {
      sets.push(`${col} = ?`);
      vals.push(val);
    }
  }

  if (!sets.length) return Response.json({ error: 'No valid fields' }, { status: 400 });

  vals.push(id);
  const result = await ctx.env.DB.prepare(
    `UPDATE transport_legs SET ${sets.join(', ')} WHERE id = ?`
  ).bind(...vals).run();

  if (!result.meta.changes) return Response.json({ error: 'Not found' }, { status: 404 });

  const row = await ctx.env.DB.prepare(
    'SELECT * FROM transport_legs WHERE id = ?'
  ).bind(id).first();

  return Response.json(row);
};
