-- migrations/0085_museos_apr23_consolidar.sql
-- Consolidar Reina Sofía + Thyssen en un solo hito "Visita Museos" confirmado.
-- USD: 26.09 + 30.44 = 56.53

INSERT INTO events (
  id, type, subtype, slug, title,
  date, timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, variant,
  notes, lat, lon
) VALUES (
  'ev-mad-apr23-museos',
  'hito', 'museo',
  'mad-museos-20260423',
  'Visita Museos',
  '2026-04-23',
  '2026-04-23T10:00:00+02:00',
  '2026-04-23T18:00:00+02:00',
  'mad',
  56.53,
  'pi-building',
  1, 'both',
  'Reina Sofía 10:00–13:00 (Guernica + colección permanente) · Thyssen 15:00–18:00 (Hammershøi + Rauschenberg)',
  40.4086, -3.6941
);

DELETE FROM events WHERE id = 'ev-mad-apr23-reinasofia';
DELETE FROM events WHERE id = 'ev-mad-apr23-thyssen';
