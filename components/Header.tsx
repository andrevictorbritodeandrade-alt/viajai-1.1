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
  Cloud,
  X
} from 'lucide-react';
import { getWeather } from '../services/weatherService';

interface HeaderProps {
  tripName?: string;
  lat?: number;
  lon?: number;
  onBack?: () => void;
  tripId?: string;
  userName?: string;
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
    accommodation: 625.08,
    accommodationDesc: 'Hospedagem Salvador + Maceió + Aracaju (metade p/pessoa)',
    uber: 250.00,
    uberDesc: 'Aluguel de Carro + Combustível (metade p/pessoa)'
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
    'am_salvador_julho': '/salvador_aracaju_maceio.jpg',
    'am_aracaju_planob': '/aracaju_capital_premium.png',
    'am_rio_san': '/colombia_premium.jpg',
    'am_bh_med_san': '/colombia_premium.png'
  };
  return images[id] || '/salvador_aracaju_maceio.jpg';
};

const Header: React.FC<HeaderProps> = ({ tripName, lat, lon, onBack, tripId, userName }) => {
  const { isDesktop } = useDevice();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [weatherPeriod, setWeatherPeriod] = useState<'dia' | 'tarde' | 'noite'>('dia');

  // Modals state for uncluttered, clean header
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [showCostsModal, setShowCostsModal] = useState(false);

  // Real-time clock and dynamic date state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Selected sub-location index for the multi-city trip "am_salvador_julho"
  const [selectedLocIdx, setSelectedLocIdx] = useState(0);

  const SALVADOR_JULHO_LOCATIONS = [
    { name: 'Salvador', lat: -12.9714, lon: -38.5014, dateRange: '16 Jul', description: 'Salvador', dates: ['2026-07-16'] },
    { name: 'Maceió', lat: -9.6658, lon: -35.7353, dateRange: '17-19 Jul', description: 'Maceió', dates: ['2026-07-17', '2026-07-18', '2026-07-19'] },
    { name: 'Aracaju', lat: -10.9472, lon: -37.0731, dateRange: '19-21 Jul', description: 'Aracaju', dates: ['2026-07-19', '2026-07-20', '2026-07-21'] },
    { name: 'Salvador', lat: -12.9714, lon: -38.5014, dateRange: '21-24 Jul', description: 'Salvador (Retorno)', dates: ['2026-07-21', '2026-07-22', '2026-07-23', '2026-07-24'] }
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

  interface CostCardItem {
    id: string;
    title: string;
    icon: React.ComponentType<any>;
    included: boolean;
    onToggle: () => void;
    valuePerPerson: number;
    valueTotal: number;
    description: string;
    breakdown?: { label: string; value: number }[];
    colorTheme: 'emerald' | 'cyan' | 'indigo' | 'amber';
  }

  const costItems: CostCardItem[] = [];

  if (activeCosts.flight > 0) {
    costItems.push({
      id: 'flight',
      title: 'Aéreo',
      icon: Plane,
      included: includeFlight,
      onToggle: () => setIncludeFlight(!includeFlight),
      valuePerPerson: activeCosts.flight,
      valueTotal: activeCosts.flight * 2,
      description: activeTripKey === 'am_salvador_julho' ? 'Voo GIG ⇄ SSA (por pessoa)' : activeCosts.flightDesc,
      colorTheme: 'emerald'
    });
  }

  if (activeCosts.accommodation > 0) {
    const isSalvadorJulho = activeTripKey === 'am_salvador_julho';
    const breakdown = isSalvadorJulho ? [
      { label: '1 diária em Salvador (Chegada)', value: 185.71 },
      { label: '2 diárias em Maceió', value: 380.00 },
      { label: '2 diárias em Aracaju', value: 313.03 },
      { label: 'Restante (2 diárias) em Salvador', value: 371.42 }
    ] : undefined;

    costItems.push({
      id: 'accommodation',
      title: 'Hospedagem',
      icon: Building,
      included: includeAccommodation,
      onToggle: () => setIncludeAccommodation(!includeAccommodation),
      valuePerPerson: isSalvadorJulho ? 625.08 : activeCosts.accommodation,
      valueTotal: isSalvadorJulho ? 1250.16 : activeCosts.accommodation * 2,
      description: isSalvadorJulho ? 'Hospedagem Salvador + Maceió + Aracaju (metade p/pessoa)' : activeCosts.accommodationDesc,
      breakdown,
      colorTheme: 'emerald'
    });
  }

  if (activeCosts.bus > 0) {
    costItems.push({
      id: 'bus',
      title: activeTripKey === 'am_ssa_aju' || activeTripKey === 'am_sp_ssa_aju' ? 'Carro Alugado' : 'Rodoviário',
      icon: activeTripKey === 'am_ssa_aju' || activeTripKey === 'am_sp_ssa_aju' ? Car : Bus,
      included: includeBus,
      onToggle: () => setIncludeBus(!includeBus),
      valuePerPerson: activeCosts.bus,
      valueTotal: activeCosts.bus * 2,
      description: activeCosts.busDesc,
      colorTheme: 'cyan'
    });
  }

  if (activeCosts.uber > 0) {
    const isSalvadorJulho = activeTripKey === 'am_salvador_julho';
    costItems.push({
      id: 'uber',
      title: isSalvadorJulho ? 'Aluguel do Carro' : 'Deslocamento',
      icon: Car,
      included: includeUber,
      onToggle: () => setIncludeUber(!includeUber),
      valuePerPerson: activeCosts.uber,
      valueTotal: activeCosts.uber * 2,
      description: isSalvadorJulho ? 'Aluguel de Carro + Combustível (metade/pessoa)' : activeCosts.uberDesc,
      colorTheme: 'cyan'
    });
  }

  const totalEstimated = costItems
    .filter(item => item.included)
    .reduce((sum, item) => sum + item.valuePerPerson, 0);

  const totalEstimatedForTwo = costItems
    .filter(item => item.included)
    .reduce((sum, item) => sum + item.valueTotal, 0);

  const locationName = (tripId === 'am_salvador_julho'
    ? SALVADOR_JULHO_LOCATIONS[selectedLocIdx].name
    : (tripName || "Foz do Iguaçu")
  ).toUpperCase();
  const rainValue = weather?.rainProb ?? 0;
  const rainPercent = rainValue > 1 ? rainValue : rainValue * 105;

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
        return 'bg-gradient-to-br from-sky-950/80 via-[#0C1222] to-[#0B0F19]/95 border-sky-500/30';
      case 'tarde':
        return 'bg-gradient-to-br from-amber-950/80 via-[#0C1222] to-[#0B0F19]/95 border-amber-500/30';
      case 'noite':
        return 'bg-gradient-to-br from-indigo-950/80 via-[#0C1222] to-[#0B0F19]/95 border-indigo-500/30';
    }
  };

  const currentCondition = weather ? getWeatherDetails(weather.weatherCode) : { label: 'Carregando...', icon: CloudSun, color: 'text-sky-300' };
  const WeatherIcon = currentCondition.icon;

  return (
    <div className="relative w-full shrink-0 flex flex-col items-center justify-center overflow-hidden bg-[#0B0F19] pt-4 pb-4 px-4 sm:px-8 md:px-10 border-b border-white/10 shadow-lg">
      
      {/* Background Layer with soft opacity */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[#080c14]">
        <img 
          src={getTripBgImage(tripId || '')} 
          alt="Destination Landscape" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0F19]/60 to-[#0B0F19]"></div>
      </div>

      {/* Main Header Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* LEFT PROFILE & USER INFO */}
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 sm:p-2.5 shrink-0 bg-slate-900/80 hover:bg-slate-800 active:scale-95 text-slate-300 hover:text-white rounded-full border border-white/15 shadow transition-all flex items-center justify-center group pointer-events-auto backdrop-blur-md"
              title="Trocar Viagem"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-white" />
            </button>
          )}
          
          {/* Circular green avatar "A" */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-emerald-500/60 bg-emerald-950 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="text-emerald-400 font-black text-base sm:text-xl">
              {userName ? userName.charAt(0).toUpperCase() : 'A'}
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-400 tracking-wider">
                BEM-VINDO AO SEU PERFIL
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h1 className="text-base sm:text-xl font-black text-white tracking-tight leading-tight truncate">
              {userName || 'ANDRÉ BRITO'}
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-300 font-medium truncate max-w-md mt-0.5">
              {tripName ? tripName : 'Salvador, Maceió & Aracaju'}
            </p>
          </div>
        </div>

        {/* RIGHT TOP CORNER ACTION BUTTONS (CLEAN, UNCLUTTERED) */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end shrink-0">
          
          {/* 1. WEATHER ACTION BUTTON */}
          <button
            onClick={() => setShowWeatherModal(true)}
            className="flex items-center gap-2 bg-slate-900/85 hover:bg-slate-800/90 active:scale-95 border border-sky-500/40 text-sky-200 px-3.5 py-2 rounded-2xl backdrop-blur-md shadow-[0_4px_20px_rgba(14,165,233,0.15)] hover:border-sky-400 hover:shadow-[0_4px_25px_rgba(14,165,233,0.25)] transition-all cursor-pointer group"
            title="Ver previsão do tempo detalhada"
          >
            <WeatherIcon className="w-4 h-4 text-sky-300 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[9px] font-black uppercase text-sky-400 tracking-wider">Clima</span>
              <span className="text-xs font-mono font-black text-white mt-0.5">
                {weather ? `${Math.round(weather.temp)}°C` : 'Previsão'}
              </span>
            </div>
          </button>

          {/* 2. COST SUMMARY ACTION BUTTON */}
          <button
            onClick={() => setShowCostsModal(true)}
            className="flex items-center gap-2 bg-slate-900/85 hover:bg-slate-800/90 active:scale-95 border border-emerald-500/40 text-emerald-200 px-3.5 py-2 rounded-2xl backdrop-blur-md shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:border-emerald-400 hover:shadow-[0_4px_25px_rgba(16,185,129,0.25)] transition-all cursor-pointer group"
            title="Ver resumo de custos detalhado"
          >
            <Wallet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">Resumo</span>
              <span className="text-xs font-mono font-black text-emerald-300 mt-0.5">
                R$ {totalEstimated.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </span>
            </div>
          </button>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 🌤️ WEATHER DETAILED MODAL */}
      {/* ========================================================= */}
      {showWeatherModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className={`w-full max-w-xl max-h-[90vh] overflow-y-auto backdrop-blur-md border rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between text-white relative transition-all duration-300 ${getWeatherBgClass()}`}>
            
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-base sm:text-lg font-black tracking-wider uppercase text-white truncate">
                  PREVISÃO DO TEMPO • {locationName}
                </span>
              </div>
              <button
                onClick={() => setShowWeatherModal(false)}
                className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors shrink-0"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content inside Weather Modal */}
            <div className="flex flex-col gap-4">
              
              {/* Controls & Clock */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-white/5 border border-white/10 p-2.5 rounded-2xl">
                <div className="flex items-center gap-1.5 font-mono text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {currentTime.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase()} • {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>

                <div className="flex items-center gap-1 bg-black/30 border border-white/10 p-1 rounded-xl">
                  <button 
                    onClick={() => setWeatherPeriod('dia')}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${weatherPeriod === 'dia' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Sun className="w-3 h-3" /> Dia
                  </button>
                  <button 
                    onClick={() => setWeatherPeriod('tarde')}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${weatherPeriod === 'tarde' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Sunset className="w-3 h-3" /> Tarde
                  </button>
                  <button 
                    onClick={() => setWeatherPeriod('noite')}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${weatherPeriod === 'noite' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Moon className="w-3 h-3" /> Noite
                  </button>
                </div>
              </div>

              {/* Itinerary Day & City Selector (For multi-city trips) */}
              {tripId === 'am_salvador_julho' && (
                <div className="grid grid-cols-4 gap-1.5 bg-slate-950/60 border border-white/10 p-1.5 rounded-2xl">
                  {SALVADOR_JULHO_LOCATIONS.map((loc, idx) => {
                    const isActive = selectedLocIdx === idx;
                    let colorClasses = '';
                    if (idx === 0 || idx === 3) {
                      colorClasses = isActive 
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-black shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-emerald-500/[0.04] border-emerald-500/10 text-emerald-400/80 hover:bg-emerald-500/10';
                    } else if (idx === 1) {
                      colorClasses = isActive 
                        ? 'bg-sky-500/20 border-sky-500/60 text-sky-300 font-black shadow-[0_0_12px_rgba(14,165,233,0.3)]'
                        : 'bg-sky-500/[0.04] border-sky-500/10 text-sky-400/80 hover:bg-sky-500/10';
                    } else if (idx === 2) {
                      colorClasses = isActive 
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                        : 'bg-amber-500/[0.04] border-amber-500/10 text-amber-400/80 hover:bg-amber-500/10';
                    }
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedLocIdx(idx)}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all border ${colorClasses}`}
                      >
                        <span className="text-xs font-black tracking-wide uppercase leading-none">{loc.dateRange}</span>
                        <span className="text-[10px] font-bold opacity-90 uppercase leading-none mt-1">{loc.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-2" />
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Atualizando Satélites...</span>
                </div>
              ) : weather ? (
                <div className="flex flex-col gap-3">
                  
                  {/* Weather main metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-around">
                      <div className="flex flex-col items-center">
                        <WeatherIcon className={`w-10 h-10 ${currentCondition.color} mb-1 animate-pulse`} />
                        <span className="text-xs font-black tracking-widest text-slate-200 uppercase mt-1">
                          {currentCondition.label}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-start">
                          <span className="text-4xl font-black text-white">{Math.round(weather.temp)}</span>
                          <span className="text-xs font-bold text-slate-400 ml-1">°C</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 tracking-wider mt-1 uppercase">
                          Sensação {Math.round(weather.feelsLike)}°
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                          <CloudRain className="w-4 h-4 text-cyan-400" /> Chuva
                        </span>
                        <span className="text-xs font-black text-white">{Math.round(rainPercent)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-cyan-400" /> Umidade
                        </span>
                        <span className="text-xs font-black text-white">{Math.round(weather.humidity)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                          <Wind className="w-4 h-4 text-cyan-400" /> Vento
                        </span>
                        <span className="text-xs font-black text-white">{Math.round(weather.windSpeed)} km/h</span>
                      </div>
                    </div>
                  </div>

                  {/* Programação Forecast */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                    <h4 className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-3 pb-1 border-b border-white/10">
                      PROGRAMAÇÃO DA VIAGEM • {SALVADOR_JULHO_LOCATIONS[selectedLocIdx]?.name?.toUpperCase()}
                    </h4>
                    <div className={`grid gap-2 ${SALVADOR_JULHO_LOCATIONS[selectedLocIdx]?.dates?.length === 1 ? 'grid-cols-1' : SALVADOR_JULHO_LOCATIONS[selectedLocIdx]?.dates?.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                      {SALVADOR_JULHO_LOCATIONS[selectedLocIdx]?.dates?.map((targetDate: string) => {
                        const i = weather.daily?.time?.findIndex((t: string) => t === targetDate);
                        
                        const code = i !== undefined && i >= 0 ? (weather.daily.weatherCode?.[i] ?? 0) : 0;
                        const max = i !== undefined && i >= 0 ? Math.round(weather.daily.tempMax?.[i] ?? weather.temp) : Math.round(weather.temp);
                        const min = i !== undefined && i >= 0 ? Math.round(weather.daily.tempMin?.[i] ?? weather.temp - 4) : Math.round(weather.temp - 4);
                        const prob = i !== undefined && i >= 0 ? Math.round(weather.daily.rainProb?.[i] ?? 0) : 0;
                        const details = getWeatherDetails(code);
                        const IconComp = details.icon;
                        const dayLabel = `${targetDate.slice(8, 10)} JUL`;
                        
                        return (
                          <div key={targetDate} className="flex flex-col items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
                            <span className="text-[10px] text-slate-300 font-bold uppercase mb-1">{dayLabel}</span>
                            <IconComp className={`w-5 h-5 ${details.color} my-1`} />
                            <div className="flex items-center gap-1 font-mono text-xs font-black">
                              <span className="text-white">{max}°</span>
                              <span className="text-slate-400 font-normal">{min}°</span>
                            </div>
                            <span className="text-[10px] text-cyan-400 font-bold mt-1">{prob}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ) : null}

              <button
                onClick={() => setShowWeatherModal(false)}
                className="mt-2 w-full py-2.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-xl font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Fechar Previsão
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 💰 COST SUMMARY DETAILED MODAL */}
      {/* ========================================================= */}
      {showCostsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0B0F19] border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between text-white relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span className="text-base sm:text-lg font-black tracking-wider uppercase text-white">
                  RESUMO DE CUSTOS DA VIAGEM
                </span>
              </div>
              <button
                onClick={() => setShowCostsModal(false)}
                className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors shrink-0"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Display Banner */}
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-mono font-black text-[#81E6D9]">
                  R$ {totalEstimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mt-1">
                  VALOR CALCULADO POR PESSOA
                </span>
              </div>

              <div className="hidden sm:block h-12 w-px bg-white/10"></div>

              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-300">
                  R$ {totalEstimatedForTwo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest mt-1">
                  VALOR TOTAL PARA 2 PESSOAS
                </span>
              </div>
            </div>

            <p className="text-[10px] font-black uppercase text-slate-400 text-center tracking-widest my-3">
              CLIQUE NOS CARDS PARA INCLUIR OU REMOVER ITENS DO CÁLCULO
            </p>

            {/* Interactive Cost Items Grid */}
            <div className={`grid grid-cols-1 ${costItems.length >= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'} gap-3 items-stretch w-full`}>
              {costItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={item.id}
                    onClick={item.onToggle}
                    className={`flex flex-col justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      item.included 
                        ? 'bg-white/5 border-emerald-500/40 text-white hover:bg-white/10 shadow-[0_4px_20px_rgba(16,185,129,0.1)]' 
                        : 'bg-white/0 border-white/10 text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    {/* Item Top Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          item.included ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-black uppercase tracking-wider ${
                          item.included ? 'text-white' : 'text-slate-500'
                        }`}>
                          {item.title}
                        </span>
                      </div>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        item.included ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-white/20'
                      }`}>
                        {item.included && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-3 flex flex-col justify-between gap-2">
                      <div className="flex items-baseline justify-between">
                        <span className={`text-base font-black font-mono ${
                          item.included ? 'text-[#81E6D9]' : 'text-slate-500'
                        }`}>
                          R$ {item.valuePerPerson.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-slate-400">/ pessoa</span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1 border-t border-white/5">
                        <span className={`text-xs font-bold font-mono ${
                          item.included ? 'text-emerald-400' : 'text-slate-500'
                        }`}>
                          R$ {item.valueTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[9px] font-medium uppercase text-slate-400">/ 2 pessoas</span>
                      </div>

                      {/* Detailed breakdown if available */}
                      {item.breakdown && (
                        <div className="mt-2 pt-2 border-t border-white/10 space-y-1 text-[10px] font-mono">
                          {item.breakdown.map((b, i) => (
                            <div key={i} className="flex justify-between items-center text-slate-300">
                              <span className="truncate pr-2">{b.label}:</span>
                              <span className="font-bold text-white shrink-0">
                                R$ {b.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {!item.breakdown && (
                        <p className={`text-[10px] font-medium mt-1 ${item.included ? 'text-slate-300' : 'text-slate-500'}`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowCostsModal(false)}
              className="mt-4 w-full py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Fechar Resumo de Custos
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Header;
