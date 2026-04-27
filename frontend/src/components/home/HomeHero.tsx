import { Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const HomeHero = () => {
  const { displayName } = useAuth();
  const firstName = displayName ? displayName.split(" ")[0] : "User";

  return (
    <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Background Video directly */}
      <video 
        autoPlay 
        muted 
        loop 
        className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay animate-in zoom-in fill-mode-forwards ease-linear"
        style={{ animationDuration: "10000ms" }}
      >
        {/* Placeholder cinematic aerial footage */}
        <source src="https://cdn.pixabay.com/video/2022/01/18/104332-666324269_large.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#fafafa] z-0" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-4 text-center pb-20">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-xl mb-10 opacity-0" style={{ animation: "fade-in-up 1s ease-out forwards" }}>
          Hey {firstName}.<br/><span className="text-white/80">Where to next?</span>
        </h1>
        
        {/* Smart Search Bar */}
        <div 
           className="relative mx-auto max-w-2xl translate-y-8 opacity-0 group"
           style={{ animation: "slide-up-spring 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s forwards" }}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl transition duration-500 group-hover:bg-white/20" />
          <div className="relative flex items-center bg-white/95 rounded-2xl p-2 transition duration-300">
            <Search className="h-6 w-6 text-gray-500 ml-5 mr-3" />
            <input 
              type="text" 
              className="w-full bg-transparent border-none text-lg md:text-xl py-4 px-2 outline-none text-gray-900 placeholder:text-gray-400 font-medium"
              placeholder="10 days in Japan under ₹1.5L"
            />
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg py-4 px-8 rounded-xl hover:opacity-90 transition transform hover:scale-105 active:scale-95 shadow-md">
              Let's go
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up-spring {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
