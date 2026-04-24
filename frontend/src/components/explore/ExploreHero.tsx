import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ExploreHeroProps {
  userName: string;
  matchCount: number;
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80';

export default function ExploreHero({ userName, matchCount }: ExploreHeroProps) {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll listener
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSurpriseMe = () => {
    // Navigate to a random destination — handled by parent or grid
    const randomIndex = Math.floor(Math.random() * Math.max(matchCount, 1));
    // Scroll to grid area as a simple "surprise" action
    const grid = document.querySelector('[data-explore-grid]');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-[480px] overflow-hidden rounded-none w-full">
      {/* Parallax background image */}
      <img
        src={HERO_IMAGE}
        alt="Mountain road landscape"
        className="absolute inset-0 w-full h-[130%] object-cover will-change-transform"
        style={{ transform: `translateY(${scrollY * 0.25}px)` }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* Bottom-left content */}
      <div className="absolute bottom-0 left-0 right-0 pb-10 pl-10 pr-10 z-10">
        {/* Eyebrow */}
        <p
          className="hero-fade-in text-[11px] uppercase tracking-widest font-medium mb-3"
          style={{
            color: 'rgba(255,255,255,0.6)',
            animationDelay: '0ms',
          }}
        >
          {userName ? `Welcome back, ${userName}` : 'Discover your next adventure'}
        </p>

        {/* Heading */}
        <h1
          className="hero-fade-in text-[48px] font-bold tracking-tight text-white leading-tight mb-3"
          style={{ animationDelay: '100ms' }}
        >
          The world has been waiting.
        </h1>

        {/* Subtitle */}
        <p
          className="hero-fade-in text-base mb-6"
          style={{
            color: 'rgba(255,255,255,0.72)',
            animationDelay: '200ms',
          }}
        >
          {matchCount} destination{matchCount !== 1 ? 's' : ''} matched to your taste.
        </p>

        {/* CTA Buttons */}
        <div
          className="hero-fade-in flex items-center gap-3"
          style={{ animationDelay: '300ms' }}
        >
          {/* Solid white pill */}
          <button
            type="button"
            onClick={() => {
              const grid = document.querySelector('[data-explore-grid]');
              grid?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.03] active:scale-[0.98]"
          >
            Explore my matches
          </button>

          {/* Glass pill */}
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            Surprise me
          </button>
        </div>
      </div>

      {/* Keyframe animation styles */}
      <style>{`
        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-fade-in {
          opacity: 0;
          animation: heroFadeIn 0.5s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade-in {
            opacity: 1;
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
