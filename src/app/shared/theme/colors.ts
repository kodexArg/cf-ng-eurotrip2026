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

/** Background and text colors per activity tipo — calendar chip palette. */
export const ACTIVITY_TIPO_COLORS: Record<string, { bg: string; text: string }> = {
  event:     { bg: 'rgba(255,255,255,0.75)', text: '#f87171' },
  hotel:     { bg: 'rgba(255,255,255,0.75)', text: '#a78bfa' },
  transport: { bg: 'rgba(255,255,255,0.75)', text: '#94a3b8' },
  visit:     { bg: 'rgba(255,255,255,0.75)', text: '#60a5fa' },
  food:      { bg: 'rgba(255,255,255,0.75)', text: '#fbbf24' },
  leisure:   { bg: 'rgba(255,255,255,0.75)', text: '#34d399' },
};
