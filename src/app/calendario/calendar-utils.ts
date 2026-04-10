const CITY_DATE_RANGES = [
  { slug: 'madrid',    color: '#e8a74e', start: '2026-04-20', end: '2026-04-23' },
  { slug: 'barcelona', color: '#e07b5a', start: '2026-04-24', end: '2026-04-29' },
  { slug: 'paris',     color: '#7e8cc4', start: '2026-04-30', end: '2026-05-01' },
  { slug: 'venecia',   color: '#0d9488', start: '2026-05-02', end: '2026-05-03' },
  { slug: 'roma',      color: '#c27ba0', start: '2026-05-04', end: '2026-05-09' },
];

const TRAVEL_DAYS: Record<string, { from: string; to: string }> = {
  '2026-04-24': { from: '#e8a74e', to: '#e07b5a' },
  '2026-04-30': { from: '#e07b5a', to: '#7e8cc4' },
  '2026-05-02': { from: '#7e8cc4', to: '#0d9488' },
  '2026-05-04': { from: '#0d9488', to: '#c27ba0' },
};

export function getDayColor(dateStr: string): string | null {
  for (const range of CITY_DATE_RANGES) {
    if (dateStr >= range.start && dateStr <= range.end) return range.color;
  }
  return null;
}

export function getTravelGradient(dateStr: string): string | null {
  const travel = TRAVEL_DAYS[dateStr];
  if (!travel) return null;
  return `linear-gradient(135deg, ${travel.from} 50%, ${travel.to} 50%)`;
}

export function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
