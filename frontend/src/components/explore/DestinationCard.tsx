import { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { DestinationWithScore } from '@/types/explore';

interface DestinationCardProps {
  destination: DestinationWithScore;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onClick: (dest: DestinationWithScore) => void;
  index: number;
  className?: string;
}

export default function DestinationCard({
  destination,
  isSaved,
  onToggleSave,
  onClick,
  index,
  className = '',
}: DestinationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tags = (destination.tags ?? []).slice(0, 3);

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(destination)}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`
        group relative rounded-2xl overflow-hidden cursor-pointer bg-gray-800
        opacity-0 translate-y-6 transition-all duration-500 ease-out
        [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0
        hover:scale-[1.02] transition-transform duration-300
        ${className}
      `}
    >
      {/* Image */}
      <img
        src={destination.heroImageUrl}
        alt={destination.name}
        className="w-full h-full object-cover absolute inset-0 transition-transform duration-300 group-hover:scale-[1.06]"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* Match score badge — top left */}
      {destination.matchScore != null && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-gray-900 shadow-sm">
            {destination.matchScore}% match
          </span>
        </div>
      )}

      {/* Save / heart button — top right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(destination.id);
        }}
        className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/20 transition-colors duration-200 hover:bg-black/50"
      >
        <Heart
          className={`h-4 w-4 transition-colors duration-200 ${
            isSaved ? 'fill-red-500 text-red-500' : 'fill-none text-white'
          }`}
        />
      </button>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="text-lg font-bold leading-tight text-white">
          {destination.name}
        </h3>
        <p className="text-xs text-white/70 mt-0.5">{destination.country}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm border border-white/10 px-2 py-0.5 text-[10px] font-medium text-white/90"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
