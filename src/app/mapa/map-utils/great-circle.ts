/**
 * Returns N+1 equally-spaced points along the great-circle arc from p1 to p2.
 * Uses spherical linear interpolation (slerp) — Earth is round.
 */
export function greatCirclePoints(
  p1: [number, number],
  p2: [number, number],
  n = 80
): [number, number][] {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const lat1 = toRad(p1[0]), lon1 = toRad(p1[1]);
  const lat2 = toRad(p2[0]), lon2 = toRad(p2[1]);

  const x1 = Math.cos(lat1) * Math.cos(lon1);
  const y1 = Math.cos(lat1) * Math.sin(lon1);
  const z1 = Math.sin(lat1);

  const x2 = Math.cos(lat2) * Math.cos(lon2);
  const y2 = Math.cos(lat2) * Math.sin(lon2);
  const z2 = Math.sin(lat2);

  const dot = Math.min(1, x1 * x2 + y1 * y2 + z1 * z2);
  const d = Math.acos(dot);

  if (d < 1e-9) return [p1, p2];

  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const A = Math.sin((1 - t) * d) / Math.sin(d);
    const B = Math.sin(t * d) / Math.sin(d);
    const x = A * x1 + B * x2;
    const y = A * y1 + B * y2;
    const z = A * z1 + B * z2;
    const lat = toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)));
    const lon = toDeg(Math.atan2(y, x));
    pts.push([lat, lon]);
  }
  return pts;
}
