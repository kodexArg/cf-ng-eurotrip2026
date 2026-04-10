-- Seed: transport legs
-- confirmed = 1 → ticket/booking in hand. confirmed = 0 → planned intention.

INSERT INTO transport_legs (id, from_city, to_city, date, mode, label, duration, cost_hint, confirmed) VALUES

  -- ✓ CONFIRMED: vuelo internacional ida (SCL → MAD, Apr 19 06:40)
  ('leg-scl-mad', 'SCL', 'mad', '2026-04-19', 'flight',
   'SCL → MAD — salida 06:40', NULL, NULL, 1),

  -- (*) Madrid → Barcelona, AVE temprano (Apr 24)
  ('leg-mad-bcn', 'mad', 'bcn', '2026-04-24', 'train',
   'AVE Madrid Atocha → Barcelona Sants (temprano)', '~2h 30m', NULL, 0),

  -- (*) Barcelona → París, vuelo (Apr 29)
  ('leg-bcn-par', 'bcn', 'par', '2026-04-29', 'flight',
   'Vuelo Barcelona → París', '~2h', NULL, 0),

  -- (*) París → Venecia, tren vía Milán (May 2)
  ('leg-par-vce', 'par', 'vce', '2026-05-02', 'train',
   'Tren París → Venecia (vía Milán)', '~10h', NULL, 0),

  -- (*) Venecia → Roma, Frecciarossa (May 4)
  ('leg-vce-rom', 'vce', 'rom', '2026-05-04', 'train',
   'Frecciarossa Venezia Santa Lucia → Roma Termini', '~3h 45m', NULL, 0),

  -- ✓ CONFIRMED: vuelo internacional vuelta (FCO → EZE, May 9 23:00 Iberia)
  ('leg-rom-eze', 'rom', 'EZE', '2026-05-09', 'flight',
   'Iberia FCO → EZE — salida 23:00', NULL, NULL, 1);
