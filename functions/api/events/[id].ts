/**
 * /api/events/:id — PATCH + DELETE
 *
 * PATCH: Updates an existing event. Supports partial updates (dynamic SET clause).
 * DELETE: Removes event + sub-table rows (no FK cascade, explicit deletes).
 *
 * Auth is handled by _middleware.ts (PATCH/DELETE require JWT + owner role).
 */

interface Env {
  DB: D1Database;
}

const REFETCH_SQL = `
  SELECT
    e.id, e.type, e.subtype, e.slug, e.title, e.description,
    e.date,
    e.timestamp_in  AS timestampIn,
    e.timestamp_out AS timestampOut,
    e.city_in       AS cityIn,
    e.city_out      AS cityOut,
    e.usd, e.icon, e.confirmed, e.done, e.variant,
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
  done: number | boolean;
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
    done: !!r.done,
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

// camelCase body key → snake_case column name for the events table
const FIELDS_MAP: Record<string, string> = {
  title: 'title',
  description: 'description',
  date: 'date',
  timestampIn: 'timestamp_in',
  timestampOut: 'timestamp_out',
  cityIn: 'city_in',
  cityOut: 'city_out',
  usd: 'usd',
  icon: 'icon',
  confirmed: 'confirmed',
  done: 'done',
  variant: 'variant',
  notes: 'notes',
  subtype: 'subtype',
};

// camelCase body key → snake_case column for events_traslado
const TRASLADO_MAP: Record<string, string> = {
  company: 'company',
  fare: 'fare',
  vehicleCode: 'vehicle_code',
  seat: 'seat',
  durationMin: 'duration_min',
};

// camelCase body key → snake_case column for events_estadia
const ESTADIA_MAP: Record<string, string> = {
  accommodation: 'accommodation',
  address: 'address',
  checkinTime: 'checkin_time',
  checkoutTime: 'checkout_time',
  bookingRef: 'booking_ref',
  platform: 'platform',
};

export const onRequestPatch: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params['id'] as string;
  const body = await ctx.request.json() as Record<string, unknown>;

  // Verify event exists
  const existing = await ctx.env.DB.prepare(
    'SELECT id, type FROM events WHERE id = ?'
  ).bind(id).first<{ id: string; type: string }>();

  if (!existing) {
    return Response.json({ error: 'Event not found' }, { status: 404 });
  }

  const stmts: D1PreparedStatement[] = [];

  // Build dynamic SET clause for events table
  const eventSets: string[] = [];
  const eventVals: unknown[] = [];

  for (const [key, col] of Object.entries(FIELDS_MAP)) {
    if (key in body) {
      eventSets.push(`${col} = ?`);
      // Coerce confirmed/done boolean → integer
      if (key === 'confirmed' || key === 'done') {
        eventVals.push(body[key] ? 1 : 0);
      } else {
        eventVals.push(body[key]);
      }
    }
  }

  if (eventSets.length > 0) {
    eventVals.push(id);
    stmts.push(
      ctx.env.DB.prepare(
        `UPDATE events SET ${eventSets.join(', ')} WHERE id = ?`
      ).bind(...eventVals)
    );
  }

  // Build dynamic UPDATE for events_traslado if any traslado fields present
  const trasladoSets: string[] = [];
  const trasladoVals: unknown[] = [];

  for (const [key, col] of Object.entries(TRASLADO_MAP)) {
    if (key in body) {
      trasladoSets.push(`${col} = ?`);
      trasladoVals.push(body[key]);
    }
  }

  if (trasladoSets.length > 0) {
    trasladoVals.push(id);
    stmts.push(
      ctx.env.DB.prepare(
        `UPDATE events_traslado SET ${trasladoSets.join(', ')} WHERE event_id = ?`
      ).bind(...trasladoVals)
    );
  }

  // Build dynamic UPDATE for events_estadia if any estadia fields present
  const estadiaSets: string[] = [];
  const estadiaVals: unknown[] = [];

  for (const [key, col] of Object.entries(ESTADIA_MAP)) {
    if (key in body) {
      estadiaSets.push(`${col} = ?`);
      estadiaVals.push(body[key]);
    }
  }

  if (estadiaSets.length > 0) {
    estadiaVals.push(id);
    stmts.push(
      ctx.env.DB.prepare(
        `UPDATE events_estadia SET ${estadiaSets.join(', ')} WHERE event_id = ?`
      ).bind(...estadiaVals)
    );
  }

  if (stmts.length === 0) {
    return Response.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  await ctx.env.DB.batch(stmts);

  // Re-fetch the updated event
  const row = await ctx.env.DB.prepare(REFETCH_SQL).bind(id).first<EventRow>();

  if (!row) {
    return Response.json({ error: 'Failed to fetch updated event' }, { status: 500 });
  }

  return Response.json(shapeEvent(row), { status: 200 });
};

export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params['id'] as string;

  // Verify event exists
  const existing = await ctx.env.DB.prepare(
    'SELECT id FROM events WHERE id = ?'
  ).bind(id).first<{ id: string }>();

  if (!existing) {
    return Response.json({ error: 'Event not found' }, { status: 404 });
  }

  // Delete sub-table rows first (no FK cascade), then the event itself
  await ctx.env.DB.batch([
    ctx.env.DB.prepare('DELETE FROM events_traslado WHERE event_id = ?').bind(id),
    ctx.env.DB.prepare('DELETE FROM events_estadia WHERE event_id = ?').bind(id),
    ctx.env.DB.prepare('DELETE FROM events WHERE id = ?').bind(id),
  ]);

  return Response.json({ success: true }, { status: 200 });
};
