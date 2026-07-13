import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { MENU_ITEMS } from '../constants';

interface CategoryHeaderProps {
  title: string;
  onBack: () => void;
  bgImage?: string;
  id?: string;
}

const getTripBgImage = (id: string) => {
  const images: Record<string, string> = {
    'am_ssa_aju': '/ssa_aju_premium.png',
    'am_sp_ssa_aju': '/sp_ssa_aju_premium.png',
    'am_africa_sul': '/africa_premium.png',
    'am_porto_seguro': '/porto_seguro_premium.png',
    'am_foz': '/foz_premium.png',
    'am_foz_ba': '/foz_ba_premium.png',
    'am_foz_ass_ba': '/ba_ass_foz_premium.png',
    'am_rio_foz_ba': '/foz_ba_premium.jpg',
    'am_salvador_julho': '/salvador_aracaju_maceio.jpg',
    'am_aracaju_planob': '/aracaju_capital_premium.png',
    'am_rio_san': '/colombia_premium.jpg',
    'am_bh_med_san': '/colombia_premium.png'
  };
  return images[id] || '/salvador_aracaju_maceio.jpg';
};

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ title, onBack, bgImage, id }) => {
  const hashId = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
  const actualId = id || hashId;
  
  // Try to find menuItem details
  const menuItem = actualId 
    ? MENU_ITEMS.find(i => i.id === actualId) 
    : MENU_ITEMS.find(i => i.title.toLowerCase() === title.toLowerCase() || title.toLowerCase().includes(i.title.toLowerCase()));

  const finalTitle = menuItem?.title || title;
  const category = menuItem?.category || 'Geral';

  // Get active trip details for the background image
  let tripId = '';
  try {
    const savedTripStr = localStorage.getItem('selected_trip');
    if (savedTripStr) {
      const savedTrip = JSON.parse(savedTripStr);
      if (savedTrip && savedTrip.id) {
        tripId = savedTrip.id;
      }
    }
  } catch (e) {
    console.error("Error loading selected trip inside CategoryHeader", e);
  }

  // Use the active trip background as requested!
  const finalBgImage = getTripBgImage(tripId);

  return (
    <div className="rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 text-white shadow-xl relative overflow-hidden transition-all duration-500 flex flex-col justify-end min-h-[140px] sm:min-h-[180px] md:min-h-[220px]">
        {finalBgImage && (
           <img 
             src={finalBgImage} 
             className="absolute inset-0 w-full h-full object-cover opacity-60" 
             alt={finalTitle} 
             referrerPolicy="no-referrer"
           />
        )}
        {/* Dark elegant gradients overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-black/30"></div>
        <div className="absolute inset-0 bg-[#0B0F19]/20"></div>
        
        <div className="relative z-10 space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
             <button 
               onClick={onBack} 
               type="button" 
               className="bg-white/20 backdrop-blur-md p-1.5 sm:p-2 rounded-full hover:bg-white/30 transition-all active:scale-90 pointer-events-auto cursor-pointer"
             >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
             </button>
             <span className="text-[8px] sm:text-[9px] font-black bg-white/10 backdrop-blur-md text-white/90 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-widest border border-white/10">
               {category}
             </span>
          </div>
          
          <div>
            <h2 className="text-lg sm:text-2xl font-display font-black uppercase leading-tight tracking-tight text-white drop-shadow">
              {finalTitle}
            </h2>
          </div>
        </div>
    </div>
  );
};

export default CategoryHeader;
