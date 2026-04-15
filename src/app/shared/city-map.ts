import { CITY_COLORS } from './theme/colors';
import { CITY_SLUGS } from './constants/cities';

export const CITY_MAP: Record<string, { name: string; color: string }> = {
  [CITY_SLUGS.MADRID]:    { name: 'Madrid',             color: CITY_COLORS[CITY_SLUGS.MADRID] },
  [CITY_SLUGS.BARCELONA]: { name: 'Barcelona',          color: CITY_COLORS[CITY_SLUGS.BARCELONA] },
  [CITY_SLUGS.PALMA]:     { name: 'Palma de Mallorca',  color: CITY_COLORS[CITY_SLUGS.PALMA] },
  [CITY_SLUGS.LONDRES]:   { name: 'Londres',            color: CITY_COLORS[CITY_SLUGS.LONDRES] },
  [CITY_SLUGS.PARIS]:     { name: 'París',              color: CITY_COLORS[CITY_SLUGS.PARIS] },
  [CITY_SLUGS.ROMA]:      { name: 'Roma',               color: CITY_COLORS[CITY_SLUGS.ROMA] },
};
