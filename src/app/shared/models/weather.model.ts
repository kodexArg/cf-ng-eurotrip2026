export interface DayWeather {
  date: string;       // YYYY-MM-DD
  tempMin: number;    // °C
  tempMax: number;    // °C
  weatherCode: number; // WMO code
  precipProb: number;  // 0-100
}

export interface CityWeather {
  citySlug: string;
  daily: DayWeather[];
}
