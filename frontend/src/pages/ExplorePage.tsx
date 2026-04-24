import { useState } from 'react';
import { useRecommended, useWishlist, useToggleWishlist } from '@/hooks/useExplore';
import { useAuth } from '@/contexts/AuthContext';
import { DestinationWithScore } from '@/types/explore';
import ExploreHero from '@/components/explore/ExploreHero';
import AIMatchBanner from '@/components/explore/AIMatchBanner';
import FilterBar from '@/components/explore/FilterBar';
import DestinationGrid from '@/components/explore/DestinationGrid';
import MoodFilter from '@/components/explore/MoodFilter';
import ItineraryPreviews from '@/components/explore/ItineraryPreviews';
import SeasonalSection from '@/components/explore/SeasonalSection';
import ExploreStats from '@/components/explore/ExploreStats';
import RevealOnScroll from '@/components/explore/RevealOnScroll';
import DestinationDrawer from '@/components/explore/DestinationDrawer';

export default function ExplorePage() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.first_name || user?.user_metadata?.full_name || '';

  const { data: recommendations, isLoading: isLoadingRecs } = useRecommended();
  const { data: wishlist, isLoading: isLoadingWishlist } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<DestinationWithScore | null>(null);

  const handleToggleSave = (destId: string) => {
    const isSaved = (wishlist ?? []).includes(destId);
    toggleWishlist.mutate({ destinationId: destId, saved: isSaved });
  };

  const recs = recommendations ?? [];
  const matchedRecs = recs.filter((r) => r.matchScore !== null);
  const displayCount = matchedRecs.length > 0 ? matchedRecs.length : recs.length;

  return (
    <div className="min-h-screen bg-[#f5f4f0] pb-24 relative">
      <ExploreHero userName={userName} matchCount={displayCount} />

      <RevealOnScroll>
        <AIMatchBanner />
      </RevealOnScroll>

      <RevealOnScroll>
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </RevealOnScroll>

      <div data-explore-grid>
        <RevealOnScroll>
          <DestinationGrid
            recommendations={recs}
            wishlist={wishlist ?? []}
            activeFilter={activeFilter}
            activeMood={activeMood}
            isLoading={isLoadingRecs}
            isLoadingWishlist={isLoadingWishlist}
            onSelectDestination={setSelectedDestination}
            onToggleSave={handleToggleSave}
          />
        </RevealOnScroll>
      </div>

      <RevealOnScroll>
        <MoodFilter activeMood={activeMood} onMoodChange={setActiveMood} />
      </RevealOnScroll>

      <RevealOnScroll>
        <ItineraryPreviews />
      </RevealOnScroll>

      <RevealOnScroll>
        <SeasonalSection recommendations={recs} />
      </RevealOnScroll>

      <RevealOnScroll>
        <ExploreStats recommendations={recs} />
      </RevealOnScroll>

      {/* Slide-out drawer for destination details */}
      <DestinationDrawer
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        isSaved={selectedDestination ? (wishlist ?? []).includes(selectedDestination.id) : false}
        onToggleSave={handleToggleSave}
      />
    </div>
  );
}
