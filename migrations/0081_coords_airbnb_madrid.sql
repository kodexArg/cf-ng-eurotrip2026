-- migrations/0081_coords_airbnb_madrid.sql
-- Coords exactas Airbnb Madrid: C. del Ave María 42, Lavapiés (desde Google Maps)

UPDATE events
SET lat = 40.4098852, lon = -3.7010636
WHERE id = 'ev-stay-bk-madrid-airbnb';
