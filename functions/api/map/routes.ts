interface Env {
  DB: D1Database;
}

interface RouteRow {
  sku: string;
  fromPoi: string;
  toPoi: string;
  mode: string;
  waypoints: string;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { results } = await ctx.env.DB.prepare(
    'SELECT sku, from_poi AS fromPoi, to_poi AS toPoi, mode, waypoints FROM map_routes ORDER BY sku'
  ).all<RouteRow>();

  const parsed = results.map((r) => ({
    sku: r.sku,
    fromPoi: r.fromPoi,
    toPoi: r.toPoi,
    mode: r.mode,
    waypoints: JSON.parse(r.waypoints) as [number, number][],
  }));

  return Response.json(parsed);
};
