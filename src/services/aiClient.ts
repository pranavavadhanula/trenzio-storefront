import { AIMessage } from '../types';
import { AIResponsePayload, processStylistQuery, analyzeFashionImage } from './aiEngine';

/**
 * Sends a message to the secure Trevori AI backend
 * Calls server endpoint `/api/ai/chat` (which holds OpenAI credentials safely server-side)
 * Gracefully falls back to local execution if backend API is offline
 */
export async function sendChatMessage(
  message: string,
  history: AIMessage[] = []
): Promise<AIResponsePayload> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: history.map((h) => ({
          role: h.role,
          content: h.content,
        })),
      }),
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        return data;
      }
    }
  } catch (err) {
    console.warn('[AI Client] API route unreachable, falling back to client-side engine:', err);
  }

  // Graceful client-side fallback (or direct OpenAI if local key configured)
  const localKey =
    typeof window !== 'undefined'
      ? localStorage.getItem('trevori_openai_api_key') ||
        (import.meta.env.VITE_OPENAI_API_KEY as string) ||
        undefined
      : undefined;

  return await processStylistQuery(message, history, localKey);
}

/**
 * Uploads an inspiration photo to `/api/ai/vision` for fashion style analysis
 */
export async function uploadFashionImage(
  imageDataUrl: string
): Promise<{
  analysis: {
    category: string;
    dominantColors: string[];
    vibe: string;
    stylingTips: string;
  };
  matchedProducts: any[];
}> {
  try {
    const res = await fetch('/api/ai/vision', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageDataUrl }),
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await res.json();
      }
    }
  } catch (err) {
    console.warn('[AI Client] Vision API unreachable, using client analysis:', err);
  }

  return await analyzeFashionImage(imageDataUrl);
}
