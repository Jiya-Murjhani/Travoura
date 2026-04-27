import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { PlaneLanding, MapPin, Map } from 'lucide-react';

const TRIPS = [
  { dest: 'Bali, Indonesia', date: 'Jul 2025', status: 'Planning', icon: Map, rotate: '-rotate-2', color: 'text-purple-600', bg: 'bg-purple-50' },
  { dest: 'Goa, India', date: 'Sep 2025', status: 'Confirmed', icon: PlaneLanding, rotate: 'rotate-3', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { dest: 'Dubai, UAE', date: 'Dec 2024', status: 'Completed', icon: MapPin, rotate: '-rotate-3', color: 'text-gray-400', bg: 'bg-gray-100', grayscale: true },
];

export const PassportTimeline = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollReveal(scrollRef, { threshold: 0.2 });

  return (
    <section ref={scrollRef} className="py-32 bg-[#FAFAFA] relative overflow-hidden">
      
      {/* Aesthetic Passport pages background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

      <div className="mx-auto max-w-4xl px-4 md:px-6 text-center relative z-10">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-16">Your travel story</h2>
        
        <div className="relative border-l-2 border-dashed border-gray-300 ml-6 md:ml-1/2 md:border-l-0 md:before:absolute md:before:inset-y-0 md:before:left-1/2 md:before:w-0.5 md:before:bg-gray-300 md:before:border-dashed md:before:border-l-2 py-8 space-y-12">
          
          {TRIPS.map((trip, i) => {
             const isEven = i % 2 === 0;
             return (
               <div key={i} className={`relative flex items-center ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-end w-full`}>
                 
                 {/* Timeline dot */}
                 <div className="absolute left-[-5px] md:left-1/2 md:-ml-[5px] w-3 h-3 rounded-full bg-gray-300 border-2 border-white shadow-sm" />
                 
                 {/* The Stamp Card */}
                 <div 
                   className={`w-[85%] md:w-[40%] transition-all ${isVisible ? `opacity-100 ${trip.rotate} translate-y-0` : 'opacity-0 translate-y-12 rotate-[-10deg]'}`}
                   style={{ transitionDuration: "800ms", transitionTimingFunction: "cubic-bezier(0.175,0.885,0.32,1.275)", transitionDelay: `${i * 200}ms` }}
                 >
                   <div className={`p-6 bg-white rounded-2xl shadow-lg border border-gray-100 text-left ${trip.grayscale ? 'grayscale opacity-75' : ''}`}>
                     <div className="flex justify-between items-start mb-4">
                       <div className={`h-12 w-12 rounded-full ${trip.bg} ${trip.color} flex items-center justify-center border-2 border-white shadow-sm`}>
                         <trip.icon className="h-5 w-5" />
                       </div>
                       <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${trip.status === 'Completed' ? 'bg-gray-100 text-gray-500' : trip.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'} `}>
                         {trip.status}
                       </span>
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 stamp-font">{trip.dest}</h3>
                     <p className="text-sm font-semibold text-gray-500 mt-1">{trip.date}</p>
                   </div>
                 </div>
               </div>
             )
          })}
        </div>

      </div>
      <style>{`
        .stamp-font { font-family: 'Courier New', Courier, monospace; letter-spacing: -0.05em; font-weight: 800; }
      `}</style>
    </section>
  );
};
