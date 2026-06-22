import type { AIProvider } from './AIProvider';
import { GeminiProvider } from './gemini/GeminiProvider';

/**
 * Factory function to instantiate the correct AI provider based on user settings.
 * New providers (OpenAI, Anthropic, Ollama) are added to this switch statement.
 */
export function getAIProvider(
  providerId: string, 
  apiKeys: { gemini: string; openai?: string; anthropic?: string }
): AIProvider {
  switch (providerId) {
    case 'gemini':
      return new GeminiProvider(apiKeys.gemini);
      
    default:
      throw new Error(`AI Provider '${providerId}' is not fully implemented yet.`);
  }
}
