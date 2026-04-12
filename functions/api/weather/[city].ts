interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const citySlug = ctx.params.city as string;

  const row = await ctx.env.DB.prepare(
    'SELECT lat, lon FROM cities WHERE slug = ?'
  )
    .bind(citySlug)
    .first<{ lat: number; lon: number }>();

  if (!row) {
    return Response.json({ error: 'City not found' }, { status: 404 });
  }

  const meteoUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${row.lat}&longitude=${row.lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code` +
    `&timezone=Europe/Madrid` +
    `&forecast_days=16`;

  let meteoRes: globalThis.Response;
  try {
    meteoRes = await fetch(meteoUrl);
  } catch {
    return Response.json({ error: 'Weather service unavailable' }, { status: 502 });
  }

  if (!meteoRes.ok) {
    return Response.json({ error: 'Weather service error' }, { status: 502 });
  }

  const meteo = await meteoRes.json<{
    daily: {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_probability_max: number[];
      weather_code: number[];
    };
  }>();

  const daily = meteo.daily.time.map((date, i) => ({
    date,
    tempMin: meteo.daily.temperature_2m_min[i],
    tempMax: meteo.daily.temperature_2m_max[i],
    weatherCode: meteo.daily.weather_code[i],
    precipProb: meteo.daily.precipitation_probability_max[i],
  }));

  return Response.json(
    { citySlug, daily },
    { headers: { 'Cache-Control': 'public, max-age=3600' } }
  );
};
