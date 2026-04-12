-- Seed: assign tipo and tag to existing activities
UPDATE activities SET tipo='transport', tag='Llegada Madrid'    WHERE id='mad-act-apr20-arrival';
UPDATE activities SET tipo='leisure',   tag='Lavapiés'          WHERE id='mad-act-apr20-rest';
UPDATE activities SET tipo='leisure',   tag='Aniversario'       WHERE id='mad-act-apr21-aniv';
UPDATE activities SET tipo='transport', tag='AVE Madrid-BCN'    WHERE id='bcn-act-apr24-train';
UPDATE activities SET tipo='hotel',     tag='Check-in BCN'      WHERE id='bcn-act-apr24-checkin';
UPDATE activities SET tipo='visit',     tag='Sagrada Família'   WHERE id='bcn-act-apr27-sf';
UPDATE activities SET tipo='transport', tag='Vuelo BCN-CDG'     WHERE id='par-act-apr29-flight';
UPDATE activities SET tipo='hotel',     tag='Check-in París'    WHERE id='par-act-apr29-checkin';
UPDATE activities SET tipo='transport', tag='Tren París-VCE'    WHERE id='vce-act-may02-train';
UPDATE activities SET tipo='hotel',     tag='Check-in Venecia'  WHERE id='vce-act-may02-arrival';
UPDATE activities SET tipo='transport', tag='Tren VCE-ROM'      WHERE id='rom-act-may04-train';
UPDATE activities SET tipo='hotel',     tag='Check-in Roma'     WHERE id='rom-act-may04-arrival';
