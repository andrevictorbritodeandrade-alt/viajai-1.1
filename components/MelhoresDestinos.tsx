import React, { useState } from 'react';
import { 
  Calendar, 
  Hotel, 
  Compass, 
  Palmtree, 
  Camera, 
  Utensils, 
  Coins, 
  Info, 
  Moon, 
  Footprints, 
  Bus, 
  ShoppingBag, 
  Map as MapIcon,
  ExternalLink,
  ChevronLeft,
  Star,
  ShieldCheck
} from 'lucide-react';

type City = 'SSA' | 'AJU' | 'MCZ';

interface SubTopic {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  highlights?: string[];
}

const TOPICS_SSA: SubTopic[] = [
  {
    id: 'quando-ir',
    title: 'Quando Ir',
    icon: <Calendar className="w-5 h-5" />,
    content: 'Setembro a fevereiro é a melhor época para sol e praias. O auge é no Carnaval, mas as festas de São João em junho também trazem muito charme e forró tradicional.',
    highlights: ['Set-Fev: Sol e Calor', 'Junho: Festas Juninas (São João)']
  },
  {
    id: 'como-chegar',
    title: 'Como Chegar',
    icon: <Bus className="w-5 h-5" />,
    content: 'O Aeroporto de Salvador (SSA) recebe voos diários de todas as capitais. Do aeroporto, é possível pegar o metrô moderno ou Uber até os principais pontos turísticos.',
  },
  {
    id: 'onde-ficar',
    title: 'Onde Ficar',
    icon: <Hotel className="w-5 h-5" />,
    content: 'Barra e Rio Vermelho oferecem segurança, praias e excelente vida noturna. Para imersão histórica, prefira pousadas no charmoso bairro do Pelourinho ou Santo Antônio Além do Carmo.',
    highlights: ['Barra & Rio Vermelho: Agito', 'Santo Antônio: Clima Boêmio']
  },
  {
    id: 'o-que-fazer',
    title: 'O Que Fazer',
    icon: <Compass className="w-5 h-5" />,
    content: 'Explore as ladeiras do Pelourinho, pegue o Elevador Lacerda, assista ao ensaio do Olodum, visite a majestosa Igreja do Bonfim e curta um banho de mar no Porto da Barra.',
  },
  {
    id: 'passeios',
    title: 'Passeios',
    icon: <Palmtree className="w-5 h-5" />,
    content: 'Passeio de barco pela bela Baía de Todos-os-Santos com parada na Ilha dos Frades e de Itaparica. Outra ótima opção é pegar a Linha Verde até a Praia do Forte.',
  },
  {
    id: 'pontos-turisticos',
    title: 'Pontos Turísticos',
    icon: <Camera className="w-5 h-5" />,
    content: 'Farol da Barra, Pelourinho, Elevador Lacerda, Basílica do Senhor do Bonfim, Mercado Modelo e o MAM (Museu de Arte Moderna).',
  },
  {
    id: 'onde-comer',
    title: 'Onde Comer',
    icon: <Utensils className="w-5 h-5" />,
    content: 'Experimente as famosas moquecas baianas no Restaurante Donana ou Casa de Tereza. Para o acarajé clássico, visite as bancas de Cira ou Regina no Rio Vermelho.',
  },
  {
    id: 'dinheiro',
    title: 'Dinheiro',
    icon: <Coins className="w-5 h-5" />,
    content: 'A moeda é o Real (BRL). Cartões Wise, Nomad, débito, crédito e PIX são amplamente aceitos em qualquer estabelecimento.',
  },
  {
    id: 'dicas',
    title: 'Dicas',
    icon: <Info className="w-5 h-5" />,
    content: 'Sempre combine valores de fotos ou de fitinhas do Bonfim com artistas de rua antes de aceitar qualquer serviço. Mantenha os celulares guardados ao caminhar pelo Pelourinho.',
  },
  {
    id: 'vida-noturna',
    title: 'Vida Noturna',
    icon: <Moon className="w-5 h-5" />,
    content: 'O Rio Vermelho é o centro boêmio definitivo de Salvador, repleto de bares com música ao vivo, praças movimentadas e baladas.',
  },
  {
    id: 'atividades',
    title: 'Atividades',
    icon: <Footprints className="w-5 h-5" />,
    content: 'Caminhada guiada pelo Centro Histórico, mergulho na praia do Porto da Barra e curtir o pôr do sol clássico no Farol da Barra.',
  },
  {
    id: 'transportes',
    title: 'Transportes',
    icon: <Bus className="w-5 h-5" />,
    content: 'Uber é seguro, prático e muito recomendado. O metrô é limpo, rápido e conecta com sucesso o aeroporto às regiões centrais.',
  },
  {
    id: 'compras',
    title: 'Compras',
    icon: <ShoppingBag className="w-5 h-5" />,
    content: 'Artesanato local de couro e renda no Mercado Modelo. Roupas e marcas exclusivas nos shoppings Salvador e Barra.',
  },
  {
    id: 'atracoes-proximas',
    title: 'Atrações Próximas',
    icon: <MapIcon className="w-5 h-5" />,
    content: 'Praia do Forte (Projeto Tamar e Ruínas do Castelo Garcia D\'Ávila), Imbassaí, e a tranquila vila de Diogo na Linha Verde.',
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: <ShieldCheck className="w-5 h-5" />,
    content: 'Atenção redobrada com celulares, carteiras e câmeras em áreas muito movimentadas do Centro Histórico. Use transporte por aplicativo à noite.',
  }
];

const TOPICS_AJU: SubTopic[] = [
  {
    id: 'quando-ir',
    title: 'Quando Ir',
    icon: <Calendar className="w-5 h-5" />,
    content: 'De setembro a março para aproveitar o calor, praias cristalinas e sol firme. Junho é imperdível devido às festividades monumentais do Forró Caju.',
    highlights: ['Set-Mar: Sol Constante', 'Junho: Época do Forró Caju']
  },
  {
    id: 'como-chegar',
    title: 'Como Chegar',
    icon: <Bus className="w-5 h-5" />,
    content: 'O Aeroporto Internacional de Aracaju (AJU) está convenientemente situado na zona sul, a menos de 10 minutos de carro da Orla de Atalaia.',
  },
  {
    id: 'onde-ficar',
    title: 'Onde Ficar',
    icon: <Hotel className="w-5 h-5" />,
    content: 'A Orla de Atalaia é a melhor e mais segura localização. Concentra a melhor rede hoteleira, quadras esportivas, lagos artificiais e a famosa Passarela do Caranguejo.',
    highlights: ['Orla de Atalaia: Segurança e Lazer', 'Coroa do Meio: Próximo aos Shoppings']
  },
  {
    id: 'o-que-fazer',
    title: 'O Que Fazer',
    icon: <Compass className="w-5 h-5" />,
    content: 'Caminhe pela Orla de Atalaia, experimente caranguejo na Passarela, faça um passeio relaxante de barco na Croa do Goré e aprecie o pôr do sol na Orla do Pôr do Sol.',
  },
  {
    id: 'passeios',
    title: 'Passeios',
    icon: <Palmtree className="w-5 h-5" />,
    content: 'O passeio de catamarã até a fascinante Croa do Goré e Ilha dos Namorados. Visitas históricas à vizinha São Cristóvão (patrimônio da UNESCO) e Laranjeiras.',
  },
  {
    id: 'pontos-turisticos',
    title: 'Pontos Turísticos',
    icon: <Camera className="w-5 h-5" />,
    content: 'Passarela do Caranguejo, Oceanário de Aracaju, Mercados Municipais centrais, Orla do Pôr do Sol e o Mirante do Calçadão formosa.',
  },
  {
    id: 'onde-comer',
    title: 'Onde Comer',
    icon: <Utensils className="w-5 h-5" />,
    content: 'Saboreie o caranguejo tradicional quebrado na hora na Passarela do Caranguejo (no restaurante Cariri). Peça carne de sol com pirão de leite para almoço completo.',
  },
  {
    id: 'dinheiro',
    title: 'Dinheiro',
    icon: <Coins className="w-5 h-5" />,
    content: 'Real (BRL). Todo comércio e vendedores ambulantes na praia aceitam cartões de crédito, débito e pagamentos instantâneos via PIX.',
  },
  {
    id: 'dicas',
    title: 'Dicas',
    icon: <Info className="w-5 h-5" />,
    content: 'Alugar um carro é ideal para explorar praias paradisíacas como a Praia do Saco. Não deixe de provar o clássico sorvete de tapioca ou mangaba da região.',
  },
  {
    id: 'vida-noturna',
    title: 'Vida Noturna',
    icon: <Moon className="w-5 h-5" />,
    content: 'A badalação concentra-se na Passarela do Caranguejo, com bares oferecendo forró pé-de-serra ao vivo, pop rock, MPB e chope gelado.',
  },
  {
    id: 'atividades',
    title: 'Atividades',
    icon: <Footprints className="w-5 h-5" />,
    content: 'Ciclismo na ciclovia da Atalaia, Stand-Up Paddle no rio na Orla do Pôr do Sol ou corrida matinal no Parque da Sementeira.',
  },
  {
    id: 'transportes',
    title: 'Transportes',
    icon: <Bus className="w-5 h-5" />,
    content: 'Uber é extremamente fácil de usar e barato em toda a cidade. Aluguel de carro é vantajoso se for cruzar a Linha Verde baiana.',
  },
  {
    id: 'compras',
    title: 'Compras',
    icon: <ShoppingBag className="w-5 h-5" />,
    content: 'Artesanato rico em palha, cerâmica, bordado e queijo de coalho nos Mercados Centrais e na Feira do Turista da Atalaia.',
  },
  {
    id: 'atracoes-proximas',
    title: 'Atrações Próximas',
    icon: <MapIcon className="w-5 h-5" />,
    content: 'Canyons do Rio São Francisco (Canindé do São Francisco), a espetacular foz do Rio Real em Mangue Seco e a isolada Praia do Saco.',
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: <ShieldCheck className="w-5 h-5" />,
    content: 'Considerada uma das capitais mais tranquilas do Nordeste brasileiro. Mantenha os cuidados padrão de noite no centro comercial.',
  }
];

const TOPICS_MCZ: SubTopic[] = [
  {
    id: 'quando-ir',
    title: 'Quando Ir',
    icon: <Calendar className="w-5 h-5" />,
    content: 'De setembro a março para encontrar águas extremamente calmas, transparentes e piscinas naturais na melhor forma. Crucial: planeje seus passeios de jangada de acordo com a maré baixa (marés abaixo de 0.3 são ideais).',
    highlights: ['Set-Mar: Sol e Água Cristalina', 'Consultar Tábua de Marés']
  },
  {
    id: 'como-chegar',
    title: 'Como Chegar',
    icon: <Bus className="w-5 h-5" />,
    content: 'O Aeroporto de Maceió (MCZ) recebe voos diários de várias capitais. É altamente recomendável alugar um carro para circular com total liberdade pelas praias urbanas, litoral sul e litoral norte.',
  },
  {
    id: 'onde-ficar',
    title: 'Onde Ficar',
    icon: <Hotel className="w-5 h-5" />,
    content: 'Ponta Verde, Jatiúca e Pajuçara concentram a melhor e mais bonita infraestrutura da orla urbana do Nordeste brasileiro, com hotéis fantásticos e restaurantes de ponta.',
    highlights: ['Ponta Verde: Orla e Lazer', 'Jatiúca: Gastronomia de Qualidade']
  },
  {
    id: 'o-que-fazer',
    title: 'O Que Fazer',
    icon: <Compass className="w-5 h-5" />,
    content: 'Aproveite para caminhar pela orla de Ponta Verde, tirar foto no letreiro "Eu Amo Maceió", curtir o clima nos quiosques Lopana ou Kanoa, e fazer passeios até as praias do Gunga e Francês.',
  },
  {
    id: 'passeios',
    title: 'Passeios',
    icon: <Palmtree className="w-5 h-5" />,
    content: 'O passeio clássico de jangada até as piscinas naturais de Pajuçara é indispensável. Também vale a pena fazer passeios de buggy no litoral sul ou um bate-volta até São Miguel dos Milagres.',
  },
  {
    id: 'pontos-turisticos',
    title: 'Pontos Turísticos',
    icon: <Camera className="w-5 h-5" />,
    content: 'Farol de Ponta Verde, Feirinha de Pajuçara, Letreiro de Maceió, Mirante do Gunga, Praia do Francês e as dunas da Barra de São Miguel.',
  },
  {
    id: 'onde-comer',
    title: 'Onde Comer',
    icon: <Utensils className="w-5 h-5" />,
    content: 'Não perca a comida típica deliciosa no Bodega do Sertão (famoso pela fachada em formato de bule gigante) ou frutos do mar frescos no quiosque Lopana.',
  },
  {
    id: 'dinheiro',
    title: 'Dinheiro',
    icon: <Coins className="w-5 h-5" />,
    content: 'Real (BRL). Cartões de crédito, débito, Pix e dinheiro em espécie são aceitos em qualquer estabelecimento, inclusive pelos jangadeiros.',
  },
  {
    id: 'dicas',
    title: 'Dicas',
    icon: <Info className="w-5 h-5" />,
    content: 'Aos domingos, a avenida beira-mar de Ponta Verde fecha para veículos e vira uma imensa área de lazer. Não deixe de conferir a tábua de marés antes de marcar passeios de jangada.',
  },
  {
    id: 'vida-noturna',
    title: 'Vida Noturna',
    icon: <Moon className="w-5 h-5" />,
    content: 'Bastante animada ao longo da orla de Ponta Verde com excelentes quiosques que oferecem DJs, bandas de pop/rock e drinks requintados à beira-mar.',
  },
  {
    id: 'atividades',
    title: 'Atividades',
    icon: <Footprints className="w-5 h-5" />,
    content: 'Mergulho com snorkel nas águas mornas de Pajuçara, passeios de caiaque transparente e stand up paddle na praia de Ponta Verde.',
  },
  {
    id: 'transportes',
    title: 'Transportes',
    icon: <Bus className="w-5 h-5" />,
    content: 'Excelente disponibilidade de aplicativos de transporte como Uber e 99. Para trajetos mais distantes, vans de agências locais ou aluguel de carros são ideais.',
  },
  {
    id: 'compras',
    title: 'Compras',
    icon: <ShoppingBag className="w-5 h-5" />,
    content: 'Visite o Pontal da Barra para comprar as famosas rendas de filé tradicionais ou passeie pela clássica Feirinha de Artesanato de Pajuçara.',
  },
  {
    id: 'atracoes-proximas',
    title: 'Atrações Próximas',
    icon: <MapIcon className="w-5 h-5" />,
    content: 'Explore as praias exuberantes do litoral sul (Gunga, Francês) e rume ao norte para conhecer a intocada Rota Ecológica de São Miguel dos Milagres.',
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: <ShieldCheck className="w-5 h-5" />,
    content: 'A orla turística de Maceió é muito segura, bem iluminada e constantemente policiada. Mantenha apenas a atenção básica com pertences deixados na areia.',
  }
];

const TOPIC_IMAGES: Record<string, string> = {
  'quando-ir': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=500&auto=format&fit=crop',
  'como-chegar': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=500&auto=format&fit=crop',
  'onde-ficar': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500&auto=format&fit=crop',
  'o-que-fazer': 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=500&auto=format&fit=crop',
  'passeios': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop',
  'pontos-turisticos': 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=500&auto=format&fit=crop',
  'onde-comer': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500&auto=format&fit=crop',
  'dinheiro': 'https://images.unsplash.com/photo-1502920514313-52581002a659?q=80&w=500&auto=format&fit=crop',
  'dicas': 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=500&auto=format&fit=crop',
  'vida-noturna': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=500&auto=format&fit=crop',
  'atividades': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=500&auto=format&fit=crop',
  'transportes': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=500&auto=format&fit=crop',
  'compras': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=500&auto=format&fit=crop',
  'atracoes-proximas': 'https://images.unsplash.com/photo-1478860121278-7675f24df76a?q=80&w=500&auto=format&fit=crop',
  'seguranca': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=500&auto=format&fit=crop',
};

import CategoryHeader from './CategoryHeader';

const getCityUrl = (city: City) => {
  if (city === 'SSA') return 'https://guia.melhoresdestinos.com.br/salvador-120-c.html';
  if (city === 'AJU') return 'https://guia.melhoresdestinos.com.br/aracaju-121-c.html';
  return 'https://guia.melhoresdestinos.com.br/maceio-173-c.html';
};

const MelhoresDestinos: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeCity, setActiveCity] = useState<City>('SSA');
  const [selectedTopic, setSelectedTopic] = useState<SubTopic | null>(null);

  const topics = activeCity === 'SSA' ? TOPICS_SSA : activeCity === 'AJU' ? TOPICS_AJU : TOPICS_MCZ;

  if (selectedTopic) {
    return (
      <div className="animate-in slide-in-from-right duration-300">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-slate-500 font-black mb-6 hover:text-sa-green transition-colors p-2 text-xs uppercase tracking-widest"
        >
          <ChevronLeft className="w-5 h-5" /> Voltar ao Guia
        </button>

        <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100">
           <div className="w-16 h-16 bg-sa-green text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-100">
              {selectedTopic.icon}
           </div>
           <h3 className="text-2xl font-display font-black text-slate-800 mb-4 uppercase leading-tight">{selectedTopic.title}</h3>
           <div className="w-12 h-1.5 bg-sa-gold rounded-full mb-8"></div>
           
           <p className="text-slate-600 leading-relaxed text-base mb-8 whitespace-pre-line">
             {selectedTopic.content}
           </p>

           {selectedTopic.highlights && (
             <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destaques</h4>
                {selectedTopic.highlights.map((h, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-sa-gold"></div>
                    <span className="font-bold text-slate-700 text-sm">{h}</span>
                  </div>
                ))}
             </div>
           )}

           <div className="mt-12 p-6 bg-sa-green/5 rounded-3xl border border-sa-green/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sa-green">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Fonte: Melhores Destinos</span>
                </div>
                <a 
                  href={getCityUrl(activeCity)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sa-blue hover:scale-110 transition-transform p-2"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-48">
      <CategoryHeader title="Guia Melhores Destinos" onBack={onBack} />
      <div className="p-4 space-y-6">
      <div className="flex bg-slate-900 p-1.5 rounded-[24px] shadow-xl gap-1">
        <button 
          onClick={() => setActiveCity('SSA')}
          className={`flex-1 py-4 rounded-xl text-[10px] font-black font-display uppercase tracking-[0.15em] transition-all ${activeCity === 'SSA' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}
        >
          Salvador
        </button>
        <button 
          onClick={() => setActiveCity('AJU')}
          className={`flex-1 py-4 rounded-xl text-[10px] font-black font-display uppercase tracking-[0.15em] transition-all ${activeCity === 'AJU' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}
        >
          Aracaju
        </button>
        <button 
          onClick={() => setActiveCity('MCZ')}
          className={`flex-1 py-4 rounded-xl text-[10px] font-black font-display uppercase tracking-[0.15em] transition-all ${activeCity === 'MCZ' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}
        >
          Maceió
        </button>
      </div>

      <div className="text-center py-4">
        <h3 className="text-2xl font-display font-black text-slate-800 leading-tight uppercase">
          Guia Melhores <br/> <span className="text-sa-green">Destinos</span>
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Clique nos tópicos para visualizar</p>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-20">
        {topics.map((topic) => {
          const bgImage = TOPIC_IMAGES[topic.id];
          return (
            <button 
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="group relative w-full h-[150px] rounded-[24px] shadow-lg transition-all duration-300 hover:scale-[1.04] active:scale-95 border border-white/10 overflow-hidden flex flex-col justify-end text-left select-none bg-slate-900"
            >
              {bgImage && (
                <img 
                  src={bgImage} 
                  alt={topic.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1100ms] ease-out"
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 group-hover:via-black/55 transition-colors duration-300"></div>

              <div className="absolute top-3 left-3 bg-white/15 backdrop-blur-md p-1.5 rounded-xl border border-white/20 shadow-lg group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300 shrink-0">
                {React.cloneElement(topic.icon as React.ReactElement, { className: "w-4.5 h-4.5 text-white drop-shadow-md" })}
              </div>

              <div className="absolute bottom-2 left-2 right-2 p-2 rounded-[16px] bg-slate-950/50 backdrop-blur-md border border-white/10 flex flex-col group-hover:bg-slate-950/70 transition-all duration-300">
                <span className="text-white text-[9.5px] sm:text-[10px] font-display font-black tracking-widest uppercase leading-tight drop-shadow-sm truncate">
                  {topic.title}
                </span>
                <span className="text-[7.5px] sm:text-[8px] leading-tight text-white/70 font-sans font-medium line-clamp-2 select-none group-hover:text-white/85 transition-colors mt-0.5">
                  Clique para visualizar detalhes
                </span>
              </div>
            </button>
          );
        })}

        <a 
          href={getCityUrl(activeCity)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-sa-blue/10 p-6 rounded-[32px] border-2 border-sa-blue/20 flex flex-col items-center justify-center text-center group active:scale-95 transition-all col-span-2 mt-4"
        >
          <div className="w-12 h-12 bg-sa-blue text-white rounded-2xl flex items-center justify-center mb-3">
            <ExternalLink className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black text-sa-blue uppercase tracking-[0.2em]">Acessar Portal Completo</span>
          <span className="text-[9px] text-slate-500 font-bold mt-1 uppercase">Informações atualizadas via web</span>
        </a>
      </div>
      </div>
    </div>
  );
};

export default MelhoresDestinos;