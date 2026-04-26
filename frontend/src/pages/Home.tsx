import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import HomeNavbar from "@/components/home/HomeNavbar";
import HeroSection from "@/components/home/HeroSection";
import ImageTrail from "@/components/home/ImageTrail";
import FlightPathSection from "@/components/home/FlightPathSection";
import AISection from "@/components/home/AISection";
import DestinationsSection from "@/components/home/DestinationsSection";
import BudgetSection from "@/components/home/BudgetSection";
import PassportWallSection from "@/components/home/PassportWallSection";
import AlertBadgeStack from "@/components/home/AlertBadgeStack";

const TRAIL_IMAGES = [
  'https://images.pexels.com/photos/4870457/pexels-photo-4870457.jpeg',
  'https://images.pexels.com/photos/12543917/pexels-photo-12543917.jpeg',
  'https://images.pexels.com/photos/29018566/pexels-photo-29018566.png',
  'https://images.pexels.com/photos/33704657/pexels-photo-33704657.jpeg',
  'https://images.pexels.com/photos/4589325/pexels-photo-4589325.jpeg',
  'https://images.pexels.com/photos/13577528/pexels-photo-13577528.jpeg',
  'https://images.pexels.com/photos/27395085/pexels-photo-27395085.jpeg',
  'https://images.pexels.com/photos/7431709/pexels-photo-7431709.jpeg',
  'https://images.pexels.com/photos/20058561/pexels-photo-20058561.jpeg',
];

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
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const userName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Traveller";

  const [trailKey] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearchSubmit = async (query: string) => {
    if (!query.trim() || searchLoading) return;

    setSearchLoading(true);
    try {
      const token = session?.access_token;
      if (!token) {
        toast.error("Please log in to use this feature.");
        setSearchLoading(false);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/parse-trip-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: query }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Request failed");
      }

      const prefill = await response.json();
      navigate("/create-trip", { state: { prefill } });
    } catch (_err) {
      toast.error("Couldn't understand your trip. Try being more specific.");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        .image-trail-section {
          position: relative;
          height: 600px;
          background: var(--color-void, #0A0A0B);
          overflow: hidden;
          cursor: none;
        }
        .image-trail-section .content {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .image-trail-overlay {
          position: absolute;
          inset: 0;
          z-index: 200;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          pointer-events: none;
          padding: 0 24px;
        }
        .image-trail-overlay__eyebrow {
          font-family: 'DM Sans', var(--font-ui), sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: var(--color-gold, #C9A84C);
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .image-trail-overlay__heading {
          font-family: 'Cormorant Garamond', var(--font-display), serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 500;
          line-height: 1.08;
          color: #F7F5F0;
          margin: 0 0 16px;
        }
        .image-trail-overlay__heading em {
          font-style: italic;
          color: rgba(247,245,240,0.55);
        }
        .image-trail-overlay__sub {
          font-family: 'DM Sans', var(--font-ui), sans-serif;
          font-size: 16px;
          font-weight: 300;
          color: rgba(247,245,240,0.4);
          max-width: 420px;
        }
        .image-trail-hint {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 200;
          font-family: 'DM Sans', var(--font-ui), sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(247,245,240,0.25);
          pointer-events: none;
          animation: pulse-hint 2s ease-in-out infinite;
        }
        .image-trail-overlay__cta {
          margin-top: 32px;
          display: inline-flex;
          align-items: center;
          padding: 12px 28px;
          border: 1px solid var(--color-gold, #C9A84C);
          background: transparent;
          color: var(--color-gold, #C9A84C);
          font-family: 'DM Sans', var(--font-ui), sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 40px;
          transition: all 300ms ease;
          pointer-events: auto;
          cursor: pointer;
        }
        .image-trail-overlay__cta:hover {
          background: rgba(201, 168, 76, 0.05);
          box-shadow: 0 4px 20px rgba(201, 168, 76, 0.15);
        }
        .image-trail-overlay__cta-icon {
          margin-left: 8px;
          transition: transform 300ms ease;
        }
        .image-trail-overlay__cta:hover .image-trail-overlay__cta-icon {
          transform: translateX(4px);
        }
        @keyframes pulse-hint {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <main className="w-full overflow-x-hidden" style={{ background: 'var(--color-surface)' }}>

        {/* Fixed navbar — renders on top of the hero */}
        <HomeNavbar />

        {/* 1 — Hero */}
        <HeroSection
          userName={userName}
          onSearchSubmit={handleSearchSubmit}
          isLoading={searchLoading}
        />

        {/* 2 — Image Trail Interactive Section */}
        <section className="image-trail-section">
          <ImageTrail
            key={trailKey}
            items={TRAIL_IMAGES}
            variant={7}
          />
          <div className="image-trail-overlay">
            <h2 className="image-trail-overlay__heading">
              Wander<br /><em>Without Limits</em>
            </h2>
            <p className="image-trail-overlay__sub">
              AI-crafted itineraries for the way you travel
            </p>
            <Link to="/generate-itinerary" className="image-trail-overlay__cta">
              Start Planning <span className="image-trail-overlay__cta-icon">→</span>
            </Link>
          </div>
          <span className="image-trail-hint">Move your cursor to explore</span>
        </section>

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
