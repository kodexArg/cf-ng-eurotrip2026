-- Migration 0024: Add structured departure_time / arrival_time to transport_legs
-- Times were previously embedded in the label field; now stored as dedicated columns.

ALTER TABLE transport_legs ADD COLUMN departure_time TEXT;
ALTER TABLE transport_legs ADD COLUMN arrival_time   TEXT;

-- ── Populate times from existing label data ───────────────────────────────────

-- leg-scl-mad: "SCL → MAD — salida 06:40"
UPDATE transport_legs SET
  departure_time = '06:40',
  label          = 'SCL → MAD'
WHERE id = 'leg-scl-mad';

-- leg-fco-mad: "IB0656 FCO T1 → MAD — salida 20:25, llegada 23:00"
UPDATE transport_legs SET
  departure_time = '20:25',
  arrival_time   = '23:00',
  label          = 'IB0656 FCO T1 → MAD'
WHERE id = 'leg-fco-mad';

-- leg-mad-eze: "IB0105 MAD → EZE TIA — salida 08:45, llegada 16:25"
UPDATE transport_legs SET
  departure_time = '08:45',
  arrival_time   = '16:25',
  label          = 'IB0105 MAD → EZE TIA'
WHERE id = 'leg-mad-eze';

UPDATE transport_legs SET
  departure_time = '06:28',
  arrival_time   = '~17:40',
  label          = 'Frecciarossa Paris → Milan → Florencia'
WHERE id = 'leg-par-fir';

UPDATE transport_legs SET
  departure_time = '~09:00',
  arrival_time   = '10:35',
  label          = 'Frecciarossa Florencia SMN → Roma Termini'
WHERE id = 'leg-fir-rom';
