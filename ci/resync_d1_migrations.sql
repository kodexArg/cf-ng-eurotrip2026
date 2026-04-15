-- ci_resync_d1_migrations.sql
-- One-off: wipe stale tracking and insert all current migrations as applied.
-- Run via: npx wrangler d1 execute eurotrip2026 --remote --file=ci/resync_d1_migrations.sql

DELETE FROM d1_migrations;
INSERT INTO d1_migrations (name, applied_at) VALUES ('0011_london_paris_rome_via_lyon.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0012_stansted_express_to_london.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0013_gray_scl_eze.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0014_confirm_fr28_pmi_stn.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0014_routing_london_paris_rome_may2to5.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0015_fr28_price.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0016_fr28_locator.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0017_palma_green.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0018_reroute_may4_lon_par_cancel.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0019_eurostar_waypoints.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0020_madrid_barcelona_waypoints.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0020_traslado_labels_and_precise_coords.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0021_waypoints_refine_and_airports.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0022_eurostar_confirmed_may5.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0023_lon_par_rom_reschedule.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0024_palma_flor_apartamento_confirmed.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0025_paris_louvre_ita_az325.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0026_paris_louvre_may6.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0027_scenario_b_eju4957.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0028_louvre_ticket_datos.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0029_london_hitos_rework.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0030_london_abba_voyage.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0031_louvre_confirmado_930.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0032_intra_city_traslados_unconfirmed.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0033_roma_airbnb_colosseo.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0034_stonehenge_windsor_oxford_confirmed.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0035_london_cards_windsor_stonehenge_oxford.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0036_hitos_agregar_horas_confirmadas.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0037_palma_hospedaje_flor_precio.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0038_stonehenge_precio_final.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0039_eurostar_precio_final.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0040_lon_par_hospedaje_precios.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0041_roma_airbnb_confirmed.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0042_transportes_perfeccionados.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0043_leonardo_fare_string.sql', CURRENT_TIMESTAMP);
INSERT INTO d1_migrations (name, applied_at) VALUES ('0044_transportes_incluidos.sql', CURRENT_TIMESTAMP);
