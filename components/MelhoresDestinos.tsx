import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Navigation
} from 'lucide-react';
import CategoryHeader from './CategoryHeader';

interface SubTopic {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  highlights?: string[];
}

interface DestinationCity {
  id: string;
  name: string;
  shortName: string;
  subtitle?: string;
  url: string;
  topics: SubTopic[];
}

interface TripDestinationConfig {
  tripId: string;
  tripName: string;
  cities: DestinationCity[];
}

// ----------------------------------------------------
// GUARAPARI & REGIÃO (ES)
// ----------------------------------------------------
const TOPICS_GUARAPARI_CENTRO: SubTopic[] = [
  {
    id: 'quando-ir',
    title: 'Quando Ir',
    icon: <Calendar className="w-5 h-5" />,
    content: 'De setembro a abril o clima é quente, ensolarado e ideal para praia e banho de mar. O feriado de 4 a 7 de Setembro é perfeito para curtir as praias com tranquilidade antes da alta temporada de verão, com temperaturas médias entre 24°C e 29°C.',
    highlights: ['4 a 7 de Setembro: Feriado Perfeito', 'Set-Abr: Sol e Águas Claras', 'Verão: Alta Temporada e Agito']
  },
  {
    id: 'como-chegar',
    title: 'Como Chegar',
    icon: <Bus className="w-5 h-5" />,
    content: 'Viagem de carro partindo de Maricá (RJ) pela Estrada de Ubatiba acessando a Rodovia Gov. Mário Covas (BR-101 Norte). São 449.5 km (cerca de 7h20 de viagem tranquila). Pedágios: R$ 76,60 total e combustível estimado em R$ 476,49 (899 km ida e volta).',
    highlights: ['Carro Próprio: 449.5 km via BR-101', 'Pedágios: R$ 76,60', 'Gasolina: R$ 476,49 (13 km/l)']
  },
  {
    id: 'onde-ficar',
    title: 'Onde Ficar',
    icon: <Hotel className="w-5 h-5" />,
    content: 'Praia da Areia Preta, Praia das Castanheiras e Centro concentram a melhor estrutura para fazer tudo a pé: calçadões beira-mar, padarias, restaurantes e comércio variado, além da proximidade com as praias urbanas mais famosas.',
    highlights: ['Praia da Areia Preta: Areias Monazíticas', 'Praia das Castanheiras: Sombra e Lazer', 'Centro: Fácil Acesso a Pé']
  },
  {
    id: 'o-que-fazer',
    title: 'O Que Fazer',
    icon: <Compass className="w-5 h-5" />,
    content: 'Aproveite o banho nas águas mansas e terapêuticas da Praia da Areia Preta, relaxe sob as sombras das amendoeiras em Castanheiras, faça caminhadas na orla da Praia dos Namorados e explore o centro histórico de Guarapari.',
  },
  {
    id: 'passeios',
    title: 'Passeios',
    icon: <Palmtree className="w-5 h-5" />,
    content: 'Passeio de escuna pelo canal de Guarapari contornando as praias urbanas, caminhada ecológica nas trilhas do Parque Morro da Pescaria (com acesso à Prainha do Morro) e visita ao píer dos pescadores.',
  },
  {
    id: 'pontos-turisticos',
    title: 'Pontos Turísticos',
    icon: <Camera className="w-5 h-5" />,
    content: 'Praia da Areia Preta, Praia das Castanheiras, Praia dos Namorados, Igreja Antiga Matriz de Nossa Senhora da Conceição (erguida pelo Padre Anchieta em 1585), Gruta de Sant\'Ana e as Ruínas da Igreja de São Tiago.',
  },
  {
    id: 'onde-comer',
    title: 'Onde Comer',
    icon: <Utensils className="w-5 h-5" />,
    content: 'Desfrute da autêntica Moqueca Capixaba servida borbulhante na panela de barro tradicional nos restaurantes Guaramare, Cantinho do Curuca e Gaeta. Não deixe de provar também a Torta Capixaba e os peixes grelhados da orla.',
    highlights: ['Moqueca Capixaba em Panela de Barro', 'Torta Capixaba Tradicional', 'Frutos do Mar Frescos']
  },
  {
    id: 'dinheiro',
    title: 'Dinheiro',
    icon: <Coins className="w-5 h-5" />,
    content: 'Real (BRL). Todos os quiosques de praia, feirinhas de artesanato, postos da BR-101 e restaurantes aceitam cartões de débito, crédito e Pix.',
  },
  {
    id: 'dicas',
    title: 'Dicas',
    icon: <Info className="w-5 h-5" />,
    content: '"Moqueca é capixaba, o resto é peixada!" A moqueca capixaba não leva azeite de dendê nem leite de coco — apenas azeite de oliva, urucum/colorau, tomates, cebola e coentro fresco. Leve cadeiras de praia e cooler no porta-malas do carro.',
  },
  {
    id: 'vida-noturna',
    title: 'Vida Noturna',
    icon: <Moon className="w-5 h-5" />,
    content: 'O calçadão do Centro e da Praia das Castanheiras ganha vida à noite com feirinhas de artesanato, quiosques com música ao vivo, bares com petiscos de frutos do mar e sorveterias artesanais.',
  },
  {
    id: 'atividades',
    title: 'Atividades',
    icon: <Footprints className="w-5 h-5" />,
    content: 'Caminhada matinal na orla de Areia Preta, mergulho livre de snorkel nas piscinas naturais de pedras de Castanheiras e ensaio de fotos do casal ao entardecer.',
  },
  {
    id: 'transportes',
    title: 'Transportes',
    icon: <Bus className="w-5 h-5" />,
    content: 'Estar com carro próprio é a melhor escolha: permite transitar livremente entre as praias centrais, Enseada Azul, Meaípe e subir a serra até Domingos Martins sem depender de horários.',
  },
  {
    id: 'compras',
    title: 'Compras',
    icon: <ShoppingBag className="w-5 h-5" />,
    content: 'Feirinha de artesanato no Centro, legítimas Panelas de Barro de Goiabeiras (patrimônio cultural do ES), doces caseiros capixabas e lembranças de praia.',
  },
  {
    id: 'atracoes-proximas',
    title: 'Atrações Próximas',
    icon: <MapIcon className="w-5 h-5" />,
    content: 'Praia de Meaípe, Enseada Azul (Bacutia e Peracanga), Praia dos Padres, Parque Estadual Paulo César Vinha (Setiba) e a romântica Pedra Azul em Domingos Martins.',
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: <ShieldCheck className="w-5 h-5" />,
    content: 'Guarapari é uma cidade turística bastante acolhedora e tranquila. Mantenha os cuidados rotineiros com bolsas e celulares na areia da praia e respeite as sinalizações marítimas.',
  }
];

const TOPICS_MEAIPE_BACUTIA: SubTopic[] = [
  {
    id: 'quando-ir',
    title: 'Quando Ir',
    icon: <Calendar className="w-5 h-5" />,
    content: 'Durante todo o ano as praias de Meaípe e Enseada Azul são um espetáculo. De setembro a abril as águas ficam especialmente transparentes, cristalinas e calmas, excelentes para mergulho.',
    highlights: ['Primavera/Verão: Águas Transparentes', 'Setembro: Clima Agradável']
  },
  {
    id: 'como-chegar',
    title: 'Como Chegar',
    icon: <Bus className="w-5 h-5" />,
    content: 'Apenas 10 a 15 minutos de carro do Centro de Guarapari seguindo pela Rodovia do Sol (ES-060) em direção ao sul. Há estacionamento perto das entradas das praias.',
  },
  {
    id: 'onde-ficar',
    title: 'Onde Ficar',
    icon: <Hotel className="w-5 h-5" />,
    content: 'Pousadas de charme e gastronômicas em Meaípe (vila bucólica de pescadores) ou flats de alto padrão na orla da Enseada Azul (Praia de Bacutia e Peracanga).',
  },
  {
    id: 'o-que-fazer',
    title: 'O Que Fazer',
    icon: <Compass className="w-5 h-5" />,
    content: 'Passar o dia nas águas calmas de Bacutia e Peracanga, descer a escadaria rústica cercada pela vegetação até a cinematográfica Praia dos Padres e apreciar o pôr do sol nos restaurantes de Meaípe.',
  },
  {
    id: 'passeios',
    title: 'Passeios',
    icon: <Palmtree className="w-5 h-5" />,
    content: 'Trilha ecológica leve que liga Bacutia à Praia dos Padres, passeio de lancha pelas enseadas e caminhada pela bucólica vila de Meaípe.',
  },
  {
    id: 'pontos-turisticos',
    title: 'Pontos Turísticos',
    icon: <Camera className="w-5 h-5" />,
    content: 'Praia de Bacutia (famosa pelas águas calmas e areia clara), Praia de Peracanga, Praia dos Padres (cercada de falésias e vegetação) e a orla de Meaípe.',
  },
  {
    id: 'onde-comer',
    title: 'Onde Comer',
    icon: <Utensils className="w-5 h-5" />,
    content: 'O polo gastronômico de Meaípe é consagrado nacionalmente: os restaurantes Gaeta e Curuca Tradição são referências máximas no preparo da Moqueca Capixaba de badejo e no famoso bolinho de aipim com camarão.',
    highlights: ['Restaurante Gaeta: Moqueca Premiada', 'Curuca Tradição: Polo Gastronômico', 'Bolinho de Aipim com Camarão']
  },
  {
    id: 'dinheiro',
    title: 'Dinheiro',
    icon: <Coins className="w-5 h-5" />,
    content: 'Pix e cartões são aceitos em todos os quiosques e restaurantes.',
  },
  {
    id: 'dicas',
    title: 'Dicas',
    icon: <Info className="w-5 h-5" />,
    content: 'A Praia dos Padres tem acesso por escadaria e visual selvagem; leve água e lanche caso prefira privacidade. Chegue por volta do meio-dia nos restaurantes de Meaípe para garantir mesas com vista.',
  },
  {
    id: 'vida-noturna',
    title: 'Vida Noturna',
    icon: <Moon className="w-5 h-5" />,
    content: 'Bares aconchegantes com vista para a enseada de Meaípe, clima boêmio e relaxante com bons vinhos, drinks e frutos do mar.',
  },
  {
    id: 'atividades',
    title: 'Atividades',
    icon: <Footprints className="w-5 h-5" />,
    content: 'Stand-up paddle, snorkel na barreira de recifes de Bacutia e fotos panorâmicas do mirante da Enseada Azul.',
  },
  {
    id: 'transportes',
    title: 'Transportes',
    icon: <Bus className="w-5 h-5" />,
    content: 'Acesso rápido com o carro próprio através da rodovia ES-060 com pista asfaltada e bem sinalizada.',
  },
  {
    id: 'compras',
    title: 'Compras',
    icon: <ShoppingBag className="w-5 h-5" />,
    content: 'Camarões frescos e peixes nobres vendidos pelos pescadores na praia de Meaípe nas primeiras horas da manhã.',
  },
  {
    id: 'atracoes-proximas',
    title: 'Atrações Próximas',
    icon: <MapIcon className="w-5 h-5" />,
    content: 'Praia de Ubu e Anchieta (Santuário Nacional de São José de Anchieta) logo após Meaípe.',
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: <ShieldCheck className="w-5 h-5" />,
    content: 'Região tranquila, com policiamento turístico e ambiente familiar durante o dia e à noite.',
  }
];

const TOPICS_DOMINGOS_MARTINS: SubTopic[] = [
  {
    id: 'quando-ir',
    title: 'Quando Ir',
    icon: <Calendar className="w-5 h-5" />,
    content: 'A região serrana capixaba é agradável o ano todo. De maio a setembro o clima é mais ameno e romântico, com noites frescas ideais para fondue, vinhos e cafeterias nas montanhas.',
    highlights: ['Clima de Montanha', 'Rota do Lagarto & Pedra Azul']
  },
  {
    id: 'como-chegar',
    title: 'Como Chegar',
    icon: <Bus className="w-5 h-5" />,
    content: 'Aproximadamente 1h30 de carro partindo de Guarapari (cerca de 85 km) subindo pela rodovia BR-262 em direção a Domingos Martins e Pedra Azul.',
  },
  {
    id: 'onde-ficar',
    title: 'Onde Ficar',
    icon: <Hotel className="w-5 h-5" />,
    content: 'Chalés românticos com lareira ao longo da Rota do Lagarto ou pousadas no estilo alpino/germânico no centro de Domingos Martins.',
  },
  {
    id: 'o-que-fazer',
    title: 'O Que Fazer',
    icon: <Compass className="w-5 h-5" />,
    content: 'Percorrer de carro a paradisíaca Rota do Lagarto, contemplar a formação rochosa da Pedra Azul, fazer trilha até as piscinas naturais e visitar as fazendas de agroturismo.',
  },
  {
    id: 'passeios',
    title: 'Passeios',
    icon: <Palmtree className="w-5 h-5" />,
    content: 'Trilha do Parque Estadual da Pedra Azul, parada no charmoso Quadrado de São Paulinho e tour das fazendas de morango e queijo de Venda Nova do Imigrante.',
  },
  {
    id: 'pontos-turisticos',
    title: 'Pontos Turísticos',
    icon: <Camera className="w-5 h-5" />,
    content: 'Pedra Azul (e o relevo em formato de lagarto), Rota do Lagarto, Praça Arthur Gerhardt (Praça das Flores) e a Rua do Lazer em Domingos Martins.',
  },
  {
    id: 'onde-comer',
    title: 'Onde Comer',
    icon: <Utensils className="w-5 h-5" />,
    content: 'Restaurantes de culinária alemã e italiana da serra, bistrôs com fondue, polentas artesanais, galeto e cafés especiais premiados internacionalmente.',
  },
  {
    id: 'dinheiro',
    title: 'Dinheiro',
    icon: <Coins className="w-5 h-5" />,
    content: 'Pix e cartões aceitos em todo o circuito turístico e agroturismo.',
  },
  {
    id: 'dicas',
    title: 'Dicas',
    icon: <Info className="w-5 h-5" />,
    content: 'Leve um casaco leve para as noites na serra. Para a trilha da Pedra Azul, faça reserva online antecipada no site do IEMA caso queira subir até as piscinas.',
  },
  {
    id: 'vida-noturna',
    title: 'Vida Noturna',
    icon: <Moon className="w-5 h-5" />,
    content: 'Rua do Lazer em Domingos Martins com música ao vivo, chope artesanal e mesas ao ar livre em um ambiente de vila europeia.',
  },
  {
    id: 'atividades',
    title: 'Atividades',
    icon: <Footprints className="w-5 h-5" />,
    content: 'Trilhas na natureza, degustação de cafés especiais e compras de queijos e geleias artesanais.',
  },
  {
    id: 'transportes',
    title: 'Transportes',
    icon: <Bus className="w-5 h-5" />,
    content: 'O carro próprio é indispensável para fazer as paradas cênicas ao longo da Rota do Lagarto e sítios turísticos.',
  },
  {
    id: 'compras',
    title: 'Compras',
    icon: <ShoppingBag className="w-5 h-5" />,
    content: 'Morangos frescos, licores artesanais, queijo socol, artesanato em madeira e cafés especiais.',
  },
  {
    id: 'atracoes-proximas',
    title: 'Atrações Próximas',
    icon: <MapIcon className="w-5 h-5" />,
    content: 'Venda Nova do Imigrante, Lavandário e cachoeiras de Domingos Martins.',
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: <ShieldCheck className="w-5 h-5" />,
    content: 'Altíssimo nível de segurança e tranquilidade em toda a região serrana.',
  }
];

// ----------------------------------------------------
// NORDESTE EM JULHO (SALVADOR, ARACAJU, MACEIÓ)
// ----------------------------------------------------
const TOPICS_SSA: SubTopic[] = [
  {
    id: 'quando-ir',
    title: 'Quando Ir',
    icon: <Calendar className="w-5 h-5" />,
    content: 'Setembro a fevereiro é a melhor época para sol e praias. O auge é no Carnaval, mas as festas de São João em junho e julho também trazem muito charme, forró e energia cultural.',
    highlights: ['Set-Fev: Sol e Calor', 'Julho: Roteiro Integrado Nordeste', 'Junho: Festas Juninas']
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
    content: 'Praia do Forte (Projeto Tamar e Ruínas do Castelo Garcia D\'Ávila), Imbassaí, e a Linha Verde até Aracaju.',
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
    content: 'De setembro a março para aproveitar o calor, praias cristalinas e sol firme. Junho e julho são imperdíveis devido ao clima festivo das cidades sergipanas.',
    highlights: ['Set-Mar: Sol Constante', 'Julho: Roteiro Linha Verde']
  },
  {
    id: 'como-chegar',
    title: 'Como Chegar',
    icon: <Bus className="w-5 h-5" />,
    content: 'O Aeroporto de Aracaju (AJU) está situado a menos de 10 minutos da Orla de Atalaia. Vindo de Salvador, a viagem de carro pela Linha Verde é um espetáculo cênico.',
  },
  {
    id: 'onde-ficar',
    title: 'Onde Ficar',
    icon: <Hotel className="w-5 h-5" />,
    content: 'A Orla de Atalaia é a melhor e mais segura localização. Concentra a melhor rede hoteleira, quadras esportivas, lagos artificiais e a famosa Passarela do Caranguejo.',
    highlights: ['Orla de Atalaia: Segurança e Lazer', 'Passarela do Caranguejo']
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
    content: 'O passeio de catamarã até a fascinante Croa do Goré e Ilha dos Namorados. Visitas históricas à vizinha São Cristóvão (patrimônio da UNESCO) e Praia do Saco.',
  },
  {
    id: 'pontos-turisticos',
    title: 'Pontos Turísticos',
    icon: <Camera className="w-5 h-5" />,
    content: 'Passarela do Caranguejo, Oceanário de Aracaju, Mercados Municipais centrais, Orla do Pôr do Sol e os Arcos da Atalaia.',
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
    content: 'Real (BRL). Todo comércio e vendedores ambulantes na praia aceitam cartões e Pix.',
  },
  {
    id: 'dicas',
    title: 'Dicas',
    icon: <Info className="w-5 h-5" />,
    content: 'Alugar um carro é ideal para explorar praias paradisíacas como a Praia do Saco e Mangue Seco. Prove o clássico sorvete de tapioca ou mangaba.',
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
    content: 'Ciclismo na ciclovia da Atalaia, Stand-Up Paddle no rio na Orla do Pôr do Sol ou caminhada na orla.',
  },
  {
    id: 'transportes',
    title: 'Transportes',
    icon: <Bus className="w-5 h-5" />,
    content: 'Uber é extremamente fácil de usar e barato em toda a cidade.',
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
    content: 'Canyons do Rio São Francisco (Canindé do São Francisco), a foz do Rio Real em Mangue Seco e a isolada Praia do Saco.',
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: <ShieldCheck className="w-5 h-5" />,
    content: 'Considerada uma das capitais mais tranquilas do Nordeste brasileiro. Mantenha a atenção básica de noite no centro comercial.',
  }
];

const TOPICS_MCZ: SubTopic[] = [
  {
    id: 'quando-ir',
    title: 'Quando Ir',
    icon: <Calendar className="w-5 h-5" />,
    content: 'De setembro a março para encontrar águas extremamente calmas, transparentes e piscinas naturais na melhor forma. Planeje passeios de jangada de acordo com a maré baixa (abaixo de 0.3).',
    highlights: ['Set-Mar: Sol e Água Cristalina', 'Consultar Tábua de Marés']
  },
  {
    id: 'como-chegar',
    title: 'Como Chegar',
    icon: <Bus className="w-5 h-5" />,
    content: 'O Aeroporto de Maceió (MCZ) recebe voos diários de várias capitais. É recomendável alugar um carro para circular pelas praias urbanas e litorais norte e sul.',
  },
  {
    id: 'onde-ficar',
    title: 'Onde Ficar',
    icon: <Hotel className="w-5 h-5" />,
    content: 'Ponta Verde, Jatiúca e Pajuçara concentram a melhor e mais bonita infraestrutura da orla urbana do Nordeste, com excelentes hotéis e restaurantes.',
    highlights: ['Ponta Verde: Orla e Lazer', 'Jatiúca: Gastronomia']
  },
  {
    id: 'o-que-fazer',
    title: 'O Que Fazer',
    icon: <Compass className="w-5 h-5" />,
    content: 'Caminhe pela orla de Ponta Verde, tire foto no letreiro "Eu Amo Maceió", curta o clima nos quiosques Lopana ou Kanoa e faça passeios até as praias do Gunga e Francês.',
  },
  {
    id: 'passeios',
    title: 'Passeios',
    icon: <Palmtree className="w-5 h-5" />,
    content: 'Passeio de jangada até as piscinas naturais de Pajuçara, passeios de buggy no litoral sul (Dunas do Gunga) e bate-volta até Maragogi e São Miguel dos Milagres.',
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
    content: 'Comida típica no Bodega do Sertão (famoso pela fachada em formato de bule gigante) ou frutos do mar frescos no quiosque Lopana.',
  },
  {
    id: 'dinheiro',
    title: 'Dinheiro',
    icon: <Coins className="w-5 h-5" />,
    content: 'Real (BRL). Cartões de crédito, débito e Pix são aceitos em todos os estabelecimentos, inclusive pelos jangadeiros.',
  },
  {
    id: 'dicas',
    title: 'Dicas',
    icon: <Info className="w-5 h-5" />,
    content: 'Aos domingos, a avenida beira-mar de Ponta Verde fecha para veículos e vira área de lazer. Confira a tábua de marés antes de marcar passeios de jangada.',
  },
  {
    id: 'vida-noturna',
    title: 'Vida Noturna',
    icon: <Moon className="w-5 h-5" />,
    content: 'Animada ao longo da orla de Ponta Verde com quiosques que oferecem DJs, bandas de pop/rock e drinks requintados à beira-mar.',
  },
  {
    id: 'atividades',
    title: 'Atividades',
    icon: <Footprints className="w-5 h-5" />,
    content: 'Mergulho com snorkel nas águas mornas de Pajuçara, caiaque transparente e stand-up paddle em Ponta Verde.',
  },
  {
    id: 'transportes',
    title: 'Transportes',
    icon: <Bus className="w-5 h-5" />,
    content: 'Aplicativos como Uber e 99 atendem com rapidez toda a orla urbana.',
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
    content: 'Praia do Gunga, Praia do Francês, Piscinas Naturais de Maragogi e a Rota Ecológica dos Milagres.',
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: <ShieldCheck className="w-5 h-5" />,
    content: 'A orla turística de Maceió é muito segura, bem iluminada e constantemente policiada.',
  }
];

// ----------------------------------------------------
// SC > CRUZEIRO MSC > SP > RIO (MARÇO DE 2027)
// ----------------------------------------------------
const TOPICS_BETO_CARRERO: SubTopic[] = [
  {
    id: 'quando-ir',
    title: 'Quando Ir',
    icon: <Calendar className="w-5 h-5" />,
    content: 'Março é uma época excelente para visitar o Beto Carrero World e o litoral catarinense: clima quente e agradável com menos filas que as férias de verão.',
    highlights: ['Março: Filas Menores', 'Clima Quente e Ensolarado']
  },
  {
    id: 'como-chegar',
    title: 'Como Chegar',
    icon: <Bus className="w-5 h-5" />,
    content: 'Voo até o Aeroporto de Navegantes (NVG), a apenas 12 km de Penha e do parque Beto Carrero World. Uber ou transfers atendem o trajeto em menos de 15 minutos.',
  },
  {
    id: 'onde-ficar',
    title: 'Onde Ficar',
    icon: <Hotel className="w-5 h-5" />,
    content: 'Penha (perto do parque para ir caminhando ou em 5 minutos de carro) ou Balneário Camboriú (para quem deseja infraestrutura de cidade grande e vida noturna agitada).',
  },
  {
    id: 'o-que-fazer',
    title: 'O Que Fazer',
    icon: <Compass className="w-5 h-5" />,
    content: 'Dia completo de diversão no Beto Carrero World: montanhas-russas FireWhip e Star Mountain, área temática Hot Wheels com show de manobras ao vivo e zoológico do parque.',
  },
  {
    id: 'passeios',
    title: 'Passeios',
    icon: <Palmtree className="w-5 h-5" />,
    content: 'Praias de Penha (Praia da Bacia da Vovó, Praia Grande) e teleférico do Parque Unipraias em Balneário Camboriú.',
  },
  {
    id: 'pontos-turisticos',
    title: 'Pontos Turísticos',
    icon: <Camera className="w-5 h-5" />,
    content: 'Castelo das Nações do Beto Carrero, Show Hot Wheels Epic Show, Roda Gigante FG Big Wheel e o molhe da Barra Sul em Balneário Camboriú.',
  },
  {
    id: 'onde-comer',
    title: 'Onde Comer',
    icon: <Utensils className="w-5 h-5" />,
    content: 'Frutos do mar frescos nos restaurantes de Armação do Itapocorói em Penha ou alta gastronomia na orla da Av. Atlântica de Balneário Camboriú.',
  },
  {
    id: 'dinheiro',
    title: 'Dinheiro',
    icon: <Coins className="w-5 h-5" />,
    content: 'O parque opera com sistema digital e aceita todos os cartões e Pix.',
  },
  {
    id: 'dicas',
    title: 'Dicas',
    icon: <Info className="w-5 h-5" />,
    content: 'Baixe o app do Beto Carrero para checar horários de shows e tempo de fila. Chegue na abertura dos portões às 09:00 para aproveitar o dia inteiro.',
  },
  {
    id: 'vida-noturna',
    title: 'Vida Noturna',
    icon: <Moon className="w-5 h-5" />,
    content: 'Balneário Camboriú concentra as melhores baladas e bares sofisticados de Santa Catarina.',
  },
  {
    id: 'atividades',
    title: 'Atividades',
    icon: <Footprints className="w-5 h-5" />,
    content: 'Atrações radicais no parque, caminhada no calçadão de Balneário Camboriú e banho de mar em praias de águas límpidas.',
  },
  {
    id: 'transportes',
    title: 'Transportes',
    icon: <Bus className="w-5 h-5" />,
    content: 'Uber tem ampla disponibilidade e tarifas acessíveis entre Navegantes, Penha e Itajaí.',
  },
  {
    id: 'compras',
    title: 'Compras',
    icon: <ShoppingBag className="w-5 h-5" />,
    content: 'Lojas temáticas oficiais dentro do Beto Carrero e shoppings em Balneário Camboriú.',
  },
  {
    id: 'atracoes-proximas',
    title: 'Atrações Próximas',
    icon: <MapIcon className="w-5 h-5" />,
    content: 'Porto de Itajaí (embarque do Cruzeiro MSC Musica), Praia Brava e Blumenau.',
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: <ShieldCheck className="w-5 h-5" />,
    content: 'Santa Catarina possui os melhores índices de segurança do país.',
  }
];

const TOPICS_CRUZEIRO_MSC: SubTopic[] = [
  {
    id: 'quando-ir',
    title: 'Quando Ir',
    icon: <Calendar className="w-5 h-5" />,
    content: 'Março é a época perfeita da temporada de cruzeiros brasileira: mar calmo, dias ensolarados e temperaturas excelentes para curtir as piscinas e festas no deque.',
    highlights: ['MSC Musica', 'All Inclusive de Alimentação & Shows']
  },
  {
    id: 'como-chegar',
    title: 'Como Chegar',
    icon: <Bus className="w-5 h-5" />,
    content: 'Embarque no Terminal Marítimo de Passageiros de Itajaí (SC) com destino ao Porto de Santos (SP), com navegação pelas costas mais belas do Brasil.',
  },
  {
    id: 'onde-ficar',
    title: 'Onde Ficar',
    icon: <Hotel className="w-5 h-5" />,
    content: 'Cabine a bordo do grandioso navio MSC Musica, com serviço de quarto, ar-condicionado e total infraestrutura hoteleira 5 estrelas em alto mar.',
  },
  {
    id: 'o-que-fazer',
    title: 'O Que Fazer',
    icon: <Compass className="w-5 h-5" />,
    content: 'Aproveitar as piscinas, jacuzzis aquecidas, espetáculos teatrais estilo Broadway todas as noites no teatro La Scala, cassino, spa e festas temáticas como a Noite do Branco.',
  },
  {
    id: 'passeios',
    title: 'Passeios',
    icon: <Palmtree className="w-5 h-5" />,
    content: 'Navegação cênica pela costa sul e sudeste do Brasil com paradas e vista panorâmica do oceano Atlântico.',
  },
  {
    id: 'pontos-turisticos',
    title: 'Pontos Turísticos',
    icon: <Camera className="w-5 h-5" />,
    content: 'Teatro La Scala, átrio com cachoeira de três níveis, deque das piscinas com telão gigante, academia com vista panorâmica do oceano e discoteca Q32.',
  },
  {
    id: 'onde-comer',
    title: 'Onde Comer',
    icon: <Utensils className="w-5 h-5" />,
    content: 'Buffet internacional com comida inclusa quase 24h por dia e jantares à la carte requintados nos restaurantes principais Le Maxim\'s e L\'Oleandro.',
  },
  {
    id: 'dinheiro',
    title: 'Dinheiro',
    icon: <Coins className="w-5 h-5" />,
    content: 'A bordo, as despesas são lançadas no Cruise Card (cartão da cabine) vinculado ao cartão de crédito internacional, Wise ou Nomad (em dólares ou reais).',
  },
  {
    id: 'dicas',
    title: 'Dicas',
    icon: <Info className="w-5 h-5" />,
    content: 'Leve pelo menos uma roupa toda branca para a famosa Festa do Branco e um traje esporte fino para a Noite de Gala. Mantenha o celular no modo avião durante a navegação.',
  },
  {
    id: 'vida-noturna',
    title: 'Vida Noturna',
    icon: <Moon className="w-5 h-5" />,
    content: 'Festas na piscina com equipe de animação, música ao vivo em diversos lounges, cassino e baladas animadas até o amanhecer.',
  },
  {
    id: 'atividades',
    title: 'Atividades',
    icon: <Footprints className="w-5 h-5" />,
    content: 'Aulas de dança no deque, jogos de perguntas e respostas, cinema, spa e momentos relaxantes nas hidromassagens ao pôr do sol.',
  },
  {
    id: 'transportes',
    title: 'Transportes',
    icon: <Bus className="w-5 h-5" />,
    content: 'Toda a locomoção acontece dentro do próprio resort flutuante. Ao desembarcar em Santos, conexão rápida por ônibus executivo (R$ 46,50) até São Paulo.',
  },
  {
    id: 'compras',
    title: 'Compras',
    icon: <ShoppingBag className="w-5 h-5" />,
    content: 'Lojas Duty Free a bordo com perfumes, relógios, bebidas e chocolates livres de impostos quando o navio estiver navegando em águas internacionais.',
  },
  {
    id: 'atracoes-proximas',
    title: 'Atrações Próximas',
    icon: <MapIcon className="w-5 h-5" />,
    content: 'Porto de Santos, Museu Pelé, Centro Histórico de Santos e a subida da serra até São Paulo.',
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: <ShieldCheck className="w-5 h-5" />,
    content: 'Segurança total a bordo com controle rigoroso de acesso e equipe médica 24 horas.',
  }
];

// Imagens para cada tópico
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

// Dicionário de configurações completas por viagem
const TRIP_DESTINATIONS_MAP: Record<string, TripDestinationConfig> = {
  'am_guarapari_2027': {
    tripId: 'am_guarapari_2027',
    tripName: 'Guarapari (ES)',
    cities: [
      {
        id: 'GUA_CENTRO',
        name: 'Guarapari (Centro & Areia Preta)',
        shortName: 'Guarapari',
        subtitle: 'Praia da Areia Preta & Castanheiras',
        url: 'https://www.guarapari.es.gov.br/turismo',
        topics: TOPICS_GUARAPARI_CENTRO
      },
      {
        id: 'GUA_MEAIPE',
        name: 'Enseada Azul & Meaípe',
        shortName: 'Enseada Azul & Meaípe',
        subtitle: 'Bacutia, Praia dos Padres & Gastronomia',
        url: 'https://guia.melhoresdestinos.com.br/guarapari-171-c.html',
        topics: TOPICS_MEAIPE_BACUTIA
      },
      {
        id: 'DOMINGOS_MARTINS',
        name: 'Domingos Martins & Rota Serrana',
        shortName: 'Domingos Martins',
        subtitle: 'Pedra Azul & Clima de Montanha',
        url: 'https://guia.melhoresdestinos.com.br/pedra-azul-domingos-martins-180-c.html',
        topics: TOPICS_DOMINGOS_MARTINS
      }
    ]
  },
  'am_salvador_julho': {
    tripId: 'am_salvador_julho',
    tripName: 'Nordeste em Julho',
    cities: [
      {
        id: 'SSA',
        name: 'Salvador (BA)',
        shortName: 'Salvador',
        subtitle: 'Pelourinho, Farol da Barra & Cultura',
        url: 'https://guia.melhoresdestinos.com.br/salvador-120-c.html',
        topics: TOPICS_SSA
      },
      {
        id: 'AJU',
        name: 'Aracaju (SE)',
        shortName: 'Aracaju',
        subtitle: 'Orla de Atalaia & Passarela do Caranguejo',
        url: 'https://guia.melhoresdestinos.com.br/aracaju-121-c.html',
        topics: TOPICS_AJU
      },
      {
        id: 'MCZ',
        name: 'Maceió (AL)',
        shortName: 'Maceió',
        subtitle: 'Pajuçara, Ponta Verde & Piscinas Naturais',
        url: 'https://guia.melhoresdestinos.com.br/maceio-173-c.html',
        topics: TOPICS_MCZ
      }
    ]
  },
  'am_marco_2027': {
    tripId: 'am_marco_2027',
    tripName: 'SC > Cruzeiro MSC > SP > Rio',
    cities: [
      {
        id: 'BETO_CARRERO',
        name: 'Beto Carrero & Penha (SC)',
        shortName: 'Beto Carrero / Penha',
        subtitle: 'Maior Parque Temático da América Latina',
        url: 'https://guia.melhoresdestinos.com.br/beto-carrero-world-182-c.html',
        topics: TOPICS_BETO_CARRERO
      },
      {
        id: 'CRUZEIRO_MSC',
        name: 'Cruzeiro MSC Musica',
        shortName: 'Navio MSC Musica',
        subtitle: 'Itajaí ➔ Santos • 100% All Inclusive',
        url: 'https://www.msccruzeiros.com.br/',
        topics: TOPICS_CRUZEIRO_MSC
      }
    ]
  }
};

const MelhoresDestinos: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedTripId, setSelectedTripId] = useState<string>('am_guarapari_2027');
  const [activeCityId, setActiveCityId] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<SubTopic | null>(null);

  useEffect(() => {
    try {
      const savedTripStr = localStorage.getItem('selected_trip');
      if (savedTripStr) {
        const savedTrip = JSON.parse(savedTripStr);
        if (savedTrip && savedTrip.id) {
          const tripId = savedTrip.id;
          setSelectedTripId(tripId);
          
          // Configura a cidade inicial baseada na viagem
          const tripConfig = TRIP_DESTINATIONS_MAP[tripId] || 
            (tripId.includes('guarapari') ? TRIP_DESTINATIONS_MAP['am_guarapari_2027'] : 
             tripId.includes('marco') ? TRIP_DESTINATIONS_MAP['am_marco_2027'] : 
             TRIP_DESTINATIONS_MAP['am_salvador_julho']);
          
          if (tripConfig && tripConfig.cities.length > 0) {
            setActiveCityId(tripConfig.cities[0].id);
          }
          return;
        }
      }
    } catch (e) {
      console.error("Erro ao ler selected_trip no Guia Melhores Destinos", e);
    }
    
    // Fallback padrão
    setActiveCityId(TRIP_DESTINATIONS_MAP['am_guarapari_2027'].cities[0].id);
  }, []);

  // Obter a configuração da viagem atual
  const currentTripConfig = TRIP_DESTINATIONS_MAP[selectedTripId] || 
    (selectedTripId.includes('guarapari') ? TRIP_DESTINATIONS_MAP['am_guarapari_2027'] : 
     selectedTripId.includes('marco') ? TRIP_DESTINATIONS_MAP['am_marco_2027'] : 
     TRIP_DESTINATIONS_MAP['am_salvador_julho']);

  // Obter a cidade ativa
  const currentCity = currentTripConfig.cities.find(c => c.id === activeCityId) || currentTripConfig.cities[0];
  const topics = currentCity ? currentCity.topics : TOPICS_GUARAPARI_CENTRO;

  if (selectedTopic) {
    return (
      <div className="animate-in slide-in-from-right duration-300 pb-28">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-slate-500 font-black mb-6 hover:text-sa-green transition-colors p-2 text-xs uppercase tracking-widest cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" /> Voltar ao Guia de {currentCity?.shortName || 'Destinos'}
        </button>

        <div className="bg-white rounded-[40px] p-6 sm:p-8 shadow-2xl border border-slate-100">
           <div className="flex items-center justify-between gap-4 mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-sa-green text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100 shrink-0">
                {selectedTopic.icon}
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block font-mono">
                  {currentCity?.name}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Guia Especializado
                </span>
              </div>
           </div>

           <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-800 mb-2 uppercase leading-tight">
             {selectedTopic.title}
           </h3>
           <div className="w-12 h-1.5 bg-sa-gold rounded-full mb-6"></div>
           
           <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-8 whitespace-pre-line font-medium">
             {selectedTopic.content}
           </p>

           {selectedTopic.highlights && (
             <div className="space-y-3 mb-8">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Destaques Principais</h4>
                {selectedTopic.highlights.map((h, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100">
                    <div className="w-2.5 h-2.5 rounded-full bg-sa-gold shrink-0"></div>
                    <span className="font-bold text-slate-700 text-sm">{h}</span>
                  </div>
                ))}
             </div>
           )}

           <div className="mt-8 p-5 bg-sa-green/5 rounded-3xl border border-sa-green/10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sa-green">
                  <Star className="w-4 h-4 fill-current shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-wider font-mono">
                    Destino: {currentCity?.name}
                  </span>
                </div>
                <a 
                  href={currentCity?.url || 'https://guia.melhoresdestinos.com.br'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sa-blue hover:scale-110 transition-transform p-2 flex items-center gap-1.5 text-xs font-bold"
                >
                  <span>Ver Portal</span>
                  <ExternalLink className="w-4 h-4" />
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
        
        {/* Seletor Dinâmico de Cidades da Viagem Atual */}
        <div className="flex bg-slate-900 p-1.5 rounded-[24px] shadow-xl gap-1.5 overflow-x-auto">
          {currentTripConfig.cities.map((city) => {
            const isActive = currentCity?.id === city.id;
            return (
              <button 
                key={city.id}
                onClick={() => setActiveCityId(city.id)}
                className={`flex-1 min-w-[110px] py-3.5 px-3 rounded-xl text-[10px] sm:text-[11px] font-black font-display uppercase tracking-wider transition-all cursor-pointer text-center truncate ${
                  isActive 
                    ? 'bg-white text-slate-900 shadow-lg scale-[1.02]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {city.shortName}
              </button>
            );
          })}
        </div>

        {/* Título e Identificação do Destino */}
        <div className="text-center py-2 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[10px] font-mono font-black uppercase tracking-widest mb-1">
            <Navigation className="w-3 h-3 text-emerald-600" />
            {currentTripConfig.tripName} • {currentCity?.name}
          </div>
          <h3 className="text-2xl font-display font-black text-slate-800 leading-tight uppercase">
            Guia Melhores <br/> <span className="text-sa-green">Destinos</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Clique nos tópicos para visualizar detalhes completos
          </p>
        </div>

        {/* Grade de Tópicos */}
        <div className="grid grid-cols-2 gap-3 pb-6">
          {topics.map((topic) => {
            const bgImage = TOPIC_IMAGES[topic.id];
            return (
              <button 
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className="group relative w-full h-[150px] rounded-[24px] shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-95 border border-white/10 overflow-hidden flex flex-col justify-end text-left select-none bg-slate-900 cursor-pointer"
              >
                {bgImage && (
                  <img 
                    src={bgImage} 
                    alt={topic.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1100ms] ease-out opacity-75"
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/15 group-hover:via-black/60 transition-colors duration-300"></div>

                <div className="absolute top-3 left-3 bg-white/15 backdrop-blur-md p-1.5 rounded-xl border border-white/20 shadow-lg group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300 shrink-0">
                  {React.cloneElement(topic.icon as React.ReactElement, { className: "w-4 h-4 text-white drop-shadow-md" })}
                </div>

                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-[16px] bg-slate-950/60 backdrop-blur-md border border-white/10 flex flex-col group-hover:bg-slate-950/80 transition-all duration-300">
                  <span className="text-white text-[9.5px] sm:text-[10px] font-display font-black tracking-widest uppercase leading-tight drop-shadow-sm truncate">
                    {topic.title}
                  </span>
                  <span className="text-[7.5px] sm:text-[8px] leading-tight text-white/70 font-sans font-medium line-clamp-2 select-none group-hover:text-white/90 transition-colors mt-0.5">
                    Clique para ver detalhes
                  </span>
                </div>
              </button>
            );
          })}

          {/* Card de Link Externo */}
          <a 
            href={currentCity?.url || 'https://guia.melhoresdestinos.com.br'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sa-blue/10 p-6 rounded-[32px] border-2 border-sa-blue/20 flex flex-col items-center justify-center text-center group active:scale-95 transition-all col-span-2 mt-4 hover:bg-sa-blue/15"
          >
            <div className="w-12 h-12 bg-sa-blue text-white rounded-2xl flex items-center justify-center mb-3 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ExternalLink className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-sa-blue uppercase tracking-[0.2em]">
              Acessar Guia Oficial de {currentCity?.shortName}
            </span>
            <span className="text-[9px] text-slate-500 font-bold mt-1 uppercase">
              Informações atualizadas de {currentCity?.name}
            </span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default MelhoresDestinos;
