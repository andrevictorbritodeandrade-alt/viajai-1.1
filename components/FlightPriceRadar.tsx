import React, { useState } from 'react';
import { 
  Plane, 
  ExternalLink, 
  Clock, 
  ArrowLeft,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import CategoryHeader from './CategoryHeader';

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

  const filteredFlights = selectedFilter === 'todos' 
    ? FLIGHT_OPTIONS 
    : FLIGHT_OPTIONS.filter(f => f.destinationCity.toLowerCase().includes(selectedFilter.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans pb-16">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <CategoryHeader
          title="Radar de Voos"
          category="Dezembro & Janeiro"
          themeColor="green"
          total={filteredFlights.length}
          label="Opções Encontradas"
          onBack={onBack}
        />
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
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              selectedFilter === tab.id
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Flights List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFlights.map((flight) => (
          <div
            key={flight.id}
            className="bg-slate-900/90 backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Destination & Airline */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full inline-block mb-1.5">
                    {flight.destination}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {flight.routeTitle}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {flight.airline} • {flight.flightType === 'direto' ? 'Voo Direto' : 'Com Conexão'}
                  </p>
                </div>

                {/* Price Display */}
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ida e Volta</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
                    R$ {flight.bestPrice}
                  </span>
                </div>
              </div>

              {/* Flight Itinerary Box */}
              <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-4 space-y-3 mb-4 text-xs">
                {/* Outbound (Ida) */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Ida • {flight.departureDate}</span>
                    <span className="text-white font-bold text-sm">
                      {flight.departureTime} ({flight.originCode}) <ArrowRight className="w-3 h-3 inline text-emerald-400 mx-1" /> {flight.departureArriveTime} ({flight.destCode})
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
                    <span className="text-white font-bold text-sm">
                      {flight.returnTime} ({flight.destCode}) <ArrowRight className="w-3 h-3 inline text-emerald-400 mx-1" /> {flight.returnArriveTime} ({flight.originCode})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium text-right">
                    {flight.returnDuration}
                  </span>
                </div>
              </div>

              {/* Timestamp info */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-5">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Preço verificado em <strong>{flight.recordedAt}</strong> via {flight.bestProvider}</span>
              </div>
            </div>

            {/* Direct Google Flights Link Button */}
            <a
              href={flight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 transition-all text-center"
            >
              <span>Abrir no Google Flights</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>

    </div>
  );
};

export default FlightPriceRadar;
