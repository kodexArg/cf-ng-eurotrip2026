interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const citySlug = ctx.params['city'] as string;

  const cityRow = await ctx.env.DB.prepare(
    'SELECT id FROM cities WHERE slug = ?'
  )
    .bind(citySlug)
    .first<{ id: string }>();

  if (!cityRow) {
    return Response.json({ error: 'City not found' }, { status: 404 });
  }

  const { results } = await ctx.env.DB.prepare(
    'SELECT id, city_id AS cityId, type, title, body, url, created_at AS createdAt FROM cards WHERE city_id = ? ORDER BY created_at ASC'
  )
    .bind(cityRow.id)
    .all();

  return Response.json(results);
};

export const onRequestPatch: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params['city'] as string;
  const body = await ctx.request.json() as Record<string, unknown>;

  const ALLOWED = ['title', 'body', 'url'];
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
    `UPDATE cards SET ${sets.join(', ')} WHERE id = ?`
  ).bind(...vals).run();

  if (!result.meta.changes) return Response.json({ error: 'Not found' }, { status: 404 });

  const row = await ctx.env.DB.prepare(
    'SELECT * FROM cards WHERE id = ?'
  ).bind(id).first();

  return Response.json(row);
};
