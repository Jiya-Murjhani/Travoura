import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const PREVIEWS = [
  {
    title: 'Neon & Kyoto Calling',
    caption: 'Experience the hyper-modern streets of Tokyo and the ancient temples of Kyoto.',
    durationDays: 10,
    stops: ['Tokyo', 'Kyoto'],
    estimatedCostINR: '92,000',
    thumbImageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    region: 'East Asia',
  },
  {
    title: 'The Tropical Circuit',
    caption: 'Island hopping from the busy markets of Bangkok to the spiritual calm of Bali.',
    durationDays: 14,
    stops: ['Bangkok', 'Bali'],
    estimatedCostINR: '1,10,000',
    thumbImageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80',
    region: 'Southeast Asia',
  },
  {
    title: 'La Dolce Vita',
    caption: 'A sun-drenched road trip through southern Italy, from the Colosseum to the coast.',
    durationDays: 8,
    stops: ['Rome', 'Puglia'],
    estimatedCostINR: '1,35,000',
    thumbImageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    region: 'Europe',
  },
];

export default function ItineraryPreviews() {
  const navigate = useNavigate();

  return (
    <section className="px-10 py-12">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 mb-1">
          AI-built itineraries
        </p>
        <h2 className="text-[22px] font-bold text-gray-900">Packed. Planned. Perfected.</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {PREVIEWS.map((preview) => (
          <div
            key={preview.title}
            className="group rounded-2xl border border-black/[0.07] bg-white overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-200 flex flex-col"
            onClick={() => navigate('/generate-itinerary', { state: { destination: preview.stops[0] } })}
          >
            {/* Thumbnail */}
            <div className="relative h-36 w-full overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={preview.thumbImageUrl}
                alt={preview.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
              
              <div className="absolute top-2 left-2">
                 <span className="inline-flex rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-gray-900">
                   {preview.durationDays} DAYS
                 </span>
              </div>
              <div className="absolute top-2 right-2">
                 <span className="inline-flex items-center gap-1 rounded-full bg-gray-900/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                   <Sparkles className="w-3 h-3 text-indigo-400" />
                   AI planned
                 </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-[15px] font-bold text-gray-900 mb-1 leading-tight">
                {preview.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                {preview.caption}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                 {preview.stops.map(stop => (
                   <Badge key={stop} variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                     {stop}
                   </Badge>
                 ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                 <div>
                   <p className="text-[10px] font-medium text-gray-400 leading-tight">Est. cost</p>
                   <p className="text-sm font-bold text-gray-900 leading-tight">₹{preview.estimatedCostINR}</p>
                 </div>
                 <span className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                   Customise →
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
