import React, { useEffect, useRef, useState } from 'react';
import { useHeroScroll } from '@/hooks/useHeroScroll';

interface HeroSectionProps {
  userName: string;
  onSearchSubmit: (query: string) => void;
}

const QUICK_CHIPS = [
  { label: 'Solo trip to Japan 🗾' },
  { label: 'Beaches under ₹50K 🏖' },
  { label: 'Weekend in Goa ✈' },
];

const HeroSection: React.FC<HeroSectionProps> = ({ userName, onSearchSubmit }) => {
  const [loaded, setLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    scrollProgress,
    imageScale,
    panelBOpacity,
    panelBTranslateX,
    overlayOpacity,
  } = useHeroScroll(400);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearchSubmit(searchValue.trim());
    }
  };

  const handleChipClick = (text: string) => {
    setSearchValue(text);
    inputRef.current?.focus();
  };

  /* Shared inline-style helper for staggered reveals */
  const revealStyle = (delayMs: number, durationMs: number, useSpring = false): React.CSSProperties => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity ${durationMs}ms ${useSpring ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'cubic-bezier(0.16, 1, 0.3, 1)'}, transform ${durationMs}ms ${useSpring ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'cubic-bezier(0.16, 1, 0.3, 1)'}`,
    transitionDelay: `${delayMs}ms`,
  });

  /* Scroll indicator opacity — fades faster than the content */
  const scrollIndicatorOpacity = Math.max(1 - scrollProgress * 3, 0);

  return (
    <section
      id="hero-section"
      className="relative flex flex-col lg:flex-row w-full"
      style={{ minHeight: '100dvh', zIndex: 0 }}
    >
      {/* ====== IMAGE PANEL (LEFT) ====== */}
      <div
        className="relative w-full lg:w-[60%] overflow-hidden"
        style={{ minHeight: '100dvh', height: '100dvh' }}
      >
        {/* Desktop: override height to full */}
        <style>{`
          @media (min-width: 1024px) {
            #hero-image-panel { height: 100% !important; min-height: 100% !important; }
          }
        `}</style>
        <div id="hero-image-panel" className="relative w-full h-full overflow-hidden">
          {/* Cinematic image — scroll-driven zoom */}
          <img
            src="https://images.unsplash.com/photo-1530469641172-8ac15d0a7d6a?q=80&w=1105&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="View from airplane window overlooking clouds and landscape"
            className="w-full h-full select-none"
            style={{
              objectFit: 'cover',
              objectPosition: 'center 40%',
              transform: `scale(${loaded ? imageScale : 1.0})`,
              transition: scrollProgress === 0
                ? 'transform 8000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                : 'transform 50ms linear',
            }}
            draggable={false}
            loading="eager"
            decoding="async"
            // @ts-ignore
            fetchPriority="high"
          />

          {/* Gradient overlay — scroll-driven deepening */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              background:
                'linear-gradient(to bottom, rgba(10,10,11,0.05) 0%, rgba(10,10,11,0.25) 60%, rgba(10,10,11,0.6) 100%)',
              opacity: overlayOpacity / 0.25, // normalise: at rest overlayOpacity=0.25 → CSS opacity 1, at max 0.65 → ~2.6
            }}
          />

          {/* Mobile: bottom wave */}
          <svg
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
            className="block lg:hidden"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '80px',
              zIndex: 2,
            }}
          >
            <path d="M0,0 Q50,20 100,0 L100,20 L0,20 Z" fill="var(--color-surface)" />
          </svg>

          {/* Desktop: right-side horizontal blur/fade */}
          <div
            className="hidden lg:block pointer-events-none"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '240px',
              height: '100%',
              zIndex: 2,
              background: 'linear-gradient(to right, rgba(247,245,240,0) 0%, rgba(247,245,240,0.8) 60%, rgba(247,245,240,1) 100%)',
            }}
          />
        </div>
      </div>

      {/* ====== GREETING PANEL (RIGHT) ====== */}
      <div
        className="relative flex-1 flex flex-col justify-center px-8 py-8 lg:px-12 lg:py-12"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* --- Scroll-driven fade wrapper for all content (except scroll indicator) --- */}
        <div
          style={{
            opacity: panelBOpacity,
            transform: `translateX(${panelBTranslateX}px)`,
            transition: 'opacity 30ms linear, transform 30ms linear',
          }}
        >
          {/* === Welcome label === */}
          <div className="flex items-center gap-3 mb-6" style={revealStyle(200, 500)}>
            <span
              className="block"
              style={{
                width: '24px',
                height: '1px',
                background: 'var(--color-gold)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.18em',
                color: 'var(--color-gold)',
                textTransform: 'uppercase' as const,
              }}
            >
              Welcome Back
            </span>
          </div>

          {/* === Headline === */}
          <h1 className="mb-4">
            <span
              className="block"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(44px, 5vw, 72px)',
                fontWeight: 600,
                color: '#1A1A1A',
                lineHeight: 1.05,
                ...revealStyle(380, 600),
              }}
            >
              Hey {userName}.
            </span>
            <span
              className="block"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(44px, 5vw, 72px)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.05,
                ...revealStyle(500, 600),
              }}
            >
              Where to next?
            </span>
          </h1>

          {/* === Subtext === */}
          <p
            className="mb-10"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '16px',
              fontWeight: 300,
              color: 'var(--color-text-muted)',
              ...revealStyle(680, 500),
            }}
          >
            Your next adventure is one prompt away.
          </p>

          {/* === AI Search Bar === */}
          <form onSubmit={handleSubmit} style={revealStyle(820, 600)}>
            <div
              className="relative flex items-center"
              style={{
                height: '56px',
                borderRadius: '28px',
                background: '#FFFFFF',
                border: `1.5px solid ${inputFocused ? 'var(--color-gold)' : 'var(--color-sand)'}`,
                boxShadow: inputFocused
                  ? '0 4px 32px rgba(201,168,76,0.2)'
                  : '0 4px 24px rgba(201,168,76,0.08)',
                transition: 'border-color 300ms ease, box-shadow 300ms ease',
              }}
            >
              {/* Left airplane icon */}
              <span className="pl-5 pr-2 flex-shrink-0" style={{ color: 'var(--color-gold)' }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </svg>
              </span>

              {/* Search input */}
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="10 days in Japan under ₹1.5L..."
                className="flex-1 bg-transparent outline-none min-w-0"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  color: 'var(--color-text-primary)',
                  caretColor: 'var(--color-gold)',
                }}
              />

              {/* Send button */}
              <button
                type="submit"
                className="flex-shrink-0 flex items-center justify-center mr-2 hover:opacity-90 active:scale-95"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--color-gold)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 200ms ease, transform 150ms ease',
                }}
                aria-label="Submit search"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </form>

          {/* === Quick Action Chips === */}
          <div className="flex flex-wrap gap-2 mt-5">
            {QUICK_CHIPS.map((chip, i) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleChipClick(chip.label)}
                className="hover:bg-[rgba(201,168,76,0.08)]"
                style={{
                  height: '32px',
                  borderRadius: '16px',
                  padding: '0 14px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: '1px solid var(--color-sand)',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  whiteSpace: 'nowrap',
                  ...revealStyle(1000 + i * 80, 400, true),
                }}
                onMouseEnter={(e) => {
                  const t = e.currentTarget;
                  t.style.borderColor = 'var(--color-gold)';
                  t.style.color = 'var(--color-gold)';
                }}
                onMouseLeave={(e) => {
                  const t = e.currentTarget;
                  t.style.borderColor = 'var(--color-sand)';
                  t.style.color = 'var(--color-text-secondary)';
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
        {/* --- END scroll-driven fade wrapper --- */}

        {/* === Scroll Indicator (outside fade wrapper — fades independently) === */}
        <div
          className="hidden lg:flex flex-col items-center gap-2"
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: scrollIndicatorOpacity,
            transition: 'opacity 60ms linear',
            ...( !loaded ? { opacity: 0, transform: 'translateX(-50%) translateY(20px)' } : {}),
            ...(loaded && scrollProgress === 0 ? {
              transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: '1500ms',
            } : {}),
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'var(--color-text-muted)',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
            }}
          >
            SCROLL
          </span>
          <div className="flex flex-col items-center scroll-bob">
            <div
              style={{
                width: '1px',
                height: '40px',
                background: 'linear-gradient(to bottom, var(--color-gold), transparent)',
              }}
            />
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'var(--color-gold)',
                marginTop: '2px',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
