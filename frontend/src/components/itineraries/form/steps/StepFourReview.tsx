import type { CreateItineraryDraft } from "@/features/itineraries/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CalendarDays, MapPin, Sparkles, Users, Wallet } from "lucide-react";
import { formatRange, durationDays } from "@/features/itineraries/dateUtils";

export function StepFourReview({ draft }: { draft: CreateItineraryDraft }) {
  const hasDates = draft.startDateISO && draft.endDateISO;
  const range = hasDates ? formatRange(draft.startDateISO, draft.endDateISO) : "—";
  const days = hasDates ? durationDays(draft.startDateISO, draft.endDateISO) : 0;

  return (
    <div className="grid gap-6">
      <Card className="shadow-soft">
        <div className="grid gap-5 p-6 sm:p-7">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Ready to generate
            </div>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">Your trip snapshot</h3>
            <p className="mt-1 text-sm text-muted-foreground">If something feels off, go back and tweak it—no pressure.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                Destination
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{draft.destination || "—"}</div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="h-4 w-4 text-primary" />
                Dates
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {range} {days ? <span className="text-xs">· {days} days</span> : null}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-primary" />
                Travelers
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{draft.travelers || "—"}</div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Wallet className="h-4 w-4 text-primary" />
                Budget & pace
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {draft.budget ? <Badge variant="secondary">{draft.budget}</Badge> : <span className="text-sm text-muted-foreground">—</span>}
                {draft.pace ? <Badge variant="outline">{draft.pace}</Badge> : null}
                {draft.food ? <Badge variant="outline">{draft.food}</Badge> : null}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="text-sm font-medium">Interests</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {draft.interests.length ? (
                draft.interests.map((i) => (
                  <Badge key={i} variant="secondary" className="font-normal">
                    {i}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
          </div>

          {(draft.travelerVibe || draft.mustDos || draft.avoid) && (
            <div className="grid gap-3 rounded-xl border border-border bg-background p-4">
              <div className="text-sm font-medium">Notes</div>
              <div className="grid gap-2 text-sm text-muted-foreground">
                {draft.travelerVibe ? <p><span className="font-medium text-foreground">Vibe:</span> {draft.travelerVibe}</p> : null}
                {draft.mustDos ? <p><span className="font-medium text-foreground">Must-do:</span> {draft.mustDos}</p> : null}
                {draft.avoid ? <p><span className="font-medium text-foreground">Avoid:</span> {draft.avoid}</p> : null}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
        This is a static demo: the “Generate” button routes to a placeholder view. Later, this draft becomes the prompt + structured input for the AI model.
      </div>
    </div>
  );
}


