-- Migration 0026: Recomendaciones adicionales — Palma de Mallorca (Apr 28 – May 2)
-- Actividades complementarias: gastronomía, consejos prácticos, sugerencias por clima
-- confirmed: 0 (recomendaciones, no reservas)

-- ─────────────────────────────────────────────────────
-- Apr 28 · llegada — tarde/noche en Casco Antiguo (16°C, sin lluvia)
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('pmi-apr28-rec-celler',  'pmi-day-apr28', 'evening',
   'Cena recomendada: Celler Sa Premsa · cocina mallorquina tradicional · menú del día o carta · especialidad en lechona y sopas mallorquinas · reservar con anticipación',
   '€15–€25 p/p', 0, 'food', 'La Lonja · Casco Antiguo'),

  ('pmi-apr28-rec-tapas',   'pmi-day-apr28', 'evening',
   'Ruta de tapas a pie por La Lonja · 16°C perfecto para caminar de bar en bar · Plaça de la Drassana y calles adyacentes · pa amb oli (pan con aceite y tomate) + vino local',
   '€5–€10 por parada', 0, 'leisure', 'La Lonja');

-- ─────────────────────────────────────────────────────
-- Apr 29 · Catedral La Seu, Santa Catalina, Paseo del Borne
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('pmi-apr29-rec-mercado',  'pmi-day-apr29', 'morning',
   'Mercado de Santa Catalina · llegar 8:00–9:00 antes de la multitud y el calor · puestos de frutas locales, queso mallorquín, aceitunas · ambiente de mercado auténtico local',
   'gratis entrar · €5–€15 compras', 0, 'visit', 'Santa Catalina'),

  ('pmi-apr29-rec-cafe-catedral', 'pmi-day-apr29', 'afternoon',
   'Café o almuerzo ligero cerca de la Catedral · Bar Bosch (histórico, Plaça del Rei Joan Carles I) o Café Lírico · ensaimada mallorquina + café con leche',
   '€5–€12 p/p', 0, 'food', 'Casco Antiguo'),

  ('pmi-apr29-rec-rooftop',  'pmi-day-apr29', 'evening',
   'Terraza con vistas al atardecer · Hotel Nakar (Passeig del Born) o Bar Flexas (Plaça de la Drassana) · cócteles o vino local mientras cae el sol sobre la bahía · UV ya bajando después de 19:00',
   '€8–€15 copa', 0, 'leisure', 'Paseo del Borne');

-- ─────────────────────────────────────────────────────
-- Apr 30 · Excursión Valldemossa — Serra de Tramuntana (16°C costa, ~11–13°C montaña)
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('pmi-apr30-rec-capas',    'pmi-day-apr30', 'morning',
   'Consejo clima Tramuntana · llevar chaqueta o capa ligera: la montaña está 3–5°C más fría que la costa · 16°C en Palma = ~11–13°C en Valldemossa · ideal para caminar sin sudar',
   NULL, 0, 'leisure', 'Valldemossa · Serra de Tramuntana'),

  ('pmi-apr30-rec-deia',     'pmi-day-apr30', 'afternoon',
   'Parada opcional en Deià de camino de regreso · pueblo de artistas colgado en la montaña · mirador sobre el Mediterráneo · 15 min desde Valldemossa en bus o taxi compartido · café en Sa Vinya des Senyor si está abierto',
   '€2–€3 bus extra / taxi compartido', 0, 'visit', 'Deià'),

  ('pmi-apr30-rec-soller-mirador', 'pmi-day-apr30', 'afternoon',
   'Alternativa: mirador de Sa Foradada (carretera Valldemossa–Deià) · vistas espectaculares a los acantilados y el mar · parada corta de 20 min · gratis · llevar zapatos cómodos',
   'gratis', 0, 'visit', 'Serra de Tramuntana');

-- ─────────────────────────────────────────────────────
-- May 1 · Excursión Sóller — Port de Sóller (19°C, UV 8, mar 15–16°C)
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('pmi-may01-rec-kayak',    'pmi-day-may01', 'afternoon',
   'Port de Sóller · alquiler de kayak o paddleboard · mar a 15–16°C (frío para nadar, ideal para remar) · 19°C ambiente · bahía cerrada y calmada perfecta para principiantes · salir antes de 16:00',
   '€15–€25/hora alquiler', 0, 'leisure', 'Port de Sóller'),

  ('pmi-may01-rec-uv-snack', 'pmi-day-may01', 'afternoon',
   'UV 8 (alto) — aplicar protector solar SPF50+ al salir de Palma · en el puerto: merienda con naranja de Sóller (temporada) o zumo recién exprimido en los chiringuitos del paseo marítimo',
   '€2–€4 zumo', 0, 'leisure', 'Port de Sóller'),

  ('pmi-may01-rec-naranjas',  'pmi-day-may01', 'morning',
   'Naranjas del Valle de Sóller · preguntar en tiendas locales del pueblo por naranjas y limones de cultivo propio · son más dulces que las de supermercado · el mercado local tiene puestos de productores los sábados',
   '€2–€5 bolsa', 0, 'food', 'Sóller');

-- ─────────────────────────────────────────────────────
-- May 2 · Castillo de Bellver + Catamarán + cena de despedida (22°C, UV 8 — mejor día)
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('pmi-may02-rec-catamaran-tip', 'pmi-day-may02', 'afternoon',
   'Crucero catamarán · UV 8 — llevar protector solar SPF50+, sombrero y gafas obligatorios · mar a 16°C (frío pero posible bañarse si el barco para) · 22°C ambiente = día ideal para estar en cubierta todo el recorrido · reservar con antelación',
   '€35–€50 p/p · reservar online', 0, 'leisure', 'Crucero Bahía'),

  ('pmi-may02-rec-cena-esbaluard', 'pmi-day-may02', 'evening',
   'Cena de despedida recomendada: barrio Es Baluard o Portixol · Es Baluard: La Cantina de Bellver con vistas al mar · Portixol: restaurantes frente al puerto pesquero, ambiente local y menos turístico · 22°C perfecto para mesa en terraza',
   '€20–€40 p/p', 0, 'food', 'Es Baluard · Portixol'),

  ('pmi-may02-rec-mejor-dia', 'pmi-day-may02', 'all-day',
   'Nota clima: 22°C, 10 horas de sol, UV 8 — el mejor día de toda la estancia en Mallorca · aprovechar la mañana en Bellver (vistas a la bahía sin calor excesivo) y la tarde en el catamarán · evitar sol directo entre 11:00 y 16:00',
   NULL, 0, 'leisure', 'Palma');
