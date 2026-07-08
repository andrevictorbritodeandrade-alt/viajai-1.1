
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ClientApp from './components/ClientApp';
import AdminDashboard from './components/AdminDashboard';
import ViajaAiForm from './components/ViajaAiForm';
import UpdatePrompt from './components/UpdatePrompt'; // Importa o prompt
import { getSessionUser, isAgent } from './services/session';
import './styles.css';

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(getSessionUser());
  const [role, setRole] = useState<'guest' | 'client' | 'agent' | 'onboarding'>('guest');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Listen for session changes
  useEffect(() => {
    const handleSessionChange = () => {
      const u = getSessionUser();
      setUser(u);
    };
    window.addEventListener('session-change', handleSessionChange);
    
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      const msgStr = String(message).toLowerCase();
      if (msgStr.includes('script error') || !source) {
        console.warn("[App] Ignored generic cross-origin or browser extension error:", message, source);
        return false;
      }
      setErrorMsg(`${message} at ${source}:${lineno}:${colno}`);
      if (originalOnError) return originalOnError(message, source, lineno, colno, error);
      return false;
    };

    return () => {
      window.removeEventListener('session-change', handleSessionChange);
      window.onerror = originalOnError;
    };
  }, []);

  // Determine role whenever user changes
  useEffect(() => {
    if (!user) {
      if (role !== 'onboarding') setRole('guest');
    } else if (isAgent(user)) {
      setRole('agent');
    } else {
      setRole('client');
    }
  }, [user]);

  return (
    <>
      <UpdatePrompt /> {/* Gerenciador de Atualizações PWA */}
      
      {errorMsg && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'red', color: 'white', padding: 20, zIndex: 99999 }}>
          <h3>Unhandled Error:</h3>
          <p>{errorMsg}</p>
        </div>
      )}

      {role === 'guest' && <Login onLoginSuccess={(r) => setRole(r)} onStartOnboarding={() => setRole('onboarding')} />}
      
      {role === 'onboarding' && <ViajaAiForm onBack={() => setRole('guest')} />}
      
      {role === 'agent' && <AdminDashboard />}
      
      {role === 'client' && <ClientApp />}
    </>
  );
};

export default App;
