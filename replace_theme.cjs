const fs = require('fs');
let code = fs.readFileSync('./components/ItineraryVisualOverview.tsx', 'utf8');

// Container
code = code.replace(/bg-\[#0b0f19\] border border-slate-800 rounded-\[32px\] p-6 text-white shadow-2xl/g, 'bg-white border-4 border-slate-100 rounded-[32px] p-6 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.08)]');

// Header
code = code.replace(/border-slate-800\/60/g, 'border-slate-100');
code = code.replace(/text-emerald-400/g, 'text-emerald-600');
code = code.replace(/text-white/g, 'text-slate-900');
code = code.replace(/bg-\[#15233c\]/g, 'bg-blue-100');
code = code.replace(/text-\[#5582f3\]/g, 'text-blue-700');
code = code.replace(/text-slate-400/g, 'text-slate-500');

// Passagem Praticada Box
code = code.replace(/bg-\[#111827\] border border-slate-800/g, 'bg-slate-50 border border-slate-200');
code = code.replace(/text-slate-500/g, 'text-slate-500');
code = code.replace(/text-\[#00c58e\]/g, 'text-emerald-600');
code = code.replace(/text-\[#10b981\]/g, 'text-emerald-600');
code = code.replace(/bg-\[#10b981\]\/15 border-\[#10b981\]\/15/g, 'bg-emerald-100 border-emerald-200');

// Timeline Segments & Toggles
code = code.replace(/bg-\[#090d16\] border border-slate-900/g, 'bg-slate-100 border border-slate-200');
code = code.replace(/bg-\[#090d16\] border border-slate-800/g, 'bg-white border border-slate-200 shadow-sm');
code = code.replace(/bg-[#090d16]/g, 'bg-slate-100');
code = code.replace(/border-slate-700/g, 'border-slate-200');
code = code.replace(/text-slate-300/g, 'text-slate-600');
code = code.replace(/bg-\[#00c58e\] text-black border-\[#00c58e\] shadow-\[0_0_15px_rgba\(0,197,142,0\.2\)\]/g, 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/30');

// Timeline List
code = code.replace(/bg-[#111827] rounded-\[24px\] border border-slate-800/g, 'bg-white rounded-[24px] border border-slate-200 shadow-sm');
code = code.replace(/bg-black text-white border-slate-850/g, 'bg-slate-100 text-slate-800 border-slate-300');
code = code.replace(/border-[#111827]/g, 'border-white');
code = code.replace(/bg-black\/20 border-white\/5/g, 'bg-slate-50 border-slate-200');
code = code.replace(/border-white\/5/g, 'border-slate-200');
code = code.replace(/border-white\/10/g, 'border-slate-300');
code = code.replace(/bg-slate-800/g, 'bg-slate-200'); // small flight number badge
code = code.replace(/text-purple-400/g, 'text-purple-600');
code = code.replace(/text-amber-400/g, 'text-amber-600');
code = code.replace(/text-blue-400/g, 'text-blue-600');
code = code.replace(/bg-emerald-400\/10/g, 'bg-emerald-100');
code = code.replace(/text-emerald-300/g, 'text-emerald-700');
code = code.replace(/bg-amber-400\/10/g, 'bg-amber-100');
code = code.replace(/text-amber-300/g, 'text-amber-700');
code = code.replace(/bg-slate-900\/50/g, 'bg-slate-100');
code = code.replace(/border-emerald-500\/30/g, 'border-emerald-300');
code = code.replace(/bg-slate-950/g, 'bg-white'); // Dots and Baggage icons
code = code.replace(/border-slate-850/g, 'border-slate-200');
code = code.replace(/text-slate-200/g, 'text-slate-800');

// Baggage box
code = code.replace(/border-slate-800\/80/g, 'border-slate-200');
code = code.replace(/bg-rose-500\/15 border-rose-500\/20/g, 'bg-rose-100 border-rose-200');

fs.writeFileSync('./components/ItineraryVisualOverview.tsx', code);
