
import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import { ItineraryVisualOverview } from './ItineraryVisualOverview';
import TopBar from './TopBar';
import PWAInstallPrompt from './PWAInstallPrompt';
import MenuCard from './MenuCard'; 
import CurrencyConverter from './CurrencyConverter';
import FlightList from './FlightList';
import PackingList from './PackingList';
import GuideList from './GuideList';
import MelhoresDestinos from './MelhoresDestinos';
import FinancialControl from './FinancialControl'; 
import ExpenseTracker from './ExpenseTracker';
import Translator from './Translator';
import AiAssistant from './AiAssistant';
import AccommodationList from './AccommodationList'; 
import { CarRentalReservation } from './CarRentalReservation';
import { FuelCalculator } from './FuelCalculator';
import BusList from './BusList';
import VaccineCertificate from './VaccineCertificate';
import UberBoltList from './UberBoltList';
import WeatherLocation from './WeatherLocation';
import WeatherCardHome from './WeatherCardHome';
import Supplies from './Supplies';
import FlightPriceRadar from './FlightPriceRadar';
import { MENU_ITEMS } from '../constants';
import { Construction, ArrowLeft, Grip, Loader2 } from 'lucide-react';
import { MenuItem } from '../types';
import CategoryHeader from './CategoryHeader';
import { subscribeToCloudData } from '../services/firebase';
import { setSessionUser } from '../services/session';
import { useDevice } from '../services/device';

import TripSelection from './TripSelection';

const ClientApp: React.FC = () => {
  const { isDesktop } = useDevice();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [hiddenModules, setHiddenModules] = useState<string[]>([]);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [agentReturnId, setAgentReturnId] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<{ id: string, name: string, lat?: number, lon?: number, isDomestic?: boolean } | null>(null);
  const [userName, setUserName] = useState<string>(localStorage.getItem('viajai_user_name') || '');
  const notifiedIds = useRef<Set<string>>(new Set());

  // Verifica se já existe uma viagem selecionada no localStorage para persistência
  useEffect(() => {
    const savedTrip = localStorage.getItem('selected_trip');
    if (savedTrip) {
      try {
        setSelectedTrip(JSON.parse(savedTrip));
      } catch (e) {
        console.error("Error parsing saved trip", e);
      }
    }
  }, []);

  const handleSelectTrip = (trip: { id: string, name: string }) => {
    setSelectedTrip(trip);
    try {
      localStorage.setItem('selected_trip', JSON.stringify(trip));
    } catch (e) {
      console.error("Circular reference in selected_trip:", trip);
    }
  };

  const handleResetTrip = () => {
    setSelectedTrip(null);
    localStorage.removeItem('selected_trip');
  };

  // Verifica se é um agente visualizando o app
  useEffect(() => {
    const aid = localStorage.getItem('agent_return_id');
    if (aid) setAgentReturnId(aid);
  }, []);

  const handleReturnToAgent = () => {
    if (agentReturnId) {
      localStorage.removeItem('agent_return_id');
      setSessionUser(agentReturnId); // Dispara atualização no App.tsx para voltar ao AdminDashboard
    }
  };

  // Solicita permissão de notificação no início
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Carrega configuração de visibilidade dos módulos
  useEffect(() => {
    // Inscreve-se nas mudanças de configuração em tempo real
    const unsubscribe = subscribeToCloudData('client_config', (data: any) => {
      if (data && data.hiddenIds) {
        setHiddenModules(data.hiddenIds);
      } else {
        setHiddenModules([]); // Se não tiver config, mostra tudo
      }
      setIsConfigLoaded(true);
    });

    // Timeout de segurança caso o Firebase demore (mostra tudo por padrão)
    const timeout = setTimeout(() => setIsConfigLoaded(true), 2000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);


  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.sectionId) {
        setActiveSectionId(event.state.sectionId);
      } else {
        setActiveSectionId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (id: string) => {
    if (id === 'clima_localizacao') return;

    setActiveSectionId(id);
    try {
      window.history.pushState({ sectionId: id }, '', `#${id}`);
    } catch (e) {
      console.warn("Navigation state update skipped", e);
    }
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (window.history.state && window.history.state.sectionId) {
      window.history.back();
    } else {
      setActiveSectionId(null);
      try {
        window.history.replaceState(null, '', ' ');
      } catch (e) {
         console.warn("History replaceState skipped", e);
      }
    }
  };

  const getMenuItem = (id: string): MenuItem | undefined => {
    return MENU_ITEMS.find(i => i.id === id);
  };

  const renderContent = (id: string) => {
    switch (id) {
      case 'clima_localizacao':
        return <WeatherLocation onBack={goBack} />;
      case 'ia_assistant':
        return <AiAssistant onBack={goBack} />;
      case 'tradutor':
        return <Translator onBack={goBack} />;
      case 'cambio':
        return <CurrencyConverter onBack={goBack} />;
      case 'melhores_destinos':
        return <MelhoresDestinos onBack={goBack} />;
      case 'voos':
        return <FlightList onBack={goBack} />;
      case 'radar_passagens':
        return <FlightPriceRadar onBack={goBack} />;
      case 'checklist':
        return <PackingList selectedTrip={selectedTrip} onBack={goBack} />;
      case 'guias':
        return <GuideList onBack={goBack} />;
      case 'financeiro':
          return <FinancialControl selectedTrip={selectedTrip} onBack={goBack} />;
      case 'gastos':
          return <ExpenseTracker selectedTrip={selectedTrip} onBack={goBack} />;
      case 'hospedagem': 
          return <AccommodationList onBack={goBack} />;
      case 'reservas':
          return <CarRentalReservation onBack={goBack} />;
      case 'abastecimento':
          return <FuelCalculator selectedTrip={selectedTrip} onBack={goBack} />;
      case 'onibus':
          return <BusList onBack={goBack} />;
      case 'uber_bolt':
          return <UberBoltList selectedTrip={selectedTrip} onBack={goBack} />;
      case 'vacinas':
          return <VaccineCertificate onBack={goBack} />;
      case 'mercado':
          return <Supplies selectedTrip={selectedTrip} onBack={goBack} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Construction className="w-12 h-12 mb-4 opacity-20 text-sa-green" />
            <p className="text-lg font-bold text-sa-green font-display">Em construção</p>
            <p className="text-sm text-gray-400 mt-2">Aguardando conteúdo.</p>
          </div>
        );
    }
  };

  const renderMenuItems = () => {
    // Filtra os itens baseado na configuração do agente
    let visibleMenuItems = MENU_ITEMS.filter(item => {
      const isHidden = hiddenModules.includes(item.id);
      return !isHidden;
    });

    // Filtra Melhores Destinos e Guia IA para o Roteiro de Março de 2027
    if (selectedTrip?.id === 'am_marco_2027' || (selectedTrip as any)?.category === 'marco2027') {
      visibleMenuItems = visibleMenuItems.filter(item => 
        item.id !== 'melhores_destinos' && 
        item.id !== 'ia_assistant'
      );
    }

    // Filtra itens internacionais se for viagem nacional
    if (selectedTrip?.isDomestic) {
      visibleMenuItems = visibleMenuItems.filter(item => 
        item.id !== 'cambio' && 
        item.id !== 'tradutor' &&
        item.id !== 'vacinas'
      );
    }

    // Hide bus card for Salvador, Maceió, and Aracaju (car-based trips)
    const isCarBasedTrip = selectedTrip?.id === 'am_salvador_julho' || 
                           selectedTrip?.id === 'am_sp_ssa_aju' || 
                           selectedTrip?.id === 'am_alagoas_maragogi' || 
                           selectedTrip?.name?.toLowerCase().includes('maragogi') || 
                           selectedTrip?.name?.toLowerCase().includes('maceio') || 
                           selectedTrip?.name?.toLowerCase().includes('maceió') || 
                           selectedTrip?.name?.toLowerCase().includes('salvador') || 
                           selectedTrip?.name?.toLowerCase().includes('aracaju');
    if (isCarBasedTrip) {
      visibleMenuItems = visibleMenuItems.filter(item => item.id !== 'onibus');
    }

    const cat1Items = visibleMenuItems.filter(item => ['checklist', 'financeiro', 'gastos', 'cambio', 'mercado'].includes(item.id));
    const cat2Items = visibleMenuItems.filter(item => ['radar_passagens', 'voos', 'hospedagem', 'reservas', 'uber_bolt', 'onibus', 'abastecimento'].includes(item.id));
    const cat3Items = visibleMenuItems.filter(item => ['guias', 'melhores_destinos', 'tradutor', 'vacinas', 'ia_assistant'].includes(item.id));

    return (
      <div className="px-3 sm:px-4 pb-20 space-y-6 pt-4">

        {/* Categoria iOS 1: Planejamento & Finanças */}
        {cat1Items.length > 0 && (
          <div className="bg-blue-50/75 dark:bg-blue-950/20 backdrop-blur-3xl border border-blue-200/50 dark:border-blue-900/30 rounded-[32px] p-5 sm:p-6 shadow-2xl shadow-blue-950/5">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-blue-900 dark:text-blue-100 font-black text-sm sm:text-base tracking-wider flex items-center gap-2.5 uppercase">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block shadow-md shadow-blue-500/50 animate-pulse" />
                PLANEJAMENTO & FINANÇAS
              </h3>
              <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-100/60 dark:bg-blue-900/40 backdrop-blur-md px-3 py-1 rounded-full border border-blue-200/40 dark:border-blue-800/40">
                {cat1Items.length} APPS
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-y-5 gap-x-3 sm:gap-x-5 justify-items-center">
              {cat1Items.map(item => (
                <MenuCard key={item.id} {...item} badge={item.id === 'checklist' ? 3 : undefined} onClick={() => navigateTo(item.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Categoria iOS 2: Transporte & Estadia */}
        {cat2Items.length > 0 && (
          <div className="bg-purple-50/75 dark:bg-purple-950/20 backdrop-blur-3xl border border-purple-200/50 dark:border-purple-900/30 rounded-[32px] p-5 sm:p-6 shadow-2xl shadow-purple-950/5">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-purple-900 dark:text-purple-100 font-black text-sm sm:text-base tracking-wider flex items-center gap-2.5 uppercase">
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block shadow-md shadow-purple-500/50 animate-pulse" />
                TRANSPORTE & ESTADIA
              </h3>
              <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-100/60 dark:bg-purple-900/40 backdrop-blur-md px-3 py-1 rounded-full border border-purple-200/40 dark:border-purple-800/40">
                {cat2Items.length + (cat2Items.some(i => i.id === 'abastecimento') ? 1 : 0)} APPS
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-y-5 gap-x-3 sm:gap-x-5 justify-items-center">
              {cat2Items.map(item => {
                if (item.id === 'abastecimento') {
                  return (
                    <React.Fragment key={item.id}>
                      <MenuCard {...item} variant3d="keyfob" onClick={() => navigateTo(item.id)} />
                      <MenuCard {...item} variant3d="gaspump" onClick={() => navigateTo(item.id)} />
                    </React.Fragment>
                  );
                }
                return <MenuCard key={item.id} {...item} onClick={() => navigateTo(item.id)} />;
              })}
            </div>
          </div>
        )}

        {/* Categoria iOS 3: Roteiro & Ferramentas */}
        {cat3Items.length > 0 && (
          <div className="bg-emerald-50/75 dark:bg-emerald-950/20 backdrop-blur-3xl border border-emerald-200/50 dark:border-emerald-900/30 rounded-[32px] p-5 sm:p-6 shadow-2xl shadow-emerald-950/5">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-emerald-900 dark:text-emerald-100 font-black text-sm sm:text-base tracking-wider flex items-center gap-2.5 uppercase">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-md shadow-emerald-500/50 animate-pulse" />
                ROTEIRO & FERRAMENTAS
              </h3>
              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-100/60 dark:bg-emerald-900/40 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-200/40 dark:border-emerald-800/40">
                {cat3Items.length} APPS
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-y-5 gap-x-3 sm:gap-x-5 justify-items-center">
              {cat3Items.map(item => (
                <MenuCard key={item.id} {...item} onClick={() => navigateTo(item.id)} />
              ))}
            </div>
          </div>
        )}

      </div>
    );
  };

  if (!selectedTrip) {
    return <TripSelection onSelect={handleSelectTrip} userName={userName} />;
  }

  if (selectedTrip.id === 'am_radar_dez_jan') {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white font-sans p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <FlightPriceRadar onBack={handleResetTrip} />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Botão Flutuante para Agente Voltar ao Painel */}
      {agentReturnId && (
        <button 
          onClick={handleReturnToAgent}
          className="fixed bottom-6 left-6 z-[100] bg-sa-gold text-slate-900 px-4 py-3 rounded-full shadow-2xl border-2 border-white font-black flex items-center gap-2 animate-in slide-in-from-left hover:scale-105 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-widest">Painel Admin</span>
        </button>
      )}

      {/* Botão para trocar de viagem */}
      <button 
        onClick={handleResetTrip}
        className="fixed bottom-6 right-6 z-[100] bg-white/80 backdrop-blur-md text-slate-600 p-3 rounded-full shadow-xl border border-slate-200 hover:bg-white transition-all active:scale-95"
        title="Trocar Viagem"
      >
        <Grip className="w-5 h-5" />
      </button>

      {activeSectionId ? (
        <div className={`min-h-screen font-sans animate-in slide-in-from-right duration-300 ease-out bg-slate-50`}>
          <TopBar variant="minimal" />
          <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
            {renderContent(activeSectionId)}
          </main>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-50 font-sans animate-in fade-in duration-300 relative">
          <TopBar variant="home" />
          <PWAInstallPrompt />
          
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header tripName={selectedTrip.name} lat={selectedTrip.lat} lon={selectedTrip.lon} tripId={selectedTrip.id} onBack={handleResetTrip} userName={userName} />
            
            <main className="max-w-7xl mx-auto py-4 pb-12 w-full px-4 relative z-20 pointer-events-auto">
              <ItineraryVisualOverview tripId={selectedTrip.id} />
              {!isConfigLoaded ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                   <Loader2 className="w-8 h-8 text-sa-green animate-spin mb-2" />
                   <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Carregando Serviços...</p>
                </div>
              ) : (
                renderMenuItems()
              )}
            </main>

            <footer className="text-center pb-12 mt-auto px-6">
              <p className="text-[10px] text-slate-400 font-sans font-black tracking-wide uppercase">
                 Desenvolvido por: André Brito
              </p>
              <p className="text-[10px] text-slate-400 font-sans font-medium mt-0.5">
                 Contato: britodeandrade@gmail.com
              </p>
              <p className="text-[9px] text-slate-400/60 font-sans font-medium mt-1 uppercase tracking-widest">
                 Versão 1.6
              </p>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientApp;
