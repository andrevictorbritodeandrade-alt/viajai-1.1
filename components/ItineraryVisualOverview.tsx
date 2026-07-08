import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Plane, 
  Calendar, 
  Clock, 
  DollarSign, 
  GitCommit, 
  MapPin, 
  Edit3, 
  Check, 
  Activity, 
  Map, 
  RefreshCw,
  ShoppingBag,
  Briefcase,
  AlertCircle,
  ArrowRight,
  Info,
  Bus,
  Car,
  ShieldCheck,
  Luggage
} from 'lucide-react';

interface Stop {
  airport: string;
  city: string;
  coords: string;
}

interface FlightLeg {
  flightNumber: string;
  airline: string;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  depTime: string;
  arrTime: string;
  duration: string;
  layoverAfter?: string; // Time waiting or connection alert
  priceInfo?: string;
  dateInfo?: string;
}

interface BaggageOption {
  type: 'personal' | 'cabin' | 'checked';
  label: string;
  limit: string;
  included: boolean;
  color: string;
}

interface ItineraryData {
  id: string;
  tripName: string;
  stops: Stop[];
  outboundDate: string;
  outboundTime: string;
  returnDate: string;
  returnTime: string;
  price: string;
  lastResearched: string;
  outboundLegs: FlightLeg[];
  inboundLegs: FlightLeg[];
  internalLegs?: FlightLeg[];
  baggage: BaggageOption[];
  airlineLogoNote?: string;
}

const TEMPLATE_ITINERARIES: Record<string, ItineraryData> = {
  'am_foz_ass_ba': {
    id: 'am_foz_ass_ba',
    tripName: 'Buenos Aires + Assunção + Foz do Iguaçu',
    stops: [
      { airport: 'GIG', city: 'Rio de Janeiro', coords: '-22.8134° S, -43.2494° W' },
      { airport: 'AEP', city: 'Buenos Aires', coords: '-34.5580° S, -58.4170° W' },
      { airport: 'IGR', city: 'Puerto Iguazú', coords: '-25.7333° S, -54.4667° W' },
      { airport: 'ASU', city: 'Assunção', coords: '-25.2400° S, -57.5100° W' },
      { airport: 'IGU', city: 'Foz do Iguaçu', coords: '-25.6953° S, -54.4367° W' }
    ],
    outboundDate: '01 de Janeiro de 2027',
    outboundTime: '03:55',
    returnDate: '15 de Janeiro de 2027',
    returnTime: '20:00',
    price: '1.649,79',
    lastResearched: 'Hoje',
    outboundLegs: [
      {
        flightNumber: 'FO 5905',
        airline: 'Flybondi',
        from: 'GIG',
        fromCity: 'Rio de Janeiro',
        to: 'AEP',
        toCity: 'Buenos Aires',
        depTime: '03:55',
        arrTime: '07:20',
        duration: '3h25m',
        layoverAfter: 'Dias em Buenos Aires',
        dateInfo: 'Sexta-feira, 01 de Jan de 2027',
        priceInfo: 'R$ 570,23 / px (R$ 1.140,46 total)'
      }
    ],
    internalLegs: [
      {
        flightNumber: 'Semi-Leito',
        airline: 'Nordeste Transportes',
        from: 'Rodoviária',
        fromCity: 'Foz Do Iguaçu',
        to: 'Assunção',
        toCity: 'Paraguai',
        depTime: '08:00',
        arrTime: '15:00',
        duration: '7h 00m',
        dateInfo: 'Data a Confirmar',
        priceInfo: 'R$ 124,29 / px (R$ 248,58 total)'
      }
    ],
    inboundLegs: [
      {
        flightNumber: 'G3',
        airline: 'GOL Linhas Aéreas',
        from: 'IGU',
        fromCity: 'Foz do Iguaçu',
        to: 'GIG',
        toCity: 'Rio de Janeiro',
        depTime: '20:00',
        arrTime: '22:00',
        duration: '2h00m',
        dateInfo: 'Sexta-feira, 15 de Jan de 2027',
        priceInfo: 'R$ 592,00 / px (R$ 1.184,00 total)'
      }
    ],
    baggage: [
      { type: 'personal', label: 'Mala de mão 6kg', limit: 'Incluso', included: true, color: 'text-emerald-600 bg-emerald-500/10' },
      { type: 'cabin', label: 'Mala de Cabine 10kg (9 a 12kg Flybondi)', limit: 'Incluso no bilhete selecionado', included: true, color: 'text-emerald-600 bg-emerald-500/10' },
      { type: 'checked', label: '1 Mala Despachada', limit: 'Cobrada à parte', included: false, color: 'text-rose-400 bg-rose-500/10' }
    ]
  },
  'am_bh_med_san': {
    id: 'am_bh_med_san',
    tripName: 'Caribe Colombiano: Medellín + San Andrés',
    stops: [
      { airport: 'CNF', city: 'Belo Horizonte', coords: '19.6244° S, 43.9719° W' },
      { airport: 'MDE', city: 'Medellín', coords: '6.1644° N, 75.4231° W' },
      { airport: 'ADZ', city: 'San Andrés', coords: '12.5847° N, 81.7006° W' }
    ],
    outboundDate: '14 de Janeiro de 2027',
    outboundTime: '19:10',
    returnDate: '27 de Janeiro de 2027',
    returnTime: '18:15',
    price: '3.701,00',
    lastResearched: 'Hoje',
    outboundLegs: [
      {
        flightNumber: 'G3 / AV / LA',
        airline: 'Gol, Avianca, LATAM',
        from: 'CNF',
        fromCity: 'Belo Horizonte',
        to: 'MDE',
        toCity: 'Medellín',
        depTime: '19:10',
        arrTime: '07:45 (+1)',
        duration: '14h35m',
        layoverAfter: '2 paradas (GRU, BOG)',
        dateInfo: 'Quinta-feira, 14 de Jan de 2027',
        priceInfo: 'R$ 1.398,00 / px (R$ 2.796,00 total - 2 pessoas)'
      }
    ],
    internalLegs: [
      {
        flightNumber: 'LA 4118',
        airline: 'LATAM Airlines Colômbia',
        from: 'MDE',
        fromCity: 'Medellín',
        to: 'ADZ',
        toCity: 'San Andrés',
        depTime: '14:50',
        arrTime: '18:55',
        duration: '4h05m',
        layoverAfter: '1 parada (BOG 55m)',
        dateInfo: 'Terça-feira, 19 de Jan de 2027',
        priceInfo: 'R$ 315,00 / px (R$ 630,00 total - 2 pessoas)'
      },
      {
        flightNumber: 'LA 4119',
        airline: 'LATAM Airlines Colômbia',
        from: 'ADZ',
        fromCity: 'San Andrés',
        to: 'MDE',
        toCity: 'Medellín',
        depTime: '07:22',
        arrTime: '09:08',
        duration: '1h46m',
        dateInfo: 'Quarta-feira, 27 de Jan de 2027',
        priceInfo: 'R$ 299,00 / px (R$ 598,00 total - 2 pessoas)'
      }
    ],
    inboundLegs: [
      {
        flightNumber: 'LA 8110',
        airline: 'LATAM Airlines',
        from: 'MDE',
        fromCity: 'Medellín',
        to: 'CNF',
        toCity: 'Belo Horizonte',
        depTime: '18:15',
        arrTime: '11:35 (+1)',
        duration: '15h20m',
        layoverAfter: '2 paradas (LIM, GRU)',
        dateInfo: 'Quarta-feira, 27 de Jan de 2027',
        priceInfo: 'R$ 1.689,00 / px (R$ 3.378,00 total - 2 pessoas)'
      }
    ],
    baggage: [
      { type: 'personal', label: 'Mala de mão / Mochila', limit: 'Incluso no bilhete', included: true, color: 'text-emerald-600 bg-emerald-500/10' },
      { type: 'cabin', label: 'Mala de Cabine 10kg', limit: 'Incluso no bilhete', included: true, color: 'text-emerald-600 bg-emerald-500/10' },
      { type: 'checked', label: '1 Mala Despachada 23kg', limit: 'Cobrada à parte por trecho', included: false, color: 'text-rose-400 bg-rose-500/10' }
    ]
  },
  'am_rio_san': {
    id: 'am_rio_san',
    tripName: 'Plano C: GIG ⇄ San Andrés (Economômico)',
    stops: [
      { airport: 'GIG', city: 'Rio de Janeiro', coords: '22.8123° S, 43.2505° W' },
      { airport: 'PTY', city: 'Panamá', coords: '9.0714° N, 79.3835° W' },
      { airport: 'ADZ', city: 'San Andrés', coords: '12.5847° N, 81.7006° W' }
    ],
    outboundDate: '15 de Janeiro de 2027',
    outboundTime: '01:30',
    returnDate: '25 de Janeiro de 2027',
    returnTime: '15:20',
    price: '2.450,00',
    lastResearched: 'Hoje',
    outboundLegs: [
      {
        flightNumber: 'CM 748',
        airline: 'Copa Airlines',
        from: 'GIG',
        fromCity: 'Rio de Janeiro',
        to: 'ADZ',
        toCity: 'San Andrés',
        depTime: '01:30',
        arrTime: '11:15',
        duration: '11h45m',
        layoverAfter: 'Conexão PTY',
        dateInfo: 'Sexta-feira, 15 de Jan de 2027',
        priceInfo: 'R$ 1.225,00 / px (R$ 2.450,00 total)'
      }
    ],
    inboundLegs: [
      {
        flightNumber: 'CM 749',
        airline: 'Copa Airlines',
        from: 'ADZ',
        fromCity: 'San Andrés',
        to: 'GIG',
        toCity: 'Rio de Janeiro',
        depTime: '15:20',
        arrTime: '06:45 (+1)',
        duration: '13h25m',
        layoverAfter: 'Conexão PTY',
        dateInfo: 'Segunda-feira, 25 de Jan de 2027',
        priceInfo: 'R$ 1.225,00 / px (Roundtrip)'
      }
    ],
    baggage: [
      { type: 'personal', label: 'Item Pessoal', limit: 'Incluso', included: true, color: 'text-emerald-600 bg-emerald-500/10' },
      { type: 'cabin', label: 'Mala de Cabine 10kg', limit: 'Incluso', included: true, color: 'text-emerald-600 bg-emerald-500/10' },
      { type: 'checked', label: 'Mala Despachada', limit: 'Opcional', included: false, color: 'text-rose-400 bg-rose-500/10' }
    ]
  },
  'am_rio_foz_ba': {
    id: 'am_rio_foz_ba',
    tripName: 'Plano D: Rio ⇄ Foz + Buenos Aires (Combinado)',
    stops: [
      { airport: 'GIG', city: 'Rio de Janeiro', coords: '22.8123° S, 43.2505° W' },
      { airport: 'IGU', city: 'Foz do Iguaçu', coords: '25.5977° S, 54.4855° W' },
      { airport: 'IGR', city: 'Puerto Iguazú', coords: '25.7372° S, 54.4727° W' },
      { airport: 'AEP', city: 'Buenos Aires', coords: '34.5580° S, 58.4173° W' }
    ],
    outboundDate: '29 de Dezembro de 2026',
    outboundTime: '07:40',
    returnDate: '08 de Janeiro de 2027',
    returnTime: '21:05',
    price: '1.427,00',
    lastResearched: 'Hoje',
    outboundLegs: [
      {
        flightNumber: 'G3 1920',
        airline: 'GOL Linhas Aéreas',
        from: 'GIG',
        fromCity: 'Rio de Janeiro',
        to: 'IGU',
        toCity: 'Foz do Iguaçu',
        depTime: '07:40',
        arrTime: '09:50',
        duration: '2h10m',
        dateInfo: 'Terça-feira, 29 de Dez de 2026',
        priceInfo: 'R$ 961,00 / px Ida e Volta (Etapa 1)'
      }
    ],
    internalLegs: [
      {
        flightNumber: 'FO 5100',
        airline: 'Flybondi (Low Cost)',
        from: 'IGR',
        fromCity: 'Puerto Iguazú (AR)',
        to: 'AEP',
        toCity: 'Buenos Aires (AR)',
        depTime: '09:20',
        arrTime: '11:10',
        duration: '1h50m',
        dateInfo: 'Sexta-feira, 01 de Jan de 2027',
        priceInfo: 'Poltrona Inclusa • R$ 466,00 Ida e Volta (Etapa 2)'
      },
      {
        flightNumber: 'FO 5101',
        airline: 'Flybondi (Low Cost)',
        from: 'AEP',
        fromCity: 'Buenos Aires (AR)',
        to: 'IGR',
        toCity: 'Puerto Iguazú (AR)',
        depTime: '18:35',
        arrTime: '20:25',
        duration: '1h50m',
        dateInfo: 'Quinta-feira, 07 de Jan de 2027',
        priceInfo: 'Flybondi voo direto internacional focado'
      }
    ],
    inboundLegs: [
      {
        flightNumber: 'G3 1925',
        airline: 'GOL Linhas Aéreas',
        from: 'IGU',
        fromCity: 'Foz do Iguaçu',
        to: 'GIG',
        toCity: 'Rio de Janeiro',
        depTime: '21:05',
        arrTime: '23:10',
        duration: '2h05m',
        dateInfo: 'Sexta-feira, 08 de Jan de 2027',
        priceInfo: 'Incluso no bilhete Copa / GOL'
      }
    ],
    baggage: [
      { type: 'personal', label: 'Mochila / Item Pessoal', limit: 'Incluso em todos os voos', included: true, color: 'text-emerald-600 bg-emerald-500/10' },
      { type: 'cabin', label: 'Mala de Cabine 10kg', limit: 'Incluso nas Cias Principais', included: true, color: 'text-emerald-600 bg-emerald-500/10' },
      { type: 'checked', label: 'Mala Despachada', limit: 'Cobrada à parte nas low-costs', included: false, color: 'text-rose-400 bg-rose-500/10' }
    ]
  },
  'am_salvador_julho': {
    id: 'am_salvador_julho',
    tripName: 'Salvador + Maragogi + Aracaju (Carro Alugado)',
    stops: [
      { airport: 'GIG', city: 'Rio de Janeiro', coords: '22.8123° S, 43.2505° W' },
      { airport: 'SSA', city: 'Salvador', coords: '12.9110° S, 38.3314° W' },
      { airport: 'MRG', city: 'Maragogi', coords: '9.0122° S, 35.2217° W' },
      { airport: 'AJU', city: 'Aracaju', coords: '10.9841° S, 37.0701° W' }
    ],
    outboundDate: '16 de Julho de 2026',
    outboundTime: '23:20',
    returnDate: '23 de Julho de 2026',
    returnTime: '05:50',
    price: '1.152,53',
    lastResearched: 'Hoje',
    outboundLegs: [
      {
        flightNumber: 'G3 1898',
        airline: 'GOL Linhas Aéreas',
        from: 'GIG',
        fromCity: 'Rio de Janeiro',
        to: 'SSA',
        toCity: 'Salvador',
        depTime: '23:20',
        arrTime: '01:25',
        duration: '2h05m',
        dateInfo: 'Quinta-feira, 16 de Jul de 2026',
        priceInfo: 'R$ 697,00 / px Ida e Volta'
      }
    ],
    internalLegs: [
      {
        flightNumber: 'Carro Alugado (LocarX)',
        airline: 'Fiat Mobi ou similar',
        from: 'SSA',
        fromCity: 'Salvador',
        to: 'MRG',
        toCity: 'Maragogi',
        depTime: '08:00',
        arrTime: '13:00',
        duration: '5h00m',
        dateInfo: 'Sexta-feira, 17 de Jul de 2026',
        priceInfo: 'Estrada Linha Verde (BA-099) e AL-101. Carro alugado na LocarX'
      },
      {
        flightNumber: 'Carro Alugado (LocarX)',
        airline: 'Fiat Mobi ou similar',
        from: 'MRG',
        fromCity: 'Maragogi',
        to: 'AJU',
        toCity: 'Aracaju',
        depTime: '12:00',
        arrTime: '16:00',
        duration: '4h00m',
        dateInfo: 'Domingo, 19 de Jul de 2026',
        priceInfo: 'Deslocamento sul em direção a Sergipe pela BR-101 e SE-100'
      },
      {
        flightNumber: 'Carro Alugado (LocarX)',
        airline: 'Fiat Mobi ou similar',
        from: 'AJU',
        fromCity: 'Aracaju',
        to: 'SSA',
        toCity: 'Salvador',
        depTime: '08:30',
        arrTime: '13:00',
        duration: '4h30m',
        dateInfo: 'Terça-feira, 21 de Jul de 2026',
        priceInfo: 'Retorno para a Bahia pela Rodovia Linha Verde'
      }
    ],
    inboundLegs: [
      {
        flightNumber: 'G3 1865',
        airline: 'GOL Linhas Aéreas',
        from: 'SSA',
        fromCity: 'Salvador',
        to: 'GIG',
        toCity: 'Rio de Janeiro',
        depTime: '05:50',
        arrTime: '07:55',
        duration: '2h05m',
        dateInfo: 'Quinta-feira, 23 de Jul de 2026',
        priceInfo: 'Incluso'
      }
    ],
    baggage: [
      { type: 'personal', label: 'Mochila / Item Pessoal', limit: 'Incluso', included: true, color: 'text-emerald-600 bg-emerald-500/10' },
      { type: 'cabin', label: 'Mala de Cabine 10kg', limit: 'Incluso na tarifa padrão', included: true, color: 'text-emerald-600 bg-emerald-500/10' },
      { type: 'checked', label: 'Mala Despachada', limit: 'Opcional (cobrada à parte)', included: false, color: 'text-slate-500 bg-slate-500/10' }
    ]
  },
  'am_sp_ssa_aju': {
    id: 'am_sp_ssa_aju',
    tripName: 'São Paulo + Salvador + Aracaju (Conjugado)',
    stops: [
      { airport: 'GRU', city: 'São Paulo', coords: '23.4356° S, 46.4731° W' },
      { airport: 'SSA', city: 'Salvador', coords: '12.9110° S, 38.3314° W' },
      { airport: 'AJU', city: 'Aracaju', coords: '10.9841° S, 37.0701° W' }
    ],
    outboundDate: '11 de Julho de 2026',
    outboundTime: '08:00',
    returnDate: '19 de Julho de 2026',
    returnTime: '17:00',
    price: '1.100,00',
    lastResearched: 'Hoje',
    outboundLegs: [
      {
        flightNumber: 'AD 4050',
        airline: 'Azul Linhas Aéreas',
        from: 'GRU',
        fromCity: 'São Paulo',
        to: 'SSA',
        toCity: 'Salvador',
        depTime: '08:00',
        arrTime: '10:15',
        duration: '2h15m',
        dateInfo: 'Sábado, 11 de Jul de 2026',
        priceInfo: 'R$ 550,00 / px Ida'
      }
    ],
    internalLegs: [
      {
        flightNumber: 'Carro Alugado (LocarX)',
        airline: 'Fiat Mobi ou similar',
        from: 'SSA',
        fromCity: 'Salvador',
        to: 'AJU',
        toCity: 'Aracaju',
        depTime: '08:00',
        arrTime: '12:30',
        duration: '4h30m',
        dateInfo: 'Terça-feira, 14 de Jul de 2026',
        priceInfo: 'Estrada Linha Verde (BA-099). Carro alugado.'
      },
      {
        flightNumber: 'Carro Alugado (LocarX)',
        airline: 'Fiat Mobi ou similar',
        from: 'AJU',
        fromCity: 'Aracaju',
        to: 'SSA',
        toCity: 'Salvador',
        depTime: '13:30',
        arrTime: '18:00',
        duration: '4h30m',
        dateInfo: 'Domingo, 19 de Jul de 2026',
        priceInfo: 'Retorno de carro alugado para Salvador.'
      }
    ],
    inboundLegs: [
      {
        flightNumber: 'AD 4055',
        airline: 'Azul Linhas Aéreas',
        from: 'SSA',
        fromCity: 'Salvador',
        to: 'GRU',
        toCity: 'São Paulo',
        depTime: '17:00',
        arrTime: '19:15',
        duration: '2h15m',
        dateInfo: 'Domingo, 19 de Jul de 2026',
        priceInfo: 'R$ 550,00 / px Volta'
      }
    ],
    baggage: [
      { type: 'personal', label: 'Mochila / Item Pessoal', limit: 'Incluso em toda a viagem (voos/carro)', included: true, color: 'text-emerald-600 bg-emerald-500/10' },
      { type: 'cabin', label: 'Mala de Cabine 10kg', limit: 'Incluso no voo da Azul', included: true, color: 'text-emerald-600 bg-emerald-500/10' },
      { type: 'checked', label: 'Bagagem no Carro', limit: 'Franquia do porta-malas inclusa', included: true, color: 'text-emerald-600 bg-emerald-500/10' }
    ]
  },
};

export interface OverviewProps {
  tripId: string;
}

export const ItineraryVisualOverview: React.FC<OverviewProps> = ({ tripId }) => {
  const [data, setData] = useState<ItineraryData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTimelineTab, setActiveTimelineTab] = useState<'ida' | 'interno' | 'volta'>('ida');

  // Flight Editable Fields State
  const [editedPrice, setEditedPrice] = useState('');
  const [editedOutboundDate, setEditedOutboundDate] = useState('');
  const [editedOutboundTime, setEditedOutboundTime] = useState('');
  const [editedReturnDate, setEditedReturnDate] = useState('');
  const [editedReturnTime, setEditedReturnTime] = useState('');
  const [editedLastResearched, setEditedLastResearched] = useState('');
  
  // Baggage controls in Edit Mode
  const [editedBag1, setEditedBag1] = useState(true);
  const [editedBag2, setEditedBag2] = useState(true);
  const [editedBag3, setEditedBag3] = useState(true);

  // Connection alert fields in Edit Mode
  const [layoverTextIda, setLayoverTextIda] = useState('');
  const [layoverTextVolta, setLayoverTextVolta] = useState('');

  // Sincroniza e carrega dados salvos localmente ou usa template
  useEffect(() => {
    const key = `itinerary_custom_${tripId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (err) {
        setData(TEMPLATE_ITINERARIES[tripId] || TEMPLATE_ITINERARIES['am_foz_ass_ba']);
      }
    } else {
      setData(TEMPLATE_ITINERARIES[tripId] || TEMPLATE_ITINERARIES['am_foz_ass_ba']);
    }
  }, [tripId]);

  const handleSave = () => {
    if (!data) return;
    
    // Constrói custom legs atualizando layovers de conexões adicionais
    const updatedOutboundLegs = [...(data.outboundLegs || [])];
    if (updatedOutboundLegs.length > 0) {
      if (layoverTextIda) {
        updatedOutboundLegs[0].layoverAfter = layoverTextIda;
      } else {
        delete updatedOutboundLegs[0].layoverAfter;
      }
    }

    const updatedInboundLegs = [...(data.inboundLegs || [])];
    if (updatedInboundLegs.length > 0) {
      if (layoverTextVolta) {
        updatedInboundLegs[0].layoverAfter = layoverTextVolta;
      } else {
        delete updatedInboundLegs[0].layoverAfter;
      }
    }

    const updatedBaggage: BaggageOption[] = [
      { type: 'personal', label: 'Artigo Pessoal (Mochila)', limit: 'Sob assento da frente', included: editedBag1, color: editedBag1 ? 'text-emerald-600 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10' },
      { type: 'cabin', label: 'Bagagem de Mão (10kg)', limit: 'No compartimento superior', included: editedBag2, color: editedBag2 ? 'text-emerald-600 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10' },
      { type: 'checked', label: 'Mala Despachada (23kg)', limit: 'No porão do avião', included: editedBag3, color: editedBag3 ? 'text-emerald-600 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10' }
    ];

    const updated: ItineraryData = {
      ...data,
      price: editedPrice,
      outboundDate: editedOutboundDate,
      outboundTime: editedOutboundTime,
      returnDate: editedReturnDate,
      returnTime: editedReturnTime,
      lastResearched: editedLastResearched,
      outboundLegs: updatedOutboundLegs,
      inboundLegs: updatedInboundLegs,
      baggage: updatedBaggage
    };

    setData(updated);
    localStorage.setItem(`itinerary_custom_${tripId}`, JSON.stringify(updated));
    
    // Alerta o evento customizado no topo para manter os preços das viagens em sincronia profunda no dashboard
    window.dispatchEvent(new CustomEvent('trip-price-updated', { detail: { id: tripId, price: editedPrice } }));
    setIsEditing(false);
  };

  const startEdit = () => {
    if (!data) return;
    setEditedPrice(data.price);
    setEditedOutboundDate(data.outboundDate);
    setEditedOutboundTime(data.outboundTime);
    setEditedReturnDate(data.returnDate);
    setEditedReturnTime(data.returnTime);
    setEditedLastResearched(data.lastResearched);
    setEditedBag1(data.baggage?.[0]?.included ?? true);
    setEditedBag2(data.baggage?.[1]?.included ?? true);
    setEditedBag3(data.baggage?.[2]?.included ?? false);
    setLayoverTextIda(data.outboundLegs?.[0]?.layoverAfter || '');
    setLayoverTextVolta(data.inboundLegs?.[0]?.layoverAfter || '');
    setIsEditing(true);
  };

  if (!data) return null;

  const isCarTrip = !!(data.internalLegs && data.internalLegs[0]?.flightNumber.toLowerCase().includes('carro'));

  const currentLegs = activeTimelineTab === 'ida' 
    ? data.outboundLegs || [] 
    : activeTimelineTab === 'interno' && data.internalLegs 
      ? data.internalLegs 
      : data.inboundLegs || [];
  const hasConnections = currentLegs.some(leg => !!leg.layoverAfter);

  return (
    <div id="flight_gold_card" className="bg-white border-4 border-slate-100 rounded-[32px] p-6 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden mb-8">
      
      {/* Header Layout Grid */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ROTEIRO ATIVO DEDICADO
          </div>
          <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight uppercase">
            {data.tripName}
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="bg-blue-100 text-blue-700 text-[9.5px] font-black uppercase px-2 py-0.5 rounded tracking-wider">MAPA COORDENADO</span>
            <span className="text-xs text-slate-500 font-bold tracking-wide">
              {data.stops?.map(s => s.airport).join(' ➔ ')}
            </span>
          </div>
        </div>

        {/* Passagem Praticada Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full md:w-auto min-w-[280px]">
          <div className="flex justify-between items-start gap-3">
            <div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">CUSTO TOTAL (VOOS)</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-black text-emerald-600">R$</span>
                <span className="text-3xl font-display font-black text-slate-900 tracking-tight">{data.price}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Soma de todos os trechos por pax</span>
            </div>
            <div className="text-right space-y-1">
              <span className="inline-block bg-[#10b981]/15 text-emerald-600 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-[#10b981]/15 tracking-wider font-mono">CONSULTADO SUCESSO</span>
              <p className="text-[9px] text-slate-500 font-bold font-mono">Atualizado: {data.lastResearched}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Timelines & Baggage Visual Card - Expanded to full-width horizontal layout */}
      <div className="flex flex-col gap-8 w-full items-stretch">
        
        {/* Top Section: Interactive Timeline (Full Width) */}
        <div className="w-full space-y-4">
          
          {/* TAB Switches with custom visual highlights */}
          <div className={`grid ${data.internalLegs && data.internalLegs.length > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-3 bg-[#090d16] p-1.5 rounded-2xl border border-slate-900 w-full mb-6`}>
            <button
              onClick={() => setActiveTimelineTab('ida')}
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTimelineTab === 'ida' 
                  ? 'bg-[#00c58e] text-black shadow-lg shadow-[#00c58e]/20' 
                  : 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Plane className="w-4 h-4 translate-y-[0.5px]" />
              Sentido Ida: {data.outboundDate.split(' de ')[0]} {data.outboundDate.split(' de ')[1]?.substring(0, 3)}
            </button>
            {data.internalLegs && data.internalLegs.length > 0 && (
              <button
                onClick={() => setActiveTimelineTab('interno')}
                className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTimelineTab === 'interno' 
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' 
                    : 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {data.id === 'am_rio_foz_ba' ? (
                  <Plane className="w-4 h-4" />
                ) : isCarTrip ? (
                  <Car className="w-4 h-4 translate-y-[0.5px]" />
                ) : (
                  <Car className="w-4 h-4 translate-y-[0.5px]" />
                )}
                {data.id === 'am_rio_foz_ba' 
                  ? 'Voo: Puerto Iguazú ⇄ BA' 
                  : (data.internalLegs && data.internalLegs[0]) 
                    ? `Car: ${data.internalLegs[0].from} ➞ ${data.internalLegs[0].to}` 
                    : 'Car: Foz ➞ Assunção'}
              </button>
            )}
            <button
              onClick={() => setActiveTimelineTab('volta')}
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTimelineTab === 'volta' 
                  ? 'bg-[#00c58e] text-black shadow-lg shadow-[#00c58e]/20' 
                  : 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Plane className="w-4 h-4 rotate-180 translate-y-[-0.5px]" />
              Sentido Volta: {data.returnDate.split(' de ')[0]} {data.returnDate.split(' de ')[1]?.substring(0, 3)}
            </button>
          </div>

          {/* Core Timeline Module Panel */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 relative">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                {activeTimelineTab === 'interno' ? 'Linha do Tempo Terrestre' : 'Linha do Tempo de Voos'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${hasConnections ? 'bg-amber-400 animate-pulse' : 'bg-[#00c58e]'}`}></span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                  {hasConnections ? 'Com Conexão' : (activeTimelineTab === 'interno' ? 'Viagem Direta' : 'Voo Direto')}
                </span>
              </div>
            </div>

            {/* Custom Visual Timeline Flow */}
            <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-emerald-500/20 before:via-white/5 before:to-purple-500/20">
              
              {currentLegs.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs italic">Nenhum detalhe de voo disponível para essa rota.</div>
              ) : (
                currentLegs.map((leg, index) => {
                  const isFirst = index === 0;
                  const isLast = index === currentLegs.length - 1;
                  return (
                    <div key={leg.flightNumber + '-' + index} className="space-y-4">
                      
                      {/* Timeline Segment Block */}
                      <div className="relative pl-14 group">
                        
                        {/* Bullet Marker dot representing Geodesic Departure point */}
                        <div className="absolute left-[17px] top-1.5 w-4.5 h-4.5 rounded-full bg-white border-white border-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        </div>

                        {/* Top: Airline / Flight Badge info */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[9px] bg-slate-200 border border-slate-300 rounded-md px-2 py-0.5 text-slate-900 font-mono tracking-widest uppercase">
                            {leg.flightNumber}
                          </span>
                          <span className="text-[10px] font-extrabold text-slate-600 uppercase">{leg.airline}</span>
                          <span className="text-[9px] ml-auto font-bold opacity-60 text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Duration: {leg.duration}
                          </span>
                        </div>

                        {/* Departure and Arrival Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 rounded-2xl p-4 border border-slate-200">
                          
                          {/* Departure Node detail */}
                          <div className="flex items-center gap-3">
                            <div className="text-left">
                              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-0.5">Partida</span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-display font-black text-lg">{leg.depTime}</span>
                                <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider bg-white/5 rounded px-1.5">{leg.from}</span>
                              </div>
                              <p className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors">{leg.fromCity}</p>
                            </div>
                          </div>

                          {/* Arrival Node detail */}
                          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                            <div className="text-left">
                              <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest block mb-0.5">Chegada</span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-display font-black text-lg">{leg.arrTime}</span>
                                <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider bg-white/5 rounded px-1.5">{leg.to}</span>
                              </div>
                              <p className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors">{leg.toCity}</p>
                            </div>
                          </div>

                        </div>

                        {/* Leg Info Footer */}
                        {(leg.dateInfo || leg.priceInfo) && (
                          <div className="mt-2.5 flex flex-wrap justify-between items-center text-[10px] bg-white/5 rounded-xl p-2.5 px-4 border border-slate-200 gap-2">
                            {leg.dateInfo && <span className="font-bold text-slate-500 font-mono tracking-wide">{leg.dateInfo}</span>}
                            {leg.priceInfo && <span className="font-bold text-slate-500 tracking-wider">{(leg.airline.includes('Transporte') || leg.airline.includes('Viação')) ? 'RODOVIÁRIO:' : 'AÉREO:'} <strong className="text-emerald-600 whitespace-nowrap">{leg.priceInfo}</strong></span>}
                          </div>
                        )}

                      </div>

                      {/* Connection / Layover warning alert block */}
                      {leg.layoverAfter && (
                        <div className="relative pl-14 py-1.5">
                          <div className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                          </div>
                          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-2xl px-4 py-3 text-xs md:text-[11px] font-bold flex flex-col md:flex-row md:items-center justify-between gap-2.5 shadow-md">
                            <div className="flex items-center gap-2">
                              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="leading-tight">{leg.layoverAfter}</span>
                            </div>
                            <span className="text-[9px] font-black tracking-widest uppercase bg-amber-400/20 text-amber-200 rounded-full py-0.5 px-2.5 border border-amber-400/30 shrink-0 self-start md:self-auto">
                              ESPERA OBRIGATÓRIA
                            </span>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })
              )}

              {/* Optional Terrestrial Connection */}
              {(data.id === 'am_ssa_aju' || data.id === 'am_sp_ssa_aju' || data.id === 'am_salvador_julho') && (
                <>
                  {isCarTrip ? (
                    <>
                      {/* Decorative dashed connector */}
                      <div className="relative pl-14 py-2">
                        <div className="flex items-center gap-2 bg-[#111827] border border-slate-200 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-400 shrink-0 font-mono w-fit">
                          <Car className="w-3.5 h-3.5 text-emerald-400" /> Deslocamento Terrestre de Carro (Carro Alugado)
                        </div>
                      </div>

                      {activeTimelineTab === 'ida' ? (
                        <div className="relative pl-14 group animate-in fade-in duration-300">
                          {/* Emerald Bullet Marker */}
                          <div className="absolute left-[17px] top-1.5 w-[18px] h-[18px] rounded-full bg-white border-white border-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[9px] bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono tracking-widest uppercase font-black">
                              CARRO ALUGADO
                            </span>
                            <span className="text-[10px] font-extrabold text-slate-600 uppercase">Fiat Mobi ou similar (LocarX)</span>
                            <span className="text-[9px] ml-auto font-bold opacity-60 text-slate-500 flex items-center gap-1 font-mono">
                              <Clock className="w-3.5 h-3.5" /> 4h 30m
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 rounded-2xl p-4 border border-slate-200">
                            <div className="flex items-center gap-3">
                              <div className="text-left">
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-0.5">Retirada Salvador</span>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-display font-black text-lg">08:00</span>
                                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider bg-white/5 rounded px-1.5 font-mono">SSA</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-500">Loja de Aluguel de Carros (LocarX)</p>
                                <p className="text-[9px] font-medium text-slate-500 font-mono">14 de jul. de 2026</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                              <div className="text-left">
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-0.5">Chegada Aracaju</span>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-display font-black text-lg">12:30</span>
                                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider bg-white/5 rounded px-1.5 font-mono">AJU</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-500">Hospedagem em Aracaju (Orla de Atalaia)</p>
                                <p className="text-[9px] font-medium text-slate-500 font-mono">14 de jul. de 2026</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2.5 flex justify-between items-center text-[10px] bg-white/5 rounded-xl p-2.5 px-4 border border-slate-200 flex-wrap gap-2">
                            <span className="font-bold text-slate-500 font-sans">Rota: <strong className="text-slate-900 font-extrabold uppercase">Estrada Linha Verde (BA-099)</strong></span>
                            <span className="font-bold text-slate-500 font-sans">Custo: <strong className="text-emerald-600 font-black">Incluso no Aluguel</strong></span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative pl-14 group animate-in fade-in duration-300">
                          {/* Emerald Bullet Marker */}
                          <div className="absolute left-[17px] top-1.5 w-[18px] h-[18px] rounded-full bg-white border-white border-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[9px] bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono tracking-widest uppercase font-black">
                              CARRO ALUGADO
                            </span>
                            <span className="text-[10px] font-extrabold text-slate-600 uppercase">Fiat Mobi ou similar (LocarX)</span>
                            <span className="text-[9px] ml-auto font-bold opacity-60 text-emerald-600 flex items-center gap-1 font-mono">
                              <Clock className="w-3.5 h-3.5" /> 4h 30m
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 rounded-2xl p-4 border border-slate-200">
                            <div className="flex items-center gap-3">
                              <div className="text-left">
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-0.5">Partida Aracaju</span>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-display font-black text-lg">13:30</span>
                                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider bg-white/5 rounded px-1.5 font-mono">AJU</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-500">Hospedagem em Aracaju (Orla de Atalaia)</p>
                                <p className="text-[9px] font-medium text-slate-500 font-mono">19 de jul. de 2026</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                              <div className="text-left">
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-0.5">Devolução Salvador</span>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-display font-black text-lg">18:00</span>
                                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider bg-white/5 rounded px-1.5 font-mono">SSA</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-500">Loja de Aluguel de Carros (LocarX)</p>
                                <p className="text-[9px] font-medium text-slate-500 font-mono">19 de jul. de 2026</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2.5 flex justify-between items-center text-[10px] bg-white/5 rounded-xl p-2.5 px-4 border border-slate-200 flex-wrap gap-2">
                            <span className="font-bold text-slate-500 font-sans">Rota: <strong className="text-slate-900 font-extrabold uppercase">Estrada Linha Verde (BA-099)</strong></span>
                            <span className="font-bold text-slate-500 font-sans">Custo: <strong className="text-emerald-600 font-black">Devolução com Transfer Grátis p/ Aeroporto</strong></span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Decorative dashed connector */}
                      <div className="relative pl-14 py-2">
                        <div className="flex items-center gap-2 bg-[#111827] border border-slate-200 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-orange-400 shrink-0 font-mono w-fit">
                          <Bus className="w-3.5 h-3.5 text-orange-400" /> Conexão Terrestre Rodoviária (Viação Águia Branca)
                        </div>
                      </div>

                      {activeTimelineTab === 'ida' ? (
                        <div className="relative pl-14 group animate-in fade-in duration-300">
                          {/* Orange Bullet Marker */}
                          <div className="absolute left-[17px] top-1.5 w-[18px] h-[18px] rounded-full bg-white border-white border-orange-400 flex items-center justify-center shadow-md shadow-orange-500/10 group-hover:scale-110 transition-transform">
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[9px] bg-orange-600/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-md font-mono tracking-widest uppercase font-black">
                              ÁGUIA BRANCA
                            </span>
                            <span className="text-[10px] font-extrabold text-slate-600 uppercase">Viação Águia Branca (Poltrona 17)</span>
                            <span className="text-[9px] ml-auto font-bold opacity-60 text-slate-500 flex items-center gap-1 font-mono">
                              <Clock className="w-3.5 h-3.5" /> 5h 25m
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 rounded-2xl p-4 border border-slate-200">
                            <div className="flex items-center gap-3">
                              <div className="text-left">
                                <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block mb-0.5">Embarque Salvador</span>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-display font-black text-lg">06:40</span>
                                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider bg-white/5 rounded px-1.5 font-mono">SSA</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-500">Terminal Rodoviário de Salvador</p>
                                <p className="text-[9px] font-medium text-slate-500 font-mono">14 de jul. de 2026 (Terça-feira)</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                              <div className="text-left">
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-0.5">Desembarque Aracaju</span>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-display font-black text-lg">12:05</span>
                                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider bg-white/5 rounded px-1.5 font-mono">AJU</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-500">Terminal Rodoviário de Aracaju</p>
                                <p className="text-[9px] font-medium text-slate-500 font-mono">14 de jul. de 2026 (Terça-feira)</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2.5 flex justify-between items-center text-[10px] bg-white/5 rounded-xl p-2.5 px-4 border border-slate-200 flex-wrap gap-2">
                            <span className="font-bold text-slate-500">Acomodação: <strong className="text-slate-900">SEMILEITO</strong></span>
                            <span className="font-bold text-slate-500">Valor Total: <strong className="text-orange-400">R$ 109,19 (com taxas)</strong></span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative pl-14 group animate-in fade-in duration-300">
                          {/* Orange Bullet Marker */}
                          <div className="absolute left-[17px] top-1.5 w-[18px] h-[18px] rounded-full bg-white border-white border-orange-400 flex items-center justify-center shadow-md shadow-orange-500/10 group-hover:scale-110 transition-transform">
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[9px] bg-orange-600/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-md font-mono tracking-widest uppercase font-black">
                              ÁGUIA BRANCA
                            </span>
                            <span className="text-[10px] font-extrabold text-slate-600 uppercase">Viação Águia Branca (Poltrona 17)</span>
                            <span className="text-[9px] ml-auto font-bold opacity-60 text-emerald-600 flex items-center gap-1 font-mono">
                              <Clock className="w-3.5 h-3.5" /> 5h 25m
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 rounded-2xl p-4 border border-slate-200">
                            <div className="flex items-center gap-3">
                              <div className="text-left">
                                <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block mb-0.5">Embarque Aracaju</span>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-display font-black text-lg">07:00</span>
                                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider bg-white/5 rounded px-1.5 font-mono">AJU</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-500">Terminal Rodoviário de Aracaju</p>
                                <p className="text-[9px] font-medium text-slate-500 font-mono">21 de jul. de 2026 (Terça-feira)</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                              <div className="text-left">
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-0.5">Desembarque Salvador</span>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-display font-black text-lg">12:25</span>
                                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider bg-white/5 rounded px-1.5 font-mono">SSA</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-500">Terminal Rodoviário de Salvador</p>
                                <p className="text-[9px] font-medium text-slate-500 font-mono">21 de jul. de 2026 (Terça-feira)</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2.5 flex justify-between items-center text-[10px] bg-white/5 rounded-xl p-2.5 px-4 border border-slate-200 flex-wrap gap-2">
                            <span className="font-bold text-slate-500">Acomodação: <strong className="text-slate-900">SEMILEITO</strong></span>
                            <span className="font-bold text-slate-500">Valor Total: <strong className="text-orange-400">R$ 109,19 (com taxas)</strong></span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

            </div>
          </div>
        </div>

        {/* Bottom Section: Baggage allowance details module (Full Width) */}
        <div className="w-full flex flex-col justify-between">
          
          {/* Baggage Panel Card with high-contrast borders and clean background */}
          <div className="bg-white border-2 border-slate-200 shadow-sm rounded-[24px] p-5 space-y-4 relative overflow-hidden mb-4">
            <div className="flex items-center gap-2.5 text-slate-700">
              <Luggage className="w-5 h-5 text-emerald-600 animate-pulse" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">BAGAGENS INCLUSAS</h4>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">FRANQUIA POR BILHETE</p>
              </div>
            </div>

            {/* List of Baggage Details with beautiful visual items - 3 Columns Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.baggage?.map((bag) => {
                const IconComponent = bag.type === 'personal' ? Briefcase : Luggage;
                return (
                  <div 
                    key={bag.type}
                    className="bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200 p-3.5 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        bag.included ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-800">{bag.label}</h5>
                        <p className="text-[10px] text-slate-500">{bag.limit}</p>
                      </div>
                    </div>
                    {bag.included ? (
                      <span className="bg-[#10b981]/15 text-emerald-600 text-[9px] font-black px-2 py-1 rounded tracking-wider border border-[#10b981]/20">INCLUSO</span>
                    ) : (
                      <span className="bg-rose-500/15 text-rose-500 text-[9px] font-black px-2 py-1 rounded tracking-wider border border-rose-500/20">NÃO INC</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* General Disclaimer Badge inside Baggage Frame */}
            <div className="pt-2 flex gap-2 items-start text-[10px] text-slate-500 font-medium leading-relaxed border-t border-slate-100">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>Valores e bagagens simulados via tarifas consolidadas pela inteligência. Emissão garantida sem nenhuma cobrança surpresa no balcão.</p>
            </div>

          </div>

          {/* Quick interactive action to edit itinerary values */}
          <div className="w-full">
            {!isEditing ? (
              <button
                onClick={startEdit}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 hover:border-slate-300 rounded-[20px] bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-sm hover:shadow active:scale-95 transition-all duration-200"
              >
                EDITAR DADOS DO BILHETE
              </button>
            ) : (
              <div className="bg-white border border-slate-300 rounded-[2rem] p-5 shadow-2xl w-full animate-in slide-in-from-bottom duration-300">
                <h4 className="text-xs font-black tracking-widest uppercase text-slate-900 mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-600" />
                  Atualizar Dados do Bilhete
                </h4>
                
                <div className="space-y-4 mb-5 max-h-[360px] overflow-y-auto pr-1">
                  <div>
                    <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase block mb-1">Preço Praticado</label>
                    <input 
                      type="text" 
                      value={editedPrice} 
                      onChange={(e) => setEditedPrice(e.target.value)}
                      className="w-full bg-white/5 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase block mb-1">Data de Ida</label>
                      <input 
                        type="text" 
                        value={editedOutboundDate} 
                        onChange={(e) => setEditedOutboundDate(e.target.value)}
                        className="w-full bg-white/5 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase block mb-1">Hora de Ida</label>
                      <input 
                        type="text" 
                        value={editedOutboundTime} 
                        onChange={(e) => setEditedOutboundTime(e.target.value)}
                        className="w-full bg-white/5 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase block mb-1">Data de Volta</label>
                      <input 
                        type="text" 
                        value={editedReturnDate} 
                        onChange={(e) => setEditedReturnDate(e.target.value)}
                        className="w-full bg-white/5 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase block mb-1">Hora de Volta</label>
                      <input 
                        type="text" 
                        value={editedReturnTime} 
                        onChange={(e) => setEditedReturnTime(e.target.value)}
                        className="w-full bg-white/5 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                  
                  {/* Layover editable textboxes */}
                  <div>
                    <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase block mb-1">Mensagem de Conexão (Ida)</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Conexão de 1h30m em Congonhas"
                      value={layoverTextIda} 
                      onChange={(e) => setLayoverTextIda(e.target.value)}
                      className="w-full bg-white/5 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase block mb-1">Mensagem de Conexão (Volta)</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Conexão rápida de 1h15m em Ezeiza"
                      value={layoverTextVolta} 
                      onChange={(e) => setLayoverTextVolta(e.target.value)}
                      className="w-full bg-white/5 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Baggage toggles */}
                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-[9px] font-black tracking-wider text-slate-500 uppercase block mb-2">Configure as Bagagens</span>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
                        <input type="checkbox" checked={editedBag1} onChange={(e) => setEditedBag1(e.target.checked)} className="rounded border-slate-300 bg-white text-emerald-500 focus:ring-0 focus:ring-offset-0" />
                        Item Pessoal (Mochila) Incluso
                      </label>
                      <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
                        <input type="checkbox" checked={editedBag2} onChange={(e) => setEditedBag2(e.target.checked)} className="rounded border-slate-300 bg-white text-emerald-500 focus:ring-0 focus:ring-offset-0" />
                        Mala de Bordo (10kg) Inclusa
                      </label>
                      <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
                        <input type="checkbox" checked={editedBag3} onChange={(e) => setEditedBag3(e.target.checked)} className="rounded border-slate-300 bg-white text-emerald-500 focus:ring-0 focus:ring-offset-0" />
                        Mala Despachada (23kg) Inclusa
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase block mb-1">Data/Hora da Consulta</label>
                    <input 
                      type="text" 
                      value={editedLastResearched} 
                      onChange={(e) => setEditedLastResearched(e.target.value)}
                      className="w-full bg-white/5 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#c084fc]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 hover:bg-white/5 text-slate-600 font-bold border border-slate-300 rounded-xl text-[10px] uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 px-5 py-2 font-black rounded-xl text-[10px] uppercase tracking-widest text-slate-950"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Salvar
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
