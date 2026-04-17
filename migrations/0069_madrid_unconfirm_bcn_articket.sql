-- 0069_madrid_unconfirm_bcn_articket.sql
-- Política confirmed=1 SOLO eventos con erogación real.
-- PARTE A: revert Madrid Apr 20-23 a confirmed=0 (estadías quedan).
-- PARTE B: cleanup legacy Barcelona Apr 24-27 confirmed=0 (Park Güell/Sagrada/Airbnb quedan).
-- PARTE C: INSERT plan Barcelona Apr 24-27 (Articket 6 museos) — todos confirmed=0, variant='both', city_in='bcn'.

-- ─────────────────────────────────────────────────────────────────────
-- PARTE A — Madrid unconfirm
-- ─────────────────────────────────────────────────────────────────────

UPDATE events
SET confirmed = 0
WHERE date BETWEEN '2026-04-20' AND '2026-04-23'
  AND type != 'estadia';

-- ─────────────────────────────────────────────────────────────────────
-- PARTE B — Barcelona cleanup legacy no-confirmado
-- ─────────────────────────────────────────────────────────────────────

DELETE FROM events
WHERE city_in = 'bcn'
  AND date BETWEEN '2026-04-24' AND '2026-04-27'
  AND confirmed = 0
  AND type != 'estadia';

-- ─────────────────────────────────────────────────────────────────────
-- PARTE C — Barcelona plan Apr 24-27 (Articket 6 museos)
-- ─────────────────────────────────────────────────────────────────────

-- ════════════════════════════════════════════════════════════════════
-- VIE 24 ABR
-- ════════════════════════════════════════════════════════════════════

-- 1. Metro Sants → Paral·lel (L3)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr24-metro-sants-paralel',
  'traslado', 'metro',
  'bcn-metro-sants-paralel-20260424',
  'Metro Sants → Paral·lel (L3)',
  'Desde Barcelona Sants (llegada AVE 12:06) al barrio Poble Sec. 15 min.',
  '2026-04-24',
  '2026-04-24T12:30:00+02:00', '2026-04-24T12:45:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.3791, 2.1406, 'Estació Sants',
  41.3746, 2.1645, 'Metro Paral·lel'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr24-metro-sants-paralel', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L3', 15);

-- 2. Walking Paral·lel → Airbnb Poble Sec
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr24-walk-paralel-airbnb',
  'traslado', 'walking',
  'bcn-walk-paralel-airbnb-20260424',
  'A pie · Paral·lel → Airbnb Poble Sec',
  'Caminata 800 m, ~20 min.',
  '2026-04-24',
  '2026-04-24T12:45:00+02:00', '2026-04-24T13:05:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.3746, 2.1645, 'Metro Paral·lel',
  41.3736, 2.1640, 'Airbnb Poble Sec'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr24-walk-paralel-airbnb', NULL, '0', 'walking', 20);

-- 3. Almuerzo Poble Sec
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr24-lunch-poblesec',
  'hito', 'food',
  'bcn-lunch-poblesec-20260424',
  'Almuerzo Poble Sec (Carrer Blai o Margarit)',
  'Barrio de tapas baratas, pintxos €1-2 c/u.',
  '2026-04-24',
  '2026-04-24T13:30:00+02:00', '2026-04-24T14:45:00+02:00',
  'bcn',
  32.61, 'pi pi-shop', 0, 'both',
  41.3736, 2.1640
);

-- 4. Metro Paral·lel → Passeig de Gràcia (L3)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr24-metro-poblesec-graciapg',
  'traslado', 'metro',
  'bcn-metro-paralel-graciapg-20260424',
  'Metro Paral·lel → Passeig de Gràcia (L3)',
  'L3 directa ~20 min.',
  '2026-04-24',
  '2026-04-24T15:30:00+02:00', '2026-04-24T15:50:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.3746, 2.1645, 'Metro Paral·lel',
  41.3917, 2.1649, 'Metro Passeig de Gràcia'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr24-metro-poblesec-graciapg', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L3', 20);

-- 5. Fundació Antoni Tàpies (Articket 1/6)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr24-tapies',
  'hito', 'museo',
  'bcn-tapies-20260424',
  'Fundació Antoni Tàpies (Articket 1/6)',
  'Vanguardia catalana Tàpies. 45 min-1.5h. Articket €38 pp × 2 = €76 total, cubre 6 museos.',
  '2026-04-24',
  '2026-04-24T16:00:00+02:00', '2026-04-24T17:30:00+02:00',
  'bcn',
  82.60, 'pi pi-image', 0, 'both',
  41.3915, 2.1628
);

-- 6. Walking Tàpies → Barri Gòtic
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr24-walk-tapies-gotic',
  'traslado', 'walking',
  'bcn-walk-tapies-gotic-20260424',
  'A pie · Tàpies → Barri Gòtic',
  '2.5 km por Passeig Gràcia (pasan exterior Casa Milà + Casa Batlló).',
  '2026-04-24',
  '2026-04-24T17:30:00+02:00', '2026-04-24T18:15:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.3915, 2.1628, 'Fundació Tàpies',
  41.3833, 2.1764, 'Catedral BCN'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr24-walk-tapies-gotic', NULL, '0', 'walking', 45);

-- 7. Paseo Barri Gòtic
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr24-gotic-paseo',
  'hito', 'visit',
  'bcn-gotic-paseo-20260424',
  'Paseo Barri Gòtic · Catedral exterior + Plaça Reial',
  'Corazón medieval de Barcelona. Gratuito.',
  '2026-04-24',
  '2026-04-24T18:15:00+02:00', '2026-04-24T19:30:00+02:00',
  'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.3836, 2.1769
);

-- 8. Walking Gòtic → El Born
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr24-walk-gotic-born',
  'traslado', 'walking',
  'bcn-walk-gotic-born-20260424',
  'A pie · Barri Gòtic → El Born',
  'Cruce rápido hacia Santa María del Mar.',
  '2026-04-24',
  '2026-04-24T19:30:00+02:00', '2026-04-24T19:45:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.3805, 2.1755, 'Plaça Reial',
  41.3838, 2.1820, 'Santa María del Mar'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr24-walk-gotic-born', NULL, '0', 'walking', 15);

-- 9. Basílica Santa María del Mar
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr24-santa-maria-mar',
  'hito', 'museo',
  'bcn-santa-maria-mar-20260424',
  'Basílica Santa María del Mar (gótico catalán)',
  'Entrada €5 pp.',
  '2026-04-24',
  '2026-04-24T19:45:00+02:00', '2026-04-24T20:30:00+02:00',
  'bcn',
  10.87, 'pi pi-star', 0, 'both',
  41.3838, 2.1820
);

-- 10. Cena El Born
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr24-cena-born',
  'hito', 'food',
  'bcn-cena-born-20260424',
  'Cena El Born · tapas',
  'Barrio cool, ambiente local. ~€40 pareja.',
  '2026-04-24',
  '2026-04-24T20:45:00+02:00', '2026-04-24T22:15:00+02:00',
  'bcn',
  43.48, 'pi pi-shop', 0, 'both',
  41.3847, 2.1826
);

-- 11. Metro Jaume I → Paral·lel
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr24-metro-born-poblesec',
  'traslado', 'metro',
  'bcn-metro-jaumei-paralel-20260424',
  'Metro Jaume I → Paral·lel',
  'Regreso al Airbnb Poble Sec.',
  '2026-04-24',
  '2026-04-24T22:30:00+02:00', '2026-04-24T22:55:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.3839, 2.1788, 'Metro Jaume I',
  41.3746, 2.1645, 'Metro Paral·lel'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr24-metro-born-poblesec', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L4+L3', 25);

-- ════════════════════════════════════════════════════════════════════
-- SÁB 25 ABR
-- ════════════════════════════════════════════════════════════════════

-- 1. Metro Paral·lel → Passeig de Gràcia (L3)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr25-metro-graciapg',
  'traslado', 'metro',
  'bcn-metro-paralel-graciapg-20260425',
  'Metro Paral·lel → Passeig de Gràcia (L3)',
  'A punto de partida del free tour.',
  '2026-04-25',
  '2026-04-25T10:30:00+02:00', '2026-04-25T10:50:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.3746, 2.1645, 'Metro Paral·lel',
  41.3917, 2.1649, 'Metro Passeig de Gràcia'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr25-metro-graciapg', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L3', 20);

-- 2. Free Walking Tour Runner Bean Gaudí
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr25-free-tour-gaudi',
  'hito', 'tour',
  'bcn-freetour-gaudi-20260425',
  'Free Walking Tour Runner Bean · Gaudí (tip)',
  '2.5h caminando Passeig de Gràcia, Casa Batlló/Milà exterior, Modernisme. Puntos de encuentro en web Runner Bean. Reservar online. Tip sugerido €15 pareja.',
  '2026-04-25',
  '2026-04-25T11:00:00+02:00', '2026-04-25T13:30:00+02:00',
  'bcn',
  16.30, 'pi pi-map', 0, 'both',
  41.3917, 2.1649
);

-- 3. Almuerzo Eixample/Raval
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr25-lunch',
  'hito', 'food',
  'bcn-lunch-20260425',
  'Almuerzo zona Eixample/Raval',
  '~€30 pareja.',
  '2026-04-25',
  '2026-04-25T13:45:00+02:00', '2026-04-25T15:00:00+02:00',
  'bcn',
  32.61, 'pi pi-shop', 0, 'both',
  41.3860, 2.1680
);

-- 4. Metro → Plaça Espanya (L3)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr25-metro-montjuic',
  'traslado', 'metro',
  'bcn-metro-plespanya-20260425',
  'Metro → Plaça Espanya (L3)',
  'A punto de inicio subida Montjuïc.',
  '2026-04-25',
  '2026-04-25T15:00:00+02:00', '2026-04-25T15:15:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.3860, 2.1680, 'Metro Eixample/Raval',
  41.3751, 2.1487, 'Metro Pl. Espanya'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr25-metro-montjuic', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L3', 15);

-- 5. Walking Pl. Espanya → Fundació Miró
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr25-walk-espanya-miro',
  'traslado', 'walking',
  'bcn-walk-espanya-miro-20260425',
  'A pie · Pl. Espanya → Fundació Miró',
  'Cuesta arriba Montjuïc, ~30 min.',
  '2026-04-25',
  '2026-04-25T15:15:00+02:00', '2026-04-25T15:45:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.3751, 2.1487, 'Plaça Espanya',
  41.3685, 2.1603, 'Fundació Miró'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr25-walk-espanya-miro', NULL, '0', 'walking', 30);

-- 6. Fundació Joan Miró (Articket 2/6)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr25-miro',
  'hito', 'museo',
  'bcn-miro-20260425',
  'Fundació Joan Miró (Articket 2/6)',
  'Obra vanguardia s.XX + jardín esculturas. VISTAS ++ de BCN desde terraza. Cubierto por Articket.',
  '2026-04-25',
  '2026-04-25T15:45:00+02:00', '2026-04-25T17:45:00+02:00',
  'bcn',
  0, 'pi pi-image', 0, 'both',
  41.3685, 2.1603
);

-- 7. Walking Miró → MNAC
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr25-walk-miro-mnac',
  'traslado', 'walking',
  'bcn-walk-miro-mnac-20260425',
  'A pie · Miró → MNAC',
  'Por Montjuïc, 15 min.',
  '2026-04-25',
  '2026-04-25T17:45:00+02:00', '2026-04-25T18:00:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.3685, 2.1603, 'Fundació Miró',
  41.3685, 2.1536, 'MNAC'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr25-walk-miro-mnac', NULL, '0', 'walking', 15);

-- 8. MNAC (Articket 3/6)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr25-mnac',
  'hito', 'museo',
  'bcn-mnac-20260425',
  'MNAC · Museu Nacional d''Art de Catalunya (Articket 3/6)',
  'Románico + gótico + modernisme + s.XX. VISTAS ++ de Barcelona desde terrazas del Palau Nacional. Cierra 20:30 sáb. Cubierto por Articket.',
  '2026-04-25',
  '2026-04-25T18:00:00+02:00', '2026-04-25T20:15:00+02:00',
  'bcn',
  0, 'pi pi-image', 0, 'both',
  41.3685, 2.1536
);

-- 9. Walking MNAC → Font Màgica
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr25-walk-mnac-fontmagica',
  'traslado', 'walking',
  'bcn-walk-mnac-fontmagica-20260425',
  'A pie · MNAC → Font Màgica',
  'Bajada corta, 15 min.',
  '2026-04-25',
  '2026-04-25T20:15:00+02:00', '2026-04-25T20:30:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.3685, 2.1536, 'MNAC',
  41.3711, 2.1500, 'Font Màgica'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr25-walk-mnac-fontmagica', NULL, '0', 'walking', 15);

-- 10. Font Màgica Montjuïc (GRATIS)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr25-font-magica',
  'hito', 'visit',
  'bcn-font-magica-20260425',
  'Font Màgica de Montjuïc (GRATIS)',
  'Espectáculo agua+luz+música GRATIS. Jue-sáb 21:00-21:30 abril. No perderse.',
  '2026-04-25',
  '2026-04-25T21:00:00+02:00', '2026-04-25T21:30:00+02:00',
  'bcn',
  0, 'pi pi-star', 0, 'both',
  41.3711, 2.1500
);

-- 11. Metro Pl. Espanya → Liceu
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr25-metro-jamboree',
  'traslado', 'metro',
  'bcn-metro-plespanya-liceu-20260425',
  'Metro Pl. Espanya → Liceu (L3)',
  'A Plaça Reial para jazz.',
  '2026-04-25',
  '2026-04-25T21:45:00+02:00', '2026-04-25T22:05:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.3751, 2.1487, 'Plaça Espanya',
  41.3806, 2.1738, 'Metro Liceu'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr25-metro-jamboree', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L3', 20);

-- 12. Jamboree Jazz Club
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr25-jamboree',
  'hito', 'music',
  'bcn-jamboree-20260425',
  'Jamboree Jazz Club (Plaça Reial)',
  'Club jazz clásico histórico. Bandsintown publica jam sessions. Reservar 1-2 días antes. ~€26 pareja entrada+consumición.',
  '2026-04-25',
  '2026-04-25T22:15:00+02:00', '2026-04-26T00:00:00+02:00',
  'bcn',
  28.26, 'pi pi-volume-up', 0, 'both',
  41.3798, 2.1749
);

-- 13. Metro regreso Liceu → Paral·lel
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr25-metro-return',
  'traslado', 'metro',
  'bcn-metro-liceu-paralel-20260425',
  'Metro Liceu → Paral·lel',
  'Regreso Airbnb Poble Sec.',
  '2026-04-25',
  '2026-04-26T00:15:00+02:00', '2026-04-26T00:25:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.3806, 2.1738, 'Metro Liceu',
  41.3746, 2.1645, 'Metro Paral·lel'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr25-metro-return', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L3', 10);

-- ════════════════════════════════════════════════════════════════════
-- DOM 26 ABR (Park Güell 10:00 ya confirmado)
-- ════════════════════════════════════════════════════════════════════

-- 1. Metro Paral·lel → Lesseps (L3)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr26-metro-lesseps',
  'traslado', 'metro',
  'bcn-metro-paralel-lesseps-20260426',
  'Metro Paral·lel → Lesseps (L3)',
  'Hacia Park Güell.',
  '2026-04-26',
  '2026-04-26T09:15:00+02:00', '2026-04-26T09:50:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.3746, 2.1645, 'Metro Paral·lel',
  41.4035, 2.1489, 'Metro Lesseps'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr26-metro-lesseps', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L3', 35);

-- 2. Walking Lesseps → Park Güell
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr26-walk-lesseps-parkguell',
  'traslado', 'walking',
  'bcn-walk-lesseps-parkguell-20260426',
  'A pie · Lesseps → Park Güell',
  'Cuesta 10 min.',
  '2026-04-26',
  '2026-04-26T09:50:00+02:00', '2026-04-26T10:00:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.4035, 2.1489, 'Metro Lesseps',
  41.4145, 2.1527, 'Park Güell'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr26-walk-lesseps-parkguell', NULL, '0', 'walking', 10);

-- 3. Walking Park Güell → Gràcia
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr26-walk-parkguell-gracia',
  'traslado', 'walking',
  'bcn-walk-parkguell-gracia-20260426',
  'A pie · Park Güell → Gràcia',
  'Bajada 25 min.',
  '2026-04-26',
  '2026-04-26T13:00:00+02:00', '2026-04-26T13:25:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.4145, 2.1527, 'Park Güell',
  41.4055, 2.1545, 'Plaça del Sol (Gràcia)'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr26-walk-parkguell-gracia', NULL, '0', 'walking', 25);

-- 4. Almuerzo Gràcia
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr26-lunch-gracia',
  'hito', 'food',
  'bcn-lunch-gracia-20260426',
  'Almuerzo Gràcia (Plaça del Sol)',
  'Barrio tranquilo, ambiente local. ~€30 pareja.',
  '2026-04-26',
  '2026-04-26T13:30:00+02:00', '2026-04-26T14:45:00+02:00',
  'bcn',
  32.61, 'pi pi-shop', 0, 'both',
  41.4055, 2.1545
);

-- 5. Walking Gràcia → Casa Vicens
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr26-walk-gracia-vicens',
  'traslado', 'walking',
  'bcn-walk-gracia-vicens-20260426',
  'A pie · Gràcia → Casa Vicens',
  '15 min.',
  '2026-04-26',
  '2026-04-26T14:45:00+02:00', '2026-04-26T15:00:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.4055, 2.1545, 'Plaça del Sol',
  41.4040, 2.1493, 'Casa Vicens'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr26-walk-gracia-vicens', NULL, '0', 'walking', 15);

-- 6. Casa Vicens
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr26-casa-vicens',
  'hito', 'museo',
  'bcn-casa-vicens-20260426',
  'Casa Vicens (Gaudí, primera obra)',
  'Primera casa diseñada por Gaudí (1883-88). Contextualización ideal tras Park Güell. €20 pp.',
  '2026-04-26',
  '2026-04-26T15:00:00+02:00', '2026-04-26T16:30:00+02:00',
  'bcn',
  43.48, 'pi pi-image', 0, 'both',
  41.4040, 2.1493
);

-- 7. Paseo Gràcia barrio
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr26-walk-gracia-paseo',
  'traslado', 'walking',
  'bcn-walk-gracia-paseo-20260426',
  'A pie · Paseo Gràcia barrio',
  'Passeig de Gràcia + Plaça del Diamant + Mercat de la Llibertat exterior.',
  '2026-04-26',
  '2026-04-26T16:30:00+02:00', '2026-04-26T18:00:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.4040, 2.1493, 'Casa Vicens',
  41.4050, 2.1530, 'Gràcia'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr26-walk-gracia-paseo', NULL, '0', 'walking', 90);

-- 8. Metro Diagonal → Paral·lel
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr26-metro-back',
  'traslado', 'metro',
  'bcn-metro-diagonal-paralel-20260426',
  'Metro Diagonal → Paral·lel (L3)',
  'Regreso Airbnb.',
  '2026-04-26',
  '2026-04-26T18:15:00+02:00', '2026-04-26T18:35:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.3945, 2.1620, 'Metro Diagonal',
  41.3746, 2.1645, 'Metro Paral·lel'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr26-metro-back', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L3', 20);

-- 9. Descanso + cena Poble Sec
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr26-descanso-cena',
  'hito', 'food',
  'bcn-descanso-cena-20260426',
  'Descanso Airbnb + cena Poble Sec',
  'Noche tranquila. ~€30 pareja.',
  '2026-04-26',
  '2026-04-26T19:00:00+02:00', '2026-04-26T21:30:00+02:00',
  'bcn',
  32.61, 'pi pi-shop', 0, 'both',
  41.3736, 2.1640
);

-- ════════════════════════════════════════════════════════════════════
-- LUN 27 ABR (Sagrada 17:00 ya confirmado)
-- ════════════════════════════════════════════════════════════════════

-- 1. Metro Paral·lel → Jaume I (L3+L4)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr27-metro-jaumei',
  'traslado', 'metro',
  'bcn-metro-paralel-jaumei-20260427',
  'Metro Paral·lel → Jaume I (L3+L4)',
  'A Museu Picasso (El Born).',
  '2026-04-27',
  '2026-04-27T10:00:00+02:00', '2026-04-27T10:25:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.3746, 2.1645, 'Metro Paral·lel',
  41.3839, 2.1788, 'Metro Jaume I'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr27-metro-jaumei', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L3+L4', 25);

-- 2. Museu Picasso (Articket 4/6)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr27-picasso',
  'hito', 'museo',
  'bcn-picasso-20260427',
  'Museu Picasso (Articket 4/6)',
  'Período azul + formación Picasso. El Born. Cubierto por Articket.',
  '2026-04-27',
  '2026-04-27T10:30:00+02:00', '2026-04-27T12:30:00+02:00',
  'bcn',
  0, 'pi pi-image', 0, 'both',
  41.3852, 2.1810
);

-- 3. Walking Picasso → Raval (MACBA)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr27-walk-picasso-raval',
  'traslado', 'walking',
  'bcn-walk-picasso-raval-20260427',
  'A pie · Picasso → Raval (Pl. Àngels)',
  'Cruce por Gòtic, ~30 min.',
  '2026-04-27',
  '2026-04-27T12:30:00+02:00', '2026-04-27T13:00:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.3852, 2.1810, 'Museu Picasso',
  41.3829, 2.1671, 'MACBA'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr27-walk-picasso-raval', NULL, '0', 'walking', 30);

-- 4. Almuerzo Raval
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr27-lunch-raval',
  'hito', 'food',
  'bcn-lunch-raval-20260427',
  'Almuerzo Raval',
  '~€30 pareja.',
  '2026-04-27',
  '2026-04-27T13:00:00+02:00', '2026-04-27T14:00:00+02:00',
  'bcn',
  32.61, 'pi pi-shop', 0, 'both',
  41.3829, 2.1671
);

-- 5. MACBA (Articket 5/6)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr27-macba',
  'hito', 'museo',
  'bcn-macba-20260427',
  'MACBA · Arte Contemporáneo (Articket 5/6)',
  'Meier building, arte desde 1945. Plaça MACBA exterior famosa skate. Cubierto por Articket.',
  '2026-04-27',
  '2026-04-27T14:00:00+02:00', '2026-04-27T15:30:00+02:00',
  'bcn',
  0, 'pi pi-image', 0, 'both',
  41.3833, 2.1673
);

-- 6. Walking MACBA → CCCB
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr27-walk-macba-cccb',
  'traslado', 'walking',
  'bcn-walk-macba-cccb-20260427',
  'A pie · MACBA → CCCB',
  'Puerta con puerta, 5 min.',
  '2026-04-27',
  '2026-04-27T15:30:00+02:00', '2026-04-27T15:35:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.3833, 2.1673, 'MACBA',
  41.3830, 2.1683, 'CCCB'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr27-walk-macba-cccb', NULL, '0', 'walking', 5);

-- 7. CCCB (Articket 6/6)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr27-cccb',
  'hito', 'museo',
  'bcn-cccb-20260427',
  'CCCB · Centre Cultura Contemporània (Articket 6/6)',
  'Exposiciones temporales cultura contemporánea. Visita rápida. Cubierto por Articket.',
  '2026-04-27',
  '2026-04-27T15:35:00+02:00', '2026-04-27T16:45:00+02:00',
  'bcn',
  0, 'pi pi-book', 0, 'both',
  41.3830, 2.1683
);

-- 8. Metro Universitat → Sagrada Família (L5)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr27-metro-sagrada',
  'traslado', 'metro',
  'bcn-metro-universitat-sagrada-20260427',
  'Metro Universitat → Sagrada Família (L5)',
  'A tiempo para cita Sagrada 17:00.',
  '2026-04-27',
  '2026-04-27T16:45:00+02:00', '2026-04-27T17:00:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.3870, 2.1648, 'Metro Universitat',
  41.4036, 2.1744, 'Metro Sagrada Família'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr27-metro-sagrada', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L5', 15);

-- 9. Metro Sagrada → Alfons X (L5)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr27-metro-bunkers',
  'traslado', 'metro',
  'bcn-metro-sagrada-alfonsx-20260427',
  'Metro Sagrada → Alfons X (L5)',
  'Hacia Bunkers del Carmel.',
  '2026-04-27',
  '2026-04-27T19:15:00+02:00', '2026-04-27T19:30:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.4036, 2.1744, 'Metro Sagrada Família',
  41.4154, 2.1648, 'Metro Alfons X'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr27-metro-bunkers', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L5', 15);

-- 10. Walking Alfons X → Bunkers del Carmel
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr27-walk-bunkers',
  'traslado', 'walking',
  'bcn-walk-alfonsx-bunkers-20260427',
  'A pie · Alfons X → Bunkers del Carmel',
  'Cuesta ~45 min.',
  '2026-04-27',
  '2026-04-27T19:30:00+02:00', '2026-04-27T20:15:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.4154, 2.1648, 'Metro Alfons X',
  41.4182, 2.1577, 'Bunkers del Carmel'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr27-walk-bunkers', NULL, '0', 'walking', 45);

-- 11. Bunkers del Carmel (sunset GRATIS)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr27-bunkers',
  'hito', 'landscape',
  'bcn-bunkers-20260427',
  'Bunkers del Carmel (sunset GRATIS)',
  'Mirador 360° Barcelona, gratis. Sunset abril ~20:30. Historia guerra civil. Llevar abrigo.',
  '2026-04-27',
  '2026-04-27T20:15:00+02:00', '2026-04-27T21:00:00+02:00',
  'bcn',
  0, 'pi pi-sun', 0, 'both',
  41.4182, 2.1577
);

-- 12. Walking Bunkers → Metro Guinardó
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr27-walk-bunkers-down',
  'traslado', 'walking',
  'bcn-walk-bunkers-guinardo-20260427',
  'A pie · Bunkers → Metro Guinardó',
  'Cuesta abajo 30 min.',
  '2026-04-27',
  '2026-04-27T21:00:00+02:00', '2026-04-27T21:30:00+02:00',
  'bcn', 'bcn',
  0, 'pi pi-map-marker', 0, 'both',
  41.4182, 2.1577, 'Bunkers del Carmel',
  41.4171, 2.1709, 'Metro Guinardó/Hospital Sant Pau'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr27-walk-bunkers-down', NULL, '0', 'walking', 30);

-- 13. Metro Guinardó → Muntaner (Harlem zone)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr27-metro-harlem',
  'traslado', 'metro',
  'bcn-metro-guinardo-muntaner-20260427',
  'Metro Guinardó → Muntaner',
  'Combinación L5+L6 hacia Harlem Jazz Club.',
  '2026-04-27',
  '2026-04-27T21:45:00+02:00', '2026-04-27T22:15:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.4171, 2.1709, 'Metro Guinardó',
  41.3912, 2.1506, 'Metro Muntaner'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr27-metro-harlem', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L5+L6', 30);

-- 14. Harlem Jazz Club
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in,
  usd, icon, confirmed, variant, lat, lon
) VALUES (
  'ev-bcn-apr27-harlem-jazz',
  'hito', 'music',
  'bcn-harlem-jazz-20260427',
  'Harlem Jazz Club (Muntaner 20)',
  'Más auténtico/local que Jamboree. Jam sessions vie-dom. Reservar. ~€25 pareja.',
  '2026-04-27',
  '2026-04-27T22:30:00+02:00', '2026-04-28T00:15:00+02:00',
  'bcn',
  27.17, 'pi pi-volume-up', 0, 'both',
  41.3912, 2.1506
);

-- 15. Metro Muntaner → Paral·lel
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-bcn-apr27-metro-return',
  'traslado', 'metro',
  'bcn-metro-muntaner-paralel-20260427',
  'Metro Muntaner → Paral·lel',
  'Regreso Airbnb.',
  '2026-04-27',
  '2026-04-28T00:30:00+02:00', '2026-04-28T00:50:00+02:00',
  'bcn', 'bcn',
  5.54, 'pi pi-train', 0, 'both',
  41.3912, 2.1506, 'Metro Muntaner',
  41.3746, 2.1645, 'Metro Paral·lel'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-bcn-apr27-metro-return', 'TMB', 'EUR 2.55 pp (€5.10 total)', 'L5+L3', 20);
