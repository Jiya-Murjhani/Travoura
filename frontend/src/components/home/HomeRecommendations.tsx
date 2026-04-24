import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ArrowRight, Star } from 'lucide-react';

const RECOMMENDATIONS = [
  {
    title: "Kasol, Himachal Pradesh",
    reason: "You loved mountains in Manali",
    budget: "₹5,500/day",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    topPick: true
  },
  {
    title: "Gokarna, Karnataka",
    reason: "Perfect for a peaceful coastline",
    budget: "₹4,200/day",
    image: "https://images.unsplash.com/photo-1590235331614-239d564fa7d6?auto=format&fit=crop&w=800&q=80",
    topPick: false
  },
  {
    title: "Tirthan Valley, Himachal",
    reason: "Offbeat and tranquil riverside",
    budget: "₹3,800/day",
    image: "https://images.unsplash.com/photo-1605649487212-4d4ce3837242?auto=format&fit=crop&w=800&q=80",
    topPick: false
  },
  {
    title: "Udaipur, Rajasthan",
    reason: "Match for heritage & culture",
    budget: "₹6,000/day",
    image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80",
    topPick: false
  }
];

export const HomeRecommendations = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollReveal(scrollRef, { threshold: 0.1 });

  return (
    <section className="py-24 bg-[#FAFAFA] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6 mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Picked for you</h2>
        <p className="text-gray-500 mt-2 font-medium">Personalised destinations based on your travel history.</p>
      </div>

      <div 
        ref={scrollRef} 
        className="w-full overflow-x-auto pb-12 pt-4 px-4 md:px-6 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex gap-6 mx-auto max-w-7xl">
          {RECOMMENDATIONS.map((rec, idx) => (
            <div 
              key={idx}
              className={`group relative flex-none w-[280px] md:w-[320px] h-[400px] md:h-[440px] rounded-3xl overflow-hidden shadow-xl cursor-pointer bg-white transition-all duration-[1200ms] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'}`}
              style={{ scrollSnapAlign: 'start', transitionDelay: `${idx * 150}ms` }}
            >
              <div className="absolute inset-0 overflow-hidden bg-gray-200">
                <img 
                  src={rec.image} 
                  alt={rec.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {rec.topPick && (
                <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold uppercase tracking-wider">
                  <Star className="h-3.5 w-3.5 fill-current" /> Top Pick This Week
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end translate-y-12 transition-transform duration-500 group-hover:translate-y-0">
                <div className="transition-transform duration-500">
                  <h3 className="text-2xl font-bold text-white mb-2">{rec.title}</h3>
                  <div className="w-8 h-1 bg-primary rounded-full mb-3" />
                  <p className="text-sm font-medium text-white/80 mb-1">{rec.reason}</p>
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider">{rec.budget}</p>
                </div>
                
                {/* CTA sliding up on hover */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <button className="flex items-center gap-2 text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-xl text-sm font-bold w-full justify-center transition-colors">
                    Plan this trip <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
