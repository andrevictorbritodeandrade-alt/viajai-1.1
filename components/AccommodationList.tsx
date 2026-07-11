
import React, { useState } from 'react';
import { 
  Hotel, 
  MapPin, 
  CalendarDays, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock,
  ShieldCheck,
  Users,
  Wallet,
  ArrowLeft,
  Star
} from 'lucide-react';
import { MENU_ITEMS } from '../constants';
import CategoryHeader from './CategoryHeader';

// ... (Rest of the structure will be added)

const ACCOMMODATION_DATA = [
  {
    region: 'Porto da Barra (16 a 24 de Julho — 8 noites)',
    options: [
      {
        id: 'rede_andrade',
        name: 'Rede Andrade Barra',
        type: 'Hotel',
        neighborhood: 'Porto da Barra',
        rating: 7.0,
        pricePerDay: 274,
        totalPrice: 2192,
        totalDays: 8,
        proximity: 'Perto de Praia do Porto e Farol',
        description: 'Piscina externa, buffet de café da manhã incluso, aceita pets.',
        amenities: ['Piscina externa', 'Café da manhã incluso', 'Aceita pets', 'Wi-Fi grátis', 'Restaurante'],
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.hoteis.com/ho272681/rede-andrade-barra-salvador-brasil/?chkin=2026-07-16&chkout=2026-07-24'
      },
      {
        id: 'apart_queen',
        name: 'Apart Queen Barra',
        type: 'Local Inteiro',
        neighborhood: 'Porto da Barra',
        rating: 9.0,
        pricePerDay: 241,
        totalPrice: 1928,
        totalDays: 8,
        proximity: 'Perto do Shopping Barra e praias',
        description: 'Piscina externa, Wi-Fi grátis, recepção 24h.',
        amenities: ['Piscina externa', 'Wi-Fi grátis', 'Recepção 24h', 'Cozinha', 'Estacionamento'],
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.hoteis.com/ho4177308000/apart-queen-barra/?chkin=2026-07-16&chkout=2026-07-24'
      }
    ]
  },
  {
    region: 'Rio Vermelho (16 a 24 de Julho — 8 noites)',
    options: [
      {
        id: 'mar_hotel',
        name: 'Mar Hotel Rio Vermelho',
        type: 'Hotel',
        neighborhood: 'Rio Vermelho',
        rating: 7.2,
        pricePerDay: 190,
        totalPrice: 1520,
        totalDays: 8,
        proximity: 'Perto da Praia da Paciência',
        description: 'Piscina externa, café da manhã incluso, aceita pets.',
        amenities: ['Piscina externa', 'Café da manhã incluso', 'Aceita pets', 'Wi-Fi grátis', 'Ar-condicionado'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.hoteis.com/ho458703/mar-hotel-rio-vermelho-salvador-brasil/?chkin=2026-07-16&chkout=2026-07-24'
      },
      {
        id: 'ibis_rio_vermelho',
        name: 'Ibis Salvador Rio Vermelho',
        type: 'Hotel',
        neighborhood: 'Rio Vermelho',
        rating: 8.6,
        pricePerDay: 250,
        totalPrice: 2000,
        totalDays: 8,
        proximity: 'Beira-mar (praia do Buracão)',
        description: 'Restaurante, estacionamento, pet-friendly.',
        amenities: ['Beira-mar', 'Restaurante', 'Bar/Lounge', 'Estacionamento', 'Wi-Fi grátis'],
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.hoteis.com/ho218419/ibis-salvador-rio-vermelho-salvador-brasil/?chkin=2026-07-16&chkout=2026-07-24'
      },
      {
        id: 'sol_nascente',
        name: 'Sol Nascente',
        type: 'Local Inteiro',
        neighborhood: 'Rio Vermelho',
        rating: 9.2,
        pricePerDay: 223,
        totalPrice: 1784,
        totalDays: 8,
        proximity: 'Perto da Praia da Paciência',
        description: 'Piscina particular, cozinha, sacada com vista.',
        amenities: ['Piscina particular', 'Cozinha', 'Sacada com vista', 'Ar-condicionado', 'Lavanderia'],
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.hoteis.com/ho3502730976/?chkin=2026-07-16&chkout=2026-07-24'
      }
    ]
  }
];

const COLOMBIA_ACCOMMODATION_DATA = [
  {
    region: 'Opções em Medellín (14 a 19 de Janeiro de 2027 — 5 noites)',
    options: [
      {
        id: 'colombia_medellin_loft',
        name: 'Apartamento Loft Industrial Premium - El Poblado',
        type: 'Apartamento Inteiro (Loft)',
        neighborhood: 'El Poblado',
        rating: 4.88,
        pricePerDay: 185,
        totalPrice: 925,
        totalDays: 5,
        proximity: 'A poucos minutos do Parque Lleras e Provenza, no bairro mais sofisticado de Medellín',
        description: 'Design industrial moderno, totalmente mobiliado, varanda com vista aberta espetacular para o vale, Wi-Fi fibra de alta velocidade, cozinha completa.',
        amenities: ['Piscina Rooftop', 'Cozinha Completa', 'Wi-Fi Fibra 200MB', 'Segurança 24h', 'Ar-condicionado', 'Jacuzzi comum'],
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.airbnb.com.br/s/Medellin--Colombia'
      },
      {
        id: 'colombia_medellin_studio',
        name: 'Studio Design Charmoso - Laureles',
        type: 'Apartamento Inteiro (Studio)',
        neighborhood: 'Laureles',
        rating: 4.82,
        pricePerDay: 140,
        totalPrice: 700,
        totalDays: 5,
        proximity: 'Localizado no bairro Laureles, cercado por cafés charmosos e ótimos restaurantes acessíveis a pé',
        description: 'Um espaço silencioso e acolhedor perfeitamente planejado para 2 pessoas. Próximo de comércio local vibrante e ótimas confeitarias colombianas.',
        amenities: ['Wi-Fi Fibra', 'Cozinha compacta', 'Ar-condicionado', 'Varanda Privativa', 'Smart TV', 'Cafeteira Expressa'],
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.airbnb.com.br/s/Medellin--Colombia'
      }
    ]
  },
  {
    region: 'Opções em San Andrés (19 a 27 de Janeiro de 2027 — 8 noites)',
    options: [
      {
        id: 'colombia_san_andres_loft',
        name: 'Coral Boutique Beachfront Loft - Punta Hansa',
        type: 'Apartamento Inteiro (Studio Frente Mar)',
        neighborhood: 'Punta Hansa',
        rating: 4.91,
        pricePerDay: 260,
        totalPrice: 2080,
        totalDays: 8,
        proximity: 'À beira-mar, com vista privilegiada para o lendário mar de 7 cores da ilha',
        description: 'Incrível acomodação premium à beira-mar. Adormeça ouvindo o som suave das ondas caribenhas e desfrute de um visual panorâmico sem igual diretamente da sua cama.',
        amenities: ['Vista Mar de 7 Cores', 'Ar condicionado Split', 'Cozinha equipada', 'Acesso direto à praia', 'Televisão a cabo', 'Snorkeling Kit incluso'],
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.airbnb.com.br/s/San-Andres--Colombia'
      },
      {
        id: 'colombia_san_andres_cabin',
        name: 'Cabana Ecológica Privada com Deck Maravilhoso - San Luis',
        type: 'Cabana Premium Privativa',
        neighborhood: 'San Luis',
        rating: 4.79,
        pricePerDay: 195,
        totalPrice: 1560,
        totalDays: 8,
        proximity: 'Na charmosa e tranquila região praiana de San Luis, longe do barulho do centro',
        description: 'Construção rústica refinada em estilo caribenho rodeada por coqueiros exuberantes. Oferece a melhor experiência autêntica, fresca e calma de San Andrés.',
        amenities: ['Varanda com Rede', 'Piscina Privada', 'Ar Condicionado', 'Cozinha Completa', 'Deck de Madeira', 'Churrasqueira'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.airbnb.com.br/s/San-Andres--Colombia'
      }
    ]
  }
];

const BUENOS_AIRES_ACCOMMODATION_DATA = [
  {
    region: 'Opções em Buenos Aires (01 a 08 de Janeiro de 2027)',
    options: [
      {
        id: 'ba_airbnb_center',
        name: 'Studio Moderno no Centro Histórico de Buenos Aires',
        type: 'Apartamento Inteiro (Studio)',
        neighborhood: 'Centro Histórico',
        rating: 4.85,
        pricePerDay: 134,
        totalPrice: 940,
        totalDays: 7,
        proximity: 'A poucos metros da Avenida de Mayo, Casa Rosada e metrô',
        description: 'Espaço acolhedor e totalmente equipado para 2 pessoas. Ideal para quem deseja passear a pé e explorar os marcos históricos de Buenos Aires de forma econômica.',
        amenities: ['Ar-condicionado', 'Cozinha completa', 'Wi-Fi de Alta Velocidade', 'Tv Smart', 'Secador de cabelo', 'Segurança 24h', 'Varanda francesa'],
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.airbnb.com.br/rooms/1107551041566334111?adults=2&check_in=2027-01-01&check_out=2027-01-08&search_mode=regular_search&photo_id=1856514737&source_impression_id=p3_1781132613_P37JzMBf0m5KLWKh&previous_page_section_name=1000&federated_search_id=cedc53e8-30b7-4fa0-80de-13ba465c8424'
      },
      {
        id: 'ba_airbnb_recoleta_studio',
        name: 'Studio Clássico e Elegante - Recoleta',
        type: 'Apartamento Inteiro (Studio)',
        neighborhood: 'Recoleta',
        rating: 4.90,
        pricePerDay: 168,
        totalPrice: 1176,
        totalDays: 7,
        proximity: 'No coração da Recoleta, perto do Cemitério da Recoleta e de cafés charmosos',
        description: 'Lindo apartamento com pé direito alto, decoração retrô requintada e muita luz solar. Equipado com tudo o que é necessário para uma estadia maravilhosa.',
        amenities: ['Cama Queen-size', 'Cozinha compacta', 'Ventilação natural', 'Wi-Fi fibra', 'Banheiro clássico', 'Ar-condicionado'],
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.airbnb.com.br/rooms/1056686510395185341?adults=2&check_in=2027-01-01&check_out=2027-01-08&search_mode=regular_search&source_impression_id=p3_1781132613_P3fb4j067QS8mKC_&previous_page_section_name=1000&federated_search_id=cedc53e8-30b7-4fa0-80de-13ba465c8424'
      },
      {
        id: 'ba_airbnb_palermo_soho',
        name: 'Aconchegante Loft Design - Palermo Soho',
        type: 'Apartamento Inteiro (Loft)',
        neighborhood: 'Palermo Soho',
        rating: 4.92,
        pricePerDay: 224,
        totalPrice: 1570,
        totalDays: 7,
        proximity: 'Palermo Soho, próximo à Plaza Serrano, pubs e boutiques de arte',
        description: 'Espaço reformado de alto bom gosto com mezanino moderno, varanda espaçosa para aproveitar as tardes de Buenos Aires. Wi-Fi rápido perfeito para home office.',
        amenities: ['Varanda Privativa', 'Cozinha completa', 'Wi-Fi Rápido', 'Ar-condicionado', 'Cama de casal', 'Secadora de roupas'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.airbnb.com.br/rooms/1599480291101237450?adults=2&check_in=2027-01-01&check_out=2027-01-08&search_mode=regular_search&photo_id=2600825445&source_impression_id=p3_1781132697_P3b4FFU1I7hyDMNQ&previous_page_section_name=1000&federated_search_id=e6b7967d-5e18-40dc-aeca-240c3193b69c'
      },
      {
        id: 'ba_airbnb_palermo_hollywood',
        name: 'Palermo Hollywood Luxury Sunset Loft',
        type: 'Apartamento Inteiro (Loft Premium)',
        neighborhood: 'Palermo Hollywood',
        rating: 4.96,
        pricePerDay: 285,
        totalPrice: 1995,
        totalDays: 7,
        proximity: 'Palermo Hollywood, rodeado pelos melhores bistrôs e restaurantes sofisticados',
        description: 'Espetacular loft contemporâneo com cozinha americana completa, janelas do chão ao teto e acesso a piscina no terraço do edifício.',
        amenities: ['Piscina no rooftop', 'Vista incrível', 'Cozinha completa', 'Wi-Fi rápido', 'Portaria de segurança 24h', 'Smart TV de 55"'],
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.airbnb.com.br/rooms/39797152?adults=2&check_in=2027-01-01&check_out=2027-01-08&search_mode=regular_search&photo_id=909678672&source_impression_id=p3_1781132775_P3cWmK5wphjaqQb7&previous_page_section_name=1000&federated_search_id=0b51912d-519a-4c81-a452-dc2e1c870017'
      },
      {
        id: 'ba_airbnb_puerto_madero',
        name: 'Luxury Design Suite - Puerto Madero',
        type: 'Suíte Premium Inteira',
        neighborhood: 'Puerto Madero',
        rating: 4.98,
        pricePerDay: 389,
        totalPrice: 2723,
        totalDays: 7,
        proximity: 'Na orla gourmet de Puerto Madero, com vista panorâmica para o dique',
        description: 'Um design apartamento de altíssimo padrão na zona mais prestigiada de Buenos Aires. Varanda privativa espetacular, banheira de hidromassagem e concierge.',
        amenities: ['Varanda de vidro', 'Banheira de Hidromassagem', 'Recepção com Concierge', 'Ar condicionado Dual', 'Wi-Fi Premium', 'Cama King-size'],
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.airbnb.com.br/rooms/545541555277792159?adults=2&check_in=2027-01-01&check_out=2027-01-08&search_mode=regular_search&source_impression_id=p3_1781132775_P3IoVmlOEjHe3vVu&previous_page_section_name=1000&federated_search_id=0b51912d-519a-4c81-a452-dc2e1c870017'
      }
    ]
  }
];

const AccommodationCard: React.FC<{ acc: any }> = ({ acc }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <img src={acc.image} alt={acc.name} className="w-full h-40 object-cover" />
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-black text-slate-900 text-lg">{acc.name}</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase mt-1">{acc.type} • {acc.neighborhood}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 font-black text-xs px-2 py-1 rounded-lg shrink-0">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {acc.rating}
                </div>
            </div>
            
            <div className="flex justify-between items-center py-2 border-y border-slate-100">
                <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase">Diária</span>
                    <span className="text-lg font-black text-slate-900">R$ {acc.pricePerDay}</span>
                </div>
                <div className="text-right">
                    <span className="block text-[10px] font-black text-slate-400 uppercase">Total ({acc.totalDays || 3} diárias)</span>
                    <span className="text-lg font-black text-emerald-600">R$ {acc.totalPrice}</span>
                </div>
            </div>
            
            <div className="space-y-2">
                <p className="text-xs text-slate-600">{acc.proximity}</p>
                {expanded && (
                    <div className="text-xs text-slate-600 animate-in fade-in slide-in-from-top-2 pt-2 space-y-2">
                        <p>{acc.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {acc.amenities.map((amenity: string) => (
                                <span key={amenity} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold">
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <button 
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2 hover:text-slate-600"
            >
                {expanded ? 'Mostrar menos' : 'Mostrar detalhes completos'}
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
        </div>
    </div>
  );
};

const SALVADOR_ARACAJU_ACCOMMODATION_DATA = [
  {
    region: 'Salvador — Chegada (16 a 17 de Julho de 2026 — 1 noite)',
    options: [
      {
        id: 'ssa_aju_airbnb_ssa_chegada',
        name: 'Airbnb Caminho das Árvores, Salvador',
        type: 'Apartamento Inteiro',
        neighborhood: 'Caminho das Árvores',
        rating: 4.95,
        pricePerDay: 160.00,
        totalPrice: 185.71,
        totalDays: 1,
        proximity: 'Ao lado do Salvador Shopping e da Av. Tancredo Neves. Ideal para o primeiro dia.',
        description: 'Oferecido por Gustavo. Código de confirmação: HMJHTC29YF. Check-in 16/07, Checkout 17/07. Apartamento aconchegante, piscina rooftop, vaga de garagem rotativa inclusa (perfeito para o carro alugado), ar-condicionado silencioso, Wi-Fi ultra rápido. Preço total: R$ 185,71.',
        amenities: ['Oferecido por Gustavo', 'Conf: HMJHTC29YF', 'Estacionamento Grátis', 'Piscina Rooftop', 'Cozinha', 'Ar-condicionado', 'Wi-Fi 300MB'],
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.airbnb.com.br/s/Salvador--Bahia'
      }
    ]
  },
  {
    region: 'Maceió — Temporada (17 a 19 de Julho de 2026 — 2 noites)',
    options: [
      {
        id: 'ssa_aju_airbnb_maceio',
        name: 'Casa/apto inteiro em Maceió',
        type: 'Casa/apto inteiro • 1 cama • 2 hóspedes',
        neighborhood: 'Maceió',
        rating: 4.97,
        pricePerDay: 190.00,
        totalPrice: 380.00,
        totalDays: 2,
        proximity: 'Hospedagem em Maceió. Código de confirmação: HMEPQPS338.',
        description: 'Oferecido por Luciano. Código de confirmação: HMEPQPS338. Check-in 17/07, Checkout 19/07. Casa/apto inteiro, 1 cama, 2 hóspedes. Preço total: R$ 380,00.',
        amenities: ['Oferecido por Luciano', 'Conf: HMEPQPS338', '1 cama', '2 hóspedes', 'Ar-condicionado', 'Cozinha Completa', 'Wi-Fi'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.airbnb.com.br/s/Maceio--Alagoas'
      }
    ]
  },
  {
    region: 'Aracaju — Temporada (19 a 21 de Julho de 2026 — 2 noites)',
    options: [
      {
        id: 'ssa_aju_airbnb_aju',
        name: 'Airbnb Premium Orla de Atalaia, Aracaju',
        type: 'Apartamento Inteiro (Vista Mar)',
        neighborhood: 'Orla de Atalaia',
        rating: 4.98,
        pricePerDay: 156.51,
        totalPrice: 313.03,
        totalDays: 2,
        proximity: 'Localizado na Passarela do Caranguejo, de frente para as quadras e lagos de Atalaia.',
        description: 'Oferecido por Nadja. Código de confirmação: HM2YDD2J9T. Check-in 19/07, Checkout 21/07. Apartamento de alto padrão com varanda gourmet de frente para o mar, vaga de garagem demarcada de fácil acesso, Wi-Fi fibra de alta velocidade, cozinha totalmente equipada e piscina climatizada no condomínio. Preço total: R$ 313,03.',
        amenities: ['Oferecido por Nadja', 'Conf: HM2YDD2J9T', 'Frente para o Mar', 'Garagem Privativa', 'Piscina Climatizada', 'Wi-Fi Fibra', 'Cozinha Completa'],
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.airbnb.com.br/s/Aracaju--Sergipe'
      }
    ]
  },
  {
    region: 'Salvador — Retorno (21 a 24 de Julho de 2026 — 3 noites)',
    options: [
      {
        id: 'ssa_aju_airbnb_ssa_retorno',
        name: 'Airbnb Caminho das Árvores, Salvador',
        type: 'Apartamento Inteiro',
        neighborhood: 'Caminho das Árvores',
        rating: 4.91,
        pricePerDay: 185.71,
        totalPrice: 557.13,
        totalDays: 3,
        proximity: 'Ao lado do Salvador Shopping. Excelente localização central e segura para explorar a cidade.',
        description: 'Oferecido por Lilia. Código de confirmação: HMT3Q9TBYB. Check-in 21/07, Checkout 24/07. Apartamento acolhedor e confortável, perfeito para relaxar, preparar as malas até o horário do voo de volta ao Rio de Janeiro. Preço total: R$ 557,13.',
        amenities: ['Oferecido por Lilia', 'Conf: HMT3Q9TBYB', 'Garagem Coberta', 'Ar-condicionado', 'Wi-Fi Fibra', 'Cozinha equipada', 'Check-out fácil'],
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.airbnb.com.br/s/Salvador--Bahia'
      }
    ]
  }
];

const AccommodationList: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const menuItem = MENU_ITEMS.find(item => item.id === 'hospedagem');
  const [selectedTrip, setSelectedTrip] = useState<any>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('selected_trip');
    if (saved) {
      try {
        setSelectedTrip(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const isBuenosAiresTrip = selectedTrip?.id === 'am_foz_ass_ba' || selectedTrip?.name?.toLowerCase().includes('buenos aires');
  const isColombiaTrip = selectedTrip?.id === 'am_bh_med_san' || selectedTrip?.id === 'am_rio_san' || selectedTrip?.name?.toLowerCase().includes('medellin') || selectedTrip?.name?.toLowerCase().includes('san andrés');
  const isSalvadorAjuTrip = selectedTrip?.id === 'am_salvador_julho' || selectedTrip?.name?.toLowerCase().includes('aracaju') || selectedTrip?.name?.toLowerCase().includes('aracajú');

  const currentAccommodationData = isColombiaTrip 
    ? COLOMBIA_ACCOMMODATION_DATA 
    : isSalvadorAjuTrip
      ? SALVADOR_ARACAJU_ACCOMMODATION_DATA
      : isBuenosAiresTrip 
        ? BUENOS_AIRES_ACCOMMODATION_DATA 
        : ACCOMMODATION_DATA;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4">
      {/* Header com a imagem do card */}
      <CategoryHeader title={menuItem?.title || 'HOSPEDAGEM'} onBack={onBack} bgImage={menuItem?.bgImage} />

      <div className="space-y-8 px-2">
        {currentAccommodationData.map((regionGroup) => {
            const renderRegionHeader = (regionStr: string) => {
                const match = regionStr.match(/^(.*?) — (.*?) \((.*?) — (.*?)\)$/);
                if (!match) {
                    return (
                        <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest px-1">
                            {regionStr}
                        </h3>
                    );
                }

                const city = match[1];
                const phase = match[2];
                const dates = match[3];
                const nights = match[4];

                let colorTheme = {
                    bg: 'bg-white/5',
                    border: 'border-white/10',
                    titleBg: 'bg-white/10',
                    textTitle: 'text-slate-200',
                    textSub: 'text-slate-400'
                };

                const cityLower = city.toLowerCase();
                if (cityLower.includes('salvador')) {
                    colorTheme = {
                        bg: 'bg-cyan-950/40',
                        border: 'border-cyan-500/30',
                        titleBg: 'bg-cyan-500/20',
                        textTitle: 'text-cyan-300',
                        textSub: 'text-cyan-400'
                    };
                } else if (cityLower.includes('maceió') || cityLower.includes('maceio')) {
                    colorTheme = {
                        bg: 'bg-emerald-950/40',
                        border: 'border-emerald-500/30',
                        titleBg: 'bg-emerald-500/20',
                        textTitle: 'text-emerald-300',
                        textSub: 'text-emerald-400'
                    };
                } else if (cityLower.includes('aracaju') || cityLower.includes('aracajú')) {
                    colorTheme = {
                        bg: 'bg-rose-950/40',
                        border: 'border-rose-500/30',
                        titleBg: 'bg-rose-500/20',
                        textTitle: 'text-rose-300',
                        textSub: 'text-rose-400'
                    };
                }

                return (
                    <div className={`rounded-xl border p-3 flex flex-col gap-1.5 shadow-lg ${colorTheme.bg} ${colorTheme.border}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className={`px-2 py-0.5 rounded border font-black uppercase text-xs tracking-widest shadow-sm ${colorTheme.titleBg} ${colorTheme.textTitle} ${colorTheme.border}`}>
                                    {city}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${colorTheme.textSub}`}>
                                    {phase}
                                </span>
                            </div>
                            <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-black/20 self-start sm:self-auto ${colorTheme.textSub}`}>
                                {nights}
                            </div>
                        </div>
                        <div className={`text-xs font-semibold flex items-center gap-1.5 opacity-90 pl-0.5 mt-1 ${colorTheme.textSub}`}>
                            <CalendarDays className="w-3.5 h-3.5" />
                            {dates}
                        </div>
                    </div>
                );
            };

            return (
                <div key={regionGroup.region} className="space-y-4">
                    {renderRegionHeader(regionGroup.region)}
                    
                    {regionGroup.options.map(acc => (
                        <AccommodationCard key={acc.id} acc={acc} />
                    ))}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default AccommodationList;
