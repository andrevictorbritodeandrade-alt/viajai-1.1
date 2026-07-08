
import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Clock, 
  CalendarDays, 
  Calculator,
  TrendingUp,
  Plus,
  Trash2,
  MapPin
} from 'lucide-react';
import CategoryHeader from './CategoryHeader';
import { syncDataToCloud, loadDataFromCloud } from '../services/firebase';
import { getRates } from '../services/currencyService';
import { CurrencyCode } from '../types';

export interface Ride {
  id: string;
  origin: string;
  destination: string;
  date: string;
  amount: number;
  currency: CurrencyCode;
  amountInBRL: number;
}

const UberBoltList: React.FC<{ 
  selectedTrip?: { id: string; name: string } | null;
  onBack: () => void;
}> = ({ selectedTrip, onBack }) => {
  const tripId = selectedTrip?.id || 'default';
  const STORAGE_KEY = `viajai_rides_log_${tripId}`;

  // OFFLINE FIRST STATE
  const [rides, setRides] = useState<Ride[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      return [];
    } catch { return []; }
  });

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('BRL');
  const [rates, setRates] = useState<{USD: number, BRL: number, ZAR: number} | null>(null);

  useEffect(() => {
    // 1. Load Rates
    const initData = async () => {
      const r = await getRates();
      setRates(r);

      // 2. Background Sync for Rides
      if (navigator.onLine) {
        try {
            const cloudData = await loadDataFromCloud(`rides_log_${tripId}`); 
            if (cloudData && cloudData.list) {
                setRides(cloudData.list);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData.list));
            }
        } catch (e) { console.error("Background sync failed", e); }
      }
    };
    initData();
  }, [tripId, STORAGE_KEY]);

  // Auto Save Changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rides));
    
    // Debounce cloud sync
    const t = setTimeout(() => {
      syncDataToCloud(`rides_log_${tripId}`, { list: rides });
    }, 2000);
    return () => clearTimeout(t);
  }, [rides, tripId, STORAGE_KEY]);

  const handleAdd = () => {
    if (!origin.trim() || !destination.trim() || !amount || !rates || !date) return;

    const val = parseFloat(amount);
    let valInBRL = 0;

    // Conversion Logic (Base USD)
    if (currency === 'BRL') valInBRL = val;
    else if (currency === 'USD') valInBRL = val * rates.BRL; 
    else if (currency === 'ZAR') {
      const valInUSD = val / rates.ZAR;
      valInBRL = valInUSD * rates.BRL;
    }

    const [yyyy, mm, dd] = date.split('-');
    const formattedDate = `${dd}/${mm}/${yyyy}`;

    const newRide: Ride = {
      id: Date.now().toString(),
      origin,
      destination,
      date: formattedDate,
      amount: val,
      currency,
      amountInBRL: valInBRL
    };

    setRides([newRide, ...rides]);
    setOrigin('');
    setDestination('');
    setAmount('');
  };

  const handleDelete = (id: string) => {
    setRides(rides.filter(r => r.id !== id));
  };

  const totalSpentBRL = rides.reduce((acc, curr) => acc + curr.amountInBRL, 0);
  
  // Calculate equivalent in ZAR just for display
  const totalSpentZAR = rates ? (totalSpentBRL / rates.BRL) * rates.ZAR : 0;

  return (
    <div className="pb-48">
      <CategoryHeader title="Trajetos de Carro (Uber/Bolt)" onBack={onBack} />
      <div className="p-4 space-y-6">
      
      {/* Header Summary */}
      <div className="bg-slate-900 text-white rounded-[32px] p-6 shadow-xl border border-slate-700 relative overflow-hidden animate-in fade-in slide-in-from-top-4">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Calculator className="w-24 h-24" />
        </div>
        
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-sa-green font-bold text-[10px] uppercase tracking-widest">
                <Car className="w-4 h-4" /> Resumo Financeiro de Trajetos
            </div>
            
            <div className="flex flex-col gap-1">
                <span className="text-4xl font-display font-black tracking-tight text-white">
                    R$ {totalSpentBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {rates && (
                  <span className="text-sm font-medium text-slate-400">
                      Equivalente em Rands (ZAR): <span className="text-sa-gold font-black">R {totalSpentZAR.toFixed(0)}</span>
                  </span>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                <span>{rides.length} Trajetos Registrados</span>
                {rates && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-sa-green" />
                    Câmbio Atualizado
                  </span>
                )}
            </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-900"></div>
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-slate-600" /> Registrar Trajeto
        </h3>
        
        <div className="space-y-3">
          <input 
            type="date" 
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-500 font-medium text-sm text-slate-600"
          />
          <input 
            type="text" 
            placeholder="De onde você saiu? (Origem)" 
            value={origin}
            onChange={e => setOrigin(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-500 font-medium text-sm text-slate-800"
          />
          <input 
            type="text" 
            placeholder="Para onde você foi? (Destino)" 
            value={destination}
            onChange={e => setDestination(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-500 font-medium text-sm text-slate-800"
          />
          
          <div className="flex gap-2">
            <div className="w-1/3 relative">
               <select 
                 value={currency} 
                 onChange={e => setCurrency(e.target.value as CurrencyCode)}
                 className="w-full p-3 bg-slate-100 rounded-xl font-bold text-slate-700 appearance-none outline-none border border-transparent focus:bg-white focus:border-slate-500"
               >
                 <option value="BRL">Real (R$)</option>
                 <option value="USD">Dólar ($)</option>
                 <option value="ZAR">Rand (R)</option>
               </select>
            </div>
            <input 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-500 font-bold text-slate-800"
            />
          </div>

          <button 
            onClick={handleAdd}
            disabled={!origin || !destination || !amount}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-md shadow-slate-200 disabled:opacity-50 disabled:shadow-none mt-2"
          >
            Salvar Trajeto
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4 mt-8">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">Histórico de Trajetos</h4>
        
        {rides.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              Nenhum trajeto registrado.
          </div>
        )}

        {rides.map((ride) => (
          <div key={ride.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-900"></div>

              <div className="pl-3">
                  <div className="flex justify-between items-start mb-4">
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <CalendarDays className="w-3 h-3" /> {ride.date}
                      </span>
                      <button onClick={() => handleDelete(ride.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                         <Trash2 className="w-4 h-4" />
                      </button>
                  </div>

                  {/* Rota */}
                  <div className="relative pl-3 border-l-2 border-dashed border-slate-200 space-y-4 my-4 ml-1">
                      <div className="relative">
                          <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white shadow-sm"></div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Origem</p>
                          <p className="text-xs font-bold text-slate-600 uppercase leading-tight">{ride.origin}</p>
                      </div>
                      <div className="relative">
                          <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-sa-green border-2 border-white shadow-sm"></div>
                          <p className="text-[10px] font-bold text-sa-green uppercase leading-none mb-1">Destino</p>
                          <p className="text-sm font-black text-slate-800 uppercase leading-tight">{ride.destination}</p>
                      </div>
                  </div>

                  {/* Footer Preço */}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-50 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor Pago</span>
                      <div className="text-right">
                          <span className="block text-xl font-display font-black text-slate-800 leading-none">
                            {ride.currency} {ride.amount.toLocaleString()}
                          </span>
                          {ride.currency !== 'BRL' && (
                            <span className="block text-[10px] font-bold text-sa-green mt-1">
                                ≈ R$ {ride.amountInBRL.toFixed(2)}
                            </span>
                          )}
                      </div>
                  </div>
              </div>
          </div>
        ))}
      </div>

      </div>
    </div>
  );
};

export default UberBoltList;

