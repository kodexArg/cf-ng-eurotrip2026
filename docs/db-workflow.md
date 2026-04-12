# D1 Workflow — production-only

This project talks directly to the production Cloudflare D1 database (`eurotrip2026`, binding `DB`). There is no local D1, no migrations folder, no staging. Every data change goes straight to prod via `wrangler d1 execute --remote`.

The real fallback for the trip data is not a backup file — it is the markdowns in the repo root (`VIAJE.md`, `PRD.md`). If the database is ever lost, rebuild from those.

## Quick reference

```bash
# One-liner query
npm run db -- --command "SELECT COUNT(*) FROM events;"

# Run a SQL file
npm run db -- --file ./one-off.sql

# Or call wrangler directly (same thing)
npx wrangler d1 execute eurotrip2026 --remote --command "SELECT …"
npx wrangler d1 execute eurotrip2026 --remote --file ./one-off.sql
```

## Changing data

Write plain SQL. No migration files, no versioning, no `d1_migrations` tracking to worry about.

1. Write the `UPDATE` / `INSERT` / `DELETE` statement.
2. Run it with `npm run db -- --command "…"` or `--file ./tmp.sql`.
3. Verify at <https://eurotrip2026.kodexarg.com>.
4. If you touched data that also lives in `VIAJE.md` or `PRD.md`, update those in the same commit so the markdown fallback stays accurate.

For anything non-trivial (bulk updates, schema changes, table renames), commit the `.sql` file temporarily, run it, then delete the file. Don't leave leftover SQL files in the repo — they accumulate and rot.

## Schema overview

Current tables queried by the app (see `functions/api/*`):

| Table | Purpose |
|---|---|
| `cities` | Trip destinations: id, name, slug, arrival, departure, nights, color, lat/lon |
| `events` | Master itinerary. `type` is one of `traslado` / `hito` / `estadia`, plus optional `subtype`. Has date, timestamp_in/out, city_in/out, usd, coordinates. |
| `events_traslado` | Optional sub-row keyed by `event_id`: company, vehicle_code, fare, seat, duration_min |
| `events_estadia` | Optional sub-row keyed by `event_id`: accommodation, address, platform, booking_ref, checkin/checkout times |
| `cards` | City "sitios" cards: type (`info` / `note`), title, body, url |
| `card_links` | 1:N links inside a card |
| `photos` | R2 key + metadata per photo |
| `sessions` | Auth sessions |
| `access_requests` | Auth access requests |

Also present but unused by the app today: `_legacy_*` tables (historical snapshots from before the unified `events` refactor) and `d1_migrations` (orphaned metadata from when migrations were used). Both are dormant; leave them unless you need the disk space.

## D1 limits that matter here

- Max SQL statement length: 100 KB
- Max query duration: 30 s
- Max queries per Worker invocation: 1000
- Max compound SELECT terms: ~16 (hit this once; split unions if you hit it again)
- Database size hard limit: 10 GB (irrelevant at our ~300 rows)

## Recovery

- Cloudflare D1 Time Travel keeps a 7-day automatic restore window. To inspect bookmarks: `npx wrangler d1 time-travel info eurotrip2026`. To restore: `npx wrangler d1 time-travel restore eurotrip2026 --timestamp=<ts>`. Restore is destructive, use only for recent disasters.
- For anything older: rebuild from `VIAJE.md` + `PRD.md`. That is the canonical fallback by design.
