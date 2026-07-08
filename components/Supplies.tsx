import React, { useState, useEffect } from 'react';
import CategoryHeader from './CategoryHeader';
import { 
  searchNearbyMarkets, 
  NearbyMarket, 
  getMarketSuggestions, 
  MarketSuggestion 
} from '../services/geminiService';
import { MENU_ITEMS } from '../constants';
import { 
  Sparkles, 
  Loader2, 
  Plus, 
  Trash2, 
  Check, 
  RefreshCw, 
  ShoppingBag, 
  Square, 
  CheckSquare 
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
  const [shoppingList, setShoppingList] = useState<CheckableSupply[]>([]);
  const [loadingAiList, setLoadingAiList] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');

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

  // 2. Carrega a lista de compras (Inicializa com IA e salva no LocalStorage)
  useEffect(() => {
    const loadList = async () => {
      const storageKey = `viajai_shopping_list_${trip.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setShoppingList(JSON.parse(saved));
          return;
        } catch (e) {
          console.error(e);
        }
      }

      // Se não houver nada salvo, busca as sugestões da IA como lista padrão
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
          isAiSuggested: true
        }));
        setShoppingList(initialList);
        localStorage.setItem(storageKey, JSON.stringify(initialList));
      } catch (err) {
        console.error("Erro ao carregar lista de compras recomendada:", err);
      } finally {
        setLoadingAiList(false);
      }
    };

    loadList();
  }, [trip.id, trip.name]);

  // Salva lista de compras sempre que for alterada
  const saveShoppingList = (newList: CheckableSupply[]) => {
    setShoppingList(newList);
    localStorage.setItem(`viajai_shopping_list_${trip.id}`, JSON.stringify(newList));
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
      reason: 'Adicionado manualmente por você.',
      checked: false,
      isAiSuggested: false
    };
    saveShoppingList([...shoppingList, newItem]);
    setNewItemName('');
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
        isAiSuggested: true
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

          {/* Campo de adição híbrida */}
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Adicionar item customizado..." 
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddItem()}
              className="flex-1 bg-white/10 text-white placeholder-emerald-200/50 text-xs px-3 py-2 rounded-xl outline-none border border-white/5 focus:border-emerald-400"
            />
            <button 
              onClick={handleAddItem}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
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
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {shoppingList.map(item => (
                <div 
                  key={item.id} 
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${item.checked ? 'bg-white/5 border-white/5 opacity-50' : 'bg-white/10 border-white/10 hover:border-emerald-500/20'}`}
                >
                  <button 
                    onClick={() => handleToggleCheck(item.id)}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors shrink-0 pt-0.5"
                  >
                    {item.checked ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-white/50" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className={`font-bold text-xs truncate ${item.checked ? 'line-through text-slate-400' : 'text-white'}`}>
                        {item.name}
                      </span>
                      {item.category && item.category !== 'Manual' && (
                        <span className="text-[8px] font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          {item.category}
                        </span>
                      )}
                      {item.approxPrice && item.approxPrice !== '-' && (
                        <span className="text-[8px] font-bold text-yellow-300">
                          {item.approxPrice}
                        </span>
                      )}
                    </div>
                    {item.reason && (
                      <p className={`text-[9px] leading-relaxed ${item.checked ? 'text-slate-400' : 'text-slate-300'}`}>
                        {item.reason}
                      </p>
                    )}
                  </div>

                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors shrink-0 self-center"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
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
