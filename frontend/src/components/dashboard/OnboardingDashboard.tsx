import { useAuth } from "@/contexts/AuthContext";
import { AIPromptBar } from "./AIPromptBar";
import { SetupChecklist } from "./SetupChecklist";
import { useNavigate } from "react-router-dom";
import GradientText from "@/components/ui/GradientText";

interface OnboardingDashboardProps {
  preferencesComplete: boolean;
  hasTrips: boolean;
  hasItineraries: boolean;
  hasBudget: boolean;
}

const INSPIRATION_CARDS = [
  {
    country: "Japan",
    city: "Tokyo",
    budget: "Avg ₹1.2L",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80",
    prompt: "7 days in Tokyo under ₹1.2L",
  },
  {
    country: "Indonesia",
    city: "Bali",
    budget: "Avg ₹85K",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80",
    prompt: "7 days in Bali under ₹85K",
  },
  {
    country: "France",
    city: "Paris",
    budget: "Avg ₹1.8L",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80",
    prompt: "7 days in Paris under ₹1.8L",
  },
  {
    country: "India",
    city: "Goa",
    budget: "Avg ₹25K",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80",
    prompt: "7 days in Goa under ₹25K",
  },
];

export function OnboardingDashboard({
  preferencesComplete,
  hasTrips,
  hasItineraries,
  hasBudget,
}: OnboardingDashboardProps) {
  const { displayName } = useAuth();
  const navigate = useNavigate();
  const firstName = displayName?.split(" ")[0] || "Traveler";

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-12 py-10 px-4 md:px-10">
      
      {/* Welcome Header */}
      <section className="text-center space-y-4">
        <h1 className="font-serif text-[48px] md:text-[52px] font-light flex justify-center leading-tight">
          <GradientText
            colors={["#5227FF", "#FF9FFC", "#B497CF"]}
            animationSpeed={3}
            showBorder={false}
            className="pb-2"
          >
            Welcome to Travoura, {firstName}.
          </GradientText>
        </h1>
        <p className="text-[var(--app-text-primary)]/50 font-sans text-xl">
          Let's plan your first adventure.
        </p>
      </section>

      {/* AI Prompt Bar */}
      <section className="w-full flex flex-col items-center">
        <AIPromptBar variant="onboarding" />
        
        <div className="flex items-center gap-4 w-full max-w-2xl mt-8 mb-8">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[var(--app-text-primary)]/10" />
          <span className="text-xs text-[var(--app-text-primary)]/40 uppercase tracking-widest font-medium">or start with a structured form</span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[var(--app-text-primary)]/10" />
        </div>

        <button
          onClick={() => navigate("/create-trip")}
          className="bg-[var(--app-accent-primary)] text-[var(--app-bg-primary)] px-6 py-2.5 rounded-[2px] font-sans text-[13px] font-bold uppercase tracking-[0.06em] hover:bg-[#b09055] transition-colors flex items-center gap-2"
        >
          <span className="text-lg leading-none mb-0.5">+</span> Create your first trip <span className="ml-1">→</span>
        </button>
      </section>

      {/* Setup Checklist */}
      <section className="w-full pt-8">
        <SetupChecklist 
          preferencesComplete={preferencesComplete}
          hasTrips={hasTrips}
          hasItineraries={hasItineraries}
          hasBudget={hasBudget}
        />
      </section>

      {/* Inspiration Strip */}
      <section className="w-full pt-12 pb-8 border-t border-[var(--app-text-primary)]/[0.05]">
        <div className="mb-6">
          <h3 className="font-serif text-[20px] text-[var(--app-text-primary)] font-light">Where do others go?</h3>
          <p className="text-[var(--app-text-primary)]/50 font-sans text-sm">Popular first trips on Travoura</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INSPIRATION_CARDS.map((card, idx) => (
            <button
              key={idx}
              className="group relative flex flex-col items-start text-left bg-[var(--app-text-primary)]/[0.03] border border-[var(--app-text-primary)]/[0.08] rounded-lg overflow-hidden transition-all hover:border-[var(--app-accent-primary)]/30 aspect-[4/5] w-full"
              onClick={() => {
                // Populate the prompt bar visually and trigger if needed
                // For simplicity, we can just navigate directly with prefill or dispatch an event
                // Let's use the simplest approach: prompt bar has local state, but we can just use the same API call
                navigate("/create-trip", { state: { prefill: { notes: card.prompt } } });
              }}
            >
              <div className="absolute inset-0">
                <img 
                  src={card.image} 
                  alt={card.city} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-bg-primary)] via-[var(--app-bg-primary)]/40 to-transparent" />
              </div>
              <div className="relative mt-auto p-4 w-full flex flex-col gap-1">
                <span className="text-[var(--app-accent-primary)] text-[10px] uppercase tracking-widest font-semibold">{card.country}</span>
                <span className="font-serif text-xl text-[var(--app-text-primary)] leading-none">{card.city}</span>
                <span className="inline-block px-2 py-0.5 mt-1 bg-[var(--app-text-primary)]/10 rounded border border-[var(--app-text-primary)]/20 text-[11px] text-[var(--app-text-primary)]/80 w-fit backdrop-blur-sm">
                  {card.budget}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
