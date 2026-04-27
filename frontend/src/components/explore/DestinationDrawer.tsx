import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, Plane, DollarSign, Star, Shield } from 'lucide-react';
import { DestinationWithScore } from '@/types/explore';
import SeasonalStrip from './SeasonalStrip';

interface DestinationDrawerProps {
  destination: DestinationWithScore | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export default function DestinationDrawer({
  destination,
  onClose,
  isSaved,
  onToggleSave,
}: DestinationDrawerProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Animate in when destination is set
  useEffect(() => {
    if (destination) {
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => setIsOpen(true));
    } else {
      setIsOpen(false);
    }
  }, [destination]);

  const handleClose = () => {
    setIsOpen(false);
    // Wait for animation to finish before unmounting
    setTimeout(() => onClose(), 320);
  };

  if (!destination) return null;

  const visaLabels: Record<string, { label: string; color: string }> = {
    easy: { label: 'Easy', color: 'text-emerald-600' },
    moderate: { label: 'Moderate', color: 'text-amber-600' },
    complex: { label: 'Complex', color: 'text-red-500' },
  };

  const visa = visaLabels[destination.visaComplexity] ?? visaLabels.moderate;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? 'bg-black/30' : 'bg-black/0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[480px] max-w-full bg-white shadow-2xl overflow-y-auto transition-transform`}
        style={{
          transitionDuration: "320ms",
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Sticky top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-white/95 backdrop-blur-sm border-b border-black/[0.06] px-5 py-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-150"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          <button
            type="button"
            onClick={() => onToggleSave(destination.id)}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-2 text-xs font-medium transition-colors duration-150 hover:border-gray-300"
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                isSaved ? 'fill-red-500 text-red-500' : 'text-gray-500'
              }`}
            />
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Hero image */}
        <div className="h-64 w-full overflow-hidden bg-gray-100">
          <img
            src={destination.heroImageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Name + country */}
          <div>
            <h2 className="text-[28px] font-bold text-gray-900 leading-tight">
              {destination.name}
            </h2>
            <p className="text-sm text-gray-400 mt-1">{destination.country}</p>
          </div>

          {/* AI caption */}
          {destination.aiCaption && (
            <blockquote className="border-l-2 border-gray-200 pl-3 text-[15px] italic text-gray-500 leading-relaxed">
              {destination.aiCaption}
            </blockquote>
          )}

          {/* Stat row */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-xl bg-gray-50">
              <Plane className="h-4 w-4 mx-auto text-gray-400 mb-1.5" />
              <p className="text-[11px] text-gray-400 font-medium">Flights</p>
              <p className="text-xs font-semibold text-gray-700 mt-0.5">—</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50">
              <DollarSign className="h-4 w-4 mx-auto text-gray-400 mb-1.5" />
              <p className="text-[11px] text-gray-400 font-medium">Avg Cost</p>
              <p className="text-xs font-semibold text-gray-700 mt-0.5">
                ${destination.avgCostPerDayUsd}/day
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50">
              <Star className="h-4 w-4 mx-auto text-gray-400 mb-1.5" />
              <p className="text-[11px] text-gray-400 font-medium">Rating</p>
              <p className="text-xs font-semibold text-gray-700 mt-0.5">
                {destination.rating} ★
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50">
              <Shield className="h-4 w-4 mx-auto text-gray-400 mb-1.5" />
              <p className="text-[11px] text-gray-400 font-medium">Visa</p>
              <p className={`text-xs font-semibold mt-0.5 ${visa.color}`}>
                {visa.label}
              </p>
            </div>
          </div>

          {/* Seasonal strip */}
          <SeasonalStrip
            destinationId={destination.id}
            destinationName={destination.name}
          />

          {/* CTA */}
          <button
            type="button"
            onClick={() =>
              navigate('/generate-itinerary', {
                state: { destination: destination.name },
              })
            }
            className="w-full rounded-xl bg-gray-900 py-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.98]"
          >
            Plan a trip here →
          </button>
        </div>
      </div>
    </>
  );
}
