
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

  // Listen for session changes
  useEffect(() => {
    const handleSessionChange = () => {
      const u = getSessionUser();
      setUser(u);
    };
    window.addEventListener('session-change', handleSessionChange);
    return () => window.removeEventListener('session-change', handleSessionChange);
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
      
      {role === 'guest' && <Login onLoginSuccess={(r) => setRole(r)} onStartOnboarding={() => setRole('onboarding')} />}
      
      {role === 'onboarding' && <ViajaAiForm onBack={() => setRole('guest')} />}
      
      {role === 'agent' && <AdminDashboard />}
      
      {role === 'client' && <ClientApp />}
    </>
  );
};

export default App;
