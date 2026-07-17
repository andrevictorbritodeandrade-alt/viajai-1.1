import React, { useState } from 'react';
import { Map, Marker } from 'pigeon-maps';
import { Car, Footprints, MapPin } from 'lucide-react';

const routePoints = [
  { id: 1, name: "Estacionamento Praça da Sé", desc: "Deixe o carro aqui", lat: -12.9734, lon: -38.5114, walkToNext: "1 min (50m)", carToNext: "Desnecessário" },
  { id: 2, name: "Museu da Misericórdia", desc: "História e arte sacra", lat: -12.9736, lon: -38.5117, walkToNext: "8 min (650m)", carToNext: "Ruim (Ruas de pedestre)" },
  { id: 3, name: "Museu da Gastronomia Baiana", desc: "Largo do Pelourinho", lat: -12.9719, lon: -38.5083, walkToNext: "4 min (300m)", carToNext: "Desnecessário" },
  { id: 4, name: "Casa do Carnaval da Bahia", desc: "Museu interativo", lat: -12.9729, lon: -38.5100, walkToNext: "1 min (50m)", carToNext: "Desnecessário" },
  { id: 5, name: "O Cravinho", desc: "Terreiro de Jesus", lat: -12.9725, lon: -38.5097, walkToNext: "5 min (400m)", carToNext: "Desnecessário" },
  { id: 6, name: "Casa das Histórias de Salvador", desc: "Museu imersivo", lat: -12.9735, lon: -38.5144, walkToNext: "5 min (400m)", carToNext: "Desnecessário" },
  { id: 7, name: "MUNCAB", desc: "Próximo à Praça da Sé", lat: -12.9733, lon: -38.5100, walkToNext: "Retirar o carro", carToNext: "15 min (5km)" },
  { id: 8, name: "Terreiro Casa Branca", desc: "Bairro Federação", lat: -13.0041, lon: -38.5066, walkToNext: null, carToNext: null },
];

export default function PelourinhoRouteMap() {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  return (
    <div className="w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 mt-4 mb-2">
      <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Rota Inteligente: Pelourinho
        </h4>
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-900 px-2 py-1 rounded-md">Recomendação: A Pé</span>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Left Side: Map */}
        <div className="w-full md:w-1/2 h-[250px] md:h-auto min-h-[300px] relative">
          <Map 
            height={300} 
            defaultCenter={[-12.9730, -38.5110]} 
            defaultZoom={15.5}
            metaWheelZoom={true}
          >
            {routePoints.map((pt) => (
              <Marker 
                key={pt.id} 
                width={35}
                anchor={[pt.lat, pt.lon]} 
                color={activePoint === pt.id ? '#00c58e' : '#334155'}
                onClick={() => setActivePoint(pt.id)}
              />
            ))}
          </Map>
          
          {/* Legend/Hint overlay */}
          <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm p-2 rounded-lg border border-slate-700 pointer-events-none">
            <p className="text-[9px] text-slate-300 font-bold uppercase">Distâncias entre pontos:</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-[10px] text-emerald-400"><Footprints className="w-3 h-3" /> A pé (Ideal)</span>
              <span className="flex items-center gap-1 text-[10px] text-rose-400"><Car className="w-3 h-3" /> Carro (Evite)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Step-by-Step Delivery Style */}
        <div className="w-full md:w-1/2 bg-slate-900 p-4 max-h-[300px] overflow-y-auto route-scrollbar">
          <div className="relative border-l-2 border-slate-700 ml-3 py-2 space-y-6">
            {routePoints.map((pt, idx) => {
              const isLast = idx === routePoints.length - 1;
              return (
                <div 
                  key={pt.id} 
                  className={`relative pl-6 transition-opacity duration-200 cursor-pointer ${activePoint === pt.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                  onMouseEnter={() => setActivePoint(pt.id)}
                  onMouseLeave={() => setActivePoint(null)}
                >
                  {/* Number Badge (Delivery Style) */}
                  <div className={`absolute -left-[13px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${activePoint === pt.id || pt.id === 1 ? 'bg-emerald-500 border-slate-900 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                    {pt.id}
                  </div>
                  
                  <div className="pt-0.5">
                    <h5 className={`text-xs font-bold ${activePoint === pt.id ? 'text-emerald-400' : 'text-white'}`}>{pt.name}</h5>
                    <p className="text-[10px] text-slate-400 mb-2">{pt.desc}</p>
                    
                    {!isLast && pt.walkToNext && (
                      <div className="flex flex-col gap-1.5 mt-2 mb-1">
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md w-fit">
                          <Footprints className="w-3 h-3" />
                          Até ponto {pt.id + 1}: {pt.walkToNext}
                        </div>
                        {pt.carToNext && (
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md w-fit ${pt.id === 7 ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            <Car className="w-3 h-3" />
                            {pt.id === 7 ? `Carro até o ponto ${pt.id + 1}: ${pt.carToNext}` : `Carro: ${pt.carToNext}`}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .route-scrollbar::-webkit-scrollbar { width: 4px; }
        .route-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .route-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}} />
    </div>
  );
}
