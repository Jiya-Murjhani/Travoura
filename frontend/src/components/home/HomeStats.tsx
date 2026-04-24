import { Plane, Globe, Wallet, CalendarClock } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useRef } from 'react';

export const HomeStats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useScrollReveal(ref, { threshold: 0.1 });

  return (
    <div ref={ref} className="relative z-20 mx-auto max-w-6xl -mt-20 px-4 mb-20 pointer-events-none">
      <div 
        className={`pointer-events-auto flex flex-col md:flex-row bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100/50 overflow-hidden backdrop-blur-xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="flex-1 flex items-center gap-5 p-6 md:border-r border-gray-100">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
            <Plane className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-1">Trips Planned</p>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">5</p>
          </div>
        </div>
        
        <div className="flex-1 flex items-center gap-5 p-6 md:border-r border-gray-100">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-1">Countries Explored</p>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">3</p>
          </div>
        </div>
        
        <div className="flex-1 flex items-center gap-5 p-6 md:border-r border-gray-100">
          <div className="h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-1">Budget Tracked</p>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">₹2.45L</p>
          </div>
        </div>
        
        {/* Next Trip cell with active pulse styling */}
        <div className="flex-1 flex items-center gap-5 p-6 relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/80 to-rose-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner group-hover:scale-105 transition-transform">
            <CalendarClock className="h-6 w-6 animate-pulse" />
          </div>
          <div className="relative z-10">
            <p className="text-[11px] uppercase tracking-widest text-orange-500 font-bold mb-1">Next Trip</p>
            <p className="text-xl font-bold text-gray-900 leading-tight">Goa<br/><span className="font-semibold text-gray-500 text-sm">in 9 days</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
