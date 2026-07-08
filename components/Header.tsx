
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
  Check,
  Sun,
  Moon,
  Sunset,
  CloudDrizzle,
  CloudLightning,
  Cloud
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
    bus: 120.00,
    busDesc: 'Aluguel de Carro + Combustível (metade/pessoa)',
    accommodation: 1285.00,
    accommodationDesc: 'Mercure + Airbnb Orla (por pessoa)',
    uber: 142.88,
    uberDesc: 'Transfers e deslocamentos (por pessoa)'
  },
  'am_sp_ssa_aju': {
    flight: 1100.00,
    flightDesc: 'GRU ⇄ SSA (Azul por pessoa)',
    bus: 120.00,
    busDesc: 'Aluguel de Carro + Combustível (metade/pessoa)',
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
  },
  'am_rio_san': {
    flight: 1225.00,
    flightDesc: 'GIG ⇄ ADZ (por pessoa - Copa Airlines)',
    bus: 120.00,
    busDesc: 'Transfer Aeroporto (opcional)',
    accommodation: 880.00,
    accommodationDesc: 'Hospedagem San Andrés 10 dias (por pessoa)',
    uber: 150.00,
    uberDesc: 'Deslocamentos na ilha (por pessoa)'
  },
  'am_rio_foz_ba': {
    flight: 1427.00,
    flightDesc: 'Opção Recomendada (GIG ⇄ IGU R$ 961 + IGR ⇄ AEP R$ 466)',
    bus: 60.00,
    busDesc: 'Transfer de fronteira Foz ⇄ Puerto Iguazú',
    accommodation: 950.00,
    accommodationDesc: 'Estadias Foz + Buenos Aires total (por pessoa)',
    uber: 200.00,
    uberDesc: 'Passeios e transfers (por pessoa)'
  },
  'am_salvador_julho': {
    flight: 697.00,
    flightDesc: 'Voo GIG ⇄ SSA (por pessoa)',
    bus: 0.00,
    busDesc: 'Sem ônibus rodoviário na viagem',
    accommodation: 1000.00,
    accommodationDesc: 'Hospedagem Salvador 7 noites (metade p/pessoa)',
    uber: 250.00,
    uberDesc: 'Passeios e deslocamentos locais (por pessoa)'
  }
};

const getTripBgImage = (id: string) => {
  const images: Record<string, string> = {
    'am_ssa_aju': '/ssa_aju_premium.png',
    'am_sp_ssa_aju': '/sp_ssa_aju_premium.png',
    'am_africa_sul': '/africa_premium.png',
    'am_porto_seguro': '/porto_seguro_premium.png',
    'am_foz': '/foz_premium.png',
    'am_foz_ba': '/foz_ba_premium.png',
    'am_foz_ass_ba': '/ba_ass_foz_premium.png',
    'am_rio_foz_ba': '/foz_ba_premium.jpg',
    'am_salvador_julho': '/salvador_premium.jpg',
    'am_rio_san': '/colombia_premium.jpg',
    'am_bh_med_san': '/colombia_premium.png'
  };
  return images[id] || '/salvador_premium.jpg';
};

const Header: React.FC<HeaderProps> = ({ tripName, lat, lon, onBack, tripId }) => {
  const { isDesktop } = useDevice();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [weatherPeriod, setWeatherPeriod] = useState<'dia' | 'tarde' | 'noite'>('dia');

  // Real-time clock and dynamic date state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Selected sub-location index for the multi-city trip "am_salvador_julho"
  const [selectedLocIdx, setSelectedLocIdx] = useState(0);

  const SALVADOR_JULHO_LOCATIONS = [
    { name: 'Salvador', lat: -12.9714, lon: -38.5014, dateRange: '16 Jul', description: 'Salvador' },
    { name: 'Maragogi', lat: -9.0122, lon: -35.2221, dateRange: '17-19 Jul', description: 'Maragogi' },
    { name: 'Aracaju', lat: -10.9472, lon: -37.0731, dateRange: '19-21 Jul', description: 'Aracaju' },
    { name: 'Salvador', lat: -12.9714, lon: -38.5014, dateRange: '21-24 Jul', description: 'Salvador (Retorno)' }
  ];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cost calculator toggles
  const [includeFlight, setIncludeFlight] = useState(true);
  const [includeBus, setIncludeBus] = useState(true);
  const [includeAccommodation, setIncludeAccommodation] = useState(true);
  const [includeUber, setIncludeUber] = useState(true);

  // Set initial period based on actual local hours
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 18 || hours < 6) {
      setWeatherPeriod('noite');
    } else if (hours >= 12 && hours < 18) {
      setWeatherPeriod('tarde');
    } else {
      setWeatherPeriod('dia');
    }
  }, []);

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
      let targetLat = lat !== undefined ? lat : -25.6953;
      let targetLon = lon !== undefined ? lon : -54.4367;

      if (tripId === 'am_salvador_julho') {
        const currentLoc = SALVADOR_JULHO_LOCATIONS[selectedLocIdx];
        targetLat = currentLoc.lat;
        targetLon = currentLoc.lon;
      }

      const data = await getWeather(targetLat, targetLon);
      setWeather(data);
      setLoading(false);
    };
    fetchWeather();
  }, [lat, lon, selectedLocIdx, tripId]);

  const activeTripKey = tripId || 'am_ssa_aju';
  const activeCosts = TRIP_COSTS[activeTripKey] || TRIP_COSTS['am_ssa_aju'];

  // Calculates per-person estimated cost in real-time
  const totalEstimated = 
    (includeFlight && activeCosts.flight > 0 ? activeCosts.flight : 0) +
    (includeBus && activeCosts.bus > 0 ? activeCosts.bus : 0) +
    (includeAccommodation && activeCosts.accommodation > 0 ? activeCosts.accommodation : 0) +
    (includeUber && activeCosts.uber > 0 ? activeCosts.uber : 0);

  const locationName = (tripId === 'am_salvador_julho'
    ? SALVADOR_JULHO_LOCATIONS[selectedLocIdx].name
    : (tripName || "Foz do Iguaçu")
  ).toUpperCase();
  const rainValue = weather?.rainProb ?? 0;
  const rainPercent = rainValue > 1 ? rainValue : rainValue * 105;

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date();
    if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth()) {
      return 'Hoje';
    }
    return days[date.getDay()];
  };

  const getWeatherDetails = (code: number) => {
    if (code === 0) return { label: 'Ensolarado', icon: Sun, color: 'text-amber-400' };
    if ([1, 2, 3].includes(code)) return { label: 'Parcialmente Nublado', icon: CloudSun, color: 'text-sky-300' };
    if ([45, 48].includes(code)) return { label: 'Nevoeiro', icon: Cloud, color: 'text-slate-400' };
    if ([51, 53, 55].includes(code)) return { label: 'Chuvisco', icon: CloudDrizzle, color: 'text-blue-300' };
    if ([61, 63, 65, 80, 81, 82].includes(code)) return { label: 'Chuva', icon: CloudRain, color: 'text-cyan-400' };
    if ([95, 96, 99].includes(code)) return { label: 'Tempestade', icon: CloudLightning, color: 'text-indigo-400' };
    return { label: 'Ameno', icon: CloudSun, color: 'text-cyan-300' };
  };

  const getWeatherBgClass = () => {
    switch (weatherPeriod) {
      case 'dia':
        return 'bg-gradient-to-br from-sky-950/60 via-[#0C1222] to-[#0B0F19]/90 shadow-[0_0_40px_rgba(56,189,248,0.15)] border-sky-500/20 hover:border-sky-500/40';
      case 'tarde':
        return 'bg-gradient-to-br from-amber-950/60 via-[#0C1222] to-[#0B0F19]/90 shadow-[0_0_40px_rgba(245,158,11,0.15)] border-amber-500/20 hover:border-amber-500/40';
      case 'noite':
        return 'bg-gradient-to-br from-indigo-950/60 via-[#0C1222] to-[#0B0F19]/90 shadow-[0_0_40px_rgba(99,102,241,0.15)] border-indigo-500/20 hover:border-indigo-500/40';
    }
  };

  const getCurrentWeatherStatusText = () => {
    if (!weather) return 'Fidelizado';
    const desc = getWeatherDetails(weather.weatherCode).label;
    return desc;
  };

  return (
    <div className="relative w-full shrink-0 flex flex-col items-center justify-center overflow-hidden bg-[#0B0F19] h-auto pt-6 pb-6 px-4 sm:px-8 md:px-10 border-b border-white/10">
      
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-20 p-2 bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white rounded-full border border-white/10 shadow-2xl transition-all flex items-center justify-center group pointer-events-auto backdrop-blur-md"
          title="Trocar Viagem"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      )}
      
      {/* Background Layer with low opacity for modern look */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[#080c14]">
        <img 
          src={getTripBgImage(tripId || '')} 
          alt="Nature Landscape Destination" 
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0F19]/60 to-[#0B0F19]"></div>
      </div>

      {/* Main Container - App name on top, widgets side-by-side below */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center gap-4 md:gap-5">
        
        {/* LOGO CENTRALIZADO NO TOPO - MINIMALISTA & MODERNO 2026 */}
        <div className="flex flex-col items-center justify-center py-1 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md mb-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[9px] font-bold tracking-[0.25em] text-emerald-400 uppercase">ROTEIRO INTELIGENTE</span>
          </div>
          <p className="text-[10px] text-slate-300 font-medium tracking-[0.15em] uppercase mt-1">
            EXECUTIVO : {tripName ? tripName.toUpperCase() : "PLANO 8: FÉRIAS EM SALVADOR"}
          </p>
        </div>

        {/* CONTENEDOR DE WIDGETS LADO A LADO */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-4 w-full max-w-7xl">
          
          {/* BUDGET ESTIMATOR WIDGET (ABAIXO, À ESQUERDA) */}
          <div className="w-full lg:w-1/2 max-w-xl bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between text-white hover:border-emerald-500/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 mx-auto">
            
            <div className="flex flex-col gap-3 flex-1 w-full justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
                      Resumo de Custos (por Pessoa)
                    </span>
                  </div>
                  <span className="text-[8px] font-black text-emerald-400 tracking-widest uppercase font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Tempo Real
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <span className="text-3xl sm:text-4xl font-black text-[#81E6D9] tracking-tight leading-none font-mono">
                    R$ {totalEstimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mt-2.5">
                    CUSTO TOTAL CALCULADO
                  </span>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mt-0.5">
                    TODAS AS TAXAS INCLUÍDAS
                  </span>
                </div>
              </div>

              {/* Interactive Checkbox List in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 flex-1 justify-center">
                {/* Flight Cost */}
                {activeCosts.flight > 0 && (
                  <div 
                    onClick={() => setIncludeFlight(!includeFlight)}
                    className={`col-span-1 flex items-center justify-between p-2 rounded-xl border text-left cursor-pointer transition-all duration-200 ${includeFlight ? 'bg-white/5 border-white/15 text-white hover:bg-white/10 shadow-sm' : 'bg-white/0 border-white/5 text-slate-500 hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${includeFlight ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5'}`}>
                        <Plane className={`w-3.5 h-3.5 ${includeFlight ? 'text-emerald-400' : 'text-slate-500'}`} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-wider truncate leading-tight">Aéreo</span>
                        <span className="text-[7.5px] opacity-60 leading-normal truncate">{activeCosts.flightDesc}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-black leading-none font-mono">
                        R$ {activeCosts.flight.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </span>
                      <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center shrink-0 transition-all ${includeFlight ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-white/20'}`}>
                        {includeFlight && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                )}

                {/* Accommodation/Stay Cost */}
                {activeCosts.accommodation > 0 && (
                  <div 
                    onClick={() => setIncludeAccommodation(!includeAccommodation)}
                    className={`col-span-1 flex items-center justify-between p-2 rounded-xl border text-left cursor-pointer transition-all duration-200 ${includeAccommodation ? 'bg-white/5 border-white/15 text-white hover:bg-white/10 shadow-sm' : 'bg-white/0 border-white/5 text-slate-500 hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${includeAccommodation ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5'}`}>
                        <Building className={`w-3.5 h-3.5 ${includeAccommodation ? 'text-emerald-400' : 'text-slate-500'}`} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-wider truncate leading-tight">Hospedagem</span>
                        <span className="text-[7.5px] opacity-60 leading-normal truncate">{activeCosts.accommodationDesc}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-black leading-none font-mono">
                        R$ {activeCosts.accommodation.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </span>
                      <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center shrink-0 transition-all ${includeAccommodation ? 'bg-emerald-50 border-emerald-400 text-slate-950' : 'border-white/20'}`}>
                        {includeAccommodation && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bus / Car Cost */}
                {activeCosts.bus > 0 && (
                  <div 
                    onClick={() => setIncludeBus(!includeBus)}
                    className={`col-span-1 sm:col-span-2 flex items-center justify-between p-2 rounded-xl border text-left cursor-pointer transition-all duration-200 ${includeBus ? 'bg-white/5 border-white/15 text-white hover:bg-white/10 shadow-sm' : 'bg-white/0 border-white/5 text-slate-500 hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${includeBus ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/5'}`}>
                        {activeTripKey === 'am_ssa_aju' || activeTripKey === 'am_sp_ssa_aju' ? (
                          <Car className={`w-3.5 h-3.5 ${includeBus ? 'text-cyan-400' : 'text-slate-500'}`} />
                        ) : (
                          <Bus className={`w-3.5 h-3.5 ${includeBus ? 'text-cyan-400' : 'text-slate-500'}`} />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-wider truncate leading-tight">
                          {activeTripKey === 'am_ssa_aju' || activeTripKey === 'am_sp_ssa_aju' ? 'Carro Alugado' : 'Rodoviário'}
                        </span>
                        <span className="text-[7.5px] opacity-60 leading-normal truncate">{activeCosts.busDesc}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-black leading-none font-mono">
                        R$ {activeCosts.bus.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </span>
                      <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center shrink-0 transition-all ${includeBus ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-white/20'}`}>
                        {includeBus && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                )}

                {/* Uber Cost */}
                {activeCosts.uber > 0 && (
                  <div 
                    onClick={() => setIncludeUber(!includeUber)}
                    className={`col-span-1 ${activeCosts.bus > 0 ? 'sm:col-span-1' : 'sm:col-span-2'} flex items-center justify-between p-2 rounded-xl border text-left cursor-pointer transition-all duration-200 ${includeUber ? 'bg-white/5 border-white/15 text-white hover:bg-white/10 shadow-sm' : 'bg-white/0 border-white/5 text-slate-500 hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${includeUber ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/5'}`}>
                        <Car className={`w-3.5 h-3.5 ${includeUber ? 'text-cyan-400' : 'text-slate-500'}`} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-wider truncate leading-tight">Deslocamento</span>
                        <span className="text-[7.5px] opacity-60 leading-normal truncate">{activeCosts.uberDesc}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-black leading-none font-mono">
                        R$ {activeCosts.uber.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </span>
                      <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center shrink-0 transition-all ${includeUber ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-white/20'}`}>
                        {includeUber && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* WEATHER WIDGET (ABAIXO, À DIREITA) */}
          <div className={`w-full lg:w-1/2 max-w-xl backdrop-blur-md border rounded-3xl p-4 sm:p-5 flex flex-col justify-between text-white transition-all duration-500 mx-auto ${getWeatherBgClass()}`}>
            
            <div className="flex flex-col gap-3.5 flex-1 w-full justify-between">
              
              {/* Header section with Day / Sunset / Night mode switches */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 shrink-0 gap-2">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-xs font-bold tracking-wider uppercase truncate text-slate-300">
                    {locationName}
                  </span>
                </div>

                {/* Clock: Always showing current date and time */}
                <div className="flex items-center gap-1.5 text-center font-mono text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-1 rounded-xl shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  {currentTime.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase()} • {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>

                {/* Day phase controller */}
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-0.5 rounded-xl shrink-0">
                  <button 
                    onClick={() => setWeatherPeriod('dia')}
                    className={`p-1 rounded-lg transition-all ${weatherPeriod === 'dia' ? 'bg-sky-500 text-slate-950 shadow-[0_0_8px_rgba(56,189,248,0.4)]' : 'hover:bg-white/5 text-slate-400'}`}
                    title="Dia ☀️"
                  >
                    <Sun className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => setWeatherPeriod('tarde')}
                    className={`p-1 rounded-lg transition-all ${weatherPeriod === 'tarde' ? 'bg-amber-500 text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'hover:bg-white/5 text-slate-400'}`}
                    title="Tarde 🌅"
                  >
                    <Sunset className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => setWeatherPeriod('noite')}
                    className={`p-1 rounded-lg transition-all ${weatherPeriod === 'noite' ? 'bg-indigo-500 text-white shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 'hover:bg-white/5 text-slate-400'}`}
                    title="Noite 🌙"
                  >
                    <Moon className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Itinerary Day & City Selector (Only for am_salvador_julho trip) */}
              {tripId === 'am_salvador_julho' && (
                <div className="grid grid-cols-4 gap-1.5 bg-slate-950/40 border border-white/5 p-1 rounded-2xl shrink-0">
                  {SALVADOR_JULHO_LOCATIONS.map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedLocIdx(idx)}
                      className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all border ${
                        selectedLocIdx === idx 
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                          : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="text-[9px] font-extrabold tracking-wide uppercase leading-none">{loc.dateRange}</span>
                      <span className="text-[7px] font-medium opacity-85 uppercase leading-none mt-1">{loc.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-6">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-2" />
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Sincronizando Satélites...</span>
                </div>
              ) : weather ? (
                <div className="flex-1 flex flex-col justify-between gap-2.5 mt-2">
                  
                  {/* Current conditions */}
                  <div className="grid grid-cols-2 gap-2.5 flex-1">
                    
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-around h-full hover:border-white/20 transition-all duration-200">
                      <div className="flex flex-col items-center">
                        {React.createElement(getWeatherDetails(weather.weatherCode).icon, { 
                          className: `w-7 h-7 ${getWeatherDetails(weather.weatherCode).color} mb-1 animate-bounce-slow` 
                        })}
                        <span className="text-[9px] font-black tracking-widest text-slate-300 uppercase leading-none mt-1">
                          {getCurrentWeatherStatusText()}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-start">
                          <span className="text-2xl font-black leading-none text-white">{Math.round(weather.temp)}</span>
                          <span className="text-[10px] font-bold text-slate-400 ml-0.5">°C</span>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 tracking-wider mt-1 uppercase leading-none">
                          Sensação {Math.round(weather.feelsLike)}°
                        </span>
                      </div>
                    </div>
 
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex flex-col justify-around h-full hover:border-white/20 transition-all duration-200">
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                          <CloudRain className="w-2 h-2 text-cyan-400" />
                        </div>
                        <span className="text-[9px] font-semibold text-slate-300">Chuva: <span className="font-black text-white">{Math.round(rainPercent)}%</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                          <Droplets className="w-2 h-2 text-cyan-400" />
                        </div>
                        <span className="text-[9px] font-semibold text-slate-300">Umidade: <span className="font-black text-white">{Math.round(weather.humidity)}%</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                          <Wind className="w-2 h-2 text-cyan-400" />
                        </div>
                        <span className="text-[9px] font-semibold text-slate-300">Vento: <span className="font-black text-white">{Math.round(weather.windSpeed)} km/h</span></span>
                      </div>
                    </div>
 
                  </div>
 
                  {/* 7-Day Forecast Grid (Fidedigno e Completo) */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col justify-between hover:border-white/20 transition-all duration-200">
                    <h4 className="text-[7.5px] font-black tracking-[0.15em] text-cyan-400 uppercase mb-2 border-b border-white/10 pb-1 shrink-0">
                      PREVISÃO COMPLETA PARA OS PRÓXIMOS 7 DIAS
                    </h4>
                    <div className="grid grid-cols-7 gap-1 flex-1 py-0.5">
                      {weather.daily?.time?.slice(0, 7).map((time: string, i: number) => {
                        const dayName = getDayLabel(time);
                        const code = weather.daily.weatherCode?.[i] ?? 0;
                        const max = Math.round(weather.daily.tempMax?.[i] ?? weather.temp);
                        const min = Math.round(weather.daily.tempMin?.[i] ?? weather.temp - 4);
                        const prob = Math.round(weather.daily.rainProb?.[i] ?? 0);
                        const details = getWeatherDetails(code);
                        const IconComponent = details.icon;
                        
                        return (
                          <div key={time} className="flex flex-col items-center justify-between py-1 px-0.5 rounded-lg hover:bg-white/5 transition-colors duration-200">
                            <span className="text-[7.5px] text-slate-400 font-bold uppercase leading-none mb-1.5">
                              {dayName}
                            </span>
                            <IconComponent className={`w-4 h-4 ${details.color} mb-1.5`} />
                            <div className="flex flex-col items-center leading-none mb-1">
                              <span className="text-[9px] font-black text-white">{max}°</span>
                              <span className="text-[7px] text-slate-500 font-medium mt-0.5">{min}°</span>
                            </div>
                            <span className="text-[6.5px] text-cyan-400 font-black leading-none">{prob}%</span>
                          </div>
                        );
                      })}
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
                    <RefreshCw className="w-6 h-6 text-slate-400 hover:rotate-180 transition-transform duration-500" />
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Tentar Novamente</span>
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
