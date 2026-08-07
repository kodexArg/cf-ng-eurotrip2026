
-- Barcelona (2026-04-24 to 2026-04-27)
WITH ordered_bcn AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn, COUNT(*) OVER() as total
  FROM photos WHERE city_id='bcn' AND id != 'ph-seed-bcn'
)
UPDATE photos SET date_taken = CASE 
  WHEN (SELECT rn FROM ordered_bcn WHERE ordered_bcn.id = photos.id) <= 9 THEN '2026-04-24'
  WHEN (SELECT rn FROM ordered_bcn WHERE ordered_bcn.id = photos.id) <= 18 THEN '2026-04-25'
  WHEN (SELECT rn FROM ordered_bcn WHERE ordered_bcn.id = photos.id) <= 26 THEN '2026-04-26'
  ELSE '2026-04-27'
END
WHERE city_id='bcn' AND id != 'ph-seed-bcn';

-- Palma (2026-04-28 to 2026-05-01)
WITH ordered_pmi AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM photos WHERE city_id='pmi' AND id != 'ph-seed-pmi'
)
UPDATE photos SET date_taken = CASE 
  WHEN (SELECT rn FROM ordered_pmi WHERE ordered_pmi.id = photos.id) <= 15 THEN '2026-04-28'
  WHEN (SELECT rn FROM ordered_pmi WHERE ordered_pmi.id = photos.id) <= 30 THEN '2026-04-29'
  WHEN (SELECT rn FROM ordered_pmi WHERE ordered_pmi.id = photos.id) <= 45 THEN '2026-04-30'
  ELSE '2026-05-01'
END
WHERE city_id='pmi' AND id != 'ph-seed-pmi';

-- Londres (2026-05-02 to 2026-05-05)
WITH ordered_lon AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM photos WHERE city_id='lon' AND id != 'ph-seed-lon'
)
UPDATE photos SET date_taken = CASE 
  WHEN (SELECT rn FROM ordered_lon WHERE ordered_lon.id = photos.id) <= 30 THEN '2026-05-02'
  WHEN (SELECT rn FROM ordered_lon WHERE ordered_lon.id = photos.id) <= 60 THEN '2026-05-03'
  WHEN (SELECT rn FROM ordered_lon WHERE ordered_lon.id = photos.id) <= 90 THEN '2026-05-04'
  ELSE '2026-05-05'
END
WHERE city_id='lon' AND id != 'ph-seed-lon';

-- Paris (2026-05-05 to 2026-05-06)
WITH ordered_par AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM photos WHERE city_id='par' AND id != 'ph-seed-par'
)
UPDATE photos SET date_taken = CASE 
  WHEN (SELECT rn FROM ordered_par WHERE ordered_par.id = photos.id) <= 44 THEN '2026-05-05'
  ELSE '2026-05-06'
END
WHERE city_id='par' AND id != 'ph-seed-par';

-- Roma (2026-05-06 to 2026-05-09)
WITH ordered_rom AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM photos WHERE city_id='rom' AND id != 'ph-seed-rom'
)
UPDATE photos SET date_taken = CASE 
  WHEN (SELECT rn FROM ordered_rom WHERE ordered_rom.id = photos.id) <= 18 THEN '2026-05-06'
  WHEN (SELECT rn FROM ordered_rom WHERE ordered_rom.id = photos.id) <= 36 THEN '2026-05-07'
  WHEN (SELECT rn FROM ordered_rom WHERE ordered_rom.id = photos.id) <= 54 THEN '2026-05-08'
  ELSE '2026-05-09'
END
WHERE city_id='rom' AND id != 'ph-seed-rom';
