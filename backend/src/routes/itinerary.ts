import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { supabase } from '../supabaseClient';
import Groq from 'groq-sdk';

function getGroq(): Groq {
  const apiKey = process.env.GROQ_API_KEY_TRAVOURA;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY_TRAVOURA is not set in environment variables');
  }
  return new Groq({ apiKey });
}

const router = Router();

const generateSchema = z.object({
  destination: z.string(),
  origin: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  num_travelers: z.number().or(z.string().transform((val) => parseInt(val))),
  traveler_type: z.string().optional(),
  budget_level: z.string().optional(),
  interests: z.string().optional().or(z.array(z.string())),
  pace: z.string().optional(),
  accommodation_type: z.string().optional().or(z.array(z.string())),
  avoid: z.string().optional().or(z.array(z.string()))
});

const refineSchema = z.object({
  itinerary_id: z.string().or(z.number()),
  user_message: z.string(),
  conversation_history: z.array(z.object({
    role: z.string(),
    content: z.string()
  })).optional().default([])
});

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number = 150000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

function normalizeItineraryPayload(body: any, userId: string) {
  const pick = (...keys: string[]) => {
    for (const k of keys) {
      if (body[k] !== undefined && body[k] !== null && body[k] !== '') {
        return body[k];
      }
    }
    return undefined;
  };

  const rawNumTravelers = pick('numTravelers', 'travelers', 'num_travelers');
  const num_travelers = rawNumTravelers ? parseInt(String(rawNumTravelers), 10) : 1;

  const rawStartDate = pick('startDate', 'checkIn', 'start_date');
  const rawEndDate = pick('endDate', 'checkOut', 'end_date');
  
  let start_date;
  if (rawStartDate) {
    try {
      start_date = new Date(rawStartDate).toISOString().split("T")[0];
    } catch {
      start_date = String(rawStartDate);
    }
  }
  
  let end_date;
  if (rawEndDate) {
    try {
      end_date = new Date(rawEndDate).toISOString().split("T")[0];
    } catch {
      end_date = String(rawEndDate);
    }
  }

  const parseStrOrArray = (val: any): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(',').map((s: string) => s.trim()).filter(Boolean);
    return [];
  };

  const unwrapStr = (val: any): any => Array.isArray(val) ? val[0] : val;

  const normalized = {
    destination: pick('destination'),
    origin: pick('origin'),
    start_date,
    end_date,
    num_travelers: isNaN(num_travelers) ? 1 : num_travelers,
    traveler_type: unwrapStr(pick('travelerType', 'traveler_type')) || 'solo',
    budget_level: unwrapStr(pick('budgetLevel', 'budget', 'budget_level')) || 'moderate',
    interests: parseStrOrArray(pick('interests')),
    pace: unwrapStr(pick('pace')) || 'moderate',
    accommodation_type: unwrapStr(pick('accommodationType', 'accommodation_type')) || 'hotel',
    avoid: pick('avoid') ? parseStrOrArray(pick('avoid')) : null,
    user_id: userId,
    trip_id: body.trip_id ?? null
  };

  console.log("Normalized Payload:", normalized);
  return normalized;
}

router.post('/generate', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
       res.status(401).json({ success: false, error: 'User not authenticated' });
       return;
    }

    const normalizedPayload = normalizeItineraryPayload(req.body, userId);

    if (!normalizedPayload.destination || !normalizedPayload.start_date || !normalizedPayload.end_date) {
       res.status(400).json({ success: false, error: 'Missing required fields: destination, start_date, or end_date' });
       return;
    }
    
    const prompt = buildItineraryPrompt(normalizedPayload);

    let itineraryData: any;
    try {
      const completion = await getGroq().chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are Travoura's expert AI travel planner with decades of experience crafting luxury, budget, and mid-range travel experiences worldwide. You have deep knowledge of local cultures, hidden gems, off-the-beaten-path experiences, authentic local cuisine, optimal timing for attractions, and insider tips that only seasoned travelers know.

Your itineraries are:
- Highly personalized to the traveler's specific interests and style
- Logistically smart (nearby attractions grouped together, travel time considered)
- Balanced between must-see highlights and unique hidden gems
- Rich with local cultural context and insider knowledge
- Practical with real timing, costs, and actionable tips

Always respond with ONLY valid JSON, no markdown, no explanation, no extra text. The JSON must be complete and valid.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 6000,
      });

      const raw = completion.choices[0].message.content || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      itineraryData = JSON.parse(clean);

      if (!itineraryData.days || !itineraryData.destination) {
        throw new Error("Invalid itinerary structure returned by LLM");
      }

    } catch (err: any) {
      console.error("[generate] LLM error:", err);
      console.error("[generate] GROQ_API_KEY_TRAVOURA set:", !!process.env.GROQ_API_KEY_TRAVOURA);
      res.status(500).json({ 
        success: false,
        error: `LLM Error: ${err.message}`,
        message: err.message,
        details: err.status || err.code || undefined
      });
      return;
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        user_id: userId,
        trip_id: normalizedPayload.trip_id ?? null,
        request_data: normalizedPayload,
        itinerary_data: itineraryData,
        destination: normalizedPayload.destination,
        start_date: normalizedPayload.start_date,
        end_date: normalizedPayload.end_date,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error saving itinerary:', error);
       res.status(500).json({ success: false, error: 'Failed to save itinerary to database' });
       return;
    }

     res.status(200).json({ success: true, itinerary: data });
     return;
  } catch (err: any) {
    if (err instanceof z.ZodError) {
       res.status(400).json({ success: false, error: err.issues.map(i => i.message).join(', ') });
       return;
    }
    if (err.name === 'AbortError') {
       res.status(504).json({ success: false, error: 'Request to AI service timed out' });
       return;
    }
    console.error('Error generating itinerary:', err);
     res.status(500).json({ success: false, error: err.message || 'Internal server error' });
     return;
  }
});

router.post('/refine', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
       res.status(401).json({ success: false, error: 'User not authenticated' });
       return;
    }

    const body = refineSchema.parse(req.body);
    
    // Load existing itinerary
    const { data: existingItinerary, error: fetchError } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', body.itinerary_id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingItinerary) {
       res.status(404).json({ success: false, error: 'Itinerary not found or access denied' });
       return;
    }

    const aiServiceUrl = process.env.AI_ITINERARY_AGENT_URL;
    if (!aiServiceUrl) {
       res.status(500).json({ success: false, error: 'AI_ITINERARY_AGENT_URL is not configured' });
       return;
    }

    const payload = {
      existing_itinerary: existingItinerary.itinerary_data,
      user_message: String(body.user_message),
      conversation_history: body.conversation_history || []
    };

    const response = await fetchWithTimeout(`${aiServiceUrl}/refine-itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, 150000);

    if (!response.ok) {
       let agentData;
       const errorText = await response.text();
       try {
         agentData = JSON.parse(errorText);
       } catch (e) {
         agentData = errorText;
       }
       res.status(response.status).json({ 
         success: false, 
         error: "AI Service Error", 
         details: agentData, 
         payload_sent: payload 
       });
       return;
    }

    const responseData = await response.json() as any;
    const updatedItineraryData = responseData.itinerary_data || responseData;

    // Save conversation - User message
    await supabase.from('itinerary_conversations').insert({
      itinerary_id: existingItinerary.id,
      role: 'user',
      message: body.user_message
    });

    // Save conversation - Assistant response
    await supabase.from('itinerary_conversations').insert({
      itinerary_id: existingItinerary.id,
      role: 'assistant',
      message: responseData.assistant_message || JSON.stringify(updatedItineraryData)
    });

    // Update itinerary_data
    const { data: updatedItinerary, error: updateError } = await supabase
      .from('itineraries')
      .update({
        itinerary_data: updatedItineraryData,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingItinerary.id)
      .select()
      .single();

    if (updateError) {
       res.status(500).json({ success: false, error: 'Failed to update itinerary in database' });
       return;
    }

     res.status(200).json({ success: true, itinerary: updatedItinerary });
     return;
  } catch (err: any) {
    if (err instanceof z.ZodError) {
       res.status(400).json({ success: false, error: err.issues.map(i => i.message).join(', ') });
       return;
    }
    if (err.name === 'AbortError') {
       res.status(504).json({ success: false, error: 'Request to AI service timed out' });
       return;
    }
    console.error('Error refining itinerary:', err);
     res.status(500).json({ success: false, error: err.message || 'Internal server error' });
     return;
  }
});

router.get('/my-itineraries', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
       res.status(401).json({ success: false, error: 'User not authenticated' });
       return;
    }

    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
       res.status(500).json({ success: false, error: 'Failed to fetch itineraries' });
       return;
    }

     res.status(200).json({ success: true, itineraries: data });
     return;
  } catch (err: any) {
    console.error('Error fetching itineraries:', err);
     res.status(500).json({ success: false, error: err.message || 'Internal server error' });
     return;
  }
});

router.get("/trip/:tripId", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { tripId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
       res.status(401).json({ success: false, error: 'User not authenticated' });
       return;
    }
    
    const { data, error } = await supabase
      .from("itineraries")
      .select("id, destination, start_date, end_date, created_at, itinerary_data, request_data, status")
      .eq("trip_id", tripId)
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
       res.status(500).json({ error: "Failed to fetch itineraries" });
       return;
    }
     res.status(200).json({ itineraries: data || [] });
     return;
  } catch (err: any) {
     res.status(500).json({ error: err.message });
     return;
  }
});

router.delete("/:itineraryId", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { itineraryId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
       res.status(401).json({ success: false, error: 'User not authenticated' });
       return;
    }

    const { error } = await supabase
      .from("itineraries")
      .update({ status: "deleted" })
      .eq("id", itineraryId)
      .eq("user_id", userId);

    if (error) {
       res.status(500).json({ error: "Failed to delete itinerary" });
       return;
    }
     res.status(200).json({ success: true });
     return;
  } catch (err: any) {
     res.status(500).json({ error: err.message });
     return;
  }
});

router.get("/:itineraryId", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { itineraryId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
       res.status(401).json({ success: false, error: 'User not authenticated' });
       return;
    }

    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("id", itineraryId)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
       res.status(404).json({ error: "Itinerary not found" });
       return;
    }

     res.status(200).json({ itinerary: data });
     return;
  } catch (err: any) {
     res.status(500).json({ error: err.message });
     return;
  }
});

function buildItineraryPrompt(payload: Record<string, any>): string {
  const totalDays = Math.ceil(
    (new Date(payload.end_date).getTime() - 
     new Date(payload.start_date).getTime()) 
    / (1000 * 60 * 60 * 24)
  );

  const budgetDescriptions: Record<string, string> = {
    budget: "budget-conscious (under $50/day), prioritizing free attractions, street food, hostels or budget hotels, and local transport",
    moderate: "mid-range ($50-150/day), balancing comfort and value, mix of restaurants and local eateries, 3-star accommodation",
    luxury: "luxury ($150+/day), premium experiences, fine dining, 4-5 star hotels, private transfers, exclusive access"
  };

  const paceDescriptions: Record<string, string> = {
    slow: "relaxed and slow-paced with maximum 2-3 activities per day, long meals, plenty of rest and spontaneous exploration",
    moderate: "moderate pace with 3-4 activities per day, balanced between sightseeing and relaxation",
    fast: "fast-paced and packed with 5-6 activities per day, maximizing every hour to see as much as possible"
  };

  const travelerContext: Record<string, string> = {
    solo: "a solo traveler who values independence, meeting locals, flexible plans, and authentic experiences",
    couple: "a couple looking for romantic experiences, intimate dining, and shared memorable moments",
    family: "a family with children needing kid-friendly activities, safe environments, and varied pace",
    friends: "a group of friends seeking fun, social experiences, nightlife, and shared adventures",
    business: "a business traveler with limited free time wanting efficient, high-quality experiences"
  };

  return `Create a highly personalized, professional ${totalDays}-day travel 
itinerary for the following traveler:

TRAVELER PROFILE:
- Traveling as: ${travelerContext[payload.traveler_type] || payload.traveler_type}
- Number of travelers: ${payload.num_travelers}
- Origin city: ${payload.origin || "not specified"}
- Destination: ${payload.destination}
- Travel dates: ${payload.start_date} to ${payload.end_date}
- Budget style: ${budgetDescriptions[payload.budget_level] || payload.budget_level}
- Travel pace: ${paceDescriptions[payload.pace] || payload.pace}
- Accommodation: ${payload.accommodation_type}
- Interests & passions: ${payload.interests?.join(", ") || "general sightseeing"}
${payload.avoid?.length ? `- Must avoid: ${payload.avoid.join(", ")}` : ""}

ITINERARY REQUIREMENTS:
1. Make every day have a distinct theme that flows naturally
2. Group geographically close attractions on the same day to minimize travel
3. Include at least one hidden gem or off-the-beaten-path experience per day
4. Suggest specific local restaurants/food stalls (not just generic cuisine)
5. Include realistic travel times between locations
6. Add cultural context and "why this matters" to activity descriptions
7. Include specific insider tips that only locals or seasoned travelers know
8. First day should account for arrival/settling in
9. Last day should account for departure preparation
10. Meals must reflect local specialties and match the traveler's interests
11. Each activity tip must be genuinely useful and specific, not generic
12. Budget estimates must be realistic for the destination and budget level

Return ONLY a valid JSON object with this exact structure:
{
  "destination": "string (properly capitalized city name)",
  "total_days": number,
  "summary": "string (2-3 sentence compelling overview of this specific trip)",
  "weather_note": "string (specific weather advice for these travel dates)",
  "best_time_to_visit": "string (months and why)",
  "estimated_total_budget": "string (realistic range for all travelers e.g. $800-$1200 for 2 travelers)",
  "packing_tips": ["string (specific, not generic — based on destination and activities)"],
  "days": [
    {
      "day_number": number,
      "theme": "string (creative, specific theme e.g. 'Colonial History & Street Food Safari')",
      "activities": [
        {
          "time": "string (e.g. 09:00 AM)",
          "name": "string (specific place/activity name)",
          "description": "string (2-3 sentences with cultural context and what makes it special)",
          "duration_minutes": number,
          "category": "sightseeing|food|adventure|leisure|culture|shopping|nightlife|wellness",
          "estimated_cost_usd": number (per person),
          "tips": "string (one specific insider tip a local would give)"
        }
      ],
      "meals": [
        {
          "type": "breakfast|lunch|dinner",
          "name": "string (specific dish or restaurant name)",
          "cuisine": "string",
          "price_range": "$|$$|$$$",
          "description": "string (what makes this meal special or authentic)"
        }
      ]
    }
  ]
}`;
}

export default router;
