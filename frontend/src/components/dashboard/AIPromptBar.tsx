import { useState } from "react";
import { ArrowRight, Loader2, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AIPromptBarProps {
  variant?: "onboarding" | "returning";
  chips?: { text: string; prompt: string }[];
}

const CHIPS = [
  { text: "Solo Japan 🗺", prompt: "14 days in Japan for a solo traveler focusing on culture and food" },
  { text: "Bali ₹60K", prompt: "7 days in Bali under ₹60K for a couple seeking relaxation" },
  { text: "Weekend Goa →", prompt: "3 day weekend trip to Goa for partying and beaches" },
];

export function AIPromptBar({ variant = "returning", chips }: AIPromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const navigate = useNavigate();

  const displayChips = chips || CHIPS;

  const handleParse = async (textToParse: string) => {
    if (!textToParse.trim()) return;

    setIsParsing(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error("No active session");
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/parse-trip-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: textToParse }),
      });

      if (!response.ok) {
        throw new Error("Failed to parse intent");
      }

      const prefillData = await response.json();
      
      // Navigate to create-trip with prefill data
      navigate("/create-trip", { state: { prefill: prefillData } });
    } catch (error) {
      console.error("Parse error:", error);
      toast.error("Couldn't understand your trip. Try being more specific.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleParse(prompt);
    }
  };

  if (variant === "onboarding") {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <div className="relative w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Plane className="h-5 w-5 text-[var(--app-accent-primary)]" />
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='e.g. "10 days in Japan under ₹1.5L, couple..."'
            disabled={isParsing}
            className="w-full bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-text-primary)]/10 rounded-full py-4 pl-12 pr-14 text-[var(--app-text-primary)] placeholder:text-[var(--app-text-primary)]/40 focus:outline-none focus:border-[var(--app-accent-primary)]/50 transition-colors text-base"
          />
          <button
            onClick={() => handleParse(prompt)}
            disabled={isParsing || !prompt.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-[var(--app-accent-primary)] text-[var(--app-bg-primary)] rounded-full flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isParsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {displayChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(chip.prompt);
                handleParse(chip.prompt);
              }}
              className="px-4 py-1.5 rounded-full border border-[var(--app-text-primary)]/10 text-[var(--app-text-primary)]/70 text-xs font-medium hover:bg-[var(--app-accent-primary)]/10 hover:text-[var(--app-accent-primary)] hover:border-[var(--app-accent-primary)]/30 transition-colors bg-[var(--app-bg-primary)]"
            >
              {chip.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Returning variant
  return (
    <div className="w-full flex flex-col items-start">
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Plane className="h-4 w-4 text-[var(--app-accent-primary)]" />
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Plan another trip... e.g. "5 days in Dubai"'
          disabled={isParsing}
          className="w-full bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-accent-primary)]/30 rounded-[4px] py-3 pl-10 pr-12 text-[var(--app-text-primary)] placeholder:text-[var(--app-text-primary)]/40 focus:outline-none focus:border-[var(--app-accent-primary)] transition-colors text-sm"
        />
        <button
          onClick={() => handleParse(prompt)}
          disabled={isParsing || !prompt.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-[var(--app-accent-primary)] text-[var(--app-bg-primary)] rounded-sm flex items-center justify-center transition-transform hover:bg-[#b09055] disabled:opacity-50"
        >
          {isParsing ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
        </button>
      </div>

      {displayChips && displayChips.length > 0 && (
        <div className="flex flex-wrap items-center justify-start gap-2 mt-3">
          {displayChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(chip.prompt);
                handleParse(chip.prompt);
              }}
              className="px-3 py-1 rounded-[4px] border border-[var(--app-text-primary)]/10 text-[var(--app-text-primary)]/70 text-xs hover:bg-[var(--app-accent-primary)]/10 hover:text-[var(--app-accent-primary)] hover:border-[var(--app-accent-primary)]/30 transition-colors bg-transparent"
            >
              {chip.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
