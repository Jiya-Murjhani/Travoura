import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/hooks/usePreferences";
import { Step1TravelStyle, Step2Budget, Step3Dietary, Step4Mobility, Step5TripContext, Step6AI } from "./SharedForm";
import { UserPreferences } from "@/api/preferences";

interface PreferencesSlideOverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PreferencesSlideOver = ({ open, onOpenChange }: PreferencesSlideOverProps) => {
  const { preferences, updatePreferencesAsync, isUpdating } = usePreferences();
  const [localData, setLocalData] = useState<Partial<UserPreferences>>({});

  useEffect(() => {
    if (open && preferences) {
      setLocalData(preferences);
    }
  }, [open, preferences]);

  const handleChange = (key: keyof UserPreferences, value: any) => {
    setLocalData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await updatePreferencesAsync(localData);
    onOpenChange(false);
  };

  const tabs = [
    { id: "style", label: "Travel Style", component: Step1TravelStyle },
    { id: "budget", label: "Budget", component: Step2Budget },
    { id: "dietary", label: "Dietary", component: Step3Dietary },
    { id: "mobility", label: "Mobility", component: Step4Mobility },
    { id: "context", label: "Context", component: Step5TripContext },
    { id: "ai", label: "AI & System", component: Step6AI },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-md w-full p-0 gap-0 border-l border-[#8b78dd]/20 bg-[#221f33]">
        <SheetHeader className="p-6 border-b border-[#8b78dd]/20 bg-[#1a1826]">
          <SheetTitle className="text-white">Edit Preferences</SheetTitle>
          <SheetDescription className="text-[#8b78dd]">
            Update your profile to get the most personalized travel plans and recommendations.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="style" className="flex-1 flex flex-col w-full h-full">
            <div className="w-full px-6 pt-4 bg-[#1a1826] z-10 border-b border-[#8b78dd]/20">
              <TabsList className="w-full justify-start h-auto flex flex-wrap gap-1 bg-transparent p-0 pb-2">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="rounded-full px-4 py-1.5 text-[#8b78dd] data-[state=active]:bg-[#8b78dd] data-[state=active]:text-white border border-transparent data-[state=active]:border-[#8b78dd] hover:bg-[#8b78dd]/10"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-[#221f33]">
              {tabs.map((tab) => {
                const TabComponent = tab.component;
                return (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0 outline-none">
                    <TabComponent data={localData} onChange={handleChange} />
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        </div>

        <SheetFooter className="p-6 border-t border-[#8b78dd]/20 bg-[#1a1826]">
          <div className="flex w-full justify-between sm:justify-between items-center">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-[#8b78dd] hover:bg-[#8b78dd]/10 hover:text-white">Cancel</Button>
            <Button onClick={() => void handleSave()} disabled={isUpdating} className="min-w-24 bg-[#8b78dd] text-white hover:bg-[#8b78dd]/90">
              {isUpdating ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
