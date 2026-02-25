import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectableCard } from "../SelectableCard";
import { Users, Wallet } from "lucide-react";
import * as React from "react";
import type { CreateItineraryDraft, ItineraryBudget } from "@/features/itineraries/types";

const budgets: Array<{ value: ItineraryBudget; title: string; description: string; icon: React.ReactNode }> = [
  { value: "Budget", title: "Budget 💸", description: "Value finds, smart choices.", icon: <Wallet className="h-4 w-4" /> },
  { value: "Comfort", title: "Comfort 💼", description: "A little extra ease.", icon: <Wallet className="h-4 w-4" /> },
  { value: "Luxury", title: "Luxury 💎", description: "Effortless, elevated.", icon: <Wallet className="h-4 w-4" /> },
];

export function StepOneDetails({
  draft,
  onChange,
}: {
  draft: CreateItineraryDraft;
  onChange: (next: CreateItineraryDraft) => void;
}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          value={draft.destination}
          placeholder="Where do you want to disappear to?"
          onChange={(e) => onChange({ ...draft, destination: e.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={draft.startDateISO}
            onChange={(e) => onChange({ ...draft, startDateISO: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={draft.endDateISO}
            onChange={(e) => onChange({ ...draft, endDateISO: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="travelers">Number of Travelers</Label>
        <div className="relative">
          <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="travelers"
            inputMode="numeric"
            value={draft.travelers}
            placeholder="2"
            className="pl-9"
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") return onChange({ ...draft, travelers: "" });
              const num = Number(raw);
              if (Number.isNaN(num)) return;
              onChange({ ...draft, travelers: Math.max(1, Math.floor(num)) });
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">We’ll tune pacing and suggestions to your group size.</p>
      </div>

      <div className="grid gap-3">
        <div>
          <Label>Budget Range</Label>
          <p className="mt-1 text-xs text-muted-foreground">No judgment—this just helps set the tone.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {budgets.map((b) => (
            <SelectableCard
              key={b.value}
              title={b.title}
              description={b.description}
              icon={b.icon}
              selected={draft.budget === b.value}
              onSelect={() => onChange({ ...draft, budget: b.value })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


