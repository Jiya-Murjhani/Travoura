import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import * as Constants from "./constants";
import { UserPreferences } from "@/api/preferences";

interface StepProps {
  data: Partial<UserPreferences>;
  onChange: (key: keyof UserPreferences, value: any) => void;
}

const ChipContainer = ({ children, label, caption }: { children: React.ReactNode, label?: string, caption?: string }) => (
  <div className="space-y-3 mb-6">
    {label && <Label className="text-base text-white font-semibold">{label}</Label>}
    {caption && <p className="text-xs text-[#8b78dd]/70 mt-0 mb-2">{caption}</p>}
    <div className="flex flex-wrap gap-2">
      {children}
    </div>
  </div>
);

const ChipItem = ({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
      ${selected ? "bg-[#8b78dd] text-white border-[#8b78dd] shadow-sm scale-[1.02]" : "bg-[#1a1826] text-[#8b78dd] border-[#8b78dd]/20 hover:border-[#8b78dd]/50 hover:bg-[#8b78dd]/10"}`}
  >
    {label}
  </button>
);

export const Step1TravelStyle = ({ data, onChange }: StepProps) => {
  const toggleArray = (field: keyof UserPreferences, value: string) => {
    const current = (data[field] as string[]) || [];
    onChange(field, current.includes(value) ? current.filter(item => item !== value) : [...current, value]);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <ChipContainer label="What's your typical travel style?">
        {Constants.TRAVEL_STYLES.map((ts) => (
          <ChipItem key={ts.value} label={ts.label} selected={data.travel_style === ts.value} onClick={() => onChange("travel_style", ts.value)} />
        ))}
      </ChipContainer>

      <ChipContainer label="What are your main travel interests?">
        {Constants.INTERESTS.map((int) => (
          <ChipItem key={int.value} label={int.label} selected={(data.interests || []).includes(int.value)} onClick={() => toggleArray("interests", int.value)} />
        ))}
      </ChipContainer>

      <ChipContainer label="Preferred accommodation tier">
        {Constants.ACCOMMODATION_TIERS.map((tier) => (
          <ChipItem key={tier.value} label={tier.label} selected={data.accommodation_tier === tier.value} onClick={() => onChange("accommodation_tier", tier.value)} />
        ))}
      </ChipContainer>

      <ChipContainer label="Who do you usually travel with?">
        {Constants.GROUP_TYPES.map((group) => (
          <ChipItem key={group.value} label={group.label} selected={data.group_type === group.value} onClick={() => onChange("group_type", group.value)} />
        ))}
      </ChipContainer>

      {data.group_type === "Family" && (
        <div className="space-y-2 animate-fade-in mt-4">
          <Label className="text-white">Ages of children</Label>
          <Input 
            value={(data as any).child_ages || ""} 
            onChange={(e) => onChange("child_ages" as any, e.target.value)} 
            placeholder="e.g. 5, 8, 12" 
            className="rounded-xl border-[#8b78dd]/20 bg-[#1a1826] text-[#8b78dd] placeholder-[#8b78dd]/40 focus-visible:ring-[#8b78dd]"
          />
        </div>
      )}
    </div>
  );
};

export const Step2Budget = ({ data, onChange }: StepProps) => {
  const toggleArray = (field: keyof UserPreferences, value: string) => {
    const current = (data[field] as string[]) || [];
    onChange(field, current.includes(value) ? current.filter(item => item !== value) : [...current, value]);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <ChipContainer label="Typical trip budget" caption="This affects hotel and activity recommendations.">
        {Constants.BUDGET_TIERS.map((tier) => (
          <ChipItem key={tier.value} label={tier.label} selected={data.budget_tier === tier.value} onClick={() => onChange("budget_tier", tier.value)} />
        ))}
      </ChipContainer>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white">Home Currency</Label>
          <Input value={data.home_currency || ""} onChange={(e) => onChange("home_currency", e.target.value.toUpperCase())} placeholder="e.g. USD" maxLength={3} className="rounded-xl border-[#8b78dd]/20 bg-[#1a1826] text-[#8b78dd] placeholder-[#8b78dd]/40 focus-visible:ring-[#8b78dd]" />
        </div>
        <div className="space-y-2">
          <Label className="text-white">Daily Max Spend</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-[#8b78dd]/60">{data.home_currency || "$"}</span>
            <Input type="number" value={data.budget_daily_max || ""} onChange={(e) => onChange("budget_daily_max", parseFloat(e.target.value))} placeholder="e.g. 200" className="pl-10 rounded-xl border-[#8b78dd]/20 bg-[#1a1826] text-[#8b78dd] placeholder-[#8b78dd]/40 focus-visible:ring-[#8b78dd]" />
          </div>
        </div>
      </div>

      <ChipContainer label="Where do you prefer to splurge?">
        {Constants.SPEND_PRIORITIES.map((sp) => (
          <ChipItem key={sp.value} label={sp.label} selected={(data.spend_priority || []).includes(sp.value)} onClick={() => toggleArray("spend_priority", sp.value)} />
        ))}
      </ChipContainer>
    </div>
  );
};

export const Step3Dietary = ({ data, onChange }: StepProps) => {
  const toggleArray = (field: keyof UserPreferences, value: string) => {
    const current = (data[field] as string[]) || [];
    onChange(field, current.includes(value) ? current.filter(item => item !== value) : [...current, value]);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="space-y-2 mb-6">
        <Label className="text-base text-white font-semibold">Dietary needs</Label>
        <select 
          className="flex h-10 w-full rounded-xl border border-[#8b78dd]/20 bg-[#1a1826] text-[#8b78dd] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-[#8b78dd] disabled:cursor-not-allowed disabled:opacity-50"
          value={data.dietary_prefs || ""}
          onChange={(e) => onChange("dietary_prefs", e.target.value)}
        >
          <option value="" disabled>Select...</option>
          {Constants.DIETARY_PREFS.map(dp => <option key={dp.value} value={dp.value}>{dp.label}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Food allergies</Label>
        <Input value={data.food_allergies || ""} onChange={(e) => onChange("food_allergies", e.target.value)} placeholder="e.g. peanuts, shellfish" className="rounded-xl border-[#8b78dd]/20 bg-[#1a1826] text-[#8b78dd] placeholder-[#8b78dd]/40 focus-visible:ring-[#8b78dd]" />
      </div>

      {data.dietary_prefs && data.dietary_prefs !== "None" && (
        <ChipContainer label="Cuisine preferences">
          {Constants.CUISINES.map((c) => (
            <ChipItem key={c.value} label={c.label} selected={(data.cuisine_likes || []).includes(c.value)} onClick={() => toggleArray("cuisine_likes", c.value)} />
          ))}
        </ChipContainer>
      )}
    </div>
  );
};

export const Step4Mobility = ({ data, onChange }: StepProps) => {
  const toggleArray = (field: keyof UserPreferences, value: string) => {
    const current = (data[field] as string[]) || [];
    onChange(field, current.includes(value) ? current.filter(item => item !== value) : [...current, value]);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <ChipContainer label="Preferred transit methods">
        {Constants.MOBILITY_MODES.map((mode) => (
          <ChipItem key={mode.value} label={mode.label} selected={(data.mobility_modes || []).includes(mode.value)} onClick={() => toggleArray("mobility_modes", mode.value)} />
        ))}
      </ChipContainer>

      <ChipContainer label="Max comfortable walking distance per day">
        {Constants.MAX_WALKING_DISTANCES.map((d) => (
          <ChipItem key={d.value} label={d.label} selected={data.max_walking_distance === d.value} onClick={() => onChange("max_walking_distance", d.value)} />
        ))}
      </ChipContainer>

      <div className="space-y-2">
        <Label className="text-white">Accessibility needs (Optional)</Label>
        <Input value={data.accessibility_needs || ""} onChange={(e) => onChange("accessibility_needs", e.target.value)} placeholder="e.g. wheelchair access required" className="rounded-xl border-[#8b78dd]/20 bg-[#1a1826] text-[#8b78dd] placeholder-[#8b78dd]/40 focus-visible:ring-[#8b78dd]" />
      </div>
    </div>
  );
};

export const Step5TripContext = ({ data, onChange }: StepProps) => {
  return (
    <div className="animate-fade-in space-y-6">
      <ChipContainer label="Typical group type">
        {Constants.GROUP_TYPES.map((group) => (
          <ChipItem key={group.value} label={group.label} selected={data.group_type === group.value} onClick={() => onChange("group_type", group.value)} />
        ))}
      </ChipContainer>

      <div className="space-y-2">
        <Label className="text-white">Home City / Airport</Label>
        <Input value={data.home_city || ""} onChange={(e) => onChange("home_city", e.target.value)} placeholder="e.g. New York, JFK" className="rounded-xl border-[#8b78dd]/20 bg-[#1a1826] text-[#8b78dd] placeholder-[#8b78dd]/40 focus-visible:ring-[#8b78dd]" />
      </div>

      <div className="space-y-2">
        <Label className="text-white">Passports</Label>
        <Input value={(data.passports || []).join(", ")} onChange={(e) => onChange("passports", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="e.g. US, UK (comma separated)" className="rounded-xl border-[#8b78dd]/20 bg-[#1a1826] text-[#8b78dd] placeholder-[#8b78dd]/40 focus-visible:ring-[#8b78dd]" />
      </div>
    </div>
  );
};

export const Step6AI = ({ data, onChange }: StepProps) => {
  return (
    <div className="animate-fade-in space-y-6">
      <ChipContainer label="AI Verbosity" caption="This affects how much text the AI generates for recommendations.">
        {Constants.AI_VERBOSITIES.map((v) => (
          <ChipItem key={v.value} label={v.label} selected={data.ai_verbosity === v.value} onClick={() => onChange("ai_verbosity", v.value)} />
        ))}
      </ChipContainer>

      <ChipContainer label="Itinerary Density">
        {Constants.ITINERARY_DENSITIES.map((d) => (
          <ChipItem key={d.value} label={d.label} selected={data.itinerary_density === d.value} onClick={() => onChange("itinerary_density", d.value)} />
        ))}
      </ChipContainer>

      <div className="flex items-center space-x-2 pt-4">
        <Switch id="auto-apply" checked={data.auto_apply_prefs ?? true} onCheckedChange={(checked) => onChange("auto_apply_prefs", checked)} />
        <Label className="text-white" htmlFor="auto-apply">Auto-apply my preferences to new plans</Label>
      </div>
    </div>
  );
};
