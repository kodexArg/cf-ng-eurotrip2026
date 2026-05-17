/** Brand color per city slug — used on markers, cards, and itinerary rows. */
export const CITY_COLORS: Record<string, string> = {
  madrid:    '#e8a74e',
  barcelona: '#e07b5a',
  palma:     '#f59e0b',
  londres:   '#5b7fb5',
  paris:     '#c1440e',
  roma:      '#c27ba0',
};

/** Icon greys for itinerary rows — darker = more important event. */
export const ICON_GREYS = {
  hito:           '#0f172a',
  transportIntra: '#94a3b8',
} as const;

/** Check-in / accommodation icon color — intense orange-red. */
export const ESTADIA_COLOR = '#ea580c';

/** Museum icon color — bordeaux wine, distinct from transports/food/parks. */
export const MUSEUM_COLOR = '#722F37';

/** Background and text colors per activity tipo — calendar chip palette. */
export const ACTIVITY_TIPO_COLORS: Record<string, { bg: string; text: string }> = {
  event:     { bg: '#fee2e2', text: '#b91c1c' },
  hotel:     { bg: '#ede9fe', text: '#7c3aed' },
  transport: { bg: '#f1f5f9', text: '#475569' },
  visit:     { bg: '#dbeafe', text: '#1d4ed8' },
  food:      { bg: '#fef3c7', text: '#92400e' },
  leisure:   { bg: '#d1fae5', text: '#065f46' },
};
