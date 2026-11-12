import React, { useState } from 'react';
import { X, Ruler, HelpCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface SizingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SizingModal: React.FC<SizingModalProps> = ({ isOpen, onClose }) => {
  const { isSizeGuideOpen: contextIsOpen, setIsSizeGuideOpen } = useShop();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const visible = isOpen !== undefined ? isOpen : contextIsOpen;
  const handleClose = onClose || (() => setIsSizeGuideOpen(false));

  if (!visible) return null;

  // Exact Trevori heavyweight sizing chart
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
        className="fixed inset-0 bg-[#060C1A]/85 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl bg-[#0D1B3A] border border-white/15 p-6 sm:p-8 shadow-2xl z-10 space-y-6 text-[#FFFFFF]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-serif text-2xl text-[#FFFFFF] font-light">
              Oversized T-Shirt Size Guide
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-[#FFFFFF] hover:text-[#2563EB] hover:border-[#2563EB] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unit switcher */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-[#3B82F6] font-light">
            Exact dimensions from Trevori studio specifications.
          </p>
          <div className="flex border border-white/15 bg-white/[0.03]">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 text-xs uppercase font-mono cursor-pointer ${
                unit === 'in' ? 'bg-[#2563EB] text-black font-extrabold shadow-[0_0_10px_rgba(212,255,0,0.3)]' : 'text-[#3B82F6] hover:bg-white/5'
              }`}
            >
              In (Inches)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs uppercase font-mono cursor-pointer ${
                unit === 'cm' ? 'bg-[#2563EB] text-black font-extrabold shadow-[0_0_10px_rgba(212,255,0,0.3)]' : 'text-[#3B82F6] hover:bg-white/5'
              }`}
            >
              Cm (Centimeters)
            </button>
          </div>
        </div>

        {/* Garment Dimensions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-[#2563EB] font-mono font-bold">
                <th className="py-2.5">Size</th>
                <th className="py-2.5">Chest (Around)</th>
                <th className="py-2.5">Length (Neck to Hem)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-mono text-[#FFFFFF]">
              {tShirtSizes.map((row) => (
                <tr key={row.size} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-bold text-white">{row.size}</td>
                  <td className="py-3">{unit === 'in' ? `${row.chestIn}"` : `${row.chestCm} cm`}</td>
                  <td className="py-3">{unit === 'in' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Help Note */}
        <div className="flex items-start gap-2.5 p-3 bg-white/[0.03] border border-white/12 text-xs text-[#3B82F6]">
          <HelpCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
          <span>
            The final size may vary by &plusmn;0.5 inches due to manual cutting and bio-wash finishing.
          </span>
        </div>
      </div>
    </div>
  );
};
