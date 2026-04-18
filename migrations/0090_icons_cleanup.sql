-- migrations/0090_icons_cleanup.sql
-- Limpieza exhaustiva de valores icon inválidos en events.
--
-- Problema: rows con raw PrimeIcons (pi-*, pi pi-*) o raw Material Symbols
-- (ms-*) que deberían haber sido convertidas a semantic Spanish keys compatibles
-- con ICON_REGISTRY en src/app/shared/icon-registry.ts.
--
-- Orden:
--   1. pi-building / pi pi-building (no existe en PrimeIcons v7) → semántico por contexto
--   2. Raw PrimeIcons → semantic por subtype/contexto
--   3. Raw Material Symbols residuales (ms-lunch_dining) → comida
--   4. NULL por subtype/nombre (si aplica)
--
-- NO se tocan filas que ya tienen icon semántico válido.

-- ═══════════════════════════════════════════════════════════════════════════════
-- SECCIÓN 1: pi-building / pi pi-building → contexto semántico
-- ═══════════════════════════════════════════════════════════════════════════════

-- Sky Garden (mirador/viewpoint) → marcador
UPDATE events SET icon='marcador'
WHERE icon IN ('pi-building','pi pi-building')
  AND id = 'ev-lon-may04-skygarden';

-- Catedral de Toledo → iglesia (es un templo, no un museo)
UPDATE events SET icon='iglesia'
WHERE icon IN ('pi-building','pi pi-building')
  AND id = 'ev-tol-apr22-catedral';

-- Sinagoga, Monasterio, Mezquita → museo (contenido patrimonial pagado con pulsera)
UPDATE events SET icon='museo'
WHERE icon IN ('pi-building','pi pi-building')
  AND id IN ('ev-tol-apr22-sinagoga-blanca','ev-tol-apr22-sanjuan-reyes','ev-tol-apr22-cristo-luz');

-- Visita Museos Madrid (genérico) → museo
UPDATE events SET icon='museo'
WHERE icon IN ('pi-building','pi pi-building')
  AND id = 'ev-mad-apr23-museos';

-- ═══════════════════════════════════════════════════════════════════════════════
-- SECCIÓN 2: Raw PrimeIcons → semantic
-- ═══════════════════════════════════════════════════════════════════════════════

-- pi pi-image → museo (todos son subtype=museo: Santo Tomé, Museo Greco, Prado, Palacio Cibeles)
UPDATE events SET icon='museo'
WHERE icon = 'pi pi-image';

-- pi pi-book / pi-book → museo (MinaLima Harry Potter, Sinagoga Tránsito)
UPDATE events SET icon='museo'
WHERE icon IN ('pi-book','pi pi-book');

-- pi pi-volume-up → show (El Junco jam session jazz)
UPDATE events SET icon='show'
WHERE icon = 'pi pi-volume-up';

-- pi pi-calendar → hotel (Hotel Diego de Almagro, estadia)
UPDATE events SET icon='hotel'
WHERE icon = 'pi pi-calendar';

-- pi-heart / pi pi-heart → corazon (leisure/bar events)
UPDATE events SET icon='corazon'
WHERE icon IN ('pi-heart','pi pi-heart');

-- pi-home → airbnb para apartamentos, hotel para subtipo hotel
UPDATE events SET icon='airbnb'
WHERE icon IN ('pi-home','pi pi-home')
  AND subtype IN ('apartment','airbnb');

UPDATE events SET icon='hotel'
WHERE icon IN ('pi-home','pi pi-home')
  AND subtype = 'hotel';

-- pi-home residual (cualquier estadia no cubierta arriba) → airbnb
UPDATE events SET icon='airbnb'
WHERE icon IN ('pi-home','pi pi-home');

-- pi-send / pi pi-send → avion (todos son subtype=flight)
UPDATE events SET icon='avion'
WHERE icon IN ('pi-send','pi pi-send');

-- pi pi-train → tren (AVE, RENFE, Eurostar) excepto subtype=metro → subte
UPDATE events SET icon='subte'
WHERE icon = 'pi pi-train'
  AND subtype = 'metro';

UPDATE events SET icon='tren'
WHERE icon = 'pi pi-train'
  AND subtype != 'metro';

-- pi-directions → tren (AVE Madrid→BCN, Eurostar LON→PAR, Stansted Express)
UPDATE events SET icon='tren'
WHERE icon = 'pi-directions';

-- pi-car / pi pi-car → colectivo (bus, coach, transfer) o auto (car)
UPDATE events SET icon='auto'
WHERE icon IN ('pi-car','pi pi-car')
  AND subtype IN ('car','transfer');

UPDATE events SET icon='colectivo'
WHERE icon IN ('pi-car','pi pi-car')
  AND subtype IN ('bus','coach');

-- pi-car residual (logistics, otros) → auto
UPDATE events SET icon='auto'
WHERE icon IN ('pi-car','pi pi-car');

-- pi-map → subte para traslados metro; caminata para walkings; marcador para hitos tour/visit
UPDATE events SET icon='subte'
WHERE icon IN ('pi-map','pi pi-map')
  AND type = 'traslado'
  AND subtype = 'metro';

UPDATE events SET icon='tren'
WHERE icon IN ('pi-map','pi pi-map')
  AND type = 'traslado'
  AND subtype = 'train';

UPDATE events SET icon='marcador'
WHERE icon IN ('pi-map','pi pi-map')
  AND type = 'hito';

-- pi-map residual → marcador
UPDATE events SET icon='marcador'
WHERE icon IN ('pi-map','pi pi-map');

-- pi pi-map-marker → marcador
UPDATE events SET icon='marcador'
WHERE icon = 'pi pi-map-marker';

-- pi pi-sun → parque (playas/leisure al aire libre)
UPDATE events SET icon='parque'
WHERE icon = 'pi pi-sun';

-- pi-star → corazon (Denmark Street bar, actividad de ocio)
UPDATE events SET icon='corazon'
WHERE icon = 'pi-star';

-- pi pi-star → corazon (Colònia de Sant Jordi, leisure)
UPDATE events SET icon='corazon'
WHERE icon = 'pi pi-star';

-- pi-compass → generico (Stonehenge excursión día completo)
UPDATE events SET icon='generico'
WHERE icon = 'pi-compass';

-- pi-ticket → generico (Sagrada Família booking pre-comprado, pulsera turística Toledo)
UPDATE events SET icon='generico'
WHERE icon = 'pi-ticket';

-- pi-eye / pi pi-eye → por subtype
-- subtype=museo → museo
UPDATE events SET icon='museo'
WHERE icon IN ('pi-eye','pi pi-eye')
  AND subtype = 'museo';

-- subtype=visit (sightseeing genérico) → marcador
UPDATE events SET icon='marcador'
WHERE icon IN ('pi-eye','pi pi-eye')
  AND subtype = 'visit';

-- subtype=leisure → corazon (actividades de ocio)
UPDATE events SET icon='corazon'
WHERE icon IN ('pi-eye','pi pi-eye')
  AND subtype = 'leisure';

-- pi-eye residual → generico
UPDATE events SET icon='generico'
WHERE icon IN ('pi-eye','pi pi-eye');

-- ═══════════════════════════════════════════════════════════════════════════════
-- SECCIÓN 3: ms-lunch_dining residual → comida
-- (0087 los migró pero quedaron filas de migraciones posteriores)
-- ═══════════════════════════════════════════════════════════════════════════════

UPDATE events SET icon='comida'
WHERE icon = 'ms-lunch_dining';

-- ═══════════════════════════════════════════════════════════════════════════════
-- SECCIÓN 4: NULL icon por subtype/nombre
-- ═══════════════════════════════════════════════════════════════════════════════

UPDATE events SET icon='subte'    WHERE icon IS NULL AND subtype IN ('metro');
UPDATE events SET icon='colectivo' WHERE icon IS NULL AND subtype IN ('bus','coach');
UPDATE events SET icon='tren'     WHERE icon IS NULL AND subtype = 'train';
UPDATE events SET icon='avion'    WHERE icon IS NULL AND subtype = 'flight';
UPDATE events SET icon='ferry'    WHERE icon IS NULL AND subtype = 'ferry';
UPDATE events SET icon='caminata' WHERE icon IS NULL AND subtype IN ('walk','walking');
UPDATE events SET icon='airbnb'   WHERE icon IS NULL AND type = 'estadia';
UPDATE events SET icon='museo'
WHERE icon IS NULL
  AND (LOWER(title) LIKE '%museo%' OR LOWER(title) LIKE '%museum%');
