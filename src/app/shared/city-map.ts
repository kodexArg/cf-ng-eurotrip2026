import { CITY_SLUGS } from './constants/cities';

export const CITY_MAP: Record<string, { name: string; color: string }> = {
  [CITY_SLUGS.MADRID]:    { name: 'Madrid',           color: '#e8a74e' },
  [CITY_SLUGS.BARCELONA]: { name: 'Barcelona',        color: '#e07b5a' },
  [CITY_SLUGS.PALMA]:     { name: 'Palma de Mallorca', color: '#f59e0b' },
  [CITY_SLUGS.LONDRES]:   { name: 'Londres',          color: '#5b7fb5' },
  [CITY_SLUGS.PARIS]:     { name: 'París',            color: '#c1440e' },
  [CITY_SLUGS.ROMA]:      { name: 'Roma',             color: '#c27ba0' },
};
