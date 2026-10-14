import React, { useState } from 'react';
import { Calculator, ArrowRight, TrendingUp, ShieldCheck, X } from 'lucide-react';

interface DestinyData {
  name: string;
  price: number;
  stayPerNight: number;
  foodPerDay: number;
  toursPerDay: number;
  days: number;
}

export const DestinyComparator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [destA, setDestA] = useState<DestinyData>({ name: '', price: 0, stayPerNight: 0, foodPerDay: 0, toursPerDay: 0, days: 1 });
  const [destB, setDestB] = useState<DestinyData>({ name: '', price: 0, stayPerNight: 0, foodPerDay: 0, toursPerDay: 0, days: 1 });
  const [showComparison, setShowComparison] = useState(false);

  const calculate = (d: DestinyData) => {
    const total = d.price + (d.stayPerNight * d.days) + (d.foodPerDay * d.days) + (d.toursPerDay * d.days);
    return { total, perDay: total / d.days };
  };

  const resA = calculate(destA);
  const resB = calculate(destB);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      <div className="bg-[#0f172a]/95 border border-white/10 rounded-3xl p-6 shadow-2xl">
        <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Comparador de Destinos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[destA, destB].map((d, i) => (
            <div key={i} className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold text-slate-400">Destino {i === 0 ? 'A' : 'B'}</h3>
              <input type="text" placeholder="Nome do Destino" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" value={d.name} onChange={(e) => i === 0 ? setDestA({...destA, name: e.target.value}) : setDestB({...destB, name: e.target.value})} />
              <input type="number" placeholder="Preço Passagem (R$)" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" value={d.price || ''} onChange={(e) => i === 0 ? setDestA({...destA, price: +e.target.value}) : setDestB({...destB, price: +e.target.value})} />
              <input type="number" placeholder="Estadia p/ Noite (R$)" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" value={d.stayPerNight || ''} onChange={(e) => i === 0 ? setDestA({...destA, stayPerNight: +e.target.value}) : setDestB({...destB, stayPerNight: +e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Alimentação/dia" className="bg-slate-900 border border-white/10 rounded-xl p-3 text-white" value={d.foodPerDay || ''} onChange={(e) => i === 0 ? setDestA({...destA, foodPerDay: +e.target.value}) : setDestB({...destB, foodPerDay: +e.target.value})} />
                <input type="number" placeholder="Turismo/dia" className="bg-slate-900 border border-white/10 rounded-xl p-3 text-white" value={d.toursPerDay || ''} onChange={(e) => i === 0 ? setDestA({...destA, toursPerDay: +e.target.value}) : setDestB({...destB, toursPerDay: +e.target.value})} />
              </div>
              <input type="number" placeholder="Total de Dias" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" value={d.days || ''} onChange={(e) => i === 0 ? setDestA({...destA, days: +e.target.value}) : setDestB({...destB, days: +e.target.value})} />
            </div>
          ))}
        </div>

        <button onClick={() => setShowComparison(true)} className="mt-8 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase rounded-2xl shadow-lg shadow-emerald-500/20 transition-all">
          Comparar Destinos
        </button>
      </div>

      {showComparison && (
        <div className="bg-[#131b2e] border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="overflow-x-auto">
                <table className="w-full text-white text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-xs uppercase">
                            <th className="p-3 text-left">Métrica</th>
                            <th className="p-3">{destA.name || 'Destino A'}</th>
                            <th className="p-3">{destB.name || 'Destino B'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td className="p-3">Custo Total</td><td className="p-3 font-extrabold tabular-nums">R$ {resA.total.toFixed(2)}</td><td className="p-3 font-extrabold tabular-nums">R$ {resB.total.toFixed(2)}</td></tr>
                        <tr><td className="p-3">Custo p/ Dia</td><td className="p-3 font-extrabold tabular-nums text-emerald-400">R$ {resA.perDay.toFixed(2)}</td><td className="p-3 font-extrabold tabular-nums text-emerald-400">R$ {resB.perDay.toFixed(2)}</td></tr>
                    </tbody>
                </table>
            </div>
            <button onClick={onBack} className="mt-6 flex items-center gap-2 text-slate-400 hover:text-white">
                <X className="w-4 h-4" /> Fechar Comparação
            </button>
        </div>
      )}
    </div>
  );
};
