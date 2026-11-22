import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Sparkles, X } from 'lucide-react';

interface TrevoriChatInputProps {
  onSendMessage: (text: string, imageAttachment?: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const TrevoriChatInput: React.FC<TrevoriChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder,
}) => {
  const [text, setText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const ROTATING_HINTS = [
    'Suggest a college party outfit under ₹2,500...',
    'Find oversized black T-shirts...',
    'Show traditional Indian clothing...',
    'Find cargo pants under ₹1,500...',
    'Track my order #TRV-89421...',
    'What size should I wear for a 40" chest?',
    'What should I wear on a date night?',
  ];

  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    if (placeholder) return;
    const interval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % ROTATING_HINTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [placeholder]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if ((!trimmed && !attachedImage) || isLoading) return;

    onSendMessage(trimmed || (attachedImage ? 'Analyze this fashion look' : ''), attachedImage || undefined);
    setText('');
    setAttachedImage(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative bg-white border-t border-slate-100 p-3 sm:p-4">
      {/* Attached image preview */}
      {attachedImage && (
        <div className="mb-2.5 flex items-center gap-2 bg-blue-50/60 p-2 rounded-xl border border-blue-200/60 w-fit animate-fadeIn">
          <img
            src={attachedImage}
            alt="Upload thumbnail"
            className="w-10 h-10 object-cover rounded-lg border border-slate-200"
          />
          <div className="text-[11px] font-sans">
            <span className="font-bold text-[#0A172D] block">Inspiration Attached</span>
            <span className="text-slate-500">AI will find matching catalogue pieces</span>
          </div>
          <button
            type="button"
            onClick={() => setAttachedImage(null)}
            className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-white transition-colors cursor-pointer ml-1"
            title="Remove attachment"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Image upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-[#2563EB] hover:border-[#2563EB] hover:bg-blue-50/40 transition-colors shrink-0 cursor-pointer"
          title="Upload fashion inspiration photo"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* Input Textarea */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              // auto-expand up to 120px
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || ROTATING_HINTS[hintIndex]}
            className="w-full resize-none py-2.5 px-3.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#2563EB] rounded-2xl text-xs sm:text-sm text-[#0A172D] placeholder-slate-400 focus:outline-none transition-all shadow-inner font-sans leading-relaxed"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!text.trim() && !attachedImage) || isLoading}
          className={`p-2.5 rounded-xl font-sans transition-all shrink-0 flex items-center justify-center cursor-pointer ${
            (!text.trim() && !attachedImage) || isLoading
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-[0_2px_10px_rgba(37,99,235,0.3)] active:scale-95'
          }`}
          title="Send message (Enter)"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Footer hint */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 px-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-[#2563EB]" />
          Trevori AI Stylist &bull; Powered by Real Inventory
        </span>
        <span className="hidden sm:inline">Press Enter to send</span>
      </div>
    </div>
  );
};
