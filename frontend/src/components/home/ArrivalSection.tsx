import React, { useEffect, useState } from 'react';
import { useIntersectionReveal } from '@/hooks/useIntersectionReveal';

/* ── Props ── */
interface ArrivalSectionProps {
  tripsCount?: number;
  countriesCount?: number;
  budgetTracked?: string;
}

/* ── Count-up hook ── */
function useCountUp(target: number, duration: number, isActive: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, isActive]);
  return count;
}

/* ── Component ── */
const ArrivalSection: React.FC<ArrivalSectionProps> = ({
  tripsCount = 12,
  countriesCount = 7,
  budgetTracked = '2.4L',
}) => {
  const { ref, isVisible } = useIntersectionReveal({ threshold: 0.15 });

  const animatedTrips = useCountUp(tripsCount, 1200, isVisible);
  const animatedCountries = useCountUp(countriesCount, 1000, isVisible);

  /* ── Reveal helper ── */
  const reveal = (
    delayMs: number,
    durationMs: number,
    opts?: { useSpring?: boolean; fromY?: number }
  ): React.CSSProperties => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? 'translateY(0) scale(1)'
      : `translateY(${opts?.fromY ?? 12}px) scale(1)`,
    transition: `opacity ${durationMs}ms ${
      opts?.useSpring
        ? 'cubic-bezier(0.34,1.56,0.64,1)'
        : 'cubic-bezier(0.16,1,0.3,1)'
    } ${delayMs}ms, transform ${durationMs}ms ${
      opts?.useSpring
        ? 'cubic-bezier(0.34,1.56,0.64,1)'
        : 'cubic-bezier(0.16,1,0.3,1)'
    } ${delayMs}ms`,
  });

  /* ── SVG ornament scale reveal ── */
  const ornamentStyle: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1)' : 'scale(0.6)',
    transition:
      'opacity 500ms cubic-bezier(0.16,1,0.3,1) 700ms, transform 500ms cubic-bezier(0.16,1,0.3,1) 700ms',
  };

  /* ── Gold bar under label (width reveal) ── */
  const goldBarStyle: React.CSSProperties = {
    width: isVisible ? '40px' : '0px',
    height: '1px',
    background: 'var(--color-gold)',
    margin: '16px auto',
    transition: 'width 400ms cubic-bezier(0.16,1,0.3,1) 200ms',
  };

  /* ── Clip-mask headline reveal ── */
  const clipReveal = (delayMs: number): React.CSSProperties => ({
    display: 'block',
    transform: isVisible ? 'translateY(0)' : 'translateY(105%)',
    transition: `transform 700ms cubic-bezier(0.16,1,0.3,1) ${delayMs}ms`,
  });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative noise-overlay"
      style={{
        background: 'var(--color-surface)',
        paddingTop: '120px',
        paddingBottom: '100px',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 var(--section-px)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* ─── 1. EYEBROW LABEL ─── */}
        <div style={reveal(0, 500)}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.22em',
              color: 'var(--color-gold)',
              textTransform: 'uppercase',
            }}
          >
            Travoura · AI Travel Intelligence
          </span>
        </div>

        {/* Gold line under label */}
        <div style={goldBarStyle} />

        {/* ─── 2. MAIN HEADLINE ─── */}
        <h2
          style={{
            maxWidth: '750px',
            margin: '0 auto',
            marginTop: '24px',
          }}
        >
          {/* Line 1 — clip-mask reveal */}
          <span style={{ display: 'block', overflow: 'hidden', lineHeight: '1.15' }}>
            <span
              style={{
                ...clipReveal(300),
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(42px, 5vw, 64px)',
                fontWeight: 500,
                lineHeight: 1.08,
                color: '#1A1A1A',
              }}
            >
              We don't just plan trips.
            </span>
          </span>

          {/* Line 2 — clip-mask reveal, italic */}
          <span style={{ display: 'block', overflow: 'hidden', lineHeight: '1.15' }}>
            <span
              style={{
                ...clipReveal(480),
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(42px, 5vw, 64px)',
                fontWeight: 500,
                fontStyle: 'italic',
                lineHeight: 1.08,
                color: 'var(--color-text-secondary)',
              }}
            >
              We understand how you travel.
            </span>
          </span>
        </h2>

        {/* ─── 3. DECORATIVE DIVIDER ─── */}
        <div style={{ margin: '32px auto', ...ornamentStyle }}>
          <svg
            width="200"
            height="12"
            viewBox="0 0 200 12"
            style={{ display: 'block', margin: '0 auto' }}
          >
            <line x1="0" y1="6" x2="88" y2="6" stroke="#E8DCC8" strokeWidth="1" />
            <rect
              x="92"
              y="2"
              width="8"
              height="8"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="1"
              transform="rotate(45 96 6)"
            />
            <line x1="104" y1="6" x2="200" y2="6" stroke="#E8DCC8" strokeWidth="1" />
          </svg>
        </div>

        {/* ─── 4. BODY PARAGRAPH ─── */}
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '18px',
            fontWeight: 300,
            lineHeight: 1.8,
            color: 'var(--color-text-secondary)',
            maxWidth: '560px',
            margin: '0 auto',
            ...reveal(850, 600, { fromY: 16 }),
          }}
        >
          Travoura learns your pace, your budget, and your style — then builds
          itineraries that feel like they were written by someone who knows you.
          Because in a way, they were.
        </p>

        {/* ─── 5. STATS PILLS ROW ─── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '56px',
          }}
        >
          {/* Pill 1: Trips */}
          <div
            style={{
              ...pillBase,
              ...reveal(1000, 500, { useSpring: true }),
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
            <span style={pillNumber}>{animatedTrips}</span>
            <span style={pillLabel}>Trips Planned</span>
          </div>

          {/* Pill 2: Countries */}
          <div
            style={{
              ...pillBase,
              ...reveal(1120, 500, { useSpring: true }),
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span style={pillNumber}>{animatedCountries}</span>
            <span style={pillLabel}>Countries</span>
          </div>

          {/* Pill 3: Budget Tracked */}
          <div
            style={{
              ...pillBase,
              ...reveal(1240, 500, { useSpring: true }),
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--color-gold)',
                lineHeight: 1,
              }}
            >
              ₹
            </span>
            <span style={pillNumber}>₹{budgetTracked}</span>
            <span style={pillLabel}>Tracked</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Shared pill styles ── */
const pillBase: React.CSSProperties = {
  height: '48px',
  borderRadius: '24px',
  border: '1px solid var(--color-sand)',
  background: 'var(--color-paper)',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
};

const pillNumber: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: '16px',
  fontWeight: 600,
  color: '#1A1A1A',
};

const pillLabel: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--color-text-muted)',
};

export default ArrivalSection;
