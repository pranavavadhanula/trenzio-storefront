import React, { useState } from 'react';
import { TrevoriAIChat } from './TrevoriAIChat';
import { X, Minimize2, Maximize2, MessageSquare } from 'lucide-react';

export const TrevoriAIWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none font-sans">
      {/* Floating Chat Button: Minimalist Luxury in Black with Taupe Accent */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleOpen}
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#171717] hover:bg-[#333333] text-white shadow-xl border border-[#DDD8CE] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
          aria-label="Open Trevori Concierge"
        >
          <MessageSquare className="w-5 h-5 text-white group-hover:text-[#B9AA96] transition-colors" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#B9AA96] ring-2 ring-[#171717]" />
        </button>
      )}

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div
          className={`fixed transition-all duration-300 z-50 flex flex-col bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#DDD8CE] overflow-hidden ${
            isExpanded
              ? 'inset-2 sm:inset-6 md:inset-12'
              : 'bottom-2 inset-x-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px] md:w-[460px] h-[82vh] sm:h-[620px] max-h-[92vh]'
          }`}
        >
          {/* Header Bar */}
          <div className="px-4 py-3.5 bg-[#171717] text-[#F4F1EA] flex items-center justify-between border-b border-[#DDD8CE]/30">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif text-sm tracking-wider uppercase text-white">
                  TREVORI CONCIERGE
                </h3>
                <span className="px-1.5 py-0.2 bg-[#B9AA96] text-[#171717] text-[8px] font-semibold tracking-wider uppercase">
                  AI STYLIST
                </span>
              </div>
              <p className="text-[10px] text-[#DDD8CE]/80 font-light">
                Tailoring & Silhouette Advisor &bull; 24/7
              </p>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-[#DDD8CE] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isExpanded ? 'Restore window size' : 'Expand window'}
              >
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#DDD8CE] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close chat window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Interface Body */}
          <div className="flex-1 overflow-hidden bg-[#F4F1EA]">
            <TrevoriAIChat />
          </div>
        </div>
      )}
    </div>
  );
};
