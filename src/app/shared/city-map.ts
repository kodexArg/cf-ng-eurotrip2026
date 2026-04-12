export const CITY_MAP: Record<string, { name: string; color: string }> = {
  madrid: { name: 'Madrid', color: '#e8a74e' },
  barcelona: { name: 'Barcelona', color: '#e07b5a' },
  paris: { name: 'París', color: '#7e8cc4' },
  venecia: { name: 'Venecia', color: '#0d9488' },
  roma: { name: 'Roma', color: '#c27ba0' },
};

export const CITY_SLUGS = ['madrid', 'barcelona', 'paris', 'venecia', 'roma'] as const;
export type CitySlug = typeof CITY_SLUGS[number];
