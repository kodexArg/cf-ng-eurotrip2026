-- 0115_seed_photos_generic_nodate.sql
-- The seven ph-seed-* photos are the canonical "city cover" images that
-- initiate each place (Coliseo de Roma, Sagrada Família, Big Ben, Torre
-- Eiffel, Catedral de Palma, skyline de Madrid, Santiago desde el cerro).
-- They are GENERIC, not photos shot on a specific trip day — so their
-- date must be NULL ("sin fecha"), making them sort first in each city
-- block. Targets the known seed ids only; user uploads are never touched.
UPDATE photos SET date_taken = NULL WHERE id IN (
  'ph-seed-scl',
  'ph-seed-mad',
  'ph-seed-bcn',
  'ph-seed-pmi',
  'ph-seed-lon',
  'ph-seed-par',
  'ph-seed-rom'
);
