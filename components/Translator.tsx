import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  RefreshCw, 
  MessageSquare, 
  BookOpen, 
  WifiOff, 
  ArrowRightLeft,
  VolumeX,
  Languages
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import PronunciationTool from './PronunciationTool';
import CategoryHeader from './CategoryHeader';
import { MENU_ITEMS } from '../constants';

// --- TYPES & INTERFACES ---

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

// --- OFFLINE PHRASEBOOK DATA ---

type Category = 'alfandega' | 'uber' | 'hotel' | 'restaurante' | 'mercado' | 'direcoes' | 'social' | 'emergencia';

interface Phrase {
  pt: string;
  en: string;
  context?: string; // Dica visual (ex: "Eles perguntam", "Você responde")
  zulu?: string;
  afrikaans?: string;
}

const PHRASEBOOK: Record<Category, { title: string, color: string, phrases: Phrase[] }> = {
  alfandega: {
    title: 'Aeroporto & Imigração',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    phrases: [
      { context: 'Eles perguntam:', pt: 'Qual o motivo da sua visita?', en: 'What is the purpose of your visit?' },
      { context: 'Você responde:', pt: 'Estou aqui de férias / turismo.', en: 'I am here on vacation / tourism.' },
      { context: 'Eles perguntam:', pt: 'Quanto tempo vai ficar?', en: 'How long will you be staying?' },
      { context: 'Você responde:', pt: 'Vou ficar por 12 dias.', en: 'I will stay for 12 days.' },
      { context: 'Eles perguntam:', pt: 'Onde vai se hospedar?', en: 'Where will you be staying?' },
      { context: 'Você responde:', pt: 'Neste hotel (mostre a reserva).', en: 'At this hotel (show booking).' },
      { context: 'Você responde:', pt: 'Tenho passagem de volta confirmada.', en: 'I have a confirmed return ticket.' },
      { context: 'Problemas:', pt: 'Minha mala não chegou.', en: 'My luggage did not arrive.' },
      { context: 'Problemas:', pt: 'Onde pego minha mala?', en: 'Where is the baggage claim?' },
      { context: 'Problemas:', pt: 'Não falo inglês, só português.', en: 'I do not speak English, only Portuguese.' },
    ]
  },
  uber: {
    title: 'Uber & Transporte',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    phrases: [
      { context: 'No App:', pt: 'Estou no local de embarque.', en: 'I am at the pickup point.' },
      { context: 'Ao entrar:', pt: 'Olá, sou o André.', en: 'Hi, I am André.' },
      { context: 'Ao entrar:', pt: 'Vamos para o Shopping Sandton?', en: 'Are we going to Sandton Shopping?' },
      { context: 'Conforto:', pt: 'Pode ligar o ar condicionado?', en: 'Can you turn on the air conditioning?' },
      { context: 'Conforto:', pt: 'Pode fechar a janela, por favor?', en: 'Can you close the window, please?' },
      { context: 'Direção:', pt: 'Pode me deixar naquela esquina?', en: 'Can you drop me off at that corner?' },
      { context: 'Eles dizem:', pt: 'Vou seguir o GPS.', en: 'I will follow the GPS.' },
      { context: 'Eles dizem:', pt: 'O trânsito está ruim.', en: 'Traffic is bad / heavy.' },
      { context: 'Segurança:', pt: 'É seguro andar aqui a pé?', en: 'Is it safe to walk here?' },
      { context: 'Pagamento:', pt: 'O pagamento é pelo app.', en: 'Payment is via the app.' },
      { context: 'Dica Local:', pt: 'Isso é um semáforo (Gíria: Robot).', en: 'That is a robot.' },
    ]
  },
  hotel: {
    title: 'Hotel & Acomodação',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    phrases: [
      { context: 'Chegada:', pt: 'Olá, tenho uma reserva.', en: 'Hi, I have a reservation.' },
      { context: 'Chegada:', pt: 'Pode guardar nossas malas antes do check-in?', en: 'Can we leave our bags before check-in?' },
      { context: 'Eles dizem:', pt: 'Preciso do seu passaporte e cartão.', en: 'I need your passport and credit card.' },
      { context: 'Eles dizem:', pt: 'O café é servido das 7 às 10.', en: 'Breakfast is served from 7 to 10.' },
      { context: 'Dúvida:', pt: 'Qual a senha do Wi-Fi?', en: 'What is the Wi-Fi password?' },
      { context: 'Dúvida:', pt: 'Tem adaptador de tomada?', en: 'Do you have a power adapter?' },
      { context: 'Problema:', pt: 'O chuveiro não esquenta.', en: 'The shower is not getting hot.' },
      { context: 'Problema:', pt: 'O quarto está muito barulhento.', en: 'The room is too noisy.' },
      { context: 'Saída:', pt: 'Gostaria de fazer o check-out.', en: 'I would like to check out.' },
      { context: 'Saída:', pt: 'Pode chamar um táxi/Uber?', en: 'Can you call a taxi/Uber?' },
    ]
  },
  restaurante: {
    title: 'Restaurante & Comida',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    phrases: [
      { context: 'Entrada:', pt: 'Mesa para dois, por favor.', en: 'Table for two, please.' },
      { context: 'Eles perguntam:', pt: 'Vocês têm reserva?', en: 'Do you have a reservation?' },
      { context: 'Pedido:', pt: 'Pode me trazer o cardápio?', en: 'Can I have the menu?' },
      { context: 'Pedido:', pt: 'Eu gostaria de...', en: 'I would like to have...' },
      { context: 'Pedido:', pt: 'Água sem gás / com gás.', en: 'Still water / Sparkling water.' },
      { context: 'Restrição:', pt: 'Não como pimenta/apimentado!', en: 'I do not eat spicy food! No spice.' },
      { context: 'Restrição:', pt: 'Sou alérgico a frutos do mar.', en: 'I am allergic to seafood.' },
      { context: 'Eles perguntam:', pt: 'Tudo certo com a comida?', en: 'Is everything fine? / Is the meal okay?' },
      { context: 'Conta:', pt: 'A conta, por favor. (A gorjeta é 10%)', en: 'The bill, please.' },
      { context: 'Pagamento:', pt: 'Aceita cartão de crédito?', en: 'Do you take credit cards?' },
      { context: 'Eles dizem:', pt: 'A máquina está sem sinal.', en: 'The machine is offline.' },
    ]
  },
  mercado: {
    title: 'Mercado & Compras',
    color: 'bg-green-100 text-green-800 border-green-200',
    phrases: [
      { context: 'Preço:', pt: 'Quanto custa isso?', en: 'How much is this?' },
      { context: 'Preço:', pt: 'É muito caro.', en: 'It is too expensive.' },
      { context: 'Pagamento:', pt: 'Posso pagar com dinheiro?', en: 'Can I pay with cash?' },
      { context: 'Caixa:', pt: 'Eu preciso de uma sacola.', en: 'I need a bag, please.' },
      { context: 'Eles perguntam:', pt: 'Quer o recibo?', en: 'Do you want the receipt?' },
      { context: 'Loja:', pt: 'Onde fica o provador?', en: 'Where is the fitting room?' },
      { context: 'Loja:', pt: 'Tem tamanho maior/menor?', en: 'Do you have a bigger/smaller size?' },
      { context: 'Mercado:', pt: 'Onde fica a água?', en: 'Where can I find water?' },
      { context: 'Gíria Local:', pt: 'Isso é para o churrasco (Braai).', en: 'This is for the Braai.' },
    ]
  },
  direcoes: {
    title: 'Direções & Rua',
    color: 'bg-teal-100 text-teal-800 border-teal-200',
    phrases: [
      { context: 'Pergunta:', pt: 'Onde fica o banheiro?', en: 'Where is the bathroom / toilet?' },
      { context: 'Pergunta:', pt: 'Onde fica o caixa eletrônico?', en: 'Where is the ATM?' },
      { context: 'Pergunta:', pt: 'É longe daqui?', en: 'Is it far from here?' },
      { context: 'Resposta:', pt: 'Fica virando a esquina.', en: 'It is just around the corner.' },
      { context: 'Resposta:', pt: 'Siga reto.', en: 'Go straight ahead.' },
      { context: 'Resposta:', pt: 'Fica no segundo andar.', en: 'It is on the second floor.' },
      { context: 'Gíria Local:', pt: 'Agora mesmo (futuro próximo/imediato).', en: 'Now now.' },
      { context: 'Gíria Local:', pt: 'Daqui a pouco (tempo indefinido).', en: 'Just now.' },
    ]
  },
  social: {
    title: 'Social & Conversa',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    phrases: [
      { context: 'Eles perguntam:', pt: 'De onde vocês são?', en: 'Where are you guys from?' },
      { context: 'Você responde:', pt: 'Somos do Brasil.', en: 'We are from Brazil.' },
      { context: 'Eles dizem:', pt: 'Brasil! Futebol, Samba!', en: 'Brazil! Soccer, Samba!' },
      { context: 'Você responde:', pt: 'Seu país é lindo.', en: 'Your country is beautiful.' },
      { context: 'Cumprimento:', pt: 'Tudo bem? (Resposta: Tudo bem)', en: 'How are you? / Is it fine?', zulu: 'Unjani?' },
      { context: 'Gíria Local:', pt: 'Beleza / Legal / Tudo certo.', en: 'Sharp / Sharp Sharp.' },
      { context: 'Gíria Local:', pt: 'Oi / E aí (Informal).', en: 'Howzit.' },
      { context: 'Gíria Local:', pt: 'Caramba! / Uau!', en: 'Yoh!' },
    ]
  },
  emergencia: {
    title: 'Emergência & Saúde',
    color: 'bg-red-100 text-red-800 border-red-200',
    phrases: [
      { context: 'Urgente:', pt: 'Me ajude!', en: 'Help me!', zulu: 'Ngisize!' },
      { context: 'Saúde:', pt: 'Preciso de um médico.', en: 'I need a doctor.' },
      { context: 'Saúde:', pt: 'Tenho dor de estômago/cabeça.', en: 'I have a stomach ache / headache.' },
      { context: 'Polícia:', pt: 'Fui roubado.', en: 'I have been mugged / robbed.' },
      { context: 'Polícia:', pt: 'Onde fica a delegacia?', en: 'Where is the police station?' },
      { context: 'Documentos:', pt: 'Perdi meu passaporte.', en: 'I lost my passport.' },
      { context: 'Perdido:', pt: 'Estou perdido. Pode me ajudar?', en: 'I am lost. Can you help me?' },
    ]
  }
};

// --- COMPONENT ---

const Translator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'live' | 'pronunciation' | 'phrases'>('live');
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode] = useState<'pt-to-en' | 'en-to-pt'>('en-to-pt'); // Default: Listen to them (EN) -> Show me (PT)
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Debounce for translation API
  const [debouncedTranscript, setDebouncedTranscript] = useState('');
  
  const menuItem = MENU_ITEMS.find((item: { id: string }) => item.id === 'tradutor');

  // 1. SETUP SPEECH RECOGNITION
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true; // Key for the 0.3s feeling
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        const currentText = finalTranscript || interimTranscript;
        setTranscript(currentText);
        setDebouncedTranscript(currentText); // Trigger translation effect
      };

      recognition.onerror = (event) => {
        console.error("Speech error", event);
        setIsListening(false);
      };

      recognition.onend = () => {
        // Auto-restart if we want continuous listening, but usually better to let user toggle in UI to save battery
        if (isListening) {
           // recognition.start(); 
           // For this UX, let's stop and let user press again to avoid infinite loops if permission issues
           setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isListening]);

  // 2. TOGGLE LISTENING
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Set language based on mode
      recognitionRef.current.lang = mode === 'pt-to-en' ? 'pt-BR' : 'en-ZA'; 
      setTranscript('');
      setTranslation('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // 3. AI TRANSLATION LOGIC (Gemini)
  useEffect(() => {
    const translateText = async () => {
      if (!debouncedTranscript.trim()) return;

      setIsTranslating(true);
      try {
        if (!process.env.API_KEY) {
          throw new Error("API Key missing");
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Contextual Prompt
        const sourceLang = mode === 'pt-to-en' ? 'Portuguese' : 'English';
        const targetLang = mode === 'pt-to-en' ? 'English' : 'Portuguese';
        const context = mode === 'pt-to-en' 
          ? "Translate to English for a South African local. Keep it simple and polite."
          : "Translate to Portuguese (Brazil) for a tourist. Keep it simple.";

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: `Role: Professional Translator. 
            Context: ${context}
            Input: "${debouncedTranscript}"
            Output: Only the translation, nothing else.`
        });
        
        setTranslation(response.text?.trim() || "...");
      } catch (error) {
        console.error("Translation error", error);
        // Fallback or offline indication handled in UI
      } finally {
        setIsTranslating(false);
      }
    };

    // Small delay to avoid API spam while typing/speaking
    const timeoutId = setTimeout(() => {
        translateText();
    }, 800); // 0.8s buffer + network time ~ closely matches user feel of "thinking"

    return () => clearTimeout(timeoutId);
  }, [debouncedTranscript, mode]);


  // --- RENDER LIVE TAB ---
  const renderLiveTab = () => (
    <div className="flex flex-col h-[calc(100vh-280px)]">
        {/* Mode Switcher */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex mb-4">
            <button
                onClick={() => { setMode('pt-to-en'); setIsListening(false); setTranscript(''); setTranslation(''); }}
                className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold font-display transition-all flex flex-col items-center justify-center gap-1 ${mode === 'pt-to-en' ? 'bg-green-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
            >
                <span>FALO PORTUGUÊS</span>
                <ArrowRightLeft className="w-3 h-3 opacity-50" />
                <span>LÊ EM INGLÊS</span>
            </button>
            <button
                onClick={() => { setMode('en-to-pt'); setIsListening(false); setTranscript(''); setTranslation(''); }}
                className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold font-display transition-all flex flex-col items-center justify-center gap-1 ${mode === 'en-to-pt' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
            >
                <span>ELES FALAM (EN)</span>
                <ArrowRightLeft className="w-3 h-3 opacity-50" />
                <span>LEIO EM PT-BR</span>
            </button>
        </div>

        {/* Display Area */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-4">
            {/* Input (Transcript) */}
            <div className={`p-4 rounded-2xl border-2 min-h-[120px] flex flex-col ${isListening ? 'border-green-400 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    {isListening ? 'Escutando...' : 'Microfone desligado'}
                </span>
                <p className="text-xl font-medium text-gray-700 leading-relaxed">
                    {transcript || <span className="text-gray-300 italic">Toque no microfone para começar...</span>}
                </p>
            </div>

            {/* Output (Translation) */}
            <div className="p-4 rounded-2xl border-2 border-indigo-100 bg-white shadow-sm min-h-[140px] flex flex-col relative">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2 flex items-center justify-between">
                    Tradução IA
                    {isTranslating && <RefreshCw className="w-3 h-3 animate-spin" />}
                </span>
                
                {/* LARGE TEXT FOR SHOWING */}
                <p className={`text-2xl sm:text-3xl font-display font-black leading-tight ${mode === 'pt-to-en' ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {translation || <span className="text-gray-200">...</span>}
                </p>

                {/* Speaker Disabled Warning */}
                <div className="absolute bottom-3 right-3 opacity-30">
                     <VolumeX className="w-6 h-6 text-gray-400" />
                </div>
            </div>
        </div>

        {/* Mic Control */}
        <div className="flex justify-center pb-4">
            <button
                onClick={toggleListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 ${
                    isListening 
                    ? 'bg-red-500 animate-pulse ring-4 ring-red-200' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 ring-4 ring-green-100'
                }`}
            >
                {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
            </button>
        </div>
        
        {!navigator.onLine && (
            <p className="text-center text-[10px] text-red-400 font-bold bg-red-50 p-2 rounded-lg mb-2">
                <WifiOff className="w-3 h-3 inline mr-1" />
                Modo Offline: A tradução IA pode falhar. Use a aba "Frases Rápidas".
            </p>
        )}
    </div>
  );

  // --- RENDER PHRASEBOOK TAB ---
  const renderPhrasebookTab = () => (
    <div className="pb-8 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl text-xs text-yellow-800 mb-4">
            <p className="font-bold flex items-center gap-2 mb-1">
                <WifiOff className="w-4 h-4" /> Funciona Offline
            </p>
            <p>Este guia salva você em 90% das situações sem internet. Mostre a tela para a pessoa ler.</p>
        </div>

        {Object.entries(PHRASEBOOK).map(([key, category]) => (
            <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`px-4 py-3 font-bold font-display text-sm uppercase tracking-wide border-b ${category.color}`}>
                    {category.title}
                </div>
                <div className="divide-y divide-gray-50">
                    {category.phrases.map((phrase, idx) => (
                        <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                            {phrase.context && (
                                <span className="inline-block bg-gray-100 text-[9px] font-bold uppercase tracking-wider text-gray-500 px-1.5 py-0.5 rounded mb-1">
                                    {phrase.context}
                                </span>
                            )}
                            <p className="text-sm font-bold text-gray-800 mb-1">{phrase.pt}</p>
                            <p className="text-lg font-display font-black text-indigo-700 leading-tight mb-1">
                                {phrase.en}
                            </p>
                            <div className="flex gap-3 mt-2">
                                {phrase.zulu && (
                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                                        🇿🇦 Zulu: <strong>{phrase.zulu}</strong>
                                    </span>
                                )}
                                {phrase.afrikaans && (
                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                                        🇿🇦 Afr: <strong>{phrase.afrikaans}</strong>
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <CategoryHeader title={menuItem?.title || 'Tradução'} onBack={onBack} bgImage={menuItem?.bgImage} />
      
      {/* Custom Tab Switcher */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        <button
            onClick={() => setActiveTab('live')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg text-xs font-bold font-display transition-all whitespace-nowrap ${
            activeTab === 'live' 
                ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
        >
            <MessageSquare className="w-4 h-4 mb-1" />
            Conversa Ao Vivo
        </button>
        <button
            onClick={() => setActiveTab('pronunciation')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg text-xs font-bold font-display transition-all whitespace-nowrap ${
            activeTab === 'pronunciation' 
                ? 'bg-white text-purple-700 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
        >
            <Languages className="w-4 h-4 mb-1" />
            Treino de Pronúncia
        </button>
        <button
            onClick={() => setActiveTab('phrases')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg text-xs font-bold font-display transition-all whitespace-nowrap ${
            activeTab === 'phrases' 
                ? 'bg-white text-teal-700 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
        >
            <BookOpen className="w-4 h-4 mb-1" />
            Frases Rápidas
        </button>
      </div>

      {activeTab === 'live' && renderLiveTab()}
      {activeTab === 'pronunciation' && <PronunciationTool />}
      {activeTab === 'phrases' && renderPhrasebookTab()}
    </div>
  );
};

export default Translator;