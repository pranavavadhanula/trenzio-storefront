import React, { useState } from 'react';
import { TrevoriAIChat } from './TrevoriAIChat';
import { Sparkles, X, Minimize2, Maximize2, MessageSquare, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TrevoriAIWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none font-sans">
      {/* Normal Floating Chat Button without any name or text */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleOpen}
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#0A172D] hover:bg-[#122442] text-white shadow-[0_8px_25px_rgba(7,19,36,0.45)] border border-[#1E3A66] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
          aria-label="Open chat"
        >
          <MessageSquare className="w-6 h-6 text-white group-hover:text-[#F88379] transition-colors" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#F88379] ring-2 ring-[#0A172D]" />
        </button>
      )}

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div
          className={`fixed transition-all duration-300 z-50 flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(10,23,45,0.35)] border border-slate-200 overflow-hidden ${
            isExpanded
              ? 'inset-2 sm:inset-6 md:inset-12'
              : 'bottom-2 inset-x-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px] md:w-[460px] h-[82vh] sm:h-[620px] max-h-[92vh]'
          }`}
        >
          {/* Header Bar */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#0A172D] via-[#0F2444] to-[#1E3A66] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Sparkles className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-sans font-black text-xs tracking-wider uppercase text-white">
                    TREVORI AI
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#2563EB] text-[9px] font-mono font-bold">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-sans font-normal">
                  Personal Fashion Stylist &bull; 24/7
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <Link
                to="/ai-stylist"
                onClick={() => setIsOpen(false)}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-sans font-bold tracking-wider transition-colors mr-1 cursor-pointer"
                title="Open Dedicated Full Page Studio"
              >
                STUDIO
              </Link>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close chat window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Interface Body */}
          <div className="flex-1 overflow-hidden">
            <TrevoriAIChat />
          </div>
        </div>
      )}
    </div>
  );
};
