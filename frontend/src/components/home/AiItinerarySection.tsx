import { Sparkles, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useRef } from 'react';

export const AiItinerarySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollReveal(containerRef, { threshold: 0.2 });

  const chips = [
    "Solo trip to Japan, 10 days",
    "Honeymoon in Europe under ₹3L",
    "Weekend getaway from Mumbai"
  ];

  return (
    <div className={`relative w-full py-28 overflow-hidden transition-colors duration-1000 ${isVisible ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div ref={containerRef} className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className={`space-y-8 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/80 text-sm font-bold tracking-wide">
              <Sparkles className="h-4 w-4 text-primary" /> TRAVOURA AI
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Tell us your dream.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">We'll plan the rest.</span>
            </h2>
            
            <div className="flex flex-col gap-3 pt-4">
              {chips.map((chip, i) => (
                <button 
                  key={i}
                  className="group flex flex-row items-center justify-between text-left w-full max-w-md p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white/90 text-sm md:text-base font-semibold"
                >
                  {chip}
                  <ArrowRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                </button>
              ))}
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
             {/* Abstract glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
             
             {/* Live Preview Card */}
             <div className="relative rounded-3xl border border-white/10 bg-[#1c1c1c]/60 backdrop-blur-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-white">10 Days in Japan</h3>
                    <p className="text-sm font-medium text-white/50 mt-1">Curated for you</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((day, idx) => (
                    <div 
                      key={day} 
                      className={`flex gap-4 items-start opacity-0 ${isVisible && 'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards'}`}
                      style={{ animationDelay: `${idx * 200 + 500}ms` }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="text-xs font-black text-primary uppercase tracking-widest mt-1">Day {day}</div>
                        <div className="w-px h-12 bg-white/10 mt-2" />
                      </div>
                      <div className="flex-1 rounded-2xl bg-white/5 p-4 border border-white/5 hover:bg-white/10 transition cursor-default">
                        <div className="h-3 w-1/3 bg-white/20 rounded mb-3" />
                        <div className="h-2 w-3/4 bg-white/10 rounded mb-2" />
                        <div className="h-2 w-1/2 bg-white/10 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
