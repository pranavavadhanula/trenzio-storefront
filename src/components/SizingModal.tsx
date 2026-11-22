import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
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

  const tShirtSizes = [
    { size: 'XS', chestIn: 40, chestCm: 101.6, lengthIn: 27, lengthCm: 68.6 },
    { size: 'S', chestIn: 42, chestCm: 106.7, lengthIn: 28, lengthCm: 71.1 },
    { size: 'M', chestIn: 44, chestCm: 111.8, lengthIn: 29, lengthCm: 73.7 },
    { size: 'L', chestIn: 46, chestCm: 116.8, lengthIn: 30, lengthCm: 76.2 },
    { size: 'XL', chestIn: 48, chestCm: 121.9, lengthIn: 31, lengthCm: 78.7 },
    { size: '2XL', chestIn: 50, chestCm: 127.0, lengthIn: 32, lengthCm: 81.3 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 shadow-2xl z-10 space-y-6 text-[#171717]">
        <div className="flex items-center justify-between border-b border-[#DDD8CE] pb-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#B9AA96]" />
            <h3 className="font-serif text-2xl text-[#171717] font-normal">
              Atelier Sizing Guide
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full border border-[#DDD8CE] flex items-center justify-center text-[#171717] hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unit switcher */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-[#706B64] font-light">
            Exact architectural dimensions from Trevori specifications.
          </p>
          <div className="flex border border-[#DDD8CE]">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 text-xs uppercase font-medium cursor-pointer ${
                unit === 'in' ? 'bg-[#171717] text-white' : 'text-[#706B64] hover:bg-[#F4F1EA]'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs uppercase font-medium cursor-pointer ${
                unit === 'cm' ? 'bg-[#171717] text-white' : 'text-[#706B64] hover:bg-[#F4F1EA]'
              }`}
            >
              Centimeters
            </button>
          </div>
        </div>

        {/* Garment Dimensions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#DDD8CE] text-[10px] uppercase tracking-widest text-[#706B64] font-medium">
                <th className="py-2.5">Size</th>
                <th className="py-2.5">Chest (Around)</th>
                <th className="py-2.5">Length (Neck to Hem)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD8CE]/60 text-[#171717]">
              {tShirtSizes.map((row) => (
                <tr key={row.size} className="hover:bg-[#F4F1EA]">
                  <td className="py-2.5 font-semibold">{row.size}</td>
                  <td className="py-2.5 text-[#706B64]">
                    {unit === 'in' ? `${row.chestIn}"` : `${row.chestCm} cm`}
                  </td>
                  <td className="py-2.5 text-[#706B64]">
                    {unit === 'in' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#F4F1EA] border border-[#DDD8CE] text-[11px] text-[#706B64] font-light">
          <strong>Fit Recommendation:</strong> Our silhouettes feature intentional dropped shoulders and a boxy torso. Choose your standard size for the calibrated relaxed streetwear drape, or size down for a conventional regular fit.
        </div>
      </div>
    </div>
  );
};
