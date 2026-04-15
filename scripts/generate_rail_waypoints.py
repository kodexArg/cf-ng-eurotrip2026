#!/usr/bin/env python3
"""
generate_rail_waypoints.py
Fetches real railway track geometry from Brouter (OSM-based routing) or Overpass API
and outputs a SQL migration with dense waypoints for train events.

Usage:
    python3 scripts/generate_rail_waypoints.py
"""

import json
import math
import time
import urllib.request
import urllib.error
import urllib.parse
from typing import NamedTuple


class Route(NamedTuple):
    event_id: str
    name: str
    from_lat: float
    from_lon: float
    to_lat: float
    to_lon: float
    # Optional: name pattern to search for in OSM relations (fallback)
    osm_relation_name: str | None = None
    # Bbox for named relation search (min_lat, min_lon, max_lat, max_lon)
    osm_search_bbox: tuple[float, float, float, float] | None = None
    # Optional: hardcoded waypoints (skips all API calls)
    hardcoded_waypoints: list[tuple[float, float]] | None = None


# AVANT Madrid-Toledo: manual waypoints following LAV spur geometry
# The line exits Atocha heading south on the LAV Madrid-Sevilla, then branches
# WSW at km~65 toward Toledo. Source: OSM/geographic knowledge.
_AVANT_ATOCHA_TOLEDO = [
    (40.4065, -3.6890),  # Madrid Puerta de Atocha
    (40.3880, -3.6905),  # Delicias/Embajadores - heading south
    (40.3400, -3.6920),  # Villaverde - entering HSL
    (40.2970, -3.6975),  # Getafe/Valdemoro corridor
    (40.2510, -3.7050),  # Ciempozuelos approach
    (40.1950, -3.7250),  # LAV km ~60 South Ciempozuelos
    (40.1300, -3.7600),  # Junction zone - spur branches toward Toledo
    (40.0720, -3.8100),  # WSW approach toward Toledo
    (40.0040, -3.8780),  # La Guardia / Cobisa approach
    (39.9520, -3.9380),  # Olías del Rey area
    (39.9070, -3.9860),  # Final approach Toledo
    (39.8617, -4.0264),  # Toledo (Estación AVE)
]

ROUTES = [
    Route("ev-leg-lon-par",        "Eurostar London→Paris",
          51.5308, -0.1252,  48.8810,  2.3553),
    Route("ev-leg-stn-lon",        "Stansted Express STN→Liverpool St",
          51.8860,  0.2389,  51.5184, -0.0811),
    # Leonardo Express: FCO Aeroporto → Roma Termini
    # 78 pts from OSM via Overpass named relation "Leonardo Express (Fiumicino Aeroporto)"
    # Cached here to avoid Overpass timeouts on re-runs
    Route("ev-leg-leo-express",    "Leonardo Express FCO→Roma Termini",
          41.7985, 12.2562,  41.9009, 12.4983,
          hardcoded_waypoints=[
            (41.793427,12.251913),(41.793395,12.251945),(41.789953,12.255265),
            (41.786828,12.258291),(41.785058,12.262285),(41.786696,12.266578),
            (41.788647,12.271183),(41.790494,12.275336),(41.792472,12.279763),
            (41.794342,12.283973),(41.796234,12.288203),(41.798316,12.292891),
            (41.800224,12.297172),(41.80227,12.301775),(41.804379,12.306404),
            (41.806424,12.311065),(41.808474,12.315735),(41.810579,12.320461),
            (41.812679,12.325199),(41.814551,12.329394),(41.816502,12.333927),
            (41.81803,12.338413),(41.818423,12.343449),(41.817914,12.348504),
            (41.817365,12.353762),(41.816932,12.358643),(41.818131,12.363253),
            (41.819661,12.36793),(41.821252,12.372843),(41.822314,12.377871),
            (41.822766,12.382667),(41.822869,12.387593),(41.821789,12.392651),
            (41.821103,12.397463),(41.822876,12.403277),(41.82443,12.407701),
            (41.826275,12.412746),(41.82848,12.416817),(41.831235,12.420404),
            (41.833766,12.423989),(41.834368,12.428771),(41.834096,12.433775),
            (41.833859,12.438857),(41.833715,12.443726),(41.835663,12.447744),
            (41.838872,12.450026),(41.842082,12.452261),(41.845374,12.454414),
            (41.849052,12.455357),(41.8527,12.456053),(41.856349,12.457039),
            (41.859449,12.460484),(41.862521,12.462889),(41.866012,12.462344),
            (41.869326,12.460674),(41.871933,12.463546),(41.872344,12.468564),
            (41.872759,12.473681),(41.873176,12.478565),(41.872674,12.483847),
            (41.871601,12.490941),(41.870903,12.49575),(41.870888,12.501141),
            (41.87147,12.505887),(41.874315,12.508801),(41.876375,12.512675),
            (41.876707,12.517505),(41.878275,12.521794),(41.880864,12.52543),
            (41.884349,12.526622),(41.887608,12.524608),(41.889909,12.520356),
            (41.892016,12.516289),(41.894364,12.511946),(41.896657,12.507925),
            (41.900017,12.502065),(41.900147,12.501845),(41.900177,12.501794),
          ]),
    # RENFE Avant Madrid Atocha → Toledo (manual waypoints — Overpass times out)
    Route("ev-tol-apr22-avant-ida", "RENFE Avant Madrid Atocha→Toledo",
          40.4065, -3.6890,  39.8617, -4.0264,
          hardcoded_waypoints=_AVANT_ATOCHA_TOLEDO),
    Route("ev-tol-apr22-avant-vuelta", "RENFE Avant Toledo→Madrid Atocha",
          39.8617, -4.0264,  40.4065, -3.6890,
          hardcoded_waypoints=list(reversed(_AVANT_ATOCHA_TOLEDO))),
]

# Brouter endpoint — free, OSM-based, no API key needed
BROUTER_URL = "https://brouter.de/brouter"
BROUTER_PROFILE = "rail"

# Overpass API endpoint
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# Downsample: keep one point every N meters (lower = more points = smoother)
SAMPLE_EVERY_M = 400


def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Distance in meters between two lat/lon points."""
    R = 6_371_000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def fetch_url(url: str, data: bytes | None = None, label: str = "") -> dict | None:
    """Fetch URL and return parsed JSON, or None on error."""
    try:
        headers = {"User-Agent": "eurotrip2026-waypoints/1.0"}
        if data:
            req = urllib.request.Request(url, data=data, headers=headers, method="POST")
        else:
            req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:500] if e.fp else ""
        print(f"  ERROR HTTP {e.code}: {e.reason} {label}")
        if body:
            print(f"  Body: {body[:200]}")
        return None
    except Exception as e:
        print(f"  ERROR: {e} {label}")
        return None


def fetch_brouter(route: Route) -> list[tuple[float, float]] | None:
    """Call Brouter API and return list of (lat, lon) pairs."""
    lonlats = f"{route.from_lon},{route.from_lat}|{route.to_lon},{route.to_lat}"
    url = f"{BROUTER_URL}?lonlats={lonlats}&profile={BROUTER_PROFILE}&alternativeidx=0&format=geojson"
    print(f"  Brouter: {url}")
    data = fetch_url(url, label="[Brouter]")
    if not data:
        return None
    try:
        coords = data["features"][0]["geometry"]["coordinates"]
        return [(c[1], c[0]) for c in coords]
    except (KeyError, IndexError) as e:
        print(f"  ERROR parsing Brouter response: {e}")
        return None


def fetch_overpass_named_relation(
    name_pattern: str,
    bbox: tuple[float, float, float, float],
    from_lat: float, from_lon: float,
    to_lat: float, to_lon: float,
) -> list[tuple[float, float]] | None:
    """
    Find a railway route relation by name pattern within a bbox,
    then extract and order its geometry from origin to destination.
    """
    min_lat, min_lon, max_lat, max_lon = bbox
    query = f"""
[out:json][timeout:60];
(
  relation["route"~"train|light_rail"]["name"~"{name_pattern}",i]({min_lat},{min_lon},{max_lat},{max_lon});
  relation["route"~"train|light_rail"]["ref"~"{name_pattern}",i]({min_lat},{min_lon},{max_lat},{max_lon});
);
out body;
>;
out skel qt;
"""
    print(f"  Overpass named relation '{name_pattern}' in {bbox}...")
    data = fetch_url(
        OVERPASS_URL,
        data=urllib.parse.urlencode({"data": query}).encode(),
        label="[Overpass named]"
    )
    if not data:
        return None

    # Two-pass: nodes appear AFTER ways
    nodes: dict[int, tuple[float, float]] = {}
    raw_ways: dict[int, list[int]] = {}
    relations = []

    for el in data.get("elements", []):
        if el["type"] == "node":
            nodes[el["id"]] = (el["lat"], el["lon"])
        elif el["type"] == "way":
            raw_ways[el["id"]] = el.get("nodes", [])
        elif el["type"] == "relation":
            relations.append(el)

    if not relations:
        print(f"  No relations found matching '{name_pattern}'")
        return None

    print(f"  Found {len(relations)} relation(s): {[r.get('tags', {}).get('name', r['id']) for r in relations]}")

    # Use the first relation (or best match by checking which has more ways near our route)
    best_relation = relations[0]
    if len(relations) > 1:
        # Pick the one whose member ways are closest to our route midpoint
        mid_lat = (from_lat + to_lat) / 2
        mid_lon = (from_lon + to_lon) / 2
        best_dist = float("inf")
        for rel in relations:
            way_members = [m["ref"] for m in rel.get("members", []) if m.get("type") == "way"]
            for way_id in way_members[:3]:  # check first 3 ways
                if way_id in raw_ways:
                    for node_id in raw_ways[way_id][:1]:
                        if node_id in nodes:
                            n = nodes[node_id]
                            d = haversine_m(n[0], n[1], mid_lat, mid_lon)
                            if d < best_dist:
                                best_dist = d
                                best_relation = rel

    # Get all way IDs in this relation
    way_ids = [m["ref"] for m in best_relation.get("members", []) if m.get("type") == "way"]
    print(f"  Using relation '{best_relation.get('tags', {}).get('name', best_relation['id'])}' with {len(way_ids)} ways")

    way_segments = []
    for way_id in way_ids:
        if way_id in raw_ways:
            pts = [nodes[n] for n in raw_ways[way_id] if n in nodes]
            if pts:
                way_segments.append(pts)

    if not way_segments:
        print(f"  ERROR: no usable way segments")
        return None

    # Chain segments into a continuous path
    path = list(way_segments[0])
    remaining = way_segments[1:]
    max_iterations = len(remaining) * 2
    iterations = 0

    while remaining and iterations < max_iterations:
        iterations += 1
        path_end = path[-1]
        path_start = path[0]
        best_idx = None
        best_result: tuple[int, bool, bool] | None = None
        best_dist = float("inf")

        for i, seg in enumerate(remaining):
            for seg_pt, reverse in [(seg[0], False), (seg[-1], True)]:
                for ref_pt, prepend in [(path_end, False), (path_start, True)]:
                    d = haversine_m(seg_pt[0], seg_pt[1], ref_pt[0], ref_pt[1])
                    if d < best_dist:
                        best_dist = d
                        best_idx = i
                        best_result = (i, reverse, prepend)

        if best_idx is None or best_dist > 2000:
            for seg in remaining:
                path.extend(seg)
            break

        idx, reverse, prepend = best_result  # type: ignore
        seg = remaining.pop(idx)
        if reverse:
            seg = list(reversed(seg))
        if prepend:
            path = seg + path
        else:
            path = path + seg

    # Ensure path goes from origin to destination (not backwards)
    if path:
        dist_start = haversine_m(path[0][0], path[0][1], from_lat, from_lon)
        dist_end = haversine_m(path[-1][0], path[-1][1], from_lat, from_lon)
        if dist_end < dist_start:
            path = list(reversed(path))

    return path


def fetch_overpass_relation(relation_id: int) -> list[tuple[float, float]] | None:
    """
    Fetch OSM relation geometry and return ordered (lat, lon) path.
    Works by collecting all way members and ordering them into a continuous path.
    """
    query = f"""
[out:json][timeout:60];
relation({relation_id});
way(r);
(._; >;);
out body;
"""
    print(f"  Overpass relation {relation_id}: querying...")
    data = fetch_url(
        OVERPASS_URL,
        data=urllib.parse.urlencode({"data": query}).encode(),
        label="[Overpass]"
    )
    if not data:
        return None

    # Two-pass: nodes appear AFTER ways in Overpass output
    nodes: dict[int, tuple[float, float]] = {}
    raw_ways: dict[int, list[int]] = {}  # way_id -> [node_id, ...]

    for el in data.get("elements", []):
        if el["type"] == "node":
            nodes[el["id"]] = (el["lat"], el["lon"])
        elif el["type"] == "way":
            raw_ways[el["id"]] = el.get("nodes", [])

    ways = raw_ways  # now nodes are populated

    if not ways:
        print(f"  ERROR: no ways found in relation {relation_id}")
        return None

    print(f"  Found {len(ways)} ways, {len(nodes)} nodes")

    # Order ways into a connected path (chain them)
    way_segments = []
    for way_id, node_ids in ways.items():
        pts = [nodes[n] for n in node_ids if n in nodes]
        if pts:
            way_segments.append(pts)

    if not way_segments:
        return None

    # Greedy chain: start with first segment, keep appending the next matching one
    path = list(way_segments[0])
    remaining = way_segments[1:]

    max_iterations = len(remaining) * 2
    iterations = 0

    while remaining and iterations < max_iterations:
        iterations += 1
        path_end = path[-1]
        path_start = path[0]
        best_idx = None
        best_reverse = False
        best_dist = float("inf")

        for i, seg in enumerate(remaining):
            # Check all 4 connection possibilities
            for seg_pt, reverse in [(seg[0], False), (seg[-1], True)]:
                for ref_pt, prepend in [(path_end, False), (path_start, True)]:
                    d = haversine_m(seg_pt[0], seg_pt[1], ref_pt[0], ref_pt[1])
                    if d < best_dist:
                        best_dist = d
                        best_idx = i
                        best_reverse = reverse
                        best_prepend = prepend

        if best_idx is None or best_dist > 5000:  # 5km gap = discontinuous line
            # Just append remaining in order (likely a parallel line or separate segment)
            for seg in remaining:
                path.extend(seg)
            break

        seg = remaining.pop(best_idx)
        if best_reverse:
            seg = list(reversed(seg))

        if best_prepend:
            path = seg + path
        else:
            path = path + seg

    return path


def fetch_overpass_bbox(
    from_lat: float, from_lon: float,
    to_lat: float, to_lon: float,
    padding: float = 0.05
) -> list[tuple[float, float]] | None:
    """
    Fetch railway ways in bounding box and order into path from origin to destination.
    Fallback when no relation ID is available.
    """
    min_lat = min(from_lat, to_lat) - padding
    max_lat = max(from_lat, to_lat) + padding
    min_lon = min(from_lon, to_lon) - padding
    max_lon = max(from_lon, to_lon) + padding

    query = f"""
[out:json][timeout:60][maxsize:50000000];
(
  way["railway"~"^(rail|light_rail|narrow_gauge)$"]({min_lat},{min_lon},{max_lat},{max_lon});
);
out body;
>;
out skel qt;
"""
    print(f"  Overpass bbox [{min_lat:.3f},{min_lon:.3f},{max_lat:.3f},{max_lon:.3f}]...")
    data = fetch_url(
        OVERPASS_URL,
        data=urllib.parse.urlencode({"data": query}).encode(),
        label="[Overpass bbox]"
    )
    if not data:
        return None

    # Two-pass: nodes appear AFTER ways in Overpass output, so collect nodes first
    nodes: dict[int, tuple[float, float]] = {}
    raw_ways: list[list[int]] = []

    for el in data.get("elements", []):
        if el["type"] == "node":
            nodes[el["id"]] = (el["lat"], el["lon"])
        elif el["type"] == "way":
            raw_ways.append(el.get("nodes", []))

    ways: list[list[tuple[float, float]]] = []
    for node_ids in raw_ways:
        pts = [nodes[n] for n in node_ids if n in nodes]
        if pts:
            ways.append(pts)

    if not ways:
        print(f"  ERROR: no railway ways found in bbox (got {len(raw_ways)} raw ways, {len(nodes)} nodes)")
        return None

    print(f"  Found {len(ways)} railway ways")

    # Find the path from (from_lat, from_lon) to (to_lat, to_lon)
    # by finding the way closest to origin, then chaining toward destination
    all_points: list[tuple[float, float]] = []
    for way in ways:
        all_points.extend(way)

    # Find the point closest to origin
    origin_closest = min(all_points, key=lambda p: haversine_m(p[0], p[1], from_lat, from_lon))
    dest_closest = min(all_points, key=lambda p: haversine_m(p[0], p[1], to_lat, to_lon))

    print(f"  Origin snap: {origin_closest} (dist: {haversine_m(origin_closest[0], origin_closest[1], from_lat, from_lon):.0f}m)")
    print(f"  Dest snap: {dest_closest} (dist: {haversine_m(dest_closest[0], dest_closest[1], to_lat, to_lon):.0f}m)")

    # Simple approach: collect all points in the bbox and sort by distance from a direction vector
    # This is imperfect but works for relatively straight routes
    from_vec = (from_lat, from_lon)
    to_vec = (to_lat, to_lon)

    # Project each point onto the origin→destination axis
    dlat = to_lat - from_lat
    dlon = to_lon - from_lon
    length = math.sqrt(dlat * dlat + dlon * dlon)

    def project(p: tuple[float, float]) -> float:
        return ((p[0] - from_lat) * dlat + (p[1] - from_lon) * dlon) / (length * length)

    # Filter points that are "between" origin and destination (projection 0..1 with margin)
    filtered = [p for p in all_points if -0.1 <= project(p) <= 1.1]
    filtered.sort(key=project)

    # Downsample to remove duplicates (points closer than 50m)
    deduped = [filtered[0]] if filtered else []
    for p in filtered[1:]:
        if haversine_m(p[0], p[1], deduped[-1][0], deduped[-1][1]) > 50:
            deduped.append(p)

    return deduped if len(deduped) > 2 else None


def downsample(points: list[tuple[float, float]], every_m: float) -> list[tuple[float, float]]:
    """Reduce point density to roughly one point per every_m meters."""
    if not points:
        return []
    result = [points[0]]
    accumulated = 0.0
    for i in range(1, len(points)):
        prev = points[i - 1]
        curr = points[i]
        accumulated += haversine_m(prev[0], prev[1], curr[0], curr[1])
        if accumulated >= every_m or i == len(points) - 1:
            result.append(curr)
            accumulated = 0.0
    return result


def format_waypoints_json(points: list[tuple[float, float]]) -> str:
    pairs = [[round(lat, 6), round(lon, 6)] for lat, lon in points]
    return json.dumps(pairs, separators=(",", ":"))


def escape_sql_string(s: str) -> str:
    return s.replace("'", "''")


def fetch_route(route: Route) -> list[tuple[float, float]] | None:
    """Try hardcoded first, then Brouter, then Overpass named relation, then bbox."""
    # Use hardcoded waypoints if provided (skips all API calls)
    if route.hardcoded_waypoints:
        print(f"  Using hardcoded waypoints ({len(route.hardcoded_waypoints)} pts)")
        return list(route.hardcoded_waypoints)

    # Try Brouter
    pts = fetch_brouter(route)
    if pts:
        return pts

    print(f"  Brouter failed, trying Overpass fallback...")

    # Try Overpass named relation search
    if route.osm_relation_name and route.osm_search_bbox:
        pts = fetch_overpass_named_relation(
            route.osm_relation_name, route.osm_search_bbox,
            route.from_lat, route.from_lon, route.to_lat, route.to_lon
        )
        if pts:
            return pts

    # Last resort: raw bbox (unreliable for complex rail networks)
    pts = fetch_overpass_bbox(route.from_lat, route.from_lon, route.to_lat, route.to_lon)
    return pts


def main():
    migration_lines = [
        "-- Rail waypoints from OpenStreetMap via Brouter/Overpass API",
        "-- Generated by: python3 scripts/generate_rail_waypoints.py",
        "-- Profile: rail | Sample interval: ~400m",
        "",
    ]

    total_routes = len(ROUTES)
    success = 0

    for i, route in enumerate(ROUTES, 1):
        print(f"\n[{i}/{total_routes}] {route.name}")

        raw_points = fetch_route(route)
        if raw_points is None:
            print(f"  SKIP: could not fetch route from any source")
            migration_lines.append(f"-- SKIP {route.event_id}: all sources failed")
            migration_lines.append("")
            if i < total_routes:
                time.sleep(1)
            continue

        print(f"  Raw points: {len(raw_points)}")

        # Downsample (keep first and last exact)
        origin = raw_points[0]
        destination = raw_points[-1]
        intermediate = raw_points[1:-1]
        sampled = downsample(intermediate, SAMPLE_EVERY_M)
        final_points = [origin] + sampled + [destination]

        print(f"  Downsampled: {len(final_points)} points (~{SAMPLE_EVERY_M}m interval)")

        total_dist = sum(
            haversine_m(final_points[j][0], final_points[j][1],
                        final_points[j+1][0], final_points[j+1][1])
            for j in range(len(final_points) - 1)
        )
        print(f"  Route length: ~{total_dist/1000:.1f} km")

        waypoints_json = format_waypoints_json(final_points)
        migration_lines.append(f"-- {route.name} ({len(final_points)} pts, ~{total_dist/1000:.0f}km)")
        migration_lines.append(
            f"UPDATE events SET waypoints = '{escape_sql_string(waypoints_json)}' "
            f"WHERE id = '{route.event_id}';"
        )
        migration_lines.append("")
        success += 1

        if i < total_routes:
            time.sleep(1.5)

    # Print migration SQL
    print("\n" + "=" * 60)
    print("MIGRATION SQL OUTPUT")
    print("=" * 60)
    sql_output = "\n".join(migration_lines)
    print(sql_output)
    print("=" * 60)
    print(f"\nDone: {success}/{total_routes} routes fetched successfully")

    if success > 0:
        import os
        migration_dir = os.path.join(os.path.dirname(__file__), "..", "migrations")
        existing = sorted(
            f for f in os.listdir(migration_dir)
            if f.endswith(".sql") and f[:4].isdigit()
        )
        last_num = int(existing[-1][:4]) if existing else 0
        next_num = f"{last_num + 1:04d}"
        filename = f"{next_num}_rail_waypoints_osm.sql"
        filepath = os.path.join(migration_dir, filename)

        with open(filepath, "w") as f:
            f.write(sql_output + "\n")

        print(f"\nMigration written to: migrations/{filename}")
        print(f"\nApply with:")
        print(f"  npx wrangler d1 execute eurotrip2026 --remote --file=migrations/{filename}")


if __name__ == "__main__":
    main()
