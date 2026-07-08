
export interface DailyForecast {
  time: string[];
  tempMax: number[];
  tempMin: number[];
  rainProb: number[];
  weatherCode: number[];
}

export interface WeatherData {
  temp: number;
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainProb: number;
  isDay: boolean;
  city?: string;
  weatherCode: number;
  daily: DailyForecast;
}

export const getWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    // Timeout aumentado para 15s para garantir funcionamento em 3G/4G instável
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      temp: data.current.temperature_2m,
      tempMax: data.daily.temperature_2m_max[0],
      tempMin: data.daily.temperature_2m_min[0],
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      rainProb: data.daily.precipitation_probability_max[0],
      isDay: data.current.is_day === 1,
      weatherCode: data.current.weather_code,
      daily: {
        time: data.daily.time,
        tempMax: data.daily.temperature_2m_max,
        tempMin: data.daily.temperature_2m_min,
        rainProb: data.daily.precipitation_probability_max,
        weatherCode: data.daily.weather_code
      }
    };
  } catch (error) {
    console.warn("Weather fetch failed (offline or timeout). Using cached data if available via SW.");
    return null; 
  }
};
