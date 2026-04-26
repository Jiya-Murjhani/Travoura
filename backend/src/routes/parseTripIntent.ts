import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { env, requireEnv } from '../config/env';

const router = Router();

// ─── System prompt for trip intent extraction ──────────────────────────────
const SYSTEM_PROMPT = `You are a travel data extraction assistant.
Extract structured trip planning fields from the user's natural language input.
Respond ONLY with a valid JSON object — no markdown, no explanation, no preamble.
If a field cannot be confidently inferred, set it to null.
Return exactly this shape:
{
  "destination": string | null,
  "country": string | null,
  "duration_days": number | null,
  "total_budget": number | null,
  "currency": string | null,
  "num_travelers": number | null,
  "group_type": string | null,
  "interests": string[] | null,
  "travel_style": string | null,
  "budget_tier": string | null,
  "pace": string | null,
  "trip_type": string[] | null,
  "dietary_needs": string[] | null,
  "notes": string | null
}`;

// ─── POST /api/parse-trip-intent ──────────────────────────────────────────
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;

    // Validate input
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }
    if (text.length > 500) {
      return res.status(400).json({ error: 'Text must be under 500 characters' });
    }

    // Call Groq LLM
    const apiKey = requireEnv(env.groq.apiKey, 'GROQ_API_KEY_TRAVOURA');
    const baseUrl = env.groq.baseUrl;
    const model = 'llama-3.3-70b-versatile';

    const llmResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 800,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text.trim() },
        ],
      }),
    });

    if (!llmResponse.ok) {
      const errText = await llmResponse.text().catch(() => '');
      console.error(`[parse-trip-intent] LLM request failed (${llmResponse.status}): ${errText}`);
      return res.status(502).json({ error: 'LLM service unavailable' });
    }

    const llmData = (await llmResponse.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = llmData.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(422).json({ error: 'Could not parse trip intent' });
    }

    // Parse the LLM JSON response
    let parsed: Record<string, unknown>;
    try {
      // Strip potential markdown fences the LLM might add
      const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (_parseErr) {
      console.error('[parse-trip-intent] JSON parse failed:', content);
      return res.status(422).json({ error: 'Could not parse trip intent' });
    }

    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error('[parse-trip-intent] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
