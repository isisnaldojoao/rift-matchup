import OpenAI from 'openai';

function normalizeApiKey(key?: string): string | undefined {
  if (!key) return undefined;
  const trimmed = key.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export const openai = new OpenAI({
  apiKey: normalizeApiKey(process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY),
  baseURL: 'https://api.groq.com/openai/v1'
});
