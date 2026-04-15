-- 0062: Agregar referencias cruzadas card_id en hitos y traslados

-- ============================================================
-- MADRID (18)
-- ============================================================
UPDATE events SET card_id = 'mad-card-prado'       WHERE id = 'ev-mad-apr20-prado';
UPDATE events SET card_id = 'mad-card-retiro'      WHERE id = 'ev-mad-apr21-retiro';
UPDATE events SET card_id = 'mad-card-san-miguel'  WHERE id = 'ev-mad-apr21-sanmiguel';
UPDATE events SET card_id = 'mad-card-restaurantes' WHERE id = 'ev-mad-apr21-aniversario';
UPDATE events SET card_id = 'mad-card-restaurantes' WHERE id = 'ev-mad-apr21-aniversario-cena';
UPDATE events SET card_id = 'mad-card-palacio-real' WHERE id = 'ev-mad-apr22-palacio';
UPDATE events SET card_id = 'mad-card-prado'       WHERE id = 'ev-mad-apr22-prado';
UPDATE events SET card_id = 'mad-card-toledo'      WHERE id = 'ev-tol-apr22-llegada';
UPDATE events SET card_id = 'mad-card-toledo-alcazar'  WHERE id = 'ev-tol-apr22-alcazar';
UPDATE events SET card_id = 'mad-card-toledo-catedral' WHERE id = 'ev-tol-apr22-catedral';
UPDATE events SET card_id = 'mad-card-retiro'      WHERE id = 'ev-mad-apr23-retiro';
UPDATE events SET card_id = 'mad-card-san-miguel'  WHERE id = 'ev-mad-apr23-sanmiguel';
UPDATE events SET card_id = 'mad-card-restaurantes' WHERE id = 'ev-mad-apr23-cena-despedida';
UPDATE events SET card_id = 'mad-card-restaurantes' WHERE id = 'ev-mad-apr23-letras';
UPDATE events SET card_id = 'mad-card-transporte'  WHERE id = 'ev-leg-mad-t4-sol-arrival';
UPDATE events SET card_id = 'mad-card-transporte'  WHERE id = 'ev-tol-apr22-metro-ida';
UPDATE events SET card_id = 'mad-card-transporte'  WHERE id = 'ev-tol-apr22-metro-vuelta';
UPDATE events SET card_id = 'mad-card-transporte'  WHERE id = 'ev-leg-mad-sol-atocha';

-- ============================================================
-- BARCELONA (9)
-- ============================================================
UPDATE events SET card_id = 'bcn-card-gotico'   WHERE id = 'ev-bcn-apr24-gotico';
UPDATE events SET card_id = 'bcn-card-gotico'   WHERE id = 'ev-bcn-apr24-gothic';
UPDATE events SET card_id = 'bcn-card-barrios'  WHERE id = 'ev-bcn-apr24-born-vermut';
UPDATE events SET card_id = 'bcn-card-barrios'  WHERE id = 'ev-bcn-apr24-born-bici';
UPDATE events SET card_id = 'bcn-card-barrios'  WHERE id = 'ev-bcn-apr24-raval';
UPDATE events SET card_id = 'bcn-card-guell'    WHERE id = 'ev-bcn-apr25-gaudi-bici';
UPDATE events SET card_id = 'bcn-card-barrios'  WHERE id = 'ev-bcn-apr25-gracia';
UPDATE events SET card_id = 'bcn-card-barrios'  WHERE id = 'ev-bcn-apr25-born-noche';
UPDATE events SET card_id = 'bcn-card-eventos'  WHERE id = 'ev-bcn-apr25-feria';

-- ============================================================
-- MALLORCA (31)
-- ============================================================
UPDATE events SET card_id = 'pmi-card-catedral'    WHERE id = 'ev-pmi-apr28-pm';
UPDATE events SET card_id = 'pmi-card-mercados'    WHERE id = 'ev-pmi-apr28-ev';
UPDATE events SET card_id = 'pmi-card-gastronomia' WHERE id = 'ev-pmi-apr28-rec-celler';
UPDATE events SET card_id = 'pmi-card-gastronomia' WHERE id = 'ev-pmi-apr28-rec-tapas';
UPDATE events SET card_id = 'pmi-card-playas'      WHERE id = 'ev-pmi-apr28-playa';
UPDATE events SET card_id = 'pmi-card-catedral'    WHERE id = 'ev-pmi-apr29-am';
UPDATE events SET card_id = 'pmi-card-mercados'    WHERE id = 'ev-pmi-apr29-pm';
UPDATE events SET card_id = 'pmi-card-mercados'    WHERE id = 'ev-pmi-apr29-ev';
UPDATE events SET card_id = 'pmi-card-mercados'    WHERE id = 'ev-pmi-apr29-rec-mercado';
UPDATE events SET card_id = 'pmi-card-gastronomia' WHERE id = 'ev-pmi-apr29-rec-cafe-catedral';
UPDATE events SET card_id = 'pmi-card-mercados'    WHERE id = 'ev-pmi-apr29-rec-rooftop';
UPDATE events SET card_id = 'pmi-card-valldemossa' WHERE id = 'ev-pmi-apr29-valldemossa';
UPDATE events SET card_id = 'pmi-card-valldemossa' WHERE id = 'ev-pmi-apr29-saforadada';
UPDATE events SET card_id = 'pmi-card-valldemossa' WHERE id = 'ev-pmi-apr29-deia';
UPDATE events SET card_id = 'pmi-card-valldemossa' WHERE id = 'ev-pmi-apr30-am';
UPDATE events SET card_id = 'pmi-card-valldemossa' WHERE id = 'ev-pmi-apr30-pm';
UPDATE events SET card_id = 'pmi-card-catedral'    WHERE id = 'ev-pmi-apr30-ev';
UPDATE events SET card_id = 'pmi-card-valldemossa' WHERE id = 'ev-pmi-apr30-rec-capas';
UPDATE events SET card_id = 'pmi-card-valldemossa' WHERE id = 'ev-pmi-apr30-rec-deia';
UPDATE events SET card_id = 'pmi-card-soller'      WHERE id = 'ev-pmi-apr30-rec-soller-mirador';
UPDATE events SET card_id = 'pmi-card-playas'      WHERE id = 'ev-pmi-apr30-estrenc';
UPDATE events SET card_id = 'pmi-card-playas'      WHERE id = 'ev-pmi-apr30-coloniastjordi';
UPDATE events SET card_id = 'pmi-card-soller'      WHERE id = 'ev-pmi-may01-am';
UPDATE events SET card_id = 'pmi-card-soller'      WHERE id = 'ev-pmi-may01-pm';
UPDATE events SET card_id = 'pmi-card-catedral'    WHERE id = 'ev-pmi-may01-ev';
UPDATE events SET card_id = 'pmi-card-soller'      WHERE id = 'ev-pmi-may01-rec-kayak';
UPDATE events SET card_id = 'pmi-card-soller'      WHERE id = 'ev-pmi-may01-rec-uv-snack';
UPDATE events SET card_id = 'pmi-card-soller'      WHERE id = 'ev-pmi-may01-rec-naranjas';
UPDATE events SET card_id = 'pmi-card-catedral'    WHERE id = 'ev-pmi-may01-catedral';
UPDATE events SET card_id = 'pmi-card-mercados'    WHERE id = 'ev-pmi-may01-calatrava';
UPDATE events SET card_id = 'pmi-card-playas'      WHERE id = 'ev-pmi-may01-paseo';

-- ============================================================
-- LONDRES (11)
-- ============================================================
UPDATE events SET card_id = 'lon-card-westminster'  WHERE id = 'ev-lon-may02-citytour';
UPDATE events SET card_id = 'lon-card-covent-garden' WHERE id = 'ev-lon-may02-denmark';
UPDATE events SET card_id = 'lon-card-westminster'  WHERE id = 'ev-leg-lon-westminster-soho';
UPDATE events SET card_id = 'lon-card-stonehenge'   WHERE id = 'ev-leg-lon-stonehenge-coach';
UPDATE events SET card_id = 'lon-card-stonehenge'   WHERE id = 'ev-lon-may03-stonehenge';
UPDATE events SET card_id = 'lon-card-west-end'     WHERE id = 'ev-lon-may04-abba';
UPDATE events SET card_id = 'lon-card-oyster'       WHERE id = 'ev-leg-lon-victoria-kings-cross';
UPDATE events SET card_id = 'lon-card-oyster'       WHERE id = 'ev-leg-lon-kx-minalima';
UPDATE events SET card_id = 'lon-card-oyster'       WHERE id = 'ev-leg-lon-minalima-skygarden';
UPDATE events SET card_id = 'lon-card-oyster'       WHERE id = 'ev-leg-lon-skygarden-abba';
UPDATE events SET card_id = 'lon-card-oyster'       WHERE id = 'ev-leg-lon-abba-kx';

-- ============================================================
-- ROMA (5)
-- ============================================================
UPDATE events SET card_id = 'rom-card-coliseo'    WHERE id = 'ev-rom-may06-am';
UPDATE events SET card_id = 'rom-card-transporte' WHERE id = 'ev-leg-rom-termini-hotel';
UPDATE events SET card_id = 'rom-card-vaticano'   WHERE id = 'ev-rom-may07-am';
UPDATE events SET card_id = 'rom-card-san-pedro'  WHERE id = 'ev-rom-may07-pm';
UPDATE events SET card_id = 'rom-card-trastevere' WHERE id = 'ev-rom-may07-ev';
