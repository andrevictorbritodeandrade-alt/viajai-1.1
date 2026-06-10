
import React, { useState, useEffect } from 'react';
import { RefreshCw, Download } from 'lucide-react';

const UpdatePrompt: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Registrar SW
      navigator.serviceWorker.register('./sw.js').then((registration) => {
        
        // 1. Verifica se já tem um worker esperando (atualização baixada em background)
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowUpdate(true);
        }

        // 2. Monitora novas atualizações enquanto o app está aberto
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setShowUpdate(true);
              }
            });
          }
        });
      });

      // 3. Quando o novo worker assume (após skipWaiting), recarrega a página
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          window.location.reload();
          refreshing = true;
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Envia mensagem para o SW forçar a atualização
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdate(false);
    }
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-sa-green/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white text-sa-green p-2 rounded-xl">
            <Download className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-wide">Atualização Disponível</h4>
            <p className="text-[10px] text-white/90">Nova versão do app pronta.</p>
          </div>
        </div>
        <button 
          onClick={handleUpdate}
          className="bg-white text-sa-green px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform flex items-center gap-2"
        >
          <RefreshCw className="w-3 h-3" />
          Atualizar
        </button>
      </div>
    </div>
  );
};

export default UpdatePrompt;
