import type { CreateItineraryDraft } from "@/features/itineraries/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const LIMIT = 280;

function remaining(text: string) {
  return Math.max(0, LIMIT - text.length);
}

export function StepThreePersonalization({
  draft,
  onChange,
}: {
  draft: CreateItineraryDraft;
  onChange: (next: CreateItineraryDraft) => void;
}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="travelerVibe">What kind of traveler are you?</Label>
        <Textarea
          id="travelerVibe"
          value={draft.travelerVibe}
          placeholder="Example: I love wandering without a strict schedule, but I’ll wake up early for something special."
          onChange={(e) => onChange({ ...draft, travelerVibe: e.target.value.slice(0, LIMIT) })}
        />
        <p className="text-xs text-muted-foreground">{remaining(draft.travelerVibe)} characters left.</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="mustDos">Any must-see or must-do experiences?</Label>
        <Textarea
          id="mustDos"
          value={draft.mustDos}
          placeholder="Example: A serene temple morning, one truly memorable local meal, a scenic day trip."
          onChange={(e) => onChange({ ...draft, mustDos: e.target.value.slice(0, LIMIT) })}
        />
        <p className="text-xs text-muted-foreground">{remaining(draft.mustDos)} characters left.</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="avoid">Anything you want to avoid on this trip?</Label>
        <Textarea
          id="avoid"
          value={draft.avoid}
          placeholder="Example: overly touristy traps, super late nights, long drives."
          onChange={(e) => onChange({ ...draft, avoid: e.target.value.slice(0, LIMIT) })}
        />
        <p className="text-xs text-muted-foreground">{remaining(draft.avoid)} characters left.</p>
      </div>
    </div>
  );
}


