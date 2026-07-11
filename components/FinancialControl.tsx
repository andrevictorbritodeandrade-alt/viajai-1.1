
import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Landmark, 
  Bus, 
  Hotel, 
  Car,
  TrendingDown,
  Cloud,
  MapPin,
  Receipt,
  Banknote,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Loader2,
  Coins,
  Plane
} from 'lucide-react';
import { GUIDE_STORAGE_KEY } from './GuideList';
import { EXPENSES_STORAGE_KEY } from '../constants';
import { syncDataToCloud, loadDataFromCloud } from '../services/firebase';
import CategoryHeader from './CategoryHeader';
import { getFinancialStrategy, FinancialStrategy } from '../services/geminiService';

const toBRL = (val: number) => {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// --- BANK LOGOS COMPONENTS ---
const WiseLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-[#9FE870]" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.555 18.736l3.473-13.473h5.922l-1.077 4.975h3.94l-3.326 8.498h-4.32l.732-3.136H6.676l-.88 3.136H3.555z"/>
  </svg>
);

const NomadLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-[#FFD700]" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="black"/>
    <path d="M7 17V7l5 6 5-6v10" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const InterLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" className="fill-[#FF7A00]"/>
    <path d="M7 12h10M12 7v10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const CashLogo = () => (
  <div className="w-6 h-6 bg-green-700 rounded text-white flex items-center justify-center">
    <Banknote className="w-4 h-4" />
  </div>
);

interface Wallets {
  wise: number;
  nomad: number;
  inter: number;
  cash: number;
}

const WalletInput: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (val: string) => void;
  colorClass: string;
}> = ({ label, icon, value, onChange, colorClass }) => (
  <div className={`flex items-center gap-4 p-4 rounded-2xl border ${colorClass} shadow-md transition-all focus-within:ring-2 focus-within:ring-cyan-500/20`}>
    <div className="shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <span className="text-xs md:text-sm font-black tracking-wider text-slate-100 uppercase block mb-1">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-slate-200 text-sm md:text-base font-black">R$</span>
        <input 
          type="number" 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full text-lg md:text-2xl font-black text-white outline-none bg-transparent"
        />
      </div>
    </div>
  </div>
);

const FinancialControl: React.FC<{ 
  selectedTrip?: { id: string; name: string; isDomestic?: boolean } | null;
  onBack: () => void;
}> = ({ selectedTrip, onBack }) => {
  const trip = selectedTrip || { id: 'am_africa_sul', name: 'África do Sul', isDomestic: false };
  const cityALabel = (trip.id === 'am_salvador_julho' || trip.name.toLowerCase().includes('salvador')) ? 'Salvador' : 'Cidade do Cabo';
  const cityBLabel = (trip.id === 'am_salvador_julho' || trip.name.toLowerCase().includes('aracaju')) ? 'Aracaju' : 'Joanesburgo';

  // --- STATE WITH OFFLINE-FIRST INITIALIZATION ---
  const [wallets, setWallets] = useState<Wallets>(() => {
    try {
      const saved = localStorage.getItem('viajai_finance_v1');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed?.wallets || { wise: 0, nomad: 0, inter: 0, cash: 0 };
    } catch {
      return { wise: 0, nomad: 0, inter: 0, cash: 0 };
    }
  });
  
  const [hotelCost, setHotelCost] = useState<number>(() => {
    try {
        const saved = localStorage.getItem('viajai_finance_v1');
        const parsed = saved ? JSON.parse(saved) : null;
        if (parsed && typeof parsed.hotelCost === 'number') {
          if (selectedTrip?.id === 'am_salvador_julho' && parsed.hotelCost === 0) {
            return 1281.51;
          }
          return parsed.hotelCost;
        }
    } catch {}
    return (selectedTrip?.id === 'am_salvador_julho') ? 1281.51 : 0;
  });

  const [carRentalCost, setCarRentalCost] = useState<number>(() => {
    try {
        const saved = localStorage.getItem('viajai_finance_v1');
        const parsed = saved ? JSON.parse(saved) : null;
        if (parsed && typeof parsed.carRentalCost === 'number') {
          if (selectedTrip?.id === 'am_salvador_julho' && parsed.carRentalCost === 0) {
            return 455.53;
          }
          return parsed.carRentalCost;
        }
    } catch {}
    return (selectedTrip?.id === 'am_salvador_julho') ? 455.53 : 0;
  });

  const [busCost, setBusCost] = useState<number>(() => {
    try {
        const saved = localStorage.getItem('viajai_finance_v1');
        return saved ? JSON.parse(saved).busCost || 0 : 0;
    } catch { return 0; }
  });

  const [airfareCost, setAirfareCost] = useState<number>(() => {
    try {
        const saved = localStorage.getItem('viajai_finance_v1');
        const parsed = saved ? JSON.parse(saved) : null;
        if (parsed && typeof parsed.airfareCost === 'number') {
          if (selectedTrip?.id === 'am_salvador_julho' && parsed.airfareCost === 0) {
            return 1394.00;
          }
          return parsed.airfareCost;
        }
    } catch { return 0; }
    return (selectedTrip?.id === 'am_salvador_julho') ? 1394.00 : 0;
  });

  // Sync defaults on trip.id change
  useEffect(() => {
    const saved = localStorage.getItem('viajai_finance_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (trip.id === 'am_salvador_julho') {
          setHotelCost(typeof parsed.hotelCost === 'number' && parsed.hotelCost !== 0 ? parsed.hotelCost : 1281.51);
          setCarRentalCost(typeof parsed.carRentalCost === 'number' && parsed.carRentalCost !== 0 ? parsed.carRentalCost : 455.53);
          setAirfareCost(typeof parsed.airfareCost === 'number' && parsed.airfareCost !== 0 ? parsed.airfareCost : 1394.00);
        } else {
          setHotelCost(parsed.hotelCost || 0);
          setCarRentalCost(parsed.carRentalCost || 0);
          setAirfareCost(parsed.airfareCost || 0);
        }
        setBusCost(parsed.busCost || 0);
      } catch {
        if (trip.id === 'am_salvador_julho') {
          setHotelCost(1281.51);
          setCarRentalCost(455.53);
          setAirfareCost(1394.00);
        } else {
          setHotelCost(0);
          setCarRentalCost(0);
          setAirfareCost(0);
        }
        setBusCost(0);
      }
    } else {
      if (trip.id === 'am_salvador_julho') {
        setHotelCost(1281.51);
        setCarRentalCost(455.53);
        setAirfareCost(1394.00);
      } else {
        setHotelCost(0);
        setCarRentalCost(0);
        setAirfareCost(0);
      }
      setBusCost(0);
    }
  }, [trip.id]);

  // AI strategy state
  const [strategy, setStrategy] = useState<FinancialStrategy | null>(null);
  const [loadingStrategy, setLoadingStrategy] = useState(false);
  
  // Totals
  const [totalCPT, setTotalCPT] = useState<number>(0);
  const [totalJNB, setTotalJNB] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  // Sync Background
  useEffect(() => {
    const initData = async () => {
        try {
            const cloudData = await loadDataFromCloud('financial_data');
            if (cloudData) {
                if (cloudData.wallets) setWallets(cloudData.wallets);
                
                if (trip.id === 'am_salvador_julho') {
                  setHotelCost(typeof cloudData.hotelCost === 'number' && cloudData.hotelCost !== 0 ? cloudData.hotelCost : 1281.51);
                  setCarRentalCost(typeof cloudData.carRentalCost === 'number' && cloudData.carRentalCost !== 0 ? cloudData.carRentalCost : 455.53);
                  setAirfareCost(typeof cloudData.airfareCost === 'number' && cloudData.airfareCost !== 0 ? cloudData.airfareCost : 1394.00);
                } else {
                  if (typeof cloudData.hotelCost === 'number') setHotelCost(cloudData.hotelCost);
                  if (typeof cloudData.carRentalCost === 'number') setCarRentalCost(cloudData.carRentalCost);
                  if (typeof cloudData.airfareCost === 'number') setAirfareCost(cloudData.airfareCost);
                }
                if (typeof cloudData.busCost === 'number') setBusCost(cloudData.busCost);
                
                const updatedLocal = {
                  wallets: cloudData.wallets || { wise: 0, nomad: 0, inter: 0, cash: 0 },
                  hotelCost: trip.id === 'am_salvador_julho' ? (typeof cloudData.hotelCost === 'number' && cloudData.hotelCost !== 0 ? cloudData.hotelCost : 1281.51) : (cloudData.hotelCost || 0),
                  carRentalCost: trip.id === 'am_salvador_julho' ? (typeof cloudData.carRentalCost === 'number' && cloudData.carRentalCost !== 0 ? cloudData.carRentalCost : 455.53) : (cloudData.carRentalCost || 0),
                  airfareCost: trip.id === 'am_salvador_julho' ? (typeof cloudData.airfareCost === 'number' && cloudData.airfareCost !== 0 ? cloudData.airfareCost : 1394.00) : (cloudData.airfareCost || 0),
                  busCost: cloudData.busCost || 0
                };
                localStorage.setItem('viajai_finance_v1', JSON.stringify(updatedLocal));
            }
        } catch (e) {
            console.error("Erro sync financeiro (background)", e);
        }
    };
    if (navigator.onLine) initData();
  }, [trip.id]);

  // Load Estimated Costs from GuideList (Local)
  useEffect(() => {
    const savedGuide = localStorage.getItem(GUIDE_STORAGE_KEY);
    if (savedGuide) {
      try {
        const parsed = JSON.parse(savedGuide);
        let cpt = 0;
        let jnb = 0;
        if (parsed.CPT) {
           parsed.CPT.forEach((day: any) => cpt += (day.budget?.food + day.budget?.transport + day.budget?.tickets || 0));
        }
        if (parsed.JNB) {
           parsed.JNB.forEach((day: any) => jnb += (day.budget?.food + day.budget?.transport + day.budget?.tickets || 0));
        }
        setTotalCPT(cpt);
        setTotalJNB(jnb);
      } catch (e) { console.error(e); }
    }
  }, []);

  // Load Real Expenses (Local)
  useEffect(() => {
      const savedExpenses = localStorage.getItem(EXPENSES_STORAGE_KEY);
      if (savedExpenses) {
          try {
              const list = JSON.parse(savedExpenses);
              const total = list.reduce((acc: number, curr: any) => acc + curr.amountInBRL, 0);
              setTotalExpenses(total);
          } catch(e) { console.error(e); }
      }
  }, []);

  // Load AI Financial Strategy with local cache
  useEffect(() => {
    const fetchStrategy = async () => {
      const cacheKey = `viajai_fin_strat_${trip.id}`;
      const saved = localStorage.getItem(cacheKey);
      if (saved) {
        try {
          setStrategy(JSON.parse(saved));
          return;
        } catch (e) {
          console.error(e);
        }
      }

      setLoadingStrategy(true);
      try {
        const res = await getFinancialStrategy(trip.name);
        if (res) {
          setStrategy(res);
          localStorage.setItem(cacheKey, JSON.stringify(res));
        }
      } catch (e) {
        console.error("Erro ao buscar estratégia de câmbio IA:", e);
      } finally {
        setLoadingStrategy(false);
      }
    };

    fetchStrategy();
  }, [trip.id, trip.name]);

  const handleRefreshStrategy = async () => {
    setLoadingStrategy(true);
    try {
      const res = await getFinancialStrategy(trip.name);
      if (res) {
        setStrategy(res);
        localStorage.setItem(`viajai_fin_strat_${trip.id}`, JSON.stringify(res));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStrategy(false);
    }
  };

  // Auto Save
  useEffect(() => {
    const dataToSave = { wallets, hotelCost, busCost, carRentalCost, airfareCost };
    localStorage.setItem('viajai_finance_v1', JSON.stringify(dataToSave));
    
    // Debounce cloud sync
    const timeoutId = setTimeout(() => {
        syncDataToCloud('financial_data', dataToSave);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [wallets, hotelCost, busCost, carRentalCost, airfareCost]);

  // Wallet Handlers
  const updateWallet = (key: keyof Wallets, value: string) => {
    const num = parseFloat(value) || 0;
    setWallets(prev => ({ ...prev, [key]: num }));
  };

  // Calculations
  const totalBalance = wallets.wise + wallets.nomad + wallets.inter + wallets.cash;
  const totalGuideEstimated = totalCPT + totalJNB;
  const totalPending = hotelCost + busCost + carRentalCost + airfareCost; 
  const totalEstimatedTripCost = totalPending + totalGuideEstimated;
  
  const currentWalletBalance = totalBalance - totalExpenses;

  return (
    <div className="space-y-6">
      <CategoryHeader title="Financeiro" onBack={onBack} />
      <div className="p-4 space-y-6">
      {/* 1. BALANÇO GERAL (WALLET) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-1 shadow-lg overflow-hidden animate-in fade-in">
        <div className="bg-slate-800/50 p-4 pb-2">
           <div className="flex justify-between items-start mb-4">
             <label className="text-blue-200 text-xs font-bold uppercase tracking-wider block flex items-center gap-2">
               <Wallet className="w-4 h-4" /> Minhas Carteiras
             </label>
             <Cloud className="w-3 h-3 text-blue-300 opacity-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <WalletInput 
              label="Dinheiro Vivo (Espécie)" 
              icon={<CashLogo />} 
              value={wallets.cash} 
              onChange={(v) => updateWallet('cash', v)}
              colorClass="border-emerald-500/30 bg-slate-900/40 text-white"
            />
            <WalletInput 
              label="Débito / PIX" 
              icon={<InterLogo />} 
              value={wallets.inter} 
              onChange={(v) => updateWallet('inter', v)}
              colorClass="border-orange-500/30 bg-slate-900/40 text-white"
            />
            <WalletInput 
              label="Cartão de Crédito" 
              icon={<WiseLogo />} 
              value={wallets.wise} 
              onChange={(v) => updateWallet('wise', v)}
              colorClass="border-blue-500/30 bg-slate-900/40 text-white"
            />
          </div>
        </div>

        <div className="bg-slate-900/60 m-1 rounded-2xl p-5 border border-white/5">
          <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-3">
             <span className="text-sm font-black text-slate-300">Total Levado (Dinheiro, Débito e Crédito)</span>
             <span className="text-base font-black text-white">{toBRL(totalBalance)}</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
             <span className="text-sm font-black text-rose-400 flex items-center gap-1.5">
               <Receipt className="w-4 h-4" /> Gastos Realizados (Mercado, etc.)
             </span>
             <span className="text-base font-black text-rose-400">- {toBRL(totalExpenses)}</span>
          </div>

          <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/20 flex justify-between items-center">
              <span className="text-emerald-300 text-xs uppercase font-black tracking-widest">Saldo Restante Disponível</span>
              <span className={`text-2xl font-black font-display tracking-tight ${currentWalletBalance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {toBRL(currentWalletBalance)}
              </span>
          </div>
        </div>
      </div>

      {/* 2. DICA DE ESPECIALISTA DA IA (Estratégia de Câmbio Híbrida) */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl border border-amber-200 p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Sparkles className="w-32 h-32 text-amber-800" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-amber-900 font-bold flex items-center gap-2 font-display text-sm uppercase tracking-wide">
              <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
              Estratégia de Câmbio Inteligente
            </h3>
            <button 
              onClick={handleRefreshStrategy} 
              disabled={loadingStrategy}
              className="text-amber-800 hover:text-amber-950 p-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-all disabled:opacity-50"
              title="Recarregar Estratégia"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingStrategy ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingStrategy ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
              <p className="text-[10px] text-amber-800 animate-pulse">Gerando divisão de câmbio para {trip.name}...</p>
            </div>
          ) : strategy ? (
            <div className="space-y-4">
              {/* Proporção da Carteira */}
              <div className="bg-white/60 p-3 rounded-2xl border border-amber-200/50">
                <span className="text-[9px] font-black uppercase text-amber-700 tracking-wider block mb-1">💳 Divisão Recomendada</span>
                <p className="text-xs font-bold text-slate-800 leading-relaxed">{strategy.ratioWisdom}</p>
              </div>

              {/* Melhor Opção */}
              <div className="bg-white/60 p-3 rounded-2xl border border-amber-200/50 flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[9px] font-black uppercase text-amber-700 tracking-wider block">🏆 Recomendação de Cartão</span>
                  <p className="text-xs font-bold text-slate-800">{strategy.bestCard}</p>
                </div>
              </div>

              {/* Estratégia Detalhada */}
              <div className="bg-white/80 p-3.5 rounded-2xl border border-amber-200/80">
                <span className="text-[9px] font-black uppercase text-amber-700 tracking-wider block mb-1">💡 Dica de Saques e Taxas</span>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">{strategy.exchangeStrategy}</p>
              </div>

              {/* Alertas */}
              {strategy.warnings && strategy.warnings.length > 0 && (
                <div className="bg-red-50 p-3 rounded-2xl border border-red-200/60">
                  <span className="text-[9px] font-black uppercase text-red-700 tracking-wider block mb-1">⚠️ Cuidado e Prevenção</span>
                  <ul className="space-y-1">
                    {strategy.warnings.map((warn, i) => (
                      <li key={i} className="text-[10px] text-red-900 leading-relaxed flex items-start gap-1.5 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>{warn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-amber-800 italic">
              Não foi possível gerar dicas de câmbio inteligentes no momento.
            </div>
          )}
        </div>
      </div>

      <div className="hidden">
      <div className="bg-amber-50 rounded-3xl border border-amber-200 p-5 shadow-sm animate-in slide-in-from-right duration-500">
         <h3 className="text-amber-800 font-bold flex items-center gap-2 mb-3 font-display text-sm uppercase">
             <ShieldCheck className="w-5 h-5 text-amber-600" />
             Estratégia de Câmbio
         </h3>
         <ul className="space-y-2 text-[11px] text-amber-900 font-medium leading-relaxed">
            <li className="flex gap-2">
              <CreditCard className="w-4 h-4 shrink-0 text-amber-600" />
              <span><strong>Inter Virtual:</strong> Use via Apple/Google Pay para 90% dos pagamentos por aproximação.</span>
            </li>
            <li className="flex gap-2">
              <Banknote className="w-4 h-4 shrink-0 text-amber-600" />
              <span><strong>Wise Físico:</strong> Exclusivo para saques em Rands.</span>
            </li>
            <li className="flex gap-2 bg-white/50 p-2 rounded-xl border border-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>No ATM, escolha sempre <strong>"Decline Conversion"</strong> (Recusar Conversão) para economizar até 10%.</span>
            </li>
         </ul>
      </div>

      </div>

       {/* 2. COMPARAÇÃO DE ESTIMATIVAS */}
       <div className="bg-green-50 rounded-3xl border border-green-200 p-5 shadow-sm">
         <h3 className="text-green-800 font-bold flex items-center gap-2 mb-4 font-display">
             <Landmark className="w-5 h-5 text-green-600" />
             Planejamento x Realidade
         </h3>

         <div className="grid grid-cols-2 gap-3 mb-4">
             <div className="bg-white p-3 rounded-xl border border-green-100">
                 <div className="flex items-center gap-1.5 mb-1">
                     <MapPin className="w-3 h-3 text-blue-600" />
                     <span className="text-[10px] font-bold text-gray-500 uppercase">{cityALabel}</span>
                 </div>
                 <span className="block text-xl font-black text-blue-800">{toBRL(totalCPT)}</span>
             </div>
             <div className="bg-white p-3 rounded-xl border border-green-100">
                 <div className="flex items-center gap-1.5 mb-1">
                     <MapPin className="w-3 h-3 text-yellow-600" />
                     <span className="text-[10px] font-bold text-gray-500 uppercase">{cityBLabel}</span>
                 </div>
                 <span className="block text-xl font-black text-yellow-800">{toBRL(totalJNB)}</span>
             </div>
         </div>

         <div className="bg-white p-4 rounded-xl border border-dashed border-green-300">
             <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-gray-500 uppercase">Meta da Viagem</span>
                 <span className="text-lg font-black text-gray-800">{toBRL(totalEstimatedTripCost)}</span>
             </div>
             <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 mb-1 overflow-hidden">
                  <div 
                    className={`h-full ${totalBalance >= totalEstimatedTripCost ? 'bg-green-500' : 'bg-red-500'}`} 
                    style={{ width: `${Math.min(100, (totalBalance / totalEstimatedTripCost) * 100)}%` }}
                  ></div>
             </div>
             <p className="text-[10px] text-right text-gray-400">
                 {totalBalance >= totalEstimatedTripCost 
                    ? 'Seu saldo cobre a estimativa do guia.' 
                    : `Faltam ${toBRL(totalEstimatedTripCost - totalBalance)} para cobrir o guia.`}
             </p>
         </div>
       </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-gray-900 font-extrabold flex items-center gap-2 mb-4 font-display text-base">
          <TrendingDown className="w-5 h-5 text-orange-500 animate-pulse" />
          Custos Extras da Viagem (Pendentes)
        </h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed font-semibold">
          Estes valores são somados à meta da viagem, mas não são descontados do saldo até você pagar.
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-sm md:text-base font-black text-slate-900 uppercase mb-1.5 flex items-center gap-1.5">
              <Plane className="w-5 h-5 text-blue-500" /> Aéreo / Passagens Aéreas
            </label>
            <div className="flex items-center bg-slate-50 rounded-2xl px-4 border border-slate-300 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/10 transition-all">
              <span className="text-slate-900 text-base md:text-xl font-black mr-2">R$</span>
              <input 
                type="number"
                value={airfareCost || ''}
                onChange={(e) => setAirfareCost(parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="bg-transparent w-full py-4 text-slate-950 font-black text-xl md:text-2xl outline-none placeholder:text-slate-400 placeholder:font-black placeholder:text-xl md:placeholder:text-2xl"
              />
            </div>
          </div>
          <div>
            <label className="text-sm md:text-base font-black text-slate-900 uppercase mb-1.5 flex items-center gap-1.5">
              <Hotel className="w-5 h-5 text-indigo-500" /> Hospedagem (Reservas)
            </label>
            <div className="flex items-center bg-slate-50 rounded-2xl px-4 border border-slate-300 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/10 transition-all">
              <span className="text-slate-900 text-base md:text-xl font-black mr-2">R$</span>
              <input 
                type="number"
                value={hotelCost || ''}
                onChange={(e) => setHotelCost(parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="bg-transparent w-full py-4 text-slate-950 font-black text-xl md:text-2xl outline-none placeholder:text-slate-400 placeholder:font-black placeholder:text-xl md:placeholder:text-2xl"
              />
            </div>
          </div>
          <div>
            <label className="text-sm md:text-base font-black text-slate-900 uppercase mb-1.5 flex items-center gap-1.5">
              <Car className="w-5 h-5 text-emerald-500" /> Aluguel de Carro (Voucher)
            </label>
            <div className="flex items-center bg-slate-50 rounded-2xl px-4 border border-slate-300 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/10 transition-all">
              <span className="text-slate-900 text-base md:text-xl font-black mr-2">R$</span>
              <input 
                type="number"
                value={carRentalCost || ''}
                onChange={(e) => setCarRentalCost(parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="bg-transparent w-full py-4 text-slate-950 font-black text-xl md:text-2xl outline-none placeholder:text-slate-400 placeholder:font-black placeholder:text-xl md:placeholder:text-2xl"
              />
            </div>
          </div>
          <div>
            <label className="text-sm md:text-base font-black text-slate-900 uppercase mb-1.5 flex items-center gap-1.5">
              <Bus className="w-5 h-5 text-amber-500" /> Ônibus / Transfers Extras
            </label>
            <div className="flex items-center bg-slate-50 rounded-2xl px-4 border border-slate-300 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/10 transition-all">
              <span className="text-slate-900 text-base md:text-xl font-black mr-2">R$</span>
              <input 
                type="number"
                value={busCost || ''}
                onChange={(e) => setBusCost(parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="bg-transparent w-full py-4 text-slate-950 font-black text-xl md:text-2xl outline-none placeholder:text-slate-400 placeholder:font-black placeholder:text-xl md:placeholder:text-2xl"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FinancialControl;
