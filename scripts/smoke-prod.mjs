#!/usr/bin/env node
// Smoke test: hits the deployed prod API and verifies critical events
// (prices, confirmed status). Exits non-zero on any failure so CI can gate.
//
// Usage: node scripts/smoke-prod.mjs
// Override the host with: SMOKE_HOST=https://other.example.com node scripts/smoke-prod.mjs

const HOST = process.env.SMOKE_HOST || 'https://eurotrip2026.kodexarg.com';
const URL = `${HOST}/api/map/events`;

// Each row: [id, expectedConfirmed (1|0|null=skip), expectedUsd (number|null=skip)]
// These are the post-0044 invariants that must hold in prod for the trip to be "shipped".
const EXPECTED = [
  ['ev-stay-auto-pmi',          1, 428.32],
  ['ev-stay-auto-lon',          1, 320.12],
  ['ev-stay-auto-par',          1, 213.00],
  ['est-rom-airbnb-colosseo',   1, 451.00],
  ['ev-lon-may03-stonehenge',   1, 303.00],
  ['ev-leg-lon-par',            1, 328.27],
  ['ev-leg-leo-express',        1,  38.91],
  ['ev-leg-pmi-peguera',        1,   8.81],
  ['ev-leg-stn-lon',            1,  null],
  ['ev-leg-lon-victoria-kings-cross', 1, null],
  ['ev-leg-par-gdn-hotel',      1,  null],
  ['ev-leg-rom-termini-hotel',  1,  null],
  ['ev-leg-lon-stonehenge-coach', 1, null],
];

const fail = [];
const ok = [];

const res = await fetch(URL);
if (!res.ok) {
  console.error(`✘ HTTP ${res.status} fetching ${URL}`);
  process.exit(1);
}
const events = await res.json();
const byId = new Map(events.map((e) => [e.id, e]));

for (const [id, expConfirmed, expUsd] of EXPECTED) {
  const ev = byId.get(id);
  if (!ev) {
    fail.push(`${id}: NOT FOUND in prod`);
    continue;
  }
  if (expConfirmed !== null && Number(ev.confirmed) !== expConfirmed) {
    fail.push(`${id}: confirmed=${ev.confirmed}, expected ${expConfirmed}`);
    continue;
  }
  if (expUsd !== null && Math.abs(Number(ev.usd) - expUsd) > 0.01) {
    fail.push(`${id}: usd=${ev.usd}, expected ${expUsd}`);
    continue;
  }
  ok.push(id);
}

console.log(`✓ ${ok.length}/${EXPECTED.length} events match expectations`);
if (fail.length > 0) {
  console.error(`\n✘ ${fail.length} failures:`);
  for (const f of fail) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('All smoke checks passed.');
