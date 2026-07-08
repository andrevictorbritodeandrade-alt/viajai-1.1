import React from 'react';

// --- TYPES & INTERFACES ---
interface TripCaricatureProps {
  name: string;
  id?: string;
  size?: 'large' | 'medium' | 'small';
}

/**
 * Normalizes destination names to match key identifiers without accent issues.
 */
const normalizeDestination = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9 ]/g, "")      // keep only alphanumeric and spaces
    .trim();
};

export const TripCaricature: React.FC<TripCaricatureProps> = ({ name, id, size = 'medium' }) => {
  const normName = normalizeDestination(name || "");

  // Match the visual content based on the destination name
  let svgContent = null;
  let bgGradient = "from-sky-400 to-sky-300"; // Default cheery sky gradient
  let customImageUrl = "";

  // 1. PORTO SEGURO (Beach + Caravela)
  if (normName.includes("porto seguro") || normName.includes("beaches")) {
    bgGradient = "from-sky-950 via-slate-900 to-sky-950";
    customImageUrl = "/porto_seguro_premium.png";
  }

  // 2. SÃO PAULO + SALVADOR + ARACAJÚ (+ CATAIS) (MASP, Bonfim facade, Lighthouse, Big Crab)
  else if (
    (normName.includes("sao paulo") || normName.includes("sp")) &&
    normName.includes("salvador") &&
    normName.includes("aracaju")
  ) {
    bgGradient = "from-slate-950 via-slate-900 to-slate-950";
    customImageUrl = "/sp_ssa_aju_premium.png";
  }

  // 2.5 SALVADOR (Férias de Julho)
  else if (normName.includes("salvador") && !normName.includes("aracaju")) {
    bgGradient = "from-slate-950 via-slate-900 to-slate-950";
    customImageUrl = "/salvador_premium.jpg";
  }

  // 3. SALVADOR + ARACAJÚ (Pelourinho colonial houses, Barra Lighthouse, Big Crab on beach)
  else if (normName.includes("salvador") && normName.includes("aracaju")) {
    bgGradient = "from-slate-950 via-slate-900 to-slate-950";
    customImageUrl = "/ssa_aju_premium.png";
  }

  // 4. ÁFRICA DO SUL (Serengeti Savanna Sunset + Safari animals + Table Mountain & Penguin)
  else if (normName.includes("africa")) {
    bgGradient = "from-slate-950 via-slate-900 to-slate-950";
    customImageUrl = "/africa_premium.png";
  }

  // 5. BUENOS AIRES + ASSUNÇÃO + FOZ DO IGUAÇU (Waterfalls, Obelisco & Palacio de los López)
  else if (
    (normName.includes("foz") || normName.includes("iguacu")) &&
    normName.includes("assuncao") &&
    normName.includes("buenos")
  ) {
    bgGradient = "from-slate-950 via-slate-900 to-slate-950";
    customImageUrl = "/ba_ass_foz_premium.png";
  }

  // 6. FOZ DO IGUAÇU + BUENOS AIRES + PATAGÔNIA (Waterfalls, Obelisco, Mount Fitz Roy & Glacier)
  else if (
    (normName.includes("foz") || normName.includes("iguacu")) &&
    normName.includes("buenos") &&
    normName.includes("patagonia")
  ) {
    bgGradient = "from-slate-950 via-slate-900 to-slate-950";
    customImageUrl = "/foz_ba_patagonia_premium.png";
  }

  // 7. FOZ DO IGUAÇU + BUENOS AIRES (Waterfalls + Obelisco + Tango Dancer)
  else if (
    (normName.includes("foz") || normName.includes("iguacu")) &&
    (normName.includes("buenos") || normName.includes("aires") || normName.includes("ba"))
  ) {
    bgGradient = "from-slate-950 via-slate-900 to-slate-950";
    customImageUrl = "/foz_ba_premium.jpg";
  }

  // 8. FOZ DO IGUAÇU (Lush jungle canopy + Cascade waterfalls)
  else if (normName.includes("foz") || normName.includes("iguacu") || normName.includes("cataratas")) {
    bgGradient = "from-slate-950 via-slate-900 to-slate-950";
    customImageUrl = "/foz_premium.png";
  }

  // 9. COLÔMBIA (Colonial Cartagena yellow wall, pink floral balcony, coffee beans)
  else if (normName.includes("colombia") || normName.includes("san andres")) {
    bgGradient = "from-slate-950 via-slate-900 to-slate-950";
    customImageUrl = "/colombia_premium.jpg";
  }

  // 10. PERU (Machu Picchu green ridges + Terraces + Super Cute Llama with collar)
  else if (normName.includes("peru")) {
    bgGradient = "from-slate-950 via-slate-900 to-slate-950";
    customImageUrl = "/peru_premium.png";
  }

  // 11. GENERAL WORLD EXPLORER CHEERFUL FALLBACK (For any other custom destination added)
  else {
    const title = name.charAt(0).toUpperCase() + name.slice(1);
    bgGradient = "from-[#60a5fa] via-[#38bdf8] to-[#34d399]"; // Glorious bright blue & green world theme
    svgContent = (
      <svg viewBox="0 0 200 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Smiling golden sun */}
        <circle cx="160" cy="38" r="18" fill="#facc15" opacity="0.3" />
        <circle cx="160" cy="38" r="12" fill="#facc15" />
        {/* Soft fluffy clouds */}
        <path d="M 20 40 Q 30 30 40 40 Q 50 30 60 40" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.8" />

        {/* Large high-contrast blue Globe in center */}
        <g transform="translate(100, 75)">
          {/* Outer circle glow */}
          <circle cx="0" cy="0" r="34" fill="#06b6d4" opacity="0.2" />
          {/* Ocean */}
          <circle cx="0" cy="0" r="30" fill="#38bdf8" stroke="#1e3a8a" strokeWidth="2.2" />
          
          {/* Green cartoon continent shapes */}
          {/* Americas */}
          <path d="M -22 -15 Q -14 -18 -8 -10 Q -4 -12 -8 -2 Q -12 12 -16 18 Q -22 18 -20 2 Q -22 -8 -22 -15" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
          {/* Africa / Europe */}
          <path d="M 3 -8 Q 12 -18 20 -14 Q 25 -2 22 12 Q 10 24 5 18 Q 0 8 3 -8" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
        </g>

        {/* Origami Paper Airplane soaring across the sky tracing dotted red line */}
        <path d="M 25 105 Q 100 20 175 92" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5,4" />
        <g transform="translate(112, 38) rotate(16)">
          {/* Cute origami body */}
          <polygon points="0,0 -12,-5 -15,5 -2,-1" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.5" />
          <polygon points="0,0 -15,5 -9,9" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
        </g>

        {/* Rolling Green Hills at bottom */}
        <path d="M -10 125 Q 100 115 210 125 L 210 155 L -10 155 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />

        {/* GIANT RED LOCATION PIN in bottom-left */}
        <g transform="translate(42, 102)" className="animate-pulse">
          {/* Pin shape */}
          <path d="M 0 0 C -8 -8 -10 -15 -10 -22 C -10 -30 -4 -34 0 -34 C 4 -34 10 -30 10 -22 C 10 -15 8 -8 0 0 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
          {/* Inner white circle */}
          <circle cx="0" cy="-22" r="4.5" fill="#ffffff" />
        </g>

        {/* Beautiful high quality text banner inside the SVG showing the name */}
        <rect x="75" y="123" width="75" height="16" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        <text x="112" y="133" fill="#34d399" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="0.8">
          EXPLORAR OK
        </text>
      </svg>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 select-none">
      {/* Visual canvas holding our hand-drawn SVG scene or the premium custom image */}
      <div className={`relative h-full w-full bg-gradient-to-b ${bgGradient} flex flex-col items-center justify-center overflow-hidden transition-all duration-[800ms] hover:brightness-105`}>
        {customImageUrl ? (
          <img 
            src={customImageUrl} 
            alt={name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
          />
        ) : (
          <>
            {/* Glow ambient layer */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Scaled vector graphic */}
            <div className="w-full h-full flex items-center justify-center p-0">
              {svgContent}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
