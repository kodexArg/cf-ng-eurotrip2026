#!/usr/bin/env python3
"""
generate_osrm_waypoints.py
Fetches real road/cycling routes from OSRM public API for bus, metro, and cycling
traslados, then outputs a SQL migration with waypoints arrays.

Usage:
    python3 scripts/generate_osrm_waypoints.py
    # or:
    uv run scripts/generate_osrm_waypoints.py

APIs used:
  - OSRM public: router.project-osrm.org (driving profile for bus/metro, cycling for bikes)
    Metro routes use driving as road-network approximation (no free transit routing API).

Output: migrations/0089_osrm_waypoints.sql
"""

import json
import time
import urllib.request
import urllib.error
from typing import NamedTuple

OSRM_BASE = "https://router.project-osrm.org/route/v1"
OUTPUT_FILE = "migrations/0089_osrm_waypoints.sql"
SAMPLE_STEP = 4   # keep every Nth point from OSRM response (reduces D1 payload)


class Route(NamedTuple):
    event_id: str
    name: str
    from_lat: float
    from_lon: float
    to_lat: float
    to_lon: float
    profile: str = "driving"  # driving | cycling | walking


ROUTES: list[Route] = [
    # ── BUS ──────────────────────────────────────────────────────────────────
    Route(
        "ev-tol-apr22-bus-l5",
        "Toledo bus L5 · Estación RENFE → Zocodover",
        39.8632, -4.0168, 39.8583, -4.0240,
        "driving",
    ),
    Route(
        "ev-leg-mad-t4-cibeles-night",
        "Bus Exprés · MAD T4 → Cibeles (May 9 noche)",
        40.4936, -3.5668, 40.4203, -3.6936,
        "driving",
    ),
    Route(
        "ev-leg-mad-cibeles-t4-dawn",
        "Bus Exprés · Cibeles → MAD T4 (May 10 madrugada)",
        40.4203, -3.6936, 40.4936, -3.5668,
        "driving",
    ),

    # ── METRO Madrid ─────────────────────────────────────────────────────────
    # Rutas muy cortas (2-5 estaciones) — OSRM driving sobre red viaria,
    # aproximación razonable para display en mapa.
    Route(
        "ev-leg-mad-apr21-metro-cibeles",
        "Madrid Metro L1+L2 · Antón Martín → Banco de España",
        40.4110, -3.6990, 40.4200, -3.6945,
        "driving",
    ),
    Route(
        "ev-leg-mad-apr21-metro-legazpi",
        "Madrid Metro L3 · Lavapiés → Legazpi",
        40.4089, -3.7025, 40.3912, -3.6945,
        "driving",
    ),
    Route(
        "ev-mad-apr22-metro-prado-sol",
        "Madrid Metro L2 · Banco de España → Sol",
        40.4197, -3.6945, 40.4168, -3.7038,
        "driving",
    ),
    Route(
        "ev-leg-mad-apr23-metro-junco",
        "Madrid Metro L3 · Lavapiés → Alonso Martínez",
        40.4089, -3.7025, 40.4262, -3.6963,
        "driving",
    ),

    # ── METRO París ──────────────────────────────────────────────────────────
    # GdN → alojamiento (5 rue de Bruxelles, 9ème — coords 0088)
    Route(
        "ev-leg-par-gdn-hotel",
        "París Métro · Gare du Nord → 5 rue de Bruxelles",
        48.8809, 2.3553, 48.8835, 2.3315,
        "driving",
    ),
    # Hotel → Louvre (Métro L1)
    Route(
        "ev-leg-par-hotel-louvre",
        "París Métro L1 · alojamiento → Louvre",
        48.8835, 2.3315, 48.8606, 2.3376,
        "driving",
    ),
    # Métro 14 Pyramides → Orly (larga, 30 min)
    Route(
        "ev-leg-par-metro14-ory",
        "París Métro 14 · Pyramides → Orly",
        48.8638, 2.3362, 48.7264, 2.3719,
        "driving",
    ),

    # ── METRO Barcelona ──────────────────────────────────────────────────────
    Route(
        "ev-leg-bcn-apr24-metro-sants-paralel",
        "BCN L3 · Sants → Paral·lel",
        41.3791, 2.1406, 41.3746, 2.1645,
        "driving",
    ),
    Route(
        "ev-leg-bcn-apr24-metro-poblesec-graciapg",
        "BCN L3 · Paral·lel → Passeig de Gràcia",
        41.3746, 2.1645, 41.3917, 2.1649,
        "driving",
    ),
    Route(
        "ev-leg-bcn-apr24-metro-born-poblesec",
        "BCN L4+L3 · Jaume I → Paral·lel",
        41.3839, 2.1788, 41.3746, 2.1645,
        "driving",
    ),
    Route(
        "ev-leg-bcn-apr25-metro-graciapg",
        "BCN L3 · Eixample/Raval → Pl. Espanya",
        41.3860, 2.1680, 41.3751, 2.1487,
        "driving",
    ),
    Route(
        "ev-leg-bcn-apr25-metro-montjuic",
        "BCN L3 · Pl. Espanya → Fundació Miró (Paral·lel + funicular)",
        41.3751, 2.1487, 41.3685, 2.1603,
        "driving",
    ),
    Route(
        "ev-leg-bcn-apr25-metro-jamboree",
        "BCN L3 · Pl. Espanya → Liceu",
        41.3751, 2.1487, 41.3806, 2.1738,
        "driving",
    ),
    Route(
        "ev-leg-bcn-apr25-metro-return",
        "BCN L3 · Liceu → Paral·lel",
        41.3806, 2.1738, 41.3746, 2.1645,
        "driving",
    ),
    Route(
        "ev-leg-bcn-apr26-metro-lesseps",
        "BCN L3 · Paral·lel → Lesseps",
        41.3746, 2.1645, 41.4035, 2.1489,
        "driving",
    ),
    Route(
        "ev-leg-bcn-apr26-metro-back",
        "BCN L3 · Diagonal → Paral·lel",
        41.3945, 2.1620, 41.3746, 2.1645,
        "driving",
    ),
    Route(
        "ev-leg-bcn-apr27-metro-jaumei",
        "BCN L3+L4 · Paral·lel → Jaume I",
        41.3746, 2.1645, 41.3839, 2.1788,
        "driving",
    ),
    Route(
        "ev-leg-bcn-apr27-metro-sagrada",
        "BCN L5 · Universitat → Sagrada Família",
        41.3870, 2.1648, 41.4036, 2.1744,
        "driving",
    ),
    Route(
        "ev-leg-bcn-apr27-metro-bunkers",
        "BCN L5 · Sagrada Família → Alfons X (→ Bunkers)",
        41.4036, 2.1744, 41.4154, 2.1648,
        "driving",
    ),
    Route(
        "ev-leg-bcn-apr27-metro-harlem",
        "BCN L5+L6 · Guinardó → Muntaner → Paral·lel",
        41.4171, 2.1709, 41.3746, 2.1645,
        "driving",
    ),
]


def decode_polyline6(encoded: str) -> list[tuple[float, float]]:
    """Decode OSRM polyline6 (precision 1e6) to list of (lat, lon)."""
    points: list[tuple[float, float]] = []
    index = 0
    lat = 0
    lon = 0
    while index < len(encoded):
        for coord_idx in range(2):
            result = 0
            shift = 0
            while True:
                b = ord(encoded[index]) - 63
                index += 1
                result |= (b & 0x1F) << shift
                shift += 5
                if b < 0x20:
                    break
            delta = ~(result >> 1) if result & 1 else result >> 1
            if coord_idx == 0:
                lat += delta
            else:
                lon += delta
        points.append((lat / 1e6, lon / 1e6))
    return points


def sample_points(pts: list[tuple[float, float]], step: int) -> list[tuple[float, float]]:
    """Keep every `step`-th point, always including first and last."""
    if len(pts) <= 2:
        return pts
    sampled = pts[::step]
    if sampled[-1] != pts[-1]:
        sampled.append(pts[-1])
    return sampled


def fetch_osrm(route: Route) -> list[tuple[float, float]] | None:
    """Call OSRM and return sampled waypoints, or None on failure."""
    # OSRM uses lon,lat order
    coords = f"{route.from_lon},{route.from_lat};{route.to_lon},{route.to_lat}"
    url = f"{OSRM_BASE}/{route.profile}/{coords}?overview=full&geometries=polyline6"

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "eurotrip2026-waypoints/1.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read())
    except Exception as e:
        print(f"  ERROR fetching {route.event_id}: {e}")
        return None

    if data.get("code") != "Ok" or not data.get("routes"):
        print(f"  OSRM error for {route.event_id}: {data.get('code')}")
        return None

    encoded = data["routes"][0]["geometry"]
    pts = decode_polyline6(encoded)
    sampled = sample_points(pts, SAMPLE_STEP)
    return sampled


def main() -> None:
    lines: list[str] = [
        "-- 0089_osrm_waypoints.sql",
        "-- Waypoints reales para traslados bus/metro/bici generados con OSRM public API.",
        "-- Perfil driving para bus y metro (aproximación red viaria urbana).",
        "-- Script: scripts/generate_osrm_waypoints.py",
        "",
    ]

    ok = 0
    fail = 0

    for route in ROUTES:
        print(f"→ {route.name}")
        pts = fetch_osrm(route)
        time.sleep(0.5)  # respect OSRM public rate limits

        if pts is None or len(pts) < 2:
            print(f"  SKIP (no valid route)")
            lines.append(f"-- SKIP {route.event_id}: no valid route from OSRM")
            fail += 1
            continue

        wp_json = json.dumps([[round(lat, 6), round(lon, 6)] for lat, lon in pts])
        lines.append(f"-- {route.name} ({len(pts)} pts sampled)")
        lines.append(
            f"UPDATE events SET waypoints = '{wp_json}' WHERE id = '{route.event_id}';"
        )
        lines.append("")
        print(f"  OK — {len(pts)} points")
        ok += 1

    with open(OUTPUT_FILE, "w") as f:
        f.write("\n".join(lines))

    print(f"\nDone: {ok} OK, {fail} failed → {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
