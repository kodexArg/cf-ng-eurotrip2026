-- 0097_remove_articket_bcn.sql
-- Remove Articket events — no museums were visited

DELETE FROM events WHERE id IN (
  'ev-bcn-apr25-picasso',
  'ev-bcn-apr25-cccb',
  'ev-bcn-apr25-mnac',
  'ev-bcn-apr25-miro'
);
