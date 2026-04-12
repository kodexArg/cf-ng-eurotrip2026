interface Env {
  DB: D1Database;
}

export const onRequestPatch: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params.id as string;
  const body = await ctx.request.json() as Record<string, unknown>;

  const ALLOWED = ['description', 'time_slot', 'cost_hint', 'confirmed', 'tipo', 'tag', 'fare', 'company'];
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
    `UPDATE activities SET ${sets.join(', ')} WHERE id = ?`
  ).bind(...vals).run();

  if (!result.meta.changes) return Response.json({ error: 'Not found' }, { status: 404 });

  const row = await ctx.env.DB.prepare(
    'SELECT * FROM activities WHERE id = ?'
  ).bind(id).first();

  return Response.json(row);
};
