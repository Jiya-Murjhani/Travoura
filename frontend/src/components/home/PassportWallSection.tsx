import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

type TripStatus = "completed" | "upcoming" | "planning";

interface Trip {
  id: number;
  destination: string;
  region: string;
  startDate: string;
  endDate: string;
  duration: string;
  travelers: string;
  status: TripStatus;
  rotation: number;
  topOffset: number;
  leftOffset: number;
  countdown?: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const trips: Trip[] = [
  { id: 1, destination: "Manali",       region: "Himachal Pradesh, India", startDate: "Dec 12", endDate: "Dec 18, 2024",  duration: "6 days",  travelers: "4 travelers", status: "completed", rotation: -3,   topOffset: 0,  leftOffset: 0,    },
  { id: 2, destination: "Goa",          region: "India",                   startDate: "Mar 5",  endDate: "Mar 10, 2024",  duration: "5 days",  travelers: "2 travelers", status: "completed", rotation: 2,    topOffset: 20, leftOffset: 340,  },
  { id: 3, destination: "Rajasthan",    region: "India",                   startDate: "Nov 2",  endDate: "Nov 8, 2023",   duration: "6 days",  travelers: "6 travelers", status: "completed", rotation: -1.5, topOffset: 10, leftOffset: 680,  },
  { id: 4, destination: "Goa Escape",   region: "India",                   startDate: "Dec 26", endDate: "Jan 1, 2025",   duration: "7 days",  travelers: "3 travelers", status: "upcoming",  rotation: 3,    topOffset: 0,  leftOffset: 1020, countdown: "In 9 days" },
  { id: 5, destination: "Tokyo Dream",  region: "Japan",                   startDate: "Mar 15", endDate: "Mar 25, 2025",  duration: "10 days", travelers: "2 travelers", status: "planning",  rotation: -2,   topOffset: 25, leftOffset: 280,  },
];

// ─── Scatter margins (desktop) ────────────────────────────────────────────────

const scatterMargins = [
  { marginTop: 0,  marginLeft: 0   },
  { marginTop: 30, marginLeft: -10 },
  { marginTop: 10, marginLeft: -10 },
  { marginTop: 40, marginLeft: -10 },
  { marginTop: 20, marginLeft: -10 },
];

// ─── Badge config ─────────────────────────────────────────────────────────────

const BADGE: Record<TripStatus, { label: string; bg: string; border: string; color: string }> = {
  completed: {
    label: "COMPLETED ✓",
    bg: "rgba(58,125,92,0.1)",
    border: "1px solid rgba(58,125,92,0.3)",
    color: "#3A7D5C",
  },
  upcoming: {
    label: "UPCOMING ✈",
    bg: "rgba(201,168,76,0.1)",
    border: "1px solid rgba(201,168,76,0.3)",
    color: "#C9A84C",
  },
  planning: {
    label: "PLANNING ✦",
    bg: "rgba(155,149,144,0.1)",
    border: "1px solid rgba(155,149,144,0.3)",
    color: "#9B9590",
  },
};

// ─── Airplane SVG ─────────────────────────────────────────────────────────────

function AirplaneSVG() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
        fill="rgba(201,168,76,0.35)"
      />
    </svg>
  );
}

// ─── Stamp Card ───────────────────────────────────────────────────────────────

function StampCard({
  trip,
  index,
  animateIn,
  isMobile,
}: {
  trip: Trip;
  index: number;
  animateIn: boolean;
  isMobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const badge = BADGE[trip.status];
  const rotation = isMobile ? 0 : trip.rotation;
  const sm = scatterMargins[index] ?? { marginTop: 0, marginLeft: 0 };

  const borderStyle =
    trip.status === "completed"
      ? "1.5px solid var(--color-sand, #E8DCCB)"
      : trip.status === "upcoming"
      ? "1.5px dashed #C9A84C"
      : "1.5px dashed rgba(232,220,200,0.6)";

  const entryTransform = `translateY(-28px) rotate(${rotation - 8}deg)`;
  const restTransform = `translateY(0px) rotate(${rotation}deg)`;
  const hoverTransform = `translateY(-8px) rotate(${rotation * 0.7}deg)`;

  const currentTransform = !animateIn
    ? entryTransform
    : hovered
    ? hoverTransform
    : restTransform;

  const currentShadow = hovered
    ? "0 16px 40px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.04)"
    : trip.status === "upcoming"
    ? "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04), 0 0 0 0 rgba(201,168,76,0.4)"
    : "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 220,
        minHeight: 200,
        background: "var(--color-paper, #FDFCFA)",
        borderRadius: 4,
        padding: 20,
        border: borderStyle,
        boxShadow: currentShadow,
        position: "relative",
        transform: currentTransform,
        opacity: animateIn ? 1 : 0,
        transition: `transform 350ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 350ms ease, opacity 700ms ease`,
        transitionDelay: animateIn ? `${index * 120}ms` : "0ms",
        flexShrink: 0,
        ...(isMobile
          ? {}
          : {
              marginTop: sm.marginTop,
              marginLeft: sm.marginLeft,
            }),
      }}
    >
      {/* Status badge */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        background: badge.bg,
        border: badge.border,
        color: badge.color,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        fontWeight: 500,
        padding: "3px 8px",
        borderRadius: 3,
        letterSpacing: "0.04em",
      }}>
        {badge.label}
      </div>

      {/* Destination */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 20,
        fontWeight: 700,
        color: "#1A1A1A",
        margin: "10px 0 0",
        lineHeight: 1.2,
      }}>
        {trip.destination}
      </p>

      {/* Region */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 300,
        color: "var(--color-text-secondary, #6B6560)",
        margin: "4px 0 0",
      }}>
        {trip.region}
      </p>

      {/* Countdown for upcoming */}
      {trip.status === "upcoming" && trip.countdown && (
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28,
          fontWeight: 600,
          color: "var(--color-gold, #C9A84C)",
          lineHeight: 1,
          margin: "10px 0 0",
        }}>
          {trip.countdown}
        </p>
      )}

      {/* Divider */}
      <div style={{
        height: 1,
        background: "var(--color-sand, #E8DCCB)",
        margin: "12px 0 10px",
      }} />

      {/* Date range */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 400,
        color: "var(--color-text-secondary, #6B6560)",
        margin: 0,
      }}>
        {trip.startDate} – {trip.endDate}
      </p>

      {/* Duration + travelers */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        color: "var(--color-text-muted, #9B9590)",
        margin: "4px 0 0",
      }}>
        {trip.duration} · {trip.travelers}
      </p>

      {/* Decorative stamp mark */}
      <div style={{
        position: "absolute",
        right: 12,
        bottom: 12,
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: trip.status === "completed"
          ? "1.5px solid rgba(201,168,76,0.25)"
          : "1.5px solid rgba(232,220,200,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "rotate(-45deg)",
      }}>
        <AirplaneSVG />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PassportWallSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setTimeout(() => setAnimateIn(true), 80);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500;700&display=swap');

        .passport-section * { box-sizing: border-box; }

        .ps-eyebrow {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 500ms ease, transform 500ms ease;
        }
        .ps-eyebrow.active { opacity: 1; transform: translateY(0); }

        .ps-headline {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 600ms ease 100ms, transform 600ms ease 100ms;
        }
        .ps-headline.active { opacity: 1; transform: translateY(0); }

        .ps-subtitle {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 600ms ease 200ms, transform 600ms ease 200ms;
        }
        .ps-subtitle.active { opacity: 1; transform: translateY(0); }

        .ps-cta-btn {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: var(--color-text-muted, #9B9590);
          border: 1.5px dashed var(--color-sand, #E8DCCB);
          border-radius: 8px;
          padding: 14px 32px;
          text-decoration: none;
          transition: border-color 250ms ease, color 250ms ease, background 250ms ease;
        }
        .ps-cta-btn:hover {
          border-color: var(--color-gold, #C9A84C);
          color: var(--color-gold, #C9A84C);
          background: rgba(201,168,76,0.04);
        }

        @keyframes pulseGold {
          0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.08), 0 0 0 0 rgba(201,168,76,0.25); }
          50%       { box-shadow: 0 4px 20px rgba(0,0,0,0.08), 0 0 0 8px rgba(201,168,76,0); }
        }

        @media (max-width: 1023px) {
          .ps-stamp-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
            justify-items: center;
          }
          .ps-stamp-grid > div {
            width: 100% !important;
            max-width: 220px;
            margin: 0 !important;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="passport-section"
        style={{
          background: "var(--color-surface, #F7F5F0)",
          padding: "100px var(--section-px, 48px) 80px",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* ── Section Header ── */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className={`ps-eyebrow ${visible ? "active" : ""}`} style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 400,
              color: "var(--color-gold, #C9A84C)",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              margin: "0 0 16px",
            }}>
              Your Travel Story
            </p>

            <h2 className={`ps-headline ${visible ? "active" : ""}`} style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(38px, 4.5vw, 56px)",
              fontWeight: 500,
              color: "#1A1A1A",
              margin: "0 0 12px",
              lineHeight: 1.15,
            }}>
              Every trip, a chapter.
            </h2>

            <p className={`ps-subtitle ${visible ? "active" : ""}`} style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              fontWeight: 300,
              color: "var(--color-text-secondary, #6B6560)",
              margin: 0,
            }}>
              A record of where you've been, and where you're going.
            </p>
          </div>

          {/* ── Stamp Scatter ── */}
          <div
            className="ps-stamp-grid"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: isMobile ? 16 : 20,
              justifyContent: isMobile ? undefined : "center",
            }}
          >
            {trips.map((trip, i) => (
              <StampCard
                key={trip.id}
                trip={trip}
                index={i}
                animateIn={animateIn}
                isMobile={isMobile}
              />
            ))}
          </div>

          {/* ── Bottom CTA ── */}
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <Link to="/create-trip" className="ps-cta-btn">
              + Add a new trip
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
