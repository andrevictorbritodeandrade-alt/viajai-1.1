import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { MENU_ITEMS } from '../constants';

interface CategoryHeaderProps {
  title: string;
  onBack: () => void;
  bgImage?: string;
  id?: string;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ title, onBack, bgImage, id }) => {
  const hashId = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
  const actualId = id || hashId;
  
  // If id is provided, we can look up exactly. Otherwise we try to match by title.
  const menuItem = actualId 
    ? MENU_ITEMS.find(i => i.id === actualId) 
    : MENU_ITEMS.find(i => i.title.toLowerCase() === title.toLowerCase() || title.toLowerCase().includes(i.title.toLowerCase()));

  const finalTitle = menuItem?.title || title;
  const finalBgImage = bgImage || menuItem?.bgImage;
  const category = menuItem?.category || 'Geral';

  return (
    <div className="rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden transition-all duration-500 flex flex-col justify-end min-h-[180px]">
        {finalBgImage && (
           <img src={finalBgImage} className="absolute inset-0 w-full h-full object-cover" alt={finalTitle} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent"></div>
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
             <button onClick={onBack} type="button" className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-colors pointer-events-auto">
                <ArrowLeft className="w-5 h-5" />
             </button>
             <span className="text-[9px] font-black bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full uppercase tracking-widest border border-white/15">
              {category}
            </span>
          </div>
          
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black uppercase leading-none mb-1 tracking-tight">
              {finalTitle}
            </h2>
          </div>
        </div>
    </div>
  );
};

export default CategoryHeader;
