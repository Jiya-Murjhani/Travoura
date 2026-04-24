import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowRight } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

const BUDGET_DATA = [
  { name: 'Flights', value: 45000, color: '#3b82f6' },
  { name: 'Hotels', value: 32000, color: '#8b5cf6' },
  { name: 'Food', value: 15000, color: '#10b981' },
  { name: 'Activities', value: 12000, color: '#f59e0b' },
];

const TOTAL_BUDGET = 120000;
const SPENT = 104000;

export const HomeBudgetTeaser = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollReveal(containerRef, { threshold: 0.3 });
  
  // Animate the money numbers only when visible
  const spentAnim = useCountUp(isVisible ? SPENT : 0, 1500);
  const remainingAnim = useCountUp(isVisible ? TOTAL_BUDGET - SPENT : 0, 1500);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative BG element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div ref={containerRef} className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Your money, travelling smart</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Bali Honeymoon
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500">Amount Spent</p>
                <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  ₹{spentAnim.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500">Remaining</p>
                <p className="text-4xl font-extrabold text-emerald-600 tracking-tight">
                  ₹{remainingAnim.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors group">
              View full budget 
              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className={`relative h-[350px] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={BUDGET_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={4}
                  dataKey="value"
                  isAnimationActive={isVisible}
                  animationBegin={200}
                  animationDuration={1500}
                  stroke="none"
                  cornerRadius={10}
                >
                  {BUDGET_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend / Hover effect overlay (static visual implementation) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Budget<br/><span className="text-2xl text-gray-900 font-extrabold">₹1.2L</span></p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
