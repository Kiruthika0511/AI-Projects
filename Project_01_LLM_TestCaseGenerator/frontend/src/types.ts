export type LLMProvider = 'ollama' | 'lmstudio' | 'groq' | 'openai' | 'claude' | 'gemini';

export interface AppSettings {
  ollamaUrl: string;
  ollamaModel: string;
  lmStudioUrl: string;
  groqKey: string;
  openAiKey: string;
  claudeKey: string;
  geminiKey: string;
  defaultProvider: LLMProvider;
}

export interface TestCase {
  id: string;
  requirement: string;
  response: string;
  timestamp: number;
  provider: LLMProvider;
}

export const defaultSettings: AppSettings = {
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'llama3',
  lmStudioUrl: 'http://localhost:1234',
  groqKey: '',
  openAiKey: '',
  claudeKey: '',
  geminiKey: '',
  defaultProvider: 'ollama',
};
