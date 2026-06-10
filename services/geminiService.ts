
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API
// Using the modern SDK @google/genai for better performance and Gemini 3.5 support.
// process.env.API_KEY is mapped to REACT_APP_GEMINI_API_KEY in vite.config.ts

export async function generateText(prompt: string) {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return "Serviço de IA indisponível no momento (Chave de API ausente).";
  }

  try {
    // Create instance right before use to ensure up-to-date key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using 'gemini-3.5-flash' for fast and accurate text generation
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt
    });
    // Use .text property directly as per guidelines
    return response.text;
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
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return [];
  }

  const prompt = `Você é um guia local especializado. Encontre estabelecimentos comerciais como supermercados, mercados de bairro, mini-mercados, mercadinhos, padarias e lojas de conveniência que fiquem a no MÁXIMO 1 km de distância (a pé) do seguinte local de hospedagem:
Hospedagem: "${accommodationName}"
Endereço: "${locationAddress}" na cidade/bairro de "${city}"

Dê preferência absoluta a:
- Estabelecimentos que funcionam 24 horas (24h).
- Locais onde seja possível comprar mantimentos básicos, água mineral de garrafa grande, pão, café da manhã, vinhos locais e lanches rápidos.

Instruções de formatação:
Retorne APENAS um objeto JSON válido correspondente ao schema do TypeScript. Não insira explicações, não utilize formatação Markdown (como \`\`\`json). Responda com a string JSON puríssima contendo a lista:
{
  "markets": [
    {
      "name": "Nome Fantasia Oficial",
      "distance": "Ex: '350m (4 min a pé)'",
      "address": "Endereço completo com referências se houver",
      "description": "Descrição amigável em português do que vende lá (água, bebidas de noite, petiscos rápidos) e o horário de funcionamento esperado.",
      "isOpen24h": true,
      "type": "market"
    }
  ]
}

Encontre estabelecimentos REAIS e geograficamente próximos no raio de 1km de "${locationAddress}". Se for Sea Point (Cape Town), Atalaia (Aracaju), Rio Vermelho (Salvador), busque os comércios reais conhecidos do local. Retorne de 3 a 5 estabelecimentos.`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
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

