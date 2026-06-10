
import React, { useState, useEffect } from 'react';
import { Lock, Phone, ChevronRight, User, Loader2, Sparkles } from 'lucide-react';
import { setSessionUser } from '../services/session';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface LoginProps {
  onLoginSuccess: (role: 'agent' | 'client') => void;
  onStartOnboarding: () => void;
}

const QUICK_ACCESS = [
  { name: 'André Brito', password: '1008', role: 'client' },
  { name: 'Marcelly Bispo', password: '1929', role: 'client' },
  { name: 'Agente de Viagem', password: '1234', role: 'agent' },
];

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onStartOnboarding }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickAccess, setShowQuickAccess] = useState(false);

  const handleLogin = async (e?: React.FormEvent, directData?: typeof QUICK_ACCESS[0]) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    const loginName = directData ? directData.name : name.trim();
    const loginPass = directData ? directData.password : password;

    // 1. Acesso Agente (Backdoor fixo)
    if ((loginName.toLowerCase() === 'agente de viagem' || loginName === '1234') && loginPass === '1234') {
      setSessionUser('1234');
      onLoginSuccess('agent');
      setLoading(false);
      return;
    }

    try {
      // 2. Busca no Firestore por nome
      const q = query(collection(db, 'users'), where('name', '==', loginName));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Se não estiver no Firestore mas for um dos Quick Access (fallback)
        const quick = QUICK_ACCESS.find(q => q.name.toLowerCase() === loginName.toLowerCase());
        if (quick && loginPass === quick.password) {
          // Link André and Marcelly to a shared ID
          const targetId = (quick.name === 'André Brito' || quick.name === 'Marcelly Bispo') 
            ? 'shared_andre_marcelly' 
            : quick.name;
            
          setSessionUser(targetId); 
          localStorage.setItem('viajai_user_name', quick.name);
          onLoginSuccess(quick.role as 'agent' | 'client');
          setLoading(false);
          return;
        }
        setError('Usuário não encontrado.');
        setLoading(false);
        return;
      }

      const userData = querySnapshot.docs[0].data();
      let userId = querySnapshot.docs[0].id;

      // Link André and Marcelly to a shared ID
      if (userData.name === 'André Brito' || userData.name === 'Marcelly Bispo') {
        userId = 'shared_andre_marcelly';
      }

      if (loginPass === userData.password) {
        setSessionUser(userId);
        localStorage.setItem('viajai_user_name', userData.name);
        onLoginSuccess(userData.role as 'agent' | 'client');
      } else {
        setError('Senha incorreta.');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'users');
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-between font-sans overflow-hidden py-10 sm:py-20 lg:py-16">
      
      {/* Background Layer with Sophisticated Sepia/Atmospheric filter */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=2072&auto=format&fit=crop" 
          alt="African Savanna Sunset" 
          className="w-full h-full object-cover scale-110 blur-[2px] sepia-[0.3] brightness-[0.6] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col items-center mb-8 lg:mb-16">
        <div className="flex items-center select-none group drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
          <h1 
            className="font-display font-black text-6xl sm:text-7xl lg:text-8xl tracking-tighter uppercase leading-none text-white"
            style={{ 
              textShadow: '0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)'
            }}
          >
            VIAJ
          </h1>
          <h1 
            className="font-display font-black text-6xl sm:text-7xl lg:text-8xl tracking-tighter uppercase leading-none"
            style={{ 
              color: '#FFB81C',
              textShadow: '0 1px 0 #cc9900, 0 2px 0 #c99600, 0 3px 0 #bb8a00, 0 4px 0 #b98800, 0 5px 0 #aa7d00, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)'
            }}
          >
            AÍ
          </h1>
        </div>
        <p className="mt-4 text-white font-display font-semibold text-[10px] sm:text-xs tracking-[0.4em] uppercase opacity-90 drop-shadow-md border-t border-white/10 pt-4 px-6 text-center">
          AJUDANDO A CRIAR SUA VIAGEM DOS SONHOS
        </p>
      </div>

      {/* Main Content Panels - Horizontal on Desktop */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-stretch justify-center gap-6 px-4 md:px-8 mb-12">
        
        {/* Left Panel: First Time / Onboarding */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 p-8 sm:p-12 text-center animate-in fade-in slide-in-from-left-8 duration-1000 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-sa-gold/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center max-w-sm">
            <div className="bg-sa-gold/20 p-4 rounded-full mb-6 shadow-[0_0_30px_rgba(255,184,28,0.2)] group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-sa-gold animate-pulse" />
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight mb-4">
              Primeira vez aqui?<br/>Planaje sua próxima viagem
            </h3>
            <p className="text-white/70 text-sm sm:text-base mb-10 leading-relaxed font-medium">
              Responda a algumas perguntas rápidas para que possamos criar o seu roteiro perfeito.
            </p>
            <button 
              onClick={onStartOnboarding}
              className="w-full bg-sa-gold text-sa-black font-black py-5 rounded-[20px] hover:bg-sa-gold/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(255,184,28,0.3)] text-xs sm:text-sm uppercase tracking-widest"
            >
              RESPONDER QUESTIONÁRIO AGORA
            </button>
          </div>
        </div>

        {/* Right Panel: Existing Client / Login */}
        <div className="flex-1 flex flex-col bg-black/30 backdrop-blur-2xl rounded-[40px] border border-white/10 p-8 sm:p-12 animate-in fade-in slide-in-from-right-8 duration-1000 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex-1 flex flex-col">
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight mb-10 text-center">
              Ou já é cliente?<br/>Acesse seu roteiro
            </h3>

            <form onSubmit={(e) => handleLogin(e)} className="space-y-6">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">Nome de Usuário</label>
                <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-4 focus-within:bg-black/60 focus-within:border-emerald-500/50 transition-all backdrop-blur-md group">
                  <User className="w-5 h-5 text-white/30 mr-4 group-focus-within:text-emerald-400 transition-colors" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setShowQuickAccess(true)}
                    onBlur={() => setTimeout(() => setShowQuickAccess(false), 200)}
                    placeholder="Seu nome completo"
                    className="bg-transparent outline-none flex-1 font-medium text-white placeholder:text-white/20 text-sm sm:text-base"
                    disabled={loading}
                  />
                </div>

                {/* Quick Access Dropdown Re-styled */}
                {showQuickAccess && (
                  <div className="absolute z-50 w-full mt-2 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                    {QUICK_ACCESS.map((profile) => (
                      <button
                        key={profile.name}
                        type="button"
                        onClick={() => handleLogin(undefined, profile)}
                        className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-4 text-white"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black shadow-lg ${profile.role === 'agent' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                          {profile.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{profile.name}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">{profile.role === 'agent' ? 'Agente de Turismo' : 'Cliente Premium'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">Senha</label>
                <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-4 focus-within:bg-black/60 focus-within:border-emerald-500/50 transition-all backdrop-blur-md group">
                  <Lock className="w-5 h-5 text-white/30 mr-4 group-focus-within:text-emerald-400 transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="bg-transparent outline-none flex-1 font-medium text-white placeholder:text-white/20 text-sm sm:text-base"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="text-white text-xs font-bold text-center bg-red-500/20 p-4 rounded-2xl border border-red-500/30 backdrop-blur-md animate-in shake duration-500">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 text-white font-black py-5 rounded-[20px] hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 mt-4 text-xs sm:text-sm uppercase tracking-[0.2em] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {(name.toLowerCase() === 'agente de viagem' || name === '1234') ? 'ACESSAR PAINEL ADMIN' : 'ACESSAR ROTEIRO'}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Footer Labeling */}
      <div className="relative z-10 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <p className="text-[9px] sm:text-[10px] text-white font-bold uppercase tracking-[0.5em] drop-shadow-lg">Agente Online de Turismo</p>
        <div className="w-8 h-[1px] bg-white/20"></div>
        <p className="text-[9px] sm:text-[10px] text-white/80 font-medium uppercase tracking-[0.4em]">Responsável: André Brito</p>
      </div>
    </div>

  );
};

export default Login;
