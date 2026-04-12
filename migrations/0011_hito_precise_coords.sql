-- Precise POI coordinates for confirmed hitos
-- Replaces city-center fallback coords (migration 0010) with actual landmark locations

UPDATE events SET origin_lat = 41.4145, origin_lon = 2.1527
WHERE id = 'ev-bcn-act-apr26-park-guell';

UPDATE events SET origin_lat = 41.4036, origin_lon = 2.1744
WHERE id = 'ev-bcn-act-apr27-sagrada';

UPDATE events SET origin_lat = 41.4036, origin_lon = 2.1744
WHERE id = 'ev-bk-sagrada';
