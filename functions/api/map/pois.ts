interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { results } = await ctx.env.DB.prepare(
    `SELECT id, name, 'city' AS type, lat, lon, color, id AS cityId
     FROM cities
     ORDER BY id`
  ).all();
  return Response.json(results);
};
