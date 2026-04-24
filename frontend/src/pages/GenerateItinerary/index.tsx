import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2, CheckCircle } from "lucide-react";
import useItinerary from "@/hooks/useItinerary";
import ItineraryForm from "./ItineraryForm";
import ItineraryRenderer from "./ItineraryRenderer";
import RefinementChat from "./RefinementChat";
import { ItineraryRequest } from "@/types/itinerary";
import { Button } from "@/components/ui/button";

type ViewState = "form" | "loading" | "result";

export default function GenerateItineraryWrapper() {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const { itinerary, isGenerating, generate } = useItinerary();
  const [view, setView] = useState<ViewState>("form");
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [destination, setDestination] = useState<string>("");
  const [loadingSeconds, setLoadingSeconds] = useState(0);

  const loadingMessages = [
    "✈️ Planning your perfect trip...",
    "🗺️ Researching top attractions...",
    "🍜 Finding the best local food...",
    "🌤️ Checking weather and best times...",
    "📅 Building your day-by-day schedule...",
    "✨ Adding insider tips and hidden gems...",
  ];

  useEffect(() => {
    if (isGenerating) {
      setView("loading");
      setLoadingSeconds(0);
      const messageInterval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
      const secondsInterval = setInterval(() => {
        setLoadingSeconds((prev) => prev + 1);
      }, 1000);
      return () => {
        clearInterval(messageInterval);
        clearInterval(secondsInterval);
      };
    } else if (itinerary) {
      setView("result");
    } else if (!isGenerating && !itinerary && view === "loading") {
      setView("form");
    }
  }, [isGenerating, itinerary, view, loadingMessages.length]);

  const handleGenerate = async (request: ItineraryRequest) => {
    setDestination(request.destination);
    await generate({ ...request, trip_id: tripId });
    // Don't redirect - let the useEffect handle the view state change
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-28 md:pb-10 relative">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100 flex-shrink-0">
        <div className="max-w-[680px] mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-gray-900">AI Itinerary Generator</h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Powered by AI
            </span>
          </div>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col">
        {view === "form" && <ItineraryForm onSubmit={handleGenerate} />}
        
        {view === "loading" && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-in fade-in zoom-in duration-500">
            {/* Destination Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Creating your {destination} itinerary
            </h2>

            {/* Animated Progress Bar */}
            <div className="w-full max-w-xs mb-8">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full"
                  style={{
                    animation: "progress 30s ease-in-out forwards",
                    width: `${Math.min((loadingSeconds / 30) * 100, 100)}%`,
                  }}
                />
              </div>
              <style>{`
                @keyframes progress {
                  0% { width: 0%; }
                  50% { width: 80%; }
                  100% { width: 100%; }
                }
              `}</style>
            </div>

            {/* Spinning loader */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-white p-4 rounded-full shadow-sm border border-gray-100">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              </div>
            </div>

            {/* Loading message with smooth transition */}
            <h3 className="text-lg font-semibold text-gray-900 transition-opacity duration-300 min-h-7">
              {loadingMessages[loadingTextIndex]}
            </h3>
            <p className="text-sm text-gray-500 mt-3">This usually takes 15–30 seconds</p>

            {/* Extended wait message */}
            {loadingSeconds > 60 && (
              <p className="text-sm text-amber-600 mt-4 animate-pulse">
                Still working... this trip is extra special 🌟
              </p>
            )}
          </div>
        )}

        {view === "result" && itinerary && (
          <div className="flex-1 flex flex-col">
            {/* Success Banner */}
            <div className="bg-green-50 border-b border-green-200 px-6 py-4">
              <div className="max-w-[680px] mx-auto flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900">✅ Itinerary saved to your trip!</p>
                </div>
                {tripId && (
                  <Button
                    onClick={() => navigate(`/trip/${tripId}`)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Trip
                  </Button>
                )}
              </div>
            </div>

            {/* Itinerary Renderer */}
            <div className="flex-1">
              <ItineraryRenderer itinerary={itinerary} onOpenRefine={() => setIsChatOpen(true)} />
            </div>

            {/* Refinement Chat */}
            <RefinementChat open={isChatOpen} onOpenChange={setIsChatOpen} />
          </div>
        )}
      </main>
    </div>
  );
}
