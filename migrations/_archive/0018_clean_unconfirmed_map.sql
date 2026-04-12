-- Remove unconfirmed map routes and excursion POIs
-- Keep only: SCL→MAD and ROM→EZE (booked flights), 5 city POIs

DELETE FROM map_routes WHERE sku NOT IN ('scl-mad', 'rom-eze');
DELETE FROM map_pois WHERE type = 'excursion';
