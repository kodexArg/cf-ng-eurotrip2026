-- 0093_palma_weather_optimized.sql
-- Weather-driven re-optimization of Palma de Mallorca segment (Apr 28 – May 1, 2026).
--
-- WHY THIS MIGRATION EXISTS:
--   0091 + 0092 were committed/applied but had three structural problems:
--     1. Alcúdia e-bikes day (May 1) placed base in Peguera 90 km from Alcúdia →
--        3h bus each way (TIB 102 + TIB 302) = wasted day.
--     2. Three different Palma days all starting with Peguera↔Palma 45-min bus legs
--        = redundant bus costs (~$9 x 6 extra legs from 0092).
--     3. Day 1 (Apr 28) tried to rush to Palma casco viejo right after landing;
--        better to stay local and recover from the flight.
--
-- WEATHER FORECAST (locked in):
--   Apr 28, 29, 30: DRY (5-6% rain, 21-22°C) → outdoor activities viable
--   May 1:          WET (55% rain, 4 mm, 19°C) → indoor-first required
--   May 2:          flight 06:00
--
-- NEW PLAN (this migration):
--   Apr 28 — Llegada local: Peguera afternoon + Port d'Andratx evening (recovery day)
--   Apr 29 — Tren histórico Sóller: Palma → Sóller → Port de Sóller → regreso
--   Apr 30 — Palma día completo: Catedral La Seu + Almudaina + casco viejo + Es Baluard
--   May 1  — Valldemossa/Deià indoor: Real Cartuja Chopin + pueblo Deià (si tiempo)
--   May 2  — Taxi 04:00 + Ryanair FR28 06:00 (unchanged)
--
-- PRESERVED (do not touch):
--   ev-stay-auto-pmi   — Airbnb Peguera (confirmed=1)
--   ev-leg-pmi-lon     — Ryanair FR28 May 2 (confirmed=1)
--
-- ESTIMATED SAVINGS vs 0091+0092:
--   Drops Alcúdia e-bikes: -$86 (bikes) -$22 (buses)
--   Drops 3 duplicate Palma city days → consolidates to 1: -$182 (redundant legs + meals)
--   Net saving: ~$290 pareja
--
-- USD total inserted by this migration: ~$535 pareja (4 days + May 2 taxi)
-- Events deleted: all PMI Apr 28–May 1 (except preserved above)
-- Events inserted: 30 (activities + transport legs)

-- ═══════════════════════════════════════════════════════════════════════════════
-- STEP 1: DELETE — clean all PMI events Apr 28–May 1 (except preserved)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Clean events_traslado first (FK children)
DELETE FROM events_traslado
WHERE event_id IN (
  SELECT id FROM events
  WHERE (city_in = 'pmi' OR city_out = 'pmi')
    AND date BETWEEN '2026-04-28' AND '2026-05-02'
    AND id NOT IN ('ev-stay-auto-pmi', 'ev-leg-pmi-lon')
);

-- Delete events (range extended a May 2 para limpiar taxi de 0092 y permitir re-inserción v3)
DELETE FROM events
WHERE (city_in = 'pmi' OR city_out = 'pmi')
  AND date BETWEEN '2026-04-28' AND '2026-05-02'
  AND id NOT IN ('ev-stay-auto-pmi', 'ev-leg-pmi-lon');

-- ═══════════════════════════════════════════════════════════════════════════════
-- STEP 2: INSERT — Apr 28 (Mar, DRY — llegada, día local Peguera)
--
-- Strategy: land at PMI 10:00, bus to Peguera, rest, afternoon beach,
--           evening bus to Port d'Andratx for a stroll, cena local.
--           No Palma rush on arrival day.
-- ═══════════════════════════════════════════════════════════════════════════════

-- Apr 28 · 1: Bus TIB 107/A11 Aeropuerto PMI → Peguera
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr28-bus-aero-peguera-v3',
  'traslado', 'bus',
  'bus-pmi-aero-peguera-v3-20260428',
  'Bus TIB 107/A11 · Aeropuerto PMI → Peguera',
  'TIB línea 107 / A11 directo desde Aeropuerto PMI hasta Peguera. ~1h de trayecto, ~€5 pp → ~$11 pareja. Salida desde parada exterior de llegadas. Confirmar horario en tib.org.',
  '2026-04-28',
  '2026-04-28T11:30:00+02:00',
  '2026-04-28T12:30:00+02:00',
  'pmi', 'pmi',
  11.00, 'colectivo', 0, 1, 'both',
  'Aeropuerto PMI',
  'Peguera',
  39.5517, 2.7388,
  39.5330, 2.4535
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr28-bus-aero-peguera-v3', 'TIB (Transport Illes Balears)', '~€5 pp', '107', 60);

-- Apr 28 · 2: Almuerzo Peguera local
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr28-almuerzo-peguera-v3',
  'hito', 'food',
  'pmi-almuerzo-peguera-v3-20260428',
  'Almuerzo · Peguera local',
  'Primer almuerzo en la isla después de aterrizar. Restaurantes locales en Peguera: pa amb oli, tapas, mariscos frescos. Zona Passeig de la Mar. ~$30 pareja.',
  '2026-04-28',
  '2026-04-28T14:30:00+02:00',
  '2026-04-28T15:45:00+02:00',
  'pmi', 30.00, 'comida', 0, 0, 'both',
  39.5330, 2.4535
);

-- Apr 28 · 3: Playa Palmira Peguera (gratis)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr28-playa-palmira-v3',
  'hito', 'leisure',
  'pmi-playa-palmira-v3-20260428',
  'Playa Palmira · Peguera',
  'Playa tranquila a pasos del alojamiento. Arena blanca, aguas cristalinas. Tarde de recuperación post-vuelo. Gratuito.',
  '2026-04-28',
  '2026-04-28T16:30:00+02:00',
  '2026-04-28T18:30:00+02:00',
  'pmi', 0.00, 'parque', 0, 0, 'both',
  39.5325, 2.4530
);

-- Apr 28 · 4: Bus 102 Peguera → Port d'Andratx
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr28-bus-port-andratx-v3',
  'traslado', 'bus',
  'bus-peguera-port-andratx-v3-20260428',
  'Bus TIB 102 · Peguera → Port d''Andratx',
  'TIB 102 hacia Port d''Andratx, ~15 min, ~€2 pp → ~$4 pareja. Alternativa: caminata costera ~30 min si el tiempo lo permite.',
  '2026-04-28',
  '2026-04-28T19:00:00+02:00',
  '2026-04-28T19:15:00+02:00',
  'pmi', 'pmi',
  4.00, 'colectivo', 0, 0, 'both',
  'Peguera',
  'Port d''Andratx',
  39.5330, 2.4535,
  39.5472, 2.3867
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr28-bus-port-andratx-v3', 'TIB (Transport Illes Balears)', '~€2 pp', '102', 15);

-- Apr 28 · 5: Paseo Port d'Andratx (gratis)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr28-paseo-andratx-v3',
  'hito', 'visit',
  'pmi-paseo-port-andratx-v3-20260428',
  'Paseo · Port d''Andratx',
  'Puerto pesquero pintoresco del SW de Mallorca. Veleros, casas blancas, atardecer sobre el mar. Paseo marítimo, bares de pescadores. Gratuito.',
  '2026-04-28',
  '2026-04-28T19:30:00+02:00',
  '2026-04-28T20:45:00+02:00',
  'pmi', 0.00, 'marcador', 0, 0, 'both',
  39.5472, 2.3867
);

-- Apr 28 · 6: Cena Peguera
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr28-cena-peguera-v3',
  'hito', 'food',
  'pmi-cena-peguera-v3-20260428',
  'Cena · Peguera',
  'Cena relajada en Peguera. Cocina mediterránea local, pescado del día. Zona Carrer de Roses o paseo marítimo. ~$35 pareja.',
  '2026-04-28',
  '2026-04-28T21:15:00+02:00',
  '2026-04-28T22:30:00+02:00',
  'pmi', 35.00, 'comida', 0, 0, 'both',
  39.5330, 2.4535
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- STEP 3: INSERT — Apr 29 (Mié, DRY — Tren histórico Sóller)
--
-- Strategy: bus Peguera→Palma early, tren Sóller (iconic), tranvía Port de Sóller,
--           almuerzo frente al mar, caminata Cap Gros, regreso tren, cena Peguera.
-- ═══════════════════════════════════════════════════════════════════════════════

-- Apr 29 · 1: Bus TIB 102 Peguera → Palma Intermodal
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr29-bus-peguera-palma-v3',
  'traslado', 'bus',
  'bus-peguera-palma-v3-20260429',
  'Bus TIB 102 · Peguera → Palma Intermodal',
  'TIB 102. Salida 08:30 desde Peguera, llegada ~09:15 Palma Intermodal. Necesario para tomar tren histórico Sóller 10:10.',
  '2026-04-29',
  '2026-04-29T08:30:00+02:00',
  '2026-04-29T09:15:00+02:00',
  'pmi', 'pmi',
  4.00, 'colectivo', 0, 1, 'both',
  'Peguera',
  'Palma · Intermodal',
  39.5330, 2.4535,
  39.5745, 2.6526
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr29-bus-peguera-palma-v3', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- Apr 29 · 2: Tren histórico Palma → Sóller (ida)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr29-tren-soller-ida-v3',
  'traslado', 'train',
  'tren-historico-palma-soller-v3-20260429',
  'Tren histórico · Palma → Sóller',
  'Ferrocarril de Sóller fundado 1912, vagones de madera originales. Palma (Estació Intermodal) → Sóller, ~1h, tuneles y vistas Serra de Tramuntana. Ida+vuelta ~€28 pp → ~$60 pareja.',
  '2026-04-29',
  '2026-04-29T10:10:00+02:00',
  '2026-04-29T11:15:00+02:00',
  'pmi', 'pmi',
  60.00, 'tren', 0, 1, 'both',
  'Palma · Estació Intermodal',
  'Sóller',
  39.5745, 2.6526,
  39.7685, 2.7163
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr29-tren-soller-ida-v3', 'Ferrocarril de Sóller', '~€14 pp ida (ida+vuelta €28)', 'FS-01', 65);

-- Apr 29 · 3: Tranvía Sóller → Port de Sóller
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr29-tramvia-port-v3',
  'traslado', 'train',
  'tramvia-soller-port-v3-20260429',
  'Tranvía · Sóller → Port de Sóller',
  'Tranvía histórico 1913, ~4 km por naranjos hasta el puerto mediterráneo. ~€6 pp ida → ~$13 pareja.',
  '2026-04-29',
  '2026-04-29T11:30:00+02:00',
  '2026-04-29T12:00:00+02:00',
  'pmi', 'pmi',
  13.00, 'tren', 0, 1, 'both',
  'Sóller · Plaza',
  'Port de Sóller',
  39.7685, 2.7163,
  39.7954, 2.6946
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr29-tramvia-port-v3', 'Tramvia de Sóller', '~€6 pp', 'TS-01', 30);

-- Apr 29 · 4: Almuerzo Port de Sóller
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr29-almuerzo-soller-v3',
  'hito', 'food',
  'pmi-almuerzo-soller-v3-20260429',
  'Almuerzo · Port de Sóller',
  'Puerto pesquero con vistas a la Serra de Tramuntana. Paella/arroz con mariscos en restaurantes del paseo marítimo. ~$50 pareja.',
  '2026-04-29',
  '2026-04-29T13:00:00+02:00',
  '2026-04-29T14:30:00+02:00',
  'pmi', 50.00, 'comida', 0, 0, 'both',
  39.7954, 2.6946
);

-- Apr 29 · 5: Caminata costera + faro Cap Gros (gratis)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr29-cap-gros-v3',
  'hito', 'leisure',
  'pmi-cap-gros-v3-20260429',
  'Caminata costera + Faro Cap Gros · Port de Sóller',
  'Ruta a pie por el litoral norte del puerto hasta el faro de Cap Gros. Vistas panorámicas a la bahía de Sóller y la Sierra. ~2h ida y vuelta, sendero fácil. Gratuito.',
  '2026-04-29',
  '2026-04-29T15:00:00+02:00',
  '2026-04-29T17:00:00+02:00',
  'pmi', 0.00, 'parque', 0, 0, 'both',
  39.7988, 2.6921
);

-- Apr 29 · 6: Tren histórico Sóller → Palma (vuelta, incluido en ida)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr29-tren-soller-vuelta-v3',
  'traslado', 'train',
  'tren-historico-soller-palma-v3-20260429',
  'Tren histórico · Sóller → Palma (incluido)',
  'Regreso en el mismo ferrocarril de madera. Incluido en el billete ida+vuelta. Último tren de tarde ~17:30. Llegada Palma ~18:35.',
  '2026-04-29',
  '2026-04-29T17:30:00+02:00',
  '2026-04-29T18:35:00+02:00',
  'pmi', 'pmi',
  0.00, 'tren', 0, 1, 'both',
  'Sóller',
  'Palma · Estació Intermodal',
  39.7685, 2.7163,
  39.5745, 2.6526
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr29-tren-soller-vuelta-v3', 'Ferrocarril de Sóller', 'incluido en ida+vuelta', 'FS-01', 65);

-- Apr 29 · 7: Bus TIB 102 Palma → Peguera (regreso)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr29-bus-palma-peguera-v3',
  'traslado', 'bus',
  'bus-palma-peguera-v3-20260429',
  'Bus TIB 102 · Palma → Peguera (regreso)',
  'TIB 102 regreso al alojamiento en Peguera. ~45 min. Salida desde Intermodal ~19:15. Verificar último bus en tib.org.',
  '2026-04-29',
  '2026-04-29T19:15:00+02:00',
  '2026-04-29T20:00:00+02:00',
  'pmi', 'pmi',
  4.00, 'colectivo', 0, 1, 'both',
  'Palma · Intermodal',
  'Peguera',
  39.5745, 2.6526,
  39.5330, 2.4535
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr29-bus-palma-peguera-v3', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- Apr 29 · 8: Cena ligera Peguera
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr29-cena-peguera-v3',
  'hito', 'food',
  'pmi-cena-peguera-v3-20260429',
  'Cena ligera · Peguera',
  'Post-tren y tranvía, cena relajada cerca del alojamiento en Peguera. Pizzería local o bar de tapas. ~$25 pareja.',
  '2026-04-29',
  '2026-04-29T21:00:00+02:00',
  '2026-04-29T22:00:00+02:00',
  'pmi', 25.00, 'comida', 0, 0, 'both',
  39.5330, 2.4535
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- STEP 4: INSERT — Apr 30 (Jue, DRY — Palma día completo)
--
-- Strategy: full day in Palma — Catedral La Seu, Palacio Real de la Almudaina,
--           Mercat de l'Olivar, casco viejo, Es Baluard, cena La Lonja,
--           last bus back to Peguera.
-- ═══════════════════════════════════════════════════════════════════════════════

-- Apr 30 · 1: Bus TIB 102 Peguera → Palma Intermodal
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr30-bus-peguera-palma-v3',
  'traslado', 'bus',
  'bus-peguera-palma-v3-20260430',
  'Bus TIB 102 · Peguera → Palma Intermodal',
  'TIB 102. Salida 09:30 desde Peguera, llegada ~10:15 Palma Intermodal. Día completo en Palma.',
  '2026-04-30',
  '2026-04-30T09:30:00+02:00',
  '2026-04-30T10:15:00+02:00',
  'pmi', 'pmi',
  4.00, 'colectivo', 0, 1, 'both',
  'Peguera',
  'Palma · Intermodal',
  39.5330, 2.4535,
  39.5745, 2.6526
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr30-bus-peguera-palma-v3', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- Apr 30 · 2: Catedral La Seu + interior Gaudí
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr30-catedral-seu-v3',
  'hito', 'visit',
  'pmi-catedral-seu-v3-20260430',
  'Catedral La Seu · interior Gaudí',
  'Catedral gótica sobre el mar Mediterráneo. Interior con obra de Gaudí (baldaquino 1904) y Antoni Planas. Entrada ~€11 pp → ~$24 pareja. Horario: lun-vie 10:00-17:30, sáb 10:00-14:30.',
  '2026-04-30',
  '2026-04-30T10:30:00+02:00',
  '2026-04-30T12:00:00+02:00',
  'pmi', 24.00, 'iglesia', 0, 0, 'both',
  39.5676, 2.6484
);

-- Apr 30 · 3: Palacio Real de la Almudaina
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr30-almudaina-v3',
  'hito', 'visit',
  'pmi-almudaina-v3-20260430',
  'Palacio Real de la Almudaina',
  'Residencia oficial de los Reyes de España en Mallorca. Arquitectura árabe-gótica, tapices flamencos, vistas al puerto. Entrada ~€10 pp → ~$22 pareja. Junto a La Seu.',
  '2026-04-30',
  '2026-04-30T12:15:00+02:00',
  '2026-04-30T13:15:00+02:00',
  'pmi', 22.00, 'marcador', 0, 0, 'both',
  39.5672, 2.6478
);

-- Apr 30 · 4: Almuerzo Mercat de l'Olivar
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr30-almuerzo-olivar-v3',
  'hito', 'food',
  'pmi-almuerzo-olivar-v3-20260430',
  'Almuerzo · Mercat de l''Olivar',
  'Mercado cubierto de Palma con puestos de comida lista. Mariscos, embutidos locales, quesos mallorquines. ~$25 pareja.',
  '2026-04-30',
  '2026-04-30T13:30:00+02:00',
  '2026-04-30T14:45:00+02:00',
  'pmi', 25.00, 'comida', 0, 0, 'both',
  39.5718, 2.6509
);

-- Apr 30 · 5: Casco viejo — Passeig del Born + Plaça Cort + barrio Santa Creu (gratis)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr30-casco-viejo-v3',
  'hito', 'visit',
  'pmi-casco-viejo-v3-20260430',
  'Casco viejo · Passeig del Born + Plaça Cort + Santa Creu',
  'Paseo por el corazón histórico de Palma: Passeig del Born (boulevard principal), Plaça de Cort (con el olivo milenario), callejuelas del barrio Santa Creu. Arquitectura gótica y modernista mallorquina. Gratuito.',
  '2026-04-30',
  '2026-04-30T15:15:00+02:00',
  '2026-04-30T17:30:00+02:00',
  'pmi', 0.00, 'marcador', 0, 0, 'both',
  39.5698, 2.6506
);

-- Apr 30 · 6: Es Baluard museo arte moderno
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr30-es-baluard-v3',
  'hito', 'visit',
  'pmi-es-baluard-v3-20260430',
  'Es Baluard · Museo Arte Moderno y Contemporáneo',
  'Museo de arte moderno integrado en las murallas del s.XVI. Colección permanente: Miró, Picasso, artistas mallorquines. Terraza con vistas al mar. Entrada ~€7 pp → ~$15 pareja. Opcional si cansados: saltar y pasear el Born.',
  '2026-04-30',
  '2026-04-30T18:00:00+02:00',
  '2026-04-30T19:00:00+02:00',
  'pmi', 15.00, 'museo', 0, 0, 'both',
  39.5693, 2.6437
);

-- Apr 30 · 7: Cena La Lonja
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr30-cena-lonja-v3',
  'hito', 'food',
  'pmi-cena-lonja-v3-20260430',
  'Cena · Barrio La Lonja',
  'Barrio gastronómico de Palma junto a la lonja gótica s.XV. Opciones: Bar España, La Bodeguita, Taberna de la Boveda. Pescado fresco mallorquín. ~$45 pareja.',
  '2026-04-30',
  '2026-04-30T20:30:00+02:00',
  '2026-04-30T22:00:00+02:00',
  'pmi', 45.00, 'comida', 0, 0, 'both',
  39.5680, 2.6468
);

-- Apr 30 · 8: Bus TIB 102 Palma → Peguera (último bus)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr30-bus-palma-peguera-v3',
  'traslado', 'bus',
  'bus-palma-peguera-v3-20260430',
  'Bus TIB 102 · Palma → Peguera (último bus)',
  'TIB 102 regreso nocturno al alojamiento en Peguera. ~45 min. Verificar horario último bus en tib.org — puede ser ~22:30 o 23:00. Si no llega, taxi ~€25.',
  '2026-04-30',
  '2026-04-30T22:30:00+02:00',
  '2026-04-30T23:15:00+02:00',
  'pmi', 'pmi',
  4.00, 'colectivo', 0, 1, 'both',
  'Palma · Intermodal',
  'Peguera',
  39.5745, 2.6526,
  39.5330, 2.4535
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr30-bus-palma-peguera-v3', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- ═══════════════════════════════════════════════════════════════════════════════
-- STEP 5: INSERT — May 1 (Vie, WET — Valldemossa/Deià día indoor)
--
-- Weather: 55% rain, 4 mm, 19°C — plan centers on Real Cartuja (indoor).
-- Deià optional: skip if heavy rain, return directly Palma→Peguera.
-- ═══════════════════════════════════════════════════════════════════════════════

-- May 1 · 1: Bus TIB 102 Peguera → Palma Intermodal
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-may01-bus-peguera-palma-v3',
  'traslado', 'bus',
  'bus-peguera-palma-v3-20260501',
  'Bus TIB 102 · Peguera → Palma Intermodal',
  'TIB 102. Salida 09:00 desde Peguera, llegada ~09:45 Palma Intermodal. Necesario para tomar TIB 203 a Valldemossa 10:00.',
  '2026-05-01',
  '2026-05-01T09:00:00+02:00',
  '2026-05-01T09:45:00+02:00',
  'pmi', 'pmi',
  4.00, 'colectivo', 0, 1, 'both',
  'Peguera',
  'Palma · Intermodal',
  39.5330, 2.4535,
  39.5745, 2.6526
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-may01-bus-peguera-palma-v3', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- May 1 · 2: Bus TIB 203 Palma → Valldemossa
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-may01-bus-valldemossa-v3',
  'traslado', 'bus',
  'bus-palma-valldemossa-v3-20260501',
  'Bus TIB 203 · Palma → Valldemossa',
  'TIB línea 203 Palma–Valldemossa, salidas desde Intermodal. ~30 min, ~€2.50 pp → ~$5 pareja. Frecuencia ~1/hora.',
  '2026-05-01',
  '2026-05-01T10:00:00+02:00',
  '2026-05-01T10:30:00+02:00',
  'pmi', 'pmi',
  5.00, 'colectivo', 0, 1, 'both',
  'Palma · Intermodal',
  'Valldemossa',
  39.5745, 2.6526,
  39.7125, 2.6228
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-may01-bus-valldemossa-v3', 'TIB (Transport Illes Balears)', '~€2.50 pp', '203', 30);

-- May 1 · 3: Real Cartuja de Valldemossa (Museo Chopin, indoor — clave día lluvia)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-may01-cartuja-v3',
  'hito', 'visit',
  'pmi-cartuja-valldemossa-v3-20260501',
  'Real Cartuja de Valldemossa · Museo Chopin',
  'Monasterio donde Frédéric Chopin y George Sand invernaron 1838-39. Celdas originales, piano de Chopin, manuscritos. 100% indoor: ideal para el día de lluvia (55% prob., 4mm). Entrada ~€10 pp → ~$22 pareja. Pueblo medieval de la Serra de Tramuntana (UNESCO) a su alrededor.',
  '2026-05-01',
  '2026-05-01T10:45:00+02:00',
  '2026-05-01T13:00:00+02:00',
  'pmi', 22.00, 'iglesia', 0, 0, 'both',
  39.7125, 2.6228
);

-- May 1 · 4: Almuerzo Valldemossa
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-may01-almuerzo-valldemossa-v3',
  'hito', 'food',
  'pmi-almuerzo-valldemossa-v3-20260501',
  'Almuerzo · Valldemossa',
  'Cocina mallorquina en el pueblo: sobrasada, pa amb oli, cochinillo. Ca''n Pedro o Can Mario. ~$40 pareja.',
  '2026-05-01',
  '2026-05-01T13:15:00+02:00',
  '2026-05-01T14:30:00+02:00',
  'pmi', 40.00, 'comida', 0, 0, 'both',
  39.7130, 2.6225
);

-- May 1 · 5: Bus TIB 210 Valldemossa → Deià (opcional si llueve fuerte)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-may01-bus-deia-v3',
  'traslado', 'bus',
  'bus-valldemossa-deia-v3-20260501',
  'Bus TIB 210 · Valldemossa → Deià',
  'TIB línea 210 por carretera de montaña, vistas espectaculares. ~25 min, ~€2.50 pp → ~$5 pareja. OPCIONAL: si llueve fuerte, regresar directo Valldemossa → Palma en lugar de continuar a Deià.',
  '2026-05-01',
  '2026-05-01T15:00:00+02:00',
  '2026-05-01T15:25:00+02:00',
  'pmi', 'pmi',
  5.00, 'colectivo', 0, 0, 'both',
  'Valldemossa',
  'Deià',
  39.7125, 2.6228,
  39.7486, 2.6481
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-may01-bus-deia-v3', 'TIB (Transport Illes Balears)', '~€2.50 pp', '210', 25);

-- May 1 · 6: Paseo Deià (si tiempo lo permite, gratis)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-may01-paseo-deia-v3',
  'hito', 'visit',
  'pmi-paseo-deia-v3-20260501',
  'Paseo · Deià (si tiempo lo permite)',
  'Pintoresco pueblo de artistas donde vivió Robert Graves. Casas de piedra entre olivos y montañas. Si llueve fuerte, omitir y regresar directo desde Valldemossa. Gratuito.',
  '2026-05-01',
  '2026-05-01T15:30:00+02:00',
  '2026-05-01T16:30:00+02:00',
  'pmi', 0.00, 'marcador', 0, 0, 'both',
  39.7486, 2.6481
);

-- May 1 · 7: Bus TIB regreso Deià → Palma
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-may01-bus-regreso-palma-v3',
  'traslado', 'bus',
  'bus-deia-palma-v3-20260501',
  'Bus TIB · Deià → Palma',
  'TIB bus de vuelta por la Ma-10 costera o vía Sóller. ~75 min. Confirmar horario en tib.org. Si se saltó Deià, tomar desde Valldemossa ~16:30.',
  '2026-05-01',
  '2026-05-01T17:00:00+02:00',
  '2026-05-01T18:15:00+02:00',
  'pmi', 'pmi',
  5.00, 'colectivo', 0, 1, 'both',
  'Deià',
  'Palma · Intermodal',
  39.7486, 2.6481,
  39.5745, 2.6526
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-may01-bus-regreso-palma-v3', 'TIB (Transport Illes Balears)', '~€2.50-3 pp', '210', 75);

-- May 1 · 8: Bus TIB 102 Palma → Peguera (regreso)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-may01-bus-palma-peguera-v3',
  'traslado', 'bus',
  'bus-palma-peguera-v3-20260501',
  'Bus TIB 102 · Palma → Peguera (regreso)',
  'TIB 102 regreso al alojamiento en Peguera. ~45 min. Última noche antes de vuelo. Verificar horario nocturno en tib.org.',
  '2026-05-01',
  '2026-05-01T18:45:00+02:00',
  '2026-05-01T19:30:00+02:00',
  'pmi', 'pmi',
  4.00, 'colectivo', 0, 1, 'both',
  'Palma · Intermodal',
  'Peguera',
  39.5745, 2.6526,
  39.5330, 2.4535
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-may01-bus-palma-peguera-v3', 'TIB (Transport Illes Balears)', '~€4 pp', '102', 45);

-- May 1 · 9: Cena ligera Peguera (última noche)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-may01-cena-peguera-v3',
  'hito', 'food',
  'pmi-cena-peguera-v3-20260501',
  'Cena ligera · Peguera (última noche)',
  'Cena tranquila antes de la madrugada del vuelo. Algo simple y cercano al alojamiento: pizza local, bocadillo, supermercado. IMPORTANTE: Reservar taxi para las 04:00. ~$25 pareja.',
  '2026-05-01',
  '2026-05-01T20:30:00+02:00',
  '2026-05-01T21:45:00+02:00',
  'pmi', 25.00, 'comida', 0, 0, 'both',
  39.5330, 2.4535
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- STEP 6: INSERT — May 2 (Sáb, salida)
--
-- Taxi Peguera → PMI airport 04:00. Buses TIB no operan a esta hora.
-- ev-leg-pmi-lon (Ryanair FR28 06:00) preserved, not touched.
-- ═══════════════════════════════════════════════════════════════════════════════

-- May 2 · 1: Taxi Peguera → Aeropuerto PMI (madrugada)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-may02-taxi-peguera-aero-v3',
  'traslado', 'taxi',
  'taxi-peguera-pmi-aero-v3-20260502',
  'Taxi · Peguera → Aeropuerto PMI (madrugada)',
  'Taxi madrugada para vuelo Ryanair FR28 06:00. Estar en aeropuerto ~04:00 (check-in cierra ~04:45). ~35 min trayecto, ~€40-50 → ~$50 pareja. Reservar taxi la noche anterior. Los buses TIB no operan a esta hora.',
  '2026-05-02',
  '2026-05-02T04:00:00+02:00',
  '2026-05-02T04:30:00+02:00',
  'pmi', 'pmi',
  50.00, 'colectivo', 0, 1, 'both',
  'Peguera · Alojamiento',
  'Aeropuerto PMI',
  39.5330, 2.4535,
  39.5517, 2.7388
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-may02-taxi-peguera-aero-v3', 'Taxi Peguera (reservar noche anterior)', '~€40-50', 'TAXI', 30);
