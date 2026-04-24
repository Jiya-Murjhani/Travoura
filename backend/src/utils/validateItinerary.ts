import { z } from 'zod';

export const itinerarySchema = z.object({
  trip_summary: z.string().min(1),
  total_budget_estimate: z.string().min(1),
  days: z
    .array(
      z.object({
        day: z.number().int().min(1),
        activities: z
          .array(
            z.object({
              time: z.string().min(1),
              title: z.string().min(1),
              description: z.string().min(1),
              location: z.string().min(1),
              travel_time_from_previous: z.string().min(1),
              cost_estimate: z.string().min(1),
            })
          )
          .min(1),
      })
    )
    .min(1),
});

export type Itinerary = z.infer<typeof itinerarySchema>;

export class JsonParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JsonParseError';
  }
}

/**
 * Extracts the first top-level JSON object from a string.
 * In "strict" mode, rejects if there is any non-whitespace outside the JSON.
 */
export function parseStrictJsonObject(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) throw new JsonParseError('LLM returned empty output');

  // Fast path: entire output is a JSON object.
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // fall through to extractor for cases with trailing commas / etc.
    }
  }

  const start = trimmed.indexOf('{');
  if (start === -1) throw new JsonParseError('No JSON object found in LLM output');

  let depth = 0;
  let inString = false;
  let escaped = false;
  let end = -1;

  for (let i = start; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) throw new JsonParseError('Unterminated JSON object in LLM output');

  const jsonSlice = trimmed.slice(start, end + 1);
  const before = trimmed.slice(0, start).trim();
  const after = trimmed.slice(end + 1).trim();
  if (before || after) {
    throw new JsonParseError('LLM output contained text outside the JSON object');
  }

  try {
    return JSON.parse(jsonSlice);
  } catch (e) {
    throw new JsonParseError('Failed to parse JSON returned by LLM');
  }
}

export function validateItinerary(data: unknown): Itinerary {
  return itinerarySchema.parse(data);
}

