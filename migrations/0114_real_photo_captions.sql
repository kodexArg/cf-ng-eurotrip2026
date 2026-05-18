-- 0114_real_photo_captions.sql
-- The pmi/lon/par/rom seed objects were replaced in R2 with real
-- characteristic Wikimedia images; update their captions to match.
UPDATE photos SET caption='Catedral de Palma de Mallorca' WHERE id='ph-seed-pmi';
UPDATE photos SET caption='Londres · Big Ben y Westminster' WHERE id='ph-seed-lon';
UPDATE photos SET caption='Torre Eiffel · París'           WHERE id='ph-seed-par';
UPDATE photos SET caption='Coliseo de Roma'                WHERE id='ph-seed-rom';
