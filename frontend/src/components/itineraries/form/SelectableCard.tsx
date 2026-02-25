import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import * as React from "react";

export function SelectableCard({
  title,
  description,
  icon,
  selected,
  onSelect,
  disabled,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  return (
    <Card
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled ? true : undefined}
      aria-pressed={selected}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={
        disabled
          ? undefined
          : (e) => {
              // Make keyboard selection feel button-like (Space should not scroll the page).
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
              }
            }
      }
      className={cn(
        "card-hover shadow-soft cursor-pointer select-none p-4 transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected ? "ring-2 ring-primary bg-primary/5" : "bg-background",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <div className="flex items-start gap-3">
        {icon ? <div className="mt-0.5 text-primary">{icon}</div> : null}
        <div className="min-w-0">
          <div className="font-medium">{title}</div>
          {description ? <div className="mt-1 text-sm text-muted-foreground">{description}</div> : null}
        </div>
      </div>
    </Card>
  );
}


