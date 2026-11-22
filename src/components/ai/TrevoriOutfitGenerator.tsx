import React, { useState } from 'react';
import { generateCuratedOutfit } from '../../services/aiEngine';
import { AIOutfitRecommendation } from '../../types';
import { useShop } from '../../context/ShopContext';
import { TrevoriProductCard } from './TrevoriProductCard';
import { Sparkles, ShoppingBag, Check, ShieldCheck, Tag } from 'lucide-react';

interface TrevoriOutfitGeneratorProps {
  onSelectOutfit?: (outfit: AIOutfitRecommendation) => void;
  compact?: boolean;
}

export const TrevoriOutfitGenerator: React.FC<TrevoriOutfitGeneratorProps> = ({
  onSelectOutfit,
  compact = false,
}) => {
  const { addToCart, setIsCartOpen, formatPrice } = useShop();

  const [occasion, setOccasion] = useState<string>('College Party / Fest');
  const [budget, setBudget] = useState<number>(2500);
  const [gender, setGender] = useState<'Men' | 'Women' | 'Unisex'>('Unisex');
  const [outfit, setOutfit] = useState<AIOutfitRecommendation | null>(() =>
    generateCuratedOutfit({ occasion: 'College Party / Fest', budget: 2500, gender: 'Unisex' })
  );
  const [isAddingAll, setIsAddingAll] = useState(false);

  const handleGenerate = (selectedOccasion = occasion, selectedBudget = budget, selectedGender = gender) => {
    const generated = generateCuratedOutfit({
      occasion: selectedOccasion,
      budget: selectedBudget,
      gender: selectedGender,
    });
    setOutfit(generated);
    onSelectOutfit?.(generated);
  };

  const handleAddAllToCart = () => {
    if (!outfit || !outfit.products.length) return;

    setIsAddingAll(true);
    outfit.products.forEach((p) => {
      const defaultSize = p.sizes[0] || 'M';
      const defaultColor = p.colors[0]?.name || 'Black';
      addToCart(p, defaultSize, defaultColor, 1);
    });

    setTimeout(() => {
      setIsAddingAll(false);
      setIsCartOpen(true);
    }, 700);
  };

  const OCCASIONS = [
    { label: 'College Party', budget: 2500 },
    { label: 'Date Night', budget: 3500 },
    { label: 'Summer Streetwear', budget: 2000 },
    { label: 'Royal Wedding', budget: 9000 },
    { label: 'Minimalist Airport Look', budget: 3000 },
  ];

  return (
    <div className={`bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-sm ${compact ? 'text-xs' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm text-[#0A172D]">
              Trevori AI Outfit Architect
            </h3>
            <p className="text-[11px] text-slate-500 font-sans">
              Algorithmic occasion & budget look curation
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[10px] font-mono text-[#2563EB] font-bold border border-blue-200/50">
          Real Stock Only
        </span>
      </div>

      {/* Occasion Quick Presets */}
      <div className="space-y-3 mb-5">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-1.5">
            Select Occasion
          </label>
          <div className="flex flex-wrap gap-1.5">
            {OCCASIONS.map((occ) => (
              <button
                key={occ.label}
                type="button"
                onClick={() => {
                  setOccasion(occ.label);
                  setBudget(occ.budget);
                  handleGenerate(occ.label, occ.budget, gender);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer ${
                  occasion === occ.label
                    ? 'bg-[#0A172D] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {occ.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-sans mb-1">
            <span className="text-slate-600 font-medium">Budget Target</span>
            <span className="font-bold text-[#0A172D] font-mono text-sm">
              ₹{budget.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min="1500"
            max="10000"
            step="250"
            value={budget}
            onChange={(e) => {
              const val = Number(e.target.value);
              setBudget(val);
              handleGenerate(occasion, val, gender);
            }}
            className="w-full accent-[#2563EB] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
            <span>₹1,500</span>
            <span>₹5,000</span>
            <span>₹10,000</span>
          </div>
        </div>

        {/* Gender Filter */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Fit For:
          </span>
          {(['Unisex', 'Men', 'Women'] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setGender(g);
                handleGenerate(occasion, budget, g);
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-sans transition-all cursor-pointer ${
                gender === g
                  ? 'bg-blue-100 text-[#2563EB] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Outfit Result Display */}
      {outfit && (
        <div className="border border-blue-200/80 rounded-2xl p-4 bg-gradient-to-b from-blue-50/50 to-white animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-100 mb-3">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#2563EB] font-bold">
                {outfit.occasion}
              </span>
              <h4 className="font-sans font-extrabold text-base text-[#0A172D]">
                {outfit.title}
              </h4>
            </div>

            {/* Total Cost Badge */}
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                Total Outfit Cost
              </span>
              <span className="font-sans font-black text-lg text-[#0A172D]">
                {formatPrice(outfit.totalCostINR)}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-sans leading-relaxed mb-3">
            {outfit.description}
          </p>

          <div className="bg-white rounded-xl p-3 border border-slate-200/70 mb-4 text-xs font-sans text-slate-700 flex items-start gap-2">
            <Tag className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
            <span>
              <strong>Stylist Tip:</strong> {outfit.styleAdvice}
            </span>
          </div>

          {/* Product Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {outfit.products.map((item) => (
              <TrevoriProductCard key={item.id} product={item} compact={false} />
            ))}
          </div>

          {/* Add All To Cart Button */}
          <button
            type="button"
            onClick={handleAddAllToCart}
            disabled={isAddingAll}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold tracking-wide transition-all shadow-[0_4px_16px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 cursor-pointer ${
              isAddingAll
                ? 'bg-emerald-600 text-white'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white active:scale-[0.99]'
            }`}
          >
            {isAddingAll ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added All Items to Your Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>
                  Add Complete Outfit to Bag ({formatPrice(outfit.totalCostINR)})
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
