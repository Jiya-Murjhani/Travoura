import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Destination {
  name: string;
  country: string;
  image: string;
  matchReason: string;
  budget: string;
  bestTime: string;
  isTopPick: boolean;
}

const destinations: Destination[] = [
  {
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=85&auto=format&fit=crop",
    matchReason: "You love beach culture & sunsets",
    budget: "From ₹65,000",
    bestTime: "Oct – Apr",
    isTopPick: true,
  },
  {
    name: "Kyoto",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=85&auto=format&fit=crop",
    matchReason: "Matches your slow travel pace",
    budget: "From ₹1,20,000",
    bestTime: "Mar – May",
    isTopPick: false,
  },
  {
    name: "Santorini",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=85&auto=format&fit=crop",
    matchReason: "Your honeymoon wishlist pick",
    budget: "From ₹1,80,000",
    bestTime: "Apr – Oct",
    isTopPick: false,
  },
  {
    name: "Manali",
    country: "India",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=85&auto=format&fit=crop",
    matchReason: "You loved mountains last time",
    budget: "From ₹28,000",
    bestTime: "May – Oct",
    isTopPick: false,
  },
  {
    name: "Maldives",
    country: "Maldives",
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=85&auto=format&fit=crop",
    matchReason: "Top pick for overwater stays",
    budget: "From ₹2,20,000",
    bestTime: "Nov – Apr",
    isTopPick: false,
  },
  {
    name: "Rajasthan",
    country: "India",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed31584?w=800&q=85&auto=format&fit=crop",
    matchReason: "Fits your cultural travel style",
    budget: "From ₹22,000",
    bestTime: "Oct – Feb",
    isTopPick: false,
  },
];

interface DestCardProps {
  dest: Destination;
  animIndex: number;
  entered: boolean;
}

function DestCard({ dest, animIndex, entered }: DestCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`dest-card${dest.isTopPick ? " dest-card--top" : ""}${entered ? " dest-card--entered" : ""}`}
      style={{ transitionDelay: `${animIndex * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() =>
        navigate("/generate-itinerary", {
          state: { destination: `${dest.name}, ${dest.country}` },
        })
      }
    >
      {/* Layer 1: Background image */}
      <img
        src={dest.image}
        alt={dest.name}
        className="dest-card__img"
        style={{ transform: isHovered ? "scale(1.07)" : "scale(1.0)" }}
        loading="lazy"
        decoding="async"
      />

      {/* Layer 2: Gradient overlay */}
      <div className="dest-card__overlay" />

      {/* Layer 3: Top badges */}
      {dest.isTopPick && (
        <div className="dest-card__badges">
          <span className="dest-card__top-pick">✦ TOP PICK</span>
        </div>
      )}

      {/* Layer 4: Bottom content */}
      <div className="dest-card__content">
        <div className="dest-card__name">{dest.name}</div>
        <div className="dest-card__country">{dest.country}</div>
        <div className="dest-card__match">{dest.matchReason}</div>
        <div className="dest-card__meta">
          <span className="dest-card__budget">{dest.budget}</span>
          <span className="dest-card__time-pill">{dest.bestTime}</span>
        </div>
        <div className={`dest-card__cta${isHovered ? " dest-card__cta--visible" : ""}`}>
          PLAN TRIP →
        </div>
      </div>
    </div>
  );
}

export default function DestinationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerEntered, setHeaderEntered] = useState(false);
  const [cardsEntered, setCardsEntered] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    const section = sectionRef.current;
    if (!header || !section) return;

    const headerObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHeaderEntered(true);
          headerObserver.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    headerObserver.observe(header);

    const cardsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCardsEntered(true);
          cardsObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    cardsObserver.observe(section);

    return () => {
      headerObserver.disconnect();
      cardsObserver.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        :root {
          --color-surface: #F7F5F0;
          --color-text-secondary: #6B6860;
          --color-gold: #C9A84C;
          --color-gold-light: #E8C86C;
          --color-void: #0A0A0B;
          --section-px: clamp(24px, 6vw, 80px);
          --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ---- Section wrapper ---- */
        .dest-section {
          position: relative;
          background: var(--color-surface);
          padding: 100px 0 80px;
          overflow: hidden;
        }

        /* ---- Header ---- */
        .dest-header {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 var(--section-px);
          margin-bottom: 48px;
        }

        .dest-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: var(--color-gold);
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 600ms ease 0ms, transform 600ms ease 0ms;
        }

        .dest-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 500;
          color: #1A1A1A;
          margin-top: 12px;
          line-height: 1.1;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 600ms ease 120ms, transform 600ms ease 120ms;
        }

        .dest-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 300;
          color: var(--color-text-secondary);
          margin-top: 10px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 600ms ease 240ms, transform 600ms ease 240ms;
        }

        .dest-header--entered .dest-eyebrow,
        .dest-header--entered .dest-title,
        .dest-header--entered .dest-subtitle {
          opacity: 1;
          transform: translateY(0);
        }

        /* ---- Rail wrapper (for edge fades) ---- */
        .dest-rail-wrapper {
          position: relative;
        }

        .dest-rail-wrapper::before,
        .dest-rail-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 24px;
          width: 80px;
          z-index: 2;
          pointer-events: none;
        }

        .dest-rail-wrapper::before {
          left: 0;
          background: linear-gradient(to right, var(--color-surface) 0%, transparent 100%);
        }

        .dest-rail-wrapper::after {
          right: 0;
          background: linear-gradient(to left, var(--color-surface) 0%, transparent 100%);
        }

        /* ---- Horizontal scroll rail ---- */
        .dest-rail {
          display: flex;
          overflow-x: auto;
          gap: 20px;
          padding-left: clamp(24px, 5vw, 80px);
          padding-right: clamp(24px, 5vw, 80px);
          padding-bottom: 24px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .dest-rail::-webkit-scrollbar {
          display: none;
        }

        /* ---- Destination card ---- */
        .dest-card {
          position: relative;
          width: 300px;
          height: 440px;
          flex-shrink: 0;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          scroll-snap-align: start;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          transition:
            transform 350ms var(--ease-out-expo),
            box-shadow 350ms var(--ease-out-expo),
            opacity 600ms var(--ease-out-expo),
            translate 600ms var(--ease-out-expo);
          opacity: 0;
          translate: 80px 0;
        }

        .dest-card--top {
          width: 320px;
          height: 460px;
        }

        .dest-card--entered {
          opacity: 1;
          translate: 0 0;
        }

        .dest-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }

        /* ---- Card image ---- */
        .dest-card__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ---- Gradient overlay ---- */
        .dest-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(10,10,11,0) 35%,
            rgba(10,10,11,0.55) 65%,
            rgba(10,10,11,0.92) 100%
          );
          z-index: 1;
        }

        /* ---- Top badges ---- */
        .dest-card__badges {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          z-index: 2;
          display: flex;
        }

        .dest-card__top-pick {
          background: var(--color-gold);
          color: var(--color-void);
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 4px;
        }

        /* ---- Bottom content ---- */
        .dest-card__content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          z-index: 2;
        }

        .dest-card__name {
          font-family: 'DM Sans', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: #FDFCFA;
          line-height: 1.2;
        }

        .dest-card__country {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: rgba(247,245,240,0.6);
          margin-bottom: 10px;
          margin-top: 2px;
        }

        .dest-card__match {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-style: italic;
          color: var(--color-gold-light);
          line-height: 1.4;
        }

        .dest-card__meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }

        .dest-card__budget {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: rgba(247,245,240,0.75);
        }

        .dest-card__time-pill {
          background: rgba(247,245,240,0.1);
          border: 1px solid rgba(247,245,240,0.15);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: rgba(247,245,240,0.6);
          padding: 2px 8px;
          border-radius: 10px;
        }

        /* ---- Plan trip CTA ---- */
        .dest-card__cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-gold);
          letter-spacing: 0.05em;
          margin-top: 12px;
          transform: translateY(100%);
          opacity: 0;
          transition: transform 300ms var(--ease-out-expo), opacity 300ms ease;
          overflow: hidden;
        }

        .dest-card__cta--visible {
          transform: translateY(0);
          opacity: 1;
        }
      `}</style>

      <section className="dest-section" ref={sectionRef}>

        {/* Header */}
        <div
          className={`dest-header${headerEntered ? " dest-header--entered" : ""}`}
          ref={headerRef}
        >
          <div className="dest-eyebrow">For You This Season</div>
          <h2 className="dest-title">Destinations that match your style.</h2>
          <p className="dest-subtitle">Based on your travel preferences and past trips.</p>
        </div>

        {/* Rail */}
        <div className="dest-rail-wrapper">
          <div className="dest-rail">
            {destinations.map((dest, i) => (
              <DestCard
                key={dest.name}
                dest={dest}
                animIndex={i}
                entered={cardsEntered}
              />
            ))}
          </div>
        </div>

      </section>
    </>
  );
}
