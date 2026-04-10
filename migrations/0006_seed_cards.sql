-- Seed: city cards (info, link, note, photo) for all 5 cities
-- Types: info = practical facts, link = external URL, note = personal reminder, photo = photo highlight

-- ── MADRID ──────────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('mad-card-hotel',      'mad', 'info',
   'Hotel NH Collection Madrid Atocha',
   'C/ Atocha 34, 28012 Madrid. A 5 min caminando del Museo del Prado y a 10 min del Retiro. Check-in 15h, check-out 12h. Desayuno no incluido — hay un café en la esquina.',
   NULL),

  ('mad-card-prado-link', 'mad', 'link',
   'Museo del Prado — entradas online',
   'Conviene comprar con anticipación. Entrada general ~15 pp. Gratis 18–20h de lunes a sábado y domingos 17–19h (cola garantizada).',
   'https://www.museodelprado.es/visita/planifica-tu-visita/tarifas'),

  ('mad-card-reina-sofia-link', 'mad', 'link',
   'Museo Reina Sofía — tickets',
   'Guernica, Dalí, Miró. Gratis lun–sáb 19–21h, domingos todo el día. Entrada general ~12 pp.',
   'https://www.museoreinasofia.es/visita/precios-y-horarios'),

  ('mad-card-metro',      'mad', 'note',
   'Metro y transporte en Madrid',
   'Tarjeta de 10 viajes (T-casual) ~12.20€ — vale para metro, bus y cercanías dentro de la zona A. Desde el aeropuerto Barajas: taxi tarifa plana 33€ o metro línea 8 (~5€ + suplemento aeropuerto ~3€). El metro cierra a la 1:30am (viernes/sábado 2:30am).',
   NULL),

  ('mad-card-tapas',      'mad', 'info',
   'Dónde comer: La Latina y Malasaña',
   'Calle Cava Baja (La Latina) = epicentro del tapeo madrileño. Txirimiri, Juana La Loca (tortilla de patatas confirmada). Para desayuno: Chocolatería San Ginés (churros + chocolate) cerca de Sol — abre 24h.',
   NULL),

  ('mad-card-dinero',     'mad', 'note',
   'Efectivo y cajeros',
   'Cajeros Santander y BBVA sin comisión para tarjetas Visa/Mastercard internacionales. Tener algo de efectivo para tapas, mercados y propinas. El mercado del Rastro (domingos, La Latina) es solo efectivo.',
   NULL);

-- ── BARCELONA ───────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('bcn-card-hotel',      'bcn', 'info',
   'Apartamento Eixample — Passeig de Gràcia',
   'C/ Consell de Cent 280, 08011 Barcelona. A 10 min a pie de Casa Batlló y Casa Milà. Metro L2/L3 Passeig de Gràcia a 3 cuadras. Check-in desde 15h — caja de llaves en portería.',
   NULL),

  ('bcn-card-sagrada-link', 'bcn', 'link',
   'Sagrada Família — ticket confirmado',
   'Reserva hecha. Visita básica + torre del Nacimiento. Presentarse con QR 15 min antes. Sin torre: gratis para menores de 12 años.',
   'https://sagradafamilia.org/es/visita'),

  ('bcn-card-park-guell-link', 'bcn', 'link',
   'Park Güell — entradas online',
   'Zona monumental con acceso regulado: ~10 pp. Obligatorio comprar online (no venden en puerta). Zona gratuita alrededor también vale la pena.',
   'https://www.parkguell.barcelona/es/planifica-tu-visita/entradas'),

  ('bcn-card-seguridad',  'bcn', 'note',
   'Seguridad — carteristas',
   'Las Ramblas, metro L1/L3 y la zona de la Barceloneta son puntos calientes. Mochila siempre al frente o cruzada. No usar el teléfono en la mesa si estás distraído. El interior del Barrio Gótico de noche puede ser incómodo.',
   NULL),

  ('bcn-card-transporte', 'bcn', 'info',
   'Transporte: T-Casual y metro',
   'T-Casual (10 viajes) ~12.15€ — vale para metro, bus, FGC y Tramvia. NO confundir con T-Dia (~11€, solo 1 día). El Aerobus (aeropuerto T1/T2 → Pl. Catalunya) ~6.75 pp o taxi tarifa plana ~39€.',
   NULL),

  ('bcn-card-mercados',   'bcn', 'note',
   'Mercados: Boqueria vs. alternativas',
   'La Boqueria es una trampa turística cara. Para comer bien: Mercat de l''Abaceria (Gràcia) o Mercat de Santa Caterina (El Born). Para bocadillos rápidos: cualquier "bocatería" del barrio. El menú del día (~12–15€) en el Eixample es la mejor relación precio-calidad.',
   NULL);

-- ── PARIS ───────────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('par-card-hotel',      'par', 'info',
   'Hôtel du Petit Moulin — Le Marais',
   '29 Rue de Poitou, 75003 Paris. En el corazón del Marais, a 10 min a pie de Notre-Dame y del Louvre. Zona animada, muchos restaurantes. Metro: Filles du Calvaire (L8).',
   NULL),

  ('par-card-louvre-link', 'par', 'link',
   'Musée du Louvre — reserva online',
   'Entrada ~17 pp. Comprar online es obligatorio (no hay colas walk-in tolerables). Gratis para menores de 26 años si son ciudadanos UE. Calculá 3–4h mínimo para lo esencial: Venus de Milo, Victoria de Samotracia, Mona Lisa.',
   'https://www.louvre.fr/en/visit/ticket'),

  ('par-card-eiffel-link', 'par', 'link',
   'Torre Eiffel — entradas',
   'Subida 2do piso: ~18 pp. Cima: ~29 pp. Las vistas desde Trocadéro (gratis) son icónicas. Si no reservaste, llegar temprano a la mañana para cola walk-in al 1er piso.',
   'https://www.toureiffel.paris/en/the-monument/visiting'),

  ('par-card-transporte', 'par', 'info',
   'Metro y Navigo en París',
   'Navigo Easy con carnet de 10 billetes (t+) ~17.35€ — zona 1–5. Si llegamos el 30/Apr y nos vamos el 2/May no conviene la semana completa. El RER B conecta CDG con el centro (~35 min, ~11.80€). Metro funciona hasta la 1:15am (sáb 2:15am).',
   NULL),

  ('par-card-museos-gratis', 'par', 'note',
   'Museos nacionales gratis — 1er domingo',
   'El primer domingo de cada mes, los museos nacionales son gratuitos: Louvre, Orsay, Versalles, Cluny. Mayo 3 es el primer domingo de mayo. Si cambiamos algo del plan, ese día el Louvre es gratis (pero con muchísima gente).',
   NULL),

  ('par-card-comida',     'par', 'note',
   'Dónde comer en París',
   'Evitar restaurantes en los alrededores inmediatos del Louvre y Torre Eiffel. El Marais tiene buenas opciones: L''As du Fallafel (rue des Rosiers) es un clásico. Para desayuno: cualquier boulangerie local. "Formule déjeuner" (~15–20€) en bistrós del 3e y 4e arrondissement.',
   NULL);

-- ── VENECIA ─────────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('vce-card-hotel',      'vce', 'info',
   'Ca'' della Corte — Dorsoduro',
   'Corte Surian, Dorsoduro 2979/A, 30123 Venezia. Barrio tranquilo, lejos de San Marco. Cerca del vaporetto parada Ca'' Rezzonico (L1). Check-in 14h. Traer las maletas a pie desde Santa Lucia.',
   NULL),

  ('vce-card-vaporetto',  'vce', 'note',
   'Vaporetto ACTV — pases y líneas',
   '24h ~25€, 48h ~35€, 72h ~45€. Comprar en la app ACTV o en las taquillas de los embarcaderos. Línea 1: lenta, pasa por todo el Gran Canal — panorámica. Línea 2: más rápida, menos paradas. Para Murano: línea 12 desde Fondamente Nove.',
   NULL),

  ('vce-card-bacaro',     'vce', 'note',
   'Comer bien: bacari y cicchetti',
   'Evitar restaurantes con foto en el menú cerca de San Marco — son una trampa. Buscar "bacaro" (bar tradicional veneciano). Cicchetti (tapas venecianas) ~1–2€ c/u con prosecco ~1.50€. Zona recomendada: Cannaregio (Fondamenta della Misericordia) y Dorsoduro.',
   NULL),

  ('vce-card-maletas',    'vce', 'note',
   'Logística con equipaje',
   'Hay más de 400 puentes en Venecia, casi todos con escalones. Las maletas con ruedas son un infierno. Si podés, mandá el equipaje pesado directo a Roma con algún servicio de courier (Luggage Mule, etc.) y explorá Venecia con lo mínimo.',
   NULL),

  ('vce-card-palazzo-ducale-link', 'vce', 'link',
   'Palazzo Ducale + Museos de San Marco',
   'Combo recomendado ~25 pp. Incluye Palazzo Ducale, Museo Correr, Museo Arqueológico. La Basílica de San Marco es gratis pero requiere reserva gratuita online (musement.com).',
   'https://www.visitmuve.it/en/museums/palazzo-ducale');

-- ── ROMA ────────────────────────────────────────────────────────────────────

INSERT INTO cards (id, city_id, type, title, body, url) VALUES
  ('rom-card-hotel',      'rom', 'info',
   'Hotel Santa Maria — Trastevere',
   'Vicolo del Piede 2, 00153 Roma. En pleno Trastevere, el barrio más auténtico de Roma. A 25 min a pie del Vaticano y 30 min del Coliseo. Muy tranquilo de noche. Parking disponible (~25€/día si fuera necesario).',
   NULL),

  ('rom-card-coliseo-link', 'rom', 'link',
   'Coliseo + Foro Romano + Palatino — entradas',
   'Ticket combo ~18 pp — válido 2 días consecutivos. OBLIGATORIO reservar online (se agotan con semanas de anticipación). Preferir turno de mañana temprano (9:00) para evitar calor y grupos.',
   'https://www.coopculture.it/en/colosseo-e-shop.cfm'),

  ('rom-card-vaticano-link', 'rom', 'link',
   'Museos Vaticanos + Capilla Sixtina',
   '~17 pp entrada estándar, ~29 pp con acceso nocturno. Reservar con semanas de anticipación — las entradas walk-in implican 2–3h de cola. La Basílica de San Pedro es GRATIS (pero hay dress code estricto).',
   'https://www.museivaticani.va/content/museivaticani/en/visita-i-musei/biglietti.html'),

  ('rom-card-dress-code', 'rom', 'note',
   'Dress code: Vaticano y basílicas',
   'Vaticano (museos y Basílica San Pedro), San Giovanni in Laterano y Santa Maria Maggiore exigen hombros y rodillas cubiertos. Sin tirantes, sin shorts. Llevar un pareo o remera extra. Los guardias rechazan a quienes no cumplen — no hay excepciones.',
   NULL),

  ('rom-card-pompeya',    'rom', 'note',
   'Pompeya — logística del día de excursión',
   'Salir de Roma Termini 7:30–8:00am en Frecciarossa a Napoli (~70 min, ~15 pp). Luego Circumvesuviana (tren regional, no reserva) a Pompei Scavi – Villa dei Misteri (~35 min, ~3 pp). Entrada ruinas ~18 pp. Vuelta a Roma: salir de Pompeya no más tarde de las 15:30.',
   NULL),

  ('rom-card-comida',     'rom', 'info',
   'Comer en Roma: consejos básicos',
   'Trastevere es la mejor zona para cenar. Evitar restaurantes con fotos en el menú o con "promotores" en la puerta. El coperto (~2€ pp) es legal y normal. Agua potable gratis en los nasoni (fuentes de bronce) por toda la ciudad. Para desayuno: cualquier bar romano — cornetto + cappuccino ~1.50€.',
   NULL),

  ('rom-card-transporte', 'rom', 'info',
   'Transporte en Roma',
   '48h de transporte público ~7€ — cubre metro (2 líneas), bus y tranvía. El metro es limitado (muchas zonas arqueológicas impiden excavar). El bus es más útil pero más lento. Para el Vaticano: caminar desde Trastevere (~25 min) o bus 23/280. No hay metro directo.',
   NULL);
