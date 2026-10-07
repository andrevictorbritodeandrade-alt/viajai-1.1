import React, { useState } from 'react';
import { 
  Plane, 
  ExternalLink, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Search, 
  X,
  Coins
} from 'lucide-react';
import CategoryHeader from './CategoryHeader';
import MilesAndPointsCard from './MilesAndPointsCard';

export interface FlightOption {
  id: string;
  destination: string;
  destinationCity: string;
  routeTitle: string;
  originCode: string;
  originCity: string;
  destCode: string;
  destCity: string;
  airline: string;
  flightType: 'direto' | 'conexao';
  departureDate: string;
  departureTime: string;
  departureArriveTime: string;
  departureDuration: string;
  returnDate: string;
  returnTime: string;
  returnArriveTime: string;
  returnDuration: string;
  bestPrice: number;
  bestProvider: string;
  recordedAt: string;
  bookingUrl: string;
}

const FLIGHT_OPTIONS: FlightOption[] = [
  {
    id: 'gig-mvd-jetsmart',
    destination: 'Montevidéu, Uruguai',
    destinationCity: 'Montevidéu',
    routeTitle: 'Rio de Janeiro (GIG) ↔ Montevidéu (MVD)',
    originCode: 'GIG',
    originCity: 'Rio de Janeiro',
    destCode: 'MVD',
    destCity: 'Montevidéu',
    airline: 'JetSMART',
    flightType: 'direto',
    departureDate: 'Sex., 25 de dez. de 2026',
    departureTime: '10:00',
    departureArriveTime: '13:10',
    departureDuration: '3h 10min (Sem escalas)',
    returnDate: 'Qui., 14 de jan. de 2027',
    returnTime: '13:57',
    returnArriveTime: '16:40',
    returnDuration: '2h 43min (Sem escalas)',
    bestPrice: 1362,
    bestProvider: 'Trip.com / JetSMART',
    recordedAt: '15/09/2026 às 11:29',
    bookingUrl: 'https://www.google.com/travel/flights/booking?tfs=CBwQAhpJEgoyMDI2LTEyLTI1Ih8KA0dJRxIKMjAyNi0xMi0yNRoDTVZEKgJKQTIDNzYyagwIAhIIL20vMDZnbXJyDAgCEggvbS8wOWpwMxpJEgoyMDI3LTAxLTE0Ih8KA01WRBIKMjAyNy0wMS0xNBoDR0lHKgJKQTIDNzYzagwIAhIIL20vMDlqcDNyDAgCEggvbS8wNmdtckABSAFwAYIBCwj___________8BmAEB&tfu=CmxDalJJVjNsblkyaGhZa3hsTURoQlFVTlBNbWRDUnkwdExTMHRMUzB0TFdObGVtWTBNa0ZCUVVGQlIzRndhbGh6U25kVFEyMUJFZ1ZLUVRjMk14b0xDTkduQ0JBQ0dnTkNVa3c0SEhEZ3pnRT0SBCACKAEiAA&hl=pt-BR&gl=BR&authuser=0&gsas=1&curr=BRL'
  },
  {
    id: 'gig-mvd-sky-jetsmart',
    destination: 'Montevidéu, Uruguai',
    destinationCity: 'Montevidéu',
    routeTitle: 'Rio de Janeiro (GIG) ↔ Montevidéu (MVD)',
    originCode: 'GIG',
    originCity: 'Rio de Janeiro',
    destCode: 'MVD',
    destCity: 'Montevidéu',
    airline: 'Sky Airline + JetSMART',
    flightType: 'direto',
    departureDate: 'Sex., 25 de dez. de 2026',
    departureTime: '11:05',
    departureArriveTime: '14:05',
    departureDuration: '3h 00min (Sem escalas)',
    returnDate: 'Qui., 14 de jan. de 2027',
    returnTime: '13:57',
    returnArriveTime: '16:40',
    returnDuration: '2h 43min (Sem escalas)',
    bestPrice: 1371,
    bestProvider: 'Flightnetwork / Gotogate',
    recordedAt: '15/09/2026 às 11:29',
    bookingUrl: 'https://www.google.com/travel/flights/booking?tfs=CBwQAhpKEgoyMDI2LTEyLTI1IiAKA0dJRxIKMjAyNi0xMi0yNRoDTVZEKgJIMjIEMTgxNGoMCAISCC9tLzA2Z21ycgwIAhIIL20vMDlqcDMaSRIKMjAyNy0wMS0xNCIfCgNNVkQSCjIwMjctMDEtMTQaA0dJRyoCSkEyAzc2M2oMCAISCC9tLzA5anAzcgwIAhIIL20vMDZnbXJAAUgBcAGCAQsI____________AZgBAQ&tfu=CmxDalJJVWxCMFdGRnNiRE5EWTI5QlJHbFRUbEZDUnkwdExTMHRMV05uWW5ob015MXVNVUZCUVVGQlIzRndhbUpyUm5oUWNIbEJFZ1ZLUVRjMk14b0xDTGl1Q0JBQ0dnTkNVa3c0SEhDSjBBRT0SBCACKAEiAwoBMA&hl=pt-BR&gl=BR&authuser=0&gsas=1&curr=BRL'
  },
  {
    id: 'cnf-for-gol',
    destination: 'Fortaleza, Ceará',
    destinationCity: 'Fortaleza',
    routeTitle: 'Belo Horizonte (CNF) ↔ Fortaleza (FOR)',
    originCode: 'CNF',
    originCity: 'Belo Horizonte / Confins',
    destCode: 'FOR',
    destCity: 'Fortaleza',
    airline: 'Gol Linhas Aéreas',
    flightType: 'conexao',
    departureDate: 'Qua., 16 de dez. de 2026',
    departureTime: '18:50',
    departureArriveTime: '23:35',
    departureDuration: '4h 45min (1 escala em Salvador SSA)',
    returnDate: 'Seg., 28 de dez. de 2026',
    returnTime: '03:40',
    returnArriveTime: '09:00',
    returnDuration: '5h 20min (1 escala em Salvador SSA)',
    bestPrice: 759,
    bestProvider: 'Maxmilhas / Gol',
    recordedAt: '15/09/2026 às 11:29',
    bookingUrl: 'https://www.google.com/travel/flights/booking?tfs=CBwQAhpnEgoyMDI2LTEyLTE2Ih8KA0NORhIKMjAyNi0xMi0xNhoDU1NBOgJHM2IAMTgwOCIgCgNTU0ESCjIwMjYtMTItMTYaA0ZPUjoCRzNiBDIwMzBqDAgCEggvbS8wMWN4X3IMCAMSCC9tLzAyeHZwGmcSCjIwMjYtMTItMjgiIAoDRk9SEgoyMDI2LTEyLTI4GgNTU0E6AkczYgQyMDI5Ih8KA1NTQRIKMjAyNi0xMi0yOBoDQ05GOgJHM2IAMTgwOWoMCAMSCC9tLzAyeHZwcgwIAhIIL20vMDFjeF9AAUgBcAGCAQsI____________AZgBAQ&tfu=CnRDalJJY2pWcFVGRlhPRXcyWWpCQlQyNUhNMUZDUnkwdExTMHRMUzB0TFMxM2JtOXVNREZGUVVGQlIzRndhbEJ6UWpSMVRVRkJFZ1ZITXpJeU1Ea2FDZ2pqa3dRU0dnak5DVWt3NEhEQ2p3RT0SBCACKAEiAA&hl=pt-BR&gl=BR&authuser=0&gsas=1&curr=BRL'
  },
  {
    id: 'gig-poa-gol-dia',
    destination: 'Porto Alegre / Serra Gaúcha',
    destinationCity: 'Porto Alegre',
    routeTitle: 'Rio de Janeiro (GIG) ↔ Porto Alegre (POA)',
    originCode: 'GIG',
    originCity: 'Rio de Janeiro',
    destCode: 'POA',
    destCity: 'Porto Alegre',
    airline: 'Gol Linhas Aéreas',
    flightType: 'direto',
    departureDate: 'Sex., 25 de dez. de 2026',
    departureTime: '08:50',
    departureArriveTime: '10:55',
    departureDuration: '2h 05min (Sem escalas)',
    returnDate: 'Sex., 8 de jan. de 2027',
    returnTime: '12:00',
    returnArriveTime: '14:00',
    returnDuration: '2h 00min (Sem escalas)',
    bestPrice: 630,
    bestProvider: 'Maxmilhas / Gol',
    recordedAt: '15/09/2026 às 11:29',
    bookingUrl: 'https://www.google.com/travel/flights/booking?tfs=CBwQAhpJEgoyMDI2LTEyLTI1Ih8KA0dJRxIKMjAyNi0xMi0yNRoDUE9BOgJHM2IAMjE2MGgCagwIAhIIL20vMDZnbXJyDAgCEggvbS8wMWN5MxpJEgoyMDI3LTAxLTA4Ih8KA1BPQRIKMjAyNy0wMS0wOBoDR0lHOgJHM2IAMjE2MWgCagwIAhIIL20vMDFjeTNyDAgCEggvbS8wNmdtckABSAFwAYIBCwj___________8BmAEB&tfu=CmxDalJJZFdaVmQwOUZObE52ZFdGQlFVaEZTRUZDUnkwdExTMHRMUzB0TFhCbmFta3hNMUZCUVVGQlIzRndhbUY0WTFoVFMxTkJFZ1ZITXpJeE5qRWhDbk9sY1JBQ0dnTkNVa3c0SEhEc3pnRT0SBCACKAEiAA&hl=pt-BR&gl=BR&authuser=0&gsas=1&curr=BRL'
  },
  {
    id: 'gig-poa-gol-noite',
    destination: 'Porto Alegre / Serra Gaúcha',
    destinationCity: 'Porto Alegre',
    routeTitle: 'Rio de Janeiro (GIG) ↔ Porto Alegre (POA) • Volta Noturna',
    originCode: 'GIG',
    originCity: 'Rio de Janeiro',
    destCode: 'POA',
    destCity: 'Porto Alegre',
    airline: 'Gol Linhas Aéreas',
    flightType: 'direto',
    departureDate: 'Sex., 25 de dez. de 2026',
    departureTime: '08:50',
    departureArriveTime: '10:55',
    departureDuration: '2h 05min (Sem escalas)',
    returnDate: 'Sex., 8 de jan. de 2027',
    returnTime: '21:15',
    returnArriveTime: '23:15',
    returnDuration: '2h 00min (Sem escalas)',
    bestPrice: 651,
    bestProvider: 'Maxmilhas / Gol',
    recordedAt: '15/09/2026 às 11:29',
    bookingUrl: 'https://www.google.com/travel/flights/booking?tfs=CBwQAhpJEgoyMDI2LTEyLTI1Ih8KA0dJRxIKMjAyNi0xMi0yNRoDUE9BOgJHM2IAMjE2MGgCagwIAhIIL20vMDZnbXJyDAgCEggvbS8wMWN5MxpJEgoyMDI3LTAxLTA4Ih8KA1BPQRIKMjAyNy0wMS0wOBoDR0lHOgJHM2IAMjE2M2gCagwIAhIIL20vMDFjeTNyDAgCEggvbS8wNmdtckABSAFwAYIBCwj___________8BmAEB&tfu=CmxDalJJUTBGMmRFOTFUbWd6VDBWQlFsWk5VMUZDUnkwdExTMHRMUzB0TFMxMmFXMHhORUZCUVVGQlIzRndhbU52U1ZkaloxRkJFZ1ZITXpJeE5qTWhDbXU1YWhBQ0dnTkNVa3c0SEhEbmFnRT0SBCACKAEiAA&hl=pt-BR&gl=BR&authuser=0&gsas=1&curr=BRL'
  }
];

interface FlightPriceRadarProps {
  onBack?: () => void;
}

const FlightPriceRadar: React.FC<FlightPriceRadarProps> = ({ onBack }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFlights = FLIGHT_OPTIONS.filter((flight) => {
    // Filter by destination tab
    const matchesTab = 
      selectedFilter === 'todos' || 
      flight.destinationCity.toLowerCase().includes(selectedFilter.toLowerCase());

    // Filter by search query (airline or destination)
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = 
      !query ||
      flight.airline.toLowerCase().includes(query) ||
      flight.destination.toLowerCase().includes(query) ||
      flight.destinationCity.toLowerCase().includes(query) ||
      flight.destCity.toLowerCase().includes(query) ||
      flight.destCode.toLowerCase().includes(query) ||
      flight.routeTitle.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans pb-16">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <CategoryHeader
          title="Radar de Voos"
          category="Dezembro & Janeiro"
          themeColor="dark"
          total={filteredFlights.length}
          label="Opções Encontradas"
          onBack={onBack}
        />
      </div>

      {/* Smiles Miles & KMV Ipiranga Points Card */}
      <MilesAndPointsCard />

      {/* Search Input for Airline or Destination */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por companhia aérea ou destino (ex: Gol, JetSMART, Montevidéu...)"
          className="w-full bg-[#131b2e] border border-white/10 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'todos', label: 'Todos os Voos' },
          { id: 'montevidéu', label: 'Montevidéu (MVD)' },
          { id: 'fortaleza', label: 'Fortaleza (FOR)' },
          { id: 'porto alegre', label: 'Porto Alegre (POA)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === tab.id
                ? 'bg-white text-slate-950 shadow-md shadow-white/5'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Flights List or Empty State */}
      {filteredFlights.length === 0 ? (
        <div className="bg-[#131b2e] border border-white/10 rounded-3xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <p className="text-white font-extrabold text-sm">Nenhum voo encontrado</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery 
              ? `Nenhum voo coincide com a busca "${searchQuery}". Tente buscar por outra companhia aérea ou destino.` 
              : 'Nenhum voo coincide com a categoria selecionada.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('todos');
            }}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFlights.map((flight) => (
          <div
            key={flight.id}
            className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 rounded-3xl p-5 sm:p-6 shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Destination & Airline */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300 bg-white/[0.06] border border-white/10 px-2.5 py-1 rounded-full inline-block mb-1.5">
                    {flight.destination}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                    {flight.routeTitle}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {flight.airline} • {flight.flightType === 'direto' ? 'Voo Direto' : 'Com Conexão'}
                  </p>
                </div>

                {/* Price Display */}
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ida e Volta</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
                    R$ {flight.bestPrice}
                  </span>
                </div>
              </div>

              {/* Flight Itinerary Box */}
              <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-4 space-y-3 mb-4 text-xs">
                {/* Outbound (Ida) */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Ida • {flight.departureDate}</span>
                    <span className="text-white font-bold text-sm tabular-nums">
                      {flight.departureTime} ({flight.originCode}) <ArrowRight className="w-3.5 h-3.5 inline text-slate-400 mx-1" /> {flight.departureArriveTime} ({flight.destCode})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium text-right">
                    {flight.departureDuration}
                  </span>
                </div>

                {/* Return (Volta) */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Volta • {flight.returnDate}</span>
                    <span className="text-white font-bold text-sm tabular-nums">
                      {flight.returnTime} ({flight.destCode}) <ArrowRight className="w-3.5 h-3.5 inline text-slate-400 mx-1" /> {flight.returnArriveTime} ({flight.originCode})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium text-right">
                    {flight.returnDuration}
                  </span>
                </div>
              </div>

              {/* Smiles GOL Eligibility Badge */}
              {flight.airline.toLowerCase().includes('gol') && (
                <div className="mb-4 px-3.5 py-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-orange-300">
                    <Coins className="w-4 h-4 text-orange-400 shrink-0" />
                    <span className="font-bold text-[11px]">Emissão via Smiles GOL:</span>
                  </div>
                  <span className="text-orange-300 text-[11px] font-extrabold tabular-nums">
                    18.608 + até 11.000 pts KMV
                  </span>
                </div>
              )}

              {/* Timestamp info */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Preço verificado em <strong>{flight.recordedAt}</strong> via {flight.bestProvider}</span>
              </div>
            </div>

            {/* Direct Google Flights Link Button */}
            <a
              href={flight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-white/5 hover:scale-[1.01] active:scale-95 transition-all text-center cursor-pointer"
            >
              <span>Abrir no Google Flights</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
      )}

    </div>
  );
};

export default FlightPriceRadar;
