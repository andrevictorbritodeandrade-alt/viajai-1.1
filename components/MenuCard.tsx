
import React from 'react';
import { MenuItem } from '../types';

interface MenuCardProps extends MenuItem {
  onClick: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ 
  title, 
  icon, 
  bgColor,
  onClick,
  description,
  bgImage
}) => {
  return (
    <button
      onClick={() => {
        console.log(`MenuCard clicked: ${title}`);
        onClick();
      }}
      type="button"
      className="group relative z-10 w-full h-[120px] sm:h-[150px] md:h-[165px] rounded-[18px] sm:rounded-[24px] shadow-lg transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] border border-white/10 overflow-hidden flex flex-col justify-end text-left select-none bg-slate-900 cursor-pointer pointer-events-auto"
    >
      {/* Dynamic scenic and illustrative background */}
      {bgImage ? (
        <img 
          src={bgImage} 
          alt={title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1000ms] ease-out"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: bgColor }} />
      )}

      {/* Shadow gradient overlays for flawless text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 group-hover:via-black/55 transition-colors duration-300"></div>

      {/* Compact floating frosted icon bubble on top-left of card */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-white/15 backdrop-blur-md p-1.5 rounded-lg sm:rounded-xl border border-white/20 shadow-lg group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300 shrink-0">
        {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-md" })}
      </div>

      {/* Beautiful bottom details capsule with rounded design and frosted slate glass appearance */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-2 sm:left-2 sm:right-2 p-1.5 sm:p-2.5 rounded-[12px] sm:rounded-[16px] bg-slate-950/50 backdrop-blur-md border border-white/10 flex flex-col gap-0.5 group-hover:bg-slate-950/70 transition-all duration-300">
        <span className="text-white text-[8px] sm:text-[10px] font-display font-black tracking-widest uppercase leading-tight drop-shadow-sm truncate">
          {title}
        </span>
        {description && (
          <span className="text-[7.5px] sm:text-[9px] leading-tight text-white/70 font-sans font-medium line-clamp-1 sm:line-clamp-2 select-none group-hover:text-white/80 transition-colors">
            {description}
          </span>
        )}
      </div>
    </button>
  );
};

export default MenuCard;
