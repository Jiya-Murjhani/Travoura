import { useCountUp } from '@/hooks/useCountUp';
import { useWishlist } from '@/hooks/useExplore';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { DestinationWithScore } from '@/types/explore';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useRef } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

interface ExploreStatsProps {
  recommendations: DestinationWithScore[];
}

export default function ExploreStats({ recommendations }: ExploreStatsProps) {
  const { session } = useAuth();
  const token = session?.access_token;
  const { data: wishlist } = useWishlist();
  
  const { data: trips } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      if (!token) return [];
      const res = await fetch(`${API_BASE}/trips`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : (data.trips || []);
    },
    enabled: !!token,
  });

  const tripCount = Array.isArray(trips) ? trips.length : 0;
  const wishlistCount = wishlist?.length || 0;
  
  const scoredRecs = recommendations.filter(r => r.matchScore !== null);
  const avgScore = scoredRecs.length > 0 
    ? Math.round(scoredRecs.reduce((sum, r) => sum + (r.matchScore || 0), 0) / scoredRecs.length)
    : 0;
    
  const totalDestinations = recommendations.length;

  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useScrollReveal(ref, { threshold: 0.5 });

  const animatedTrips = useCountUp(isVisible ? tripCount : 0, 1000);
  const animatedWishlist = useCountUp(isVisible ? wishlistCount : 0, 1000);
  const animatedScore = useCountUp(isVisible ? avgScore : 0, 1000);
  const animatedDestinations = useCountUp(isVisible ? totalDestinations : 0, 1000);

  return (
    <section className="px-10 py-12" ref={ref}>
      <div className="w-full bg-gray-900 rounded-2xl flex items-center overflow-hidden">
        
        <div className="flex-1 p-8 text-center border-r border-white/10">
          <p className="text-[32px] shadow-sm font-bold text-white leading-none mb-1">
            {animatedTrips}
          </p>
          <p className="text-[11px] uppercase tracking-widest text-white/40 font-semibold mt-2">
            Trips Taken
          </p>
        </div>

        <div className="flex-1 p-8 text-center border-r border-white/10">
          <p className="text-[32px] shadow-sm font-bold text-white leading-none mb-1">
            {animatedWishlist}
          </p>
          <p className="text-[11px] uppercase tracking-widest text-white/40 font-semibold mt-2">
            Saved Places
          </p>
        </div>

        <div className="flex-1 p-8 text-center border-r border-white/10">
          <p className="text-[32px] shadow-sm font-bold text-white leading-none mb-1">
             {animatedScore}{avgScore > 0 && isVisible ? '%' : ''}
          </p>
          <p className="text-[11px] uppercase tracking-widest text-white/40 font-semibold mt-2">
            Avg Match
          </p>
        </div>

        <div className="flex-1 p-8 text-center">
          <p className="text-[32px] shadow-sm font-bold text-white leading-none mb-1">
            {animatedDestinations}
          </p>
          <p className="text-[11px] uppercase tracking-widest text-white/40 font-semibold mt-2">
            Destinations
          </p>
        </div>

      </div>
    </section>
  );
}
