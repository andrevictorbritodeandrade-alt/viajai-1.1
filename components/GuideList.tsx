import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Sparkles, AlertCircle, ShieldCheck, HelpCircle, Calendar, List, Table, ExternalLink, Compass, MapPin, Globe, Map } from 'lucide-react';
import { getSessionUser } from '../services/session';
import CategoryHeader from './CategoryHeader';
import PelourinhoRouteMap from './PelourinhoRouteMap';

export const GUIDE_STORAGE_KEY = 'viajai_guide_v1';

interface ScheduleCell {
  time: string;
  activity: string;
  details: string;
  costType: 'gratuito' | 'pago' | 'misto';
  costLabel: string;
  links?: { title: string; url: string }[];
}

interface DayOption {
  data: string;
  label: string;
}

interface TripItineraryConfig {
  id: string;
  title: string;
  date: string;
  base: string;
  mode: string;
  flagType: 'bahia' | 'bahia_serg' | 'bahia_serg_alagoas' | 'colombia' | 'argentina' | 'argentina_brazil' | 'brazil' | 'south_africa' | 'sergipe' | 'marco_2027' | 'guarapari_2027';
  dias: DayOption[];
  manha: ScheduleCell[];
  tarde: ScheduleCell[];
  noite: ScheduleCell[];
  culturalTitle: string;
  culturalTips: string[];
  logisticsTitle: string;
  logisticsTips: string[];
  mscBookingUrl?: string;
  cruisePackages?: any[];
}

const ITINERARY_DATABASE: Record<string, TripItineraryConfig> = {
  // Plano B: Aracaju Econômico (Foco na Capital - Grátis e Cultural)
  'am_aracaju_planob': {
    id: 'am_aracaju_planob',
    title: 'Plano A (Novo): Aracaju Cultural, Forró & Econômico (Foco na Capital)',
    date: '16 de Julho a 23 de Julho de 2026',
    base: 'Base: Orla de Atalaia, Aracaju',
    mode: 'Modo Econômico • Foco na Capital',
    flagType: 'sergipe',
    dias: [
      { data: '16/07', label: 'QUINTA' },
      { data: '17/07', label: 'SEXTA' },
      { data: '18/07', label: 'SÁBADO' },
      { data: '19/07', label: 'DOMINGO' },
      { data: '20/07', label: 'SEGUNDA' },
      { data: '21/07', label: 'TERÇA' },
      { data: '22/07', label: 'QUARTA' },
      { data: '23/07', label: 'QUINTA' }
    ],
    manha: [
      { time: "Manhã", activity: "Voo de Ida / Chegada em Aracaju", details: "Embarque no Rio de Janeiro (GIG) com destino ao Aeroporto de Aracaju (AJU). Chegada e recepção sob o sol de Sergipe.", costType: "pago", costLabel: "💳 Gasto: Voo de Ida" },
      { time: "09:00", activity: "Manhã de Mar na Praia de Atalaia", details: "Banho de mar relaxante nas águas calmas e mornas da badalada Praia de Atalaia. Desfrutar da larga faixa de areia para caminhar.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "09:00", activity: "Manhã de Sol na Praia de Aruana", details: "Aproveite a manhã na belíssima Praia de Aruana, conhecida por suas areias claras e águas calmas, ideal para relaxar na areia e nadar sem pressa.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "09:30", activity: "Passeio Verde no Parque da Sementeira", details: "Caminhada matinal sob as copas das árvores no Parque Augusto Franco (Sementeira). Lugar lindo com lagos, pistas de caminhada e ar puríssimo.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "09:00", activity: "Mercados Municipais & Caranguejo Gigante", details: "Passeio imperdível e gratuito pelos tradicionais mercados de artesanato Antônio Franco e Thales Ferraz no Centro Histórico para ver a cultura e os sabores sergipanos, finalizando com a clássica foto ao lado do famoso Caranguejo Gigante na Passarela!", costType: "gratuito", costLabel: "💸 100% Gratuito" },
      { time: "09:30", activity: "Caminhada no Calçadão da Formosa", details: "Aproveite o ventinho fresco do Rio Sergipe caminhando pelo Calçadão da Formosa. Excelente infraestrutura de lazer e mirante para fotos.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "10:00", activity: "Praia dos Artistas & Coroa do Meio", details: "Mergulho refrescante na Praia dos Artistas e observação da bela foz onde o Rio Sergipe encontra o Oceano Atlântico.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "09:00", activity: "Arrumar Malas e Despedida", details: "Check-out no Airbnb ou pousada econômica na Orla de Atalaia. Organizar bagagens e aproveitar as últimas horas para comprar as últimas castanhas.", costType: "gratuito", costLabel: "Sem Gastos" }
    ],
    tarde: [
      { time: "14:00", activity: "Check-in Econômico & Reconhecimento", details: "Check-in na hospedagem próxima à Orla de Atalaia. Caminhada inicial de reconhecimento para conhecer as redondezas do bairro.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "14:30", activity: "Lagos da Atalaia & Projeto Tamar", details: "Visita aos lagos artificiais da Orla de Atalaia (Gratuito!) e passeio opcional no Oceanário de Aracaju (Projeto Tamar) para ver as tartarugas.", costType: "pago", costLabel: "💳 Opcional: R$ 20,00" },
      { time: "14:30", activity: "Largo da Gente Sergipana & Ponte do Imperador", details: "Visitar o majestoso Largo da Gente Sergipana, com estátuas gigantes que emergem do rio representando as manifestações folclóricas locais. Depois, ver a histórica Ponte do Imperador.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "15:00", activity: "Colina de Santo Antônio (Vista Panorâmica)", details: "Visita à Colina de Santo Antônio, marco de fundação de Aracaju. Além de conhecer a igrejinha histórica, contemple a mais deslumbrante vista panorâmica da capital.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "14:00", activity: "Museu da Gente Sergipana & Pôr do Sol na Orla", details: "Visitar o espetacular Museu da Gente Sergipana (100% interativo e com entrada franca!) para conhecer as lendas e ritmos locais. No fim de tarde, contemplar o mágico pôr do sol na Orla Pôr do Sol ao som de um sanfoneiro tradicional de forró pé-de-serra às margens do rio.", costType: "gratuito", costLabel: "💸 100% Gratuito" },
      { time: "14:30", activity: "Parque dos Cajueiros", details: "Passar a tarde no revitalizado Parque dos Cajueiros, rodeado de natureza. Ótimo espaço para caminhar à beira do rio ou simplesmente relaxar nas sombras.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "14:00", activity: "Centro de Turismo & Catedral Metropolitana", details: "Visitar o Centro de Turismo (antigo prédio histórico com lojas de artesanato e bordados) e a bela arquitetura da Catedral Metropolitana de Aracaju.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "13:00", activity: "Voo de Volta", details: "Embarque no Aeroporto de Aracaju (AJU) de volta para o Rio de Janeiro (GIG) com memórias inesquecíveis e bolso intacto!", costType: "pago", costLabel: "💳 Gasto: Voo de Volta" }
    ],
    noite: [
      { time: "19:00", activity: "Caminhada Inicial & Jantar na Passarela", details: "Conhecer a Passarela do Caranguejo e fazer uma caminhada agradável pela iluminada e plana Orla de Atalaia, coroando o dia com um jantar de petiscos saborosos na orla.", costType: "misto", costLabel: "⚖️ Misto: Alimentação" },
      { time: "19:00", activity: "Passeio na Feira do Turista da Atalaia", details: "Passeio tranquilo e agradável pela Feira do Turista da Atalaia, onde você pode apreciar barraquinhas de artesanato local, souvenirs e música ao vivo instrumental.", costType: "gratuito", costLabel: "💸 Gratuito (Entrada)" },
      { time: "19:00", activity: "Noite de Jantar & Música ao Vivo na Atalaia", details: "Aproveitar o clima boêmio da orla de Atalaia para jantar em um dos barzinhos ou restaurantes tradicionais de Sergipe com música regional ao vivo de qualidade.", costType: "pago", costLabel: "💳 Gasto: Alimentação" },
      { time: "19:00", activity: "Noite de Descanso na Atalaia", details: "Caminhar pela orla iluminada e cozinhar uma janta caseira saborosa e econômica no Airbnb para recarregar as energias para a segunda-feira cultural.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "19:00", activity: "Segundona do Turista (Forró Pé-de-Serra!)", details: "O ápice cultural! Participar da espetacular Segundona do Turista na feira, com o autêntico forró pé-de-serra ao vivo e apresentações folclóricas subsidiadas pelo governo estadual toda segunda-feira. Uma experiência cultural inesquecível e totalmente de graça!", costType: "gratuito", costLabel: "💸 Entrada 100% Gratuita" },
      { time: "19:30", activity: "Jantar Econômico & Suco de Frutas", details: "Deliciar-se com tapiocas tradicionais recheadas e sucos de frutas nordestinas em um quiosque econômico na orla.", costType: "pago", costLabel: "💳 Gasto: Tapioca R$ 15,00" },
      { time: "19:00", activity: "Noite de Pizza de Despedida", details: "Dividir uma pizza deliciosa em pizzaria local celebrando o sucesso da viagem econômica, fechando com chave de ouro.", costType: "pago", costLabel: "💳 Gasto: Pizza R$ 35,00" },
      { time: "-", activity: "Chegada ao Rio", details: "Retorno seguro à residência no RJ. Fim do planejamento perfeito!", costType: "gratuito", costLabel: "-" }
    ],
    culturalTitle: "🏺 Cultura, Identidade & Forró de Graça",
    culturalTips: [
      "Museu da Gente Sergipana: Reserve cerca de 2h a 3h para curtir tudo. É 100% interativo e excelente para casais ou famílias.",
      "Segundona do Turista: Começa por volta das 19:00. Vá com roupas confortáveis para dançar o autêntico forró pé-de-serra!",
      "Fotos Marcantes: Não saia de Aracaju sem a clássica foto com o Caranguejo Gigante na Passarela e as estátuas do Largo da Gente Sergipana."
    ],
    logisticsTitle: "🚌 Mobilidade Urbana Sem Carro Alugado",
    logisticsTips: [
      "Uber e Táxi: Aracaju é uma capital compacta. O deslocamento de Uber entre a Atalaia e o Centro Histórico é rápido e muito barato.",
      "Caminhadas Saudáveis: A Orla de Atalaia tem 6 km de extensão totalmente planos e iluminados, perfeita para caminhar no fim da tarde sem gastar nada.",
      "Hospedagem Estratégica: Fique na Atalaia ou Coroa do Meio para ter fácil acesso à praia e a restaurantes econômicos a pé."
    ]
  },

  // 0. Roteiro Guarapari 2027 (Maricá > BR-101 > Guarapari ES)
  'am_guarapari_2027': {
    id: 'am_guarapari_2027',
    title: 'Maricá ➔ Guarapari (ES)',
    date: '04 a 07 de Setembro de 2026 • Feriado da Independência',
    base: 'Bases: Maricá (RJ) & Guarapari (Praia da Areia Preta / Centro)',
    mode: 'Modo Road Trip • Carro Próprio (899 km • BR-101)',
    flagType: 'guarapari_2027',
    dias: [
      { data: '04/09 (SEX)', label: 'ROAD TRIP & CHEGADA' },
      { data: '05/09 (SÁB)', label: 'AREIA PRETA & CASTANHEIRAS' },
      { data: '06/09 (DOM)', label: 'ENSEADA AZUL & MEAÍPE' },
      { data: '07/09 (SEG)', label: 'RETORNO MARICÁ' }
    ],
    manha: [
      { time: "06:00", activity: "Saída de Maricá 🚗💨 Estrada de Ubatiba & BR-101", details: "Partida cedinho de Maricá pela Estrada de Ubatiba acessando a Rodovia Governador Mário Covas (BR-101 Norte). Tanque abastecido e playlist pronta.", costType: "pago", costLabel: "💳 Pedágios + Gasolina" },
      { time: "08:30", activity: "Praia da Areia Preta & Castanheiras 🏖️", details: "Manhã nas famosas areias monazíticas da Praia da Areia Preta e sombra das amendoeiras na Praia das Castanheiras. Mar calmo e cristalino.", costType: "gratuito", costLabel: "Praia Gratuita" },
      { time: "09:00", activity: "Enseada Azul (Praia de Bacutia & Peracanga) 🌊", details: "Dia dedicado às águas límpidas e calmas da Enseada Azul. Ponto perfeito para mergulho livre e relaxar a dois.", costType: "gratuito", costLabel: "Natureza & Praia" },
      { time: "09:00", activity: "Compras de Artesanato, Panelas de Barro & Lembranças 🏺", details: "Passeio pelo comércio central de Guarapari e feirinhas de artesanato capixaba para levar as tradicionais peças de barro e doces.", costType: "pago", costLabel: "💳 Compras & Lembranças" }
    ],
    tarde: [
      { time: "13:20", activity: "Chegada a Guarapari & Check-in na Hospedagem 🏨", details: "Chegada após 449.5 km de viagem com paradas na rodovia. Check-in na pousada/hotel e almoço de boas-vindas com vista pro mar.", costType: "pago", costLabel: "💳 Hospedagem" },
      { time: "13:00", activity: "Almoço Tradicional: Moqueca Capixaba no Centro 🍲", details: "Almoço com a legítima moqueca capixaba (sem azeite de dendê e sem leite de coco) servida na tradicional panela de barro com pirão e arroz.", costType: "pago", costLabel: "💳 Moqueca Capixaba" },
      { time: "14:00", activity: "Praia dos Padres & Meaípe 🌿", details: "Acesso por escadaria cercada de vegetação nativa à paradisíaca Praia dos Padres e pôr do sol em Meaípe.", costType: "gratuito", costLabel: "Praia Selvagem" },
      { time: "11:30", activity: "Almoço de Despedida no Gaeta ou Curuca (Meaípe) 🍤", details: "Desfrutar da moqueca premiada nacionalmente nos tradicionais restaurantes da bucólica vila de pescadores de Meaípe antes de pegar a estrada.", costType: "pago", costLabel: "💳 Gastronomia Famosa" }
    ],
    noite: [
      { time: "19:00", activity: "Passeio Noturno pelo Calçadão do Centro & Sorvete 🍦", details: "Caminhada tranquila sob a brisa do mar, curtindo os quiosques e iluminação noturna das praias centrais.", costType: "pago", costLabel: "💳 Lazer Noturno" },
      { time: "20:00", activity: "Jantar Romântico com Frutos do Mar 🍷", details: "Jantar a dois com peixe grelhado, camarões e vinho em restaurante aconchegante da orla.", costType: "pago", costLabel: "💳 Jantar a Dois" },
      { time: "19:30", activity: "Bate-papo & Petiscos nos Bares de Meaípe 🍹", details: "Noite descontraída experimentando o famoso bolinho de aipim com camarão e drinks capixabas.", costType: "pago", costLabel: "💳 Petiscos & Drinks" },
      { time: "17:20", activity: "Chegada em Casa (Maricá) com Segurança 🏠✨", details: "Retorno tranquilo pela BR-101 e Estrada de Ubatiba no final do feriado de 7 de Setembro. Fim de uma viagem inesquecível a dois com o carro próprio!", costType: "gratuito", costLabel: "Viagem Concluída" }
    ],
    culturalTitle: "🏖️ Guia Completo — Guarapari, Praias Paradisíacas & Rota BR-101",
    culturalTips: [
      "Moqueca Capixaba Autêntica: 'Moqueca é capixaba, o resto é peixada!' Não deixe de provar no Curuca ou Gaeta em Meaípe.",
      "Areias Monazíticas: A Praia da Areia Preta é mundialmente famosa por suas propriedades terapêuticas naturais.",
      "Praia dos Padres: Leve água e protetor solar, pois a praia tem menos quiosques e preserva visual rústico de cartão-postal."
    ],
    logisticsTitle: "🚗 Logística da Road Trip (Maricá ⇄ Guarapari)",
    logisticsTips: [
      "Distância e Tempo: 449.5 km por trecho (899 km total ida e volta) — cerca de 7h 20min de direção tranquila.",
      "Custos Fixos Calculados: R$ 76,60 em pedágios (BR-101) + R$ 476,49 em combustível (Gasolina R$ 6,89, média 13 km/l) = R$ 553,09 total.",
      "Paradas Recomendadas: Paradas de descanso em Campos dos Goytacazes (RJ) e Mimoso do Sul (ES) para café e esticar as pernas."
    ]
  },

  // 0. Roteiro Março de 2027 (Santa Catarina > Cruzeiro MSC > SP > Rio)
  'am_marco_2027': {
    id: 'am_marco_2027',
    title: 'SC > Cruzeiro > SP > Rio',
    date: '11 de Março a 17 de Março de 2027',
    base: 'Bases: Balneário Camboriú, Navio MSC Musica, SP & Maricá',
    mode: 'Modo Roteiro Integrado • Aéreo + Cruzeiro + Terrestre',
    flagType: 'marco_2027',
    dias: [
      { data: '11/03', label: 'QUINTA' },
      { data: '12/03', label: 'SEXTA' },
      { data: '13/03', label: 'SÁBADO' },
      { data: '14/03', label: 'DOMINGO' },
      { data: '15/03', label: 'SEGUNDA' },
      { data: '16/03', label: 'TERÇA' },
      { data: '17/03', label: 'QUARTA' }
    ],
    manha: [
      { time: "20:00", activity: "Voo GIG/SDU ✈️ NVT (Navegantes)", details: "Voo com destino ao Aeroporto Internacional de Navegantes (NVT). Uber/táxi para hospedagem em Balneário Camboriú ou próximo ao parque.", costType: "pago", costLabel: "💳 Voo + Uber" },
      { time: "09:00", activity: "Beto Carrero World (Dia Inteiro no Parque) 🎡", details: "Dia integralmente dedicado ao Beto Carrero World em Penha. Parque mais vazio por ser dia útil, otimizando atracões e filas.", costType: "pago", costLabel: "💳 Ingresso Beto Carrero" },
      { time: "09:00", activity: "Museu Histórico de Itajaí & Parque do Atalaia 🏛️", details: "Visita ao Museu Histórico de Itajaí (aberto 09h-13h) para entender a formação da cidade e porto. Depois, Parque Natural Municipal do Atalaia para observar o relevo costeiro e a foz do rio.", costType: "gratuito", costLabel: "Gratuito / Cultural" },
      { time: "08:00", activity: "Café da Manhã & Check-out em Balneário ☕", details: "Check-out tranquilo na hospedagem. Às 11h, Uber de Balneário Camboriú ao Porto de Itajaí (30-40 min) para evitar filas e almoçar a bordo.", costType: "pago", costLabel: "💳 Uber Porto" },
      { time: "08:00", activity: "Chegada a Santos & Ônibus Subindo a Serra do Mar 🚌", details: "Atracação no Terminal Concais em Santos (08h-10h). Uber até o Terminal Rodoviário de Santos e ônibus para São Paulo (Viação Cometa/Express). Vista da escarpa da Serra do Mar e Mata Atlântica.", costType: "pago", costLabel: "💳 Uber + Passagem Ônibus" },
      { time: "09:00", activity: "Avenida Paulista, MASP & Japan House 🎨", details: "Caminhada pela Avenida Paulista observando arquitetura e dinâmicas urbanas. Visita ao MASP ou Japan House (entrada gratuita).", costType: "misto", costLabel: "💳 Passeio SP" },
      { time: "09:00", activity: "Centro Histórico SP, Bairro da Liberdade ou Pinacoteca ⛩️", details: "(Se optar por 2ª diária em SP): Exploração do bairro oriental da Liberdade, Farol Santander ou acervo da Pinacoteca do Estado.", costType: "pago", costLabel: "💳 Opção Diária 2" }
    ],
    tarde: [
      { time: "14:00", activity: "Check-in Hospedagem & Organização de Malas 🏨", details: "Deixar bagagens no hotel/pousada em Balneário Camboriú e preparar para os passeios da região.", costType: "pago", costLabel: "💳 Hospedagem" },
      { time: "13:00", activity: "Almoço dentro do Parque & Shows 🍔", details: "Almoço na praça temática, show Hot Wheels Epic Show e principais montanhas-russas.", costType: "pago", costLabel: "💳 Alimentação Parque" },
      { time: "12:30", activity: "Almoço em Itajaí & Parque Ecológico Raimundo Malta 🌿", details: "Almoço no Mercado Público de Itajaí (gastronomia tradicional) ou shopping. Às 14h30, Parque Ecológico Raimundo Malta em BC com trilhas planas e muita sombra.", costType: "pago", costLabel: "💳 Almoço + Parque" },
      { time: "12:00", activity: "Embarque no Navio MSC Musica (Tarifa Super Bingo) 🚢", details: "Check-in no Terminal Cruzeiros de Itajaí. Entrada na cabine, almoço buffet a bordo e exploração da estrutura do navio. Despartida às 17h!", costType: "pago", costLabel: "💳 Cruzeiro R$ 434/p" },
      { time: "13:00", activity: "Check-in Hotel SP & Parque Ibirapuera + Museu Afro Brasil 🏛️", details: "Desembarque no Jabaquara, check-in no hotel. Visita ao Parque Ibirapuera com imersão profunda no Museu Afro Brasil (história, cultura e resistência negra).", costType: "pago", costLabel: "💳 Ingresso Museu / Uber" },
      { time: "13:00", activity: "Almoço Paulista & Transfer p/ Aeroporto (CGH / GRU) ✈️", details: "Almoço em restaurante tradicional da Paulista ou Jardins. Uber para Congonhas ou Guarulhos e voo de retorno ao Rio de Janeiro.", costType: "pago", costLabel: "💳 Voo Retorno RJ" },
      { time: "13:00", activity: "Almoço no Mercado Municipal de SP (Sanduíche de Mortadela) 🥪", details: "Almoço festivo no Mercadão de SP provando pastel de bacalhau e sanduíche tradicional.", costType: "pago", costLabel: "💳 Mercadão" }
    ],
    noite: [
      { time: "19:30", activity: "Jantar Leve em Balneário Camboriú 🍽️", details: "Caminhada inicial pela orla da praia central ou restaurante próximo. Descanso para acordar cedo.", costType: "pago", costLabel: "💳 Jantar" },
      { time: "18:30", activity: "Retorno a Balneário Camboriú & Jantar 🍕", details: "Retorno para a hospedagem, jantar prático e descanso total das pernas.", costType: "pago", costLabel: "💳 Jantar" },
      { time: "18:00", activity: "Jantar no Balneário Shopping & Preparação p/ Cruzeiro 🛍️", details: "Jantar tranquilo no Balneário Shopping ou Atlântico Shopping. Retorno cedo p/ hospedagem p/ garantir sono antes do embarque no navio.", costType: "pago", costLabel: "💳 Jantar" },
      { time: "19:00", activity: "Jantar Gastronômico & Show Estilo Broadway a Bordo 🎭", details: "Primeiro jantar com menu internacional incluído e espetáculo teatral no teatro do MSC Musica navegando pelo oceano.", costType: "gratuito", costLabel: "Incluído no Navio" },
      { time: "19:30", activity: "Caminhada e Jantar na Avenida Paulista 🍝", details: "Jantar aconchegante e passeio noturno iluminado pelos arredores da Avenida Paulista e Jardins.", costType: "pago", costLabel: "💳 Jantar SP" },
      { time: "19:00", activity: "Desembarque no RJ & Chegada em Casa (Maricá) 🏠", details: "Pouso no Santos Dumont (SDU) ou Galeão (GIG) e transporte final de volta para a residência em Maricá com bagagem cheia de boas memórias!", costType: "gratuito", costLabel: "Concluído" },
      { time: "18:00", activity: "Voo de Volta SP ✈️ RJ & Chegada a Maricá 🚗", details: "Voo final para o Rio e transporte para Maricá se tiver optado pela pernoite extra de quarta-feira.", costType: "gratuito", costLabel: "Concluído" }
    ],
    culturalTitle: "🚢 Roteiro Integrado — Santa Catarina, Navio MSC Musica, São Paulo & Maricá",
    mscBookingUrl: "https://www.msccruzeiros.com.br/Booking?CruiseID=MU20270314ITJSSZ&Type=CROL&DealID=bb9cf5fc-d79f-464c-86ad-204f956e3d22&PriceCode=&NewCruise=true&MacroCategory=&Category=&D5khRbFgz0nqK8qp3Z8MmCXdefQJ5QMiU3p2m_ul_L8QxQNI8tVX6KR8hM35HIwT&src=BB9CF5FCD79F464C86AD204F956E3D22#/pricing",
    culturalTips: [
      "No Parque Beto Carrero (Sexta 12/03), dia útil ideal com menor fila nas montanhas-russas.",
      "Pacotes do Cruzeiro MSC Musica (14/03 Itajaí -> Santos): Opções de R$ 454 (sem bebidas), R$ 634 (Pacote Easy Bebidas) e R$ 684 (Premium Extra). Todas incluem refeições e espetáculos estilo Broadway!",
      "No Museu Afro Brasil (Ibirapuera - SP), reserve ao menos 2h para uma experiência cultural e histórica inesquecível."
    ],
    logisticsTitle: "📌 Dicas de Logística & Link de Reserva Directa MSC",
    logisticsTips: [
      "Voo de ida: Rio de Janeiro (SDU/GIG) ✈️ Navegantes (NVT).",
      "Embarque do Navio: Porto de Itajaí às 11h do domingo 14/03 (Saída 17h / Chegada Santos 08h de segunda).",
      "Desembarque: Terminal Concais de Santos -> Ônibus para SP subindo a Serra do Mar.",
      "Link de Reserva do Cruzeiro MSC Musica: Acesse o painel abaixo para comprar diretamente no site oficial da MSC."
    ],
    cruisePackages: [
      {
        title: "3º E 4º VIAJAM GRÁTIS",
        price: "R$ 454",
        priceNote: "por pessoa*",
        badge: "Opção Mais Econômica",
        features: [
          "3º e 4º hóspedes viajam grátis pagando apenas as taxas",
          "Amplas e confortáveis cabines",
          "Todas as refeições com o melhor da gastronomia internacional (Buffet & Restaurantes)",
          "Shows ao estilo Broadway no teatro do navio",
          "Atividades e entretenimento para toda a família"
        ]
      },
      {
        title: "BEBIDAS INCLUSAS",
        price: "R$ 634",
        priceNote: "por pessoa*",
        badge: "Mais Vendido / Recomendado",
        highlight: true,
        features: [
          "3º e 4º hóspedes viajam grátis pagando apenas as taxas",
          "Pacote de Bebidas Easy Incluso (Chopp, vinhos em taça, refrigerantes, sucos, água mineral & bebidas quentes)",
          "Todas as refeições inclusas na gastronomia internacional",
          "Shows ao estilo Broadway e estrutura de lazer a bordo"
        ]
      },
      {
        title: "PREMIUM EXTRA INCLUSO",
        price: "R$ 684",
        priceNote: "por pessoa*",
        badge: "Experiência VIP Completa",
        features: [
          "3º e 4º hóspedes viajam grátis pagando apenas as taxas",
          "Pacote de Bebidas Premium Extra Incluso",
          "Vinhos finos, destilados de marcas premium, coquetéis artesanais & cervejas especiais",
          "Sucos naturais, energéticos, cafés de especialidade e águas de garrafa",
          "Gastronomia completa e espetáculos ao estilo Broadway"
        ]
      }
    ]
  },

  // 1. Salvador - Plano E (Férias em Salvador)
  'am_salvador_julho': {
    id: 'am_salvador_julho',
    title: 'Nordeste em Julho',
    date: '16 de Julho a 23 de Julho de 2026',
    base: 'Bases: Salvador, Maceió & Orla de Atalaia',
    mode: 'Modo Road Trip • Carro Alugado',
    flagType: 'bahia_serg_alagoas',
    dias: [
      { data: '16/07', label: 'QUINTA' },
      { data: '17/07', label: 'SEXTA' },
      { data: '18/07', label: 'SÁBADO' },
      { data: '19/07', label: 'DOMINGO' },
      { data: '20/07', label: 'SEGUNDA' },
      { data: '21/07', label: 'TERÇA' },
      { data: '22/07', label: 'QUARTA' },
      { data: '23/07', label: 'QUINTA' }
    ],
    manha: [
      { time: "08:25", activity: "Voo GIG → SSA (Confirmado! 📱)", details: "Decolagem autorizada no Aeroporto do Galeão (GIG) às 08h25 no voo G3 1896. Viagem tranquila com previsão de pouso em Salvador (SSA) às 10h30. Malas prontas para começar a viagem cedo!", costType: "gratuito", costLabel: "Sem Custos Extra" },
      { time: "08:30", activity: "Circuito Histórico Pelourinho & Federação 🏛️", details: "Pela manhã, pegamos o carro alugado para fazer o belíssimo circuito cultural no Centro Histórico e arredores. Tudo no Pelourinho é feito a pé, as atrações são coladas uma na outra!\n• 08h30: Estacionamento subterrâneo da Praça da Sé (Well Park) - Super seguro e prático, logo na entrada do Pelourinho (Estacione o carro aqui uma única vez!)\n• 08h45: Museu da Misericórdia (Aberto! R$ 10) - História e arte sacra primorosas, ao lado do estacionamento.\n• 09h30: Museu da Gastronomia Baiana - Senac (Aberto! Gratuito) - História culinária, baianas e acervos no Largo do Pelourinho.\n• 10h15: Casa do Carnaval da Bahia (Aberto! R$ 20) - Tecnologia, figurinos e cinema interativo, ao lado do Terreiro de Jesus.\n• 10h50: Parada obrigatória no Cravinho (Terreiro de Jesus) e garantir o maravilhoso Pãozinho Delícia na Pãozito (a melhor iguaria baiana!).\n• 11h15: MUNCAB - Museu da Cultura Afro-Brasileira (Aberto! R$ 20) - Acervo e representação afro fundamental (perto da saída da Praça da Sé).\n• 11h45: Casa das Histórias de Salvador (Aberto! R$ 20) - Museu imersivo e tecnológico que resgata a trajetória fascinante da primeira capital do Brasil.\n• 12h30: Pegar o carro na Praça da Sé e passar no Terreiro Casa Branca (Federação) no caminho para o almoço no Imbuí!\n\nSeguiremos em seguida de carro direto para o Imbuí!", costType: "pago", costLabel: "💳 Ingressos: R$ 90 + Estacionamento" },
      { time: "04:00", activity: "Saída para Maceió", details: "Saída de Salvador pegando a estrada (BR-101/BA-099) rumo a Alagoas. É uma viagem de aproximadamente 600 km (cerca de 8 hours de duração).", costType: "pago", costLabel: "💳 Gasto: Aluguel Carro + Combustível" },
      { time: "06:00", activity: "Saída para Maragogi (Catamarã)", details: "Saída para Maragogi (Passeio fechado com agência). A viagem dura cerca de 2h a 2h30. Aproveitar o pacote já incluso (Transporte + Passeio de Catamarã às piscinas naturais).", costType: "pago", costLabel: "💳 Combo 2 Dias" },
      { time: "07:00", activity: "Praia do Gunga", details: "Saída para a Praia do Gunga (roteiro completo com a agência). A praia fica a cerca de 1 hora de Maceió. O roteiro includes Parada para Fotos e Mirante.", costType: "pago", costLabel: "Incluso no Combo" },
      { time: "12:00", activity: "Saída de Aracaju (12h) 🚗", details: "Manhã tranquila e saída de Aracaju às 12h00 pegando a rodovia em direção a Salvador.", costType: "pago", costLabel: "💳 Combustível + Pedágio" },
      { time: "09:00", activity: "🏛️ Cidade Baixa, Elevação & Cidade Alta (Pelourinho)", details: "• 09:00 — Galeria Mercado Modelo (Subsolo): Nova expografia no subsolo desmistificando o mito de prisão de escravizados (era estrutura de sustentação da alfândega), abrigando a série 'Cabeças de Tempo' de Mário Cravo Jr. e esculturas de Rubem Valentim. (Entrada Gratuita às quartas).\n• 10:00 — Casa das Histórias de Salvador: Na Rua da Bélgica (ao lado do Mercado Modelo), oferecendo uma imersão na formação estrutural, arquitetônica e social de Salvador. (Entrada Gratuita às quartas).\n• 11:30 — Elevador Lacerda (R$ 0,15): Subida para a Cidade Alta rumo ao Pelourinho para dar início ao circuito cultural e almoço.", costType: "gratuito", costLabel: "💸 100% Gratuito (Quarta Cultural)" },
      { time: "02:00", activity: "Acordar e Aeroporto (SSA)", details: "02h00: Acordar e solicitar o Uber. Devolução do carro se aplicável na locadora.\n02h30-03h00: Chegada ao Aeroporto de Salvador (SSA) para despachar bagagem e raio-x com calma.\n05h50: Decolagem do voo G3 1865 de volta para o Rio de Janeiro.", costType: "pago", costLabel: "💳 Gasto: Uber/Devolução" }
    ],
    tarde: [
      { time: "10:30", activity: "Ajuste Logístico (Sem Carro) 🛒", details: "Pouso programado em Salvador às 10h30. Devido a imprevistos logísticos, o carro não foi retirado ontem. Fomos de Uber para o Airbnb Caminho das Árvores, fizemos compras básicas no supermercado Pão de Açúcar (no Salvador Shopping, ao lado) e descansamos preparando o fôlego para o resto do roteiro.", costType: "pago", costLabel: "💳 Gasto: Supermercado" },
      { time: "12:30", activity: "Almoço no Imbuí & Camarote Esquadrãozone 🔴🔵", details: "• 12h30: Chegada de carro no Imbuí para almoço caseiro e aconchegante em família.\n• 14h30: Deslocamento estratégico do Imbuí para a Arena Fonte Nova.\n• 15h30: Entrada na Arena Fonte Nova (com 4 horas de antecedência) para desfrutar da excelente área VIP, buffet completo com comidas típicas, bebidas inclusas, música ao vivo e toda a animação pré-jogo do Bahia contra a Chapecoense!", costType: "pago", costLabel: "💳 Camarote VIP" },
      { time: "12:00", activity: "Chegada em Maceió & Orla", details: "Chegada prevista em Maceió. Realizar o check-in no aconchegante apartamento alugado (Airbnb de Luciano). Tarde: Almoço, visita à orla urbana (Praia da Ponta Verde e Praia de Pajuçara) e passeio pela Feira de Artesanato de Pajuçara. Retorno ao apartamento para descansar da viagem.", costType: "gratuito", costLabel: "Sem Custos" },
      { time: "Tarde", activity: "Maragogi e Retorno", details: "Continuar aproveitando as belezas das piscinas naturais de Maragogi. Fim da tarde: Retorno para Maceió.", costType: "gratuito", costLabel: "-" },
      { time: "15:30", activity: "Fim do Passeio e Viagem p/ Aracaju", details: "Fim do passeio no Gunga e partida imediata rumo a Aracaju. A viagem tem cerca de 270 km e dura em média 4h30.", costType: "pago", costLabel: "💳 Gasto: Combustível" },
      { time: "15:00", activity: "Outlet Premium, Aeroporto (Passagens) & Localiza 🛍️✈️", details: "• Parada no Outlet Premium Salvador na Estrada do Coco para passear e conhecer.\n• Visita ao Aeroporto de Salvador (SSA) para consultar remarcação/ajuste de voos.\n• Passagem na Localiza para tratativas do veículo.", costType: "misto", costLabel: "💳 Compras / Logística" },
      { time: "13:00", activity: "🍲 Almoço no Axego, Casa de Jorge Amado & Gastronomia Baiana 🏛️", details: "• 13:00 — Almoço no Axego Restaurante & Bar: Almoço especial saboreando a autêntica moqueca e culinária baiana no Pelourinho.\n• 14:30 — Fundação Casa de Jorge Amado: Visita ao casarão azul no Largo do Pelourinho com exposições da obra literária e a exposição temática dedicada a Exu.\n• 15:30 — Museu da Gastronomia Baiana (Senac Pelourinho): Imersão na história dos pratos típicos, temperos, baianas de acarajé e acervo da culinária baiana.", costType: "pago", costLabel: "💳 Axego + Museus Pelourinho" },
      { time: "08:15", activity: "Pouso no Rio de Janeiro (GIG) 🛬", details: "Chegada prevista no Aeroporto Galeão (GIG) às 08h15. Retorno seguro à residência no RJ finalizando as férias inesquecíveis no Nordeste!", costType: "gratuito", costLabel: "-" }
    ],
    noite: [
      { time: "Noite", activity: "Jantar no Rio Vermelho 🍷", details: "Noite maravilhosa para celebrar a chegada na Bahia! Desfrutar do clima boêmio e animado do Rio Vermelho, saboreando um delicioso acarajé da Dinha ou da Cira e brindando as férias. Pernoitagem no Airbnb.", costType: "pago", costLabel: "💳 Gasto: Jantar / Acarajé" },
      { time: "Noite", activity: "Jogo do Bahia & Descanso", details: "Assistir ao jogo do Bahia na Fonte Nova. A prioridade máxima após o jogo é garantir o descanso na noite para aguentar a viagem longa de amanhã cedo.", costType: "pago", costLabel: "💳 Ingressos", links: [{ title: 'Ingresso do Jogo', url: 'https://embedstore.ingresse.com/tickets/ingresse.com/event/90227?redirect=true&eventid=90227&client=new-site&event-name=camarote-esquadraozone-bahia-x-chapecoense&scsession=712977188868179387711827' }] },
      { time: "19:00", activity: "Jantar na Orla de Maceió", details: "Jantar relaxante na orla de Maceió (Lopana ou Kanoa) para repor as energias da longa viagem de carro.", costType: "pago", costLabel: "💳 Gasto: Jantar" },
      { time: "19:00", activity: "Descanso e Jantar na Orla", details: "Início da noite: Chegar no apartamento e dormir/descansar do passeio intenso de Maragogi. Mais tarde: Sair para jantar na orla.", costType: "pago", costLabel: "💳 Gasto: Jantar" },
      { time: "20:00", activity: "Chegada em AJU & Passarela do Caranguejo", details: "Chegada prevista em Aracaju (20h00). Check-in na hospedagem Premium na Orla de Atalaia. Jantar na famosa Passarela do Caranguejo (excelente local para provar a culinária local).", costType: "pago", costLabel: "💳 Gasto: Jantar de Boas-Vindas" },
      { time: "19:00", activity: "Salvador Shopping & Airbnb Caminho das Árvores 🛒🏡", details: "• Passeio e jantar no Salvador Shopping (ao lado do Caminho das Árvores).\n• Chegada e descanso no Airbnb no Caminho das Árvores se preparando para o último dia em Salvador.", costType: "pago", costLabel: "💳 Jantar / Shopping" },
      { time: "16:45", activity: "🌅 Pôr do Sol na Barra & Preparação Pré-Voo", details: "16:45 — Praia do Farol da Barra: Contemplação do pôr do sol no Farol com água de coco gelada na orla.\n17:30 — Sorveteria da Barra (Edifício Expresso 2222): Alternativa para degustar os sorvetes artesanais de coco verde, cajá ou mangaba.\n19:30 em diante — Retorno ao Caminho das Árvores: Jantar leve, organização das bagagens e descanso estratégico para o voo de madrugada (02h00 ida ao aeroporto / 05h50 do dia 23/07 no Aeroporto de Salvador - SSA).", costType: "misto", costLabel: "⚖️ Sorvete + Coco + Uber" },
      { time: "-", activity: "Descanso em Casa no Rio 🏠", details: "Descanso bem merecido em casa no Rio de Janeiro e ótimas lembranças da viagem.", costType: "gratuito", costLabel: "-" }
    ],
    culturalTitle: "🏺 Cultura, Mar e Tradições Nordestinas",
    culturalTips: [
      "Voucher LocarX: Guarde o voucher (código QHKJDZC) no celular. Ao desembarcar, suba até a praça de alimentação no 1º andar e vá em frente à lanchonete Tabuleiro para pegar o transfer gratuito da locadora.",
      "Museu da Gente Sergipana e MUNCAB: Aproveite as imersões históricas fundamentais e super imersivas.",
      "Terreiro da Casa Branca: Marco sociológico e de resistência, o terreiro de Candomblé mais antigo do Brasil em Salvador."
    ],
    logisticsTitle: "🚗 Logística de Estrada e Otimização",
    logisticsTips: [
      "O planejamento da descida parando na Praia do Gunga e a ida passando pela Lagoa dos Tambaquis é muito inteligente, pois otimiza o tempo sem desvios cansativos.",
      "Rodovia BR-101 e BA-099: O percurso entre os três estados tem trechos belíssimos. Lembre-se de sair às 04h00 de Salvador no dia 18 para chegar ao meio-dia em Maceió."
    ]
  },

  // 2. Salvador + Aracaju - Plano B/C anterior (Conjugado)
  'am_ssa_aju': {
    id: 'am_ssa_aju',
    title: 'Roteiro - Salvador + Aracaju',
    date: '11 de Julho a 19 de Julho de 2026',
    base: 'Base: Salvador (Mercure) & Atalaia',
    mode: 'Modo Conjugado Nordeste',
    flagType: 'bahia_serg',
    dias: [
      { data: '11/07', label: 'SÁBADO' },
      { data: '12/07', label: 'DOMINGO' },
      { data: '13/07', label: 'SEGUNDA' },
      { data: '14/07', label: 'TERÇA' },
      { data: '15/07', label: 'QUARTA' },
      { data: '16/07', label: 'QUINTA' },
      { data: '17/07', label: 'SEXTA' },
      { data: '18/07', label: 'SÁBADO' },
      { data: '19/07', label: 'DOMINGO' }
    ],
    manha: [
      { time: "Manhã", activity: "Embarque no Rio", details: "Voo LATAM GIG -> SSA.", costType: "pago", costLabel: "💳 Gasto: Voo de Ida" },
      { time: "09:00", activity: "Farol da Barra", details: "Banho de sol e de mar nas piscinas naturais da Barra.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "09:00", activity: "Praia de Itapuã", details: "Caminhar pelas areias de Itapuã e ver a Lagoa do Abaeté.", costType: "misto", costLabel: "⚖️ Misto: Gasto de Uber" },
      { time: "05:30", activity: "Transfer p/ Aracaju", details: "Uber para Rodoviária de SSA.\nÔnibus Semi-Leito para AJU.", costType: "pago", costLabel: "💳 Gasto: Passagem R$ 109" },
      { time: "08:30", activity: "Crooa do Goré", details: "Tour de Catamarã partindo do atracadouro rumo à Crooa.", costType: "pago", costLabel: "💳 Gasto: Catamarã" },
      { time: "07:00", activity: "Cânions de Xingó", details: "Sair muito cedo. Navegação épica pelo Velho Chico.", costType: "pago", costLabel: "💳 Gasto: Tour Completo" },
      { time: "09:00", activity: "Lagoa dos Tambaquis", details: "Alimentar os peixes gigantes de dentro da lagoa de água doce.", costType: "pago", costLabel: "💳 Gasto: Entrada Lagoa" },
      { time: "09:00", activity: "Mercados Municipais", details: "Artesanato, castanhas e queijo coalho tradicionais de AJU.", costType: "misto", costLabel: "⚖️ Misto: Compras" },
      { time: "10:00", activity: "Último mergulho na Orla", details: "Aproveitar a praia de Atalaia antes de arrumar as malas.", costType: "gratuito", costLabel: "💸 Gratuito" }
    ],
    tarde: [
      { time: "14:00", activity: "Chegada em SSA", details: "Check-in no Quality Hotel Salvador e descansar.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "14:00", activity: "Centro Histórico & Ziraldo", details: "Pelourinho e Exposição Mundo Zira no Museu de Arte da Bahia.", costType: "misto", costLabel: "⚖️ Misto: Grátis (MAB)", links: [{ title: "Exposição Ziraldo", url: "https://www.salvadordabahia.com/eventos/exposicao-mundo-zira-ziraldo-interativo/" }] },
      { time: "15:00", activity: "Ponta de Humaitá", details: "Ver o belíssimo pôr do sol na Baía de Todos os Santos.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "12:05", activity: "Chegada em AJU", details: "Check-in no Airbnb na Orla de Atalaia. Almoçar perto.", costType: "pago", costLabel: "💳 Gasto: Almoço" },
      { time: "14:00", activity: "Ilha dos Namorados", details: "Relaxar em redes dentro d'água sob o céu sergipano.", costType: "gratuito", costLabel: "💸 Gratuito: Passeio" },
      { time: "14:00", activity: "Almoço do Cânion", details: "Almoço com buffet típico flutuante incluso no passeio.", costType: "gratuito", costLabel: "Incluso no Tour" },
      { time: "14:30", activity: "Praia do Saco", details: "Passeio de buggy pelas dunas de areia finíssima de AJU.", costType: "pago", costLabel: "💳 Gasto: Buggy opcional" },
      { time: "14:00", activity: "Museu da Gente Sergipana", details: "Museu totalmente interativo, imperdível e tecnológico.", costType: "gratuito", costLabel: "💸 Entrada Grátis" },
      { time: "13:30", activity: "Viagem de Volta", details: "Embarque na rodoviária de volta para Salvador.", costType: "pago", costLabel: "💳 Gasto: Ônibus Volta" }
    ],
    noite: [
      { time: "19:00", activity: "Jantar prático", details: "Alimentação no hotel ou shopping próximo.", costType: "pago", costLabel: "💳 Gasto: Alimentação" },
      { time: "19:00", activity: "Rio Vermelho", details: "Acarajé da Cira e curtir os bares charmosos da praça.", costType: "pago", costLabel: "💳 Gasto: Consumo" },
      { time: "19:30", activity: "Jantar no hotel", details: "Descansar as pernas para a viagem do dia seguinte.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "19:00", activity: "Passarela do Caranguejo", details: "Comer caranguejo quebrado na hora com cerveja gelada na Orla.", costType: "pago", costLabel: "💳 Gasto: Jantar" },
      { time: "19:00", activity: "Jantar na Atalaia", details: "Passeio pela feirinha de artesanato local da Orla.", costType: "misto", costLabel: "⚖️ Misto: Lanches" },
      { time: "19:00", activity: "Retorno a Aracaju", details: "Chegada exaustos, cozinhar em casa e dormir.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "19:30", activity: "Jantar econômico", details: "Cozinhar um belo jantar no Airbnb da Atalaia.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "20:00", activity: "OSBA de Volta ao TCA", details: "Concerto da Folia! LEMBRETE: Comprar ingresso com antecedência, assentos limitados (TCA).", costType: "pago", costLabel: "💳 Gasto: Ingresso", links: [{ title: "Programação OSBA", url: "https://www.salvadordabahia.com/eventos/osba-de-volta-ao-tca-confira-programacao/" }, { title: "Comprar Ingresso", url: "https://bileto.sympla.com.br/event/123150/d/396363/s/2611439" }] },
      { time: "18:55", activity: "Fim das Atividades", details: "Chegada em Salvador e preparação de voo para o Rio.", costType: "misto", costLabel: "⚖️ Misto" }
    ],
    culturalTitle: "🌴 Belezas e Gastronomia Sergipana",
    culturalTips: [
      "Museu da Gente Sergipana: Um dos melhores museus do Brasil, com entrada gratuita. Vale muito a visita na tarde de sábado.",
      "Passarela do Caranguejo: Ponto clássico de Aracaju para degustar frutos do mar frescos ao som de forró ao vivo."
    ],
    logisticsTitle: "🚌 Conexão Terrestre e Passeios",
    logisticsTips: [
      "Bate-volta Xingó: A viagem de Aracaju até os cânions leva cerca de 3 horas de micro-ônibus. Vá preparado com roupas leves e protetor solar.",
      "Aduana e Divisa: A rodovia Linha Verde possui ótimo asfalto e lindas paisagens entre as capitais da BA e SE."
    ]
  },
  'am_sp_ssa_aju': {
    id: 'am_sp_ssa_aju',
    title: 'Roteiro - São Paulo + Salvador + Aracaju',
    date: '11 de Julho a 19 de Julho de 2026',
    base: 'Base: Salvador (Mercure) & Atalaia',
    mode: 'Modo Conjugado Nordeste',
    flagType: 'bahia_serg',
    dias: [
      { data: '11/07', label: 'SÁBADO' },
      { data: '12/07', label: 'DOMINGO' },
      { data: '13/07', label: 'SEGUNDA' },
      { data: '14/07', label: 'TERÇA' },
      { data: '15/07', label: 'QUARTA' },
      { data: '16/07', label: 'QUINTA' },
      { data: '17/07', label: 'SEXTA' },
      { data: '18/07', label: 'SÁBADO' },
      { data: '19/07', label: 'DOMINGO' }
    ],
    manha: [
      { time: "Manhã", activity: "Embarque no Rio", details: "Voo LATAM GIG -> SSA.", costType: "pago", costLabel: "💳 Gasto: Voo de Ida" },
      { time: "09:00", activity: "Farol da Barra", details: "Banho de sol e de mar nas piscinas naturais da Barra.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "09:00", activity: "Praia de Itapuã", details: "Caminhar pelas areias de Itapuã e ver a Lagoa do Abaeté.", costType: "misto", costLabel: "⚖️ Misto: Gasto de Uber" },
      { time: "05:30", activity: "Transfer p/ Aracaju", details: "Uber para Rodoviária de SSA.\nÔnibus Semi-Leito para AJU.", costType: "pago", costLabel: "💳 Gasto: Passagem R$ 109" },
      { time: "08:30", activity: "Crooa do Goré", details: "Tour de Catamarã partindo do atracadouro rumo à Crooa.", costType: "pago", costLabel: "💳 Gasto: Catamarã" },
      { time: "07:00", activity: "Cânions de Xingó", details: "Sair muito cedo. Navegação épica pelo Velho Chico.", costType: "pago", costLabel: "💳 Gasto: Tour Completo" },
      { time: "09:00", activity: "Lagoa dos Tambaquis", details: "Alimentar os peixes gigantes de dentro da lagoa de água doce.", costType: "pago", costLabel: "💳 Gasto: Entrada Lagoa" },
      { time: "09:00", activity: "Mercados Municipais", details: "Artesanato, castanhas e queijo coalho tradicionais de AJU.", costType: "misto", costLabel: "⚖️ Misto: Compras" },
      { time: "10:00", activity: "Último mergulho na Orla", details: "Aproveitar a praia de Atalaia antes de arrumar as malas.", costType: "gratuito", costLabel: "💸 Gratuito" }
    ],
    tarde: [
      { time: "14:00", activity: "Chegada em SSA", details: "Check-in no Quality Hotel Salvador e descansar.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "14:00", activity: "Centro Histórico", details: "Elevador Lacerda e caminhada histórica pelo Pelourinho.", costType: "misto", costLabel: "⚖️ Misto: Passeio Público" },
      { time: "15:00", activity: "Ponta de Humaitá", details: "Ver o belíssimo pôr do sol na Baía de Todos os Santos.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "12:05", activity: "Chegada em AJU", details: "Check-in no Airbnb na Orla de Atalaia. Almoçar perto.", costType: "pago", costLabel: "💳 Gasto: Almoço" },
      { time: "14:00", activity: "Ilha dos Namorados", details: "Relaxar em redes dentro d'água sob o céu sergipano.", costType: "gratuito", costLabel: "💸 Gratuito: Passeio" },
      { time: "14:00", activity: "Almoço do Cânion", details: "Almoço com buffet típico flutuante incluso no passeio.", costType: "gratuito", costLabel: "Incluso no Tour" },
      { time: "14:30", activity: "Praia do Saco", details: "Passeio de buggy pelas dunas de areia finíssima de AJU.", costType: "pago", costLabel: "💳 Gasto: Buggy opcional" },
      { time: "14:00", activity: "Museu da Gente Sergipana", details: "Museu totalmente interativo, imperdível e tecnológico.", costType: "gratuito", costLabel: "💸 Entrada Grátis" },
      { time: "13:30", activity: "Viagem de Volta", details: "Embarque na rodoviária de volta para Salvador.", costType: "pago", costLabel: "💳 Gasto: Ônibus Volta" }
    ],
    noite: [
      { time: "19:00", activity: "Jantar prático", details: "Alimentação no hotel ou shopping próximo.", costType: "pago", costLabel: "💳 Gasto: Alimentação" },
      { time: "19:00", activity: "Rio Vermelho", details: "Acarajé da Cira e curtir os bares charmosos da praça.", costType: "pago", costLabel: "💳 Gasto: Consumo" },
      { time: "19:30", activity: "Jantar hotel", details: "Descansar as pernas para a viagem do dia seguinte.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "19:00", activity: "Passarela do Caranguejo", details: "Comer caranguejo quebrado na hora com cerveja gelada na Orla.", costType: "pago", costLabel: "💳 Gasto: Jantar" },
      { time: "19:00", activity: "Jantar na Atalaia", details: "Passeio pela feirinha de artesanato local da Orla.", costType: "misto", costLabel: "⚖️ Misto: Lanches" },
      { time: "19:00", activity: "Retorno a Aracaju", details: "Chegada exaustos, cozinhar em casa e dormir.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "19:30", activity: "Jantar econômico", details: "Cozinhar um belo jantar no Airbnb da Atalaia.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "19:00", activity: "Noite de Pizza", details: "Reunir lembranças e descansar.", costType: "pago", costLabel: "💳 Gasto: Alimentação" },
      { time: "18:55", activity: "Fim das Atividades", details: "Chegada em Salvador e preparação de voo para o Rio.", costType: "misto", costLabel: "⚖️ Misto" }
    ],
    culturalTitle: "🏺 Cultura e Monumentos do Recôncavo",
    culturalTips: [
      "Salvador Cultural: Conecte os edifícios históricos do Pelourinho com as manifestações locais e as feiras tradicionais.",
      "Segurança: Ao passear no centro de Salvador, dê preferência a guias credenciados e evite ostentar objetos de valor."
    ],
    logisticsTitle: "🚗 Logística de Integração",
    logisticsTips: [
      "Conexão SP-SSA: No caso de conexões com voos de São Paulo, fique atento aos portões de embarque nos terminais integrados de Congonhas ou Guarulhos.",
      "Transporte Local: O uso de aplicativos de transporte em Salvador e Aracaju é amplo, sendo seguro para o trajeto aeroporto-hotel."
    ]
  },

  // 3. Foz + Buenos Aires - Plano D
  'am_rio_foz_ba': {
    id: 'am_rio_foz_ba',
    title: 'Roteiro - Foz + Buenos Aires',
    date: '01 de Janeiro a 08 de Janeiro de 2027',
    base: 'Base: Foz do Iguaçu & Buenos Aires',
    mode: 'Modo Premium Internacional',
    flagType: 'argentina_brazil',
    dias: [
      { data: '01/01', label: 'SEXTA' },
      { data: '02/01', label: 'SÁBADO' },
      { data: '03/01', label: 'DOMINGO' },
      { data: '04/01', label: 'SEGUNDA' },
      { data: '05/01', label: 'TERÇA' },
      { data: '06/01', label: 'QUARTA' },
      { data: '07/01', label: 'QUINTA' },
      { data: '08/01', label: 'SEXTA' }
    ],
    manha: [
      { time: "03:55", activity: "Voo para Buenos Aires", details: "Decolagem do voo Flybondi de GIG para AEP. Check-in e migração.", costType: "pago", costLabel: "💳 Gasto: Passagem" },
      { time: "09:00", activity: "Cataratas do Iguaçu", details: "Visita ao lado brasileiro. Garganta do Diabo majestosa.", costType: "pago", costLabel: "💳 Gasto: Ingresso" },
      { time: "10:00", activity: "Caminito & La Boca", details: "Caminhada pelas cores vibrantes das casas de La Boca.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "09:30", activity: "Recoleta & Cemitério", details: "Visita histórica. Ver o túmulo de Evita Perón.", costType: "misto", costLabel: "⚖️ Misto: Entrada + Uber" },
      { time: "10:00", activity: "Parque de Palermo", details: "Caminhada matinal agradável pelos lagos e roseiral.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "09:00", activity: "Teatro Colón Tour", details: "Visita guiada pelo luxuoso teatro lírico.", costType: "pago", costLabel: "💳 Gasto: Bilhete" },
      { time: "08:00", activity: "Viagem p/ Assunção", details: "Embarque em ônibus rodoviário semi-leito saindo de Foz.", costType: "pago", costLabel: "💳 Gasto: Passagem Ônibus" },
      { time: "05:50", activity: "Voo de volta para GIG", details: "Uber para o aeroporto internacional de Foz (IGU).", costType: "pago", costLabel: "💳 Gasto: Uber" }
    ],
    tarde: [
      { time: "14:00", activity: "Feira de San Telmo", details: "Explorar antiguidades, pinturas e shows de tango na rua.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "14:30", activity: "Macuco Safari", details: "Passeio de barco inflável sob as quedas das cataratas.", costType: "pago", costLabel: "💳 Gasto: Safari Pago" },
      { time: "14:00", activity: "Puerto Madero Walk", details: "Caminhada pela ponte, fragatas históricas e almoço.", costType: "misto", costLabel: "⚖️ Misto: Almoço" },
      { time: "15:00", activity: "Livraria El Ateneo", details: "Conhecer a famosa livraria instalada em antigo teatro.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "14:30", activity: "Calle Florida Compras", details: "Pesquisar roupas de couro e saborear alfajores Havanna.", costType: "pago", costLabel: "💳 Gasto: Compras" },
      { time: "14:00", activity: "Galerías Pacífico", details: "Admirar as belíssimas pinturas e murais no teto.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "15:00", activity: "Chegada em Assunção", details: "Check-in no hotel e breve descanso após o percurso rodoviário.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "-", activity: "Chegada ao Rio", details: "Retorno seguro à residência no RJ.", costType: "gratuito", costLabel: "-" }
    ],
    noite: [
      { time: "20:00", activity: "Don Julio Parrilla", details: "Jantar os espetaculares cortes argentinos (bife de lomo).", costType: "pago", costLabel: "💳 Gasto: Jantar Premium" },
      { time: "19:00", activity: "Três Fronteiras", details: "Show de luzes e danças tradicionais dos 3 países.", costType: "pago", costLabel: "💳 Gasto: Ingresso" },
      { time: "20:30", activity: "Show de Tango clássico", details: "Apresentação de gala com jantar e vinhos excelentes.", costType: "pago", costLabel: "💳 Gasto: Show Pago" },
      { time: "19:30", activity: "Pizzeria Guerrín", details: "A mais tradicional pizza de Buenos Aires na Av. Corrientes.", costType: "pago", costLabel: "💳 Gasto: Pizza Econômica" },
      { time: "21:00", activity: "Palermo Soho Bares", details: "Drinks sofisticados e boa música na área boêmia.", costType: "pago", costLabel: "💳 Gasto: Consumos" },
      { time: "19:30", activity: "Jantar Puerto Madero", details: "Saborear um bife de tira em um dos restaurantes à beira d'água.", costType: "pago", costLabel: "💳 Gasto: Jantar" },
      { time: "20:00", activity: "Palácio de los López", details: "Apreciar o palácio presidencial paraguaio iluminado.", costType: "pago", costLabel: "💳 Gasto: Jantar" },
      { time: "-", activity: "Descanso GIG", details: "Fim das férias internacionais e retorno à rotina.", costType: "gratuito", costLabel: "-" }
    ],
    culturalTitle: "🍷 Gastronomia e Shows de Tango",
    culturalTips: [
      "Parrilla Don Julio: Reserve com pelo menos 2 a 3 meses de antecedência ou chegue às 11h15 para pegar lista de espera no almoço.",
      "Câmbio MEP/Blue: Usar cartão Wise ou Western Union garante quase o dobro do poder de compra comparado ao câmbio oficial."
    ],
    logisticsTitle: "💧 Cataratas, Fronteiras & Clima",
    logisticsTips: [
      "Macuco Safari: Leve capa de chuva e uma troca de roupa completa com toalha, pois o barco entra embaixo das quedas!",
      "Aduana: Tenha em mãos RG com menos de 10 anos de emissão ou Passaporte válido para cruzar as fronteiras terrestres."
    ]
  },
  'am_foz_ass_ba': {
    id: 'am_foz_ass_ba',
    title: 'Roteiro - Buenos Aires + Assunção + Foz do Iguaçu',
    date: '01 de Janeiro a 15 de Janeiro de 2027',
    base: 'Base: Foz do Iguaçu, Assunção & Buenos Aires',
    mode: 'Modo Multi-Destinos',
    flagType: 'argentina_brazil',
    dias: [
      { data: '01/01', label: 'SEXTA' },
      { data: '02/01', label: 'SÁBADO' },
      { data: '03/01', label: 'DOMINGO' },
      { data: '04/01', label: 'SEGUNDA' },
      { data: '05/01', label: 'TERÇA' },
      { data: '06/01', label: 'QUARTA' },
      { data: '07/01', label: 'QUINTA' },
      { data: '08/01', label: 'SEXTA' }
    ],
    manha: [
      { time: "03:55", activity: "Voo para Buenos Aires", details: "Decolagem do voo Flybondi de GIG para AEP. Check-in e migração.", costType: "pago", costLabel: "💳 Gasto: Passagem" },
      { time: "09:00", activity: "Cataratas do Iguaçu", details: "Visita ao lado brasileiro. Garganta do Diabo majestosa.", costType: "pago", costLabel: "💳 Gasto: Ingresso" },
      { time: "10:00", activity: "Caminito & La Boca", details: "Caminhada pelas cores vibrantes das casas de La Boca.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "09:30", activity: "Recoleta & Cemitério", details: "Visita histórica. Ver o túmulo de Evita Perón.", costType: "misto", costLabel: "⚖️ Misto: Entrada + Uber" },
      { time: "10:00", activity: "Parque de Palermo", details: "Caminhada matinal agradável pelos lagos e roseiral.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "09:00", activity: "Teatro Colón Tour", details: "Visita guiada pelo luxuoso teatro lírico.", costType: "pago", costLabel: "💳 Gasto: Bilhete" },
      { time: "08:00", activity: "Viagem p/ Assunção", details: "Embarque em ônibus rodoviário semi-leito saindo de Foz.", costType: "pago", costLabel: "💳 Gasto: Passagem Ônibus" },
      { time: "05:50", activity: "Voo de volta para GIG", details: "Uber para o aeroporto internacional de Foz (IGU).", costType: "pago", costLabel: "💳 Gasto: Uber" }
    ],
    tarde: [
      { time: "14:00", activity: "Feira de San Telmo", details: "Explorar antiguidades, pinturas e shows de tango na rua.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "14:30", activity: "Macuco Safari", details: "Passeio de barco inflável sob as quedas das cataratas.", costType: "pago", costLabel: "💳 Gasto: Safari Pago" },
      { time: "14:00", activity: "Puerto Madero Walk", details: "Caminhada pela ponte, fragatas históricas e almoço.", costType: "misto", costLabel: "⚖️ Misto: Almoço" },
      { time: "15:00", activity: "Livraria El Ateneo", details: "Conhecer a famosa livraria instalada em antigo teatro.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "14:30", activity: "Calle Florida Compras", details: "Pesquisar roupas de couro e saborear alfajores Havanna.", costType: "pago", costLabel: "💳 Gasto: Compras" },
      { time: "14:00", activity: "Galerías Pacífico", details: "Admirar as belíssimas pinturas e murais no teto.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "15:00", activity: "Chegada em Assunção", details: "Check-in no hotel e breve descanso após o percurso rodoviário.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "-", activity: "Chegada ao Rio", details: "Retorno seguro à residência no RJ.", costType: "gratuito", costLabel: "-" }
    ],
    noite: [
      { time: "20:00", activity: "Don Julio Parrilla", details: "Jantar os espetaculares cortes argentinos (bife de lomo).", costType: "pago", costLabel: "💳 Gasto: Jantar Premium" },
      { time: "19:00", activity: "Três Fronteiras", details: "Show de luzes e danças tradicionais dos 3 países.", costType: "pago", costLabel: "💳 Gasto: Ingresso" },
      { time: "20:30", activity: "Show de Tango clássico", details: "Apresentação de gala com jantar e vinhos excelentes.", costType: "pago", costLabel: "💳 Gasto: Show Pago" },
      { time: "19:30", activity: "Pizzeria Guerrín", details: "A mais tradicional pizza de Buenos Aires na Av. Corrientes.", costType: "pago", costLabel: "💳 Gasto: Pizza Econômica" },
      { time: "21:00", activity: "Palermo Soho Bares", details: "Drinks sofisticados e boa música na área boêmia.", costType: "pago", costLabel: "💳 Gasto: Consumos" },
      { time: "19:30", activity: "Jantar Puerto Madero", details: "Saborear um bife de tira em um dos restaurantes à beira d'água.", costType: "pago", costLabel: "💳 Gasto: Jantar" },
      { time: "20:00", activity: "Palácio de los López", details: "Apreciar o palácio presidencial paraguaio iluminado.", costType: "pago", costLabel: "💳 Gasto: Jantar" },
      { time: "-", activity: "Descanso GIG", details: "Fim das férias internacionais e retorno à rotina.", costType: "gratuito", costLabel: "-" }
    ],
    culturalTitle: "🎭 Atrações e Fronteiras",
    culturalTips: [
      "Assunção: Visite o Centro Histórico, Casa de la Independencia e o Panteão dos Heróis para vivenciar a história e arquitetura do Paraguai.",
      "Fronteiras: Garanta a cotação correta utilizando cartões multi-moedas para evitar taxas abusivas locais."
    ],
    logisticsTitle: "✈️ Conexões e Transporte de Malas",
    logisticsTips: [
      "Bagagens: Mantenha as etiquetas de identificação de malas sempre atualizadas e use cadeados TSA para voos internacionais.",
      "Documentos: Além do documento físico de identificação, tenha sempre fotos digitais salvas offline no celular."
    ]
  },

  // 4. Caribe Colombiano - Plano B (Medellín + San Andrés)
  'am_bh_med_san': {
    id: 'am_bh_med_san',
    title: 'Roteiro - Plano B Detalhado (Salvador, Maceió, Aracaju)',
    date: '16 de Julho a 23 de Julho de 2026',
    base: 'Base: Salvador, Maceió & Aracaju',
    mode: 'Modo Road Trip • Detalhado',
    flagType: 'bahia_serg_alagoas',
    dias: [
      { data: '16/07', label: 'QUINTA' },
      { data: '17/07', label: 'SEXTA' },
      { data: '18/07', label: 'SÁBADO' },
      { data: '19/07', label: 'DOMINGO' },
      { data: '20/07', label: 'SEGUNDA' },
      { data: '21/07', label: 'TERÇA' },
      { data: '22/07', label: 'QUARTA' },
      { data: '23/07', label: 'QUINTA' }
    ],
    manha: [
      { time: "Manhã", activity: "Chegada em Salvador", details: "Check-in e preparação para o jogo do Bahia.", costType: "gratuito", costLabel: "-" },
      { time: "Manhã", activity: "Descanso", details: "Recarregar energias para o jogo.", costType: "gratuito", costLabel: "-" },
      { time: "04:00", activity: "Saída p/ Maceió", details: "Saída de Salvador (BR-101) rumo a Maceió (600km).", costType: "pago", costLabel: "💳 Combustível" },
      { time: "06:00", activity: "Passeio Maragogi", details: "Saída para Maragogi (pacote agência).", costType: "pago", costLabel: "💳 Incluso no pacote" },
      { time: "07:00", activity: "Praia do Gunga", details: "Passeio para Praia do Gunga (agência).", costType: "pago", costLabel: "💳 Incluso no pacote" },
      { time: "Manhã", activity: "Museu da Gente Sergipana", details: "Imersão na cultura sergipana.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "06:00", activity: "Saída p/ Salvador", details: "Viagem Aracaju rumo Salvador (280km).", costType: "pago", costLabel: "💳 Combustível" },
      { time: "02:00", activity: "Saída p/ Aeroporto", details: "Uber p/ Aeroporto de Salvador (SSA).", costType: "pago", costLabel: "💳 Uber" }
    ],
    tarde: [
      { time: "Tarde", activity: "Descanso", details: "Descanso em Salvador.", costType: "gratuito", costLabel: "-" },
      { time: "Tarde", activity: "Preparação p/ Jogo", details: "Foco no jogo do Bahia na Fonte Nova.", costType: "gratuito", costLabel: "-" },
      { time: "12:00", activity: "Chegada em Maceió", details: "Check-in no apartamento alugado.", costType: "gratuito", costLabel: "-" },
      { time: "Tarde", activity: "Passeio Catamarã", details: "Piscinas naturais de Maragogi.", costType: "pago", costLabel: "💳 Incluso no pacote" },
      { time: "15:30", activity: "Saída p/ Aracaju", details: "Viagem Maceió p/ Aracaju (270km).", costType: "pago", costLabel: "💳 Combustível" },
      { time: "Tarde", activity: "Pontos da Cidade", details: "Mercados Centrais, Orla de Atalaia.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "13:00", activity: "Chegada Salvador", details: "Almoço Sesc Pelourinho, MUNCAB, Terreiro Casa Branca.", costType: "pago", costLabel: "💳 Almoço" },
      { time: "-", activity: "Voo de volta", details: "Chegada no Galeão (GIG).", costType: "gratuito", costLabel: "-" }
    ],
    noite: [
      { time: "Noite", activity: "Descanso / Jogo", details: "Descanso e foco no jogo do Bahia na Fonte Nova.", costType: "pago", costLabel: "💳 Ingressos/Alimentação", links: [{ title: 'Ingresso do Jogo', url: 'https://embedstore.ingresse.com/tickets/ingresse.com/event/90227?redirect=true&eventid=90227&client=new-site&event-name=camarote-esquadraozone-bahia-x-chapecoense&scsession=712977188868179387711827' }] },
      { time: "Noite", activity: "Descanso na Hospedagem", details: "Prioridade para descansar bem antes da longa viagem de amanhã.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "19:00", activity: "Jantar na Orla de Maceió", details: "Jantar relaxante na orla para recuperar as energias da viagem.", costType: "pago", costLabel: "💳 Jantar" },
      { time: "19:30", activity: "Jantar após Passeio", details: "Jantar na orla após chegar cansado do bate-volta a Maragogi.", costType: "pago", costLabel: "💳 Jantar" },
      { time: "20:30", activity: "Passarela do Caranguejo", details: "Jantar na Orla de Atalaia, provando a culinária local de Aracaju.", costType: "pago", costLabel: "💳 Alimentação" },
      { time: "19:00", activity: "Feira do Turista", details: "Comer, ver artesanato e aproveitar o forró tradicional sergipano.", costType: "pago", costLabel: "💳 Gastos Locais" },
      { time: "19:00", activity: "Organizar Malas", details: "Arrumar tudo e dormir muito cedo para o voo de madrugada.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "-", activity: "Já no Rio", details: "Descansar da viagem.", costType: "gratuito", costLabel: "-" }
    ],
    culturalTitle: "🏛️ Imersão Nordestina: Bahia, Alagoas e Sergipe",
    culturalTips: [
      "Museu da Gente Sergipana: Um dos mais interativos do Brasil, imperdível para entender a cultura local.",
      "Terreiro Casa Branca: Marco sociológico e de resistência, o terreiro de Candomblé mais antigo do Brasil em Salvador."
    ],
    logisticsTitle: "🚗 Logística de Road Trip",
    logisticsTips: [
      "Longos trechos na BR-101: Saia sempre nos horários recomendados para evitar viajar à noite e garantir que chegará a tempo para passeios ou check-in.",
      "Otimização de rotas: A descida parando na Praia do Gunga e a subida parando na Lagoa dos Tambaquis evitam desvios desnecessários."
    ]
  },
  'am_rio_san': {
    id: 'am_rio_san',
    title: 'Roteiro - San Andrés (Mais Barato)',
    date: '14 de Janeiro a 27 de Janeiro de 2027',
    base: 'Base: El Poblado & San Andrés',
    mode: 'Modo Descoberta e Praia',
    flagType: 'colombia',
    dias: [
      { data: '14/01', label: 'QUINTA' },
      { data: '15/01', label: 'SEXTA' },
      { data: '16/01', label: 'SÁBADO' },
      { data: '17/01', label: 'DOMINGO' },
      { data: '18/01', label: 'SEGUNDA' },
      { data: '19/01', label: 'TERÇA' },
      { data: '20/01', label: 'QUARTA' },
      { data: '21/01', label: 'QUINTA' }
    ],
    manha: [
      { time: "19:10", activity: "Voo para Colômbia", details: "Embarque no GIG rumo a Medellín com conexão.", costType: "pago", costLabel: "💳 Gasto: Passagem já paga" },
      { time: "09:00", activity: "Chegada em Medellín", details: "Uber para o hotel em El Poblado, câmbio de pesos.", costType: "pago", costLabel: "💳 Gasto: Uber + Pesos" },
      { time: "08:30", activity: "Piedra del Peñol", details: "Bate-volta a Guatapé. Subir os 740 degraus com vista épica.", costType: "pago", costLabel: "💳 Gasto: Ingresso + Ônibus" },
      { time: "09:30", activity: "Voo para San Andrés", details: "Embarque no aeroporto de Rionegro (MDE) rumo ao Caribe.", costType: "pago", costLabel: "💳 Passagem interna" },
      { time: "09:00", activity: "Aluguel de Carrinho", details: "Alugar carrinho de golfe para contornar a ilha inteira.", costType: "pago", costLabel: "💳 Gasto: Aluguel de Carrinho" },
      { time: "09:00", activity: "Praia Peatonal", details: "Relaxar sob o sol na praia central de águas azuis.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "08:30", activity: "Lancha Johnny Cay", details: "Tour de lancha rápida para a paradisíaca Johnny Cay.", costType: "pago", costLabel: "💳 Gasto: Passeio de Lancha" },
      { time: "06:00", activity: "Retorno ao Brasil", details: "Uber para o aeroporto e embarque de volta para o Rio.", costType: "pago", costLabel: "💳 Gasto: Uber" }
    ],
    tarde: [
      { time: "Tarde", activity: "Descanso no RJ", details: "Organizar as últimas malas para os voos da noite.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "14:00", activity: "Comuna 13 Tour", details: "Visita histórica com guia local, grafites e escadas rolantes.", costType: "misto", costLabel: "⚖️ Misto: Gorjeta do Guia" },
      { time: "14:00", activity: "Guatapé Colorida", details: "Caminhar e tirar fotos nas ruas cheias de zócalos coloridos.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "14:30", activity: "Mergulho West View", details: "Nadar de snorkel com centenas de peixinhos coloridos.", costType: "pago", costLabel: "💳 Gasto: Entrada" },
      { time: "14:00", activity: "Praia de San Luis", details: "Almoçar peixe frito com patacones e arroz de coco.", costType: "pago", costLabel: "💳 Gasto: Almoço" },
      { time: "14:30", activity: "Duty Free Compras", details: "Compras isentas de impostos no centro de San Andrés.", costType: "pago", costLabel: "💳 Gasto: Compras" },
      { time: "13:00", activity: "Aquário Natural", details: "Caminhar com água na cintura vendo arraias e corais.", costType: "pago", costLabel: "💳 Gasto: Entrada" },
      { time: "-", activity: "Chegada no Rio", details: "Fim das férias incríveis no Caribe Colombiano.", costType: "gratuito", costLabel: "-" }
    ],
    noite: [
      { time: "21:00", activity: "Em voo internacional", details: "Desfrutar do serviço de bordo em voo noturno.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "19:30", activity: "Jantar em El Poblado", details: "Deliciar-se nos melhores restaurantes da região moderna.", costType: "pago", costLabel: "💳 Gasto: Jantar" },
      { time: "19:00", activity: "Cozinhar em casa", details: "Retorno de Guatapé, descanso total.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "19:30", activity: "Pôr do Sol clássico", details: "Ver o sol cair na água em La Piscinita.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "19:30", activity: "Jantar no Centro", details: "Restaurantes típicos de peixe na orla caribenha.", costType: "pago", costLabel: "💳 Gasto: Alimentação" },
      { time: "19:00", activity: "Drinks na areia", details: "Aproveitar coquetéis tropicais com música local.", costType: "pago", costLabel: "💳 Gasto: Bebida" },
      { time: "18:00", activity: "Organizar Malas", details: "Guardar souvenirs colombianos e organizar voo de volta.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "-", activity: "Descanso no RJ", details: "Dormir na própria cama com excelentes memórias.", costType: "gratuito", costLabel: "-" }
    ],
    culturalTitle: "🌴 Mar de Sete Cores & Ancestralidade",
    culturalTips: [
      "Cartão de Turismo Caribenho: San Andrés exige o pagamento de uma taxa obrigatória de turismo (aprox. R$ 170) na conexão aérea colombiana.",
      "Guatapé e Escadarias: Leve calçado esportivo antiderrapante e beba bastante água para subir o mirante do Peñol."
    ],
    logisticsTitle: "🚗 Locomoção Local & Segurança",
    logisticsTips: [
      "Carrinhos de Golfe: São a melhor maneira de explorar as praias isoladas. Teste os freios antes de sair da locadora.",
      "Segurança: El Poblado é uma zona nobre e segura de Medellín, porém evite mexer no celular exposto em ruas escuras."
    ]
  }
};

const DEFAULT_ITINERARY: TripItineraryConfig = {
  id: 'default',
  title: 'Roteiro de Viagem Geral',
  date: 'Planejamento de Viagem',
  base: 'Base: Airbnb Local',
  mode: 'Modo Explorador',
  flagType: 'brazil',
  dias: [
    { data: 'Dia 1', label: 'Início' },
    { data: 'Dia 2', label: 'Atividades' },
    { data: 'Dia 3', label: 'Retorno' }
  ],
  manha: [
    { time: "09:00", activity: "Passeio Matinal", details: "Conhecer pontos centrais da cidade.", costType: "gratuito", costLabel: "Sem Gastos" },
    { time: "10:00", activity: "Visita de Museus", details: "Apreciar arte e cultura regional.", costType: "pago", costLabel: "💳 Gasto: Entrada" },
    { time: "09:00", activity: "Arrumar Malas", details: "Organização final de bagagem.", costType: "gratuito", costLabel: "Sem Gastos" }
  ],
  tarde: [
    { time: "14:00", activity: "Almoço Local", details: "Experimentar culinária tradicional da região.", costType: "pago", costLabel: "💳 Gasto: Restaurante" },
    { time: "14:30", activity: "Parques e Natureza", details: "Descanso ao ar livre em parques urbanos.", costType: "gratuito", costLabel: "💸 Gratuito" },
    { time: "-", activity: "Retorno de Voo", details: "Transfer para aeroporto e embarque.", costType: "pago", costLabel: "💳 Gasto: Transporte" }
  ],
  noite: [
    { time: "19:00", activity: "Jantar na Orla", details: "Caminhar pela orla e saborear pratos regionais.", costType: "pago", costLabel: "💳 Gasto: Jantar" },
    { time: "19:30", activity: "Cozinhar em Casa", details: "Jantar prático no Airbnb e descanso.", costType: "gratuito", costLabel: "💸 Gratuito: Mercado" },
    { time: "-", activity: "Chegada em Casa", details: "Fim das atividades e descanso doméstico.", costType: "gratuito", costLabel: "-" }
  ],
  culturalTitle: "🎨 Cultura e Experiência Local",
  culturalTips: [
    "Artesanato: Dê preferência aos mercados municipais e feiras locais para compras de lembrancinhas econômicas.",
    "Doações e Guias: Algumas visitas são gratuitas mas sugerem contribuição voluntária para conservação."
  ],
  logisticsTitle: "🚗 Transporte e Segurança",
  logisticsTips: [
    "Deslocamento econômico: Empregar metrô e ônibus articulado integrado reduz significativamente os custos.",
    "Segurança básica: Evite manusear celulares de forma ostensiva em esquinas ou pontos sem iluminação pública abundante."
  ]
};

// Functions to draw vector flags on canvas
const drawBahiaFlag = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const stripeHeight = h / 4;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, w, stripeHeight);
  ctx.fillStyle = '#e8112d'; // Vermelho
  ctx.fillRect(0, stripeHeight, w, stripeHeight);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, stripeHeight * 2, w, stripeHeight);
  ctx.fillStyle = '#e8112d'; // Vermelho
  ctx.fillRect(0, stripeHeight * 3, w, stripeHeight);

  // Quadrado azul
  const blueSquareSize = h / 2;
  ctx.fillStyle = '#0038a8'; // Azul
  ctx.fillRect(0, 0, blueSquareSize, blueSquareSize);

  // Triângulo branco
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  const centerX = blueSquareSize / 2;
  const centerY = blueSquareSize / 2;
  const size = blueSquareSize * 0.6;
  ctx.moveTo(centerX, centerY - size/2);
  ctx.lineTo(centerX + size/2, centerY + size/2);
  ctx.lineTo(centerX - size/2, centerY + size/2);
  ctx.closePath();
  ctx.fill();
};

const drawSergipeFlag = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const stripeHeight = h / 4;
  ctx.fillStyle = '#007A48'; // Verde
  ctx.fillRect(0, 0, w, stripeHeight);
  ctx.fillStyle = '#FFD200'; // Amarelo
  ctx.fillRect(0, stripeHeight, w, stripeHeight);
  ctx.fillStyle = '#007A48'; // Verde
  ctx.fillRect(0, stripeHeight * 2, w, stripeHeight);
  ctx.fillStyle = '#FFD200'; // Amarelo
  ctx.fillRect(0, stripeHeight * 3, w, stripeHeight);

  const blueSquareSize = h / 2;
  ctx.fillStyle = '#0038A8'; // Azul
  ctx.fillRect(0, 0, blueSquareSize, blueSquareSize);

  // Draw 5 stars inside the blue square
  ctx.fillStyle = '#FFFFFF';
  const drawStar = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * r + cx, -Math.sin((18 + i * 72) * Math.PI / 180) * r + cy);
      ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (r * 0.4) + cx, -Math.sin((54 + i * 72) * Math.PI / 180) * (r * 0.4) + cy);
    }
    ctx.closePath();
    ctx.fill();
  };
  const c = blueSquareSize / 2;
  drawStar(c, c, blueSquareSize * 0.15); // Centro
  drawStar(c, c - blueSquareSize * 0.23, blueSquareSize * 0.08); // Cima
  drawStar(c, c + blueSquareSize * 0.23, blueSquareSize * 0.08); // Baixo
  drawStar(c - blueSquareSize * 0.23, c, blueSquareSize * 0.08); // Esquerda
  drawStar(c + blueSquareSize * 0.23, c, blueSquareSize * 0.08); // Direita
};

const drawAlagoasFlag = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const stripeWidth = w / 3;
  ctx.fillStyle = '#FF0000'; // Vermelho
  ctx.fillRect(0, 0, stripeWidth, h);
  ctx.fillStyle = '#FFFFFF'; // Branco
  ctx.fillRect(stripeWidth, 0, stripeWidth, h);
  ctx.fillStyle = '#0000FF'; // Azul
  ctx.fillRect(stripeWidth * 2, 0, stripeWidth, h);
};

const drawColombiaFlag = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#FCD116'; // Amarelo
  ctx.fillRect(0, 0, w, h / 2);
  ctx.fillStyle = '#003893'; // Azul
  ctx.fillRect(0, h / 2, w, h / 4);
  ctx.fillStyle = '#CE1126'; // Vermelho
  ctx.fillRect(0, (h / 4) * 3, w, h / 4);
};

const drawArgentinaFlag = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const fh = h / 3;
  ctx.fillStyle = '#74ACDF'; // Sky Blue
  ctx.fillRect(0, 0, w, fh);
  ctx.fillStyle = '#FFFFFF'; // Branco
  ctx.fillRect(0, fh, w, fh);
  ctx.fillStyle = '#74ACDF'; // Sky Blue
  ctx.fillRect(0, fh * 2, w, fh);

  // Sol de Maio simplificado
  ctx.fillStyle = '#F6B426';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, fh * 0.28, 0, 2 * Math.PI);
  ctx.fill();
};

const drawBrazilFlag = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#009739'; // Verde
  ctx.fillRect(0, 0, w, h);

  // Losango Amarelo
  ctx.fillStyle = '#FEDD00';
  ctx.beginPath();
  ctx.moveTo(w / 2, h * 0.12);
  ctx.lineTo(w * 0.88, h / 2);
  ctx.lineTo(w / 2, h * 0.88);
  ctx.lineTo(w * 0.12, h / 2);
  ctx.closePath();
  ctx.fill();

  // Círculo azul
  ctx.fillStyle = '#002776';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, h * 0.26, 0, 2 * Math.PI);
  ctx.fill();

  // Faixa branca
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = h * 0.035;
  ctx.beginPath();
  ctx.arc(w / 2, h * 1.05, h * 0.82, -Math.PI * 0.65, -Math.PI * 0.35);
  ctx.stroke();
};

const drawSantaCatarinaFlag = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const stripeH = h / 3;
  ctx.fillStyle = '#E8112D'; // Vermelho
  ctx.fillRect(0, 0, w, stripeH);
  ctx.fillStyle = '#FFFFFF'; // Branco
  ctx.fillRect(0, stripeH, w, stripeH);
  ctx.fillStyle = '#E8112D'; // Vermelho
  ctx.fillRect(0, stripeH * 2, w, stripeH);

  // Losango verde
  ctx.fillStyle = '#007A48';
  ctx.beginPath();
  ctx.moveTo(w / 2, h * 0.18);
  ctx.lineTo(w * 0.82, h / 2);
  ctx.lineTo(w / 2, h * 0.82);
  ctx.lineTo(w * 0.18, h / 2);
  ctx.closePath();
  ctx.fill();

  // Estrela branca no centro
  ctx.fillStyle = '#FFFFFF';
  const cx = w / 2;
  const cy = h / 2;
  const r = h * 0.12;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * r + cx, -Math.sin((18 + i * 72) * Math.PI / 180) * r + cy);
    ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (r * 0.4) + cx, -Math.sin((54 + i * 72) * Math.PI / 180) * (r * 0.4) + cy);
  }
  ctx.closePath();
  ctx.fill();
};

const drawCruiseFlag = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  // Oceano Azul MSC
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#001E4D');
  grad.addColorStop(1, '#0052A5');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Ondas
  ctx.fillStyle = '#00A3E0';
  ctx.beginPath();
  ctx.arc(w / 2, h * 1.35, h * 0.75, 0, 2 * Math.PI);
  ctx.fill();

  // Casco do Navio
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(w * 0.12, h * 0.55);
  ctx.lineTo(w * 0.88, h * 0.55);
  ctx.lineTo(w * 0.76, h * 0.72);
  ctx.lineTo(w * 0.24, h * 0.72);
  ctx.closePath();
  ctx.fill();

  // Decks superiores
  ctx.fillRect(w * 0.22, h * 0.42, w * 0.56, h * 0.11);
  ctx.fillRect(w * 0.30, h * 0.32, w * 0.40, h * 0.09);

  // Chaminé Vermelha
  ctx.fillStyle = '#E8112D';
  ctx.fillRect(w * 0.52, h * 0.20, w * 0.12, h * 0.11);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(w * 0.52, h * 0.20, w * 0.12, h * 0.025);
};

const drawSaoPauloFlag = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const stripes = 13;
  const stripeH = h / stripes;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#000000' : '#FFFFFF';
    ctx.fillRect(0, i * stripeH, w, stripeH);
  }

  // Cantão vermelho
  const cantonW = w * 0.45;
  const cantonH = stripeH * 5;
  ctx.fillStyle = '#E8112D';
  ctx.fillRect(0, 0, cantonW, cantonH);

  // Círculo com detalhe
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cantonW / 2, cantonH / 2, cantonH * 0.32, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(cantonW / 2, cantonH / 2, cantonH * 0.18, 0, 2 * Math.PI);
  ctx.fill();
};

const drawRioFlag = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const hw = w / 2;
  const hh = h / 2;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, hw, hh);
  ctx.fillStyle = '#1A75CF';
  ctx.fillRect(hw, 0, hw, hh);
  ctx.fillStyle = '#1A75CF';
  ctx.fillRect(0, hh, hw, hh);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(hw, hh, hw, hh);

  // Brasão central vermelho
  ctx.fillStyle = '#E8112D';
  ctx.beginPath();
  ctx.arc(hw, hh, h * 0.22, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = '#FFD200';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Estrela dourada no centro
  ctx.fillStyle = '#FFD200';
  const cx = hw;
  const cy = hh;
  const r = h * 0.10;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * r + cx, -Math.sin((18 + i * 72) * Math.PI / 180) * r + cy);
    ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (r * 0.4) + cx, -Math.sin((54 + i * 72) * Math.PI / 180) * (r * 0.4) + cy);
  }
  ctx.closePath();
  ctx.fill();
};

const drawEspiritoSantoFlag = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const stripeH = h / 3;
  // Azul celeste (topo)
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, w, stripeH);
  // Branco (meio)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, stripeH, w, stripeH);
  // Rosa claro (fundo)
  ctx.fillStyle = '#F8A5C2';
  ctx.fillRect(0, stripeH * 2, w, stripeH);

  // Faixa/Arco suave no meio
  ctx.strokeStyle = '#3A86FF';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(w / 2, stripeH * 1.5, stripeH * 0.35, 0, Math.PI);
  ctx.stroke();
};

const GuideList: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'days' | 'full' | 'table'>('days');
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [completedCells, setCompletedCells] = useState<Record<string, boolean>>(() => {
    const defaultChecked: Record<string, boolean> = {
      // 16/07 (Quinta) - Voo GIG -> SSA & Ajuste Logístico
      'am_salvador_julho_0_manha': true,
      'am_salvador_julho_0_tarde': true,
      'am_salvador_julho_0_noite': true,
      'am_bh_med_san_0_manha': true,
      'am_bh_med_san_0_tarde': true,
      'am_bh_med_san_0_noite': true,

      // 17/07 (Sexta) - Pelourinho, Camarote Esquadrãozone e Jogo do Bahia
      'am_salvador_julho_1_manha': true,
      'am_salvador_julho_1_tarde': true,
      'am_salvador_julho_1_noite': true,
      'am_bh_med_san_1_manha': true,
      'am_bh_med_san_1_tarde': true,
      'am_bh_med_san_1_noite': true,
    };
    try {
      const saved = localStorage.getItem('viajai_completed_activities');
      if (saved) {
        return { ...defaultChecked, ...JSON.parse(saved) };
      }
      // Save default checked items to localStorage
      localStorage.setItem('viajai_completed_activities', JSON.stringify(defaultChecked));
      return defaultChecked;
    } catch (e) {
      return defaultChecked;
    }
  });

  // Load selected trip from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('selected_trip');
    if (saved) {
      try {
        setSelectedTrip(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading selected trip in GuideList", e);
      }
    }
  }, []);

  // Determine active itinerary configuration based on active trip id
  const activeConfig = selectedTrip ? (ITINERARY_DATABASE[selectedTrip.id] || DEFAULT_ITINERARY) : DEFAULT_ITINERARY;

  // Auto-detect and set activeDayIndex based on today's actual date
  useEffect(() => {
    if (activeConfig && activeConfig.dias) {
      const today = new Date();
      const dayStr = String(today.getDate()).padStart(2, '0');
      const monthStr = String(today.getMonth() + 1).padStart(2, '0');
      const targetPrefix = `${dayStr}/${monthStr}`; // e.g., "17/07"
      
      const foundIndex = activeConfig.dias.findIndex(d => d.data.startsWith(targetPrefix));
      if (foundIndex !== -1) {
        setActiveDayIndex(foundIndex);
        console.log(`[PWA] Automatically selected today's itinerary index: ${foundIndex} (${targetPrefix})`);
      }
    }
  }, [activeConfig]);

  const getProgress = () => {
    let total = 0;
    let completed = 0;
    const periods = ['manha', 'tarde', 'noite'] as const;
    activeConfig.dias.forEach((_, dayIndex) => {
      periods.forEach(period => {
        const item = activeConfig[period][dayIndex];
        if (item && (item.activity || item.details)) {
          total++;
          if (completedCells[`${activeConfig.id}_${dayIndex}_${period}`]) {
            completed++;
          }
        }
      });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };
  const progress = getProgress();

  const toggleCellCompleted = (dayIndex: number, period: 'manha' | 'tarde' | 'noite') => {
    const slot = activeConfig[period][dayIndex];
    if (!slot || (!slot.activity && !slot.details)) {
      return; // Do not complete empty slots
    }
    const key = `${activeConfig.id}_${dayIndex}_${period}`;
    setCompletedCells(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('viajai_completed_activities', JSON.stringify(updated));
      return updated;
    });
  };

  // Redraw canvas whenever selected trip changes or configuration loads
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const flagType = activeConfig.flagType;
        if (flagType === 'bahia') {
          drawBahiaFlag(ctx, w, h);
        } else if (flagType === 'sergipe') {
          drawSergipeFlag(ctx, w, h);
        } else if (flagType === 'bahia_serg') {
          // Blended side-by-side flags
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, w / 2, h);
          ctx.clip();
          drawBahiaFlag(ctx, w, h);
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.rect(w / 2, 0, w / 2, h);
          ctx.clip();
          ctx.translate(w / 2, 0);
          drawSergipeFlag(ctx, w / 2, h);
          ctx.restore();

          // White separation line
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(w / 2 - 1.5, 0, 3, h);
        } else if (flagType === 'bahia_serg_alagoas') {
          // Blended 3 flags
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, w / 3, h);
          ctx.clip();
          drawBahiaFlag(ctx, w, h);
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.rect(w / 3, 0, w / 3, h);
          ctx.clip();
          ctx.translate(w / 3, 0);
          drawSergipeFlag(ctx, w / 3, h);
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.rect(w * 2 / 3, 0, w / 3, h);
          ctx.clip();
          ctx.translate(w * 2 / 3, 0);
          drawAlagoasFlag(ctx, w / 3, h);
          ctx.restore();

          // White separation lines
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(w / 3 - 1, 0, 2, h);
          ctx.fillRect(w * 2 / 3 - 1, 0, 2, h);
        } else if (flagType === 'marco_2027') {
          // Blended 4 flags: Santa Catarina | Cruzeiro MSC | São Paulo | Rio de Janeiro
          const sw = w / 4;

          // 1. Santa Catarina
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, sw, h);
          ctx.clip();
          drawSantaCatarinaFlag(ctx, sw, h);
          ctx.restore();

          // 2. Cruzeiro MSC
          ctx.save();
          ctx.beginPath();
          ctx.rect(sw, 0, sw, h);
          ctx.clip();
          ctx.translate(sw, 0);
          drawCruiseFlag(ctx, sw, h);
          ctx.restore();

          // 3. São Paulo
          ctx.save();
          ctx.beginPath();
          ctx.rect(sw * 2, 0, sw, h);
          ctx.clip();
          ctx.translate(sw * 2, 0);
          drawSaoPauloFlag(ctx, sw, h);
          ctx.restore();

          // 4. Rio de Janeiro
          ctx.save();
          ctx.beginPath();
          ctx.rect(sw * 3, 0, sw, h);
          ctx.clip();
          ctx.translate(sw * 3, 0);
          drawRioFlag(ctx, sw, h);
          ctx.restore();

          // Line dividers
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(sw - 1, 0, 2, h);
          ctx.fillRect(sw * 2 - 1, 0, 2, h);
          ctx.fillRect(sw * 3 - 1, 0, 2, h);
        } else if (flagType === 'guarapari_2027') {
          // Blended Rio de Janeiro & Espírito Santo flags (Road trip RJ -> ES)
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, w / 2, h);
          ctx.clip();
          drawRioFlag(ctx, w / 2, h);
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.rect(w / 2, 0, w / 2, h);
          ctx.clip();
          ctx.translate(w / 2, 0);
          drawEspiritoSantoFlag(ctx, w / 2, h);
          ctx.restore();

          // White separation line
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(w / 2 - 1.5, 0, 3, h);
        } else if (flagType === 'colombia') {
          drawColombiaFlag(ctx, w, h);
        } else if (flagType === 'argentina' || flagType === 'argentina_brazil') {
          // Blended sky-blue/white & green/yellow flags for Foz/BA
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, w / 2, h);
          ctx.clip();
          drawArgentinaFlag(ctx, w, h);
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.rect(w / 2, 0, w / 2, h);
          ctx.clip();
          ctx.translate(w / 2, 0);
          drawBrazilFlag(ctx, w / 2, h);
          ctx.restore();

          // White separation line
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(w / 2 - 1.5, 0, 3, h);
        } else {
          drawBrazilFlag(ctx, w, h);
        }
      }
    }
  }, [activeConfig]);

  const renderLineWithFormattedTimes = (lineText: string, isCompleted: boolean, period: 'manha' | 'tarde' | 'noite') => {
    // Regex matching times like 09:00, 10:30, 06h00, 05h50, 16h30, 02h00, 12h00, etc.
    const timeRegex = /(\b\d{1,2}[:h]\d{2}(?:h|m)?\b)/gi;
    const parts = lineText.split(timeRegex);

    if (parts.length <= 1) return lineText;

    return (
      <>
        {parts.map((part, index) => {
          if (timeRegex.test(part)) {
            return (
              <span 
                key={index} 
                className={`font-black font-mono px-1.5 py-0.5 rounded text-[12px] md:text-[13px] tracking-tight inline-flex items-center gap-0.5 mx-0.5 shadow-xs border select-none ${
                  isCompleted 
                    ? 'bg-slate-200 text-slate-500 border-slate-300' 
                    : period === 'noite'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                      : 'bg-amber-200 dark:bg-amber-950/90 text-amber-950 dark:text-amber-100 border-amber-400/80 font-black'
                }`}
              >
                ⏱️ {part}
              </span>
            );
          }
          return part;
        })}
      </>
    );
  };

  const renderCardContent = (item: ScheduleCell | undefined, dayIndex: number, period: 'manha' | 'tarde' | 'noite') => {
    if (!item || (!item.activity && !item.details)) {
      return (
        <div className="flex items-center justify-center h-28 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs italic p-4 text-center w-full">
          Nenhuma atividade programada para este período
        </div>
      );
    }

    const key = `${activeConfig.id}_${dayIndex}_${period}`;
    const isCompleted = completedCells[key] || false;

    return (
      <div 
        className="flex flex-col flex-1 justify-between gap-4 w-full select-none group/item"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            {item.time && item.time !== "-" && (
              <span className={`font-black text-xs md:text-sm px-2.5 py-1 rounded-lg shadow-sm border tracking-wide uppercase inline-flex items-center gap-1.5 select-none ${
                isCompleted 
                  ? 'bg-slate-200 text-slate-500 border-slate-300' 
                  : period === 'manha' ? 'bg-sky-600 text-white border-sky-400 font-black shadow-sky-200/50' :
                    period === 'tarde' ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-amber-200/50' :
                    'bg-indigo-600 text-white border-indigo-400 font-black shadow-indigo-900/50'
              }`}>
                ⏱️ {item.time}
              </span>
            )}
            
            {/* Elegant Check Box Indicator */}
            <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${
              isCompleted 
                ? 'bg-emerald-500 border-emerald-500 text-white scale-110 shadow-sm' 
                : period === 'noite'
                  ? 'border-slate-500 hover:border-emerald-500 text-transparent'
                  : 'border-slate-300 hover:border-emerald-500 text-transparent'
            }`}>
              <svg className="w-3.5 h-3.5 stroke-[3] fill-none stroke-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>
          
          <h4 className={`font-extrabold text-sm md:text-base leading-snug mb-2 transition-all ${
            isCompleted 
              ? 'line-through text-slate-400 dark:text-slate-500 opacity-60' 
              : period === 'noite' ? 'text-white' : 'text-slate-900'
          }`}>
            {item.activity}
          </h4>
          
          {item.details && item.details.split('\n').map((line, i) => (
            <p 
              key={i} 
              className={`text-xs md:text-sm leading-relaxed mb-1.5 transition-all ${
                isCompleted 
                  ? 'line-through text-slate-400/85 dark:text-slate-500/85 opacity-50' 
                  : period === 'noite' ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {renderLineWithFormattedTimes(line, isCompleted, period)}
            </p>
          ))}

          {item.activity.includes('Pelourinho & Federação') && (
            <PelourinhoRouteMap />
          )}

          {item.links && item.links.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-3">
              {item.links.map((link, i) => (
                <a 
                  key={i} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent toggling completion on link click
                  }}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1.5 rounded-md border transition-colors ${
                    period === 'noite'
                      ? 'text-sky-300 hover:text-sky-200 bg-sky-950/40 hover:bg-sky-950/80 border-sky-900/50'
                      : 'text-[#0038a8] hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 border-blue-100'
                  }`}
                >
                  <span className="shrink-0">🔗</span>
                  <span className="underline decoration-blue-200 underline-offset-2">{link.title}</span>
                </a>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between gap-2 mt-2">
          {item.costLabel && item.costLabel !== "-" && (
            <div className={`inline-block px-2.5 py-1 text-xs font-black rounded-lg border shadow-sm text-center self-start shrink-0 ${
              isCompleted 
                ? 'bg-slate-100 border-slate-200 text-slate-400 line-through opacity-50'
                : item.costType === 'gratuito' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                  item.costType === 'pago' ? 'bg-rose-50 border-rose-300 text-rose-800' :
                  'bg-amber-50 border-amber-300 text-amber-800'
            }`}>
              {item.costLabel}
            </div>
          )}
          {isCompleted && (
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 select-none">
              ✓ Concluído
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderCell = (item: ScheduleCell | undefined, idx: number, period: 'manha' | 'tarde' | 'noite') => {
    if (!item || (!item.activity && !item.details)) {
      return (
        <td key={idx} className="p-4 border-b border-r border-gray-200 bg-gray-50/50 text-gray-400 text-center text-xs italic">
          -
        </td>
      );
    }

    const key = `${activeConfig.id}_${idx}_${period}`;
    const isCompleted = completedCells[key] || false;

    // Table view cells styling based on period & completion
    let bgClasses = '';
    if (isCompleted) {
      bgClasses = 'bg-emerald-50/60 border-emerald-200';
    } else {
      switch (period) {
        case 'manha':
          bgClasses = 'bg-[#f0f9ff] hover:bg-[#e0f2fe] text-slate-900 border-sky-100';
          break;
        case 'tarde':
          bgClasses = 'bg-[#fffbeb] hover:bg-[#fef3c7] text-slate-900 border-amber-100';
          break;
        case 'noite':
          bgClasses = 'bg-[#0B1528] text-white hover:bg-[#0f203d] border-indigo-950';
          break;
      }
    }

    return (
      <td 
        key={idx} 
        onClick={() => toggleCellCompleted(idx, period)}
        className={`p-4 border-b border-r border-gray-200 transition-all align-top text-sm cursor-pointer select-none min-w-[240px] max-w-[280px] hover:shadow-inner ${bgClasses}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          {item.time && item.time !== "-" && (
            <span className={`font-black text-xs sm:text-sm px-2.5 py-1 rounded-md shadow-sm border tracking-wide uppercase inline-block select-none ${
              isCompleted
                ? 'bg-slate-200 text-slate-500 border-slate-300'
                : period === 'manha' ? 'bg-sky-600 text-white border-sky-400 font-black' :
                  period === 'tarde' ? 'bg-amber-500 text-slate-950 border-amber-300 font-black' :
                  'bg-indigo-600 text-white border-indigo-400 font-black'
            }`}>
              ⏱️ {item.time}
            </span>
          )}
          
          {/* Checkbox */}
          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 ${
            isCompleted 
              ? 'bg-emerald-500 border-emerald-500 text-white' 
              : period === 'noite' ? 'border-slate-500' : 'border-slate-300'
          }`}>
            <svg className="w-3 h-3 stroke-[3] fill-none stroke-current" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>
        
        <span className={`font-extrabold block mb-1 text-sm md:text-base leading-tight transition-all ${
          isCompleted 
            ? 'line-through text-slate-400 opacity-60' 
            : period === 'noite' ? 'text-white' : 'text-slate-900'
        }`}>
          {item.activity}
        </span>
        
        {item.details && item.details.split('\n').map((line, i) => (
          <span 
            key={i} 
            className={`block mb-2 text-xs md:text-sm leading-relaxed transition-all ${
              isCompleted 
                ? 'line-through text-slate-400/70 opacity-50' 
                : period === 'noite' ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            {renderLineWithFormattedTimes(line, isCompleted, period)}
          </span>
        ))}
        
        {item.costLabel && item.costLabel !== "-" && (
          <div className={`mt-3 inline-block px-2 py-1 text-xs font-black rounded-md border shadow-sm w-full text-center ${
            isCompleted
              ? 'bg-slate-100 border-slate-200 text-slate-400'
              : item.costType === 'gratuito' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                item.costType === 'pago' ? 'bg-rose-50 border-rose-300 text-rose-800' :
                'bg-amber-50 border-amber-300 text-amber-800'
          }`}>
            {item.costLabel}
          </div>
        )}
      </td>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-4 md:py-6 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-slate-200/80">
        
        <CategoryHeader title="Roteiro de Viagem" onBack={onBack} id="guias" />

        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Progresso da Viagem</span>
            <span className="text-xs font-black text-slate-900">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        {/* Header Section */}
        <div className="p-6 md:p-10 border-b-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full text-center md:text-left">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 shadow-xl flex items-center justify-center select-none shrink-0 relative overflow-hidden group">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-cyan-500/15 to-transparent opacity-60"></div>
              {/* Geometric travel lines */}
              <div className="absolute -inset-1 border border-dashed border-white/10 rounded-full animate-[spin_120s_linear_infinite]"></div>
              
              <Compass className="w-10 h-10 text-emerald-400 relative z-10 transition-transform duration-300 group-hover:rotate-45" />
              
              {/* Small accent dot */}
              <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3.5xl font-display font-black text-slate-900 mb-1.5 tracking-tight uppercase leading-tight">
                {activeConfig.title}
              </h1>
              <p className="text-slate-500 text-sm md:text-base font-bold tracking-wide flex items-center justify-center md:justify-start gap-1.5">
                <Calendar className="w-4 h-4 text-[#10b981] shrink-0" />
                {activeConfig.date}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3.5 py-1.5 bg-[#10b981]/10 border border-[#10b981]/20 text-emerald-800 rounded-xl text-xs font-black shadow-sm uppercase tracking-wider font-mono">
                  {activeConfig.base}
                </span>
                <span className="px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-800 rounded-xl text-xs font-black shadow-sm uppercase tracking-wider font-mono">
                  {activeConfig.mode}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle de Visualização do Roteiro */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 md:px-8 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-black text-[#0038a8] uppercase tracking-wider mb-1">
              Visualização do Roteiro
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Escolha a melhor forma de visualizar os dias e atividades.
            </p>
          </div>

          <div className="flex bg-slate-200/60 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('days')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'days'
                  ? 'bg-[#0038a8] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0038a8]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Por Dia
            </button>
            <button
              onClick={() => setViewMode('full')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'full'
                  ? 'bg-[#0038a8] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0038a8]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Lista
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#0038a8] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0038a8]'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              Tabela
            </button>
          </div>
        </div>

        {/* Content Area Based on View Mode */}
        <div className="p-4 md:p-8 bg-slate-50/50 border-b border-slate-100">
          {viewMode === 'days' && (() => {
            const isManhaCompleted = completedCells[`${activeConfig.id}_${activeDayIndex}_manha`] || false;
            const isTardeCompleted = completedCells[`${activeConfig.id}_${activeDayIndex}_tarde`] || false;
            const isNoiteCompleted = completedCells[`${activeConfig.id}_${activeDayIndex}_noite`] || false;

            return (
              <div className="space-y-6">
                {/* Day Selector Buttons Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2">
                  {activeConfig.dias.map((dia, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDayIndex(idx)}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        activeDayIndex === idx
                          ? 'bg-[#0038a8] border-[#0038a8] text-white shadow-md scale-[1.02]'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-extrabold text-xs md:text-sm uppercase tracking-wider">{dia.label.split('(')[0].trim().toUpperCase()}</div>
                      <div className={`text-[11px] font-bold mt-1 ${activeDayIndex === idx ? 'text-white/85' : 'text-slate-400'}`}>
                        {dia.data.split('(')[0].trim()}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Day's Activities Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Morning */}
                  <div 
                    onClick={() => toggleCellCompleted(activeDayIndex, 'manha')}
                    className={`rounded-2xl border-2 p-5 shadow-sm transition-all hover:shadow-md duration-300 flex flex-col justify-between min-h-[220px] cursor-pointer ${
                      isManhaCompleted 
                        ? 'bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-500/10' 
                        : 'bg-[#f0f9ff] border-sky-200/80 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-sky-100/40 w-full shrink-0">
                      <span className="text-2xl" role="img" aria-label="Manhã">☀️</span>
                      <div>
                        <h4 className="font-black text-slate-900 text-base uppercase tracking-wider font-extrabold">MANHÃ</h4>
                        <p className="text-[11px] text-slate-500 font-bold uppercase">Começo do Dia</p>
                      </div>
                    </div>
                    {renderCardContent(activeConfig.manha[activeDayIndex], activeDayIndex, 'manha')}
                  </div>

                  {/* Afternoon */}
                  <div 
                    onClick={() => toggleCellCompleted(activeDayIndex, 'tarde')}
                    className={`rounded-2xl border-2 p-5 shadow-sm transition-all hover:shadow-md duration-300 flex flex-col justify-between min-h-[220px] cursor-pointer ${
                      isTardeCompleted 
                        ? 'bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-500/10' 
                        : 'bg-[#fffbeb] border-amber-200/80 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-amber-100/40 w-full shrink-0">
                      <span className="text-2xl" role="img" aria-label="Tarde">🌤️</span>
                      <div>
                        <h4 className="font-black text-slate-900 text-base uppercase tracking-wider font-extrabold">TARDE</h4>
                        <p className="text-[11px] text-slate-500 font-bold uppercase">Meio do Dia</p>
                      </div>
                    </div>
                    {renderCardContent(activeConfig.tarde[activeDayIndex], activeDayIndex, 'tarde')}
                  </div>

                  {/* Night */}
                  <div 
                    onClick={() => toggleCellCompleted(activeDayIndex, 'noite')}
                    className={`rounded-2xl border-2 p-5 shadow-sm transition-all hover:shadow-md duration-300 flex flex-col justify-between min-h-[220px] cursor-pointer ${
                      isNoiteCompleted 
                        ? 'bg-[#0B1528] border-emerald-500 ring-2 ring-emerald-500/30 text-white' 
                        : 'bg-[#0B1528] border-indigo-950/80 hover:border-indigo-800 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-indigo-900/30 w-full shrink-0">
                      <span className="text-2xl" role="img" aria-label="Noite">🌙</span>
                      <div>
                        <h4 className="font-black text-white text-base uppercase tracking-wider font-extrabold">NOITE</h4>
                        <p className="text-[11px] text-slate-400 font-bold uppercase">Encerramento</p>
                      </div>
                    </div>
                    {renderCardContent(activeConfig.noite[activeDayIndex], activeDayIndex, 'noite')}
                  </div>
                </div>
              </div>
            );
          })()}

          {viewMode === 'full' && (
            <div className="space-y-6">
              {activeConfig.dias.map((dia, idx) => {
                const isManhaCompleted = completedCells[`${activeConfig.id}_${idx}_manha`] || false;
                const isTardeCompleted = completedCells[`${activeConfig.id}_${idx}_tarde`] || false;
                const isNoiteCompleted = completedCells[`${activeConfig.id}_${idx}_noite`] || false;

                return (
                  <div key={idx} className="bg-white rounded-2xl border-2 border-slate-200/60 overflow-hidden shadow-sm hover:border-blue-300 transition-colors">
                    <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0038a8] text-white flex items-center justify-center font-black text-sm shadow-sm select-none">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-black text-[#0038a8] text-sm md:text-base uppercase tracking-tight">{dia.label.split('(')[0].trim().toUpperCase()}</h3>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">{dia.data.split('(')[0].trim()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Manhã */}
                      <div 
                        onClick={() => toggleCellCompleted(idx, 'manha')}
                        className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all hover:shadow ${
                          isManhaCompleted 
                            ? 'bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-500/10' 
                            : 'bg-[#f0f9ff] border-sky-100 hover:border-sky-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-3 text-xs font-black text-slate-900 uppercase tracking-wider font-extrabold">
                          <span>☀️</span> MANHÃ
                        </div>
                        {renderCardContent(activeConfig.manha[idx], idx, 'manha')}
                      </div>

                      {/* Tarde */}
                      <div 
                        onClick={() => toggleCellCompleted(idx, 'tarde')}
                        className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all hover:shadow ${
                          isTardeCompleted 
                            ? 'bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-500/10' 
                            : 'bg-[#fffbeb] border-amber-100 hover:border-amber-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-3 text-xs font-black text-slate-900 uppercase tracking-wider font-extrabold">
                          <span>🌤️</span> TARDE
                        </div>
                        {renderCardContent(activeConfig.tarde[idx], idx, 'tarde')}
                      </div>

                      {/* Noite */}
                      <div 
                        onClick={() => toggleCellCompleted(idx, 'noite')}
                        className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all hover:shadow ${
                          isNoiteCompleted 
                            ? 'bg-[#0B1528] border-emerald-500 ring-2 ring-emerald-500/30 text-white' 
                            : 'bg-[#0B1528] border-indigo-950/80 hover:border-indigo-800 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-3 text-xs font-black text-white uppercase tracking-wider font-extrabold">
                          <span>🌙</span> NOITE
                        </div>
                        {renderCardContent(activeConfig.noite[idx], idx, 'noite')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'table' && (
            <div className="overflow-x-auto">
              <div className="text-right text-xs text-slate-400 font-bold uppercase tracking-wide mb-2 flex items-center justify-end gap-1 select-none">
                <span>👉 Arraste lateralmente para ver todos os dias</span>
              </div>
              <table className="w-full text-left border-collapse min-w-[1200px] bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-4 bg-slate-100 border-r border-slate-200 text-[#0038a8] font-black w-36 text-center sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] align-middle uppercase text-xs tracking-wider">
                      Período
                    </th>
                    {activeConfig.dias.map((dia, idx) => (
                      <th key={idx} className="p-4 bg-[#0038a8] text-white border-r border-blue-800 text-center min-w-[240px]">
                        <div className="font-extrabold text-sm md:text-base uppercase tracking-wider">{dia.label.split('(')[0].trim().toUpperCase()}</div>
                        <div className="text-xs md:text-sm font-bold opacity-90 mt-1 tracking-wide">{dia.data.split('(')[0].trim()}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="group">
                    <td className="p-4 bg-slate-100 border-b border-r border-slate-200 font-bold text-slate-800 align-middle text-center sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <div className="flex flex-col items-center justify-center py-2 select-none">
                        <span className="text-2xl mb-1.5" role="img" aria-label="Manhã">☀️</span>
                        <span className="uppercase tracking-widest text-xs font-black text-slate-900 font-extrabold">MANHÃ</span>
                      </div>
                    </td>
                    {activeConfig.dias.map((_, idx) => renderCell(activeConfig.manha[idx], idx, 'manha'))}
                  </tr>
                  
                  <tr className="group">
                    <td className="p-4 bg-slate-100 border-b border-r border-slate-200 font-bold text-slate-800 align-middle text-center sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <div className="flex flex-col items-center justify-center py-2 select-none">
                        <span className="text-2xl mb-1.5" role="img" aria-label="Tarde">🌤️</span>
                        <span className="uppercase tracking-widest text-xs font-black text-slate-900 font-extrabold">TARDE</span>
                      </div>
                    </td>
                    {activeConfig.dias.map((_, idx) => renderCell(activeConfig.tarde[idx], idx, 'tarde'))}
                  </tr>

                  <tr className="group">
                    <td className="p-4 bg-slate-100 border-r border-slate-200 font-bold text-slate-800 align-middle text-center sticky left-0 z-10 rounded-bl-2xl shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <div className="flex flex-col items-center justify-center py-2 select-none">
                        <span className="text-2xl mb-1.5" role="img" aria-label="Noite">🌙</span>
                        <span className="uppercase tracking-widest text-xs font-black text-slate-900 font-extrabold">NOITE</span>
                      </div>
                    </td>
                    {activeConfig.dias.map((_, idx) => renderCell(activeConfig.noite[idx], idx, 'noite'))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detailed Information Panels (Cultura, Custos & Pacotes MSC) */}
        <div className="p-6 md:p-10 bg-white">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#0038a8] mb-6 flex items-center gap-3">
            <span className="w-2.5 h-8 bg-[#e8112d] inline-block rounded-full"></span>
            Informações Detalhadas de Viagem
          </h2>

          {/* Special MSC Cruise Packages Grid */}
          {(activeConfig as any).cruisePackages && (
            <div className="mb-10 p-6 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                    🚢 MSC Musica • Itajaí (SC) ➔ Santos (SP)
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white">
                    Escolha a sua Oferta no Cruzeiro MSC (14 a 15 de Março de 2027)
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">
                    3º e 4º hóspedes viajam grátis em todas as tarifas. Compare o que está incluso em cada pacote:
                  </p>
                </div>
                
                {(activeConfig as any).mscBookingUrl && (
                  <a
                    href={(activeConfig as any).mscBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-500/30 transition-all shrink-0 cursor-pointer"
                  >
                    <span>RESERVAR NO SITE MSC</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* 3 Package Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {((activeConfig as any).cruisePackages as any[]).map((pkg, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all border ${
                      pkg.highlight
                        ? 'bg-slate-800/90 border-orange-500/80 shadow-xl shadow-orange-500/10 ring-2 ring-orange-500/40'
                        : 'bg-slate-800/50 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    {pkg.badge && (
                      <span
                        className={`absolute -top-3 left-4 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          pkg.highlight
                            ? 'bg-orange-500 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    )}

                    <div>
                      <h4 className="text-base font-extrabold text-slate-100 mt-2 mb-1">
                        {pkg.title}
                      </h4>
                      
                      <div className="flex items-baseline gap-1 my-3">
                        <span className="text-xs text-slate-400">A partir de</span>
                        <span className="text-2xl md:text-3xl font-black text-orange-400">
                          {pkg.price}
                        </span>
                        <span className="text-xs text-slate-400">{pkg.priceNote}</span>
                      </div>

                      <div className="w-full h-px bg-slate-700/60 my-3" />

                      <div className="text-xs text-slate-300 font-bold mb-2">Esta oferta inclui:</div>
                      <ul className="space-y-2.5 text-xs text-slate-300">
                        {pkg.features.map((feat: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5 font-bold text-sm">✓</span>
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-700/60">
                      <a
                        href={(activeConfig as any).mscBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all ${
                          pkg.highlight
                            ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                      >
                        <span>Selecionar {pkg.price}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notice Banner */}
              <div className="mt-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold text-base">ℹ️</span>
                  <span>
                    Valores pesquisados para 2 Adultos em Cabine Interna / Super Bingo (Sujeito a alteração de tarifa na plataforma da MSC).
                  </span>
                </div>
                <a
                  href={(activeConfig as any).mscBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 font-extrabold underline hover:text-orange-300 shrink-0"
                >
                  Ver no site MSC ↗
                </a>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-800">
            <div className="bg-blue-50/55 p-6 rounded-2xl border-2 border-blue-200 shadow-sm">
              <h3 className="font-extrabold text-base md:text-lg mb-3.5 text-[#0038a8] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0038a8]" /> {activeConfig.culturalTitle}
              </h3>
              <ul className="space-y-3.5 text-xs md:text-sm text-slate-700">
                {activeConfig.culturalTips.map((tip, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-600 select-none font-bold">▪</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-rose-50/55 p-6 rounded-2xl border-2 border-rose-200 shadow-sm">
              <h3 className="font-extrabold text-base md:text-lg mb-3.5 text-[#e8112d] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#e8112d]" /> {activeConfig.logisticsTitle}
              </h3>
              <ul className="space-y-3.5 text-xs md:text-sm text-slate-700">
                {activeConfig.logisticsTips.map((tip, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-rose-600 select-none font-bold">▪</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GuideList;
