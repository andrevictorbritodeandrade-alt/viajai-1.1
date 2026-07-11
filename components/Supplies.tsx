import React, { useState, useEffect } from 'react';
import CategoryHeader from './CategoryHeader';
import { 
  searchNearbyMarkets, 
  NearbyMarket, 
  getMarketSuggestions, 
  MarketSuggestion 
} from '../services/geminiService';
import { MENU_ITEMS } from '../constants';
import { syncDataToCloud, subscribeToCloudData } from '../services/firebase';
import { getSessionUser } from '../services/session';
import { 
  Sparkles, 
  Loader2, 
  Plus, 
  Trash2, 
  Check, 
  RefreshCw, 
  ShoppingBag, 
  Square, 
  CheckSquare,
  User 
} from 'lucide-react';

interface SuppliesProps {
  selectedTrip?: { 
    id: string; 
    name: string; 
    lat?: number; 
    lon?: number; 
    isDomestic?: boolean; 
  } | null;
  onBack?: () => void;
}

interface LocalAccommodation {
  id: string;
  name: string;
  location: string;
  city: string;
  isDomestic: boolean;
}

interface CheckableSupply {
  id: string;
  name: string;
  category: string;
  approxPrice: string;
  reason: string;
  checked: boolean;
  isAiSuggested?: boolean;
  savedBy?: string;
}

const getTripAccommodations = (tripId: string, tripName: string): LocalAccommodation[] => {
  const normId = tripId || '';
  const normName = tripName?.toLowerCase() || '';

  if (normId === 'am_africa_sul' || normName.includes('áfrica') || normName.includes('africa')) {
    return [
      {
        id: 'CPT_AIRBNB',
        name: 'Estúdio Sea Point',
        location: '38 Michau Street',
        city: 'Cidade do Cabo - Sul',
        isDomestic: false
      }
    ];
  } else if (normId === 'am_foz_ass_ba' || normName.includes('buenos aires') || normName.includes('assunção')) {
    return [
      {
        id: 'BA_AIRBNB',
        name: 'Apartamento Palermo',
        location: 'Av. Santa Fe',
        city: 'Buenos Aires',
        isDomestic: false
      }
    ];
  } else {
    return [
      {
        id: 'FALLBACK_' + (tripId || 'temp'),
        name: 'Acomodação Selecionada',
        location: 'Central',
        city: tripName || 'Destino',
        isDomestic: true
      }
    ];
  }
};

const Supplies: React.FC<SuppliesProps> = ({ selectedTrip, onBack }) => {
  const trip = selectedTrip || { id: 'am_africa_sul', name: 'África do Sul', isDomestic: false };
  const accommodations = getTripAccommodations(trip.id, trip.name);
  
  const [activeAccIndex, setActiveAccIndex] = useState<number>(0);
  const activeAcc = accommodations[activeAccIndex] || accommodations[0];

  const [aiMarkets, setAiMarkets] = useState<NearbyMarket[]>([]);
  const [loadingMarkets, setLoadingMarkets] = useState<boolean>(false);

  // Lista de compras do mercado (com persistência e inicialização IA)
  const [shoppingList, setShoppingList] = useState<CheckableSupply[]>(() => {
    try {
      const saved = localStorage.getItem('viajai_shopping_list_raiz');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [loadingAiList, setLoadingAiList] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');

  // Identifica quem é o comprador ativo atual (André ou Marcelly)
  const [activeBuyer, setActiveBuyer] = useState<'André' | 'Marcelly'>(() => {
    const currentName = localStorage.getItem('viajai_user_name') || '';
    return currentName.toLowerCase().includes('marcelly') ? 'Marcelly' : 'André';
  });

  // 1. Carrega mercados próximos
  useEffect(() => {
    const fetchMarkets = async () => {
      if (activeAcc) {
        setLoadingMarkets(true);
        try {
          const markets = await searchNearbyMarkets(activeAcc.name, activeAcc.location, activeAcc.city);
          setAiMarkets(markets);
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingMarkets(false);
        }
      }
    };
    fetchMarkets();
  }, [activeAcc?.id]);

  // 2. Carrega a lista de compras da Nuvem (Firestore) com fallback para LocalStorage e IA
  useEffect(() => {
    const userId = getSessionUser() || "temp_guest";
    const docId = userId;
    const storageKey = `viajai_shopping_list_raiz`;

    // Escuta mudanças em tempo real na nuvem
    const unsubscribe = subscribeToCloudData('shopping_list_v2', async (cloudData: any) => {
      if (cloudData && Array.isArray(cloudData.items)) {
        setShoppingList(cloudData.items);
        localStorage.setItem(storageKey, JSON.stringify(cloudData.items));
      } else {
        // Se não houver dados na nuvem da raiz, verifica o LocalStorage da raiz como fallback
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            const parsedList = JSON.parse(saved);
            if (parsedList.length > 0) {
              setShoppingList(parsedList);
              // Salva na nuvem para persistir
              syncDataToCloud('shopping_list_v2', { items: parsedList }, docId);
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }

        // Migração legada: tenta ler do id da viagem se houver
        const oldStorageKey = `viajai_shopping_list_${trip.id}`;
        const oldSaved = localStorage.getItem(oldStorageKey);
        if (oldSaved) {
          try {
            const parsedList = JSON.parse(oldSaved);
            if (parsedList.length > 0) {
              setShoppingList(parsedList);
              // Salva na raiz (nuvem e local)
              syncDataToCloud('shopping_list_v2', { items: parsedList }, docId);
              localStorage.setItem(storageKey, JSON.stringify(parsedList));
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }

        // Se realmente não há nenhum dado salvo em lugar nenhum, faz a sugestão inicial da IA
        // Mas se o estado já possuir itens ou o localStorage possuir, previne sobrescrever
        const currentLocal = localStorage.getItem(storageKey);
        if (currentLocal && JSON.parse(currentLocal).length > 0) return;

        setLoadingAiList(true);
        try {
          const aiSuggestions = await getMarketSuggestions(trip.name);
          const initialList: CheckableSupply[] = aiSuggestions.map((item, idx) => ({
            id: `ai_${idx}_${Date.now()}`,
            name: item.name,
            category: item.category,
            approxPrice: item.approxPrice,
            reason: item.reason,
            checked: false,
            isAiSuggested: true,
            savedBy: 'IA'
          }));
          setShoppingList(initialList);
          // Salva na nuvem e no local
          syncDataToCloud('shopping_list_v2', { items: initialList }, docId);
          localStorage.setItem(storageKey, JSON.stringify(initialList));
        } catch (err) {
          console.error("Erro ao carregar lista de compras recomendada:", err);
        } finally {
          setLoadingAiList(false);
        }
      }
    }, docId);

    return () => unsubscribe();
  }, [trip.id, trip.name]);

  // Salva lista de compras na Nuvem e no LocalStorage sempre que for alterada
  const saveShoppingList = (newList: CheckableSupply[]) => {
    setShoppingList(newList);
    const userId = getSessionUser() || "temp_guest";
    const docId = userId;
    syncDataToCloud('shopping_list_v2', { items: newList }, docId);
    localStorage.setItem(`viajai_shopping_list_raiz`, JSON.stringify(newList));
  };

  // Handlers para lista de compras
  const handleToggleCheck = (id: string) => {
    const updated = shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    saveShoppingList(updated);
  };

  const handleDeleteItem = (id: string) => {
    const updated = shoppingList.filter(item => item.id !== id);
    saveShoppingList(updated);
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem: CheckableSupply = {
      id: `manual_${Date.now()}`,
      name: newItemName.trim(),
      category: 'Manual',
      approxPrice: '-',
      reason: `Adicionado por ${activeBuyer}.`,
      checked: false,
      isAiSuggested: false,
      savedBy: activeBuyer
    };
    saveShoppingList([...shoppingList, newItem]);
    setNewItemName('');
  };

  // Permite mudar o dono de um item clicando em seu badge
  const handleToggleItemOwner = (id: string) => {
    const updated = shoppingList.map(item => {
      if (item.id === id) {
        let nextOwner = 'IA';
        if (!item.savedBy || item.savedBy === 'IA') {
          nextOwner = 'André';
        } else if (item.savedBy === 'André') {
          nextOwner = 'Marcelly';
        } else if (item.savedBy === 'Marcelly') {
          nextOwner = 'IA';
        }
        
        return {
          ...item,
          savedBy: nextOwner,
          isAiSuggested: nextOwner === 'IA'
        };
      }
      return item;
    });
    saveShoppingList(updated);
  };

  const handleRefreshAiList = async () => {
    setLoadingAiList(true);
    try {
      const aiSuggestions = await getMarketSuggestions(trip.name);
      const regeneratedList: CheckableSupply[] = aiSuggestions.map((item, idx) => ({
        id: `ai_refresh_${idx}_${Date.now()}`,
        name: item.name,
        category: item.category,
        approxPrice: item.approxPrice,
        reason: item.reason,
        checked: false,
        isAiSuggested: true,
        savedBy: 'IA'
      }));
      // Combina mantendo os itens manuais inseridos pelo usuário
      const manualItems = shoppingList.filter(item => !item.isAiSuggested);
      const combined = [...regeneratedList, ...manualItems];
      saveShoppingList(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAiList(false);
    }
  };

  const menuItem = MENU_ITEMS.find(item => item.id === 'mercado');
  
  return (
    <div className="pb-48">
      <CategoryHeader title={menuItem?.title || 'MERCADO E DELIVERY'} onBack={onBack || (() => {})} />
      <div className="p-4 space-y-6">
        <p className="text-[11px] text-slate-500 leading-relaxed max-w-[95%]">
          {menuItem?.description}
        </p>
      
      {/* Selector de Hospedagem */}
      {accommodations.length > 1 && (
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase pl-1 block">Escolha o local de estadia:</label>
          <div className="flex flex-wrap gap-2.5">
            {accommodations.map((acc, index) => (
              <button
                key={acc.id}
                onClick={() => setActiveAccIndex(index)}
                className={`py-2 px-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 flex items-center gap-1.5 ${activeAccIndex === index ? 'bg-slate-800 text-white border-slate-800 shadow-md scale-105' : 'bg-white hover:bg-slate-100 text-slate-500 border-slate-200'}`}
              >
                {acc.name.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 1. COMPONENTE HÍBRIDO: LISTA DE COMPRAS DO MERCADO */}
      <div className="bg-gradient-to-br from-emerald-950 to-teal-900 text-white rounded-3xl p-5 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <ShoppingBag className="w-40 h-40" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-display text-sm flex items-center gap-2 uppercase tracking-wide">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              Lista de Supermercado IA
            </h3>
            <button 
              onClick={handleRefreshAiList} 
              disabled={loadingAiList}
              className="text-emerald-200 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
              title="Gerar Novas Sugestões"
            >
              <RefreshCw className={`w-4 h-4 ${loadingAiList ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <p className="text-[10px] text-emerald-100/80 leading-relaxed mb-4">
            Veja as sugestões de compras e produtos típicos da IA para a sua estadia em <strong className="text-emerald-300">{trip.name}</strong>, adicione itens manualmente e risque-os no mercado.
          </p>

          {/* Seletor do Comprador Ativo */}
          <div className="mb-5 bg-white/5 border border-white/10 rounded-2xl p-3">
            <span className="text-[9px] font-black tracking-widest text-emerald-300 uppercase block mb-2 pl-1">Quem está salvando / comprando:</span>
            <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5 shadow-inner">
              {(['André', 'Marcelly'] as const).map((person) => (
                <button
                  key={person}
                  onClick={() => setActiveBuyer(person)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-black font-display uppercase tracking-widest transition-all ${
                    activeBuyer === person 
                      ? person === 'André'
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20 ring-1 ring-white/10 scale-[1.02]'
                        : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20 ring-1 ring-white/10 scale-[1.02]'
                      : 'text-emerald-100/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <User className={`w-3.5 h-3.5 ${
                    activeBuyer === person 
                      ? 'text-white' 
                      : person === 'André' ? 'text-cyan-400' : 'text-rose-400'
                  }`} />
                  {person}
                </button>
              ))}
            </div>
          </div>

          {/* Campo de adição híbrida */}
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder={`Adicionar item para ${activeBuyer}...`} 
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddItem()}
              className="flex-1 bg-white/10 text-white placeholder-emerald-200/50 text-xs px-3 py-2 rounded-xl outline-none border border-white/5 focus:border-emerald-400 focus:bg-white/15"
            />
            <button 
              onClick={handleAddItem}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 text-white ${
                activeBuyer === 'André' 
                  ? 'bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-500/10' 
                  : 'bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-500/10'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {loadingAiList ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
              <p className="text-[10px] text-emerald-200 animate-pulse font-medium">Analisando iguarias de supermercado e economia local...</p>
            </div>
          ) : shoppingList.length > 0 ? (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {shoppingList.map(item => {
                const isAndre = item.savedBy === 'André' || (item.savedBy && item.savedBy.includes('André'));
                const isMarcelly = item.savedBy === 'Marcelly' || (item.savedBy && item.savedBy.includes('Marcelly'));
                const isAi = !item.savedBy || item.savedBy === 'IA' || item.isAiSuggested;

                let borderClass = 'border-white/10 hover:border-emerald-500/20';
                let bgClass = 'bg-white/10';
                let tagClass = 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20';
                let tagLabel = 'Sugestão IA';

                if (isAndre) {
                  borderClass = 'border-cyan-500/50 hover:border-cyan-400/70 shadow-md shadow-cyan-500/5';
                  bgClass = 'bg-cyan-950/60';
                  tagClass = 'text-cyan-200 bg-cyan-500/30 border-cyan-400/40 font-black';
                  tagLabel = 'André';
                } else if (isMarcelly) {
                  borderClass = 'border-rose-500/50 hover:border-rose-400/70 shadow-md shadow-rose-500/5';
                  bgClass = 'bg-rose-950/60';
                  tagClass = 'text-rose-200 bg-rose-500/30 border-rose-400/40 font-black';
                  tagLabel = 'Marcelly';
                } else if (isAi) {
                  borderClass = 'border-emerald-500/30 hover:border-emerald-400/50';
                  bgClass = 'bg-emerald-950/50';
                  tagClass = 'text-emerald-200 bg-emerald-500/15 border-emerald-500/30';
                  tagLabel = 'Sugestão IA';
                }

                return (
                  <div 
                    key={item.id} 
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${item.checked ? 'bg-white/5 border-white/5 opacity-50 shadow-none' : `${bgClass} ${borderClass}`}`}
                  >
                    <button 
                      onClick={() => handleToggleCheck(item.id)}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors shrink-0 pt-0.5"
                    >
                      {item.checked ? <CheckSquare className="w-5.5 h-5.5 text-emerald-400" /> : <Square className="w-5.5 h-5.5 text-white/50" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`font-black text-sm md:text-base tracking-wide truncate ${item.checked ? 'line-through text-slate-400' : 'text-white'}`}>
                          {item.name}
                        </span>
                        
                        <span 
                          onClick={() => handleToggleItemOwner(item.id)}
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border cursor-pointer select-none transition-all active:scale-95 ${tagClass}`}
                          title="Clique para alternar o comprador"
                        >
                          {tagLabel}
                        </span>

                        {item.category && item.category !== 'Manual' && item.category !== 'Sugestão IA' && (
                          <span className="text-[9px] font-bold text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            {item.category}
                          </span>
                        )}

                        {item.approxPrice && item.approxPrice !== '-' && (
                          <span className="text-[9px] font-extrabold text-yellow-300">
                            {item.approxPrice}
                          </span>
                        )}
                      </div>
                      {item.reason && (
                        <p className={`text-xs leading-relaxed ${item.checked ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>
                          {item.reason}
                        </p>
                      )}
                    </div>

                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors shrink-0 self-center"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-emerald-200/50 text-xs italic">
              Nenhum item na lista. Adicione acima ou clique em recarregar.
            </div>
          )}
        </div>
      </div>

      {/* 2. LISTA DE MERCADOS PRÓXIMOS */}
      <div className="space-y-4 pt-2">
        <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Supermercados e Lojas Próximas</h3>
        
        {loadingMarkets ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
            <p className="text-xs text-slate-400">Buscando estabelecimentos de conveniência reais próximos...</p>
          </div>
        ) : aiMarkets.length > 0 ? (
          <div className="grid gap-3">
            {aiMarkets.map((market, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="bg-slate-50 p-3 rounded-xl text-slate-600 font-black shrink-0 w-11 h-11 flex items-center justify-center border border-slate-100 uppercase">
                   {market.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-sm text-slate-800 truncate">{market.name}</h4>
                    {market.isOpen24h && (
                      <span className="bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.2 rounded text-[8px] font-black shrink-0">
                        24H
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mb-1">{market.address}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{market.description}</p>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 mt-1">
                  {market.distance}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
            Nenhum estabelecimento encontrado nesta região.
          </div>
        )}
      </div>

      </div>
    </div>
  );
};

export default Supplies;
