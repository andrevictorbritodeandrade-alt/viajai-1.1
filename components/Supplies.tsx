import React, { useState, useEffect } from 'react';
import CategoryHeader from './CategoryHeader';
import { searchNearbyMarkets, NearbyMarket } from '../services/geminiService';
import { MENU_ITEMS } from '../constants';

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

  useEffect(() => {
    const fetchMarkets = async () => {
      if (activeAcc) {
        const markets = await searchNearbyMarkets(activeAcc.name, activeAcc.location, activeAcc.city);
        setAiMarkets(markets);
      }
    };
    fetchMarkets();
  }, [activeAcc]);
  const menuItem = MENU_ITEMS.find(item => item.id === 'mercado');
  
  return (
    <div className="pb-48">
      <CategoryHeader title={menuItem?.title || 'MERCADO E DELIVERY'} onBack={onBack || (() => {})} />
      <div className="p-4 space-y-6">
        <p className="text-[10px] text-slate-500 leading-relaxed max-w-[90%]">
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

      {/* Lista de Mercados */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Mercados Próximos</h3>
        {aiMarkets.map((market, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-slate-100 p-3 rounded-xl text-slate-500 font-bold">
               {market.name[0]}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-slate-800">{market.name}</h4>
              <p className="text-[10px] text-slate-500">{market.address}</p>
            </div>
            <div className="text-[10px] font-bold text-slate-500">{market.distance}</div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Supplies;
