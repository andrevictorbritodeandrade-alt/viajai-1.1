import React, { useState, useEffect, useRef } from 'react';
import { 
  Fuel, 
  MapPin, 
  Car, 
  TrendingUp,
  Receipt,
  Sparkles,
  Loader2,
  Settings2,
  Banknote,
  Navigation,
  CheckCircle2,
  Search
} from 'lucide-react';
import { EXPENSES_STORAGE_KEY } from '../constants';
import CategoryHeader from './CategoryHeader';
import { getFuelAdvice, FuelAdvice, getVehicleSpecs } from '../services/geminiService';
import { loadDataFromCloud, syncDataToCloud } from '../services/firebase';

const FUEL_STORAGE_KEY = 'viajai_fuel_data';

const POPULAR_RENTAL_CARS = [
  { name: 'Hyundai HB20 1.0', tank: 50, gas: 13.3, etanol: 9.5 },
  { name: 'Chevrolet Onix 1.0', tank: 44, gas: 13.9, etanol: 9.9 },
  { name: 'Fiat Mobi 1.0', tank: 47, gas: 14.3, etanol: 10.0 },
  { name: 'Renault Kwid 1.0', tank: 38, gas: 15.3, etanol: 10.8 },
  { name: 'Fiat Argo 1.0', tank: 48, gas: 13.9, etanol: 9.8 },
  { name: 'Volkswagen Polo 1.0', tank: 52, gas: 14.0, etanol: 9.6 },
  { name: 'Jeep Renegade 1.3 Turbo', tank: 55, gas: 12.1, etanol: 8.4 },
  { name: 'Nissan Kicks 1.6', tank: 41, gas: 13.7, etanol: 9.6 },
  { name: 'Fiat Cronos 1.3', tank: 48, gas: 13.4, etanol: 9.4 },
  { name: 'Toyota Corolla 2.0', tank: 50, gas: 14.2, etanol: 9.9 }
];


export const FuelCalculator: React.FC<{
  selectedTrip?: { id: string; name: string } | null;
  onBack: () => void;
}> = ({ selectedTrip, onBack }) => {
  const trip = selectedTrip || { id: 'am_salvador_julho', name: 'Salvador e Região' };
  
  // States
  const [vehicle, setVehicle] = useState('');
  const [tankCapacity, setTankCapacity] = useState<number | ''>('');
  
  const [gasPrice, setGasPrice] = useState<number | ''>('');
  const [gasKmL, setGasKmL] = useState<number | ''>('');
  
  const [etanolPrice, setEtanolPrice] = useState<number | ''>('');
  const [etanolKmL, setEtanolKmL] = useState<number | ''>('');

  const [odoStart, setOdoStart] = useState<number | ''>('');
  const [odoCurrent, setOdoCurrent] = useState<number | ''>('');
  
  const [averageSpeed, setAverageSpeed] = useState<number | ''>('');
  
  const [advice, setAdvice] = useState<FuelAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [specsSuccess, setSpecsSuccess] = useState(false);

  const handleFetchSpecs = async (queryToSearch?: string) => {
    const q = queryToSearch || vehicle;
    if (!q || q.trim().length < 2) return;
    setLoadingSpecs(true);
    setSpecsSuccess(false);
    try {
      const specs = await getVehicleSpecs(q);
      if (specs) {
        setVehicle(specs.vehicleName);
        setTankCapacity(specs.tankCapacity);
        setGasKmL(specs.gasKmL);
        setEtanolKmL(specs.etanolKmL);
        setSpecsSuccess(true);
        setTimeout(() => setSpecsSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSpecs(false);
    }
  };


  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FUEL_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setVehicle(data.vehicle || '');
        setTankCapacity(data.tankCapacity || '');
        setGasPrice(data.gasPrice || '');
        setGasKmL(data.gasKmL || '');
        setEtanolPrice(data.etanolPrice || '');
        setEtanolKmL(data.etanolKmL || '');
        setOdoStart(data.odoStart || '');
        setOdoCurrent(data.odoCurrent || '');
        setAverageSpeed(data.averageSpeed || '');
      }
    } catch(e) {}
  }, []);

  // Save changes
  useEffect(() => {
    localStorage.setItem(FUEL_STORAGE_KEY, JSON.stringify({
      vehicle, tankCapacity, gasPrice, gasKmL, etanolPrice, etanolKmL, odoStart, odoCurrent, averageSpeed
    }));
  }, [vehicle, tankCapacity, gasPrice, gasKmL, etanolPrice, etanolKmL, odoStart, odoCurrent, averageSpeed]);

  // Derived calculations
  const distance = (Number(odoCurrent) || 0) - (Number(odoStart) || 0);
  const validDistance = distance > 0 ? distance : 0;
  
  // Tank range
  const rangeGas = (Number(tankCapacity) || 0) * (Number(gasKmL) || 0);
  const rangeEtanol = (Number(tankCapacity) || 0) * (Number(etanolKmL) || 0);
  
  // Full tank cost
  const fullTankGasPrice = (Number(tankCapacity) || 0) * (Number(gasPrice) || 0);
  const fullTankEtanolPrice = (Number(tankCapacity) || 0) * (Number(etanolPrice) || 0);
  
  // Cost per KM
  const costPerKmGas = (Number(gasPrice) > 0 && Number(gasKmL) > 0) ? (Number(gasPrice) / Number(gasKmL)) : 0;
  const costPerKmEtanol = (Number(etanolPrice) > 0 && Number(etanolKmL) > 0) ? (Number(etanolPrice) / Number(etanolKmL)) : 0;

  // Best fuel choice
  const bestFuel = (costPerKmGas > 0 && costPerKmEtanol > 0) 
    ? (costPerKmEtanol < costPerKmGas ? 'Etanol' : 'Gasolina')
    : (costPerKmGas > 0 ? 'Gasolina' : (costPerKmEtanol > 0 ? 'Etanol' : 'N/A'));
    
  const bestCostPerKm = bestFuel === 'Etanol' ? costPerKmEtanol : costPerKmGas;
  
  // Estimated total cost for distance
  const estimatedCost = validDistance * bestCostPerKm;
  
  // Refuels needed
  const bestRange = bestFuel === 'Etanol' ? rangeEtanol : rangeGas;
  const refuelsNeeded = (validDistance > 0 && bestRange > 0) ? Math.ceil(validDistance / bestRange) : 0;
  
  // Time estimate
  const estimatedHours = (validDistance > 0 && Number(averageSpeed) > 0) ? validDistance / Number(averageSpeed) : 0;

  const handleRefreshAdvice = async () => {
    if (!vehicle || validDistance <= 0 || bestCostPerKm <= 0) return;
    
    setLoadingAdvice(true);
    try {
      const res = await getFuelAdvice({
        tripName: trip.name,
        vehicle,
        distance: validDistance,
        fuel: bestFuel,
        cost: estimatedCost,
        tankCapacity: Number(tankCapacity)
      });
      setAdvice(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleLogExpense = async () => {
    if (estimatedCost <= 0) return;
    
    setIsSaving(true);
    try {
      let expenses: any[] = [];
      const cloudData = await loadDataFromCloud('expenses_log');
      if (cloudData && cloudData.list) {
        expenses = cloudData.list;
      } else {
        const saved = localStorage.getItem(EXPENSES_STORAGE_KEY);
        if (saved) expenses = JSON.parse(saved);
      }
      
      expenses.push({
        id: 'fuel_' + Date.now().toString(),
        description: `Abastecimento (${bestFuel}) - Viatura: ${vehicle}`,
        amount: estimatedCost,
        currency: 'BRL',
        amountInBRL: estimatedCost,
        date: new Date().toLocaleDateString('pt-BR')
      });
      
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
      await syncDataToCloud('expenses_log', { list: expenses });
      alert('Abastecimento lançado nos Gastos com sucesso!');
    } catch(e) {
      console.error(e);
      alert('Erro ao salvar abastecimento.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-cyan-500/30">
      <CategoryHeader
        title="Combustível"
        onBack={onBack}
        id="abastecimento"
      />

      <main className="px-5 pt-6 pb-24 max-w-2xl mx-auto space-y-6">
        
        {/* Veículo e Distância */}
        <section className="bg-white border border-slate-200 p-5 rounded-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Car className="w-5 h-5 text-cyan-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Dados da Viagem</h2>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center justify-between">
                <span>Modelo do Carro (Ex: HB20 1.0)</span>
                {specsSuccess && (
                  <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-bold animate-fade-in">
                    <CheckCircle2 className="w-3 h-3" /> Ficha técnica preenchida!
                  </span>
                )}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    value={vehicle}
                    onChange={(e) => {
                      setVehicle(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Qual carro você alugou?"
                  />
                  <div className="absolute right-3 top-3.5 text-slate-400">
                    <Car className="w-4 h-4" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFetchSpecs()}
                  disabled={loadingSpecs || !vehicle}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                  title="Consultar ficha técnica completa via IA"
                >
                  {loadingSpecs ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>IA</span>
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-100">
                  {POPULAR_RENTAL_CARS.filter(car => 
                    !vehicle || car.name.toLowerCase().includes(vehicle.toLowerCase())
                  ).map((car) => (
                    <button
                      key={car.name}
                      type="button"
                      onMouseDown={() => {
                        setVehicle(car.name);
                        setTankCapacity(car.tank);
                        setGasKmL(car.gas);
                        setEtanolKmL(car.etanol);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 flex justify-between items-center text-xs transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{car.name}</span>
                        <span className="block text-[10px] text-slate-500">Tanque: {car.tank}L</span>
                      </div>
                      <div className="text-right text-[10px] text-slate-500">
                        <span className="block text-emerald-600 font-bold">Gas: {car.gas} km/l</span>
                        <span>Eta: {car.etanol} km/l</span>
                      </div>
                    </button>
                  ))}
                  
                  {vehicle && vehicle.trim().length >= 2 && (
                    <button
                      type="button"
                      onMouseDown={() => handleFetchSpecs(vehicle)}
                      className="w-full text-left px-4 py-3.5 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-2 text-xs text-indigo-700 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Buscar ficha completa de <strong>"{vehicle}"</strong> com Inteligência Artificial</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Odômetro Inicial (km)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  value={odoStart}
                  onChange={(e) => setOdoStart(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Odômetro Atual (km)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  value={odoCurrent}
                  onChange={(e) => setOdoCurrent(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Tanque (Litros)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  value={tankCapacity}
                  onChange={(e) => setTankCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="45"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Velocidade Média (km/h)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  value={averageSpeed}
                  onChange={(e) => setAverageSpeed(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="80"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Consumo */}
        <section className="bg-white border border-slate-200 p-5 rounded-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Consumo & Preços</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Gasolina */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Gasolina</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">Preço (R$)</label>
                  <input type="number" step="0.01" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500" value={gasPrice} onChange={(e) => setGasPrice(e.target.value === '' ? '' : Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">Média (km/l)</label>
                  <input type="number" step="0.1" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500" value={gasKmL} onChange={(e) => setGasKmL(e.target.value === '' ? '' : Number(e.target.value))} />
                </div>
              </div>
            </div>
            
            {/* Etanol */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Etanol</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">Preço (R$)</label>
                  <input type="number" step="0.01" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500" value={etanolPrice} onChange={(e) => setEtanolPrice(e.target.value === '' ? '' : Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">Média (km/l)</label>
                  <input type="number" step="0.1" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500" value={etanolKmL} onChange={(e) => setEtanolKmL(e.target.value === '' ? '' : Number(e.target.value))} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dash Resultados */}
        {(validDistance > 0 || bestCostPerKm > 0) && (
          <section className="bg-gradient-to-br from-cyan-50 to-emerald-50 border border-cyan-200 p-5 rounded-3xl">
            <h2 className="text-xs font-black uppercase tracking-wider text-cyan-700 mb-4 font-mono">Diagnóstico de Bordo</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-2xl p-3 border border-slate-200">
                <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1 font-mono">Distância Percorrida</span>
                <span className="text-xl font-black text-slate-900 font-mono">{validDistance.toFixed(1)} <span className="text-sm text-slate-500">km</span></span>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-slate-200">
                <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1 font-mono">Custo Estimado</span>
                <span className="text-xl font-black text-emerald-600 font-mono">R$ {estimatedCost.toFixed(2)}</span>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-slate-200">
                <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1 font-mono">Combustível Ideal</span>
                <span className="text-base font-black text-slate-900">{bestFuel}</span>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-slate-200">
                <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1 font-mono">Tempo de Direção</span>
                <span className="text-base font-black text-slate-900">{estimatedHours.toFixed(1)}h</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 font-mono text-xs text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>Rendimento Tanque Completo (Gas):</span>
                <span className="font-bold text-slate-900">{rangeGas.toFixed(0)} km / R$ {fullTankGasPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>Rendimento Tanque Completo (Eta):</span>
                <span className="font-bold text-slate-900">{rangeEtanol.toFixed(0)} km / R$ {fullTankEtanolPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Abastecimentos Necessários:</span>
                <span className="font-bold text-emerald-600">{refuelsNeeded}x</span>
              </div>
            </div>

            <button 
              onClick={handleLogExpense}
              disabled={isSaving || estimatedCost <= 0}
              className="mt-5 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              {isSaving ? 'Lançando...' : 'Lançar nos Gastos'}
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-2">Adiciona um novo registro na aba de Gastos.</p>
          </section>
        )}

        {/* AI Insight */}
        {validDistance > 0 && bestCostPerKm > 0 && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-3xl p-5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Sparkles className="w-24 h-24 text-indigo-600" />
             </div>
             
             <div className="relative z-10">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                     <Sparkles className="w-4 h-4 text-indigo-600" />
                   </div>
                   <h3 className="font-bold text-sm text-indigo-900 uppercase tracking-wider">Análise de Rota Inteligente</h3>
                 </div>
                 
                 <button 
                   onClick={handleRefreshAdvice}
                   disabled={loadingAdvice}
                   className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
                 >
                   {loadingAdvice ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Analisar'}
                 </button>
               </div>
               
               {advice ? (
                 <div className="space-y-3 text-sm text-indigo-800 leading-relaxed font-light">
                   <p className="font-medium text-slate-900 mb-2">{advice.title}</p>
                   <ul className="space-y-2">
                     {advice.tips.map((tip, i) => (
                       <li key={i} className="flex gap-2">
                         <span className="text-indigo-600 font-bold">•</span>
                         <span dangerouslySetInnerHTML={{__html: tip}} />
                       </li>
                     ))}
                   </ul>
                 </div>
               ) : (
                 <p className="text-sm text-indigo-600/70">
                   Toque em Analisar para obter dicas da IA sobre o consumo de combustível e a rota escolhida.
                 </p>
               )}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};
