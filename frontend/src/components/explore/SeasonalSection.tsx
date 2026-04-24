import SeasonalStrip from './SeasonalStrip';
import { DestinationWithScore } from '@/types/explore';

interface SeasonalSectionProps {
  selectedDestination?: DestinationWithScore | null;
  recommendations: DestinationWithScore[];
}

export default function SeasonalSection({ recommendations }: SeasonalSectionProps) {
  // Take top two recommended destinations
  const topTwo = recommendations.slice(0, 2);

  if (topTwo.length === 0) return null;

  return (
    <section className="px-10 py-12">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 mb-1">
          When to visit
        </p>
        <h2 className="text-[22px] font-bold text-gray-900">Your top matches across the year</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {topTwo.map((dest) => (
          <SeasonalStrip
            key={dest.id}
            destinationId={dest.id}
            destinationName={dest.name}
          />
        ))}
      </div>
    </section>
  );
}
