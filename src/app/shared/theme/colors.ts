/** Brand color per city slug — used on markers, cards, and itinerary rows. */
export const CITY_COLORS: Record<string, string> = {
  madrid:    '#e8a74e',
  barcelona: '#e07b5a',
  palma:     '#f59e0b',
  londres:   '#5b7fb5',
  paris:     '#c1440e',
  roma:      '#c27ba0',
};

/** Accent color per event type — drives icon and text tint in itinerary rows. */
export const EVENT_TYPE_COLORS: Record<string, string> = {
  hito:    '#f59e0b',
  estadia: '#c2410c',
};

/** Background and text colors per activity tipo — calendar chip palette. */
export const ACTIVITY_TIPO_COLORS: Record<string, { bg: string; text: string }> = {
  event:     { bg: 'rgba(255,255,255,0.25)', text: '#f87171' },
  hotel:     { bg: 'rgba(255,255,255,0.25)', text: '#a78bfa' },
  transport: { bg: 'rgba(241,245,249,0.25)', text: '#94a3b8' },
  visit:     { bg: 'rgba(239,246,255,0.25)', text: '#60a5fa' },
  food:      { bg: 'rgba(254,243,199,0.25)', text: '#fbbf24' },
  leisure:   { bg: 'rgba(240,253,244,0.25)', text: '#34d399' },
};
