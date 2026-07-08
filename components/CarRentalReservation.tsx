import React from 'react';
import { 
  Car, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  FileText, 
  User, 
  CheckCircle, 
  AlertTriangle,
  Fuel,
  CreditCard,
  Briefcase,
  Users
} from 'lucide-react';
import CategoryHeader from './CategoryHeader';

interface CarRentalReservationProps {
  onBack: () => void;
}

export const CarRentalReservation: React.FC<CarRentalReservationProps> = ({ onBack }) => {
  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 text-white">
      {/* Header */}
      <CategoryHeader 
        title="ALUGUEL DE CARRO" 
        onBack={onBack} 
        bgImage="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop" 
      />

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Main Voucher Ticket */}
        <div className="bg-[#111827] border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-black/30 rounded-xl">
                <Car className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-widest text-emerald-200 uppercase">DOCUMENTO DA RESERVA</p>
                <h2 className="text-lg font-black text-white uppercase tracking-wide">Rentcars • LocarX</h2>
              </div>
            </div>
            
            <div className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl text-right">
              <span className="text-[9px] block text-slate-400 font-bold uppercase tracking-wider">Código Solicitação</span>
              <span className="text-sm font-black text-emerald-400 tracking-widest font-mono">QHKJDZC</span>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-6">
            
            {/* Locadora & Car Profile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/10">
              
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DADOS DA LOCADORA</span>
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white">LocarX Rent a Car</h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      +55 (71) 98796-8525
                    </p>
                  </div>
                  <div className="bg-black px-3 py-2 rounded-xl border border-white/10 flex items-center justify-center">
                    <span className="font-mono text-xs font-black text-white">locar<span className="text-rose-500">X</span></span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VEÍCULO RESERVADO</span>
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <h3 className="text-base font-black text-white">Fiat Mobi <span className="text-xs text-slate-400 font-normal">(ou similar)</span></h3>
                  <span className="inline-block bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-md mt-1.5 tracking-wider">
                    Categoria: Econômico
                  </span>
                  
                  {/* Car Features */}
                  <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3.5 border-t border-white/5 text-slate-400 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>5 Pass.</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Manual</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>1 Mala</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-emerald-400/80 font-black tracking-widest uppercase mt-2">
                    ✓ Quilometragem Livre
                  </p>
                </div>
              </div>

            </div>

            {/* Retirada e Devolução Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/10">
              
              {/* Retirada */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  RETIRADA DO VEÍCULO
                </span>
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-[10px] block text-slate-400 font-bold uppercase tracking-wider">Data</span>
                      <span className="text-sm font-black text-white">17 JUL., 2026 - SEX.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-[10px] block text-slate-400 font-bold uppercase tracking-wider">Horário</span>
                      <span className="text-sm font-black text-white">02:00 da Madrugada</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] block text-slate-400 font-bold uppercase tracking-wider">Local</span>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        Aeroporto de Salvador (SSA), SSA, Brasil
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Devolução */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  DEVOLUÇÃO DO VEÍCULO
                </span>
                <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-rose-400" />
                    <div>
                      <span className="text-[10px] block text-slate-400 font-bold uppercase tracking-wider">Data</span>
                      <span className="text-sm font-black text-white">21 JUL., 2026 - TER.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-rose-400" />
                    <div>
                      <span className="text-[10px] block text-slate-400 font-bold uppercase tracking-wider">Horário</span>
                      <span className="text-sm font-black text-white">02:00 da Madrugada</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] block text-slate-400 font-bold uppercase tracking-wider">Local</span>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        Aeroporto de Salvador (SSA), SSA, Brasil
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Price and Financial details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div>
                <span className="text-[9px] block text-slate-400 font-bold uppercase tracking-wider mb-1">VOUCHER NÚMERO</span>
                <span className="text-sm font-black text-white font-mono">50979</span>
              </div>
              <div>
                <span className="text-[9px] block text-slate-400 font-bold uppercase tracking-wider mb-1">VALOR TOTAL PAGO</span>
                <span className="text-base font-black text-emerald-400">R$ 455,53</span>
                <span className="text-[9px] block text-emerald-500/80 font-black uppercase tracking-widest mt-0.5">✓ PAGO ONLINE</span>
              </div>
              <div>
                <span className="text-[9px] block text-slate-400 font-bold uppercase tracking-wider mb-1">CAUÇÃO DE GARANTIA</span>
                <span className="text-sm font-black text-slate-200">A partir de R$ 800,00</span>
                <span className="text-[9px] block text-slate-400 font-medium mt-0.5">Bloqueado no cartão de crédito</span>
              </div>
            </div>

            {/* Condutor information */}
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
              <User className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[9px] block text-slate-400 font-bold uppercase tracking-wider">CONDUTOR PRINCIPAL</span>
                <span className="text-xs font-black text-white uppercase tracking-wide">André Brito</span>
                <span className="text-[10px] text-slate-400 font-mono ml-3">CPF ***.669.667-**</span>
              </div>
            </div>

          </div>

          {/* Ticket footer */}
          <div className="bg-white/5 px-6 py-4 border-t border-white/10 text-slate-400 text-xs flex flex-wrap gap-4 justify-between items-center">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              Proteção do veículo inclusa contra danos e roubos
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">
              Rentcars.com/pt-br
            </span>
          </div>

        </div>

        {/* Retirada e Devolução Step-by-Step Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Instruções de Retirada */}
          <div className="bg-[#111827] border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" />
              INSTRUÇÕES DE RETIRADA
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              A loja da <strong className="text-white">LocarX</strong> está localizada próxima ao aeroporto. Um transfer gratuito levará você diretamente ao balcão.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0 text-[10px]">1</span>
                <div>
                  <p className="font-black text-white">Desembarque & Subida</p>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">Dirija-se à praça de alimentação no 1° Andar do Aeroporto de Salvador.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0 text-[10px]">2</span>
                <div>
                  <p className="font-black text-white">Localize o Ponto de Encontro</p>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">Localize a lanchonete <strong className="text-white">Tabuleiro</strong> e saia pela porta de vidro automática em frente.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0 text-[10px]">3</span>
                <div>
                  <p className="font-black text-white">Pegue o Transfer</p>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">Aguarde a van de transfer (procurar pela plotagem do <strong className="text-white">Estacionamento Bambuzal</strong>), ela levará você de graça até a loja LocarX.</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3 mt-4 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-amber-400 uppercase tracking-wider text-[10px]">Requisitos Obrigatórios</p>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Apresente CNH física original válida, documento com foto e cartão de crédito físico nominal com limite para caução (mínimo R$ 800,00).
                </p>
              </div>
            </div>
          </div>

          {/* Instruções de Devolução */}
          <div className="bg-[#111827] border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 shrink-0" />
              INSTRUÇÕES DE DEVOLUÇÃO
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              A devolução é rápida e prática. O transfer levará você diretamente ao setor de embarque do aeroporto.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-black shrink-0 text-[10px]">1</span>
                <div>
                  <p className="font-black text-white">Dirija-se à Loja LocarX</p>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">Retorne o carro na mesma loja onde retirou (próximo ao aeroporto).</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-black shrink-0 text-[10px]">2</span>
                <div>
                  <p className="font-black text-white">Vistoria e Combustível</p>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">A vistoria do veículo será feita na hora. <strong className="text-rose-400">Política: Mesmo nível</strong> - devolva o carro com o tanque no mesmo nível da retirada para evitar taxas.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-black shrink-0 text-[10px]">3</span>
                <div>
                  <p className="font-black text-white">Transfer para o Embarque</p>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">A locadora disponibiliza a van gratuita de transfer para te deixar no setor de embarque do Aeroporto SSA.</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl flex items-start gap-3 mt-4 text-xs">
              <Fuel className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-emerald-400 uppercase tracking-wider text-[10px]">Dica de Abastecimento</p>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Abasteça em um posto próximo ao aeroporto de Salvador antes de entregar o veículo para garantir a devolução correta.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
