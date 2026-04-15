import { CITY_COLORS } from './theme/colors';

export const CITY_MAP: Record<string, { name: string; color: string }> = {
  madrid:    { name: 'Madrid',              color: CITY_COLORS['madrid'] },
  barcelona: { name: 'Barcelona',           color: CITY_COLORS['barcelona'] },
  palma:     { name: 'Palma de Mallorca',   color: CITY_COLORS['palma'] },
  londres:   { name: 'Londres',             color: CITY_COLORS['londres'] },
  paris:     { name: 'París',               color: CITY_COLORS['paris'] },
  roma:      { name: 'Roma',                color: CITY_COLORS['roma'] },
};
