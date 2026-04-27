import { useAuth } from "@/contexts/AuthContext";
import { AIPromptBar } from "./AIPromptBar";
import { useNavigate } from "react-router-dom";
import GradientText from "@/components/ui/GradientText";

const INSPIRATION_CARDS = [
  {
    destination: "Bali",
    tagline: "Tropical paradise under ₹60K",
    gradient: "from-teal-900/50 to-emerald-900/20",
    border: "border-teal-500/20"
  },
  {
    destination: "Tokyo",
    tagline: "Neon streets & ancient shrines",
    gradient: "from-fuchsia-900/50 to-purple-900/20",
    border: "border-fuchsia-500/20"
  },
  {
    destination: "Santorini",
    tagline: "Sunsets and white-washed views",
    gradient: "from-blue-900/50 to-cyan-900/20",
    border: "border-blue-500/20"
  },
  {
    destination: "Rajasthan",
    tagline: "Palaces, deserts, and culture",
    gradient: "from-amber-900/50 to-orange-900/20",
    border: "border-amber-500/20"
  }
];

export function EmptyDashboard() {
  const { displayName } = useAuth();
  const navigate = useNavigate();
  const firstName = displayName?.split(" ")[0] || "Traveler";

  const hour = new Date().getHours();
  let timeGreeting = "evening";
  if (hour < 12) timeGreeting = "morning";
  else if (hour < 17) timeGreeting = "afternoon";

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-12 py-10 px-4 md:px-10 pb-24">
      {/* Greeting Header */}
      <section className="text-center space-y-4 pt-8">
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
          Good {timeGreeting}. Let's plan your first adventure.
        </p>
      </section>

      {/* AI Prompt Bar */}
      <section className="w-full flex flex-col items-center">
        <AIPromptBar variant="onboarding" />
        
        <div className="flex items-center gap-4 w-full max-w-2xl mt-8 mb-8">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[var(--app-text-primary)]/10" />
          <span className="text-xs text-[var(--app-text-primary)]/40 uppercase tracking-widest font-medium">or</span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[var(--app-text-primary)]/10" />
        </div>

        <button
          onClick={() => navigate("/create-trip")}
          className="cta-primary px-8 py-3.5 flex items-center gap-2"
        >
          CREATE YOUR FIRST TRIP <span className="ml-1">→</span>
        </button>
      </section>

      {/* Inspiration Strip */}
      <section className="w-full pt-12 pb-8 border-t border-[var(--app-text-primary)]/[0.05]">
        <div className="mb-8 text-center">
          <h3 className="font-serif text-[24px] text-[var(--app-text-primary)] font-light">Get Inspired</h3>
          <p className="text-[var(--app-text-primary)]/50 font-sans text-sm mt-1">Start with a popular destination</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {INSPIRATION_CARDS.map((card, idx) => (
            <button
              key={idx}
              className={`group flex flex-col items-start justify-center p-6 text-left rounded-xl bg-gradient-to-br ${card.gradient} border ${card.border} transition-all hover:scale-[1.02] active:scale-95`}
              onClick={() => navigate(`/create-trip?destination=${encodeURIComponent(card.destination)}`)}
            >
              <span className="font-serif text-2xl text-[var(--app-text-primary)] mb-2">{card.destination}</span>
              <span className="text-sm text-[var(--app-text-primary)]/70">{card.tagline}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
