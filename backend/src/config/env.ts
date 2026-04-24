import dotenv from 'dotenv';

dotenv.config();

export class EnvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvError';
  }
}

export const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  supabase: {
    url: process.env.VITE_SUPABASE_URL,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY,
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY_TRAVOURA,
    baseUrl: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
    model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
  },
} as const;

export function requireEnv(value: string | undefined, name: string): string {
  if (!value || !value.trim()) {
    throw new EnvError(`Missing required environment variable: ${name}`);
  }
  return value;
}
