import { City } from '../shared/models';

/**
 * Retorna el color sólido de la ciudad para una fecha dada.
 * Intervalo inclusivo [arrival, departure] — el gradient tiene prioridad en días de viaje.
 */
export function getDayColorFromCities(dateStr: string, cities: City[]): string | null {
  for (const city of cities) {
    if (dateStr >= city.arrival && dateStr <= city.departure) {
      return city.color;
    }
  }
  return null;
}

/**
 * Retorna un CSS linear-gradient para días de viaje entre dos ciudades.
 * Un día de viaje es aquel donde cityA.departure === cityB.arrival === dateStr.
 */
export function getTravelGradientFromCities(dateStr: string, cities: City[]): string | null {
  for (let i = 0; i < cities.length - 1; i++) {
    const from = cities[i];
    const to   = cities[i + 1];
    if (from.departure === dateStr && to.arrival === dateStr) {
      return `linear-gradient(135deg, ${from.color} 50%, ${to.color} 50%)`;
    }
  }
  return null;
}

export function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
