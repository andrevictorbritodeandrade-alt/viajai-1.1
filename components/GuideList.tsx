
import React, { useState, useEffect } from 'react';
import { 
  Map as MapIcon, 
  Calendar, 
  Utensils, 
  Camera, 
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Bus,
  RefreshCw,
  ShieldCheck,
  Zap,
  DollarSign,
  Shirt,
  CloudRain,
  Wind,
  Droplets,
  Plane,
  AlertTriangle,
  Navigation,
  Plus,
  Sparkles,
  Waves,
  ThermometerSun,
  ExternalLink,
  ClipboardList,
  Phone,
  Globe,
  WifiOff,
  Headphones,
  CreditCard,
  Search,
  Lock,
  Ticket,
  Lightbulb,
  Siren,
  Train,
  ShoppingBag
} from 'lucide-react';
import { Map, Marker } from 'pigeon-maps';
import CategoryHeader from './CategoryHeader';
import { loadDataFromCloud } from '../services/firebase';

export const GUIDE_STORAGE_KEY = 'viajai_guides_v8_woodmead_logistics';

// --- INTERFACES ---

interface PlanDetails {
  buyAt?: string;
  price?: string;
  tips?: string;
  criticalTime?: string;
  locationTip?: string;
  transportMethod?: string;
}

interface ActivityPlan {
  type: 'plan_a' | 'plan_b' | 'food' | 'security' | 'info' | 'flight' | 'ticket' | 'transport' | 'shopping';
  text: string;
  label?: string;
  time?: string;
  details?: PlanDetails;
}

interface DayWeather {
  icon: string;
  temp: string;
  min: string;
  feels: string;
  rain: string;
  wind: string;
  sea?: string;
}

interface Possibility {
  id: string;
  title: string;
  description: string;
  estimatedPrice: string;
  contact: string;
  location: [number, number];
  tags: string[];
}

interface DailyPlan {
  day: number;
  weekday: string;
  date: string;
  title: string;
  weather: DayWeather;
  plans: ActivityPlan[];
  map: {
    center: [number, number];
    zoom: number;
    markers: [number, number][];
  };
  estimate: string;
  estimateLabel: string;
  look: string;
  isDeparture?: boolean;
  isArrival?: boolean;
  isDone?: boolean;
}

interface GuideData {
  CPT: DailyPlan[];
  JNB: DailyPlan[];
  possibilities: {
    CPT: Possibility[];
    JNB: Possibility[];
  };
}

// --- DADOS PADRÃO (LOGÍSTICA MILITAR) ---

const DEFAULT_GUIDE: GuideData = {
  CPT: [
    {
      day: 30,
      weekday: 'SEXTA',
      date: 'JAN',
      isDone: true,
      title: 'Península do Cabo (Realizado)',
      weather: { icon: '☀️', temp: 'Done', min: '-', feels: '-', rain: '-', wind: '-', sea: '-' },
      plans: [
        { type: 'info', text: '✅ Cabo da Boa Esperança, Cape Point, Boulders Beach, Chapman\'s Peak.' },
        { type: 'info', text: '✅ Clifton Bay e Centro.' }
      ],
      map: { center: [-34.3572, 18.4975], zoom: 10, markers: [] },
      estimate: 'Ok',
      estimateLabel: 'Pago',
      look: 'Concluído'
    },
    {
      day: 31,
      weekday: 'SÁBADO',
      date: 'JAN',
      isDone: true,
      title: 'Waterfront & Table Mountain (Base)',
      weather: { icon: '☁️', temp: 'Done', min: '-', feels: '-', rain: '-', wind: '-', sea: '-' },
      plans: [
        { type: 'info', text: '✅ V&A Waterfront, Estádio, Base da Table Mountain (Sem subida).' },
        { type: 'info', text: '✅ Access Park (Compras).' }
      ],
      map: { center: [-33.9036, 18.4205], zoom: 12, markers: [] },
      estimate: 'Ok',
      estimateLabel: 'Pago',
      look: 'Concluído'
    }
  ],
  JNB: [
    {
      day: 2,
      weekday: 'SEGUNDA',
      date: '02/FEV',
      title: 'Woodmead & Relax (Realizado)',
      isDone: true,
      weather: { icon: '🛍️', temp: '26°', min: '16°', feels: '27°', rain: '0%', wind: '10km/h' },
      plans: [
        { type: 'info', text: '✅ Manhã: Woodmead Retail Park (Outlets).' },
        { type: 'info', text: 'Tarde: Descanso na acomodação.' },
        { type: 'food', text: 'Noite: Jantar delivery (segurança/economia).' }
      ],
      map: { center: [-26.0563, 28.0964], zoom: 13, markers: [[-26.0563, 28.0964]] },
      estimate: 'R$ 100',
      estimateLabel: 'Uber + Comida',
      look: 'Casual.'
    },
    {
      day: 3,
      weekday: 'TERÇA',
      date: '03/FEV',
      title: 'Gautrain, Woodmead & Logística',
      weather: { icon: '💳', temp: '28°', min: '17°', feels: '30°', rain: '10%', wind: '12km/h' },
      plans: [
        { 
          type: 'transport', 
          time: '09:00', 
          label: 'IDA', 
          text: 'Bus na Mesquita -> Trem Marlboro -> Rosebank.',
          details: {
            transportMethod: 'Gautrain Bus + Trem.',
            criticalTime: 'Bus passa a cada 30min (09:00, 09:30).',
            tips: 'Use o MESMO cartão no ônibus e no trem para pagar a tarifa integrada barata.',
            locationTip: 'Ponto na 1st Road (Mesquita).'
          }
        },
        { 
          type: 'plan_a', 
          time: '10:00', 
          label: 'ROSEBANK', 
          text: 'Art & Craft Market (Artesanato seguro e coberto).',
          details: {
            tips: 'Melhor lugar para souvenirs. Almoço barato na praça de alimentação do mall.'
          }
        },
        { 
          type: 'transport', 
          time: '14:30', 
          label: 'TRANSFER', 
          text: 'Uber de Rosebank direto para Woodmead.',
          details: {
            price: '~R 100-120 (Uber)',
            tips: 'Não compensa voltar de trem para Marlboro agora. Vá direto de Uber para ganhar tempo.'
          }
        },
        { 
          type: 'shopping', 
          time: '15:00', 
          label: 'WOODMEAD', 
          text: 'Woodmead Retail Park (Outlets & Ingressos).',
          details: {
            locationTip: 'Vá ao CHECKERS HYPER.',
            buyAt: 'Balcão Computicket no Checkers.',
            tips: 'Compre aqui os ingressos físicos pro jogo do Sundowns! Aproveite para comprar snacks pro Safari.'
          }
        },
        { 
          type: 'transport', 
          time: '17:30', 
          label: 'VOLTA TÁTICA', 
          text: 'Logística: Woodmead -> Mesquita -> Uber Final.',
          details: {
            transportMethod: '1. Uber Woodmead -> Estação Marlboro (~R40). 2. Gautrain Bus -> Mesquita (R4). 3. Uber -> Casa.',
            criticalTime: 'Chegue em Marlboro antes das 18:30 para pegar o último ônibus.',
            tips: 'Ao descer na Mesquita, peça um Uber para a porta de casa (3 Meadow Lane) por segurança, mesmo sendo perto.'
          }
        }
      ],
      map: { center: [-26.0563, 28.0964], zoom: 12, markers: [[-26.1466, 28.0418], [-26.0563, 28.0964]] },
      estimate: 'R$ 150',
      estimateLabel: 'Uber + Trem + Compras',
      look: 'Confortável.'
    },
    {
      day: 4,
      weekday: 'QUARTA',
      date: '04/FEV',
      title: 'Safari & Operação Jogo',
      weather: { icon: '⚽', temp: '31°', min: '19°', feels: '33°', rain: '10%', wind: '10km/h' },
      plans: [
        { 
          type: 'plan_a', 
          time: '06:00', 
          label: 'PILANESBERG', 
          text: 'Safari dia todo. Sair de lá 15:00 sem falta!',
          details: {
            criticalTime: 'Chegar em casa 15:30 para banho rápido.',
            tips: 'Levem água e snacks.'
          }
        },
        { 
          type: 'transport', 
          time: '16:30', 
          label: 'IDA (CRONOMETRADA)', 
          text: 'Bus Mesquita -> Trem Marlboro -> Hatfield.',
          details: {
            criticalTime: 'Pegue o Bus das 16:30 (Rota S3). Trem das 17:11 em Marlboro.',
            transportMethod: 'Bus + Trem (Chega em Hatfield 17:43).',
            tips: 'De Hatfield, pegue Uber curto (2km) pro estádio Loftus (~R60).'
          }
        },
        { 
          type: 'ticket', 
          time: '19:00', 
          label: 'MAMELODI', 
          text: 'Jogo: Sundowns vs Richards Bay.',
          details: {
            locationTip: 'Loftus Versfeld Stadium, Pretória.',
            tips: 'Se não comprou ontem no Woodmead, tente a bilheteria, mas chegue cedo.'
          }
        },
        { 
          type: 'security', 
          time: '21:15', 
          label: 'VOLTA (UBER)', 
          text: 'ALERTA: Trem fecha 20:30. Volta só de Uber.',
          details: {
            criticalTime: 'NÃO CONTE COM TREM NA VOLTA.',
            tips: 'Uber direto do estádio para casa (3 Meadow Lane). Custo estimado: R500-R700. Segurança da Marcelly em 1º lugar.',
            price: '~R 258 (Ida Casal) + R 600 (Volta Uber).'
          }
        }
      ],
      map: { center: [-25.7518, 28.2230], zoom: 9, markers: [[-25.2494, 27.0943], [-25.7518, 28.2230]] },
      estimate: 'R$ 900+',
      estimateLabel: 'Safari + Logística Jogo',
      look: 'Safari (Dia) / Amarelo (Noite).'
    },
    {
      day: 5,
      weekday: 'QUINTA',
      date: '05/FEV',
      isDeparture: true,
      title: 'Rota Histórica & Aeroporto',
      weather: { icon: '🇿🇦', temp: '25°', min: '16°', feels: '26°', rain: '40%', wind: '15km/h' },
      plans: [
        { 
          type: 'plan_a', 
          time: '09:00', 
          label: 'FNB STADIUM', 
          text: 'Tour do Estádio da Copa. (Entrance 4).',
          details: {
            buyAt: 'Recepção (Portão 4).',
            criticalTime: 'Chegue 08:45.'
          }
        },
        { 
          type: 'plan_b', 
          time: '10:30', 
          label: 'SOWETO', 
          text: 'Mandela House na Vilakazi Street.',
          details: {
            tips: 'Almoço rápido na rua Vilakazi (Sakhumzi ou similar). É turístico e seguro.'
          }
        },
        { 
          type: 'plan_a', 
          time: '13:15', 
          label: 'MINA DE OURO', 
          text: 'Gold Reef City (Heritage Tour).',
          details: {
            criticalTime: 'Última descida na mina costuma ser 13:30/14:00. Não atrase.'
          }
        },
        { 
          type: 'security', 
          time: '15:00', 
          label: 'MUSEU', 
          text: 'Museu do Apartheid (Ao lado do Gold Reef).',
          details: {
            tips: 'Emocionante e essencial. Fechamento às 17h.'
          }
        },
        { 
          type: 'flight', 
          time: '21:00', 
          text: 'Uber para OR Tambo. Voo sai 00:45.',
          details: {
            tips: 'Esteja em casa às 17h para banho e malas.'
          }
        }
      ],
      map: { center: [-26.2366, 28.0069], zoom: 12, markers: [[-26.2366, 28.0069], [-26.2384, 27.9123]] },
      estimate: 'R$ 450',
      estimateLabel: 'Tours + Uber + Ingressos',
      look: 'Confortável.'
    }
  ],
  possibilities: {
    CPT: [],
    JNB: [
      {
        id: 'montecasino',
        title: 'Montecasino (Plano Z)',
        description: 'Se a Marcelly estiver insegura, vão para cá. É uma bolha de primeiro mundo. Tem parque de aves (Bird Gardens) lindo.',
        estimatedPrice: 'Entrada Grátis',
        contact: 'montecasino.co.za',
        location: [-26.0246, 28.0123],
        tags: ['Segurança Total', 'Almoço']
      }
    ]
  }
};

const PlanItem: React.FC<{ plan: ActivityPlan }> = ({ plan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasDetails = !!plan.details;

  const getStyle = () => {
    switch(plan.type) {
      case 'plan_a': return 'bg-purple-50 text-purple-900 border-purple-200';
      case 'plan_b': return 'bg-teal-50 text-teal-900 border-teal-200';
      case 'security': return 'bg-red-50 text-red-900 border-red-200 font-bold';
      case 'food': return 'bg-orange-50 text-orange-900 border-orange-200';
      case 'ticket': return 'bg-yellow-50 text-yellow-900 border-yellow-200';
      case 'shopping': return 'bg-pink-50 text-pink-900 border-pink-200';
      case 'transport': return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'flight': return 'bg-slate-800 text-white border-slate-900';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getIcon = () => {
    switch(plan.type) {
      case 'plan_a': return <Zap className="w-4 h-4 shrink-0 text-purple-600" />;
      case 'plan_b': return <RefreshCw className="w-4 h-4 shrink-0 text-teal-600" />;
      case 'security': return <Lock className="w-4 h-4 shrink-0 text-red-600" />;
      case 'food': return <Utensils className="w-4 h-4 shrink-0 text-orange-600" />;
      case 'ticket': return <Ticket className="w-4 h-4 shrink-0 text-yellow-600" />;
      case 'shopping': return <ShoppingBag className="w-4 h-4 shrink-0 text-pink-600" />;
      case 'transport': return <Train className="w-4 h-4 shrink-0 text-blue-600" />;
      case 'flight': return <Plane className="w-4 h-4 shrink-0 text-white" />;
      default: return <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5 ml-1"></div>;
    }
  };

  return (
    <div 
      className={`rounded-xl border flex flex-col shadow-sm mb-2 transition-all ${getStyle()} ${hasDetails ? 'cursor-pointer hover:shadow-md active:scale-[0.99]' : ''}`}
      onClick={() => hasDetails && setIsOpen(!isOpen)}
    >
      <div className="p-3.5 flex gap-3 items-start">
        <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
           {getIcon()}
           {plan.time && <span className={`text-[9px] font-black px-1 rounded ${plan.type === 'flight' ? 'bg-slate-700 text-white' : 'bg-white/50'}`}>{plan.time}</span>}
        </div>
        <div className="text-xs leading-relaxed flex-1">
          {plan.label && <span className="uppercase tracking-bold font-black mr-1.5 opacity-80">{plan.label}:</span>}
          {plan.text}
        </div>
        {hasDetails && (
          <div className="shrink-0 mt-0.5 opacity-50">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        )}
      </div>

      {/* DETALHES EXPANSÍVEIS */}
      {isOpen && plan.details && (
        <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2">
          <div className="h-px w-full bg-black/5 mb-3"></div>
          <div className="space-y-2.5">
            {plan.details.transportMethod && (
              <div className="flex gap-2 items-start text-[11px]">
                <Bus className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-slate-700"><strong>Rota:</strong> {plan.details.transportMethod}</span>
              </div>
            )}
            {plan.details.buyAt && (
              <div className="flex gap-2 items-start text-[11px]">
                <Ticket className="w-3.5 h-3.5 text-yellow-600 shrink-0 mt-0.5" />
                <span className="text-slate-700"><strong>Comprar:</strong> {plan.details.buyAt}</span>
              </div>
            )}
            {plan.details.locationTip && (
              <div className="flex gap-2 items-start text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-slate-700"><strong>Local:</strong> {plan.details.locationTip}</span>
              </div>
            )}
            {plan.details.criticalTime && (
              <div className="flex gap-2 items-start text-[11px] bg-red-100/50 p-2 rounded-lg border border-red-100">
                <Siren className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span className="text-red-800 font-bold"><strong>Horário Crítico:</strong> {plan.details.criticalTime}</span>
              </div>
            )}
            {plan.details.price && (
              <div className="flex gap-2 items-start text-[11px]">
                <DollarSign className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-slate-700"><strong>Custo Estimado:</strong> {plan.details.price}</span>
              </div>
            )}
            {plan.details.tips && (
              <div className="flex gap-2 items-start text-[11px]">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 italic">{plan.details.tips}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PossibilityCard: React.FC<{ item: Possibility }> = ({ item }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${item.location[0]},${item.location[1]}`;

  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-4 mb-3 relative overflow-hidden group hover:border-sa-green transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-black text-slate-800 uppercase leading-tight">{item.title}</h4>
        <a 
          href={googleMapsUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-slate-100 text-slate-500 p-1.5 rounded-lg hover:bg-sa-green hover:text-white transition-colors"
        >
          <MapIcon className="w-4 h-4" />
        </a>
      </div>
      
      <p className="text-xs text-slate-600 leading-relaxed mb-3">{item.description}</p>
      
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex justify-between items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500">{item.estimatedPrice}</span>
      </div>
    </div>
  );
};

const DayCard: React.FC<{ plan: DailyPlan; city: string }> = ({ plan, city }) => {
  return (
    <div className={`flex gap-4 mb-8 ${plan.isDone ? 'opacity-60 grayscale-[0.8]' : ''}`}>
      {/* Coluna Lateral */}
      <div className="flex flex-col items-center shrink-0 w-16">
        <div className={`w-14 py-2 rounded-2xl flex flex-col items-center shadow-md mb-2 ${plan.isDeparture ? 'bg-sa-gold text-white' : plan.isArrival ? 'bg-sa-blue text-white' : 'bg-white text-slate-800 border border-slate-200'}`}>
          <span className="text-xl font-black leading-none">{plan.day}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">{plan.date.split('/')[0]}</span>
        </div>
        
        <div className="bg-white border border-slate-100 rounded-2xl p-2 w-14 flex flex-col items-center gap-1 shadow-sm text-slate-400">
           <span className="text-lg leading-none mb-1">{plan.weather.icon}</span>
           <span className="text-xs font-black text-slate-800">{plan.weather.temp}</span>
        </div>
      </div>

      {/* Card de Roteiro */}
      <div className={`flex-1 rounded-[28px] border-2 bg-white shadow-lg overflow-hidden flex flex-col ${plan.isDeparture || plan.isArrival ? 'border-sa-gold/50' : 'border-slate-100'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{plan.weekday}</span>
                {plan.isDone && <span className="bg-slate-200 text-slate-500 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">REALIZADO</span>}
             </div>
          </div>
          <h4 className="text-lg font-display font-black text-slate-800 leading-tight mb-4 uppercase">{plan.title}</h4>
          
          <div className="space-y-1">
             {(plan.plans as ActivityPlan[]).map((p, idx) => <PlanItem key={idx} plan={p} />)}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-end">
             <div>
                <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                   <DollarSign className="w-3 h-3" /> Estimativa
                </div>
                <p className="text-[9px] text-sa-green font-bold">{plan.estimateLabel}</p>
             </div>
             <div className="text-right">
                <span className="text-xl font-display font-black text-sa-green leading-none">{plan.estimate}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SALVADOR_ARACAJU_GUIDE: any = {
  SSA: [
    {
      day: 11,
      weekday: 'SÁBADO',
      date: '11/JUL',
      title: 'Embarque Rio de Janeiro ⇆ Salvador',
      weather: { icon: '✈️', temp: '25°', min: '21°', feels: '26°', rain: '5%', wind: '12km/h' },
      plans: [
        { type: 'flight', text: '21:45 - Voo LATAM decolando de GIG para Salvador.', label: 'Voo Direto' },
        { type: 'info', text: '23:45 - Pouso no Aeroporto de Salvador (SSA).', label: 'Chegada' },
        { type: 'transport', text: 'Madrugada - Transfer do Aeroporto diretamente para o Quality Hotel Salvador.', label: 'Acomodação 1' }
      ],
      map: { center: [-12.9086, -38.3225], zoom: 11, markers: [[-12.9086, -38.3225]] },
      estimate: 'R$ 618',
      estimateLabel: 'Voo Pago em kiss&fly',
      look: 'Confortável para viagem'
    },
    {
      day: 12,
      weekday: 'DOMINGO',
      date: '12/JUL',
      title: 'Centro Histórico & Farol da Barra',
      weather: { icon: '☀️', temp: '26°', min: '22°', feels: '27°', rain: '10%', wind: '15km/h' },
      plans: [
        { type: 'plan_a', text: 'Manhã: Visita ao Farol da Barra e banho de praia na Barra.', label: 'Farol da Barra' },
        { type: 'plan_b', text: 'Tarde: Subida de elevador ao Pelourinho, Elevador Lacerda e Centro Histórico.', label: 'Pelourinho' },
        { type: 'food', text: 'Noite: Jantar com autêntico acarajé baiano no Rio Vermelho.', label: 'Rio Vermelho' }
      ],
      map: { center: [-12.9714, -38.5014], zoom: 13, markers: [[-12.9714, -38.5014]] },
      estimate: 'R$ 80',
      estimateLabel: 'Alimentação & Uber',
      look: 'Leve, sol e óculos escuros'
    },
    {
      day: 13,
      weekday: 'SEGUNDA',
      date: '13/JUL',
      title: 'Itapuã, Abaeté e Pôr do Sol no Humaitá',
      weather: { icon: '⛅', temp: '27°', min: '22°', feels: '28°', rain: '15%', wind: '14km/h' },
      plans: [
        { type: 'plan_a', text: 'Manhã: Conhecer a famosa Praia de Itapuã e a Lagoa do Abaeté.', label: 'Itapuã' },
        { type: 'plan_b', text: 'Tarde: Passeio pela Ponta de Humaitá para ver o pôr do sol mais famoso da Baía de Todos os Santos.', label: 'Ponta de Humaitá' }
      ],
      map: { center: [-12.9496, -38.5194], zoom: 12, markers: [[-12.9496, -38.5194]] },
      estimate: 'R$ 75',
      estimateLabel: 'Uber + Lanches',
      look: 'Fresco e esportivo'
    },
    {
      day: 14,
      weekday: 'TERÇA',
      date: '14/JUL',
      title: 'Transfer Rodoviário Salvador ⇆ Aracaju',
      isDeparture: true,
      weather: { icon: '🚌', temp: '26°', min: '21°', feels: '26°', rain: '10%', wind: '12km/h' },
      plans: [
        { type: 'transport', text: '05:30 - Uber do Hotel até a Rodoviária de Salvador.', label: 'Partida' },
        { type: 'ticket', text: '06:40 - Embarque do Ônibus Semi-Leito (Rota Transportes, poltrona 17).', label: 'R$ 109,19' },
        { type: 'info', text: '12:05 - Chegada no Terminal Rodoviário de Aracaju. Transfer para Orla de Atalaia.', label: 'Chegada' }
      ],
      map: { center: [-10.9472, -37.0731], zoom: 11, markers: [[-10.9472, -37.0731]] },
      estimate: 'R$ 109,19',
      estimateLabel: 'Passagem Paga Rota Transportes',
      look: 'Prático para ônibus'
    },
    {
      day: 19,
      weekday: 'DOMINGO',
      date: '19/JUL',
      title: 'Retorno de Aracaju para Salvador',
      isArrival: true,
      weather: { icon: '🚌', temp: '27°', min: '22°', feels: '28°', rain: '5%', wind: '10km/h' },
      plans: [
        { type: 'transport', text: '12:30 - Deslocamento para Rodoviária de Aracaju.', label: 'Partida' },
        { type: 'ticket', text: '13:30 - Viagem de retorno de ônibus para Salvador pelo mesmo preço.', label: 'R$ 109,19' },
        { type: 'info', text: '18:55 - Chegada em Salvador. Check-in no Mercure Rio Vermelho.', label: 'Salvador Novamente' }
      ],
      map: { center: [-12.9714, -38.5014], zoom: 11, markers: [[-12.9714, -38.5014]] },
      estimate: 'R$ 109,19',
      estimateLabel: 'Passagem Volta',
      look: 'Confortável para estrada'
    },
    {
      day: 20,
      weekday: 'SEGUNDA',
      date: '20/JUL',
      title: 'Linha Verde & Praia do Forte',
      weather: { icon: '☀️', temp: '28°', min: '22°', feels: '30°', rain: '5%', wind: '14km/h' },
      plans: [
        { type: 'plan_a', text: 'Dia Inteiro: Bate-volta para Praia do Forte (Linha Verde). Visita à vila charmosa e Projeto Tamar.', label: 'Projeto Tamar' },
        { type: 'food', text: 'Almoço: Frutos do mar frescos na Vila de Pescadores.', label: 'Frutos do Mar' }
      ],
      map: { center: [-12.5714, -38.0014], zoom: 11, markers: [[-12.5714, -38.0014]] },
      estimate: 'R$ 120',
      estimateLabel: 'Transporte & Passeios',
      look: 'Beachwear chic'
    },
    {
      day: 24,
      weekday: 'SEXTA',
      date: '24/JUL',
      title: 'Embarque Salvador ⇆ Rio de Janeiro (GIG)',
      isDeparture: true,
      weather: { icon: '✈️', temp: '24°', min: '20°', feels: '24°', rain: '10%', wind: '15km/h' },
      plans: [
        { type: 'transport', text: '03:00 - Checkout do Hotel Mercure, Uber para aeroporto.', label: 'SSA Aeroporto' },
        { type: 'flight', text: '05:00 - Decolagem do voo LATAM Salvador ⇆ Rio de Janeiro.', label: 'Voo de Volta' },
        { type: 'info', text: '07:10 - Pouso programado no Rio Galeão (GIG). Fim do maravilhoso roteiro de Julho!', label: 'Chegada GIG' }
      ],
      map: { center: [-22.8134, -43.2494], zoom: 12, markers: [[-22.8134, -43.2494]] },
      estimate: 'R$ 30',
      estimateLabel: 'Apenas Uber de Madrugada',
      look: 'Confortável e quentinho'
    }
  ],
  AJU: [
    {
      day: 14,
      weekday: 'TERÇA',
      date: '14/JUL',
      title: 'Chegada em Aracaju & Orla de Atalaia',
      weather: { icon: '🌊', temp: '27°', min: '21°', feels: '28°', rain: '5%', wind: '18km/h' },
      plans: [
        { type: 'info', text: '12:05 - Desembarque na Rodoviária. Uber para o Airbnb Orla de Atalaia.', label: 'Check-in' },
        { type: 'plan_a', text: 'Tarde: Almoço na Passarela do Caranguejo e caminhada pelos lagos da Orla.', label: 'Orla de Atalaia' },
        { type: 'food', text: 'Noite: Caranguejo quebrado na hora com cerveja gelada na Passarela.', label: 'Culinária Local' }
      ],
      map: { center: [-10.9932, -37.0435], zoom: 14, markers: [[-10.9932, -37.0435]] },
      estimate: 'R$ 90',
      estimateLabel: 'Almoço & Uber Inicial',
      look: 'Prefeito para beira-mar'
    },
    {
      day: 15,
      weekday: 'QUARTA',
      date: '15/JUL',
      title: 'Crooa do Goré & Ilha dos Namorados',
      weather: { icon: '⛵', temp: '28°', min: '22°', feels: '30°', rain: '10%', wind: '15km/h' },
      plans: [
        { type: 'plan_a', text: 'Manhã: Tour de Catamarã partindo do Mosqueteiro para a Crooa do Goré (banco de areia flutuante).', label: 'Crooa do Goré' },
        { type: 'plan_b', text: 'Tarde: Parada na Ilha dos Namorados para relaxar em redes dentro d\'água.', label: 'Ilha dos Namorados' }
      ],
      map: { center: [-11.0856, -37.1511], zoom: 12, markers: [[-11.0856, -37.1511]] },
      estimate: 'R$ 150',
      estimateLabel: 'Passeio Catamarã + Almoço',
      look: 'Roupa de banho e repelente'
    },
    {
      day: 16,
      weekday: 'QUINTA',
      date: '16/JUL',
      title: 'Xingó: Cânion do Rio São Francisco',
      weather: { icon: '⛰️', temp: '32°', min: '23°', feels: '35°', rain: '0%', wind: '8km/h' },
      plans: [
        { type: 'plan_a', text: 'Dia Inteiro: Bate-volta saindo cedo para Canindé de São Francisco. Navegação épica entre paredões de rochosas no Cânion do Xingó.', label: 'Cânions de Xingó' },
        { type: 'food', text: 'Almoço: Buffet flutuante típico nordestino.', label: 'Típico' }
      ],
      map: { center: [-9.6417, -37.7917], zoom: 12, markers: [[-9.6417, -37.7917]] },
      estimate: 'R$ 280',
      estimateLabel: 'Transfer + Tour + Almoço inclusos',
      look: 'Fresco e antiderrapante'
    },
    {
      day: 17,
      weekday: 'SEXTA',
      date: '17/JUL',
      title: 'Lagoa dos Tambaquis & Praia do Saco',
      weather: { icon: '🐟', temp: '28°', min: '22°', feels: '29°', rain: '10%', wind: '14km/h' },
      plans: [
        { type: 'plan_a', text: 'Manhã: Visita à Lagoa dos Tambaquis. Experiência de alimentar os enormes tambaquis de dentro d\'água!', label: 'Lagoa dos Tambaquis' },
        { type: 'plan_b', text: 'Tarde: Relaxar nas dunas e águas calmas da Praia do Saco (beira da divisa com BA).', label: 'Praia do Saco' }
      ],
      map: { center: [-11.4111, -37.3194], zoom: 12, markers: [[-11.4111, -37.3194]] },
      estimate: 'R$ 110',
      estimateLabel: 'Passeio Lagoa & Almoço',
      look: 'Lazer e chinelo'
    },
    {
      day: 18,
      weekday: 'SÁBADO',
      date: '18/JUL',
      title: 'Mercados Municipais & Museu da Gente Sergipana',
      weather: { icon: '🏛️', temp: '27°', min: '21°', feels: '28°', rain: '15%', wind: '12km/h' },
      plans: [
        { type: 'plan_a', text: 'Manhã: Visita aos Mercados Municipais (Antônio Franco e Virginia Franco) para artesanatos e castanhas.', label: 'Artesanato' },
        { type: 'plan_b', text: 'Tarde: Museu da Gente Sergipana (Totalmente interativo, conta a cultura do povo de Sergipe). Imperdível!', label: 'Museu Interativo' }
      ],
      map: { center: [-10.9086, -37.0494], zoom: 14, markers: [[-10.9086, -37.0494]] },
      estimate: 'R$ 50',
      estimateLabel: 'Entradas/Uber/Castanhas',
      look: 'Casual urbano'
    },
    {
      day: 19,
      weekday: 'DOMINGO',
      date: '19/JUL',
      title: 'Despedida de Aracaju',
      weather: { icon: '👋', temp: '26°', min: '21°', feels: '27°', rain: '5%', wind: '14km/h' },
      plans: [
        { type: 'plan_a', text: 'Manhã: Última caminhada na Orla dos lagos, fotos aéreas de lembrança.', label: 'Checkout' },
        { type: 'transport', text: '13:30 - Embarque na Rodoviária retorno para Salvador.', label: 'Bus Volta' }
      ],
      map: { center: [-10.9500, -37.0500], zoom: 13, markers: [[-10.9500, -37.0500]] },
      estimate: 'R$ 20',
      estimateLabel: 'Lanche na Rodoviária',
      look: 'Prático para viajar'
    }
  ],
  possibilities: {
    SSA: [],
    AJU: []
  }
};

const CITY_CENTERS = {
  CPT: [-33.9249, 18.4241] as [number, number],
  JNB: [-26.2041, 28.0473] as [number, number],
  SSA: [-12.9714, -38.5014] as [number, number],
  AJU: [-10.9472, -37.0731] as [number, number],
};

const GuideList: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedTrip, setSelectedTrip] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('selected_trip');
    if (saved) {
      try {
        setSelectedTrip(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const isSalvadorAracaju = selectedTrip?.id === 'am_ssa_aju' || selectedTrip?.id === 'am_sp_ssa_aju';

  // OFFLINE FIRST: Estado inicial vem do Storage, com fallback para o Default
  const [data, setData] = useState<GuideData>(() => {
    try {
      const saved = localStorage.getItem(GUIDE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_GUIDE;
    } catch {
      return DEFAULT_GUIDE;
    }
  });
  
  const [activeCity, setActiveCity] = useState<'CPT' | 'JNB' | 'SSA' | 'AJU'>('JNB');

  useEffect(() => {
    if (isSalvadorAracaju) {
      setActiveCity('SSA');
    } else {
      setActiveCity('JNB');
    }
  }, [isSalvadorAracaju]);

  const currentGuideData = isSalvadorAracaju ? SALVADOR_ARACAJU_GUIDE : data;

  // Background Sync
  useEffect(() => {
    if (navigator.onLine && !isSalvadorAracaju) {
        loadDataFromCloud('guides_v8_woodmead_logistics').then(cloudData => {
            if (cloudData) {
                setData(cloudData as GuideData);
                localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(cloudData));
            }
        });
    }
  }, [isSalvadorAracaju]);

  return (
    <div className="pb-48">
      <CategoryHeader title="Roteiros e Guias" onBack={onBack} />
      <div className="p-4 space-y-6">
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
        {isSalvadorAracaju ? (
          <>
            <button
                onClick={() => setActiveCity('SSA')}
                className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${activeCity === 'SSA' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-400'}`}
            >
                <MapPin className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-black uppercase tracking-widest">Salvador</span>
            </button>
            <button
                onClick={() => setActiveCity('AJU')}
                className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${activeCity === 'AJU' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-400'}`}
            >
                <MapPin className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-black uppercase tracking-widest">Aracaju</span>
            </button>
          </>
        ) : (
          <>
            <button
                onClick={() => setActiveCity('CPT')}
                className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${activeCity === 'CPT' ? 'bg-white shadow-md text-sa-blue' : 'text-slate-400'}`}
            >
                <MapPin className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-black uppercase tracking-widest">Cidade do Cabo</span>
            </button>
            <button
                onClick={() => setActiveCity('JNB')}
                className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${activeCity === 'JNB' ? 'bg-white shadow-md text-sa-gold' : 'text-slate-400'}`}
            >
                <MapPin className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-black uppercase tracking-widest">Joanesburgo</span>
            </button>
          </>
        )}
      </div>

      <div className="h-56 w-full rounded-[32px] overflow-hidden mb-8 border-2 border-white shadow-xl bg-slate-100 relative group">
        <Map 
            height={224} 
            center={currentGuideData[activeCity]?.[0]?.map.center || CITY_CENTERS[activeCity]} 
            defaultZoom={activeCity === 'CPT' ? 11 : 12}
        >
            <Marker 
                width={40} 
                anchor={CITY_CENTERS[activeCity]} 
                color={isSalvadorAracaju ? '#059669' : activeCity === 'CPT' ? '#007baf' : '#FFB81C'} 
            />
            {(currentGuideData[activeCity] as DailyPlan[] || []).map((plan, idx) => (
               <Marker 
                  key={idx}
                  width={30}
                  anchor={plan.map.center}
                  color={isSalvadorAracaju ? '#059669aa' : activeCity === 'CPT' ? '#007bafaa' : '#FFB81Caa'}
               />
            ))}
        </Map>
        <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
           <div className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/50 flex items-center gap-2 pointer-events-auto">
              <Navigation className="w-3.5 h-3.5 text-sa-green animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Mapa Operacional Ativo</span>
           </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-3xl p-5 mb-8">
         <div className="flex items-center gap-2 mb-2 text-red-700 font-black uppercase text-xs tracking-widest">
            <ShieldCheck className="w-5 h-5" /> Manual de Operações
         </div>
         <p className="text-xs text-red-800 leading-relaxed font-medium">
            <strong>Toque nos itens</strong> para ver detalhes vitais: como usar o cartão no ônibus, onde é o ponto de embarque e estratégias de segurança.
         </p>
      </div>

      <div className="space-y-2 animate-in fade-in">
        {(currentGuideData[activeCity] as DailyPlan[] || []).map((plan, i) => (
           <DayCard key={i} plan={plan} city={activeCity as string} />
        ))}
      </div>
      
      {currentGuideData.possibilities?.[activeCity]?.length > 0 && (
        <div className="mt-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Planos de Emergência</h3>
            {currentGuideData.possibilities[activeCity].map((p: any) => <PossibilityCard key={p.id} item={p} />)}
        </div>
      )}
    </div>
  </div>
);
};

export default GuideList;
