
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Loader2,
  CloudRain,
  Droplets,
  Wind,
  TrendingUp,
  TrendingDown,
  CloudSun,
  RefreshCw
} from 'lucide-react';
import { getWeather } from '../services/weatherService';

interface WeatherState {
  temp: number;
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainProb: number;
}

// Fallback para Sandton (Joanesburgo) se GPS falhar
const FALLBACK_LAT = -26.1076;
const FALLBACK_LON = 28.0567;
const FALLBACK_NAME = "SANDTON (GPS OFF)";

interface WeatherCardHomeProps {
  lat?: number;
  lon?: number;
  locationNameHint?: string;
}

const WeatherCardHome: React.FC<WeatherCardHomeProps> = ({ lat, lon, locationNameHint }) => {
  const [locationName, setLocationName] = useState<string>('LOCALIZANDO...');
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (targetLat: number, targetLon: number, customName?: string) => {
    try {
      // 1. Tentar obter nome do local (Nominatim)
      if (customName) {
        setLocationName(customName.toUpperCase());
      } else if (locationNameHint) {
        setLocationName(locationNameHint.toUpperCase());
      } else {
        try {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 3000);
          
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${targetLat}&lon=${targetLon}&zoom=12`, { signal: controller.signal });
          if (response.ok) {
            const data = await response.json();
            const place = data.address.city || data.address.town || data.address.suburb || data.address.village || "LOCAL";
            setLocationName(place.toUpperCase());
          } else {
            setLocationName("DESTINO");
          }
        } catch {
          setLocationName("COORDENADAS");
        }
      }

      // 2. Obter clima (OpenMeteo)
      const wData = await getWeather(targetLat, targetLon);
      if (wData) {
        setWeather({
          temp: wData.temp,
          tempMax: wData.tempMax,
          tempMin: wData.tempMin,
          feelsLike: wData.feelsLike,
          humidity: wData.humidity,
          windSpeed: wData.windSpeed,
          rainProb: wData.rainProb
        });
      } else {
        throw new Error("Dados de clima vazios");
      }
    } catch (e) {
      console.error("Erro ao buscar clima:", e);
      setLocationName("OFFLINE");
    } finally {
      setLoading(false);
    }
  };

  const initWeather = () => {
    setLoading(true);
    setWeather(null); 
    setLocationName("BUSCANDO...");

    // Se coordenadas forem passadas via props, usa elas (Prioridade do Destino)
    if (lat !== undefined && lon !== undefined) {
      fetchWeather(lat, lon);
      return;
    }

    if (!navigator.geolocation) {
      fetchWeather(FALLBACK_LAT, FALLBACK_LON, FALLBACK_NAME);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn("GPS falhou ou negado, usando Sandton:", error);
        fetchWeather(FALLBACK_LAT, FALLBACK_LON, FALLBACK_NAME);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  useEffect(() => {
    initWeather();
  }, [lat, lon]);

  const rainValue = weather?.rainProb ?? 0;
  const rainPercent = rainValue > 1 ? rainValue : rainValue * 100;

  return (
    <div className="relative w-full rounded-[2rem] shadow-2xl overflow-hidden flex flex-col group p-4 border border-white/20 h-[320px] max-h-[320px]">
      
      {/* Dynamic Photo Background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        {/* Placeholder corresponding to the cold mountain example */}
        <img 
          src={weather?.temp && weather.temp > 25 
            ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop" 
            : weather?.temp && weather.temp < 15 
            ? "https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=1000&auto=format&fit=crop" 
            : "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1000&auto=format&fit=crop"}
          alt="Weather Background" 
          className="w-full h-full object-cover"
        />
        {/* Darkened overlay for much better text readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"></div>
      </div>

      <div className="relative z-10 text-white w-full h-full flex flex-col">
          {/* Header Row: Location */}
          <div className="flex items-center justify-between mb-2 pl-1 pr-1 shrink-0">
             <div className="flex items-center gap-1.5">
               <MapPin className="w-3.5 h-3.5 text-white drop-shadow-md" />
               <span className="text-[12px] font-sans font-bold uppercase tracking-wide drop-shadow-md truncate max-w-[200px]">
                 {locationName}
               </span>
             </div>
             {weather && (
               <span className="text-[10px] font-medium text-white/50 tracking-wider">PREVISÃO DO LOCAL</span>
             )}
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-white opacity-50" />
            </div>
          ) : weather ? (
            <div className="flex flex-col flex-1 animate-in fade-in duration-500 w-full h-full justify-between gap-2">
              
              {/* Top Section: Main Temp & Details side by side */}
              <div className="flex gap-2 flex-1 min-h-0 w-full">
                
                {/* Left: Main Weather Box */}
                <div className="flex-1 min-w-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 shadow-lg flex items-center justify-around overflow-hidden h-full">
                   <div className="flex flex-col items-center justify-center min-w-[40px]">
                     <CloudSun className="w-8 h-8 text-white drop-shadow-lg mb-0.5" />
                     <span className="text-[7.5px] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[60px] drop-shadow-md leading-tight text-center">
                       {weather.temp < 15 ? 'Frio' : weather.temp > 25 ? 'Quente' : 'Ameno'}
                     </span>
                   </div>

                   <div className="flex flex-col items-end justify-center shrink-0">
                      <div className="flex items-start drop-shadow-lg leading-none">
                        <span className="text-[32px] font-sans font-medium tracking-tighter leading-none mt-1">
                          {Math.round(weather.temp)}
                        </span>
                        <span className="text-[14px] font-sans mt-1 ml-0.5 drop-shadow-lg">°C</span>
                      </div>
                      <span className="text-[8px] text-white/90 font-medium drop-shadow-sm mt-0.5">
                        Sensação: {Math.round(weather.feelsLike)}°C
                      </span>
                   </div>
                </div>

                {/* Right: Sub-info Box */}
                <div className="flex-1 min-w-0 bg-[#1a1c23]/70 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 shadow-lg flex flex-col justify-between h-full">
                   
                   <div className="flex items-center gap-2">
                     <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0">
                       <CloudRain className="w-2.5 h-2.5 text-slate-800" />
                     </div>
                     <span className="text-[8.5px] font-sans text-white/90">Chuva: <strong className="font-bold">{Math.round(rainPercent)}%</strong></span>
                   </div>
                   
                   <div className="flex items-center gap-2">
                     <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0">
                       <Droplets className="w-2.5 h-2.5 text-slate-800" />
                     </div>
                     <span className="text-[8.5px] font-sans text-white/90">Umidade: <strong className="font-bold">{Math.round(weather.humidity)}%</strong></span>
                   </div>

                   <div className="flex items-center gap-2">
                     <div className="w-4 h-4 rounded-full bg-transparent border border-white flex items-center justify-center shrink-0">
                       <Wind className="w-2.5 h-2.5 text-white" />
                     </div>
                     <span className="text-[8.5px] font-sans text-white/90">Vento: <strong className="font-bold">{Math.round(weather.windSpeed)} km/h</strong></span>
                   </div>

                </div>

              </div>

              {/* Bottom Section: Hourly / Daily split */}
              <div className="flex gap-2 flex-1 min-h-0 w-full">
                 
                 {/* Hourly */}
                 <div className="flex-1 min-w-0 bg-[#1a1c23]/50 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg flex flex-col justify-between h-full">
                    <h3 className="text-white text-[8px] sm:text-[9px] font-black tracking-wide uppercase mb-1 border-b border-white/20 pb-1 drop-shadow-md pl-1 shrink-0">Horária</h3>
                    <div className="flex justify-between w-full flex-1 items-center px-0.5">
                       {['07:00','10:00','13:00','16:00'].map((time, i) => (
                         <div key={time} className="flex flex-col items-center justify-center text-center pb-1">
                            <span className="text-[7px] sm:text-[8px] text-white/90 font-sans mb-1 drop-shadow-md leading-none">{time}</span>
                            <CloudSun className="w-3.5 h-3.5 text-white mb-1 drop-shadow-md" />
                            <span className="text-[9px] font-bold drop-shadow-md leading-none">{Math.round(weather.temp) + (i % 3 - 1)}°</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Daily */}
                 <div className="flex-1 min-w-0 bg-[#1a1c23]/80 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-lg flex flex-col justify-between h-full">
                    <h3 className="text-white text-[8px] sm:text-[9px] font-black tracking-wide uppercase mb-1 border-b border-white/20 pb-1 drop-shadow-md pl-1 shrink-0">Diária</h3>
                    <div className="flex justify-between w-full flex-1 items-center px-0.5">
                       {['HOJE', 'AMANHÃ', 'QUA.', 'QUI.'].map((day, i) => (
                         <div key={day} className="flex flex-col items-center justify-center text-center pb-1">
                            <span className="text-[6.5px] sm:text-[7.5px] text-white/90 font-sans mb-1 drop-shadow-md leading-none truncate max-w-[28px] tracking-tighter">{day === 'AMANHÃ' ? 'AMAN' : day}</span>
                            <CloudSun className="w-3.5 h-3.5 text-amber-300 mb-1 drop-shadow-md" />
                            <div className="flex flex-col items-center leading-none mt-0.5">
                              <span className="text-[8.5px] sm:text-[9px] font-black drop-shadow-md">{Math.round(weather.tempMax) - (i % 2)}°</span>
                              <span className="text-[6.5px] sm:text-[7px] text-white/60 font-medium drop-shadow-md">{Math.round(weather.tempMin) - (i % 2)}°</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

            </div>
          ) : (
            <button 
              onClick={initWeather}
              className="flex-1 flex flex-col items-center justify-center gap-2"
            >
               <RefreshCw className="w-6 h-6 text-white/50" />
               <span className="text-xs font-black text-white/70 uppercase tracking-widest">
                 ATUALIZAR
               </span>
            </button>
          )}
      </div>
    </div>
  );
};

export default WeatherCardHome;
