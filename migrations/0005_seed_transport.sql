-- Seed: transport legs between cities and day trips
-- Includes both 'main' and 'train' variant legs where they differ

INSERT INTO transport_legs (id, from_city, to_city, date, mode, label, duration, cost_hint, confirmed) VALUES
  -- Vuelo internacional ida (SCL → MAD, Apr 19) — confirmed
  ('leg-scl-mad', 'SCL', 'mad', '2026-04-19', 'flight', 'SCL → MAD — salida 06:40', NULL, NULL, 1),

  -- Toledo excursión desde Madrid (Apr 23)
  ('leg-mad-tol', 'mad', 'mad', '2026-04-23', 'daytrip', 'AVE Madrid → Toledo ida/vuelta (~33 min c/tramo)', '33 min', '~15 pp', 0),

  -- Madrid → Barcelona AVE (Apr 24)
  ('leg-mad-bcn', 'mad', 'bcn', '2026-04-24', 'train', 'AVE Atocha → Sants', '2h 30m', '~28–65 pp', 0),

  -- Barcelona → París vuelo (Apr 30) — main variant
  ('leg-bcn-par-flight', 'bcn', 'par', '2026-04-30', 'flight', 'Vuelo Barcelona → París (~2h)', '2h', NULL, 0),

  -- Barcelona → París TGV (Apr 30) — train variant
  ('leg-bcn-par-tgv', 'bcn', 'par', '2026-04-30', 'train', 'TGV Sants → Gare de Lyon', '6h 30m', '~USD 80–200 (2 pax)', 0),

  -- París → Venecia vía Milán tren (May 1)
  ('leg-par-vce', 'par', 'vce', '2026-05-01', 'train', 'TGV Gare de Lyon → Milano Centrale + Frecciarossa → Venezia Santa Lucia', '~9h 30m total', '~80–150 pp', 0),

  -- Venecia → Roma Frecciarossa (May 3)
  ('leg-vce-rom', 'vce', 'rom', '2026-05-03', 'train', 'Frecciarossa Venezia → Roma Termini', '3h 30m', '~30–60 pp', 0),

  -- Pompeya excursión desde Roma (May 7)
  ('leg-rom-pom', 'rom', 'rom', '2026-05-07', 'daytrip', 'Frecciarossa Roma → Napoli + Circumvesuviana → Pompeya (ida/vuelta)', NULL, '~25–45 pp', 0),

  -- Vuelo internacional retorno (FCO → EZE, May 9) — confirmed
  ('leg-rom-eze', 'rom', 'EZE', '2026-05-09', 'flight', 'Iberia FCO → EZE — salida 23:00', NULL, NULL, 1);
