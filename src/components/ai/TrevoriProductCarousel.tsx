import React, { useRef } from 'react';
import { Product } from '../../types';
import { TrevoriProductCard } from './TrevoriProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TrevoriProductCarouselProps {
  products: Product[];
  title?: string;
  onViewProduct?: (product: Product) => void;
}

export const TrevoriProductCarousel: React.FC<TrevoriProductCarouselProps> = ({
  products,
  title,
  onViewProduct,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="relative my-3 w-full group/carousel">
      {title && (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-slate-500">
            {title} ({products.length})
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="p-1 rounded-full border border-slate-200 text-slate-500 hover:text-[#2563EB] hover:border-[#2563EB] bg-white transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="p-1 rounded-full border border-slate-200 text-slate-500 hover:text-[#2563EB] hover:border-[#2563EB] bg-white transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent snap-x snap-mandatory px-0.5"
      >
        {products.map((product) => (
          <div key={product.id} className="snap-start shrink-0">
            <TrevoriProductCard
              product={product}
              compact={true}
              onViewProduct={onViewProduct}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
