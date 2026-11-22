import React, { useState, useEffect, useRef } from 'react';
import { AIMessage, Product } from '../../types';
import { sendChatMessage } from '../../services/aiClient';
import { TrevoriAIMessage } from './TrevoriAIMessage';
import { TrevoriChatInput } from './TrevoriChatInput';
import { TrevoriTypingIndicator } from './TrevoriTypingIndicator';
import { Sparkles, Trash2, ArrowRight, KeyRound, Check, X } from 'lucide-react';

interface TrevoriAIChatProps {
  initialMessage?: string;
  onViewProduct?: (product: Product) => void;
  compact?: boolean;
}

const DEFAULT_WELCOME_MESSAGE: AIMessage = {
  id: 'msg-welcome-01',
  role: 'assistant',
  content: `Namaste & Welcome to **TREVORI AI** — your dedicated 24/7 personal fashion stylist and concierge.

Ask me anything:
• Style complete streetwear or royal traditional outfits under any budget
• Calculate your exact size across our shirts, tees, and hoodies
• Ask about fabric science, garment care, or lifestyle & sleep advice
• Track orders or search real inventory in seconds

What can I help you with today?`,
  timestamp: Date.now(),
  suggestedActions: [
    'Suggest an outfit for a college party under ₹2,500',
    'Find oversized black T-shirts',
    'What size should I wear for a 40" chest?',
    'What is French Terry?',
    'What shirts or tees do you recommend?',
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

  // OpenAI API Key Modal state
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    try {
      return localStorage.getItem('trevori_openai_api_key') || '';
    } catch {
      return '';
    }
  });
  const [isKeySaved, setIsKeySaved] = useState(false);

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
        content: `I apologize, I encountered a temporary connection glitch. Please retry or ask any styling question.`,
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

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKeyInput.trim();
    if (cleanKey) {
      localStorage.setItem('trevori_openai_api_key', cleanKey);
    } else {
      localStorage.removeItem('trevori_openai_api_key');
    }
    setIsKeySaved(true);
    setTimeout(() => {
      setIsKeySaved(false);
      setIsKeyModalOpen(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm relative">
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

      {/* OpenAI API Key Settings Modal */}
      {isKeyModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0A1728] border border-[#1E3A66] rounded-2xl max-w-sm w-full p-5 text-left relative shadow-2xl text-white">
            <button
              onClick={() => setIsKeyModalOpen(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="w-4 h-4 text-[#F88379]" />
              <h4 className="text-sm font-black uppercase text-white tracking-wide">
                Connect OpenAI API Key
              </h4>
            </div>

            <p className="text-[11px] text-slate-300 mb-4 leading-relaxed">
              Trevori AI has built-in conversational intelligence. To connect direct live <strong>OpenAI GPT-4o-mini</strong> with function calling, paste your API key below:
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full bg-[#071324] border border-[#1E3A66] focus:border-[#4285F4] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono outline-none"
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#F88379] hover:bg-[#FA958D] text-white text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  {isKeySaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save API Key</span>
                  )}
                </button>
                {apiKeyInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setApiKeyInput('');
                      localStorage.removeItem('trevori_openai_api_key');
                    }}
                    className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-200 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
