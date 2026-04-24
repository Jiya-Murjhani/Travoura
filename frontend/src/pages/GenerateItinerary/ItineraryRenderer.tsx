import { useState } from "react";
import { 
  Sun, Clock, DollarSign, Calendar as CalendarIcon, Users, Wallet, Luggage, 
  Sparkles, Coffee, Utensils, Moon, ChevronDown, MapPin 
} from "lucide-react";
import { ItineraryResponse, SavedItinerary } from "@/types/itinerary";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { format } from "date-fns";

export default function ItineraryRenderer({ 
  itinerary, 
  onOpenRefine 
}: { 
  itinerary: SavedItinerary | ItineraryResponse, 
  onOpenRefine: () => void 
}) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sightseeing": return "bg-blue-100 text-blue-700";
      case "food": return "bg-orange-100 text-orange-700";
      case "adventure": return "bg-green-100 text-green-700";
      case "leisure": return "bg-purple-100 text-purple-700";
      case "culture": return "bg-pink-100 text-pink-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getMealIcon = (type: string) => {
    if (type === "breakfast") return <Coffee className="w-4 h-4 text-gray-500" />;
    if (type === "lunch") return <Utensils className="w-4 h-4 text-gray-500" />;
    return <Moon className="w-4 h-4 text-gray-500" />;
  };

  // Unwrap nested AI data from the Supabase row
  const data = (itinerary as SavedItinerary).itinerary_data ?? 
               (itinerary as any).itinerary ?? itinerary;

  // Safe checks if it's a SavedItinerary vs standard response
  const isSaved = "trip_id" in itinerary;
  console.log('itinerary object:', JSON.stringify(itinerary, null, 2));
  console.log('data object:', JSON.stringify(data, null, 2));
  const startDate = isSaved ? (itinerary as SavedItinerary).start_date : null;
  const endDate = isSaved ? (itinerary as SavedItinerary).end_date : null;
  const reqData = isSaved ? (itinerary as SavedItinerary).request_data : null;

  return (
    <div className="pb-24 max-w-[680px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* ── Header Section ── */}
      <div className="py-6 px-6 space-y-5 border-b border-gray-100 bg-white">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          {itinerary.destination}
        </h2>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {startDate && endDate && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
              <CalendarIcon className="w-3 h-3" />
              {format(new Date(startDate), "MMM d")} - {format(new Date(endDate), "MMM d")}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            {itinerary.total_days} Days
          </span>
          {reqData && (
             <>
               <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase">
                 <Users className="w-3 h-3" /> {reqData.traveler_type}
               </span>
               <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase">
                 <Wallet className="w-3 h-3" /> {reqData.budget_level}
               </span>
             </>
          )}
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          {data.summary}
        </p>

        {/* Weather Note */}
        {data.weather_note && (
          <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <Sun className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <p className="text-sm text-indigo-700">
              {data.weather_note}
            </p>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <CalendarIcon className="w-5 h-5 text-indigo-500 mb-2" />
            <div className="text-xs text-gray-500 font-medium tracking-wide uppercase mb-1">Best Time</div>
            <div className="font-bold text-gray-900 text-sm">{data.best_time_to_visit}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <DollarSign className="w-5 h-5 text-indigo-500 mb-2" />
            <div className="text-xs text-gray-500 font-medium tracking-wide uppercase mb-1">Est Budget</div>
            <div className="font-bold text-gray-900 text-sm">{data.estimated_total_budget}</div>
          </div>
        </div>
      </div>

      {/* ── Day-wise Timeline ── */}
      <div className="px-6 py-6 space-y-8">
        {(data?.days ?? []).map((day) => (
          <div key={day.day_number} className="space-y-4">
            {/* Day Header */}
            <div className="border-l-4 border-indigo-500 pl-4 py-1">
              <div className="text-indigo-600 font-bold text-sm uppercase tracking-wide">
                Day {day.day_number}
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mt-0.5">
                {day.theme}
              </h3>
            </div>

            {/* Activities Vertical Timeline */}
            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2 before:w-px before:bg-gray-200">
              {day.activities.map((activity, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <span className="absolute -left-[21px] top-4 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-white" />
                  
                  {/* Activity Card */}
                  <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full px-2 py-0.5">
                        {activity.time}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 ${getCategoryColor(activity.category)}`}>
                        {activity.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-gray-900 mb-1">{activity.name}</h4>
                    <p className="text-gray-500 text-sm mb-3 leading-relaxed">{activity.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {activity.duration_minutes} mins
                      </span>
                      {activity.estimated_cost_usd && (
                        <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                          <DollarSign className="w-3.5 h-3.5" />
                          ${activity.estimated_cost_usd}
                        </span>
                      )}
                    </div>

                    {/* Pro Tip Collapsible */}
                    {activity.tips && (
                      <Collapsible className="mt-3 border-t border-gray-100 pt-3">
                        <CollapsibleTrigger className="flex items-center justify-between w-full text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                          <span className="flex items-center gap-1"><Sparkles className="w-3 h-3"/> 💡 Pro tip</span>
                          <ChevronDown className="w-3 h-3" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="text-sm text-indigo-700 bg-indigo-50 rounded-lg p-3 mt-2">
                          {activity.tips}
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Meals Section */}
            {day.meals && day.meals.length > 0 && (
              <div className="grid gap-2 pl-6 pt-2">
                {day.meals.map((meal, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      {getMealIcon(meal.type)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">{meal.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="capitalize">{meal.type}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{meal.cuisine}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="font-medium text-gray-700">{meal.price_range}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        ))}
      </div>

      {/* ── Packing Tips ── */}
      {data.packing_tips && data.packing_tips.length > 0 && (
        <div className="px-6 py-6 border-t border-gray-100">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Luggage className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">Packing Tips</h3>
            </div>
            <ul className="space-y-2">
              {data.packing_tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── Sticky Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-100 p-4 z-10 w-full shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-[680px] mx-auto">
          <button
            onClick={onOpenRefine}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3.5 font-bold shadow-sm transition-all duration-150 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> ✨ Refine with AI
          </button>
        </div>
      </div>
    </div>
  );
}
