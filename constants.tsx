
import React from 'react';
import { 
  Banknote, 
  Bus, 
  ClipboardList,
  Compass,
  Hotel, 
  Languages,
  Map, 
  Plane, 
  Receipt,
  Mic2,
  Syringe,
  Wallet,
  Brain,
  Car,
  CloudSun,
  ShoppingBasket,
  Shield,
  BookOpen
} from 'lucide-react';
import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'clima_localizacao', 
    title: 'Clima & Local',
    icon: <CloudSun className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Previsão do tempo e fuso horário local.',
    bgImage: 'https://images.unsplash.com/photo-1504253163759-c23fccaedd24?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'cambio', 
    title: 'Câmbio',
    icon: <Banknote className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Conversor de moedas em tempo real.',
    bgImage: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'mercado', 
    title: 'Mercado & Delivery',
    icon: <ShoppingBasket className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Informações de compras e mercados locais.',
    bgImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'checklist', 
    title: 'Checklist Malas',
    icon: <ClipboardList className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Organizador de malas ideais para a rota.',
    bgImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'financeiro', 
    title: 'Financeiro',
    icon: <Wallet className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Controle de saldo e orçamento total.',
    bgImage: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'gastos', 
    title: 'Gastos',
    icon: <Receipt className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Registre despesas e custos imediatos.',
    bgImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'uber_bolt', 
    title: 'Uber / Bolt',
    icon: <Car className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Valores aproximados para transportes por app.',
    bgImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'guias', 
    title: 'Roteiro',
    icon: <Map className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Cronograma detalhado dos passeios diários.',
    bgImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'hospedagem', 
    title: 'Hospedagem',
    icon: <Hotel className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Vouchers, contatos e dados do hotel reservado.',
    bgImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'tradutor', 
    title: 'Idiomas',
    icon: <Languages className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Expressões em áudio e ajuda de tradução.',
    bgImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'melhores_destinos', 
    title: 'Melhores Destinos',
    icon: <Compass className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Guia completo com as atrações turísticas.',
    bgImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'onibus', 
    title: 'Ônibus',
    icon: <Bus className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Horários e links de bilhetes intermunicipais.',
    bgImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'vacinas', 
    title: 'Vacinas (CIVP)',
    icon: <Syringe className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Regulações de saúde e certificados necessários.',
    bgImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'voos', 
    title: 'Voos',
    icon: <Plane className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Estado da rota e franquias de bagagens inclusas.',
    bgImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'ia_assistant', 
    title: 'Guia IA',
    icon: <Brain className="w-12 h-12 text-white" />,
    themeColor: 'green',
    gradientClass: 'bg-[#007749] border-white/20',
    bgColor: '#007749',
    category: 'Geral',
    description: 'Apoio em tempo real com assistente inteligente.',
    bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop'
  },
];

export const CACHE_KEY_RATES = 'viajai_rates';
export const ONE_HOUR_MS = 3600 * 1000;
export const EXPENSES_STORAGE_KEY = 'viajai_expenses_v1';
