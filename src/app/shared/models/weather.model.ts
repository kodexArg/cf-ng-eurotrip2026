export interface DayWeather {
  date: string;          // ISO date string YYYY-MM-DD
  tempMin: number;       // °C
  tempMax: number;       // °C
  weatherCode: number;   // WMO weather code from Open-Meteo
  precipProb: number;    // precipitation probability 0-100
}

export interface CityWeather {
  citySlug: string;
  daily: DayWeather[];
}
