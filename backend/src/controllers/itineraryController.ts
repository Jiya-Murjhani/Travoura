import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { itineraryRequestSchema, buildItineraryPrompt } from '../services/promptBuilder';
import { generateWithGroq } from '../services/llmService';
import { parseStrictJsonObject, validateItinerary, JsonParseError } from '../utils/validateItinerary';
import { EnvError } from '../config/env';

export async function generateItinerary(req: Request, res: Response) {
  try {
    const input = itineraryRequestSchema.parse(req.body);

    const prompt = buildItineraryPrompt(input);
    const llmText = await generateWithGroq(prompt);

    const parsed = parseStrictJsonObject(llmText);
    const itinerary = validateItinerary(parsed);

    return res.status(200).json({ success: true, itinerary });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: err.issues.map((issue) => issue.message).join(', '),
      });
    }

    if (err instanceof EnvError) {
      return res.status(500).json({
        success: false,
        error: `${err.message}. Please add it to backend/.env`,
      });
    }

    if (err instanceof JsonParseError) {
      return res.status(500).json({
        success: false,
        error: `LLM returned invalid JSON: ${err.message}`,
      });
    }

    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ success: false, error: message });
  }
}

