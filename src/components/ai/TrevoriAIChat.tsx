import React, { useState, useEffect, useRef } from 'react';
import { AIMessage, Product } from '../../types';
import { sendChatMessage } from '../../services/aiClient';
import { TrevoriAIMessage } from './TrevoriAIMessage';
import { TrevoriChatInput } from './TrevoriChatInput';
import { TrevoriTypingIndicator } from './TrevoriTypingIndicator';
import { Sparkles, Trash2, ArrowRight } from 'lucide-react';

interface TrevoriAIChatProps {
  initialMessage?: string;
  onViewProduct?: (product: Product) => void;
  compact?: boolean;
}

const DEFAULT_WELCOME_MESSAGE: AIMessage = {
  id: 'msg-welcome-01',
  role: 'assistant',
  content: `Namaste & Welcome to **TREVORI AI** — your dedicated 24/7 personal fashion stylist.

I can help you style complete outfits, find garments from our 350–450 GSM heavyweight drops, calculate your exact sizing, or track active orders.

What are you looking to wear today?`,
  timestamp: Date.now(),
  suggestedActions: [
    'Suggest an outfit for a college party under ₹2,500',
    'Find oversized black T-shirts',
    'Show traditional Indian clothing',
    'Find cargo pants under ₹1,500',
    'Track Order #TRV-89421',
  ],
};

export const TrevoriAIChat: React.FC<TrevoriAIChatProps> = ({
  initialMessage,
  onViewProduct,
  compact = false,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>(() => {
    try {
      const saved = localStorage.getItem('trevori_ai_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const [isLoading, setIsLoading] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  // Persist conversation history
  useEffect(() => {
    try {
      localStorage.setItem('trevori_ai_history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto-scroll to bottom on new message or loading state
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle initial message trigger if passed
  useEffect(() => {
    if (initialMessage && messages.length <= 1) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleSendMessage = async (text: string, imageAttachment?: string) => {
    const userMsg: AIMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      imageUrl: imageAttachment,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(text, messages);

      const assistantMsg: AIMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        products: response.products,
        outfit: response.outfit,
        sizeResult: response.sizeResult,
        orderStatus: response.orderStatus,
        suggestedActions: response.suggestedActions,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('[Trevori AI] Error sending message:', err);
      const errorMsg: AIMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `I apologize, I encountered a temporary connection glitch. Please retry or browse our curated collections.`,
        timestamp: Date.now(),
        suggestedActions: ['Try again', 'Show Oversized Tees', 'Explore Catalog'],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        ...DEFAULT_WELCOME_MESSAGE,
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm">
      {/* Chat Top Subheader */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-600">
            Stylist Online &bull; Mumbai Studio
          </span>
        </div>

        <button
          type="button"
          onClick={handleClearHistory}
          className="text-[11px] font-sans font-medium text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
          title="Reset conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 scrollbar-thin scrollbar-thumb-slate-200">
        {messages.map((msg) => (
          <TrevoriAIMessage
            key={msg.id}
            message={msg}
            onSelectAction={(actionText) => handleSendMessage(actionText)}
            onViewProduct={onViewProduct}
          />
        ))}

        {isLoading && <TrevoriTypingIndicator />}

        <div ref={scrollEndRef} />
      </div>

      {/* Input Box */}
      <TrevoriChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
