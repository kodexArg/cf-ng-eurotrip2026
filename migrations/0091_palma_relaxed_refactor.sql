-- 0091_palma_relaxed_refactor.sql
-- Refactor del segmento Palma de Mallorca (28 abr – 2 may 2026).
--
-- Rationale:
--   El plan anterior (~26 eventos) asumía auto alquilado y base en Peguera,
--   con circuitos en coche por el SW de la isla. Este refactor adopta un
--   enfoque más relajado y de menor presupuesto (~-30%):
--     - Sin auto: transporte público exclusivamente (TIB buses, tren histórico)
--     - Base en Palma ciudad (más cerca del casco histórico)
--     - E-bikes como única actividad "activa" (día Alcúdia, May 1)
--     - Foco en Serra de Tramuntana vía bus + tren icónico Sóller
--     - Eliminadas playas remotas que requerían coche (Es Trenc, Peguera)
--
-- Cambios:
--   1. DELETE todos los eventos PMI Apr 28–May 1, conservando:
--        - ev-leg-pmi-lon  (Ryanair FR28 May 2, confirmed=1, intocable)
--        - ev-stay-auto-pmi (estadia Airbnb/Flor, confirmed=1, intocable)
--   2. También limpia events_traslado huérfanos de los traslados eliminados.
--   3. INSERT nuevo plan lean (~22 eventos entre hitos y traslados):
--        Mié 28: llegada + casco viejo + La Seu + cena La Lonja
--        Jue 29: tren histórico Sóller + tranvía Port de Sóller + regreso
--        Vie 30: bus Tramuntana (Valldemossa → Deià)
--        Sáb 1:  e-bikes Alcúdia (bus 302)
--        Dom 2:  Ryanair FR28 (ya existente, sin tocar)
--
-- USD total insertado: ~$573 pareja (4 días actividades + comidas)
-- Eventos eliminados: ~26 | Eventos insertados: 22

-- ═══════════════════════════════════════════════════════════════════════════════
-- PART 1: DELETE eventos PMI Apr 28–May 1
-- (ev-leg-pmi-lon y ev-stay-auto-pmi quedan intactos)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Primero limpiar events_traslado para los traslados PMI no confirmados
DELETE FROM events_traslado
WHERE event_id IN (
  SELECT id FROM events
  WHERE city_in = 'pmi'
    AND date BETWEEN '2026-04-28' AND '2026-05-01'
    AND id NOT IN ('ev-stay-auto-pmi')
);

-- También limpiar traslados donde city_out = 'pmi' en ese rango
DELETE FROM events_traslado
WHERE event_id IN (
  SELECT id FROM events
  WHERE city_out = 'pmi'
    AND date BETWEEN '2026-04-28' AND '2026-05-01'
    AND id NOT IN ('ev-stay-auto-pmi')
);

-- Eliminar hitos y traslados PMI Apr 28–May 1
DELETE FROM events
WHERE city_in = 'pmi'
  AND date BETWEEN '2026-04-28' AND '2026-05-01'
  AND id NOT IN ('ev-stay-auto-pmi');

-- Eliminar traslados salientes de PMI en ese rango (city_out=pmi, inbound desde pmi)
DELETE FROM events
WHERE city_out = 'pmi'
  AND date BETWEEN '2026-04-28' AND '2026-05-01'
  AND id NOT IN ('ev-stay-auto-pmi', 'ev-leg-pmi-lon');

-- ═══════════════════════════════════════════════════════════════════════════════
-- PART 2: INSERT — Día 1 Mié 28 abr (llegada + casco viejo + La Seu)
-- ═══════════════════════════════════════════════════════════════════════════════

-- 2a. Bus aeropuerto → Palma centro (EMT L1 / Airport Express)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr28-bus-aero',
  'traslado', 'bus',
  'bus-pmi-palma-centro-20260428',
  'Bus EMT L1 · Aeropuerto PMI → Palma centro',
  'EMT línea 1 "Aeroport - Plaça Espanya". Frecuencia 15 min, ~30 min viaje, ~€3 pp (€5.40 pareja). Alternativa: taxi ~€25.',
  '2026-04-28',
  '2026-04-28T11:30:00+02:00',
  '2026-04-28T12:00:00+02:00',
  'pmi', 'pmi',
  10.00, 'colectivo', 0, 1, 'both',
  'Aeropuerto PMI',
  'Palma · Plaça Espanya',
  39.5517, 2.7388,
  39.5729, 2.6490
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr28-bus-aero', 'EMT Palma', '~€3 pp', 'L1', 30);

-- 2b. Almuerzo tapas Palma centro
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr28-almuerzo-tapas',
  'hito', 'food',
  'pmi-almuerzo-tapas-20260428',
  'Almuerzo tapas · Palma centro',
  'Tapas y vino en el casco histórico, zona Plaça Major / Santa Eulàlia. Bodegas Morey o Ca''n Joan de s''Aigo (chocolatería histórica). ~€30 pareja.',
  '2026-04-28',
  '2026-04-28T14:00:00+02:00',
  '2026-04-28T15:15:00+02:00',
  'pmi', 30.00, 'comida', 0, 0, 'both',
  39.5695, 2.6505
);

-- 2c. Paseo casco viejo + Plaça Major (gratis)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr28-casco-viejo',
  'hito', 'visit',
  'pmi-casco-viejo-20260428',
  'Paseo casco viejo · Plaça Major',
  'Callejuelas góticas del centro histórico: Plaça Major, Carrer de Sant Miquel, Plaça de Cort. Gratuito. Arquitectura medieval y modernista mallorquina.',
  '2026-04-28',
  '2026-04-28T16:00:00+02:00',
  '2026-04-28T17:15:00+02:00',
  'pmi', 0.00, 'marcador', 0, 0, 'both',
  39.5698, 2.6506
);

-- 2d. Catedral La Seu (entrada ~€11 pp → ~$24 pareja)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr28-la-seu',
  'hito', 'visit',
  'pmi-catedral-la-seu-20260428',
  'Catedral La Seu · interior',
  'Catedral gótica de Palma sobre el mar Mediterráneo. Interior con obra de Gaudí (baldaquino 1904) y Antoni Planas. Entrada ~€11 pp → ~$24 pareja. Horario lun-vie 10-17:30, sáb 10-14:30.',
  '2026-04-28',
  '2026-04-28T17:30:00+02:00',
  '2026-04-28T18:30:00+02:00',
  'pmi', 24.00, 'iglesia', 0, 0, 'both',
  39.5676, 2.6484
);

-- 2e. Cena La Lonja
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr28-cena-lonja',
  'hito', 'food',
  'pmi-cena-lonja-20260428',
  'Cena barrio La Lonja',
  'Barrio gastronómico de Palma, junto a la lonja gótica s.XV. Opciones: Bar España, La Bodeguita, Taberna de la Boveda. Pescado fresco mallorquín. ~$45 pareja.',
  '2026-04-28',
  '2026-04-28T20:30:00+02:00',
  '2026-04-28T22:00:00+02:00',
  'pmi', 45.00, 'comida', 0, 0, 'both',
  39.5680, 2.6468
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PART 3: INSERT — Día 2 Jue 29 abr (Tren histórico Palma–Sóller)
-- ═══════════════════════════════════════════════════════════════════════════════

-- 3a. Tren histórico Palma → Sóller (ida)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr29-tren-soller-ida',
  'traslado', 'train',
  'tren-historico-palma-soller-20260429',
  'Tren histórico · Palma → Sóller',
  'Ferrocarril de Sóller fundado 1912, vagones de madera originales. Palma (Estació Intermodal) → Sóller, ~1h, tuneles y vistas Serra de Tramuntana. Ida+vuelta ~€28 pp → ~$60 pareja.',
  '2026-04-29',
  '2026-04-29T10:00:00+02:00',
  '2026-04-29T11:05:00+02:00',
  'pmi', 'pmi',
  60.00, 'tren', 0, 1, 'both',
  'Palma · Estació Intermodal',
  'Sóller',
  39.5745, 2.6526,
  39.7685, 2.7163
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr29-tren-soller-ida', 'Ferrocarril de Sóller', '~€14 pp ida', 'FS-01', 65);

-- 3b. Tranvía Sóller → Port de Sóller
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr29-tramvia-port',
  'traslado', 'train',
  'tramvia-soller-port-20260429',
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
VALUES ('ev-pmi-apr29-tramvia-port', 'Tramvia de Sóller', '~€6 pp', 'TS-01', 30);

-- 3c. Almuerzo Port de Sóller
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr29-almuerzo-soller',
  'hito', 'food',
  'pmi-almuerzo-soller-20260429',
  'Almuerzo Puerto de Sóller',
  'Puerto pesquero con vistas a la sierra. Paella/arroz con mariscos en restaurantes del paseo marítimo. ~$54 pareja.',
  '2026-04-29',
  '2026-04-29T13:00:00+02:00',
  '2026-04-29T14:30:00+02:00',
  'pmi', 54.00, 'comida', 0, 0, 'both',
  39.7954, 2.6946
);

-- 3d. Caminata costera / playa Port de Sóller (gratis)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr29-playa-soller',
  'hito', 'leisure',
  'pmi-playa-soller-20260429',
  'Playa y paseo costero · Port de Sóller',
  'Playa pequeña del puerto, aguas tranquilas. Caminata por el faro (Cap Gros) con vistas panorámicas a la bahía. Gratuito.',
  '2026-04-29',
  '2026-04-29T15:00:00+02:00',
  '2026-04-29T17:00:00+02:00',
  'pmi', 0.00, 'parque', 0, 0, 'both',
  39.7988, 2.6921
);

-- 3e. Tren histórico Sóller → Palma (vuelta)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr29-tren-soller-vuelta',
  'traslado', 'train',
  'tren-historico-soller-palma-20260429',
  'Tren histórico · Sóller → Palma',
  'Regreso en el mismo ferrocarril de madera. Último tren de tarde ~17:30. Llegada Palma ~18:35.',
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
VALUES ('ev-pmi-apr29-tren-soller-vuelta', 'Ferrocarril de Sóller', 'incluido en ida+vuelta', 'FS-01', 65);

-- 3f. Cena ligera Palma (noche tren)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr29-cena',
  'hito', 'food',
  'pmi-cena-20260429',
  'Cena ligera · Palma centro',
  'Post-tren, cena relajada cerca del alojamiento. Mercado gastronómico Santa Catalina o pizzería local. ~$32 pareja.',
  '2026-04-29',
  '2026-04-29T21:00:00+02:00',
  '2026-04-29T22:00:00+02:00',
  'pmi', 32.00, 'comida', 0, 0, 'both',
  39.5740, 2.6470
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PART 4: INSERT — Día 3 Vie 30 abr (Bus Tramuntana: Valldemossa → Deià)
-- ═══════════════════════════════════════════════════════════════════════════════

-- 4a. Bus 203 Palma → Valldemossa
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr30-bus-valldemossa',
  'traslado', 'bus',
  'bus-palma-valldemossa-20260430',
  'Bus TIB 203 · Palma → Valldemossa',
  'TIB línea 203 Palma–Valldemossa, salidas desde Intermodal. ~30 min, ~€2 pp → ~$9 pareja. Frecuencia ~1/hora.',
  '2026-04-30',
  '2026-04-30T09:30:00+02:00',
  '2026-04-30T10:00:00+02:00',
  'pmi', 'pmi',
  9.00, 'colectivo', 0, 1, 'both',
  'Palma · Intermodal',
  'Valldemossa',
  39.5745, 2.6526,
  39.7125, 2.6228
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr30-bus-valldemossa', 'TIB (Transport Illes Balears)', '~€2 pp', '203', 30);

-- 4b. Visita Valldemossa + Monasterio Cartuja
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr30-valldemossa',
  'hito', 'visit',
  'pmi-valldemossa-20260430',
  'Valldemossa · pueblo y Real Cartuja',
  'Pueblo medieval Serra de Tramuntana (UNESCO). Real Cartuja donde invernó Chopin 1838-39. Entrada Cartuja ~€10 pp → ~$22 pareja (opcional), paseo calles gratis. Tiendas de ensaimadas y licor de hierbas.',
  '2026-04-30',
  '2026-04-30T10:30:00+02:00',
  '2026-04-30T12:30:00+02:00',
  'pmi', 22.00, 'marcador', 0, 0, 'both',
  39.7125, 2.6228
);

-- 4c. Almuerzo Valldemossa
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr30-almuerzo-valldemossa',
  'hito', 'food',
  'pmi-almuerzo-valldemossa-20260430',
  'Almuerzo · Valldemossa',
  'Cocina mallorquina en el pueblo: sobrasada, pa amb oli, pescado local. Ca''n Pedro o Can Mario. ~$43 pareja.',
  '2026-04-30',
  '2026-04-30T13:00:00+02:00',
  '2026-04-30T14:00:00+02:00',
  'pmi', 43.00, 'comida', 0, 0, 'both',
  39.7130, 2.6225
);

-- 4d. Bus TIB 210 Valldemossa → Deià
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr30-bus-deia',
  'traslado', 'bus',
  'bus-valldemossa-deia-20260430',
  'Bus TIB 210 · Valldemossa → Deià',
  'TIB línea 210 por carretera de montaña, vistas espectaculares. ~25 min, ~€2 pp → ~$5 pareja.',
  '2026-04-30',
  '2026-04-30T15:00:00+02:00',
  '2026-04-30T15:25:00+02:00',
  'pmi', 'pmi',
  5.00, 'colectivo', 0, 1, 'both',
  'Valldemossa',
  'Deià',
  39.7125, 2.6228,
  39.7486, 2.6481
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr30-bus-deia', 'TIB (Transport Illes Balears)', '~€2 pp', '210', 25);

-- 4e. Paseo Deià + mirador (gratis)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr30-deia',
  'hito', 'visit',
  'pmi-deia-20260430',
  'Deià · pueblo artistas + mirador',
  'Pintoresco pueblo de artistas donde vivió Robert Graves. Casas de piedra entre olivos y montañas, cementerio con vista al mar. Mirador sobre el barranco. Gratuito.',
  '2026-04-30',
  '2026-04-30T15:30:00+02:00',
  '2026-04-30T17:30:00+02:00',
  'pmi', 0.00, 'marcador', 0, 0, 'both',
  39.7486, 2.6481
);

-- 4f. Bus regreso Deià → Palma
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-apr30-bus-regreso',
  'traslado', 'bus',
  'bus-deia-palma-20260430',
  'Bus TIB · Deià → Palma',
  'TIB bus de vuelta por la Ma-10 costera o vía Sóller. ~75 min. Confirmar horario en tib.org.',
  '2026-04-30',
  '2026-04-30T18:00:00+02:00',
  '2026-04-30T19:15:00+02:00',
  'pmi', 'pmi',
  5.00, 'colectivo', 0, 1, 'both',
  'Deià',
  'Palma · Intermodal',
  39.7486, 2.6481,
  39.5745, 2.6526
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-apr30-bus-regreso', 'TIB (Transport Illes Balears)', '~€2-3 pp', '210', 75);

-- 4g. Cena Palma (noche Tramuntana)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-apr30-cena',
  'hito', 'food',
  'pmi-cena-20260430',
  'Cena · Palma centro',
  'Restaurante zona Santa Catalina (mercado de pescado reconvertido). Cocina de mercado, mariscos locales. ~$38 pareja.',
  '2026-04-30',
  '2026-04-30T20:30:00+02:00',
  '2026-04-30T22:00:00+02:00',
  'pmi', 38.00, 'comida', 0, 0, 'both',
  39.5740, 2.6430
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PART 5: INSERT — Día 4 Sáb 1 may (E-bikes Alcúdia)
-- ═══════════════════════════════════════════════════════════════════════════════

-- 5a. Bus 302 Palma → Port d'Alcúdia
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-may01-bus-alcudia',
  'traslado', 'bus',
  'bus-palma-alcudia-20260501',
  'Bus TIB 302 · Palma → Port d''Alcúdia',
  'TIB línea 302 Palma–Alcúdia, ~1h 15min, ~€5 pp → ~$11 pareja. Sale desde Intermodal, salidas frecuentes en temporada.',
  '2026-05-01',
  '2026-05-01T09:00:00+02:00',
  '2026-05-01T10:15:00+02:00',
  'pmi', 'pmi',
  11.00, 'colectivo', 0, 1, 'both',
  'Palma · Intermodal',
  'Port d''Alcúdia',
  39.5745, 2.6526,
  39.8532, 3.1280
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-may01-bus-alcudia', 'TIB (Transport Illes Balears)', '~€5 pp', '302', 75);

-- 5b. Alquiler e-bikes Alcúdia
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-may01-ebikes',
  'hito', 'logistics',
  'pmi-ebikes-alcudia-20260501',
  'Alquiler e-bikes · Port d''Alcúdia (día completo)',
  'E-bikes día completo en alquiler Port d''Alcúdia. Opciones: Bike Point Alcúdia, Fun Bikes. ~€35-40 pp → ~$86 pareja. Incluye casco y candado. Ruta plana por la bahía.',
  '2026-05-01',
  '2026-05-01T10:30:00+02:00',
  '2026-05-01T11:00:00+02:00',
  'pmi', 86.00, 'bicicleta', 0, 0, 'both',
  39.8508, 3.1262
);

-- 5c. Loop bahía Alcúdia + S'Albufera (gratis)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-may01-loop-ebike',
  'hito', 'leisure',
  'pmi-loop-ebike-alcudia-20260501',
  'Loop e-bike · Bahía Alcúdia + S''Albufera',
  'Ruta ~30 km por carril bici plano: Port d''Alcúdia → Platja de Muro → Parc Natural S''Albufera (humedal, flamencos, aves migratorias) → Ca''n Picafort → regreso. Gratuito. Panorámica de la bahía más grande de Mallorca.',
  '2026-05-01',
  '2026-05-01T11:00:00+02:00',
  '2026-05-01T14:00:00+02:00',
  'pmi', 0.00, 'parque', 0, 0, 'both',
  39.8508, 3.1262
);

-- 5d. Almuerzo Port d'Alcúdia
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-may01-almuerzo-alcudia',
  'hito', 'food',
  'pmi-almuerzo-alcudia-20260501',
  'Almuerzo · Port d''Alcúdia',
  'Restaurante frente al puerto, mariscos y pasta. Chiringuito o terraza bahía. ~$49 pareja.',
  '2026-05-01',
  '2026-05-01T14:00:00+02:00',
  '2026-05-01T15:00:00+02:00',
  'pmi', 49.00, 'comida', 0, 0, 'both',
  39.8532, 3.1280
);

-- 5e. Bus regreso Alcúdia → Palma
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, mandatory, variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon
) VALUES (
  'ev-pmi-may01-bus-regreso',
  'traslado', 'bus',
  'bus-alcudia-palma-20260501',
  'Bus TIB 302 · Port d''Alcúdia → Palma',
  'TIB 302 de vuelta. ~1h 15min. Salida ~17:00 para llegar a Palma ~18:15.',
  '2026-05-01',
  '2026-05-01T17:00:00+02:00',
  '2026-05-01T18:15:00+02:00',
  'pmi', 'pmi',
  11.00, 'colectivo', 0, 1, 'both',
  'Port d''Alcúdia',
  'Palma · Intermodal',
  39.8532, 3.1280,
  39.5745, 2.6526
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-pmi-may01-bus-regreso', 'TIB (Transport Illes Balears)', '~€5 pp', '302', 75);

-- 5f. Cena última noche Palma
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, mandatory, variant,
  origin_lat, origin_lon
) VALUES (
  'ev-pmi-may01-cena-final',
  'hito', 'food',
  'pmi-cena-final-20260501',
  'Cena · Última noche en Palma',
  'Cena de cierre en Palma. Zona Passeig del Born o Santa Catalina. Algo especial: Ca''n Eduardo (frente al mar, arroces) o Cellar Sa Premsa (bodega centenaria). ~$38 pareja.',
  '2026-05-01',
  '2026-05-01T20:30:00+02:00',
  '2026-05-01T22:00:00+02:00',
  'pmi', 38.00, 'comida', 0, 0, 'both',
  39.5701, 2.6490
);
