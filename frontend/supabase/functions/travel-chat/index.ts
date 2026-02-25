import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Travoura AI, a knowledgeable and friendly travel assistant specializing in helping users plan perfect trips. 

Your expertise includes:
- Destination recommendations based on preferences, budget, and season
- Flight and hotel booking advice
- Creating detailed day-by-day itineraries
- Local guide recommendations
- Safety tips and travel advisories
- Cultural insights and local experiences
- Budget planning and cost optimization
- Best times to visit destinations
- Visa requirements and travel documentation
- Packing suggestions
- Hidden gems and off-the-beaten-path locations

Communication style:
- Be warm, enthusiastic, and helpful
- Keep responses concise but informative (2-4 sentences unless more detail is requested)
- Ask clarifying questions when needed (budget, travel dates, preferences)
- Provide specific, actionable recommendations
- Use a friendly, conversational tone
- Include practical tips and insider knowledge

When users ask for trip suggestions:
1. Ask about their interests, budget, and preferred travel dates
2. Suggest 2-3 destinations with brief highlights
3. Offer to create a detailed itinerary for their chosen destination

Always prioritize user safety, cultural sensitivity, and sustainable travel practices.`;

    console.log("Received messages:", messages);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Error in travel-chat function:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
