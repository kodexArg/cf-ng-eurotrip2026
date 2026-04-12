-- 0005_activity_card_links.sql
-- Link activities to sitios cards (1:1 optional FK).
-- Surfaces rich card info (description + links + tooltips) inside calendar
-- day modal and itinerary activity modal.

ALTER TABLE activities ADD COLUMN card_id TEXT REFERENCES cards(id);

-- Seed example links — visible sitios info for three activities.
UPDATE activities SET card_id = 'bcn-card-guell'
  WHERE id IN ('bcn-act-apr26-park-guell', 'bcn-apr25-guell');

UPDATE activities SET card_id = 'mad-card-toledo'
  WHERE id IN ('mad-apr23-toledo-tren', 'mad-apr23-toledo-catedral', 'mad-apr23-toledo-almuerzo');

UPDATE activities SET card_id = 'bcn-card-boqueria'
  WHERE tag = 'Boqueria' OR description LIKE '%Boqueria%' OR description LIKE '%Boquería%';
