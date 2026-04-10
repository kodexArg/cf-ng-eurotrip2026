-- Seed: city cards
-- Only confirmed/real data. Intentions marked explicitly in body text.
-- Empty cities get no cards yet — add as info is confirmed.

-- ── MADRID ──────────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('mad-card-airbnb', 'mad', 'info',
   'AirBNB Madrid — PAGADO',
   'C. del Ave María 42, 28012 Madrid. Barrio de Lavapiés. 4 noches: 20–24 abr. Reserva confirmada y pagada.',
   NULL),

  ('mad-card-sagradafamilia-sf-link', 'mad', 'note',
   'Llegada 6AM — logística',
   'El vuelo llega ~6AM. Check-in del AirBNB probablemente no disponible hasta las 14–15h. Opciones: guardar equipaje en consigna (hay una en Atocha) o preguntar al host si permite dejar las maletas antes.',
   NULL);

-- ── BARCELONA ───────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('bcn-card-sf', 'bcn', 'info',
   'Sagrada Família — ticket CONFIRMADO',
   'Visita Dom 27 abr, tarde. Acceso básico + Torre del Nacimiento. Presentarse con QR 15 min antes. No se puede fotografiar el techo de la Capilla Central con flash.',
   'https://sagradafamilia.org/es/visita'),

  ('bcn-card-alojamiento', 'bcn', 'note',
   'Alojamiento Barcelona — por confirmar',
   '5 noches: 24–29 abr. Aún sin reservar.',
   NULL),

  ('bcn-card-train-mad', 'bcn', 'note',
   'Tren Madrid → Barcelona — por reservar',
   'AVE Atocha → Sants. Salida temprana el 24 abr. Renfe o Ouigo (low cost). Reservar con anticipación — precio sube mucho.',
   'https://www.renfe.com');

-- ── PARIS ───────────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('par-card-alojamiento', 'par', 'note',
   'Alojamiento París — por confirmar',
   '3 noches: 29 abr – 2 may. AirBNB sin dirección determinada aún.',
   NULL),

  ('par-card-vuelo-bcn', 'par', 'note',
   'Vuelo Barcelona → París — por reservar',
   'Salida 29 abr. Aeropuerto BCN (El Prat) → CDG o Orly. Vuelo ~2h. Reservar con anticipación.',
   NULL);

-- ── VENECIA ─────────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('vce-card-alojamiento', 'vce', 'note',
   'Alojamiento Venecia — por confirmar',
   '2 noches: 2–4 may. Sin reserva aún.',
   NULL),

  ('vce-card-tren-paris', 'vce', 'note',
   'Tren París → Venecia — por reservar',
   'Salida 2 may. TGV París Gare de Lyon → Milán + regional Milán → Venezia Santa Lucia. ~10h total. Reservar con anticipación.',
   NULL);

-- ── ROMA ────────────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('rom-card-alojamiento', 'rom', 'note',
   'Alojamiento Roma — por confirmar',
   '5 noches: 4–9 may. Sin reserva aún.',
   NULL),

  ('rom-card-vuelo-vuelta', 'rom', 'info',
   'Vuelo de regreso — CONFIRMADO',
   'Iberia FCO → EZE. Salida 9 may 23:00 desde Fiumicino (FCO). Llegar al aeropuerto ~20:30. Verificar terminal Iberia en FCO (generalmente T3).',
   NULL),

  ('rom-card-tren-venecia', 'rom', 'note',
   'Tren Venecia → Roma — por reservar',
   'Frecciarossa Venezia Santa Lucia → Roma Termini. ~3h 45m. Salida 4 may. Reservar en Trenitalia.',
   'https://www.trenitalia.com');
