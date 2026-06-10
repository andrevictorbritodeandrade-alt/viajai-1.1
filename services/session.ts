
// Manages the current user session (ID/Phone)
let currentUserId: string | null = localStorage.getItem('viajai_user_id');

export const getSessionUser = () => localStorage.getItem('viajai_user_id');

export const setSessionUser = (id: string) => {
  currentUserId = id;
  localStorage.setItem('viajai_user_id', id);
  // Dispatch event to update components that depend on ID
  window.dispatchEvent(new Event('session-change'));
};

export const logout = () => {
  currentUserId = null;
  localStorage.removeItem('viajai_user_id');
  localStorage.removeItem('viajai_user_name');
  localStorage.removeItem('selected_trip');
  window.dispatchEvent(new Event('session-change'));
};

// Agent logic: 0000, admin, or 1234 are agents
export const isAgent = (phone: string) => phone === '0000' || phone === 'admin' || phone === '1234';
