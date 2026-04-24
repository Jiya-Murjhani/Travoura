import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const chips = [
  { emoji: "✈", label: "Solo trip to Japan — 10 days" },
  { emoji: "💍", label: "Honeymoon in Europe under ₹3L" },
  { emoji: "🏖", label: "Weekend getaway from Mumbai" },
];

const days = [
  {
    label: "Day 1",
    title: "Arrival & Shinjuku",
    activities: [
      { time: "14:00", name: "Check-in, Park Hyatt Tokyo", cost: "¥8,500" },
      { time: "17:00", name: "Shibuya Crossing + shopping", cost: "¥2,200" },
      { time: "20:00", name: "Ramen at Fuunji", cost: "¥900" },
    ],
  },
  {
    label: "Day 2",
    title: "Temples & Culture",
    activities: [
      { time: "08:30", name: "Senso-ji Temple at sunrise", cost: "Free" },
      { time: "11:00", name: "Harajuku & Meiji Shrine", cost: "¥500" },
    ],
  },
  {
    label: "Day 3",
    title: "Day trip to Nikko...",
    activities: [],
    faded: true,
  },
];

export default function AISection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headline1Ref = useRef<HTMLSpanElement>(null);
  const headline2Ref = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const chipsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          section.classList.add("ai-section-entered");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleChipClick = (label: string) => {
    navigate("/generate-itinerary", { state: { prompt: label } });
  };

  return (
    <>
      <style>{`
        /* --- Fonts --- */
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        /* --- CSS Vars (fallbacks if not globally defined) --- */
        :root {
          --color-void: #0A0A0B;
          --color-gold: #C9A84C;
          --section-px: clamp(24px, 6vw, 80px);
        }

        /* --- Section base --- */
        .ai-section {
          position: relative;
          width: 100%;
          padding: 120px var(--section-px);
          background:
            radial-gradient(ellipse 600px 400px at 85% 20%, rgba(201,168,76,0.06) 0%, transparent 70%),
            var(--color-void);
          overflow: hidden;
        }

        .ai-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--color-gold) 40%, var(--color-gold) 60%, transparent 100%);
          opacity: 0.3;
        }

        /* --- Inner container --- */
        .ai-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          align-items: center;
        }

        @media (max-width: 900px) {
          .ai-inner {
            grid-template-columns: 1fr;
            gap: 64px;
          }
          .ai-left {
            padding-right: 0 !important;
          }
          .ai-right {
            justify-content: center !important;
          }
        }

        /* --- Left column --- */
        .ai-left {
          padding-right: 60px;
        }

        /* --- Eyebrow --- */
        .ai-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: var(--color-gold);
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 600ms ease 0ms, transform 600ms ease 0ms;
        }

        /* --- Headline --- */
        .ai-headline {
          margin-top: 18px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 4.5vw, 60px);
          font-weight: 500;
          line-height: 1.05;
          display: block;
        }

        .ai-headline-line1 {
          display: block;
          color: #F7F5F0;
          clip-path: inset(0 100% 0 0);
          transition: clip-path 700ms cubic-bezier(0.22, 1, 0.36, 1) 150ms;
        }

        .ai-headline-line2 {
          display: block;
          color: rgba(247,245,240,0.55);
          font-style: italic;
          clip-path: inset(0 100% 0 0);
          transition: clip-path 700ms cubic-bezier(0.22, 1, 0.36, 1) 320ms;
        }

        /* --- Body text --- */
        .ai-body {
          margin-top: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 300;
          color: rgba(247,245,240,0.55);
          line-height: 1.8;
          max-width: 420px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 600ms ease 500ms, transform 600ms ease 500ms;
        }

        /* --- Chips container --- */
        .ai-chips {
          margin-top: 36px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* --- Individual chip --- */
        .ai-chip {
          width: 100%;
          max-width: 380px;
          height: 52px;
          border-radius: 10px;
          background: rgba(247,245,240,0.05);
          border: 1px solid rgba(232,220,200,0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          cursor: pointer;
          transition: background 250ms ease, border-color 250ms ease, transform 250ms ease;
          opacity: 0;
          transform: translateX(-30px);
        }

        .ai-chip:nth-child(1) { transition: background 250ms ease, border-color 250ms ease, transform 250ms ease, opacity 600ms ease 650ms, translate 600ms ease 650ms; }
        .ai-chip:nth-child(2) { transition: background 250ms ease, border-color 250ms ease, transform 250ms ease, opacity 600ms ease 800ms, translate 600ms ease 800ms; }
        .ai-chip:nth-child(3) { transition: background 250ms ease, border-color 250ms ease, transform 250ms ease, opacity 600ms ease 950ms, translate 600ms ease 950ms; }

        .ai-chip-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: rgba(247,245,240,0.75);
          transition: color 250ms ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ai-chip-arrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          color: var(--color-gold);
          opacity: 0;
          transition: opacity 250ms ease, transform 250ms ease;
        }

        .ai-chip:hover {
          background: rgba(201,168,76,0.08);
          border-color: rgba(201,168,76,0.35);
          transform: translateX(4px) !important;
        }

        .ai-chip:hover .ai-chip-text {
          color: #F7F5F0;
        }

        .ai-chip:hover .ai-chip-arrow {
          opacity: 1;
        }

        /* --- CTA button --- */
        @keyframes gold-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .ai-cta {
          margin-top: 36px;
          height: 52px;
          border-radius: 8px;
          background: var(--color-gold);
          color: var(--color-void);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 0 32px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          transition: box-shadow 300ms ease, transform 300ms ease, background 300ms ease;
          opacity: 0;
          transform: translateY(8px);
          background-size: 200% auto;
        }

        .ai-cta:hover {
          background: linear-gradient(135deg, #C9A84C 0%, #E8C86C 50%, #C9A84C 100%);
          background-size: 200% auto;
          animation: gold-shimmer 1.5s linear infinite;
          box-shadow: 0 8px 32px rgba(201,168,76,0.35);
          transform: translateY(-2px);
        }

        /* --- Right column --- */
        .ai-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        /* --- Phone card --- */
        @keyframes card-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .ai-phone-card {
          width: 320px;
          background: #1A1A1C;
          border-radius: 24px;
          border: 1px solid rgba(232,220,200,0.08);
          padding: 24px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
          animation: card-float 6s ease-in-out infinite;
          opacity: 0;
          transform: translateX(60px);
          transition: opacity 800ms ease 300ms, transform 800ms ease 300ms;
        }

        .ai-notch {
          width: 80px;
          height: 6px;
          background: #000;
          border-radius: 3px;
          margin: 0 auto 20px;
        }

        .ai-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .ai-card-destination {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #F7F5F0;
          line-height: 1.3;
        }

        .ai-card-dates {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(247,245,240,0.4);
          margin-top: 3px;
        }

        .ai-badge {
          flex-shrink: 0;
          height: 18px;
          border-radius: 9px;
          background: rgba(201,168,76,0.15);
          border: 1px solid rgba(201,168,76,0.3);
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: var(--color-gold);
          padding: 0 8px;
          display: flex;
          align-items: center;
          white-space: nowrap;
        }

        .ai-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 16px 0;
        }

        .ai-days-container {
          position: relative;
          overflow: hidden;
        }

        .ai-days-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(to bottom, transparent 0%, #1A1A1C 100%);
          pointer-events: none;
          z-index: 1;
        }

        .ai-day-entry {
          margin-bottom: 14px;
        }

        .ai-day-entry.faded {
          opacity: 0.35;
        }

        .ai-day-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--color-gold);
          margin-bottom: 3px;
        }

        .ai-day-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #F7F5F0;
          margin-bottom: 8px;
        }

        .ai-activity-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
        }

        .ai-activity-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(201,168,76,0.7);
          flex-shrink: 0;
        }

        .ai-activity-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(247,245,240,0.65);
          flex: 1;
        }

        .ai-activity-meta {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: rgba(247,245,240,0.35);
          white-space: nowrap;
        }

        .ai-card-footer {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: rgba(247,245,240,0.3);
          text-align: center;
          margin-top: 16px;
        }

        /* --- Entered state (IntersectionObserver triggers) --- */
        .ai-section-entered .ai-eyebrow {
          opacity: 1;
          transform: translateY(0);
        }

        .ai-section-entered .ai-headline-line1 {
          clip-path: inset(0 0% 0 0);
        }

        .ai-section-entered .ai-headline-line2 {
          clip-path: inset(0 0% 0 0);
        }

        .ai-section-entered .ai-body {
          opacity: 1;
          transform: translateY(0);
        }

        .ai-section-entered .ai-chip {
          opacity: 1;
          transform: translateX(0);
        }

        .ai-section-entered .ai-cta {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 1050ms,
                      transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 1050ms,
                      box-shadow 300ms ease,
                      background 300ms ease;
        }

        .ai-section-entered .ai-phone-card {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      <section className="ai-section" ref={sectionRef}>
        <div className="ai-inner">

          {/* LEFT COLUMN */}
          <div className="ai-left">

            {/* Eyebrow */}
            <div className="ai-eyebrow" ref={eyebrowRef}>
              Powered by AI
            </div>

            {/* Headline */}
            <div className="ai-headline">
              <span className="ai-headline-line1" ref={headline1Ref}>
                Tell us your dream.
              </span>
              <span className="ai-headline-line2" ref={headline2Ref}>
                We'll handle the rest.
              </span>
            </div>

            {/* Body */}
            <p className="ai-body" ref={bodyRef}>
              From your travel style to your dietary preferences, Travoura's AI
              understands the full picture — before writing a single itinerary line.
            </p>

            {/* Chips */}
            <div className="ai-chips">
              {chips.map((chip, i) => (
                <button
                  key={chip.label}
                  className="ai-chip"
                  ref={(el) => { chipsRef.current[i] = el; }}
                  onClick={() => handleChipClick(chip.label)}
                >
                  <span className="ai-chip-text">
                    <span>{chip.emoji}</span>
                    <span>{chip.label}</span>
                  </span>
                  <span className="ai-chip-arrow">→</span>
                </button>
              ))}
            </div>

            {/* CTA */}
            <button
              className="ai-cta"
              ref={ctaRef}
              onClick={() => navigate("/generate-itinerary")}
            >
              Start Planning →
            </button>

          </div>

          {/* RIGHT COLUMN */}
          <div className="ai-right">
            <div className="ai-phone-card" ref={cardRef}>

              {/* Notch */}
              <div className="ai-notch" />

              {/* Card header */}
              <div className="ai-card-header">
                <div>
                  <div className="ai-card-destination">Tokyo, Japan 🇯🇵</div>
                  <div className="ai-card-dates">Mar 15 – 25 · 10 days</div>
                </div>
                <div className="ai-badge">AI Generated</div>
              </div>

              {/* Divider */}
              <div className="ai-divider" />

              {/* Days */}
              <div className="ai-days-container">
                {days.map((day) => (
                  <div
                    key={day.label}
                    className={`ai-day-entry${day.faded ? " faded" : ""}`}
                  >
                    <div className="ai-day-label">{day.label}</div>
                    <div className="ai-day-title">{day.title}</div>
                    {day.activities.map((act) => (
                      <div className="ai-activity-row" key={act.name}>
                        <div className="ai-activity-dot" />
                        <span className="ai-activity-name">{act.name}</span>
                        <span className="ai-activity-meta">
                          {act.time} · {act.cost}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="ai-days-fade" />
              </div>

              {/* Footer */}
              <div className="ai-card-footer">
                Generated in 3.2s · Personalised for Jiya
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}
