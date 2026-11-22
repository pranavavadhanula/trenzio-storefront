import React, { useState, useRef } from 'react';
import { uploadFashionImage } from '../../services/aiClient';
import { Product } from '../../types';
import { TrevoriProductCard } from './TrevoriProductCard';
import { UploadCloud, Image as ImageIcon, Sparkles, Loader2, RefreshCw } from 'lucide-react';

interface TrevoriImageUploaderProps {
  onMatchesFound?: (products: Product[], analysis: any) => void;
  compact?: boolean;
}

export const TrevoriImageUploader: React.FC<TrevoriImageUploaderProps> = ({
  onMatchesFound,
  compact = false,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SAMPLE_MOODBOARDS = [
    {
      title: 'Minimalist Black Streetwear',
      url: '/images/models/man_streetwear_hoodie.jpg',
      vibe: 'Heavy drop-shoulder hoodie look',
    },
    {
      title: 'Monochrome Relaxed Tee',
      url: '/images/models/street_tee.jpg',
      vibe: 'Boxy 350 GSM streetwear drape',
    },
    {
      title: 'Traditional Royal Velvet',
      url: '/images/traditional_couture_banner.jpg',
      vibe: 'Handcrafted royal Indian couture',
    },
  ];

  const processImage = async (dataUrl: string) => {
    setSelectedImage(dataUrl);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await uploadFashionImage(dataUrl);
      setAnalysisResult(result.analysis);
      setMatchedProducts(result.matchedProducts || []);
      onMatchesFound?.(result.matchedProducts || [], result.analysis);
    } catch (err) {
      console.error('[Vision Search] Error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm ${compact ? 'text-xs' : ''}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm text-[#0A172D]">
              Visual Fashion Matcher
            </h3>
            <p className="text-[11px] text-slate-500 font-sans">
              Upload an outfit inspiration to find matching Trevori garments
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono text-slate-600 font-semibold">
          AI Vision Search
        </span>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-[#2563EB] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {selectedImage ? (
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-md mb-2 border border-slate-200">
              <img
                src={selectedImage}
                alt="Uploaded inspiration"
                className="w-full h-full object-cover"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-[#0A172D]/60 backdrop-blur-xs flex items-center justify-center text-white">
                  <Loader2 className="w-6 h-6 animate-spin text-[#3B82F6]" />
                </div>
              )}
            </div>
            <p className="text-xs text-[#2563EB] font-sans font-bold flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Click or drop another image to re-analyze</span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2">
            <div className="w-12 h-12 rounded-full bg-blue-100/70 text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-sans font-bold text-[#0A172D]">
              Drag & drop your fashion photo here
            </p>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
              or click to browse from your device (PNG, JPG, WebP)
            </p>
          </div>
        )}
      </div>

      {/* Preset sample inspirations */}
      <div className="mt-3">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block mb-1.5">
          Or try a sample inspiration:
        </span>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_MOODBOARDS.map((mood) => (
            <button
              key={mood.title}
              type="button"
              onClick={() => processImage(mood.url)}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/40 text-left transition-all cursor-pointer group"
            >
              <img
                src={mood.url}
                alt={mood.title}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <span className="text-[10px] font-sans font-medium text-slate-700 group-hover:text-[#2563EB] line-clamp-1">
                {mood.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Output & Matched Products */}
      {isAnalyzing && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-center flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" />
          <p className="text-xs font-sans font-semibold text-[#0A172D]">
            Analyzing fashion aesthetics, colors & silhouette...
          </p>
        </div>
      )}

      {analysisResult && !isAnalyzing && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#0A172D]">
              AI Style Breakdown
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-sans mb-3">
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Detected Category
              </span>
              <strong className="text-[#0A172D] font-bold">
                {analysisResult.category}
              </strong>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Aesthetic Vibe
              </span>
              <strong className="text-[#2563EB] font-bold">
                {analysisResult.vibe}
              </strong>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-sans leading-relaxed mb-3">
            {analysisResult.stylingTips}
          </p>

          {/* Matched Catalogue Products */}
          {matchedProducts.length > 0 && (
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2">
                Matching Trevori Pieces ({matchedProducts.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedProducts.map((p) => (
                  <TrevoriProductCard key={p.id} product={p} compact={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
