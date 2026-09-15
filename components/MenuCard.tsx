import React from 'react';
import { MenuItem } from '../types';

import iconMercado from '../src/assets/images/icon_mercado_3d_1785444350720.jpg';
import iconChecklist from '../src/assets/images/icon_checklist_3d_1785444360016.jpg';
import iconWallet from '../src/assets/images/icon_wallet_3d_1785444369774.jpg';
import iconReceipt from '../src/assets/images/icon_receipt_3d_1785444381361.jpg';
import iconUber from '../src/assets/images/icon_uber_3d_1785444395262.jpg';
import iconHotel from '../src/assets/images/icon_hotel_3d_1785444405508.jpg';
import iconContract from '../src/assets/images/icon_contract_3d_1785444413986.jpg';
import iconGas from '../src/assets/images/icon_gas_3d_1785444423572.jpg';
import iconKeyFob from '../src/assets/images/icon_keyfob_3d_1785444466379.jpg';
import iconBus from '../src/assets/images/icon_bus_3d_1785444436637.jpg';
import iconPlane from '../src/assets/images/icon_plane_3d_1785444447274.jpg';
import iconCompass from '../src/assets/images/icon_compass_3d_1785444456504.jpg';
import iconCambio from '../src/assets/images/icon_cambio_3d_1785444480066.jpg';
import iconTradutor from '../src/assets/images/icon_tradutor_3d_1785444488508.jpg';
import iconVacinas from '../src/assets/images/icon_vacinas_3d_1785444497807.jpg';
import iconAi from '../src/assets/images/icon_ai_3d_1785444507445.jpg';

interface MenuCardProps extends MenuItem {
  onClick: () => void;
  badge?: number | string;
  variant3d?: 'keyfob' | 'gaspump' | 'default';
}

const ICON_MAP_3D: Record<string, string> = {
  clima_localizacao: iconKeyFob,
  mercado: iconMercado,
  checklist: iconChecklist,
  financeiro: iconWallet,
  gastos: iconReceipt,
  uber_bolt: iconUber,
  hospedagem: iconHotel,
  reservas: iconContract,
  abastecimento: iconGas,
  onibus: iconBus,
  voos: iconPlane,
  guias: iconCompass,
  melhores_destinos: iconCompass,
  cambio: iconCambio,
  tradutor: iconTradutor,
  vacinas: iconVacinas,
  ia_assistant: iconAi,
};

const IOS_GRADIENTS: Record<string, string> = {
  checklist: 'from-blue-500 to-indigo-600',
  financeiro: 'from-emerald-500 to-teal-700',
  gastos: 'from-rose-500 to-red-600',
  cambio: 'from-emerald-600 to-green-700',
  mercado: 'from-amber-400 to-orange-500',
  voos: 'from-sky-400 to-blue-600',
  hospedagem: 'from-purple-500 to-indigo-700',
  reservas: 'from-cyan-500 to-blue-600',
  uber_bolt: 'from-slate-800 to-slate-950',
  onibus: 'from-blue-600 to-cyan-600',
  abastecimento: 'from-amber-500 to-orange-600',
  guias: 'from-emerald-600 to-teal-800',
  melhores_destinos: 'from-teal-500 to-indigo-600',
  tradutor: 'from-indigo-500 to-purple-600',
  vacinas: 'from-red-500 to-rose-600',
  ia_assistant: 'from-purple-600 via-pink-500 to-amber-500',
  clima_localizacao: 'from-sky-400 via-blue-500 to-indigo-600',
};

const MenuCard: React.FC<MenuCardProps> = ({ 
  id,
  title, 
  icon, 
  onClick,
  bgImage,
  badge,
  variant3d = 'default'
}) => {
  let icon3d = ICON_MAP_3D[id];
  if (id === 'abastecimento' && variant3d === 'keyfob') {
    icon3d = iconKeyFob;
  }
  const gradient = IOS_GRADIENTS[id] || 'from-emerald-500 to-teal-700';

  return (
    <button
      onClick={() => {
        console.log(`MenuCard clicked: ${title}`);
        onClick();
      }}
      type="button"
      className="group flex flex-col items-center justify-start select-none cursor-pointer focus:outline-none pointer-events-auto py-1"
    >
      {/* iPhone iOS Squircle App Icon Container */}
      <div className="relative w-[84px] h-[84px] sm:w-[100px] sm:h-[100px] rounded-[26px] sm:rounded-[32px] bg-gradient-to-br from-white/95 to-slate-100/80 dark:from-slate-800 dark:to-slate-900 shadow-[0_10px_25px_rgba(0,0,0,0.12)] border border-slate-200/40 dark:border-slate-800/20 overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:shadow-[0_14px_32px_rgba(0,0,0,0.2)] group-active:scale-95 group-active:opacity-90">
        
        {/* Red notification badge (like "3" on Checklist) */}
        {(badge || id === 'checklist') && (
          <div className="absolute top-1 right-1 z-30 bg-red-500 text-white font-black text-[11px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
            {badge || 3}
          </div>
        )}

        {/* 3D Skeuomorphic Ultra-Realistic Icon Image */}
        {icon3d ? (
          <img 
            src={icon3d} 
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-[1.14] rounded-[26px] sm:rounded-[32px] transform transition-transform duration-300 group-hover:scale-[1.20]"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
            {bgImage && (
              <img 
                src={bgImage} 
                alt={title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-500"
              />
            )}
            <div className="relative z-10 drop-shadow-md transition-transform duration-200 group-hover:scale-110">
              {React.cloneElement(icon as React.ReactElement, { className: "w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-sm" })}
            </div>
          </div>
        )}

        {/* iOS Glossy Top Reflection */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none rounded-t-[26px] sm:rounded-t-[32px]" />
      </div>

      {/* App Title Label Below Icon */}
      <span className="mt-2 text-[13px] sm:text-[14px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 text-center line-clamp-2 leading-tight max-w-[94px] sm:max-w-[110px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </span>
    </button>
  );
};

export default MenuCard;
