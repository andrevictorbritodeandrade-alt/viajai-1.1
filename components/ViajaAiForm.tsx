
import React, { useState } from 'react';
import { 
  Plane, Bus, Car, Calendar, MapPin, CreditCard, 
  User, Palmtree, Utensils, Coffee, 
  Moon, CheckCircle2, Info, Navigation, Sparkles, Map, ChevronLeft, Loader2
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const OptionCard = ({ type, name, id, value, checked, onChange, label, icon: Icon, children }: any) => (
  <label htmlFor={id} className={`
    relative flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300
    ${checked 
      ? 'bg-blue-50/50 border-blue-500 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.3)] transform scale-[1.02]' 
      : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50 hover:shadow-md'}
  `}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        {type === 'radio' ? (
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${checked ? 'border-blue-600' : 'border-slate-300'}`}>
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${checked ? 'bg-blue-600 scale-100' : 'bg-transparent scale-0'}`} />
          </div>
        ) : (
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
            <CheckCircle2 size={16} className={`text-white transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        )}
        <span className={`font-bold text-sm transition-colors ${checked ? 'text-blue-900' : 'text-slate-600'}`}>
          {label}
        </span>
      </div>
      {Icon && <Icon size={24} className={`transition-colors ${checked ? 'text-blue-600' : 'text-slate-300'}`} />}
    </div>
    {children && (
      <div className="pl-8 text-xs text-slate-500 leading-relaxed">
        {children}
      </div>
    )}
    <input type={type} name={name} id={id} value={value} checked={checked} onChange={onChange} className="sr-only" />
  </label>
);

interface ViajaAiFormProps {
  onBack: () => void;
}

export default function ViajaAiForm({ onBack }: ViajaAiFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    // 1. Identificação
    nome_cliente: '',
    whatsapp: '',
    companhia: 'casal',
    detalhes_companhia: '', 
    
    // 2. Perfil e Destino
    tipo_destino: 'definido',
    nome_destino: '',
    estilo_viagem: {
      praia: false, cultura: false, gastronomia: false, 
      ecoturismo: false, aventura: false, relaxamento: false, 
      compras: false, vida_noturna: false,
    },
    
    // 3. Datas
    tipo_data: 'especifica', 
    mes_viagem: '', 
    periodo_viagem: '', 
    data_ida: '',
    data_volta: '',
    datas_flexiveis: false,
    
    // 4. Transporte Principal
    transporte_principal: 'aviao', 
    aeroporto_saida: '',
    bagagem: 'mochila_10kg', 
    
    // 6. Orçamento e Pagamento
    orcamento_diario_br: '',
    orcamento_diario_intl: '',
    forma_pagamento: {
      cartao_credito: false, pix: false, boleto_koin: false,
    },
    ciente_termos: false,
    obs_finais: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const [group, key] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [group]: { ...prev[group], [key]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'leads'), payload);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setIsSubmitted(true);
        setLoading(false);
      }, 300);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'leads');
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Plane className="w-12 h-12 text-orange-500 animate-bounce" />
          </div>
          <h2 className="text-3xl font-black text-blue-900 tracking-tight">Tudo Certo!</h2>
          <p className="text-slate-600 text-lg">
            Recebemos seu perfil de viajante. Nossa IA e nossa equipe já estão analisando as melhores opções para você.
          </p>
          <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl text-sm font-medium border border-blue-100">
            Em breve enviaremos seu Web App exclusivo com o roteiro e os links de compra!
          </div>
          <button 
            onClick={onBack}
            className="mt-8 text-slate-400 hover:text-orange-500 font-bold transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 selection:bg-orange-200">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors mb-4 group"
        >
          <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
            <ChevronLeft size={24} />
          </div>
          VOLTAR
        </button>

        {/* Nova Identidade Visual: VIAJAÍ */}
        <div className="text-center pt-8 pb-4">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
            <Map className="text-orange-500 w-8 h-8" />
          </div>
          <h1 className="text-6xl md:text-8xl italic -skew-x-6 tracking-tighter mb-4" 
              style={{ textShadow: '3px 6px 0px rgba(0,0,0,0.08)' }}>
            <span className="text-blue-950 font-black">VIAJ</span>
            <span className="text-orange-500 font-black">AÍ</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-semibold tracking-wide uppercase letter-spacing-2">
            Eu planejo. Você clica e vai.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. Identificação */}
          <section className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-sm border border-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
            
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="bg-blue-100 p-3 rounded-xl"><User className="text-blue-600" size={24} /></div>
              <h2 className="text-2xl font-black text-slate-800">1. Sobre Vocês</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Nome do Responsável</label>
                <input type="text" name="nome_cliente" required value={formData.nome_cliente} onChange={handleInputChange}
                  className="w-full rounded-2xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 bg-slate-50 font-medium" placeholder="Como gosta de ser chamado?" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">WhatsApp</label>
                <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange}
                  className="w-full rounded-2xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 bg-slate-50 font-medium" placeholder="(11) 90000-0000" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Quem vai na viagem?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <OptionCard type="radio" name="companhia" id="comp-sozinho" value="sozinho" checked={formData.companhia === 'sozinho'} onChange={handleInputChange} label="Sozinho(a)" icon={User} />
                <OptionCard type="radio" name="companhia" id="comp-casal" value="casal" checked={formData.companhia === 'casal'} onChange={handleInputChange} label="Casal" />
                <OptionCard type="radio" name="companhia" id="comp-familia" value="familia" checked={formData.companhia === 'familia'} onChange={handleInputChange} label="Família" />
                <OptionCard type="radio" name="companhia" id="comp-amigos" value="amigos" checked={formData.companhia === 'amigos'} onChange={handleInputChange} label="Amigos" />
              </div>
              
              {formData.companhia === 'familia' && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-4">
                  <input type="text" name="detalhes_companhia" required value={formData.detalhes_companhia} onChange={handleInputChange}
                    className="w-full rounded-2xl border-orange-200 bg-orange-50/50 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-4 font-medium text-orange-900 placeholder:text-orange-400" placeholder="Ex: Eu, cônjuge e 2 filhos (8 e 12 anos)" />
                </div>
              )}
            </div>
          </section>

          {/* 2. Destino e Estilo */}
          <section className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-sm border border-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>

            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="bg-orange-100 p-3 rounded-xl"><MapPin className="text-orange-600" size={24} /></div>
              <h2 className="text-2xl font-black text-slate-800">2. O Destino & Perfil</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <OptionCard type="radio" name="tipo_destino" id="dest-def" value="definido" checked={formData.tipo_destino === 'definido'} onChange={handleInputChange} label="Já tenho o destino certo" children="Ex: Beto Carrero, Paris, Gramado" />
                <OptionCard type="radio" name="tipo_destino" id="dest-sug" value="sugestao" checked={formData.tipo_destino === 'sugestao'} onChange={handleInputChange} label="Quero sugestões (Consultoria)" children="A IA vai sugerir baseada no seu perfil" />
              </div>
              
              <div className="pt-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{formData.tipo_destino === 'definido' ? 'Qual é o destino?' : 'Que tipo de lugar você imagina?'}</label>
                <input type="text" name="nome_destino" required value={formData.nome_destino} onChange={handleInputChange}
                  className="w-full mt-2 rounded-2xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 bg-slate-50 font-medium text-lg" 
                  placeholder={formData.tipo_destino === 'definido' ? "Ex: Beto Carrero, SC" : "Ex: Quero um lugar frio com montanhas"} />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-[1.5rem] shadow-xl space-y-6 text-white relative overflow-hidden">
               <div className="absolute -top-10 -right-10 opacity-10">
                 <Sparkles className="w-40 h-40" />
               </div>
              <div className="relative z-10">
                <label className="text-base font-bold text-orange-400 block uppercase tracking-wide mb-4">O que não pode faltar? (Para a nossa IA)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   <OptionCard type="checkbox" name="estilo_viagem.praia" id="est-praia" checked={formData.estilo_viagem.praia} onChange={handleInputChange} label="Praia / Sol" icon={Palmtree} />
                   <OptionCard type="checkbox" name="estilo_viagem.cultura" id="est-cult" checked={formData.estilo_viagem.cultura} onChange={handleInputChange} label="Cultura / Museus" icon={Map} />
                   <OptionCard type="checkbox" name="estilo_viagem.gastronomia" id="est-gastro" checked={formData.estilo_viagem.gastronomia} onChange={handleInputChange} label="Gastronomia" icon={Utensils} />
                   <OptionCard type="checkbox" name="estilo_viagem.ecoturismo" id="est-eco" checked={formData.estilo_viagem.ecoturismo} onChange={handleInputChange} label="Natureza / Eco" icon={MapPin} />
                   <OptionCard type="checkbox" name="estilo_viagem.relaxamento" id="est-rel" checked={formData.estilo_viagem.relaxamento} onChange={handleInputChange} label="Relax total" icon={Coffee} />
                   <OptionCard type="checkbox" name="estilo_viagem.vida_noturna" id="est-noite" checked={formData.estilo_viagem.vida_noturna} onChange={handleInputChange} label="Vida Noturna" icon={Moon} />
                </div>
              </div>
            </div>
          </section>

          {/* 3. Datas */}
          <section className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-sm border border-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>

            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="bg-blue-100 p-3 rounded-xl"><Calendar className="text-blue-600" size={24} /></div>
              <h2 className="text-2xl font-black text-slate-800">3. Quando vamos?</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <OptionCard type="radio" name="tipo_data" id="data-especifica" value="especifica" checked={formData.tipo_data === 'especifica'} onChange={handleInputChange} label="Tenho datas específicas" children="Dia de ida e volta definidos" />
              <OptionCard type="radio" name="tipo_data" id="data-flexivel" value="flexivel" checked={formData.tipo_data === 'flexivel'} onChange={handleInputChange} label="Busco o melhor preço do mês" children="Escolha apenas o mês/período" />
            </div>

            {formData.tipo_data === 'especifica' ? (
              <div className="space-y-6 pt-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Data de Ida</label>
                    <input type="date" name="data_ida" value={formData.data_ida} onChange={handleInputChange}
                      className="w-full rounded-2xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 bg-slate-50 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Data de Volta</label>
                    <input type="date" name="data_volta" value={formData.data_volta} onChange={handleInputChange}
                      className="w-full rounded-2xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 bg-slate-50 font-medium" />
                  </div>
                </div>
                <OptionCard type="checkbox" name="datas_flexiveis" id="datas_flexiveis" checked={formData.datas_flexiveis} onChange={handleInputChange} label="Tenho flexibilidade (+/- 3 dias)" children="Isso ajuda muito a encontrar passagens mais baratas." />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 animate-in fade-in">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Mês da Viagem</label>
                  <select name="mes_viagem" value={formData.mes_viagem} onChange={handleInputChange} className="w-full rounded-2xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 bg-slate-50 font-medium">
                    <option value="">Selecione...</option>
                    <option value="janeiro">Janeiro</option>
                    <option value="fevereiro">Fevereiro</option>
                    <option value="marco">Março</option>
                    <option value="julho">Julho (Alta temporada)</option>
                    <option value="outubro">Outubro</option>
                    <option value="dezembro">Dezembro</option>
                    <option value="outro">Outros meses...</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Período Ideal</label>
                  <select name="periodo_viagem" value={formData.periodo_viagem} onChange={handleInputChange} className="w-full rounded-2xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 bg-slate-50 font-medium">
                    <option value="">Selecione...</option>
                    <option value="qualquer">Qualquer semana (Foco no preço)</option>
                    <option value="primeira_quinzena">1ª Quinzena</option>
                    <option value="segunda_quinzena">2ª Quinzena</option>
                    <option value="feriado">Apenas no Feriado</option>
                  </select>
                </div>
              </div>
            )}
          </section>

          {/* 4. Transporte */}
          <section className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-sm border border-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>

            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="bg-orange-100 p-3 rounded-xl"><Navigation className="text-orange-600" size={24} /></div>
              <h2 className="text-2xl font-black text-slate-800">4. Como vamos chegar?</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <OptionCard type="radio" name="transporte_principal" id="tp-aviao" value="aviao" checked={formData.transporte_principal === 'aviao'} onChange={handleInputChange} label="Avião" icon={Plane} />
              <OptionCard type="radio" name="transporte_principal" id="tp-onibus" value="onibus" checked={formData.transporte_principal === 'onibus'} onChange={handleInputChange} label="Ônibus" icon={Bus} />
              <OptionCard type="radio" name="transporte_principal" id="tp-carro" value="carro_proprio" checked={formData.transporte_principal === 'carro_proprio'} onChange={handleInputChange} label="Carro Próprio" icon={Car} />
            </div>

            {formData.transporte_principal === 'aviao' && (
              <div className="space-y-6 bg-blue-50/50 p-6 rounded-3xl border border-blue-100 animate-in fade-in slide-in-from-top-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Aeroporto de Saída (Preferência)</label>
                  <input type="text" name="aeroporto_saida" value={formData.aeroporto_saida} onChange={handleInputChange}
                    className="w-full rounded-2xl border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 bg-white font-medium" placeholder="Ex: Galeão (GIG) ou Guarulhos (GRU)" />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Bagagem (Isso altera drasticamente o preço do voo)</label>
                  <div className="grid grid-cols-1 gap-4">
                    <OptionCard type="radio" name="bagagem" id="bag0" value="apenas_mochila" checked={formData.bagagem === 'apenas_mochila'} onChange={handleInputChange} label="Apenas Mochila (Item Pessoal)" children="Tarifa mais barata. A mochila deve caber embaixo do assento da frente." />
                    <OptionCard type="radio" name="bagagem" id="bag1" value="mochila_10kg" checked={formData.bagagem === 'mochila_10kg'} onChange={handleInputChange} label="Mochila + Mala de Mão (10kg)" children="Incluso na maioria das tarifas médias. A mala vai no bagageiro acima." />
                    <OptionCard type="radio" name="bagagem" id="bag2" value="mochila_10kg_23kg" checked={formData.bagagem === 'mochila_10kg_23kg'} onChange={handleInputChange} label="Mochila + Mala (10kg) + Mala Despachada (23kg)" children="Gera custo extra. Ideal para viagens mais longas, inverno frio ou muitas compras." />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 6. Orçamento e Pagamento */}
          <section className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-sm border border-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>

            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="bg-blue-100 p-3 rounded-xl"><CreditCard className="text-blue-600" size={24} /></div>
              <h2 className="text-2xl font-black text-slate-800">5. Orçamento e Compra</h2>
            </div>

            <div className="space-y-6">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Gasto Diário (Alimentação, passeios, etc)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative">
                  <span className="absolute left-5 top-4 text-slate-400 font-bold text-lg">R$</span>
                  <input type="number" name="orcamento_diario_br" value={formData.orcamento_diario_br} onChange={handleInputChange}
                    className="w-full rounded-2xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 pl-14 bg-slate-50 font-medium text-lg" placeholder="Viagens Nacionais" />
                </div>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-slate-400 font-bold text-lg">U$/€</span>
                  <input type="number" name="orcamento_diario_intl" value={formData.orcamento_diario_intl} onChange={handleInputChange}
                    className="w-full rounded-2xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 pl-16 bg-slate-50 font-medium text-lg" placeholder="Internacionais" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Como você prefere finalizar a compra?</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <OptionCard type="checkbox" name="forma_pagamento.cartao_credito" id="pag-credito" checked={formData.forma_pagamento.cartao_credito} onChange={handleInputChange} label="Cartão (Parcelado)" />
                <OptionCard type="checkbox" name="forma_pagamento.pix" id="pag-pix" checked={formData.forma_pagamento.pix} onChange={handleInputChange} label="PIX (Descontos)" />
                <OptionCard type="checkbox" name="forma_pagamento.boleto_koin" id="pag-boleto" checked={formData.forma_pagamento.boleto_koin} onChange={handleInputChange} label="Boleto (KOIN)" />
              </div>
            </div>

            <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-3xl flex gap-4 mt-8">
              <Info className="text-orange-600 shrink-0 w-8 h-8" />
              <div className="space-y-3 text-sm text-orange-900 leading-relaxed">
                <strong className="block font-black text-lg text-orange-700">⚠️ Avisos Importantes:</strong>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="font-bold">Taxas de Embarque:</strong> No cartão de crédito, a taxa de embarque geralmente é cobrada 100% na primeira parcela.</li>
                  <li><strong className="font-bold">Sites Internacionais:</strong> Promoções específicas de companhias estrangeiras podem não permitir parcelamento.</li>
                </ul>
              </div>
            </div>

            <OptionCard type="checkbox" name="ciente_termos" id="ciente_termos" checked={formData.ciente_termos} onChange={handleInputChange} label="Estou ciente das regras de taxas de embarque e parcelamentos." />
          </section>

          {/* Botão Final */}
          <div className="pt-6">
            <button type="submit" disabled={!formData.ciente_termos || loading} className={`
              w-full p-6 rounded-[2rem] text-xl font-black text-white shadow-2xl transition-all duration-300 transform flex items-center justify-center gap-4
              ${formData.ciente_termos && !loading
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/40 hover:-translate-y-2 hover:shadow-orange-500/60' 
                : 'bg-slate-300 cursor-not-allowed'}
            `}>
              {loading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin" />
                  ENVIANDO...
                </>
              ) : (
                <>
                  CRIAR MEU ROTEIRO VIAJAÍ 🚀
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
