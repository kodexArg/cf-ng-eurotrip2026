interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { results } = await ctx.env.DB.prepare(
    'SELECT id, name, slug, arrival, departure, nights, color, lat, lon FROM cities ORDER BY arrival ASC'
  ).all();
  return Response.json(results);
};
