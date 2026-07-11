import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Sparkles, AlertCircle, ShieldCheck, HelpCircle, Calendar, List, Table } from 'lucide-react';
import { getSessionUser } from '../services/session';

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
  flagType: 'bahia' | 'bahia_serg' | 'bahia_serg_alagoas' | 'colombia' | 'argentina' | 'argentina_brazil' | 'brazil' | 'south_africa' | 'sergipe';
  dias: DayOption[];
  manha: ScheduleCell[];
  tarde: ScheduleCell[];
  noite: ScheduleCell[];
  culturalTitle: string;
  culturalTips: string[];
  logisticsTitle: string;
  logisticsTips: string[];
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
      { data: '16/07 (Qui)', label: 'Quinta' },
      { data: '17/07 (Sex)', label: 'Sexta' },
      { data: '18/07 (Sáb)', label: 'Sábado' },
      { data: '19/07 (Dom)', label: 'Domingo' },
      { data: '20/07 (Seg)', label: 'Segunda' },
      { data: '21/07 (Ter)', label: 'Terça' },
      { data: '22/07 (Qua)', label: 'Quarta' },
      { data: '23/07 (Qui)', label: 'Quinta' }
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

  // 1. Salvador - Plano E (Férias em Salvador)
  'am_salvador_julho': {
    id: 'am_salvador_julho',
    title: 'Roteiro Integrado - Salvador + Maceió + Aracaju de Carro',
    date: '16 de Julho a 23 de Julho de 2026',
    base: 'Bases: Salvador, Maceió & Orla de Atalaia',
    mode: 'Modo Road Trip • Carro Alugado',
    flagType: 'bahia_serg_alagoas',
    dias: [
      { data: '16/07 (Qui)', label: 'Quinta' },
      { data: '17/07 (Sex)', label: 'Sexta' },
      { data: '18/07 (Sáb)', label: 'Sábado' },
      { data: '19/07 (Dom)', label: 'Domingo' },
      { data: '20/07 (Seg)', label: 'Segunda' },
      { data: '21/07 (Ter)', label: 'Terça' },
      { data: '22/07 (Qua)', label: 'Quarta' },
      { data: '23/07 (Qui)', label: 'Quinta' }
    ],
    manha: [
      { time: "06:00", activity: "Adiantar voo (App da GOL)", details: "Entrar no app da GOL precisamente às 06:00 para tentar adiantar o voo gratuitamente. Malas prontas!\n• Plano A (Conseguiu): Ir correndo para o Galeão (GIG) pegar voo matutino.\n• Plano B (Não conseguiu): Manter plano padrão e trabalhar/descansar durante o dia.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "06:30", activity: "Saída para Maceió", details: "Check-out no Airbnb em Salvador e saída às 06h30. Viagem de carro com distância de 561 km até o Airbnb in Maceió (Luciano). A estimativa de viagem é de aproximadamente 7h 53min de estrada, curtindo o trajeto pela BA-099.", costType: "pago", costLabel: "💳 Gasto: Aluguel Carro + Combustível" },
      { time: "06:00", activity: "Saída para Maragogi (Caribe Brasileiro) - Combo Dia 1", details: "Embarque por volta das 06:00. Incluso transporte de ida e volta de Maceió para a paradisíaca Maragogi.", costType: "pago", costLabel: "💳 Combo 2 Dias: R$ 190,00" },
      { time: "07:00", activity: "Saída para Praia do Gunga (Roteiro Completo) - Combo Dia 2", details: "Embarque por volta das 07:00. O roteiro inclui Parada para Fotos, Parada na Praia do Francês, Parada no Mirante do Gunga e Parada na Barra de São Miguel.", costType: "pago", costLabel: "Incluso no Combo" },
      { time: "08:30", activity: "Crooa do Goré / Namorados", details: "Passeio relaxante de barco ou catamarã até a belíssima Crooa do Goré e Ilha dos Namorados. Aproveitar as redes flutuantes na água morna.", costType: "pago", costLabel: "💳 Gasto: Passeio Catamarã R$ 90/px" },
      { time: "09:00", activity: "Checkout & Retorno Salvador", details: "Realizar checkout no Airbnb de Aracaju. Pegar a estrada de volta para a Bahia pela deslumbrante Rodovia Linha Verde (BA-099).", costType: "pago", costLabel: "💳 Gasto: Combustível" },
      { time: "09:30", activity: "Centro Histórico Salvador", details: "Caminhar pelo Pelourinho, descer o Elevador Lacerda, comprar fitinhas e fazer pedidos na Igreja do Bonfim.", costType: "gratuito", costLabel: "💸 Gratuito" },
      { time: "05:50", activity: "Voo de volta para o GIG", details: "Acordar cedo. Checkout no Airbnb de Caminho das Árvores, Salvador. Devolução do carro alugado na LocarX e embarque no voo de volta G3 1865.", costType: "pago", costLabel: "💳 Gasto: Combustível Devolução" }
    ],
    tarde: [
      { time: "Tarde", activity: "Plano A: SSA / Plano B: Trabalho", details: "• Plano A: Chegada cedo em Salvador. Fazer check-in no Airbnb Caminho das Árvores e curtir tarde de sol na Praia do Porto da Barra.\n• Plano B: Dia de trabalho ou descanso em casa no Rio, malas fechadas aguardando a noite.", costType: "gratuito", costLabel: "Sem Gastos" },
      { time: "15:30", activity: "Chegada em Maceió & Praias", details: "Estimativa de chegada no meio da tarde em Maceió (AL). Após check-in no aconchegante Airbnb de Luciano, visite a Praia de Ponta Verde, famosa por seus coqueirais e excelente infraestrutura de lazer.", costType: "gratuito", costLabel: "Sem Custos" },
      { time: "12:00", activity: "Catamarã, Piscinas Naturais & Caminho de Moisés", details: "Passeio de Catamarã para as incríveis Piscinas Naturais de Maragogi e caminhada no deslumbrante banco de areia 'Caminho de Moisés'. Retorno por volta das 15:00.", costType: "pago", costLabel: "Incluso no Combo" },
      { time: "12:00", activity: "Tarde na Praia do Gunga & Saída p/ Aracaju", details: "Aproveite o dia inteiro na espetacular Praia do Gunga. Retorno do passeio por volta das 15:30. Atividades opcionais locais: Buggy pelas falésias, Quadriciclo, Helicóptero, Lancha, Paramotor, Tirolesa ou Jetski.\n\nApós o retorno, fazer o check-out no Airbnb de Luciano em Maceió e pegar a estrada rumo a Aracaju (aprox. 270 km, 4h de viagem).", costType: "pago", costLabel: "💳 Opcionais + Combustível" },
      { time: "14:00", activity: "Lagoa dos Tambaquis", details: "Visitar a lagoa e entrar na água doce super agradável para alimentar na mão os tambaquis gigantes. Experiência incrível.", costType: "pago", costLabel: "💳 Gasto: Entrada R$ 20/px" },
      { time: "14:00", activity: "Terreiro da Casa Branca & Museus", details: "Após check-in no Airbnb Caminho das Árvores, visita ao bairro da Federação para conhecer o Terreiro da Casa Branca (Ilê Axé Iyá Nassô Oká), o templo de Candomblé de matriz iorubá mais antigo do Brasil. Em seguida, explore o MAB (Museu de Arte da Bahia) no Corredor da Vitória e o MAM (Museu de Arte Moderna) no Solar do Unhão para um lindo pôr do sol, sem focar tanto no Pelourinho.", costType: "gratuito", costLabel: "💸 Entrada Gratuita" },
      { time: "14:00", activity: "MUNCAB (Pelourinho)", details: "Visita imperdível à exposição 'Padê Onã' no MUNCAB. Quarta-feira a entrada é totalmente gratuita! Explore o Pelourinho e Mercado Modelo.", costType: "gratuito", costLabel: "💸 Gratuito às Quartas", links: [{ title: 'Exposição Padê Onã', url: 'https://www.salvadordabahia.com/eventos/exposicao-caso-pade-ona-encontrar-caminhos/' }] },
      { time: "-", activity: "Retorno ao Rio", details: "Chegada previsto no Aeroporto Galeão (GIG) às 07:55. Retorno para casa finalizando as férias.", costType: "gratuito", costLabel: "-" }
    ],
    noite: [
      { time: "Noite", activity: "Plano A: Jantar / Plano B: Voo", details: "• Plano A: Jantar romântico e curtir a noite boêmia de Salvador no Rio Vermelho. Dormir no Airbnb Caminho das Árvores.\n• Plano B: Embarque no GIG às 23:20 (voo G3 1898) rumo a SSA. Chegada na madrugada de sexta-feira (01:30), retirar carro na LocarX e ir direto dormir no Airbnb.", costType: "misto", costLabel: "Passagem já paga" },
      { time: "19:00", activity: "Jantar na Orla de Ponta Verde", details: "Aproveite a noite nos famosos quiosques de praia Lopana ou Kanoa, curtindo boa gastronomia, drinks artesanais e música ao vivo à beira-mar.", costType: "pago", costLabel: "💳 Gasto: Jantar" },
      { time: "19:00", activity: "Noite em Maceió / Jantar na Orla", details: "Jantar na bela orla de Ponta Verde ou Pajuçara (Lopana ou Kanoa) para repor as energias após o passeio espetacular em Maragogi.", costType: "pago", costLabel: "💳 Gasto: Jantar" },
      { time: "19:30", activity: "Chegada em AJU & Jantar na Passarela do Caranguejo", details: "Chegada em Aracaju. Check-in no Airbnb Premium na Orla de Atalaia. Jantar saboroso na famosa Passarela do Caranguejo (restaurante Cariri) com música ao vivo (forró).", costType: "pago", costLabel: "💳 Gasto: Jantar de Boas-Vindas" },
      { time: "19:00", activity: "Noite na Atalaia", details: "Passear pela bela Feira do Turista da Atalaia, comprar artesanatos sergipanos e curtir música ao vivo em bar local.", costType: "pago", costLabel: "💳 Gasto: Alimentação" },
      { time: "19:00", activity: "Noite no Largo da Mariquita", details: "Curtir a fantástica boemia de Salvador no Rio Vermelho. Saborear o acarajé de Cira ou Dinha e aproveitar o clima baiano.", costType: "pago", costLabel: "💳 Gasto: Consumos" },
      { time: "19:00", activity: "Jantar Especial de Despedida", details: "Jantar inesquecível no charmoso Santo Antônio Além do Carmo com vista deslumbrante para a Baía de Todos-os-Santos.", costType: "pago", costLabel: "💳 Gasto: Jantar de Despedida" },
      { time: "-", activity: "Descanso", details: "Descanso bem merecido em casa no Rio de Janeiro.", costType: "gratuito", costLabel: "-" }
    ],
    culturalTitle: "🏺 Cultura, Mar e Tradições Nordestinas",
    culturalTips: [
      "Voucher LocarX: Guarde o voucher (código QHKJDZC) no celular. Ao desembarcar, suba até a praça de alimentação no 1º andar e vá em frente à lanchonete Tabuleiro para pegar o transfer gratuito da locadora.",
      "App GOL às 6h: Abra o app da GOL logo cedo no dia 16/07 para tentar o adiantamento gratuito do voo. Se conseguir adiantar, você ganha um dia inteiro em Salvador (Plano A)!",
      "Tábua de Marés em Maceió: Programe os passeios de jangada até as piscinas de Pajuçara exatamente na hora da maré baixa diária (<0.3)."
    ],
    logisticsTitle: "🚗 Logística e Lógica de Estrada (Linha Verde)",
    logisticsTips: [
      "Rodovia BA-099 / AL-101 / BR-101: O percurso entre os três estados é lindo e bem pavimentado. Mantenha atenção aos limites de velocidade ao passar pelas vilas.",
      "Devolução às 02:00 AM / Madrugada: Lembre de abastecer antes de devolver o Mobi na LocarX para cumprir a política 'mesmo nível'. O transfer grátis funciona 24h sob demanda."
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
      { data: '11/07 (Sáb)', label: 'Sábado' },
      { data: '12/07 (Dom)', label: 'Domingo' },
      { data: '13/07 (Seg)', label: 'Segunda' },
      { data: '14/07 (Ter)', label: 'Terça' },
      { data: '15/07 (Qua)', label: 'Quarta' },
      { data: '16/07 (Qui)', label: 'Quinta' },
      { data: '17/07 (Sex)', label: 'Sexta' },
      { data: '18/07 (Sáb)', label: 'Sábado' },
      { data: '19/07 (Dom)', label: 'Domingo' }
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
      { data: '11/07 (Sáb)', label: 'Sábado' },
      { data: '12/07 (Dom)', label: 'Domingo' },
      { data: '13/07 (Seg)', label: 'Segunda' },
      { data: '14/07 (Ter)', label: 'Terça' },
      { data: '15/07 (Qua)', label: 'Quarta' },
      { data: '16/07 (Qui)', label: 'Quinta' },
      { data: '17/07 (Sex)', label: 'Sexta' },
      { data: '18/07 (Sáb)', label: 'Sábado' },
      { data: '19/07 (Dom)', label: 'Domingo' }
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
      { data: '01/01 (Sex)', label: 'Sexta' },
      { data: '02/01 (Sáb)', label: 'Sábado' },
      { data: '03/01 (Dom)', label: 'Domingo' },
      { data: '04/01 (Seg)', label: 'Segunda' },
      { data: '05/01 (Ter)', label: 'Terça' },
      { data: '06/01 (Qua)', label: 'Quarta' },
      { data: '07/01 (Qui)', label: 'Quinta' },
      { data: '08/01 (Sex)', label: 'Sexta' }
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
      { data: '01/01 (Sex)', label: 'Sexta' },
      { data: '02/01 (Sáb)', label: 'Sábado' },
      { data: '03/01 (Dom)', label: 'Domingo' },
      { data: '04/01 (Seg)', label: 'Segunda' },
      { data: '05/01 (Ter)', label: 'Terça' },
      { data: '06/01 (Qua)', label: 'Quarta' },
      { data: '07/01 (Qui)', label: 'Quinta' },
      { data: '08/01 (Sex)', label: 'Sexta' }
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
    title: 'Roteiro - Caribe Colombiano',
    date: '14 de Janeiro a 27 de Janeiro de 2027',
    base: 'Base: El Poblado & San Andrés',
    mode: 'Modo Descoberta e Praia',
    flagType: 'colombia',
    dias: [
      { data: '14/01 (Qui)', label: 'Quinta' },
      { data: '15/01 (Sex)', label: 'Sexta' },
      { data: '16/01 (Sáb)', label: 'Sábado' },
      { data: '17/01 (Dom)', label: 'Domingo' },
      { data: '18/01 (Seg)', label: 'Segunda' },
      { data: '19/01 (Ter)', label: 'Terça' },
      { data: '20/01 (Qua)', label: 'Quarta' },
      { data: '21/01 (Qui)', label: 'Quinta' }
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
  },
  'am_rio_san': {
    id: 'am_rio_san',
    title: 'Roteiro - San Andrés (Mais Barato)',
    date: '14 de Janeiro a 27 de Janeiro de 2027',
    base: 'Base: El Poblado & San Andrés',
    mode: 'Modo Descoberta e Praia',
    flagType: 'colombia',
    dias: [
      { data: '14/01 (Qui)', label: 'Quinta' },
      { data: '15/01 (Sex)', label: 'Sexta' },
      { data: '16/01 (Sáb)', label: 'Sábado' },
      { data: '17/01 (Dom)', label: 'Domingo' },
      { data: '18/01 (Seg)', label: 'Segunda' },
      { data: '19/01 (Ter)', label: 'Terça' },
      { data: '20/01 (Qua)', label: 'Quarta' },
      { data: '21/01 (Qui)', label: 'Quinta' }
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

const GuideList: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'days' | 'full' | 'table'>('days');
  const [activeDayIndex, setActiveDayIndex] = useState(0);

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

  const renderCardContent = (item: ScheduleCell | undefined) => {
    if (!item || (!item.activity && !item.details)) {
      return (
        <div className="flex items-center justify-center h-28 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs italic p-4 text-center w-full">
          Nenhuma atividade programada para este período
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-1 justify-between gap-4 w-full">
        <div>
          {item.time && item.time !== "-" && (
            <span className="font-black text-[11px] text-slate-800 bg-yellow-300 px-2 py-0.5 rounded shadow-sm inline-flex items-center gap-1 mb-2 select-none">
              ⏱️ {item.time}
            </span>
          )}
          
          <h4 className="font-extrabold text-slate-900 text-sm md:text-base leading-snug mb-2">
            {item.activity}
          </h4>
          
          {item.details && item.details.split('\n').map((line, i) => (
            <p key={i} className="text-slate-600 text-xs md:text-sm leading-relaxed mb-1.5">
              {line}
            </p>
          ))}

          {item.links && item.links.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-3">
              {item.links.map((link, i) => (
                <a 
                  key={i} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0038a8] hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-2 py-1.5 rounded-md border border-blue-100 transition-colors"
                >
                  <span className="shrink-0">🔗</span>
                  <span className="underline decoration-blue-200 underline-offset-2">{link.title}</span>
                </a>
              ))}
            </div>
          )}
        </div>
        
        {item.costLabel && item.costLabel !== "-" && (
          <div className={`inline-block px-2.5 py-1 text-xs font-black rounded-lg border shadow-sm text-center self-start shrink-0 ${
            item.costType === 'gratuito' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
            item.costType === 'pago' ? 'bg-rose-50 border-rose-300 text-rose-800' :
            'bg-amber-50 border-amber-300 text-amber-800'
          }`}>
            {item.costLabel}
          </div>
        )}
      </div>
    );
  };

  const renderCell = (item: ScheduleCell, idx: number) => {
    if (!item) {
      return (
        <td key={idx} className="p-4 border-b border-r border-gray-200 bg-gray-50/50 text-gray-400 text-center text-xs italic">
          -
        </td>
      );
    }

    return (
      <td 
        key={idx} 
        className="p-4 border-b border-r border-gray-200 hover:bg-blue-50/70 transition-colors align-top text-sm group-hover:border-blue-200 min-w-[240px] max-w-[280px]"
      >
        {item.time && item.time !== "-" && (
          <span className="font-black text-xs text-black bg-yellow-300 px-2 py-0.5 rounded-sm mr-2 shadow-sm inline-block mb-2 select-none">
            ⏱️ {item.time}
          </span>
        )}
        
        <span className="font-bold text-gray-900 block mb-1 text-sm md:text-base leading-tight">
          {item.activity}
        </span>
        
        {item.details && item.details.split('\n').map((line, i) => (
          <span key={i} className="block mb-2 text-gray-700 text-xs md:text-sm leading-relaxed">
            {line}
          </span>
        ))}
        
        {item.costLabel && item.costLabel !== "-" && (
          <div className={`mt-3 inline-block px-2 py-1 text-xs font-black rounded-md border shadow-sm w-full text-center ${
            item.costType === 'gratuito' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
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
        
        {/* Top Floating Back Button */}
        <div className="px-6 pt-6 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
          </button>
          
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#0038a8] border border-blue-200 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#0038a8]" /> Modo Interativo
          </div>
        </div>

        {/* Header Section */}
        <div className="p-6 md:p-10 border-b-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full text-center md:text-left">
            <div className="shadow-md border-2 border-slate-200/60 p-2 bg-white rounded-xl select-none shrink-0">
              <canvas ref={canvasRef} width="160" height="106" className="rounded-lg shadow-inner block"></canvas>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0038a8] mb-1.5 tracking-tight uppercase">
                {activeConfig.title}
              </h1>
              <p className="text-slate-600 text-base md:text-lg font-bold">
                {activeConfig.date}
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-[#0038a8] rounded-full text-xs font-black shadow-sm uppercase tracking-wide">
                  {activeConfig.base}
                </span>
                <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-black shadow-sm uppercase tracking-wide">
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
          {viewMode === 'days' && (
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
                    <div className="font-extrabold text-sm">{dia.label}</div>
                    <div className={`text-[11px] font-bold mt-1 ${activeDayIndex === idx ? 'text-white/85' : 'text-slate-400'}`}>
                      {dia.data}
                    </div>
                  </button>
                ))}
              </div>

              {/* Day's Activities Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Morning */}
                <div className="bg-white rounded-2xl border-2 border-slate-200/60 p-5 shadow-sm hover:border-amber-200 transition-colors flex flex-col justify-between min-h-[220px]">
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 w-full shrink-0">
                    <span className="text-2xl" role="img" aria-label="Manhã">☀️</span>
                    <div>
                      <h4 className="font-black text-slate-800 text-base uppercase tracking-wider">Manhã</h4>
                      <p className="text-[11px] text-slate-400 font-bold uppercase">Começo do Dia</p>
                    </div>
                  </div>
                  {renderCardContent(activeConfig.manha[activeDayIndex])}
                </div>

                {/* Afternoon */}
                <div className="bg-white rounded-2xl border-2 border-slate-200/60 p-5 shadow-sm hover:border-orange-200 transition-colors flex flex-col justify-between min-h-[220px]">
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 w-full shrink-0">
                    <span className="text-2xl" role="img" aria-label="Tarde">🌤️</span>
                    <div>
                      <h4 className="font-black text-slate-800 text-base uppercase tracking-wider">Tarde</h4>
                      <p className="text-[11px] text-slate-400 font-bold uppercase">Meio do Dia</p>
                    </div>
                  </div>
                  {renderCardContent(activeConfig.tarde[activeDayIndex])}
                </div>

                {/* Night */}
                <div className="bg-white rounded-2xl border-2 border-slate-200/60 p-5 shadow-sm hover:border-indigo-200 transition-colors flex flex-col justify-between min-h-[220px]">
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 w-full shrink-0">
                    <span className="text-2xl" role="img" aria-label="Noite">🌙</span>
                    <div>
                      <h4 className="font-black text-slate-800 text-base uppercase tracking-wider">Noite</h4>
                      <p className="text-[11px] text-slate-400 font-bold uppercase">Encerramento</p>
                    </div>
                  </div>
                  {renderCardContent(activeConfig.noite[activeDayIndex])}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'full' && (
            <div className="space-y-6">
              {activeConfig.dias.map((dia, idx) => (
                <div key={idx} className="bg-white rounded-2xl border-2 border-slate-200/60 overflow-hidden shadow-sm hover:border-blue-300 transition-colors">
                  <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0038a8] text-white flex items-center justify-center font-black text-sm shadow-sm select-none">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-black text-[#0038a8] text-sm md:text-base uppercase tracking-tight">{dia.label}</h3>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">{dia.data}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Manhã */}
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/60 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 mb-3 text-xs font-black text-slate-500 uppercase tracking-wider">
                        <span>☀️</span> Manhã
                      </div>
                      {renderCardContent(activeConfig.manha[idx])}
                    </div>

                    {/* Tarde */}
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/60 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 mb-3 text-xs font-black text-slate-500 uppercase tracking-wider">
                        <span>🌤️</span> Tarde
                      </div>
                      {renderCardContent(activeConfig.tarde[idx])}
                    </div>

                    {/* Noite */}
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/60 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 mb-3 text-xs font-black text-slate-500 uppercase tracking-wider">
                        <span>🌙</span> Noite
                      </div>
                      {renderCardContent(activeConfig.noite[idx])}
                    </div>
                  </div>
                </div>
              ))}
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
                        <div className="font-extrabold text-sm md:text-base">{dia.label}</div>
                        <div className="text-xs md:text-sm font-bold opacity-90 mt-1 tracking-wide">{dia.data}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="group">
                    <td className="p-4 bg-slate-100 border-b border-r border-slate-200 font-bold text-slate-800 align-middle text-center sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <div className="flex flex-col items-center justify-center py-2 select-none">
                        <span className="text-2xl mb-1.5" role="img" aria-label="Manhã">☀️</span>
                        <span className="uppercase tracking-widest text-xs font-black text-slate-500">Manhã</span>
                      </div>
                    </td>
                    {activeConfig.dias.map((_, idx) => renderCell(activeConfig.manha[idx], idx))}
                  </tr>
                  
                  <tr className="group">
                    <td className="p-4 bg-slate-100 border-b border-r border-slate-200 font-bold text-slate-800 align-middle text-center sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <div className="flex flex-col items-center justify-center py-2 select-none">
                        <span className="text-2xl mb-1.5" role="img" aria-label="Tarde">🌤️</span>
                        <span className="uppercase tracking-widest text-xs font-black text-slate-500">Tarde</span>
                      </div>
                    </td>
                    {activeConfig.dias.map((_, idx) => renderCell(activeConfig.tarde[idx], idx))}
                  </tr>

                  <tr className="group">
                    <td className="p-4 bg-slate-100 border-r border-slate-200 font-bold text-slate-800 align-middle text-center sticky left-0 z-10 rounded-bl-2xl shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <div className="flex flex-col items-center justify-center py-2 select-none">
                        <span className="text-2xl mb-1.5" role="img" aria-label="Noite">🌙</span>
                        <span className="uppercase tracking-widest text-xs font-black text-slate-500">Noite</span>
                      </div>
                    </td>
                    {activeConfig.dias.map((_, idx) => renderCell(activeConfig.noite[idx], idx))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detailed Information Panels (Cultura & Custos) */}
        <div className="p-6 md:p-10 bg-white">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#0038a8] mb-6 flex items-center gap-3">
            <span className="w-2.5 h-8 bg-[#e8112d] inline-block rounded-full"></span>
            Informações Detalhadas de Viagem
          </h2>
          
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
