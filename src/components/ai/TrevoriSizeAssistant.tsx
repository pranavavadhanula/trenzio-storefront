import React, { useState } from 'react';
import { calculateClothingSize } from '../../services/aiEngine';
import { AISizeResult } from '../../types';
import { Sparkles, Ruler, CheckCircle2, Info } from 'lucide-react';

interface TrevoriSizeAssistantProps {
  onApplyRecommendation?: (size: string, result: AISizeResult) => void;
  compact?: boolean;
}

export const TrevoriSizeAssistant: React.FC<TrevoriSizeAssistantProps> = ({
  onApplyRecommendation,
  compact = false,
}) => {
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [chestInches, setChestInches] = useState(40);
  const [waistInches, setWaistInches] = useState(32);
  const [category, setCategory] = useState<'t-shirt' | 'hoodie' | 'pants'>('t-shirt');
  const [fitPreference, setFitPreference] = useState<'oversized' | 'regular' | 'slim'>('oversized');
  const [result, setResult] = useState<AISizeResult | null>(null);

  const handleCalculate = (e?: React.FormEvent) => {
    e?.preventDefault();
    const res = calculateClothingSize({
      heightCm,
      weightKg,
      chestInches,
      waistInches,
      category,
      fitPreference,
    });
    setResult(res);
    onApplyRecommendation?.(res.recommendedSize, res);
  };

  return (
    <div className={`bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm ${compact ? 'text-xs' : ''}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm text-[#0A172D]">
              Trevori AI Size Advisor
            </h3>
            <p className="text-[11px] text-slate-500 font-sans">
              Precision fit recommendations for relaxed garments
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono text-slate-600 font-semibold">
          Signature Specs
        </span>
      </div>

      <form onSubmit={handleCalculate} className="space-y-3.5">
        {/* Category selector */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-1.5">
            Garment Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 't-shirt', label: 'T-Shirts' },
              { id: 'hoodie', label: 'Hoodies' },
              { id: 'pants', label: 'Pants / Cargos' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id as any)}
                className={`py-2 px-2.5 rounded-xl text-center text-xs font-sans font-semibold transition-all cursor-pointer ${
                  category === cat.id
                    ? 'bg-[#0A172D] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Height and Weight Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs font-sans mb-1">
              <span className="text-slate-600 font-medium">Height</span>
              <span className="font-bold text-[#0A172D] font-mono">{heightCm} cm ({Math.floor(heightCm / 30.48)}' {Math.round((heightCm % 30.48) / 2.54)}")</span>
            </div>
            <input
              type="range"
              min="150"
              max="205"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full accent-[#2563EB] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-sans mb-1">
              <span className="text-slate-600 font-medium">Weight</span>
              <span className="font-bold text-[#0A172D] font-mono">{weightKg} kg ({Math.round(weightKg * 2.20462)} lbs)</span>
            </div>
            <input
              type="range"
              min="45"
              max="120"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-[#2563EB] cursor-pointer"
            />
          </div>
        </div>

        {/* Chest and Waist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs font-sans mb-1">
              <span className="text-slate-600 font-medium">Chest Circumference</span>
              <span className="font-bold text-[#0A172D] font-mono">{chestInches} inches</span>
            </div>
            <input
              type="range"
              min="32"
              max="54"
              value={chestInches}
              onChange={(e) => setChestInches(Number(e.target.value))}
              className="w-full accent-[#2563EB] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-sans mb-1">
              <span className="text-slate-600 font-medium">Waist Circumference</span>
              <span className="font-bold text-[#0A172D] font-mono">{waistInches} inches</span>
            </div>
            <input
              type="range"
              min="26"
              max="44"
              value={waistInches}
              onChange={(e) => setWaistInches(Number(e.target.value))}
              className="w-full accent-[#2563EB] cursor-pointer"
            />
          </div>
        </div>

        {/* Fit preference */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-1.5">
            Drape Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'oversized', label: 'Drop-Shoulder Boxy' },
              { id: 'regular', label: 'Classic Proportional' },
              { id: 'slim', label: 'Structured Tailored' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFitPreference(f.id as any)}
                className={`py-1.5 px-2 rounded-xl text-center text-[11px] font-sans font-medium transition-all cursor-pointer ${
                  fitPreference === f.id
                    ? 'border-2 border-[#2563EB] bg-[#2563EB]/5 text-[#2563EB] font-bold'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleCalculate()}
          className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold tracking-wide transition-all shadow-[0_4px_14px_rgba(37,99,235,0.25)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Calculate My Perfect Size</span>
        </button>
      </form>

      {/* Result Card */}
      {result && (
        <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xs font-sans font-bold text-[#0A172D]">
                Recommended Size:
              </span>
            </div>
            <span className="px-3 py-1 rounded-lg bg-[#2563EB] text-white font-mono font-black text-sm shadow-sm">
              {result.recommendedSize}
            </span>
          </div>

          <p className="text-[11px] font-sans text-slate-700 leading-relaxed mb-2">
            {result.notes}
          </p>

          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-sans border-t border-blue-200/50 pt-2">
            <Info className="w-3 h-3 text-blue-500 shrink-0" />
            <span>
              Sensible recommendation based on standard Indian measurements. We offer free size exchanges within 7 days.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
