
import React from 'react';
import { 
  Plane, 
  PlaneTakeoff, 
  PlaneLanding, 
  Clock, 
  Users, 
  Luggage, 
  CreditCard, 
  CloudSun, 
  ThermometerSun, 
  Droplets, 
  AlertCircle,
  QrCode,
  Info,
  BellRing,
  Briefcase,
  ShieldCheck,
  Check,
  Bus,
  Car,
  Smartphone,
  ArrowLeft,
  CheckCircle2,
  Armchair,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  X,
  FileText,
  Download,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CategoryHeader from './CategoryHeader';

interface Passenger {
  name: string;
  ticketNumber?: string;
  doc?: string;
  cpf?: string;
}

interface WeatherForecast {
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  humidity: number;
  rainProb: number;
  condition: string;
}

interface FlightLeg {
  flightNumber: string;
  airline: string;
  aircraft?: string;
  departure: {
    code: string;
    city: string;
    time: string;
    date: string;
    brasiliaTime?: string;
  };
  arrival: {
    code: string;
    city: string;
    time: string;
    date: string;
    brasiliaTime?: string;
  };
  duration: string;
  layover?: string;
  checkInTime?: string;
  weatherDeparture?: WeatherForecast;
  weatherArrival?: WeatherForecast;
}

interface Trip {
  id: string;
  type: 'ida' | 'volta' | 'interno';
  title: string;
  bookingReference: string;
  provider: string;
  passengers: Passenger[];
  legs: FlightLeg[];
  baggage: string;
  financials?: {
    total: string;
    installments?: string;
    status: string;
  };
}

// MOCKED WEATHER DATA - JANEIRO/FEVEREIRO 2026 (VERÃO)
const WEATHER_SP: WeatherForecast = { tempMax: 29, tempMin: 21, feelsLike: 32, humidity: 75, rainProb: 60, condition: "Sol com Pancadas" };
const WEATHER_JNB: WeatherForecast = { tempMax: 27, tempMin: 16, feelsLike: 29, humidity: 55, rainProb: 40, condition: "Tarde com Tempestades" };
const WEATHER_CPT: WeatherForecast = { tempMax: 28, tempMin: 17, feelsLike: 28, humidity: 50, rainProb: 5, condition: "Sol e Muito Vento" };
const WEATHER_LAD: WeatherForecast = { tempMax: 33, tempMin: 25, feelsLike: 39, humidity: 80, rainProb: 20, condition: "Muito Abafado" };

// SALVADOR / ARACAJU SPECIFIC DATA (JULHO 2026)
const SALVADOR_WEATHER_ARR: WeatherForecast = { tempMax: 27, tempMin: 22, feelsLike: 29, humidity: 78, rainProb: 15, condition: "Sol com algumas nuvens" };
const RIO_WEATHER_DEP: WeatherForecast = { tempMax: 25, tempMin: 18, feelsLike: 26, humidity: 70, rainProb: 10, condition: "Céu Limpo" };

// FOZ / BA SPECIFIC DATA (JANEIRO)
const BA_WEATHER: WeatherForecast = { tempMax: 30, tempMin: 21, feelsLike: 32, humidity: 65, rainProb: 20, condition: "Sol e Calor" };
const IGU_WEATHER: WeatherForecast = { tempMax: 33, tempMin: 24, feelsLike: 36, humidity: 75, rainProb: 40, condition: "Quente com Nuvens" };

const SSA_AJU_TRIPS: any[] = [
  {
    id: 'ssa-aju-ida',
    type: 'ida',
    title: 'Ida: Salvador (SSA) → Aracaju (AJU) (Ônibus)',
    bookingReference: 'PENDENTE',
    provider: 'Viação Águia Branca',
    baggage: 'Mala de Porão Inclusa (Padrão Rodoviário)',
    financials: { total: 'R$ 200,00 (Total 2 Pax)', installments: 'Águia Branca', status: 'Cotação' },
    passengers: [{ name: 'André Victor' }, { name: 'Marcelly Bispo' }],
    legs: [
      {
        flightNumber: 'Semi-Leito',
        airline: 'Viação Águia Branca',
        checkInTime: '06:10',
        departure: { code: 'SSA', city: 'Salvador', time: '06:40', date: '14/07/2026' },
        arrival: { code: 'AJU', city: 'Aracaju', time: '12:05', date: '14/07/2026' },
        duration: '5h 25m'
      }
    ]
  }
];

const FOZ_BA_TRIPS: Trip[] = [
  {
    id: 'foz-ba-ida1',
    type: 'ida',
    title: 'Ida: Rio de Janeiro (GIG) → Buenos Aires (AEP)',
    bookingReference: 'PENDENTE',
    provider: 'Flybondi (Opção Mais Barata Total)',
    baggage: 'Mala de mão + Mala de 10kg inclusas',
    financials: { total: 'R$ 1.140,46 (Total 2 Pax) — R$ 570,23 / pax', installments: 'Flybondi Website', status: 'Cotação' },
    passengers: [
      { name: 'André Victor Brito de Andrade' },
      { name: 'Marcelly Bispo Pereira da Silva' }
    ],
    legs: [
      {
        flightNumber: 'FO 5905',
        airline: 'Flybondi',
        checkInTime: '01:55',
        departure: { code: 'GIG', city: 'Rio de Janeiro', time: '03:55', date: 'Sex., 01 de jan.' },
        arrival: { code: 'AEP', city: 'Buenos Aires', time: '07:20', date: 'Sex., 01 de jan.' },
        duration: '3h 25m',
        weatherDeparture: RIO_WEATHER_DEP,
        weatherArrival: BA_WEATHER
      }
    ]
  },
  {
    id: 'foz-ba-interno',
    type: 'interno',
    title: 'Trecho Interno: Foz Do Iguaçu → Assunção (Ônibus)',
    bookingReference: 'PENDENTE',
    provider: 'Nordeste Transportes',
    baggage: 'Mala de Porão Inclusa (Padrão Rodoviário)',
    financials: { total: 'R$ 248,58 (Total 2 Pax) — R$ 124,29 / pax', installments: 'Nordeste Transportes', status: 'Cotação' },
    passengers: [
      { name: 'André Victor Brito de Andrade' },
      { name: 'Marcelly Bispo Pereira da Silva' }
    ],
    legs: [
      {
        flightNumber: 'Semi-Leito',
        airline: 'Nordeste Transportes',
        checkInTime: '07:30',
        departure: { code: 'ROD', city: 'Foz do Iguaçu (Rodoviária)', time: '08:00', date: 'Data a Confirmar' },
        arrival: { code: 'PY', city: 'Assunção', time: '15:00', date: 'Data a Confirmar' },
        duration: '7h 00m',
        weatherDeparture: IGU_WEATHER,
        weatherArrival: IGU_WEATHER
      }
    ]
  },
  {
    id: 'foz-ba-volta',
    type: 'volta',
    title: 'Volta: Foz do Iguaçu (IGU) → Rio de Janeiro (GIG)',
    bookingReference: 'PENDENTE',
    provider: 'GOL / Google Flights',
    baggage: 'Mala de mão + Mala de 10kg (Cobrada à Parte / Opção MaxMilhas)',
    financials: { total: 'R$ 1.184,00 (Total 2 Pax) — R$ 592,00 / pax', installments: 'GOL Website / MaxMilhas', status: 'Cotação' },
    passengers: [
      { name: 'André Victor Brito de Andrade' },
      { name: 'Marcelly Bispo Pereira da Silva' }
    ],
    legs: [
      {
        flightNumber: 'G3 (Sem Escalas)',
        airline: 'GOL Linhas Aéreas',
        checkInTime: '18:00',
        departure: { code: 'IGU', city: 'Foz do Iguaçu', time: '20:00', date: 'Sex., 15 de jan.' },
        arrival: { code: 'GIG', city: 'Rio de Janeiro', time: '22:00', date: 'Sex., 15 de jan.' },
        duration: '2h 00m',
        weatherDeparture: IGU_WEATHER,
        weatherArrival: RIO_WEATHER_DEP
      }
    ]
  }
];

const COLOMBIA_TRIPS: any[] = [
  {
    id: 'colombia-trecho1',
    type: 'ida',
    title: 'Ida: Belo Horizonte (CNF) → Medellín (MDE)',
    bookingReference: 'PENDENTE',
    provider: 'Gol + Avianca + LATAM (Kiwi.com)',
    baggage: 'Mala de mão inclusa • Mala despachada cobrada à parte',
    financials: { 
      total: 'R$ 2.796,00 (Total 2 Pax) — R$ 1.398,00 / pax', 
      installments: 'Consolidador Kiwi.com / Cia Aérea', 
      status: 'Cotação' 
    },
    passengers: [
      { name: 'André Victor Brito de Andrade' },
      { name: 'Marcelly Bispo Pereira da Silva' }
    ],
    legs: [
      {
        flightNumber: 'G3 / AV / LA',
        airline: 'Gol / Avianca / LATAM (2 paradas GRU, BOG)',
        checkInTime: '17:10',
        departure: { code: 'CNF', city: 'Belo Horizonte', time: '19:10', date: 'Qui., 14 de jan.' },
        arrival: { code: 'MDE', city: 'Medellín', time: '07:45', date: 'Sex., 15 de jan.' },
        duration: '14h 35m',
        weatherDeparture: { tempMax: 26, tempMin: 18, feelsLike: 27, humidity: 72, rainProb: 15, condition: "Parcialmente Nublado" },
        weatherArrival: { tempMax: 24, tempMin: 16, feelsLike: 25, humidity: 68, rainProb: 20, condition: "Clima Agradável" }
      }
    ]
  },
  {
    id: 'colombia-trecho2',
    type: 'interno',
    title: 'Trecho Interno: Medellín (MDE) → San Andrés (ADZ)',
    bookingReference: 'PENDENTE',
    provider: 'LATAM Colômbia',
    baggage: 'Mala de mão inclusa • Mala despachada cobrada à parte',
    financials: { 
      total: 'R$ 630,00 (Total 2 Pax) — R$ 315,00 / pax', 
      installments: 'LATAM Airlines', 
      status: 'Cotação' 
    },
    passengers: [
      { name: 'André Victor Brito de Andrade' },
      { name: 'Marcelly Bispo Pereira da Silva' }
    ],
    legs: [
      {
        flightNumber: 'LA 4118',
        airline: 'LATAM Colômbia (1 parada BOG)',
        checkInTime: '12:50',
        departure: { code: 'MDE', city: 'Medellín', time: '14:50', date: 'Ter., 19 de jan.' },
        arrival: { code: 'ADZ', city: 'San Andrés', time: '18:55', date: 'Ter., 19 de jan.' },
        duration: '4h 05m',
        weatherDeparture: { tempMax: 24, tempMin: 16, feelsLike: 25, humidity: 68, rainProb: 20, condition: "Clima Agradável" },
        weatherArrival: { tempMax: 29, tempMin: 25, feelsLike: 32, humidity: 80, rainProb: 10, condition: "Ensolarado" }
      }
    ]
  },
  {
    id: 'colombia-trecho3',
    type: 'interno',
    title: 'Trecho Interno: San Andrés (ADZ) → Medellín (MDE)',
    bookingReference: 'PENDENTE',
    provider: 'LATAM Colômbia',
    baggage: 'Mala de mão inclusa • Mala despachada cobrada à parte',
    financials: { 
      total: 'R$ 598,00 (Total 2 Pax) — R$ 299,00 / pax', 
      installments: 'LATAM Airlines', 
      status: 'Cotação' 
    },
    passengers: [
      { name: 'André Victor Brito de Andrade' },
      { name: 'Marcelly Bispo Pereira da Silva' }
    ],
    legs: [
      {
        flightNumber: 'LA 4119',
        airline: 'LATAM Colômbia (Voo Direto)',
        checkInTime: '05:22',
        departure: { code: 'ADZ', city: 'San Andrés', time: '07:22', date: 'Qua., 27 de jan.' },
        arrival: { code: 'MDE', city: 'Medellín', time: '09:08', date: 'Qua., 27 de jan.' },
        duration: '1h 46m',
        weatherDeparture: { tempMax: 29, tempMin: 25, feelsLike: 32, humidity: 80, rainProb: 10, condition: "Ensolarado" },
        weatherArrival: { tempMax: 24, tempMin: 16, feelsLike: 25, humidity: 68, rainProb: 20, condition: "Clima Agradável" }
      }
    ]
  },
  {
    id: 'colombia-trecho4',
    type: 'volta',
    title: 'Volta: Medellín (MDE) → Belo Horizonte (CNF)',
    bookingReference: 'PENDENTE',
    provider: 'LATAM Airlines',
    baggage: 'Mala de mão inclusa • Mala despachada cobrada à parte',
    financials: { 
      total: 'R$ 3.378,00 (Total 2 Pax) — R$ 1.689,00 / pax', 
      installments: 'LATAM Airlines Website', 
      status: 'Cotação' 
    },
    passengers: [
      { name: 'André Victor Brito de Andrade' },
      { name: 'Marcelly Bispo Pereira da Silva' }
    ],
    legs: [
      {
        flightNumber: 'LA 8110',
        airline: 'LATAM Airlines (2 paradas LIM, GRU)',
        checkInTime: '16:15',
        departure: { code: 'MDE', city: 'Medellín', time: '18:15', date: 'Qua., 27 de jan.' },
        arrival: { code: 'CNF', city: 'Belo Horizonte', time: '11:35', date: 'Qui., 28 de jan.' },
        duration: '15h 20m',
        weatherDeparture: { tempMax: 24, tempMin: 16, feelsLike: 25, humidity: 68, rainProb: 20, condition: "Clima Agradável" },
        weatherArrival: { tempMax: 26, tempMin: 18, feelsLike: 27, humidity: 72, rainProb: 15, condition: "Parcialmente Nublado" }
      }
    ]
  }
];

const SALVADOR_TRIPS: any[] = [
  {
    id: 'salvador-ida',
    type: 'ida',
    title: 'Ida: Rio de Janeiro (GIG) → Salvador (SSA)',
    bookingReference: 'HQWSNK',
    provider: 'GOL Linhas Aéreas',
    baggage: 'Mala de mão 10kg inclusa • Mochila inclusa',
    financials: { 
      total: 'R$ 1.394,00 (Total Ida e Volta para 2 Pessoas)', 
      status: 'Confirmado' 
    },
    passengers: [
      { name: 'André Victor Brito de Andrade' },
      { name: 'Marcelly Bispo Pereira da Silva' }
    ],
    legs: [
      {
        flightNumber: 'G3 1898',
        airline: 'GOL Linhas Aéreas',
        departure: { code: 'GIG', city: 'Rio de Janeiro, RJ', time: '23:20', date: 'Quinta-feira, 16 de Jul de 2026' },
        arrival: { code: 'SSA', city: 'Salvador, BA', time: '01:25', date: 'Sexta-feira, 17 de Jul de 2026' },
        duration: '2h 05m',
        weatherDeparture: RIO_WEATHER_DEP,
        weatherArrival: SALVADOR_WEATHER_ARR
      }
    ]
  },
  {
    id: 'salvador-volta',
    type: 'volta',
    title: 'Volta: Salvador (SSA) → Rio de Janeiro (GIG)',
    bookingReference: 'HQWSNK',
    provider: 'GOL Linhas Aéreas',
    baggage: 'Mala de mão 10kg inclusa • Mochila inclusa',
    financials: { 
      total: 'Incluso no total', 
      status: 'Confirmado' 
    },
    passengers: [
      { name: 'André Victor Brito de Andrade' },
      { name: 'Marcelly Bispo Pereira da Silva' }
    ],
    legs: [
      {
        flightNumber: 'G3 1865',
        airline: 'GOL Linhas Aéreas',
        checkInTime: '03:50',
        departure: { code: 'SSA', city: 'Salvador, BA', time: '05:50', date: 'Quinta-feira, 23 de Jul de 2026' },
        arrival: { code: 'GIG', city: 'Rio de Janeiro, RJ', time: '07:55', date: 'Quinta-feira, 23 de Jul de 2026' },
        duration: '2h 05m',
        weatherDeparture: SALVADOR_WEATHER_ARR,
        weatherArrival: RIO_WEATHER_DEP
      }
    ]
  }
];

const RIO_SAN_ANDRES_TRIPS: any[] = [
  {
    id: 'rio-san-ida',
    type: 'ida',
    title: 'Ida: Rio de Janeiro (GIG) → San Andrés (ADZ)',
    bookingReference: 'PENDENTE',
    provider: 'Copa Airlines / Avianca',
    baggage: 'Mala de mão inclusa • Mala despachada opcional',
    financials: { 
      total: 'R$ 2.450,00 (Total 2 Pax) — R$ 1.225,00 / pax', 
      status: 'Oferta Promocional' 
    },
    passengers: [{ name: 'André Victor' }, { name: 'Marcelly Bispo' }],
    legs: [
      {
        flightNumber: 'CM 748',
        airline: 'Copa Airlines (Conexão PTY)',
        checkInTime: '23:30',
        departure: { code: 'GIG', city: 'Rio de Janeiro', time: '01:30', date: 'Sex., 15 de jan.' },
        arrival: { code: 'ADZ', city: 'San Andrés', time: '11:15', date: 'Sex., 15 de jan.' },
        duration: '11h 45m',
        weatherArrival: { tempMax: 29, tempMin: 25, feelsLike: 32, humidity: 80, rainProb: 10, condition: "Ensolarado" }
      }
    ]
  },
  {
    id: 'rio-san-volta',
    type: 'volta',
    title: 'Volta: San Andrés (ADZ) → Rio de Janeiro (GIG)',
    bookingReference: 'PENDENTE',
    provider: 'Copa Airlines / Avianca',
    baggage: 'Mala de mão inclusa • Mala despachada opcional',
    financials: { 
      total: 'R$ 2.450,00 (Total 2 Pax) — R$ 1.225,00 / pax', 
      status: 'Oferta Promocional' 
    },
    passengers: [{ name: 'André Victor' }, { name: 'Marcelly Bispo' }],
    legs: [
      {
        flightNumber: 'CM 749',
        airline: 'Copa Airlines (Conexão PTY)',
        checkInTime: '13:00',
        departure: { code: 'ADZ', city: 'San Andrés', time: '15:20', date: 'Seg., 25 de jan.' },
        arrival: { code: 'GIG', city: 'Rio de Janeiro', time: '06:45', date: 'Ter., 26 de jan.' },
        duration: '13h 25m',
        weatherArrival: { tempMax: 32, tempMin: 24, feelsLike: 35, humidity: 65, rainProb: 5, condition: "Ensolarado" }
      }
    ]
  }
];

const WeatherWidget: React.FC<{ weather: WeatherForecast, label: string, compact?: boolean }> = ({ weather, label, compact }) => (
  <div className={`bg-white/50 rounded-lg p-2 text-xs flex ${compact ? 'flex-row items-center gap-3' : 'flex-col items-center'} border border-gray-100 min-w-[80px]`}>
    <div className={`flex ${compact ? 'flex-col items-start' : 'flex-col items-center'}`}>
      <span className="font-bold text-gray-500 mb-1">{label}</span>
      <div className="flex items-center gap-1 mb-1">
        {weather.rainProb > 40 ? <Droplets className="w-4 h-4 text-blue-500" /> : <CloudSun className="w-4 h-4 text-amber-500" />}
        <span className="font-bold text-lg">{weather.tempMax}°</span>
      </div>
    </div>
    <div className={`flex flex-col gap-0.5 ${compact ? 'w-auto' : 'w-full'} text-[10px] text-gray-600`}>
      <div className="flex justify-between gap-2"><span>Min:</span> <span className="font-medium">{weather.tempMin}°</span></div>
      <div className="flex justify-between gap-2 text-orange-600"><ThermometerSun className="w-3 h-3" /> <span className="font-medium">{weather.feelsLike}°</span></div>
      <div className="flex justify-between gap-2 text-blue-600"><Droplets className="w-3 h-3" /> <span className="font-medium">{weather.rainProb}%</span></div>
    </div>
  </div>
);

const PLANO_D_OPTIONS = [
  {
    dates: '25/12 a 08/01',
    est1Price: 971,
    est2Price: 466,
    totalPrice: 1437,
    totalDays: 14,
    daysBA: 6, // 01/01 a 07/01
    daysFoz: 8, // 25/12 a 31/12 (7) + 08/01 (1)
    daysBefore: 7, 
    daysAfter: 1, 
    risk: 'Baixo',
    riskColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/15',
    badge: 'Excelente Distribuição',
    desc: 'Muito confortável! Permite fazer passeios com muita calma antes de ir para Buenos Aires, com travessia de fronteira diurna tranquila.',
    recommended: false,
    label: 'Opção 1'
  },
  {
    dates: '29/12 a 08/01',
    est1Price: 961,
    est2Price: 466,
    totalPrice: 1427,
    totalDays: 10,
    daysBA: 6, // 01/01 a 07/01
    daysFoz: 4, // 29/12 a 31/12 (3) + 08/01 (1)
    daysBefore: 3, 
    daysAfter: 1, 
    risk: 'Baixo',
    riskColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/15',
    badge: 'Melhor Custo-Benefício',
    desc: 'O preço mais baixo de passagens (R$ 1.427) aliado a um tempo perfeito de viagem. Permite passar a virada do ano em IGU com tranquilidade e fazer a balsa/ponte com tempo.',
    recommended: true,
    label: 'Opção 2 (Recomendada)'
  },
  {
    dates: '29/12 a 11/01',
    est1Price: 1136,
    est2Price: 466,
    totalPrice: 1602,
    totalDays: 13,
    daysBA: 6,
    daysFoz: 7, // 29/12 a 31/12 (3) + 08/01 a 11/01 (4)
    daysBefore: 3, 
    daysAfter: 4, 
    risk: 'Baixo',
    riskColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/15',
    badge: 'Mais Dias no Retorno',
    desc: 'Balanço excelente, porém o custo da etapa 1 aumenta o valor total para R$ 1.602,00.',
    recommended: false,
    label: 'Opção 3'
  },
  {
    dates: '29/12 a 12/01',
    est1Price: 1044,
    est2Price: 466,
    totalPrice: 1510,
    totalDays: 14,
    daysBA: 6,
    daysFoz: 8, // 29/12 a 31/12 (3) + 08/01 a 12/01 (5)
    daysBefore: 3, 
    daysAfter: 5, 
    risk: 'Baixo',
    riskColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/15',
    badge: 'Férias Longas',
    desc: 'Balanço confortável e preço razoável de média estada.',
    recommended: false,
    label: 'Opção 4'
  },
  {
    dates: '31/12 a 08/01',
    est1Price: 971,
    est2Price: 466,
    totalPrice: 1437,
    totalDays: 8,
    daysBA: 6,
    daysFoz: 2, // 31/12 a 31/12 (1) + 08/01 (1)
    daysBefore: 1, 
    daysAfter: 1, 
    risk: 'Muito Alto',
    riskColor: 'text-amber-600 bg-amber-100 border-amber-400/20',
    badge: 'Imigração Crítica',
    desc: 'CONEXÃO IMPOSSÍVEL NA PRÁTICA! O voo da Flybondi sai às 09:20 de 01/01 de Puerto Iguazú. Chegando em Foz no dia 31/12, você teria que cruzar a fronteira de madrugada no Ano Novo ou de manhã cedinho em pleno feriado nacional de 01/01. Altíssimo risco de perder o voo por filas aduaneiras e escassez de transportes.',
    recommended: false,
    label: 'Opção 5'
  },
  {
    dates: '31/12 a 09/01',
    est1Price: 1136,
    est2Price: 466,
    totalPrice: 1602,
    totalDays: 9,
    daysBA: 6,
    daysFoz: 3, // 01/01 antes do voo (0) + 08/01 a 09/01 (3)
    daysBefore: 0, 
    daysAfter: 3, 
    risk: 'Muito Alto',
    riskColor: 'text-amber-600 bg-amber-100 border-amber-400/20',
    badge: 'Risco no Ano Novo',
    desc: 'Conexão crítica de fronteira na virada do ano de 31/12 para 01/01 de manhã.',
    recommended: false,
    label: 'Opção 6'
  },
  {
    dates: '31/12 a 11/01',
    est1Price: 1136,
    est2Price: 466,
    totalPrice: 1602,
    totalDays: 11,
    daysBA: 6,
    daysFoz: 5,
    daysBefore: 0, 
    daysAfter: 5, 
    risk: 'Muito Alto',
    riskColor: 'text-amber-600 bg-amber-100 border-amber-400/20',
    badge: 'Risco no Ano Novo',
    desc: 'Conexão internacional no dia 01/01 às 09:20. Imigração da ponte internacional com regime de plantão no feriado.',
    recommended: false,
    label: 'Opção 7'
  },
  {
    dates: '31/12 a 12/01',
    est1Price: 1136,
    est2Price: 466,
    totalPrice: 1602,
    totalDays: 12,
    daysBA: 6,
    daysFoz: 6,
    daysBefore: 0, 
    daysAfter: 6, 
    risk: 'Muito Alto',
    riskColor: 'text-amber-600 bg-amber-100 border-amber-400/20',
    badge: 'Risco no Ano Novo',
    desc: 'Fronteira com alta probabilidade de provocar atrasos e perda do bilhete da Flybondi.',
    recommended: false,
    label: 'Opção 8'
  },
  {
    dates: '31/12 a 13/01',
    est1Price: 1044,
    est2Price: 466,
    totalPrice: 1510,
    totalDays: 13,
    daysBA: 6,
    daysFoz: 7,
    daysBefore: 0, 
    daysAfter: 7, 
    risk: 'Muito Alto',
    riskColor: 'text-amber-600 bg-amber-100 border-amber-400/20',
    badge: 'Risco no Ano Novo',
    desc: 'Altíssimo risco de colapso no cronograma inicial pela travessia na manhã de 01/01.',
    recommended: false,
    label: 'Opção 9'
  }
];

const FlightList: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedTrip, setSelectedTrip] = React.useState<any>(null);
  const [activeTab, setActiveTab] = React.useState<'ida' | 'volta'>('ida');
  const [selectedPlan, setSelectedPlan] = React.useState<'A' | 'B' | 'C'>('A');
  const [selectedOptionIdx, setSelectedOptionIdx] = React.useState<number>(1);

  const [openBoardingPass, setOpenBoardingPass] = React.useState(false);
  const [selectedPassPassenger, setSelectedPassPassenger] = React.useState<number>(0); // 0 = Andre, 1 = Marcelly
  const [selectedPassDirection, setSelectedPassDirection] = React.useState<'ida' | 'volta'>('ida');
  const [showEmdReceipt, setShowEmdReceipt] = React.useState(false);
  const [showSeatMap, setShowSeatMap] = React.useState(false);
  
  // Seat selection state
  const [chosenSeats, setChosenSeats] = React.useState<Record<string, string>>({
    'ida-0': '', // Andre Ida
    'ida-1': '', // Marcelly Ida
    'volta-0': '', // Andre Volta
    'volta-1': '', // Marcelly Volta
  });

  // Check-in status
  const [checkinDone, setCheckinDone] = React.useState<Record<string, boolean>>({
    'ida': false,
    'volta': false,
  });

  React.useEffect(() => {
    const saved = localStorage.getItem('selected_trip');
    if (saved) {
      try {
        setSelectedTrip(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const isSalvadorAracaju = selectedTrip?.id === 'am_sp_ssa_aju';
  const isFozBa = selectedTrip?.id === 'am_foz_ass_ba';

  const rawFlight = React.useMemo(() => {
    return {
      id: 'salvador-ida',
      type: 'ida',
      title: 'Ida: Rio de Janeiro (GIG) → Salvador (SSA)',
      bookingReference: 'HQWSNK',
      provider: 'GOL Linhas Aéreas',
      baggage: 'Mala de mão 10kg inclusa • Mochila inclusa',
      financials: { 
        total: 'R$ 1.394,00 (Total Ida e Volta para 2 Pessoas)', 
        status: 'Confirmado' 
      },
      passengers: [{ name: 'André Victor' }, { name: 'Marcelly Bispo' }],
      legs: [
        {
          flightNumber: 'G3 1898',
          airline: 'GOL Linhas Aéreas',
          departure: { code: 'GIG', city: 'Rio de Janeiro', time: '23:20', date: 'Quinta-feira, 16 de Jul de 2026' },
          arrival: { code: 'SSA', city: 'Salvador', time: '01:25', date: 'Sexta-feira, 17 de Jul de 2026' },
          duration: '2h 05m',
          weatherDeparture: RIO_WEATHER_DEP,
          weatherArrival: SALVADOR_WEATHER_ARR
        }
      ]
    };
  }, []);

  const isSPRoute = selectedTrip?.id === 'am_sp_ssa_aju';

  const activeFlight = React.useMemo(() => {
    if (!isSalvadorAracaju || !rawFlight) return null;
    if (!isSPRoute) return rawFlight;
    const adapted = JSON.parse(JSON.stringify(rawFlight));
    if (activeTab === 'ida') {
      adapted.title = 'Ida: Campinas (VCP) → Salvador (SSA)';
      adapted.bookingReference = 'GOL-PV6WSE';
      adapted.legs[0].flightNumber = 'G3 2097 / G3 1898';
      adapted.legs[0].airline = 'GOL Linhas Aéreas (1 parada GIG)';
      adapted.legs[0].checkInTime = '17:40 (VCP - Viracopos)';
      adapted.legs[0].departure = { code: 'VCP', city: 'Campinas (Viracopos)', time: '19:40', date: 'Seg., 13 de jul.' };
      adapted.legs[0].arrival = { code: 'SSA', city: 'Salvador International', time: '01:25', date: 'Ter., 14 de jul.' };
      adapted.legs[0].duration = '5h 45m (Conexão GIG: 2h 35m)';
    } else {
      adapted.bookingReference = 'GOL-PV6WSE';
      if (selectedPlan === 'A') {
        adapted.title = 'Volta: Salvador (SSA) → Campinas (VCP)';
        adapted.legs[0].flightNumber = 'G3 1899 / G3 2094';
        adapted.legs[0].airline = 'GOL Linhas Aéreas (1 parada GIG)';
        adapted.legs[0].checkInTime = '09:05 (SSA)';
        adapted.legs[0].departure = { code: 'SSA', city: 'Salvador International', time: '11:05', date: 'Qua., 22 de jul.' };
        adapted.legs[0].arrival = { code: 'VCP', city: 'Campinas (Viracopos)', time: '17:55', date: 'Qua., 22 de jul.' };
        adapted.legs[0].duration = '6h 50m (Conexão GIG: 3h 20m)';
      } else if (selectedPlan === 'B') {
        adapted.title = 'Volta: Salvador (SSA) → Campinas (VCP)';
        adapted.legs[0].flightNumber = 'G3 1889 / G3 2096';
        adapted.legs[0].airline = 'GOL Linhas Aéreas (1 parada GIG)';
        adapted.legs[0].checkInTime = '01:05 (SSA de madrugada)';
        adapted.legs[0].departure = { code: 'SSA', city: 'Salvador International', time: '03:05', date: 'Sex., 24 de jul.' };
        adapted.legs[0].arrival = { code: 'VCP', city: 'Campinas (Viracopos)', time: '09:45', date: 'Sex., 24 de jul.' };
        adapted.legs[0].duration = '6h 40m (Conexão GIG: 3h 15m)';
      } else {
        adapted.title = 'Volta: Salvador (SSA) → Campinas (VCP)';
        adapted.legs[0].flightNumber = 'G3 1899 / G3 2094';
        adapted.legs[0].airline = 'GOL Linhas Aéreas (1 parada GIG)';
        adapted.legs[0].checkInTime = '03:05 (SSA)';
        adapted.legs[0].departure = { code: 'SSA', city: 'Salvador International', time: '05:05', date: 'Sáb., 25 de jul.' };
        adapted.legs[0].arrival = { code: 'VCP', city: 'Campinas (Viracopos)', time: '09:40', date: 'Sáb., 25 de jul.' };
        adapted.legs[0].duration = '4h 35m (Conexão GIG: 1h 10m)';
      }
    }
    return adapted;
  }, [rawFlight, isSPRoute, isSalvadorAracaju, activeTab, selectedPlan]);

  const comparisonAgencies = React.useMemo(() => {
    if (!isSPRoute) {
      return [
        { name: 'kiss&fly', logo: 'KF', desc: 'Melhor tarifa total garantida', price: 'R$ 618,00', promo: true },
        { name: 'LATAM', logo: 'LA', desc: 'Companhia Aérea', price: 'R$ 659,00', promo: false }
      ];
    }
    
    const secondAgency = selectedPlan === 'A' 
      ? { name: 'maxmilhas', logo: 'MM', desc: 'Tarifa Milhas', price: 'R$ 482,00', promo: false }
      : selectedPlan === 'B'
        ? { name: 'Decolar', logo: 'DC', desc: 'Operadora Parceira', price: 'R$ 522,00', promo: false }
        : { name: 'maxmilhas', logo: 'MM', desc: 'Tarifa Milhas', price: 'R$ 554,00', promo: false };

    return [
      { name: '123Milhas', logo: '123', desc: 'Passagem Promo (Tarifa Imagem)', price: 'R$ 478,00', promo: true },
      secondAgency,
      { name: 'ViajaNet', logo: 'VN', desc: 'Operadora Parceira', price: 'R$ 522,00', promo: false },
      { name: 'GOL', logo: 'GL', desc: 'Direto na Companhia', price: 'R$ 891,00', promo: false }
    ];
  }, [isSPRoute, selectedPlan]);

  const isColombia = selectedTrip?.id === 'am_bh_med_san' || selectedTrip?.name?.toLowerCase().includes('medellin');
  const isRioSan = selectedTrip?.id === 'am_rio_san';
  const isPlanoD = selectedTrip?.id === 'am_rio_foz_ba';

  const currentPlanoDTrips = React.useMemo(() => {
    if (!isPlanoD) return [];
    const activeOption = PLANO_D_OPTIONS[selectedOptionIdx];
    const dateStart = activeOption.dates.split(' a ')[0];
    const dateEnd = activeOption.dates.split(' a ')[1];
    
    return [
      {
        id: 'plano-d-trecho1',
        type: 'ida',
        title: `Ida: Rio de Janeiro (GIG) → Foz do Iguaçu (IGU)`,
        bookingReference: 'ETAPA 1 (A COORDENAR)',
        provider: 'GOL / LATAM (Reserva Individual)',
        baggage: 'Mala de de mão 10kg inclusa • Mochila inclusa',
        financials: { 
          total: `R$ ${activeOption.est1Price * 2},00 (Total para 2 Pessoas) — R$ ${activeOption.est1Price},00 por pessoa`, 
          status: 'Passagem Proposta' 
        },
        passengers: [{ name: 'André Victor' }, { name: 'Marcelly Bispo' }],
        legs: [
          {
            flightNumber: 'G3 1920',
            airline: 'GOL Linhas Aéreas',
            checkInTime: '05:40',
            departure: { code: 'GIG', city: 'Galeão, Rio de Janeiro', time: '07:40', date: `${dateStart}/2026` },
            arrival: { code: 'IGU', city: 'Foz do Iguaçu', time: '09:50', date: `${dateStart}/2026` },
            duration: '2h 10m',
            weatherArrival: { tempMax: 32, tempMin: 22, feelsLike: 35, humidity: 75, rainProb: 30, condition: "Predomínio de sol" }
          }
        ]
      },
      {
        id: 'plano-d-trecho2',
        type: 'interno',
        title: 'Voo Ida Interno: Puerto Iguazú (IGR) → Buenos Aires (AEP)',
        bookingReference: 'ETAPA 2 (SUGERIDO)',
        provider: 'Flybondi (Low-Cost)',
        baggage: 'Mochila pessoal inclusa • Cabine cobrada à parte',
        financials: { 
          total: `R$ 932,05 (Total para 2 Pessoas) — R$ 466,00 por pessoa (Ida e Volta Completo)`, 
          status: 'Flybondi Direto' 
        },
        passengers: [{ name: 'André Victor' }, { name: 'Marcelly Bispo' }],
        legs: [
          {
            flightNumber: 'FO 5100',
            airline: 'Flybondi (Low-Cost)',
            checkInTime: '07:20',
            departure: { code: 'IGR', city: 'Puerto Iguazú, Arg', time: '09:20', date: '01/01/2027 (Sexta-feira)' },
            arrival: { code: 'AEP', city: 'Aeroparque, Buenos Aires', time: '11:10', date: '01/01/2027 (Sexta-feira)' },
            duration: '1h 50m',
            weatherArrival: { tempMax: 30, tempMin: 21, feelsLike: 31, humidity: 60, rainProb: 15, condition: "Ensolarado" }
          }
        ]
      },
      {
        id: 'plano-d-trecho3',
        type: 'interno',
        title: 'Voo Volta Interno: Buenos Aires (AEP) → Puerto Iguazú (IGR)',
        bookingReference: 'ETAPA 2 (SUGERIDO)',
        provider: 'Flybondi (Low-Cost)',
        baggage: 'Mochila pessoal inclusa • Cabine cobrada à parte',
        financials: { 
          total: `R$ 932,05 (Total para 2 Pessoas) — R$ 466,00 por pessoa (Ida e Volta Completo)`, 
          status: 'Flybondi Direto' 
        },
        passengers: [{ name: 'André Victor' }, { name: 'Marcelly Bispo' }],
        legs: [
          {
            flightNumber: 'FO 5101',
            airline: 'Flybondi (Low-Cost)',
            checkInTime: '09:40',
            departure: { code: 'AEP', city: 'Aeroparque, Buenos Aires', time: '11:40', date: '07/01/2027 (Quinta-feira)' },
            arrival: { code: 'IGR', city: 'Puerto Iguazú, Arg', time: '13:35', date: '07/01/2027 (Quinta-feira)' },
            duration: '1h 55m',
            weatherArrival: { tempMax: 31, tempMin: 22, feelsLike: 33, humidity: 75, rainProb: 25, condition: "Predomínio de sol" }
          }
        ]
      },
      {
        id: 'plano-d-trecho4',
        type: 'volta',
        title: 'Volta: Foz do Iguaçu (IGU) → Rio de Janeiro (GIG)',
        bookingReference: 'ETAPA 1 (A COORDENAR)',
        provider: 'GOL / LATAM (Reserva Individual)',
        baggage: 'Mala de de mão 10kg inclusa • Mochila inclusa',
        financials: { 
          total: 'Incluso na Ida', 
          status: 'Passagem Proposta' 
        },
        passengers: [{ name: 'André Victor' }, { name: 'Marcelly Bispo' }],
        legs: [
          {
            flightNumber: 'G3 1921',
            airline: 'GOL Linhas Aéreas',
            checkInTime: '19:05',
            departure: { code: 'IGU', city: 'Foz do Iguaçu', time: '21:05', date: `${dateEnd}/2027` },
            arrival: { code: 'GIG', city: 'Galeão, Rio de Janeiro', time: '23:10', date: `${dateEnd}/2027` },
            duration: '2h 05m',
            weatherArrival: { tempMax: 26, tempMin: 19, feelsLike: 27, humidity: 70, rainProb: 10, condition: "Agradável" }
          }
        ]
      }
    ];
  }, [isPlanoD, selectedOptionIdx]);

  // DIGITAL BOARDING PASS WALLET (GOL LINHAS AÉREAS)
  const renderBoardingPassModal = () => {
    if (!openBoardingPass) return null;

    const passengers = [
      { name: "ANDRE VICTOR BRITO DE ANDRADE", ticket: "1272306987554", type: "ADT" },
      { name: "MARCELLY BISPO PEREIRA DA SILVA", ticket: "1272306987555", type: "ADT" }
    ];

    const currentPassengerObj = passengers[selectedPassPassenger];
    
    const legsData = {
      ida: {
        flight: "G3 1898",
        aircraft: "BOEING 737 MAX",
        class: "O (Econômica)",
        fromCode: "GIG",
        fromName: "Galeão - Rio de Janeiro, RJ (T2)",
        toCode: "SSA",
        toName: "Deputado Luís Eduardo Magalhães - Salvador, BA",
        date: "16 JUL 2026",
        depTime: "23:20",
        arrTime: "01:25",
        boarding: "22:40",
        gate: "T2 - B22",
        group: "Grupo 3",
        duration: "2h 05m"
      },
      volta: {
        flight: "G3 1865",
        aircraft: "BOEING 737-800 JET",
        class: "O (Econômica)",
        fromCode: "SSA",
        fromName: "Deputado Luís Eduardo Magalhães - Salvador, BA",
        toCode: "GIG",
        toName: "Galeão - Rio de Janeiro, RJ (T2)",
        date: "23 JUL 2026",
        depTime: "05:50",
        arrTime: "07:55",
        boarding: "05:10",
        gate: "Portão 11",
        group: "Grupo 3",
        duration: "2h 05m"
      }
    };

    const currentLeg = legsData[selectedPassDirection];
    const isChecked = checkinDone[selectedPassDirection];
    const seatKey = `${selectedPassDirection}-${selectedPassPassenger}`;
    const currentSeat = chosenSeats[seatKey] || "";

    // Blocked seats for visual density and realism
    const blockedSeats = ['12A', '12C', '14C', '14E', '15B', '15E', '16A', '16D', '17C', '17F', '18A', '18B', '18D'];

    // Local state inside the modal for seat choice session
    const handleSeatSelect = (seatCode: string) => {
      setChosenSeats(prev => ({
        ...prev,
        [`${selectedPassDirection}-${selectedPassPassenger}`]: seatCode
      }));
    };

    const completeCheckin = () => {
      const p0Seat = chosenSeats[`${selectedPassDirection}-0`];
      const p1Seat = chosenSeats[`${selectedPassDirection}-1`];
      if (!p0Seat || !p1Seat) {
        alert("Por favor, selecione os assentos para ambos os passageiros antes de concluir o check-in!");
        return;
      }
      setCheckinDone(prev => ({
        ...prev,
        [selectedPassDirection]: true
      }));
      setShowSeatMap(false);
    };

    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto font-sans"
        >
          {/* Custom style for scanner bar */}
          <style>{`
            @keyframes scanAnimation {
              0% { top: 4%; }
              50% { top: 96%; }
              100% { top: 4%; }
            }
            .laser-line-anim {
              animation: scanAnimation 3s infinite linear;
            }
          `}</style>

          {/* Smartphone Frame mockup */}
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-[#0B0F19] w-full max-w-md h-full sm:h-[840px] sm:rounded-[40px] sm:border-[8px] sm:border-slate-800 shadow-2xl overflow-hidden relative flex flex-col"
          >
            {/* Top Phone Header Bezel Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-slate-800 rounded-full mr-2"></div>
              <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
            </div>

            {/* Simulated Phone Status Bar */}
            <div className="pt-7 px-6 pb-2 flex justify-between items-center text-[11px] text-slate-400 font-bold tracking-tight bg-[#FF6600]">
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-semibold bg-white/20 px-1 py-0.5 rounded-sm">5G</span>
                <div className="flex gap-0.5 items-end h-2.5">
                  <div className="w-0.5 h-1 bg-slate-200"></div>
                  <div className="w-0.5 h-1.5 bg-slate-200"></div>
                  <div className="w-0.5 h-2 bg-slate-200"></div>
                  <div className="w-0.5 h-2.5 bg-slate-200"></div>
                </div>
                <div className="w-5 h-2.5 border border-slate-300 rounded-sm p-0.5 flex items-center">
                  <div className="w-3 h-full bg-emerald-400 rounded-2xs"></div>
                </div>
              </div>
            </div>

            {/* GOL App Header Navigation */}
            <div className="bg-[#FF6600] px-5 pb-5 text-white shadow-md relative">
              <div className="flex justify-between items-center mb-3">
                <button 
                  onClick={() => {
                    if (showSeatMap) {
                      setShowSeatMap(false);
                    } else if (showEmdReceipt) {
                      setShowEmdReceipt(false);
                    } else {
                      setOpenBoardingPass(false);
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                >
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-200 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-100 font-mono">GOL WALLET</span>
                </div>
                <div className="w-8"></div> {/* Spacer */}
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-black tracking-tight font-display">Cartão de Embarque</h3>
                  <p className="text-xs text-orange-100 mt-0.5 font-semibold">Localizador: <strong className="font-mono text-white text-sm bg-orange-800/40 px-2 py-0.5 rounded">{legsData.ida.fromCode === "GIG" ? "HQWSNK" : "HQWSNK"}</strong></p>
                </div>
                {/* Logo GOL */}
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-black tracking-tighter">G</div>
                  <div className="w-7 h-7 rounded-full bg-white/20 -ml-2.5 flex items-center justify-center text-xs font-black tracking-tighter border-2 border-[#FF6600]">O</div>
                </div>
              </div>
            </div>

            {/* Scrollable Smartphone Screen area */}
            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 space-y-4 pb-24">
              
              {/* SCREEN FLOW 1: SEAT MAP SELECTOR */}
              {showSeatMap && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 rounded-3xl p-5 border border-slate-800 relative space-y-6"
                >
                  <div className="text-center">
                    <span className="text-[10px] bg-orange-500/10 text-[#FF6600] px-2.5 py-1 rounded-full font-mono font-black border border-orange-500/20">BOEING 737 MAX</span>
                    <h4 className="text-base font-black text-white mt-1.5">Selecione seu Assento GOL</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Voo {currentLeg.flight} | {currentLeg.fromCode} ➔ {currentLeg.toCode}</p>
                  </div>

                  {/* Passenger selector within seat map */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                    {passengers.map((p, idx) => {
                      const passSeat = chosenSeats[`${selectedPassDirection}-${idx}`];
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedPassPassenger(idx)}
                          className={`py-2 px-3 rounded-xl flex flex-col items-center justify-center transition-all ${selectedPassPassenger === idx ? 'bg-[#FF6600] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                          <span className="text-[9.5px] font-bold tracking-wider truncate max-w-full uppercase">{p.name.split(' ')[0]}</span>
                          <span className="text-[10.5px] font-black font-mono mt-0.5">
                            {passSeat ? `Assento ${passSeat}` : "Selecionar..."}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Airplane cabin mockup visual */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/60 max-w-xs mx-auto space-y-5 relative">
                    {/* Airplane nose mockup outline */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-800 rounded-full"></div>
                    <div className="text-center text-[10px] font-bold text-slate-500 tracking-widest font-mono uppercase">
                      ▲ FRENTE DO AVIÃO ▲
                    </div>

                    {/* Column Headers */}
                    <div className="grid grid-cols-7 gap-1.5 text-center text-[10.5px] font-black text-slate-400 font-mono">
                      <span>A</span>
                      <span>B</span>
                      <span>C</span>
                      <span className="text-slate-600">|</span>
                      <span>D</span>
                      <span>E</span>
                      <span>F</span>
                    </div>

                    {/* Cabin Row Grid */}
                    <div className="space-y-3">
                      {[12, 14, 15, 16, 17, 18].map((rowNum) => {
                        const isEspacoMais = rowNum === 12;
                        return (
                          <div key={rowNum} className="grid grid-cols-7 gap-1.5 items-center">
                            {['A', 'B', 'C', 'CORREDOR', 'D', 'E', 'F'].map((col) => {
                              if (col === 'CORREDOR') {
                                return (
                                  <span key={col} className="text-[10.5px] font-mono text-slate-600 font-bold text-center">
                                    {rowNum}
                                  </span>
                                );
                              }

                              const seatCode = `${rowNum}${col}`;
                              const isOccupied = blockedSeats.includes(seatCode);
                              
                              // Check who has selected this seat
                              const selectedByAndre = chosenSeats[`${selectedPassDirection}-0`] === seatCode;
                              const selectedByMarcelly = chosenSeats[`${selectedPassDirection}-1`] === seatCode;

                              let seatStyle = "border border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-500";
                              if (isEspacoMais) {
                                seatStyle = "border-2 border-[#FF6600]/40 bg-orange-950/20 text-orange-200 hover:border-[#FF6600]";
                              }
                              if (isOccupied) {
                                seatStyle = "bg-slate-800 text-slate-600 border-transparent cursor-not-allowed text-[10px]";
                              }
                              if (selectedByAndre) {
                                seatStyle = "bg-emerald-500 text-slate-950 font-black border-transparent shadow-md shadow-emerald-500/20";
                              }
                              if (selectedByMarcelly) {
                                seatStyle = "bg-cyan-400 text-slate-950 font-black border-transparent shadow-md shadow-cyan-400/20";
                              }

                              return (
                                <button
                                  key={col}
                                  disabled={isOccupied}
                                  onClick={() => handleSeatSelect(seatCode)}
                                  className={`aspect-square w-full rounded-md flex items-center justify-center text-[10.5px] font-bold tracking-tighter transition-all duration-150 ${seatStyle}`}
                                >
                                  {selectedByAndre ? "A" : selectedByMarcelly ? "M" : isOccupied ? "✕" : col}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-900 text-[9px] text-slate-400">
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className="w-3 h-3 rounded bg-emerald-500 block"></span>
                        <span>André (A)</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className="w-3 h-3 rounded bg-cyan-400 block"></span>
                        <span>Marcelly (M)</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className="w-3 h-3 rounded bg-orange-950/20 border border-[#FF6600]/40 block"></span>
                        <span>Espaço+ GOL</span>
                      </div>
                    </div>
                  </div>

                  {/* Seat Selection CTA */}
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={completeCheckin}
                      className="w-full bg-[#FF6600] hover:bg-[#E05000] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#FF6600]/25"
                    >
                      CONFIRMAR SELEÇÃO DE ASSENTOS
                    </button>
                    <button
                      onClick={() => setShowSeatMap(false)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition"
                    >
                      VOLTAR AO BILHETE
                    </button>
                  </div>
                </motion.div>
              )}


              {/* SCREEN FLOW 2: EMD RECEIPTS INVOICE */}
              {showEmdReceipt && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-5 text-slate-900 shadow-2xl relative space-y-6 font-mono leading-relaxed"
                >
                  <div className="border-b-2 border-dashed border-slate-300 pb-4 text-center">
                    <div className="flex justify-center items-center gap-1 mb-2">
                      <div className="w-6 h-6 rounded-full bg-[#FF6600] flex items-center justify-center text-[10px] font-black text-white">G</div>
                      <div className="w-6 h-6 rounded-full bg-[#FF6600] -ml-2 flex items-center justify-center text-[10px] font-black text-white border border-white">O</div>
                      <span className="font-sans font-black text-slate-800 text-sm ml-1">GOL LINHAS AÉREAS</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900 tracking-wider">RECIBO DE DOCUMENTO ELETRÔNICO (EMD)</h4>
                    <p className="text-[10px] text-slate-500">EMITIDO EM: 01 JUL 2026 - 15:42 BRT</p>
                  </div>

                  {/* Document metadata table */}
                  <div className="text-[11.5px] space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p><strong>NÚMERO DO EMD:</strong> 1274442020507</p>
                    <p><strong>LOCALIZADOR DA RESERVA:</strong> HQWSNK</p>
                    <p><strong>PASSAGEIRO:</strong> BRITO DE ANDRADE/ANDRE VICTOR</p>
                    <p><strong>CIA EMISSORA:</strong> GOL LINHAS AEREAS S/A</p>
                    <p><strong>AGENTE EMISSOR:</strong> SSW COMPANHIA WEB / GOL</p>
                  </div>

                  {/* Invoice itemized details */}
                  <div className="space-y-2 text-xs">
                    <p className="font-bold border-b border-slate-300 pb-1 text-slate-800">SERVIÇO ADICIONAL CONTRATADO</p>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">ASSENTO ESPAÇO+ GOL</p>
                        <p className="text-[10px] text-slate-500">Trecho: GIG ➔ SSA | Assento: 14A</p>
                        <p className="text-[10px] text-slate-500">Código do Motivo: PAY 6MO INT 1 99PCT / D</p>
                      </div>
                      <span className="font-black">BRL 43,02</span>
                    </div>
                    <div className="flex justify-between items-start pt-2 border-t border-slate-100">
                      <div>
                        <p className="font-bold">ASSENTO ESPAÇO+ GOL</p>
                        <p className="text-[10px] text-slate-500">Trecho: GIG ➔ SSA | Assento: 14B</p>
                        <p className="text-[10px] text-slate-500">Código do Motivo: PAY 6MO INT 1 99PCT / D</p>
                      </div>
                      <span className="font-black">BRL 43,02</span>
                    </div>
                  </div>

                  {/* Total pricing */}
                  <div className="bg-slate-900 text-white p-3.5 rounded-xl flex justify-between items-center">
                    <span className="font-black text-xs tracking-wider">VALOR TOTAL DO EMD:</span>
                    <span className="font-mono font-black text-sm text-emerald-400">BRL 86,04</span>
                  </div>

                  {/* Payment method info */}
                  <div className="text-[10.5px] text-slate-600 space-y-1 pt-1 border-t border-slate-200">
                    <p className="font-bold uppercase text-slate-800 text-[11px] mb-1">MÉTODO DE PAGAMENTO</p>
                    <p>FORMA: CARTÃO DE CRÉDITO - MASTERCARD</p>
                    <p>NÚMERO: XXXXXXXXXXXX-6758</p>
                    <p>OPERAÇÃO: AUTORIZADO ONLINE DEBITO DIRETO</p>
                    <p>PARCELAMENTO: 06X FIXAS DE BRL 14,34</p>
                  </div>

                  <button
                    onClick={() => setShowEmdReceipt(false)}
                    className="w-full bg-[#FF6600] hover:bg-[#E05000] text-white py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all font-sans"
                  >
                    FECHAR DETALHES DE FATURAMENTO
                  </button>
                </motion.div>
              )}


              {/* SCREEN FLOW 3: WALLET CARDS OVERVIEW */}
              {!showSeatMap && !showEmdReceipt && (
                <div className="space-y-4">
                  {/* Passenger Switching Pills */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
                    {passengers.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPassPassenger(idx)}
                        className={`py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${selectedPassPassenger === idx ? 'bg-[#FF6600] text-white shadow' : 'bg-transparent text-slate-400 hover:text-slate-200'}`}
                      >
                        {p.name.split(' ')[0]} {p.name.split(' ')[1]}
                      </button>
                    ))}
                  </div>

                  {/* Trecho Segment Selector */}
                  <div className="flex border-b border-slate-900 text-xs">
                    <button
                      onClick={() => setSelectedPassDirection('ida')}
                      className={`flex-1 py-3 text-center font-bold uppercase tracking-wider transition relative ${selectedPassDirection === 'ida' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Ida: G3 1898
                      {selectedPassDirection === 'ida' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6600]"></span>}
                    </button>
                    <button
                      onClick={() => setSelectedPassDirection('volta')}
                      className={`flex-1 py-3 text-center font-bold uppercase tracking-wider transition relative ${selectedPassDirection === 'volta' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Volta: G3 1865
                      {selectedPassDirection === 'volta' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6600]"></span>}
                    </button>
                  </div>

                  {/* Warning banner when checkin is pending */}
                  {!isChecked && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 items-start animate-pulse">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">CHECK-IN PENDENTE</h4>
                        <p className="text-[10.5px] text-slate-300 mt-1 leading-relaxed">
                          Os cartões de embarque e os códigos QR não foram gerados porque seu assento ainda não foi confirmado na aeronave.
                        </p>
                        <button
                          onClick={() => setShowSeatMap(true)}
                          className="mt-2 flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition"
                        >
                          <Armchair className="w-3.5 h-3.5" /> ESCOLHER SEU ASSENTO AGORA
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actual Boarding Ticket component */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-lg">
                    {/* Upper side color tab */}
                    <div className="bg-gradient-to-r from-[#FF6600] to-orange-500 h-2 w-full"></div>

                    <div className="p-5 space-y-4">
                      {/* Brand name & Flight details */}
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-black text-[#FF6600]">G3</span>
                          <span className="text-slate-500 font-bold">| Voo {currentLeg.flight}</span>
                        </div>
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[10.5px] font-bold">
                          CABINE: {currentLeg.class}
                        </span>
                      </div>

                      {/* Airport IATA segment large view */}
                      <div className="flex justify-between items-center py-2 relative">
                        {/* Dot connectors */}
                        <div className="absolute top-1/2 left-12 right-12 h-0.5 border-t border-dashed border-slate-700 -translate-y-1/2 z-0"></div>
                        
                        <div className="text-left z-10 relative bg-slate-900 pr-3">
                          <h2 className="text-3xl font-black text-white font-display tracking-tight">{currentLeg.fromCode}</h2>
                          <p className="text-[10px] text-slate-400 font-bold truncate max-w-[100px]">{currentLeg.fromName.split(' - ')[0]}</p>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center z-10 text-[#FF6600]">
                          <Plane className="w-4 h-4 transform rotate-90" />
                        </div>

                        <div className="text-right z-10 relative bg-slate-900 pl-3">
                          <h2 className="text-3xl font-black text-white font-display tracking-tight">{currentLeg.toCode}</h2>
                          <p className="text-[10px] text-slate-400 font-bold truncate max-w-[100px]">{currentLeg.toName.split(' - ')[0]}</p>
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 pt-3 border-t border-slate-800 text-xs">
                        <div>
                          <p className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">DATA DO VOO</p>
                          <p className="font-black text-slate-200 mt-0.5">{currentLeg.date}</p>
                        </div>
                        <div>
                          <p className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">PARTIDA ESTIMADA</p>
                          <p className="font-black text-slate-200 mt-0.5">{currentLeg.depTime}</p>
                        </div>
                        <div>
                          <p className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">CHEGADA ESTIMADA</p>
                          <p className="font-black text-slate-200 mt-0.5">{currentLeg.arrTime}</p>
                        </div>
                        <div>
                          <p className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">DURAÇÃO</p>
                          <p className="font-black text-slate-200 mt-0.5">{currentLeg.duration}</p>
                        </div>
                      </div>

                      {/* Dashboard Cutout Ticket Border Notch */}
                      <div className="flex items-center justify-between mx--5 py-2">
                        <div className="w-5 h-5 rounded-full bg-slate-950 -ml-7 border-r border-slate-800"></div>
                        <div className="flex-1 border-t border-dashed border-slate-800"></div>
                        <div className="w-5 h-5 rounded-full bg-slate-950 -mr-7 border-l border-slate-800"></div>
                      </div>

                      {/* Boarding times and seats */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800/80">
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">PORTÃO</p>
                          <p className="font-black text-slate-200 text-xs mt-0.5 truncate">{currentLeg.gate}</p>
                        </div>
                        <div className="bg-orange-500/5 p-2.5 rounded-2xl border border-[#FF6600]/25">
                          <p className="text-[9px] text-[#FF6600] font-black uppercase tracking-wider">EMBARQUE</p>
                          <p className="font-black text-[#FF6600] text-sm mt-0.5">{currentLeg.boarding}</p>
                        </div>
                        <div className="bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800/80">
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">ASSENTO</p>
                          <p className={`font-black text-sm mt-0.5 ${currentSeat ? "text-emerald-400 font-mono" : "text-amber-500 font-semibold italic text-[11px]"}`}>
                            {currentSeat || "Não conf."}
                          </p>
                        </div>
                      </div>

                      {/* Group and Class */}
                      <div className="grid grid-cols-2 gap-3 text-center text-xs">
                        <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-800/60">
                          <span className="text-[9px] text-slate-500 font-bold uppercase">GRUPO DE EMBARQUE</span>
                          <p className="font-black text-slate-200 mt-0.5">{currentLeg.group}</p>
                        </div>
                        <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-800/60">
                          <span className="text-[9px] text-slate-500 font-bold uppercase">BAGAGENS INCLUSAS</span>
                          <p className="font-black text-emerald-400 mt-0.5">Mão (10kg) + Mochila</p>
                        </div>
                      </div>

                      {/* Passenger details section */}
                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs flex justify-between items-center">
                        <div>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">PASSAGEIRO</p>
                          <h4 className="font-black text-slate-200 uppercase truncate max-w-[190px]">{currentPassengerObj.name}</h4>
                          <p className="text-[9px] font-mono text-slate-400 mt-0.5">BILHETE: {currentPassengerObj.ticket} ({currentPassengerObj.type})</p>
                        </div>
                        <span className="text-[10px] bg-[#FF6600]/15 text-[#FF6600] border border-[#FF6600]/25 px-2 py-0.5 rounded-full font-bold uppercase">
                          G3 ADT
                        </span>
                      </div>

                      {/* BARCODE / QR CODE CONFLICT HANDLER */}
                      <div className="pt-4 border-t border-slate-800">
                        {isChecked ? (
                          <div className="space-y-4">
                            {/* Live QR Code Box with scanning laser light */}
                            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto relative overflow-hidden flex items-center justify-center border-4 border-emerald-500/20 shadow-lg">
                              {/* Laser glow bar */}
                              <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent laser-line-anim shadow-[0_0_10px_red] z-10"></div>
                              
                              <QrCode className="w-40 h-40 text-slate-950 z-0" />
                            </div>
                            <div className="text-center space-y-1">
                              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-black border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> VOO PRONTO PARA EMBARQUE
                              </span>
                              <p className="text-[10px] text-slate-500">Apresente este código no portão de embarque ou no leitor digital</p>
                            </div>

                            {/* Wallet Badges */}
                            <div className="flex gap-2 justify-center pt-2">
                              <button 
                                onClick={() => alert("Simulado: Cartão adicionado com sucesso à sua Apple Wallet!")}
                                className="flex items-center gap-1.5 bg-black text-white hover:bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-[10px] font-semibold transition"
                              >
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.48C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.1 16.67C20.08 16.74 19.67 18.11 18.71 19.5M15.97 4.17C16.63 3.37 17.07 2.28 16.95 1C15.85 1.04 14.51 1.73 13.73 2.65C13.07 3.41 12.49 4.52 12.64 5.78C13.87 5.87 15.12 5.17 15.97 4.17Z" />
                                </svg>
                                Add to Apple Wallet
                              </button>
                              <button 
                                onClick={() => alert("Simulado: Cartão adicionado com sucesso à sua Google Wallet!")}
                                className="flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800 border border-slate-800 rounded-lg px-3 py-2 text-[10px] font-semibold transition"
                              >
                                <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v2.28c.59-.35 1.27-.56 2-.56h14c.73 0 1.41.21 2 .56zM21 10.9V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-8.1c.59.35 1.27.56 2 .56h14c.73 0 1.41-.21 2-.56z" />
                                </svg>
                                Add to Google Pay
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center relative overflow-hidden group">
                            {/* Blur effect of barcode */}
                            <div className="w-44 h-16 mx-auto opacity-10 bg-slate-400 blur-sm flex flex-col justify-between p-1">
                              {Array.from({ length: 14 }).map((_, i) => (
                                <div key={i} className="h-full bg-slate-300" style={{ width: `${Math.random() * 4 + 1}px` }}></div>
                              ))}
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 p-4">
                              <span className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-[#FF6600] border border-orange-500/15 mb-2">
                                <QrCode className="w-4 h-4" />
                              </span>
                              <h5 className="text-[11px] font-black text-slate-300 uppercase tracking-wider">CÓDIGO QR BLOQUEADO</h5>
                              <p className="text-[9.5px] text-slate-500 max-w-[200px] mt-0.5 leading-tight">Escolha os assentos no check-in para liberar seu passe e QR code</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM PHONE NAVIGATION BAR FOR ADDITIONAL OPTIONS */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <button
                      onClick={() => setShowEmdReceipt(true)}
                      className="flex items-center justify-center gap-1.5 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold rounded-xl transition"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      RECIBO EMD (R$ 86,04)
                    </button>
                    <button
                      onClick={() => {
                        if (isChecked) {
                          alert("Aviso: Check-in já realizado! Deseja alterar seus assentos?");
                        }
                        setShowSeatMap(true);
                      }}
                      className="flex items-center justify-center gap-1.5 py-3 bg-[#FF6600]/10 border border-[#FF6600]/25 hover:bg-[#FF6600]/15 text-[#FF6600] font-black rounded-xl transition"
                    >
                      <Armchair className="w-4 h-4 text-[#FF6600]" />
                      {isChecked ? "ALTERAR ASSENTOS" : "SELECIONAR ASSENTO"}
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => {
                        alert("Simulando download do cartão de embarque em formato PDF...");
                        const link = document.createElement('a');
                        link.href = '#';
                        link.click();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 font-bold tracking-tight"
                    >
                      <Download className="w-3.5 h-3.5" /> Baixar Cartão em formato PDF (A4)
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Safe Area / Home indicator line */}
            <div className="bg-slate-950 py-3 flex justify-center items-center border-t border-slate-900 shrink-0">
              <div className="w-28 h-1 bg-slate-700 rounded-full"></div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  if (isSalvadorAracaju && activeFlight) {
    const leg = activeFlight.legs[0];
    const displayPrice = isSPRoute ? '478' : '618';

    return (
      <div className="pb-48">
        <CategoryHeader title="Voos e Conexões" onBack={onBack} />
        <div className="p-4 space-y-6">
        {/* GOLD STANDARD ULTRA-PREMIUM FLIGHT CARD CONTAINER */}
        <div id="flight_gold_card" className="bg-white border border-slate-200 rounded-[32px] p-6 text-slate-900 shadow-xl shadow-2xl relative overflow-hidden">
          
          {/* Header Layout Grid */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                ROTEIRO ATIVO DEDICADO
              </div>
              <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight uppercase">
                {isSPRoute ? 'SÃO PAULO + SALVADOR + ARACAJÚ' : 'SALVADOR + ARACAJÚ'}
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="bg-blue-100 text-blue-700 text-[9.5px] font-black uppercase px-2 py-0.5 rounded tracking-wider">MAPA COORDENADO</span>
                <span className="text-xs text-slate-500 font-bold tracking-wide">{leg.departure.code} ➔ {leg.arrival.code}</span>
              </div>
            </div>

            {/* Passagem Praticada Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full md:w-auto min-w-[280px]">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">PASSAGEM PRATICADA</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-sm font-black text-emerald-600">R$</span>
                    <span className="text-3xl font-display font-black text-slate-900 tracking-tight">{displayPrice}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{isSPRoute ? 'Melhor opção promocional' : 'Valores por passageiro'}</span>
                </div>
                <div className="text-right space-y-1">
                  <span className="inline-block bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-emerald-200 tracking-wider font-mono">CONSULTADO SUCESSO</span>
                  <p className="text-[9px] text-slate-500 font-bold font-mono">{isSPRoute ? 'Ref: 27 de Maio' : 'Atualizado: Hoje às 12:45'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Opções de Planejamento de Viagem (Plano A, B, C) */}
          {isSPRoute && (
            <div className="mb-6 p-4 bg-[#111827] rounded-[24px] border border-slate-200/85">
              <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase block mb-3 font-mono">
                ESCOLHA SEU PLANO DE VIAGEM (DURAÇÕES COMPATIVEIS COM PREÇO PROMOCIONAL)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { plan: 'A', label: 'Plano A (9 dias)', dates: '13 a 22 de Julho', desc: 'Preço promocional • R$ 478' },
                  { plan: 'B', label: 'Plano B (11 dias)', dates: '13 a 24 de Julho', desc: 'Preço promocional • R$ 478' },
                  { plan: 'C', label: 'Plano C (12 dias)', dates: '13 a 25 de Julho', desc: 'Preço promocional • R$ 478' }
                ].map((item) => (
                  <button
                    key={item.plan}
                    onClick={() => setSelectedPlan(item.plan as 'A' | 'B' | 'C')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedPlan === item.plan
                        ? 'bg-[#00c58e]/10 border-[#00c58e] text-slate-900 shadow-lg'
                        : 'bg-black/30 border-slate-200 hover:bg-slate-200/40 text-slate-500'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                      {selectedPlan === item.plan && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00c58e]"></span>
                      )}
                    </div>
                    <p className="text-[12px] font-black text-slate-900 leading-tight">{item.dates}</p>
                    <p className="text-[9.5px] font-medium text-slate-500 block mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Navigation/Direction Tabs */}
          <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-100 p-1.5 rounded-2xl border border-slate-900">
            <button 
              id="tab_ida_btn"
              onClick={() => setActiveTab('ida')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-wider ${activeTab === 'ida' ? 'bg-[#00c58e] text-slate-950 font-black shadow-lg shadow-[#00c58e]/20' : 'text-slate-500 hover:text-slate-900 hover:bg-white/5'}`}
            >
              <PlaneTakeoff className="w-4 h-4" /> SENTIDO IDA: {isSPRoute ? '13 JUL' : '11 JUL'}
            </button>
            <button 
              id="tab_volta_btn"
              onClick={() => setActiveTab('volta')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-wider ${activeTab === 'volta' ? 'bg-[#00c58e] text-slate-950 font-black shadow-lg shadow-[#00c58e]/20' : 'text-slate-500 hover:text-slate-900 hover:bg-white/5'}`}
            >
              <PlaneLanding className="w-4 h-4" /> SENTIDO VOLTA: {isSPRoute ? (selectedPlan === 'A' ? '22 JUL' : selectedPlan === 'B' ? '24 JUL' : '25 JUL') : '24 JUL'}
            </button>
          </div>

          <div className="flex flex-col gap-6 w-full items-stretch">
            {/* Left Box: Timeline details */}
            <div className="w-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">LINHA DO TEMPO DA VIAGEM</span>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-[#00c58e] animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {isSPRoute ? 'CONTÉM 1 CONEXÃO (GIG)' : 'VOO DIRETO SEM ESCALAS'}
                    </span>
                  </div>
                </div>

                {/* Vertical timeline detail matching design */}
                <div className="bg-[#111827] rounded-[24px] border border-slate-200 p-5 relative overflow-hidden mb-4 animate-in fade-in duration-350">
                  <div className="flex items-center gap-2.5 mb-5 flex-wrap">
                    <span className="bg-black text-slate-900 px-3 py-1 rounded-lg text-[10px] font-black font-mono tracking-wider border border-slate-200">{leg.flightNumber}</span>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wide">{leg.airline}</span>
                    <span className="text-slate-500 text-[11px] font-medium ml-auto flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {leg.duration}
                    </span>
                  </div>

                  {/* Time columns & vertical flow line */}
                  <div className="flex items-stretch gap-6 pl-1">
                    {/* Vertical line indicator */}
                    <div className="flex flex-col items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#00c58e] border-[3px] border-[#111827] ring-4 ring-[#00c58e]/20"></div>
                      <div className="flex-1 w-0.5 bg-gradient-to-b from-[#00c58e] to-rose-500 border-dashed border-l border-slate-200 my-1"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border-[3px] border-[#111827] ring-4 ring-rose-500/20"></div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4">
                      {/* Departure */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block">PARTIDA</span>
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-2xl font-black text-slate-900 leading-none">{leg.departure.time}</span>
                          <span className="text-sm font-black text-slate-500">{leg.departure.code}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] font-semibold leading-tight">{leg.departure.city}</p>
                        <p className="text-slate-500 text-[9px] font-medium font-mono">{leg.departure.date}</p>
                      </div>

                      {/* Arrival */}
                      <div className="space-y-1 pl-4 border-l border-slate-200">
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block">CHEGADA</span>
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-2xl font-black text-slate-900 leading-none">{leg.arrival.time}</span>
                          <span className="text-sm font-black text-slate-500">{leg.arrival.code}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] font-semibold leading-tight">{leg.arrival.city}</p>
                        <p className="text-slate-500 text-[9px] font-medium font-mono">{leg.arrival.date}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vertical Car Connection Pathway Connector */}
                <div className="flex flex-col items-center my-3 relative">
                  <div className="h-4 w-0.5 border-dashed border-l-2 border-slate-200"></div>
                  <div className="bg-slate-900 border border-slate-200 px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-400 shrink-0 font-mono flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-emerald-400" /> DESLOCAMENTO TERRESTRE (CARRO ALUGADO)
                  </div>
                  <div className="h-4 w-0.5 border-dashed border-l-2 border-slate-200"></div>
                </div>

                {/* CAR CONNECTION DETAIL CARD */}
                <div className="bg-[#111827] border border-emerald-500/10 rounded-[24px] p-5 relative overflow-hidden mb-4 animate-in slide-in-from-bottom duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="flex items-center gap-2.5 mb-5 flex-wrap">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-lg text-[9px] font-black tracking-wider uppercase flex items-center gap-1.5 font-mono">
                      CARRO • LOCARX
                    </span>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wide">Fiat Mobi ou similar</span>
                    <span className="text-emerald-400 text-xs font-black ml-auto flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" /> 4h 30m
                    </span>
                  </div>

                  {activeTab === 'ida' ? (
                    <div className="flex items-stretch gap-6 pl-1">
                      {/* Vertical line indicator */}
                      <div className="flex flex-col items-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-[3px] border-[#111827] ring-4 ring-emerald-500/20"></div>
                        <div className="flex-1 w-0.5 bg-gradient-to-b from-emerald-500 to-emerald-600 border-dashed border-l border-slate-200 my-1"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 border-[3px] border-[#111827] ring-4 ring-emerald-600/20"></div>
                      </div>

                      <div className="flex-1 grid grid-cols-2 gap-4">
                        {/* Departure (Salvador) */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block">RETIRADA SALVADOR</span>
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-2xl font-black text-slate-900 leading-none">08:00</span>
                            <span className="text-xs font-bold text-slate-500">SSA</span>
                          </div>
                          <p className="text-slate-500 text-[11px] font-semibold leading-tight">Loja de Aluguel de Carros (LocarX)</p>
                          <p className="text-slate-500 text-[9px] font-medium font-mono">14 de jul. de 2026</p>
                        </div>

                        {/* Arrival (Aracaju) */}
                        <div className="space-y-1 pl-4 border-l border-slate-200">
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block">CHEGADA ARACAJU</span>
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-2xl font-black text-slate-900 leading-none">12:30</span>
                            <span className="text-xs font-bold text-slate-500">AJU</span>
                          </div>
                          <p className="text-slate-500 text-[11px] font-semibold leading-tight">Hospedagem em Aracaju (Orla de Atalaia)</p>
                          <p className="text-slate-500 text-[9px] font-medium font-mono">14 de jul. de 2026</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-stretch gap-6 pl-1">
                      {/* Vertical line indicator */}
                      <div className="flex flex-col items-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-[3px] border-[#111827] ring-4 ring-emerald-400/20"></div>
                        <div className="flex-1 w-0.5 bg-gradient-to-b from-emerald-400 to-emerald-500 border-dashed border-l border-slate-200 my-1"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-[3px] border-[#111827] ring-4 ring-emerald-500/20"></div>
                      </div>

                      <div className="flex-1 grid grid-cols-2 gap-4">
                        {/* Departure (Aracaju) */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block">PARTIDA ARACAJU</span>
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-2xl font-black text-slate-900 leading-none">13:30</span>
                            <span className="text-xs font-bold text-slate-500">AJU</span>
                          </div>
                          <p className="text-slate-500 text-[11px] font-semibold leading-tight">Hospedagem em Aracaju (Orla de Atalaia)</p>
                          <p className="text-slate-500 text-[9px] font-medium font-mono">19 de jul. de 2026</p>
                        </div>

                        {/* Arrival (Salvador) */}
                        <div className="space-y-1 pl-4 border-l border-slate-200">
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block">DEVOLUÇÃO SALVADOR</span>
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-2xl font-black text-slate-900 leading-none">18:00</span>
                            <span className="text-xs font-bold text-slate-500">SSA</span>
                          </div>
                          <p className="text-slate-500 text-[11px] font-semibold leading-tight">Loja de Aluguel de Carros (LocarX)</p>
                          <p className="text-slate-500 text-[9px] font-medium font-mono">19 de jul. de 2026</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Seat and pricing details matching screenshot */}
                  <div className="mt-5 pt-4 border-t border-slate-200 flex justify-between items-center text-xs flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider font-mono">ROTA:</span>
                      <span className="font-extrabold text-slate-900 flex items-center gap-1">
                        ESTRADA LINHA VERDE <span className="bg-[#1e293b] text-emerald-400 border border-slate-200 text-[9.5px] px-2 py-0.5 rounded font-black font-mono">BA-099</span>
                      </span>
                    </div>
                    <div className="text-right flex items-center gap-2 ml-auto">
                      <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider font-mono">ALUGUEL:</span>
                      <p className="font-display font-black text-emerald-400 text-sm">INCLUSO</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather info for ports */}
              {(leg.weatherDeparture || leg.weatherArrival) && (
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200">
                  <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider font-mono mr-2">CLIMA:</span>
                  <div className="flex gap-2 overflow-x-auto">
                    {leg.weatherDeparture && <WeatherWidget weather={leg.weatherDeparture} label={leg.departure.code} compact={true} />}
                    {leg.weatherArrival && <WeatherWidget weather={leg.weatherArrival} label={leg.arrival.code} compact={true} />}
                  </div>
                </div>
              )}
            </div>
          </div>

            {/* Right Box: Baggage limits Panel */}
            <div className="w-full flex flex-col justify-between">
              <div className="bg-[#111827]/65 border border-slate-200 rounded-[24px] p-5 space-y-4">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Luggage className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">BAGAGENS INCLUSAS</h4>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">FRANQUIA POR BILHETE</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Laptop/Mochila item */}
                  <div className="bg-slate-100 rounded-xl border border-slate-200/80 p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-emerald-600 border border-slate-200">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-800">Artigo Pessoal (Mochila)</h5>
                        <p className="text-[10px] text-slate-500">Sob assento</p>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black px-2 py-1 rounded tracking-wider border border-emerald-200">INCLUSO</span>
                  </div>

                  {/* Cabin bag (10kg) */}
                  <div className="bg-slate-100 rounded-xl border border-slate-200/80 p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-emerald-600 border border-slate-200">
                        <Luggage className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-800">Bagagem de Mão (10kg)</h5>
                        <p className="text-[10px] text-slate-500">Compartimento superior</p>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black px-2 py-1 rounded tracking-wider border border-emerald-200">INCLUSO</span>
                  </div>

                  {/* Checked bag (23kg) - NO INC */}
                  <div className="bg-slate-100 rounded-xl border border-slate-200/80 p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-rose-500 border border-slate-200">
                        <Luggage className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-800">Mala Despachada (23kg)</h5>
                        <p className="text-[10px] text-slate-500">Despacho opcional no aeroporto</p>
                      </div>
                    </div>
                    <span className="bg-rose-500/15 text-rose-500 text-[9px] font-black px-2 py-1 rounded tracking-wider border border-rose-500/20">NÃO INC</span>
                  </div>
                </div>

                {/* Baggage notice at the bottom */}
                <div className="pt-2 flex gap-2 items-start text-[10px] text-slate-500 font-medium leading-relaxed">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>Valores e bagagens simulados via tarifas consolidadas pela inteligência. Emissão garantida sem nenhuma cobrança surpresa no balcão.</p>
                </div>
              </div>

              {/* Passenger list check */}
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Passageiros: <strong className="text-slate-900">André & Marcelly</strong></span>
                </div>
                <span className="text-[10px] bg-slate-200 text-slate-600 font-mono px-2 py-0.5 rounded">Voo Confirmado</span>
              </div>
            </div>
          </div>

          {/* Action button at bottom */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col gap-4">
            <button 
              id="open_boarding_pass_premium_btn"
              onClick={() => setOpenBoardingPass(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FF6600] hover:bg-[#E05000] text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-[#FF6600]/25 border border-[#FF6600]/20"
            >
              <Smartphone className="w-4 h-4 text-white" /> EMITIR CARTÕES DE EMBARQUE DIGITAL (GOL)
            </button>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[10.5px] text-slate-500 font-semibold">Localizador da Reserva: <strong className="font-mono text-slate-900 text-xs ml-1 bg-slate-200 px-2.5 py-1 rounded">{activeFlight.bookingReference}</strong></span>
              <button 
                id="edit_ticket_btn"
                onClick={() => alert('Para editar dados do bilhete, entre em contato com kiss&fly ou agência parceira.')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 border border-slate-200 hover:border-slate-500 rounded-xl transition-all font-black text-xs uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-slate-900"
              >
                EDITAR DADOS DO BILHETE
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic price list widget */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 text-slate-900 shadow-xl shadow-xl space-y-6">
          <div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1 font-mono font-black">
              {isSPRoute ? 'COTAÇÃO ATUALIZADA (PREÇO EM 27 DE MAIO DE 2026)' : 'COTAÇÃO ATUALIZADA (PASSAGEM IDA E VOLTA GIG ⇆ SSA)'}
            </span>
            <h2 className="text-2xl font-display font-black text-slate-900">Compare Opções de Reserva</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {comparisonAgencies.map((agency, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-between p-4 bg-slate-100 rounded-[20px] border transition-all ${
                  agency.promo ? 'border-[#00c58e]/35 bg-[#00c58e]/5 shadow-[0_0_15px_rgba(0,197,142,0.06)]' : 'border-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    agency.name === 'GOL' ? 'bg-orange-500 text-slate-900' : agency.promo ? 'bg-indigo-600 text-slate-900' : 'bg-slate-705 text-slate-800 bg-slate-200'
                  }`}>
                    {agency.logo}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{agency.name}</h4>
                    <p className="text-[10px] text-slate-500">{agency.desc}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2.5">
                  <span className={`font-display font-black text-base ${agency.promo ? 'text-emerald-600' : 'text-slate-350'}`}>
                    {agency.price}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider ${
                    agency.promo ? 'bg-[#00c58e] text-slate-950 font-black' : 'bg-white/5 text-slate-500'
                  }`}>
                    {agency.promo ? 'RESERVA' : 'COTAR'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {renderBoardingPassModal()}
      </div>
    );
  }

  const isSalvador = selectedTrip?.id === 'am_salvador_julho';
  const currentTrips = (isRioSan ? RIO_SAN_ANDRES_TRIPS : isColombia ? COLOMBIA_TRIPS : isSalvador ? SALVADOR_TRIPS : isSPRoute ? SSA_AJU_TRIPS : isPlanoD ? currentPlanoDTrips : FOZ_BA_TRIPS) as Trip[];

  if (isPlanoD) {
    const activeOption = PLANO_D_OPTIONS[selectedOptionIdx];
    return (
      <div className="pb-48">
        <CategoryHeader title="Voos e Conexões" onBack={onBack} />
        <div className="p-4 space-y-6">
          
          {/* TOP PANEL: ARCHITECTURAL DEVIATION AND SUMMARY */}
          <div id="plano_d_dashboard_top" className="bg-white border border-slate-200 rounded-[32px] p-6 text-slate-900 shadow-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-1.5 font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  ANÁLISE DE CENÁRIOS E CUSTO-BENEFÍCIO (PLANO D)
                </div>
                <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight uppercase">
                  Rio ⇄ Foz + Buenos Aires
                </h2>
                <p className="text-xs text-slate-500 font-medium max-w-2xl mt-1 leading-relaxed">
                  Esta viagem combina duas etapas aéreas independentes. Escolha entre os <strong className="text-slate-900">9 cenários</strong> abaixo para visualizar o cronograma de feriados de final de ano e os respectivos riscos de travessia da fronteira (Foz ⇄ Puerto Iguazú).
                </p>
              </div>

              {/* Passagem Praticada Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full md:w-auto min-w-[280px]">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-mono">TOTAL COMBINADO</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xs font-black text-emerald-600">R$</span>
                      <span className="text-3xl font-display font-black text-slate-900 tracking-tight">{activeOption.totalPrice}</span>
                      <span className="text-[10px] text-slate-500 font-bold ml-1 font-mono">/ pax</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">R$ {activeOption.totalPrice * 2} (para 2 Pessoas)</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="inline-block bg-[#10b981]/10 text-emerald-600 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-emerald-500/20 tracking-wider font-mono">SIMULAÇÃO ATIVA</span>
                    <p className="text-[9px] text-slate-500 font-bold font-mono">Opção {selectedOptionIdx + 1} de 9</p>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE COMPARATIVE MATRIX TABLE */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden mb-6">
              <div className="p-4 border-b border-slate-200 bg-white/40 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase font-mono">Matriz Comparativa das 9 Opções de Passagens Mapeadas</span>
                <span className="text-[9.5px] bg-emerald-100 text-emerald-700 font-black px-2.5 py-0.5 border border-[#10b981]/25 rounded-md uppercase font-mono">Clique para Selecionar</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] text-slate-500 font-mono border-b border-slate-100 uppercase">
                      <th className="p-3 pl-4">Opção</th>
                      <th className="p-3">Datas (Etapa 1)</th>
                      <th className="p-3">Passagem (Rio-Foz)</th>
                      <th className="p-3 font-bold text-center">Simulado (1p)</th>
                      <th className="p-3 font-bold text-center text-emerald-600">Total (2p)</th>
                      <th className="p-3 text-center">Dias Foz</th>
                      <th className="p-3 text-center">Risco Fronteira</th>
                      <th className="p-3 pr-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 font-medium">
                    {PLANO_D_OPTIONS.map((opt, idx) => {
                      const isActive = idx === selectedOptionIdx;
                      const isCritical = opt.risk === 'Muito Alto';
                      return (
                        <tr 
                          key={idx}
                          onClick={() => setSelectedOptionIdx(idx)}
                          className={`cursor-pointer transition-colors ${
                            isActive 
                              ? 'bg-slate-200/50 text-slate-900' 
                              : 'hover:bg-slate-200/15 text-slate-600'
                          }`}
                        >
                          <td className="p-3 pl-4 font-mono font-bold">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400' : 'bg-transparent'}`}></span>
                              {opt.label.split(' ')[0]} {idx + 1}
                            </div>
                          </td>
                          <td className="p-3 font-mono">{opt.dates}</td>
                          <td className="p-3 font-mono text-slate-500">R$ {opt.est1Price}</td>
                          <td className="p-3 text-center font-mono font-bold">R$ {opt.totalPrice}</td>
                          <td className="p-3 text-center font-mono font-bold text-emerald-600">R$ {opt.totalPrice * 2}</td>
                          <td className="p-3 text-center font-mono">{opt.daysFoz} dias</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono ${
                              isCritical 
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/15'
                            }`}>
                              {opt.risk}
                            </span>
                          </td>
                          <td className="p-3 pr-4 text-center font-mono">
                            {opt.recommended ? (
                              <span className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 text-[9.5px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">RECOMENDADO</span>
                            ) : isCritical ? (
                              <span className="bg-rose-500/15 text-rose-400 border border-rose-500/20 text-[9.5px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">LOGÍSTICA RUIM</span>
                            ) : (
                              <span className="text-slate-500 font-bold">Viável</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ANALYST DETAILED CONSULTING PROFILE CARD */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-600 font-mono">Diagnóstico da Opção Escolhida (Opção {selectedOptionIdx + 1})</span>
                </div>
                <div className="flex gap-2">
                  <span className="bg-slate-200 border border-slate-200 text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">
                    {activeOption.totalDays} DIAS TOTAIS
                  </span>
                  <span className={`border text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider font-mono ${
                    activeOption.risk === 'Muito Alto' ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' : 'bg-emerald-500/10 border-emerald-500/15 text-emerald-700'
                  }`}>
                    RISCO FRONTEIRA: {activeOption.risk.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111823] p-4 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase block mb-1 font-mono">DISTRIBUIÇÃO DE DIAS</span>
                  <p className="text-sm font-bold text-slate-900 mt-1.5"><strong className="text-cyan-300 text-lg">{activeOption.daysBA} dias</strong> em Buenos Aires</p>
                  <p className="text-xs text-slate-500 mt-1"><strong className="text-slate-900 font-semibold">{activeOption.daysFoz} dias</strong> livres para Foz e Puerto</p>
                  <p className="text-[9.5px] text-slate-500 font-mono mt-0.5">({activeOption.daysBefore} dias antes de BA • {activeOption.daysAfter} dia no retorno)</p>
                </div>

                <div className="bg-[#111823] p-4 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase block mb-1 font-mono">RISCO DE FRONTEIRA ADUANEIRA</span>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <span className={`text-xl font-black font-display font-mono ${activeOption.risk === 'Muito Alto' ? 'text-rose-400 animate-pulse' : 'text-emerald-600'}`}>
                      {activeOption.risk === 'Muito Alto' ? 'ALTO RISCO (99%)' : 'RISCO BAIXO'}
                    </span>
                    <AlertCircle className={`w-5 h-5 ${activeOption.risk === 'Muito Alto' ? 'text-rose-400' : 'text-emerald-600'}`} />
                  </div>
                  <p className="text-[10.5px] text-slate-500 mt-1.5 leading-tight">
                    {activeOption.risk === 'Muito Alto' 
                      ? 'Embarque em Puerto Iguazú no dia 01/01 exige travessia na manhã em pleno feriado nacional!' 
                      : 'Travessia em dias úteis/corridos (29/12) com excelente planejamento e tempo hábil.'}
                  </p>
                </div>

                <div className="bg-[#111823] p-4 rounded-xl border border-slate-200 text-center flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase block mb-1 font-mono">AVALIAÇÃO GERAL DO ANALISTA</span>
                    <span className="text-xs bg-slate-200 border border-slate-200 py-1 px-3 rounded-full inline-block mt-2 font-bold text-slate-600">
                      {activeOption.badge}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 mt-2 leading-relaxed">
                    Opção financeiramente super vantajosa. {activeOption.recommended ? 'Esta é a nossa recomendação número 1.' : ''}
                  </p>
                </div>
              </div>

              {/* DYNAMIC SCENARIO WARNING CARD */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                activeOption.risk === 'Muito Alto' 
                  ? 'bg-rose-500/5 border-rose-500/25 text-rose-200' 
                  : 'bg-emerald-500/5 border-emerald-500/15 text-emerald-200'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertCircle className={`w-4 h-4 shrink-0 ${activeOption.risk === 'Muito Alto' ? 'text-rose-400' : 'text-emerald-600'}`} />
                  <span className="font-extrabold font-mono tracking-wider uppercase">PARECER TÉCNICO SOBRE ESTE ROTEIRO</span>
                </div>
                {activeOption.desc}
              </div>
            </div>
          </div>

          {/* DYNAMICALLY LOADED FLIGHT CARDS */}
          <div className="space-y-4">
            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase font-mono block pl-1">
              ITINERÁRIO DETALHADO DO CLIENTE — OPÇÃO {selectedOptionIdx + 1} DE 9 (DATES: {activeOption.dates})
            </span>
            {currentTrips.map((trip: Trip) => (
              <div key={trip.id} className="bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-xl text-slate-900">
                <div className="p-5 border-b border-dashed border-slate-200/80 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest font-black uppercase ${
                      trip.type === 'ida' 
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/25' 
                        : trip.type === 'volta' 
                          ? 'bg-orange-600/25 text-orange-300 border border-orange-500/20' 
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                    }`}>
                      {trip.type === 'ida' ? 'ETAPA 1: IDA' : trip.type === 'volta' ? 'ETAPA 1: VOLTA' : 'ETAPA 2: VOO INTERNO'}
                    </span>
                    <span className="font-mono font-bold text-[10px] text-slate-500">{trip.bookingReference}</span>
                  </div>
                  <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                    {trip.type === 'ida' ? <PlaneTakeoff className="text-blue-600 w-5 h-5" /> : <PlaneLanding className="text-orange-400 w-5 h-5" />}
                    {trip.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono font-bold">{trip.provider}</p>
                </div>
                
                <div className="p-5 space-y-6">
                  {trip.legs.map((leg: FlightLeg, idx: number) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-dashed border-slate-200">
                      <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-white border-4 border-emerald-400"></div>
                      <div className="mb-3 flex justify-between items-center flex-wrap gap-2">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-md font-mono tracking-wider">
                          {leg.airline} - {leg.flightNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" /> {leg.duration}
                        </span>
                      </div>

                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-4">
                        <div className="flex items-center justify-between gap-6 max-w-md flex-1">
                          <div className="flex flex-col items-start">
                            <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-display font-black text-slate-900">{leg.departure.code}</p>
                              <p className="text-[11px] font-black text-emerald-600 font-mono">{leg.departure.time}</p>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium leading-tight">{leg.departure.city}</p>
                            <p className="text-[9px] text-slate-500 font-mono mt-0.5 font-bold">{leg.departure.date}</p>
                          </div>
                          <Plane className="w-5 h-5 text-slate-700" />
                          <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-display font-black text-slate-900">{leg.arrival.code}</p>
                              <p className="text-[11px] font-black text-orange-400 font-mono">{leg.arrival.time}</p>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium leading-tight">{leg.arrival.city}</p>
                            <p className="text-[9px] text-slate-500 font-mono mt-0.5 font-bold">{leg.arrival.date}</p>
                          </div>
                        </div>

                        {leg.weatherArrival && (
                          <div className="bg-white/5 border border-slate-200 rounded-2xl p-3 w-fit shrink-0 mt-3 md:mt-0">
                            <span className="text-[9px] font-black text-slate-500 tracking-wider block mb-1 font-mono uppercase">Previsão Destino ({leg.arrival.code})</span>
                            <div className="flex items-center gap-2">
                              <CloudSun className="w-5 h-5 text-amber-600" />
                              <div>
                                <p className="text-xs font-black text-slate-900">{leg.weatherArrival.tempMax}°C <span className="text-[10px] text-slate-500 font-bold">Max</span></p>
                                <p className="text-[9.5px] text-slate-500 font-mono font-medium">{leg.weatherArrival.condition} • Sente {leg.weatherArrival.feelsLike}°C</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/40 p-5 border-t border-slate-900 text-xs space-y-2.5">
                  <div className="flex items-start gap-2 text-slate-500"><Users className="w-4 h-4 text-slate-500" /> <span>{trip.passengers.map(p => p.name).join(' & ')}</span></div>
                  <div className="flex items-center gap-2 text-slate-500"><Luggage className="w-4 h-4 text-slate-500" /> <span>{trip.baggage}</span></div>
                  {trip.financials && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" /> 
                        <span className="font-bold text-slate-900 pr-2">Simulação Orçamentária:</span>
                        <span className="font-mono font-black text-emerald-600 text-sm">{trip.financials.total}</span>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-700 px-3 py-1 border border-emerald-500/15 rounded-md text-[10px] font-black uppercase font-mono">{trip.financials.status}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
        {renderBoardingPassModal()}
      </div>
    );
  }

  return (
    <div className="pb-48">
      <CategoryHeader title="Voos e Conexões" onBack={onBack} />
      <div className="p-4 space-y-6">
        {currentTrips.map((trip: Trip) => (
          <div key={trip.id} className={`rounded-3xl border-2 overflow-hidden shadow-sm ${trip.type === 'ida' ? 'bg-blue-50 border-blue-200' : trip.type === 'volta' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`p-4 border-b border-dashed ${trip.type === 'ida' ? 'border-blue-200 bg-blue-100/50' : trip.type === 'volta' ? 'border-orange-200 bg-orange-100/50' : 'border-gray-200 bg-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${trip.type === 'ida' ? 'bg-blue-600 text-slate-900' : trip.type === 'volta' ? 'bg-orange-500 text-slate-900' : 'bg-gray-600 text-slate-900'}`}>{trip.type === 'ida' ? 'Ida' : trip.type === 'volta' ? 'Volta' : 'Interno'}</span>
                <span className="font-mono font-bold text-xs text-gray-400">REF: {trip.bookingReference}</span>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">{trip.type === 'ida' ? <PlaneTakeoff className="text-blue-600" /> : <PlaneLanding className="text-orange-600" />} {trip.title}</h3>
            </div>
            <div className="p-4 space-y-6">
              {trip.legs.map((leg: FlightLeg, idx: number) => (
                <div key={idx} className="relative pl-4 border-l-2 border-dashed border-gray-300">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-green-500"></div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 w-full">
                      <div className="mb-2 flex justify-between items-center"><span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">{leg.airline} - {leg.flightNumber}</span><span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {leg.duration}</span></div>
                      
                      <div className="flex items-center gap-6 mb-2">
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-display font-black text-slate-800">{leg.departure.code}</p>
                          <p className="text-sm font-bold text-gray-600">{leg.departure.time}</p>
                        </div>
                        <Plane className="w-4 h-4 text-gray-400" />
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-display font-black text-slate-800">{leg.arrival.code}</p>
                          <p className="text-sm font-bold text-gray-600">{leg.arrival.time}</p>
                        </div>
                      </div>
                    </div>

                    {(leg.weatherDeparture || leg.weatherArrival) && (
                      <div className="flex items-center gap-2 shrink-0">
                        {leg.weatherDeparture && <WeatherWidget weather={leg.weatherDeparture} label={leg.departure.code} compact={true} />}
                        {leg.weatherArrival && <WeatherWidget weather={leg.weatherArrival} label={leg.arrival.code} compact={true} />}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-4 border-t border-gray-100 text-xs space-y-2">
              <div className="flex items-start gap-2 text-gray-500"><Users className="w-4 h-4" /> <span>{trip.passengers.map(p => p.name).join(' & ')}</span></div>
              <div className="flex items-center gap-2 text-gray-500"><Luggage className="w-4 h-4" /> <span>{trip.baggage}</span></div>
              {trip.financials && (
                <div className="flex items-center gap-2 text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  <CreditCard className="w-4 h-4 text-emerald-600" /> 
                  <span className="font-bold text-slate-800">Total: {trip.financials.total}</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] ml-auto">{trip.financials.status}</span>
                </div>
              )}
              {trip.provider?.toLowerCase().includes('gol') && (
                <button
                  onClick={() => setOpenBoardingPass(true)}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-3 bg-[#FF6600] hover:bg-[#E05000] text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md shadow-[#FF6600]/20"
                >
                  <Smartphone className="w-4 h-4 text-white" /> EMITIR CARTÃO DE EMBARQUE DIGITAL (GOL)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {renderBoardingPassModal()}
    </div>
  );
};

export default FlightList;
