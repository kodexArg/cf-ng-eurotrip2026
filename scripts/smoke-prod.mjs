#!/usr/bin/env node
const HOSTS = (process.env.SMOKE_HOSTS || 'https://eurotrip2026.kodexarg.com,https://eurotrip2026.pages.dev').split(',');
const PATHS = ['/', '/api/itinerary', '/api/photos', '/api/auth/whoami', '/api/access-log'];
const FORGED = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IngifQ.eyJlbWFpbCI6ImdjYXZlZGFsQGdtYWlsLmNvbSJ9.c2ln';

const failures = [];

async function probe(host, path, method = 'GET', headers = {}) {
  const res = await fetch(`${host}${path}`, { method, headers, redirect: 'manual' });
  const location = res.headers.get('location') ?? '';
  const gated = (res.status >= 300 && res.status < 400 && location.includes('cloudflareaccess.com')) || res.status === 401 || res.status === 403;
  const line = `${method} ${host}${path}${headers['Cf-Access-Jwt-Assertion'] ? ' (forged JWT)' : ''} -> ${res.status}`;
  if (gated) console.log(`ok   ${line}`);
  else failures.push(line);
}

for (const host of HOSTS) {
  for (const path of PATHS) {
    await probe(host, path);
    await probe(host, path, 'GET', { 'Cf-Access-Jwt-Assertion': FORGED });
  }
  await probe(host, '/api/photos', 'POST', { 'Cf-Access-Jwt-Assertion': FORGED });
}

if (failures.length) {
  console.error(`\nUngated responses (${failures.length}):`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log('\nEvery probe was gated by Cloudflare Access or the Functions middleware.');
