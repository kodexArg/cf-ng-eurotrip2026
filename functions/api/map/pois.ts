interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { results } = await ctx.env.DB.prepare(
    'SELECT id, name, type, lat, lon, color, city_id AS cityId FROM _legacy_map_pois ORDER BY type DESC, id ASC'
  ).all();
  return Response.json(results);
};
