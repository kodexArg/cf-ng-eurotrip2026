/**
 * /api/reservas
 *
 * Returns a flat global list of all trip events (no city/day filter),
 * ordered by date ASC, timestamp_in ASC, id ASC.
 *
 * Shape: { events: TripEvent[] }
 *
 * Events are fetched from the unified `events` table + its two optional
 * sub-tables (events_traslado, events_estadia). The sub-table columns are
 * returned flat; the client is expected to branch on `type` and read only
 * the relevant fields. Null sub-table fields are stripped for the wrong
 * type so the payload stays tidy.
 */

interface Env {
  DB: D1Database;
}

interface CityRow {
  id: string;
  name: string;
  slug: string;
  arrival: string;
  departure: string;
  nights: number;
  color: string;
  lat: number;
  lon: number;
}

interface EventRow {
  id: string;
  type: 'hito' | 'traslado' | 'estadia';
  subtype: string;
  slug: string;
  title: string;
  description: string | null;
  date: string;
  timestampIn: string;
  timestampOut: string | null;
  cityIn: string;
  cityOut: string | null;
  usd: number | null;
  icon: string;
  confirmed: number | boolean;
  variant: string;
  cardId: string | null;
  notes: string | null;
  originLat: number | null;
  originLon: number | null;
  destinationLat: number | null;
  destinationLon: number | null;
  originLabel: string | null;
  destinationLabel: string | null;

  // events_traslado (nullable via LEFT JOIN)
  company: string | null;
  fare: string | null;
  vehicleCode: string | null;
  seat: string | null;
  durationMin: number | null;

  // events_estadia (nullable via LEFT JOIN)
  accommodation: string | null;
  address: string | null;
  checkinTime: string | null;
  checkoutTime: string | null;
  bookingRef: string | null;
  platform: string | null;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  if (ctx.request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const [citiesResult, eventsResult] = await Promise.all([
    ctx.env.DB.prepare(
      'SELECT id, name, slug, arrival, departure, nights, color, lat, lon FROM cities ORDER BY arrival ASC'
    ).all<CityRow>(),
    ctx.env.DB.prepare(`
      SELECT
        e.id, e.type, e.subtype, e.slug, e.title, e.description,
        e.date,
        e.timestamp_in  AS timestampIn,
        e.timestamp_out AS timestampOut,
        e.city_in       AS cityIn,
        e.city_out      AS cityOut,
        e.usd, e.icon, e.confirmed, e.variant,
        e.card_id       AS cardId,
        e.notes,
        e.origin_lat       AS originLat,
        e.origin_lon       AS originLon,
        e.destination_lat  AS destinationLat,
        e.destination_lon  AS destinationLon,
        e.origin_label     AS originLabel,
        e.destination_label AS destinationLabel,
        t.company, t.fare,
        t.vehicle_code  AS vehicleCode,
        t.seat,
        t.duration_min  AS durationMin,
        s.accommodation, s.address,
        s.checkin_time  AS checkinTime,
        s.checkout_time AS checkoutTime,
        s.booking_ref   AS bookingRef,
        s.platform
      FROM events e
      LEFT JOIN events_traslado t ON t.event_id = e.id
      LEFT JOIN events_estadia  s ON s.event_id = e.id
      ORDER BY e.date ASC, e.timestamp_in ASC, e.id ASC
    `).all<EventRow>(),
  ]);

  const events = eventsResult.results.map((r) => {
    const base = {
      id: r.id,
      type: r.type,
      subtype: r.subtype,
      slug: r.slug,
      title: r.title,
      description: r.description,
      date: r.date,
      timestampIn: r.timestampIn,
      timestampOut: r.timestampOut,
      cityIn: r.cityIn,
      cityOut: r.cityOut,
      usd: r.usd,
      icon: r.icon,
      confirmed: !!r.confirmed,
      variant: r.variant,
      cardId: r.cardId,
      notes: r.notes,
      originLat: r.originLat ?? undefined,
      originLon: r.originLon ?? undefined,
      destinationLat: r.destinationLat ?? undefined,
      destinationLon: r.destinationLon ?? undefined,
      originLabel: r.originLabel ?? undefined,
      destinationLabel: r.destinationLabel ?? undefined,
    };

    if (r.type === 'traslado') {
      return {
        ...base,
        company: r.company,
        fare: r.fare,
        vehicleCode: r.vehicleCode,
        seat: r.seat,
        durationMin: r.durationMin,
      };
    }

    if (r.type === 'estadia') {
      return {
        ...base,
        accommodation: r.accommodation ?? '',
        address: r.address,
        checkinTime: r.checkinTime,
        checkoutTime: r.checkoutTime,
        bookingRef: r.bookingRef,
        platform: r.platform,
      };
    }

    return base;
  });

  return Response.json({ cities: citiesResult.results, events });
};
