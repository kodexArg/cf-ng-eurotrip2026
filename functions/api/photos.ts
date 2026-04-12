interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { results } = await ctx.env.DB.prepare(
    'SELECT id, city_id AS cityId, r2_key AS r2Key, caption, date_taken AS dateTaken, uploader_note AS uploaderNote, created_at AS createdAt FROM photos ORDER BY date_taken ASC'
  ).all();
  return Response.json(results);
};
