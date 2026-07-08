import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API
// Using the modern SDK @google/genai for better performance and Gemini 3.5 support.

const getApiKey = () => {
  return process.env.API_KEY || "";
};

export async function generateText(prompt: string) {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return "Serviço de IA indisponível no momento (Chave de API ausente).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt
    });
    return response.text || "Desculpe, tive um problema ao conectar com a inteligência artificial.";
  } catch (error) {
    console.error('Erro ao gerar texto com Gemini:', error);
    return "Desculpe, tive um problema ao conectar com a inteligência artificial.";
  }
}

export interface NearbyMarket {
  name: string;
  distance: string; // Ex: "350m (4 min a pé)"
  address: string;
  description: string;
  isOpen24h: boolean;
  type: 'market' | 'minimarket' | 'bakery' | 'convenience';
}

export async function searchNearbyMarkets(accommodationName: string, locationAddress: string, city: string): Promise<NearbyMarket[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return [];
  }

  const prompt = `Você é um guia local especializado. Encontre estabelecimentos comerciais como supermercados, mercados de bairro, mini-mercados, mercadinhos, padarias e lojas de conveniência que fiquem a no MÁXIMO 1 km de distância (a pé) do seguinte local de hospedagem:
Hospedagem: "${accommodationName}"
Endereço: "${locationAddress}" na cidade/bairro de "${city}"

Dê preferência absoluta a:
- Estabelecimentos que funcionam 24 horas (24h).
- Locais onde seja possível comprar mantimentos básicos, água mineral de garrafa grande, pão, café da manhã, vinhos locais e lanches rápidos.

Dê sugestões de estabelecimentos REAIS e geograficamente próximos no raio de 1km de "${locationAddress}". Se for Sea Point (Cape Town), Atalaia (Aracaju), Rio Vermelho (Salvador), busque os comércios reais conhecidos do local. Retorne de 3 a 5 estabelecimentos.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            markets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  distance: { type: Type.STRING },
                  address: { type: Type.STRING },
                  description: { type: Type.STRING },
                  isOpen24h: { type: Type.BOOLEAN },
                  type: { type: Type.STRING }
                },
                required: ["name", "distance", "address", "description", "isOpen24h", "type"]
              }
            }
          },
          required: ["markets"]
        }
      }
    });

    const text = response.text || "";
    const cleanJson = text.trim();
    const data = JSON.parse(cleanJson);
    if (data && Array.isArray(data.markets)) {
      return data.markets;
    }
    return [];
  } catch (error) {
    console.error('Erro ao buscar mercados próximos via Gemini:', error);
    return [];
  }
}

// Interfaces para Packing Suggestions
export interface PackingSuggestion {
  bagType: 'bag23kg' | 'bag10kg' | 'pouch5kg';
  itemText: string;
  category: string;
  reason: string;
}

export async function getPackingSuggestions(tripName: string, personName: string, exclude23kg?: boolean): Promise<PackingSuggestion[]> {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  const prompt = `Você é um consultor pessoal de viagens especialista em arrumar malas.
A viagem em questão é: "${tripName}".
O viajante se chama: "${personName}".

Analise o destino, clima típico da época do roteiro e dê dicas altamente inteligentes de itens indispensáveis e específicos para essa viagem.
Você deve sugerir itens reais e adequados para as seguintes malas disponíveis:
${exclude23kg ? `Atenção: NÃO haverá mala despachada de 23kg para esta viagem! Portanto, você NÃO PODE sugerir itens para a 'bag23kg'. Você só deve sugerir itens para as malas 'bag10kg' e 'pouch5kg'.` : `- 'bag23kg': Mala Despachada (Roupas mais pesadas, calçados adicionais, líquidos grandes, etc.)`}
- 'bag10kg': Mala de Mão (Roupas leves de troca, adaptadores de tomada específicos do país, eletrônicos caros, casaco leve para o voo, óculos)
- 'pouch5kg': Frasqueira/Item Pessoal (Remédios indispensáveis, passaporte, comprovantes impressos, carteira, fone de ouvido, celular)

Por favor, seja ultra-específico quanto ao destino:
- Se for África do Sul: sugira protetor solar, adaptador de tomada Tipo M, binóculos para safári, casaco corta-vento, etc.
- Se for Buenos Aires / Foz / Assunção: sugira roupas elegantes para jantar, casaco de frio, protetor labial, adaptador Tipo C/N.
- Se for Caribe Colombiano (San Andrés): roupas leves de praia, sapatilha de neoprene (para pedras), snorkel, repelente forte.
- Se for Salvador / Nordeste: roupas leves, chinelo, shorts, boné, repelente, hidratante pós-sol.

Organize os itens nas categorias válidas: "👕 ROUPAS", "👟 CALÇADOS", "🧴 HIGIENE & SAÚDE", "🛂 DOCUMENTOS", "🔌 ELETRÔNICOS", "🎒 ACESSÓRIOS", "📦 DIVERSOS".
Gere de 6 a 10 sugestões no total.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              bagType: { type: Type.STRING, description: exclude23kg ? "Must be 'bag10kg' or 'pouch5kg'" : "Must be 'bag23kg', 'bag10kg', or 'pouch5kg'" },
              itemText: { type: Type.STRING, description: "Name of the item to carry" },
              category: { type: Type.STRING, description: "Must be one of: '👕 ROUPAS', '👟 CALÇADOS', '🧴 HIGIENE & SAÚDE', '🛂 DOCUMENTOS', '🔌 ELETRÔNICOS', '🎒 ACESSÓRIOS', '📦 DIVERSOS'" },
              reason: { type: Type.STRING, description: "Brief explanation of why this item is recommended for this trip" }
            },
            required: ["bagType", "itemText", "category", "reason"]
          }
        }
      }
    });

    const text = response.text || "";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error('Erro ao buscar sugestões de mala com Gemini:', error);
    return [];
  }
}

// Interfaces para Market/Grocery Suggestions
export interface MarketSuggestion {
  name: string;
  category: string;
  approxPrice: string;
  reason: string;
}

export async function getMarketSuggestions(tripName: string): Promise<MarketSuggestion[]> {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  const prompt = `Você é um guia especializado em compras locais de supermercado.
A viagem é para: "${tripName}".

Sugira uma lista de 5 a 7 itens altamente recomendáveis para o viajante comprar no supermercado local quando chegar na hospedagem para economizar ou experimentar iguarias locais.
Dê sugestões realistas e específicas do país/região:
- Na África do Sul: sugerir água engarrafada de galão (essencial), lanche Biltong (carne seca local típica), vinho Pinotage (ótimo custo-benefício), chocolates Whispers ou Amarula líquida.
- Na Argentina: vinho Malbec de supermercado (muito barato), Doce de Leite Havanna ou Chimbote, alfajores locais, água com gás, empanadas prontas.
- Na Colômbia: café Juan Valdez ou Sello Rojo, chocolate Corona para fazer com queijo, refrigerante Postobón, água pura.
- Em Salvador/Bahia: água mineral, cerveja local, frutas típicas (caju, umbu), pão de sal, ingredientes para um lanche rápido na praia.

Retorne no formato JSON listado.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Product name to buy" },
              category: { type: Type.STRING, description: "Category: 'Alimentação', 'Bebidas', 'Snacks' ou 'Higiene'" },
              approxPrice: { type: Type.STRING, description: "Approximate price in local currency and BRL, e.g. 'R$ 15,00 (50 ZAR)'" },
              reason: { type: Type.STRING, description: "Why buy this product at the supermarket (e.g. typical, saves money, etc.)" }
            },
            required: ["name", "category", "approxPrice", "reason"]
          }
        }
      }
    });

    const text = response.text || "";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error('Erro ao buscar itens de mercado sugeridos via Gemini:', error);
    return [];
  }
}

// Interfaces para Expense Advice
export interface ExpenseAdvice {
  dailyBudget: string;
  priceLevel: string;
  priceLevelColor: string; // Ex: 'emerald', 'amber', 'rose'
  savingTips: string[];
  costAlerts: string[];
}

export async function getExpenseAdvice(tripName: string): Promise<ExpenseAdvice | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const prompt = `Você é um consultor financeiro de viagens de luxo acessível.
A viagem é para: "${tripName}".

Analise o custo de vida desse destino e dê conselhos práticos e realistas sobre controle de gastos de forma a manter um equilíbrio inteligente (nem esbanjar demais, nem passar aperto).
Gere uma recomendação em JSON estruturado com:
- dailyBudget: Um orçamento diário sugerido para alimentação e pequenos transportes por pessoa em Reais (BRL).
- priceLevel: Classificação do nível de preços no destino ("Baixo", "Médio-Baixo", "Médio", "Médio-Alto", "Alto") com uma breve justificativa de 1 frase.
- priceLevelColor: Uma cor para o indicador visual, deve ser 'emerald' (barato), 'amber' (médio) ou 'rose' (caro).
- savingTips: Lista com 3 a 4 dicas reais de economia inteligentes e específicas para o destino.
- costAlerts: Lista de 2 alertas sobre taxas ocultas, pegadinhas locais ou custos altos esperados (como gorjeta obrigatória de 10-15% na África do Sul ou taxas de serviço extras em Buenos Aires).

Retorne no formato JSON estruturado.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dailyBudget: { type: Type.STRING },
            priceLevel: { type: Type.STRING },
            priceLevelColor: { type: Type.STRING },
            savingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            costAlerts: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["dailyBudget", "priceLevel", "priceLevelColor", "savingTips", "costAlerts"]
        }
      }
    });

    const text = response.text || "";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error('Erro ao gerar dicas de finanças com Gemini:', error);
    return null;
  }
}

// Interfaces para Financial Strategy
export interface FinancialStrategy {
  ratioWisdom: string; // Ex: "70% no cartão digital (Wise/Inter) e 30% em espécie para emergências."
  exchangeStrategy: string; // Dicas de onde converter e como sacar economizando tarifas
  warnings: string[]; // Riscos financeiros (clonagem de cartões, taxas de caixas eletrônicos específicos)
  bestCard: string; // Qual cartão funciona melhor lá (Wise, Nomad, Inter)
}

export async function getFinancialStrategy(tripName: string): Promise<FinancialStrategy | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const prompt = `Você é um analista especialista em meios de pagamento no exterior.
A viagem é para: "${tripName}".

Dê conselhos práticos de como o viajante deve carregar e movimentar seu dinheiro neste destino específico.
Considere as carteiras virtuais e físicas comuns (Wise, Nomad, Banco Inter e Dinheiro em Espécie).
Responda com um JSON contendo:
- ratioWisdom: Proporção recomendada de divisão do dinheiro (ex: "80% no cartão de débito internacional (Wise/Inter) e 20% em espécie para pequenos comércios").
- exchangeStrategy: Onde e como sacar ou comprar dinheiro. Se for África do Sul, mencione recusar a conversão ("Decline Conversion") nos caixas eletrônicos FNB/Standard Bank. Se for Argentina, mencione usar transferência Western Union ou cartões com cotação MEP. Se for Colômbia, taxas de saque no Davivienda/Bancolombia.
- warnings: Lista de 2 a 3 alertas reais sobre fraudes de cartão locais, tarifas de saques abusivas ou necessidade de avisar o banco antes de viajar.
- bestCard: Recomendação sincera de qual bandeira/cartão se sai melhor no destino (ex: "Bandeira Visa do Wise é aceita em quase tudo, mas leve o Mastercard do Inter como backup").

Retorne no formato JSON estruturado.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ratioWisdom: { type: Type.STRING },
            exchangeStrategy: { type: Type.STRING },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            bestCard: { type: Type.STRING }
          },
          required: ["ratioWisdom", "exchangeStrategy", "warnings", "bestCard"]
        }
      }
    });

    const text = response.text || "";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error('Erro ao gerar estratégia financeira com Gemini:', error);
    return null;
  }
}

export interface FuelAdvice {
  title: string;
  tips: string[];
}

export async function getFuelAdvice(params: { tripName: string; vehicle: string; distance: number; fuel: string; cost: number; tankCapacity: number }): Promise<FuelAdvice | null> {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.warn("Gemini API Key is missing. AI features will be disabled.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analise a viagem em relação ao consumo de combustível.
Viagem: ${params.tripName}
Veículo: ${params.vehicle}
Tanque: ${params.tankCapacity} Litros
Distância total informada: ${params.distance} km
Combustível Ideal Calculado: ${params.fuel}
Custo Total Estimado: R$ ${params.cost}

Gere uma avaliação concisa e inteligente.
1. Dê um título avaliando a eficiência (Ex: "Boa Autonomia", "Custo Alto para a Rota", etc).
2. Forneça de 2 a 3 dicas (curtas, use <b> para negrito) focadas na rota, no modelo do carro ou em como otimizar o abastecimento (postos recomendados, tipo de relevo, velocidade de cruzeiro, etc) e comente brevemente sobre a escolha de ${params.fuel}.
Retorne estritamente em JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "tips"]
        }
      }
    });

    const text = response.text || "";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error('Erro ao gerar dicas de combustível com Gemini:', error);
    return null;
  }
}

export interface VehicleSpecs {
  vehicleName: string;
  tankCapacity: number;
  gasKmL: number;
  etanolKmL: number;
}

export async function getVehicleSpecs(query: string): Promise<VehicleSpecs | null> {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.warn("Gemini API Key is missing. AI features will be disabled.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Você é um especialista em carros vendidos no Brasil.
Pesquise as especificações técnicas médias para o veículo consultado: "${query}".
Se o veículo for desconhecido ou muito vago, forneca valores médios razoáveis de um carro popular hatch 1.0 (ex: 50 litros de tanque, 13.0 km/l gasolina, 9.0 km/l etanol).
Retorne estritamente em formato JSON com:
- "vehicleName": o nome completo correto do carro formatado (Ex: "Hyundai HB20 1.0")
- "tankCapacity": capacidade do tanque em Litros (número inteiro ou decimal)
- "gasKmL": consumo médio de gasolina na estrada/misto em km/l (número)
- "etanolKmL": consumo médio de etanol na estrada/misto em km/l (número)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vehicleName: { type: Type.STRING },
            tankCapacity: { type: Type.NUMBER },
            gasKmL: { type: Type.NUMBER },
            etanolKmL: { type: Type.NUMBER }
          },
          required: ["vehicleName", "tankCapacity", "gasKmL", "etanolKmL"]
        }
      }
    });

    const text = response.text || "";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error('Erro ao buscar dados do veículo com Gemini:', error);
    return null;
  }
}

