
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
    region: 'Porto da Barra',
    options: [
      {
        id: 'rede_andrade',
        name: 'Rede Andrade Barra',
        type: 'Hotel',
        neighborhood: 'Porto da Barra',
        rating: 7.0,
        pricePerDay: 274,
        totalPrice: 822,
        totalDays: 3,
        proximity: 'Perto de Praia do Porto e Farol',
        description: 'Piscina externa, buffet de café da manhã incluso, aceita pets.',
        amenities: ['Piscina externa', 'Café da manhã incluso', 'Aceita pets', 'Wi-Fi grátis', 'Restaurante'],
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.hoteis.com/ho272681/rede-andrade-barra-salvador-brasil/?chkin=2026-07-11&chkout=2026-07-14'
      },
      {
        id: 'apart_queen',
        name: 'Apart Queen Barra',
        type: 'Local Inteiro',
        neighborhood: 'Porto da Barra',
        rating: 9.0,
        pricePerDay: 241,
        totalPrice: 723,
        totalDays: 3,
        proximity: 'Perto do Shopping Barra e praias',
        description: 'Piscina externa, Wi-Fi grátis, recepção 24h.',
        amenities: ['Piscina externa', 'Wi-Fi grátis', 'Recepção 24h', 'Cozinha', 'Estacionamento'],
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.hoteis.com/ho4177308000/apart-queen-barra/?chkin=2026-07-11&chkout=2026-07-14'
      }
    ]
  },
  {
    region: 'Rio Vermelho',
    options: [
      {
        id: 'mar_hotel',
        name: 'Mar Hotel Rio Vermelho',
        type: 'Hotel',
        neighborhood: 'Rio Vermelho',
        rating: 7.2,
        pricePerDay: 190,
        totalPrice: 570,
        totalDays: 3,
        proximity: 'Perto da Praia da Paciência',
        description: 'Piscina externa, café da manhã incluso, aceita pets.',
        amenities: ['Piscina externa', 'Café da manhã incluso', 'Aceita pets', 'Wi-Fi grátis', 'Ar-condicionado'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.hoteis.com/ho458703/mar-hotel-rio-vermelho-salvador-brasil/?chkin=2026-07-11&chkout=2026-07-14'
      },
      {
        id: 'ibis_rio_vermelho',
        name: 'Ibis Salvador Rio Vermelho',
        type: 'Hotel',
        neighborhood: 'Rio Vermelho',
        rating: 8.6,
        pricePerDay: 250,
        totalPrice: 750,
        totalDays: 3,
        proximity: 'Beira-mar (praia do Buracão)',
        description: 'Restaurante, estacionamento, pet-friendly.',
        amenities: ['Beira-mar', 'Restaurante', 'Bar/Lounge', 'Estacionamento', 'Wi-Fi grátis'],
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.hoteis.com/ho218419/ibis-salvador-rio-vermelho-salvador-brasil/?chkin=2026-07-11&chkout=2026-07-14'
      },
      {
        id: 'sol_nascente',
        name: 'Sol Nascente',
        type: 'Local Inteiro',
        neighborhood: 'Rio Vermelho',
        rating: 9.2,
        pricePerDay: 223,
        totalPrice: 669,
        totalDays: 3,
        proximity: 'Perto da Praia da Paciência',
        description: 'Piscina particular, cozinha, sacada com vista.',
        amenities: ['Piscina particular', 'Cozinha', 'Sacada com vista', 'Ar-condicionado', 'Lavanderia'],
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=500&auto=format&fit=crop',
        url: 'https://www.hoteis.com/ho3502730976/?chkin=2026-07-11&chkout=2026-07-14'
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
                        <a href={acc.url} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-slate-900 text-white text-center rounded-xl font-black uppercase tracking-widest text-[11px] mt-2">
                            {acc.url.includes('airbnb') ? 'Ver no Airbnb' : 'Ver no Hoteis.com'}
                        </a>
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
  const isColombiaTrip = selectedTrip?.id === 'am_bh_med_san' || selectedTrip?.name?.toLowerCase().includes('medellin');
  const currentAccommodationData = isColombiaTrip 
    ? COLOMBIA_ACCOMMODATION_DATA 
    : isBuenosAiresTrip 
      ? BUENOS_AIRES_ACCOMMODATION_DATA 
      : ACCOMMODATION_DATA;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4">
      {/* Header com a imagem do card */}
      <CategoryHeader title={menuItem?.title || 'HOSPEDAGEM'} onBack={onBack} bgImage={menuItem?.bgImage} />

      <div className="space-y-8 px-2">
        {currentAccommodationData.map((regionGroup) => (
            <div key={regionGroup.region} className="space-y-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest px-1">
                    {regionGroup.region}
                </h3>
                
                {regionGroup.options.map(acc => (
                    <AccommodationCard key={acc.id} acc={acc} />
                ))}
            </div>
        ))}
      </div>
    </div>
  );
};

export default AccommodationList;
