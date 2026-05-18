-- 0112_seed_city_photos.sql
-- Seed one characteristic photo per city (first day of each city) so the
-- gallery is populated and the R2 pipeline is exercised end-to-end.
-- Objects already uploaded to R2 bucket eurotrip2026-media at <city>/seed-<city>.jpg.
INSERT INTO photos (id,city_id,r2_key,caption,date_taken,uploader_note,created_at,media_type,mime) VALUES
 ('ph-seed-scl','scl','scl/seed-scl.jpg','Santiago desde el Cerro San Cristóbal','2026-04-18',NULL,CURRENT_TIMESTAMP,'photo','image/jpeg'),
 ('ph-seed-mad','mad','mad/seed-mad.jpg','Skyline de Madrid','2026-04-20',NULL,CURRENT_TIMESTAMP,'photo','image/jpeg'),
 ('ph-seed-bcn','bcn','bcn/seed-bcn.jpg','Sagrada Família','2026-04-24',NULL,CURRENT_TIMESTAMP,'photo','image/jpeg'),
 ('ph-seed-pmi','pmi','pmi/seed-pmi.jpg','Palma de Mallorca','2026-04-28',NULL,CURRENT_TIMESTAMP,'photo','image/jpeg'),
 ('ph-seed-lon','lon','lon/seed-lon.jpg','Londres','2026-05-02',NULL,CURRENT_TIMESTAMP,'photo','image/jpeg'),
 ('ph-seed-par','par','par/seed-par.jpg','París','2026-05-05',NULL,CURRENT_TIMESTAMP,'photo','image/jpeg'),
 ('ph-seed-rom','rom','rom/seed-rom.jpg','Roma','2026-05-06',NULL,CURRENT_TIMESTAMP,'photo','image/jpeg');
