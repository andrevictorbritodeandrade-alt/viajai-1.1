
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Briefcase, 
  Luggage, 
  ShoppingBag, 
  User, 
  Pencil, 
  X, 
  Check, 
  RefreshCw, 
  Tag, 
  CloudLightning, 
  PlaneTakeoff, 
  PlaneLanding, 
  Circle,
  Sparkles,
  Loader2
} from 'lucide-react';
import { syncDataToCloud, subscribeToCloudData } from '../services/firebase';
import { getSessionUser } from '../services/session';
import CategoryHeader from './CategoryHeader';
import { getPackingSuggestions, PackingSuggestion } from '../services/geminiService';

type BagType = 'bag23kg' | 'bag10kg' | 'pouch5kg';
type Person = 'André' | 'Marcelly';

interface Item {
  id: string;
  text: string;
  checked: boolean;  // IDA
  returned: boolean; // VOLTA
  category?: string;
}

type PackingData = Record<Person, Record<BagType, Item[]>>;

const STORAGE_KEY = 'viajai_packing_list_v5';

const CATEGORY_MAP: Record<string, string[]> = {
  '👕 ROUPAS': ['camisa', 'camiseta', 'calça', 'bermuda', 'short', 'cueca', 'meia', 'casaco', 'jaqueta', 'vestido', 'saia', 'biquíni', 'sunga', 'moletom', 'agasalho', 'roupa', 'blusa', 'pijama'],
  '👟 CALÇADOS': ['tênis', 'sapato', 'chinelo', 'sandália', 'bota', 'crocs', 'pantufa'],
  '🧴 HIGIENE & SAÚDE': ['escova', 'pasta', 'shampoo', 'condicionador', 'sabonete', 'desodorante', 'perfume', 'protetor', 'repelente', 'remédio', 'farmácia', 'curativo', 'band-aid', 'nécessaire', 'maquiagem', 'batom', 'hidratante', 'barbeador', 'lâmina'],
  '🛂 DOCUMENTOS': ['passaporte', 'civp', 'vacina', 'rg', 'cpf', 'visto', 'reserva', 'comprovante', 'seguro', 'cartão', 'dinheiro', 'rand', 'dólar', 'wallet', 'carteira'],
  '🔌 ELETRÔNICOS': ['carregador', 'cabo', 'celular', 'power bank', 'adaptador', 'fone', 'headset', 'câmera', 'go pro', 'laptop', 'tablet', 'kindle'],
  '🎒 ACESSÓRIOS': ['chapéu', 'boné', 'óculos', 'relógio', 'joia', 'brinco', 'colar', 'pulseira', 'vuvuzela', 'protetor auricular', 'tampão'],
  '📦 DIVERSOS': []
};

const identifyCategory = (text: string): string => {
  const normalized = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(k => normalized.includes(k))) return category;
  }
  return '📦 DIVERSOS';
};

const sortItems = (items: Item[]) => {
  return [...items].sort((a, b) => a.text.localeCompare(b.text, 'pt-BR', { sensitivity: 'base', numeric: true }));
};

const INITIAL_DATA: PackingData = {
  'André': { 'bag23kg': [], 'bag10kg': [], 'pouch5kg': [] },
  'Marcelly': { 'bag23kg': [], 'bag10kg': [], 'pouch5kg': [] }
};

const PackingListItem: React.FC<{
  item: Item;
  onToggleIda: (id: string) => void;
  onToggleVolta: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}> = ({ item, onToggleIda, onToggleVolta, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(item.id, editText.trim());
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-green-200 shadow-sm">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 text-sm outline-none text-slate-700 font-medium bg-transparent min-w-0"
          autoFocus
        />
        <div className="flex shrink-0 gap-1">
          <button onClick={handleSave} className="text-green-600 p-1.5 hover:bg-green-50 rounded-md"><Check className="w-4 h-4" /></button>
          <button onClick={() => setIsEditing(false)} className="text-gray-400 p-1.5 hover:bg-gray-100 rounded-md"><X className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
      <button 
        onClick={() => onToggleIda(item.id)} 
        className={`shrink-0 p-1 rounded-full transition-all ${item.checked ? 'bg-sa-green/10' : 'bg-transparent'}`}
        title="Verificar Ida"
      >
        {item.checked ? <PlaneTakeoff className="w-5 h-5 text-sa-green" /> : <Circle className="w-5 h-5 text-slate-200" />}
      </button>
      <span className={`flex-1 text-sm font-medium pt-0.5 ${(item.checked && item.returned) ? 'text-gray-300 line-through decoration-gray-400' : 'text-gray-700'}`}>
        {item.text}
      </span>
      <button 
        onClick={() => onToggleVolta(item.id)} 
        className={`shrink-0 p-1 rounded-full transition-all ${item.returned ? 'bg-sa-blue/10' : 'bg-transparent'}`}
        title="Verificar Volta"
      >
        {item.returned ? <PlaneLanding className="w-5 h-5 text-sa-blue" /> : <Circle className="w-5 h-5 text-slate-200" />}
      </button>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0">
        <button onClick={() => setIsEditing(true)} className="text-gray-300 hover:text-blue-500 p-1"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={() => onDelete(item.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
};

const BagSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  items: Item[];
  colorClass: string;
  onToggleIda: (id: string) => void;
  onToggleVolta: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onAdd: (text: string) => void;
}> = ({ title, icon, items, colorClass, onToggleIda, onToggleVolta, onDelete, onEdit, onAdd }) => {
  const [newItemText, setNewItemText] = useState('');
  const handleAdd = () => { if (newItemText.trim()) { onAdd(newItemText.trim()); setNewItemText(''); } };

  const groupedItems = useMemo<Record<string, Item[]>>(() => {
    const groups: Record<string, Item[]> = {};
    items.forEach(item => {
      const cat = identifyCategory(item.text);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    const sortedGroups: Record<string, Item[]> = {};
    Object.keys(groups).sort().forEach(cat => { sortedGroups[cat] = sortItems(groups[cat]); });
    return sortedGroups;
  }, [items]);

  const idaCount = items.filter(i => i.checked).length;
  const voltaCount = items.filter(i => i.returned).length;
  const totalCount = items.length;
  const idaProgress = totalCount === 0 ? 0 : (idaCount / totalCount) * 100;
  const voltaProgress = totalCount === 0 ? 0 : (voltaCount / totalCount) * 100;

  return (
    <div className={`mb-6 rounded-2xl border-2 overflow-hidden ${colorClass} bg-white shadow-sm`}>
      <div className={`p-3 flex items-center justify-between border-b border-gray-100 ${colorClass.replace('border-', 'bg-').replace('50', '50/50')}`}>
        <div className="flex items-center gap-2">{icon}<h3 className="font-display font-bold text-slate-700">{title}</h3></div>
        <div className="flex items-center gap-1.5">
           <span className="text-[9px] font-black text-sa-green bg-white px-2 py-0.5 rounded-full border border-sa-green/20">🛫 {idaCount}/{totalCount}</span>
           <span className="text-[9px] font-black text-sa-blue bg-white px-2 py-0.5 rounded-full border border-sa-blue/20">🛬 {voltaCount}/{totalCount}</span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-gray-100 flex">
        <div className="h-full bg-sa-green transition-all duration-500" style={{ width: `${idaProgress / 2}%` }} />
        <div className="h-full bg-sa-blue transition-all duration-500" style={{ width: `${voltaProgress / 2}%` }} />
      </div>
      <div className="p-3">
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, catItems]) => (
            <div key={category}>
              <div className="flex items-center gap-2 px-2 mb-2"><Tag className="w-3 h-3 text-slate-300" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{category}</span><div className="h-[1px] flex-1 bg-slate-50"></div></div>
              <div className="space-y-1">{(catItems as Item[]).map(item => <PackingListItem key={item.id} item={item} onToggleIda={onToggleIda} onToggleVolta={onToggleVolta} onDelete={onDelete} onEdit={onEdit} />)}</div>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-gray-300 text-xs italic py-2">Nenhum item nesta lista.</p>}
        </div>
        <div className="mt-6 flex gap-2">
          <input type="text" value={newItemText} onChange={(e) => setNewItemText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} placeholder="Adicionar item..." className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-500" />
          <button onClick={handleAdd} disabled={!newItemText.trim()} className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:opacity-50"><Plus className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
};

const PackingList: React.FC<{ 
  selectedTrip?: { id: string; name: string; isDomestic?: boolean } | null;
  onBack: () => void;
}> = ({ selectedTrip, onBack }) => {
  const [activePerson, setActivePerson] = useState<Person>('André');
  const [aiSuggestions, setAiSuggestions] = useState<PackingSuggestion[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  
  // Determinar se a mala de 23kg deve ser excluída para esta viagem
  const is23kgExcluded = useMemo(() => {
    if (!selectedTrip) return true; // se não houver viagem ativa, por padrão esconde para as novas viagens propostas pelo usuário
    const nameLower = selectedTrip.name.toLowerCase();
    const idLower = selectedTrip.id.toLowerCase();
    
    // Lista de termos ou IDs onde 23kg é explicitamente descartado
    // Como o usuário instruiu: "nessa viagem nao vamos ter que levar mala de 23 quilos!"
    // Isto se aplica a todas as novas rotas de viagem propostas (Buenos Aires, Salvador, Caribe Colombiano, etc.)
    if (
      idLower === 'am_foz_ass_ba' || 
      idLower === 'am_rio_foz_ba' || 
      idLower === 'am_sp_ssa_aju' ||
      idLower === 'am_salvador_julho' ||
      idLower === 'am_bh_med_san' ||
      idLower === 'am_rio_san' ||
      nameLower.includes('buenos aires') || 
      nameLower.includes('foz') || 
      nameLower.includes('assunção') || 
      nameLower.includes('maragogi') || 
      nameLower.includes('aracaju') || 
      nameLower.includes('salvador') || 
      nameLower.includes('colombia')
    ) {
      return true;
    }
    return false;
  }, [selectedTrip]);

  const tripId = selectedTrip?.id || 'default';
  const tripStorageKey = `viajai_packing_list_v5_${tripId}`;

  // OFFLINE-FIRST: Inicializa o estado DIRETAMENTE do localStorage da viagem correspondente.
  // Isso evita a "piscada" de carregamento e faz o app parecer nativo/instantâneo.
  const [data, setData] = useState<PackingData>(() => {
    try {
      const saved = localStorage.getItem(tripStorageKey);
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch (e) {
      return INITIAL_DATA;
    }
  });

  // Atualiza os dados quando o tripId muda para carregar as informações corretas da viagem correspondente
  useEffect(() => {
    try {
      const saved = localStorage.getItem(tripStorageKey);
      setData(saved ? JSON.parse(saved) : INITIAL_DATA);
    } catch (e) {
      setData(INITIAL_DATA);
    }
  }, [tripId]);

  // Se a mala de 23kg estiver desativada, migra automaticamente os itens existentes para a mala de 10kg (evitando perda de dados)
  useEffect(() => {
    if (is23kgExcluded) {
      let hasChanges = false;
      const newData = JSON.parse(JSON.stringify(data));
      (['André', 'Marcelly'] as Person[]).forEach(person => {
        if (newData[person]?.bag23kg?.length > 0) {
          newData[person].bag10kg = [...newData[person].bag10kg, ...newData[person].bag23kg];
          newData[person].bag23kg = [];
          hasChanges = true;
        }
      });
      if (hasChanges) {
        updateCloud(newData);
      }
    }
  }, [is23kgExcluded, tripId]);

  // Sincronização em Background baseada na viagem ativa
  useEffect(() => {
    const userId = getSessionUser() || "temp_guest";
    const customDocId = `${userId}_${tripId}`;

    // Escuta mudanças na nuvem sem bloquear a UI
    const unsubscribe = subscribeToCloudData('packing_list_v5', (cloudData: any) => {
      if (cloudData) {
        const migrated: any = {};
        (['André', 'Marcelly'] as Person[]).forEach(p => {
          migrated[p] = {};
          (['bag23kg', 'bag10kg', 'pouch5kg'] as BagType[]).forEach(b => {
            const list = cloudData[p]?.[b];
            if (Array.isArray(list)) {
              migrated[p][b] = (list as any[]).map((item: any) => ({
                ...item,
                checked: !!item.checked,
                returned: !!item.returned
              }));
            } else {
              migrated[p][b] = [];
            }
          });
        });
        
        setData(migrated as PackingData);
        localStorage.setItem(tripStorageKey, JSON.stringify(migrated));
      }
    }, customDocId);

    return () => unsubscribe();
  }, [tripId]);

  const updateCloud = (newData: PackingData) => {
    const userId = getSessionUser() || "temp_guest";
    const customDocId = `${userId}_${tripId}`;

    // Atualiza localmente IMEDIATAMENTE (Optimistic UI)
    setData(newData);
    localStorage.setItem(tripStorageKey, JSON.stringify(newData));
    // Envia para nuvem em background usando a ID da viagem para isolamento de dados
    syncDataToCloud('packing_list_v5', newData, customDocId);
  };

  const handleToggleIda = (person: Person, bag: BagType, itemId: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    const list = newData[person][bag] as Item[];
    const idx = list.findIndex((i: Item) => i.id === itemId);
    if (idx > -1) { list[idx].checked = !list[idx].checked; updateCloud(newData); }
  };

  const handleToggleVolta = (person: Person, bag: BagType, itemId: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    const list = newData[person][bag] as Item[];
    const idx = list.findIndex((i: Item) => i.id === itemId);
    if (idx > -1) { list[idx].returned = !list[idx].returned; updateCloud(newData); }
  };

  const handleDelete = (person: Person, bag: BagType, itemId: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[person][bag] = (newData[person][bag] as Item[]).filter((i: Item) => i.id !== itemId);
    updateCloud(newData);
  };

  const handleEdit = (person: Person, bag: BagType, itemId: string, newText: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    const list = newData[person][bag] as Item[];
    const idx = list.findIndex((i: Item) => i.id === itemId);
    if (idx > -1) { list[idx].text = newText; updateCloud(newData); }
  };

  const handleAdd = (person: Person, bag: BagType, text: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[person][bag].push({ id: Date.now().toString(), text, checked: false, returned: false });
    updateCloud(newData);
  };

  // Carrega sugestões de IA (com cache para não refazer chamadas idênticas)
  useEffect(() => {
    const loadAiTips = async () => {
      const tripName = selectedTrip?.name || "África do Sul";
      const cacheKey = `viajai_packing_ai_${selectedTrip?.id || 'default'}_${activePerson}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          setAiSuggestions(JSON.parse(cached));
          return;
        } catch (e) {
          console.error(e);
        }
      }

      setLoadingAi(true);
      try {
        const tips = await getPackingSuggestions(tripName, activePerson, is23kgExcluded);
        if (tips && tips.length > 0) {
          setAiSuggestions(tips);
          localStorage.setItem(cacheKey, JSON.stringify(tips));
        }
      } catch (err) {
        console.error("Erro ao carregar dicas da mala:", err);
      } finally {
        setLoadingAi(false);
      }
    };

    loadAiTips();
  }, [selectedTrip, activePerson, is23kgExcluded]);

  const handleRefreshAi = async () => {
    const cacheKey = `viajai_packing_ai_${selectedTrip?.id || 'default'}_${activePerson}`;
    localStorage.removeItem(cacheKey);
    setLoadingAi(true);
    try {
      const tripName = selectedTrip?.name || "África do Sul";
      const tips = await getPackingSuggestions(tripName, activePerson, is23kgExcluded);
      if (tips && tips.length > 0) {
        setAiSuggestions(tips);
        localStorage.setItem(cacheKey, JSON.stringify(tips));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const personData = data[activePerson];

  return (
    <div className="pb-48">
      <CategoryHeader title="Checklist" onBack={onBack} />
      <div className="p-4 space-y-6">
      {is23kgExcluded && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 mb-4 flex gap-3 items-start shadow-sm">
          <Luggage className="w-5 h-5 text-orange-600 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h3 className="text-orange-700 font-bold text-xs uppercase tracking-wider font-mono">BAGGAGE LIMIT (10KG + BOLSA DE MÃO)</h3>
            <p className="text-[10px] text-orange-800 leading-relaxed font-medium mt-1">
              De acordo com as passagens desta viagem, <strong>não vamos levar mala despachada de 23kg</strong>! 
              O checklist foi ajustado apenas para as malas de mão de 10kg e bolsas pessoais/frasqueiras.
            </p>
          </div>
        </div>
      )}
      <div className="bg-sa-green/10 border border-sa-green/20 rounded-2xl p-4 mb-6 flex gap-3 items-start shadow-sm">
        <PlaneTakeoff className="w-5 h-5 text-sa-green shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sa-green font-bold text-sm uppercase">Check-in de Segurança</h3>
          <p className="text-[10px] text-green-800 leading-relaxed font-medium">Use 🛫 para a **Ida** e 🛬 para garantir que o item voltou na mala na **Volta**.</p>
        </div>
      </div>
      
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 shadow-inner border border-slate-200">
        {(['André', 'Marcelly'] as Person[]).map((person) => (
          <button 
            key={person} 
            onClick={() => setActivePerson(person)} 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black font-display uppercase tracking-widest transition-all ${
              activePerson === person 
                ? person === 'André'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20 ring-1 ring-white/10 scale-[1.02]'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20 ring-1 ring-white/10 scale-[1.02]'
                : person === 'André'
                  ? 'text-slate-400 hover:text-cyan-500 hover:bg-white/50'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-white/50'
            }`}
          >
            <User className={`w-4 h-4 ${
              activePerson === person 
                ? 'text-white' 
                : person === 'André' ? 'text-cyan-500' : 'text-rose-500'
            }`} /> 
            {person}
          </button>
        ))}
      </div>

      {/* CARD INTELIGENTE DE SUGESTÕES DE IA */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-xl border border-white/10 relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-display text-sm flex items-center gap-2 uppercase tracking-wide">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              Recomendações IA para {activePerson}
            </h3>
            <button 
              onClick={handleRefreshAi} 
              disabled={loadingAi}
              className="text-indigo-200 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
              title="Recarregar Sugestões"
            >
              <RefreshCw className={`w-4 h-4 ${loadingAi ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingAi ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-xs text-indigo-200 font-medium animate-pulse">Consultando especialista de malas para {selectedTrip?.name || "seu destino"}...</p>
            </div>
          ) : aiSuggestions.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {aiSuggestions.map((sug, idx) => {
                // Verificar se o item já foi adicionado
                const exists = personData[sug.bagType]?.some(
                  item => item.text.toLowerCase().trim() === sug.itemText.toLowerCase().trim()
                );

                const getBagName = (type: BagType) => {
                  if (type === 'bag23kg') return 'Mala 23kg';
                  if (type === 'bag10kg') return 'Mala 10kg';
                  return 'Frasqueira';
                };

                return (
                  <div key={idx} className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/5 hover:border-indigo-500/20 transition-all flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wide bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                          {sug.category}
                        </span>
                        <span className="text-[9px] font-black uppercase text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">
                          {getBagName(sug.bagType)}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white mb-0.5">{sug.itemText}</h4>
                      <p className="text-[10px] text-slate-300 leading-relaxed">{sug.reason}</p>
                    </div>
                    <button
                      onClick={() => !exists && handleAdd(activePerson, sug.bagType, sug.itemText)}
                      disabled={exists}
                      className={`shrink-0 p-2 rounded-xl transition-all ${exists ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'}`}
                    >
                      {exists ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-400 text-xs">
              Nenhuma sugestão encontrada para esta viagem.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {!is23kgExcluded && (
          <BagSection title="Mala 23kg (Despachada)" icon={<Luggage className="w-5 h-5 text-blue-600" />} items={personData.bag23kg} colorClass="border-blue-50" onToggleIda={(id) => handleToggleIda(activePerson, 'bag23kg', id)} onToggleVolta={(id) => handleToggleVolta(activePerson, 'bag23kg', id)} onDelete={(id) => handleDelete(activePerson, 'bag23kg', id)} onEdit={(id, txt) => handleEdit(activePerson, 'bag23kg', id, txt)} onAdd={(text) => handleAdd(activePerson, 'bag23kg', text)} />
        )}
        <BagSection title="Mala 10kg (Mão)" icon={<ShoppingBag className="w-5 h-5 text-orange-600" />} items={personData.bag10kg} colorClass="border-orange-50" onToggleIda={(id) => handleToggleIda(activePerson, 'bag10kg', id)} onToggleVolta={(id) => handleToggleVolta(activePerson, 'bag10kg', id)} onDelete={(id) => handleDelete(activePerson, 'bag10kg', id)} onEdit={(id, txt) => handleEdit(activePerson, 'bag10kg', id, txt)} onAdd={(text) => handleAdd(activePerson, 'bag10kg', text)} />
        <BagSection title="Frasqueira 5kg (Mão)" icon={<Briefcase className="w-5 h-5 text-purple-600" />} items={personData.pouch5kg} colorClass="border-purple-50" onToggleIda={(id) => handleToggleIda(activePerson, 'pouch5kg', id)} onToggleVolta={(id) => handleToggleVolta(activePerson, 'pouch5kg', id)} onDelete={(id) => handleDelete(activePerson, 'pouch5kg', id)} onEdit={(id, txt) => handleEdit(activePerson, 'pouch5kg', id, txt)} onAdd={(text) => handleAdd(activePerson, 'pouch5kg', text)} />
      </div>
      
      <div className="text-center mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1.5 uppercase font-black tracking-widest"><CloudLightning className="w-3 h-3 text-sa-green" /> Sincronização em tempo real</p>
      </div>
      </div>
    </div>
  );
};

export default PackingList;
