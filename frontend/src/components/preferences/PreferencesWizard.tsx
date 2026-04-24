import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/hooks/usePreferences";
import { useAuth } from "@/contexts/AuthContext";
import { X } from "lucide-react";
import { Step1TravelStyle, Step2Budget, Step3Dietary, Step4Mobility, Step5TripContext, Step6AI } from "./SharedForm";
import { UserPreferences } from "@/api/preferences";

const TOTAL_STEPS = 6;

export const PreferencesWizard = () => {
  const { preferences, updatePreferencesAsync, isLoading } = usePreferences();
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [localData, setLocalData] = useState<Partial<UserPreferences>>({});

  useEffect(() => {
    // Show banner if user has no preferences row (null) or preferences.completed is false
    if (user && !isLoading && (!preferences || !preferences.completed)) {
      setShowBanner(true);
    }
  }, [preferences, isLoading, user]);

  useEffect(() => {
    if (preferences) {
      setLocalData(preferences);
    }
  }, [preferences]);

  const handleChange = (key: keyof UserPreferences, value: any) => {
    setLocalData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    // Optimistically save current step data
    await updatePreferencesAsync(localData);
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(c => c + 1);
    } else {
      // Final step complete
      await updatePreferencesAsync({ ...localData, completed: true });
      setShowBanner(false);
      setIsOpen(false);
    }
  };

  const handleSkip = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(c => c + 1);
    } else {
      updatePreferencesAsync({ completed: true });
      setShowBanner(false);
      setIsOpen(false);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
  };

  const steps = [
    { title: "Travel Style", component: Step1TravelStyle },
    { title: "Budget", component: Step2Budget },
    { title: "Dietary", component: Step3Dietary },
    { title: "Mobility", component: Step4Mobility },
    { title: "Context", component: Step5TripContext },
    { title: "Preferences", component: Step6AI },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  if (isLoading || !user) return null;

  return (
    <>
      {showBanner && (
        <div className="bg-primary/10 border-b border-primary/20 p-3 md:p-4 animate-in slide-in-from-top flex items-center justify-between text-sm md:text-base sticky top-16 z-10 w-full backdrop-blur-md">
          <div>
            <span className="font-semibold text-foreground mr-2">Set your preferences!</span>
            <span className="text-muted-foreground hidden md:inline">Get better, personalized travel recommendations.</span>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={() => setIsOpen(true)}>Start Setup</Button>
            <button onClick={handleDismissBanner} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background border-border shadow-2xl rounded-2xl">
          <DialogTitle className="sr-only">Preferences Setup</DialogTitle>
          <DialogDescription className="sr-only">Set your travel preferences to get personalized recommendations.</DialogDescription>
          <div className="p-6 pb-4 border-b border-border bg-muted/20">
            <div className="mb-4">
              <Progress value={(currentStep / TOTAL_STEPS) * 100} className="h-2 rounded-full" />
            </div>
            
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i + 1)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors
                    ${currentStep === i + 1 ? "bg-primary text-primary-foreground" : 
                      currentStep > i + 1 ? "bg-primary/20 text-primary hover:bg-primary/30" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  {s.title}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-2">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">Step {currentStep}: {steps[currentStep-1].title}</h2>
            </div>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <CurrentStepComponent data={localData} onChange={handleChange} />
          </div>

          <div className="p-4 border-t border-border bg-muted/20 flex justify-between items-center">
            <button onClick={handleSkip} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
              Skip this step
            </button>
            <div className="space-x-3">
              {currentStep > 1 && (
                <Button variant="outline" onClick={() => setCurrentStep(c => c - 1)}>Back</Button>
              )}
              <Button onClick={() => void handleNext()} className="min-w-24">
                {currentStep === TOTAL_STEPS ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
