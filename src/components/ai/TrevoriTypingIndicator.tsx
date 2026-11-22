import React from 'react';
import { Sparkles } from 'lucide-react';

export const TrevoriTypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 my-3 animate-fadeIn">
      {/* Trevori Stylist Avatar */}
      <div className="w-8 h-8 rounded-full bg-[#0A172D] text-white flex items-center justify-center shrink-0 shadow-sm border border-[#1E3A66]/30">
        <Sparkles className="w-4 h-4 text-[#3B82F6] animate-pulse" />
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center gap-3">
        <span className="text-[12px] font-sans font-medium text-slate-500 tracking-wide">
          Curating recommendations
        </span>
        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" />
        </div>
      </div>
    </div>
  );
};
