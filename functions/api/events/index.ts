/**
 * /api/events — POST
 *
 * Creates a new trip event.
 * Auth is handled by _middleware.ts (POST requires JWT + owner role).
 *
 * Body (JSON):
 *   type*    : 'hito' | 'traslado' | 'estadia'
 *   title*   : string
 *   date*    : string (YYYY-MM-DD)
 *   cityIn*  : string
 *   + any other events columns in camelCase
 *   + traslado sub-fields: company, fare, vehicleCode, seat, durationMin
 *   + estadia sub-fields: accommodation, address, checkinTime, checkoutTime, bookingRef, platform
 *
 * Returns 201 + the created TripEvent shaped exactly like /api/reservas.
 */

interface Env {
  DB: D1Database;
}

function slugify(title: string, date: string): string {
  const base = title.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const datePart = date.replace(/-/g, '').slice(0, 8);
  return `${base}-${datePart}`;
}

const REFETCH_SQL = `
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
  WHERE e.id = ?
`;

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
  company: string | null;
  fare: string | null;
  vehicleCode: string | null;
  seat: string | null;
  durationMin: number | null;
  accommodation: string | null;
  address: string | null;
  checkinTime: string | null;
  checkoutTime: string | null;
  bookingRef: string | null;
  platform: string | null;
}

function shapeEvent(r: EventRow) {
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
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const body = await ctx.request.json() as Record<string, unknown>;

  // Validate required fields
  const type = body.type as string | undefined;
  const title = body.title as string | undefined;
  const date = body.date as string | undefined;
  const cityIn = body.cityIn as string | undefined;

  if (!type || !['hito', 'traslado', 'estadia'].includes(type)) {
    return Response.json(
      { error: 'type is required and must be hito, traslado, or estadia' },
      { status: 400 }
    );
  }
  if (!title) {
    return Response.json({ error: 'title is required' }, { status: 400 });
  }
  if (!date) {
    return Response.json({ error: 'date is required' }, { status: 400 });
  }
  if (!cityIn) {
    return Response.json({ error: 'cityIn is required' }, { status: 400 });
  }

  // Generate id and slug
  const id = crypto.randomUUID();
  let slug = slugify(title, date);

  // Check slug collision
  const existing = await ctx.env.DB.prepare(
    'SELECT id FROM events WHERE slug = ?'
  ).bind(slug).first<{ id: string }>();

  if (existing) {
    slug = `${slug}-2`;
  }

  // Default values
  const subtype = (body.subtype as string | undefined) ?? type;
  const icon = (body.icon as string | undefined) ?? 'pi pi-calendar';
  const variant = (body.variant as string | undefined) ?? 'both';
  const confirmed = body.confirmed ? 1 : 0;

  // Build INSERT for events
  const insertEvent = ctx.env.DB.prepare(`
    INSERT INTO events (
      id, type, subtype, slug, title, description, date,
      timestamp_in, timestamp_out, city_in, city_out,
      usd, icon, confirmed, variant, card_id, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    type,
    subtype,
    slug,
    title,
    (body.description as string | null) ?? null,
    date,
    (body.timestampIn as string | null) ?? null,
    (body.timestampOut as string | null) ?? null,
    cityIn,
    (body.cityOut as string | null) ?? null,
    (body.usd as number | null) ?? null,
    icon,
    confirmed,
    variant,
    (body.cardId as string | null) ?? null,
    (body.notes as string | null) ?? null,
  );

  const stmts: D1PreparedStatement[] = [insertEvent];

  // Sub-table inserts
  if (type === 'traslado') {
    const insertTraslado = ctx.env.DB.prepare(`
      INSERT INTO events_traslado (event_id, company, fare, vehicle_code, seat, duration_min)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      (body.company as string | null) ?? null,
      (body.fare as string | null) ?? null,
      (body.vehicleCode as string | null) ?? null,
      (body.seat as string | null) ?? null,
      (body.durationMin as number | null) ?? null,
    );
    stmts.push(insertTraslado);
  }

  if (type === 'estadia') {
    const insertEstadia = ctx.env.DB.prepare(`
      INSERT INTO events_estadia (event_id, accommodation, address, checkin_time, checkout_time, booking_ref, platform)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      (body.accommodation as string | null) ?? null,
      (body.address as string | null) ?? null,
      (body.checkinTime as string | null) ?? null,
      (body.checkoutTime as string | null) ?? null,
      (body.bookingRef as string | null) ?? null,
      (body.platform as string | null) ?? null,
    );
    stmts.push(insertEstadia);
  }

  await ctx.env.DB.batch(stmts);

  // Re-fetch the created event
  const row = await ctx.env.DB.prepare(REFETCH_SQL).bind(id).first<EventRow>();

  if (!row) {
    return Response.json({ error: 'Failed to fetch created event' }, { status: 500 });
  }

  return Response.json(shapeEvent(row), { status: 201 });
};
