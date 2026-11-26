export interface DayWeather {
  date: string;
  tempMin: number;
  tempMax: number;
  weatherCode: number;
  precipProb: number;
}

export interface CityWeather {
  citySlug: string;
  daily: DayWeather[];
}
