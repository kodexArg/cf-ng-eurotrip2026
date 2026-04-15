-- 0060: Rectificar datos de 3 Airbnbs confirmados (Madrid, Barcelona, Peguera)

-- ============================================================
-- 1. MADRID: Lavapies fantastic location (Lola)
-- ============================================================
UPDATE events SET
  title            = 'Lavapies fantastic location · Madrid',
  timestamp_in     = '2026-04-20T16:00:00',
  notes            = 'Airbnb Madrid · Anfitrión: Lola · C. del Ave María 42, Lavapiés · check-in después de las 16:00'
WHERE id = 'ev-stay-bk-madrid-airbnb';

UPDATE events_estadia SET
  accommodation    = 'Lavapies fantastic location',
  address          = 'C. del Ave María 42, Lavapiés, Madrid',
  checkin_time     = '16:00',
  checkout_time    = '11:00'
WHERE event_id = 'ev-stay-bk-madrid-airbnb';

-- ============================================================
-- 2. BARCELONA: Ndlr 2-4 · Poble Sec (Magui Alonso)
-- ============================================================
UPDATE events SET
  timestamp_out    = '2026-04-28T11:00:00',
  notes            = 'Airbnb Barcelona · Anfitrión: Magui Alonso ES-FLATS · Poble Sec - Paralelo · check-in después de las 15:00'
WHERE id = 'ev-stay-bk-bcn-airbnb';

UPDATE events_estadia SET
  accommodation    = 'Ndlr 2-4 · Authentic flat in Poble Sec - Paralelo',
  address          = 'Poble Sec, Barcelona',
  checkin_time     = '15:00',
  checkout_time    = '11:00'
WHERE event_id = 'ev-stay-bk-bcn-airbnb';

-- ============================================================
-- 3. PEGUERA: FLOR Apartamento (Flor Hotels)
-- ============================================================
UPDATE events SET
  timestamp_in     = '2026-04-28T14:00:00'
WHERE id = 'ev-stay-auto-pmi';

UPDATE events_estadia SET
  checkin_time     = '14:00'
WHERE event_id = 'ev-stay-auto-pmi';
