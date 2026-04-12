interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { results } = await ctx.env.DB.prepare(
    `SELECT
       id,
       type,
       subtype,
       title,
       date,
       icon,
       confirmed,
       city_in   AS cityIn,
       city_out  AS cityOut,
       origin_lat      AS originLat,
       origin_lon      AS originLon,
       destination_lat AS destinationLat,
       destination_lon AS destinationLon
     FROM events
     ORDER BY date, timestamp_in`
  ).all();
  return Response.json(results);
};
