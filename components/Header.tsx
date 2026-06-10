
import React, { useState, useEffect } from 'react';
import { useDevice } from '../services/device';
import { 
  CloudSun, 
  CloudRain, 
  Droplets, 
  Wind, 
  Loader2, 
  MapPin, 
  RefreshCw,
  ArrowLeft,
  Plane,
  Bus,
  Building,
  Car,
  Wallet,
  Check
} from 'lucide-react';
import { getWeather } from '../services/weatherService';

interface HeaderProps {
  tripName?: string;
  lat?: number;
  lon?: number;
  onBack?: () => void;
  tripId?: string;
}

interface CostDetails {
  flight: number;
  flightDesc: string;
  bus: number;
  busDesc: string;
  accommodation: number;
  accommodationDesc: string;
  uber: number;
  uberDesc: string;
}

const TRIP_COSTS: Record<string, CostDetails> = {
  'am_ssa_aju': {
    flight: 618.00,
    flightDesc: 'GIG ⇄ SSA (LATAM por pessoa)',
    bus: 218.38,
    busDesc: 'Salvador ⇄ Aracaju (Águia Branca)',
    accommodation: 1285.00,
    accommodationDesc: 'Mercure + Airbnb Orla (por pessoa)',
    uber: 142.88,
    uberDesc: 'Transfers e deslocamentos (por pessoa)'
  },
  'am_sp_ssa_aju': {
    flight: 1100.00,
    flightDesc: 'GRU ⇄ SSA (Azul por pessoa)',
    bus: 218.38,
    busDesc: 'Salvador ⇄ Aracaju (Águia Branca)',
    accommodation: 1285.00,
    accommodationDesc: 'Mercure + Airbnb Orla (por pessoa)',
    uber: 170.00,
    uberDesc: 'Transfers e deslocamentos (por pessoa)'
  },
  'am_africa_sul': {
    flight: 4250.00,
    flightDesc: 'Internacional TAAG + JNB ⇄ CPT',
    bus: 0,
    busDesc: 'Não se aplica a esta viagem',
    accommodation: 1626.09,
    accommodationDesc: 'Sea Point Estúdio + Sandton (por pessoa)',
    uber: 284.40,
    uberDesc: 'Transfers e deslocamentos urbanos'
  },
  'am_porto_seguro': {
    flight: 640.00,
    flightDesc: 'GIG ⇄ BPS (por pessoa)',
    bus: 0,
    busDesc: 'Não se aplica a esta viagem',
    accommodation: 410.00,
    accommodationDesc: 'Estadia em Porto Seguro (por pessoa)',
    uber: 120.00,
    uberDesc: 'Deslocamentos urbanos e balsa'
  },
  'am_foz': {
    flight: 750.00,
    flightDesc: 'GIG ⇄ Foz do Iguaçu (por pessoa)',
    bus: 0,
    busDesc: 'Não se aplica a esta viagem',
    accommodation: 450.00,
    accommodationDesc: 'Estadia em Foz do Iguaçu (por pessoa)',
    uber: 130.00,
    uberDesc: 'Deslocamentos e cataratas'
  },
  'am_foz_ba': {
    flight: 1450.00,
    flightDesc: 'GIG ⇄ Foz + Buenos Aires',
    bus: 110.00,
    busDesc: 'Ônibus Intermunicipal Cataratas',
    accommodation: 900.00,
    accommodationDesc: 'Estadias Foz + Buenos Aires (por pessoa)',
    uber: 240.00,
    uberDesc: 'Deslocamentos e transfers'
  },
  'am_foz_ass_ba': {
    flight: 1162.23,
    flightDesc: 'Foz ⇄ Buenos Aires / Rio (por pessoa)',
    bus: 124.29,
    busDesc: 'Foz ⇄ Assunção (Semifranquia por pessoa)',
    accommodation: 1100.00,
    accommodationDesc: 'Estadias Plano A (por pessoa)',
    uber: 180.00,
    uberDesc: 'Deslocamentos urbanos e transfers'
  },
  'am_bh_med_san': {
    flight: 3701.00,
    flightDesc: 'BH ⇄ MDE ⇄ ADZ (por pessoa)',
    bus: 150.00,
    busDesc: 'Ônibus/Transporte regional (opcional)',
    accommodation: 1240.00,
    accommodationDesc: 'Estadias Medellín e San Andrés (por pessoa)',
    uber: 220.00,
    uberDesc: 'Táxis e transfers urbanos (por pessoa)'
  }
};

const Header: React.FC<HeaderProps> = ({ tripName, lat, lon, onBack, tripId }) => {
  const { isDesktop } = useDevice();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Cost calculator toggles
  const [includeFlight, setIncludeFlight] = useState(true);
  const [includeBus, setIncludeBus] = useState(true);
  const [includeAccommodation, setIncludeAccommodation] = useState(true);
  const [includeUber, setIncludeUber] = useState(true);

  // Reset toggles when user changes trip
  useEffect(() => {
    setIncludeFlight(true);
    setIncludeBus(true);
    setIncludeAccommodation(true);
    setIncludeUber(true);
  }, [tripId]);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      const targetLat = lat !== undefined ? lat : -25.6953;
      const targetLon = lon !== undefined ? lon : -54.4367;
      const data = await getWeather(targetLat, targetLon);
      setWeather(data);
      setLoading(false);
    };
    fetchWeather();
  }, [lat, lon]);

  const activeTripKey = tripId || 'am_ssa_aju';
  const activeCosts = TRIP_COSTS[activeTripKey] || TRIP_COSTS['am_ssa_aju'];

  // Calculates per-person estimated cost in real-time
  const totalEstimated = 
    (includeFlight && activeCosts.flight > 0 ? activeCosts.flight : 0) +
    (includeBus && activeCosts.bus > 0 ? activeCosts.bus : 0) +
    (includeAccommodation && activeCosts.accommodation > 0 ? activeCosts.accommodation : 0) +
    (includeUber && activeCosts.uber > 0 ? activeCosts.uber : 0);

  const locationName = (tripName || "Foz do Iguaçu").toUpperCase();
  const rainValue = weather?.rainProb ?? 0;
  const rainPercent = rainValue > 1 ? rainValue : rainValue * 105;

  return (
    <div className="relative w-full shrink-0 flex flex-col items-center justify-center overflow-hidden bg-slate-950 h-auto pt-12 pb-12 px-6 sm:px-10 md:px-12">
      
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-20 p-3 bg-black/50 hover:bg-black/70 active:scale-95 text-white rounded-full border border-white/10 shadow-lg transition-all flex items-center justify-center group pointer-events-auto"
          title="Trocar Viagem"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      )}
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <img 
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop" 
          alt="Nature Landscape Destination" 
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/80"></div>
      </div>

      {/* Main Container - App name on top, widgets side-by-side below */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center gap-6 sm:gap-8">
        
        {/* LOGO CENTRALIZADO NO TOPO */}
        <div className="flex items-center justify-center shrink-0 py-2 self-center mt-2 sm:mt-0">
          <span 
            className="font-display font-black text-[12vw] sm:text-[80px] md:text-[90px] xl:text-[100px] tracking-tighter uppercase text-white leading-none shrink-0"
            style={{ 
              textShadow: '0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)'
            }}
          >
            VIAJ
          </span>
          <span 
            className="font-display font-black text-[12vw] sm:text-[80px] md:text-[90px] xl:text-[100px] tracking-tighter uppercase leading-none shrink-0 animate-pulse"
            style={{ 
              textShadow: '0 1px 0 #cc9900, 0 2px 0 #c99600, 0 3px 0 #bb8a00, 0 4px 0 #b98800, 0 5px 0 #aa7d00, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)',
              color: '#FFB81C' 
            }}
          >
            AÍ
          </span>
        </div>

        {/* CONTENEDOR DE WIDGETS LADO A LADO */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 w-full max-w-5xl">
          
          {/* BUDGET ESTIMATOR WIDGET (ABAIXO, À ESQUERDA) */}
          <div className="w-full md:w-1/2 max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] flex flex-col justify-between text-white hover:border-white/20 transition-all duration-300 mx-auto">
            
            <div className="flex flex-col gap-3.5 flex-1 w-full justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black tracking-wider uppercase">
                      Custos Pré/Pós por Pessoa
                    </span>
                  </div>
                  <span className="text-[9px] font-black text-emerald-400/80 tracking-widest uppercase font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-400/15">
                    Tempo Real
                  </span>
                </div>

                <div className="bg-gradient-to-br from-[#0e2a22] to-slate-900 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between mt-3">
                  <div className="flex flex-col">
                    <span className="text-[8.5px] font-black uppercase text-white/50 tracking-widest leading-none mb-1">PROPORÇÃO COORDENADA</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-black text-emerald-400">R$</span>
                      <span className="text-3xl font-display font-black text-white tracking-tight leading-none">
                        {totalEstimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[7.5px] font-black text-slate-400 block uppercase tracking-wide">STATUS DAS TAXAS</span>
                    <span className="text-[10px] text-emerald-400 font-extrabold font-mono uppercase bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                      Valores Fiéis
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Checkbox List */}
              <div className="flex flex-col gap-1.5 select-none mt-3.5 flex-1 justify-center">
                {/* Flight Cost */}
                {activeCosts.flight > 0 && (
                  <div 
                    onClick={() => setIncludeFlight(!includeFlight)}
                    className={`flex items-center justify-between p-2 rounded-xl border text-left cursor-pointer transition-all ${includeFlight ? 'bg-white/5 border-white/10 text-white' : 'bg-black/25 border-white/5 text-white/30'}`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${includeFlight ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-white/5'}`}>
                        <Plane className={`w-3.5 h-3.5 ${includeFlight ? 'text-emerald-400' : 'text-white/30'}`} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider truncate leading-tight">Passagens Aéreas</span>
                        <span className="text-[8px] opacity-60 leading-normal truncate">{activeCosts.flightDesc}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold leading-none font-mono">
                        R$ {activeCosts.flight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${includeFlight ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-white/20'}`}>
                        {includeFlight && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bus Cost */}
                {activeCosts.bus > 0 && (
                  <div 
                    onClick={() => setIncludeBus(!includeBus)}
                    className={`flex items-center justify-between p-2 rounded-xl border text-left cursor-pointer transition-all ${includeBus ? 'bg-white/5 border-white/10 text-white' : 'bg-black/25 border-white/5 text-white/30'}`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${includeBus ? 'bg-orange-500/20 border border-orange-400/30' : 'bg-white/5'}`}>
                        <Bus className={`w-3.5 h-3.5 ${includeBus ? 'text-orange-400' : 'text-white/30'}`} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider truncate leading-tight">Rodoviário (Ônibus)</span>
                        <span className="text-[8px] opacity-60 leading-normal truncate">{activeCosts.busDesc}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold leading-none font-mono">
                        R$ {activeCosts.bus.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${includeBus ? 'bg-orange-500 border-orange-400 text-slate-950' : 'border-white/20'}`}>
                        {includeBus && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                )}

                {/* Accommodation/Stay Cost */}
                {activeCosts.accommodation > 0 && (
                  <div 
                    onClick={() => setIncludeAccommodation(!includeAccommodation)}
                    className={`flex items-center justify-between p-2 rounded-xl border text-left cursor-pointer transition-all ${includeAccommodation ? 'bg-white/5 border-white/10 text-white' : 'bg-black/25 border-white/5 text-white/30'}`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${includeAccommodation ? 'bg-pink-500/20 border border-pink-400/30' : 'bg-white/5'}`}>
                        <Building className={`w-3.5 h-3.5 ${includeAccommodation ? 'text-pink-400' : 'text-white/30'}`} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider truncate leading-tight">Hospedagem / Airbnb</span>
                        <span className="text-[8px] opacity-60 leading-normal truncate">{activeCosts.accommodationDesc}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold leading-none font-mono">
                        R$ {activeCosts.accommodation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${includeAccommodation ? 'bg-pink-500 border-pink-400 text-slate-950' : 'border-white/20'}`}>
                        {includeAccommodation && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                )}

                {/* Uber Cost */}
                {activeCosts.uber > 0 && (
                  <div 
                    onClick={() => setIncludeUber(!includeUber)}
                    className={`flex items-center justify-between p-2 rounded-xl border text-left cursor-pointer transition-all ${includeUber ? 'bg-white/5 border-white/10 text-white' : 'bg-black/25 border-white/5 text-white/30'}`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${includeUber ? 'bg-sky-500/20 border border-sky-400/30' : 'bg-white/5'}`}>
                        <Car className={`w-3.5 h-3.5 ${includeUber ? 'text-sky-400' : 'text-white/30'}`} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider truncate leading-tight">Ubers / Deslocamento</span>
                        <span className="text-[8px] opacity-60 leading-normal truncate">{activeCosts.uberDesc}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold leading-none font-mono">
                        R$ {activeCosts.uber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${includeUber ? 'bg-sky-500 border-sky-400 text-slate-950' : 'border-white/20'}`}>
                        {includeUber && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* WEATHER WIDGET (ABAIXO, À DIREITA) */}
          <div className="w-full md:w-1/2 max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] flex flex-col justify-between text-white hover:border-white/20 transition-all duration-300 mx-auto">
            
            <div className="flex flex-col gap-3.5 flex-1 w-full justify-between">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 shrink-0">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black tracking-wider uppercase truncate max-w-[160px] sm:max-w-[220px]">
                    {locationName}
                  </span>
                </div>
                <span className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase">Previsão do Local</span>
              </div>

              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-2" />
                  <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Sincronizando Satélites...</span>
                </div>
              ) : weather ? (
                <div className="flex-1 flex flex-col justify-between gap-3 md:gap-3.5 mt-3">
                  
                  <div className="grid grid-cols-2 gap-3 flex-1 min-h-[110px]">
                    
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center justify-around h-full">
                      <div className="flex flex-col items-center">
                        <CloudSun className="w-8 h-8 text-amber-300 mb-1" />
                        <span className="text-[9px] font-black tracking-widest text-white/80 uppercase">
                          {weather.temp < 15 ? 'Frio' : weather.temp > 25 ? 'Quente' : 'Ameno'}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-start">
                          <span className="text-3xl font-black font-display leading-none">{Math.round(weather.temp)}</span>
                          <span className="text-xs font-bold text-white/60 ml-0.5">°C</span>
                        </div>
                        <span className="text-[8px] font-bold text-white/50 tracking-wider mt-1 uppercase">
                          Sensação {Math.round(weather.feelsLike)}°
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-3 flex flex-col justify-around h-full">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <CloudRain className="w-2.5 h-2.5 text-emerald-400" />
                        </div>
                        <span className="text-[9px] font-semibold text-white/80">Chuva: <span className="font-bold text-white">{Math.round(rainPercent)}%</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-sky-500/10 flex items-center justify-center">
                          <Droplets className="w-2.5 h-2.5 text-sky-400" />
                        </div>
                        <span className="text-[9px] font-semibold text-white/80">Umidade: <span className="font-bold text-white">{Math.round(weather.humidity)}%</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-slate-500/10 flex items-center justify-center">
                          <Wind className="w-2.5 h-2.5 text-slate-400" />
                        </div>
                        <span className="text-[9px] font-semibold text-white/80">Vento: <span className="font-bold text-white">{Math.round(weather.windSpeed)} km/h</span></span>
                      </div>
                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-3 flex-1 min-h-[110px]">
                    
                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-3 flex flex-col justify-between h-full">
                      <h4 className="text-[8px] font-black tracking-[0.15em] text-white/50 uppercase mb-2 border-b border-white/5 pb-1 shrink-0">Horária</h4>
                      <div className="flex justify-between items-center gap-1 flex-1 py-1">
                        {['07:00', '10:00', '13:00', '16:00'].map((time, i) => (
                          <div key={time} className="flex flex-col items-center justify-between h-full">
                            <span className="text-[7px] text-white/60 font-medium leading-none mb-1">{time}</span>
                            <CloudSun className="w-3.5 h-3.5 text-slate-300 mb-1" />
                            <span className="text-[9px] font-bold">{Math.round(weather.temp) + (i % 3 - 1)}°</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900/70 backdrop-blur-md border border-white/5 rounded-2xl p-3 flex flex-col justify-between h-full">
                      <h4 className="text-[8px] font-black tracking-[0.15em] text-white/50 uppercase mb-2 border-b border-white/5 pb-1 shrink-0">Diária</h4>
                      <div className="flex justify-between items-center gap-1 flex-1 py-1">
                        {['HOJE', 'AMANHÃ', 'QUA.', 'QUI.'].map((day, i) => (
                          <div key={day} className="flex flex-col items-center justify-between h-full">
                            <span className="text-[6.5px] text-white/50 font-bold uppercase leading-none mb-1">
                              {day === 'AMANHÃ' ? 'AMAN' : day}
                            </span>
                            <CloudSun className="w-3.5 h-3.5 text-amber-300 mb-1" />
                            <div className="flex flex-col items-center leading-none">
                              <span className="text-[8px] font-black">{Math.round(weather.tempMax) - (i % 2)}°</span>
                              <span className="text-[6px] text-white/40 font-medium">{Math.round(weather.tempMin) - (i % 2)}°</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                  
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center py-12">
                  <button 
                    onClick={() => {
                      setLoading(true);
                      getWeather(lat || -25.6953, lon || -54.4367).then(data => {
                        setWeather(data);
                        setLoading(false);
                      });
                    }}
                    className="py-12 flex flex-col items-center justify-center gap-2 hover:bg-white/5 rounded-2xl transition-all w-full"
                  >
                    <RefreshCw className="w-6 h-6 text-white/40 hover:rotate-180 transition-transform duration-500" />
                    <span className="text-[9px] font-black uppercase text-white/50 tracking-widest">Tentar Novamente</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Header;
