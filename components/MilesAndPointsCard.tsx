import React, { useState } from 'react';
import { 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Percent, 
  Flame, 
  CreditCard,
  Fuel,
  PlaneTakeoff,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export interface MilesAndPointsCardProps {
  compact?: boolean;
}

export const MilesAndPointsCard: React.FC<MilesAndPointsCardProps> = ({ compact = false }) => {
  const [activeTab, setActiveTab] = useState<'opcao1' | 'opcao2' | 'comparativo'>('opcao1');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Balanços reais do usuário
  const currentSmiles = 18608;
  const currentKMV = 2115;

  return (
    <div className="bg-[#0f172a]/95 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-2xl transition-all">
      {/* Glow sutil e sofisticado em tom âmbar/dourado das milhas (sem azul/verde berrante) */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08] relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-orange-500/20 shrink-0">
            <Coins className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Fidelidade & Milhas
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                GOL Smiles • KMV Ipiranga
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mt-0.5">
              Carteira de Milhas & Simulação KMV
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-slate-300 hover:text-white border border-white/10 transition-all active:scale-95 cursor-pointer"
          >
            <span>{isExpanded ? 'Recolher Detalhes' : 'Ver Simulação Completa'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 3 Cartões de Saldo no Topo (Tipografia Limpa, Moderna, Sem Máquina de Escrever) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-5 relative z-10">
        {/* Smiles Atual */}
        <div className="bg-[#131b2e] border border-white/[0.08] hover:border-orange-500/30 rounded-2xl p-4 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <PlaneTakeoff className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Smiles GOL Atual
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 pl-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
              {currentSmiles.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs font-bold text-orange-400">milhas</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Saldo imediato na sua conta Smiles</p>
        </div>

        {/* KMV Ipiranga Atual */}
        <div className="bg-[#131b2e] border border-white/[0.08] hover:border-amber-500/30 rounded-2xl p-4 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Fuel className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              KMV Ipiranga Disponível
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 pl-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
              {currentKMV.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs font-bold text-amber-400">pontos</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Prontos para converter em milhas GOL</p>
        </div>

        {/* Potencial Máximo Total */}
        <div className="bg-gradient-to-br from-[#18233c] to-[#131b2e] border border-amber-500/30 hover:border-amber-400/50 rounded-2xl p-4 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              Potencial Máximo Acumulado
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 pl-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-200 tracking-tight tabular-nums">
              {(currentSmiles + 11000).toLocaleString('pt-BR')}
            </span>
            <span className="text-xs font-bold text-amber-300">milhas</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Smiles atual + resgate total KMV</p>
        </div>
      </div>

      {/* Conteúdo Expandido de Simulação Estratégica */}
      {isExpanded && (
        <div className="mt-6 space-y-5 pt-1 relative z-10 animate-in fade-in duration-300">
          
          {/* Navegação de Abas Elegante & Minimalista (Sem azul/verde conflitante) */}
          <div className="bg-black/40 p-1.5 rounded-2xl border border-white/[0.08] flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab('opcao1')}
              className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'opcao1'
                  ? 'bg-white text-slate-950 shadow-md shadow-white/5 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Opção 1: Melhor Custo (R$ 35/k)</span>
            </button>

            <button
              onClick={() => setActiveTab('opcao2')}
              className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'opcao2'
                  ? 'bg-white text-slate-950 shadow-md shadow-white/5 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Opção 2: Resgate Máximo (+1k milhas)</span>
            </button>

            <button
              onClick={() => setActiveTab('comparativo')}
              className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'comparativo'
                  ? 'bg-white text-slate-950 shadow-md shadow-white/5 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Percent className="w-4 h-4 text-slate-400" />
              <span>Tabela Comparativa</span>
            </button>
          </div>

          {/* TAB 1: OPÇÃO 1 (OFERTA RECOMENDADA) */}
          {activeTab === 'opcao1' && (
            <div className="bg-[#131b2e] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      Recomendada • Menor Custo
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Melhor Custo por Milha</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    200 pontos KMV + R$ 35,00 por 1.000 milhas Smiles
                  </h3>
                </div>

                <div className="text-left sm:text-right bg-white/[0.04] sm:bg-transparent p-3 sm:p-0 rounded-xl border border-white/[0.06] sm:border-none">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Custo Médio</span>
                  <span className="text-lg font-extrabold text-amber-300 tabular-nums">
                    R$ 35,00 <span className="text-xs font-medium text-slate-400">/ 1.000 milhas</span>
                  </span>
                </div>
              </div>

              {/* Detalhamento Passo a Passo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lotes Inteiros</span>
                  <p className="text-white text-base font-extrabold mt-1 tabular-nums">
                    2.115 ÷ 200 = <span className="text-amber-300">10 lotes</span>
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">10 resgates completos</span>
                </div>

                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">KMV Utilizados</span>
                  <p className="text-white text-base font-extrabold mt-1 tabular-nums">
                    10 × 200 = <span className="text-amber-300">2.000 pts</span>
                  </p>
                  <span className="text-[11px] text-emerald-400 mt-0.5 block font-semibold">Sobram 115 pontos</span>
                </div>

                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Milhas Geradas</span>
                  <p className="text-white text-base font-extrabold mt-1 tabular-nums">
                    10 × 1.000 = <span className="text-white">10.000 milhas</span>
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">transferidas para Smiles</span>
                </div>

                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Investimento Total</span>
                  <p className="text-white text-base font-extrabold mt-1 tabular-nums">
                    10 × R$ 35 = <span className="text-amber-300">R$ 350,00</span>
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">pago em dinheiro</span>
                </div>
              </div>

              {/* Caixa Consolidada de Saldo Final */}
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-extrabold">
                      Saldo Consolidado Smiles: <span className="text-amber-300 text-base tabular-nums">28.608 milhas</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      18.608 Smiles atuais + 10.000 resgatadas • KMV restante: <strong className="text-white">115 pontos</strong>
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider text-center">
                    Custo Total: R$ 350,00
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPÇÃO 2 (RESGATE MÁXIMO) */}
          {activeTab === 'opcao2' && (
            <div className="bg-[#131b2e] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      Resgate Máximo • Zero Desperdício
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Aproveitando a Sobra de Pontos</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    10 lotes de 200 pts + 1 lote de 100 pts da sobra (+1.000 milhas)
                  </h3>
                </div>

                <div className="text-left sm:text-right bg-white/[0.04] sm:bg-transparent p-3 sm:p-0 rounded-xl border border-white/[0.06] sm:border-none">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Custo Médio</span>
                  <span className="text-lg font-extrabold text-amber-300 tabular-nums">
                    R$ 35,45 <span className="text-xs font-medium text-slate-400">/ 1.000 milhas</span>
                  </span>
                </div>
              </div>

              {/* Detalhamento Passo a Passo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">1º Resgate (Principal)</span>
                  <p className="text-white text-base font-extrabold mt-1 tabular-nums">
                    10.000 milhas <span className="text-amber-300">R$ 350</span>
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">sobram 115 pts</span>
                </div>

                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">2º Resgate (Sobra)</span>
                  <p className="text-white text-base font-extrabold mt-1 tabular-nums">
                    1.000 milhas <span className="text-amber-300">R$ 40</span>
                  </p>
                  <span className="text-[11px] text-emerald-400 mt-0.5 block font-semibold">sobra final: 15 pts</span>
                </div>

                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Milhas Geradas</span>
                  <p className="text-white text-base font-extrabold mt-1 tabular-nums">
                    10k + 1k = <span className="text-white">11.000 milhas</span>
                  </p>
                  <span className="text-[11px] text-amber-300 mt-0.5 block font-semibold">+1.000 milhas extras</span>
                </div>

                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Investimento Total</span>
                  <p className="text-white text-base font-extrabold mt-1 tabular-nums">
                    R$ 350 + R$ 40 = <span className="text-amber-300">R$ 390,00</span>
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">apenas +R$ 40 adicionais</span>
                </div>
              </div>

              {/* Caixa Consolidada de Saldo Final */}
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-extrabold">
                      Saldo Consolidado Smiles: <span className="text-amber-300 text-base tabular-nums">29.608 milhas</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      18.608 Smiles atuais + 11.000 resgatadas • KMV restante: <strong className="text-white">15 pontos</strong>
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="px-4 py-2 rounded-xl bg-white text-slate-950 font-extrabold text-xs uppercase tracking-wider text-center">
                    Custo Total: R$ 390,00
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TABELA COMPARATIVA */}
          {activeTab === 'comparativo' && (
            <div className="bg-[#131b2e] border border-white/[0.08] rounded-2xl overflow-hidden animate-in fade-in duration-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/40 text-slate-400 uppercase tracking-wider font-bold border-b border-white/[0.08] text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Estratégia</th>
                      <th className="py-3.5 px-3 font-bold">Milhas Resgatadas</th>
                      <th className="py-3.5 px-3 font-bold">Saldo Final Smiles</th>
                      <th className="py-3.5 px-3 font-bold">Custo Total</th>
                      <th className="py-3.5 px-3 font-bold">KMV Restantes</th>
                      <th className="py-3.5 px-3 font-bold">Custo Médio / 1k</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                        Apenas lotes de 200 pts
                      </td>
                      <td className="py-4 px-3 text-white font-semibold tabular-nums">10.000 milhas</td>
                      <td className="py-4 px-3 text-amber-300 font-extrabold tabular-nums">28.608 milhas</td>
                      <td className="py-4 px-3 text-white font-semibold tabular-nums">R$ 350,00</td>
                      <td className="py-4 px-3 text-slate-400 tabular-nums">115 pts</td>
                      <td className="py-4 px-3 text-emerald-400 font-bold tabular-nums">R$ 35,00</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors bg-white/[0.02]">
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white inline-block" />
                        Resgate máximo (200 + 100 pts)
                      </td>
                      <td className="py-4 px-3 text-white font-semibold tabular-nums">11.000 milhas</td>
                      <td className="py-4 px-3 text-amber-200 font-extrabold tabular-nums">29.608 milhas</td>
                      <td className="py-4 px-3 text-white font-semibold tabular-nums">R$ 390,00</td>
                      <td className="py-4 px-3 text-slate-400 tabular-nums">15 pts</td>
                      <td className="py-4 px-3 text-emerald-400 font-bold tabular-nums">R$ 35,45</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Rodapé explicativo */}
              <div className="p-4 bg-black/30 border-t border-white/[0.08] text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>💡 <strong>Dica Estratégica:</strong> Por apenas +R$ 40,00 você garante 1.000 milhas a mais, totalizando 29.608 milhas Smiles prontas para emitir bilhetes da GOL no seu roteiro.</span>
              </div>
            </div>
          )}

          {/* Links e Ações Rápidas de Acesso */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>O resgate é realizado diretamente no portal ou app KMV do Posto Ipiranga.</span>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="https://www.kmdevantagens.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-amber-300 border border-amber-500/20 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>Acessar KMV Ipiranga</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.smiles.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-orange-300 border border-orange-500/20 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>Acessar Smiles GOL</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilesAndPointsCard;
