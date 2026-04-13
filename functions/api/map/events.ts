interface Env {
  DB: D1Database;
}

interface RawEventRow {
  id: string;
  type: string;
  subtype: string | null;
  title: string;
  description: string | null;
  date: string | null;
  timestampIn: string | null;
  icon: string | null;
  confirmed: number | null;
  usd: number | null;
  notes: string | null;
  cityIn: string | null;
  cityOut: string | null;
  originLat: number | null;
  originLon: number | null;
  destinationLat: number | null;
  destinationLon: number | null;
  waypoints: string | null;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { results } = await ctx.env.DB.prepare(
    `SELECT
       id,
       type,
       subtype,
       title,
       description,
       date,
       timestamp_in AS timestampIn,
       icon,
       confirmed,
       usd,
       notes,
       city_in   AS cityIn,
       city_out  AS cityOut,
       origin_lat      AS originLat,
       origin_lon      AS originLon,
       destination_lat AS destinationLat,
       destination_lon AS destinationLon,
       waypoints
     FROM events
     ORDER BY date, timestamp_in`
  ).all<RawEventRow>();

  const events = results.map(({ waypoints, ...rest }) => ({
    ...rest,
    waypoints: waypoints ? (JSON.parse(waypoints) as [number, number][]) : undefined,
  }));

  return Response.json(events);
};
