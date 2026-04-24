import { useAuth } from "@/contexts/AuthContext";
import HomeNavbar from "@/components/home/HomeNavbar";
import HeroSection from "@/components/home/HeroSection";
import ArrivalSection from "@/components/home/ArrivalSection";
import FlightPathSection from "@/components/home/FlightPathSection";
import AISection from "@/components/home/AISection";
import DestinationsSection from "@/components/home/DestinationsSection";
import BudgetSection from "@/components/home/BudgetSection";
import PassportWallSection from "@/components/home/PassportWallSection";
import AlertBadgeStack from "@/components/home/AlertBadgeStack";
import { Link } from "react-router-dom";

// ─── Transition Gradient ──────────────────────────────────────────────────────

function TransitionGradient({ from, to, height = 80 }: { from: string; to: string; height?: number }) {
  return (
    <div style={{
      height,
      background: `linear-gradient(to bottom, ${from} 0%, ${to} 100%)`,
      pointerEvents: "none",
    }} />
  );
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────

function FooterCTA() {
  return (
    <>
      <style>{`
        .footer-cta-btn {
          height: 60px;
          padding: 0 48px;
          border-radius: 30px;
          background: var(--color-gold, #C9A84C);
          color: var(--color-void, #0A0A0B);
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: box-shadow 300ms ease, transform 300ms ease;
          margin-top: 36px;
        }
        .footer-cta-btn:hover {
          box-shadow: 0 12px 40px rgba(201,168,76,0.4);
          transform: translateY(-3px);
        }
      `}</style>
      <section style={{
        background: "var(--color-void, #0A0A0B)",
        padding: "80px var(--section-px, 48px)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(42px, 5vw, 68px)",
            fontWeight: 500,
            color: "#F7F5F0",
            margin: "0 0 16px",
            lineHeight: 1.1,
          }}>
            Ready to go somewhere?
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 18,
            fontWeight: 300,
            color: "rgba(247,245,240,0.5)",
            margin: 0,
          }}>
            Let the AI plan your perfect trip in seconds.
          </p>
          <div>
            <Link to="/generate-itinerary" className="footer-cta-btn">
              Start Planning for Free →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const { user } = useAuth();
  const userName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Traveller";

  // Fallback stats — replace with real React Query hooks when data layer is ready
  const stats = {
    tripsCount: 0,
    countriesCount: 0,
    budgetTracked: "₹0",
  };

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
      `}</style>

      <main className="w-full overflow-x-hidden" style={{ background: 'var(--color-surface)' }}>

        {/* Fixed navbar — renders on top of the hero */}
        <HomeNavbar />

        {/* 1 — Hero */}
        <HeroSection userName={userName} onSearchSubmit={(q) => console.log(q)} />

        {/* 2 — Arrival stats */}
        <ArrivalSection
          tripsCount={stats.tripsCount}
          countriesCount={stats.countriesCount}
          budgetTracked={stats.budgetTracked}
        />

        {/* 3 — Flight path (desktop only) */}
        <div className="hidden md:block">
          <FlightPathSection />
        </div>

        {/* Transition: surface → void */}
        <TransitionGradient
          from="var(--color-surface, #F7F5F0)"
          to="var(--color-void, #0A0A0B)"
          height={80}
        />

        {/* 4 — AI Section */}
        <AISection />

        {/* Transition: void → surface */}
        <TransitionGradient
          from="var(--color-void, #0A0A0B)"
          to="var(--color-surface, #F7F5F0)"
          height={60}
        />

        {/* 5 — Destinations */}
        <DestinationsSection />

        {/* Transition: surface → obsidian */}
        <TransitionGradient
          from="var(--color-surface, #F7F5F0)"
          to="var(--color-obsidian, #141416)"
          height={60}
        />

        {/* 6 — Budget Intelligence */}
        <BudgetSection />

        {/* Transition: obsidian → surface */}
        <TransitionGradient
          from="var(--color-obsidian, #141416)"
          to="var(--color-surface, #F7F5F0)"
          height={60}
        />

        {/* 7 — Passport Wall */}
        <PassportWallSection />

        {/* 8 — Footer CTA */}
        <FooterCTA />

        {/* Fixed overlay — outside page flow */}
        <AlertBadgeStack />

      </main>
    </>
  );
}
