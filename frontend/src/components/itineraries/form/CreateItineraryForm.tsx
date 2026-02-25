import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateItineraryDraft } from "@/features/itineraries/types";
import { StepOneDetails } from "./steps/StepOneDetails";
import { StepTwoPreferences } from "./steps/StepTwoPreferences";
import { StepThreePersonalization } from "./steps/StepThreePersonalization";
import { StepFourReview } from "./steps/StepFourReview";

const MAX_STEP = 4;

const initialDraft: CreateItineraryDraft = {
  destination: "",
  startDateISO: "",
  endDateISO: "",
  travelers: "",
  budget: "",
  pace: "",
  interests: [],
  food: "",
  travelerVibe: "",
  mustDos: "",
  avoid: "",
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function isStepValid(step: number, draft: CreateItineraryDraft) {
  if (step === 1) {
    return (
      draft.destination.trim().length > 0 &&
      draft.startDateISO.length > 0 &&
      draft.endDateISO.length > 0 &&
      draft.travelers !== "" &&
      Number(draft.travelers) > 0 &&
      draft.budget !== ""
    );
  }
  if (step === 2) {
    return draft.pace !== "" && draft.interests.length > 0 && draft.food !== "";
  }
  // Step 3 is optional by design—people can be “not sure yet”.
  if (step === 3) return true;
  if (step === 4) return true;
  return false;
}

export function CreateItineraryForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<CreateItineraryDraft>(initialDraft);

  const progress = useMemo(() => Math.round(((step - 1) / (MAX_STEP - 1)) * 100), [step]);
  const canGoNext = isStepValid(step, draft);
  const canGoBack = step > 1;

  const next = () => {
    if (!canGoNext) {
      toast({
        title: "Almost there",
        description: "Just a couple details—then we’ll move on.",
      });
      return;
    }
    setStep((s) => clamp(s + 1, 1, MAX_STEP));
  };

  const back = () => setStep((s) => clamp(s - 1, 1, MAX_STEP));

  const generate = () => {
    navigate("/itineraries/generated", { state: { draft } });
  };

  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-soft text-white">
      <div className="border-b border-white/20 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/70">Step {step} of {MAX_STEP}</p>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              {step === 1
                ? "Basic trip details"
                : step === 2
                  ? "Style & preferences"
                  : step === 3
                    ? "Personalization"
                    : "Review & generate"}
            </h2>
            <p className="mt-1 text-sm text-white/70">
              {step === 1
                ? "Start with the essentials. You can fine-tune the vibe next."
                : step === 2
                  ? "Pick what matters—no dropdown fatigue."
                  : step === 3
                    ? "Optional, but powerful. A few sentences go a long way."
                    : "Take one last look before we generate."}
            </p>
          </div>

          <div className="min-w-[220px]">
            <Progress value={progress} />
            <div className="mt-2 flex justify-between text-xs text-white/70">
              <span>Start</span>
              <span>Generate</span>
            </div>
          </div>
        </div>
      </div>

      <div className={cn("p-6", "animate-fade-in", "[&_label]:text-white [&_p]:text-white/80 [&_span]:text-white/70 [&_input]:bg-white/20 [&_input]:border-white/30 [&_input]:text-white [&_input]:placeholder:text-white/50 [&_textarea]:bg-white/20 [&_textarea]:border-white/30 [&_textarea]:text-white [&_textarea]:placeholder:text-white/50 [&_div[role='button']]:bg-white/10 [&_div[role='button']]:border-white/20 [&_div[role='button']]:text-white")}>
        {step === 1 ? (
          <StepOneDetails draft={draft} onChange={setDraft} />
        ) : step === 2 ? (
          <StepTwoPreferences draft={draft} onChange={setDraft} />
        ) : step === 3 ? (
          <StepThreePersonalization draft={draft} onChange={setDraft} />
        ) : (
          <StepFourReview draft={draft} />
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/20 p-6">
        <Button variant="ghost" onClick={back} disabled={!canGoBack}>
          Back
        </Button>

        {step < MAX_STEP ? (
          <Button onClick={next} disabled={!canGoNext}>
            Next
          </Button>
        ) : (
          <Button onClick={generate} className="bg-gradient-hero text-primary-foreground hover:opacity-95">
            Generate My Itinerary ✨
          </Button>
        )}
      </div>
    </div>
  );
}


