import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { AlertTriangle, ShieldAlert, PlaneTakeoff, CheckCircle2 } from 'lucide-react';

export const AlertsTicker = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollReveal(scrollRef, { threshold: 0.5 });

  const alerts = [
    { type: 'weather', destination: 'Tokyo', summary: 'Heavy rain expected tomorrow.', icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />, color: 'border-yellow-200 bg-yellow-50', pulse: false },
    { type: 'safety', destination: 'Kyoto', summary: 'Transport strike advisory.', icon: <ShieldAlert className="h-5 w-5 text-orange-600 animate-pulse" />, color: 'border-orange-200 bg-orange-50', pulse: true },
    { type: 'flight', destination: 'Mumbai to NRT', summary: 'Flight delayed by 45 mins.', icon: <PlaneTakeoff className="h-5 w-5 text-blue-600" />, color: 'border-blue-200 bg-blue-50', pulse: false },
  ];

  return (
    <section ref={scrollRef} className="py-4 bg-white border-y border-gray-100 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />
      
      <div className="w-full flex">
        {/* Ticker animation container */}
        <div 
           className={`flex gap-4 whitespace-nowrap mx-4 items-center transition-opacity duration-1000 delay-100 ${isVisible ? 'opacity-100 slide-in-right' : 'opacity-0'}`}
           style={{ animation: isVisible ? 'ticker-slide 30s linear infinite' : 'none' }}
        >
          {/* We duplicate the maps so it loops infinitely in a real marquee if desired, but here we just showcase a slide-in for the spec */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-green-200 bg-green-50 shadow-sm shadow-green-100/50">
            <CheckCircle2 className="h-5 w-5 text-green-600 glow" />
            <span className="text-sm font-semibold text-green-800">All clear for your upcoming trips ✓</span>
          </div>

          {alerts.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-2 rounded-xl border shadow-sm ${a.color} ${a.pulse ? 'shadow-[0_0_0_2px_rgba(249,115,22,0.1)]' : ''}`}>
               {a.icon}
               <p className="text-sm font-bold text-gray-900">
                  {a.destination}: <span className="font-medium text-gray-600">{a.summary}</span>
               </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes ticker-slide {
          0% { transform: translateX(50%); }
          100% { transform: translateX(-150%); }
        }
      `}</style>
    </section>
  );
};
