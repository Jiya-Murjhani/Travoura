import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useRef } from 'react';
import { Star, Plane, Clock, ArrowRight } from 'lucide-react';

const HOTELS = [
  { name: 'Four Seasons Tokyo', stars: 5, price: '₹45,000/night', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
  { name: 'Aman Tokyo', stars: 5, price: '₹75,000/night', image: 'https://images.unsplash.com/photo-1542314831-c53cd3816002?auto=format&fit=crop&w=400&q=80' },
  { name: 'Park Hyatt', stars: 5, price: '₹22,000/night', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80' },
];

const FLIGHTS = [
  { airline: 'ANA', route: 'BOM → NRT', duration: '8h 15m', price: '₹42,000' },
  { airline: 'JAL', route: 'BOM → HND', duration: '8h 30m', price: '₹44,500' },
];

export const HotelFlightBookings = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollReveal(sectionRef, { threshold: 0.1 });

  return (
    <section ref={sectionRef} className="py-24 bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">The best seats are going fast</h2>
          <p className="text-gray-500 mt-2 font-medium">Curated bookings for your upcoming Japan trip.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 perspective-1000">
          
          {/* Left: Hotels */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Star className="h-5 w-5 text-gray-400" /> Top Stays in Tokyo
            </h3>
            <div className="space-y-4">
              {HOTELS.map((hotel, i) => (
                <div 
                  key={hotel.name}
                  className={`flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 transition-all duration-700 ease-out preserve-3d ${isVisible ? 'opacity-100 rotate-y-0' : 'opacity-0 rotate-y-90'}`}
                  style={{ transitionDelay: `${i * 150}ms`, transformStyle: 'preserve-3d' }}
                >
                  <img src={hotel.image} alt={hotel.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{hotel.name}</h4>
                    <div className="flex text-yellow-400 my-1">
                      {[...Array(hotel.stars)].map((_, j) => <Star key={j} className="h-3 w-3 fill-current" />)}
                    </div>
                    <p className="text-xs font-bold text-gray-500">{hotel.price}</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition-colors">
                    Book now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Flights */}
          <div className="space-y-6">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Plane className="h-5 w-5 text-gray-400" /> Flights from Mumbai
            </h3>
            <div className="space-y-4">
              {FLIGHTS.map((flight, i) => (
                <div 
                  key={i}
                  className={`flex flex-col bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  style={{ transitionDelay: `${i * 200 + 400}ms` }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">{flight.airline[0]}</div>
                      <p className="font-bold text-gray-900">{flight.airline}</p>
                    </div>
                    <p className="text-2xl font-black text-gray-900 tracking-tight highlight-flash">{flight.price}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium text-gray-500 border-t border-gray-50 pt-4">
                    <span>{flight.route}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {flight.duration}</span>
                  </div>
                  <button className="mt-4 w-full py-2.5 flex justify-center items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold rounded-xl transition-colors">
                    Check availability <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-0 { transform: rotateY(0deg); }
        .rotate-y-90 { transform: rotateY(90deg); }
        .preserve-3d { transform-style: preserve-3d; }
        
        @keyframes bg-flash {
          0% { background-color: #fef08a; }
          100% { background-color: transparent; }
        }
        .highlight-flash {
          animation: bg-flash 1s ease-out 1.2s forwards;
        }
      `}</style>
    </section>
  );
};
