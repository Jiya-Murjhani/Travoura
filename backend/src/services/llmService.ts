import { env, requireEnv } from '../config/env';

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export class LlmError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'LlmError';
    this.status = status;
  }
}

export async function generateWithGroq(prompt: string): Promise<string> {
  const apiKey = requireEnv(env.groq.apiKey, 'GROQ_API_KEY_TRAVOURA');
  const baseUrl = env.groq.baseUrl;
  const model = env.groq.model;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      max_tokens: 1800,
      messages: [
        {
          role: 'system',
          content:
            'You are a strict JSON generator. Output only valid JSON. Do not include markdown fences or extra text.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new LlmError(
      `LLM request failed (${response.status}). ${text ? `Details: ${text}` : ''}`.trim(),
      response.status
    );
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new LlmError('LLM returned an empty response');
  }

  return content;
}

