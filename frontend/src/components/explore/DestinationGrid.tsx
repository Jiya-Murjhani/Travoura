import { DestinationWithScore } from '@/types/explore';
import DestinationCard from './DestinationCard';
import { Skeleton } from '@/components/ui/skeleton';

interface DestinationGridProps {
  recommendations: DestinationWithScore[];
  wishlist: string[];
  activeFilter: string;
  activeMood: string | null;
  isLoading: boolean;
  isLoadingWishlist: boolean;
  onSelectDestination: (dest: DestinationWithScore) => void;
  onToggleSave?: (id: string) => void;
}

export default function DestinationGrid({
  recommendations,
  wishlist,
  activeFilter,
  activeMood,
  isLoading,
  onSelectDestination,
  onToggleSave,
}: DestinationGridProps) {
  // Filter destinations based on activeFilter and activeMood
  let filtered = recommendations;

  if (activeFilter && activeFilter !== 'all') {
    filtered = filtered.filter((d) =>
      d.tags?.some((t) => t.toLowerCase() === activeFilter.toLowerCase())
    );
  }

  if (activeMood) {
    filtered = filtered.filter((d) =>
      d.tags?.some((t) => t.toLowerCase() === activeMood.toLowerCase())
    );
  }

  const handleToggleSave = (id: string) => {
    onToggleSave?.(id);
  };

  if (isLoading) {
    return (
      <section className="px-6 pb-8">
        <div className="grid grid-cols-3 gap-3">
          {/* First skeleton spans 2 cols */}
          <Skeleton className="col-span-2 h-[320px] rounded-2xl" />
          <Skeleton className="h-[320px] rounded-2xl" />
          <Skeleton className="h-[220px] rounded-2xl" />
          <Skeleton className="h-[220px] rounded-2xl" />
          <Skeleton className="h-[220px] rounded-2xl" />
        </div>
      </section>
    );
  }

  if (filtered.length === 0) {
    return (
      <section className="px-6 pb-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-[#888]">No destinations match your current filters.</p>
          <p className="text-xs text-[#bbb] mt-1">Try adjusting your filters or mood selection.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 pb-8">
      <div className="grid grid-cols-3 gap-3">
        {filtered.map((dest, i) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            isSaved={wishlist.includes(dest.id)}
            onToggleSave={handleToggleSave}
            onClick={onSelectDestination}
            index={i}
            className={
              i === 0
                ? 'col-span-2 h-[320px]'
                : 'h-[220px]'
            }
          />
        ))}
      </div>
    </section>
  );
}
