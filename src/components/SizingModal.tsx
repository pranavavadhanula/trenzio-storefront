import React, { useState } from 'react';
import { X, Ruler, HelpCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SizingModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useShop();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isSizeGuideOpen) return null;

  // Exact Printrove sizing chart from your Shopify product
  const tShirtSizes = [
    { size: 'XS', chestIn: 40, chestCm: 101.6, lengthIn: 27, lengthCm: 68.6 },
    { size: 'S', chestIn: 42, chestCm: 106.7, lengthIn: 28, lengthCm: 71.1 },
    { size: 'M', chestIn: 44, chestCm: 111.8, lengthIn: 29, lengthCm: 73.7 },
    { size: 'L', chestIn: 46, chestCm: 116.8, lengthIn: 30, lengthCm: 76.2 },
    { size: 'XL', chestIn: 48, chestCm: 121.9, lengthIn: 31, lengthCm: 78.7 },
    { size: '2XL', chestIn: 50, chestCm: 127.0, lengthIn: 32, lengthCm: 81.3 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-atelier-950/80 backdrop-blur-md"
        onClick={() => setIsSizeGuideOpen(false)}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl bg-atelier-900 border border-white/10 p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-atelier-gold" />
            <h3 className="font-serif text-2xl text-atelier-100 font-light">
              Oversized T-Shirt Size Guide
            </h3>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-atelier-200 hover:text-white hover:border-atelier-gold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unit switcher */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-400 font-light">
            Exact dimensions from your Printrove fulfillment specifications.
          </p>
          <div className="flex border border-white/20">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 text-xs uppercase font-mono ${
                unit === 'in' ? 'bg-atelier-gold text-atelier-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs uppercase font-mono ${
                unit === 'cm' ? 'bg-atelier-gold text-atelier-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Garment Dimensions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-atelier-gold font-mono">
                <th className="py-2.5">Size</th>
                <th className="py-2.5">Chest (Around)</th>
                <th className="py-2.5">Length (Neck to Hem)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-atelier-200">
              {tShirtSizes.map((row) => (
                <tr key={row.size} className="hover:bg-white/5">
                  <td className="py-3 font-bold text-atelier-100">{row.size}</td>
                  <td className="py-3">{unit === 'in' ? `${row.chestIn}"` : `${row.chestCm} cm`}</td>
                  <td className="py-3">{unit === 'in' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Help Note */}
        <div className="flex items-start gap-2.5 p-3 bg-white/5 border border-white/10 text-xs text-neutral-300">
          <HelpCircle className="w-4 h-4 text-atelier-gold flex-shrink-0 mt-0.5" />
          <span>
            The final size may vary by &plusmn;0.5 inches due to manual cutting and bio-wash finishing.
          </span>
        </div>
      </div>
    </div>
  );
};
