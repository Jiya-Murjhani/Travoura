import type { CreateItineraryDraft, FoodPreference, ItineraryInterest, ItineraryPace } from "@/features/itineraries/types";
import { Label } from "@/components/ui/label";
import { SelectableCard } from "../SelectableCard";
import { Leaf, UtensilsCrossed, Landmark, ShoppingBag, Mountain, Gauge, Coffee, Soup, BadgeCheck } from "lucide-react";
import * as React from "react";

const paces: Array<{ value: ItineraryPace; title: string; description: string; icon: React.ReactNode }> = [
  { value: "Chill", title: "Chill", description: "Slow mornings. Plenty of breathing room.", icon: <Gauge className="h-4 w-4" /> },
  { value: "Balanced", title: "Balanced", description: "A full day, still unhurried.", icon: <BadgeCheck className="h-4 w-4" /> },
  { value: "Packed", title: "Packed", description: "Maximize time. More stops, more energy.", icon: <Gauge className="h-4 w-4" /> },
];

const interests: Array<{ value: ItineraryInterest; title: string; icon: React.ReactNode }> = [
  { value: "Nature", title: "🌿 Nature", icon: <Leaf className="h-4 w-4" /> },
  { value: "Food", title: "🍜 Food", icon: <UtensilsCrossed className="h-4 w-4" /> },
  { value: "Culture", title: "🏛 Culture", icon: <Landmark className="h-4 w-4" /> },
  { value: "Shopping", title: "🛍 Shopping", icon: <ShoppingBag className="h-4 w-4" /> },
  { value: "Adventure", title: "🧗 Adventure", icon: <Mountain className="h-4 w-4" /> },
];

const foods: Array<{ value: FoodPreference; title: string; description: string; icon: React.ReactNode }> = [
  { value: "Street Food", title: "Street Food", description: "Markets, stalls, quick bites.", icon: <Soup className="h-4 w-4" /> },
  { value: "Cafés", title: "Cafés", description: "Coffee, pastries, slow afternoons.", icon: <Coffee className="h-4 w-4" /> },
  { value: "Fine Dining", title: "Fine Dining", description: "Reservations, tasting menus, moments.", icon: <UtensilsCrossed className="h-4 w-4" /> },
];

export function StepTwoPreferences({
  draft,
  onChange,
}: {
  draft: CreateItineraryDraft;
  onChange: (next: CreateItineraryDraft) => void;
}) {
  const toggleInterest = (value: ItineraryInterest) => {
    const exists = draft.interests.includes(value);
    onChange({
      ...draft,
      interests: exists ? draft.interests.filter((i) => i !== value) : [...draft.interests, value],
    });
  };

  return (
    <div className="grid gap-8">
      <section className="grid gap-3">
        <div>
          <Label>Travel Pace</Label>
          <p className="mt-1 text-xs text-muted-foreground">We’ll shape days so they feel intentional—not exhausting.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {paces.map((p) => (
            <SelectableCard
              key={p.value}
              title={p.title}
              description={p.description}
              icon={p.icon}
              selected={draft.pace === p.value}
              onSelect={() => onChange({ ...draft, pace: p.value })}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-3">
        <div>
          <Label>Interests</Label>
          <p className="mt-1 text-xs text-muted-foreground">Pick a few. We’ll balance highlights with hidden gems.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {interests.map((i) => (
            <SelectableCard
              key={i.value}
              title={i.title}
              icon={i.icon}
              selected={draft.interests.includes(i.value)}
              onSelect={() => toggleInterest(i.value)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-3">
        <div>
          <Label>Food Preference</Label>
          <p className="mt-1 text-xs text-muted-foreground">Not a rule—just a nudge in the right direction.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {foods.map((f) => (
            <SelectableCard
              key={f.value}
              title={f.title}
              description={f.description}
              icon={f.icon}
              selected={draft.food === f.value}
              onSelect={() => onChange({ ...draft, food: f.value })}
            />
          ))}
        </div>
      </section>
    </div>
  );
}


