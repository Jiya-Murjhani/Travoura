import { Compass, Cpu, Wallet, Globe } from 'lucide-react';

const ACTIONS = [
  { label: 'New Trip', icon: Compass, color: 'bg-blue-50 text-blue-600', groupClass: 'group-hover:rotate-180' },
  { label: 'AI Planner', icon: Cpu, color: 'bg-purple-50 text-purple-600', groupClass: 'group-hover:scale-110 group-hover:text-purple-700' },
  { label: 'Budget Tracker', icon: Wallet, color: 'bg-emerald-50 text-emerald-600', groupClass: 'group-hover:-translate-y-1' },
  { label: 'Explore Destinations', icon: Globe, color: 'bg-orange-50 text-orange-600', groupClass: 'group-hover:rotate-12' }
];

export const QuickActionsDock = () => {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Everything, one click away</h2>
        </div>

        <div className="custom-gradient-bg p-8 rounded-[2rem]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            {ACTIONS.map((action, i) => {
              const Icon = action.icon;
              return (
                <button 
                  key={action.label} 
                  className="group relative h-48 rounded-2xl bg-white shadow-sm border border-gray-100/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden"
                >
                  {/* Subtle illustration background placeholder mapped to radial gradients */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${action.color.split(' ')[0]} mix-blend-multiply`} />
                  
                  <div className={`relative z-10 h-16 w-16 rounded-2xl ${action.color} flex items-center justify-center transition-all duration-500 shadow-inner`}>
                    <Icon className={`h-8 w-8 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${action.groupClass}`} />
                  </div>
                  
                  <span className="relative z-10 font-bold text-gray-900 transition-colors group-hover:text-gray-900">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
      <style>{`
        .custom-gradient-bg {
          background-color: #fafafa;
          background-image: radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
                            radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
                            radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);
        }
      `}</style>
    </section>
  );
};
