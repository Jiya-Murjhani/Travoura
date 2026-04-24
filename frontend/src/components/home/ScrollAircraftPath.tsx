import { useEffect, useRef, useState } from 'react';
import { Plane } from 'lucide-react';

export const ScrollAircraftPath = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [point, setPoint] = useState({ x: 0, y: 350 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !pathRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate progress 0 to 1 as container crosses viewport
      let progress = 0;
      if (rect.top <= viewportHeight && rect.bottom >= 0) {
        const totalDist = viewportHeight + rect.height;
        const currentDist = viewportHeight - rect.top;
        progress = Math.max(0, Math.min(1, currentDist / totalDist));
      } else if (rect.bottom < 0) {
        progress = 1;
      }

      const totalLength = pathRef.current.getTotalLength();
      if (!totalLength) return;
      
      const currentPoint = pathRef.current.getPointAtLength(Math.min(totalLength, Math.max(0, progress * totalLength)));
      
      // Small delta to calculate rotation tangent
      const nextPoint = pathRef.current.getPointAtLength(Math.min(totalLength, (progress * totalLength) + 2));
      
      const angle = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x) * (180 / Math.PI);
      
      setPoint({ x: currentPoint.x, y: currentPoint.y });
      setRotation(angle);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative h-[60vh] min-h-[400px] w-full bg-[#f8fafc] overflow-hidden flex items-center justify-center border-y border-gray-100">
      {/* Subtle Map Background using a light grid and radial blend for depth */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '16px 16px' }} 
      />
      
      <div className="relative w-full max-w-6xl h-full flex items-center px-4">
        <svg viewBox="0 0 1000 400" className="w-full h-full preserve-3d overflow-visible opacity-80" preserveAspectRatio="xMidYMid meet">
          {/* Dashed trail */}
          <path 
            ref={pathRef}
            d="M 50,350 Q 300,350 500,200 T 950,50" 
            fill="none" 
            stroke="#cbd5e1" 
            strokeWidth="3" 
            strokeDasharray="10 10" 
            strokeLinecap="round"
          />
          {/* Aircraft */}
          <g transform={`translate(${point.x}, ${point.y}) rotate(${rotation})`} className="transition-transform duration-75 ease-out">
            <circle cx="0" cy="0" r="28" fill="white" className="drop-shadow-xl" />
            <Plane className="h-8 w-8 text-blue-600 -translate-x-4 -translate-y-4 rotate-45" />
          </g>
        </svg>
      </div>
    </div>
  );
};
