
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ArrowRight, 
  LogOut, 
  Briefcase, 
  Settings,
  Eye,
  EyeOff,
  CheckCircle2,
  Smartphone,
  ArrowLeft,
  Search,
  Plus,
  Calendar,
  UserPlus,
  Trash2,
  Save,
  Loader2,
  Lock,
  Phone,
  Sparkles,
  MapPin
} from 'lucide-react';
import { logout } from '../services/session';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';

interface Client {
  id: string;
  name: string;
  password: string;
  role: 'client' | 'agent';
}

interface Trip {
  id: string;
  userId: string;
  name: string;
  date: string;
  image?: string;
  isDomestic?: boolean;
}

interface Lead {
  id: string;
  nome_cliente: string;
  whatsapp: string;
  nome_destino: string;
  tipo_destino: string;
  companhia: string;
  createdAt: any;
  [key: string]: any;
}

const AdminDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [view, setView] = useState<'clients' | 'leads'>('clients');
  const [loading, setLoading] = useState(true);
  
  // Form states for new client
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPass, setNewClientPass] = useState('');

  // Form states for new trip
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [newTripDate, setNewTripDate] = useState('');
  const [newTripIsDomestic, setNewTripIsDomestic] = useState(false);

  useEffect(() => {
    // Listen to clients
    const qClients = query(collection(db, 'users'), where('role', '==', 'client'));
    const unsubClients = onSnapshot(qClients, (snapshot) => {
      const clientList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
      setClients(clientList);
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));

    // Listen to all trips (agent view)
    const unsubTrips = onSnapshot(collection(db, 'trips'), (snapshot) => {
      const tripList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip));
      setTrips(tripList);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'trips'));

    // Listen to leads
    const qLeads = query(collection(db, 'leads'));
    const unsubLeads = onSnapshot(qLeads, (snapshot) => {
      const leadList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
      // Sort by date descending
      leadList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setLeads(leadList);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'leads'));

    return () => {
      unsubClients();
      unsubTrips();
      unsubLeads();
    };
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPass) return;

    try {
      await addDoc(collection(db, 'users'), {
        name: newClientName,
        password: newClientPass,
        role: 'client',
        createdAt: serverTimestamp()
      });
      setIsAddingClient(false);
      setNewClientName('');
      setNewClientPass('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'users');
    }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newTripName || !newTripDate) return;

    const targetUserId = (selectedClient.name === 'André Brito' || selectedClient.name === 'Marcelly Bispo')
      ? 'shared_andre_marcelly'
      : selectedClient.id;

    try {
      await addDoc(collection(db, 'trips'), {
        userId: targetUserId,
        name: newTripName,
        date: newTripDate,
        isDomestic: newTripIsDomestic,
        createdAt: serverTimestamp(),
        // Default images based on common destinations or placeholders
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop'
      });
      setIsAddingTrip(false);
      setNewTripName('');
      setNewTripDate('');
      setNewTripIsDomestic(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'trips');
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente e todos os seus roteiros?')) return;
    try {
      // Delete client
      await deleteDoc(doc(db, 'users', clientId));
      // Ideally delete associated trips too (batch or cloud function)
      const q = query(collection(db, 'trips'), where('userId', '==', clientId));
      const tripSnap = await getDocs(q);
      tripSnap.forEach(async (tDoc) => {
        await deleteDoc(doc(db, 'trips', tDoc.id));
      });
      if (selectedClient?.id === clientId) setSelectedClient(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'users/trips');
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Excluir este roteiro?')) return;
    try {
      await deleteDoc(doc(db, 'trips', tripId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'trips');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Excluir esta resposta de cliente em potencial?')) return;
    try {
      await deleteDoc(doc(db, 'leads', leadId));
      if (selectedLead?.id === leadId) setSelectedLead(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'leads');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <header className="bg-gradient-to-b from-emerald-800 to-slate-900 pb-12 p-6 rounded-b-[40px] shadow-2xl relative overflow-hidden">
         <div className="relative z-10 max-w-lg mx-auto">
            <div className="flex justify-between items-start mb-8">
               <div className="flex items-center gap-4">
                  {(selectedClient || selectedLead) ? (
                    <button 
                      onClick={() => { setSelectedClient(null); setSelectedLead(null); }}
                      className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-lg"
                    >
                       <ArrowLeft className="w-6 h-6" />
                    </button>
                  ) : (
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                       <Briefcase className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                     <h1 className="font-display font-black text-xl text-white leading-none mb-1">
                        {selectedClient ? 'Gerenciar Cliente' : selectedLead ? 'Resposta de Potencial Cliente' : 'Painel do Agente'}
                     </h1>
                     <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                       {selectedLead ? 'Lead Qualificado' : 'Controle de Roteiros'}
                     </p>
                  </div>
               </div>
               <button onClick={logout} className="p-2 bg-white/5 rounded-xl text-white/50 hover:text-white transition-colors">
                  <LogOut className="w-5 h-5" />
               </button>
            </div>

            {/* View Switcher */}
            {!selectedClient && !selectedLead && (
              <div className="flex bg-black/20 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
                <button 
                  onClick={() => setView('clients')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${view === 'clients' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  <Users size={14} /> Clientes
                </button>
                <button 
                  onClick={() => setView('leads')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${view === 'leads' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  <Sparkles size={14} /> Leads ({leads.length})
                </button>
              </div>
            )}
         </div>
      </header>

      <main className="max-w-lg mx-auto px-4 -mt-6 relative z-20 pb-20">
         {loading ? (
           <div className="flex justify-center py-20">
             <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
           </div>
         ) : (!selectedClient && !selectedLead) ? (
           <div className="space-y-4">
              {view === 'clients' ? (
                <>
                  <button 
                    onClick={() => setIsAddingClient(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-5 rounded-3xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95"
                  >
                    <UserPlus className="w-6 h-6" />
                    <span className="font-black text-sm uppercase tracking-widest">Novo Cliente</span>
                  </button>

                  <div className="grid gap-3">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Clientes Ativos ({clients.length})</h3>
                    {clients.map((client) => (
                      <div 
                        key={client.id}
                        className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center justify-between group hover:border-emerald-500/50 transition-all"
                      >
                        <button 
                          onClick={() => setSelectedClient(client)}
                          className="flex-1 text-left"
                        >
                          <h3 className="font-display font-black text-white text-lg leading-tight">{client.name}</h3>
                        </button>
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-800 px-3 py-1 rounded-full text-[10px] font-black text-emerald-400 border border-slate-700">
                            {selectedClient && trips.filter(t => {
                              const targetId = (client.name === 'André Brito' || client.name === 'Marcelly Bispo')
                                ? 'shared_andre_marcelly'
                                : client.id;
                              return t.userId === targetId;
                            }).length} TRIPs
                          </div>
                          <button 
                            onClick={() => handleDeleteClient(client.id)}
                            className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="grid gap-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Respostas do App (VIAJAÍ)</h3>
                  {leads.map((lead) => (
                    <div 
                      key={lead.id}
                      className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center justify-between group hover:border-orange-500/50 transition-all"
                    >
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="flex-1 text-left"
                      >
                        <h3 className="font-display font-black text-white text-lg leading-tight">{lead.nome_cliente}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                          <MapPin size={10} className="text-orange-500" /> {lead.nome_destino} ({lead.tipo_destino})
                        </p>
                      </button>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {leads.length === 0 && (
                    <div className="text-center py-20 bg-slate-900 rounded-[32px] border border-dashed border-slate-800">
                      <Sparkles className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Nenhum potencial cliente ainda</p>
                    </div>
                  )}
                </div>
              )}
           </div>
         ) : selectedLead ? (
           <div className="space-y-6">
              <div className="bg-white text-slate-900 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Sparkles className="w-32 h-32 text-orange-500" />
                </div>
                
                <h2 className="text-2xl font-display font-black mb-1">{selectedLead.nome_cliente}</h2>
                <div className="flex gap-4 text-[10px] font-black text-orange-600 uppercase tracking-widest mb-8">
                  <span className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                    <Phone className="w-3 h-3" /> {selectedLead.whatsapp}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Perfil da Viagem</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Destino</p>
                        <p className="text-sm font-black">{selectedLead.nome_destino}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Companhia</p>
                        <p className="text-sm font-black capitalize">{selectedLead.companhia}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Datas</p>
                        <p className="text-sm font-black">{selectedLead.tipo_data === 'especifica' ? `${selectedLead.data_ida} a ${selectedLead.data_volta}` : `${selectedLead.mes_viagem} (${selectedLead.periodo_viagem})`}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Transporte</p>
                        <p className="text-sm font-black capitalize">{selectedLead.transporte_principal}</p>
                      </div>
                    </div>
                  </div>

                  {selectedLead.estilo_viagem && (
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Preferências</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedLead.estilo_viagem).filter(([_, v]) => v).map(([k]) => (
                          <span key={k} className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-100">
                     <button 
                       onClick={() => window.open(`https://wa.me/55${selectedLead.whatsapp.replace(/\D/g, '')}`, '_blank')}
                       className="w-full bg-emerald-600 text-white p-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                     >
                       <Phone size={20} /> Entrar em Contato
                     </button>
                  </div>
                </div>
              </div>
           </div>
         ) : (
           <div className="space-y-6">
              {/* Client Details Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Users className="w-24 h-24" />
                 </div>
                 
                 <div className="relative z-10">
                    <h2 className="text-2xl font-display font-black text-white mb-1">{selectedClient?.name}</h2>
                    <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
                      <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> {selectedClient?.password}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 border-t border-slate-800 pt-6">
                       <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Roteiros Ativos</h3>
                       <button 
                         onClick={() => setIsAddingTrip(true)}
                         className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2"
                       >
                          <Plus className="w-4 h-4" /> Novo Roteiro
                       </button>
                    </div>

                    <div className="space-y-3">
                       {trips.filter(t => {
                         const targetId = (selectedClient?.name === 'André Brito' || selectedClient?.name === 'Marcelly Bispo')
                           ? 'shared_andre_marcelly'
                           : selectedClient?.id;
                         return t.userId === targetId;
                       }).map(trip => (
                          <div key={trip.id} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                  <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                   <h4 className="font-bold text-white text-sm">{trip.name}</h4>
                                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{trip.date}</p>
                                </div>
                             </div>
                             <button 
                               onClick={() => handleDeleteTrip(trip.id)}
                               className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       ))}
                       {selectedClient && trips.filter(t => t.userId === selectedClient.id).length === 0 && (
                         <div className="text-center py-10 opacity-20">
                           <Calendar className="w-12 h-12 mx-auto mb-2" />
                           <p className="text-xs font-bold uppercase tracking-widest">Nenhum roteiro criado</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
         )}
      </main>

      {/* Modal: Novo Cliente */}
      {isAddingClient && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-sm rounded-[32px] border border-slate-800 p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-display font-black text-white mb-6 uppercase tracking-tight">Cadastrar Cliente</h3>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                <input 
                  autoFocus
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all"
                  value={newClientName}
                  onChange={e => setNewClientName(e.target.value)}
                  placeholder="Ex: André Brito"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
                <input 
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all"
                  value={newClientPass}
                  onChange={e => setNewClientPass(e.target.value)}
                  placeholder="Ex: 1234"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddingClient(false)}
                  className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-900/20"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Novo Roteiro */}
      {isAddingTrip && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-sm rounded-[32px] border border-slate-800 p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-display font-black text-white mb-6 uppercase tracking-tight">Novo Roteiro</h3>
            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome do Destino</label>
                <input 
                  autoFocus
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all"
                  value={newTripName}
                  onChange={e => setNewTripName(e.target.value)}
                  placeholder="Ex: África do Sul"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Data da Viagem</label>
                <input 
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all"
                  value={newTripDate}
                  onChange={e => setNewTripDate(e.target.value)}
                  placeholder="Ex: Janeiro 2026"
                />
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                <input 
                  type="checkbox"
                  id="isDomestic"
                  className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                  checked={newTripIsDomestic}
                  onChange={e => setNewTripIsDomestic(e.target.checked)}
                />
                <label htmlFor="isDomestic" className="text-xs font-bold text-white uppercase tracking-wider cursor-pointer">
                  Viagem Nacional (Brasil)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddingTrip(false)}
                  className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-900/20"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
