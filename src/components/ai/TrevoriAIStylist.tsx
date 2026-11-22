import React, { useState } from 'react';
import { TrevoriAIChat } from './TrevoriAIChat';
import { TrevoriOutfitGenerator } from './TrevoriOutfitGenerator';
import { TrevoriSizeAssistant } from './TrevoriSizeAssistant';
import { TrevoriImageUploader } from './TrevoriImageUploader';
import { TrevoriProductCard } from './TrevoriProductCard';
import { PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import {
  Sparkles,
  MessageSquare,
  Layers,
  Ruler,
  Camera,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TrevoriAIStylist: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'outfit' | 'size' | 'vision'>('chat');
  const [selectedInitialPrompt, setSelectedInitialPrompt] = useState<string>('');

  const PROMPT_SUGGESTIONS = [
    {
      title: 'College Fest Look',
      desc: 'Suggest a high-street outfit under ₹2,500',
      prompt: 'Suggest an outfit for a college party under ₹2,500.',
      icon: '🎉',
    },
    {
      title: 'Heavyweight Black Tees',
      desc: '350 GSM boxy drop-shoulder cuts',
      prompt: 'Find oversized black T-shirts with heavyweight fabric.',
      icon: '👕',
    },
    {
      title: 'Traditional Couture',
      desc: 'Bandhgalas, Kurtas & Lehengas',
      prompt: 'Show traditional Indian clothing and royal wedding couture.',
      icon: '👑',
    },
    {
      title: 'Utility Cargo Pants',
      desc: 'Relaxed pleated twill under ₹1,500',
      prompt: 'Find cargo pants under ₹1,500.',
      icon: '👖',
    },
    {
      title: 'Order Status & Tracking',
      desc: 'Check delivery for recent order',
      prompt: 'Track my order #TRV-89421',
      icon: '📦',
    },
  ];

  const handleLaunchPrompt = (prompt: string) => {
    setSelectedInitialPrompt(prompt);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#2563EB] selection:text-white pb-24">
      {/* 1. HERO INTRO BANNER */}
      <section className="relative bg-gradient-to-b from-[#0A172D] via-[#0F2444] to-[#1E3A66] text-white py-14 sm:py-20 px-4 sm:px-8 border-b border-[#2563EB]/30 overflow-hidden">
        {/* Glow Vignettes */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#F88379]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#3B82F6] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#3B82F6] animate-pulse" />
            <span>The Signature Trevori AI Shopping Experience</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
            TREVORI AI &bull; Personal Fashion Stylist
          </h1>

          <p className="max-w-2xl mx-auto text-slate-200 text-sm sm:text-base leading-relaxed font-sans font-normal">
            Your 24/7 intelligent haute fashion advisor. Discover structured 350 GSM silhouettes, receive algorithmic outfit recommendations, calculate precision sizing, and search by photo.
          </p>

          {/* Quick Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real Verified Inventory</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Budget-Aware Outfits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free 7-Day Size Exchange</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 relative z-20">
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-slate-200/90 flex flex-wrap items-center justify-between gap-2 mb-8">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'chat', label: 'AI Stylist Chat', icon: MessageSquare },
              { id: 'outfit', label: 'Outfit Architect', icon: Layers },
              { id: 'size', label: 'Size Assistant', icon: Ruler },
              { id: 'vision', label: 'Image Inspiration Search', icon: Camera },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#0A172D] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#0A172D] hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#3B82F6]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 text-[11px] font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AI Online &bull; INR (₹)</span>
          </div>
        </div>

        {/* Tab 1: AI Chat View */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Chat Interface (7 cols) */}
            <div className="lg:col-span-8 h-[700px] flex flex-col">
              <TrevoriAIChat initialMessage={selectedInitialPrompt} />
            </div>

            {/* Right Column: Suggested Inquiries & Quick Shopping Shortcuts (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Prompt Starters */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#0A172D]">
                    Suggested Questions
                  </h3>
                </div>

                <div className="space-y-2">
                  {PROMPT_SUGGESTIONS.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleLaunchPrompt(item.prompt)}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/40 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs font-sans font-bold text-[#0A172D] group-hover:text-[#2563EB]">
                        <span className="flex items-center gap-1.5">
                          <span>{item.icon}</span>
                          <span>{item.title}</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shopping Shortcuts */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
                <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#0A172D] mb-3">
                  Shopping Shortcuts
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs font-sans font-semibold">
                  <Link
                    to="/collections/men-oversized-tees"
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 transition-colors block text-center"
                  >
                    Oversized Tees
                  </Link>
                  <Link
                    to="/collections/traditional-men"
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 transition-colors block text-center"
                  >
                    Traditional Wear
                  </Link>
                  <Link
                    to="/collections/men-sweatshirts"
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 transition-colors block text-center"
                  >
                    400 GSM Hoodies
                  </Link>
                  <Link
                    to="/collections/accessories"
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 transition-colors block text-center"
                  >
                    Accessories
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: AI Outfit Generator */}
        {activeTab === 'outfit' && (
          <div className="max-w-4xl mx-auto">
            <TrevoriOutfitGenerator />
          </div>
        )}

        {/* Tab 3: AI Size Assistant */}
        {activeTab === 'size' && (
          <div className="max-w-2xl mx-auto">
            <TrevoriSizeAssistant />
          </div>
        )}

        {/* Tab 4: Image Search */}
        {activeTab === 'vision' && (
          <div className="max-w-3xl mx-auto">
            <TrevoriImageUploader />
          </div>
        )}

        {/* 3. SIGNATURE SHOWCASE RUNWAY ROW */}
        <section className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider text-[#2563EB] uppercase">
                From Our Runway
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0A172D]">
                Featured Heavyweight Drops
              </h2>
            </div>
            <Link
              to="/collections"
              className="text-xs font-sans font-bold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <span>Explore All ({PRODUCTS.length} styles)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.slice(0, 4).map((product) => (
              <TrevoriProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </section>
    </div>
  );
};
