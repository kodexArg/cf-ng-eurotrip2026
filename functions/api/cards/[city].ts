interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
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
    'SELECT id, city_id, type, title, body, url, created_at FROM cards WHERE city_id = ? ORDER BY created_at ASC'
  )
    .bind(cityRow.id)
    .all();

  return Response.json(results);
};
