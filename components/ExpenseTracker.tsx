
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Receipt, 
  CalendarDays,
  CreditCard,
  RefreshCw,
  Sparkles,
  Loader2,
  Coins,
  AlertTriangle
} from 'lucide-react';
import { syncDataToCloud, loadDataFromCloud, subscribeToCloudData } from '../services/firebase';
import { getRates } from '../services/currencyService';
import { EXPENSES_STORAGE_KEY } from '../constants';
import { CurrencyCode } from '../types';
import CategoryHeader from './CategoryHeader';
import { getExpenseAdvice, ExpenseAdvice } from '../services/geminiService';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  amountInBRL: number;
  date: string;
}

const ExpenseTracker: React.FC<{ 
  selectedTrip?: { id: string; name: string; isDomestic?: boolean } | null;
  onBack: () => void;
}> = ({ selectedTrip, onBack }) => {
  const trip = selectedTrip || { id: 'am_africa_sul', name: 'África do Sul', isDomestic: false };

  // OFFLINE FIRST STATE
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(EXPENSES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((e: any) => e.id !== 'initial_stay_mar_hotel' && !e.description.includes('Mar Hotel Rio Vermelho'));
        }
      }
      return [];
    } catch { return []; }
  });

  const [advice, setAdvice] = useState<ExpenseAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    return trip.isDomestic ? 'BRL' : 'ZAR';
  });
  const [rates, setRates] = useState<{USD: number, BRL: number, ZAR: number} | null>(null);

  useEffect(() => {
    // 1. Load Rates (Network First, but CurrencyService handles cache)
    const initRates = async () => {
      const r = await getRates();
      setRates(r);
    };
    initRates();

    // 2. Real-time Cloud Sync for Expenses
    const unsubscribe = subscribeToCloudData('expenses_log', (data) => {
      if (data && Array.isArray(data.list)) {
        const filtered = data.list.filter((e: any) => e.id !== 'initial_stay_mar_hotel' && !e.description.includes('Mar Hotel Rio Vermelho'));
        setExpenses(filtered);
        localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(filtered));
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Fetch AI Advice on expenses with cache
  useEffect(() => {
    const fetchAdvice = async () => {
      const cacheKey = `viajai_exp_advice_${trip.id}`;
      const saved = localStorage.getItem(cacheKey);
      if (saved) {
        try {
          setAdvice(JSON.parse(saved));
          return;
        } catch (e) {
          console.error(e);
        }
      }

      setLoadingAdvice(true);
      try {
        const res = await getExpenseAdvice(trip.name);
        if (res) {
          setAdvice(res);
          localStorage.setItem(cacheKey, JSON.stringify(res));
        }
      } catch (err) {
        console.error("Erro ao carregar conselhos de despesas:", err);
      } finally {
        setLoadingAdvice(false);
      }
    };

    fetchAdvice();
  }, [trip.id, trip.name]);

  const handleRefreshAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const res = await getExpenseAdvice(trip.name);
      if (res) {
        setAdvice(res);
        localStorage.setItem(`viajai_exp_advice_${trip.id}`, JSON.stringify(res));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdvice(false);
    }
  };

  // Auto Save Changes
  useEffect(() => {
    // STARTUP: Ensure only the cheapest accommodation is in the "stays" or similar initially? 
    // Wait, ExpenseTracker is generic.
    // The user wants to start "zerado" for the calculation of stays.
    // I need to know what to add. The user just said "a estadia mais barata".
    // Looking at AccommodationList, I need to find the cheapest across all regions.
    // Let's identify the cheapest one.
    
    // Actually, I should probably not over-engineer this in ExpenseTracker directly without knowing 
    // if the user wants me to do this *every* time it loads or just once. 
    // They said "começa zerado, e só adiciona esse".
    
    // I will look at ACCOMMODATION_DATA in AccommodationList.
    // Rede Andrade Barra: 274
    // Apart Queen Barra: 241
    // Mar Hotel: 190 <- Cheapest
    // Ibis: 250
    // Sol Nascente: 223
    
    // Okay, the cheapest is Mar Hotel Rio Vermelho (R$ 190/dia, Total R$ 570)
    
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
    
    // Debounce cloud sync
    const t = setTimeout(() => {
      syncDataToCloud('expenses_log', { list: expenses });
    }, 2000);
    return () => clearTimeout(t);
  }, [expenses]);

  const handleAdd = () => {
    if (!desc.trim() || !amount || !rates) return;

    const val = parseFloat(amount);
    let valInBRL = 0;

    // Conversion Logic (Base USD)
    if (currency === 'BRL') valInBRL = val;
    else if (currency === 'USD') valInBRL = val * rates.BRL; 
    else if (currency === 'ZAR') {
      const valInUSD = val / rates.ZAR;
      valInBRL = valInUSD * rates.BRL;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: desc,
      amount: val,
      currency,
      amountInBRL: valInBRL,
      date: new Date().toLocaleDateString('pt-BR')
    };

    setExpenses([newExpense, ...expenses]);
    setDesc('');
    setAmount('');
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amountInBRL, 0);

  return (
    <div className="space-y-6">
      <CategoryHeader title="Gastos" onBack={onBack} />
      <div className="p-4 space-y-6">
      {/* CONSELHEIRO FINANCEIRO DE GASTOS IA */}
      <div className="bg-gradient-to-br from-slate-900 to-purple-950 text-white rounded-3xl p-5 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Sparkles className="w-36 h-36" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-display text-sm flex items-center gap-2 uppercase tracking-wide text-white">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse animate-duration-1000" />
              Conselheiro de Orçamento IA
            </h3>
            <button 
              onClick={handleRefreshAdvice} 
              disabled={loadingAdvice}
              className="text-purple-200 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50 cursor-pointer"
              title="Recarregar Dicas"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingAdvice ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingAdvice ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
              <p className="text-[10px] text-purple-200 animate-pulse font-medium">Analisando custo de vida em {trip.name}...</p>
            </div>
          ) : advice ? (
            <div className="space-y-4">
              {/* Orçamento Diário Recomendado */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-black uppercase text-purple-300 tracking-wider block mb-0.5">💸 Orçamento Diário</span>
                  <p className="text-sm font-bold text-white">{advice.dailyBudget}</p>
                </div>

                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-black uppercase text-purple-300 tracking-wider block mb-0.5">🏷️ Nível de Preço</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${
                      advice.priceLevelColor === 'emerald' ? 'bg-emerald-400' :
                      advice.priceLevelColor === 'rose' ? 'bg-rose-400' : 'bg-amber-400'
                    }`} />
                    <span className="text-[11px] font-bold text-white truncate">{advice.priceLevel}</span>
                  </div>
                </div>
              </div>

              {/* Dicas de Economia */}
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5">
                <span className="text-[9px] font-black uppercase text-purple-300 tracking-wider block mb-2">💡 Dicas de Economia Reais</span>
                <ul className="space-y-2">
                  {advice.savingTips.map((tip, i) => (
                    <li key={i} className="text-[10px] text-purple-100 leading-relaxed flex items-start gap-1.5 font-medium">
                      <span className="text-purple-400 text-xs mt-0.5">✦</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Alertas de Custo */}
              {advice.costAlerts && advice.costAlerts.length > 0 && (
                <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
                  <span className="text-[9px] font-black uppercase text-amber-300 tracking-wider block mb-1.5">⚠️ Pegadinhas e Alertas</span>
                  <ul className="space-y-1">
                    {advice.costAlerts.map((alert, i) => (
                      <li key={i} className="text-[10px] text-amber-100 leading-relaxed flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{alert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-purple-300 italic text-center py-4">
              Nenhuma análise de orçamento disponível no momento.
            </div>
          )}
        </div>
      </div>
      {/* Header Summary */}
      <div className="bg-gradient-to-br from-purple-600 to-fuchsia-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden animate-in fade-in">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Receipt className="w-32 h-32" />
        </div>
        <div className="relative z-10">
           <span className="text-purple-200 text-xs font-bold uppercase tracking-wider block mb-1">
             Total Gasto (Convertido)
           </span>
           <span className="text-4xl font-bold font-display">
             R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
           </span>
           <p className="text-purple-200 text-xs mt-2 opacity-80">
             *Valores convertidos usando a cotação do dia.
           </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-purple-600" /> Novo Gasto
        </h3>
        
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="O que você comprou?" 
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-purple-500 font-medium text-sm"
          />
          
          <div className="flex gap-2">
            <div className="w-1/3 relative">
               <select 
                 value={currency} 
                 onChange={e => setCurrency(e.target.value as CurrencyCode)}
                 className="w-full p-3 bg-gray-100 rounded-xl font-bold text-gray-700 appearance-none outline-none border border-transparent focus:bg-white focus:border-purple-500"
               >
                 {trip.isDomestic ? (
                   <>
                     <option value="BRL">Real (R$)</option>
                     <option value="USD">Dólar ($)</option>
                     <option value="ZAR">Rand (R)</option>
                   </>
                 ) : (
                   <>
                     <option value="ZAR">Rand (R)</option>
                     <option value="USD">Dólar ($)</option>
                     <option value="BRL">Real (R$)</option>
                   </>
                 )}
               </select>
            </div>
            <input 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-purple-500 font-bold text-gray-800"
            />
          </div>

          <button 
            onClick={handleAdd}
            disabled={!desc || !amount}
            className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 active:scale-95 transition-all shadow-md shadow-purple-200 disabled:opacity-50 disabled:shadow-none"
          >
            Adicionar Despesa
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Histórico</h4>
         
         {expenses.length === 0 && (
           <div className="text-center py-8 text-gray-400">
             <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-20" />
             <p className="text-sm">Nenhum gasto lançado.</p>
           </div>
         )}

         {expenses.map(item => (
           <div key={item.id} className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{item.description}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> {item.date}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                 <div>
                   <p className="font-bold text-gray-800 text-sm">
                     {item.currency} {item.amount.toLocaleString()}
                   </p>
                   {item.currency !== 'BRL' && (
                     <p className="text-[10px] text-purple-600 font-medium">
                       ≈ R$ {item.amountInBRL.toFixed(2)}
                     </p>
                   )}
                 </div>
                 <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
           </div>
         ))}
      </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
