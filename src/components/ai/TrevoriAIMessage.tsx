import React from 'react';
import { AIMessage, Product } from '../../types';
import { TrevoriProductCarousel } from './TrevoriProductCarousel';
import { useShop } from '../../context/ShopContext';
import {
  Sparkles,
  User,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Ruler,
  Tag,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface TrevoriAIMessageProps {
  message: AIMessage;
  onSelectAction?: (actionText: string) => void;
  onViewProduct?: (product: Product) => void;
}

export const TrevoriAIMessage: React.FC<TrevoriAIMessageProps> = ({
  message,
  onSelectAction,
  onViewProduct,
}) => {
  const { addToCart, setIsCartOpen, formatPrice } = useShop();
  const isUser = message.role === 'user';

  // Format simple markdown (bold, bullets, headings) safely
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Heading 3
      if (line.startsWith('### ')) {
        return (
          <h4
            key={idx}
            className="font-sans font-bold text-sm text-[#0A172D] mt-2 mb-1"
          >
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Bullets
      if (line.startsWith('• ') || line.startsWith('- ')) {
        const content = line.substring(2);
        return (
          <div key={idx} className="flex items-start gap-1.5 my-0.5 text-xs">
            <span className="text-[#2563EB] font-bold mt-0.5">•</span>
            <span dangerouslySetInnerHTML={{ __html: parseBoldAndItalic(content) }} />
          </div>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p
          key={idx}
          className="my-1 text-xs sm:text-[13px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: parseBoldAndItalic(line) }}
        />
      );
    });
  };

  const parseBoldAndItalic = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#0A172D]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-600">$1</em>');
  };

  return (
    <div
      className={`flex items-start gap-2.5 my-3 animate-fadeIn ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
          isUser
            ? 'bg-[#0A172D] text-white border-slate-700'
            : 'bg-white text-[#2563EB] border-blue-200 shadow-[0_2px_8px_rgba(37,99,235,0.15)]'
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-200" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563EB]" />
        )}
      </div>

      {/* Message Content Container */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* User image attachment if present */}
        {message.imageUrl && (
          <div className="mb-1.5 rounded-xl overflow-hidden border border-slate-200 max-w-[200px] shadow-sm">
            <img
              src={message.imageUrl}
              alt="Uploaded visual"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-xs sm:text-[13px] font-sans ${
            isUser
              ? 'bg-[#0A172D] text-white rounded-tr-sm shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200/90 rounded-tl-sm shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
          }`}
        >
          {renderFormattedText(message.content)}
        </div>

        {/* 1. ORDER STATUS TRACKING CARD */}
        {message.orderStatus && (
          <div className="mt-2.5 w-full bg-white border border-blue-200/90 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#2563EB]" />
                <span className="font-mono text-xs font-bold text-[#0A172D]">
                  Order #{message.orderStatus.orderId}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
                {message.orderStatus.status}
              </span>
            </div>

            {/* Tracking Timeline */}
            <div className="my-3 space-y-2 text-xs font-sans">
              <div className="flex items-center justify-between text-slate-500">
                <span>Courier:</span>
                <strong className="text-[#0A172D] font-medium">
                  {message.orderStatus.carrier}
                </strong>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>AWB Tracking:</span>
                <span className="font-mono font-bold text-[#2563EB]">
                  {message.orderStatus.trackingNumber}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Estimated Arrival:</span>
                <strong className="text-emerald-700 font-bold">
                  {message.orderStatus.estimatedDelivery}
                </strong>
              </div>
            </div>

            {/* Items inside order */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {message.orderStatus.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="flex-1 text-xs font-sans">
                    <span className="font-bold text-[#0A172D] block line-clamp-1">
                      {item.productName}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Size: {item.size} &bull; Color: {item.color} &bull; Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="font-sans font-bold text-xs text-[#0A172D]">
                    {formatPrice(item.priceINR)}
                  </span>
                </div>
              ))}
            </div>

            {message.orderStatus.trackingUrl && (
              <a
                href={message.orderStatus.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-[#2563EB] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Live Carrier Tracking</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* 2. OUTFIT RECOMMENDATION SUMMARY & ITEMS */}
        {message.outfit && (
          <div className="mt-2.5 w-full bg-blue-50/50 border border-blue-200/80 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span className="font-sans font-extrabold text-xs text-[#0A172D]">
                  {message.outfit.title}
                </span>
              </div>
              <span className="font-sans font-black text-xs text-[#2563EB]">
                Total: {formatPrice(message.outfit.totalCostINR)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                message.outfit?.products.forEach((p) => {
                  addToCart(p, p.sizes[0] || 'M', p.colors[0]?.name || 'Black', 1);
                });
                setIsCartOpen(true);
              }}
              className="w-full py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer mb-2 active:scale-[0.98]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add Complete Outfit to Bag</span>
            </button>
          </div>
        )}

        {/* 3. PRODUCT CAROUSEL / CARDS */}
        {message.products && message.products.length > 0 && (
          <div className="w-full">
            <TrevoriProductCarousel
              products={message.products}
              title="Curated Recommendations"
              onViewProduct={onViewProduct}
            />
          </div>
        )}

        {/* 4. SIZE RESULT RECOMMENDATION BADGE */}
        {message.sizeResult && (
          <div className="mt-2 w-full bg-slate-50/90 border border-slate-200/90 rounded-xl px-3 py-2 text-xs font-sans flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                {message.sizeResult.category}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-[#0A172D] text-white font-mono font-bold text-xs">
              Size {message.sizeResult.recommendedSize} • {message.sizeResult.fitType}
            </span>
          </div>
        )}

        {/* 5. SUGGESTED ACTION PILLS */}
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.suggestedActions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectAction?.(action)}
                className="py-1 px-2.5 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-[#2563EB] text-[11px] font-sans font-medium text-slate-700 hover:text-[#2563EB] transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>{action}</span>
                <ArrowRight className="w-2.5 h-2.5 opacity-60" />
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[9px] font-mono text-slate-400 mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};
