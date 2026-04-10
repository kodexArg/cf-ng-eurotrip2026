interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { results } = await ctx.env.DB.prepare(
    'SELECT id, city_id, r2_key, caption, date_taken, uploader_note, created_at FROM photos ORDER BY date_taken ASC'
  ).all();
  return Response.json(results);
};
